import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Filter, Search, X, Loader2, CheckCircle, Clock, XCircle, AlertCircle, ClipboardPaste } from "lucide-react";
import Header from "@/components/Header";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import OrderDetailSheet from "@/components/OrderDetailSheet";
import OrderFilterSheet from "@/components/OrderFilterSheet";
import { formatOrderPrice } from "@/utils/formatOrderPrice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Game logos - using the same icons from banner sections
import pubgMobileLogo from "@/assets/pubg-mobile-logo.png";
import bgmiLogo from "@/assets/bgmi-logo.jpeg";
import robloxLogo from "@/assets/roblox-logo.jpeg";

// Game logos from public folder (matching ShopTabContent)
const FREEFIRE_LOGO = '/lovable-uploads/624ac7f0-c182-4f1e-b919-938374f4af9d.png';
const VALORANT_LOGO = '/lovable-uploads/valorant-points-logo.webp';
const HONOROFKINGS_LOGO = '/lovable-uploads/ca9555b1-e949-4084-8def-830689dfcfab.png';

interface OrderCenterPageProps {
  onLogout: () => void;
}

interface OrderItem {
  id: string;
  gameName: string;
  productLabel: string;
  ucAmount: number;
  bonusAmount: number; // Bonus UC/Diamonds amount (from product_amount like "10+5")
  price: number;
  currencyCode: string;
  date: Date;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed' | 'refund_review' | 'refunded';
  transactionId: string;
  playerId: string;
  productType?: string | null;
  paymentMethod?: string;
  username?: string;
}

// Get game logo based on product type
const getGameLogo = (productType?: string | null, gameName?: string): string => {
  const type = (productType || '').toLowerCase();
  const name = (gameName || '').toLowerCase();
  
  if (type.includes('freefire') || type.includes('free fire') || name.includes('free fire')) {
    return FREEFIRE_LOGO;
  }
  if (type.includes('bgmi') || name.includes('bgmi')) {
    return bgmiLogo;
  }
  if (type.includes('roblox') || type.includes('robux') || name.includes('roblox')) {
    return robloxLogo;
  }
  if (type.includes('valorant') || name.includes('valorant')) {
    return VALORANT_LOGO;
  }
  if (type.includes('honorofkings') || type.includes('honor') || name.includes('honor of kings') || name.includes('hok')) {
    return HONOROFKINGS_LOGO;
  }
  // Default to PUBG Mobile logo
  return pubgMobileLogo;
};

// Get game name based on product type
const getGameName = (productType?: string | null): string => {
  const type = (productType || '').toLowerCase();
  
  if (type.includes('freefire') || type.includes('free fire')) {
    return 'FREE FIRE';
  }
  if (type.includes('bgmi')) {
    return 'BGMI';
  }
  if (type.includes('roblox') || type.includes('robux')) {
    return 'ROBLOX';
  }
  if (type.includes('valorant')) {
    return 'VALORANT';
  }
  if (type.includes('honorofkings') || type.includes('honor')) {
    return 'HONOR OF KINGS';
  }
  return 'PUBG MOBILE';
};

// Get game name from product name (fallback for old orders)
const getGameNameFromProductName = (productName?: string | null): string => {
  const name = (productName || '').toLowerCase();
  
  if (name.includes('robux') || name.includes('roblox')) {
    return 'ROBLOX';
  }
  if (name.includes('diamond') || name.includes('free fire')) {
    return 'FREE FIRE';
  }
  if (name.includes('vp') || name.includes('valorant')) {
    return 'VALORANT';
  }
  if (name.includes('bgmi')) {
    return 'BGMI';
  }
  if (name.includes('token') || name.includes('honor') || name.includes('hok')) {
    return 'HONOR OF KINGS';
  }
  // Default to PUBG if UC or no match
  return 'PUBG MOBILE';
};

