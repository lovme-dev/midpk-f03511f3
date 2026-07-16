import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Handshake, Globe, Gamepad2, Store, Shield, Zap } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import SEOHelmet from "@/components/SEO/SEOHelmet";

interface PartnersPageProps {
  onLogout: () => void;
}

const PartnersPage = ({ onLogout }: PartnersPageProps) => {
  const keyPartners = [
    {
      name: "PUBG Mobile",
      description: "Official partnership for UC distribution and exclusive content",
      logo: "/lovable-uploads/544e7edd-a37f-4880-a2c4-ca04403f2b3b.png",
      category: "Gaming Publisher",
      benefits: ["Exclusive UC packages", "Priority support", "Special events"]
    },
    {
      name: "Codashop",
      description: "Regional partnership for expanded payment options and coverage",
      logo: "/lovable-uploads/daa743fb-ab00-4c9b-adbd-48e25ccddd17.png",
      category: "Digital Commerce",
      benefits: ["Regional payment methods", "Local currency support", "24/7 customer service"]
    },
    {
      name: "Garena Free Fire",
      description: "Official partnership for diamond distribution and premium gaming content",
      logo: "/lovable-uploads/e1e246e4-0de9-4148-b12c-14d60f635c47.png",
      category: "Gaming Publisher",
      benefits: ["Exclusive diamond packages", "Premium content access", "In-game rewards"]
    }
  ];

  const partnershipTypes = [
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "Gaming Publishers",
      description: "Partner with game developers and publishers to offer official digital content",
      benefits: ["Revenue sharing", "Marketing support", "Technical integration"]
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: "Payment Providers",
      description: "Integrate payment solutions to expand accessibility for global users",
      benefits: ["Transaction processing", "Fraud protection", "Multi-currency support"]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Regional Distributors",
      description: "Local partnerships to serve specific markets with tailored solutions",
      benefits: ["Local expertise", "Market penetration", "Cultural adaptation"]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security Partners",
      description: "Collaborate with cybersecurity firms to ensure platform safety",
      benefits: ["Advanced security", "Threat detection", "Compliance support"]
    }
  ];

  const partnerRequirements = [
    "Established business with proven track record",
    "Commitment to user safety and security",
    "Technical capabilities for integration",
    "Compliance with regional regulations",
    "Shared vision for gaming ecosystem growth"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-midasbuy-navy to-black text-white">
      <SEOHelmet 
        title="Partners - Midasbuy | Gaming Publisher & Payment Partnerships"
        description="Join Midasbuy partner network. Partner with gaming publishers, payment providers, and regional distributors to expand global gaming commerce."
        keywords="midasbuy partners, gaming partnerships, payment partnerships, PUBG Mobile partnership, Free Fire partnership"
        canonicalUrl="/partners"
        ogImage="/og-image.png"
        ogType="website"
      />
      <Header onLogout={onLogout} />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Handshake className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Partners</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Building the future of gaming commerce through strategic partnerships. Together, we create better experiences for millions of gamers worldwide.
            </p>
          </div>

          <div className="glass-effect p-8 rounded-xl mb-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Key Partners</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {keyPartners.map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="glass-effect p-6 rounded-lg bg-midasbuy-navy/30"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-white rounded-lg p-2 mr-4 flex items-center justify-center">
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{partner.name}</h3>
                      <p className="text-midasbuy-blue text-sm">{partner.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{partner.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-white text-sm">Partnership Benefits:</h4>
                    <ul className="space-y-1">
                      {partner.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="text-sm text-gray-300 flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass-effect p-8 rounded-xl mb-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Partnership Opportunities</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {partnershipTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-midasbuy-blue/20 p-4 rounded-full w-fit mx-auto mb-4">
                    <div className="text-midasbuy-blue">
                      {type.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{type.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{type.description}</p>
                  <div className="space-y-1">
                    {type.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="text-xs text-midasbuy-gold">
                        • {benefit}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-midasbuy-navy/50 px-4 py-2 rounded-lg">
                <Zap className="w-5 h-5 text-midasbuy-gold" />
                <span className="text-midasbuy-gold font-medium">Goal:</span>
                <span className="text-gray-300">Creating a comprehensive gaming ecosystem for all</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="glass-effect p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Partner Requirements</h2>
              <p className="text-gray-300 mb-4">
                We seek partners who share our commitment to excellence and user satisfaction.
              </p>
              <ul className="space-y-3">
                {partnerRequirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300 text-sm">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-effect p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Partnership Benefits</h2>
              <p className="text-gray-300 mb-4">
                Join our ecosystem and gain access to exclusive opportunities and resources.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-midasbuy-blue/20 rounded-full flex items-center justify-center mr-3">
                    <Globe className="w-4 h-4 text-midasbuy-blue" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">Global Reach</h4>
                    <p className="text-xs text-gray-400">Access to 200+ countries</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-midasbuy-blue/20 rounded-full flex items-center justify-center mr-3">
                    <Shield className="w-4 h-4 text-midasbuy-blue" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">Security First</h4>
                    <p className="text-xs text-gray-400">Enterprise-grade security</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-midasbuy-blue/20 rounded-full flex items-center justify-center mr-3">
                    <Zap className="w-4 h-4 text-midasbuy-blue" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">Innovation</h4>
                    <p className="text-xs text-gray-400">Cutting-edge technology</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-effect p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-4">Become a Partner</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Ready to join forces with Midasbuy? Let's explore how we can create value together and shape the future of gaming commerce.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button className="bg-midasbuy-blue hover:bg-blue-600 flex-1">
                Submit Partnership Proposal
              </Button>
              <Button variant="outline" className="bg-transparent border-midasbuy-blue text-midasbuy-blue hover:bg-midasbuy-blue/10 flex-1">
                Contact Business Team
              </Button>
            </div>

            <div className="mt-6 p-4 bg-midasbuy-navy/30 rounded-lg">
              <p className="text-sm text-gray-400">Partnership Inquiries:</p>
              <p className="text-midasbuy-blue font-medium">partnerships@midasbuy.com</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PartnersPage;