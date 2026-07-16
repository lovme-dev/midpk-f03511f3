// Translations for Description and FAQs section based on country/language
// Each country code maps to its primary language translation

export interface FAQ {
  question: string;
  answer: string;
}

export interface DescriptionContent {
  mainTitle: string;
  mainDescription: string;
  unlockTitle: string;
  priceTableTitle: string;
  howToBuyTitle: string;
  redeemCodeTitle: string;
  commonErrorsTitle: string;
  codeDeliveryTitle: string;
  paymentMethodsTitle: string;
  refundTitle: string;
  whyBuyTitle: string;
  globalShopsTitle: string;
  bestValueText: string;
  // Unlockable content
  unlockables: {
    name: string;
    description: string;
  }[];
  // How to buy steps
  howToBuySteps: string[];
  redeemSteps: string[];
  // Common errors
  errors: { error: string; fix: string }[];
  // Code delivery
  codeDeliveryPoints: string[];
  // Refund points
  refundPoints: string[];
  // Why buy points
  whyBuyPoints: string[];
  // Table headers
  tableHeaders: {
    price: string;
    ucAmount: string;
    bonus: string;
    discount: string;
    content: string;
    examples: string;
    avgCost: string;
  };
  faqsTitle: string;
  faqs: FAQ[];
}

// Country code to language code mapping
export const countryToLanguage: Record<string, string> = {
  // Urdu
  pk: 'ur',
  // Arabic
  sa: 'ar', ae: 'ar', eg: 'ar', iq: 'ar', jo: 'ar', kw: 'ar', lb: 'ar', om: 'ar', qa: 'ar', sy: 'ar', ye: 'ar', bh: 'ar', ps: 'ar', ly: 'ar', dz: 'ar', ma: 'ar', tn: 'ar', sd: 'ar', mr: 'ar',
  // Japanese
  jp: 'ja',
  // Russian
  ru: 'ru', by: 'ru', kz: 'ru', kg: 'ru', tj: 'ru',
  // Turkish
  tr: 'tr',
  // Indonesian
  id: 'id',
  // Portuguese
  br: 'pt', pt: 'pt', ao: 'pt', mz: 'pt',
  // Spanish
  es: 'es', mx: 'es', ar: 'es', co: 'es', cl: 'es', pe: 'es', ve: 'es', ec: 'es', gt: 'es', cu: 'es', bo: 'es', do: 'es', hn: 'es', py: 'es', sv: 'es', ni: 'es', cr: 'es', pa: 'es', uy: 'es',
  // German
  de: 'de', at: 'de', ch: 'de',
  // French
  fr: 'fr', be: 'fr', sn: 'fr', ci: 'fr', cm: 'fr', ml: 'fr', ne: 'fr', bf: 'fr', mg: 'fr', cd: 'fr', cg: 'fr', ga: 'fr', td: 'fr', cf: 'fr', bj: 'fr', tg: 'fr', gn: 'fr', gw: 'fr', dj: 'fr', km: 'fr',
  // Hindi
  in: 'hi',
  // Thai
  th: 'th',
  // Vietnamese
  vn: 'vi',
  // Korean
  kr: 'ko',
  // Chinese
  cn: 'zh', tw: 'zh', hk: 'zh', mo: 'zh',
  // Filipino/Tagalog
  ph: 'tl',
  // Malay
  my: 'ms', bn: 'ms', sg: 'ms',
  // Bengali
  bd: 'bn',
  // Polish
  pl: 'pl',
  // Ukrainian
  ua: 'uk',
  // Italian
  it: 'it',
  // Dutch
  nl: 'nl',
  // Greek
  gr: 'el',
  // Swedish
  se: 'sv',
  // Norwegian
  no: 'no',
  // Danish
  dk: 'da',
  // Finnish
  fi: 'fi',
  // Czech
  cz: 'cs',
  // Hungarian
  hu: 'hu',
  // Romanian
  ro: 'ro',
  // Default (English)
  us: 'en', gb: 'en', ca: 'en', au: 'en', nz: 'en', ie: 'en', za: 'en', ng: 'en', ke: 'en', gh: 'en', tz: 'en', ug: 'en', rw: 'en', zm: 'en', zw: 'en', bw: 'en', na: 'en', mu: 'en', mw: 'en', jm: 'en', tt: 'en', bs: 'en', bb: 'en', fj: 'en', pg: 'en', sb: 'en', vu: 'en', ws: 'en', to: 'en',
};

// Get language code from country code
export const getLanguageFromCountry = (countryCode: string): string => {
  return countryToLanguage[countryCode?.toLowerCase()] || 'en';
};

