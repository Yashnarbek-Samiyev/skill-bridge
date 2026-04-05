import { cookies } from 'next/headers'

export type Locale = 'uz' | 'ru' | 'en'

export interface Dictionary {
  nav: {
    home: string; client: string; student: string; leader: string; admin: string;
    about: string; faq: string; help: string; login: string; logout: string;
    register: string; services: string; search: string; forStudents: string;
    contact: string;
  };
  home: {
    badge: string; heroTitle: string; heroSub: string; statsStudents: string;
    statsOrders: string; statsGroups: string; statsRevenue: string;
    directionsTitle: string; cta: string; howItWorks: string;
    step1Title: string; step1Desc: string; step2Title: string; step2Desc: string;
    step3Title: string; step3Desc: string; whyUs: string;
    why1Title: string; why1Desc: string; why2Title: string; why2Desc: string;
    why3Title: string; why3Desc: string; topStudentsTitle: string;
    topStudentsSub: string; champion: string; tasksCount: string;
    liveActivityTitle: string; faqTitle: string;
    faqs: { q: string; a: string }[];
    helpTitle: string; helpDesc: string; phoneLabel: string; emailLabel: string;
  };
  footerCopy1: string;
  footerCopy2: string;
  footerCol1Title: string;
  footerCol1Desc: string;
  footerCol2Title: string;
  footerCol3Title: string;
  footerCol4Title: string;
  newsletterTitle: string;
  newsletterSub: string;
  newsletterBtn: string;
  login: {
    title: string; sub: string; username: string; password: string; btn: string; demoTitle: string; noAccount: string;
    roles: { admin: string; leader: string; student: string; client: string };
  };
  register: {
    title: string; sub: string; fullName: string; phone: string; username: string; password: string; confirm: string; btn: string; haveAccount: string;
  };
  client: {
    newOrder: string; myOrders: string; step1: string; step2: string; step3: string;
    qty: string; region: string; address: string; desc: string; back: string;
    next: string; confirm: string; empty: string; rate: string; yourRate: string;
    clickToOpen: string;
  };
  leader: {
    welcome: string; studentsBusy: string; ordersTitle: string;
    assignedTasks: string; newTaskPlaceholder: string; selectStudent: string;
    add: string; empty: string;
    all: string; new: string; active: string; completed: string;
    orderId: string; client: string; service: string; price: string;
    statusLabel: string; tasks: string; assignBtn: string; closeBtn: string;
    noOrders: string; progress: string;
  };
  student: {
    welcome: string; completed: string; myTasks: string; finishBtn: string; done: string;
    activeTasks: string; myCertificates: string; viewCertificate: string; downloadBtn: string;
    certificateTitle: string; certificateBody: string; leaderName: string;
    sign: string; verify: string; noCertificates: string;
  };
  admin: {
    title: string; users: string; completed: string; revenue: string;
    latestOrders: string; topGroups: string;
  };
  chat: {
    placeholder: string; send: string; system: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  uz: {
    nav: {
      home: 'Bosh sahifa',
      client: 'Mijoz paneli',
      student: 'Talaba paneli',
      leader: 'Rahbar paneli',
      admin: 'Admin panel',
      about: 'Biz haqimizda',
      faq: 'Savol-javoblar',
      help: 'Yordam',
      login: 'Kirish',
      logout: 'Chiqish',
      register: "Ro‘yxatdan o‘tish",
      services: 'Xizmatlar',
      search: 'Qidiruv...',
      forStudents: 'Talabalar uchun',
      contact: 'Aloqa'
    },
    home: {
      badge: 'TechWork Rasmiy Platformasi',
      heroTitle: 'Professional xizmatlar – iqtidorli talabalardan!',
      heroSub: "Turli yo‘nalishlar bo‘yicha buyurtmalarni malakali texnikum talabalariga ishonib topshiring. Ular amaliyot o‘taydilar, siz esa zamonaviy va sifatli xizmatlardan foydalanasiz.",
      statsStudents: 'Faol talabalar',
      statsOrders: 'Muvaffaqiyatli loyihalar',
      statsGroups: 'Ixtisoslashgan guruhlar',
      statsRevenue: "Umumiy loyihalar qiymati",
      directionsTitle: "Asosiy xizmat yo‘nalishlari",
      cta: 'Xizmatlardan foydalanish →',
      howItWorks: 'Platforma qanday ishlaydi?',
      step1Title: '1. Buyurtma bering',
      step1Desc: "O‘zingizga kerakli xizmat turini tanlab, loyiha tafsilotlarini qoldiring.",
      step2Title: '2. Talabalar ijrosi',
      step2Desc: 'Sizning buyurtmangiz ustica tajribali talabalar guruhlari ishlaydi.',
      step3Title: '3. Qabul qiling va baholang',
      step3Desc: 'Tayyor mahsulotni qabul qiling va yosh mutaxassislarni baholang!',
      whyUs: 'Nima uchun TechWork platformasi?',
      why1Title: '💵 Hamyonbob narxlar',
      why1Desc: 'Bozor narxidan sezilarli darajada arzon xizmatlar, chunki biz startap jamoamiz.',
      why2Title: '🛡 Sifat nazorati',
      why2Desc: "Har bir jarayon malakali o‘qituvchilar va guruh rahbarlari nazorati ostica bo‘ladi.",
      why3Title: '🤝 Talabalarni qo‘llab-quvvatlash',
      why3Desc: 'Sizning buyurtmangiz talabalarimizni mehnat bozoriga tayyorlashda katta turtki bo‘ladi.',
      topStudentsTitle: "Oltin Fond: Eng faol talabalar",
      topStudentsSub: "O‘z yo‘nalishi bo‘yicha yuqori reytingga ega bo‘lgan iqtidorli yoshlarimiz",
      champion: "Reyting yetakchisi 🏆",
      tasksCount: "ta loyiha",
      liveActivityTitle: "Hozirgi jarayonlar",
      faqTitle: "Ko‘p so‘raladigan savollar",
      faqs: [
        { q: "Platformadan qanday foydalanish mumkin?", a: "Siz avval tizimga mijoz sifatida ro‘yxatdan o‘tasiz, so‘ngra xizmat tanlab loyiha tafsilotlarini kiritasiz." },
        { q: "Xizmatlar to‘lovi qanday shakllanadi?", a: "Buyurtmalar talabalar amaliyoti doirascica bajarilganligi bois, narxlar hamyonbob qilib belgilangan." },
        { q: "Sifat kafolatlanganmi?", a: "Har bir operatsiya maxsus fan o‘qituvchilari va guruh rahbarlari tomonidan qat’iy nazorat qilinadi." },
        { q: "Talabalarga qanday foydasi bor?", a: "Tizim talabalarga amaliy tajriba, ishonch va elektron sertifikatlar taqdim etib, portfel yig‘ishga yordam beradi." }
      ],
      helpTitle: "Yordam va qo‘llab-quvvatlash",
      helpDesc: "Savollaringiz bormi yoki hamkorlik qilmoqchimisiz? Biz bilan istalgan vaqtda aloqaga chiqing.",
      phoneLabel: "Ishonch telefoni",
      emailLabel: "Elektron pochta",
    },
    footerCopy1: "© 2026 TechWork Platformasi.",
    footerCopy2: "Barcha huquqlar himoyalangan. Tizim amaliy loyiha asosida yaratilgan.",
    footerCol1Title: "Platforma haqida",
    footerCol1Desc: "Texnikum talabalari va mijozlarni birlashtiruvchi zamonaviy xizmatlar markazi.",
    footerCol2Title: "Tezkor havolalar",
    footerCol3Title: "Yo‘nalishlar",
    footerCol4Title: "Bog‘lanish",
    newsletterTitle: "Yangiliklarga obuna bo‘ling",
    newsletterSub: "So‘nggi yangiliklar va chegirmalardan birinchilardan bo‘lib xabardor bo‘ling.",
    newsletterBtn: "Obuna bo‘lish",
    login: {
      title: 'Tizimga kirish',
      sub: "Oshingizga mos keladigan paneldan foydalaning",
      username: 'Foydalanuvchi nomi',
      password: 'Parol',
      btn: 'Kirish',
      demoTitle: 'Namuna akkauntlar',
      noAccount: "Hisobingiz yo‘qmi?",
      roles: { admin: 'Admin', leader: 'Rahbar', student: 'Talaba', client: 'Mijoz' }
    },
    register: {
      title: "Ro‘yxatdan o‘tish",
      sub: "Asosiy ma’lumotlaringizni to‘ldiring va buyurtma berishni boshlang",
      fullName: "To‘liq Ism-Familiya *",
      phone: "Telefon raqami *",
      username: "Foydalanuvchi nomi *",
      password: "Parol *",
      confirm: "Parolni tasdiqlang *",
      btn: "Hisob ochish",
      haveAccount: "Hisobingiz bormi?"
    },
    client: {
      newOrder: 'Yangi buyurtma qoldirish',
      myOrders: 'Mening buyurtmalarim',
      step1: '1. Tanlash',
      step2: '2. Tafsilotlar',
      step3: '3. Yakunlash',
      qty: 'Miqdor',
      region: 'Hudud',
      address: 'Manzil',
      desc: 'Loyiha tafsilotlari',
      back: 'Orqaga',
      next: 'Keyingisi',
      confirm: 'Buyurtmani tasdiqlash',
      empty: "Hozircha sizda faol buyurtmalar mavjud emas.",
      rate: 'Loyiha sifatini baholang',
      yourRate: 'Sizning bahoingiz:',
      clickToOpen: 'Batafsil ko‘rish'
    },
    leader: {
      welcome: '👋 Xush kelibsiz, guruh rahbari',
      studentsBusy: 'Talabalar holati',
      ordersTitle: 'Guruh loyihalari va vazifalar boshqaruvi',
      assignedTasks: 'Biriktirilgan topshiriqlar',
      newTaskPlaceholder: 'Vazifa mazmunini kiriting',
      selectStudent: '-- ijrochini tanlang --',
      add: "Topshiriq qo‘shish +",
      empty: "Kutilayotgan loyihalar mavjud emas",
      all: "Barchasi",
      new: "Yangi",
      active: "Jarayonda",
      completed: "Yakunlangan",
      orderId: "Loyiha ID",
      client: "Mijoz",
      service: "Xizmat turi",
      price: "Qiymati",
      statusLabel: "Holat",
      tasks: "Vazifalar",
      assignBtn: "Ijrochiga yo‘naltirish",
      closeBtn: "Loyihani yakunlash",
      noOrders: "Ushbu bo‘limda buyurtmalar topilmadi.",
      progress: "Umumiy ijro holati"
    },
    student: {
      welcome: '👋 Xush kelibsiz',
      completed: 'Yakunlandi',
      myTasks: 'Mening ish stolim',
      finishBtn: 'Topshirish ✓',
      done: 'BAJARILDI',
      activeTasks: 'Faol vazifalar',
      myCertificates: 'Mening sertifikatlarim',
      viewCertificate: "Sertifikatni ko‘rish",
      downloadBtn: "Yuklab olish (PDF)",
      certificateTitle: 'LOYIHA SERTIFIKATI',
      certificateBody: 'Ushbu hujjat talabaning quyidagi loyihani muvaffaqiyatli yakunlaganini tasdiqlaydi:',
      leaderName: 'Loyiha rahbari',
      sign: 'Rahbar imzosi',
      verify: 'Tasdiqlash uchun skanerlang',
      noCertificates: 'Sizda hozircha sertifikatlar mavjud emas.'
    },
    admin: {
      title: 'Ma’muriyat boshqaruv paneli',
      users: 'Foydalanuvchilar bazasi',
      completed: 'Yakunlangan loyihalar',
      revenue: 'Umumiy pul oqimi (UZS)',
      latestOrders: "Oqimdagi jonli buyurtmalar",
      topGroups: 'Eng faol guruhlar'
    },
    chat: {
      placeholder: 'Xabaringizni yozing...',
      send: 'Yuborish',
      system: 'Tizim xabari'
    }
  },
  ru: {
    nav: {
      home: 'Главная',
      client: 'Кабинет клиента',
      student: 'Кабинет студента',
      leader: 'Кабинет руководителя',
      admin: 'Админ-панель',
      about: 'О платформе',
      faq: 'База знаний',
      help: 'Помощь',
      login: 'Войти',
      logout: 'Выйти',
      register: 'Регистрация',
      services: 'Услуги',
      search: 'Поиск...',
      forStudents: 'Для студентов',
      contact: 'Контакты'
    },
    home: {
      badge: 'Официальная Платформа TechWork',
      heroTitle: 'Профессиональные услуги от талантливых студентов!',
      heroSub: 'Доверяйте выполнение ваших заказов квалифицированным студентам техникумов. Они получают практику, а вы — качественные услуги по доступной цене.',
      statsStudents: 'Активные студенты',
      statsOrders: 'Завершённые проекты',
      statsGroups: 'Специализированные группы',
      statsRevenue: 'Общий объём заказов',
      directionsTitle: 'Основные направления услуг',
      cta: 'Начать работу →',
      howItWorks: 'Как работает платформа?',
      step1Title: '1. Оформите заказ',
      step1Desc: 'Выберите нужную услугу и укажите детали вашего проекта.',
      step2Title: '2. Выполнение работ',
      step2Desc: 'Над вашим заказом работает группа опытных студентов под руководством мастера.',
      step3Title: '3. Приёмка и оценка',
      step3Desc: 'Принимайте готовую работу и выставляйте оценки молодым талантам!',
      whyUs: 'Почему стоит выбрать TechWork?',
      why1Title: '💵 Выгодные цены',
      why1Desc: 'Стоимость услуг значительно ниже рыночной за счёт учебного процесса.',
      why2Title: '🛡 Контроль качества',
      why2Desc: 'Все этапы работы контролируются опытными преподавателями и мастерами.',
      why3Title: '🤝 Поддержка студентов',
      why3Desc: 'Ваш заказ помогает студентам адаптироваться к реальному рынку труда.',
      topStudentsTitle: 'Золотой фонд: Лучшие студенты',
      topStudentsSub: 'Наши самые талантливые обучающиеся с высоким рейтингом и достижениями',
      champion: 'Лидер рейтинга 🏆',
      tasksCount: 'проектов завершено',
      liveActivityTitle: 'Активность в реальном времени',
      faqTitle: 'Часто задаваемые вопросы',
      faqs: [
        { q: 'Как пользоваться платформой?', a: 'Пройдите регистрацию как клиент, выберите нужную категорию и оформите заявку.' },
        { q: 'Как формируется стоимость?', a: 'У нас доступные цены, так как работа является частью производственной практики студентов.' },
        { q: 'Гарантировано ли качество?', a: 'Да, каждый проект лично курируется мастером производственного обучения.' },
        { q: 'Какова цель платформы?', a: 'Развитие практических навыков студентов и предоставление доступных услуг населению.' }
      ],
      helpTitle: 'Центр поддержки',
      helpDesc: 'Остались вопросы или предложения? Мы всегда готовы к диалогу и сотрудничеству.',
      phoneLabel: 'Горячая линия',
      emailLabel: 'Эл. почта',
    },
    footerCopy1: "© 2026 Платформа TechWork.",
    footerCopy2: "Все права защищены. Разработано как инновационный образовательный проект.",
    footerCol1Title: "О проекте",
    footerCol1Desc: "Современная площадка для взаимодействия студентов и заказчиков.",
    footerCol2Title: "Навигация",
    footerCol3Title: "Категории",
    footerCol4Title: "Контакты",
    newsletterTitle: "Подпишитесь на рассылку",
    newsletterSub: "Получайте уведомления о новых услугах и выгодных предложениях первыми.",
    newsletterBtn: "Подписаться",
    login: {
      title: 'Вход в систему',
      sub: 'Выберите панель соответствующую вашей роли',
      username: 'Имя пользователя',
      password: 'Пароль',
      btn: 'Войти',
      demoTitle: 'Демо-аккаунты',
      noAccount: 'Нет аккаунта?',
      roles: { admin: 'Админ', leader: 'Руководитель', student: 'Студент', client: 'Клиент' }
    },
    register: {
      title: 'Регистрация',
      sub: 'Заполните данные для создания личного кабинета',
      fullName: 'Полное ФИО *',
      phone: 'Номер телефона *',
      username: 'Имя пользователя *',
      password: 'Пароль *',
      confirm: 'Подтвердите пароль *',
      btn: 'Создать аккаунт',
      haveAccount: 'Уже есть аккаунт?'
    },
    client: {
      newOrder: 'Оформить новый заказ',
      myOrders: 'Мои заказы',
      step1: '1. Услуга',
      step2: '2. Детали',
      step3: '3. Финиш',
      qty: 'Кол-во',
      region: 'Регион',
      address: 'Адрес',
      desc: 'Задание проекта',
      back: 'Назад',
      next: 'Далее',
      confirm: 'Подтвердить проект',
      empty: 'Список ваших заказов на данный момент пуст.',
      rate: 'Оцените качество исполнения',
      yourRate: 'Ваша оценка:',
      clickToOpen: 'Открыть детали'
    },
    leader: {
      welcome: '👋 Здравствуйте, руководитель группы',
      studentsBusy: 'Состав и статус группы',
      ordersTitle: 'Управление проектами и задачами',
      assignedTasks: 'Распределённые поручения',
      newTaskPlaceholder: 'Опишите задачу',
      selectStudent: '-- выбрать исполнителя --',
      add: 'Добавить задачу +',
      empty: 'Новые заказы отсутствуют',
      all: "Все",
      new: "Новые",
      active: "В работе",
      completed: "Готово",
      orderId: "ID Проекта",
      client: "Заказчик",
      service: "Услуга",
      price: "Стоимость",
      statusLabel: "Статус",
      tasks: "Задачи",
      assignBtn: "Назначить исполнителя",
      closeBtn: "Завершить проект",
      noOrders: "В данном разделе проектов не найдено.",
      progress: "Общий статус выполнения"
    },
    student: {
      welcome: '👋 Добро пожаловать',
      completed: 'Завершено',
      myTasks: 'Моя рабочая зона',
      finishBtn: 'Сдать работу ✓',
      done: 'ИСПОЛНЕНО',
      activeTasks: 'Текущие задачи',
      myCertificates: 'Мои сертификаты',
      viewCertificate: 'Просмотр сертификата',
      downloadBtn: "Скачать в PDF",
      certificateTitle: 'СЕРТИФИКАТ ПРОЕКТА',
      certificateBody: 'Данный документ подтверждает успешное завершение студентом следующего проекта:',
      leaderName: 'Руководитель проекта',
      sign: 'Подпись мастера',
      verify: 'Сканируйте для проверки подлинности',
      noCertificates: 'У вас пока нет достигнутых сертификатов.'
    },
    admin: {
      title: 'Панель глобального управления',
      users: 'База пользователей',
      completed: 'Завершённые сделки',
      revenue: 'Денежный оборот (UZS)',
      latestOrders: 'Поток заказов в реальном времени',
      topGroups: 'Лидирующие группы'
    },
    chat: {
      placeholder: 'Напишите сообщение...',
      send: 'Отправить',
      system: 'Системное сообщение'
    }
  },
  en: {
    nav: {
      home: 'Home',
      client: 'Client Portal',
      student: 'Student Hub',
      leader: 'Mentor Panel',
      admin: 'Admin Center',
      about: 'About',
      faq: 'Knowledge Base',
      help: 'Support',
      login: 'Sign In',
      logout: 'Sign Out',
      register: 'Join Us',
      services: 'Services',
      search: 'Search...',
      forStudents: 'For Students',
      contact: 'Contact'
    },
    home: {
      badge: 'Official TechWork Platform',
      heroTitle: 'Professional Services Delivered by Talented Students!',
      heroSub: 'Delegate your projects to skilled vocational students. They gain vital hands-on experience, and you get high-quality services at competitive prices.',
      statsStudents: 'Active students',
      statsOrders: 'Projects completed',
      statsGroups: 'Specialist teams',
      statsRevenue: 'Total Project Value',
      directionsTitle: 'Our Main Service Areas',
      cta: 'Explore Solutions →',
      howItWorks: 'How it Works',
      step1Title: '1. Post your Brief',
      step1Desc: 'Choose the service type and provide your project requirements.',
      step2Title: '2. Professional Execution',
      step2Desc: 'Your request is handled by mentored student squads in a controlled environment.',
      step3Title: '3. Delivery & Review',
      step3Desc: 'Receive the final results and provide feedback to our blooming experts!',
      whyUs: 'Why TechWork?',
      why1Title: '💵 Cost Efficiency',
      why1Desc: 'Get professional results at a fraction of market prices through our educational hub.',
      why2Title: '🛡 Quality Control',
      why2Desc: 'Every project is strictly supervised by experienced senior mentors and instructors.',
      why3Title: '🤝 Empower Students',
      why3Desc: 'By choosing us, you directly contribute to the career development of young professionals.',
      topStudentsTitle: 'Hall of Fame: Top Performers',
      topStudentsSub: 'Our highest-rated students with exceptional task delivery records',
      champion: 'Top Achiever 🏆',
      tasksCount: 'successful projects',
      liveActivityTitle: 'Live Activity Stream',
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        { q: 'How to use this platform?', a: 'Register as a client, choose a service, and submit your project brief in minutes.' },
        { q: 'How is the pricing determined?', a: 'Our prices are student-friendly since the work is part of their professional training.' },
        { q: 'Is the quality guaranteed?', a: 'Yes, every milestone is audited and approved by a vocational senior mentor.' },
        { q: 'How do students benefit?', a: 'They build portfolios, earn official certificates, and gain industry-ready skills.' }
      ],
      helpTitle: 'Customer Support',
      helpDesc: 'Have questions or interested in a partnership? Our team is ready to assist you anytime.',
      phoneLabel: 'Direct Line',
      emailLabel: 'Email Inquiries',
    },
    footerCopy1: "© 2026 TechWork Platform.",
    footerCopy2: "All rights reserved. Innovative vocational thesis project.",
    footerCol1Title: "Our Mission",
    footerCol1Desc: "Building a bridge between talent-driven students and market demand.",
    footerCol2Title: "Quick Links",
    footerCol3Title: "Service Hubs",
    footerCol4Title: "Contact Us",
    newsletterTitle: "Stay Updated",
    newsletterSub: "Subscribe to get the latest student project updates and promotion offers.",
    newsletterBtn: "Join Mailing List",
    login: {
      title: 'Sign In',
      sub: 'Access the dashboard matching your workspace',
      username: 'Username',
      password: 'Password',
      btn: 'Sign In',
      demoTitle: 'Demo Accounts',
      noAccount: "Don't have an account?",
      roles: { admin: 'Admin', leader: 'Mentor', student: 'Student', client: 'Client' }
    },
    register: {
      title: 'Create Account',
      sub: 'Fill in your details and start publishing project briefs',
      fullName: 'Full Name *',
      phone: 'Phone Number *',
      username: 'Username *',
      password: 'Password *',
      confirm: 'Confirm Password *',
      btn: 'Register Now',
      haveAccount: 'Already have an account?'
    },
    client: {
      newOrder: 'Post New Request',
      myOrders: 'My Projects',
      step1: '1. Category',
      step2: '2. Briefing',
      step3: '3. Confirm',
      qty: 'Units',
      region: 'Location',
      address: 'Address',
      desc: 'Project Scope',
      back: 'Back',
      next: 'Continue',
      confirm: 'Submit Project',
      empty: 'Your project pipeline is currently empty.',
      rate: 'Rate the delivery quality',
      yourRate: 'Your score:',
      clickToOpen: 'More info'
    },
    leader: {
      welcome: '👋 Welcome, Team Mentor',
      studentsBusy: 'Team Capacity Status',
      ordersTitle: 'Project & Task Orchestration',
      assignedTasks: 'Dispatched Assignments',
      newTaskPlaceholder: 'Enter task scope',
      selectStudent: '-- assign executor --',
      add: 'Add Task +',
      empty: 'No pending requests at the moment',
      all: "All Feed",
      new: "New",
      active: "In-Progress",
      completed: "Finalized",
      orderId: "Project ID",
      client: "Customer",
      service: "Hub Area",
      price: "Budget",
      statusLabel: "Status",
      tasks: "Tasks",
      assignBtn: "Dispatch to Member",
      closeBtn: "Close Project",
      noOrders: "No items discovered in this filter.",
      progress: "Total Milestones Status"
    },
    student: {
      welcome: '👋 Welcome back',
      completed: 'Finalized',
      myTasks: 'My Workstation',
      finishBtn: 'Submit Task ✓',
      done: 'FINISHED',
      activeTasks: 'Involved Projects',
      myCertificates: 'My Credentials',
      viewCertificate: 'Open Certificate',
      downloadBtn: "Download PDF",
      certificateTitle: 'PROJECT CREDENTIAL',
      certificateBody: 'This document verifies that the student has successfully finalized the following project:',
      leaderName: 'Lead Mentor',
      sign: 'Lead Signature',
      verify: 'Scan to verify authenticity',
      noCertificates: 'No certificates acquired in your hub yet.'
    },
    admin: {
      title: 'Global Control Center',
      users: 'Total Userbase',
      completed: 'Finished Deals',
      revenue: 'Gross Flow (UZS)',
      latestOrders: 'Global Real-time Traffic',
      topGroups: 'Top Specialist Squads'
    },
    chat: {
      placeholder: 'Type your message...',
      send: 'Send',
      system: 'System Message'
    }
  }
}

export async function getDictionary(): Promise<Dictionary> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('NEXT_LOCALE')?.value as Locale || 'uz'
  return dictionaries[lang]
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  return cookieStore.get('NEXT_LOCALE')?.value as Locale || 'uz'
}
