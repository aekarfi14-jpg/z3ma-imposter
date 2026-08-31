import { CategoryItem, SecretWordItem } from '../types';

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'food_algerian',
    nameAr: 'مأكولات شعبية وحلويات',
    nameEn: 'Food & Sweets',
    icon: '🍲',
    color: 'from-amber-500 to-red-600',
    enabled: true,
  },
  {
    id: 'home_objects',
    nameAr: 'أشياء في المنزل',
    nameEn: 'Household Items',
    icon: '🏠',
    color: 'from-blue-500 to-indigo-700',
    enabled: true,
  },
  {
    id: 'professions',
    nameAr: 'مهن وحرف ووظائف',
    nameEn: 'Professions & Jobs',
    icon: '💼',
    color: 'from-emerald-500 to-teal-700',
    enabled: true,
  },
  {
    id: 'places_tourism',
    nameAr: 'أماكن ومدن ومعالم',
    nameEn: 'Places & Landmarks',
    icon: '📍',
    color: 'from-purple-500 to-pink-600',
    enabled: true,
  },
  {
    id: 'animals',
    nameAr: 'حيوانات وكائنات حية',
    nameEn: 'Animals & Wildlife',
    icon: '🐾',
    color: 'from-orange-500 to-amber-700',
    enabled: true,
  },
  {
    id: 'tech_gadgets',
    nameAr: 'تكنولوجيا وأجهزة إلكترونية',
    nameEn: 'Technology & Gadgets',
    icon: '📱',
    color: 'from-cyan-500 to-blue-600',
    enabled: true,
  },
  {
    id: 'vehicles',
    nameAr: 'سيارات ووسائل نقل',
    nameEn: 'Vehicles & Transport',
    icon: '🚗',
    color: 'from-rose-500 to-red-700',
    enabled: true,
  },
  {
    id: 'sports_celebs',
    nameAr: 'رياضة ولياقة ومنافسات',
    nameEn: 'Sports & Fitness',
    icon: '⚽',
    color: 'from-green-500 to-emerald-700',
    enabled: true,
  },
  {
    id: 'daily_life',
    nameAr: 'نشاطات وترفيه وعادات',
    nameEn: 'Daily Life & Leisure',
    icon: '☕',
    color: 'from-yellow-500 to-amber-600',
    enabled: true,
  },
  {
    id: 'office_supplies',
    nameAr: 'أدوات مكتبية ومدرسية',
    nameEn: 'Office & School Supplies',
    icon: '📚',
    color: 'from-indigo-500 to-blue-700',
    enabled: true,
  },
  {
    id: 'clothes_fashion',
    nameAr: 'ملابس وأزياء وإكسسوارات',
    nameEn: 'Fashion & Clothing',
    icon: '👔',
    color: 'from-violet-500 to-purple-700',
    enabled: true,
  },
  {
    id: 'kitchen_cooking',
    nameAr: 'أدوات مطبخ وطبخ',
    nameEn: 'Kitchen & Cooking',
    icon: '🍳',
    color: 'from-amber-600 to-orange-700',
    enabled: true,
  },
  {
    id: 'fruits_veggies',
    nameAr: 'فواكه وخضروات ونباتات',
    nameEn: 'Fruits & Vegetables',
    icon: '🍎',
    color: 'from-emerald-600 to-green-700',
    enabled: true,
  },
  {
    id: 'tools_crafts',
    nameAr: 'أدوات عمل وبناء وورشة',
    nameEn: 'Tools & Workshop',
    icon: '🔨',
    color: 'from-yellow-600 to-amber-700',
    enabled: true,
  },
  {
    id: 'science_space',
    nameAr: 'علوم وفضاء واكتشافات',
    nameEn: 'Science & Space',
    icon: '🚀',
    color: 'from-fuchsia-600 to-indigo-800',
    enabled: true,
  },
];

// Pool of 7 contextual hint words per category
export const CATEGORY_HINTS_MAP: Record<
  string,
  { hintsAr: string[]; hintsEn: string[] }
