import { useRef, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Box, Flex, Text } from '@chakra-ui/react'
import { ColorModeButton } from '#/components/ui/color-mode'
import { cookbookNav } from '#/utils/cookbook-api'
import { LuGithub, LuChevronDown, LuSearch, LuX } from 'react-icons/lu'

// ── Search box ─────────────────────────────────────────────────────────────────

function SearchBox({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Flex
      align="center"
      gap="1.5"
      px="2.5"
      h="8"
      borderWidth="1px"
      borderColor="border"
      borderRadius="md"
      bg="bg.subtle"
      cursor="text"
      onClick={() => inputRef.current?.focus()}
      _focusWithin={{ borderColor: 'colorPalette.solid', bg: 'bg' }}
      transition="border-color 0.15s, background 0.15s"
    >
      <LuSearch size={13} style={{ flexShrink: 0, opacity: 0.5 }} />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search…"
        style={{
          flex: 1,
          minWidth: 0,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: '0.75rem',
          color: 'inherit',
        }}
      />
      {value && (
        <Box
          as="button"
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onChange('') }}
          display="flex"
          alignItems="center"
          opacity={0.5}
          _hover={{ opacity: 1 }}
          flexShrink={0}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}
        >
          <LuX size={12} />
        </Box>
      )}
    </Flex>
  )
}

// ── Search results ─────────────────────────────────────────────────────────────

