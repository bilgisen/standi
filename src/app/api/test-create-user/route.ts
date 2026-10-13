import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const config = await configPromise
    const payload = await getPayload({ config })
    
    // Test delete
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: 'hbkarabey@gmail.com' } },
      limit: 1
    })
    
    if (existing.docs.length > 0) {
      await payload.delete({
        collection: 'users',
        id: existing.docs[0].id
      })
    }
    
    // Test create
    const created = await payload.create({
      collection: 'users',
      data: {
        email: 'hbkarabey@gmail.com',
        password: 'Sivas1917',
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      created: { id: created.id, email: created.email }
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