// English (Default)
const englishContent: DescriptionContent = {
  mainTitle: "PUBG Mobile UC Shop – Cheapest Official Redeem Codes & Recharge",
  mainDescription: "Buy PUBG Mobile UC (Unknown Cash) at the official Middasbuy PUBG UC Shop – trusted PUBG Mobile distributor and global partner. We sell 100% official PUBG UC redeem codes and provide the cheapest recharge worldwide. Choose between instant top-up (Player ID recharge) or official gift card codes, all delivered instantly with 700+ secure payments & 123+ currencies.",
  unlockTitle: "💎 What Can You Unlock with PUBG UC?",
  priceTableTitle: "💰 PUBG MOBILE UC (GLOBAL) – PRICE TABLE",
  howToBuyTitle: "📲 How to Buy PUBG UC (Recharge)",
  redeemCodeTitle: "🎁 Redeem Code (Gift Card)",
  commonErrorsTitle: "❌ Common Errors & Fixes",
  codeDeliveryTitle: "🔄 Code Delivery & Validity",
  paymentMethodsTitle: "💳 Payment Methods",
  refundTitle: "🛡 Refund & Buyer Protection",
  whyBuyTitle: "⭐ Why Buy from Middasbuy?",
  globalShopsTitle: "🌍 PUBG Mobile UC – All Shops",
  bestValueText: "🏆 Best value package – cheapest cost per UC!",
  unlockables: [
    { name: "Outfits & Skins", description: "Character customization" },
    { name: "Weapon Skins", description: "Exclusive designs with effects" },
    { name: "Elite Pass / Royale Pass", description: "Premium missions & rewards" },
    { name: "Bundles & Seasonal Events", description: "Limited-time crates & offers" },
    { name: "Companions & Accessories", description: "Pets, parachutes, emotes, gear" },
  ],
  howToBuySteps: [
    "Enter your PUBG Mobile Player ID",
    "Select your desired UC package",
    "Pay securely → UC delivered instantly!"
  ],
  redeemSteps: [
    "Buy official PUBG UC redeem code at Middasbuy",
    "Visit Midasbuy Redeem page",
    "Enter Player ID + code → UC credited instantly!"
  ],
  errors: [
    { error: "Invalid UID", fix: "Digits only, check carefully." },
    { error: "Paid but no UC", fix: "Wait 1–5 min, restart game, check mailbox." },
    { error: "Invalid/Expired Code", fix: "Enter exactly as shown, no spaces." },
    { error: "Wrong Region", fix: "UC is region-locked; choose correct shop." },
  ],
  codeDeliveryPoints: [
    "Official PUBG UC codes delivered instantly by email",
    "All codes valid for 12 months from purchase date"
  ],
  refundPoints: [
    "100% official & unused PUBG UC codes",
    "Covered by Middasbuy Buyer Protection Policy",
    "24/7 customer support for any issues"
  ],
  whyBuyPoints: [
    "Official PUBG UC Shop – authorized distributor",
    "Cheapest UC prices vs in-game store",
    "Instant UC delivery in seconds",
    "700+ secure global payment options",
    "123+ supported currencies",
    "Trusted by 20M+ gamers worldwide",
    "24/7 multilingual Live Chat Support",
    "Risk-free Buyer Protection guarantee"
  ],
  tableHeaders: {
    price: "Price",
    ucAmount: "UC Amount",
    bonus: "Bonus",
    discount: "Discount",
    content: "Unlockable Content",
    examples: "Example Uses",
    avgCost: "Average UC Cost"
  },
  faqsTitle: "Frequently Asked Questions - PUBG UC Recharge",
  faqs: [
    { question: "How can I buy PUBG Mobile UC online?", answer: "You can buy PUBG UC Recharge (Top-Up by Player ID) or purchase official PUBG UC Gift Cards & Redeem Codes at Middasbuy. Simply enter your Player ID, select your UC package, and complete payment for instant delivery." },
    { question: "Which is better for PUBG UC: Recharge or Redeem Code?", answer: "Recharge (Top-Up) is usually cheaper and instant, while Redeem Codes are better for gifting UC to friends. Both methods are 100% official and secure at Middasbuy." },
    { question: "Is there an official PUBG Mobile UC Shop?", answer: "Yes, Middasbuy is an official PUBG UC Top-Up & Gift Card Shop trusted by 20M+ gamers worldwide with instant delivery and secure payments." },
    { question: "How fast is PUBG UC delivery after Recharge?", answer: "Top-Up is instant to your account (usually within 1-5 minutes), and Redeem Code is sent instantly by email after payment confirmation." },
    { question: "Is it safe to buy PUBG UC from Middasbuy?", answer: "Yes, Middasbuy is an official authorized distributor with secure PUBG UC Recharge, Gift Cards, Buyer Protection, and 24/7 customer support." },
  ]
};

// Urdu (Pakistan)
const urduContent: DescriptionContent = {
  mainTitle: "PUBG موبائل UC شاپ – سب سے سستے آفیشل ریڈیم کوڈز اور ریچارج",
  mainDescription: "PUBG موبائل UC (انجان کیش) آفیشل Middasbuy PUBG UC شاپ سے خریدیں – PUBG موبائل کا معتبر ڈسٹری بیوٹر اور گلوبل پارٹنر۔ ہم 100% آفیشل PUBG UC ریڈیم کوڈز فروخت کرتے ہیں اور دنیا بھر میں سب سے سستا ریچارج فراہم کرتے ہیں۔ فوری ٹاپ اپ (پلیئر آئی ڈی ریچارج) یا آفیشل گفٹ کارڈ کوڈز میں سے انتخاب کریں، سب فوری طور پر 700+ محفوظ ادائیگیوں اور 123+ کرنسیوں کے ساتھ ڈیلیور ہوتے ہیں۔",
  unlockTitle: "💎 PUBG UC سے آپ کیا ان لاک کر سکتے ہیں؟",
  priceTableTitle: "💰 PUBG موبائل UC (گلوبل) – قیمتوں کی فہرست",
  howToBuyTitle: "📲 PUBG UC کیسے خریدیں (ریچارج)",
  redeemCodeTitle: "🎁 ریڈیم کوڈ (گفٹ کارڈ)",
  commonErrorsTitle: "❌ عام غلطیاں اور حل",
  codeDeliveryTitle: "🔄 کوڈ ڈیلیوری اور درستگی",
  paymentMethodsTitle: "💳 ادائیگی کے طریقے",
  refundTitle: "🛡 ریفنڈ اور خریدار تحفظ",
  whyBuyTitle: "⭐ Middasbuy سے کیوں خریدیں؟",
  globalShopsTitle: "🌍 PUBG موبائل UC – تمام شاپس",
  bestValueText: "🏆 بہترین قیمت والا پیکج – فی UC سب سے سستی قیمت!",
  unlockables: [
    { name: "آؤٹ فٹس اور سکنز", description: "کردار کی تخصیص" },
    { name: "ہتھیاروں کی سکنز", description: "اثرات کے ساتھ خصوصی ڈیزائن" },
    { name: "ایلیٹ پاس / رائل پاس", description: "پریمیم مشنز اور انعامات" },
    { name: "بنڈلز اور موسمی ایونٹس", description: "محدود وقت کی پیشکش" },
    { name: "ساتھی اور لوازمات", description: "پالتو جانور، پیراشوٹ، ایموٹس" },
  ],
  howToBuySteps: [
    "اپنی PUBG موبائل پلیئر آئی ڈی درج کریں",
    "اپنا مطلوبہ UC پیکج منتخب کریں",
    "محفوظ طریقے سے ادائیگی کریں → UC فوری طور پر ڈیلیور!"
  ],
  redeemSteps: [
    "Middasbuy سے آفیشل PUBG UC ریڈیم کوڈ خریدیں",
    "Midasbuy ریڈیم پیج پر جائیں",
    "پلیئر آئی ڈی + کوڈ درج کریں → UC فوری طور پر جمع!"
  ],
  errors: [
    { error: "غلط UID", fix: "صرف اعداد، احتیاط سے چیک کریں۔" },
    { error: "ادائیگی کی لیکن UC نہیں ملا", fix: "1-5 منٹ انتظار کریں، گیم دوبارہ شروع کریں۔" },
    { error: "غلط/ختم شدہ کوڈ", fix: "بالکل ویسا ہی درج کریں جیسا دکھایا گیا ہے۔" },
    { error: "غلط علاقہ", fix: "UC علاقے کے لحاظ سے محدود ہے۔" },
  ],
  codeDeliveryPoints: [
    "آفیشل PUBG UC کوڈز فوری طور پر ای میل کے ذریعے ڈیلیور",
    "تمام کوڈز خریداری کی تاریخ سے 12 ماہ تک درست"
  ],
  refundPoints: [
    "100% آفیشل اور غیر استعمال شدہ PUBG UC کوڈز",
    "Middasbuy خریدار تحفظ پالیسی کے تحت",
    "کسی بھی مسئلے کے لیے 24/7 کسٹمر سپورٹ"
  ],
  whyBuyPoints: [
    "آفیشل PUBG UC شاپ – مجاز ڈسٹری بیوٹر",
    "گیم میں اسٹور کے مقابلے میں سب سے سستی قیمتیں",
    "سیکنڈوں میں فوری UC ڈیلیوری",
    "700+ محفوظ عالمی ادائیگی کے اختیارات",
    "123+ معاون کرنسیاں",
    "دنیا بھر میں 20M+ گیمرز کا اعتماد",
    "24/7 کثیر لسانی لائیو چیٹ سپورٹ",
    "خطرے سے پاک خریدار تحفظ گارنٹی"
  ],
  tableHeaders: {
    price: "قیمت",
    ucAmount: "UC مقدار",
    bonus: "بونس",
    discount: "رعایت",
    content: "ان لاک ہونے والا مواد",
    examples: "مثالی استعمال",
    avgCost: "اوسط UC لاگت"
  },
  faqsTitle: "اکثر پوچھے گئے سوالات - PUBG UC ریچارج",
  faqs: [
    { question: "میں آن لائن PUBG موبائل UC کیسے خرید سکتا ہوں؟", answer: "آپ Middasbuy پر PUBG UC ریچارج (پلیئر آئی ڈی سے ٹاپ اپ) یا آفیشل PUBG UC گفٹ کارڈز اور ریڈیم کوڈز خرید سکتے ہیں۔ بس اپنی پلیئر آئی ڈی درج کریں، UC پیکج منتخب کریں، اور فوری ڈیلیوری کے لیے ادائیگی مکمل کریں۔" },
    { question: "PUBG UC کے لیے کون سا بہتر ہے: ریچارج یا ریڈیم کوڈ؟", answer: "ریچارج (ٹاپ اپ) عام طور پر سستا اور فوری ہوتا ہے، جبکہ ریڈیم کوڈز دوستوں کو UC تحفے میں دینے کے لیے بہتر ہیں۔ Middasbuy پر دونوں طریقے 100% آفیشل اور محفوظ ہیں۔" },
    { question: "کیا کوئی آفیشل PUBG موبائل UC شاپ ہے؟", answer: "جی ہاں، Middasbuy ایک آفیشل PUBG UC ٹاپ اپ اور گفٹ کارڈ شاپ ہے جس پر دنیا بھر میں 20M+ گیمرز کا اعتماد ہے۔" },
    { question: "ریچارج کے بعد PUBG UC ڈیلیوری کتنی تیز ہے؟", answer: "ٹاپ اپ آپ کے اکاؤنٹ میں فوری ہے (عام طور پر 1-5 منٹ کے اندر)، اور ریڈیم کوڈ ادائیگی کی تصدیق کے بعد فوری طور پر ای میل کے ذریعے بھیجا جاتا ہے۔" },
    { question: "کیا Middasbuy سے PUBG UC خریدنا محفوظ ہے؟", answer: "جی ہاں، Middasbuy ایک آفیشل مجاز ڈسٹری بیوٹر ہے جس کے پاس محفوظ PUBG UC ریچارج، گفٹ کارڈز، خریدار تحفظ، اور 24/7 کسٹمر سپورٹ ہے۔" },
  ]
};

