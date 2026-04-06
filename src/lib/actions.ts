'use server'

import prisma from './prisma'
import { revalidatePath } from 'next/cache'
import { createSession } from './session'
import { redirect } from 'next/navigation'

// -- SEED DATA IF EMPTY --
export async function seedInitialData() {
  const dirCount = await prisma.direction.count()
  if (dirCount === 0) {
    const dir = await prisma.direction.create({
      data: { name: 'Kompyuter grafikasi' }
    })
    const service = await prisma.service.create({
      data: { name: 'Logotip dizayn', directionId: dir.id, basePrice: 150000 }
    })
    const group = await prisma.group.create({
      data: { name: 'Grafika A-guruh', directionId: dir.id, region: 'Toshkent shahri' }
    })
    const user = await prisma.user.create({
      data: { name: 'Shavkat', username: 'client1', password: 'password', role: 'CLIENT' }
    })
  }
}

// Helper: create a notification record
async function notify(userId: string, message: string, type: string = 'INFO') {
  try {
    await prisma.notification.create({ 
      data: { 
        userId, 
        title: message, // In schema it is 'title', not 'message'
        type, 
        read: false 
      } 
    })
  } catch (e) {
    console.error("Notification Error:", e)
  }
}

export async function createOrder(data: { 
  clientId: string, 
  serviceId: string, 
  description: string, 
  address: string, 
  region: string, 
  price: number,
  qty: number,
  deadline?: Date
}) {
  const service = await prisma.service.findUnique({ where: { id: data.serviceId }, include: { direction: true } })
  if (!service) throw new Error('Service not found')

  const group = await prisma.group.findFirst({ 
    where: { 
      directionId: service.directionId,
      region: data.region
    } 
  })

  const order = await prisma.order.create({
    data: {
      clientId: data.clientId,
      serviceId: data.serviceId,
      groupId: group?.id || null,
      description: data.description,
      address: data.address,
      region: data.region,
      price: data.price,
      status: 'PENDING_APPROVAL',
      deadline: data.deadline
    },
    include: { client: true, service: true }
  })

  // Notify group leader
  if (group?.leaderId) {
    await notify(
      group.leaderId,
      `📦 Yangi buyurtma: "${order.service.name}" — ${order.client?.name || 'Mijoz'} tomonidan`,
      'ORDER'
    )
  }

  // Notify all students in the group
  if (group?.id) {
    const students = await prisma.user.findMany({
      where: { groupId: group.id, role: 'STUDENT' }
    })
    for (const s of students) {
      await notify(s.id, `🛠️ Guruhingizga yangi ish keldi: "${order.service.name}"`, 'ORDER')
    }
  }

  revalidatePath('/client')
  revalidatePath('/admin')
  revalidatePath('/leader')
  return order
}

export async function getOrdersByClient(clientId: string) {
  return await prisma.order.findMany({
    where: { clientId },
    include: { service: true, tasks: true, review: true, messages: { include: { sender: true } } },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getOrdersByGroup(groupId: string) {
  return await prisma.order.findMany({
    where: { groupId },
    include: { service: true, client: true },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getServices() {
  return await prisma.service.findMany({ include: { direction: true } })
}

export async function handleSendMessage(orderId: string, senderId: string, content: string) {
  if (!content.trim()) return

  // Get order with client info
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { group: { include: { leader: true } }, client: true }
  })

  const msg = await prisma.message.create({
    data: { orderId, senderId, content },
    include: { sender: true }
  })

  // Determine who to notify
  if (order) {
    // If sender is the client → notify leader
    if (senderId === order.clientId && order.group?.leaderId) {
      await notify(
        order.group.leaderId,
        `💬 ${order.client?.name || 'Mijoz'} xabar yubordi: "${content.slice(0, 60)}..."`,
        'MESSAGE'
      )
    }
    // If sender is the leader or student → notify client
    if (senderId !== order.clientId && order.clientId) {
      await notify(
        order.clientId,
        `💬 Guruhdan yangi xabar: "${content.slice(0, 60)}..."`,
        'MESSAGE'
      )
    }
  }

  revalidatePath('/client')
  revalidatePath('/leader')
  revalidatePath('/student')
}

export async function getTopGroups() {
  return await prisma.group.findMany({
    orderBy: { balance: 'desc' },
    take: 5
  })
}

export async function getTopStudents() {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: {
      _count: { select: { tasks: { where: { status: 'DONE' } } } },
      group: true
    },
    orderBy: { tasks: { _count: 'desc' } },
    take: 5
  })
  return students
}

export async function getRecentActivities() {
  const orders = await prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { client: true, service: true } })
  const reviews = await prisma.review.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { client: true } })
  const tasks = await prisma.task.findMany({ where: { status: 'DONE' }, take: 5, orderBy: { createdAt: 'desc' }, include: { assignedTo: true } })

  let feed = [
    ...orders.map(o => ({ id: 'o'+o.id, type: 'Order', content: `${o.client?.name || 'Mijoz'} yangi buyurtma berdi (xizmat: ${o.service.name})`, date: o.createdAt, icon: '🛍️', color: 'var(--primary)' })),
    ...reviews.map(r => ({ id: 'r'+r.id, type: 'Review', content: `${r.client?.name || 'Mijoz'} bajarilgan vazifaga ${'⭐'.repeat(r.rating)} baho berdi!`, date: r.createdAt, icon: '🏆', color: 'var(--gold)' })),
    ...tasks.map(t => ({ id: 't'+t.id, type: 'Task', content: `${t.assignedTo?.name || 'Talaba'} jamoaviy topshiriqni muvaffaqiyatli yakunladi.`, date: t.createdAt, icon: '✅', color: 'var(--ok)' }))
  ]

  feed.sort((a, b) => b.date.getTime() - a.date.getTime())
  return feed.slice(0, 6)
}

