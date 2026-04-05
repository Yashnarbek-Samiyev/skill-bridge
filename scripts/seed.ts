import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const dataToSeed = [
  { name: 'Oshpazlik', icon: '🍳', services: ['Kichik banket xizmati', 'Ofislar uchun tushlik'], group: 'Pazanda-A' },
  { name: 'Avtomobil sozlash', icon: '🛠', services: ['Moy almashtirish', 'Kuzov ishlari', 'Xodovoy qismi ta\'miri'], group: 'Avto-Master' },
  { name: 'Kompyuter grafikasi', icon: '💻', services: ['Logotip dizayn', 'SMM postlar dizayni', 'Banner tayyorlash'], group: 'Grafika A-guruh' },
  { name: 'Tikuvchilik', icon: '👗', services: ['Ust kiyim tikish', 'Buyurtma asosida parda tikish', 'Kiyim ta\'miri'], group: 'Chevar-Qizlar' },
  { name: 'Mehmondo‘stlik', icon: '🏨', services: ['Mehmonxona tozalash xizmati', 'Stol bezatish (Keting)'], group: 'Hotel-Service' },
  { name: 'Elektrotexnika', icon: '⚡', services: ['Uy texnikasini ta\'mirlash', 'Platalarni lehimlash'], group: 'Elektronika-Master' },
  { name: 'Elektromontyor', icon: '🔌', services: ['Xonadon elektr simlarini ulash', 'Rozetka va lampochka o\'rnatish'], group: 'Montyor-Yigitlar' },
  { name: 'Meditsina texnika ta’miri', icon: '🏥', services: ['Tomometr ta\'miri', 'Kichik tibbiy anjomlarni sozlash'], group: 'Med-Tech' }
]

async function main() {
  console.log('Boshlandi...')
  for (const item of dataToSeed) {
    // 1. Ensure Direction
    let dir = await prisma.direction.findFirst({ where: { name: item.name } })
    if (!dir) {
      dir = await prisma.direction.create({ data: { name: item.name } })
    }

    // 2. Ensure Group
    let group = await prisma.group.findFirst({ where: { name: item.group } })
    if (!group) {
      group = await prisma.group.create({
        data: { name: item.group, directionId: dir.id, region: 'Toshkent shahri' }
      })
    }

    // 3. Ensure Services
    for (const sName of item.services) {
      let svc = await prisma.service.findFirst({ where: { name: sName, directionId: dir.id } })
      if (!svc) {
        await prisma.service.create({
          data: { name: sName, directionId: dir.id, basePrice: Math.floor(Math.random() * 150000 + 50000) }
        })
      }
    }
    console.log(`Bajarildi: ${item.name}`)
  }
}

main().then(() => console.log('Tugadi!')).catch(console.error)