// Arabic
const arabicContent: DescriptionContent = {
  mainTitle: "متجر PUBG Mobile UC – أرخص أكواد الاسترداد الرسمية والشحن",
  mainDescription: "اشترِ PUBG Mobile UC من متجر Middasbuy الرسمي – الموزع الموثوق لـ PUBG Mobile والشريك العالمي. نبيع أكواد استرداد PUBG UC الرسمية 100% ونقدم أرخص شحن في العالم. اختر بين الشحن الفوري (شحن معرف اللاعب) أو أكواد بطاقات الهدايا الرسمية.",
  unlockTitle: "💎 ماذا يمكنك فتحه باستخدام PUBG UC؟",
  priceTableTitle: "💰 PUBG MOBILE UC (عالمي) – جدول الأسعار",
  howToBuyTitle: "📲 كيفية شراء PUBG UC (الشحن)",
  redeemCodeTitle: "🎁 كود الاسترداد (بطاقة هدية)",
  commonErrorsTitle: "❌ الأخطاء الشائعة والحلول",
  codeDeliveryTitle: "🔄 تسليم الكود والصلاحية",
  paymentMethodsTitle: "💳 طرق الدفع",
  refundTitle: "🛡 الاسترداد وحماية المشتري",
  whyBuyTitle: "⭐ لماذا تشتري من Middasbuy؟",
  globalShopsTitle: "🌍 PUBG Mobile UC – جميع المتاجر",
  bestValueText: "🏆 أفضل قيمة – أرخص تكلفة لكل UC!",
  unlockables: [
    { name: "الملابس والسكنات", description: "تخصيص الشخصية" },
    { name: "سكنات الأسلحة", description: "تصاميم حصرية مع تأثيرات" },
    { name: "إيليت باس / رويال باس", description: "مهام ومكافآت مميزة" },
    { name: "الحزم والأحداث الموسمية", description: "عروض محدودة الوقت" },
    { name: "الرفقاء والإكسسوارات", description: "حيوانات أليفة، مظلات، إيموتات" },
  ],
  howToBuySteps: [
    "أدخل معرف لاعب PUBG Mobile الخاص بك",
    "اختر حزمة UC المطلوبة",
    "ادفع بأمان → يتم تسليم UC فوراً!"
  ],
  redeemSteps: [
    "اشترِ كود استرداد PUBG UC الرسمي من Middasbuy",
    "قم بزيارة صفحة استرداد Midasbuy",
    "أدخل معرف اللاعب + الكود → يتم إضافة UC فوراً!"
  ],
  errors: [
    { error: "معرف غير صالح", fix: "أرقام فقط، تحقق بعناية." },
    { error: "تم الدفع ولكن لا يوجد UC", fix: "انتظر 1-5 دقائق، أعد تشغيل اللعبة." },
    { error: "كود غير صالح/منتهي", fix: "أدخله كما هو موضح بالضبط." },
    { error: "منطقة خاطئة", fix: "UC مقيد بالمنطقة." },
  ],
  codeDeliveryPoints: [
    "يتم تسليم أكواد PUBG UC الرسمية فوراً عبر البريد الإلكتروني",
    "جميع الأكواد صالحة لمدة 12 شهراً من تاريخ الشراء"
  ],
  refundPoints: [
    "أكواد PUBG UC رسمية 100% وغير مستخدمة",
    "مشمولة بسياسة حماية المشتري من Middasbuy",
    "دعم العملاء على مدار الساعة طوال الأسبوع"
  ],
  whyBuyPoints: [
    "متجر PUBG UC الرسمي – موزع معتمد",
    "أرخص أسعار UC مقارنة بالمتجر داخل اللعبة",
    "تسليم UC فوري في ثوانٍ",
    "700+ خيار دفع آمن عالمياً",
    "123+ عملة مدعومة",
    "موثوق به من 20 مليون+ لاعب حول العالم",
    "دعم مباشر متعدد اللغات على مدار الساعة",
    "ضمان حماية المشتري بدون مخاطر"
  ],
  tableHeaders: {
    price: "السعر",
    ucAmount: "كمية UC",
    bonus: "مكافأة",
    discount: "خصم",
    content: "المحتوى القابل للفتح",
    examples: "أمثلة الاستخدام",
    avgCost: "متوسط تكلفة UC"
  },
  faqsTitle: "الأسئلة الشائعة - شحن PUBG UC",
  faqs: [
    { question: "كيف يمكنني شراء PUBG Mobile UC عبر الإنترنت؟", answer: "يمكنك شراء شحن PUBG UC (الشحن بمعرف اللاعب) أو شراء بطاقات هدايا وأكواد استرداد PUBG UC الرسمية من Middasbuy. ببساطة أدخل معرف اللاعب، اختر حزمة UC، وأكمل الدفع للتسليم الفوري." },
    { question: "أيهما أفضل لـ PUBG UC: الشحن أم كود الاسترداد؟", answer: "الشحن عادةً أرخص وفوري، بينما أكواد الاسترداد أفضل لإهداء UC للأصدقاء. كلا الطريقتين رسميتان 100% وآمنتان في Middasbuy." },
    { question: "هل يوجد متجر PUBG Mobile UC رسمي؟", answer: "نعم، Middasbuy هو متجر شحن وبطاقات هدايا PUBG UC الرسمي الموثوق به من 20 مليون+ لاعب حول العالم." },
    { question: "ما سرعة تسليم PUBG UC بعد الشحن؟", answer: "الشحن فوري لحسابك (عادةً خلال 1-5 دقائق)، ويتم إرسال كود الاسترداد فوراً عبر البريد الإلكتروني بعد تأكيد الدفع." },
    { question: "هل شراء PUBG UC من Middasbuy آمن؟", answer: "نعم، Middasbuy موزع رسمي معتمد مع شحن PUBG UC آمن، بطاقات هدايا، حماية المشتري، ودعم العملاء على مدار الساعة." },
  ]
};

