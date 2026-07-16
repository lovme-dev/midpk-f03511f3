// Multi-language translations for payment success/cancelled pages
// Supports 170+ countries with their national languages - 100+ unique languages

export interface PageTranslation {
  orderCancelledTitle: string;
  orderCancelledSubtitle: string;
  importantNotice: string;
  dearCustomer: string;
  cancelledMessage1: string;
  cancelledMessage2: string;
  refundProcessTitle: string;
  refundPoint1: string;
  refundPoint2: string;
  refundPoint3: string;
  refundPoint4: string;
  ifNoRefundTitle: string;
  ifNoRefundMessage: string;
  trustMessage: string;
  trackRefundStatus: string;
  backToHome: string;
  contactSupport: string;
}

// Country code to language mapping - 170+ countries
export const COUNTRY_TO_LANGUAGE: Record<string, string> = {
  // South Asian Countries
  PK: 'ur', IN: 'hi', BD: 'bn', NP: 'ne', LK: 'si', AF: 'ps', BT: 'dz', MV: 'dv',
  
  // North American Countries
  US: 'en', CA: 'en',
  
  // Central American Countries
  MX: 'es', GT: 'es', HN: 'es', SV: 'es', NI: 'es', CR: 'es', PA: 'es', BZ: 'en',
  
  // Caribbean Countries
  JM: 'en', TT: 'en', BB: 'en', BS: 'en', CU: 'es', DO: 'es', HT: 'fr', PR: 'es',
  
  // European Countries
  GB: 'en', DE: 'de', FR: 'fr', ES: 'es', IT: 'it', NL: 'nl', SE: 'sv', NO: 'no',
  DK: 'da', FI: 'fi', PL: 'pl', CZ: 'cs', HU: 'hu', RO: 'ro', BG: 'bg', AT: 'de',
  CH: 'de', BE: 'nl', IE: 'en', PT: 'pt', GR: 'el', HR: 'hr', SI: 'sl', SK: 'sk',
  EE: 'et', LV: 'lv', LT: 'lt', LU: 'de', MT: 'mt', CY: 'el', IS: 'is', UA: 'uk',
  RU: 'ru', BY: 'be', MD: 'ro', RS: 'sr', BA: 'bs', ME: 'sr', MK: 'mk', AL: 'sq',
  XK: 'sq',
  
  // Middle Eastern Countries
  TR: 'tr', SA: 'ar', AE: 'ar', EG: 'ar', JO: 'ar', LB: 'ar', KW: 'ar', QA: 'ar',
  BH: 'ar', OM: 'ar', IQ: 'ar', SY: 'ar', YE: 'ar', PS: 'ar', IL: 'he', IR: 'fa',
  
  // Asia Pacific Countries
  AU: 'en', NZ: 'en', MY: 'ms', ID: 'id', PH: 'tl', SG: 'en', TH: 'th', VN: 'vi',
  JP: 'ja', KR: 'ko', TW: 'zh', HK: 'zh', CN: 'zh', MO: 'zh', MM: 'my', KH: 'km',
  LA: 'lo', BN: 'ms', TL: 'pt', MN: 'mn', KZ: 'kk', UZ: 'uz', TJ: 'tg', KG: 'ky',
  TM: 'tk', AZ: 'az', GE: 'ka', AM: 'hy',
  
  // African Countries
  ZA: 'af', NG: 'en', KE: 'sw', GH: 'en', TZ: 'sw', UG: 'en', ET: 'am', RW: 'rw',
  SN: 'fr', CI: 'fr', CM: 'fr', MA: 'ar', DZ: 'ar', TN: 'ar', LY: 'ar', SD: 'ar',
  AO: 'pt', MZ: 'pt', ZW: 'en', ZM: 'en', BW: 'en', NA: 'en', MW: 'en', LS: 'en',
  SZ: 'en', MU: 'en', MG: 'mg', SC: 'en', RE: 'fr', YT: 'fr', CD: 'fr', CG: 'fr',
  GA: 'fr', GQ: 'es', CF: 'fr', TD: 'fr', NE: 'fr', ML: 'fr', BF: 'fr', BJ: 'fr',
  TG: 'fr', GN: 'fr', SL: 'en', LR: 'en', MR: 'ar', GM: 'en', GW: 'pt', CV: 'pt',
  ST: 'pt', DJ: 'fr', ER: 'ti', SO: 'so', SS: 'en', BI: 'fr', KM: 'ar',
  
  // South American Countries
  BR: 'pt', AR: 'es', CL: 'es', CO: 'es', PE: 'es', VE: 'es', EC: 'es', BO: 'es',
  PY: 'es', UY: 'es', GY: 'en', SR: 'nl', FK: 'en', GF: 'fr',
  
  // Oceania
  FJ: 'en', PG: 'en', SB: 'en', VU: 'en', NC: 'fr', WS: 'en', TO: 'en', FM: 'en',
  MH: 'en', PW: 'en', KI: 'en', NR: 'en', TV: 'en',
};

// Currency to country mapping
export const CURRENCY_TO_COUNTRY: Record<string, string> = {
  'PKR': 'PK', 'USD': 'US', 'EUR': 'DE', 'GBP': 'GB', 'RUB': 'RU',
  'INR': 'IN', 'AED': 'AE', 'SAR': 'SA', 'BDT': 'BD', 'MYR': 'MY',
  'IDR': 'ID', 'PHP': 'PH', 'THB': 'TH', 'VND': 'VN', 'TRY': 'TR',
  'JPY': 'JP', 'CNY': 'CN', 'KRW': 'KR', 'KZT': 'KZ', 'BRL': 'BR',
  'ARS': 'AR', 'CLP': 'CL', 'COP': 'CO', 'PEN': 'PE', 'MXN': 'MX',
  'ZAR': 'ZA', 'NGN': 'NG', 'EGP': 'EG', 'PLN': 'PL', 'CZK': 'CZ',
  'HUF': 'HU', 'RON': 'RO', 'BGN': 'BG', 'UAH': 'UA', 'SEK': 'SE',
  'NOK': 'NO', 'DKK': 'DK', 'CHF': 'CH', 'SGD': 'SG', 'HKD': 'HK',
  'TWD': 'TW', 'NZD': 'NZ', 'AUD': 'AU', 'CAD': 'CA', 'IRR': 'IR',
  'ILS': 'IL', 'JOD': 'JO', 'KWD': 'KW', 'QAR': 'QA', 'BHD': 'BH',
  'OMR': 'OM', 'LBP': 'LB', 'IQD': 'IQ', 'NPR': 'NP', 'LKR': 'LK',
  'AFN': 'AF', 'MMK': 'MM', 'KHR': 'KH', 'LAK': 'LA', 'MNT': 'MN',
  'UZS': 'UZ', 'AZN': 'AZ', 'GEL': 'GE', 'AMD': 'AM', 'KES': 'KE',
  'GHS': 'GH', 'TZS': 'TZ', 'UGX': 'UG', 'ETB': 'ET', 'RWF': 'RW',
  'XOF': 'SN', 'MAD': 'MA', 'DZD': 'DZ', 'TND': 'TN', 'AOA': 'AO',
  'MZN': 'MZ', 'ZWL': 'ZW', 'ZMW': 'ZM', 'BWP': 'BW', 'NAD': 'NA',
  'MUR': 'MU', 'MGA': 'MG', 'CDF': 'CD', 'XAF': 'CM', 'GTQ': 'GT',
  'HNL': 'HN', 'NIO': 'NI', 'CRC': 'CR', 'PAB': 'PA', 'JMD': 'JM',
  'TTD': 'TT', 'DOP': 'DO', 'HTG': 'HT', 'UYU': 'UY', 'PYG': 'PY',
  'BOB': 'BO', 'VES': 'VE', 'GYD': 'GY', 'SRD': 'SR', 'FJD': 'FJ',
  'BYN': 'BY', 'MDL': 'MD', 'RSD': 'RS', 'ALL': 'AL', 'MKD': 'MK',
  'BAM': 'BA', 'ISK': 'IS', 'TJS': 'TJ', 'KGS': 'KG', 'TMT': 'TM',
  'SYP': 'SY', 'YER': 'YE', 'LYD': 'LY', 'SDG': 'SD', 'SOS': 'SO',
  'DJF': 'DJ', 'ERN': 'ER', 'BIF': 'BI', 'PGK': 'PG', 'XPF': 'NC',
  'BBD': 'BB', 'BSD': 'BS', 'CUP': 'CU', 'BZD': 'BZ', 'MWK': 'MW',
  'LSL': 'LS', 'SZL': 'SZ', 'SCR': 'SC', 'BTN': 'BT', 'MVR': 'MV',
  'BND': 'BN',
};

// RTL languages
export const RTL_LANGUAGES = ['ar', 'ur', 'he', 'fa', 'ps'];

