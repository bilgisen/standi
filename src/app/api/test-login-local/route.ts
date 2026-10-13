import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const config = await configPromise
    const payload = await getPayload({ config })
    
    // Test login via local API
    const result = await payload.login({
      collection: 'users',
      data: {
        email: 'hbkarabey@gmail.com',
        password: 'Sivas1917',
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      result: { token: result.token?.substring(0, 20) + '...', user: result.user?.email }
    })
  } catch (e: any) {
    console.error('login test error:', e)
    return NextResponse.json({ 
      error: String(e),
      message: e?.message,
      stack: e?.stack,
      name: e?.name,
      code: e?.code,
      cause: e?.cause?.message
    }, { status: 500 })
  }
}