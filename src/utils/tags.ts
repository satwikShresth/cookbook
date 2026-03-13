const TAG_PALETTES = [
  'red', 'orange', 'yellow', 'green', 'teal',
  'cyan', 'blue', 'purple', 'pink',
] as const

export type TagPalette = typeof TAG_PALETTES[number]

export function tagColor(tag: string): TagPalette {
  let hash = 0
  for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) >>> 0
  return TAG_PALETTES[hash % TAG_PALETTES.length]
}