export async function getNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 30
  })
}

// Polling helper
export async function getLatestNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: { userId, read: false },
    orderBy: { createdAt: 'desc' },
    take: 10
  })
}

export async function getLatestMessages(orderId: string, lastId: string) {
  return await prisma.message.findMany({
    where: { 
      orderId,
      id: { gt: lastId }
    },
    include: { sender: true },
    orderBy: { createdAt: 'asc' }
  })
}

export async function markNotificationsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true }
  })
  revalidatePath('/', 'layout')
}

export async function markOneNotificationRead(notificationId: string) {
  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true }
  })
  revalidatePath('/', 'layout')
}

export async function getStats() {
  const totalOrders = await prisma.order.count()
  const revenue = await prisma.order.aggregate({
    _sum: { price: true },
    where: { status: 'COMPLETED' }
  })
  
  const totalBalance = await prisma.group.aggregate({
    _sum: { balance: true }
  })

  const totalGroups = await prisma.group.count()
  const activeStudents = await prisma.user.count({ where: { role: 'STUDENT' } })

  return { 
    totalOrders, 
    revenue: revenue._sum.price || 0, 
    totalBalance: totalBalance._sum.balance || 0,
    totalGroups, 
    activeStudents 
  }
}

export async function createReview(orderId: string, rating: number, comment: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order || !order.groupId) throw new Error('Yaroqsiz buyurtma')

  const review = await prisma.review.create({
    data: { orderId, clientId: order.clientId, groupId: order.groupId, rating, comment }
  })

  // Notify client order is rated
  if (order.clientId) {
    await notify(order.clientId, `⭐ Bahoyingiz qabul qilindi. Rahmat!`, 'INFO')
  }

  revalidatePath('/client')
  revalidatePath('/admin')
  return review
}
export async function createUser(data: { name: string, username: string, password: string, role: string, phone?: string, groupId?: string }) {
  // Check for duplicate username
  const existingUsername = await prisma.user.findUnique({ where: { username: data.username } })
  if (existingUsername) {
    return { error: 'usernameTaken' }
  }

  // Check for duplicate phone if provided
  if (data.phone) {
    const existingPhone = await prisma.user.findFirst({ where: { phone: data.phone } })
    if (existingPhone) {
      return { error: 'userExists' }
    }
  }

  try {
    const user = await prisma.user.create({ data })
    revalidatePath('/admin')
    return { success: true, user }
  } catch (e) {
    return { error: 'generic' }
  }
}

export async function handleRegisterAction(prevState: any, formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const username = (formData.get('username') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()
  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string

  if (!name || !username || !password || !phone) return { error: 'fillAll' }
  if (password !== confirm) return { error: 'passwordMatch' }
  if (password.length < 4) return { error: 'generic' }

  const result = await createUser({
    name,
    username,
    password,
    phone,
    role: 'CLIENT',
  })

  if (result.error) return { error: result.error }
  
  if (result.user) {
    await createSession(result.user.id, result.user.role)
    redirect('/client')
  }
  return { error: 'generic' }
}

export async function handleLoginAction(prevState: any, formData: FormData) {
  const username = (formData.get('username') as string)?.trim()
  const password = formData.get('password') as string
  
  if (!username || !password) return { error: 'fillAll' }

  const user = await prisma.user.findUnique({ where: { username } })
  if (user && user.password === password) {
    await createSession(user.id, user.role)
    
    let path = '/'
    if (user.role === 'ADMIN') path = '/admin'
    else if (user.role === 'LEADER') path = '/leader'
    else if (user.role === 'STUDENT') path = '/student'
    else if (user.role === 'CLIENT') path = '/client'
    
    redirect(path)
  }

  return { error: 'invalidCredentials' }
}

export async function createGroup(data: { name: string, directionId: string, region: string, leaderId?: string }) {
  const group = await prisma.group.create({ data })
  revalidatePath('/admin')
  return group
}

export async function updateService(id: string, data: { name?: string, basePrice?: number, unit?: string }) {
  const service = await prisma.service.update({ where: { id }, data })
  revalidatePath('/admin')
  revalidatePath('/client')
  return service
}

export async function approveOrder(orderId: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: 'IN_PROGRESS' }
  })
  
  if (order.clientId) {
    await notify(order.clientId, `✅ Buyurtmangiz tasdiqlandi va ish boshlandi!`, 'ORDER')
  }
  
  revalidatePath('/leader')
  revalidatePath('/client')
  return order
}

export async function completeOrder(orderId: string, fileUrl?: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order || order.status === 'COMPLETED') return

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'COMPLETED', fileUrl: fileUrl || null }
  })

  if (order.groupId) {
    await prisma.group.update({
      where: { id: order.groupId },
      data: { balance: { increment: order.price } }
    })
  }

  if (order.clientId) {
    await notify(order.clientId, `🔔 Ish bajarildi! Iltimos, natijani tekshiring va tasdiqlang.`, 'ORDER')
  }

  revalidatePath('/leader')
  revalidatePath('/client')
  revalidatePath('/admin')
}

export async function withdrawFunds(groupId: string) {
  await prisma.group.update({
    where: { id: groupId },
    data: { balance: 0 }
  })
  revalidatePath('/admin')
  revalidatePath('/leader')
}

export async function updateTaskResult(taskId: string, result: string) {
  await prisma.task.update({
    where: { id: taskId },
    data: { 
      status: 'DONE',
      result: result 
    }
  })
  revalidatePath('/student')
  revalidatePath('/leader')
}

export async function getDirections() {
  return await prisma.direction.findMany({ include: { groups: true, services: true } })
}

export async function getAllUsers() {
  return await prisma.user.findMany({ include: { group: true } })
}
