// Build REST payload files from content/blog/*.json (no database access).
//   npx tsx scripts/prepare-rest-payload.ts --key <key> --out tmp/rest
// Writes <out>/<key>.en.json and <out>/<key>.tr.json with flat locale fields.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
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
const outDir = join(process.cwd(), flagValue(args, '--out') || 'tmp/rest')
if (!key) {
  console.error('prepare-rest-payload: --key is required')
  process.exit(1)
}

const file = join(process.cwd(), 'content/blog', `${key}.json`)
const data = JSON.parse(readFileSync(file, 'utf8'))
mkdirSync(outDir, { recursive: true })

for (const loc of ['en', 'tr'] as const) {
  const payload = {
    title: data[loc].title,
    slug: data[loc].slug,
    excerpt: data[loc].excerpt,
    content: markdownToLexical(data[loc].bodyMarkdown),
    ...(loc === 'en'
      ? {
          publishedDate: data.publishedDate,
          category: data.category ?? null,
          tags: (data.tags || []).map((tag: string) => ({ tag })),
        }
      : {}),
  }
  writeFileSync(join(outDir, `${key}.${loc}.json`), JSON.stringify(payload))
  console.log(`prepare-rest-payload: wrote ${key}.${loc}.json`)
}
