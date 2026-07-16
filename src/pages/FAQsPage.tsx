
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Plus, Minus } from "lucide-react";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import SEOHelmet from "@/components/SEO/SEOHelmet";

interface FAQsPageProps {
  onLogout: () => void;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
  isOpen: boolean;
}

const FAQsPage = ({ onLogout }: FAQsPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      question: "How do I purchase UC in PUBG Mobile?",
      answer: "To purchase UC in PUBG Mobile through Midasbuy, select your desired UC package on our homepage, enter your PUBG Mobile ID, choose your preferred payment method, and complete the transaction. Your UC will be credited to your account immediately after payment is confirmed.",
      category: "purchases",
      isOpen: false
    },
    {
      question: "Is it safe to purchase UC from Midasbuy?",
      answer: "Yes, Midasbuy is the official top-up platform for PUBG Mobile. We use industry-standard encryption and security measures to protect your personal and payment information. All transactions are secure and directly integrated with the game.",
      category: "security",
      isOpen: false
    },
    {
      question: "How long does it take to receive UC after purchase?",
      answer: "In most cases, UC is credited to your PUBG Mobile account immediately after your payment is confirmed. However, in rare cases, it might take up to 30 minutes due to server processing or high traffic. If you haven't received your UC after 30 minutes, please contact our customer support.",
      category: "purchases",
      isOpen: false
    },
    {
      question: "What payment methods are accepted?",
      answer: "Midasbuy accepts various payment methods including credit/debit cards (Visa, Mastercard, American Express), PayPal, Google Pay, Apple Pay, and various regional payment options. Available payment methods may vary depending on your location.",
      category: "payments",
      isOpen: false
    },
    {
      question: "I made a payment but didn't receive my UC. What should I do?",
      answer: "First, verify that your payment was successfully processed by checking your email for a payment confirmation. If the payment was successful but you haven't received your UC within 30 minutes, please contact our support team with your transaction ID and PUBG Mobile ID. We recommend checking your in-game mail as well, as sometimes notifications about UC purchases are sent there.",
      category: "payments",
      isOpen: false
    },
    {
      question: "Can I purchase UC for another player?",
      answer: "Yes, you can purchase UC for any PUBG Mobile player as long as you have their correct Player ID. Simply enter their Player ID during the purchase process instead of your own.",
      category: "purchases",
      isOpen: false
    },
    {
      question: "How do I find my PUBG Mobile ID?",
      answer: "You can find your PUBG Mobile ID by opening the game, tapping on your profile picture in the top-right corner, and looking for the ID number displayed below your username. This is the number you need to enter when making purchases on Midasbuy.",
      category: "account",
      isOpen: false
    },
    {
      question: "Are there any bonuses for purchasing larger UC packages?",
      answer: "Yes, larger UC packages often come with bonus UC. The amount of bonus UC varies by package and is clearly displayed on each package option. We also run special promotions periodically that offer additional bonuses.",
      category: "purchases",
      isOpen: false
    },
    {
      question: "Will my UC expire if I don't use it?",
      answer: "No, UC does not expire. Once credited to your PUBG Mobile account, it remains there until you spend it, regardless of how long you hold onto it.",
      category: "account",
      isOpen: false
    },
    {
      question: "Can I get a refund for my UC purchase?",
      answer: "As per our refund policy, all UC purchases are final and non-refundable once the UC has been credited to your account. If you are experiencing issues with your purchase or believe you've been charged incorrectly, please contact our customer support team immediately.",
      category: "refunds",
      isOpen: false
    },
    {
      question: "Is there a limit to how much UC I can purchase?",
      answer: "There are no specific limits to how much UC you can purchase. However, large or unusual transactions may trigger security measures and require additional verification to protect your account.",
      category: "purchases",
      isOpen: false
    },
    {
      question: "Can I use Midasbuy to purchase items directly instead of UC?",
      answer: "Yes, Midasbuy offers direct purchase options for certain in-game items, skins, and battle passes. Browse our shop section to see what items are available for direct purchase.",
      category: "purchases",
      isOpen: false
    },
    {
      question: "How do I create a Midasbuy account?",
      answer: "You don't necessarily need a Midasbuy account to make purchases, but creating one allows you to track your purchase history and save payment methods. To create an account, click on the 'Sign Up' button, provide your email address, create a password, and complete the verification process.",
      category: "account",
      isOpen: false
    },
    {
      question: "Why was my payment declined?",
      answer: "Payments can be declined for various reasons including insufficient funds, incorrect card details, expired cards, bank restrictions on gaming transactions, or security measures triggered by unusual activity. If your payment is declined, try using a different payment method or contact your bank for more information.",
      category: "payments",
      isOpen: false
    },
    {
      question: "Does Midasbuy store my credit card information?",
      answer: "Midasbuy does not store your complete credit card information. We use secure tokenization and comply with PCI DSS standards to ensure your payment information is protected. If you choose to save your payment method for future purchases, only a secure token is stored, not your actual card details.",
      category: "security",
      isOpen: false
    },
    {
      question: "What should I do if my payment keeps failing?",
      answer: "If your payment keeps failing, try these steps: 1) Check that your payment details are entered correctly, 2) Ensure you have sufficient funds, 3) Contact your bank to check for restrictions on gaming transactions, 4) Try a different payment method like JazzCash or NayaPay, 5) Clear your browser cache and try again. If issues persist, contact our WhatsApp support.",
      category: "payments",
      isOpen: false
    },
    {
      question: "Why can't I use my credit card for payments?",
      answer: "Credit card payments may be temporarily unavailable due to maintenance or regional restrictions. We recommend using mobile payment methods like JazzCash, NayaPay, or SadaPay for faster and more reliable transactions. These methods are specifically optimized for gaming purchases in your region.",
      category: "payments", 
      isOpen: false
    },
    {
      question: "How do I redeem codes for items in PUBG Mobile?",
      answer: "To redeem codes in PUBG Mobile: 1) Open the game and go to Settings, 2) Look for 'Redeem Code' or 'Exchange' option, 3) Enter your redemption code exactly as provided, 4) Confirm the redemption. Items will be added to your inventory immediately. Make sure to use codes before their expiration date.",
      category: "account",
      isOpen: false
    }
  ]);

  const handleToggleFAQ = (index: number) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index].isOpen = !updatedFaqs[index].isOpen;
    setFaqs(updatedFaqs);
  };

  const categories = [
    { id: "all", name: "All FAQs" },
    { id: "purchases", name: "Purchases" },
    { id: "payments", name: "Payment Issues" },
    { id: "account", name: "Account" },
    { id: "security", name: "Security" },
    { id: "refunds", name: "Refunds" }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-midasbuy-navy to-black text-white">
      <SEOHelmet 
        title="Midasbuy FAQs - Help Center & Gaming Support"
        description="Answers about PUBG UC, Free Fire Diamonds, payments, refunds and account issues. Get help with your Midasbuy gaming purchases."
        keywords="midasbuy FAQ, help center, PUBG UC questions, Free Fire help, UC purchase help, payment issues, gaming FAQ, account support"
        canonicalUrl="/faqs"
        ogType="website"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
      }) }} />
      <Header onLogout={onLogout} />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Find answers to common questions about purchasing PUBG MOBILE UC, accessing your player information, redeeming codes for items, payment issues, and account management.
            </p>
          </div>
          
          <div className="glass-effect p-6 rounded-xl mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search for questions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-midasbuy-navy/50 border-midasbuy-blue/30 text-white focus:border-midasbuy-blue focus:ring-midasbuy-blue/20"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                    ? 'bg-midasbuy-blue text-white'
                    : 'bg-midasbuy-navy/50 text-gray-300 hover:bg-midasbuy-navy'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <div className="divide-y divide-gray-700">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div key={index} className="py-4">
                    <button
                      onClick={() => handleToggleFAQ(index)}
                      className="flex justify-between items-center w-full text-left font-medium text-white hover:text-midasbuy-blue transition-colors"
                    >
                      <span>{faq.question}</span>
                      {faq.isOpen ? (
                        <Minus className="w-5 h-5 flex-shrink-0 text-midasbuy-blue" />
                      ) : (
                        <Plus className="w-5 h-5 flex-shrink-0 text-midasbuy-blue" />
                      )}
                    </button>
                    
                    {faq.isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 text-gray-300"
                      >
                        <p className="px-2 py-3 bg-midasbuy-navy/30 rounded-lg">{faq.answer}</p>
                      </motion.div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-400">
                  <p>No results found for "{searchQuery}"</p>
                  <p className="mt-2 text-sm">Try a different search term or browse by category</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 mb-3">Can't find what you're looking for?</p>
            <Link to="/contact">
              <button className="bg-midasbuy-blue hover:bg-blue-600 px-8 py-2 rounded-lg text-white font-medium transition-colors">
                Contact Support
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQsPage;
