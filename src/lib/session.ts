import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const key = new TextEncoder().encode(process.env.SESSION_SECRET || 'techwork-super-secret-key-for-dev')

const cookie = {
  name: 'techwork_session',
  duration: 24 * 60 * 60 * 1000, // 24 hours
}

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1day')
    .sign(key)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, { algorithms: ['HS256'] })
    return payload
  } catch (error) {
    return null
  }
}

export async function createSession(userId: string, role: string) {
  const expires = new Date(Date.now() + cookie.duration)
  const session = await encrypt({ userId, role, expires })
  
  const cookieStore = await cookies()
  cookieStore.set(cookie.name, session, { expires, httpOnly: true, sameSite: 'lax' })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(cookie.name)
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get(cookie.name)?.value
  if (!session) return null
  return await decrypt(session)
}

export async function verifyUserIsLoggedIn() {
  const payload = await getSession()
  if (!payload || !payload.userId) {
    redirect('/login')
  }
  return payload
}
