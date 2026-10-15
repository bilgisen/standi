// Emit SQL to sync post 1 content from local JSON (bypasses broken update path).
//   npx tsx scripts/emit-content-fix.ts --key <key> --id 1 --out tmp/fix.sql
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

const esc = (s: string) => `'${s.replace(/'/g, "''")}'`

const args = process.argv.slice(2)
const key = flagValue(args, '--key')
const id = flagValue(args, '--id') || '1'
const out = join(process.cwd(), flagValue(args, '--out') || 'tmp/fix.sql')
if (!key) {
  console.error('emit-content-fix: --key is required')
  process.exit(1)
}

const data = JSON.parse(readFileSync(join(process.cwd(), 'content/blog', `${key}.json`), 'utf8'))
const lines: string[] = []
for (const loc of ['en', 'tr'] as const) {
  const b = data[loc]
  const content = JSON.stringify(markdownToLexical(b.bodyMarkdown))
  lines.push(
    `UPDATE posts_locales SET title = ${esc(b.title)}, slug = ${esc(b.slug)}, excerpt = ${esc(b.excerpt)}, content = ${esc(content)} WHERE _parent_id = ${id} AND _locale = '${loc}';`,
  )
  lines.push(
    `UPDATE _posts_v_locales SET version_title = ${esc(b.title)}, version_excerpt = ${esc(b.excerpt)}, version_content = ${esc(content)} WHERE _parent_id = (SELECT id FROM _posts_v WHERE parent_id = ${id} ORDER BY id DESC LIMIT 1) AND _locale = '${loc}';`,
  )
}
if (data.publishedDate) {
  lines.push(
    `UPDATE posts SET published_date = ${esc(data.publishedDate)}, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ${id};`,
  )
}
writeFileSync(out, lines.join('\n') + '\n')
console.log(`emit-content-fix: wrote ${lines.length} statements to ${out}`)
