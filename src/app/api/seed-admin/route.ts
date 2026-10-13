import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const config = await configPromise
    const payload = await getPayload({ config })
    
    // Delete existing user
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

    // Create admin user with new secret
    await payload.create({
      collection: 'users',
      data: {
        email: 'hbkarabey@gmail.com',
        password: 'Sivas1917',
      }
    })

    return NextResponse.json({ success: true, message: 'Admin user recreated' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack, name: e.name, code: e.code }, { status: 500 })
  }
}