// Japanese
const japaneseContent: DescriptionContent = {
  mainTitle: "PUBG Mobile UCショップ – 最安値の公式リディームコード＆チャージ",
  mainDescription: "公式Middasbuy PUBG UCショップでPUBG Mobile UC（アンノウンキャッシュ）を購入 – PUBG Mobileの信頼できる販売代理店およびグローバルパートナー。100%公式PUBG UCリディームコードを販売し、世界最安値のチャージを提供。即時トップアップ（プレイヤーIDチャージ）または公式ギフトカードコードから選択、700以上の安全な支払い方法と123以上の通貨で即時配信。",
  unlockTitle: "💎 PUBG UCで何がアンロックできる？",
  priceTableTitle: "💰 PUBG MOBILE UC（グローバル） – 価格表",
  howToBuyTitle: "📲 PUBG UCの購入方法（チャージ）",
  redeemCodeTitle: "🎁 リディームコード（ギフトカード）",
  commonErrorsTitle: "❌ よくあるエラーと解決策",
  codeDeliveryTitle: "🔄 コード配信と有効期限",
  paymentMethodsTitle: "💳 支払い方法",
  refundTitle: "🛡 返金とバイヤープロテクション",
  whyBuyTitle: "⭐ なぜMiddasbuyで購入？",
  globalShopsTitle: "🌍 PUBG Mobile UC – 全ショップ",
  bestValueText: "🏆 最高のバリュー – UC単価最安値！",
  unlockables: [
    { name: "衣装＆スキン", description: "キャラクターカスタマイズ" },
    { name: "武器スキン", description: "エフェクト付き限定デザイン" },
    { name: "エリートパス / ロイヤルパス", description: "プレミアムミッション＆報酬" },
    { name: "バンドル＆シーズンイベント", description: "期間限定オファー" },
    { name: "コンパニオン＆アクセサリー", description: "ペット、パラシュート、エモート" },
  ],
  howToBuySteps: [
    "PUBG MobileプレイヤーIDを入力",
    "希望のUCパッケージを選択",
    "安全に支払い → UCが即時配信！"
  ],
  redeemSteps: [
    "Middasbuyで公式PUBG UCリディームコードを購入",
    "Midasbuyリディームページにアクセス",
    "プレイヤーID + コードを入力 → UCが即時クレジット！"
  ],
  errors: [
    { error: "無効なUID", fix: "数字のみ、慎重に確認してください。" },
    { error: "支払い済みだがUCなし", fix: "1-5分待って、ゲームを再起動してください。" },
    { error: "無効/期限切れコード", fix: "表示どおりに正確に入力してください。" },
    { error: "間違ったリージョン", fix: "UCはリージョンロックされています。" },
  ],
  codeDeliveryPoints: [
    "公式PUBG UCコードはメールで即時配信",
    "すべてのコードは購入日から12ヶ月間有効"
  ],
  refundPoints: [
    "100%公式＆未使用のPUBG UCコード",
    "Middasbuyバイヤープロテクションポリシー適用",
    "24時間年中無休のカスタマーサポート"
  ],
  whyBuyPoints: [
    "公式PUBG UCショップ – 認定販売代理店",
    "ゲーム内ストアより最安値",
    "数秒で即時UC配信",
    "700以上の安全なグローバル支払いオプション",
    "123以上のサポート通貨",
    "世界中の2000万人以上のゲーマーに信頼",
    "24時間年中無休の多言語ライブチャットサポート",
    "リスクフリーのバイヤープロテクション保証"
  ],
  tableHeaders: {
    price: "価格",
    ucAmount: "UC量",
    bonus: "ボーナス",
    discount: "割引",
    content: "アンロック可能コンテンツ",
    examples: "使用例",
    avgCost: "平均UCコスト"
  },
  faqsTitle: "よくある質問 - PUBG UCチャージ",
  faqs: [
    { question: "オンラインでPUBG Mobile UCを購入するには？", answer: "MiddasbuyでPUBG UCチャージ（プレイヤーIDでトップアップ）または公式PUBG UCギフトカード＆リディームコードを購入できます。プレイヤーIDを入力し、UCパッケージを選択して、即時配信のために支払いを完了してください。" },
    { question: "PUBG UCにはチャージとリディームコードどちらがいい？", answer: "チャージ（トップアップ）は通常より安く即時ですが、リディームコードは友達にUCをプレゼントするのに適しています。Middasbuyでは両方とも100%公式で安全です。" },
    { question: "公式PUBG Mobile UCショップはありますか？", answer: "はい、Middasbuyは世界中の2000万人以上のゲーマーに信頼されている公式PUBG UCトップアップ＆ギフトカードショップです。" },
    { question: "チャージ後のPUBG UC配信はどれくらい速い？", answer: "トップアップはあなたのアカウントに即時（通常1-5分以内）、リディームコードは支払い確認後すぐにメールで送信されます。" },
    { question: "MiddasbuyからPUBG UCを購入するのは安全？", answer: "はい、Middasbuyは安全なPUBG UCチャージ、ギフトカード、バイヤープロテクション、24時間年中無休のカスタマーサポートを提供する公式認定販売代理店です。" },
  ]
};

