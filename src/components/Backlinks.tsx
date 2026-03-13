import { Link } from '@tanstack/react-router'
import { Box, Text } from '@chakra-ui/react'
import type { CookbookNav } from '#/utils/cookbook-api'

type Props = {
  slug: string
  nav: CookbookNav
}

export function Backlinks({ slug, nav }: Props) {
  const backlinkSlugs = nav.backlinks[slug] ?? []
  if (!backlinkSlugs.length) return null

  const allFiles = nav.sections.flatMap((s) => [
    ...(s.indexSlug ? [{ slug: s.indexSlug, name: s.name, isIndex: true }] : []),
    ...s.files,
  ])
  const backlinkFiles = backlinkSlugs
    .map((s) => allFiles.find((f) => f.slug === s))
    .filter(Boolean) as typeof allFiles

  return (
    <Box>
      <Text fontSize="sm" fontWeight="600" mb="2">
        Backlinks
      </Text>
      <Box as="ul" listStyleType="none" p="0" m="0" display="flex" flexDirection="column" gap="0.5">
        {backlinkFiles.map((f) => (
          <Box as="li" key={f.slug}>
            <Link to="/$" params={{ _splat: f.slug }}>
              <Text
                as="span"
                fontSize="sm"
                color="colorPalette.fg"
                fontWeight="500"
                _hover={{ textDecoration: 'underline' }}
                display="block"
                truncate
              >
                {f.name}
              </Text>
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
