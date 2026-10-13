import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const start = Date.now()
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
      created: { id: created.id, email: created.email },
      duration: Date.now() - start
    })
  } catch (e: any) {
    // Log to console for Cloudflare logs
    console.error('test-create-user-v2 error:', e)
    
    return NextResponse.json({ 
      success: false,
      error: String(e),
      message: e?.message,
      stack: e?.stack,
      name: e?.name,
      code: e?.code,
      cause: e?.cause?.message,
      duration: Date.now() - start
    }, { status: 500 })
  }
}