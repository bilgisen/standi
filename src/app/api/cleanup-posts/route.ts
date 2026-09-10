import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST() {
  try {
    const payload = await getPayload({ config })
    const drafts = await payload.find({ collection: 'posts', limit: 100, draft: true })
    const results: string[] = []
    for (const doc of drafts.docs) {
      await payload.delete({ collection: 'posts', id: doc.id })
      results.push(`${doc.slug} (${doc.id})`)
    }
    return NextResponse.json({ deleted: results.length, docs: results })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
