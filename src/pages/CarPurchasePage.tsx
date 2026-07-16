import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { carPackages, CarPackage } from "@/data/carPackages";
import LoadingScreen from "@/components/LoadingScreen";
import MidasCheckoutModal from "@/components/checkout/MidasCheckoutModal";
import { UCPackage } from "@/data/ucPackages";
import { COUNTRY_DATA } from "@/utils/gameSeoConfigs";
import { useURLBasedPricing } from "@/hooks/useURLBasedPricing";

interface CarPurchasePageProps {
  onLogout: () => void;
  disableSeo?: boolean;
}

const CarPurchasePage = ({ onLogout, disableSeo = false }: CarPurchasePageProps) => {
  const { countryCode } = useParams<{ countryCode?: string }>();
  
  // Get country data from URL or default to US
  const countryCodeUpper = (countryCode || 'US').toUpperCase();
  const countryData = COUNTRY_DATA[countryCodeUpper] || COUNTRY_DATA['US'];
  
  // Get URL-based pricing
  const { formatPrice, currencyCode, currencySymbol, countryName } = useURLBasedPricing();
  
  // SEO Configuration for PUBG Car Skins
  const seoTitle = `Buy PUBG Mobile Car Skins ${countryData.name} | Premium Vehicles ${countryData.currencySymbol} | Midasbuy`;
  const seoDescription = `Buy PUBG Mobile premium car skins in ${countryData.name}. ⚡ Porsche, McLaren, Lamborghini vehicles at best ${countryData.currency} prices. Instant delivery. Official Midasbuy store.`;
  const seoKeywords = `pubg car skins ${countryData.name.toLowerCase()}, pubg vehicles ${countryData.name.toLowerCase()}, pubg mobile car ${countryData.currency}, buy pubg car, pubg vehicle skins, porsche pubg, mclaren pubg, lamborghini pubg, midasbuy car skins`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Store",
        "@id": `https://www.middasbuy.com/midasbuy/${countryCode?.toLowerCase() || 'us'}/buy/car#store`,
        "name": `Midasbuy PUBG Car Skins Store ${countryData.name}`,
        "description": `Official store for PUBG Mobile premium car skins in ${countryData.name}`,
        "url": `https://www.middasbuy.com/midasbuy/${countryCode?.toLowerCase() || 'us'}/buy/car`,
        "parentOrganization": {
          "@id": "https://www.middasbuy.com/#organization"
        }
      },
      {
        "@type": "WebPage",
        "@id": `https://www.middasbuy.com/midasbuy/${countryCode?.toLowerCase() || 'us'}/buy/car#webpage`,
        "url": `https://www.middasbuy.com/midasbuy/${countryCode?.toLowerCase() || 'us'}/buy/car`,
        "name": seoTitle,
        "description": seoDescription,
        "isPartOf": {
          "@id": "https://www.middasbuy.com/#website"
        },
        "about": {
          "@type": "Thing",
          "name": "PUBG Mobile Car Skins"
        }
      }
    ]
  };
  
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarPackage | null>(null);
  const navigate = useNavigate();
  
  // Convert CarPackage to UCPackage format for the modal
  const convertToUCPackage = (car: CarPackage): UCPackage => {
    return {
      id: `car-${car.id}`,
      baseAmount: 0,
      bonusAmount: 0,
      price: car.price,
      originalPrice: car.originalPrice,
      discount: `-${Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100)}%`,
      bonusPercent: "0%",
      image: car.image
    };
  };

  useEffect(() => {
    // Preload all car images for faster loading
    carPackages.forEach(car => {
      const img = new Image();
      img.src = car.image;
      img.onload = () => {
        setImagesLoaded(prev => ({
          ...prev,
          [car.id]: true
        }));
      };
    });

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleCarPurchase = (carId: number) => {
    const car = carPackages.find(c => c.id === carId);
    if (car) {
      setSelectedCar(car);
      setShowCheckoutModal(true);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <LoadingScreen message="loading..." />;
  }

  return (
    <div className="min-h-screen bg-midasbuy-darkBlue overflow-x-hidden relative">
      {/* SEO Meta Tags - Only render if not disabled */}
      {!disableSeo && (
        <Helmet>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
          <meta name="keywords" content={seoKeywords} />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href={`https://www.middasbuy.com/midasbuy/${countryCode?.toLowerCase() || 'us'}/buy/car`} />
          
          {/* Open Graph Tags */}
          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDescription} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`https://www.middasbuy.com/midasbuy/${countryCode?.toLowerCase() || 'us'}/buy/car`} />
          <meta property="og:image" content="https://www.middasbuy.com/lovable-uploads/porsche-cayenne-red.jpeg" />
          <meta property="og:site_name" content="Midasbuy Official Store" />
          
          {/* Twitter Cards */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoTitle} />
          <meta name="twitter:description" content={seoDescription} />
          <meta name="twitter:image" content="https://www.middasbuy.com/lovable-uploads/porsche-cayenne-red.jpeg" />
          
          {/* Additional SEO Tags */}
          <meta name="theme-color" content="#1E40AF" />
          <meta name="application-name" content="Midasbuy" />
          
          {/* Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        </Helmet>
      )}
      
      <Header onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8 relative z-20">
        {/* Car Packages Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Back Button */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Button
              onClick={handleBack}
              variant="ghost"
              className="text-white hover:text-midasbuy-blue hover:bg-white/10 flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back
            </Button>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {carPackages.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="bg-white/5 border-white/10 hover:border-midasbuy-blue/50 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                     {/* Car Image */}
                     <div className="relative overflow-hidden">
                       <img
                         src={car.image}
                         alt={car.name}
                         className={`w-full h-48 object-cover group-hover:scale-110 transition-all duration-300 ${imagesLoaded[car.id] ? 'opacity-100' : 'opacity-50'}`}
                         loading="eager"
                       />
                     </div>
                    
                    {/* Car Details */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2">{car.name}</h3>
                      <p className="text-gray-300 text-sm mb-4">{car.description}</p>
                      
                        {/* Price Section */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-midasbuy-blue">
                                  {formatPrice(car.price)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 line-through text-sm">
                                  {formatPrice(car.originalPrice)}
                                </span>
                              </div>
                            </div>
                            <span className="text-green-400 text-sm font-medium">
                              Save {formatPrice(car.originalPrice - car.price)}
                            </span>
                          </div>
                        </div>
                      
                       {/* Purchase Button */}
                        <Button
                          onClick={() => handleCarPurchase(car.id)}
                         className="w-full bg-gradient-to-r from-midasbuy-blue to-blue-600 hover:from-blue-600 hover:to-midasbuy-blue text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                       >
                         Purchase Car
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
      
      {/* Checkout Modal */}
      {selectedCar && (
        <MidasCheckoutModal
          open={showCheckoutModal}
          onOpenChange={setShowCheckoutModal}
          packageData={convertToUCPackage(selectedCar)}
          isPubgCar={true}
          carName={selectedCar.name}
          carDescription={selectedCar.description}
        />
      )}
    </div>
  );
};

export default CarPurchasePage;
