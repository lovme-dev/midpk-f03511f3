import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResponsive } from "@/hooks/use-mobile";
import { convertPrice } from "@/utils/currencyUtils";
import { getCurrencySymbol } from "@/utils/urlCurrencyDetector";
import PromotionCarouselBanner from "@/components/PromotionCarouselBanner";
import MidasCheckoutModal from "@/components/checkout/MidasCheckoutModal";
import { UCPackage } from "@/data/ucPackages";

// Import product images
import elitePass50 from "@/assets/shop/a18-elite-pass-50.jpeg";
import elitePass100 from "@/assets/shop/a18-elite-pass-100.jpeg";
import elitePassPlus from "@/assets/shop/a18-elite-pass-plus.jpeg";
import firstPurchasePack from "@/assets/shop/first-purchase-pack.jpeg";
import firearmMaterialsPack from "@/assets/shop/firearm-materials-pack.jpeg";
import mythicEmblemPack from "@/assets/shop/mythic-emblem-pack.jpeg";
import prime1Month from "@/assets/shop/prime-1month.jpeg";
import prime3Months from "@/assets/shop/prime-3months.jpeg";
import prime6Months from "@/assets/shop/prime-6months.jpeg";
import prime12Months from "@/assets/shop/prime-12months.jpeg";
import primePlus1Month from "@/assets/shop/prime-plus-1month.jpeg";
import primePlus3Months from "@/assets/shop/prime-plus-3months.jpeg";
import primePlus6Months from "@/assets/shop/prime-plus-6months.jpeg";
import weeklyMythicPack from "@/assets/shop/weekly-mythic-pack.jpeg";
import weeklyDealPack1 from "@/assets/shop/weekly-deal-pack-1.jpeg";
import weeklyDealPack2 from "@/assets/shop/weekly-deal-pack-2.jpeg";

// Categories for filtering
const categories = [
  { id: "rp", label: "RP" },
  { id: "growthgift", label: "Growthgift" },
  { id: "subscriptiongift", label: "Subscriptiongift" },
  { id: "weekly-deal", label: "Weekly Deal Pack" },
  { id: "all", label: "All" },
];

// promoSlides removed - now using shared PromotionCarouselBanner component

// Shop products data - each unique product
interface ShopProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  pricePrefix?: string;
  image: string;
  category: string;
  discount?: string;
  badge?: string;
  badgeColor?: string;
}

const shopProducts: ShopProduct[] = [
  // RP Category - Elite Pass (A18)
  {
    id: "a18-elite-pass-50",
    name: "A18 ELITE PASS (LV1-50)",
    price: 1499,
    originalPrice: 1619,
    pricePrefix: "From",
    image: elitePass50,
    category: "rp",
    discount: "-7.41%",
  },
  {
    id: "a18-elite-pass-100",
    name: "ELITE PASS (LV1-100)",
    price: 2999,
    originalPrice: 3239,
    pricePrefix: "From",
    image: elitePass100,
    category: "rp",
    discount: "-7.4%",
  },
  {
    id: "a18-elite-pass-plus",
    name: "ELITE PASS PLUS (LV1-100)",
    price: 7499,
    originalPrice: 8099,
    pricePrefix: "From",
    image: elitePassPlus,
    category: "rp",
    discount: "-7.4%",
  },
  // Growthgift Category
  {
    id: "first-purchase-pack",
    name: "First Purchase Pack",
    price: 249,
    pricePrefix: "From",
    image: firstPurchasePack,
    category: "growthgift",
    discount: "-50%",
  },
  {
    id: "firearm-materials",
    name: "Upgradable Firearm Materials Pack",
    price: 749,
    pricePrefix: "From",
    image: firearmMaterialsPack,
    category: "growthgift",
    discount: "-30%",
  },
  {
    id: "mythic-emblem",
    name: "Mythic Emblem Pack",
    price: 1249,
    pricePrefix: "From",
    image: mythicEmblemPack,
    category: "growthgift",
    discount: "-25%",
  },
  // Subscriptiongift Category - Prime (all unique)
  {
    id: "prime-1month",
    name: "Prime (1 Month)",
    price: 249,
    pricePrefix: "From",
    image: prime1Month,
    category: "subscriptiongift",
    discount: "-10%",
  },
  {
    id: "prime-3months",
    name: "Prime (3 Months)",
    price: 749,
    pricePrefix: "From",
    image: prime3Months,
    category: "subscriptiongift",
    discount: "-10%",
  },
  {
    id: "prime-6months",
    name: "Prime (6 Months)",
    price: 1499,
    pricePrefix: "From",
    image: prime6Months,
    category: "subscriptiongift",
    discount: "-10%",
  },
  {
    id: "prime-12months",
    name: "Prime (12 Months)",
    price: 2999,
    pricePrefix: "From",
    image: prime12Months,
    category: "subscriptiongift",
    discount: "-10%",
  },
  // Prime Plus (all unique)
  {
    id: "prime-plus-1month",
    name: "Prime Plus (1 Month)",
    price: 2499,
    pricePrefix: "From",
    image: primePlus1Month,
    category: "subscriptiongift",
    discount: "-15%",
  },
  {
    id: "prime-plus-3months",
    name: "Prime Plus (3 Months)",
    price: 7499,
    pricePrefix: "From",
    image: primePlus3Months,
    category: "subscriptiongift",
    discount: "-15%",
  },
  {
    id: "prime-plus-6months",
    name: "Prime Plus (6 Months)",
    price: 14999,
    pricePrefix: "From",
    image: primePlus6Months,
    category: "subscriptiongift",
    discount: "-15%",
  },
  // Weekly Deal Pack (all unique)
  {
    id: "weekly-mythic-pack",
    name: "Weekly Mythic Emblem Value Pack",
    price: 749,
    pricePrefix: "From",
    image: weeklyMythicPack,
    category: "weekly-deal",
    discount: "-70%",
  },
  {
    id: "weekly-deal-pack-1",
    name: "Weekly Deal Pack 1",
    price: 249,
    pricePrefix: "From",
    image: weeklyDealPack1,
    category: "weekly-deal",
    discount: "-75%",
  },
  {
    id: "weekly-deal-pack-2",
    name: "Weekly Deal Pack 2",
    price: 749,
    pricePrefix: "From",
    image: weeklyDealPack2,
    category: "weekly-deal",
    discount: "-70%",
  },
];

