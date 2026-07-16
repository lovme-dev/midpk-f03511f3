import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHelmet from '@/components/SEO/SEOHelmet';

interface AboutMidasbuyPageProps {
  onLogout?: () => void;
}

const AboutMidasbuyPage = ({ onLogout }: AboutMidasbuyPageProps) => {
  useEffect(() => {
    document.title = 'About Midasbuy - Official Gaming Store';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHelmet 
        title="About Midasbuy — Our Story & Mission"
        description="Learn about Midasbuy, the official platform for PUBG Mobile UC, Free Fire diamonds and gaming currency for gamers worldwide."
        keywords="about midasbuy, gaming store, PUBG Mobile UC, Free Fire diamonds, official gaming platform"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <article className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About Midasbuy
            </h1>
            <p className="text-lg text-muted-foreground">
              Your trusted partner in mobile gaming
            </p>
          </header>

          <div className="space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
              <p className="leading-relaxed mb-4">
                Midasbuy is the world's leading digital gaming store, established as the official platform for 
                purchasing in-game currency across multiple popular mobile gaming titles. Since our launch, 
                we've served over 50 million gamers worldwide, processing millions of secure transactions monthly 
                across 200+ countries and territories.
              </p>
              <p className="leading-relaxed">
                As an official partner with major game publishers including Tencent Games, Garena, and Level Infinite, 
                we provide authentic, authorized digital content directly from the source. Our platform combines 
                cutting-edge security technology with user-friendly interfaces to deliver the safest, fastest 
                gaming currency purchasing experience available today.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="leading-relaxed mb-4">
                Our mission is to empower gamers worldwide by providing instant, secure access to the gaming 
                content they love. We believe every gamer deserves a hassle-free experience when purchasing 
                virtual currency, regardless of their location or preferred payment method.
              </p>
              <p className="leading-relaxed">
                We're committed to breaking down barriers in digital gaming commerce by supporting multiple 
                currencies, diverse payment methods, and providing 24/7 multilingual customer support. Through 
                innovation and dedication to excellence, we aim to be the trusted bridge connecting gamers 
                with their favorite gaming experiences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Why Choose Midasbuy?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-primary">Official Partnership</h3>
                  <p className="text-muted-foreground">
                    Authorized distributor for PUBG Mobile, Free Fire, Honor of Kings, and 30+ gaming titles. 
                    All purchases are 100% legitimate and directly delivered through official game APIs.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-primary">Lightning-Fast Delivery</h3>
                  <p className="text-muted-foreground">
                    Average delivery time of under 2 minutes with 98.7% instant delivery rate. Our automated 
                    system processes orders immediately with real-time status tracking.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-primary">Bank-Grade Security</h3>
                  <p className="text-muted-foreground">
                    SSL encryption, PCI DSS compliance, and multi-layer fraud protection. Your payment information 
                    is never stored and all transactions are encrypted end-to-end.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-primary">Global Payment Options</h3>
                  <p className="text-muted-foreground">
                    Support for 150+ payment methods including credit cards, digital wallets, bank transfers, 
                    and regional payment systems across all major currencies.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Gaming Titles We Support</h2>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-primary">
                  <h3 className="text-lg font-medium mb-2">PUBG Mobile UC & BGMI UC</h3>
                  <p className="text-muted-foreground mb-2">
                    Official Unknown Cash (UC) provider for PUBG Mobile and Battlegrounds Mobile India (BGMI). 
                    Purchase UC to unlock Royal Pass, premium crates, weapon skins, vehicle skins, and exclusive cosmetics. 
                    Instant delivery directly to your game account using your Player ID.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Packages range from 60 UC to 8100+ UC with bonus UC on larger purchases. Support for all regions 
                    including India, Pakistan, Middle East, Southeast Asia, and global servers.
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-primary">
                  <h3 className="text-lg font-medium mb-2">Free Fire Diamonds</h3>
                  <p className="text-muted-foreground mb-2">
                    Official diamond top-up service for Garena Free Fire and Free Fire MAX. Purchase diamonds to 
                    unlock Elite Pass, characters like Chrono and DJ Alok, weapon royales, bundles, and emotes. 
                    Direct delivery through official Garena APIs ensures account safety.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Available denominations from 50 to 2000+ diamonds. Special bonus events and promotional 
                    packages available regularly with exclusive in-game rewards.
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-primary">
                  <h3 className="text-lg font-medium mb-2">Honor of Kings Tokens</h3>
                  <p className="text-muted-foreground mb-2">
                    Authorized token provider for Honor of Kings (王者荣耀), one of the world's most popular MOBA games. 
                    Use tokens to purchase heroes, skins, battle passes, and participate in exclusive events. 
                    Full support for both Chinese and international versions.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Multiple package options available with competitive pricing and instant automated delivery 
                    to your game account within minutes.
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-primary">
                  <h3 className="text-lg font-medium mb-2">Premium PUBG Accounts</h3>
                  <p className="text-muted-foreground mb-2">
                    Verified premium PUBG Mobile accounts with UC balance, rare skins, maxed Royal Pass, and 
                    high-tier rankings. Each account comes with complete login credentials and recovery information. 
                    Perfect for players looking to start with advantages or collectors seeking rare items.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All accounts are hand-verified, include detailed video walkthroughs, and come with our 
                    buyer protection guarantee.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Numbers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">50M+</div>
                  <div className="text-sm text-muted-foreground">Gamers Served</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">200+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">98.7%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">&lt;2min</div>
                  <div className="text-sm text-muted-foreground">Avg Delivery</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Commitment to Excellence</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-primary font-semibold text-xl">✓</span>
                  <div>
                    <h3 className="font-medium mb-1">Instant Automated Delivery</h3>
                    <p className="text-muted-foreground text-sm">
                      Advanced API integration with game servers ensures UC and diamonds are delivered 
                      directly to your account within seconds of payment confirmation. Real-time order 
                      tracking available in your dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-semibold text-xl">✓</span>
                  <div>
                    <h3 className="font-medium mb-1">24/7 Multilingual Support</h3>
                    <p className="text-muted-foreground text-sm">
                      Professional support team available round-the-clock via WhatsApp, live chat, and 
                      email in English, Hindi, Urdu, Arabic, Spanish, and Portuguese. Average response 
                      time under 2 minutes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-semibold text-xl">✓</span>
                  <div>
                    <h3 className="font-medium mb-1">Competitive Market Pricing</h3>
                    <p className="text-muted-foreground text-sm">
                      Best-in-market rates with transparent pricing. Regular promotions, loyalty rewards, 
                      and bulk purchase discounts. Price match guarantee on competitor offers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-semibold text-xl">✓</span>
                  <div>
                    <h3 className="font-medium mb-1">Flexible Payment Options</h3>
                    <p className="text-muted-foreground text-sm">
                      Accept Visa, Mastercard, PayPal, Google Pay, Apple Pay, Stripe, bank transfers, 
                      UPI, Paytm, JazzCash, Easypaisa, and 150+ regional payment methods worldwide.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-semibold text-xl">✓</span>
                  <div>
                    <h3 className="font-medium mb-1">Fair & Transparent Policies</h3>
                    <p className="text-muted-foreground text-sm">
                      Clear refund policy, no hidden fees, complete transaction history, and detailed 
                      invoice for every purchase. GDPR and data protection compliant.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Global Presence & Reach</h2>
              <p className="leading-relaxed mb-4">
                Midasbuy operates as a truly global platform with localized services across Asia, Middle East, 
                Europe, Americas, Africa, and Oceania. We maintain strategic partnerships with local payment 
                providers, ensuring seamless transactions in your preferred currency and payment method.
              </p>
              <p className="leading-relaxed mb-4">
                Our infrastructure spans multiple data centers worldwide, providing 99.9% uptime and ensuring 
                fast, reliable service regardless of your geographic location. Mobile-optimized responsive 
                design allows you to purchase gaming currency on any device - smartphone, tablet, or desktop.
              </p>
              <p className="leading-relaxed">
                With dedicated regional support teams and localized customer service hours, we're always 
                available when you need us, speaking your language and understanding your local gaming culture.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Security & Account Safety</h2>
              <p className="leading-relaxed mb-4">
                Your account security and data privacy are paramount at Midasbuy. We implement multiple 
                layers of protection including 256-bit SSL encryption for all data transmission, PCI DSS Level 1 
                compliance for payment processing, and regular third-party security audits.
              </p>
              <p className="leading-relaxed mb-4">
                We never ask for your game account passwords. All top-ups are processed using official game 
                APIs with only your Player ID required. Your payment information is tokenized and never stored 
                on our servers. Two-factor authentication is available for additional account protection.
              </p>
              <p className="leading-relaxed">
                Our fraud detection system monitors transactions 24/7 to prevent unauthorized purchases and 
                protect both buyers and sellers. Every transaction is logged, encrypted, and regularly backed up 
                across geographically distributed secure servers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Environmental Responsibility</h2>
              <p className="leading-relaxed mb-4">
                As part of our commitment to sustainability, Midasbuy operates on green hosting infrastructure 
                powered by renewable energy. We've digitized all operations to minimize paper waste and 
                continuously optimize our systems for energy efficiency.
              </p>
              <p className="leading-relaxed">
                We partner with environmental organizations and contribute a portion of proceeds to global 
                reforestation efforts. Gaming can be both entertaining and environmentally conscious.
              </p>
            </section>

            <section className="text-center pt-8 border-t">
              <h2 className="text-2xl font-semibold mb-4">Join the Community</h2>
              <p className="leading-relaxed mb-6">
                Become part of the Midasbuy community and stay updated with the latest gaming 
                trends, offers, and updates. Follow us on social media and never miss out on 
                exclusive deals and promotions.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/contact-us" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  Contact Us
                </Link>
                <Link to="/help-center" className="border border-border px-6 py-3 rounded-lg hover:bg-muted transition-colors">
                  Help Center
                </Link>
              </div>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
};

export default AboutMidasbuyPage;