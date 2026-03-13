import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useNavigate } from '@tanstack/react-router'
import { Box, Text } from '@chakra-ui/react'
import type { CookbookNav } from '#/utils/cookbook-api'

type Props = {
  slug: string
  nav: CookbookNav
}

type NodeDatum = d3.SimulationNodeDatum & {
  id: string
  name: string
  isCurrent: boolean
  numLinks: number
}

type LinkDatum = d3.SimulationLinkDatum<NodeDatum> & {
  source: NodeDatum | string
  target: NodeDatum | string
}

export function Graph({ slug, nav }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const allFiles = nav.sections.flatMap((s) => [
      ...(s.indexSlug ? [{ slug: s.indexSlug, name: s.name }] : []),
      ...s.files,
    ])

    // Collect neighbour slugs (depth-1)
    const neighborSlugs = new Set<string>()
    for (const e of nav.edges) {
      if (e.source === slug) neighborSlugs.add(e.target)
      if (e.target === slug) neighborSlugs.add(e.source)
    }

    const visibleSlugs = new Set([slug, ...neighborSlugs])

    const nodes: NodeDatum[] = allFiles
      .filter((f) => visibleSlugs.has(f.slug))
      .map((f) => ({
        id: f.slug,
        name: f.name,
        isCurrent: f.slug === slug,
        numLinks: nav.edges.filter((e) => e.source === f.slug || e.target === f.slug).length,
      }))

    const links: LinkDatum[] = nav.edges
      .filter((e) => visibleSlugs.has(e.source) && visibleSlugs.has(e.target))
      .map((e) => ({ source: e.source, target: e.target }))

    const W = container.offsetWidth || 200
    const H = 160

    // Read CSS vars for colors
    const style = getComputedStyle(document.documentElement)
    const colorFg = style.getPropertyValue('--chakra-colors-fg').trim() || '#111'
    const colorMuted = style.getPropertyValue('--chakra-colors-fg-muted').trim() || '#888'
    const colorBorder = style.getPropertyValue('--chakra-colors-border').trim() || '#ddd'
    const colorAccent = style.getPropertyValue('--chakra-colors-blue-500').trim() || '#3b82f6'

    // Clear previous render
    d3.select(container).selectAll('svg').remove()

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', W)
      .attr('height', H)
      .style('display', 'block')

    const g = svg.append('g')

    // Zoom
    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.4, 4])
        .on('zoom', (e) => g.attr('transform', e.transform)),
    )

    const nodeRadius = (d: NodeDatum) => (d.isCurrent ? 6 : 2 + Math.sqrt(d.numLinks + 1))

    const sim = d3
      .forceSimulation<NodeDatum>(nodes)
      .force('link', d3.forceLink<NodeDatum, LinkDatum>(links).id((d) => d.id).distance(50).strength(1))
      .force('charge', d3.forceManyBody().strength(-80))
      .force('center', d3.forceCenter(W / 2, H / 2).strength(0.5))
      .force('collide', d3.forceCollide<NodeDatum>((d) => nodeRadius(d) + 8))

    // Links
    const link = g
      .append('g')
      .selectAll<SVGLineElement, LinkDatum>('line')
      .data(links)
      .join('line')
      .attr('stroke', colorBorder)
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 1)

    // Node groups
    const node = g
      .append('g')
      .selectAll<SVGGElement, NodeDatum>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .on('click', (_e, d) => navigate({ to: '/$', params: { _splat: d.id } }))
      .call(
        d3.drag<SVGGElement, NodeDatum>()
          .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
          .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y })
          .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null }) as never,
      )

    // Circles
    node.append('circle')
      .attr('r', nodeRadius)
      .attr('fill', (d) => d.isCurrent ? colorAccent : colorMuted)
      .attr('stroke', 'none')

    // Labels — hidden by default, shown on hover (Quartz style)
    const label = node.append('text')
      .text((d) => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => -(nodeRadius(d) + 4))
      .attr('font-size', '9px')
      .attr('fill', colorFg)
      .attr('font-family', 'inherit')
      .attr('pointer-events', 'none')
      .attr('opacity', 0)

    // Hover: fade unrelated nodes/links, show label
    node
      .on('mouseenter', (_e, hovered) => {
        const connectedIds = new Set<string>([hovered.id])
        links.forEach((l) => {
          const s = (l.source as NodeDatum).id
          const t = (l.target as NodeDatum).id
          if (s === hovered.id || t === hovered.id) {
            connectedIds.add(s)
            connectedIds.add(t)
          }
        })

        node.attr('opacity', (d) => connectedIds.has(d.id) ? 1 : 0.2)
        link.attr('stroke-opacity', (l) => {
          const s = (l.source as NodeDatum).id
          const t = (l.target as NodeDatum).id
          return s === hovered.id || t === hovered.id ? 1 : 0.1
        })
        label.filter((d) => d.id === hovered.id).attr('opacity', 1)
      })
      .on('mouseleave', () => {
        node.attr('opacity', 1)
        link.attr('stroke-opacity', 1)
        label.attr('opacity', 0)
      })

    // Tick
    sim.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as NodeDatum).x ?? 0)
        .attr('y1', (d) => (d.source as NodeDatum).y ?? 0)
        .attr('x2', (d) => (d.target as NodeDatum).x ?? 0)
        .attr('y2', (d) => (d.target as NodeDatum).y ?? 0)
      node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
    })

    return () => { sim.stop() }
  }, [slug, nav, navigate])

  return (
    <Box>
      <Text fontSize="sm" fontWeight="600" mb="2">
        Graph View
      </Text>
      <Box ref={containerRef} w="100%" />
    </Box>
  )
}
