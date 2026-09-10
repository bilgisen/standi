import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    // @ts-expect-error Cloudflare env
    const { env } = await import('cloudflare:workers')
    const d1 = env.D1

    // Find all posts
    const all = await d1.prepare('SELECT id, slug, _status FROM posts LIMIT 100').all()
    const results: string[] = []

    for (const row of all.results as any[]) {
      await d1.prepare('DELETE FROM posts WHERE id = ?').bind(row.id).run()
      results.push(`deleted: id=${row.id} slug=${row.slug} status=${row._status}`)
    }

    // Also delete any version rows
    const versions = await d1.prepare("SELECT id, parent_id, _status FROM posts_versions LIMIT 100").all()
    for (const row of versions.results as any[]) {
      await d1.prepare('DELETE FROM posts_versions WHERE id = ?').bind(row.id).run()
      results.push(`deleted version: id=${row.id} parent=${row.parent_id}`)
    }

    return NextResponse.json({ total: results.length, results })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 })
  }
}
