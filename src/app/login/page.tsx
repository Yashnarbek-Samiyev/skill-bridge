import { getDictionary } from '@/lib/i18n'
import LoginClient from './LoginClient'

export default async function LoginPage() {
  const dict = await getDictionary()

  return <LoginClient dict={dict} />
}
