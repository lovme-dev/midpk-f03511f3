/**
 * Country-specific SEO configurations for PUBG Mobile UC pages
 * Each country has unique title, description, and keywords
 */

export interface CountrySeoData {
  code: string;
  name: string;
  title: string;
  description: string;
  keywords: string;
}

export const COUNTRY_SEO_DATA: CountrySeoData[] = [
  // Asia Pacific
  {
    code: 'PK',
    name: 'Pakistan',
    title: 'PUBG Mobile UC Pakistan | 60% discount & VIP 30% extra UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in Pakistan at lowest prices. Instant delivery, secure payment in PKR. Get 60% discount + VIP 30% bonus UC. Trusted by 1M+ Pakistani gamers.',
    keywords: 'pubg uc pakistan, pubg mobile uc price pakistan, buy uc pakistan, pubg uc store pakistan, cheap pubg uc pakistan, pubg uc pkr'
  },
  {
    code: 'IN',
    name: 'India',
    title: 'PUBG Mobile UC India | 60% OFF & VIP 30% Bonus UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in India at best rates. Instant delivery, secure INR payments. Get 60% discount + VIP 30% extra UC. #1 trusted UC store for Indian gamers.',
    keywords: 'pubg uc india, pubg mobile uc price india, buy uc india, pubg uc store india, cheap pubg uc india, pubg uc inr'
  },
  {
    code: 'BD',
    name: 'Bangladesh',
    title: 'PUBG Mobile UC Bangladesh | 60% Discount & 30% Bonus UC | Midasbuy',
    description: 'Purchase PUBG Mobile UC in Bangladesh with instant delivery. Secure BDT payment, 60% discount + VIP 30% extra UC. Trusted by Bangladeshi PUBG players.',
    keywords: 'pubg uc bangladesh, pubg mobile uc bd, buy uc bangladesh, pubg uc price bangladesh, pubg uc bdt'
  },
  {
    code: 'ID',
    name: 'Indonesia',
    title: 'PUBG Mobile UC Indonesia | Diskon 60% & Bonus VIP 30% UC | Midasbuy',
    description: 'Beli PUBG Mobile UC di Indonesia dengan harga terbaik. Pengiriman instan, pembayaran IDR aman. Diskon 60% + bonus VIP 30% UC. Dipercaya jutaan gamer Indonesia.',
    keywords: 'pubg uc indonesia, harga uc pubg mobile indonesia, beli uc pubg indonesia, top up uc pubg indonesia, pubg uc murah indonesia'
  },
  {
    code: 'MY',
    name: 'Malaysia',
    title: 'PUBG Mobile UC Malaysia | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in Malaysia at lowest prices. Instant delivery, secure MYR payment. Get 60% discount + VIP 30% bonus UC. Malaysia\'s #1 PUBG UC store.',
    keywords: 'pubg uc malaysia, pubg mobile uc price malaysia, buy uc malaysia, pubg uc store malaysia, pubg uc myr'
  },
  {
    code: 'PH',
    name: 'Philippines',
    title: 'PUBG Mobile UC Philippines | 60% OFF & VIP 30% Bonus UC | Midasbuy',
    description: 'Purchase PUBG Mobile UC in Philippines with instant delivery. Secure PHP payment, 60% discount + VIP 30% extra UC. Trusted by Filipino PUBG gamers.',
    keywords: 'pubg uc philippines, pubg mobile uc price philippines, buy uc philippines, pubg uc ph, pubg uc php'
  },
  {
    code: 'TH',
    name: 'Thailand',
    title: 'PUBG Mobile UC Thailand | ลด 60% & โบนัส VIP 30% UC | Midasbuy',
    description: 'ซื้อ PUBG Mobile UC ในประเทศไทยด้วยราคาที่ดีที่สุด จัดส่งทันที ชำระเงิน THB ปลอดภัย ส่วนลด 60% + โบนัส VIP 30% UC ร้านขาย UC PUBG อันดับ 1 ในไทย',
    keywords: 'pubg uc thailand, ราคา uc pubg mobile thailand, ซื้อ uc pubg thailand, pubg uc thb'
  },
  {
    code: 'VN',
    name: 'Vietnam',
    title: 'PUBG Mobile UC Vietnam | Giảm 60% & Thưởng VIP 30% UC | Midasbuy',
    description: 'Mua PUBG Mobile UC tại Việt Nam với giá tốt nhất. Giao hàng tức thì, thanh toán VND an toàn. Giảm 60% + thưởng VIP 30% UC. Cửa hàng UC PUBG số 1 Việt Nam.',
    keywords: 'pubg uc vietnam, giá uc pubg mobile vietnam, mua uc pubg vietnam, pubg uc vnd'
  },
  {
    code: 'SG',
    name: 'Singapore',
    title: 'PUBG Mobile UC Singapore | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in Singapore at best prices. Instant delivery, secure SGD payment. Get 60% discount + VIP 30% bonus UC. Singapore\'s trusted PUBG UC store.',
    keywords: 'pubg uc singapore, pubg mobile uc price singapore, buy uc singapore, pubg uc sg, pubg uc sgd'
  },
  {
    code: 'JP',
    name: 'Japan',
    title: 'PUBG Mobile UC Japan | 60%割引 & VIP 30%ボーナスUC | Midasbuy',
    description: '日本で最安値のPUBG Mobile UCを購入。即時配信、安全なJPY決済。60%割引 + VIP 30%ボーナスUC。日本のゲーマーに信頼されているUCストア。',
    keywords: 'pubg uc japan, pubg mobile uc 価格 japan, uc 購入 japan, pubg uc jpy'
  },
  {
    code: 'KR',
    name: 'South Korea',
    title: 'PUBG Mobile UC South Korea | 60% 할인 & VIP 30% 보너스 UC | Midasbuy',
    description: '한국에서 최저가 PUBG Mobile UC 구매. 즉시 배송, 안전한 KRW 결제. 60% 할인 + VIP 30% 보너스 UC. 한국 게이머들이 신뢰하는 UC 스토어.',
    keywords: 'pubg uc korea, pubg mobile uc 가격 korea, uc 구매 korea, pubg uc krw'
  },
  {
    code: 'CN',
    name: 'China',
    title: 'PUBG Mobile UC China | 60%折扣 & VIP 30%额外UC | Midasbuy',
    description: '在中国以最优惠的价格购买PUBG Mobile UC。即时交付，安全的CNY支付。60%折扣 + VIP 30%额外UC。中国玩家信赖的UC商店。',
    keywords: 'pubg uc china, pubg mobile uc 价格 china, 购买 uc china, pubg uc cny'
  },
  {
    code: 'AU',
    name: 'Australia',
    title: 'PUBG Mobile UC Australia | 60% Discount & VIP 30% Bonus UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in Australia at lowest prices. Instant delivery, secure AUD payment. Get 60% discount + VIP 30% extra UC. Australia\'s #1 PUBG UC store.',
    keywords: 'pubg uc australia, pubg mobile uc price australia, buy uc australia, pubg uc aud'
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    title: 'PUBG Mobile UC New Zealand | 60% OFF & VIP 30% Extra UC | Midasbuy',
    description: 'Purchase PUBG Mobile UC in New Zealand with instant delivery. Secure NZD payment, 60% discount + VIP 30% bonus UC. Trusted by Kiwi PUBG players.',
    keywords: 'pubg uc new zealand, pubg mobile uc price nz, buy uc new zealand, pubg uc nzd'
  },

  // North America
  {
    code: 'US',
    name: 'United States',
    title: 'PUBG Mobile UC United States (USA) | 60% discount & VIP 30% extra UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in USA at best prices. Instant delivery, secure USD payment. Get 60% discount + VIP 30% bonus UC. America\'s #1 trusted PUBG UC store.',
    keywords: 'pubg uc usa, pubg mobile uc price usa, buy uc united states, pubg uc store usa, cheap pubg uc america'
  },
  {
    code: 'CA',
    name: 'Canada',
    title: 'PUBG Mobile UC Canada | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Purchase PUBG Mobile UC in Canada with instant delivery. Secure CAD payment, 60% discount + VIP 30% bonus UC. Canada\'s trusted PUBG UC store.',
    keywords: 'pubg uc canada, pubg mobile uc price canada, buy uc canada, pubg uc cad'
  },
  {
    code: 'MX',
    name: 'Mexico',
    title: 'PUBG Mobile UC México | 60% Descuento & VIP 30% UC Extra | Midasbuy',
    description: 'Compra PUBG Mobile UC en México a los mejores precios. Entrega instantánea, pago seguro en MXN. 60% descuento + VIP 30% UC extra. Tienda UC más confiable de México.',
    keywords: 'pubg uc mexico, precio uc pubg mobile mexico, comprar uc mexico, pubg uc mxn'
  },

  // Europe
  {
    code: 'GB',
    name: 'United Kingdom',
    title: 'PUBG Mobile UC United Kingdom (UK) | 60% OFF & VIP 30% Bonus UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in UK at lowest prices. Instant delivery, secure GBP payment. Get 60% discount + VIP 30% extra UC. UK\'s #1 PUBG UC store.',
    keywords: 'pubg uc uk, pubg mobile uc price uk, buy uc united kingdom, pubg uc gbp'
  },
  {
    code: 'DE',
    name: 'Germany',
    title: 'PUBG Mobile UC Deutschland | 60% Rabatt & VIP 30% Extra UC | Midasbuy',
    description: 'PUBG Mobile UC in Deutschland zu besten Preisen kaufen. Sofortige Lieferung, sichere EUR-Zahlung. 60% Rabatt + VIP 30% Bonus UC. Deutschlands vertrauenswürdigster UC-Store.',
    keywords: 'pubg uc deutschland, pubg mobile uc preis deutschland, uc kaufen deutschland, pubg uc eur'
  },
  {
    code: 'FR',
    name: 'France',
    title: 'PUBG Mobile UC France | 60% Réduction & VIP 30% UC Bonus | Midasbuy',
    description: 'Acheter PUBG Mobile UC en France aux meilleurs prix. Livraison instantanée, paiement EUR sécurisé. 60% réduction + VIP 30% UC bonus. Magasin UC PUBG le plus fiable de France.',
    keywords: 'pubg uc france, prix uc pubg mobile france, acheter uc france, pubg uc eur'
  },
  {
    code: 'ES',
    name: 'Spain',
    title: 'PUBG Mobile UC España | 60% Descuento & VIP 30% UC Extra | Midasbuy',
    description: 'Comprar PUBG Mobile UC en España a mejores precios. Entrega instantánea, pago EUR seguro. 60% descuento + VIP 30% UC extra. Tienda UC PUBG más confiable de España.',
    keywords: 'pubg uc españa, precio uc pubg mobile españa, comprar uc españa, pubg uc eur'
  },
  {
    code: 'IT',
    name: 'Italy',
    title: 'PUBG Mobile UC Italia | 60% Sconto & VIP 30% UC Extra | Midasbuy',
    description: 'Acquista PUBG Mobile UC in Italia ai migliori prezzi. Consegna istantanea, pagamento EUR sicuro. 60% sconto + VIP 30% UC extra. Negozio UC PUBG più affidabile d\'Italia.',
    keywords: 'pubg uc italia, prezzo uc pubg mobile italia, comprare uc italia, pubg uc eur'
  },
  {
    code: 'NL',
    name: 'Netherlands',
    title: 'PUBG Mobile UC Nederland | 60% Korting & VIP 30% Extra UC | Midasbuy',
    description: 'Koop PUBG Mobile UC in Nederland tegen beste prijzen. Directe levering, veilige EUR betaling. 60% korting + VIP 30% bonus UC. Meest vertrouwde UC winkel van Nederland.',
    keywords: 'pubg uc nederland, pubg mobile uc prijs nederland, uc kopen nederland, pubg uc eur'
  },
  {
    code: 'PL',
    name: 'Poland',
    title: 'PUBG Mobile UC Polska | 60% Zniżki & VIP 30% Dodatkowych UC | Midasbuy',
    description: 'Kup PUBG Mobile UC w Polsce w najlepszych cenach. Natychmiastowa dostawa, bezpieczna płatność PLN. 60% zniżki + VIP 30% dodatkowych UC. Najbardziej zaufany sklep UC w Polsce.',
    keywords: 'pubg uc polska, cena uc pubg mobile polska, kupić uc polska, pubg uc pln'
  },
  {
    code: 'RU',
    name: 'Russia',
    title: 'PUBG Mobile UC Россия | 60% Скидка & VIP 30% Бонус UC | Midasbuy',
    description: 'Купить PUBG Mobile UC в России по лучшим ценам. Мгновенная доставка, безопасная оплата RUB. 60% скидка + VIP 30% бонус UC. Самый надежный магазин UC в России.',
    keywords: 'pubg uc россия, цена uc pubg mobile россия, купить uc россия, pubg uc rub'
  },
  {
    code: 'TR',
    name: 'Turkey',
    title: 'PUBG Mobile UC Türkiye | %60 İndirim & VIP %30 Ekstra UC | Midasbuy',
    description: 'Türkiye\'de en iyi fiyatlarla PUBG Mobile UC satın alın. Anında teslimat, güvenli TRY ödeme. %60 indirim + VIP %30 ekstra UC. Türkiye\'nin en güvenilir UC mağazası.',
    keywords: 'pubg uc türkiye, pubg mobile uc fiyat türkiye, uc satın al türkiye, pubg uc try'
  },
  {
    code: 'SE',
    name: 'Sweden',
    title: 'PUBG Mobile UC Sverige | 60% Rabatt & VIP 30% Extra UC | Midasbuy',
    description: 'Köp PUBG Mobile UC i Sverige till bästa priser. Omedelbar leverans, säker SEK betalning. 60% rabatt + VIP 30% bonus UC. Sveriges mest pålitliga UC-butik.',
    keywords: 'pubg uc sverige, pubg mobile uc pris sverige, köpa uc sverige, pubg uc sek'
  },
  {
    code: 'NO',
    name: 'Norway',
    title: 'PUBG Mobile UC Norge | 60% Rabatt & VIP 30% Ekstra UC | Midasbuy',
    description: 'Kjøp PUBG Mobile UC i Norge til beste priser. Øyeblikkelig levering, sikker NOK betaling. 60% rabatt + VIP 30% bonus UC. Norges mest pålitelige UC-butikk.',
    keywords: 'pubg uc norge, pubg mobile uc pris norge, kjøpe uc norge, pubg uc nok'
  },
  {
    code: 'DK',
    name: 'Denmark',
    title: 'PUBG Mobile UC Danmark | 60% Rabat & VIP 30% Ekstra UC | Midasbuy',
    description: 'Køb PUBG Mobile UC i Danmark til bedste priser. Øjeblikkelig levering, sikker DKK betaling. 60% rabat + VIP 30% bonus UC. Danmarks mest pålidelige UC-butik.',
    keywords: 'pubg uc danmark, pubg mobile uc pris danmark, købe uc danmark, pubg uc dkk'
  },
  {
    code: 'FI',
    name: 'Finland',
    title: 'PUBG Mobile UC Suomi | 60% Alennus & VIP 30% Ylimääräinen UC | Midasbuy',
    description: 'Osta PUBG Mobile UC Suomessa parhaisiin hintoihin. Välitön toimitus, turvallinen EUR maksu. 60% alennus + VIP 30% bonus UC. Suomen luotettavin UC-kauppa.',
    keywords: 'pubg uc suomi, pubg mobile uc hinta suomi, ostaa uc suomi, pubg uc eur'
  },

  // Middle East
  {
    code: 'SA',
    name: 'Saudi Arabia',
    title: 'PUBG Mobile UC Saudi Arabia | خصم 60% وVIP 30% UC إضافية | Midasbuy',
    description: 'اشترِ PUBG Mobile UC في المملكة العربية السعودية بأفضل الأسعار. تسليم فوري، دفع آمن بالريال السعودي. خصم 60% + VIP 30% UC إضافية. متجر UC الأكثر موثوقية في السعودية.',
    keywords: 'pubg uc saudi arabia, سعر uc pubg السعودية, شراء uc السعودية, pubg uc sar'
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    title: 'PUBG Mobile UC UAE | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in UAE at best prices. Instant delivery, secure AED payment. Get 60% discount + VIP 30% bonus UC. UAE\'s most trusted PUBG UC store.',
    keywords: 'pubg uc uae, pubg mobile uc price uae, buy uc dubai, pubg uc aed'
  },
  {
    code: 'EG',
    name: 'Egypt',
    title: 'PUBG Mobile UC Egypt | خصم 60% وVIP 30% UC إضافية | Midasbuy',
    description: 'اشترِ PUBG Mobile UC في مصر بأفضل الأسعار. تسليم فوري، دفع آمن بالجنيه المصري. خصم 60% + VIP 30% UC إضافية. متجر UC الأكثر موثوقية في مصر.',
    keywords: 'pubg uc egypt, سعر uc pubg مصر, شراء uc مصر, pubg uc egp'
  },
  {
    code: 'IQ',
    name: 'Iraq',
    title: 'PUBG Mobile UC Iraq | خصم 60% وVIP 30% UC إضافية | Midasbuy',
    description: 'اشترِ PUBG Mobile UC في العراق بأفضل الأسعار. تسليم فوري، دفع آمن بالدينار العراقي. خصم 60% + VIP 30% UC إضافية. متجر UC الأكثر موثوقية في العراق.',
    keywords: 'pubg uc iraq, سعر uc pubg العراق, شراء uc العراق, pubg uc iqd'
  },

  // Latin America
  {
    code: 'BR',
    name: 'Brazil',
    title: 'PUBG Mobile UC Brasil | 60% Desconto & VIP 30% UC Extra | Midasbuy',
    description: 'Compre PUBG Mobile UC no Brasil pelos melhores preços. Entrega instantânea, pagamento BRL seguro. 60% desconto + VIP 30% UC extra. Loja de UC mais confiável do Brasil.',
    keywords: 'pubg uc brasil, preço uc pubg mobile brasil, comprar uc brasil, pubg uc brl'
  },
  {
    code: 'AR',
    name: 'Argentina',
    title: 'PUBG Mobile UC Argentina | 60% Descuento & VIP 30% UC Extra | Midasbuy',
    description: 'Comprar PUBG Mobile UC en Argentina a mejores precios. Entrega instantánea, pago ARS seguro. 60% descuento + VIP 30% UC extra. Tienda UC más confiable de Argentina.',
    keywords: 'pubg uc argentina, precio uc pubg mobile argentina, comprar uc argentina, pubg uc ars'
  },
  {
    code: 'CL',
    name: 'Chile',
    title: 'PUBG Mobile UC Chile | 60% Descuento & VIP 30% UC Extra | Midasbuy',
    description: 'Comprar PUBG Mobile UC en Chile a mejores precios. Entrega instantánea, pago CLP seguro. 60% descuento + VIP 30% UC extra. Tienda UC más confiable de Chile.',
    keywords: 'pubg uc chile, precio uc pubg mobile chile, comprar uc chile, pubg uc clp'
  },
  {
    code: 'CO',
    name: 'Colombia',
    title: 'PUBG Mobile UC Colombia | 60% Descuento & VIP 30% UC Extra | Midasbuy',
    description: 'Comprar PUBG Mobile UC en Colombia a mejores precios. Entrega instantánea, pago COP seguro. 60% descuento + VIP 30% UC extra. Tienda UC más confiable de Colombia.',
    keywords: 'pubg uc colombia, precio uc pubg mobile colombia, comprar uc colombia, pubg uc cop'
  },
  {
    code: 'PE',
    name: 'Peru',
    title: 'PUBG Mobile UC Perú | 60% Descuento & VIP 30% UC Extra | Midasbuy',
    description: 'Comprar PUBG Mobile UC en Perú a mejores precios. Entrega instantánea, pago PEN seguro. 60% descuento + VIP 30% UC extra. Tienda UC más confiable de Perú.',
    keywords: 'pubg uc peru, precio uc pubg mobile peru, comprar uc peru, pubg uc pen'
  },

  // Africa
  {
    code: 'ZA',
    name: 'South Africa',
    title: 'PUBG Mobile UC South Africa | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in South Africa at best prices. Instant delivery, secure ZAR payment. Get 60% discount + VIP 30% bonus UC. South Africa\'s trusted PUBG UC store.',
    keywords: 'pubg uc south africa, pubg mobile uc price south africa, buy uc south africa, pubg uc zar'
  },
  {
    code: 'NG',
    name: 'Nigeria',
    title: 'PUBG Mobile UC Nigeria | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in Nigeria at lowest prices. Instant delivery, secure NGN payment. Get 60% discount + VIP 30% bonus UC. Nigeria\'s #1 PUBG UC store.',
    keywords: 'pubg uc nigeria, pubg mobile uc price nigeria, buy uc nigeria, pubg uc ngn'
  },
  {
    code: 'KE',
    name: 'Kenya',
    title: 'PUBG Mobile UC Kenya | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Purchase PUBG Mobile UC in Kenya with instant delivery. Secure KES payment, 60% discount + VIP 30% bonus UC. Trusted by Kenyan PUBG players.',
    keywords: 'pubg uc kenya, pubg mobile uc price kenya, buy uc kenya, pubg uc kes'
  },

  // Additional major countries
  {
    code: 'LK',
    name: 'Sri Lanka',
    title: 'PUBG Mobile UC Sri Lanka | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in Sri Lanka at best prices. Instant delivery, secure LKR payment. Get 60% discount + VIP 30% bonus UC. Sri Lanka\'s trusted PUBG UC store.',
    keywords: 'pubg uc sri lanka, pubg mobile uc price sri lanka, buy uc sri lanka, pubg uc lkr'
  },
  {
    code: 'NP',
    name: 'Nepal',
    title: 'PUBG Mobile UC Nepal | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Purchase PUBG Mobile UC in Nepal with instant delivery. Secure NPR payment, 60% discount + VIP 30% bonus UC. Trusted by Nepali PUBG players.',
    keywords: 'pubg uc nepal, pubg mobile uc price nepal, buy uc nepal, pubg uc npr'
  },
  {
    code: 'MM',
    name: 'Myanmar',
    title: 'PUBG Mobile UC Myanmar | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in Myanmar at lowest prices. Instant delivery, secure MMK payment. Get 60% discount + VIP 30% bonus UC. Myanmar\'s trusted PUBG UC store.',
    keywords: 'pubg uc myanmar, pubg mobile uc price myanmar, buy uc myanmar, pubg uc mmk'
  },
  {
    code: 'KH',
    name: 'Cambodia',
    title: 'PUBG Mobile UC Cambodia | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Purchase PUBG Mobile UC in Cambodia with instant delivery. Secure KHR payment, 60% discount + VIP 30% bonus UC. Trusted by Cambodian PUBG players.',
    keywords: 'pubg uc cambodia, pubg mobile uc price cambodia, buy uc cambodia, pubg uc khr'
  },
  {
    code: 'LA',
    name: 'Laos',
    title: 'PUBG Mobile UC Laos | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in Laos at best prices. Instant delivery, secure LAK payment. Get 60% discount + VIP 30% bonus UC. Laos\' trusted PUBG UC store.',
    keywords: 'pubg uc laos, pubg mobile uc price laos, buy uc laos, pubg uc lak'
  },
  {
    code: 'BN',
    name: 'Brunei',
    title: 'PUBG Mobile UC Brunei | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Purchase PUBG Mobile UC in Brunei with instant delivery. Secure BND payment, 60% discount + VIP 30% bonus UC. Trusted by Bruneian PUBG players.',
    keywords: 'pubg uc brunei, pubg mobile uc price brunei, buy uc brunei, pubg uc bnd'
  },

  // Rest of Europe
  {
    code: 'AT',
    name: 'Austria',
    title: 'PUBG Mobile UC Österreich | 60% Rabatt & VIP 30% Extra UC | Midasbuy',
    description: 'PUBG Mobile UC in Österreich zu besten Preisen kaufen. Sofortige Lieferung, sichere EUR-Zahlung. 60% Rabatt + VIP 30% Bonus UC.',
    keywords: 'pubg uc österreich, pubg mobile uc preis österreich, uc kaufen österreich, pubg uc eur'
  },
  {
    code: 'BE',
    name: 'Belgium',
    title: 'PUBG Mobile UC België | 60% Korting & VIP 30% Extra UC | Midasbuy',
    description: 'Koop PUBG Mobile UC in België tegen beste prijzen. Directe levering, veilige EUR betaling. 60% korting + VIP 30% bonus UC.',
    keywords: 'pubg uc belgië, pubg mobile uc prijs belgië, uc kopen belgië, pubg uc eur'
  },
  {
    code: 'CH',
    name: 'Switzerland',
    title: 'PUBG Mobile UC Schweiz | 60% Rabatt & VIP 30% Extra UC | Midasbuy',
    description: 'PUBG Mobile UC in der Schweiz zu besten Preisen kaufen. Sofortige Lieferung, sichere CHF-Zahlung. 60% Rabatt + VIP 30% Bonus UC.',
    keywords: 'pubg uc schweiz, pubg mobile uc preis schweiz, uc kaufen schweiz, pubg uc chf'
  },
  {
    code: 'CZ',
    name: 'Czech Republic',
    title: 'PUBG Mobile UC Česká republika | 60% Sleva & VIP 30% Extra UC | Midasbuy',
    description: 'Koupit PUBG Mobile UC v České republice za nejlepší ceny. Okamžité doručení, bezpečná CZK platba. 60% sleva + VIP 30% bonus UC.',
    keywords: 'pubg uc česko, pubg mobile uc cena česko, koupit uc česko, pubg uc czk'
  },
  {
    code: 'PT',
    name: 'Portugal',
    title: 'PUBG Mobile UC Portugal | 60% Desconto & VIP 30% UC Extra | Midasbuy',
    description: 'Comprar PUBG Mobile UC em Portugal aos melhores preços. Entrega instantânea, pagamento EUR seguro. 60% desconto + VIP 30% UC extra.',
    keywords: 'pubg uc portugal, preço uc pubg mobile portugal, comprar uc portugal, pubg uc eur'
  },
  {
    code: 'GR',
    name: 'Greece',
    title: 'PUBG Mobile UC Ελλάδα | 60% Έκπτωση & VIP 30% Extra UC | Midasbuy',
    description: 'Αγοράστε PUBG Mobile UC στην Ελλάδα στις καλύτερες τιμές. Άμεση παράδοση, ασφαλής πληρωμή EUR. 60% έκπτωση + VIP 30% bonus UC.',
    keywords: 'pubg uc ελλάδα, τιμή uc pubg mobile ελλάδα, αγορά uc ελλάδα, pubg uc eur'
  },
  {
    code: 'HU',
    name: 'Hungary',
    title: 'PUBG Mobile UC Magyarország | 60% Kedvezmény & VIP 30% Extra UC | Midasbuy',
    description: 'Vásároljon PUBG Mobile UC-t Magyarországon a legjobb árakon. Azonnali szállítás, biztonságos HUF fizetés. 60% kedvezmény + VIP 30% bónusz UC.',
    keywords: 'pubg uc magyarország, pubg mobile uc ár magyarország, uc vásárlás magyarország, pubg uc huf'
  },
  {
    code: 'RO',
    name: 'Romania',
    title: 'PUBG Mobile UC România | 60% Reducere & VIP 30% UC Extra | Midasbuy',
    description: 'Cumpără PUBG Mobile UC în România la cele mai bune prețuri. Livrare instantanee, plată RON securizată. 60% reducere + VIP 30% UC extra.',
    keywords: 'pubg uc romania, preț uc pubg mobile romania, cumpără uc romania, pubg uc ron'
  },
  {
    code: 'BG',
    name: 'Bulgaria',
    title: 'PUBG Mobile UC България | 60% Отстъпка & VIP 30% Допълнителни UC | Midasbuy',
    description: 'Купете PUBG Mobile UC в България на най-добри цени. Незабавна доставка, сигурно BGN плащане. 60% отстъпка + VIP 30% бонус UC.',
    keywords: 'pubg uc българия, цена uc pubg mobile българия, купи uc българия, pubg uc bgn'
  },
  {
    code: 'HR',
    name: 'Croatia',
    title: 'PUBG Mobile UC Hrvatska | 60% Popust & VIP 30% Dodatnih UC | Midasbuy',
    description: 'Kupite PUBG Mobile UC u Hrvatskoj po najboljim cijenama. Trenutna dostava, sigurna HRK uplata. 60% popust + VIP 30% bonus UC.',
    keywords: 'pubg uc hrvatska, cijena uc pubg mobile hrvatska, kupiti uc hrvatska, pubg uc hrk'
  },
  {
    code: 'UA',
    name: 'Ukraine',
    title: 'PUBG Mobile UC Україна | 60% Знижка & VIP 30% Додаткових UC | Midasbuy',
    description: 'Купуйте PUBG Mobile UC в Україні за найкращими цінами. Миттєва доставка, безпечна UAH оплата. 60% знижка + VIP 30% бонус UC.',
    keywords: 'pubg uc україна, ціна uc pubg mobile україна, купити uc україна, pubg uc uah'
  },

  // Rest of Middle East
  {
    code: 'JO',
    name: 'Jordan',
    title: 'PUBG Mobile UC Jordan | خصم 60% وVIP 30% UC إضافية | Midasbuy',
    description: 'اشترِ PUBG Mobile UC في الأردن بأفضل الأسعار. تسليم فوري، دفع آمن بالدينار الأردني. خصم 60% + VIP 30% UC إضافية.',
    keywords: 'pubg uc jordan, سعر uc pubg الأردن, شراء uc الأردن, pubg uc jod'
  },
  {
    code: 'KW',
    name: 'Kuwait',
    title: 'PUBG Mobile UC Kuwait | خصم 60% وVIP 30% UC إضافية | Midasbuy',
    description: 'اشترِ PUBG Mobile UC في الكويت بأفضل الأسعار. تسليم فوري، دفع آمن بالدينار الكويتي. خصم 60% + VIP 30% UC إضافية.',
    keywords: 'pubg uc kuwait, سعر uc pubg الكويت, شراء uc الكويت, pubg uc kwd'
  },
  {
    code: 'OM',
    name: 'Oman',
    title: 'PUBG Mobile UC Oman | خصم 60% وVIP 30% UC إضافية | Midasbuy',
    description: 'اشترِ PUBG Mobile UC في عُمان بأفضل الأسعار. تسليم فوري، دفع آمن بالريال العُماني. خصم 60% + VIP 30% UC إضافية.',
    keywords: 'pubg uc oman, سعر uc pubg عمان, شراء uc عمان, pubg uc omr'
  },
  {
    code: 'QA',
    name: 'Qatar',
    title: 'PUBG Mobile UC Qatar | خصم 60% وVIP 30% UC إضافية | Midasbuy',
    description: 'اشترِ PUBG Mobile UC في قطر بأفضل الأسعار. تسليم فوري، دفع آمن بالريال القطري. خصم 60% + VIP 30% UC إضافية.',
    keywords: 'pubg uc qatar, سعر uc pubg قطر, شراء uc قطر, pubg uc qar'
  },
  {
    code: 'BH',
    name: 'Bahrain',
    title: 'PUBG Mobile UC Bahrain | خصم 60% وVIP 30% UC إضافية | Midasbuy',
    description: 'اشترِ PUBG Mobile UC في البحرين بأفضل الأسعار. تسليم فوري، دفع آمن بالدينار البحريني. خصم 60% + VIP 30% UC إضافية.',
    keywords: 'pubg uc bahrain, سعر uc pubg البحرين, شراء uc البحرين, pubg uc bhd'
  },
  {
    code: 'LB',
    name: 'Lebanon',
    title: 'PUBG Mobile UC Lebanon | خصم 60% وVIP 30% UC إضافية | Midasbuy',
    description: 'اشترِ PUBG Mobile UC في لبنان بأفضل الأسعار. تسليم فوري، دفع آمن بالليرة اللبنانية. خصم 60% + VIP 30% UC إضافية.',
    keywords: 'pubg uc lebanon, سعر uc pubg لبنان, شراء uc لبنان, pubg uc lbp'
  },

  // More Asian countries
  {
    code: 'AF',
    name: 'Afghanistan',
    title: 'PUBG Mobile UC Afghanistan | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in Afghanistan at best prices. Instant delivery, secure AFN payment. Get 60% discount + VIP 30% bonus UC.',
    keywords: 'pubg uc afghanistan, pubg mobile uc price afghanistan, buy uc afghanistan, pubg uc afn'
  },
  {
    code: 'MV',
    name: 'Maldives',
    title: 'PUBG Mobile UC Maldives | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Purchase PUBG Mobile UC in Maldives with instant delivery. Secure MVR payment, 60% discount + VIP 30% bonus UC.',
    keywords: 'pubg uc maldives, pubg mobile uc price maldives, buy uc maldives, pubg uc mvr'
  },
  {
    code: 'BT',
    name: 'Bhutan',
    title: 'PUBG Mobile UC Bhutan | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in Bhutan at lowest prices. Instant delivery, secure BTN payment. Get 60% discount + VIP 30% bonus UC.',
    keywords: 'pubg uc bhutan, pubg mobile uc price bhutan, buy uc bhutan, pubg uc btn'
  },
  {
    code: 'MN',
    name: 'Mongolia',
    title: 'PUBG Mobile UC Mongolia | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Purchase PUBG Mobile UC in Mongolia with instant delivery. Secure MNT payment, 60% discount + VIP 30% bonus UC.',
    keywords: 'pubg uc mongolia, pubg mobile uc price mongolia, buy uc mongolia, pubg uc mnt'
  },
  {
    code: 'TW',
    name: 'Taiwan',
    title: 'PUBG Mobile UC Taiwan | 60%折扣 & VIP 30%額外UC | Midasbuy',
    description: '在台灣以最優惠的價格購買PUBG Mobile UC。即時交付，安全的TWD支付。60%折扣 + VIP 30%額外UC。',
    keywords: 'pubg uc taiwan, pubg mobile uc 價格 taiwan, 購買 uc taiwan, pubg uc twd'
  },
  {
    code: 'HK',
    name: 'Hong Kong',
    title: 'PUBG Mobile UC Hong Kong | 60%折扣 & VIP 30%額外UC | Midasbuy',
    description: '在香港以最優惠的價格購買PUBG Mobile UC。即時交付，安全的HKD支付。60%折扣 + VIP 30%額外UC。',
    keywords: 'pubg uc hong kong, pubg mobile uc 價格 hong kong, 購買 uc hong kong, pubg uc hkd'
  },
  {
    code: 'MO',
    name: 'Macau',
    title: 'PUBG Mobile UC Macau | 60%折扣 & VIP 30%額外UC | Midasbuy',
    description: '在澳門以最優惠的價格購買PUBG Mobile UC。即時交付，安全的MOP支付。60%折扣 + VIP 30%額外UC。',
    keywords: 'pubg uc macau, pubg mobile uc 價格 macau, 購買 uc macau, pubg uc mop'
  },

  // Rest of Latin America
  {
    code: 'VE',
    name: 'Venezuela',
    title: 'PUBG Mobile UC Venezuela | 60% Descuento & VIP 30% UC Extra | Midasbuy',
    description: 'Comprar PUBG Mobile UC en Venezuela a mejores precios. Entrega instantánea, pago VES seguro. 60% descuento + VIP 30% UC extra.',
    keywords: 'pubg uc venezuela, precio uc pubg mobile venezuela, comprar uc venezuela, pubg uc ves'
  },
  {
    code: 'EC',
    name: 'Ecuador',
    title: 'PUBG Mobile UC Ecuador | 60% Descuento & VIP 30% UC Extra | Midasbuy',
    description: 'Comprar PUBG Mobile UC en Ecuador a mejores precios. Entrega instantánea, pago USD seguro. 60% descuento + VIP 30% UC extra.',
    keywords: 'pubg uc ecuador, precio uc pubg mobile ecuador, comprar uc ecuador, pubg uc usd'
  },
  {
    code: 'BO',
    name: 'Bolivia',
    title: 'PUBG Mobile UC Bolivia | 60% Descuento & VIP 30% UC Extra | Midasbuy',
    description: 'Comprar PUBG Mobile UC en Bolivia a mejores precios. Entrega instantánea, pago BOB seguro. 60% descuento + VIP 30% UC extra.',
    keywords: 'pubg uc bolivia, precio uc pubg mobile bolivia, comprar uc bolivia, pubg uc bob'
  },
  {
    code: 'PY',
    name: 'Paraguay',
    title: 'PUBG Mobile UC Paraguay | 60% Descuento & VIP 30% UC Extra | Midasbuy',
    description: 'Comprar PUBG Mobile UC en Paraguay a mejores precios. Entrega instantánea, pago PYG seguro. 60% descuento + VIP 30% UC extra.',
    keywords: 'pubg uc paraguay, precio uc pubg mobile paraguay, comprar uc paraguay, pubg uc pyg'
  },
  {
    code: 'UY',
    name: 'Uruguay',
    title: 'PUBG Mobile UC Uruguay | 60% Descuento & VIP 30% UC Extra | Midasbuy',
    description: 'Comprar PUBG Mobile UC en Uruguay a mejores precios. Entrega instantánea, pago UYU seguro. 60% descuento + VIP 30% UC extra.',
    keywords: 'pubg uc uruguay, precio uc pubg mobile uruguay, comprar uc uruguay, pubg uc uyu'
  },

  // Caribbean
  {
    code: 'JM',
    name: 'Jamaica',
    title: 'PUBG Mobile UC Jamaica | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in Jamaica at best prices. Instant delivery, secure JMD payment. Get 60% discount + VIP 30% bonus UC.',
    keywords: 'pubg uc jamaica, pubg mobile uc price jamaica, buy uc jamaica, pubg uc jmd'
  },
  {
    code: 'TT',
    name: 'Trinidad and Tobago',
    title: 'PUBG Mobile UC Trinidad and Tobago | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Purchase PUBG Mobile UC in Trinidad and Tobago with instant delivery. Secure TTD payment, 60% discount + VIP 30% bonus UC.',
    keywords: 'pubg uc trinidad, pubg mobile uc price trinidad, buy uc trinidad, pubg uc ttd'
  },

  // More African countries
  {
    code: 'GH',
    name: 'Ghana',
    title: 'PUBG Mobile UC Ghana | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in Ghana at lowest prices. Instant delivery, secure GHS payment. Get 60% discount + VIP 30% bonus UC.',
    keywords: 'pubg uc ghana, pubg mobile uc price ghana, buy uc ghana, pubg uc ghs'
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    title: 'PUBG Mobile UC Tanzania | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Purchase PUBG Mobile UC in Tanzania with instant delivery. Secure TZS payment, 60% discount + VIP 30% bonus UC.',
    keywords: 'pubg uc tanzania, pubg mobile uc price tanzania, buy uc tanzania, pubg uc tzs'
  },
  {
    code: 'UG',
    name: 'Uganda',
    title: 'PUBG Mobile UC Uganda | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Buy PUBG Mobile UC in Uganda at best prices. Instant delivery, secure UGX payment. Get 60% discount + VIP 30% bonus UC.',
    keywords: 'pubg uc uganda, pubg mobile uc price uganda, buy uc uganda, pubg uc ugx'
  },
  {
    code: 'ET',
    name: 'Ethiopia',
    title: 'PUBG Mobile UC Ethiopia | 60% Discount & VIP 30% Extra UC | Midasbuy',
    description: 'Purchase PUBG Mobile UC in Ethiopia with instant delivery. Secure ETB payment, 60% discount + VIP 30% bonus UC.',
    keywords: 'pubg uc ethiopia, pubg mobile uc price ethiopia, buy uc ethiopia, pubg uc etb'
  },
  {
    code: 'MA',
    name: 'Morocco',
    title: 'PUBG Mobile UC Morocco | 60% Réduction & VIP 30% UC Bonus | Midasbuy',
    description: 'Acheter PUBG Mobile UC au Maroc aux meilleurs prix. Livraison instantanée, paiement MAD sécurisé. 60% réduction + VIP 30% UC bonus.',
    keywords: 'pubg uc morocco, prix uc pubg mobile maroc, acheter uc maroc, pubg uc mad'
  },
  {
    code: 'DZ',
    name: 'Algeria',
    title: 'PUBG Mobile UC Algeria | خصم 60% وVIP 30% UC إضافية | Midasbuy',
    description: 'اشترِ PUBG Mobile UC في الجزائر بأفضل الأسعار. تسليم فوري، دفع آمن بالدينار الجزائري. خصم 60% + VIP 30% UC إضافية.',
    keywords: 'pubg uc algeria, سعر uc pubg الجزائر, شراء uc الجزائر, pubg uc dzd'
  },
  {
    code: 'TN',
    name: 'Tunisia',
    title: 'PUBG Mobile UC Tunisia | خصم 60% وVIP 30% UC إضافية | Midasbuy',
    description: 'اشترِ PUBG Mobile UC في تونس بأفضل الأسعار. تسليم فوري، دفع آمن بالدينار التونسي. خصم 60% + VIP 30% UC إضافية.',
    keywords: 'pubg uc tunisia, سعر uc pubg تونس, شراء uc تونس, pubg uc tnd'
  }
];

/**
 * Get SEO data for a specific country
 */
export const getCountrySeoData = (countryCode: string): CountrySeoData | undefined => {
  return COUNTRY_SEO_DATA.find(country => country.code.toUpperCase() === countryCode.toUpperCase());
};

/**
 * Get all supported country codes
 */
export const getSupportedCountryCodes = (): string[] => {
  return COUNTRY_SEO_DATA.map(country => country.code);
};

/**
 * Check if a country code is supported
 */
export const isCountrySupported = (countryCode: string): boolean => {
  return COUNTRY_SEO_DATA.some(country => country.code.toUpperCase() === countryCode.toUpperCase());
};
