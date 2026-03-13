import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { Box, Flex, Text, Separator } from '@chakra-ui/react'
import { getCookbookFileBySlug, cookbookNav } from '#/utils/cookbook-api'
import { Markdown } from '#/components/Markdown'
import { TableOfContents } from '#/components/TableOfContents'
import { Backlinks } from '#/components/Backlinks'
import { Graph } from '#/components/Graph'

export const Route = createFileRoute('/$')({
  loader: ({ params }) => {
    const slug = params._splat ?? ''
    const fileContent = getCookbookFileBySlug(slug)
    if (!fileContent) throw notFound()
    return { fileContent, slug }
  },
  component: FilePage,
  notFoundComponent: () => (
    <Text fontSize="sm" color="fg.muted">Page not found.</Text>
  ),
})

function SlugBreadcrumb({ slug }: { slug: string }) {
  const parts = slug.split('/')
  return (
    <nav aria-label="breadcrumbs">
      <Box
        as="ol"
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        listStyleType="none"
        p="0"
        m="0"
        fontSize="sm"
        color="fg.muted"
      >
        {parts.map((part, i) => {
          const isLast = i === parts.length - 1
          const label = part.replace(/-/g, ' ')
          const partSlug = parts.slice(0, i + 1).join('/')
          return (
            <Box as="li" key={partSlug} display="flex" alignItems="center">
              {isLast ? (
                <Text as="span" color="fg" fontWeight="500" fontSize="sm">{label}</Text>
              ) : (
                <>
                  <Link to="/$" params={{ _splat: partSlug }}>
                    <Text
                      as="span"
                      fontSize="sm"
                      color="fg.muted"
                      _hover={{ color: 'fg' }}
                      transition="color 0.15s"
                    >
                      {label}
                    </Text>
                  </Link>
                  <Text as="span" mx="1.5" color="fg.subtle" userSelect="none">❯</Text>
                </>
              )}
            </Box>
          )
        })}
      </Box>
    </nav>
  )
}

function RightSidebar({ slug, headings }: { slug: string; headings: ReturnType<typeof getCookbookFileBySlug>['headings'] }) {
  return (
    <Flex direction="column" gap="5">
      <Graph slug={slug} nav={cookbookNav} />
      <Separator />
      <TableOfContents headings={headings} />
      <Separator />
      <Backlinks slug={slug} nav={cookbookNav} />
    </Flex>
  )
}

function FilePage() {
  const { fileContent, slug } = Route.useLoaderData()

  return (
    <Flex gap="16" align="flex-start" direction={{ base: 'column', lg: 'row' }}>
      {/* Article */}
      <Box as="article" minW={0} flex="1" w="100%">
        <Box mb="8">
          <SlugBreadcrumb slug={slug} />
          <Text
            as="h1"
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="700"
            letterSpacing="-0.03em"
            lineHeight="1.15"
            mt="3"
            mb="0"
          >
            {fileContent.name}
          </Text>
        </Box>

        <Markdown html={fileContent.html} />

        {/* Right sidebar content — shown below article on mobile */}
        <Box
          display={{ base: 'block', lg: 'none' }}
          mt="10"
          pt="6"
          borderTopWidth="1px"
          borderColor="border"
        >
          <RightSidebar slug={slug} headings={fileContent.headings} />
        </Box>
      </Box>

      {/* Right sidebar — desktop only, sticky */}
      <Box
        as="aside"
        display={{ base: 'none', lg: 'block' }}
        w="220px"
        flexShrink={0}
        position="sticky"
        top="10"
        alignSelf="flex-start"
        maxH="calc(100vh - 5rem)"
        overflowY="auto"
        css={{
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <RightSidebar slug={slug} headings={fileContent.headings} />
      </Box>
    </Flex>
  )
}