// Get currency label based on product type (Robux, Diamond, UC, VP, Tokens)
const getCurrencyLabel = (productType?: string | null): string => {
  const type = (productType || '').toLowerCase();
  
  if (type.includes('roblox') || type.includes('robux')) {
    return 'Robux';
  }
  if (type.includes('freefire') || type.includes('free fire')) {
    return 'Diamond';
  }
  if (type.includes('valorant')) {
    return 'VP';
  }
  if (type.includes('honorofkings') || type.includes('honor')) {
    return 'Tokens';
  }
  // Default for PUBG/BGMI
  return 'UC';
};

// Get currency label from product name (fallback for old orders)
const getCurrencyLabelFromProductName = (productName?: string | null): string => {
  const name = (productName || '').toLowerCase();
  
  if (name.includes('robux') || name.includes('roblox')) {
    return 'Robux';
  }
  if (name.includes('diamond') || name.includes('free fire')) {
    return 'Diamond';
  }
  if (name.includes('vp') || name.includes('valorant')) {
    return 'VP';
  }
  if (name.includes('token') || name.includes('honor') || name.includes('hok')) {
    return 'Tokens';
  }
  // Default to UC for PUBG/BGMI
  return 'UC';
};
type TabType = 'all' | 'to_pay' | 'completed' | 'cancelled' | 'track';