// 100+ Language Translations
export const PAGE_TRANSLATIONS: Record<string, PageTranslation> = {
  // English (default)
  en: {
    orderCancelledTitle: "Your Order is Cancelled",
    orderCancelledSubtitle: "We apologize for the inconvenience. Your order has been cancelled as our system is currently undergoing maintenance.",
    importantNotice: "Important Notice",
    dearCustomer: "Dear Customer",
    cancelledMessage1: "We sincerely apologize for any inconvenience caused. Your recent order has been cancelled because our payment processing system is currently busy and our team is actively working to resolve this issue. Please don't worry — your payment will be fully refunded. Once the issue is resolved, the refund will be automatically credited back to your account.",
    cancelledMessage2: "",
    refundProcessTitle: "Refund Process Information",
    refundPoint1: "We will immediately submit a payment appeal to your bank within the next few days",
    refundPoint2: "According to bank policy, your refund will be processed within 2 to 15 business days",
    refundPoint3: "The refund will be credited to the same bank account or payment method you used for the purchase",
    refundPoint4: "You will receive a confirmation email once the refund is processed",
    ifNoRefundTitle: "If You Don't Receive Your Refund",
    ifNoRefundMessage: "If you do not receive your refund within 15 business days, please contact our support team immediately. Our customer service representatives will ensure you receive a full refund processed directly by our company.",
    trustMessage: "We value your trust and are committed to resolving this matter promptly. Thank you for your patience and understanding.",
    trackRefundStatus: "Track Refund Status",
    backToHome: "Back to Home",
    contactSupport: "Contact Support",
  },
  
  // Urdu (Pakistan)
  ur: {
    orderCancelledTitle: "آپ کا آرڈر منسوخ ہو گیا",
    orderCancelledSubtitle: "ہم تکلیف کے لیے معذرت خواہ ہیں۔ سسٹم مینٹیننس کی وجہ سے آپ کا آرڈر منسوخ کر دیا گیا ہے۔",
    importantNotice: "اہم اطلاع",
    dearCustomer: "محترم کسٹمر",
    cancelledMessage1: "ہم کسی بھی تکلیف کے لیے دل سے معذرت خواہ ہیں۔ آپ کا حالیہ آرڈر منسوخ کر دیا گیا ہے کیونکہ ہمارا پیمنٹ پروسیسنگ سسٹم ابھی مصروف ہے اور ہماری ٹیم اس مسئلے کو حل کرنے پر کام کر رہی ہے۔ فکر نہ کریں — آپ کی ادائیگی مکمل طور پر واپس کر دی جائے گی۔ مسئلہ حل ہونے کے بعد رقم خود بخود آپ کے اکاؤنٹ میں آ جائے گی۔",
    cancelledMessage2: "",
    refundProcessTitle: "رقم کی واپسی کا طریقہ کار",
    refundPoint1: "ہم اگلے چند دنوں میں فوری طور پر آپ کے بینک کو ادائیگی کی اپیل جمع کرائیں گے",
    refundPoint2: "بینک پالیسی کے مطابق، آپ کی رقم 2 سے 15 کاروباری دنوں میں واپس ہو جائے گی",
    refundPoint3: "رقم اسی بینک اکاؤنٹ یا ادائیگی کے طریقے میں جمع ہو گی جو آپ نے خریداری کے لیے استعمال کیا تھا",
    refundPoint4: "رقم واپسی کی پروسیسنگ ہونے پر آپ کو تصدیقی ای میل موصول ہو گی",
    ifNoRefundTitle: "اگر آپ کو رقم واپس نہ ملے",
    ifNoRefundMessage: "اگر آپ کو 15 کاروباری دنوں کے اندر رقم واپس نہیں ملتی، تو براہ کرم فوری طور پر ہماری سپورٹ ٹیم سے رابطہ کریں۔ ہمارے کسٹمر سروس نمائندے یقینی بنائیں گے کہ آپ کو ہماری کمپنی سے براہ راست مکمل رقم واپس مل جائے۔",
    trustMessage: "ہم آپ کے اعتماد کی قدر کرتے ہیں اور اس معاملے کو جلد حل کرنے کے لیے پرعزم ہیں۔ آپ کے صبر اور سمجھ بوجھ کا شکریہ۔",
    trackRefundStatus: "رقم کی واپسی کی حیثیت دیکھیں",
    backToHome: "ہوم پیج پر واپس",
    contactSupport: "سپورٹ سے رابطہ",
  },
  
  // Pashto (Afghanistan)
  ps: {
    orderCancelledTitle: "ستاسو امر لغوه شو",
    orderCancelledSubtitle: "موږ د ستونزې لپاره بخښنه غواړو۔ ستاسو امر د تخنیکي ستونزو له امله لغوه شوی۔",
    importantNotice: "مهم خبرتیا",
    dearCustomer: "ګران پیرودونکی",
    cancelledMessage1: "موږ د هرې ستونزې لپاره له زړه بخښنه غواړو۔ ستاسو وروستی امر زموږ د تادیاتو پروسس سیسټم کې د تخنیکي ستونزې له امله لغوه شوی۔ دا زموږ ارادی نه وو او موږ ستاسو خپګان پوهیږو۔",
    cancelledMessage2: "",
    refundProcessTitle: "د پیسو بیرته ورکولو پروسه معلومات",
    refundPoint1: "موږ به په راتلونکو څو ورځو کې سمدلاسه ستاسو بانک ته د تادیاتو غوښتنه وسپارو",
    refundPoint2: "د بانک پالیسي سره سم، ستاسو پیسې به په 2 تر 15 کاري ورځو کې بیرته درکړل شي",
    refundPoint3: "پیسې به هماغه بانکي حساب یا د تادیاتو میتود ته ولیږل شي چې تاسو یې د پیرود لپاره کارولی",
    refundPoint4: "کله چې پیسې بیرته ورکړل شي تاسو به تایید بریښنالیک ترلاسه کړئ",
    ifNoRefundTitle: "که تاسو خپلې پیسې بیرته ترلاسه نه کړئ",
    ifNoRefundMessage: "که تاسو په 15 کاري ورځو کې پیسې بیرته ترلاسه نه کړئ، مهرباني وکړئ سمدلاسه زموږ ملاتړ ټیم سره اړیکه ونیسئ۔ زموږ پیرودونکي خدمت نمایندګان به ډاډ ترلاسه کړي چې تاسو مستقیم زموږ شرکت څخه بشپړې پیسې بیرته ترلاسه کړئ۔",
    trustMessage: "موږ ستاسو باور ته ارزښت ورکوو او ژمن یو چې دا مسله ژر حل کړو۔ ستاسو صبر او پوهاوي لپاره مننه۔",
    trackRefundStatus: "د پیسو بیرته ورکولو حالت وګورئ",
    backToHome: "کور ته بیرته",
    contactSupport: "ملاتړ سره اړیکه",
  },
  
  // Hindi (India)
  hi: {
    orderCancelledTitle: "आपका ऑर्डर रद्द हो गया",
    orderCancelledSubtitle: "असुविधा के लिए हमें खेद है। तकनीकी समस्याओं के कारण आपका ऑर्डर रद्द कर दिया गया है।",
    importantNotice: "महत्वपूर्ण सूचना",
    dearCustomer: "प्रिय ग्राहक",
    cancelledMessage1: "किसी भी असुविधा के लिए हम ईमानदारी से माफी चाहते हैं। आपका हालिया ऑर्डर रद्द कर दिया गया है क्योंकि हमारा पेमेंट प्रोसेसिंग सिस्टम अभी व्यस्त है और हमारी टीम इस समस्या को हल करने पर काम कर रही है। चिंता न करें — आपकी भुगतान राशि पूरी तरह वापस कर दी जाएगी। समस्या हल होने के बाद राशि स्वचालित रूप से आपके खाते में आ जाएगी।",
    cancelledMessage2: "",
    refundProcessTitle: "रिफंड प्रक्रिया की जानकारी",
    refundPoint1: "हम अगले कुछ दिनों में तुरंत आपके बैंक को भुगतान अपील जमा करेंगे",
    refundPoint2: "बैंक पॉलिसी के अनुसार, आपका रिफंड 2 से 15 कार्य दिवसों में प्रोसेस होगा",
    refundPoint3: "रिफंड उसी बैंक खाते या भुगतान विधि में जमा होगा जिसका उपयोग आपने खरीदारी के लिए किया था",
    refundPoint4: "रिफंड प्रोसेस होने पर आपको पुष्टि ईमेल प्राप्त होगा",
    ifNoRefundTitle: "अगर आपको रिफंड नहीं मिलता",
    ifNoRefundMessage: "यदि आपको 15 कार्य दिवसों के भीतर रिफंड नहीं मिलता है, तो कृपया तुरंत हमारी सहायता टीम से संपर्क करें। हमारे ग्राहक सेवा प्रतिनिधि सुनिश्चित करेंगे कि आपको हमारी कंपनी द्वारा सीधे पूर्ण रिफंड मिल जाए।",
    trustMessage: "हम आपके भरोसे को महत्व देते हैं और इस मामले को जल्द हल करने के लिए प्रतिबद्ध हैं। आपके धैर्य और समझ के लिए धन्यवाद।",
    trackRefundStatus: "रिफंड स्थिति ट्रैक करें",
    backToHome: "होम पर वापस जाएं",
    contactSupport: "सहायता से संपर्क करें",
  },
  
  // Bengali (Bangladesh)
  bn: {
    orderCancelledTitle: "আপনার অর্ডার বাতিল হয়ে গেছে",
    orderCancelledSubtitle: "অসুবিধার জন্য আমরা ক্ষমাপ্রার্থী। প্রযুক্তিগত সমস্যার কারণে আপনার অর্ডার বাতিল করা হয়েছে।",
    importantNotice: "গুরুত্বপূর্ণ বিজ্ঞপ্তি",
    dearCustomer: "প্রিয় গ্রাহক",
    cancelledMessage1: "যেকোনো অসুবিধার জন্য আমরা আন্তরিকভাবে ক্ষমাপ্রার্থী। আমাদের পেমেন্ট প্রক্রিয়াকরণ সিস্টেমে প্রযুক্তিগত সমস্যার কারণে আপনার সাম্প্রতিক অর্ডার বাতিল করা হয়েছে।",
    cancelledMessage2: "",
    refundProcessTitle: "ফেরত প্রক্রিয়ার তথ্য",
    refundPoint1: "আমরা আগামী কয়েক দিনের মধ্যে আপনার ব্যাংকে অবিলম্বে পেমেন্ট আপিল জমা দেব",
    refundPoint2: "ব্যাংক নীতি অনুযায়ী, আপনার ফেরত ২ থেকে ১৫ কার্যদিবসের মধ্যে প্রক্রিয়া করা হবে",
    refundPoint3: "ফেরত একই ব্যাংক অ্যাকাউন্ট বা পেমেন্ট পদ্ধতিতে জমা হবে যা আপনি কেনাকাটায় ব্যবহার করেছিলেন",
    refundPoint4: "ফেরত প্রক্রিয়া হলে আপনি নিশ্চিতকরণ ইমেল পাবেন",
    ifNoRefundTitle: "আপনি যদি ফেরত না পান",
    ifNoRefundMessage: "যদি আপনি ১৫ কার্যদিবসের মধ্যে ফেরত না পান, অনুগ্রহ করে আমাদের সহায়তা দলের সাথে অবিলম্বে যোগাযোগ করুন।",
    trustMessage: "আমরা আপনার বিশ্বাসের মূল্য দিই এবং এই বিষয়টি দ্রুত সমাধান করতে প্রতিশ্রুতিবদ্ধ। আপনার ধৈর্য এবং বোঝাপড়ার জন্য ধন্যবাদ।",
    trackRefundStatus: "ফেরতের অবস্থা ট্র্যাক করুন",
    backToHome: "হোমে ফিরে যান",
    contactSupport: "সহায়তায় যোগাযোগ করুন",
  },
  
  // Nepali
  ne: {
    orderCancelledTitle: "तपाईंको अर्डर रद्द भयो",
    orderCancelledSubtitle: "असुविधाको लागि हामी माफी चाहन्छौं। प्राविधिक समस्याको कारण तपाईंको अर्डर रद्द गरिएको छ।",
    importantNotice: "महत्त्वपूर्ण सूचना",
    dearCustomer: "प्रिय ग्राहक",
    cancelledMessage1: "कुनै पनि असुविधाको लागि हामी हार्दिक माफी चाहन्छौं। हाम्रो भुक्तानी प्रोसेसिङ प्रणालीमा प्राविधिक समस्याको कारण तपाईंको अर्डर रद्द गरिएको छ।",
    cancelledMessage2: "",
    refundProcessTitle: "फिर्ता प्रक्रियाको जानकारी",
    refundPoint1: "हामी आगामी केही दिनमा तुरुन्तै तपाईंको बैंकमा भुक्तानी अपील पेश गर्नेछौं",
    refundPoint2: "बैंक नीति अनुसार, तपाईंको फिर्ता २ देखि १५ कार्य दिनमा प्रशोधन हुनेछ",
    refundPoint3: "फिर्ता त्यही बैंक खाता वा भुक्तानी विधिमा जम्मा हुनेछ जुन तपाईंले किन्नको लागि प्रयोग गर्नुभएको थियो",
    refundPoint4: "फिर्ता प्रशोधन भएपछि तपाईंले पुष्टि इमेल प्राप्त गर्नुहुनेछ",
    ifNoRefundTitle: "यदि तपाईंले फिर्ता प्राप्त गर्नुभएन",
    ifNoRefundMessage: "यदि तपाईंले १५ कार्य दिनभित्र फिर्ता प्राप्त गर्नुभएन भने, कृपया तुरुन्तै हाम्रो सहायता टोलीलाई सम्पर्क गर्नुहोस्।",
    trustMessage: "हामी तपाईंको विश्वासको कदर गर्छौं र यस मामलालाई छिटो समाधान गर्न प्रतिबद्ध छौं। तपाईंको धैर्य र समझको लागि धन्यवाद।",
    trackRefundStatus: "फिर्ता स्थिति ट्र्याक गर्नुहोस्",
    backToHome: "घर फर्कनुहोस्",
    contactSupport: "सहायता सम्पर्क",
  },
  
  // Sinhala (Sri Lanka)
  si: {
    orderCancelledTitle: "ඔබේ ඇණවුම අවලංගු කර ඇත",
    orderCancelledSubtitle: "අපහසුතාවය ගැන සමාවෙන්න. තාක්ෂණික ගැටළු හේතුවෙන් ඔබේ ඇණවුම අවලංගු කර ඇත.",
    importantNotice: "වැදගත් දැනුම්දීම",
    dearCustomer: "ගරු පාරිභෝගිකයාණනි",
    cancelledMessage1: "ඕනෑම අපහසුතාවයක් සඳහා අපි හෘදයාංගම සමාව ඉල්ලමු. අපගේ ගෙවීම් සැකසුම් පද්ධතියේ තාක්ෂණික ගැටළුවක් හේතුවෙන් ඔබේ මෑත ඇණවුම අවලංගු කර ඇත.",
    cancelledMessage2: "",
    refundProcessTitle: "ආපසු ගෙවීමේ ක්‍රියාවලිය පිළිබඳ තොරතුරු",
    refundPoint1: "ඉදිරි දින කිහිපය තුළ අපි ඔබේ බැංකුවට ගෙවීම් අභියාචනයක් වහාම ඉදිරිපත් කරන්නෙමු",
    refundPoint2: "බැංකු ප්‍රතිපත්තියට අනුව, ඔබේ ආපසු ගෙවීම වැඩකරන දින 2 සිට 15 දක්වා කාලය තුළ සකසනු ලැබේ",
    refundPoint3: "ආපසු ගෙවීම ඔබ මිලදී ගැනීම සඳහා භාවිතා කළ එම බැංකු ගිණුමට හෝ ගෙවීම් ක්‍රමයට බැර කෙරේ",
    refundPoint4: "ආපසු ගෙවීම සකසන විට ඔබට තහවුරු ඊමේල් එකක් ලැබෙනු ඇත",
    ifNoRefundTitle: "ඔබට ආපසු ගෙවීම ලැබුණේ නැත්නම්",
    ifNoRefundMessage: "වැඩකරන දින 15 ක් ඇතුළත ඔබට ආපසු ගෙවීම ලැබුණේ නැත්නම්, කරුණාකර වහාම අපගේ සහාය කණ්ඩායම අමතන්න.",
    trustMessage: "අපි ඔබේ විශ්වාසයට අගය කරමු සහ මෙම කාරණය ඉක්මනින් විසඳීමට කැපවී සිටිමු. ඔබේ ඉවසීමට සහ අවබෝධයට ස්තූතියි.",
    trackRefundStatus: "ආපසු ගෙවීමේ තත්ත්වය ට්‍රැක් කරන්න",
    backToHome: "මුල් පිටුවට ආපසු",
    contactSupport: "සහාය සම්බන්ධ කරන්න",
  },
  
  // Russian
  ru: {
    orderCancelledTitle: "Ваш заказ отменён",
    orderCancelledSubtitle: "Приносим извинения за неудобства. Ваш заказ был отменён из-за технических проблем.",
    importantNotice: "Важное уведомление",
    dearCustomer: "Уважаемый клиент",
    cancelledMessage1: "Мы искренне приносим извинения за причинённые неудобства. Ваш недавний заказ был отменён из-за технической проблемы в нашей платёжной системе.",
    cancelledMessage2: "",
    refundProcessTitle: "Информация о процессе возврата",
    refundPoint1: "Мы немедленно подадим платёжную апелляцию в ваш банк в течение ближайших нескольких дней",
    refundPoint2: "Согласно политике банка, ваш возврат будет обработан в течение 2-15 рабочих дней",
    refundPoint3: "Возврат будет зачислен на тот же банковский счёт или платёжный метод, который вы использовали для покупки",
    refundPoint4: "Вы получите подтверждение по электронной почте после обработки возврата",
    ifNoRefundTitle: "Если вы не получили возврат",
    ifNoRefundMessage: "Если вы не получите возврат в течение 15 рабочих дней, пожалуйста, немедленно свяжитесь с нашей службой поддержки.",
    trustMessage: "Мы ценим ваше доверие и стремимся быстро решить этот вопрос. Благодарим за терпение и понимание.",
    trackRefundStatus: "Отследить статус возврата",
    backToHome: "На главную",
    contactSupport: "Связаться с поддержкой",
  },
  
  // Arabic
  ar: {
    orderCancelledTitle: "تم إلغاء طلبك",
    orderCancelledSubtitle: "نعتذر عن الإزعاج. تم إلغاء طلبك بسبب مشاكل تقنية.",
    importantNotice: "إشعار مهم",
    dearCustomer: "عزيزي العميل",
    cancelledMessage1: "نعتذر بصدق عن أي إزعاج سببناه. تم إلغاء طلبك الأخير بسبب مشكلة تقنية في نظام معالجة الدفع لدينا.",
    cancelledMessage2: "",
    refundProcessTitle: "معلومات عملية الاسترداد",
    refundPoint1: "سنقدم فورًا استئناف الدفع إلى البنك الخاص بك خلال الأيام القليلة القادمة",
    refundPoint2: "وفقًا لسياسة البنك، سيتم معالجة استرداد أموالك خلال 2 إلى 15 يوم عمل",
    refundPoint3: "سيتم إضافة المبلغ المسترد إلى نفس الحساب البنكي أو طريقة الدفع التي استخدمتها للشراء",
    refundPoint4: "ستتلقى بريدًا إلكترونيًا للتأكيد بمجرد معالجة الاسترداد",
    ifNoRefundTitle: "إذا لم تستلم استرداد أموالك",
    ifNoRefundMessage: "إذا لم تستلم استرداد أموالك خلال 15 يوم عمل، يرجى الاتصال بفريق الدعم فورًا.",
    trustMessage: "نحن نقدر ثقتك ونلتزم بحل هذا الأمر بسرعة. شكرًا لصبرك وتفهمك.",
    trackRefundStatus: "تتبع حالة الاسترداد",
    backToHome: "العودة للرئيسية",
    contactSupport: "اتصل بالدعم",
  },
  
  // Spanish
  es: {
    orderCancelledTitle: "Tu pedido ha sido cancelado",
    orderCancelledSubtitle: "Nos disculpamos por las molestias. Tu pedido ha sido cancelado debido a problemas técnicos.",
    importantNotice: "Aviso Importante",
    dearCustomer: "Estimado Cliente",
    cancelledMessage1: "Nos disculpamos sinceramente por cualquier inconveniente causado. Tu pedido reciente ha sido cancelado debido a un problema técnico en nuestro sistema de procesamiento de pagos.",
    cancelledMessage2: "",
    refundProcessTitle: "Información del Proceso de Reembolso",
    refundPoint1: "Enviaremos inmediatamente una apelación de pago a tu banco en los próximos días",
    refundPoint2: "Según la política del banco, tu reembolso se procesará en 2 a 15 días hábiles",
    refundPoint3: "El reembolso se acreditará en la misma cuenta bancaria o método de pago que usaste para la compra",
    refundPoint4: "Recibirás un correo de confirmación cuando se procese el reembolso",
    ifNoRefundTitle: "Si no recibes tu reembolso",
    ifNoRefundMessage: "Si no recibes tu reembolso en 15 días hábiles, contacta inmediatamente a nuestro equipo de soporte.",
    trustMessage: "Valoramos tu confianza y estamos comprometidos a resolver este asunto rápidamente. Gracias por tu paciencia y comprensión.",
    trackRefundStatus: "Rastrear Estado del Reembolso",
    backToHome: "Volver al Inicio",
    contactSupport: "Contactar Soporte",
  },
  
  // French
  fr: {
    orderCancelledTitle: "Votre commande est annulée",
    orderCancelledSubtitle: "Nous nous excusons pour la gêne occasionnée. Votre commande a été annulée en raison de problèmes techniques.",
    importantNotice: "Avis Important",
    dearCustomer: "Cher Client",
    cancelledMessage1: "Nous nous excusons sincèrement pour tout inconvénient causé. Votre commande récente a été annulée en raison d'un problème technique.",
    cancelledMessage2: "",
    refundProcessTitle: "Informations sur le Processus de Remboursement",
    refundPoint1: "Nous soumettrons immédiatement un appel de paiement à votre banque dans les prochains jours",
    refundPoint2: "Selon la politique bancaire, votre remboursement sera traité dans 2 à 15 jours ouvrables",
    refundPoint3: "Le remboursement sera crédité sur le même compte bancaire ou mode de paiement que vous avez utilisé",
    refundPoint4: "Vous recevrez un email de confirmation une fois le remboursement traité",
    ifNoRefundTitle: "Si vous ne recevez pas votre remboursement",
    ifNoRefundMessage: "Si vous ne recevez pas votre remboursement dans les 15 jours ouvrables, veuillez contacter immédiatement notre équipe de support.",
    trustMessage: "Nous apprécions votre confiance et nous engageons à résoudre ce problème rapidement. Merci pour votre patience.",
    trackRefundStatus: "Suivre le Statut du Remboursement",
    backToHome: "Retour à l'Accueil",
    contactSupport: "Contacter le Support",
  },
  
  // German
  de: {
    orderCancelledTitle: "Ihre Bestellung wurde storniert",
    orderCancelledSubtitle: "Wir entschuldigen uns für die Unannehmlichkeiten. Ihre Bestellung wurde aufgrund technischer Probleme storniert.",
    importantNotice: "Wichtiger Hinweis",
    dearCustomer: "Sehr geehrter Kunde",
    cancelledMessage1: "Wir entschuldigen uns aufrichtig für etwaige Unannehmlichkeiten. Ihre kürzliche Bestellung wurde aufgrund eines technischen Problems storniert.",
    cancelledMessage2: "",
    refundProcessTitle: "Erstattungsprozess Informationen",
    refundPoint1: "Wir werden innerhalb der nächsten Tage sofort einen Zahlungseinspruch bei Ihrer Bank einreichen",
    refundPoint2: "Gemäß der Bankrichtlinie wird Ihre Erstattung innerhalb von 2 bis 15 Werktagen bearbeitet",
    refundPoint3: "Die Erstattung wird auf das gleiche Bankkonto oder die gleiche Zahlungsmethode gutgeschrieben",
    refundPoint4: "Sie erhalten eine Bestätigungs-E-Mail, sobald die Erstattung verarbeitet wurde",
    ifNoRefundTitle: "Wenn Sie Ihre Erstattung nicht erhalten",
    ifNoRefundMessage: "Wenn Sie Ihre Erstattung nicht innerhalb von 15 Werktagen erhalten, kontaktieren Sie bitte sofort unser Support-Team.",
    trustMessage: "Wir schätzen Ihr Vertrauen und sind bestrebt, diese Angelegenheit schnell zu lösen. Vielen Dank für Ihre Geduld.",
    trackRefundStatus: "Erstattungsstatus verfolgen",
    backToHome: "Zurück zur Startseite",
    contactSupport: "Support kontaktieren",
  },
  
  // Portuguese
  pt: {
    orderCancelledTitle: "Seu pedido foi cancelado",
    orderCancelledSubtitle: "Pedimos desculpas pelo inconveniente. Seu pedido foi cancelado devido a problemas técnicos.",
    importantNotice: "Aviso Importante",
    dearCustomer: "Caro Cliente",
    cancelledMessage1: "Pedimos sinceras desculpas por qualquer inconveniente causado. Seu pedido recente foi cancelado devido a um problema técnico.",
    cancelledMessage2: "",
    refundProcessTitle: "Informações do Processo de Reembolso",
    refundPoint1: "Enviaremos imediatamente um recurso de pagamento ao seu banco nos próximos dias",
    refundPoint2: "De acordo com a política do banco, seu reembolso será processado em 2 a 15 dias úteis",
    refundPoint3: "O reembolso será creditado na mesma conta bancária ou método de pagamento que você usou",
    refundPoint4: "Você receberá um email de confirmação quando o reembolso for processado",
    ifNoRefundTitle: "Se você não receber seu reembolso",
    ifNoRefundMessage: "Se você não receber seu reembolso em 15 dias úteis, entre em contato imediatamente com nossa equipe de suporte.",
    trustMessage: "Valorizamos sua confiança e estamos comprometidos em resolver este assunto rapidamente. Obrigado pela sua paciência.",
    trackRefundStatus: "Rastrear Status do Reembolso",
    backToHome: "Voltar ao Início",
    contactSupport: "Contatar Suporte",
  },
  
  // Turkish
  tr: {
    orderCancelledTitle: "Siparişiniz İptal Edildi",
    orderCancelledSubtitle: "Rahatsızlık için özür dileriz. Siparişiniz teknik sorunlar nedeniyle iptal edildi.",
    importantNotice: "Önemli Bildirim",
    dearCustomer: "Değerli Müşterimiz",
    cancelledMessage1: "Yaşanan herhangi bir rahatsızlık için içtenlikle özür dileriz. Son siparişiniz ödeme işleme sistemimizde yaşanan teknik bir sorun nedeniyle iptal edildi.",
    cancelledMessage2: "",
    refundProcessTitle: "Geri Ödeme Süreci Bilgileri",
    refundPoint1: "Önümüzdeki birkaç gün içinde bankanıza derhal ödeme itirazı göndereceğiz",
    refundPoint2: "Banka politikasına göre, geri ödemeniz 2 ila 15 iş günü içinde işlenecektir",
    refundPoint3: "Geri ödeme, satın alma için kullandığınız aynı banka hesabına veya ödeme yöntemine yatırılacaktır",
    refundPoint4: "Geri ödeme işlendiğinde onay e-postası alacaksınız",
    ifNoRefundTitle: "Geri Ödemenizi Alamazsanız",
    ifNoRefundMessage: "15 iş günü içinde geri ödemenizi alamazsanız, lütfen derhal destek ekibimizle iletişime geçin.",
    trustMessage: "Güveninize değer veriyoruz ve bu konuyu hızla çözmeye kararlıyız. Sabrınız ve anlayışınız için teşekkür ederiz.",
    trackRefundStatus: "Geri Ödeme Durumunu İzle",
    backToHome: "Ana Sayfaya Dön",
    contactSupport: "Destek ile İletişim",
  },
  
  // Indonesian
  id: {
    orderCancelledTitle: "Pesanan Anda Dibatalkan",
    orderCancelledSubtitle: "Kami mohon maaf atas ketidaknyamanannya. Pesanan Anda telah dibatalkan karena masalah teknis.",
    importantNotice: "Pemberitahuan Penting",
    dearCustomer: "Pelanggan Yang Terhormat",
    cancelledMessage1: "Kami dengan tulus meminta maaf atas ketidaknyamanan yang terjadi. Pesanan terakhir Anda telah dibatalkan karena masalah teknis.",
    cancelledMessage2: "",
    refundProcessTitle: "Informasi Proses Pengembalian Dana",
    refundPoint1: "Kami akan segera mengajukan banding pembayaran ke bank Anda dalam beberapa hari ke depan",
    refundPoint2: "Sesuai kebijakan bank, pengembalian dana Anda akan diproses dalam 2 hingga 15 hari kerja",
    refundPoint3: "Pengembalian dana akan dikreditkan ke rekening bank atau metode pembayaran yang sama",
    refundPoint4: "Anda akan menerima email konfirmasi setelah pengembalian dana diproses",
    ifNoRefundTitle: "Jika Anda Tidak Menerima Pengembalian Dana",
    ifNoRefundMessage: "Jika Anda tidak menerima pengembalian dana dalam 15 hari kerja, silakan hubungi tim dukungan kami segera.",
    trustMessage: "Kami menghargai kepercayaan Anda dan berkomitmen untuk menyelesaikan masalah ini dengan cepat. Terima kasih atas kesabaran.",
    trackRefundStatus: "Lacak Status Pengembalian Dana",
    backToHome: "Kembali ke Beranda",
    contactSupport: "Hubungi Dukungan",
  },
  
  // Malay
  ms: {
    orderCancelledTitle: "Pesanan Anda Dibatalkan",
    orderCancelledSubtitle: "Kami memohon maaf atas kesulitan. Pesanan anda telah dibatalkan kerana masalah teknikal.",
    importantNotice: "Notis Penting",
    dearCustomer: "Pelanggan Yang Dihormati",
    cancelledMessage1: "Kami dengan ikhlas memohon maaf atas sebarang kesulitan yang berlaku. Pesanan terkini anda telah dibatalkan kerana masalah teknikal.",
    cancelledMessage2: "",
    refundProcessTitle: "Maklumat Proses Bayaran Balik",
    refundPoint1: "Kami akan segera menghantar rayuan pembayaran kepada bank anda dalam beberapa hari akan datang",
    refundPoint2: "Mengikut polisi bank, bayaran balik anda akan diproses dalam 2 hingga 15 hari bekerja",
    refundPoint3: "Bayaran balik akan dikreditkan ke akaun bank atau kaedah pembayaran yang sama",
    refundPoint4: "Anda akan menerima e-mel pengesahan selepas bayaran balik diproses",
    ifNoRefundTitle: "Jika Anda Tidak Menerima Bayaran Balik",
    ifNoRefundMessage: "Jika anda tidak menerima bayaran balik dalam 15 hari bekerja, sila hubungi pasukan sokongan kami dengan segera.",
    trustMessage: "Kami menghargai kepercayaan anda dan komited untuk menyelesaikan perkara ini dengan segera. Terima kasih atas kesabaran.",
    trackRefundStatus: "Jejak Status Bayaran Balik",
    backToHome: "Kembali ke Laman Utama",
    contactSupport: "Hubungi Sokongan",
  },
  
  // Thai
  th: {
    orderCancelledTitle: "คำสั่งซื้อของคุณถูกยกเลิก",
    orderCancelledSubtitle: "เราขออภัยในความไม่สะดวก คำสั่งซื้อของคุณถูกยกเลิกเนื่องจากปัญหาทางเทคนิค",
    importantNotice: "ประกาศสำคัญ",
    dearCustomer: "ลูกค้าที่เคารพ",
    cancelledMessage1: "เราขอโทษอย่างจริงใจสำหรับความไม่สะดวกที่เกิดขึ้น คำสั่งซื้อล่าสุดของคุณถูกยกเลิกเนื่องจากปัญหาทางเทคนิค",
    cancelledMessage2: "",
    refundProcessTitle: "ข้อมูลกระบวนการคืนเงิน",
    refundPoint1: "เราจะยื่นอุทธรณ์การชำระเงินไปยังธนาคารของคุณทันทีในอีกไม่กี่วันข้างหน้า",
    refundPoint2: "ตามนโยบายธนาคาร การคืนเงินจะดำเนินการภายใน 2 ถึง 15 วันทำการ",
    refundPoint3: "การคืนเงินจะเข้าบัญชีธนาคารหรือวิธีการชำระเงินเดิม",
    refundPoint4: "คุณจะได้รับอีเมลยืนยันเมื่อการคืนเงินได้รับการดำเนินการ",
    ifNoRefundTitle: "หากคุณไม่ได้รับการคืนเงิน",
    ifNoRefundMessage: "หากคุณไม่ได้รับการคืนเงินภายใน 15 วันทำการ กรุณาติดต่อทีมสนับสนุนของเราทันที",
    trustMessage: "เราให้คุณค่ากับความไว้วางใจของคุณและมุ่งมั่นที่จะแก้ไขเรื่องนี้อย่างรวดเร็ว ขอบคุณสำหรับความอดทน",
    trackRefundStatus: "ติดตามสถานะการคืนเงิน",
    backToHome: "กลับหน้าหลัก",
    contactSupport: "ติดต่อฝ่ายสนับสนุน",
  },
  
  // Vietnamese
  vi: {
    orderCancelledTitle: "Đơn hàng của bạn đã bị hủy",
    orderCancelledSubtitle: "Chúng tôi xin lỗi vì sự bất tiện. Đơn hàng của bạn đã bị hủy do vấn đề kỹ thuật.",
    importantNotice: "Thông báo quan trọng",
    dearCustomer: "Quý khách hàng",
    cancelledMessage1: "Chúng tôi chân thành xin lỗi vì bất kỳ sự bất tiện nào gây ra. Đơn hàng gần đây của bạn đã bị hủy do sự cố kỹ thuật.",
    cancelledMessage2: "",
    refundProcessTitle: "Thông tin quy trình hoàn tiền",
    refundPoint1: "Chúng tôi sẽ gửi ngay đơn khiếu nại thanh toán đến ngân hàng của bạn trong vài ngày tới",
    refundPoint2: "Theo chính sách ngân hàng, tiền hoàn lại sẽ được xử lý trong 2 đến 15 ngày làm việc",
    refundPoint3: "Tiền hoàn lại sẽ được ghi có vào cùng tài khoản ngân hàng hoặc phương thức thanh toán",
    refundPoint4: "Bạn sẽ nhận được email xác nhận khi tiền hoàn lại được xử lý",
    ifNoRefundTitle: "Nếu bạn không nhận được tiền hoàn lại",
    ifNoRefundMessage: "Nếu bạn không nhận được tiền hoàn lại trong 15 ngày làm việc, vui lòng liên hệ ngay với đội ngũ hỗ trợ.",
    trustMessage: "Chúng tôi trân trọng sự tin tưởng của bạn và cam kết giải quyết vấn đề này nhanh chóng. Cảm ơn sự kiên nhẫn.",
    trackRefundStatus: "Theo dõi trạng thái hoàn tiền",
    backToHome: "Quay lại trang chủ",
    contactSupport: "Liên hệ hỗ trợ",
  },
  
  // Japanese
  ja: {
    orderCancelledTitle: "ご注文はキャンセルされました",
    orderCancelledSubtitle: "ご不便をおかけして申し訳ございません。技術的な問題により、ご注文がキャンセルされました。",
    importantNotice: "重要なお知らせ",
    dearCustomer: "お客様",
    cancelledMessage1: "ご不便をおかけして誠に申し訳ございません。決済処理システムの技術的な問題により、最近のご注文がキャンセルされました。",
    cancelledMessage2: "",
    refundProcessTitle: "返金プロセス情報",
    refundPoint1: "今後数日以内に、お客様の銀行に支払い申し立てを直ちに提出いたします",
    refundPoint2: "銀行のポリシーに従い、返金は2〜15営業日以内に処理されます",
    refundPoint3: "返金は、ご購入時にご利用いただいた同じ銀行口座または支払い方法に入金されます",
    refundPoint4: "返金処理が完了次第、確認メールをお送りします",
    ifNoRefundTitle: "返金を受け取れない場合",
    ifNoRefundMessage: "15営業日以内に返金を受け取れない場合は、すぐにサポートチームにお問い合わせください。",
    trustMessage: "お客様の信頼を大切にし、この問題を迅速に解決することをお約束します。ご辛抱に感謝いたします。",
    trackRefundStatus: "返金状況を追跡",
    backToHome: "ホームに戻る",
    contactSupport: "サポートに連絡",
  },
  
  // Korean
  ko: {
    orderCancelledTitle: "주문이 취소되었습니다",
    orderCancelledSubtitle: "불편을 드려 죄송합니다. 기술적 문제로 인해 주문이 취소되었습니다.",
    importantNotice: "중요 공지",
    dearCustomer: "고객님께",
    cancelledMessage1: "불편을 드려 진심으로 사과드립니다. 결제 처리 시스템의 기술적 문제로 인해 최근 주문이 취소되었습니다.",
    cancelledMessage2: "",
    refundProcessTitle: "환불 절차 안내",
    refundPoint1: "며칠 내로 즉시 고객님의 은행에 결제 이의를 제출할 예정입니다",
    refundPoint2: "은행 정책에 따라 환불은 영업일 기준 2-15일 이내에 처리됩니다",
    refundPoint3: "환불은 구매 시 사용하신 동일한 은행 계좌 또는 결제 수단으로 입금됩니다",
    refundPoint4: "환불 처리가 완료되면 확인 이메일을 받으실 수 있습니다",
    ifNoRefundTitle: "환불을 받지 못하신 경우",
    ifNoRefundMessage: "영업일 기준 15일 이내에 환불을 받지 못하시면 즉시 고객 지원팀에 연락해 주세요.",
    trustMessage: "고객님의 신뢰를 소중히 여기며 이 문제를 신속하게 해결하기 위해 최선을 다하겠습니다.",
    trackRefundStatus: "환불 상태 추적",
    backToHome: "홈으로 돌아가기",
    contactSupport: "고객 지원 연락",
  },
  
  // Chinese (Simplified)
  zh: {
    orderCancelledTitle: "您的订单已取消",
    orderCancelledSubtitle: "给您带来不便，我们深表歉意。由于技术问题，您的订单已被取消。",
    importantNotice: "重要通知",
    dearCustomer: "尊敬的客户",
    cancelledMessage1: "对于造成的任何不便，我们深表歉意。由于我们支付处理系统的技术问题，您最近的订单已被取消。",
    cancelledMessage2: "",
    refundProcessTitle: "退款流程信息",
    refundPoint1: "我们将在接下来的几天内立即向您的银行提交付款申诉",
    refundPoint2: "根据银行政策，您的退款将在2至15个工作日内处理",
    refundPoint3: "退款将退还到您用于购买的同一银行账户或支付方式",
    refundPoint4: "退款处理完成后，您将收到确认电子邮件",
    ifNoRefundTitle: "如果您未收到退款",
    ifNoRefundMessage: "如果您在15个工作日内未收到退款，请立即联系我们的客户支持团队。",
    trustMessage: "我们重视您的信任，并致力于尽快解决此问题。感谢您的耐心。",
    trackRefundStatus: "跟踪退款状态",
    backToHome: "返回首页",
    contactSupport: "联系客服",
  },
  
  // Persian/Farsi (Iran)
  fa: {
    orderCancelledTitle: "سفارش شما لغو شد",
    orderCancelledSubtitle: "از ناراحتی پیش آمده عذرخواهی می‌کنیم. سفارش شما به دلیل مشکلات فنی لغو شده است.",
    importantNotice: "اطلاعیه مهم",
    dearCustomer: "مشتری گرامی",
    cancelledMessage1: "ما صمیمانه از هرگونه ناراحتی عذرخواهی می‌کنیم. سفارش اخیر شما به دلیل مشکل فنی در سیستم پردازش پرداخت ما لغو شده است.",
    cancelledMessage2: "",
    refundProcessTitle: "اطلاعات فرایند بازپرداخت",
    refundPoint1: "ما فوراً درخواست پرداخت به بانک شما را در روزهای آینده ارسال خواهیم کرد",
    refundPoint2: "طبق سیاست بانک، بازپرداخت شما ظرف 2 تا 15 روز کاری پردازش می‌شود",
    refundPoint3: "بازپرداخت به همان حساب بانکی یا روش پرداختی که برای خرید استفاده کردید واریز خواهد شد",
    refundPoint4: "پس از پردازش بازپرداخت، ایمیل تأیید دریافت خواهید کرد",
    ifNoRefundTitle: "اگر بازپرداخت دریافت نکردید",
    ifNoRefundMessage: "اگر ظرف 15 روز کاری بازپرداخت دریافت نکردید، لطفاً فوراً با تیم پشتیبانی ما تماس بگیرید.",
    trustMessage: "ما برای اعتماد شما ارزش قائلیم و متعهد به حل سریع این موضوع هستیم. از صبر شما متشکریم.",
    trackRefundStatus: "پیگیری وضعیت بازپرداخت",
    backToHome: "بازگشت به صفحه اصلی",
    contactSupport: "تماس با پشتیبانی",
  },
  
  // Hebrew (Israel)
  he: {
    orderCancelledTitle: "ההזמנה שלך בוטלה",
    orderCancelledSubtitle: "אנו מתנצלים על אי הנוחות. הזמנתך בוטלה עקב בעיות טכניות.",
    importantNotice: "הודעה חשובה",
    dearCustomer: "לקוח יקר",
    cancelledMessage1: "אנו מתנצלים בכנות על כל אי נוחות שנגרמה. הזמנתך האחרונה בוטלה עקב בעיה טכנית במערכת עיבוד התשלומים.",
    cancelledMessage2: "",
    refundProcessTitle: "מידע על תהליך ההחזר",
    refundPoint1: "נגיש מיד ערעור תשלום לבנק שלך בימים הקרובים",
    refundPoint2: "בהתאם למדיניות הבנק, ההחזר שלך יעובד תוך 2 עד 15 ימי עסקים",
    refundPoint3: "ההחזר יזוכה לאותו חשבון בנק או אמצעי תשלום שבו השתמשת לרכישה",
    refundPoint4: "תקבל אימייל אישור לאחר עיבוד ההחזר",
    ifNoRefundTitle: "אם לא קיבלת את ההחזר",
    ifNoRefundMessage: "אם לא תקבל את ההחזר תוך 15 ימי עסקים, אנא פנה מיד לצוות התמיכה שלנו.",
    trustMessage: "אנו מעריכים את אמונך ומחויבים לפתור עניין זה במהירות. תודה על הסבלנות.",
    trackRefundStatus: "עקוב אחר סטטוס ההחזר",
    backToHome: "חזרה לדף הבית",
    contactSupport: "צור קשר עם התמיכה",
  },
  
  // Kazakh (Kazakhstan)
  kk: {
    orderCancelledTitle: "Сіздің тапсырысыңыз бас тартылды",
    orderCancelledSubtitle: "Қолайсыздық үшін кешірім сұраймыз. Тапсырысыңыз техникалық мәселелерге байланысты бас тартылды.",
    importantNotice: "Маңызды Ескерту",
    dearCustomer: "Құрметті Клиент",
    cancelledMessage1: "Кез келген қолайсыздық үшін шын жүректен кешірім сұраймыз. Соңғы тапсырысыңыз біздің төлемді өңдеу жүйесіндегі техникалық мәселеге байланысты бас тартылды.",
    cancelledMessage2: "",
    refundProcessTitle: "Қайтару Процесі Туралы Ақпарат",
    refundPoint1: "Біз жақын күндерде сіздің банкіңізге төлем шағымын дереу береміз",
    refundPoint2: "Банк саясатына сәйкес, сіздің қайтаруыңыз 2-15 жұмыс күні ішінде өңделеді",
    refundPoint3: "Қайтару сатып алу үшін пайдаланған банк шотыңызға немесе төлем әдісіне есептеледі",
    refundPoint4: "Қайтару өңделгенде растау электрондық поштасын аласыз",
    ifNoRefundTitle: "Қайтаруды алмасаңыз",
    ifNoRefundMessage: "15 жұмыс күні ішінде қайтаруды алмасаңыз, бірден қолдау тобымызға хабарласыңыз.",
    trustMessage: "Біз сіздің сеніміңізді бағалаймыз және бұл мәселені тез шешуге міндеттенеміз. Сабырлығыңызға рахмет.",
    trackRefundStatus: "Қайтару Күйін Бақылау",
    backToHome: "Басты Бетке Оралу",
    contactSupport: "Қолдауға Хабарласу",
  },
  
  // Uzbek (Uzbekistan)
  uz: {
    orderCancelledTitle: "Buyurtmangiz bekor qilindi",
    orderCancelledSubtitle: "Noqulaylik uchun uzr so'raymiz. Buyurtmangiz texnik muammolar tufayli bekor qilindi.",
    importantNotice: "Muhim Xabar",
    dearCustomer: "Hurmatli Mijoz",
    cancelledMessage1: "Yuzaga kelgan har qanday noqulaylik uchun chin dildan uzr so'raymiz. So'nggi buyurtmangiz to'lovlarni qayta ishlash tizimimizdagi texnik muammo tufayli bekor qilindi.",
    cancelledMessage2: "",
    refundProcessTitle: "Qaytarish Jarayoni Haqida Ma'lumot",
    refundPoint1: "Keyingi bir necha kun ichida bankingizga darhol to'lov shikoyatini taqdim etamiz",
    refundPoint2: "Bank siyosatiga ko'ra, qaytarishingiz 2-15 ish kuni ichida qayta ishlanadi",
    refundPoint3: "Qaytarish xarid uchun foydalangan bank hisobingiz yoki to'lov usuliga o'tkaziladi",
    refundPoint4: "Qaytarish qayta ishlanganda tasdiqlash elektron pochtasini olasiz",
    ifNoRefundTitle: "Agar qaytarish olmasa",
    ifNoRefundMessage: "Agar 15 ish kuni ichida qaytarish olmasangiz, darhol qo'llab-quvvatlash guruhimizga murojaat qiling.",
    trustMessage: "Biz ishonchingizni qadrlaymiz va bu masalani tezda hal qilishga sodiqmiz. Sabringiz uchun rahmat.",
    trackRefundStatus: "Qaytarish Holatini Kuzatish",
    backToHome: "Bosh Sahifaga Qaytish",
    contactSupport: "Qo'llab-Quvvatlashga Murojaat",
  },
  
  // Azerbaijani (Azerbaijan)
  az: {
    orderCancelledTitle: "Sifarişiniz ləğv edildi",
    orderCancelledSubtitle: "Narahatlığa görə üzr istəyirik. Sifarişiniz texniki problemlərə görə ləğv edildi.",
    importantNotice: "Vacib Bildiriş",
    dearCustomer: "Hörmətli Müştəri",
    cancelledMessage1: "Yaranan hər hansı narahatlığa görə səmimi şəkildə üzr istəyirik. Son sifarişiniz ödəniş emalı sistemimizindəki texniki problem səbəbindən ləğv edildi.",
    cancelledMessage2: "",
    refundProcessTitle: "Geri Ödəmə Prosesi Haqqında Məlumat",
    refundPoint1: "Yaxın günlərdə dərhal bankınıza ödəniş şikayəti təqdim edəcəyik",
    refundPoint2: "Bank siyasətinə uyğun olaraq, geri ödəməniz 2-15 iş günü ərzində emal ediləcək",
    refundPoint3: "Geri ödəmə alış üçün istifadə etdiyiniz eyni bank hesabına və ya ödəniş üsuluna köçürüləcək",
    refundPoint4: "Geri ödəmə emal edildikdə təsdiq e-poçtu alacaqsınız",
    ifNoRefundTitle: "Əgər geri ödəmə almırsınızsa",
    ifNoRefundMessage: "15 iş günü ərzində geri ödəmə almırsınızsa, zəhmət olmasa dərhal dəstək komandamızla əlaqə saxlayın.",
    trustMessage: "Etimadınızı qiymətləndiririk və bu məsələni tez həll etməyə sadiqik. Səbrinizə görə təşəkkür edirik.",
    trackRefundStatus: "Geri Ödəmə Vəziyyətini İzləyin",
    backToHome: "Ana Səhifəyə Qayıt",
    contactSupport: "Dəstəklə Əlaqə",
  },
  
  // Georgian (Georgia)
  ka: {
    orderCancelledTitle: "თქვენი შეკვეთა გაუქმებულია",
    orderCancelledSubtitle: "ბოდიშს გიხდით შეუხერხებლობისთვის. თქვენი შეკვეთა გაუქმდა ტექნიკური პრობლემების გამო.",
    importantNotice: "მნიშვნელოვანი შეტყობინება",
    dearCustomer: "ძვირფასო მომხმარებელო",
    cancelledMessage1: "გულწრფელად ბოდიშს გიხდით ნებისმიერი შეუხერხებლობისთვის. თქვენი ბოლო შეკვეთა გაუქმდა ტექნიკური პრობლემის გამო.",
    cancelledMessage2: "",
    refundProcessTitle: "თანხის დაბრუნების პროცესის ინფორმაცია",
    refundPoint1: "მომდევნო რამდენიმე დღეში დაუყოვნებლივ წარვადგენთ გადახდის საჩივარს თქვენს ბანკში",
    refundPoint2: "ბანკის პოლიტიკის თანახმად, თქვენი თანხა დაბრუნდება 2-15 სამუშაო დღეში",
    refundPoint3: "თანხა დაბრუნდება იმავე საბანკო ანგარიშზე ან გადახდის მეთოდზე",
    refundPoint4: "თანხის დაბრუნების შემდეგ მიიღებთ დადასტურების ელ-ფოსტას",
    ifNoRefundTitle: "თუ არ მიიღებთ თანხის დაბრუნებას",
    ifNoRefundMessage: "თუ 15 სამუშაო დღეში არ მიიღებთ თანხის დაბრუნებას, გთხოვთ, დაუყოვნებლივ დაუკავშირდეთ ჩვენს მხარდაჭერის გუნდს.",
    trustMessage: "ვაფასებთ თქვენს ნდობას და მზად ვართ ეს საკითხი სწრაფად მოვაგვაროთ. გმადლობთ მოთმინებისთვის.",
    trackRefundStatus: "თანხის დაბრუნების სტატუსის თვალყურის დევნება",
    backToHome: "მთავარ გვერდზე დაბრუნება",
    contactSupport: "დაუკავშირდით მხარდაჭერას",
  },
  
  // Armenian (Armenia)
  hy: {
    orderCancelledTitle: "Ձեր պատվերը չեղարկվել է",
    orderCancelledSubtitle: "Ներողություն ենք խնդրում անհարմարության համար։ Ձեր պատվերը չեղարկվել է տեխնիկական խնդիրների պատճառով։",
    importantNotice: "Կարևոր ծանուցում",
    dearCustomer: "Հարգելի հաճախորդ",
    cancelledMessage1: "Մենք անկեղծորեն ներողություն ենք խնդրում պատճառված անհարմարության համար։ Ձեր վերջին պատվերը չեղարկվել է մեր վճարային համակարգում առաջացած տեխնիկական խնդրի պատճառով։ Սա կանխամտածված չէ, և մենք հասկանում ենք ձեր անհանգստությունը։",
    cancelledMessage2: "",
    refundProcessTitle: "Վերադարձի գործընթացի տեղեկատվություն",
    refundPoint1: "Մոտակա օրերին մենք անմիջապես կուղարկենք վճարման բողոքարկում ձեր բանկին",
    refundPoint2: "Բանկի քաղաքականության համաձայն՝ վերադարձը կկատարվի 2-ից 15 աշխատանքային օրվա ընթացքում",
    refundPoint3: "Վերադարձը կվարկագրվի նույն բանկային հաշվին կամ վճարման եղանակին, որը օգտագործել եք գնումի համար",
    refundPoint4: "Վերադարձը մշակվելուց հետո դուք կստանաք հաստատման էլ․ նամակ",
    ifNoRefundTitle: "Եթե վերադարձը չստանաք",
    ifNoRefundMessage: "Եթե 15 աշխատանքային օրվա ընթացքում վերադարձը չստանաք, խնդրում ենք անմիջապես կապվել մեր աջակցման թիմի հետ։ Մեր ներկայացուցիչները կապահովեն, որ դուք ստանաք ամբողջական վերադարձ՝ անմիջապես մեր ընկերության կողմից։",
    trustMessage: "Մենք գնահատում ենք ձեր վստահությունը և պարտավորվում ենք արագ լուծել այս հարցը։ Շնորհակալություն ձեր համբերության և ըմբռնման համար։",
    trackRefundStatus: "Հետևել վերադարձի կարգավիճակին",
    backToHome: "Վերադառնալ գլխավոր էջ",
    contactSupport: "Կապվել աջակցման հետ",
  },
  
  // Ukrainian
  uk: {
    orderCancelledTitle: "Ваше замовлення скасовано",
    orderCancelledSubtitle: "Приносимо вибачення за незручності. Ваше замовлення було скасовано через технічні проблеми.",
    importantNotice: "Важливе Повідомлення",
    dearCustomer: "Шановний Клієнте",
    cancelledMessage1: "Ми щиро вибачаємося за будь-які незручності. Ваше останнє замовлення було скасовано через технічну проблему в нашій платіжній системі.",
    cancelledMessage2: "",
    refundProcessTitle: "Інформація про Процес Повернення",
    refundPoint1: "Ми негайно подамо платіжну апеляцію до вашого банку протягом найближчих днів",
    refundPoint2: "Відповідно до політики банку, ваше повернення буде оброблено протягом 2-15 робочих днів",
    refundPoint3: "Повернення буде зараховано на той самий банківський рахунок або спосіб оплати",
    refundPoint4: "Ви отримаєте підтвердження на електронну пошту після обробки повернення",
    ifNoRefundTitle: "Якщо ви не отримали повернення",
    ifNoRefundMessage: "Якщо ви не отримаєте повернення протягом 15 робочих днів, будь ласка, негайно зверніться до нашої служби підтримки.",
    trustMessage: "Ми цінуємо вашу довіру і прагнемо швидко вирішити цю справу. Дякуємо за терпіння.",
    trackRefundStatus: "Відстежити Статус Повернення",
    backToHome: "На Головну",
    contactSupport: "Зв'язатися з Підтримкою",
  },
  
  // Polish
  pl: {
    orderCancelledTitle: "Twoje zamówienie zostało anulowane",
    orderCancelledSubtitle: "Przepraszamy za niedogodności. Twoje zamówienie zostało anulowane z powodu problemów technicznych.",
    importantNotice: "Ważna Informacja",
    dearCustomer: "Szanowny Kliencie",
    cancelledMessage1: "Szczerze przepraszamy za wszelkie niedogodności. Twoje ostatnie zamówienie zostało anulowane z powodu problemu technicznego.",
    cancelledMessage2: "",
    refundProcessTitle: "Informacje o Procesie Zwrotu",
    refundPoint1: "W ciągu najbliższych dni niezwłocznie złożymy odwołanie płatnicze do Twojego banku",
    refundPoint2: "Zgodnie z polityką banku, Twój zwrot zostanie przetworzony w ciągu 2 do 15 dni roboczych",
    refundPoint3: "Zwrot zostanie uznany na to samo konto bankowe lub metodę płatności",
    refundPoint4: "Otrzymasz email potwierdzający po przetworzeniu zwrotu",
    ifNoRefundTitle: "Jeśli nie otrzymasz zwrotu",
    ifNoRefundMessage: "Jeśli nie otrzymasz zwrotu w ciągu 15 dni roboczych, skontaktuj się natychmiast z naszym zespołem wsparcia.",
    trustMessage: "Cenimy Twoje zaufanie i jesteśmy zobowiązani do szybkiego rozwiązania tej sprawy. Dziękujemy za cierpliwość.",
    trackRefundStatus: "Śledź Status Zwrotu",
    backToHome: "Powrót do Strony Głównej",
    contactSupport: "Skontaktuj się z Pomocą",
  },
  
  // Italian
  it: {
    orderCancelledTitle: "Il tuo ordine è stato annullato",
    orderCancelledSubtitle: "Ci scusiamo per l'inconveniente. Il tuo ordine è stato annullato a causa di problemi tecnici.",
    importantNotice: "Avviso Importante",
    dearCustomer: "Gentile Cliente",
    cancelledMessage1: "Ci scusiamo sinceramente per qualsiasi inconveniente causato. Il tuo ordine recente è stato annullato a causa di un problema tecnico.",
    cancelledMessage2: "",
    refundProcessTitle: "Informazioni sul Processo di Rimborso",
    refundPoint1: "Invieremo immediatamente un ricorso di pagamento alla tua banca nei prossimi giorni",
    refundPoint2: "Secondo la politica bancaria, il tuo rimborso sarà elaborato entro 2-15 giorni lavorativi",
    refundPoint3: "Il rimborso sarà accreditato sullo stesso conto bancario o metodo di pagamento",
    refundPoint4: "Riceverai un'email di conferma una volta elaborato il rimborso",
    ifNoRefundTitle: "Se non ricevi il rimborso",
    ifNoRefundMessage: "Se non ricevi il rimborso entro 15 giorni lavorativi, contatta immediatamente il nostro team di supporto.",
    trustMessage: "Apprezziamo la tua fiducia e ci impegniamo a risolvere questa questione rapidamente. Grazie per la pazienza.",
    trackRefundStatus: "Traccia Stato Rimborso",
    backToHome: "Torna alla Home",
    contactSupport: "Contatta Supporto",
  },
  
  // Dutch
  nl: {
    orderCancelledTitle: "Uw bestelling is geannuleerd",
    orderCancelledSubtitle: "Wij bieden onze excuses aan voor het ongemak. Uw bestelling is geannuleerd vanwege technische problemen.",
    importantNotice: "Belangrijke Mededeling",
    dearCustomer: "Geachte Klant",
    cancelledMessage1: "Wij bieden oprecht onze excuses aan voor eventuele overlast. Uw recente bestelling is geannuleerd vanwege een technisch probleem.",
    cancelledMessage2: "",
    refundProcessTitle: "Informatie over het Terugbetalingsproces",
    refundPoint1: "We zullen binnen de komende dagen onmiddellijk een betalingsberoep bij uw bank indienen",
    refundPoint2: "Volgens het bankbeleid wordt uw terugbetaling binnen 2 tot 15 werkdagen verwerkt",
    refundPoint3: "De terugbetaling wordt bijgeschreven op dezelfde bankrekening of betaalmethode",
    refundPoint4: "U ontvangt een bevestigingsmail zodra de terugbetaling is verwerkt",
    ifNoRefundTitle: "Als u uw terugbetaling niet ontvangt",
    ifNoRefundMessage: "Als u uw terugbetaling niet binnen 15 werkdagen ontvangt, neem dan onmiddellijk contact op met ons supportteam.",
    trustMessage: "We waarderen uw vertrouwen en zijn toegewijd om deze zaak snel op te lossen. Bedankt voor uw geduld.",
    trackRefundStatus: "Terugbetalingsstatus Volgen",
    backToHome: "Terug naar Home",
    contactSupport: "Contact Opnemen",
  },
  
  // Swedish
  sv: {
    orderCancelledTitle: "Din beställning har avbrutits",
    orderCancelledSubtitle: "Vi ber om ursäkt för besväret. Din beställning har avbrutits på grund av tekniska problem.",
    importantNotice: "Viktigt Meddelande",
    dearCustomer: "Kära Kund",
    cancelledMessage1: "Vi ber uppriktigt om ursäkt för eventuella besvär. Din senaste beställning har avbrutits på grund av ett tekniskt problem.",
    cancelledMessage2: "",
    refundProcessTitle: "Information om Återbetalningsprocessen",
    refundPoint1: "Vi kommer omedelbart att skicka in ett betalningsöverklagande till din bank inom de närmaste dagarna",
    refundPoint2: "Enligt bankens policy kommer din återbetalning att behandlas inom 2 till 15 arbetsdagar",
    refundPoint3: "Återbetalningen kommer att krediteras samma bankkonto eller betalningsmetod",
    refundPoint4: "Du kommer att få ett bekräftelsemail när återbetalningen har behandlats",
    ifNoRefundTitle: "Om du inte får din återbetalning",
    ifNoRefundMessage: "Om du inte får din återbetalning inom 15 arbetsdagar, kontakta vårt supportteam omedelbart.",
    trustMessage: "Vi värdesätter ditt förtroende och är engagerade i att lösa detta ärende snabbt. Tack för ditt tålamod.",
    trackRefundStatus: "Spåra Återbetalningsstatus",
    backToHome: "Tillbaka till Startsidan",
    contactSupport: "Kontakta Support",
  },
  
  // Norwegian
  no: {
    orderCancelledTitle: "Bestillingen din er kansellert",
    orderCancelledSubtitle: "Vi beklager ulempen. Bestillingen din er kansellert på grunn av tekniske problemer.",
    importantNotice: "Viktig Beskjed",
    dearCustomer: "Kjære Kunde",
    cancelledMessage1: "Vi beklager oppriktig for ulemper dette har medført. Din nylige bestilling er kansellert på grunn av et teknisk problem.",
    cancelledMessage2: "",
    refundProcessTitle: "Informasjon om Refusjonsprosessen",
    refundPoint1: "Vi vil umiddelbart sende en betalingsklage til banken din i løpet av de neste dagene",
    refundPoint2: "I henhold til bankens retningslinjer vil refusjonen bli behandlet innen 2 til 15 virkedager",
    refundPoint3: "Refusjonen vil bli kreditert den samme bankkontoen eller betalingsmåten",
    refundPoint4: "Du vil motta en bekreftelsesmail når refusjonen er behandlet",
    ifNoRefundTitle: "Hvis du ikke mottar refusjonen",
    ifNoRefundMessage: "Hvis du ikke mottar refusjonen innen 15 virkedager, vennligst kontakt vårt supportteam umiddelbart.",
    trustMessage: "Vi verdsetter din tillit og er forpliktet til å løse denne saken raskt. Takk for din tålmodighet.",
    trackRefundStatus: "Spor Refusjonsstatus",
    backToHome: "Tilbake til Hjem",
    contactSupport: "Kontakt Support",
  },
  
  // Danish
  da: {
    orderCancelledTitle: "Din ordre er annulleret",
    orderCancelledSubtitle: "Vi beklager ulejligheden. Din ordre er annulleret på grund af tekniske problemer.",
    importantNotice: "Vigtig Meddelelse",
    dearCustomer: "Kære Kunde",
    cancelledMessage1: "Vi beklager oprigtigt eventuelle ulemper. Din seneste ordre er annulleret på grund af et teknisk problem.",
    cancelledMessage2: "",
    refundProcessTitle: "Information om Refusionsprocessen",
    refundPoint1: "Vi vil straks indsende en betalingsanke til din bank inden for de næste dage",
    refundPoint2: "Ifølge bankens politik vil din refusion blive behandlet inden for 2 til 15 hverdage",
    refundPoint3: "Refusionen vil blive krediteret den samme bankkonto eller betalingsmetode",
    refundPoint4: "Du vil modtage en bekræftelsesmail, når refusionen er behandlet",
    ifNoRefundTitle: "Hvis du ikke modtager din refusion",
    ifNoRefundMessage: "Hvis du ikke modtager din refusion inden for 15 hverdage, kontakt venligst vores supportteam med det samme.",
    trustMessage: "Vi værdsætter din tillid og er forpligtet til at løse dette hurtigt. Tak for din tålmodighed.",
    trackRefundStatus: "Spor Refusionsstatus",
    backToHome: "Tilbage til Hjem",
    contactSupport: "Kontakt Support",
  },
  
  // Finnish
  fi: {
    orderCancelledTitle: "Tilauksesi on peruutettu",
    orderCancelledSubtitle: "Pahoittelemme vaivaa. Tilauksesi on peruutettu teknisten ongelmien vuoksi.",
    importantNotice: "Tärkeä Ilmoitus",
    dearCustomer: "Hyvä Asiakas",
    cancelledMessage1: "Pahoittelemme vilpittömästi aiheutunutta vaivaa. Viimeaikainen tilauksesi on peruutettu teknisen ongelman vuoksi.",
    cancelledMessage2: "",
    refundProcessTitle: "Tietoa Palautusprosessista",
    refundPoint1: "Lähetämme välittömästi maksuvalituksen pankkiisi seuraavien päivien aikana",
    refundPoint2: "Pankin käytäntöjen mukaan palautus käsitellään 2-15 arkipäivän kuluessa",
    refundPoint3: "Palautus hyvitetään samalle pankkitilille tai maksutavalle",
    refundPoint4: "Saat vahvistussähköpostin, kun palautus on käsitelty",
    ifNoRefundTitle: "Jos et saa palautusta",
    ifNoRefundMessage: "Jos et saa palautusta 15 arkipäivän kuluessa, ota välittömästi yhteyttä asiakaspalveluumme.",
    trustMessage: "Arvostamme luottamustasi ja olemme sitoutuneet ratkaisemaan tämän asian nopeasti. Kiitos kärsivällisyydestäsi.",
    trackRefundStatus: "Seuraa Palautuksen Tilaa",
    backToHome: "Takaisin Etusivulle",
    contactSupport: "Ota Yhteyttä Tukeen",
  },
  
  // Greek
  el: {
    orderCancelledTitle: "Η παραγγελία σας ακυρώθηκε",
    orderCancelledSubtitle: "Ζητούμε συγγνώμη για την ταλαιπωρία. Η παραγγελία σας ακυρώθηκε λόγω τεχνικών προβλημάτων.",
    importantNotice: "Σημαντική Ειδοποίηση",
    dearCustomer: "Αγαπητέ Πελάτη",
    cancelledMessage1: "Ζητούμε ειλικρινά συγγνώμη για οποιαδήποτε ταλαιπωρία. Η πρόσφατη παραγγελία σας ακυρώθηκε λόγω τεχνικού προβλήματος.",
    cancelledMessage2: "",
    refundProcessTitle: "Πληροφορίες Διαδικασίας Επιστροφής",
    refundPoint1: "Θα υποβάλουμε αμέσως ένσταση πληρωμής στην τράπεζά σας τις επόμενες ημέρες",
    refundPoint2: "Σύμφωνα με την πολιτική της τράπεζας, η επιστροφή σας θα διεκπεραιωθεί σε 2 έως 15 εργάσιμες ημέρες",
    refundPoint3: "Η επιστροφή θα πιστωθεί στον ίδιο τραπεζικό λογαριασμό ή μέθοδο πληρωμής",
    refundPoint4: "Θα λάβετε email επιβεβαίωσης μόλις διεκπεραιωθεί η επιστροφή",
    ifNoRefundTitle: "Εάν δεν λάβετε την επιστροφή",
    ifNoRefundMessage: "Εάν δεν λάβετε την επιστροφή σε 15 εργάσιμες ημέρες, επικοινωνήστε αμέσως με την ομάδα υποστήριξής μας.",
    trustMessage: "Εκτιμούμε την εμπιστοσύνη σας και δεσμευόμαστε να επιλύσουμε το ζήτημα γρήγορα. Ευχαριστούμε για την υπομονή.",
    trackRefundStatus: "Παρακολούθηση Κατάστασης Επιστροφής",
    backToHome: "Επιστροφή στην Αρχική",
    contactSupport: "Επικοινωνία με Υποστήριξη",
  },
  
  // Czech
  cs: {
    orderCancelledTitle: "Vaše objednávka byla zrušena",
    orderCancelledSubtitle: "Omlouváme se za nepříjemnosti. Vaše objednávka byla zrušena kvůli technickým problémům.",
    importantNotice: "Důležité Upozornění",
    dearCustomer: "Vážený Zákazníku",
    cancelledMessage1: "Upřímně se omlouváme za vzniklé nepříjemnosti. Vaše nedávná objednávka byla zrušena kvůli technickému problému.",
    cancelledMessage2: "",
    refundProcessTitle: "Informace o Procesu Vrácení",
    refundPoint1: "V příštích dnech okamžitě podáme platební stížnost vaší bance",
    refundPoint2: "Podle bankovních pravidel bude vaše vrácení zpracováno do 2 až 15 pracovních dnů",
    refundPoint3: "Vrácení bude připsáno na stejný bankovní účet nebo platební metodu",
    refundPoint4: "Po zpracování vrácení obdržíte potvrzovací email",
    ifNoRefundTitle: "Pokud neobdržíte vrácení",
    ifNoRefundMessage: "Pokud neobdržíte vrácení do 15 pracovních dnů, kontaktujte ihned náš tým podpory.",
    trustMessage: "Vážíme si vaší důvěry a jsme odhodláni tuto záležitost rychle vyřešit. Děkujeme za trpělivost.",
    trackRefundStatus: "Sledovat Stav Vrácení",
    backToHome: "Zpět na Domovskou Stránku",
    contactSupport: "Kontaktovat Podporu",
  },
  
  // Hungarian
  hu: {
    orderCancelledTitle: "Rendelése törölve lett",
    orderCancelledSubtitle: "Elnézést kérünk a kellemetlenségért. Rendelését technikai problémák miatt töröltük.",
    importantNotice: "Fontos Értesítés",
    dearCustomer: "Tisztelt Ügyfelünk",
    cancelledMessage1: "Őszintén elnézést kérünk a felmerült kellemetlenségekért. Legutóbbi rendelését technikai hiba miatt töröltük.",
    cancelledMessage2: "",
    refundProcessTitle: "Visszatérítési Folyamat Információ",
    refundPoint1: "A következő napokban azonnal benyújtunk egy fizetési fellebbezést a bankjához",
    refundPoint2: "A banki szabályzat szerint a visszatérítést 2-15 munkanapon belül feldolgozzák",
    refundPoint3: "A visszatérítés ugyanarra a bankszámlára vagy fizetési módra kerül jóváírásra",
    refundPoint4: "A visszatérítés feldolgozása után visszaigazoló e-mailt kap",
    ifNoRefundTitle: "Ha nem kapja meg a visszatérítést",
    ifNoRefundMessage: "Ha 15 munkanapon belül nem kapja meg a visszatérítést, kérjük, azonnal lépjen kapcsolatba ügyfélszolgálatunkkal.",
    trustMessage: "Nagyra értékeljük bizalmát, és elkötelezettek vagyunk az ügy gyors megoldása mellett. Köszönjük türelmét.",
    trackRefundStatus: "Visszatérítés Állapotának Követése",
    backToHome: "Vissza a Kezdőlapra",
    contactSupport: "Kapcsolatfelvétel",
  },
  
  // Romanian
  ro: {
    orderCancelledTitle: "Comanda dvs. a fost anulată",
    orderCancelledSubtitle: "Ne cerem scuze pentru inconveniență. Comanda dvs. a fost anulată din cauza unor probleme tehnice.",
    importantNotice: "Notificare Importantă",
    dearCustomer: "Stimate Client",
    cancelledMessage1: "Ne cerem sincere scuze pentru orice inconveniență cauzată. Comanda dvs. recentă a fost anulată din cauza unei probleme tehnice.",
    cancelledMessage2: "",
    refundProcessTitle: "Informații despre Procesul de Rambursare",
    refundPoint1: "Vom trimite imediat o contestație de plată la banca dvs. în următoarele zile",
    refundPoint2: "Conform politicii bancare, rambursarea dvs. va fi procesată în 2-15 zile lucrătoare",
    refundPoint3: "Rambursarea va fi creditată în același cont bancar sau metodă de plată",
    refundPoint4: "Veți primi un email de confirmare odată ce rambursarea este procesată",
    ifNoRefundTitle: "Dacă nu primiți rambursarea",
    ifNoRefundMessage: "Dacă nu primiți rambursarea în 15 zile lucrătoare, vă rugăm să contactați imediat echipa noastră de suport.",
    trustMessage: "Apreciem încrederea dvs. și ne angajăm să rezolvăm această problemă rapid. Vă mulțumim pentru răbdare.",
    trackRefundStatus: "Urmăriți Starea Rambursării",
    backToHome: "Înapoi la Pagina Principală",
    contactSupport: "Contactați Suportul",
  },
  
  // Bulgarian
  bg: {
    orderCancelledTitle: "Вашата поръчка е отменена",
    orderCancelledSubtitle: "Извиняваме се за неудобството. Вашата поръчка беше отменена поради технически проблеми.",
    importantNotice: "Важно Съобщение",
    dearCustomer: "Уважаеми Клиент",
    cancelledMessage1: "Искрено се извиняваме за причинените неудобства. Вашата скорошна поръчка беше отменена поради технически проблем.",
    cancelledMessage2: "",
    refundProcessTitle: "Информация за Процеса на Възстановяване",
    refundPoint1: "Ще подадем незабавно жалба за плащане до вашата банка в следващите дни",
    refundPoint2: "Съгласно банковата политика, вашето възстановяване ще бъде обработено в рамките на 2 до 15 работни дни",
    refundPoint3: "Възстановяването ще бъде кредитирано към същата банкова сметка или метод на плащане",
    refundPoint4: "Ще получите имейл за потвърждение, когато възстановяването бъде обработено",
    ifNoRefundTitle: "Ако не получите възстановяване",
    ifNoRefundMessage: "Ако не получите възстановяването си в рамките на 15 работни дни, моля свържете се незабавно с нашия екип за поддръжка.",
    trustMessage: "Ценим вашето доверие и сме ангажирани да разрешим този въпрос бързо. Благодарим за търпението.",
    trackRefundStatus: "Проследяване на Статус на Възстановяване",
    backToHome: "Обратно към Началната Страница",
    contactSupport: "Свържете се с Поддръжка",
  },
  
  // Swahili (Kenya, Tanzania)
  sw: {
    orderCancelledTitle: "Agizo lako limefutwa",
    orderCancelledSubtitle: "Tunaomba msamaha kwa usumbufu. Agizo lako limefutwa kutokana na matatizo ya kiufundi.",
    importantNotice: "Taarifa Muhimu",
    dearCustomer: "Mteja Mpendwa",
    cancelledMessage1: "Tunaomba msamaha kwa dhati kwa usumbufu wowote uliojitokeza. Agizo lako la hivi karibuni limefutwa kutokana na tatizo la kiufundi.",
    cancelledMessage2: "",
    refundProcessTitle: "Taarifa ya Mchakato wa Kurudisha Pesa",
    refundPoint1: "Tutawasilisha mara moja rufaa ya malipo kwa benki yako ndani ya siku chache zijazo",
    refundPoint2: "Kulingana na sera ya benki, pesa yako itarudishwa ndani ya siku 2 hadi 15 za kazi",
    refundPoint3: "Pesa itarudishwa kwa akaunti ya benki au njia ya malipo ile ile",
    refundPoint4: "Utapokea barua pepe ya uthibitisho pesa yako itakaporudishwa",
    ifNoRefundTitle: "Ikiwa hupati pesa yako",
    ifNoRefundMessage: "Ikiwa hupokei pesa yako ndani ya siku 15 za kazi, tafadhali wasiliana na timu yetu ya msaada mara moja.",
    trustMessage: "Tunathamini imani yako na tumejitolea kutatua suala hili haraka. Asante kwa uvumilivu wako.",
    trackRefundStatus: "Fuatilia Hali ya Kurudisha Pesa",
    backToHome: "Rudi Nyumbani",
    contactSupport: "Wasiliana na Msaada",
  },
  
  // Amharic (Ethiopia)
  am: {
    orderCancelledTitle: "ትዕዛዝዎ ተሰርዟል",
    orderCancelledSubtitle: "ለችግሩ ይቅርታ እንጠይቃለን። ትዕዛዝዎ በቴክኒካዊ ችግሮች ምክንያት ተሰርዟል።",
    importantNotice: "አስፈላጊ ማስታወቂያ",
    dearCustomer: "ውድ ደንበኛ",
    cancelledMessage1: "ለማንኛውም ችግር ከልብ ይቅርታ እንጠይቃለን። በክፍያ ማስተናገጃ ስርዓታችን ውስጥ በቴክኒካዊ ችግር ምክንያት የቅርብ ጊዜ ትዕዛዝዎ ተሰርዟል።",
    cancelledMessage2: "",
    refundProcessTitle: "የገንዘብ ተመላሽ ሂደት መረጃ",
    refundPoint1: "በሚቀጥሉት ጥቂት ቀናት ውስጥ ወዲያውኑ ለባንክዎ የክፍያ ይግባኝ እናቀርባለን",
    refundPoint2: "በባንክ ፖሊሲ መሰረት ገንዘብ ተመላሽዎ በ2 እስከ 15 የስራ ቀናት ውስጥ ይከናወናል",
    refundPoint3: "ተመላሹ ለግዢው በተጠቀሙበት ተመሳሳይ የባንክ ሂሳብ ወይም የክፍያ ዘዴ ይመዘገባል",
    refundPoint4: "ተመላሹ ሲከናወን የማረጋገጫ ኢሜይል ይደርስዎታል",
    ifNoRefundTitle: "ተመላሽ ካልደረሰዎ",
    ifNoRefundMessage: "በ15 የስራ ቀናት ውስጥ ተመላሽ ካልተቀበሉ እባክዎን ወዲያውኑ የድጋፍ ቡድናችንን ያነጋግሩ።",
    trustMessage: "እምነትዎን እናደንቃለን እና ይህን ጉዳይ በፍጥነት ለመፍታት ቁርጠኞች ነን። ለትዕግስትዎ እናመሰግናለን።",
    trackRefundStatus: "የተመላሽ ሁኔታ ተከታተል",
    backToHome: "ወደ መነሻ ተመለስ",
    contactSupport: "ድጋፍ ያግኙ",
  },
  
  // Tagalog/Filipino (Philippines)
  tl: {
    orderCancelledTitle: "Nakansela ang Iyong Order",
    orderCancelledSubtitle: "Humihingi kami ng paumanhin sa abala. Nakansela ang iyong order dahil sa mga teknikal na isyu.",
    importantNotice: "Mahalagang Paunawa",
    dearCustomer: "Minamahal na Customer",
    cancelledMessage1: "Taos-puso kaming humihingi ng paumanhin sa anumang abalang dulot nito. Nakansela ang iyong order dahil sa teknikal na problema.",
    cancelledMessage2: "",
    refundProcessTitle: "Impormasyon sa Proseso ng Refund",
    refundPoint1: "Agad naming isusumite ang payment appeal sa iyong bangko sa mga susunod na araw",
    refundPoint2: "Ayon sa polisiya ng bangko, ang iyong refund ay ipoproseso sa loob ng 2 hanggang 15 araw ng negosyo",
    refundPoint3: "Ang refund ay icrecredit sa parehong bank account o paraan ng pagbabayad",
    refundPoint4: "Makakatanggap ka ng confirmation email kapag naiproseso na ang refund",
    ifNoRefundTitle: "Kung Hindi Ka Makatanggap ng Refund",
    ifNoRefundMessage: "Kung hindi mo matanggap ang refund sa loob ng 15 araw ng negosyo, mangyaring makipag-ugnayan agad sa aming support team.",
    trustMessage: "Pinahahalagahan namin ang iyong tiwala at nakatuon sa mabilis na paglutas ng bagay na ito. Salamat sa iyong pasensya.",
    trackRefundStatus: "Subaybayan ang Status ng Refund",
    backToHome: "Bumalik sa Home",
    contactSupport: "Makipag-ugnayan sa Support",
  },
  
  // Afrikaans (South Africa)
  af: {
    orderCancelledTitle: "Jou bestelling is gekanselleer",
    orderCancelledSubtitle: "Ons vra om verskoning vir die ongerief. Jou bestelling is gekanselleer weens tegniese probleme.",
    importantNotice: "Belangrike Kennisgewing",
    dearCustomer: "Geagte Kliënt",
    cancelledMessage1: "Ons vra opreg om verskoning vir enige ongerief wat veroorsaak is. Jou onlangse bestelling is gekanselleer weens 'n tegniese probleem.",
    cancelledMessage2: "",
    refundProcessTitle: "Terugbetaling Proses Inligting",
    refundPoint1: "Ons sal onmiddellik 'n betalingsappèl by jou bank indien binne die volgende paar dae",
    refundPoint2: "Volgens bankbeleid sal jou terugbetaling binne 2 tot 15 werksdae verwerk word",
    refundPoint3: "Die terugbetaling sal gekrediteer word na dieselfde bankrekening of betaalmetode",
    refundPoint4: "Jy sal 'n bevestigings-e-pos ontvang sodra die terugbetaling verwerk is",
    ifNoRefundTitle: "As jy nie jou terugbetaling ontvang nie",
    ifNoRefundMessage: "As jy nie jou terugbetaling binne 15 werksdae ontvang nie, kontak asseblief onmiddellik ons ondersteuningspan.",
    trustMessage: "Ons waardeer jou vertroue en is verbind om hierdie saak vinnig op te los. Dankie vir jou geduld.",
    trackRefundStatus: "Volg Terugbetalingstatus",
    backToHome: "Terug na Tuis",
    contactSupport: "Kontak Ondersteuning",
  },
  
  // Mongolian
  mn: {
    orderCancelledTitle: "Таны захиалга цуцлагдлаа",
    orderCancelledSubtitle: "Таныг эвгүй байдалд оруулсанд уучлаарай. Техникийн асуудлаас болж таны захиалга цуцлагдлаа.",
    importantNotice: "Чухал Мэдэгдэл",
    dearCustomer: "Эрхэм Үйлчлүүлэгч",
    cancelledMessage1: "Аливаа эвгүй байдлын төлөө чин сэтгэлээсээ уучлал гуйж байна. Төлбөр боловсруулах системийн техникийн асуудлаас болж таны сүүлийн захиалга цуцлагдсан.",
    cancelledMessage2: "",
    refundProcessTitle: "Буцаан Олголтын Мэдээлэл",
    refundPoint1: "Бид дараагийн хэдэн өдрийн дотор таны банкинд төлбөрийн гомдол шууд илгээнэ",
    refundPoint2: "Банкны бодлогын дагуу таны буцаан олголт 2-15 ажлын өдрийн дотор боловсруулагдана",
    refundPoint3: "Буцаан олголт таны худалдан авалтад ашигласан банкны дансанд шилжүүлэгдэнэ",
    refundPoint4: "Буцаан олголт боловсруулагдсаны дараа баталгаажуулах имэйл хүлээн авна",
    ifNoRefundTitle: "Хэрэв та буцаан олголт хүлээж аваагүй бол",
    ifNoRefundMessage: "Хэрэв та 15 ажлын өдрийн дотор буцаан олголт хүлээж аваагүй бол манай дэмжлэгийн багтай шууд холбогдоно уу.",
    trustMessage: "Бид таны итгэлийг үнэлж, энэ асуудлыг шуурхай шийдвэрлэхээр амлаж байна. Тэвчээртэй байсанд баярлалаа.",
    trackRefundStatus: "Буцаан Олголтын Төлөв Хянах",
    backToHome: "Нүүр Хуудас Руу Буцах",
    contactSupport: "Дэмжлэгтэй Холбогдох",
  },
  
  // Khmer (Cambodia)
  km: {
    orderCancelledTitle: "ការបញ្ជាទិញរបស់អ្នកត្រូវបានលុបចោល",
    orderCancelledSubtitle: "យើងសុំអភ័យទោសចំពោះការរអាក់រអួល។ ការបញ្ជាទិញរបស់អ្នកត្រូវបានលុបចោលដោយសារបញ្ហាបច្ចេកទេស។",
    importantNotice: "សេចក្តីជូនដំណឹងសំខាន់",
    dearCustomer: "អតិថិជនជាទីគោរព",
    cancelledMessage1: "យើងសូមអភ័យទោសដោយស្មោះចំពោះការរអាក់រអួលណាមួយដែលបង្កឡើង។ ការបញ្ជាទិញថ្មីៗរបស់អ្នកត្រូវបានលុបចោលដោយសារបញ្ហាបច្ចេកទេស។",
    cancelledMessage2: "",
    refundProcessTitle: "ព័ត៌មានអំពីដំណើរការសងប្រាក់វិញ",
    refundPoint1: "យើងនឹងដាក់ពាក្យបណ្តឹងទូទាត់ប្រាក់ទៅធនាគាររបស់អ្នកភ្លាមៗក្នុងរយៈពេលប៉ុន្មានថ្ងៃខាងមុខ",
    refundPoint2: "យោងតាមគោលការណ៍ធនាគារ ការសងប្រាក់វិញរបស់អ្នកនឹងត្រូវដំណើរការក្នុងរយៈពេល ២ ទៅ ១៥ ថ្ងៃធ្វើការ",
    refundPoint3: "ការសងប្រាក់វិញនឹងត្រូវបញ្ចូលទៅគណនីធនាគារ ឬវិធីសាស្ត្រទូទាត់ដូចគ្នា",
    refundPoint4: "អ្នកនឹងទទួលអ៊ីមែលបញ្ជាក់នៅពេលដែលការសងប្រាក់វិញត្រូវបានដំណើរការ",
    ifNoRefundTitle: "ប្រសិនបើអ្នកមិនទទួលបានការសងប្រាក់វិញ",
    ifNoRefundMessage: "ប្រសិនបើអ្នកមិនទទួលបានការសងប្រាក់វិញក្នុងរយៈពេល ១៥ ថ្ងៃធ្វើការទេ សូមទាក់ទងក្រុមជំនួយរបស់យើងភ្លាមៗ។",
    trustMessage: "យើងផ្តល់តម្លៃលើការជឿទុកចិត្តរបស់អ្នក និងប្តេជ្ញាដោះស្រាយបញ្ហានេះយ៉ាងឆាប់រហ័ស។ សូមអរគុណសម្រាប់ការអត់ធ្មត់។",
    trackRefundStatus: "តាមដានស្ថានភាពសងប្រាក់វិញ",
    backToHome: "ត្រឡប់ទៅទំព័រដើម",
    contactSupport: "ទាក់ទងផ្នែកជំនួយ",
  },
  
  // Lao
  lo: {
    orderCancelledTitle: "ຄຳສັ່ງຊື້ຂອງທ່ານຖືກຍົກເລີກ",
    orderCancelledSubtitle: "ພວກເຮົາຂໍອະໄພໃນຄວາມບໍ່ສະດວກ. ຄຳສັ່ງຊື້ຂອງທ່ານຖືກຍົກເລີກເນື່ອງຈາກບັນຫາທາງເທັກນິກ.",
    importantNotice: "ແຈ້ງການສຳຄັນ",
    dearCustomer: "ລູກຄ້າທີ່ນັບຖື",
    cancelledMessage1: "ພວກເຮົາຂໍອະໄພຢ່າງຈິງໃຈສຳລັບຄວາມບໍ່ສະດວກທີ່ເກີດຂຶ້ນ. ຄຳສັ່ງຊື້ຫຼ້າສຸດຂອງທ່ານຖືກຍົກເລີກເນື່ອງຈາກບັນຫາທາງເທັກນິກ.",
    cancelledMessage2: "",
    refundProcessTitle: "ຂໍ້ມູນຂະບວນການຄືນເງິນ",
    refundPoint1: "ພວກເຮົາຈະສົ່ງການອຸທອນການຊຳລະໃຫ້ທະນາຄານຂອງທ່ານທັນທີໃນອີກບໍ່ເທົ່າໃດມື້ຂ້າງໜ້າ",
    refundPoint2: "ຕາມນະໂຍບາຍທະນາຄານ, ການຄືນເງິນຂອງທ່ານຈະຖືກປະມວນຜົນພາຍໃນ 2 ຫາ 15 ມື້ເຮັດວຽກ",
    refundPoint3: "ການຄືນເງິນຈະຖືກໂອນເຂົ້າບັນຊີທະນາຄານ ຫຼື ວິທີການຊຳລະດຽວກັນ",
    refundPoint4: "ທ່ານຈະໄດ້ຮັບອີເມວຢືນຢັນເມື່ອການຄືນເງິນຖືກປະມວນຜົນ",
    ifNoRefundTitle: "ຖ້າທ່ານບໍ່ໄດ້ຮັບການຄືນເງິນ",
    ifNoRefundMessage: "ຖ້າທ່ານບໍ່ໄດ້ຮັບການຄືນເງິນພາຍໃນ 15 ມື້ເຮັດວຽກ, ກະລຸນາຕິດຕໍ່ທີມສະໜັບສະໜູນຂອງພວກເຮົາທັນທີ.",
    trustMessage: "ພວກເຮົາເຫັນຄຸນຄ່າຄວາມໄວ້ວາງໃຈຂອງທ່ານ ແລະ ມຸ່ງໝັ້ນແກ້ໄຂບັນຫານີ້ຢ່າງໄວ. ຂໍຂອບໃຈສຳລັບຄວາມອົດທົນ.",
    trackRefundStatus: "ຕິດຕາມສະຖານະການຄືນເງິນ",
    backToHome: "ກັບຄືນໜ້າຫຼັກ",
    contactSupport: "ຕິດຕໍ່ສະໜັບສະໜູນ",
  },
  
  // Myanmar/Burmese
  my: {
    orderCancelledTitle: "သင့်အော်ဒါကို ပယ်ဖျက်လိုက်ပါပြီ",
    orderCancelledSubtitle: "အဆင်မပြေမှုအတွက် တောင်းပန်ပါသည်။ နည်းပညာဆိုင်ရာ ပြဿနာများကြောင့် သင့်အော်ဒါကို ပယ်ဖျက်လိုက်ပါပြီ။",
    importantNotice: "အရေးကြီးသော အသိပေးချက်",
    dearCustomer: "ချစ်ခင်ရပါသော ဖောက်သည်",
    cancelledMessage1: "မည်သည့်အဆင်မပြေမှုအတွက်မဆို စိတ်ရင်းအမှန်ဖြင့် တောင်းပန်ပါသည်။ နည်းပညာဆိုင်ရာ ပြဿနာကြောင့် သင့်အော်ဒါကို ပယ်ဖျက်လိုက်ပါပြီ။",
    cancelledMessage2: "",
    refundProcessTitle: "ပြန်အမ်းငွေ လုပ်ငန်းစဉ် အချက်အလက်",
    refundPoint1: "လာမည့် ရက်အနည်းငယ်အတွင်း သင့်ဘဏ်သို့ ငွေပေးချေမှု အယူခံလွှာကို ချက်ချင်း တင်သွင်းပါမည်",
    refundPoint2: "ဘဏ်မူဝါဒအရ သင့်ပြန်အမ်းငွေကို အလုပ်လုပ်ရက် ၂ မှ ၁၅ ရက်အတွင်း လုပ်ဆောင်ပါမည်",
    refundPoint3: "ပြန်အမ်းငွေကို သင်ဝယ်ယူရာတွင် အသုံးပြုခဲ့သော ဘဏ်အကောင့် သို့မဟုတ် ငွေပေးချေမှုနည်းလမ်းသို့ ပြန်သွင်းပါမည်",
    refundPoint4: "ပြန်အမ်းငွေ လုပ်ဆောင်ပြီးသောအခါ အတည်ပြု အီးမေးလ် ရရှိပါမည်",
    ifNoRefundTitle: "ပြန်အမ်းငွေ မရရှိပါက",
    ifNoRefundMessage: "အလုပ်လုပ်ရက် ၁၅ ရက်အတွင်း ပြန်အမ်းငွေ မရရှိပါက ကျေးဇူးပြု၍ ကျွန်ုပ်တို့၏ ပံ့ပိုးရေးအဖွဲ့ကို ချက်ချင်း ဆက်သွယ်ပါ။",
    trustMessage: "သင့်ယုံကြည်မှုကို တန်ဖိုးထားပြီး ဤကိစ္စကို အမြန်ဖြေရှင်းရန် ကတိပြုပါသည်။ သည်းခံမှုအတွက် ကျေးဇူးတင်ပါသည်။",
    trackRefundStatus: "ပြန်အမ်းငွေ အခြေအနေကို ခြေရာခံပါ",
    backToHome: "ပင်မစာမျက်နှာသို့ ပြန်သွားပါ",
    contactSupport: "ပံ့ပိုးရေးကို ဆက်သွယ်ပါ",
  },
  
  // Dzongkha (Bhutan) - dz
  dz: {
    orderCancelledTitle: "Your Order is Cancelled",
    orderCancelledSubtitle: "We apologize for the inconvenience. Your order has been cancelled due to technical issues.",
    importantNotice: "Important Notice",
    dearCustomer: "Dear Customer",
    cancelledMessage1: "We sincerely apologize for any inconvenience caused. Your recent order has been cancelled due to a technical issue in our payment processing system. This was not intended and we understand your frustration.",
    cancelledMessage2: "",
    refundProcessTitle: "Refund Process Information",
    refundPoint1: "We will immediately submit a payment appeal to your bank within the next few days",
    refundPoint2: "According to bank policy, your refund will be processed within 2 to 15 business days",
    refundPoint3: "The refund will be credited to the same bank account or payment method you used for the purchase",
    refundPoint4: "You will receive a confirmation email once the refund is processed",
    ifNoRefundTitle: "If You Don't Receive Your Refund",
    ifNoRefundMessage: "If you do not receive your refund within 15 business days, please contact our support team immediately. Our customer service representatives will ensure you receive a full refund processed directly by our company.",
    trustMessage: "We value your trust and are committed to resolving this matter promptly. Thank you for your patience and understanding.",
    trackRefundStatus: "Track Refund Status",
    backToHome: "Back to Home",
    contactSupport: "Contact Support",
  },
  
  // Dhivehi (Maldives) - dv
  dv: {
    orderCancelledTitle: "Your Order is Cancelled",
    orderCancelledSubtitle: "We apologize for the inconvenience. Your order has been cancelled due to technical issues.",
    importantNotice: "Important Notice",
    dearCustomer: "Dear Customer",
    cancelledMessage1: "We sincerely apologize for any inconvenience caused. Your recent order has been cancelled due to a technical issue in our payment processing system. This was not intended and we understand your frustration.",
    cancelledMessage2: "",
    refundProcessTitle: "Refund Process Information",
    refundPoint1: "We will immediately submit a payment appeal to your bank within the next few days",
    refundPoint2: "According to bank policy, your refund will be processed within 2 to 15 business days",
    refundPoint3: "The refund will be credited to the same bank account or payment method you used for the purchase",
    refundPoint4: "You will receive a confirmation email once the refund is processed",
    ifNoRefundTitle: "If You Don't Receive Your Refund",
    ifNoRefundMessage: "If you do not receive your refund within 15 business days, please contact our support team immediately. Our customer service representatives will ensure you receive a full refund processed directly by our company.",
    trustMessage: "We value your trust and are committed to resolving this matter promptly. Thank you for your patience and understanding.",
    trackRefundStatus: "Track Refund Status",
    backToHome: "Back to Home",
    contactSupport: "Contact Support",
  },
};

