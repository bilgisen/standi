import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const config = await configPromise
    const payload = await getPayload({ config })
    
    // Test find
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: 'hbkarabey@gmail.com' } },
      limit: 1
    })
    
    if (existing.docs.length === 0) {
      return NextResponse.json({ success: true, message: 'No user to delete' })
    }
    
    const userId = existing.docs[0].id
    
    // Test delete
    await payload.delete({
      collection: 'users',
      id: userId
    })
    
    return NextResponse.json({ 
      success: true, 
      message: `Deleted user ${userId}`
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