export default function OrderCenterPage({ onLogout }: OrderCenterPageProps) {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filters, setFilters] = useState<{ timeRange: string | null; game: string | null }>({
    timeRange: null,
    game: null,
  });
  
  // Track tab states
  const [searchTransactionId, setSearchTransactionId] = useState('');
  const [searchResult, setSearchResult] = useState<OrderItem | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Helper function to parse player_id (can be JSON string or plain string)
  const parsePlayerId = (rawPlayerId: string | null | undefined): { id: string; name: string } => {
    if (!rawPlayerId) return { id: 'N/A', name: '' };
    
    // Try to parse as JSON first (new format: {"id":"xxx","name":"yyy"})
    try {
      if (rawPlayerId.startsWith('{') && rawPlayerId.includes('"id"')) {
        const parsed = JSON.parse(rawPlayerId);
        return {
          id: parsed.id || 'N/A',
          name: parsed.name || '',
        };
      }
    } catch (e) {
      // Not JSON, continue with other parsing
    }
    
    // Check for format: "12345 (username)" or "12345(username)"
    const playerIdMatch = rawPlayerId.match(/^(\d+)\s*\((.+)\)$/);
    if (playerIdMatch) {
      return {
        id: playerIdMatch[1],
        name: playerIdMatch[2],
      };
    }
    
    // Plain player ID (just numbers)
    return { id: rawPlayerId, name: '' };
  };

  // Helper function to extract UC/Diamond amount from product_name
  const extractAmountFromProductName = (productName: string | null | undefined): number => {
    if (!productName) return 0;
    // Match patterns like "2250 UC", "25 Diamonds", "660 + 67 Bonus UC", etc.
    const match = productName.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Helper function to extract bonus amount from product_amount (e.g., "10+5" -> 5)
  const extractBonusAmount = (productAmount: string | null | undefined): number => {
    if (!productAmount) return 0;
    // Match patterns like "10+5", "2000+250", etc.
    const match = productAmount.match(/\+\s*(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Helper function to extract bonus from product_name (e.g., "10+5 Robux" -> 5)
  const extractBonusFromProductName = (productName: string | null | undefined): number => {
    if (!productName) return 0;
    // Match patterns like "10+5 UC", "100+10 Robux", etc.
    const match = productName.match(/\+\s*(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Memoized function to process orders data
  const processOrdersData = useCallback((ordersRaw: any[], packagesMap: Record<string, { name: string; uc_amount: number }>) => {
    const allOrders: OrderItem[] = ordersRaw.map((order) => {
      const ucPkg = order.package_id ? packagesMap[order.package_id] : null;
      
      // Get game name - try product_type first, fallback to product_name
      let gameName = getGameName(order.product_type);
      if (gameName === 'PUBG MOBILE' && order.product_name) {
        // If default PUBG, check product_name for other games
        const nameFromProduct = getGameNameFromProductName(order.product_name);
        if (nameFromProduct !== 'PUBG MOBILE') {
          gameName = nameFromProduct;
        }
      }
      
      // Get currency label - try product_type first, fallback to product_name
      let currencyLabel = getCurrencyLabel(order.product_type);
      if (currencyLabel === 'UC' && order.product_name) {
        // If default UC, check product_name for other currencies
        const labelFromProduct = getCurrencyLabelFromProductName(order.product_name);
        if (labelFromProduct !== 'UC') {
          currencyLabel = labelFromProduct;
        }
      }
      
      // Priority for UC amount: 1. package uc_amount, 2. product_amount (base only), 3. extract from product_name
      let ucAmount = 0;
      let bonusAmount = 0;
      
      if (ucPkg?.uc_amount) {
        ucAmount = ucPkg.uc_amount;
      } else if (order.product_amount) {
        // Extract base amount (before +) and bonus amount (after +)
        const baseMatch = order.product_amount.match(/^(\d+)/);
        ucAmount = baseMatch ? parseInt(baseMatch[1], 10) : 0;
        bonusAmount = extractBonusAmount(order.product_amount);
      } else if (order.product_name) {
        ucAmount = extractAmountFromProductName(order.product_name);
        bonusAmount = extractBonusFromProductName(order.product_name);
      }
      
      // Parse player_id properly (handles JSON, parentheses format, and plain strings)
      const playerData = parsePlayerId(order.player_id);
      
      return {
        id: order.id,
        gameName,
        productLabel: currencyLabel,
        ucAmount,
        bonusAmount,
        price: order.price || 0,
        currencyCode: order.currency_code || 'PKR',
        date: new Date(order.created_at || Date.now()),
        status: order.status as OrderItem['status'],
        transactionId: order.transaction_id || `TXN${order.id.slice(0, 8)}`,
        playerId: playerData.id,
        productType: order.product_type,
        paymentMethod: order.payment_method || 'redeem',
        username: playerData.name,
      };
    });
    
    // Set only real orders from database
    setOrderItems(allOrders);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!isMounted) return;
        
        if (user) {
          setCurrentUserId(user.id);
          
          // Fetch orders
          const { data: ordersRaw, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (!isMounted) return;

          if (ordersRaw && ordersRaw.length > 0) {
            // Fetch UC packages for enrichment
            const packageIds = [...new Set(ordersRaw.map(o => o.package_id).filter(Boolean))];
            let packagesMap: Record<string, { name: string; uc_amount: number }> = {};
            
            if (packageIds.length > 0) {
              const { data: packages } = await supabase
                .from('uc_packages')
                .select('id, name, uc_amount')
                .in('id', packageIds);
              if (!isMounted) return;
              packages?.forEach(p => { packagesMap[p.id] = { name: p.name, uc_amount: p.uc_amount }; });
            }

            processOrdersData(ordersRaw, packagesMap);
          }
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [processOrdersData]);

  // Calculate time filter date
  const getTimeFilterDate = (timeRange: string | null): Date | null => {
    if (!timeRange) return null;
    const now = new Date();
    switch (timeRange) {
      case '1month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case '3months':
        return new Date(now.setMonth(now.getMonth() - 3));
      case '6months':
        return new Date(now.setMonth(now.getMonth() - 6));
      case '1year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return null;
    }
  };

  // Filter orders based on active tab, time range, and game
  const filteredOrders = orderItems.filter(order => {
    // Tab filter
    let passesTabFilter = true;
    switch (activeTab) {
      case 'to_pay':
        passesTabFilter = order.status === 'pending' || order.status === 'processing';
        break;
      case 'completed':
        passesTabFilter = order.status === 'completed';
        break;
      case 'cancelled':
        passesTabFilter = order.status === 'cancelled' || order.status === 'failed';
        break;
      default:
        passesTabFilter = true;
    }
    
    if (!passesTabFilter) return false;
    
    // Time range filter
    if (filters.timeRange) {
      const filterDate = getTimeFilterDate(filters.timeRange);
      if (filterDate && order.date < filterDate) {
        return false;
      }
    }
    
    // Game filter
    if (filters.game) {
      const gameNameLower = order.gameName.toLowerCase();
      const filterGameLower = filters.game.toLowerCase();
      if (!gameNameLower.includes(filterGameLower) && 
          !filterGameLower.includes(gameNameLower.split(' ')[0])) {
        return false;
      }
    }
    
    return true;
  });

  const handleApplyFilters = (newFilters: { timeRange: string | null; game: string | null }) => {
    setFilters(newFilters);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return 'To Pay';
      case 'completed':
        return 'Complete';
      case 'cancelled':
        return 'Cancelled';
      case 'failed':
        return 'Failed';
      case 'refund_review':
        return 'Refund Review';
      case 'refunded':
        return 'Refunded';
      default:
        return status;
    }
  };

  // Handle Track Order Search - works without login
  const handleTransactionSearch = async () => {
    const trimmedId = searchTransactionId.trim();
    if (!trimmedId) {
      setSearchError('Please enter an Order ID or Transaction ID');
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null);
    setHasSearched(true);

    try {
      // Use backend function so tracking works for guests too (RLS-safe)
      const normalized = trimmedId.replace(/\s+/g, '');
      const { data, error } = await supabase.functions.invoke('track-order', {
        body: { query: normalized },
      });
      if (error) throw error;

      const orderData = data?.order ?? null;
      
      if (!orderData) {
        setSearchError('Order not found. Please check the ID and try again.');
        return;
      }
      
      // Process the order data
      let packagesMap: Record<string, { name: string; uc_amount: number }> = {};
      if (orderData.package_id) {
        const { data: packages } = await supabase
          .from('uc_packages')
          .select('id, name, uc_amount')
          .eq('id', orderData.package_id);
        packages?.forEach(p => { packagesMap[p.id] = { name: p.name, uc_amount: p.uc_amount }; });
      }
      
      const ucPkg = orderData.package_id ? packagesMap[orderData.package_id] : null;
      
      // Get game name
      let gameName = getGameName(orderData.product_type);
      if (gameName === 'PUBG MOBILE' && orderData.product_name) {
        const nameFromProduct = getGameNameFromProductName(orderData.product_name);
        if (nameFromProduct !== 'PUBG MOBILE') {
          gameName = nameFromProduct;
        }
      }
      
      // Get currency label
      let currencyLabel = getCurrencyLabel(orderData.product_type);
      if (currencyLabel === 'UC' && orderData.product_name) {
        const labelFromProduct = getCurrencyLabelFromProductName(orderData.product_name);
        if (labelFromProduct !== 'UC') {
          currencyLabel = labelFromProduct;
        }
      }
      
      // Extract amounts
      let ucAmount = 0;
      let bonusAmount = 0;
      
      if (ucPkg?.uc_amount) {
        ucAmount = ucPkg.uc_amount;
      } else if (orderData.product_amount) {
        const baseMatch = orderData.product_amount.match(/^(\d+)/);
        ucAmount = baseMatch ? parseInt(baseMatch[1], 10) : 0;
        bonusAmount = extractBonusAmount(orderData.product_amount);
      } else if (orderData.product_name) {
        ucAmount = extractAmountFromProductName(orderData.product_name);
        bonusAmount = extractBonusFromProductName(orderData.product_name);
      }
      
      const playerData = parsePlayerId(orderData.player_id);
      
      const processedOrder: OrderItem = {
        id: orderData.id,
        gameName,
        productLabel: currencyLabel,
        ucAmount,
        bonusAmount,
        price: orderData.price || 0,
        currencyCode: orderData.currency_code || 'PKR',
        date: new Date(orderData.created_at || Date.now()),
        status: orderData.status as OrderItem['status'],
        transactionId: orderData.transaction_id || `TXN${orderData.id.slice(0, 8)}`,
        playerId: playerData.id,
        productType: orderData.product_type,
        paymentMethod: orderData.payment_method || 'redeem',
        username: playerData.name,
      };
      
      setSearchResult(processedOrder);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('An error occurred while searching. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTransactionId('');
    setSearchResult(null);
    setSearchError(null);
    setHasSearched(false);
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'to_pay', label: 'To Pay' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'track', label: 'Track' },
  ];

  return (
    <>
      <Helmet>
        <title>Order Record - Order Center | Midasbuy</title>
        <meta name="description" content="View your PUBG UC order history and track order status. Check completed, pending, and cancelled orders in one place." />
        <meta name="keywords" content="order center, order record, PUBG UC orders, midasbuy orders, order history" />
        <link rel="canonical" href="https://www.middasbuy.com/order-center" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
        {/* Blue glow effect from top-left - Intense and focused (header to tabs area only) */}
        <div 
          className="absolute top-0 left-0 w-[400px] h-[280px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 100% at 0% 0%, rgba(59, 130, 246, 0.35) 0%, rgba(59, 130, 246, 0.18) 35%, rgba(59, 130, 246, 0.06) 60%, transparent 85%)',
          }}
        />
        
        <Header onLogout={onLogout} />
        
        <div className="relative pt-20 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header Title */}
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xl md:text-2xl font-bold text-white mb-5 uppercase tracking-wide"
            >
              ORDER RECORD
            </motion.h1>

            {/* Tabs (single line + scrollable) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center gap-2 mb-5"
            >
              {/* Scrollable tabs: ... Cancelled -> Track (same order) */}
              <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-2.5 py-1.5 rounded-full text-[11px] md:text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                      activeTab === tab.key
                        ? 'bg-[#3b7ddd] text-white'
                        : 'bg-[#1e2d42] text-[#8b9cb8] hover:bg-[#263549]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Filter Button - fixed on right */}
              <button
                onClick={() => setFilterSheetOpen(true)}
                className={`p-1.5 px-2.5 rounded-full transition-all duration-200 flex-shrink-0 ${
                  filters.timeRange || filters.game
                    ? 'bg-[#3b7ddd] text-white'
                    : 'bg-[#1e2d42] text-[#8b9cb8] hover:bg-[#263549]'
                }`}
                aria-label="Filter orders"
              >
                <Filter className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Track Tab Content */}
            {activeTab === 'track' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="space-y-4"
              >
                {/* Search Box */}
                <div className="bg-[#0f1a2b] rounded-2xl p-4">
                  <h3 className="text-white font-medium text-sm mb-3">Search Order by Order ID</h3>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        placeholder="Enter Order ID or Transaction ID..."
                        value={searchTransactionId}
                        onChange={(e) => setSearchTransactionId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleTransactionSearch()}
                        className="bg-[#1a2a3f] border-none text-white placeholder:text-[#5a6a7e] pl-10 pr-12 h-11"
                        style={{ WebkitUserSelect: 'text', userSelect: 'text', WebkitTouchCallout: 'default', touchAction: 'auto' }}
                      />

                      {searchTransactionId && (
                        <button
                          onClick={clearSearch}
                          className="absolute left-2 top-1/2 -translate-y-1/2 text-[#5a6a7e] hover:text-white"
                          title="Clear"
                          aria-label="Clear"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      {/* Paste Button (right) */}
                      <button
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) setSearchTransactionId(text.trim());
                          } catch {
                            // ignore
                          }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5a6a7e] hover:text-[#3b7ddd] transition-colors p-1"
                        title="Paste"
                        aria-label="Paste"
                      >
                        <ClipboardPaste className="w-4 h-4" />
                      </button>
                    </div>
                    <Button
                      onClick={handleTransactionSearch}
                      disabled={searchLoading || !searchTransactionId.trim()}
                      className="bg-[#3b7ddd] hover:bg-[#2d6bc9] text-white px-4 h-11"
                    >
                      {searchLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Search Results */}
                {searchLoading && (
                  <div className="bg-[#0f1a2b] rounded-2xl p-8 flex justify-center">
                    <Loader2 className="w-8 h-8 text-[#3b7ddd] animate-spin" />
                  </div>
                )}

                {searchError && hasSearched && !searchLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#0f1a2b] rounded-2xl p-6 border border-red-500/30"
                  >
                    <div className="flex items-center gap-3 text-red-400">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{searchError}</p>
                    </div>
                  </motion.div>
                )}

                {searchResult && !searchLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-[#0f1a2b] rounded-2xl overflow-hidden border ${
                      searchResult.status === 'completed' ? 'border-green-500/30' :
                      searchResult.status === 'cancelled' || searchResult.status === 'failed' ? 'border-red-500/30' :
                      searchResult.status === 'refund_review' || searchResult.status === 'refunded' ? 'border-emerald-500/30' :
                      'border-yellow-500/30'
                    }`}
                  >
                    {/* Status Header */}
                    <div className={`px-4 py-3 flex items-center gap-2 ${
                      searchResult.status === 'completed' ? 'bg-green-500/10' :
                      searchResult.status === 'cancelled' || searchResult.status === 'failed' ? 'bg-red-500/10' :
                      searchResult.status === 'refund_review' || searchResult.status === 'refunded' ? 'bg-emerald-500/10' :
                      'bg-yellow-500/10'
                    }`}>
                      {searchResult.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : searchResult.status === 'cancelled' || searchResult.status === 'failed' ? (
                        <XCircle className="w-5 h-5 text-red-400" />
                      ) : searchResult.status === 'refund_review' || searchResult.status === 'refunded' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-400" />
                      )}
                      <span className={`font-medium text-sm ${
                        searchResult.status === 'completed' ? 'text-green-400' :
                        searchResult.status === 'cancelled' || searchResult.status === 'failed' ? 'text-red-400' :
                        searchResult.status === 'refund_review' || searchResult.status === 'refunded' ? 'text-emerald-400' :
                        'text-yellow-400'
                      }`}>
                        Order {searchResult.status === 'completed' ? 'Completed' :
                               searchResult.status === 'cancelled' ? 'Cancelled' :
                               searchResult.status === 'failed' ? 'Failed' :
                               searchResult.status === 'refund_review' ? 'Refund Review' :
                               searchResult.status === 'refunded' ? 'Refunded' :
                               searchResult.status === 'processing' ? 'Processing' : 'Pending'}
                      </span>
                    </div>

                    {/* Order Details */}
                    <div className="p-4 space-y-3">
                      {/* Game Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1a2a3f]">
                          <img
                            src={getGameLogo(searchResult.productType, searchResult.gameName)}
                            alt={searchResult.gameName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = pubgMobileLogo;
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm">{searchResult.gameName}</h4>
                          <p className="text-[#8b9cb8] text-xs">
                            {searchResult.ucAmount > 0 ? `${searchResult.ucAmount} ${searchResult.productLabel}` : searchResult.productLabel}
                            {searchResult.bonusAmount > 0 && (
                              <span className="text-amber-400"> +{searchResult.bonusAmount}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b border-[#1a2a3f]">
                          <span className="text-[#8b9cb8]">Order ID</span>
                          <span className="text-white font-mono text-xs">{searchResult.id.slice(0, 8)}...</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#1a2a3f]">
                          <span className="text-[#8b9cb8]">Player ID</span>
                          <span className="text-white">
                            {searchResult.playerId}
                            {searchResult.username && <span className="text-[#5a6a7e]"> ({searchResult.username})</span>}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#1a2a3f]">
                          <span className="text-[#8b9cb8]">Price</span>
                          <span className="text-white font-medium">{formatOrderPrice(searchResult.price, searchResult.currencyCode)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#1a2a3f]">
                          <span className="text-[#8b9cb8]">Date</span>
                          <span className="text-white">
                            {searchResult.date.toLocaleDateString('en-US', { 
                              day: 'numeric',
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-[#8b9cb8]">Transaction ID</span>
                          <span className="text-white font-mono text-xs">{searchResult.transactionId}</span>
                        </div>
                      </div>

                      {/* View Full Details Button */}
                      <Button
                        onClick={() => {
                          setSelectedOrder(searchResult);
                          setSheetOpen(true);
                        }}
                        variant="outline"
                        className="w-full mt-2 border-[#1a2a3f] text-[#8b9cb8] hover:bg-[#1a2a3f] hover:text-white"
                      >
                        View Full Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Initial State - No search yet */}
                {!hasSearched && !searchLoading && (
                  <div className="bg-[#0f1a2b] rounded-2xl p-8 text-center">
                    <Search className="w-12 h-12 text-[#3b7ddd]/50 mx-auto mb-3" />
                    <p className="text-[#8b9cb8] text-sm">Enter your Order ID or Transaction ID to track your order status</p>
                  </div>
                )}
              </motion.div>
            ) : (
              /* Orders List - Card with subtle dark background */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-[#0f1a2b] rounded-2xl overflow-hidden"
              >
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-[#8b9cb8]">No orders found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#1a2a3f]">
                    {filteredOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className="px-4 py-4 cursor-pointer hover:bg-[#141f30] transition-colors"
                        onClick={() => {
                          setSelectedOrder(order);
                          setSheetOpen(true);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Game Logo - Smaller square icon like in banner */}
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-[#1a2a3f]">
                            <img
                              src={getGameLogo(order.productType, order.gameName)}
                              alt={order.gameName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = pubgMobileLogo;
                              }}
                            />
                          </div>

                          {/* Order Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm leading-tight">
                              {order.gameName}
                            </h3>
                            <p className="text-xs text-[#8b9cb8] mt-0.5">
                              {order.productLabel}
                            </p>
                            <p className="text-xs text-[#5a6a7e] mt-0.5">
                              {order.date.toLocaleDateString('en-US', { 
                                month: 'numeric', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}, {order.date.toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit', 
                                second: '2-digit',
                                hour12: true 
                              })}
                            </p>
                            <p className={`text-xs mt-0.5 ${
                              order.status === 'completed' ? 'text-green-400' :
                              order.status === 'cancelled' || order.status === 'failed' ? 'text-red-400' :
                              order.status === 'refund_review' || order.status === 'refunded' ? 'text-emerald-400' :
                              'text-yellow-400'
                            }`}>
                              {getStatusLabel(order.status)}
                            </p>
                          </div>

                          {/* Value Amount + Chevron */}
                          <div className="flex items-center gap-0.5 flex-shrink-0 self-center">
                            <span className={`text-white font-medium ${
                              // Adjust font size based on value length
                              (order.ucAmount > 0 ? String(order.ucAmount).length : String(Math.round(order.price)).length) > 4
                                ? 'text-xs'
                                : 'text-base'
                            }`}>
                              {order.ucAmount > 0 ? order.ucAmount : Math.round(order.price)}
                            </span>
                            <ChevronRight className="w-4 h-4 text-[#5a6a7e]" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Order Detail Sheet */}
        <OrderDetailSheet
          order={selectedOrder}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
        />

        {/* Order Filter Sheet */}
        <OrderFilterSheet
          open={filterSheetOpen}
          onOpenChange={setFilterSheetOpen}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
        />
      </div>
    </>
  );
}
