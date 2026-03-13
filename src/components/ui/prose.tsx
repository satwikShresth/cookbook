import { chakra } from '@chakra-ui/react'

const TRAILING_PSEUDO_REGEX = /(::?[\w-]+(?:\([^)]*\))?)+$/
const EXCLUDE_CLASSNAME = '.not-prose'

function inWhere<T extends string>(selector: T): T {
  const rebuiltSelector = selector.startsWith('& ')
    ? selector.slice(2)
    : selector
  const match = selector.match(TRAILING_PSEUDO_REGEX)
  const pseudo = match ? match[0] : ''
  const base = match ? selector.slice(0, -match[0].length) : rebuiltSelector
  return `& :where(${base}):not(${EXCLUDE_CLASSNAME}, ${EXCLUDE_CLASSNAME} *)${pseudo}` as T
}

export const Prose = chakra('div', {
  base: {
    color: 'fg',
    fontSize: 'md',
    lineHeight: '1.75em',
    [inWhere('& p')]: {
      marginTop: '0.85em',
      marginBottom: '0.85em',
    },
    [inWhere('& blockquote')]: {
      marginTop: '1.285em',
      marginBottom: '1.285em',
      paddingInline: '1.285em',
      borderInlineStartWidth: '0.25em',
      fontStyle: 'italic',
      color: 'fg.muted',
    },
    [inWhere('& a')]: {
      color: 'teal.600',
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
      textDecorationThickness: '1px',
      textDecorationColor: 'border.muted',
      fontWeight: '500',
      transition: 'color 0.15s ease',
    },
    [inWhere('& a:hover')]: {
      color: 'teal.500',
    },
    [inWhere('& strong')]: {
      fontWeight: '600',
      color: 'fg',
    },
    [inWhere('& em')]: {
      fontStyle: 'italic',
    },
    [inWhere('& mark')]: {
      bg: 'yellow.subtle',
      color: 'yellow.fg',
      borderRadius: 'sm',
      paddingInline: '0.2em',
    },
    [inWhere('& kbd')]: {
      fontSize: '0.85em',
      borderRadius: 'xs',
      paddingTop: '0.15em',
      paddingBottom: '0.15em',
      paddingInlineEnd: '0.45em',
      paddingInlineStart: '0.45em',
      fontFamily: 'inherit',
      color: 'fg.muted',
      '--shadow': 'colors.border',
      boxShadow: '0 0 0 1px var(--shadow), 0 1px 0 1px var(--shadow)',
    },
    [inWhere('& h1')]: {
      fontSize: '2.15em',
      letterSpacing: '-0.02em',
      marginTop: '0',
      marginBottom: '0.8em',
      lineHeight: '1.2em',
      fontWeight: '700',
      color: 'fg',
    },
    [inWhere('& h2')]: {
      fontSize: '1.5em',
      letterSpacing: '-0.02em',
      marginTop: '1.75em',
      marginBottom: '0.6em',
      lineHeight: '1.3em',
      fontWeight: '600',
      color: 'fg',
    },
    [inWhere('& h3')]: {
      fontSize: '1.2em',
      letterSpacing: '-0.01em',
      marginTop: '1.5em',
      marginBottom: '0.4em',
      lineHeight: '1.4em',
      fontWeight: '600',
      color: 'fg',
    },
    [inWhere('& h4, & h5, & h6')]: {
      fontSize: '1em',
      marginTop: '1.4em',
      marginBottom: '0.4em',
      lineHeight: '1.5em',
      fontWeight: '600',
      color: 'fg',
    },
    [inWhere('& :is(h1,h2,h3,h4,h5,h6)')]: {
      position: 'relative',
    },
    [inWhere('& :is(h2,h3,h4)[id] > a.anchor')]: {
      position: 'absolute',
      left: '-1.2em',
      opacity: '0',
      transition: 'opacity 0.2s ease',
      fontFamily: 'ui-monospace, monospace',
      fontSize: '0.8em',
      textDecoration: 'none',
      userSelect: 'none',
      fontWeight: '400',
      color: 'fg.subtle',
    },
    [inWhere('& :is(h2,h3,h4)[id]:hover > a.anchor')]: {
      opacity: '1',
    },
    [inWhere('& img')]: {
      marginTop: '1.5em',
      marginBottom: '1.5em',
      borderRadius: 'lg',
      maxWidth: '100%',
    },
    [inWhere('& code')]: {
      fontSize: '0.875em',
      bg: 'bg.muted',
      letterSpacing: '-0.01em',
      borderRadius: 'sm',
      borderWidth: '1px',
      paddingInline: '0.3em',
      paddingBlock: '0.1em',
      fontFamily: "ui-monospace, 'SF Mono', 'Fira Code', monospace",
    },
    [inWhere('& pre')]: {
      bg: 'bg.muted',
      marginTop: '1.6em',
      marginBottom: '1.6em',
      borderRadius: 'md',
      borderWidth: '1px',
      fontSize: '0.875em',
      padding: '1rem 1.25rem',
      overflowX: 'auto',
      lineHeight: '1.65',
    },
    [inWhere('& pre code')]: {
      fontSize: 'inherit',
      letterSpacing: 'inherit',
      borderWidth: '0',
      padding: '0',
      bg: 'transparent',
    },
    [inWhere('& ol')]: {
      marginTop: '0.85em',
      marginBottom: '0.85em',
      paddingInlineStart: '1.5em',
    },
    [inWhere('& ul')]: {
      marginTop: '0.85em',
      marginBottom: '0.85em',
      paddingInlineStart: '1.5em',
    },
    [inWhere('& li')]: {
      marginTop: '0.3em',
      marginBottom: '0.3em',
      lineHeight: '1.75em',
      overflowWrap: 'break-word',
    },
    [inWhere('& ol > li')]: {
      paddingInlineStart: '0.4em',
      listStyleType: 'decimal',
    },
    [inWhere('& ul > li')]: {
      paddingInlineStart: '0.4em',
      listStyleType: 'disc',
    },
    [inWhere('& ul ul > li')]: {
      listStyleType: 'circle',
    },
    [inWhere('& ul ul ul > li')]: {
      listStyleType: 'square',
    },
    [inWhere('& li:has(> [data-scope="checkbox"])')]: {
      listStyleType: 'none',
      paddingInlineStart: '0',
    },
    [inWhere('& :is(h1,h2,h3,h4,h5,hr) + *')]: {
      marginTop: '0',
    },
    [inWhere('& hr')]: {
      marginTop: '2em',
      marginBottom: '2em',
      borderTopWidth: '1px',
    },
    [inWhere('& table')]: {
      width: '100%',
      tableLayout: 'auto',
      textAlign: 'start',
      fontSize: '0.9em',
      lineHeight: '1.5em',
      marginTop: '1.5em',
      marginBottom: '1.5em',
      borderCollapse: 'collapse',
    },
    [inWhere('& thead')]: {
      borderBottomWidth: '2px',
      color: 'fg.muted',
    },
    [inWhere('& thead th')]: {
      padding: '0.5em 0.75em',
      fontWeight: '600',
      fontSize: '0.85em',
      letterSpacing: '0.02em',
      textAlign: 'start',
    },
    [inWhere('& tbody tr')]: {
      borderBottomWidth: '1px',
    },
    [inWhere('& tbody tr:last-child')]: {
      borderBottomWidth: '0',
    },
    [inWhere('& tbody td')]: {
      padding: '0.45em 0.75em',
      verticalAlign: 'top',
      overflowWrap: 'break-word',
    },
    [inWhere('& figure')]: {
      marginTop: '1.5em',
      marginBottom: '1.5em',
    },
    [inWhere('& figcaption')]: {
      fontSize: '0.85em',
      color: 'fg.muted',
      marginTop: '0.5em',
    },
  },
  variants: {
    size: {
      md: { fontSize: 'md' },
      lg: { fontSize: 'lg' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