function SearchResults({
  query,
  currentSlug,
  onNavigate,
}: {
  query: string
  currentSlug: string
  onNavigate?: () => void
}) {
  const q = query.toLowerCase().trim()
  if (!q) return null

  const allFiles = cookbookNav.sections.flatMap((s) => [
    ...(s.indexSlug ? [{ slug: s.indexSlug, name: s.name, section: s.name }] : []),
    ...s.files.map((f) => ({ ...f, section: s.name })),
  ])

  const results = allFiles.filter(
    (f) => f.name.toLowerCase().includes(q) || f.section.toLowerCase().includes(q),
  )

  return (
    <Box px="2" pb="2">
      {results.length === 0 ? (
        <Text fontSize="xs" color="fg.muted" px="2" py="2">No results</Text>
      ) : (
        <Box as="ul" listStyleType="none" p="0" m="0">
          {results.map((f) => (
            <Box as="li" key={f.slug}>
              <Link to="/$" params={{ _splat: f.slug }} onClick={() => onNavigate?.()}>
                <Box
                  px="2"
                  py="1.5"
                  borderRadius="md"
                  _hover={{ bg: 'bg.subtle' }}
                  transition="background 0.1s"
                >
                  <Text
                    fontSize="sm"
                    fontWeight={currentSlug === f.slug ? '500' : '400'}
                    color={currentSlug === f.slug ? 'fg' : 'fg'}
                    lineHeight="1.3"
                  >
                    {f.name}
                  </Text>
                  <Text fontSize="xs" color="fg.muted">{f.section}</Text>
                </Box>
              </Link>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

// ── Shared nav tree ────────────────────────────────────────────────────────────

export function SidebarContent({
  currentSlug,
  onNavigate,
}: {
  currentSlug: string
  onNavigate?: () => void
}) {
  const [query, setQuery] = useState('')

  return (
    <>
      {/* Search */}
      <Box px="3" pb="2" flexShrink={0}>
        <SearchBox value={query} onChange={setQuery} />
      </Box>

      {/* Results or nav tree */}
      {query ? (
        <Box flex="1" overflowY="auto" css={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          <SearchResults query={query} currentSlug={currentSlug} onNavigate={() => { setQuery(''); onNavigate?.() }} />
        </Box>
      ) : (
        <>
          <Box px="4" pb="1" flexShrink={0}>
            <Text fontSize="xs" fontWeight="600" color="fg.muted" letterSpacing="0.06em" textTransform="uppercase">
              Explorer
            </Text>
          </Box>
          <Box flex="1" overflowY="auto" px="2" pb="6" css={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
            <Box as="ul" listStyleType="none" p="0" m="0" mt="1">
              {cookbookNav.sections.map((section) => (
                <SectionItem key={section.slug} section={section} currentSlug={currentSlug} onNavigate={onNavigate} />
              ))}
            </Box>
          </Box>
        </>
      )}
    </>
  )
}

// ── Desktop sidebar wrapper ────────────────────────────────────────────────────

export function Sidebar() {
  const routerState = useRouterState()
  const currentSlug = routerState.location.pathname.replace(/^\//, '')

  return (
    <Flex direction="column" h="100vh" overflow="hidden">
      {/* Site title */}
      <Flex px="4" pt="6" pb="3" flexShrink={0} align="flex-start" justify="space-between" gap="2">
        <Link to="/">
          <Text fontWeight="700" fontSize="lg" letterSpacing="-0.02em" lineHeight="1.2">
            מַטְבָּח יַנְקֶלֶע
          </Text>
          <Text fontSize="xs" color="fg.muted" mt="0.5">Yankele's Kitchen</Text>
        </Link>

        <Flex align="center" gap="0.5" flexShrink={0} mt="0.5">
          <a
            href="https://github.com/satwikShresth/cookbook"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '6px', color: 'inherit', opacity: 0.6, transition: 'opacity 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
          >
            <LuGithub size={15} />
          </a>
          <ColorModeButton size="xs" variant="ghost" />
        </Flex>
      </Flex>

      <SidebarContent currentSlug={currentSlug} />
    </Flex>
  )
}

// ── Section + nav items ────────────────────────────────────────────────────────

function SectionItem({
  section,
  currentSlug,
  onNavigate,
}: {
  section: (typeof cookbookNav.sections)[number]
  currentSlug: string
  onNavigate?: () => void
}) {
  const hasChildren = section.files.length > 0
  const isCurrentSection =
    currentSlug === section.indexSlug || section.files.some((f) => f.slug === currentSlug)
  const [open, setOpen] = useState(isCurrentSection || hasChildren)

  const headerLabel = (
    <Text as="span" fontSize="sm" fontWeight="500">
      {section.name}
    </Text>
  )

  if (!hasChildren) {
    return (
      <Box as="li" mb="0.5">
        <NavLink slug={section.indexSlug ?? ''} label={section.name} currentSlug={currentSlug} onNavigate={onNavigate} />
      </Box>
    )
  }

  return (
    <Box as="li" mb="1">
      <Flex
        align="center"
        gap="1"
        px="2"
        py="1"
        cursor="pointer"
        onClick={() => setOpen((o) => !o)}
        role="button"
        borderRadius="md"
        _hover={{ bg: 'bg.subtle' }}
        transition="background 0.1s"
      >
        <LuChevronDown
          size={12}
          style={{ flexShrink: 0, color: 'var(--chakra-colors-fg-muted)', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }}
        />
        {section.indexSlug ? (
          <Link
            to="/$"
            params={{ _splat: section.indexSlug }}
            onClick={(e) => { e.stopPropagation(); onNavigate?.() }}
            style={{ flex: 1, minWidth: 0 }}
          >
            {headerLabel}
          </Link>
        ) : (
          <Box flex="1">{headerLabel}</Box>
        )}
      </Flex>

      {open && (
        <Box
          as="ul"
          listStyleType="none"
          p="0"
          m="0"
          ml="3.5"
          borderLeftWidth="1px"
          borderColor="border"
          pl="2"
        >
          {section.files.map((file) => (
            <Box as="li" key={file.slug} mb="0.5">
              <NavLink slug={file.slug} label={file.name} currentSlug={currentSlug} onNavigate={onNavigate} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

function NavLink({
  slug,
  label,
  currentSlug,
  onNavigate,
}: {
  slug: string
  label: string
  currentSlug: string
  onNavigate?: () => void
}) {
  const isActive = currentSlug === slug
  return (
    <Link to="/$" params={{ _splat: slug }} onClick={() => onNavigate?.()}>
      <Box
        px="2"
        py="1"
        borderRadius="md"
        fontSize="sm"
        fontWeight={isActive ? '500' : '400'}
        color={isActive ? 'fg' : 'fg.muted'}
        bg={isActive ? 'bg.subtle' : 'transparent'}
        _hover={{ bg: 'bg.subtle', color: 'fg' }}
        transition="all 0.1s"
        display="block"
        truncate
      >
        {label}
      </Box>
    </Link>
  )
}
