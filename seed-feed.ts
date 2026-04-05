import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
  const c = await prisma.user.findFirst({ where: { role: 'CLIENT' }})
  const s = await prisma.user.findFirst({ where: { role: 'STUDENT' }})
  const o = await prisma.order.findFirst({ where: { status: 'COMPLETED' }})
  
  if (o && c) {
    await prisma.review.create({
      data: { orderId: o.id, clientId: c.id, groupId: o.groupId!, rating: 5, comment: "Juda tez va sifatli ishlashdi!" }
    }).catch(e => {})
  }
  
  const o2 = await prisma.order.findFirst({ where: { status: 'PENDING' }})
  if (o2 && s) {
    await prisma.task.create({
      data: { orderId: o2.id, title: 'Logotip eskizini chizish', status: 'DONE', assignedToId: s.id }
    }).catch(e => {})
    await prisma.task.create({
      data: { orderId: o2.id, title: 'Mijozga taqdim etish', status: 'DONE', assignedToId: s.id }
    }).catch(e => {})
  }
}
seed()
