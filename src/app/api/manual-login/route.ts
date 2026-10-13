import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // @ts-expect-error Cloudflare env
    const { env } = await import('cloudflare:workers')
    const secret = env.PAYLOAD_SECRET
    
    if (!secret) {
      return NextResponse.json({ error: 'No secret' }, { status: 500 })
    }
    
    // Generate JWT token
    const token = await new SignJWT({
      id: 1,
      email: 'hbkarabey@gmail.com',
      collection: 'users',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(new TextEncoder().encode(secret))
    
    const response = NextResponse.redirect('https://blog.expostep.com/admin')
    response.cookies.set('payload-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7200,
    })
    
    return response
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 })
  }
}