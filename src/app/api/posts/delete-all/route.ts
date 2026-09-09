import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function DELETE() {
  try {
    const payload = await getPayload({ config })
    const posts = await payload.find({ collection: 'posts', limit: 100 })
    
    for (const post of posts.docs) {
      await payload.delete({ collection: 'posts', id: post.id })
    }
    
    return NextResponse.json({ success: true, deleted: posts.docs.length })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