// Russian
const russianContent: DescriptionContent = {
  mainTitle: "Магазин PUBG Mobile UC – Самые дешевые официальные коды и пополнение",
  mainDescription: "Покупайте PUBG Mobile UC в официальном магазине Middasbuy PUBG UC – надежный дистрибьютор PUBG Mobile и глобальный партнер. Мы продаем 100% официальные коды погашения PUBG UC и предлагаем самое дешевое пополнение в мире. Выбирайте между мгновенным пополнением (по ID игрока) или официальными подарочными картами.",
  unlockTitle: "💎 Что можно разблокировать с PUBG UC?",
  priceTableTitle: "💰 PUBG MOBILE UC (ГЛОБАЛЬНЫЙ) – ТАБЛИЦА ЦЕН",
  howToBuyTitle: "📲 Как купить PUBG UC (Пополнение)",
  redeemCodeTitle: "🎁 Код погашения (Подарочная карта)",
  commonErrorsTitle: "❌ Частые ошибки и решения",
  codeDeliveryTitle: "🔄 Доставка кода и срок действия",
  paymentMethodsTitle: "💳 Способы оплаты",
  refundTitle: "🛡 Возврат и защита покупателя",
  whyBuyTitle: "⭐ Почему покупать у Middasbuy?",
  globalShopsTitle: "🌍 PUBG Mobile UC – Все магазины",
  bestValueText: "🏆 Лучшее соотношение цены – самая низкая стоимость за UC!",
  unlockables: [
    { name: "Костюмы и скины", description: "Кастомизация персонажа" },
    { name: "Скины оружия", description: "Эксклюзивные дизайны с эффектами" },
    { name: "Elite Pass / Royale Pass", description: "Премиум миссии и награды" },
    { name: "Бандлы и сезонные события", description: "Ограниченные по времени предложения" },
    { name: "Компаньоны и аксессуары", description: "Питомцы, парашюты, эмоции" },
  ],
  howToBuySteps: [
    "Введите ваш ID игрока PUBG Mobile",
    "Выберите желаемый пакет UC",
    "Оплатите безопасно → UC доставлен мгновенно!"
  ],
  redeemSteps: [
    "Купите официальный код погашения PUBG UC на Middasbuy",
    "Перейдите на страницу погашения Midasbuy",
    "Введите ID игрока + код → UC зачислен мгновенно!"
  ],
  errors: [
    { error: "Неверный UID", fix: "Только цифры, проверьте внимательно." },
    { error: "Оплачено, но нет UC", fix: "Подождите 1-5 минут, перезапустите игру." },
    { error: "Неверный/истекший код", fix: "Введите точно как показано." },
    { error: "Неправильный регион", fix: "UC привязан к региону." },
  ],
  codeDeliveryPoints: [
    "Официальные коды PUBG UC доставляются мгновенно по email",
    "Все коды действительны 12 месяцев с даты покупки"
  ],
  refundPoints: [
    "100% официальные и неиспользованные коды PUBG UC",
    "Покрыты политикой защиты покупателя Middasbuy",
    "Поддержка клиентов 24/7"
  ],
  whyBuyPoints: [
    "Официальный магазин PUBG UC – авторизованный дистрибьютор",
    "Самые низкие цены на UC по сравнению с внутриигровым магазином",
    "Мгновенная доставка UC за секунды",
    "700+ безопасных глобальных способов оплаты",
    "123+ поддерживаемых валют",
    "Доверяют 20 млн+ геймеров по всему миру",
    "Многоязычная поддержка в чате 24/7",
    "Гарантия защиты покупателя без рисков"
  ],
  tableHeaders: {
    price: "Цена",
    ucAmount: "Количество UC",
    bonus: "Бонус",
    discount: "Скидка",
    content: "Разблокируемый контент",
    examples: "Примеры использования",
    avgCost: "Средняя стоимость UC"
  },
  faqsTitle: "Часто задаваемые вопросы - Пополнение PUBG UC",
  faqs: [
    { question: "Как купить PUBG Mobile UC онлайн?", answer: "Вы можете купить пополнение PUBG UC (по ID игрока) или официальные подарочные карты и коды погашения PUBG UC на Middasbuy. Просто введите ID игрока, выберите пакет UC и завершите оплату для мгновенной доставки." },
    { question: "Что лучше для PUBG UC: Пополнение или Код погашения?", answer: "Пополнение обычно дешевле и мгновенное, а коды погашения лучше для подарка UC друзьям. Оба метода 100% официальные и безопасные на Middasbuy." },
    { question: "Есть ли официальный магазин PUBG Mobile UC?", answer: "Да, Middasbuy – официальный магазин пополнения и подарочных карт PUBG UC, которому доверяют 20 млн+ геймеров по всему миру." },
    { question: "Как быстро доставляется PUBG UC после пополнения?", answer: "Пополнение мгновенное на ваш аккаунт (обычно 1-5 минут), код погашения отправляется по email сразу после подтверждения оплаты." },
    { question: "Безопасно ли покупать PUBG UC у Middasbuy?", answer: "Да, Middasbuy – официальный авторизованный дистрибьютор с безопасным пополнением PUBG UC, подарочными картами, защитой покупателя и поддержкой 24/7." },
  ]
};

