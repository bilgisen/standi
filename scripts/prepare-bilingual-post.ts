// Build a single-shot bilingual REST create payload (no PATCH needed).
//   npx tsx scripts/prepare-bilingual-post.ts --key <key> --out tmp/bilingual.json
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { markdownToLexical } from './lib/blog-lexical.js'

function flagValue(args: string[], flag: string): string | undefined {
  const i = args.indexOf(flag)
  if (i === -1) return undefined
  const v = args[i + 1]
  if (!v || v.startsWith('--')) return undefined
  return v
}

const args = process.argv.slice(2)
const key = flagValue(args, '--key')
const out = join(process.cwd(), flagValue(args, '--out') || 'tmp/bilingual.json')
if (!key) {
  console.error('prepare-bilingual-post: --key is required')
  process.exit(1)
}

const data = JSON.parse(readFileSync(join(process.cwd(), 'content/blog', `${key}.json`), 'utf8'))
const payload = {
  title: { en: data.en.title, tr: data.tr.title },
  slug: { en: data.en.slug, tr: data.tr.slug },
  excerpt: { en: data.en.excerpt, tr: data.tr.excerpt },
  content: {
    en: markdownToLexical(data.en.bodyMarkdown),
    tr: markdownToLexical(data.tr.bodyMarkdown),
  },
  publishedDate: data.publishedDate,
  ...(data.category ? { category: data.category } : {}),
  tags: (data.tags || []).map((tag: string) => ({ tag })),
  _status: 'published',
}
writeFileSync(out, JSON.stringify(payload))
console.log(`prepare-bilingual-post: wrote ${out}`)
