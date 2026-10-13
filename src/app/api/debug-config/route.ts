import { NextResponse } from 'next/server'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const config = await configPromise
    return NextResponse.json({ 
      secret: config.secret ? 'SET' : 'EMPTY',
      secretLength: config.secret?.length || 0,
      collections: config.collections?.map(c => c.slug) || []
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 })
  }
}