import { allCookbooks } from 'content-collections'
import type { Cookbook } from 'content-collections'

export type { Cookbook }

// ── Types ──────────────────────────────────────────────────────────────────

export interface CookbookFile {
  slug: string
  name: string
  isIndex: boolean
}

export interface CookbookSection {
  slug: string
  name: string
  indexSlug: string | null
  files: CookbookFile[]
}

export interface CookbookNav {
  sections: CookbookSection[]
  rootIndexSlug: string | null
  backlinks: Record<string, string[]>
  edges: { source: string; target: string }[]
}

// ── Build navigation ────────────────────────────────────────────────────────

function buildNav(): CookbookNav {
  // Build backlink index and edges
  const backlinks: Record<string, string[]> = {}
  const edges: { source: string; target: string }[] = []

  for (const doc of allCookbooks) {
    for (const targetSlug of doc.resolvedLinks) {
      ;(backlinks[targetSlug] ??= []).push(doc.slug)
      edges.push({ source: doc.slug, target: targetSlug })
    }
  }

  // Group by section
  const sectionMap = new Map<string, CookbookSection>()

  for (const doc of allCookbooks) {
    const sectionName = doc.section
    const topSlug = doc.slug.split('/')[0]

    if (!sectionMap.has(sectionName)) {
      sectionMap.set(sectionName, {
        slug: topSlug,
        name: sectionName,
        indexSlug: null,
        files: [],
      })
    }

    const section = sectionMap.get(sectionName)!
    if (doc.isIndex) {
      section.indexSlug = doc.slug
    } else {
      section.files.push({ slug: doc.slug, name: doc.name, isIndex: false })
    }
  }

  // Determine root index
  const overviewSection = sectionMap.get('Overview')
  const rootIndexSlug = overviewSection?.indexSlug ?? null

  const sections = Array.from(sectionMap.values()).filter(
    (s) => s.name !== 'Overview' || s.files.length > 0,
  )

  return { sections, rootIndexSlug, backlinks, edges }
}

// Singleton — computed once at module load time
export const cookbookNav: CookbookNav = buildNav()

// ── File lookup ─────────────────────────────────────────────────────────────

export function getCookbookFileBySlug(slug: string): Cookbook | undefined {
  return allCookbooks.find((d) => d.slug === slug)
}
