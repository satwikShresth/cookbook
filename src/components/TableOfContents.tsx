import { useEffect, useRef, useState } from 'react'
import { Box, Text } from '@chakra-ui/react'
import type { MarkdownHeading } from '#/utils/markdown'

type Props = {
  headings: MarkdownHeading[]
}

export function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  const filtered = headings.filter((h) => h.level <= 3)

  useEffect(() => {
    if (!filtered.length) return
    observerRef.current?.disconnect()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '0px 0px -80% 0px', threshold: 0 },
    )

    for (const h of filtered) {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    }

    observerRef.current = observer
    return () => observer.disconnect()
  }, [headings])

  if (!filtered.length) return null

  return (
    <Box>
      <Text fontSize="sm" fontWeight="600" mb="2">
        Table of Contents
      </Text>
      <Box as="ul" listStyleType="none" p="0" m="0" display="flex" flexDirection="column" gap="0">
        {filtered.map((h) => (
          <Box
            as="li"
            key={h.id}
            pl={h.level === 3 ? '3' : '0'}
          >
            <Box
              as="a"
              href={`#${h.id}`}
              display="block"
              py="0.5"
              fontSize="sm"
              lineHeight="1.4"
              color={activeId === h.id ? 'fg' : 'fg.muted'}
              fontWeight={activeId === h.id ? '500' : '400'}
              borderLeftWidth={activeId === h.id ? '2px' : '2px'}
              borderLeftColor={activeId === h.id ? 'colorPalette.solid' : 'transparent'}
              pl="2"
              ml="-2"
              textDecoration="none"
              transition="color 0.15s, border-color 0.15s"
              _hover={{ color: 'fg' }}
            >
              {h.text}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
