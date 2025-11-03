
export const LANGUAGES = {
  en: { name: 'English', nativeName: 'English', currency: '$', currencyCode: 'USD' },
  id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', currency: 'Rp', currencyCode: 'IDR' },
  ru: { name: 'Russian', nativeName: 'Русский', currency: '₽', currencyCode: 'RUB' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', currency: '₹', currencyCode: 'INR' },
  zh: { name: 'Chinese', nativeName: '中文', currency: '¥', currencyCode: 'CNY' },
  ar: { name: 'Arabic', nativeName: 'العربية', currency: 'د.إ', currencyCode: 'AED' },
};

export type LanguageCode = keyof typeof LANGUAGES;

export const translations: Record<string, Record<LanguageCode, string>> = {
  // General
  appName: {
    en: 'My Focus',
    id: 'Fokus Saya',
    ru: 'Мой Фокус',
    hi: 'मेरा फोकस',
    zh: '我的焦点',
    ar: 'تركيزي',
  },
  // Rate Calculator
  knowYourWorth: {
    en: 'Know your worth. Find your focus.',
    id: 'Ketahui nilaimu. Temukan fokusmu.',
    ru: 'Знай себе цену. Найди свой фокус.',
    hi: 'अपनी कीमत जानें। अपना ध्यान केंद्रित करें।',
    zh: '了解你的价值。找到你的焦点。',
    ar: 'اعرف قيمتك. ابحث عن تركيزك.',
  },
  targetAnnualIncome: {
    en: "What's your target annual income?",
    id: 'Berapa target pendapatan tahunan Anda?',
    ru: 'Какой ваш целевой годовой доход?',
    hi: 'आपकी लक्षित वार्षिक आय क्या है?',
    zh: '您的目标年收入是多少？',
    ar: 'ما هو هدف دخلك السنوي؟',
  },
  calculateRate: {
    en: 'Calculate My Hourly Rate',
    id: 'Hitung Tarif Per Jam Saya',
    ru: 'Рассчитать мою почасовую ставку',
    hi: 'मेरी प्रति घंटा दर की गणना करें',
    zh: '计算我的小时费率',
    ar: 'احسب أجري بالساعة',
  },
  basedOn: {
    en: 'Based on {hours} hours/week, {weeks} weeks/year.',
    id: 'Berdasarkan {hours} jam/minggu, {weeks} minggu/tahun.',
    ru: 'На основе {hours} часов в неделю, {weeks} недель в году.',
    hi: '{hours} घंटे/सप्ताह, {weeks} सप्ताह/वर्ष के आधार पर।',
    zh: '基于每周{hours}小时，每年{weeks}周。',
    ar: 'بناءً على {hours} ساعة/أسبوع، {weeks} أسبوعًا/سنة.',
  },
  enterValidIncome: {
    en: 'Please enter a valid annual income.',
    id: 'Harap masukkan pendapatan tahunan yang valid.',
    ru: 'Пожалуйста, введите действительный годовой доход.',
    hi: 'कृपया एक वैध वार्षिक आय दर्ज करें।',
    zh: '请输入有效的年收入。',
    ar: 'يرجى إدخال دخل سنوي صالح.',
  },

  // Navigation
  home: { en: 'Home', id: 'Beranda', ru: 'Главная', hi: 'होम', zh: '首页', ar: 'الرئيسية' },
  ideas: { en: 'Ideas', id: 'Ide', ru: 'Идеи', hi: 'विचार', zh: '想法', ar: 'أفكار' },
  routine: { en: 'Routine', id: 'Rutin', ru: 'Рутина', hi: 'नियमित', zh: '例行', ar: 'روتين' },
  analytics: { en: 'Analytics', id: 'Analitik', ru: 'Аналитика', hi: 'एनालिटिक्स', zh: '分析', ar: 'التحليلات' },
  profile: { en: 'Profile', id: 'Profil', ru: 'Профиль', hi: 'प्रोफ़ाइल', zh: '个人资料', ar: 'الملف الشخصي' },

  // Home Page
  yourOneThing: { en: 'Your One Thing', id: 'Satu Hal Anda', ru: 'Ваше главное дело', hi: 'आपकी एक चीज़', zh: '你的“那件事”', ar: 'مهمتك الأهم' },
  dominoEffect: { en: 'The idea that creates the biggest domino effect.', id: 'Ide yang menciptakan efek domino terbesar.', ru: 'Идея, которая создает наибольший эффект домино.', hi: 'वह विचार जो सबसे बड़ा डोमिनोज़ प्रभाव पैदा करता है।', zh: '能产生最大多米诺效应的想法。', ar: 'الفكرة التي تخلق أكبر تأثير دومينو.' },
  whatIsYourOneThing: { en: 'What is your one thing?', id: 'Apa satu hal Anda?', ru: 'В чем ваше главное дело?', hi: 'आपकी वह एक चीज़ क्या है?', zh: '你的“那件事”是什么？', ar: 'ما هي مهمتك الأهم؟' },
  generateActionPlan: { en: 'Generate Action Plan with AI', id: 'Buat Rencana Aksi dengan AI', ru: 'Создать план действий с помощью ИИ', hi: 'एआई के साथ कार्य योजना बनाएं', zh: '使用 AI 生成行动计划', ar: 'إنشاء خطة عمل بالذكاء الاصطناعي' },
  generating: { en: 'Generating...', id: 'Menghasilkan...', ru: 'Генерация...', hi: 'उत्पन्न हो रहा है...', zh: '生成中...', ar: 'جاري الإنشاء...' },
  noOneThing: { en: 'No "One Thing" identified yet.', id: 'Belum ada "Satu Hal" yang diidentifikasi.', ru: 'Главное дело еще не определено.', hi: 'अभी तक कोई "एक चीज़" पहचानी नहीं गई है।', zh: '尚未确定“那件事”。', ar: 'لم يتم تحديد "المهمة الأهم" بعد.' },
  goToIdeas: { en: 'Go to your Ideas page to add and rate your items to find your focus.', id: 'Buka halaman Ide Anda untuk menambah dan menilai item untuk menemukan fokus Anda.', ru: 'Перейдите на страницу Идей, чтобы добавить и оценить свои дела и найти свой фокус.', hi: 'अपना ध्यान केंद्रित करने के लिए आइटम जोड़ने और रेट करने के लिए अपने विचार पृष्ठ पर जाएं।', zh: '前往您的想法页面添加和评价您的项目以找到您的焦点。', ar: 'اذهب إلى صفحة الأفكار لإضافة وتقييم عناصرك للعثور على تركيزك.' },

  // Action Plan
  framework: { en: 'Framework', id: 'Kerangka Kerja', ru: 'Методология', hi: 'रूपरेखा', zh: '框架', ar: 'إطار العمل' },
  checklist: { en: 'Checklist', id: 'Daftar Periksa', ru: 'Чек-лист', hi: 'जाँच सूची', zh: '清单', ar: 'قائمة المراجعة' },
  emptyTask: { en: 'Empty task...', id: 'Tugas kosong...', ru: 'Пустая задача...', hi: 'खाली कार्य...', zh: '空任务...', ar: 'مهمة فارغة...' },
  addKeyAction: { en: 'Add a key action...', id: 'Tambahkan tindakan kunci...', ru: 'Добавить ключевое действие...', hi: 'एक मुख्य क्रिया जोड़ें...', zh: '添加关键行动...', ar: 'أضف إجراءً رئيسيًا...' },
  addMore: { en: 'Add More', id: 'Tambah Lagi', ru: 'Добавить еще', hi: 'और जोड़ें', zh: '添加更多', ar: 'أضف المزيد' },
  recreate: { en: 'Recreate', id: 'Buat Ulang', ru: 'Создать заново', hi: 'पुनः बनाएं', zh: '重新创建', ar: 'إعادة الإنشاء' },
  adding: { en: 'Adding...', id: 'Menambahkan...', ru: 'Добавление...', hi: 'जोड़ रहा है...', zh: '添加中...', ar: 'جارٍ الإضافة...' },
  recreating: { en: 'Recreating...', id: 'Membuat Ulang...', ru: 'Пересоздание...', hi: 'पुनः बना रहा है...', zh: '重新创建中...', ar: 'جارٍ إعادة الإنشاء...' },
  
  // Ideas Page (Dashboard)
  myIdeas: { en: 'My Ideas', id: 'Ide Saya', ru: 'Мои идеи', hi: 'मेरे विचार', zh: '我的想法', ar: 'أفكاري' },
  aiSuggestion: { en: 'AI Suggestion', id: 'Saran AI', ru: 'Рекомендация ИИ', hi: 'एआई सुझाव', zh: 'AI 建议', ar: 'اقتراح الذكاء الاصطناعي' },
  analyzingIdeas: { en: 'Analyzing your ideas...', id: 'Menganalisis ide Anda...', ru: 'Анализирую ваши идеи...', hi: 'आपके विचारों का विश्लेषण किया जा रहा है...', zh: '正在分析您的想法...', ar: 'جاري تحليل أفكارك...' },
  thanks: { en: 'Thanks!', id: 'Terima kasih!', ru: 'Спасибо!', hi: 'धन्यवाद!', zh: '谢谢！', ar: 'شكرًا!' },
  addSomeItemsFirst: { en: 'Please add some items to your ideas list first!', id: 'Harap tambahkan beberapa item ke daftar ide Anda terlebih dahulu!', ru: 'Сначала добавьте идеи в ваш список!', hi: 'कृपया पहले अपनी विचार सूची में कुछ आइटम जोड़ें!', zh: '请先在您的想法列表中添加一些项目！', ar: 'يرجى إضافة بعض العناصر إلى قائمة أفكارك أولاً!' },
  suggestionError: { en: "Sorry, I couldn't generate a suggestion right now. Please try again later.", id: 'Maaf, saya tidak dapat membuat saran saat ini. Silakan coba lagi nanti.', ru: 'К сожалению, я не могу сгенерировать предложение прямо сейчас. Пожалуйста, повторите попытку позже.', hi: 'क्षमा करें, मैं अभी कोई सुझाव नहीं दे सका। कृपया बाद में पुन: प्रयास करें।', zh: '抱歉,我现在无法生成建议。请稍后再试。', ar: 'عذرًا، لم أتمكن من إنشاء اقتراح الآن. يرى المحاولة مرة أخرى لاحقًا.' },
  ideaDistribution: { en: 'Idea Distribution', id: 'Distribusi Ide', ru: 'Распределение идей', hi: 'विचार वितरण', zh: '想法分布', ar: 'توزيع الأفكار' },

  // Item Card
  routines: { en: 'Routines', id: 'Rutin', ru: 'Рутины', hi: 'नियमित कार्य', zh: '例行程序', ar: 'الروتينات' },
  setAsRoutine: { en: 'Set as Routine', id: 'Atur sebagai Rutin', ru: 'Сделать рутиной', hi: 'नियमित के रूप में सेट करें', zh: '设为例行', ar: 'تعيين كروتين' },
  noRoutinesYet: { en: 'No routines yet. Go to Ideas and mark an item as a routine.', id: 'Belum ada rutin. Buka Ide dan tandai item sebagai rutin.', ru: 'Пока нет рутин. Перейдите в Идеи и отметьте элемент как рутину.', hi: 'अभी तक कोई दिनचर्या नहीं है। विचार पर जाएं और किसी आइटम को दिनचर्या के रूप में चिह्नित करें।', zh: '暂无例行程序。请前往“想法”并将项目标记为例行程序。', ar: 'لا توجد إجراءات روتينية حتى الآن. انتقل إلى الأفكار وحدد عنصرًا كإجراء روتيني.' },
  automated: { en: 'Automated', id: 'Otomatis', ru: 'Автоматизировано', hi: 'स्वचालित', zh: '已自动化', ar: 'مؤتمت' },
  delegated: { en: 'Delegated', id: 'Didelegasikan', ru: 'Делегировано', hi: 'सौंपा गया', zh: '已委托', ar: 'مفوض' },
  batched: { en: 'Batched', id: 'Batch', ru: 'Сгруппировано', hi: 'बैच किया हुआ', zh: '已批处理', ar: 'مجمّعة' },
  batch: { en: 'Batch', id: 'Batch', ru: 'Сгруппировать', hi: 'बैच', zh: '批处理', ar: 'تجميع' },
  completed: { en: 'Completed', id: 'Selesai', ru: 'Завершено', hi: 'पूर्ण', zh: '已完成', ar: 'مكتمل' },
  enterIdeaName: { en: 'Enter idea name...', id: 'Masukkan nama ide...', ru: 'Введите название идеи...', hi: 'विचार का नाम दर्ज करें...', zh: '输入想法名称...', ar: 'أدخل اسم الفكرة...' },
  setAsOneThing: { en: 'Set as The One Thing', id: 'Atur sebagai Satu Hal', ru: 'Сделать главным делом', hi: 'एक चीज़ के रूप में सेट करें', zh: '设为“那件事”', ar: 'تعيين كمهمة أهم' },
  swipeToOneThing: {
    en: 'This is it!',
    id: 'Fokus di sini!',
    ru: 'Вот оно!',
    hi: 'यह बात है!',
    zh: '就是这个！',
    ar: 'هذا هو!',
  },
  addSubTask: { en: 'Add a sub-task', id: 'Tambahkan sub-tugas', ru: 'Добавить подзадачу', hi: 'एक उप-कार्य जोड़ें', zh: '添加子任务', ar: 'أضف مهمة فرعية' },
  delete: { en: 'Delete', id: 'Hapus', ru: 'Удалить', hi: 'हटाएं', zh: '删除', ar: 'حذف' },
  
  // Deleted Items Modal
  deletedItems: { en: 'Deleted Items', id: 'Item yang Dihapus', ru: 'Удаленные элементы', hi: 'हटाए गए आइटम', zh: '已删除项目', ar: 'العناصر المحذوفة' },
  noDeletedItems: { en: 'No deleted items.', id: 'Tidak ada item yang dihapus.', ru: 'Нет удаленных элементов.', hi: 'कोई हटाया गया आइटम नहीं।', zh: '无已删除项目。', ar: 'لا توجد عناصر محذوفة.' },
  done: { en: 'Done', id: 'Selesai', ru: 'Готово', hi: 'সম্পন্ন', zh: '完成', ar: 'تم' },
  restore: { en: 'Restore', id: 'Pulihkan', ru: 'Восстановить', hi: 'पुनर्स्थापित', zh: '恢复', ar: 'استعادة' },
  deletePermanently: { en: 'Delete Permanently', id: 'Hapus Permanen', ru: 'Удалить навсегда', hi: 'स्थायी रूप से हटाएं', zh: '永久删除', ar: 'حذف نهائي' },
  
  // Add Item Form
  pourYourIdeas: { en: 'Pour your ideas here...', id: 'Tuangkan ide-ide Anda di sini...', ru: 'Излейте свои идеи здесь...', hi: 'अपने विचार यहां डालें...', zh: '在此倾注您的想法...', ar: 'صب أفكارك هنا...' },
  
  // Profile Page
  profileAndSettings: { en: 'Profile & Settings', id: 'Profil & Pengaturan', ru: 'Профиль и настройки', hi: 'प्रोफ़ाइल और सेटिंग्स', zh: '个人资料与设置', ar: 'الملف الشخصي والإعدادات' },
  yourHourlyRate: { en: 'Your Hourly Rate', id: 'Tarif Per Jam Anda', ru: 'Ваша почасовая ставка', hi: 'आपकी प्रति घंटा दर', zh: '您的小时费率', ar: 'أجرك بالساعة' },
  perHour: { en: '/ hour', id: '/ jam', ru: '/ час', hi: '/ घंटा', zh: '/小时', ar: '/ ساعة' },
  change: { en: 'Change', id: 'Ubah', ru: 'Изменить', hi: 'बदलें', zh: '更改', ar: 'تغيير' },
  appearance: { en: 'Appearance', id: 'Tampilan', ru: 'Внешний вид', hi: 'दिखावट', zh: '外观', ar: 'المظهر' },
  light: { en: 'Light', id: 'Terang', ru: 'Светлая', hi: 'लाइट', zh: '浅色', ar: 'فاتح' },
  dark: { en: 'Dark', id: 'Gelap', ru: 'Темная', hi: 'डार्क', zh: '深色', ar: 'داكن' },
  system: { en: 'System', id: 'Sistem', ru: 'Системная', hi: 'सिस्टम', zh: '系统', ar: 'النظام' },
  language: { en: 'Language', id: 'Bahasa', ru: 'Язык', hi: 'भाषा', zh: '语言', ar: 'اللغة' },
  aiTuning: { en: 'AI Tuning Questions', id: 'Pertanyaan Penyetelan AI', ru: 'Вопросы для настройки ИИ', hi: 'एआई ट्यूनिंग प्रश्न', zh: 'AI 调优问题', ar: 'أسئلة ضبط الذكاء الاصطناعي' },
  aiTuningDesc: { en: "Your answers help the system learn what's important to you.", id: 'Jawaban Anda membantu sistem mempelajari apa yang penting bagi Anda.', ru: 'Ваши ответы помогают системе понять, что для вас важно.', hi: 'आपके उत्तर सिस्टम को यह जानने में मदद करते हैं कि आपके लिए क्या महत्वपूर्ण है।', zh: '您的回答有助于系统了解什么对您重要。', ar: 'تساعد إجاباتك النظام في معرفة ما هو مهم بالنسبة لك.' },
  q1: { en: 'What kind of work directly generates revenue for you?', id: 'Jenis pekerjaan apa yang secara langsung menghasilkan pendapatan bagi Anda?', ru: 'Какая работа напрямую приносит вам доход?', hi: 'किस तरह का काम आपके लिए सीधे राजस्व उत्पन्न करता है?', zh: '哪种工作能直接为您创造收入？', ar: 'ما هو نوع العمل الذي يدر عليك دخلاً مباشراً؟' },
  q1_placeholder: { en: 'e.g., freelance writing, selling products, consulting calls...', id: 'misalnya, penulisan lepas, menjual produk, panggilan konsultasi...', ru: 'например, фриланс, продажа товаров, консультации...', hi: 'जैसे, फ्रीलांस लेखन, उत्पाद बेचना, परामर्श कॉल...', zh: '例如，自由撰稿、销售产品、咨询电话...', ar: 'على سبيل المثال، الكتابة الحرة، بيع المنتجات، المكالمات الاستشارية...' },
  q2: { en: 'What skills, if improved, would allow you to charge more?', id: 'Keterampilan apa, jika ditingkatkan, yang memungkinkan Anda mengenakan biaya lebih?', ru: 'Какие навыки, если их улучшить, позволят вам брать больше денег?', hi: 'किन कौशलों में सुधार होने पर आप अधिक शुल्क ले पाएंगे?', zh: '如果提高哪些技能，会让您收取更高的费用？', ar: 'ما هي المهارات التي إذا تم تحسينها ستسمح لك بفرض رسوم أعلى؟' },
  q2_placeholder: { en: 'e.g., learning a new programming language, getting a certification, public speaking...', id: 'misalnya, mempelajari bahasa pemrograman baru, mendapatkan sertifikasi, berbicara di depan umum...', ru: 'например, изучение нового языка программирования, получение сертификата, публичные выступления...', hi: 'जैसे, एक नई प्रोग्रामिंग भाषा सीखना, प्रमाणन प्राप्त करना, सार्वजनिक भाषण...', zh: '例如，学习一门新的编程语言、获得认证、公开演讲...', ar: 'على سبيل المثال، تعلم لغة برمجة جديدة، الحصول على شهادة، التحدث أمام الجمهور...' },
  q3: { en: 'What activities leave you feeling refreshed and motivated?', id: 'Aktivitas apa yang membuat Anda merasa segar dan termotivasi?', ru: 'Какие занятия оставляют у вас чувство свежести и мотивации?', hi: 'कौन सी गतिविधियाँ आपको तरोताजा और प्रेरित महसूस कराती हैं?', zh: '哪些活动能让您感到精神焕发、充满动力？', ar: 'ما هي الأنشطة التي تجعلك تشعر بالانتعاش والتحفيز؟' },
  q3_placeholder: { en: 'e.g., exercising, reading, spending time with family, working on a passion project...', id: 'misalnya, berolahraga, membaca, menghabiskan waktu bersama keluarga, mengerjakan proyek gairah...', ru: 'например, упражнения, чтение, время с семьей, работа над любимым проектом...', hi: 'जैसे, व्यायाम करना, पढ़ना, परिवार के साथ समय बिताना, किसी जुनून परियोजना पर काम करना...', zh: '例如，锻炼、阅读、与家人共度时光、从事充满激情的项目...', ar: 'على سبيل المثال، ممارسة الرياضة، القراءة، قضاء الوقت مع العائلة، العمل على مشروع شغف...' },
  dangerZone: { en: 'Danger Zone', id: 'Zona Berbahaya', ru: 'Опасная зона', hi: 'खतरनाक क्षेत्र', zh: '危险区', ar: 'منطقة الخطر' },
  resetAllData: { en: 'Reset All Data', id: 'Setel Ulang Semua Data', ru: 'Сбросить все данные', hi: 'सभी डेटा रीसेट करें', zh: '重置所有数据', ar: 'إعادة ضبط كافة البيانات' },
  resetWarning: { en: 'This action is irreversible and will delete all your ideas and settings.', id: 'Tindakan ini tidak dapat diurungkan dan akan menghapus semua ide dan pengaturan Anda.', ru: 'Это действие необратимо и удалит все ваши задачи и настройки.', hi: 'यह क्रिया अपरिवर्तनीय है और आपके सभी कार्यों और सेटिंग्स को हटा देगी।', zh: '此操作不可逆，将删除您的所有任务和设置。', ar: 'هذا الإجراء لا يمكن التراجع عنه وسيحذف جميع أفكارك وإعداداتك.' },
  
  // Suggestion Display
  suggestionOneThing: { en: 'Your One Thing', id: 'Satu Hal Anda', ru: 'Ваше главное дело', hi: 'आपकी एक चीज़', zh: '你的“那件事”', ar: 'مهمتك الأهم' },
  whyItMatters: { en: 'Why It Matters', id: 'Mengapa Ini Penting', ru: 'Почему это важно', hi: 'यह क्यों मायने रखता है', zh: '为何重要', ar: 'لماذا هي مهمة' },
  streamlineList: { en: 'Streamline Your List', id: 'Rampingkan Daftar Anda', ru: 'Оптимизируйте свой список', hi: 'अपनी सूची को सुव्यवस्थित करें', zh: '简化您的列表', ar: 'تبسيط قائمتك' },
  automate: { en: 'Automate', id: 'Otomatiskan', ru: 'Автоматизировать', hi: 'स्वचालित करें', zh: '自动化', ar: 'أتمتة' },
  delegate: { en: 'Delegate', id: 'Delegasikan', ru: 'Делегировать', hi: 'सौंपें', zh: '委托', ar: 'فوض' },
  noStreamline: { en: 'No specific tasks for automation or delegation were identified from your list.', id: 'Tidak ada tugas spesifik untuk otomatisasi atau delegasi yang diidentifikasi dari daftar Anda.', ru: 'Конкретных задач для автоматизации или делегирования в вашем списке не найдено.', hi: 'आपकी सूची से स्वचालन या प्रतिनिधिमंडल के लिए कोई विशिष्ट कार्य पहचाना नहीं गया।', zh: '您的列表中没有发现可自动化或委托的特定任务。', ar: 'لم يتم تحديد مهام معينة للأتمتة أو التفويض من قائمتك.' },
  noneIdentified: { en: 'None identified.', id: 'Tidak ada yang teridentifikasi.', ru: 'Не определено.', hi: 'कोई नहीं पहचाना गया।', zh: '未发现。', ar: 'لم يتم تحديد أي شيء.' },
  
  // Task Column
  addFirstIdea: { en: 'Add your first idea below!', id: 'Tambahkan ide pertama Anda di bawah!', ru: 'Добавьте свою первую идею ниже!', hi: 'अपना पहला विचार नीचे जोड़ें!', zh: '在下方添加您的第一个想法！', ar: 'أضف فكرتك الأولى أدناه!' },

  // History and Analytics
  today: { en: 'Today', id: 'Hari Ini', ru: 'Сегодня', hi: 'आज', zh: '今天', ar: 'اليوم' },
  yesterday: { en: 'Yesterday', id: 'Kemarin', ru: 'Вчера', hi: 'कल', zh: '昨天', ar: 'أمس' },
  history: { en: 'History', id: 'Riwayat', ru: 'История', hi: 'इतिहास', zh: '历史', ar: 'السجل' },
  viewAnalytics: { en: 'View Analytics', id: 'Lihat Analitik', ru: 'Посмотреть аналитику', hi: 'एनालिटिक्स देखें', zh: '查看分析', ar: 'عرض التحليلات' },
  noHistory: { en: 'No history yet. Your "One Thing" will be saved here each day.', id: 'Belum ada riwayat. "Satu Hal" Anda akan disimpan di sini setiap hari.', ru: 'Истории пока нет. Ваше "главное дело" будет сохраняться здесь каждый день.', hi: 'अभी तक कोई इतिहास नहीं ਹੈ। आपकी "एक चीज़" हर दिन यहाँ सहेजी जाएगी।', zh: '暂无历史记录。您的“那件事”每天都会保存在这里。', ar: 'لا يوجد سجل حتى الآن. سيتم حفظ "مهمتك الأهم" هنا كل يوم.' },
  close: { en: 'Close', id: 'Tutup', ru: 'Закрыть', hi: 'बंद करें', zh: '关闭', ar: 'إغلاق' },
  weeklySuccessRate: { en: 'Weekly Success Rate', id: 'Tingkat Keberhasilan Mingguan', ru: 'Еженедельный процент успеха', hi: 'साप्ताहिक सफलता दर', zh: '每周成功率', ar: 'معدل النجاح الأسبوعي' },
  successRateDesc: { en: 'You completed all actions for {successfulDays} out of {totalDays} focus days this week.', id: 'Anda menyelesaikan semua tindakan untuk {successfulDays} dari {totalDays} hari fokus minggu ini.', ru: 'Вы выполнили все действия за {successfulDays} из {totalDays} фокусных дней на этой неделе.', hi: ' आपने इस सप्ताह {totalDays} फोकस दिनों में से {successfulDays} के लिए सभी कार्य पूरे किए।', zh: '本周，您在 {totalDays} 个专注日中完成了 {successfulDays} 天的所有行动。', ar: 'لقد أكملت جميع الإجراءات لـ {successfulDays} من أصل {totalDays} يوم تركيز هذا الأسبوع.' },
  noFocusDays: { en: 'No focus days recorded this week to calculate a success rate.', id: 'Tidak ada hari fokus yang tercatat minggu ini untuk menghitung tingkat keberhasilan.', ru: 'На этой неделе не зарегистрировано фокусных дней для расчета процента успеха.', hi: 'सफलता दर की गणना के लिए इस सप्ताह कोई फोकस दिन दर्ज नहीं किया गया।', zh: '本周没有记录专注日，无法计算成功率。', ar: 'لم يتم تسجيل أيام تركيز هذا الأسبوع لحساب معدل النجاح.' },
  
  // Analytics Page
  weeklyOverview: { en: 'Weekly Overview', id: 'Gambaran Umum Mingguan', ru: 'Обзор за неделю', hi: 'साप्ताहिक अवलोकन', zh: '每周概览', ar: 'نظرة عامة أسبوعية' },
  focusDays: { en: 'Focus Days', id: 'Hari Fokus', ru: 'Дни фокуса', hi: 'फोकस दिन', zh: '专注日', ar: 'أيام التركيز' },
  completedActions: { en: 'Completed Actions', id: 'Tindakan Selesai', ru: 'Выполненные действия', hi: 'पूरी की गई कार्रड़ियां', zh: '已完成行动', ar: 'الإجراءات المكتملة' },
  potentialWeeklyValue: { en: 'Potential Weekly Value', id: 'Potensi Nilai Mingguan', ru: 'Потенциальная ценность за неделю', hi: 'संभावित साप्ताहिक मूल्य', zh: '潜在周价值', ar: 'القيمة الأسبوعية المحتملة' },
  performanceTrend: { en: 'Performance Trend', id: 'Tren Kinerja', ru: 'Тренд производительности', hi: 'प्रदर्शन की प्रवृत्ति', zh: '表现趋势', ar: 'اتجاه الأداء' },
  last4Weeks: { en: 'Last 4 Weeks', id: '4 Minggu Terakhir', ru: 'Последние 4 недели', hi: 'पिछले 4 सप्ताह', zh: '过去 4 周', ar: 'آخر 4 أسابيع' },
  focusBreakdown: { en: 'Focus Breakdown', id: 'Rincian Fokus', ru: 'Разбивка по фокусу', hi: 'फोकस का विश्लेषण', zh: '专注点分解', ar: 'تفصيل التركيز' },
  basedOnOneThing: { en: 'Based on your "One Thing" history', id: 'Berdasarkan riwayat "Satu Hal" Anda', ru: 'На основе вашей истории "главного дела"', hi: 'आपके "एक चीज़" के इतिहास पर आधारित', zh: '基于您的“那件事”历史记录', ar: 'بناءً على سجل "مهمتك الأهم"' },
  aiPoweredInsights: { en: 'AI-Powered Insights', id: 'Wawasan Berbasis AI', ru: 'Аналитика на базе ИИ', hi: 'एआई-संचालित अंतर्दृष्टि', zh: 'AI 驱动的洞察', ar: 'رؤى مدعومة بالذكاء الاصطناعي' },
  generateInsights: { en: 'Generate AI Insights', id: 'Hasilkan Wawasan AI', ru: 'Сгенерировать аналитику', hi: 'एआई अंतर्दृष्टि उत्पन्न करें', zh: '生成 AI 洞察', ar: 'إنشاء رؤى بالذكاء الاصطناعي' },
  aiInsightPrompt: { en: 'Give me one positive reinforcement and one actionable suggestion for improvement.', id: 'Beri saya satu penguatan positif dan satu saran yang dapat ditindaklanjuti untuk perbaikan.', ru: 'Дайте мне одно положительное подкрепление и одно действенное предложение по улучшению.', hi: 'मुझे सुधार के लिए एक सकारात्मक सुदृढीकरण और एक कार्रवाई योग्य सुझाव दें।', zh: '给我一个积极的强化和一个可行的改进建议。', ar: 'أعطني تعزيزًا إيجابيًا واحدًا واقتراحًا قابلاً للتنفيذ للتحسين.' },
  makeMoney: { en: 'Make Money', id: 'Menghasilkan Uang', ru: 'Заработок', hi: 'पैसे कमाएं', zh: '赚钱', ar: 'كسب المال' },
  increaseRate: { en: 'Increase Rate', id: 'Meningkatkan Tarif', ru: 'Повышение ставки', hi: 'दर बढ़ाएँ', zh: '提高费率', ar: 'زيادة الأجر' },
  giveEnergy: { en: 'Give Energy', id: 'Memberi Energi', ru: 'Дает энергию', hi: 'ऊर्जा दें', zh: '给予能量', ar: 'منح الطاقة' },

  // Reflection Page
  dailyReflection: { en: 'Daily Reflection', id: 'Refleksi Harian', ru: 'Ежедневная рефлексия', hi: 'दैनिक चिंतन', zh: '每日反思', ar: 'تأمل يومي' },
  reflectionPrompts: { en: 'Reflection Prompts', id: 'Prompt Refleksi', ru: 'Вопросы для рефлексии', hi: 'चिंतन संकेत', zh: '反思提示', ar: 'موجهات التأمل' },
  saveReflection: { en: 'Save Reflection', id: 'Simpan Refleksi', ru: 'Сохранить рефлексию', hi: 'चिंतन सहेजें', zh: '保存反思', ar: 'حفظ التأمل' },
  whatsOnYourMind: { en: "What's on your mind?", id: 'Apa yang ada di pikiranmu?', ru: 'О чем вы думаете?', hi: 'आपके मन में क्या है?', zh: '你在想什么？', ar: 'بماذا تفكر؟' },
  customOption: { en: 'Other...', id: 'Lainnya...', ru: 'Другое...', hi: 'अन्य...', zh: '其他...', ar: 'أخرى...' },
  nextButton: { en: 'Next', id: 'Lanjut', ru: 'Далее', hi: 'अगला', zh: '下一个', ar: 'التالي' },
  backButton: { en: 'Back', id: 'Kembali', ru: 'Назад', hi: 'वापस', zh: '返回', ar: 'رجوع' },
  
  // New Survey Questions
  reflectionQ1: { en: "How satisfied were you with completing your tasks today?", id: "Berapa puas kamu bisa selesaikan tugas hari ini?", ru: "Насколько вы удовлетворены выполнением своих задач сегодня?", hi: "आज अपने कार्यों को पूरा करने से आप कितने संतुष्ट थे?", zh: "您对今天完成任务的满意度如何？", ar: "ما مدى رضاك عن إكمال مهامك اليوم؟" },
  reflectionQ1A1: { en: "Satisfied", id: "Puas", ru: "Удовлетворен", hi: "संतुष्ट", zh: "满意", ar: "راضٍ" },
  reflectionQ1A2: { en: "Less Satisfied", id: "Kurang Puas", ru: "Менее удовлетворен", hi: "कम संतुष्ट", zh: "不太满意", ar: "أقل رضًا" },
  reflectionQ1A3: { en: "Not Satisfied", id: "Tidak Puas", ru: "Не удовлетворен", hi: "संतुष्ट नहीं", zh: "不满意", ar: "غير راضٍ" },
  
  reflectionQ2: { en: "What factor most helped you focus?", id: "Faktor apa yang paling bantu kamu fokus?", ru: "Какой фактор больше всего помог вам сосредоточиться?", hi: "किस कारक ने आपको ध्यान केंद्रित करने में सबसे अधिक मदद की?", zh: "哪个因素最能帮助您集中注意力？", ar: "ما هو العامل الذي ساعدك على التركيز أكثر؟" },
  reflectionQ2A1: { en: "Focus Timer", id: "Timer Fokus", ru: "Таймер фокусировки", hi: "फोकस टाइमर", zh: "专注计时器", ar: "مؤقت التركيز" },
  reflectionQ2A2: { en: "Blocked Notifications", id: "Blok Notifikasi", ru: "Заблокированные уведомления", hi: "अवरुद्ध सूचनाएं", zh: "已屏蔽通知", ar: "الإشعارات المحظورة" },
  reflectionQ2A3: { en: "Quiet Workspace", id: "Tempat Kerja Tenang", ru: "Тихое рабочее место", hi: "शांत कार्यक्षेत्र", zh: "安静的工作区", ar: "مساحة عمل هادئة" },
  reflectionQ2A4: { en: "Good Mood", id: "Mood Bagus", ru: "Хорошее настроение", hi: "अच्छा मूड", zh: "心情好", ar: "مزاج جيد" },
  reflectionQ2A5: { en: "Deadline", id: "Deadline", ru: "Срок", hi: "समयसीमा", zh: "截止日期", ar: "موعد نهائي" },

  reflectionQ3: { en: "If you want to finish your One Thing faster tomorrow, what one thing do you need to improve?", id: "Kalau besok kamu mau selesaikan One Thing lebih cepat, satu hal apa yang perlu kamu perbaiki?", ru: "Если вы хотите завтра быстрее закончить свое главное дело, что одно вам нужно улучшить?", hi: "यदि आप कल अपनी 'एक चीज़' को तेजी से पूरा करना चाहते हैं, तो आपको किस एक चीज़ में सुधार करने की आवश्यकता है?", zh: "如果您想明天更快地完成您的“那件事”，您需要改进哪一件事？", ar: "إذا كنت ترغب في إنهاء مهمتك الأهم بشكل أسرع غدًا، ما هو الشيء الوحيد الذي تحتاج إلى تحسينه؟" },
  reflectionQ3A1: { en: "Start Earlier", id: "Mulai Lebih Pagi", ru: "Начать раньше", hi: "जल्दी शुरू करें", zh: "早点开始", ar: "البدء مبكرًا" },
  reflectionQ3A2: { en: "Break Down Tasks", id: "Pecah Tugas", ru: "Разбить задачи", hi: "कार्यों को तोड़ें", zh: "分解任务", ar: "تقسيم المهام" },
  reflectionQ3A3: { en: "Reduce Meetings", id: "Kurangi Meeting", ru: "Сократить встречи", hi: "बैठकें कम करें", zh: "减少会议", ar: "تقليل الاجتماعات" },
  reflectionQ3A4: { en: "Prepare Materials First", id: "Siapkan Bahan Lebih Dulu", ru: "Сначала подготовить материалы", hi: "पहले सामग्री तैयार करें", zh: "先准备材料", ar: "تحضير المواد أولاً" },

  reflectionQ4: { en: "Which part of the day was most wasted?", id: "Bagian hari mana yang paling banyak kebuang?", ru: "Какая часть дня была потрачена впустую?", hi: "दिन का कौन सा हिस्सा सबसे ज्यादा बर्बाद हुआ?", zh: "一天中的哪个部分最浪费时间？", ar: "أي جزء من اليوم كان الأكثر إهدارًا؟" },
  reflectionQ4A1: { en: "Morning", id: "Pagi", ru: "Утро", hi: "सुबह", zh: "早上", ar: "الصباح" },
  reflectionQ4A2: { en: "Afternoon", id: "Siang", ru: "День", hi: "दोपहर", zh: "下午", ar: "بعد الظهر" },
  reflectionQ4A3: { en: "Evening", id: "Malam", ru: "Вечер", hi: "शाम", zh: "晚上", ar: "المساء" },
  reflectionQ4A4: { en: "Scrolling Social Media", id: "Scroll Medsos", ru: "Прокрутка соцсетей", hi: "सोशल मीडिया स्क्रॉल करना", zh: "刷社交媒体", ar: "تصفح وسائل التواصل الاجتماعي" },
  reflectionQ4A5: { en: "Waiting for a Response", id: "Nunggu Respon", ru: "Ожидание ответа", hi: "प्रतिक्रिया की प्रतीक्षा", zh: "等待回复", ar: "انتظار الرد" },
  
  reflectionQ5: { en: "What was the trigger?", id: "Pemicunya apa?", ru: "Что было триггером?", hi: "ट्रिगर क्या था?", zh: "触发因素是什么？", ar: "ما هو المسبب؟" },
  reflectionQ5A1: { en: "People", id: "Orang", ru: "Люди", hi: "लोग", zh: "人", ar: "الناس" },
  reflectionQ5A2: { en: "Place", id: "Tempat", ru: "Место", hi: "जगह", zh: "地点", ar: "المكان" },
  reflectionQ5A3: { en: "Notifications", id: "Notifikasi", ru: "Уведомления", hi: "सूचनाएं", zh: "通知", ar: "الإشعارات" },
  reflectionQ5A4: { en: "Unclear Task", id: "Tugas Nggak Jelas", ru: "Неясная задача", hi: "अस्पष्ट कार्य", zh: "任务不明确", ar: "مهمة غير واضحة" },
  reflectionQ5A5: { en: "Fatigue", id: "Kelelahan", ru: "Усталость", hi: "थकान", zh: "疲劳", ar: "الإرهاق" },

  reflectionQ6: { en: "What anticipatory strategy for tomorrow do you want to activate in the app?", id: "Strategi antisipasi untuk besok yang mau kamu aktifkan di app?", ru: "Какую упреждающую стратегию на завтра вы хотите активировать в приложении?", hi: "कल के लिए आप ऐप में कौन सी प्रत्याशित रणनीति सक्रिय करना चाहते हैं?", zh: "您想在应用中为明天激活什么预期策略？", ar: "ما هي الاستراتيجية الاستباقية للغد التي تريد تفعيلها في التطبيق؟" },
  reflectionQ6A1: { en: "Activate 25-min focus mode", id: "Aktifkan mode fokus 25 menit", ru: "Активировать 25-минутный режим фокусировки", hi: "25-मिनट का फ़ोकस मोड सक्रिय करें", zh: "激活25分钟专注模式", ar: "تفعيل وضع التركيز لمدة 25 دقيقة" },
  reflectionQ6A2: { en: "Turn off notifications for 2 hours", id: "Matikan notif 2 jam", ru: "Отключить уведомления на 2 часа", hi: "2 घंटे के लिए सूचनाएं बंद करें", zh: "关闭通知2小时", ar: "إيقاف الإشعارات لمدة ساعتين" },
  reflectionQ6A3: { en: "Set a max of 3 to-do items", id: "Pasang to-do maksimal 3 item", ru: "Установить максимум 3 дела", hi: "अधिकतम 3 टू-डू आइटम सेट करें", zh: "设置最多3个待办事项", ar: "تعيين 3 عناصر كحد أقصى للمهام" },
  reflectionQ6A4: { en: "Schedule work during high-energy hours", id: "Jadwalkan kerja di jam energi tinggi", ru: "Планировать работу на часы высокой энергии", hi: "उच्च-ऊर्जा घंटों के दौरान काम शेड्यूल करें", zh: "在高能量时段安排工作", ar: "جدولة العمل خلال ساعات الطاقة العالية" },

  // History Modal
  viewReflection: { en: 'View Reflection', id: 'Lihat Refleksi', ru: 'Посмотреть рефлексию', hi: 'चिंतन देखें', zh: '查看反思', ar: 'عرض التأمل' },
  filterByDate: { en: 'Filter by date...', id: 'Filter berdasarkan tanggal...', ru: 'Фильтр по дате...', hi: 'तिथि के अनुसार फ़िल्टर करें...', zh: '按日期筛选...', ar: 'تصفية حسب التاريخ...' },
  clearFilter: { en: 'Clear', id: 'Bersihkan', ru: 'Очистить', hi: 'साफ़ करें', zh: '清除', ar: 'مسح' },
};
