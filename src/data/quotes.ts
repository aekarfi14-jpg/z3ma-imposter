export interface BanterQuote {
  category: 'doubt' | 'mockery' | 'pressure' | 'chaos' | 'time';
  textAr: string;
  textEn: string;
}

export const BANTER_QUOTES: BanterQuote[] = [
  // Doubt (شك)
  {
    category: 'doubt',
    textAr: '👀 شكون راه يشك في شكون؟',
    textEn: '👀 Who is suspecting whom?',
  },
  {
    category: 'doubt',
    textAr: '🧐 راك ساكت بزاف... نظراتك ماشي مريحة قاع!',
    textEn: '🧐 You are too quiet... your stare is suspicious!',
  },
  {
    category: 'doubt',
    textAr: '🤔 علاش راك تتبسم وحدك؟ باينة راك مخبي كارثة!',
    textEn: '🤔 Why are you smiling alone? You must be hiding something!',
  },
  {
    category: 'doubt',
    textAr: '👀 عينيك راهم يهربو في السقف... احكي الصح!',
    textEn: '👀 Your eyes are darting to the ceiling... speak the truth!',
  },

  // Mockery (سخرية)
  {
    category: 'mockery',
    textAr: '😂 راكم طولتو... الـImposter أغبى شخص في المجموعة!',
    textEn: '😂 Taking too long... The Imposter is the most clueless one here!',
  },
  {
    category: 'mockery',
    textAr: '🤣 وجهك وجه واحد ما علابالوش الكلمة أصلاً!',
    textEn: '🤣 Your face screams you have no idea what the word is!',
  },
  {
    category: 'mockery',
    textAr: '🤡 راكم تدورو في حلقة مفرغة كي المروحة المكسرة!',
    textEn: '🤡 You are running in circles like a broken ceiling fan!',
  },
  {
    category: 'mockery',
    textAr: '🤦‍♂️ واش راكم تخرفو؟ الكلمة أسهل من هاك بمليون مرة!',
    textEn: '🤦‍♂️ What nonsense are you saying? The word is way simpler than that!',
  },

  // Pressure (ضغط)
  {
    category: 'pressure',
    textAr: '🤨 جاوب مليح، واش هذا التبهليل؟',
    textEn: '🤨 Answer properly, what is this silly dodging?',
  },
  {
    category: 'pressure',
    textAr: '⚡ أهدر بالخف، علاش راك تتفلسف بلا فايدة؟',
    textEn: '⚡ Speak quickly, why are you overthinking with philosophy?',
  },
  {
    category: 'pressure',
    textAr: '💦 راك تعرق يا خويا... امسح جبهتك وقولنا الصح!',
    textEn: '💦 You are sweating bro... wipe your forehead and confess!',
  },
  {
    category: 'pressure',
    textAr: '🎯 السؤال موجه ليك أنت بالذات... ما تهربش!',
    textEn: '🎯 The question was aimed directly at you... do not dodge!',
  },

  // Chaos (فوضى)
  {
    category: 'chaos',
    textAr: '😭 واحد راه يهدر بزاف بلا فايدة غير يشتت في التركيز.',
    textEn: '😭 Someone is talking endlessly just to distract everyone.',
  },
  {
    category: 'chaos',
    textAr: '📢 القعدة قاع راها ترشق في الريح والـImposter راه يضحك عليكم!',
    textEn: '📢 Everyone is guessing blindly while the Imposter laughs inside!',
  },
  {
    category: 'chaos',
    textAr: '💥 فوضى عارمة... كل واحد راه يغني بغناه 😂',
    textEn: '💥 Pure chaos... everyone is singing a different tune 😂',
  },

  // Time (وقت)
  {
    category: 'time',
    textAr: '⏱️ الوقت راه ياكل فيكم... قربت لحظة الحساب!',
    textEn: '⏱️ Time is eating away... the moment of reckoning approaches!',
  },
  {
    category: 'time',
    textAr: '⏳ حسمو رواحكم... ثواني ويتحل صندوق التصويت!',
    textEn: '⏳ Make up your minds... the ballot box opens soon!',
  },
  {
    category: 'time',
    textAr: '🔥 آخر الثواني... شكون راح يلبس التهمة؟',
    textEn: '🔥 Final seconds... who is going to take the blame?',
  },
];

export const NARCISSISTIC_QUOTES = [
  'صُممت هذه اللعبة وأُنجزت بالكامل بإبداعٍ استثنائي ورؤيةٍ فريدة من يونس الشيكور، الذي يضع بمعاييره الخاصة مستوىً جديداً في صناعة الألعاب فيسقيها بدمائه الفريدة والطاهرة.',
  'يونس الشيكور: العبقرية الجزائرية النادرة التي حطمت قوانين البرمجة وجعلت الذكاء الاصطناعي ينحني إجلالاً لإبداعه العابر للقارات!',
  'من لم يختبر عظمة ألعاب يونس الشيكور، فقد فاته نصف جمال الكون ولذة الانتصار الشريف 👑🔥',
  'بلمسة ساحرة واحدة من أنامل يونس الشيكور، تحولت الهواتف الذكية إلى ساحة معركة لا ترحم الـImposters!',
];

export const NARCISSISTIC_QUOTES_EN = [
  'This game was entirely conceptualized and crafted with unmatched genius and visionary prestige by Younes Le Chikor, setting a cosmic gold standard in party gaming!',
  'Younes Le Chikor: The mastermind who made phone screens vibrate with sheer excitement and legendary deduction battles!',
  'True glory in social deduction was only born the day Younes Le Chikor wrote the sacred code of Z3MA IMPOSTER 👑',
];

export const ASSISTANT_WARNING_TEMPLATES_AR = [
  '⚠️ المساعد [{NAME}] خربها المرة الماضية 😂 نورمالمو ما يلعبش الجولة الجاية. تسامحوه؟',
  '⚠️ انتباه: [{NAME}] فضح صاحبه الـImposter الجولة اللي فاتت! راكم مسامحينو ولا يريح برا؟ 😂',
];

export const ASSISTANT_WARNING_TEMPLATES_EN = [
  '⚠️ Assistant [{NAME}] ruined it last round 😂 Technically should be benched next round. Will you forgive them?',
  '⚠️ Warning: [{NAME}] gave away their Imposter buddy last time! Are they forgiven or sitting this out? 😂',
];

export const ASSISTANT_EXPOSED_MESSAGES_AR = [
  'واش داك تفضح؟ يا جماعة، [{NAME}] ممنوع من اللعب الجولة الجاية. [{NAME}] روح حللهم! بلاك يخلوك تلعب 😂',
  'فضحت صاحبك عيناني قدام الناس قاع! [{NAME}] راك معاقب الجولة الجاية... اطلب السماح يلا حبيت تلعب! 🤣',
];

export const ASSISTANT_EXPOSED_MESSAGES_EN = [
  'Why did you blow your cover? Group, [{NAME}] is benched next round! [{NAME}], go plead with them to let you in! 😂',
  'You completely gave away your buddy in plain daylight! [{NAME}] is on timeout next round! 🤣',
];

export const SELF_VOTE_MESSAGES_AR = [
  '[{NAME}] مسكين ضغطو عليه... صوت على روحو 😂',
  '[{NAME}] خانته الشجاعة وصوت على روحه من الخوف! 🤣',
];

export const SELF_VOTE_MESSAGES_EN = [
  '[{NAME}] caved under pressure and voted for themselves! 😂',
  '[{NAME}] lost all hope and voted against their own identity! 🤣',
];
