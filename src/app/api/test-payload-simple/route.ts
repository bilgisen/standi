import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const config = await configPromise
    const payload = await getPayload({ config })
    
    // Test just find
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: 'hbkarabey@gmail.com' } },
      limit: 1
    })
    
    return NextResponse.json({ 
      success: true, 
      count: existing.docs.length,
      docs: existing.docs.map(d => ({ id: d.id, email: d.email }))
    })
  } catch (e: any) {
    return NextResponse.json({ 
      error: e.message, 
      stack: e.stack, 
      name: e.name, 
      code: e.code,
      cause: e.cause?.message
    }, { status: 500 })
  }
}