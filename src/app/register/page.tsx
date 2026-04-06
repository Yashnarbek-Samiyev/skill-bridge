import { getDictionary } from '@/lib/i18n'
import RegisterClient from './RegisterClient'

export default async function RegisterPage() {
  const dict = await getDictionary()

  return <RegisterClient dict={dict} />
}