> = {
  food_algerian: {
    hintsAr: ['بخار', 'طاجين', 'توابل', 'وليمة', 'عجين', 'سكر', 'عسل'],
    hintsEn: ['Steam', 'Pot', 'Spices', 'Feast', 'Dough', 'Sugar', 'Honey'],
  },
  home_objects: {
    hintsAr: ['غرفة', 'جدار', 'نظافة', 'كهرباء', 'راحة', 'نافذة', 'أثاث'],
    hintsEn: ['Room', 'Wall', 'Cleanliness', 'Electricity', 'Comfort', 'Window', 'Furniture'],
  },
  professions: {
    hintsAr: ['راتب', 'زي', 'خبرة', 'خدمة', 'أدوات', 'ورشة', 'موعد'],
    hintsEn: ['Salary', 'Uniform', 'Skill', 'Service', 'Tools', 'Workshop', 'Shift'],
  },
  places_tourism: {
    hintsAr: ['سياحة', 'تاريخ', 'حجارة', 'خريطة', 'بحر', 'رمال', 'ارتفاع'],
    hintsEn: ['Tourism', 'History', 'Stones', 'Map', 'Sea', 'Sand', 'Height'],
  },
  animals: {
    hintsAr: ['أنياب', 'ركض', 'صحراء', 'صوت', 'فرو', 'غابة', 'أجنحة'],
    hintsEn: ['Fangs', 'Run', 'Desert', 'Call', 'Fur', 'Jungle', 'Wings'],
  },
  tech_gadgets: {
    hintsAr: ['شاشة', 'بطارية', 'إشارة', 'أزرار', 'شاحن', 'صوت', 'شبكة'],
    hintsEn: ['Screen', 'Battery', 'Signal', 'Buttons', 'Charger', 'Sound', 'Network'],
  },
  vehicles: {
    hintsAr: ['عجلات', 'طريق', 'وقود', 'سرعة', 'سكة', 'محرك', 'سفر'],
    hintsEn: ['Wheels', 'Road', 'Fuel', 'Speed', 'Track', 'Engine', 'Travel'],
  },
  sports_celebs: {
    hintsAr: ['ملعب', 'سباق', 'فوز', 'عرق', 'تدريب', 'حكم', 'جمهور'],
    hintsEn: ['Stadium', 'Race', 'Victory', 'Sweat', 'Training', 'Referee', 'Crowd'],
  },
  daily_life: {
    hintsAr: ['نرد', 'سهرة', 'تحدي', 'أصدقاء', 'ضحك', 'وقت', 'نقاط'],
    hintsEn: ['Dice', 'Evening', 'Challenge', 'Friends', 'Laughter', 'Time', 'Points'],
  },
  office_supplies: {
    hintsAr: ['حبر', 'مسطرة', 'مكتب', 'ورق', 'حقيبة', 'رسم', 'حساب'],
    hintsEn: ['Ink', 'Ruler', 'Desk', 'Paper', 'Bag', 'Drawing', 'Math'],
  },
  clothes_fashion: {
    hintsAr: ['قماش', 'خياطة', 'خزانة', 'شتاء', 'ألوان', 'ارتداء', 'مظهر'],
    hintsEn: ['Fabric', 'Sewing', 'Wardrobe', 'Winter', 'Colors', 'Wear', 'Look'],
  },
  kitchen_cooking: {
    hintsAr: ['نار', 'تقطيع', 'غسيل', 'زيت', 'ملح', 'مائدة', 'حرارة'],
    hintsEn: ['Fire', 'Cutting', 'Washing', 'Oil', 'Salt', 'Table', 'Heat'],
  },
  fruits_veggies: {
    hintsAr: ['بذور', 'قشرة', 'شجرة', 'مزرعة', 'سوق', 'طعم', 'سقي'],
    hintsEn: ['Seeds', 'Peel', 'Tree', 'Farm', 'Market', 'Taste', 'Watering'],
  },
  tools_crafts: {
    hintsAr: ['حديد', 'بناء', 'مسامير', 'إصلاح', 'خشب', 'قوة', 'قطع'],
    hintsEn: ['Iron', 'Construction', 'Nails', 'Repair', 'Wood', 'Force', 'Cut'],
  },
  science_space: {
    hintsAr: ['كواكب', 'مختبر', 'ضوء', 'نجوم', 'جاذبية', 'أبحاث', 'تجارب'],
    hintsEn: ['Planets', 'Lab', 'Light', 'Stars', 'Gravity', 'Research', 'Experiments'],
  },
};

export const normalizeArabicComparison = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[يى]/g, 'ي');
};

