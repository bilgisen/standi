import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const config = await configPromise
    const payload = await getPayload({ config })
    
    // Use Payload's internal login mechanism
    const result = await payload.login({
      collection: 'users',
      data: {
        email: 'hbkarabey@gmail.com',
        password: 'Sivas1917',
      }
    })
    
    if (!result.token) {
      return NextResponse.json({ error: 'Login failed' }, { status: 401 })
    }
    
    const response = NextResponse.redirect('https://blog.expostep.com/admin')
    response.cookies.set('payload-token', result.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7200,
    })
    
    return response
  } catch (e: any) {
    console.error('admin-auto-login error:', e)
    return NextResponse.json({ 
      error: e.message, 
      stack: e.stack,
      name: e.name,
      code: e.code
    }, { status: 500 })
  }
}