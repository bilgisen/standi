import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // @ts-expect-error Cloudflare env
    const { env } = await import('cloudflare:workers')
    return NextResponse.json({ 
      hasSecret: !!env.PAYLOAD_SECRET,
      secretLength: env.PAYLOAD_SECRET?.length || 0,
      secretPrefix: env.PAYLOAD_SECRET?.substring(0, 4) || 'none'
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 })
  }
}