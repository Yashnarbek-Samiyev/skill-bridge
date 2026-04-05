import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Fake ma\'lumotlarni generatsiya qilish boshlandi...')

  // 1. Tozalamiz
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.review.deleteMany()
  await prisma.task.deleteMany()
  await prisma.order.deleteMany()
  await prisma.user.deleteMany()

  // 2. Rollarni yaratamiz
  const admin = await prisma.user.create({ data: { name: 'Asosiy Admin', username: 'admin', password: '123', role: 'ADMIN' } })
  const client1 = await prisma.user.create({ data: { name: 'Rustam (Mijoz)', username: 'rustam', password: '123', role: 'CLIENT' } })
  const client2 = await prisma.user.create({ data: { name: 'Aziza (Mijoz)', username: 'aziza', password: '123', role: 'CLIENT' } })

  const grafikaGuruh = await prisma.group.findFirst({ where: { name: 'Grafika A-guruh' } })
  const oshpazlarGuruh = await prisma.group.findFirst({ where: { name: 'Pazanda-A' } })

  if (!grafikaGuruh || !oshpazlarGuruh) {
    console.error('Baza boshlang\'ich holati yo\'q. Avval seed.ts ni ishlating!')
    return
  }

  // Leader va Student
  const leader1 = await prisma.user.create({ data: { name: 'Sherzod (Rahbar)', username: 'sherzod', password: '123', role: 'LEADER', groupId: grafikaGuruh.id } })
  const student1 = await prisma.user.create({ data: { name: 'Alisher (Talaba)', username: 'alisher', password: '123', role: 'STUDENT', groupId: grafikaGuruh.id } })
  const student2 = await prisma.user.create({ data: { name: 'Malika (Talaba)', username: 'malika', password: '123', role: 'STUDENT', groupId: grafikaGuruh.id } })

  const sOshpaz = await prisma.user.create({ data: { name: 'Sardor (Talaba)', username: 'sardor', password: '123', role: 'STUDENT', groupId: oshpazlarGuruh.id } })

  // 3. Xizmatlarni olamiz
  const sLogo = await prisma.service.findFirst({ where: { name: 'Logotip dizayn' } })
  const sSMM = await prisma.service.findFirst({ where: { name: 'SMM postlar dizayni' } })
  const sBanner = await prisma.service.findFirst({ where: { name: 'Banner tayyorlash' } })
  const sBanket = await prisma.service.findFirst({ where: { name: 'Kichik banket xizmati' } })

  // 4. Orderlar (Buyurtmalar)
  // Bajarilgan buyurtmalar
  const o1 = await prisma.order.create({
    data: {
      clientId: client1.id, serviceId: sLogo!.id, groupId: grafikaGuruh.id,
      description: 'TechWork uchun chiroyli logotip kerak edi.',
      address: 'Onlayn', region: 'Toshkent shahri', price: 150000, qty: 1, status: 'COMPLETED'
    }
  })
  
  await prisma.review.create({
    data: { orderId: o1.id, clientId: client1.id, groupId: grafikaGuruh.id, rating: 5, comment: 'Talabalar juda zo\'r ishladi!' }
  })

  const o2 = await prisma.order.create({
    data: {
      clientId: client2.id, serviceId: sBanket!.id, groupId: oshpazlarGuruh.id,
      description: 'Kichik ofis bayrami uchun tushlik.',
      address: 'Chilonzor, 4-kvartal', region: 'Toshkent shahri', price: 400000, qty: 1, status: 'COMPLETED'
    }
  })

  await prisma.review.create({
    data: { orderId: o2.id, clientId: client2.id, groupId: oshpazlarGuruh.id, rating: 4, comment: 'Ovqatlar mazali, yetkazib berish sal kechikdi.' }
  })

  // Kutlayotgan (Jarayondagi) buyurtmalar
  const o3 = await prisma.order.create({
    data: {
      clientId: client1.id, serviceId: sSMM!.id, groupId: grafikaGuruh.id,
      description: 'Instagram uchun 5 ta post tayyorlash.',
      address: 'Onlayn', region: 'Toshkent shahri', price: 250000, qty: 5, status: 'PENDING'
    }
  })

  // Unga vazifalar biriktiramiz
  await prisma.task.create({ data: { orderId: o3.id, title: '2 ta post dizayni tayyorlash', assignedToId: student1.id, status: 'DONE' } })
  await prisma.task.create({ data: { orderId: o3.id, title: 'Qolgan 3 ta postni tayyorlash', assignedToId: student2.id, status: 'TODO' } })

  const o4 = await prisma.order.create({
    data: {
      clientId: client2.id, serviceId: sBanner!.id, groupId: grafikaGuruh.id,
      description: 'Do\'kon ochilishi uchun katta banner dizayni. Qo\'shimcha talablarni fayldan ko\'ring.',
      address: 'Yunusobod', region: 'Toshkent shahri', price: 100000, qty: 1, status: 'PENDING',
      fileUrl: '/fake-docs/texnik-topshiriq.pdf'
    }
  })
  
  await prisma.task.create({ data: { orderId: o4.id, title: 'Boshlang\'ich eskiz chizish', assignedToId: student1.id, status: 'TODO' } })

  // --- MEGA MODULLAR UCHUN JONLI DATA ---
  
  // 1. Chat (Yozishmalar)
  await prisma.message.create({ data: { orderId: o4.id, senderId: client2.id, content: 'Assalomu alaykum, banner yorqin ranglarda bo\'lishi kerak!' } })
  await prisma.message.create({ data: { orderId: o4.id, senderId: leader1.id, content: 'Va alaykum assalom, qabul qildik, eskizni ertaga guruhga tashlaymiz.' } })
  await prisma.message.create({ data: { orderId: o4.id, senderId: student1.id, content: 'Ustoz, eskiz faylini qaerdan olamiz?' } })
  
  await prisma.message.create({ data: { orderId: o3.id, senderId: student2.id, content: 'Loyihaga ozgina vaqt yetmayapti.' } })
  
  // 2. Notifications (Bildirishnomalar)
  await prisma.notification.create({ data: { userId: client2.id, title: 'Sizning buyurtmangiz ishga qabul qilindi!' } })
  await prisma.notification.create({ data: { userId: student1.id, title: 'Sizga yangi vazifa tushdi: Eskiz chizish' } })
  await prisma.notification.create({ data: { userId: leader1.id, title: 'Yangi xabar keldi ("Do\'kon banneri" bo\'yicha)' } })
  await prisma.notification.create({ data: { userId: admin.id, title: 'Sistemada yangi guruh ochildi: Pazanda-A' } })

  console.log('Ideallashtirilgan Mega-Data joriy etildi! (Mijozlar, Chatlar, Fayllar, Bildirishnomalar)')
}

main().catch(console.error)
