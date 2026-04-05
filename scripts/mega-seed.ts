import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const firstNames = ['Aziz', 'Sardor', 'Alisher', 'Rustam', 'Dilshod', 'Jahongir', 'Otabek', 'Sherzod', 'Temur', 'Shahzod', 'Malika', 'Aziza', 'Nodira', 'Sevara', 'Zilola', 'Maftuna', 'Gulnoza', 'Feruza', 'Shaxlo', 'Umida', 'Bobur', 'Sanjar', 'Jasur', 'Akmal', 'Bekzod', 'Doston', 'Umid', 'Shavkat', 'Farrux', 'Ilhom']
const lastNames = ['Aliyev', 'Valiyev', 'Karimov', 'Rahimov', 'Usmonov', 'Abdullayev', 'Tolipov', 'Yo‘ldoshev', 'Ramazonov', 'Xoliqov', 'Shukurov', 'Nazarov', 'Rustamov', 'Tursunov', 'Olimov', 'Ergashev', 'Qosimov', 'Jalilov', 'Mahmudov', 'Umarov']

const directionsData = [
  { name: 'Oshpazlik', unit: 'soat', price: 50000 },
  { name: 'Avtomobil sozlash', unit: 'dona', price: 150000 },
  { name: 'Kompyuter grafikasi va operatori', unit: 'loyha', price: 500000 },
  { name: 'Tikuvchilik', unit: 'dona', price: 75000 },
  { name: 'Mehmondo\'stlik', unit: 'kun', price: 200000 },
  { name: 'Elektrotexnika sozlash', unit: 'dona', price: 100000 },
  { name: 'Elektromontyor', unit: 'nuqta', price: 25000 },
  { name: 'Meditsina texnikalarini ta’mirlash', unit: 'dona', price: 300000 }
]

const districts = ['Chilonzor tumani', 'Yunusobod tumani', 'Mirzo Ulug\'bek tumani', 'Yashnobod tumani', 'Olmazor tumani']

async function generateMegaData() {
  console.log('--- Mega-Data Generatsiyasi Boshlandi ---')
  console.log('Barcha eski ma lumotlar tozalanmoqda...')

  await (prisma as any).notification.deleteMany()
  await (prisma as any).message.deleteMany()
  await (prisma as any).review.deleteMany()
  await prisma.task.deleteMany()
  await prisma.order.deleteMany()
  await prisma.user.deleteMany()
  await prisma.group.deleteMany()
  await prisma.service.deleteMany()
  await prisma.direction.deleteMany()

  console.log('Tozalandi! Yangi struktura yozilmoqda...')

  const admin = await prisma.user.create({ data: { name: 'Asosiy Admin', username: 'admin', password: '123', role: 'ADMIN' } })
  const client1 = await prisma.user.create({ data: { name: 'Rustam aka (Mijoz)', username: 'rustam', password: '123', role: 'CLIENT' } })
  const client2 = await prisma.user.create({ data: { name: 'Aziza opa (Mijoz)', username: 'aziza', password: '123', role: 'CLIENT' } })
  
  const yashnarbek = await prisma.user.create({ data: { name: 'Samiyev Yashnarbek', username: 'yashnarbek', password: '123', role: 'LEADER' } })

  console.log("👉 Admin, Mijozlar va Bosh O'qituvchi (yashnarbek) yaratildi.")

  let totalGroups = 0
  let totalStudents = 0

  for (let i = 0; i < directionsData.length; i++) {
    const dirInfo = directionsData[i]
    
    const dir = await prisma.direction.create({ data: { name: dirInfo.name } })
    const service = await prisma.service.create({ 
      data: { 
        name: `${dirInfo.name} xizmati`, 
        directionId: dir.id, 
        basePrice: dirInfo.price,
        unit: dirInfo.unit
      } 
    })

    for (let g = 0; g < districts.length; g++) {
      const district = districts[g]
      
      const group = await prisma.group.create({
        data: {
          name: `${dirInfo.name} - ${district.split(' ')[0]} guruhi`,
          directionId: dir.id,
          region: district,
          balance: Math.floor(Math.random() * 5000000),
          leaderId: (dirInfo.name === 'Kompyuter grafikasi va operatori' && g === 0) ? yashnarbek.id : null
        }
      })
      totalGroups++

      let usersList = []
      const hasSpecialLeader = group.leaderId !== null

      for (let s = 1; s <= 20; s++) {
        let rFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        let rLastName = lastNames[Math.floor(Math.random() * lastNames.length)]

        let genUsername = `s_${i}_${g}_${s}`

        // SHERZOD - Oshpazlik Chilonzor rahbari bo'lsin
        if (i === 0 && g === 0 && s === 1) {
          genUsername = 'sherzod'
          rFirstName = 'Sherzod'
        }

        let roleVal = 'STUDENT'
        if (genUsername === 'sherzod') {
          roleVal = 'LEADER'
        } else if (!hasSpecialLeader && s === 1) {
          roleVal = 'LEADER'
        }

        usersList.push({
          name: `${rFirstName} ${rLastName}`,
          username: genUsername,
          password: '123',
          role: roleVal,
          groupId: group.id
        })
        totalStudents++
      }

      await (prisma as any).user.createMany({ data: usersList })
      
      if (g === 0) {
        const order = await prisma.order.create({
          data: {
            clientId: client1.id,
            serviceId: service.id,
            groupId: group.id,
            description: `${dirInfo.name} bo'yicha shoshilinch buyurtma!`,
            address: district,
            region: district,
            price: service.basePrice * 5,
            status: 'PENDING'
          }
        })
      }
    }
    console.log(`✅ [${dirInfo.name}] ga ${districts.length} ta guruh yuklandi.`)
  }

  console.log('----------------------------------------------------')
  console.log(`🎉 Muvaqqiyatli!! Jami ${totalGroups} ta Guruh va ${totalStudents} ta Talaba generatsiya qilindi!`)
  console.log('Parol barchasi uchun: 123')
}

generateMegaData()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
