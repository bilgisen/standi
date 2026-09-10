import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const payload = await getPayload({ config })

    // Fetch all posts (both published and draft)
    const allPosts = await payload.find({ collection: 'posts', limit: 100 })
    const draftPosts = await payload.find({ collection: 'posts', limit: 100, draft: true })

    // Merge unique docs (drafts have different IDs)
    const seen = new Set<string>()
    const docs = [...draftPosts.docs, ...allPosts.docs].filter((d) => {
      const key = String(d.id)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    const results: string[] = []
    for (const doc of docs) {
      try {
        await payload.delete({ collection: 'posts', id: doc.id })
        results.push(`ok: ${doc.slug} (${doc.id})`)
      } catch (e: any) {
        results.push(`fail: ${doc.slug} (${doc.id}): ${e.message}`)
      }
    }
    return NextResponse.json({ total: docs.length, results })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 })
  }
}
