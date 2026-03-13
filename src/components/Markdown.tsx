import parse, { type HTMLReactParserOptions, Element, domToReact } from 'html-react-parser'
import type { DOMNode } from 'html-react-parser'
import { Link } from '@tanstack/react-router'
import { Box } from '@chakra-ui/react'

type MarkdownProps = {
  html: string
}

export function Markdown({ html }: MarkdownProps) {
  let firstH1Skipped = false

  const options: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      if (!(domNode instanceof Element)) return

      if (domNode.name === 'h1' && !firstH1Skipped) {
        firstH1Skipped = true
        return <></>
      }

      if (domNode.attribs['data-wikilink']) {
        const slug = domNode.attribs['data-wikilink']
        return (
          <Link
            to="/$"
            params={{ _splat: slug }}
            style={{
              backgroundColor: 'color-mix(in srgb, var(--chakra-colors-accent-emphasized) 15%, transparent)',
              padding: '0 0.15em',
              borderRadius: '3px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'background 0.15s ease',
            }}
          >
            {domToReact(domNode.children as DOMNode[], options)}
          </Link>
        )
      }

      if ('data-wikilink-broken' in domNode.attribs) {
        return (
          <span style={{
            opacity: 0.5,
            cursor: 'not-allowed',
            textDecoration: 'line-through',
            fontSize: '0.9em',
          }}>
            {domToReact(domNode.children as DOMNode[], options)}
          </span>
        )
      }

      if (domNode.name === 'img') {
        return (
          <img
            {...domNode.attribs}
            loading="lazy"
            style={{ maxWidth: '100%', borderRadius: '6px', margin: '1rem 0' }}
          />
        )
      }

      if (domNode.name === 'table') {
        return (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', margin: '1.25rem 0' }}>
            <table style={{ margin: 0 }}>
              {domToReact(domNode.children as DOMNode[], options)}
            </table>
          </div>
        )
      }
    },
  }

  return (
    <Box
      fontSize="1.1rem"
      lineHeight="1.85"
      css={{
        '& p, & li': { lineHeight: '1.75rem', overflowWrap: 'break-word' },
        '& h2': { fontSize: '1.4rem', fontWeight: 600, marginTop: '1.9rem', marginBottom: '1rem', letterSpacing: '-0.01em' },
        '& h3': { fontSize: '1.12rem', fontWeight: 600, marginTop: '1.62rem', marginBottom: '1rem' },
        '& h4, & h5, & h6': { fontSize: '1rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '1rem' },
        '& h2[id], & h3[id], & h4[id]': { position: 'relative' },
        '& h2[id] > a.anchor, & h3[id] > a.anchor, & h4[id] > a.anchor': {
          position: 'absolute', left: '-1.2em',
          opacity: 0, transition: 'opacity 0.2s ease', fontFamily: 'ui-monospace, monospace',
          fontSize: '0.8em', textDecoration: 'none', userSelect: 'none', fontWeight: 400,
          color: 'var(--chakra-colors-fg-muted)',
        },
        '& h2[id]:hover > a.anchor, & h3[id]:hover > a.anchor, & h4[id]:hover > a.anchor': { opacity: 1 },
        '& a': { fontWeight: 600, transition: 'color 0.2s ease' },
        '& strong': { fontWeight: 600 },
        '& code': { fontSize: '0.82em', borderRadius: '3px', padding: '2px 5px', fontFamily: "ui-monospace, 'SF Mono', 'Fira Code', monospace" },
        '& pre': { borderRadius: '6px', padding: '1.1rem 1.25rem', overflowX: 'auto', fontSize: '0.82rem', lineHeight: 1.65, borderWidth: '1px' },
        '& pre code': { background: 'none', padding: 0, borderRadius: 0, fontSize: 'inherit' },
        '& blockquote': { borderLeftWidth: '3px', paddingLeft: '1.1rem', fontStyle: 'italic', marginInline: 0, margin: '1rem 0' },
        '& hr': { border: 'none', borderTopWidth: '1px', margin: '2rem 0', width: '100%' },
        '& img': { maxWidth: '100%', borderRadius: '6px', margin: '1rem 0' },
        '& ul': { paddingLeft: '1.5rem', listStyleType: 'disc' },
        '& ul ul': { listStyleType: 'circle' },
        '& ul ul ul': { listStyleType: 'square' },
        '& ol': { paddingLeft: '1.5rem', listStyleType: 'decimal' },
        '& li': { listStyleType: 'inherit' },
        '& li:has(> input[type="checkbox"])': { listStyleType: 'none', paddingLeft: 0 },
        '& table': { width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', margin: '1.25rem 0' },
        '& th': { textAlign: 'left', borderBottomWidth: '2px', padding: '0.5rem 0.75rem', fontWeight: 600, whiteSpace: 'nowrap', color: 'fg.muted', fontSize: '0.8rem', letterSpacing: '0.02em' },
        '& td': { padding: '0.45rem 0.75rem', borderBottomWidth: '1px', lineHeight: '1.5', verticalAlign: 'top', overflowWrap: 'break-word', wordBreak: 'break-word' },
        '& tr:last-child td': { borderBottom: 'none' },
        '& tbody tr:hover td': { background: 'var(--chakra-colors-bg-subtle)' },
      }}
    >
      {parse(html, options)}
    </Box>
  )
}
