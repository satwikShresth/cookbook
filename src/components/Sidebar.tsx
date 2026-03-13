import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Box, Flex, Text } from '@chakra-ui/react'
import { ColorModeButton } from '#/components/ui/color-mode'
import { cookbookNav } from '#/utils/cookbook-api'
import { LuGithub, LuChevronDown } from 'react-icons/lu'

export function Sidebar() {
  const routerState = useRouterState()
  const currentSlug = routerState.location.pathname.replace(/^\//, '')

  return (
    <Flex direction="column" h="100vh" overflow="hidden">
      {/* Site title */}
      <Box px="4" pt="6" pb="4" flexShrink={0}>
        <Link to="/">
          <Text fontWeight="700" fontSize="lg" letterSpacing="-0.02em" lineHeight="1.2">
            מַטְבָּח יַנְקֶלֶע
          </Text>
          <Text fontSize="xs" color="fg.muted" mt="0.5">Yankele's Kitchen</Text>
        </Link>

        <Flex mt="3" align="center" gap="1">
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
      </Box>

      <Box px="4" pb="1" flexShrink={0}>
        <Text fontSize="xs" fontWeight="600" color="fg.muted" letterSpacing="0.06em" textTransform="uppercase">
          Explorer
        </Text>
      </Box>

      {/* Nav tree */}
      <Box flex="1" overflowY="auto" px="2" pb="6" css={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
        <Box as="ul" listStyleType="none" p="0" m="0" mt="1">
          {cookbookNav.sections.map((section) => (
            <SectionItem key={section.slug} section={section} currentSlug={currentSlug} />
          ))}
        </Box>
      </Box>
    </Flex>
  )
}

function SectionItem({
  section,
  currentSlug,
}: {
  section: (typeof cookbookNav.sections)[number]
  currentSlug: string
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
        <NavLink slug={section.indexSlug ?? ''} label={section.name} currentSlug={currentSlug} />
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
            onClick={(e) => e.stopPropagation()}
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
              <NavLink slug={file.slug} label={file.name} currentSlug={currentSlug} />
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
}: {
  slug: string
  label: string
  currentSlug: string
}) {
  const isActive = currentSlug === slug
  return (
    <Link to="/$" params={{ _splat: slug }}>
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
