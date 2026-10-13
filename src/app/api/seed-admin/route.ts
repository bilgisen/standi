import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const payload = await getPayload({ config })
    
    // Check if user exists
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: 'hbkarabey@gmail.com' } },
      limit: 1
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({ success: true, message: 'User already exists' })
    }

    // Create admin user
    await payload.create({
      collection: 'users',
      data: {
        email: 'hbkarabey@gmail.com',
        password: 'Sivas1917',
      }
    })

    return NextResponse.json({ success: true, message: 'Admin user created' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 })
  }
}