type TabType = "purchase" | "redeem" | "shop" | "events";

interface ShopProductsContentProps {
  onTabChange?: (tab: TabType) => void;
}

const ShopProductsContent = ({ onTabChange }: ShopProductsContentProps) => {
  const { isMobile } = useResponsive();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [currency, setCurrency] = useState("PKR");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPkg, setCheckoutPkg] = useState<UCPackage | null>(null);
  const [checkoutTitle, setCheckoutTitle] = useState("");
  const [checkoutImage, setCheckoutImage] = useState("");
  const [checkoutLabel, setCheckoutLabel] = useState("Pack");

  // Detect user's country/currency from URL or localStorage
  useEffect(() => {
    const getStoredCurrency = () => {
      try {
        // First check URL for country code
        const pathParts = window.location.pathname.split('/');
        const countryIndex = pathParts.findIndex(part => part === 'midasbuy') + 1;
        const urlCountryCode = pathParts[countryIndex]?.toLowerCase();
        
        if (urlCountryCode === 'pk') {
          setCurrency('PKR');
          return;
        }
        
        // Check localStorage
        const storedCountry = localStorage.getItem('selectedCountry');
        if (storedCountry) {
          const countryData = JSON.parse(storedCountry);
          if (countryData.code === 'pk') {
            setCurrency('PKR');
          } else {
            setCurrency(countryData.currency || 'USD');
          }
        } else if (urlCountryCode && urlCountryCode !== 'pk') {
          // Non-PK country in URL, use USD
          setCurrency('USD');
        } else {
          // Default to USD for global users
          setCurrency('USD');
        }
      } catch {
        setCurrency('USD');
      }
    };

    getStoredCurrency();

    // Listen for country/currency changes
    const handleCurrencyChange = () => getStoredCurrency();
    window.addEventListener('countryChanged', handleCurrencyChange);
    window.addEventListener('currencyChange', handleCurrencyChange);

    return () => {
      window.removeEventListener('countryChanged', handleCurrencyChange);
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, []);

  // Convert PKR price to user's currency
  const formatProductPrice = (pricePKR: number): string => {
    if (currency === 'PKR') {
      return `${pricePKR.toLocaleString()} PKR`;
    }
    // Convert from PKR to USD first (base), then to target currency
    const usdPrice = pricePKR / 278.55; // PKR to USD rate
    const convertedPrice = convertPrice(usdPrice, currency);
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };

  // Promo carousel now uses shared PromotionCarouselBanner component

  // Filter products based on category and price range
  const filteredProducts = shopProducts.filter((product) => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }
    if (minPrice && product.price < parseInt(minPrice)) {
      return false;
    }
    if (maxPrice && product.price > parseInt(maxPrice)) {
      return false;
    }
    return true;
  });

  const handleClearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
  };

  const handleAddToCart = (product: ShopProduct) => {
    // Skip checkout for packages with price 249 or 749 (show Coming Soon)
    if (product.price === 249 || product.price === 749) {
      toast({
        title: "Coming Soon",
        description: `${product.name} checkout is not available yet.`,
      });
      return;
    }
    
    // Only allow checkout for packages >= 1000 PKR
    if (product.price < 1000) {
      toast({
        title: "Coming Soon",
        description: `${product.name} checkout is not available yet.`,
      });
      return;
    }

    // Determine label
    let label = "Pack";
    if (product.category === "rp") label = "Royal Pass";
    else if (product.category === "subscriptiongift") label = product.name.includes("Plus") ? "Prime Plus" : "Prime";
    else if (product.category === "growthgift") label = "Pack";

    // Convert ShopProduct -> UCPackage shape (modal expects this)
    const ucPkg: UCPackage = {
      id: product.id,
      image: product.image,
      baseAmount: 1,
      bonusAmount: 0,
      price: product.price,
      originalPrice: product.originalPrice ?? product.price,
      discount: product.discount ?? "",
    } as UCPackage;

    setCheckoutPkg(ucPkg);
    setCheckoutTitle(product.name);
    setCheckoutImage(product.image);
    setCheckoutLabel(label);
    setCheckoutOpen(true);
  };

  return (
    <div className="py-4 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Promotional Banner Carousel - Same as Purchase/Redeem tabs */}
        <PromotionCarouselBanner className="mb-6 sm:mb-8 mt-2" />

        {/* Category Tabs - Scrollable on mobile with filter icon */}
        <div className="flex items-center gap-2 mb-4 sm:mb-6 mt-4">
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white shadow-lg shadow-[#0072ff]/30"
                      : "bg-[#2a3a50]/60 text-gray-300 hover:bg-[#2a3a50]"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          {/* Filter Icon - Mobile only */}
          <button 
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="sm:hidden p-2 bg-[#2a3a50]/60 rounded-lg text-gray-300 hover:bg-[#2a3a50] transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content - Filter Sidebar + Products Grid */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Price Filter Sidebar - Hidden on mobile unless filter icon clicked */}
          <AnimatePresence>
            {(showMobileFilter || !isMobile) && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full sm:w-48 flex-shrink-0 overflow-hidden"
              >
                <div className="bg-[#1e2a3a]/60 rounded-lg p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={handleClearFilters}
                      className="flex items-center gap-1 text-gray-400 text-xs hover:text-white transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear
                    </button>
                  </div>
                  
                  <h3 className="text-white text-sm font-medium mb-3">Price Range</h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="number"
                      placeholder="Mini"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-[#0f1923] border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-midasbuy-blue"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Up to"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-[#0f1923] border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-midasbuy-blue"
                    />
                  </div>
                  
                  <button className="w-full bg-midasbuy-blue text-white font-medium py-2 rounded text-sm hover:bg-midasbuy-blue/80 transition-colors">
                    Filter
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-[#1e2a3a]/80 rounded-lg overflow-hidden border border-white/10 hover:border-midasbuy-blue/50 transition-all group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Discount badge — red gradient for the 3 weekly-deal items, yellow→orange for everything else */}
                    {product.discount && (
                      <div className={`absolute bottom-0 left-0 right-0 py-0.5 px-2 flex items-center justify-center ${
                        product.category === "weekly-deal"
                          ? "bg-gradient-to-r from-[#ff5e3a] via-[#ff2d55] to-[#d8002a]"
                          : "bg-gradient-to-r from-[#f5c518] via-[#f5a623] to-[#ff7a18]"
                      }`}>
                        <span className="text-white text-[11px] sm:text-xs font-bold drop-shadow-sm">
                          {product.discount}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-2 sm:p-3">
                    <h3 className="text-white text-xs sm:text-sm font-medium mb-2 sm:mb-3 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="font-bold text-sm sm:text-base" style={{ color: '#f5a623' }}>
                          {product.pricePrefix && (
                            <span className="text-xs font-normal mr-1" style={{ color: '#f5a623' }}>
                              {product.pricePrefix}
                            </span>
                          )}
                          {formatProductPrice(product.price)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-gray-500 text-xs line-through">
                            {formatProductPrice(product.originalPrice)}
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-gradient-to-r from-[#00c6ff] to-[#0072ff] px-3 py-1.5 rounded-full hover:opacity-90 transition-all shadow-md shadow-[#0072ff]/40 flex items-center justify-center"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4 text-white" strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout modal for shop products (RP, Growthgift, Subscriptiongift) */}
      <MidasCheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        packageData={checkoutPkg}
        isShopProduct={true}
        shopProductTitle={checkoutTitle}
        shopProductImage={checkoutImage}
        shopProductLabel={checkoutLabel}
      />
    </div>
  );
};

export default ShopProductsContent;
