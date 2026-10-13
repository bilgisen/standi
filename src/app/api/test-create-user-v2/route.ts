import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const config = await configPromise
    const payload = await getPayload({ config })
    
    // Test create user
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
    // Catch ALL errors
    return NextResponse.json({ 
      error: String(e),
      message: e?.message,
      stack: e?.stack,
      name: e?.name,
      code: e?.code,
      cause: e?.cause?.message,
      status: e?.status,
      response: e?.response?.data
    }, { status: 500 })
  }
}