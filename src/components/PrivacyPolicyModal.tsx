
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

const PrivacyPolicyModal = ({ onClose }: PrivacyPolicyModalProps) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-midasbuy-navy border border-midasbuy-blue/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="sticky top-0 bg-midasbuy-navy/95 backdrop-blur-md p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/c6fd77e7-3682-428e-8154-140308b4a06b.png" 
            alt="Logo" 
            className="h-8 mr-3"
            width="155"
            height="32"
            loading="eager"
            decoding="async"
          />
          <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-6 text-gray-300">
        <section className="mb-8">
          <h3 className="text-xl text-white font-bold mb-4">Introduction</h3>
          <p className="mb-4">
            This Privacy Policy ("Policy") explains how MidasBuy collects, uses, and discloses your information when you use our website, products, and services. We are committed to ensuring the privacy and security of your personal information.
          </p>
          <p>
            By using MidasBuy, you agree to the collection and use of information in accordance with this Policy. We will not use or share your information with anyone except as described in this Privacy Policy.
          </p>
        </section>
        
        <section className="mb-8">
          <h3 className="text-xl text-white font-bold mb-4">Information Collection and Use</h3>
          <p className="mb-4">
            We collect several different types of information for various purposes to provide and improve our service to you:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="text-white font-medium">Personal Data:</span> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you, including but not limited to your name, email address, phone number, and payment information.
            </li>
            <li>
              <span className="text-white font-medium">Game Account Information:</span> To facilitate purchases and ensure proper delivery of in-game items, we collect your game ID, username, and related information.
            </li>
            <li>
              <span className="text-white font-medium">Transaction Data:</span> We keep records of the products you purchase, transaction amount, and payment methods used.
            </li>
            <li>
              <span className="text-white font-medium">Usage Data:</span> We collect information on how the Service is accessed and used, including your computer's Internet Protocol address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.
            </li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h3 className="text-xl text-white font-bold mb-4">Data Security</h3>
          <p className="mb-4">
            The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>All sensitive information is transmitted via Secure Socket Layer (SSL) technology.</li>
            <li>All payment information is encrypted using industry-standard methods.</li>
            <li>We regularly review our information collection, storage, and processing practices to protect against unauthorized access.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h3 className="text-xl text-white font-bold mb-4">Third-Party Disclosure</h3>
          <p>
            We may disclose your Personal Data in the good faith belief that such action is necessary to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Comply with a legal obligation</li>
            <li>Protect and defend the rights or property of MidasBuy</li>
            <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
            <li>Protect the personal safety of users of the Service or the public</li>
            <li>Protect against legal liability</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h3 className="text-xl text-white font-bold mb-4">Your Rights</h3>
          <p className="mb-4">
            You have the right to access, update, or delete the information we have on you. Whenever made possible, you can:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Update your personal information by logging into your account</li>
            <li>Request access to the personal data we hold about you</li>
            <li>Request correction of any inaccurate data</li>
            <li>Request deletion of your personal data (subject to certain conditions)</li>
            <li>Object to processing of your personal data</li>
            <li>Request restriction of processing your personal data</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h3 className="text-xl text-white font-bold mb-4">Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="mt-2 p-4 bg-midasbuy-darkBlue/50 rounded-lg">
            <p className="font-medium text-white">MidasBuy Support</p>
            <p>Email: help@midasbuy.com.co</p>
            <p>Address: One MidasBuy Plaza, Gaming District, CA 90210, USA</p>
          </div>
        </section>
        
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={onClose}
            className="bg-midasbuy-blue hover:bg-blue-600 px-8"
          >
            I Understand
          </Button>
        </div>
      </div>
    </motion.div>
  </div>
);

export default PrivacyPolicyModal;
