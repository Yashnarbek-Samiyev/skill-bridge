# TechWork Platform 🚀

**TechWork** — Texnikum talabalarini real buyurtmachilar bilan bog'laydigan, ularga amaliyot o'tash va daromad topish imkonini beruvchi innovatsion markazlashtirilgan platforma.

## 🌟 Asosiy Xususiyatlar

- **Ko'p tilli interfeys (i18n):** O'zbek, Rus va Ingliz tillarida to'liq lokalizatsiya.
- **Enterprise UI/UX:** Zamonaviy, "gradient-free", qora va ko'k ranglar palitrasiga asoslangan professional dizayn.
- **Rollar boshqaruvi:**
  - **Mijoz:** Buyurtma berish, jarayonni kuzatish va natijani baholash.
  - **Rahbar (Mentor):** Buyurtmalarni qabul qilish, talabalarga vazifalar taqsimlash va sifat nazorati.
  - **Talaba:** Vazifalarni bajarish, natijalarni yuklash va elektron sertifikatlar olish.
  - **Admin:** Tizim statistikasi, foydalanuvchilar va moliyaviy oqimlarni boshqarish.
- **Aqlli Yordamchi:** 3 tilda javob bera oladigan Support Bot.
- **Real-time Bildirishnomalar:** Har bir amal bo'yicha onlayn xabarnomalar tizimi.

## 🛠 Texnologiyalar

- **Framework:** Next.js 15+ (App Router)
- **Til:** TypeScript
- **Ma'lumotlar bazasi:** PostgreSQL / SQLite (Prisma ORM orqali)
- **Dizayn:** Vanilla CSS (Custom UI System)
- **Sertifikatlash:** Dinamik PDF generatsiya va QR-kodli tekshiruv.

## 🚀 Ishga tushirish

1. **Klonlash:**
   ```bash
   git clone https://github.com/Yashnarbek-Samiyev/texnikum-platform.git
   cd texnikum-platform
   ```

2. **Kutubxonalarni o'rnatish:**
   ```bash
   npm install
   ```

3. **Ma'lumotlar bazasini tayyorlash:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Dasturni ishga tushirish:**
   ```bash
   npm run dev
   ```

## 📈 Tizim Ishlash Jarayoni

1. **Buyurtma:** Mijoz xizmat turini tanlaydi va to'lovni (simulyatsiya) amalga oshiradi.
2. **Taqsimot:** Guruh rahbari yangi buyurtmani ko'radi va uni talabalarga kichik vazifalar ko'rinishida bo'lib beradi.
3. **Ijro:** Talabalar o'z panellarida vazifalarni bajarib, natijani (havola yoki fayl) yuklaydilar.
4. **Yakunlash:** Rahbar barcha vazifalar bajarilgach, loyihani yopadi.
5. **Baholash:** Mijoz natijani ko'radi va yulduzchalar bilan baholaydi. Talaba avtomatik ravishda sertifikatga ega bo'ladi.

---
*© 2026 TechWork Platformasi. Barcha huquqlar himoyalangan.*
