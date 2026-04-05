import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const directions = [
  "Oshpazlik",
  "Avtomobil sozlash",
  "Kompyuter grafikasi",
  "Tikuvchilik",
  "Mehmondo‘stlik",
  "Elektrotexnika",
  "Elektromontyor",
  "Meditsina texnika ta’miri"
];

const firstNamesMale = [
  "Alisher",
  "Sardor",
  "Sherzod",
  "Rustam",
  "Bekzod",
  "Jasur",
  "Olim",
  "Farhod",
  "Aziz",
  "Jamshid",
  "Ulugbek",
  "Doston",
  "Shoxruh",
  "Bobur",
  "Temur",
  "Zafar",
  "Nodir",
  "Ravshan",
  "Akmal",
  "Bahrom",
  "Javlon",
  "Farruh",
  "Anvar",
  "Gulom",
  "Xasan",
  "Ibrohim",
  "Muhammad",
  "Abdulloh",
  "Islom",
  "Said"
];

const firstNamesFemale = [
  "Malika",
  "Aziza",
  "Dilnoza",
  "Gulnora",
  "Madina",
  "Zarina",
  "Nargiza",
  "Shahnoza",
  "Feruza",
  "Laylo",
  "Zuhra",
  "Saida",
  "Munisa",
  "Nilufar",
  "Gulchehra",
  "Yulduz",
  "Shirin",
  "Dilafruz",
  "Zilola",
  "Sevinch",
  "Gulbahor",
  "Maftuna",
  "Umida",
  "Fotima",
  "Ziyoda",
  "Lola",
  "Nodira",
  "Rano",
  "Sabina",
  "Xurshida"
];

const surnames = [
  "Karimov",
  "Tursunov",
  "Abdullayev",
  "Ismailov",
  "Rahimov",
  "Saidov",
  "Yusupov",
  "Aliyev",
  "Hasanov",
  "Mirzayev",
  "Qodirov",
  "Xudoyberdiyev",
  "Toshmatov",
  "Ergashev",
  "Sobirov",
  "Raximov",
  "Xolmatov",
  "Gulomov",
  "Sattorov",
  "Mamatqulov",
  "Nazarov",
  "Usmonov",
  "Axmedov",
  "Salimov",
  "Xakimova",
  "Rasulova",
  "Toirov",
  "Jumayev",
  "Kurbanov",
  "Sharipov"
];

function getRandomElement(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Talabalar va guruhlar yaratish boshlandi...");

  let studentCounter = 1;

  for (const dirName of directions) {
    // Ensure direction exists
    let direction = await prisma.direction.findFirst({
      where: { name: dirName }
    });
    if (!direction) {
      direction = await prisma.direction.create({ data: { name: dirName } });
    }

    // Create 10 groups
    for (let i = 1; i <= 10; i++) {
      const groupName = `${dirName}-${i}`;
      let group = await prisma.group.findFirst({ where: { name: groupName } });
      if (!group) {
        group = await prisma.group.create({
          data: {
            name: groupName,
            directionId: direction.id,
            region: "Toshkent shahri"
          }
        });
      }

      // Create 30 students
      for (let j = 1; j <= 30; j++) {
        const isMale = Math.random() > 0.5;
        const firstName = isMale
          ? getRandomElement(firstNamesMale)
          : getRandomElement(firstNamesFemale);
        const surname = getRandomElement(surnames);
        const fullName = `${firstName} ${surname}`;
        const username = `student${studentCounter}`; // unique username

        await prisma.user.create({
          data: {
            name: fullName,
            username: username,
            password: "123",
            role: "STUDENT",
            groupId: group.id
          }
        });
        studentCounter++;
      }
      console.log(`Guruh ${groupName} yaratildi, 30 ta talaba qo'shildi.`);
    }
  }

  console.log("Barcha talabalar va guruhlar yaratildi!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
