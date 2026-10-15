// Stable blog seeding: local JSON (content/blog/*.json) -> Payload Posts.
// Dry-run validates + converts without touching the database:
//   npx tsx scripts/seed-blog-posts.ts --dry-run
// Live upsert (needs PAYLOAD_SECRET + D1/R2 bindings via wrangler env):
//   npx tsx scripts/seed-blog-posts.ts --key exhibition-stand-attracts-visitors
//
// Each JSON holds BOTH locales in ONE document, so EN/TR slugs stay linked
// by the same Payload id (this is what hreflang + LanguageSwitcher rely on).

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { markdownToLexical } from './lib/blog-lexical.js'

interface LocaleBlock {
  title: string
  slug: string
  excerpt: string
  bodyMarkdown: string
}

interface BlogFile {
  key: string
  publishedDate?: string
  category?: string | number | null
  tags?: string[]
  en: LocaleBlock
  tr: LocaleBlock
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function fail(msg: string): never {
  console.error(`blog-seed: ${msg}`)
  process.exit(1)
}

function checkBlock(name: string, b: LocaleBlock | undefined, errors: string[]) {
  if (!b) {
    errors.push(`${name}: missing locale block`)
    return
  }
  if (!b.title?.trim()) errors.push(`${name}.title is required`)
  if (!b.slug?.trim()) errors.push(`${name}.slug is required`)
  else if (!SLUG_RE.test(b.slug)) errors.push(`${name}.slug must match ${SLUG_RE} (got "${b.slug}")`)
  if (!b.excerpt?.trim()) errors.push(`${name}.excerpt is required`)
  if (!b.bodyMarkdown?.trim()) errors.push(`${name}.bodyMarkdown is required`)
}

function validateFile(file: string, data: BlogFile): { warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []
  if (!data.key?.trim()) errors.push('key is required')
  if (data.publishedDate && Number.isNaN(Date.parse(data.publishedDate))) {
    errors.push(`publishedDate is not a valid date (got "${data.publishedDate}")`)
  }
  checkBlock('en', data.en, errors)
  checkBlock('tr', data.tr, errors)
  if (data.en?.slug && data.tr?.slug && data.en.slug === data.tr.slug) {
    warnings.push('en.slug equals tr.slug; distinct slugs are recommended for hreflang mapping')
  }
  if (errors.length) fail(`${file}:\n  - ${errors.join('\n  - ')}`)
  return { warnings }
}

function flagValue(args: string[], flag: string): string | undefined {
  const i = args.indexOf(flag)
  if (i === -1) return undefined
  const v = args[i + 1]
  if (!v || v.startsWith('--')) return undefined
  return v
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const keyFilter = flagValue(args, '--key')
  const dirArg = flagValue(args, '--dir')
  const dir = join(process.cwd(), dirArg || 'content/blog')

  let files: string[]
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.json'))
  } catch {
    fail(`cannot read directory ${dir}`)
  }
  if (files.length === 0) fail(`no *.json files in ${dir}`)

  const docs: { file: string; data: BlogFile }[] = files.map((file) => {
    const data = JSON.parse(readFileSync(join(dir, file), 'utf8')) as BlogFile
    if (keyFilter && data.key !== keyFilter && file.replace(/\.json$/, '') !== keyFilter) {
      return null
    }
    const { warnings } = validateFile(file, data)
    for (const w of warnings) console.warn(`blog-seed: warning ${file}: ${w}`)
    // Conversion check (also proves renderer-compatible output).
    for (const loc of ['en', 'tr'] as const) {
      const root = markdownToLexical(data[loc].bodyMarkdown)
      if (root.root.children.length === 0) fail(`${file}: ${loc} body produced 0 blocks`)
    }
    return { file, data }
  }).filter((x): x is { file: string; data: BlogFile } => x !== null)

  if (docs.length === 0) fail(`no matching posts${keyFilter ? ` for key "${keyFilter}"` : ''}`)

  console.log(`blog-seed: validated ${docs.length} post(s) from ${dir}`)
  for (const { file, data } of docs) {
    console.log(`  - ${data.key} (${file}): en=/${data.en.slug} tr=/${data.tr.slug}`)
  }

  if (dryRun) {
    console.log('blog-seed: dry-run OK (no database writes)')
    return
  }

  // Live path: dynamic import so dry-run never needs Payload/D1 bindings.
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config.js')
  const payload = await getPayload({ config })

  for (const { data } of docs) {
    const existing = await payload.find({
      collection: 'posts',
      locale: 'en',
      limit: 1,
      where: { slug: { equals: data.en.slug } },
    })
    // Localized sub-objects are valid at runtime; generated types model the
    // default-locale scalar shape, hence the narrow cast.
    const docData = {
      title: { en: data.en.title, tr: data.tr.title },
      slug: { en: data.en.slug, tr: data.tr.slug },
      excerpt: { en: data.en.excerpt, tr: data.tr.excerpt },
      content: {
        en: markdownToLexical(data.en.bodyMarkdown),
        tr: markdownToLexical(data.tr.bodyMarkdown),
      },
      publishedDate: data.publishedDate,
      ...(data.category ? { category: data.category } : {}),
      tags: (data.tags || []).map((tag) => ({ tag })),
      _status: 'published' as const,
    } as any
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'posts',
        id: existing.docs[0].id,
        data: docData,
      })
      console.log(`blog-seed: updated "${data.key}" (id ${existing.docs[0].id})`)
    } else {
      const created = await payload.create({ collection: 'posts', data: docData })
      console.log(`blog-seed: created "${data.key}" (id ${created.id})`)
    }
  }
}

main().catch((e) => {
  console.error('blog-seed: failed:', e?.message || e)
  process.exit(1)
})
