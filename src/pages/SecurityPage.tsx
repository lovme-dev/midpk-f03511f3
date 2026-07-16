
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, FileText, AlertCircle, CheckCircle2, Key } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import SEOHelmet from "@/components/SEO/SEOHelmet";

interface SecurityPageProps {
  onLogout: () => void;
}

const SecurityPage = ({ onLogout }: SecurityPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-midasbuy-navy to-black text-white">
      <SEOHelmet 
        title="Security Center - Midasbuy | Safe & Secure UC Purchases"
        description="Learn how Midasbuy protects your information with secure payments, account protection, data privacy, and fraud prevention. Safe PUBG Mobile UC purchases with PCI DSS compliance."
        keywords="midasbuy security, secure payment, safe UC purchase, account protection, payment security, gaming security, PCI DSS"
        canonicalUrl="/security"
        ogImage="/og-image.png"
        ogType="website"
      />
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
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Security Center</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Learn how Midasbuy protects your information and what steps you can take to ensure your account remains secure.
            </p>
          </div>
          
          <div className="glass-effect p-8 rounded-xl mb-10">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-3">How We Protect You</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="glass-effect p-5 rounded-lg bg-midasbuy-navy/30">
                <div className="flex items-center mb-4">
                  <div className="bg-green-500/20 p-2 rounded-full mr-3">
                    <Lock className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Secure Payments</h3>
                </div>
                <p className="text-gray-300">
                  All payment transactions on Midasbuy are encrypted using industry-standard TLS (Transport Layer Security) protocols. We comply with PCI DSS (Payment Card Industry Data Security Standard) to ensure your payment information is protected.
                </p>
                <div className="mt-4 bg-midasbuy-navy/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">
                    We never store your complete credit card details on our servers. All sensitive information is tokenized and processed through secure payment gateways.
                  </p>
                </div>
              </div>
              
              <div className="glass-effect p-5 rounded-lg bg-midasbuy-navy/30">
                <div className="flex items-center mb-4">
                  <div className="bg-green-500/20 p-2 rounded-full mr-3">
                    <Key className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Account Protection</h3>
                </div>
                <p className="text-gray-300">
                  Your account is protected by a secure authentication system. We implement security measures like rate limiting, automated session timeouts, and suspicious activity monitoring to prevent unauthorized access.
                </p>
                <div className="mt-4 bg-midasbuy-navy/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">
                    We regularly audit our systems and conduct security tests to identify and address potential vulnerabilities before they can be exploited.
                  </p>
                </div>
              </div>
              
              <div className="glass-effect p-5 rounded-lg bg-midasbuy-navy/30">
                <div className="flex items-center mb-4">
                  <div className="bg-green-500/20 p-2 rounded-full mr-3">
                    <FileText className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Data Privacy</h3>
                </div>
                <p className="text-gray-300">
                  We follow strict data privacy practices in compliance with global standards. Your personal information is only used for the purposes stated in our Privacy Policy and is never sold to third parties.
                </p>
                <div className="mt-4 bg-midasbuy-navy/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">
                    You can request access to or deletion of your personal data at any time. We maintain transparent privacy practices and regularly update our policies to align with the latest regulations.
                  </p>
                </div>
              </div>
              
              <div className="glass-effect p-5 rounded-lg bg-midasbuy-navy/30">
                <div className="flex items-center mb-4">
                  <div className="bg-green-500/20 p-2 rounded-full mr-3">
                    <AlertCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Fraud Prevention</h3>
                </div>
                <p className="text-gray-300">
                  Our advanced fraud detection systems monitor transactions in real-time to identify and prevent fraudulent activities. Unusual purchasing patterns or suspicious activities trigger additional verification steps.
                </p>
                <div className="mt-4 bg-midasbuy-navy/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">
                    We work closely with payment providers and gaming platforms to coordinate security efforts and share information about emerging threats.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">Security Best Practices for Users</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-white">Use Strong, Unique Passwords</h3>
                    <p className="text-sm text-gray-300">Create complex passwords that include a mix of letters, numbers, and special characters. Never reuse passwords across different platforms.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-white">Enable Two-Factor Authentication When Available</h3>
                    <p className="text-sm text-gray-300">Add an extra layer of security by enabling 2FA on your gaming accounts and payment platforms.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-white">Only Use Official Websites and Apps</h3>
                    <p className="text-sm text-gray-300">Always ensure you're on the official Midasbuy website (midasbuy.com) before entering any personal or payment information.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-white">Keep Your Devices Secure</h3>
                    <p className="text-sm text-gray-300">Regularly update your devices' operating systems and applications to patch security vulnerabilities.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-white">Be Wary of Phishing Attempts</h3>
                    <p className="text-sm text-gray-300">Midasbuy will never ask for your password via email or message. Be suspicious of any communication requesting sensitive information.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-white">Monitor Your Transactions</h3>
                    <p className="text-sm text-gray-300">Regularly check your purchase history and bank statements for any unauthorized transactions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-effect p-6 rounded-xl mb-8">
            <h2 className="text-xl font-bold mb-4">Report Security Concerns</h2>
            <p className="text-gray-300 mb-4">
              If you suspect any unauthorized access to your account, unusual transactions, or other security issues, please report them immediately.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="flex-1">
                <Button className="w-full bg-midasbuy-blue hover:bg-blue-600">
                  Report Security Issue
                </Button>
              </Link>
              <Link to="/help-center" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent border-midasbuy-blue text-midasbuy-blue hover:bg-midasbuy-blue/10">
                  Security FAQ
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <p>For urgent security matters, please contact our security team directly at security@midasbuy.com</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SecurityPage;
