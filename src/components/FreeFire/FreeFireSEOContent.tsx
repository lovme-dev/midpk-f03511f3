import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Gamepad2, Globe, User, Diamond, Smartphone, Shield, Clock, CreditCard } from "lucide-react";
import { useState } from "react";

const FreeFireSEOContent = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Can you buy Free Fire Diamonds?",
      answer: "Absolutely! You can buy Free Fire Diamonds on middasbuy.com and enjoy the best price, fastest and safest delivery no matter where you are living in. We offer diamonds for all regions including Pakistan, India, Malaysia, Singapore, Philippines, Americas, Europe and more."
    },
    {
      question: "How to get Free Fire Diamonds?",
      answer: "By choosing middasbuy.com, you can get cheap Free Fire Diamonds and enjoy one of the most affordable prices and the best services. Simply enter your Free Fire UID, select your diamond package, complete payment, and receive diamonds instantly in your game account."
    },
    {
      question: "How does the delivery of Free Fire Diamonds work?",
      answer: "The delivery of Free Fire Diamonds on middasbuy.com is instant and automatic. After payment confirmation, diamonds are directly credited to your Free Fire account within 3-5 minutes. No login credentials required - just your Free Fire UID."
    },
    {
      question: "Is it safe to buy Free Fire Diamonds?",
      answer: "When you buy FF Diamond on middasbuy.com, our secure payment methods and reliable delivery system ensures the utmost safety for your in-game assets. We are trusted by millions of players worldwide and use encrypted transactions."
    },
    {
      question: "What is the cheapest way to buy Free Fire Diamonds?",
      answer: "Middasbuy.com offers the cheapest Free Fire Diamonds with regular discounts up to 60% off. We provide competitive pricing across all regions with multiple payment options including JazzCash, Easypaisa, credit cards, and local payment methods."
    },
    {
      question: "How to find my Free Fire UID?",
      answer: "Open Free Fire game → Tap on your profile icon (top-left corner) → Your UID is displayed below your character name. Copy this 9-12 digit number and paste it on middasbuy.com during checkout."
    },
    {
      question: "Can I top up Free Fire MAX using the same UID?",
      answer: "Yes! Free Fire and Free Fire MAX share the same account system. Your UID works for both versions, and diamonds purchased will be available in both Free Fire and Free Fire MAX."
    },
    {
      question: "What payment methods are accepted for Free Fire top up?",
      answer: "We accept multiple payment methods including Visa, MasterCard, JazzCash, Easypaisa, bank transfer, mobile wallets, and various local payment options depending on your region."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-black/50 to-black/80 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Top-up Instructions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-freefire-primary/10 to-orange-900/10 rounded-2xl p-6 md:p-8 border border-freefire-primary/20"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Diamond className="text-freefire-primary" />
            Free Fire Diamond Top-up Guide
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-freefire-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-freefire-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Enter Your Free Fire UID</h3>
                  <p className="text-gray-400 text-sm">Fill in your Player ID accurately to ensure instant delivery</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-freefire-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-freefire-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Select Diamond Package</h3>
                  <p className="text-gray-400 text-sm">Choose from 100 to 5000+ diamonds with bonus offers</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-freefire-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-freefire-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Complete Payment</h3>
                  <p className="text-gray-400 text-sm">Pay securely via JazzCash, Easypaisa, Card, or Bank Transfer</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-freefire-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-freefire-primary font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Receive Diamonds Instantly</h3>
                  <p className="text-gray-400 text-sm">Diamonds delivered to your account in 3-5 minutes</p>
                </div>
              </div>
            </div>
            
            <div className="bg-black/30 rounded-xl p-5 border border-white/10">
              <h3 className="text-freefire-primary font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Important Information
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Free Fire top-up takes approximately <strong className="text-white">3-5 minutes</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>In special cases, delivery may take up to <strong className="text-white">15 minutes</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Double-check your UID before payment to avoid delays</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Contact 24/7 support if diamonds not received</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Applicable Platform & Server */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="w-8 h-8 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Applicable Platform</h3>
            </div>
            <p className="text-gray-300">Mobile Game (Android & iOS)</p>
            <p className="text-gray-400 text-sm mt-2">Works on all mobile devices worldwide</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Supported Servers</h3>
            </div>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>🇵🇰 Pakistan</li>
              <li>🇮🇳 India (Free Fire MAX)</li>
              <li>🇲🇾 Malaysia & Singapore</li>
              <li>🇵🇭 Philippines</li>
              <li>🇺🇸 Americas (USA, Argentina, Chile, Colombia)</li>
              <li>🇪🇺 Europe (All Countries)</li>
              <li>🇧🇷 Brazil</li>
              <li>🌍 Middle East & Africa</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-8 h-8 text-green-400" />
              <h3 className="text-xl font-bold text-white">Required Information</h3>
            </div>
            <p className="text-gray-300 font-semibold">Free Fire UID Only</p>
            <p className="text-gray-400 text-sm mt-2">No password or login required. Just your Player ID for instant top-up.</p>
          </div>
        </motion.section>

        {/* What is Free Fire */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Gamepad2 className="text-freefire-primary" />
            About Free Fire & Diamonds
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/40 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-freefire-primary mb-3">What is Free Fire?</h3>
              <p className="text-gray-300 leading-relaxed">
                Free Fire is a world-renowned battle royale game on mobile developed by Garena. It drops players on a remote island for fast-paced 10-minute matches against 49 adversaries seeking survival. Players choose their starting position, scavenge for weapons, drive vehicles, and use tactical gameplay to be the last one standing. With over 1 billion downloads, Free Fire is one of the most popular mobile games worldwide.
              </p>
            </div>
            
            <div className="bg-black/40 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-freefire-primary mb-3">Free Fire vs Free Fire MAX</h3>
              <p className="text-gray-300 leading-relaxed">
                Free Fire MAX is an upgraded version with enhanced HD graphics, smoother animations, more captivating effects, and improved gameplay for a more immersive gaming experience. The core gameplay remains the same, and players from both versions can seamlessly play together. Your account, UID, and diamonds work across both versions.
              </p>
            </div>
            
            <div className="bg-black/40 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-freefire-primary mb-3">What are Free Fire Diamonds?</h3>
              <p className="text-gray-300 leading-relaxed">
                Free Fire Diamonds are the premium in-game currency used in Free Fire and FF MAX. Diamonds can be used to purchase exclusive character skins, weapon skins, Elite Pass, DJ Alok character, Chrono character, pets with special abilities, emotes, bundles, and limited-time event items. Top up diamonds to unlock the full Free Fire experience!
              </p>
            </div>
            
            <div className="bg-black/40 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-freefire-primary mb-3">Why Top Up at Middasbuy?</h3>
              <p className="text-gray-300 leading-relaxed">
                <a href="https://www.middasbuy.com" className="text-freefire-primary hover:underline font-semibold">Middasbuy.com</a> offers the cheapest Free Fire Diamonds with instant delivery. Get up to 60% discount + VIP bonus on all packages. We accept local payment methods like JazzCash, Easypaisa, and support players from Pakistan, India, Malaysia, Philippines, Europe, Americas, and worldwide. Trusted by 10M+ gamers!
              </p>
            </div>
          </div>
        </motion.section>

        {/* How to Find UID */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-freefire-primary/10 to-orange-900/10 rounded-2xl p-6 md:p-8 border border-freefire-primary/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">How to Find Your Free Fire UID?</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-freefire-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-freefire-primary font-bold text-xl">1</span>
              </div>
              <p className="text-gray-300 text-sm">Open Free Fire or Free Fire MAX game</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-freefire-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-freefire-primary font-bold text-xl">2</span>
              </div>
              <p className="text-gray-300 text-sm">Tap your profile icon (top-left corner)</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-freefire-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-freefire-primary font-bold text-xl">3</span>
              </div>
              <p className="text-gray-300 text-sm">Find your UID below character name</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-freefire-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-freefire-primary font-bold text-xl">4</span>
              </div>
              <p className="text-gray-300 text-sm">Copy & paste UID on middasbuy.com</p>
            </div>
          </div>
        </motion.section>

        {/* FAQs */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-black/40 rounded-xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-freefire-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* SEO Keywords Section (Hidden but crawlable) */}
        <section className="text-gray-500 text-xs leading-relaxed">
          <h3 className="font-semibold mb-2 text-gray-400">Related Searches:</h3>
          <p>
            buy free fire diamonds, free fire diamond top up, ff diamond recharge, garena free fire diamonds, 
            free fire diamond purchase, cheapest ff diamonds, free fire top up pakistan, buy ff diamonds online, 
            free fire diamond price, ff max diamond top up, free fire recharge, ff diamond shop, garena top up center, 
            free fire diamond buy, ff diamond purchase online, free fire diamond offer, cheap free fire diamonds, 
            ff diamond discount, free fire diamond sale, buy diamonds free fire, ff recharge, free fire max diamonds, 
            garena free fire top up, ff diamond top up pakistan, free fire diamond jazzcash, ff diamond easypaisa, 
            free fire diamond bank transfer, buy ff diamonds cheap, free fire diamond bonus, ff vip diamond, 
            free fire elite pass, dj alok free fire, chrono free fire, free fire character top up, ff emote purchase, 
            free fire bundle buy, ff skin purchase, free fire weapon skin, middasbuy free fire, middasbuy diamonds, 
            middasbuy ff top up, midasbuy free fire, midasbuy diamonds pakistan, free fire uid top up, 
            ff direct top up, instant ff diamonds, fast free fire recharge, secure ff diamond purchase
          </p>
        </section>
      </div>
    </div>
  );
};

export default FreeFireSEOContent;