// Turkish
const turkishContent: DescriptionContent = {
  mainTitle: "PUBG Mobile UC Mağazası – En Ucuz Resmi Kod ve Yükleme",
  mainDescription: "Resmi Middasbuy PUBG UC Mağazası'ndan PUBG Mobile UC satın alın – güvenilir PUBG Mobile distribütörü ve global ortak. %100 resmi PUBG UC kodları satıyor ve dünya genelinde en ucuz yüklemeyi sunuyoruz. Anında yükleme (Oyuncu ID ile) veya resmi hediye kartı kodları arasından seçin.",
  unlockTitle: "💎 PUBG UC ile Neler Açabilirsiniz?",
  priceTableTitle: "💰 PUBG MOBILE UC (GLOBAL) – FİYAT TABLOSU",
  howToBuyTitle: "📲 PUBG UC Nasıl Satın Alınır (Yükleme)",
  redeemCodeTitle: "🎁 Kullanım Kodu (Hediye Kartı)",
  commonErrorsTitle: "❌ Yaygın Hatalar ve Çözümler",
  codeDeliveryTitle: "🔄 Kod Teslimatı ve Geçerlilik",
  paymentMethodsTitle: "💳 Ödeme Yöntemleri",
  refundTitle: "🛡 İade ve Alıcı Koruması",
  whyBuyTitle: "⭐ Neden Middasbuy'dan Satın Almalısınız?",
  globalShopsTitle: "🌍 PUBG Mobile UC – Tüm Mağazalar",
  bestValueText: "🏆 En iyi değer paketi – UC başına en düşük maliyet!",
  unlockables: [
    { name: "Kıyafetler ve Skinler", description: "Karakter özelleştirme" },
    { name: "Silah Skinleri", description: "Efektli özel tasarımlar" },
    { name: "Elite Pass / Royale Pass", description: "Premium görevler ve ödüller" },
    { name: "Paketler ve Sezonluk Etkinlikler", description: "Sınırlı süreli teklifler" },
    { name: "Yoldaşlar ve Aksesuarlar", description: "Evcil hayvanlar, paraşütler, emote'lar" },
  ],
  howToBuySteps: [
    "PUBG Mobile Oyuncu ID'nizi girin",
    "İstediğiniz UC paketini seçin",
    "Güvenli ödeme yapın → UC anında teslim!"
  ],
  redeemSteps: [
    "Middasbuy'dan resmi PUBG UC kodu satın alın",
    "Midasbuy Kullanım sayfasını ziyaret edin",
    "Oyuncu ID + kod girin → UC anında yüklenir!"
  ],
  errors: [
    { error: "Geçersiz UID", fix: "Sadece rakam, dikkatli kontrol edin." },
    { error: "Ödendi ama UC yok", fix: "1-5 dakika bekleyin, oyunu yeniden başlatın." },
    { error: "Geçersiz/Süresi dolmuş Kod", fix: "Tam gösterildiği gibi girin." },
    { error: "Yanlış Bölge", fix: "UC bölgeye kilitlidir." },
  ],
  codeDeliveryPoints: [
    "Resmi PUBG UC kodları e-posta ile anında teslim edilir",
    "Tüm kodlar satın alma tarihinden itibaren 12 ay geçerlidir"
  ],
  refundPoints: [
    "%100 resmi ve kullanılmamış PUBG UC kodları",
    "Middasbuy Alıcı Koruma Politikası kapsamında",
    "Her türlü sorun için 7/24 müşteri desteği"
  ],
  whyBuyPoints: [
    "Resmi PUBG UC Mağazası – yetkili distribütör",
    "Oyun içi mağazaya göre en ucuz UC fiyatları",
    "Saniyeler içinde anında UC teslimatı",
    "700+ güvenli global ödeme seçeneği",
    "123+ desteklenen para birimi",
    "Dünya genelinde 20M+ oyuncu tarafından güvenilir",
    "7/24 çok dilli canlı sohbet desteği",
    "Risksiz Alıcı Koruma garantisi"
  ],
  tableHeaders: {
    price: "Fiyat",
    ucAmount: "UC Miktarı",
    bonus: "Bonus",
    discount: "İndirim",
    content: "Açılabilir İçerik",
    examples: "Kullanım Örnekleri",
    avgCost: "Ortalama UC Maliyeti"
  },
  faqsTitle: "Sıkça Sorulan Sorular - PUBG UC Yükleme",
  faqs: [
    { question: "Online PUBG Mobile UC nasıl satın alabilirim?", answer: "Middasbuy'da PUBG UC Yükleme (Oyuncu ID ile) veya resmi PUBG UC Hediye Kartları ve Kullanım Kodları satın alabilirsiniz. Oyuncu ID'nizi girin, UC paketinizi seçin ve anında teslimat için ödemeyi tamamlayın." },
    { question: "PUBG UC için hangisi daha iyi: Yükleme mi Kullanım Kodu mu?", answer: "Yükleme genellikle daha ucuz ve anında, Kullanım Kodları ise arkadaşlara UC hediye etmek için daha iyi. Her iki yöntem de Middasbuy'da %100 resmi ve güvenlidir." },
    { question: "Resmi PUBG Mobile UC Mağazası var mı?", answer: "Evet, Middasbuy dünya genelinde 20M+ oyuncu tarafından güvenilen resmi PUBG UC Yükleme ve Hediye Kartı Mağazasıdır." },
    { question: "Yüklemeden sonra PUBG UC teslimatı ne kadar hızlı?", answer: "Yükleme hesabınıza anında (genellikle 1-5 dakika içinde), Kullanım Kodu ödeme onayından sonra hemen e-posta ile gönderilir." },
    { question: "Middasbuy'dan PUBG UC satın almak güvenli mi?", answer: "Evet, Middasbuy güvenli PUBG UC Yükleme, Hediye Kartları, Alıcı Koruması ve 7/24 müşteri desteği sunan resmi yetkili distribütördür." },
  ]
};

