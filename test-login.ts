import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const u = await prisma.user.findUnique({ where: { username: 'yashnarbek' }, include: { ledGroups: true, group: true }})
  console.log(u?.ledGroups.length)
}
main()
