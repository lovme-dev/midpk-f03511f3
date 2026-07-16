import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send, PhoneCall, Mail, MessageSquare, MapPin } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SEOHelmet from "@/components/SEO/SEOHelmet";

interface ContactUsPageProps {
  onLogout: () => void;
}

const ContactUsPage = ({ onLogout }: ContactUsPageProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save inquiry to database
      const { error: dbError } = await supabase.from("customer_inquiries").insert({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      if (dbError) {
        console.error("Error saving inquiry:", dbError);
        throw dbError;
      }

      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We'll respond to your inquiry shortly.",
      });

      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error Sending Message",
        description: "There was an issue sending your message. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-midasbuy-navy to-black text-white">
      <SEOHelmet
        title="Contact Midasbuy - 24/7 Customer Support | PUBG UC Help"
        description="Get instant help from Midasbuy support for PUBG Mobile UC and Free Fire orders. 24/7 WhatsApp and email assistance with fast response."
        keywords="Midasbuy contact, customer support, PUBG UC help, gaming credits support, WhatsApp support, 24/7 support, contact Midasbuy, gaming help"
        canonicalUrl="https://www.middasbuy.com/contact-us"
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Midasbuy",
          description: "Get instant help from Midasbuy support team for PUBG Mobile UC and gaming credits",
          url: "https://www.middasbuy.com/contact-us",
        }}
      />
      <Header onLogout={onLogout} />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Have questions or need assistance? Our team is ready to help you with any inquiries about UC purchases,
              account issues, or technical support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-effect p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-3">Send Us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="bg-midasbuy-navy/50 border-midasbuy-blue/30 text-white"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="bg-midasbuy-navy/50 border-midasbuy-blue/30 text-white"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What is this regarding?"
                    required
                    className="bg-midasbuy-navy/50 border-midasbuy-blue/30 text-white"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    required
                    className="bg-midasbuy-navy/50 border-midasbuy-blue/30 text-white min-h-[120px]"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-midasbuy-blue hover:bg-blue-600">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="glass-effect p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-3">Contact Information</h2>

                <div className="space-y-4">
                  <div className="flex">
                    <div className="bg-midasbuy-blue/20 p-2 rounded-full mr-4">
                      <PhoneCall className="w-5 h-5 text-midasbuy-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">WhatsApp Support</h3>
                      <div className="space-y-1">
                        <a href="https://wa.me/14502322003" className="block text-midasbuy-gold hover:underline">
                          +1 450 232 2003
                        </a>
                      </div>
                      <p className="text-xs text-gray-400">24/7 Customer Support via WhatsApp</p>
                      <a
                        href="https://wa.me/14502322003"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BD5A] hover:to-[#0d7d6e] text-white font-medium rounded-full transition-all shadow-lg hover:shadow-[#25D366]/30 hover:scale-105"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
                        </svg>
                        Chat with Agent
                      </a>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-midasbuy-blue/20 p-2 rounded-full mr-4">
                      <Mail className="w-5 h-5 text-midasbuy-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Email Support</h3>
                      <p className="text-midasbuy-gold">help@midasbuy.com.co</p>
                      <p className="text-xs text-gray-400">For all inquiries and support</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-midasbuy-blue/20 p-2 rounded-full mr-4">
                      <MessageSquare className="w-5 h-5 text-midasbuy-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Live Chat</h3>
                      <p className="text-gray-300">Available 24/7 on our website</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 bg-transparent border-midasbuy-blue text-midasbuy-blue hover:bg-midasbuy-blue/10"
                      >
                        Start Chat
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-effect p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-midasbuy-gold" />
                  Our Office
                </h2>
                <p className="text-gray-300 mb-2">Midasbuy Headquarters</p>
                <p className="text-gray-400">
                  One Midasbuy Plaza, Gaming District
                  <br />
                  Los Angeles, CA 90210
                  <br />
                  United States
                </p>

                <div className="mt-4 p-2 bg-midasbuy-navy/50 rounded-lg">
                  <p className="text-sm text-gray-400">Office Hours: Monday to Friday, 9:00 AM - 6:00 PM (PST)</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUsPage;
