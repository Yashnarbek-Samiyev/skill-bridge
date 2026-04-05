import { getStats, getDirections, getAllUsers } from '@/lib/actions'
import prisma from '@/lib/prisma'
import { getDictionary } from '@/lib/i18n'
import { verifyUserIsLoggedIn } from '@/lib/session'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const session = await verifyUserIsLoggedIn()
  if (session.role !== 'ADMIN') return <div>Xatolik! Faqat adminlar kira oladi.</div>
  
  const dict = await getDictionary()
  const stats = await getStats()
  const directions = await getDirections()
  const users = await getAllUsers()
  
  const latestOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { service: true, group: true }
  })
  
  const groups = await prisma.group.findMany({
    include: { 
      _count: { select: { orders: true } },
      direction: true,
      leader: true
    },
    orderBy: { orders: { _count: 'desc' } }
  })

  return (
    <AdminClient 
      stats={stats} 
      latestOrders={latestOrders} 
      groups={groups} 
      users={users} 
      directions={directions}
      dict={dict.admin}
    />
  )
}