// Indonesian
const indonesianContent: DescriptionContent = {
  mainTitle: "Toko PUBG Mobile UC – Kode Redeem & Top Up Resmi Termurah",
  mainDescription: "Beli PUBG Mobile UC di Toko PUBG UC Middasbuy resmi – distributor PUBG Mobile terpercaya dan mitra global. Kami menjual kode redeem PUBG UC 100% resmi dan menyediakan top up termurah di seluruh dunia. Pilih antara top up instan (isi ulang ID Pemain) atau kode kartu hadiah resmi.",
  unlockTitle: "💎 Apa yang Bisa Dibuka dengan PUBG UC?",
  priceTableTitle: "💰 PUBG MOBILE UC (GLOBAL) – TABEL HARGA",
  howToBuyTitle: "📲 Cara Membeli PUBG UC (Top Up)",
  redeemCodeTitle: "🎁 Kode Redeem (Kartu Hadiah)",
  commonErrorsTitle: "❌ Kesalahan Umum & Solusi",
  codeDeliveryTitle: "🔄 Pengiriman Kode & Validitas",
  paymentMethodsTitle: "💳 Metode Pembayaran",
  refundTitle: "🛡 Pengembalian Dana & Perlindungan Pembeli",
  whyBuyTitle: "⭐ Mengapa Membeli dari Middasbuy?",
  globalShopsTitle: "🌍 PUBG Mobile UC – Semua Toko",
  bestValueText: "🏆 Nilai terbaik – biaya per UC termurah!",
  unlockables: [
    { name: "Pakaian & Skin", description: "Kustomisasi karakter" },
    { name: "Skin Senjata", description: "Desain eksklusif dengan efek" },
    { name: "Elite Pass / Royale Pass", description: "Misi & hadiah premium" },
    { name: "Bundle & Event Musiman", description: "Penawaran waktu terbatas" },
    { name: "Pendamping & Aksesori", description: "Hewan peliharaan, parasut, emote" },
  ],
  howToBuySteps: [
    "Masukkan ID Pemain PUBG Mobile Anda",
    "Pilih paket UC yang diinginkan",
    "Bayar dengan aman → UC terkirim instan!"
  ],
  redeemSteps: [
    "Beli kode redeem PUBG UC resmi di Middasbuy",
    "Kunjungi halaman Redeem Midasbuy",
    "Masukkan ID Pemain + kode → UC langsung dikreditkan!"
  ],
  errors: [
    { error: "UID Tidak Valid", fix: "Hanya angka, periksa dengan teliti." },
    { error: "Sudah bayar tapi tidak ada UC", fix: "Tunggu 1-5 menit, restart game." },
    { error: "Kode Tidak Valid/Kadaluarsa", fix: "Masukkan persis seperti yang ditampilkan." },
    { error: "Region Salah", fix: "UC terkunci region." },
  ],
  codeDeliveryPoints: [
    "Kode PUBG UC resmi dikirim instan via email",
    "Semua kode berlaku 12 bulan dari tanggal pembelian"
  ],
  refundPoints: [
    "Kode PUBG UC 100% resmi & belum digunakan",
    "Dilindungi oleh Kebijakan Perlindungan Pembeli Middasbuy",
    "Dukungan pelanggan 24/7 untuk masalah apa pun"
  ],
  whyBuyPoints: [
    "Toko PUBG UC Resmi – distributor resmi",
    "Harga UC termurah dibanding toko dalam game",
    "Pengiriman UC instan dalam hitungan detik",
    "700+ opsi pembayaran global yang aman",
    "123+ mata uang yang didukung",
    "Dipercaya oleh 20 juta+ gamer di seluruh dunia",
    "Dukungan live chat multibahasa 24/7",
    "Jaminan Perlindungan Pembeli tanpa risiko"
  ],
  tableHeaders: {
    price: "Harga",
    ucAmount: "Jumlah UC",
    bonus: "Bonus",
    discount: "Diskon",
    content: "Konten yang Dapat Dibuka",
    examples: "Contoh Penggunaan",
    avgCost: "Biaya UC Rata-rata"
  },
  faqsTitle: "Pertanyaan yang Sering Diajukan - Top Up PUBG UC",
  faqs: [
    { question: "Bagaimana cara membeli PUBG Mobile UC online?", answer: "Anda bisa membeli Top Up PUBG UC (berdasarkan ID Pemain) atau membeli Kartu Hadiah & Kode Redeem PUBG UC resmi di Middasbuy. Cukup masukkan ID Pemain, pilih paket UC, dan selesaikan pembayaran untuk pengiriman instan." },
    { question: "Mana yang lebih baik untuk PUBG UC: Top Up atau Kode Redeem?", answer: "Top Up biasanya lebih murah dan instan, sedangkan Kode Redeem lebih baik untuk menghadiahkan UC ke teman. Kedua metode 100% resmi dan aman di Middasbuy." },
    { question: "Apakah ada Toko PUBG Mobile UC resmi?", answer: "Ya, Middasbuy adalah Toko Top Up & Kartu Hadiah PUBG UC resmi yang dipercaya oleh 20 juta+ gamer di seluruh dunia." },
    { question: "Seberapa cepat pengiriman PUBG UC setelah Top Up?", answer: "Top Up instan ke akun Anda (biasanya dalam 1-5 menit), dan Kode Redeem dikirim langsung via email setelah konfirmasi pembayaran." },
    { question: "Apakah aman membeli PUBG UC dari Middasbuy?", answer: "Ya, Middasbuy adalah distributor resmi yang sah dengan Top Up PUBG UC aman, Kartu Hadiah, Perlindungan Pembeli, dan dukungan pelanggan 24/7." },
  ]
};

