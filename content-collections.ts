import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'
import { regex } from 'arkregex'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkBreaks from 'remark-breaks'
import remarkEmoji from 'remark-emoji'
import remarkGemoji from 'remark-gemoji'
import remarkToc from 'remark-toc'
import remarkNormalizeHeadings from 'remark-normalize-headings'
import remarkSqueezeparagraphs from 'remark-squeeze-paragraphs'
import remarkFlexibleContainers from 'remark-flexible-containers'
import remarkFlexibleCodeTitles from 'remark-flexible-code-titles'
import remarkDefinitionList from 'remark-definition-list'
// @ts-expect-error — no type declarations for remark-heading-id
import remarkHeadingId from 'remark-heading-id'
import remarkGithubBlockquoteAlert from 'remark-github-blockquote-alert'
import remarkSmartypants from 'remark-smartypants'
import remarkIns from 'remark-ins'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import type { Element } from 'hast'
import type { Root, Text, Parent } from 'mdast'
import type { Plugin } from 'unified'

// ── Types ─────────────────────────────────────────────────────────────────────

export type MarkdownHeading = {
  id: string
  text: string
  level: number
}

// ── Quartz path helpers ────────────────────────────────────────────────────────

function sluggify(s: string): string {
  return s
    .split('/')
    .map((seg) =>
      seg
        .replace(/\s/g, '-')
        .replace(/&/g, '-and-')
        .replace(/%/g, '-percent')
        .replace(/\?/g, '')
        .replace(/#/g, ''),
    )
    .join('/')
    .replace(/\/$/, '')
}

function stripSlashes(s: string, onlyPrefix = false): string {
  if (s.startsWith('/')) s = s.substring(1)
  if (!onlyPrefix && s.endsWith('/')) s = s.slice(0, -1)
  return s
}

function endsWith(s: string, suffix: string): boolean {
  return s === suffix || s.endsWith('/' + suffix)
}

function trimSuffix(s: string, suffix: string): string {
  if (endsWith(s, suffix)) s = s.slice(0, -suffix.length)
  return s
}

function slugifyFilePath(fp: string): string {
  fp = stripSlashes(fp)
  const withoutExt = fp.replace(/\.md$/, '')
  let slug = sluggify(withoutExt)
  if (endsWith(slug, '_index')) slug = slug.replace(/_index$/, 'index')
  return slug
}

function simplifySlug(fp: string): string {
  const res = stripSlashes(trimSuffix(fp, 'index'), true)
  return res.length === 0 ? '/' : res
}

function fileNameToSlug(name: string): string {
  return simplifySlug(slugifyFilePath(name + '.md'))
}

function deriveSlug(filePath: string): string {
  const withoutExt = filePath.replace(/\.md$/, '')
  const parts = withoutExt.split('/')

  if (parts.length === 1) {
    const name = parts[0]
    if (name.toLowerCase() === 'index') return 'overview'
    return `overview/${fileNameToSlug(name)}`
  }

  const [dir, ...rest] = parts
  const dirSlug = fileNameToSlug(dir)
  const fileName = rest.join('/')

  if (fileName.toLowerCase() === 'index') return dirSlug
  return `${dirSlug}/${fileNameToSlug(fileName)}`
}

function deriveSectionName(filePath: string): string {
  const parts = filePath.split('/')
  if (parts.length === 1) return 'Overview'
  return parts[0]
}

// ── Wikilink extraction (for rawLinks / backlink graph) ───────────────────────

const wikilinkExtractRegex = /!?\[\[([^\]|#]+?)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g

function extractWikilinks(content: string): string[] {
  const fps: string[] = []
  wikilinkExtractRegex.lastIndex = 0
  for (const m of content.matchAll(wikilinkExtractRegex)) {
    const fp = m[1]?.trim()
    if (fp) fps.push(fp)
  }
  return fps
}

// ── Wikilink slug resolution (Quartz "shortest" strategy) ─────────────────────

type SlugStub = { slug: string }

function resolveWikilink(rawFp: string, allFiles: SlugStub[]): string | null {
  const fp = rawFp.trim()
  if (!fp) return null

  const targetFull = slugifyFilePath((fp + '.md') as string)
  const targetSimple = simplifySlug(targetFull)
  const targetCanonical = stripSlashes(targetSimple, true)

  const matches = allFiles.filter((f) => {
    const last = f.slug.split('/').at(-1) ?? f.slug
    return last === (targetCanonical.split('/').at(-1) ?? targetCanonical)
  })
  if (matches.length === 1) return matches[0].slug

  return allFiles.find((f) => f.slug === targetCanonical)?.slug ?? null
}

// ── remarkWikilinks plugin ────────────────────────────────────────────────────
// Emits <span data-wikilink="{slug}"> for resolved links
// and <span data-wikilink-broken="true"> for unresolved ones.
// html-react-parser in Markdown.tsx converts these to TanStack <Link>.

// Typed named captures via arkregex
// regex.as<> provides explicit types where TS inference would exceed complexity limits
const wikilinkPattern = regex.as<
  string,
  { names: { target: string; alias: string | undefined } }
>(
  '!?\\[\\[(?<target>[^\\]|#\\\\]+?)(?:\\\\?\\|(?<alias>[^\\]]+))?\\]\\]',
  'g',
)

function remarkWikilinks(resolveSlug: (raw: string) => string | null): Plugin<[], Root> {
  return () => (tree: Root) => {
    visit(tree, 'text', (node: Text, index: number | undefined, parent: Parent | undefined) => {
      if (index === undefined || !parent) return

      const text = node.value
      const newNodes: (Text | { type: 'html'; value: string })[] = []
      let lastIndex = 0

      wikilinkPattern.lastIndex = 0
      let match: RegExpExecArray | null

      while ((match = wikilinkPattern.exec(text) as RegExpExecArray | null) !== null) {
        const target = (match.groups as { target: string; alias?: string }).target
        const alias = (match.groups as { target: string; alias?: string }).alias
        const start = match.index
        const end = start + match[0].length

        if (start > lastIndex) {
          newNodes.push({ type: 'text', value: text.slice(lastIndex, start) })
        }

        const display = (alias ?? target).trim()
        const slug = resolveSlug(target.trim())

        if (slug) {
          newNodes.push({
            type: 'html',
            value: `<span data-wikilink="${slug}">${display}</span>`,
          })
        } else {
          newNodes.push({
            type: 'html',
            value: `<span data-wikilink-broken="true">${display}</span>`,
          })
        }

        lastIndex = end
      }

      if (lastIndex === 0) return

      if (lastIndex < text.length) {
        newNodes.push({ type: 'text', value: text.slice(lastIndex) })
      }

      parent.children.splice(index, 1, ...(newNodes as never[]))
    })
  }
}

// ── Collection definition ─────────────────────────────────────────────────────

// Module-level cache: collection.documents() cannot be called concurrently
// across parallel transforms, so we resolve it once and share the result.
let slugStubsCache: SlugStub[] | null = null

const cookbook = defineCollection({
  name: 'cookbook',
  directory: 'Cookbook',
  include: '**/*.md',
  exclude: ['.obsidian/**'],
  schema: z.object({
    content: z.string(),
  }),
  transform: async (doc, { cache, collection }) => {
    const filePath = doc._meta.filePath
    const slug = deriveSlug(filePath)
    const section = deriveSectionName(filePath)
    const isIndex = doc._meta.fileName.toLowerCase() === 'index.md'
    const name = isIndex ? section : doc._meta.fileName.replace(/\.md$/, '')
    const rawLinks = extractWikilinks(doc.content)

    // Build slug stubs once across all transforms
    if (!slugStubsCache) {
      const allDocs = await collection.documents()
      slugStubsCache = allDocs.map((d) => ({
        slug: deriveSlug(d._meta.filePath),
      }))
    }
    const slugStubs = slugStubsCache
    const resolveSlug = (raw: string) => resolveWikilink(raw, slugStubs)

    const { html, headings } = await cache(doc.content, async (content) => {
      const extractedHeadings: MarkdownHeading[] = []

      const result = await unified()
        .use(remarkParse)
        // Frontmatter: parse YAML/TOML front matter blocks
        .use(remarkFrontmatter, ['yaml', 'toml'])
        // GFM: tables, strikethrough, task lists, autolinks, footnotes
        .use(remarkGfm)
        // Normalize headings so there's at most one h1
        .use(remarkNormalizeHeadings)
        // Custom heading IDs: ## My Heading {#custom-id}
        .use(remarkHeadingId)
        // GitHub-style blockquote alerts: > [!NOTE], > [!TIP], > [!WARNING], etc.
        .use(remarkGithubBlockquoteAlert)
        // Flexible admonition containers: ::: tip / ::: warning / etc.
        .use(remarkFlexibleContainers)
        // Code block titles: ```js title="example.js"
        .use(remarkFlexibleCodeTitles)
        // Definition lists: term\n: definition
        .use(remarkDefinitionList)
        // Math: $inline$ and $$block$$
        .use(remarkMath)
        // Smart quotes, em-dashes, ellipses
        .use(remarkSmartypants)
        // Emoji shortcodes: :smile: → 😄
        .use(remarkEmoji)
        // Better Gemoji shortcode support
        .use(remarkGemoji)
        // ++inserted text++ → <ins>
        .use(remarkIns)
        // Hard line breaks without trailing spaces (like GitHub issues)
        .use(remarkBreaks)
        // Auto-generate a Table of Contents from a ## Contents heading
        .use(remarkToc, { heading: 'contents|table of contents|toc', tight: true })
        // Remove empty paragraphs left by other transforms
        .use(remarkSqueezeparagraphs)
        // Wikilinks: [[Page]] → <span data-wikilink>
        .use(remarkWikilinks(resolveSlug))
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSlug)
        // KaTeX: render math nodes to HTML
        .use(rehypeKatex)
        .use(() => (tree) => {
          visit(tree, 'element', (node: Element) => {
            if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
              extractedHeadings.push({
                id: (node.properties?.id as string) || '',
                text: toString(node),
                level: parseInt(node.tagName.charAt(1), 10),
              })
            }
          })
        })
        .use(rehypeAutolinkHeadings, {
          behavior: 'prepend',
          properties: { className: ['anchor'], ariaHidden: 'true', tabIndex: -1 },
          content: { type: 'text', value: '#' },
        })
        .use(rehypeStringify)
        .process(content)

      return { html: String(result), headings: extractedHeadings }
    })

    const resolvedLinks = rawLinks
      .map((raw) => resolveSlug(raw))
      .filter((s): s is string => s !== null)

    return {
      slug,
      section,
      isIndex,
      name,
      rawLinks,
      resolvedLinks,
      html,
      headings,
    }
  },
})

export default defineConfig({
  content: [cookbook],
})
