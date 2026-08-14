import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, Users, Globe, Target, Heart, Zap } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import SEOHelmet from "@/components/SEO/SEOHelmet";

interface CareersPageProps {
  onLogout: () => void;
}

const CareersPage = ({ onLogout }: CareersPageProps) => {
  const openPositions = [
    {
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Remote / Los Angeles",
      type: "Full-time"
    },
    {
      title: "Product Manager - Gaming",
      department: "Product",
      location: "Los Angeles",
      type: "Full-time"
    },
    {
      title: "Customer Support Specialist",
      department: "Support",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Security Engineer",
      department: "Security",
      location: "Remote / Los Angeles",
      type: "Full-time"
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      location: "Los Angeles",
      type: "Full-time"
    },
    {
      title: "Business Development Manager",
      department: "Business",
      location: "Asia Pacific",
      type: "Full-time"
    }
  ];

  const benefits = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, dental, vision, and mental health support"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Professional Growth",
      description: "Learning budgets, conference attendance, and career development programs"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Culture",
      description: "Inclusive environment, team events, and collaborative workspace"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Remote Friendly",
      description: "Flexible work arrangements and global team collaboration"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-midasbuy-navy to-black text-white">
      <SEOHelmet 
        title="Careers at Midasbuy - Join Our Gaming Commerce Team"
        description="Join Midasbuy and shape the future of gaming commerce. Explore career opportunities in engineering, product, design, and more. Remote-friendly, competitive benefits, global team."
        keywords="midasbuy careers, gaming jobs, tech jobs, remote gaming jobs, midasbuy jobs, gaming commerce careers"
        canonicalUrl="/careers"
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
            <div className="w-20 h-20 bg-midasbuy-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-midasbuy-blue" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Join Our Team</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Be part of the team that's revolutionizing gaming commerce. Help millions of gamers access their favorite games and items through our secure platform.
            </p>
          </div>

          <div className="glass-effect p-8 rounded-xl mb-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Work at Midasbuy?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-effect p-6 rounded-lg bg-midasbuy-navy/30 text-center"
                >
                  <div className="bg-midasbuy-blue/20 p-3 rounded-full w-fit mx-auto mb-4">
                    <div className="text-midasbuy-blue">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-300 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-midasbuy-navy/50 px-4 py-2 rounded-lg">
                <Target className="w-5 h-5 text-midasbuy-gold" />
                <span className="text-midasbuy-gold font-medium">Mission:</span>
                <span className="text-gray-300">Empowering gamers worldwide with secure, convenient digital commerce</span>
              </div>
            </div>
          </div>

          <div className="glass-effect p-8 rounded-xl mb-10">
            <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
            
            <div className="space-y-4">
              {openPositions.map((position, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-effect p-6 rounded-lg bg-midasbuy-navy/30 hover:bg-midasbuy-navy/50 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-bold text-white mb-2">{position.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-midasbuy-blue rounded-full mr-2"></div>
                          {position.department}
                        </span>
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-midasbuy-gold rounded-full mr-2"></div>
                          {position.location}
                        </span>
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          {position.type}
                        </span>
                      </div>
                    </div>
                    <Button className="bg-midasbuy-blue hover:bg-blue-600 w-full md:w-auto">
                      Apply Now
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass-effect p-8 rounded-xl mb-8">
            <h2 className="text-xl font-bold mb-4">Application Process</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-midasbuy-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-midasbuy-blue font-bold">1</span>
                </div>
                <h3 className="font-medium mb-2">Submit Application</h3>
                <p className="text-sm text-gray-300">Send your resume and cover letter through our careers portal</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-midasbuy-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-midasbuy-blue font-bold">2</span>
                </div>
                <h3 className="font-medium mb-2">Interview Process</h3>
                <p className="text-sm text-gray-300">Initial screening followed by technical and cultural fit interviews</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-midasbuy-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-midasbuy-blue font-bold">3</span>
                </div>
                <h3 className="font-medium mb-2">Welcome Aboard</h3>
                <p className="text-sm text-gray-300">Comprehensive onboarding and integration with your new team</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Don't see a position that fits? We're always looking for talented individuals.
            </p>
            <Button className="bg-midasbuy-blue hover:bg-blue-600">
              Send General Application
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CareersPage;