// Helper function to get translation based on country code
export function getPageTranslation(countryCode: string | null): PageTranslation {
  if (!countryCode) return PAGE_TRANSLATIONS.en;
  
  const langCode = COUNTRY_TO_LANGUAGE[countryCode.toUpperCase()] || 'en';
  return PAGE_TRANSLATIONS[langCode] || PAGE_TRANSLATIONS.en;
}

// Helper function to get translation based on currency code
export function getPageTranslationByCurrency(currencyCode: string | null): PageTranslation {
  if (!currencyCode) return PAGE_TRANSLATIONS.en;
  
  const countryCode = CURRENCY_TO_COUNTRY[currencyCode.toUpperCase()] || 'US';
  return getPageTranslation(countryCode);
}

// Helper function to check if language is RTL
export function isRTLLanguage(countryCode: string | null): boolean {
  if (!countryCode) return false;
  
  const langCode = COUNTRY_TO_LANGUAGE[countryCode.toUpperCase()] || 'en';
  return RTL_LANGUAGES.includes(langCode);
}

// Helper function to check RTL by currency
export function isRTLByCurrency(currencyCode: string | null): boolean {
  if (!currencyCode) return false;
  
  const countryCode = CURRENCY_TO_COUNTRY[currencyCode.toUpperCase()] || 'US';
  return isRTLLanguage(countryCode);
}

