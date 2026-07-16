import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Users, TrendingUp, Award, FileText, Camera } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import SEOHelmet from "@/components/SEO/SEOHelmet";

interface PressPageProps {
  onLogout: () => void;
}

const PressPage = ({ onLogout }: PressPageProps) => {
  const newsReleases = [
    {
      date: "March 15, 2026",
      title: "Midasbuy Announces Partnership with Leading Gaming Publishers",
      excerpt: "Expanding our gaming portfolio to include more popular titles and exclusive content for millions of players worldwide.",
      category: "Partnership"
    },
    {
      date: "March 10, 2026",
      title: "New Security Features Launched to Protect Gaming Transactions",
      excerpt: "Enhanced fraud detection and two-factor authentication now available to ensure safer digital purchases.",
      category: "Product"
    },
    {
      date: "February 28, 2026",
      title: "Midasbuy Reaches 50 Million Registered Users Milestone",
      excerpt: "Platform continues to grow as the trusted source for gaming currency and digital items across multiple regions.",
      category: "Milestone"
    },
    {
      date: "February 20, 2026",
      title: "Mobile Payment Integration Launches in South Asia",
      excerpt: "JazzCash, NayaPay, and SadaPay integration brings convenient payment options to millions of mobile gamers.",
      category: "Expansion"
    },
    {
      date: "February 15, 2026",
      title: "Midasbuy Wins Best Gaming Commerce Platform Award 2026",
      excerpt: "Recognition for innovation in digital gaming commerce and commitment to user security and satisfaction.",
      category: "Award"
    }
  ];

  const stats = [
    { number: "50M+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "200+", label: "Countries Served", icon: <TrendingUp className="w-6 h-6" /> },
    { number: "15+", label: "Gaming Titles", icon: <Award className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime", icon: <FileText className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-midasbuy-navy to-black text-white">
      <SEOHelmet 
        title="Press Center - Midasbuy | Latest News & Media Resources"
        description="Midasbuy Press Center - Latest news, press releases, company milestones, and media resources. Stay updated with our platform's growth, partnerships, and industry leadership in gaming commerce."
        keywords="Midasbuy press, gaming news, press releases, media resources, company news, gaming platform, digital commerce news"
        canonicalUrl="/press"
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
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-purple-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Press Center</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Latest news, press releases, and media resources from Midasbuy. Stay updated with our company milestones and industry leadership.
            </p>
          </div>

          <div className="glass-effect p-8 rounded-xl mb-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Company at a Glance</h2>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-midasbuy-blue/20 p-4 rounded-full w-fit mx-auto mb-3">
                    <div className="text-midasbuy-blue">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-midasbuy-gold mb-1">{stat.number}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-300 max-w-3xl mx-auto">
                Midasbuy is the world's leading platform for gaming commerce, providing secure and convenient access to digital gaming content. 
                Trusted by millions of gamers worldwide, we continue to innovate and expand our services to meet the evolving needs of the gaming community.
              </p>
            </div>
          </div>

          <div className="glass-effect p-8 rounded-xl mb-10">
            <h2 className="text-2xl font-bold mb-6">Latest News & Press Releases</h2>
            
            <div className="space-y-6">
              {newsReleases.map((release, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-effect p-6 rounded-lg bg-midasbuy-navy/30 hover:bg-midasbuy-navy/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                    <div className="flex items-center gap-4 mb-2 md:mb-0">
                      <div className="bg-midasbuy-blue/20 px-3 py-1 rounded-full">
                        <span className="text-midasbuy-blue text-sm font-medium">{release.category}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {release.date}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{release.title}</h3>
                  <p className="text-gray-300 mb-4">{release.excerpt}</p>
                  <Button variant="outline" className="bg-transparent border-midasbuy-blue text-midasbuy-blue hover:bg-midasbuy-blue/10">
                    Read Full Release
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="glass-effect p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Media Kit</h2>
              <p className="text-gray-300 mb-4">
                Download our official logos, company information, and executive photos for media coverage.
              </p>
              <div className="space-y-3">
                <Button className="w-full bg-midasbuy-blue hover:bg-blue-600 justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Company Fact Sheet
                </Button>
                <Button className="w-full bg-midasbuy-blue hover:bg-blue-600 justify-start">
                  <Camera className="w-4 h-4 mr-2" />
                  Executive Photos
                </Button>
                <Button className="w-full bg-midasbuy-blue hover:bg-blue-600 justify-start">
                  <Award className="w-4 h-4 mr-2" />
                  Logo Package
                </Button>
              </div>
            </div>

            <div className="glass-effect p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Media Inquiries</h2>
              <p className="text-gray-300 mb-4">
                For press inquiries, interview requests, or media partnerships, please contact our press team.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-midasbuy-navy/30 rounded-lg">
                  <p className="text-sm text-gray-400">Press Contact:</p>
                  <p className="text-white font-medium">Sarah Johnson</p>
                  <p className="text-midasbuy-blue">press@midasbuy.com</p>
                </div>
                <div className="p-3 bg-midasbuy-navy/30 rounded-lg">
                  <p className="text-sm text-gray-400">Media Relations:</p>
                  <p className="text-white font-medium">+1 (555) 123-PRESS</p>
                  <p className="text-gray-300 text-sm">Available Monday-Friday, 9 AM - 6 PM PST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold mb-4">Follow Our Journey</h2>
            <p className="text-gray-300 mb-4">
              Stay updated with the latest Midasbuy news and announcements
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="bg-transparent border-midasbuy-blue text-midasbuy-blue hover:bg-midasbuy-blue/10">
                Subscribe to Newsletter
              </Button>
              <Button variant="outline" className="bg-transparent border-midasbuy-blue text-midasbuy-blue hover:bg-midasbuy-blue/10">
                Follow on LinkedIn
              </Button>
              <Button variant="outline" className="bg-transparent border-midasbuy-blue text-midasbuy-blue hover:bg-midasbuy-blue/10">
                Follow on Twitter
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PressPage;