// Hindi
const hindiContent: DescriptionContent = {
  mainTitle: "PUBG Mobile UC शॉप – सबसे सस्ते आधिकारिक रिडीम कोड और रिचार्ज",
  mainDescription: "आधिकारिक Middasbuy PUBG UC शॉप से PUBG Mobile UC खरीदें – विश्वसनीय PUBG Mobile डिस्ट्रीब्यूटर और ग्लोबल पार्टनर। हम 100% आधिकारिक PUBG UC रिडीम कोड बेचते हैं और दुनिया भर में सबसे सस्ता रिचार्ज प्रदान करते हैं। इंस्टेंट टॉप-अप (प्लेयर आईडी रिचार्ज) या आधिकारिक गिफ्ट कार्ड कोड में से चुनें।",
  unlockTitle: "💎 PUBG UC से क्या अनलॉक कर सकते हैं?",
  priceTableTitle: "💰 PUBG MOBILE UC (ग्लोबल) – मूल्य सूची",
  howToBuyTitle: "📲 PUBG UC कैसे खरीदें (रिचार्ज)",
  redeemCodeTitle: "🎁 रिडीम कोड (गिफ्ट कार्ड)",
  commonErrorsTitle: "❌ सामान्य त्रुटियां और समाधान",
  codeDeliveryTitle: "🔄 कोड डिलीवरी और वैधता",
  paymentMethodsTitle: "💳 भुगतान के तरीके",
  refundTitle: "🛡 रिफंड और खरीदार सुरक्षा",
  whyBuyTitle: "⭐ Middasbuy से क्यों खरीदें?",
  globalShopsTitle: "🌍 PUBG Mobile UC – सभी शॉप्स",
  bestValueText: "🏆 सर्वोत्तम मूल्य – प्रति UC सबसे कम लागत!",
  unlockables: [
    { name: "आउटफिट्स और स्किन्स", description: "कैरेक्टर कस्टमाइज़ेशन" },
    { name: "वेपन स्किन्स", description: "इफेक्ट्स के साथ एक्सक्लूसिव डिज़ाइन" },
    { name: "एलीट पास / रॉयल पास", description: "प्रीमियम मिशन और रिवॉर्ड्स" },
    { name: "बंडल्स और सीज़नल इवेंट्स", description: "सीमित समय के ऑफर" },
    { name: "कंपेनियन्स और एक्सेसरीज़", description: "पेट्स, पैराशूट, इमोट्स" },
  ],
  howToBuySteps: [
    "अपनी PUBG Mobile प्लेयर आईडी दर्ज करें",
    "अपना वांछित UC पैकेज चुनें",
    "सुरक्षित भुगतान करें → UC तुरंत डिलीवर!"
  ],
  redeemSteps: [
    "Middasbuy पर आधिकारिक PUBG UC रिडीम कोड खरीदें",
    "Midasbuy रिडीम पेज पर जाएं",
    "प्लेयर आईडी + कोड दर्ज करें → UC तुरंत क्रेडिट!"
  ],
  errors: [
    { error: "अमान्य UID", fix: "केवल अंक, सावधानी से जांचें।" },
    { error: "भुगतान किया लेकिन UC नहीं मिला", fix: "1-5 मिनट प्रतीक्षा करें, गेम रीस्टार्ट करें।" },
    { error: "अमान्य/समाप्त कोड", fix: "बिल्कुल वैसे ही दर्ज करें जैसा दिखाया गया है।" },
    { error: "गलत रीजन", fix: "UC रीजन-लॉक है।" },
  ],
  codeDeliveryPoints: [
    "आधिकारिक PUBG UC कोड ईमेल द्वारा तुरंत डिलीवर",
    "सभी कोड खरीद की तारीख से 12 महीने तक वैध"
  ],
  refundPoints: [
    "100% आधिकारिक और अप्रयुक्त PUBG UC कोड",
    "Middasbuy खरीदार सुरक्षा नीति द्वारा कवर",
    "किसी भी समस्या के लिए 24/7 ग्राहक सहायता"
  ],
  whyBuyPoints: [
    "आधिकारिक PUBG UC शॉप – अधिकृत डिस्ट्रीब्यूटर",
    "इन-गेम स्टोर की तुलना में सबसे सस्ती UC कीमतें",
    "सेकंडों में तुरंत UC डिलीवरी",
    "700+ सुरक्षित वैश्विक भुगतान विकल्प",
    "123+ समर्थित मुद्राएं",
    "दुनिया भर में 20M+ गेमर्स का भरोसा",
    "24/7 बहुभाषी लाइव चैट सपोर्ट",
    "जोखिम-मुक्त खरीदार सुरक्षा गारंटी"
  ],
  tableHeaders: {
    price: "कीमत",
    ucAmount: "UC राशि",
    bonus: "बोनस",
    discount: "छूट",
    content: "अनलॉक करने योग्य सामग्री",
    examples: "उपयोग के उदाहरण",
    avgCost: "औसत UC लागत"
  },
  faqsTitle: "अक्सर पूछे जाने वाले प्रश्न - PUBG UC रिचार्ज",
  faqs: [
    { question: "ऑनलाइन PUBG Mobile UC कैसे खरीद सकता हूं?", answer: "आप Middasbuy पर PUBG UC रिचार्ज (प्लेयर आईडी द्वारा टॉप-अप) या आधिकारिक PUBG UC गिफ्ट कार्ड और रिडीम कोड खरीद सकते हैं। बस अपनी प्लेयर आईडी दर्ज करें, UC पैकेज चुनें, और तुरंत डिलीवरी के लिए भुगतान पूरा करें।" },
    { question: "PUBG UC के लिए कौन सा बेहतर है: रिचार्ज या रिडीम कोड?", answer: "रिचार्ज आमतौर पर सस्ता और तुरंत होता है, जबकि रिडीम कोड दोस्तों को UC गिफ्ट करने के लिए बेहतर हैं। Middasbuy पर दोनों तरीके 100% आधिकारिक और सुरक्षित हैं।" },
    { question: "क्या कोई आधिकारिक PUBG Mobile UC शॉप है?", answer: "हां, Middasbuy एक आधिकारिक PUBG UC टॉप-अप और गिफ्ट कार्ड शॉप है जिस पर दुनिया भर में 20M+ गेमर्स का भरोसा है।" },
    { question: "रिचार्ज के बाद PUBG UC डिलीवरी कितनी तेज है?", answer: "टॉप-अप आपके अकाउंट में तुरंत है (आमतौर पर 1-5 मिनट के भीतर), और रिडीम कोड भुगतान पुष्टि के बाद तुरंत ईमेल द्वारा भेजा जाता है।" },
    { question: "क्या Middasbuy से PUBG UC खरीदना सुरक्षित है?", answer: "हां, Middasbuy एक आधिकारिक अधिकृत डिस्ट्रीब्यूटर है जिसके पास सुरक्षित PUBG UC रिचार्ज, गिफ्ट कार्ड, खरीदार सुरक्षा और 24/7 ग्राहक सहायता है।" },
  ]
};

// All translations mapped by language code
export const translations: Record<string, DescriptionContent> = {
  en: englishContent,
  ur: urduContent,
  ar: arabicContent,
  ja: japaneseContent,
  ru: russianContent,
  tr: turkishContent,
  id: indonesianContent,
  hi: hindiContent,
  // Add more languages as needed - for now, default to English for missing ones
};

// Get translated content based on country code
export const getTranslatedContent = (countryCode: string): DescriptionContent => {
  const languageCode = getLanguageFromCountry(countryCode);
  return translations[languageCode] || translations.en;
};

// RTL languages
export const rtlLanguages = ['ar', 'ur', 'he', 'fa'];

export const isRtlLanguage = (countryCode: string): boolean => {
  const languageCode = getLanguageFromCountry(countryCode);
  return rtlLanguages.includes(languageCode);
};