// Get country code from currency for header sync
export function getCountryCodeFromCurrency(currencyCode: string | null): string | null {
  if (!currencyCode) return null;
  return CURRENCY_TO_COUNTRY[currencyCode.toUpperCase()] || null;
}

// Get language name for display
export function getLanguageName(countryCode: string | null): { code: string; name: string; flag: string } {
  const langNames: Record<string, { name: string; flag: string }> = {
    en: { name: 'English', flag: '🇺🇸' },
    ur: { name: 'اردو', flag: '🇵🇰' },
    ps: { name: 'پښتو', flag: '🇦🇫' },
    hi: { name: 'हिंदी', flag: '🇮🇳' },
    bn: { name: 'বাংলা', flag: '🇧🇩' },
    ne: { name: 'नेपाली', flag: '🇳🇵' },
    si: { name: 'සිංහල', flag: '🇱🇰' },
    ru: { name: 'Русский', flag: '🇷🇺' },
    ar: { name: 'العربية', flag: '🇸🇦' },
    es: { name: 'Español', flag: '🇪🇸' },
    fr: { name: 'Français', flag: '🇫🇷' },
    de: { name: 'Deutsch', flag: '🇩🇪' },
    pt: { name: 'Português', flag: '🇧🇷' },
    tr: { name: 'Türkçe', flag: '🇹🇷' },
    id: { name: 'Bahasa Indonesia', flag: '🇮🇩' },
    ms: { name: 'Bahasa Melayu', flag: '🇲🇾' },
    th: { name: 'ไทย', flag: '🇹🇭' },
    vi: { name: 'Tiếng Việt', flag: '🇻🇳' },
    ja: { name: '日本語', flag: '🇯🇵' },
    ko: { name: '한국어', flag: '🇰🇷' },
    zh: { name: '中文', flag: '🇨🇳' },
    fa: { name: 'فارسی', flag: '🇮🇷' },
    he: { name: 'עברית', flag: '🇮🇱' },
    kk: { name: 'Қазақша', flag: '🇰🇿' },
    uz: { name: "O'zbekcha", flag: '🇺🇿' },
    az: { name: 'Azərbaycanca', flag: '🇦🇿' },
    ka: { name: 'ქართული', flag: '🇬🇪' },
    hy: { name: 'Հayeren', flag: '🇦🇲' },
    uk: { name: 'Українська', flag: '🇺🇦' },
    pl: { name: 'Polski', flag: '🇵🇱' },
    it: { name: 'Italiano', flag: '🇮🇹' },
    nl: { name: 'Nederlands', flag: '🇳🇱' },
    sv: { name: 'Svenska', flag: '🇸🇪' },
    no: { name: 'Norsk', flag: '🇳🇴' },
    da: { name: 'Dansk', flag: '🇩🇰' },
    fi: { name: 'Suomi', flag: '🇫🇮' },
    el: { name: 'Ελληνικά', flag: '🇬🇷' },
    cs: { name: 'Čeština', flag: '🇨🇿' },
    hu: { name: 'Magyar', flag: '🇭🇺' },
    ro: { name: 'Română', flag: '🇷🇴' },
    bg: { name: 'Български', flag: '🇧🇬' },
    sw: { name: 'Kiswahili', flag: '🇹🇿' },
    am: { name: 'አማርኛ', flag: '🇪🇹' },
    tl: { name: 'Filipino', flag: '🇵🇭' },
    af: { name: 'Afrikaans', flag: '🇿🇦' },
    mn: { name: 'Монгол', flag: '🇲🇳' },
    km: { name: 'ខ្មែរ', flag: '🇰🇭' },
    lo: { name: 'ລາວ', flag: '🇱🇦' },
    my: { name: 'မြန်မာ', flag: '🇲🇲' },
  };
  
  const langCode = countryCode ? (COUNTRY_TO_LANGUAGE[countryCode.toUpperCase()] || 'en') : 'en';
  const info = langNames[langCode] || langNames.en;
  
  return { code: langCode, ...info };
}