export const doesWordMatchCategoryHint = (word: string, categoryId: string): boolean => {
  const hintsObj = CATEGORY_HINTS_MAP[categoryId];
  if (!hintsObj) return false;

  const normInput = normalizeArabicComparison(word);
  const lowerInput = word.trim().toLowerCase();

  // Check Arabic hints
  for (const h of hintsObj.hintsAr) {
    if (normalizeArabicComparison(h) === normInput) {
      return true;
    }
  }

  // Check English hints
  for (const h of hintsObj.hintsEn) {
    if (h.trim().toLowerCase() === lowerInput) {
      return true;
    }
  }

  return false;
};

export const WORD_DATABASE: SecretWordItem[] = [
  // 1. Food
  {
    id: 'f1',
    categoryId: 'food_algerian',
    word: 'كسكس',
    wordEn: 'Couscous',
    hintsAr: ['بخار', 'جمعة', 'غربال'],
    hintsEn: ['Steam', 'Friday', 'Sieve'],
  },
  {
    id: 'f2',
    categoryId: 'food_algerian',
    word: 'محاجب',
    wordEn: 'Mahjouba',
    hintsAr: ['حرارة', 'طبقات', 'طاجين'],
    hintsEn: ['Heat', 'Layers', 'Griddle'],
  },
  {
    id: 'f3',
    categoryId: 'food_algerian',
    word: 'كرانطيطا',
    wordEn: 'Karantika',
    hintsAr: ['غبار', 'سندويتش', 'أصفر'],
    hintsEn: ['Powder', 'Sandwich', 'Yellow'],
  },
  {
    id: 'f4',
    categoryId: 'food_algerian',
    word: 'شخشوخة',
    wordEn: 'Chakhchoukha',
    hintsAr: ['تمزيق', 'وليمة', 'أعراس'],
    hintsEn: ['Tearing', 'Banquet', 'Weddings'],
  },
  {
    id: 'f5',
    categoryId: 'food_algerian',
    word: 'بوراك',
    wordEn: 'Bourek',
    hintsAr: ['قرمشة', 'لفافة', 'ليمون'],
    hintsEn: ['Crunch', 'Roll', 'Lemon'],
  },
  {
    id: 'f6',
    categoryId: 'food_algerian',
    word: 'قلب اللوز',
    wordEn: 'Kalb El Louz',
    hintsAr: ['سكر', 'مربع', 'مساء'],
    hintsEn: ['Sugar', 'Square', 'Evening'],
  },
  {
    id: 'f7',
    categoryId: 'food_algerian',
    word: 'رشتة',
    wordEn: 'Rechta',
    hintsAr: ['خيوط', 'أبيض', 'مناسبة'],
    hintsEn: ['Threads', 'White', 'Ceremony'],
  },
  {
    id: 'f8',
    categoryId: 'food_algerian',
    word: 'زلابية',
    wordEn: 'Zlabia',
    hintsAr: ['عسل', 'دوائر', 'برتقالي'],
    hintsEn: ['Honey', 'Spirals', 'Orange'],
  },
  {
    id: 'f9',
    categoryId: 'food_algerian',
    word: 'شربة فريك',
    wordEn: 'Chorba Frik',
    hintsAr: ['طين', 'قمح', 'غروب'],
    hintsEn: ['Clay', 'Wheat', 'Sunset'],
  },
  {
    id: 'f10',
    categoryId: 'food_algerian',
    word: 'دوبارة',
    wordEn: 'Doubara',
    hintsAr: ['واحة', 'زيت', 'ملعقة'],
    hintsEn: ['Oasis', 'Oil', 'Spoon'],
  },
  {
    id: 'f11',
    categoryId: 'food_algerian',
    word: 'طاجين الحلو',
    wordEn: 'Sweet Tajine',
    hintsAr: ['قرفة', 'ذهب', 'فاكهة'],
    hintsEn: ['Cinnamon', 'Gold', 'Fruit'],
  },
  {
    id: 'f12',
    categoryId: 'food_algerian',
    word: 'مطلوع',
    wordEn: 'Matlouh Bread',
    hintsAr: ['عجين', 'انتفاخ', 'رماد'],
    hintsEn: ['Dough', 'Rise', 'Ash'],
  },

  // 2. Home Objects
  {
    id: 'h1',
    categoryId: 'home_objects',
    word: 'تيرموس',
    wordEn: 'Thermos Flask',
    hintsAr: ['عزل', 'صباح', 'فراغ'],
    hintsEn: ['Insulation', 'Morning', 'Vacuum'],
  },
  {
    id: 'h2',
    categoryId: 'home_objects',
    word: 'مهراس',
    wordEn: 'Mortar and Pestle',
    hintsAr: ['دق', 'ثقل', 'نحاس'],
    hintsEn: ['Pounding', 'Weight', 'Brass'],
  },
  {
    id: 'h3',
    categoryId: 'home_objects',
    word: 'سنيوة',
    wordEn: 'Large Metal Tray',
    hintsAr: ['دائرة', 'لمعان', 'ضيافة'],
    hintsEn: ['Circle', 'Gleam', 'Hospitality'],
  },
  {
    id: 'h4',
    categoryId: 'home_objects',
    word: 'شوفاج',
    wordEn: 'Room Heater',
    hintsAr: ['لهب', 'شتاء', 'زاوية'],
    hintsEn: ['Flame', 'Winter', 'Corner'],
  },
  {
    id: 'h5',
    categoryId: 'home_objects',
    word: 'مروحة',
    wordEn: 'Electric Fan',
    hintsAr: ['دوران', 'صيف', 'رياح'],
    hintsEn: ['Rotation', 'Summer', 'Wind'],
  },
  {
    id: 'h6',
    categoryId: 'home_objects',
    word: 'زربية',
    wordEn: 'Traditional Carpet',
    hintsAr: ['صوف', 'أرضية', 'زخرفة'],
    hintsEn: ['Wool', 'Floor', 'Pattern'],
  },
  {
    id: 'h7',
    categoryId: 'home_objects',
    word: 'كوكوت مينوت',
    wordEn: 'Pressure Cooker',
    hintsAr: ['ضغط', 'صفير', 'سرعة'],
    hintsEn: ['Pressure', 'Whistle', 'Speed'],
  },
  {
    id: 'h8',
    categoryId: 'home_objects',
    word: 'قندورة',
    wordEn: 'Gandoura Robe',
    hintsAr: ['قماش', 'تطريز', 'راحة'],
    hintsEn: ['Fabric', 'Embroidery', 'Comfort'],
  },

  // 3. Professions
  {
    id: 'p1',
    categoryId: 'professions',
    word: 'شوفور طاكسي',
    wordEn: 'Taxi Driver',
    hintsAr: ['طريق', 'عداد', 'أصفر'],
    hintsEn: ['Road', 'Meter', 'Yellow'],
  },
  {
    id: 'p2',
    categoryId: 'professions',
    word: 'حفاف',
    wordEn: 'Barber / Hairdresser',
    hintsAr: ['شفرة', 'مرآة', 'عطر'],
    hintsEn: ['Blade', 'Mirror', 'Scent'],
  },
  {
    id: 'p3',
    categoryId: 'professions',
    word: 'ميكانيسيان',
    wordEn: 'Auto Mechanic',
    hintsAr: ['شحم', 'صوت', 'محرك'],
    hintsEn: ['Grease', 'Sound', 'Engine'],
  },
  {
    id: 'p4',
    categoryId: 'professions',
    word: 'معلم',
    wordEn: 'School Teacher',
    hintsAr: ['أحمر', 'جرس', 'سبورة'],
    hintsEn: ['Red', 'Bell', 'Board'],
  },
  {
    id: 'p5',
    categoryId: 'professions',
    word: 'طبيب',
    wordEn: 'Doctor / Physician',
    hintsAr: ['نبض', 'وصفة', 'أبيض'],
    hintsEn: ['Pulse', 'Prescription', 'White'],
  },
  {
    id: 'p6',
    categoryId: 'professions',
    word: 'بلومبيي',
    wordEn: 'Plumber',
    hintsAr: ['تسريب', 'أنبوب', 'مفتاح'],
    hintsEn: ['Leak', 'Pipe', 'Wrench'],
  },
  {
    id: 'p7',
    categoryId: 'professions',
    word: 'بناي',
    wordEn: 'Construction Builder',
    hintsAr: ['توازن', 'إسمنت', 'ارتفاع'],
    hintsEn: ['Balance', 'Cement', 'Height'],
  },

  // 4. Places & Landmarks
  {
    id: 'pl1',
    categoryId: 'places_tourism',
    word: 'مقام الشهيد',
    wordEn: 'Martyrs Memorial (Algiers)',
    hintsAr: ['سعفة', 'خليج', 'شعلة'],
    hintsEn: ['Frond', 'Bay', 'Flame'],
  },
  {
    id: 'pl2',
    categoryId: 'places_tourism',
    word: 'جبال جرجرة',
    wordEn: 'Djurdjura Mountains',
    hintsAr: ['جليد', 'قمة', 'ضباب'],
    hintsEn: ['Ice', 'Peak', 'Fog'],
  },
  {
    id: 'pl3',
    categoryId: 'places_tourism',
    word: 'تيمقاد',
    wordEn: 'Timgad Roman Ruins',
    hintsAr: ['حجارة', 'قوس', 'تاريخ'],
    hintsEn: ['Stones', 'Arch', 'History'],
  },
  {
    id: 'pl4',
    categoryId: 'places_tourism',
    word: 'حديقة الحامة',
    wordEn: 'Hamma Botanical Garden',
    hintsAr: ['ظل', 'جذور', 'تمثال'],
    hintsEn: ['Shade', 'Roots', 'Statue'],
  },
  {
    id: 'pl5',
    categoryId: 'places_tourism',
    word: 'جسور قسنطينة',
    wordEn: 'Bridges of Constantine',
    hintsAr: ['هوة', 'حبال', 'صخر'],
    hintsEn: ['Chasm', 'Cables', 'Rock'],
  },
  {
    id: 'pl6',
    categoryId: 'places_tourism',
    word: 'غرداية',
    wordEn: 'Ghardaia Mzab Valley',
    hintsAr: ['واحة', 'طين', 'هندسة'],
    hintsEn: ['Oasis', 'Clay', 'Geometry'],
  },

  // 5. Animals
  {
    id: 'a1',
    categoryId: 'animals',
    word: 'فنك',
    wordEn: 'Fennec Fox',
    hintsAr: ['سمع', 'رمل', 'ليل'],
    hintsEn: ['Hearing', 'Sand', 'Night'],
  },
  {
    id: 'a2',
    categoryId: 'animals',
    word: 'جمل',
    wordEn: 'Camel (Dromedary)',
    hintsAr: ['عطش', 'قافلة', 'خطوات'],
    hintsEn: ['Thirst', 'Caravan', 'Steps'],
  },
  {
    id: 'a3',
    categoryId: 'animals',
    word: 'عقرب',
    wordEn: 'Scorpion',
    hintsAr: ['لدغة', 'حجر', 'ضوء'],
    hintsEn: ['Sting', 'Stone', 'Glow'],
  },
  {
    id: 'a4',
    categoryId: 'animals',
    word: 'حصان بربري',
    wordEn: 'Barb Horse',
    hintsAr: ['بارود', 'ركض', 'سرج'],
    hintsEn: ['Gunpowder', 'Gallop', 'Saddle'],
  },
  {
    id: 'a5',
    categoryId: 'animals',
    word: 'قرد الشفة',
    wordEn: 'Barbary Macaque (Chiffa)',
    hintsAr: ['أشجار', 'قفز', 'مكسرات'],
    hintsEn: ['Trees', 'Leap', 'Nuts'],
  },

  // 6. Technology & Gadgets
  {
    id: 't1',
    categoryId: 'tech_gadgets',
    word: 'شاحن الهاتف',
    wordEn: 'Phone Charger',
    hintsAr: ['طاقة', 'خيط', 'جدار'],
    hintsEn: ['Energy', 'Cord', 'Wall'],
  },
  {
    id: 't2',
    categoryId: 'tech_gadgets',
    word: 'سماعات بلوتوث',
    wordEn: 'Wireless Earbuds',
    hintsAr: ['صوت', 'صندوق', 'عزلة'],
    hintsEn: ['Sound', 'Case', 'Isolation'],
  },
  {
    id: 't3',
    categoryId: 'tech_gadgets',
    word: 'بلايستيشن',
    wordEn: 'PlayStation Console',
    hintsAr: ['أزرار', 'شاشة', 'تنافس'],
    hintsEn: ['Buttons', 'Screen', 'Rivalry'],
  },
  {
    id: 't4',
    categoryId: 'tech_gadgets',
    word: 'موديم الويفي',
    wordEn: 'WiFi Router Modem',
    hintsAr: ['إشارة', 'أضواء', 'أمواج'],
    hintsEn: ['Signal', 'Lights', 'Waves'],
  },
  {
    id: 't5',
    categoryId: 'tech_gadgets',
    word: 'درون',
    wordEn: 'Camera Drone',
    hintsAr: ['تحليق', 'مروحة', 'منظر'],
    hintsEn: ['Flight', 'Propeller', 'View'],
  },

  // 7. Vehicles
  {
    id: 'v1',
    categoryId: 'vehicles',
    word: 'ترامواي',
    wordEn: 'City Tramway',
    hintsAr: ['سكة', 'رنين', 'كهرباء'],
    hintsEn: ['Rail', 'Chime', 'Electricity'],
  },
  {
    id: 'v2',
    categoryId: 'vehicles',
    word: 'كليو ديبلو',
    wordEn: 'Renault Clio Classic Car',
    hintsAr: ['طريق', 'شعبية', 'عجلات'],
    hintsEn: ['Road', 'Popularity', 'Wheels'],
  },
  {
    id: 'v3',
    categoryId: 'vehicles',
    word: 'ميترو',
    wordEn: 'Underground Metro',
    hintsAr: ['نفق', 'درج', 'سرعة'],
    hintsEn: ['Tunnel', 'Stairs', 'Speed'],
  },
  {
    id: 'v4',
    categoryId: 'vehicles',
    word: 'تيليفريك',
    wordEn: 'Cable Car (Telepherique)',
    hintsAr: ['سلك', 'معلق', 'أفق'],
    hintsEn: ['Cable', 'Suspended', 'Horizon'],
  },

  // 8. Sports & Celebrities
  {
    id: 's1',
    categoryId: 'sports_celebs',
    word: 'رياض محرز',
    wordEn: 'Riyad Mahrez',
    hintsAr: ['يسار', 'قوس', 'شباك'],
    hintsEn: ['Left', 'Curve', 'Net'],
  },
  {
    id: 's2',
    categoryId: 'sports_celebs',
    word: 'رابح ماجر',
    wordEn: 'Rabah Madjer',
    hintsAr: ['عقب', 'هدف', 'تاريخ'],
    hintsEn: ['Heel', 'Goal', 'History'],
  },
  {
    id: 's3',
    categoryId: 'sports_celebs',
    word: 'كأس إفريقيا',
    wordEn: 'Africa Cup of Nations (AFCON)',
    hintsAr: ['ذهب', 'قارة', 'نجمة'],
    hintsEn: ['Gold', 'Continent', 'Star'],
  },

  // 9. Daily Life & Activities
  {
    id: 'd1',
    categoryId: 'daily_life',
    word: 'قعدة الشاي بالنعناع',
    wordEn: 'Mint Tea Gathering',
    hintsAr: ['رغوة', 'زجاج', 'سهرة'],
    hintsEn: ['Foam', 'Glass', 'Soirée'],
  },
  {
    id: 'd2',
    categoryId: 'daily_life',
    word: 'ماتش كورة في الحومة',
    wordEn: 'Neighborhood Street Football',
    hintsAr: ['حجارة', 'إسفلت', 'غبار'],
    hintsEn: ['Stones', 'Asphalt', 'Dust'],
  },
  {
    id: 'd3',
    categoryId: 'daily_life',
    word: 'دومينو في القهوة',
    wordEn: 'Dominoes at the Cafe',
    hintsAr: ['نقاط', 'خشب', 'طاولة'],
    hintsEn: ['Dots', 'Wood', 'Table'],
  },
  {
    id: 'd4',
    categoryId: 'daily_life',
    word: 'طابور لاپوسط',
    wordEn: 'Post Office Queue',
    hintsAr: ['أرقام', 'ورقة', 'انتظار'],
    hintsEn: ['Numbers', 'Slip', 'Waiting'],
  },
];

export function selectSecretWord(
  enabledCategoryIds: string[],
  lastUsedWordIds: string[],
  customWords: SecretWordItem[] = []
): SecretWordItem {
  const allWords = [...WORD_DATABASE, ...customWords];
  const candidateWords = allWords.filter((w) =>
    enabledCategoryIds.includes(w.categoryId)
  );

  if (candidateWords.length === 0) {
    return allWords[0] || WORD_DATABASE[0];
  }

  // Filter out recent words
  const unusedWords = candidateWords.filter(
    (w) => !lastUsedWordIds.includes(w.id)
  );

  const pool = unusedWords.length > 0 ? unusedWords : candidateWords;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
