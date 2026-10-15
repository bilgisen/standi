// Re-insert a missing posts_locales row from local JSON (recovery helper).
//   npx tsx scripts/restore-locale-row.ts --key <key> --id <postId> --locale tr --out tmp/restore.sql
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

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
const locale = flagValue(args, '--locale') || 'tr'
const out = join(process.cwd(), flagValue(args, '--out') || 'tmp/restore.sql')
if (!key) {
  console.error('restore-locale-row: --key is required')
  process.exit(1)
}

const data = JSON.parse(readFileSync(join(process.cwd(), 'content/blog', `${key}.json`), 'utf8'))
const rest = JSON.parse(
  readFileSync(join(process.cwd(), 'tmp/rest', `${key}.${locale}.json`), 'utf8'),
)
const sql =
  `INSERT INTO posts_locales (title, excerpt, content, _locale, _parent_id, slug) VALUES (` +
  `${esc(rest.title)}, ${esc(rest.excerpt)}, ${esc(JSON.stringify(rest.content))}, '${locale}', ${id}, ${esc(rest.slug)});`
writeFileSync(out, sql + '\n')
console.log(`restore-locale-row: wrote INSERT for post ${id} locale ${locale} (title: ${data[locale].title.slice(0, 40)}...)`)
