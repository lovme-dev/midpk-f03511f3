import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, Loader2, CreditCard, RefreshCw, Home, Package, XCircle, AlertCircle, ShoppingBag, Search, X, Copy, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import trackOrderIcon from "@/assets/track-order-icon.jpeg";
import ffDiamondChestOrder from "@/assets/ff-diamond-chest-order.webp";
import robloxLogo from "@/assets/roblox-logo.jpeg";
import { formatOrderPrice } from "@/utils/formatOrderPrice";

import { diamondPackages } from "@/data/diamondPackages";
import { getCarPackageById } from "@/data/carPackages";
import { getRobuxPackageById } from "@/data/robuxPackages";
import { valorantPackages } from "@/data/valorantPackages";

// Product logos (fallbacks) for different order types
const FALLBACK_UC_LOGO = '/lovable-uploads/761111e0-3658-46db-b3d2-11cf3617f3d1.png';
const FALLBACK_VALORANT_LOGO = '/lovable-uploads/valorant-points-logo.webp';


const normalizeProductType = (t?: string | null) => (t || '').toLowerCase().trim();

const getPackageImageByOrder = (order: {
  productType?: string | null;
  packageId?: string | null;
  packageName?: string;
}): { image: string; isFreeFire: boolean; isValorant: boolean } => {
  const type = normalizeProductType(order.productType);
  const packageId = order.packageId || '';
  const packageName = (order.packageName || '').toLowerCase();

  // Free Fire Diamonds - check both type and package name for "free fire" or "freefire"
  if (type.includes('freefire') || type.includes('free fire') || 
      packageName.includes('free fire') || packageName.includes('freefire')) {
    const pkg = diamondPackages.find(p => p.id === packageId);
    return { image: pkg?.image || ffDiamondChestOrder, isFreeFire: true, isValorant: false };
  }

  // PUBG Car (use selected car's image)
  if (type.includes('car')) {
    const numericId = Number(packageId.startsWith('car-') ? packageId.replace('car-', '') : packageId);
    const pkg = Number.isFinite(numericId) ? getCarPackageById(numericId) : undefined;
    return { image: pkg?.image || FALLBACK_UC_LOGO, isFreeFire: false, isValorant: false };
  }

  // Roblox Robux (use selected package's image or Roblox logo)
  if (type.includes('roblox') || type.includes('robux') || 
      packageName.includes('roblox') || packageName.includes('robux')) {
    const pkg = packageId ? getRobuxPackageById(packageId) : undefined;
    return { image: pkg?.image || robloxLogo, isFreeFire: false, isValorant: false };
  }

  // Valorant Points (use selected package's image)
  if (type.includes('valorant') || type.includes('vp') ||
      packageName.includes('valorant') || packageName.includes('vp')) {
    const pkg = valorantPackages.find(p => p.id === packageId);
    return { image: pkg?.image || FALLBACK_VALORANT_LOGO, isFreeFire: false, isValorant: true };
  }

  // Default (PUBG UC and unknown): keep UC logo
  return { image: FALLBACK_UC_LOGO, isFreeFire: false, isValorant: false };
};

// Helper function to parse player ID (can be JSON string or plain string)
const parsePlayerId = (playerId: string | null | undefined): { id: string; name: string } => {
  if (!playerId || playerId === 'N/A') return { id: 'N/A', name: '' };
  
  try {
    // Check if it's a JSON string
    if (playerId.startsWith('{')) {
      const parsed = JSON.parse(playerId);
      return {
        id: parsed.id || playerId,
        name: parsed.name || ''
      };
    }
    // Plain string player ID
    return { id: playerId, name: '' };
  } catch {
    return { id: playerId, name: '' };
  }
};

interface RefundStatusPageProps {
  onLogout: () => void;
}

interface RefundItem {
  id: string;
  packageName: string;
  amount: number;
  currencyCode: string;
  date: Date;
  status: 'review' | 'arrived' | 'completed';
  transactionId: string;
  productType?: string | null;
  packageId?: string | null;
}

// Helper to calculate remaining time before auto-delete (48 hours from creation)
const getAutoDeleteTimeRemaining = (createdDate: Date): string | null => {
  const now = new Date();
  const deleteTime = new Date(createdDate.getTime() + 48 * 60 * 60 * 1000); // 48 hours
  const remaining = deleteTime.getTime() - now.getTime();
  
  if (remaining <= 0) return null;
  
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

interface OrderItem {
  id: string;
  packageName: string;
  amount: number;
  currencyCode: string;
  date: Date;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
  transactionId: string;
  playerId: string;
  productType?: string | null;
  packageId?: string | null;
}

const getRefundStatus = (createdAt: Date): 'review' | 'arrived' | 'completed' => {
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff >= 30) return 'completed';
  if (daysDiff >= 7) return 'arrived';
  return 'review';
};

const getStatusInfo = (status: 'review' | 'arrived' | 'completed') => {
  switch (status) {
    case 'review':
      return {
        label: 'Refund Review',
        description: 'Your refund request is being reviewed by our team',
        icon: Clock,
        color: 'text-sky-400',
        bgColor: 'bg-sky-500/20',
        borderColor: 'border-sky-400/50',
        progress: 33,
      };
    case 'arrived':
      return {
        label: 'Refund Arrived',
        description: 'Your refund is being processed by the bank',
        icon: RefreshCw,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-400/50',
        progress: 66,
      };
    case 'completed':
      return {
        label: 'Refund Completed',
        description: 'Your refund has been successfully processed',
        icon: CheckCircle2,
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-400/50',
        progress: 100,
      };
  }
};

const getOrderStatusInfo = (status: string) => {
  switch (status) {
    case 'pending':
      return { label: 'Order Pending', icon: Clock, color: 'text-yellow-400', step: 1 };
    case 'processing':
      return { label: 'Order Pending', icon: Clock, color: 'text-yellow-400', step: 1 };
    case 'completed':
      return { label: 'Order Completed', icon: CheckCircle2, color: 'text-green-400', step: 0 };
    case 'cancelled':
      return { label: 'Order Cancelled', icon: XCircle, color: 'text-gray-400', step: 2 };
    case 'failed':
      return { label: 'Failed Order', icon: AlertCircle, color: 'text-red-400', step: 3 };
    case 'refunded':
      return { label: 'Order Refunded', icon: RefreshCw, color: 'text-purple-400', step: 4 };
    default:
      return { label: 'Order Pending', icon: Clock, color: 'text-yellow-400', step: 1 };
  }
};

export default function RefundStatusPage({ onLogout }: RefundStatusPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userName, setUserName] = useState<string>("Customer");
  const [refundItems, setRefundItems] = useState<RefundItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Get initial tab from URL parameter, default to 'track'
  const initialTab = (searchParams.get('tab') as 'track' | 'failed' | 'pending' | 'completed' | 'history') || 'track';
  const [activeTab, setActiveTab] = useState<'track' | 'failed' | 'pending' | 'completed' | 'history'>(initialTab);
  
  // Transaction ID search state
  const [searchTransactionId, setSearchTransactionId] = useState('');
  const [searchResult, setSearchResult] = useState<OrderItem | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Search for order by Order ID or Transaction ID (works without login)
  const handleTransactionSearch = async () => {
    const trimmedId = searchTransactionId.trim();
    if (!trimmedId) return;
    
    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null);
    setHasSearched(true);
    
    try {
      // Try searching by Order ID first (uuid format), then by transaction_id
      let order = null;
      let error = null;
      
      // Check if it looks like a UUID (Order ID from Admin Panel)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmedId);
      
      if (isUUID) {
        // Search by Order ID (id field)
        const result = await supabase
          .from('orders')
          .select('*')
          .eq('id', trimmedId)
          .maybeSingle();
        order = result.data;
        error = result.error;
      }
      
      // If not found by ID, try by transaction_id
      if (!order && !error) {
        const result = await supabase
          .from('orders')
          .select('*')
          .eq('transaction_id', trimmedId)
          .maybeSingle();
        order = result.data;
        error = result.error;
      }
      
      if (error) {
        console.error('Search error:', error);
        setSearchError('Failed to search order');
        return;
      }
      
      if (!order) {
        setSearchError('This order does not exist');
        return;
      }
      
      // Convert to OrderItem format
      const orderItem: OrderItem = {
        id: order.id,
        packageName: order.product_name || 'Package',
        amount: order.price || 0,
        currencyCode: (order as any).currency_code || 'PKR',
        date: new Date(order.created_at || Date.now()),
        status: order.status as OrderItem['status'],
        transactionId: order.transaction_id || '',
        playerId: order.player_id || 'N/A',
        productType: order.product_type,
        packageId: order.package_id,
      };
      
      setSearchResult(orderItem);
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Failed to search order');
    } finally {
      setSearchLoading(false);
    }
  };
  
  const clearSearch = () => {
    setSearchTransactionId('');
    setSearchResult(null);
    setSearchError(null);
    setHasSearched(false);
  };

  // Delete order function (only for pending/failed orders)
  const handleDeleteOrder = async (orderId: string, orderStatus: string) => {
    if (!['pending', 'processing', 'failed'].includes(orderStatus)) {
      toast({
        title: "Cannot Delete",
        description: "Only pending or failed orders can be deleted",
        variant: "destructive",
      });
      return;
    }

    setDeletingOrderId(orderId);
    
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        console.error('Delete error:', error);
        toast({
          title: "Delete Failed",
          description: "Failed to delete order. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Remove from local state
      setOrderItems(prev => prev.filter(item => item.id !== orderId));
      setRefundItems(prev => prev.filter(item => item.id !== orderId));
      
      toast({
        title: "Order Deleted",
        description: "The order has been removed successfully",
      });
    } catch (err) {
      console.error('Delete error:', err);
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting the order",
        variant: "destructive",
      });
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Memoized function to process orders data
  const processOrdersData = useCallback((ordersRaw: any[], packagesMap: Record<string, { name: string; uc_amount: number }>) => {
    const allOrders: OrderItem[] = ordersRaw.map((order) => {
      const ucPkg = order.package_id ? packagesMap[order.package_id] : null;
      const packageName = order.product_name || ucPkg?.name || 'Package';
      return {
        id: order.id,
        packageName,
        amount: order.price || 0,
        currencyCode: order.currency_code || 'PKR',
        date: new Date(order.created_at || Date.now()),
        status: order.status as OrderItem['status'],
        transactionId: order.transaction_id || `TXN${order.id.slice(0, 8)}`,
        playerId: order.player_id || 'N/A',
        productType: order.product_type,
        packageId: order.package_id,
      };
    });
    setOrderItems(allOrders);

    const refundOrders = ordersRaw.filter(o => ['cancelled', 'refunded', 'failed'].includes(o.status || ''));
    const refunds: RefundItem[] = refundOrders.map((order) => {
      const ucPkg = order.package_id ? packagesMap[order.package_id] : null;
      const packageName = order.product_name || ucPkg?.name || 'Package';
      return {
        id: order.id,
        packageName,
        amount: order.price || 0,
        currencyCode: order.currency_code || 'PKR',
        date: new Date(order.created_at || Date.now()),
        status: order.status === 'refunded' ? 'completed' : getRefundStatus(new Date(order.created_at || Date.now())),
        transactionId: order.transaction_id || `TXN${order.id.slice(0, 8)}`,
        productType: order.product_type,
        packageId: order.package_id,
      };
    });
    setRefundItems(refunds);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!isMounted) return;
        
        if (user) {
          setCurrentUserId(user.id);
          
          // Fetch user profile and orders in parallel for faster loading
          const [profileResult, ordersResult] = await Promise.all([
            supabase
              .from('profiles')
              .select('full_name')
              .eq('user_id', user.id)
              .maybeSingle(),
            supabase
              .from('orders')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
          ]);
          
          if (!isMounted) return;
          
          if (profileResult.data?.full_name) {
            setUserName(profileResult.data.full_name.split(' ')[0]);
          }

          const ordersRaw = ordersResult.data;
          
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

  // Realtime subscription for order updates
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('user-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${currentUserId}`,
        },
        async (payload) => {
          console.log('Order realtime update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as any;
            const orderItem: OrderItem = {
              id: newOrder.id,
              packageName: newOrder.product_name || 'Package',
              amount: newOrder.price || 0,
              currencyCode: newOrder.currency_code || 'PKR',
              date: new Date(newOrder.created_at || Date.now()),
              status: newOrder.status as OrderItem['status'],
              transactionId: newOrder.transaction_id || `TXN${newOrder.id.slice(0, 8)}`,
              playerId: newOrder.player_id || 'N/A',
              productType: newOrder.product_type,
              packageId: newOrder.package_id,
            };
            setOrderItems(prev => [orderItem, ...prev]);
            toast({
              title: "New Order",
              description: `Order ${orderItem.packageName} has been placed`,
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedOrder = payload.new as any;
            setOrderItems(prev => prev.map(item => 
              item.id === updatedOrder.id 
                ? {
                    ...item,
                    status: updatedOrder.status as OrderItem['status'],
                    packageName: updatedOrder.product_name || item.packageName,
                    productType: updatedOrder.product_type ?? item.productType,
                    packageId: updatedOrder.package_id ?? item.packageId,
                  }
                : item
            ));
            
            // Update refund items if needed
              if (['cancelled', 'refunded'].includes(updatedOrder.status)) {
                const refundItem: RefundItem = {
                  id: updatedOrder.id,
                  packageName: updatedOrder.product_name || 'Package',
                  amount: updatedOrder.price || 0,
                  currencyCode: updatedOrder.currency_code || 'PKR',
                  date: new Date(updatedOrder.created_at || Date.now()),
                  status: updatedOrder.status === 'refunded' ? 'completed' : getRefundStatus(new Date(updatedOrder.created_at || Date.now())),
                  transactionId: updatedOrder.transaction_id || `TXN${updatedOrder.id.slice(0, 8)}`,
                  productType: updatedOrder.product_type,
                  packageId: updatedOrder.package_id,
                };
              setRefundItems(prev => {
                const exists = prev.find(r => r.id === refundItem.id);
                if (exists) {
                  return prev.map(r => r.id === refundItem.id ? refundItem : r);
                }
                return [refundItem, ...prev];
              });
            }
            
            toast({
              title: "Order Updated",
              description: `Order status changed to ${updatedOrder.status}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // Filter data based on active tab
  // Cancelled orders go to Refund Pending tab (these are orders from /payment-success)
  // Failed orders go to Failed Orders tab (these are orders from /payment/failed)
  const pendingRefunds = orderItems.filter(item => item.status === 'cancelled');
  const completedRefunds = refundItems.filter(item => item.status === 'completed');
  const activeOrders = orderItems.filter(item => item.status === 'pending' || item.status === 'processing');
  const failedOrders = orderItems.filter(item => item.status === 'failed');
  

  return (
    <>
      <Helmet>
        <title>Track Orders - Order Status & Refund Tracking | Midasbuy</title>
        <meta name="description" content="Track your PUBG UC, Free Fire Diamonds & gaming orders in real-time. View order status, pending refunds, and purchase history. Search orders by Transaction ID. 24/7 Order Tracking available." />
        <meta name="keywords" content="track order, order status, refund tracking, midasbuy orders, PUBG UC order, transaction ID search, gaming order history" />
        <link rel="canonical" href="https://www.middasbuy.com/track-orders" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-midasbuy-darkBlue via-midasbuy-navy to-midasbuy-darkBlue">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>
        
        <Header onLogout={onLogout} />
        
        <div className="relative pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-6"
            >
              <div className="inline-flex items-center justify-center mb-4 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-midasbuy-blue/20">
                <img
                  src={trackOrderIcon}
                  alt="Track order icon"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Track Order
              </h1>
              <p className="text-gray-400">
                Hi {userName}, track your orders below
              </p>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex justify-center flex-wrap gap-2 mb-6"
            >
              <Button
                onClick={() => setActiveTab('track')}
                size="sm"
                variant={activeTab === 'track' ? 'default' : 'outline'}
                className={activeTab === 'track' 
                  ? 'bg-midasbuy-blue hover:bg-midasbuy-blue/90 text-xs px-3 py-1.5 h-auto' 
                  : 'border-white/20 text-white hover:bg-white/10 bg-white/5 text-xs px-3 py-1.5 h-auto'}
              >
                Track Order
                {activeOrders.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-yellow-500 text-black rounded-full font-bold">
                    {activeOrders.length}
                  </span>
                )}
              </Button>
              <Button
                onClick={() => setActiveTab('failed')}
                size="sm"
                variant={activeTab === 'failed' ? 'default' : 'outline'}
                className={activeTab === 'failed' 
                  ? 'bg-red-600 hover:bg-red-600/90 text-xs px-3 py-1.5 h-auto' 
                  : 'border-white/20 text-white hover:bg-white/10 bg-white/5 text-xs px-3 py-1.5 h-auto'}
              >
                Failed Orders
                {failedOrders.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-red-400 text-white rounded-full font-bold">
                    {failedOrders.length}
                  </span>
                )}
              </Button>
              <Button
                onClick={() => setActiveTab('pending')}
                size="sm"
                variant={activeTab === 'pending' ? 'default' : 'outline'}
                className={activeTab === 'pending' 
                  ? 'bg-midasbuy-blue hover:bg-midasbuy-blue/90 text-xs px-3 py-1.5 h-auto' 
                  : 'border-white/20 text-white hover:bg-white/10 bg-white/5 text-xs px-3 py-1.5 h-auto'}
              >
                Refund Pending
                {pendingRefunds.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-orange-500 text-white rounded-full font-bold">
                    {pendingRefunds.length}
                  </span>
                )}
              </Button>
              <Button
                onClick={() => setActiveTab('completed')}
                size="sm"
                variant={activeTab === 'completed' ? 'default' : 'outline'}
                className={activeTab === 'completed' 
                  ? 'bg-green-600 hover:bg-green-600/90 text-xs px-3 py-1.5 h-auto' 
                  : 'border-white/20 text-white hover:bg-white/10 bg-white/5 text-xs px-3 py-1.5 h-auto'}
              >
                Refund Completed
                {completedRefunds.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-green-400 text-white rounded-full font-bold">
                    {completedRefunds.length}
                  </span>
                )}
              </Button>
              <Button
                onClick={() => setActiveTab('history')}
                size="sm"
                variant={activeTab === 'history' ? 'default' : 'outline'}
                className={activeTab === 'history' 
                  ? 'bg-purple-600 hover:bg-purple-600/90 text-xs px-3 py-1.5 h-auto' 
                  : 'border-white/20 text-white hover:bg-white/10 bg-white/5 text-xs px-3 py-1.5 h-auto'}
              >
                Purchase History
                {orderItems.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-purple-400 text-white rounded-full font-bold">
                    {orderItems.length}
                  </span>
                )}
              </Button>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              key={activeTab}
            >
              {loading ? (
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-12 flex justify-center items-center">
                    <Loader2 className="w-8 h-8 text-midasbuy-blue animate-spin" />
                  </CardContent>
                </Card>
              ) : activeTab === 'track' ? (
                /* Track Order Tab */
                <div className="space-y-4">
                  {/* Transaction ID Search Bar */}
                  <Card className="bg-gradient-to-br from-black/80 to-slate-950/90 border border-midasbuy-blue/30">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-white">Search Order by Order ID or Transaction ID</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              value={searchTransactionId}
                              onChange={(e) => setSearchTransactionId(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleTransactionSearch()}
                              placeholder="Enter Order ID or Transaction ID"
                              className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-midasbuy-blue"
                            />
                            {searchTransactionId && (
                              <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <Button 
                            onClick={handleTransactionSearch} 
                            disabled={searchLoading || !searchTransactionId.trim()}
                            className="bg-midasbuy-blue hover:bg-midasbuy-blue/90"
                          >
                            {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                          </Button>
                        </div>
                        
                        {/* Search Result */}
                        {hasSearched && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2"
                          >
                            {searchError ? (
                              <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                                <XCircle className="w-5 h-5 text-red-400" />
                                <span className="text-red-400 text-sm font-medium">{searchError}</span>
                              </div>
                            ) : searchResult ? (
                              <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="font-semibold text-white">{searchResult.packageName}</h4>
                                    <p className="text-xs text-gray-400">Player ID: {searchResult.playerId}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-white">{formatOrderPrice(searchResult.amount, searchResult.currencyCode)}</p>
                                    <p className="text-xs text-gray-400">
                                      {searchResult.date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 px-3 py-2 rounded-lg bg-white/5">
                                  <div className="flex items-center gap-2">
                                    {(() => {
                                      const statusInfo = getOrderStatusInfo(searchResult.status);
                                      const StatusIcon = statusInfo.icon;
                                      return (
                                        <>
                                          <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                                          <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                                        </>
                                      );
                                    })()}
                                  </div>
                                  <div className="flex items-center justify-between text-xs text-gray-400">
                                    <span>Order ID: {searchResult.id.slice(0, 8)}...</span>
                                    {searchResult.transactionId && (
                                      <span>TXN: {searchResult.transactionId}</span>
                                    )}
                                  </div>
                                </div>
                                {searchResult.status === 'cancelled' && (
                                  <p className="text-xs text-orange-400 mt-2 text-center">This order is in Refund Pending status</p>
                                )}
                                {searchResult.status === 'failed' && (
                                  <p className="text-xs text-red-400 mt-2 text-center">Payment was not completed</p>
                                )}
                                {searchResult.status === 'completed' && (
                                  <p className="text-xs text-green-400 mt-2 text-center">This order has been completed</p>
                                )}
                              </div>
                            ) : null}
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Active Orders List */}
                  {activeOrders.length === 0 ? (
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-12 text-center">
                        <div className="inline-block p-4 bg-white/5 rounded-full mb-4">
                          <Package className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No Active Orders</h3>
                        <p className="text-gray-400 text-sm">You have no pending or processing orders</p>
                      </CardContent>
                    </Card>
                  ) : (
                <div className="space-y-4">
                  {activeOrders.map((item, index) => {
                    const statusInfo = getOrderStatusInfo(item.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Card className="bg-gradient-to-br from-black/80 to-slate-950/90 border border-sky-500/30 backdrop-blur-sm shadow-lg shadow-sky-500/10 relative">
                          {/* Delete Button - Top Left */}
                          <button
                            onClick={() => handleDeleteOrder(item.id, item.status)}
                            disabled={deletingOrderId === item.id}
                            className="absolute top-2 left-2 z-10 p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 transition-all duration-200 group"
                            title="Delete order"
                          >
                            {deletingOrderId === item.id ? (
                              <Loader2 className="w-3.5 h-3.5 text-red-400 animate-spin" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-red-400 group-hover:text-red-300" />
                            )}
                          </button>
                          {/* Auto-delete timer */}
                          {(() => {
                            const remaining = getAutoDeleteTimeRemaining(item.date);
                            return remaining ? (
                              <span className="absolute top-2 right-2 z-10 text-[10px] text-gray-500 bg-black/40 px-1.5 py-0.5 rounded">
                                Auto-delete: {remaining}
                              </span>
                            ) : null;
                          })()}
                          <CardContent className="p-4 sm:p-5 pt-10 sm:pt-10">
                            {(() => {
                              const playerInfo = parsePlayerId(item.playerId);
                              return (
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                  {/* Package Icon + Details */}
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30 overflow-hidden">
                                      {(() => {
                                        const { image, isFreeFire } = getPackageImageByOrder(item);
                                        return (
                                          <img 
                                            src={image} 
                                            alt={item.packageName}
                                            className={`w-10 h-10 object-contain ${isFreeFire ? 'scale-[1.4]' : ''}`}
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = FALLBACK_UC_LOGO;
                                            }}
                                          />
                                        );
                                      })()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h3 className="font-semibold text-white text-base sm:text-lg truncate">{item.packageName}</h3>
                                      <p className="text-sm text-gray-400 truncate">ID: {playerInfo.id}</p>
                                      {playerInfo.name && (
                                        <p className="text-xs text-gray-500 truncate">IGN: {playerInfo.name}</p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Price + Date */}
                                  <div className="text-left sm:text-right pl-14 sm:pl-0 flex-shrink-0">
                                    <p className="font-bold text-white text-base sm:text-lg">{formatOrderPrice(item.amount, item.currencyCode)}</p>
                                    <p className="text-xs text-gray-400">
                                      {item.date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}
                            
                            {/* Order Status Timeline - Digital Orders */}
                            <div className="flex items-center justify-between mb-4 px-2">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusInfo.step === 1 ? 'bg-yellow-500' : 'bg-slate-600'}`}>
                                  <Clock className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs text-gray-400 mt-1 text-center">Order<br/>Pending</span>
                              </div>
                              <div className="flex-1 h-0.5 bg-slate-600 mx-2" />
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusInfo.step === 2 ? 'bg-red-500' : 'bg-slate-600'}`}>
                                  <XCircle className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs text-gray-400 mt-1 text-center">Order<br/>Cancelled</span>
                              </div>
                              <div className="flex-1 h-0.5 bg-slate-600 mx-2" />
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusInfo.step === 3 ? 'bg-orange-500' : 'bg-slate-600'}`}>
                                  <RefreshCw className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs text-gray-400 mt-1 text-center">Order<br/>Refund</span>
                              </div>
                            </div>
                            
                            {/* Status Badge */}
                            <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-sky-500/10 to-blue-600/10 border border-sky-500/20">
                              <StatusIcon className={`w-4 h-4 flex-shrink-0 ${statusInfo.color}`} />
                              <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                              <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto mt-2 sm:mt-0">
                                <span className="text-xs text-gray-400 truncate flex-1 sm:flex-initial">ID: {item.transactionId}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.transactionId);
                                    toast({ title: "Copied!", description: "Transaction ID copied to clipboard" });
                                  }}
                                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
                                  title="Copy Transaction ID"
                                >
                                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                  </div>
                  )}
                </div>
              ) : activeTab === 'failed' ? (
                /* Failed Orders Tab - Payment not completed */
                failedOrders.length === 0 ? (
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-12 text-center">
                      <div className="inline-block p-4 bg-white/5 rounded-full mb-4">
                        <AlertCircle className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No Failed Orders</h3>
                      <p className="text-gray-400 text-sm">You have no failed orders</p>
                    </CardContent>
                  </Card>
                ) : (
                <div className="space-y-4">
                  {failedOrders.map((item, index) => {
                    const statusInfo = getOrderStatusInfo(item.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Card className="bg-gradient-to-br from-black/80 to-slate-950/90 border border-red-500/30 backdrop-blur-sm shadow-lg shadow-red-500/10 relative">
                          {/* Delete Button - Top Left */}
                          <button
                            onClick={() => handleDeleteOrder(item.id, item.status)}
                            disabled={deletingOrderId === item.id}
                            className="absolute top-2 left-2 z-10 p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 transition-all duration-200 group"
                            title="Delete order"
                          >
                            {deletingOrderId === item.id ? (
                              <Loader2 className="w-3.5 h-3.5 text-red-400 animate-spin" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-red-400 group-hover:text-red-300" />
                            )}
                          </button>
                          {/* Auto-delete timer */}
                          {(() => {
                            const remaining = getAutoDeleteTimeRemaining(item.date);
                            return remaining ? (
                              <span className="absolute top-2 right-2 z-10 text-[10px] text-gray-500 bg-black/40 px-1.5 py-0.5 rounded">
                                Auto-delete: {remaining}
                              </span>
                            ) : null;
                          })()}
                          <CardContent className="p-4 sm:p-5 pt-10 sm:pt-10">
                            {(() => {
                              const playerInfo = parsePlayerId(item.playerId);
                              return (
                                <>
                                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                    {/* Package Icon + Details */}
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 overflow-hidden">
                                        {(() => {
                                          const { image, isFreeFire } = getPackageImageByOrder(item);
                                          return (
                                            <img 
                                              src={image} 
                                              alt={item.packageName}
                                              className={`w-10 h-10 object-contain ${isFreeFire ? 'scale-[1.4]' : ''}`}
                                              onError={(e) => {
                                                (e.target as HTMLImageElement).src = FALLBACK_UC_LOGO;
                                              }}
                                            />
                                          );
                                        })()}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-white text-base sm:text-lg truncate">{item.packageName}</h3>
                                        <p className="text-sm text-gray-400 truncate">ID: {playerInfo.id}</p>
                                        {playerInfo.name && (
                                          <p className="text-xs text-gray-500 truncate">IGN: {playerInfo.name}</p>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Price + Date */}
                                    <div className="text-left sm:text-right pl-14 sm:pl-0 flex-shrink-0">
                                      <p className="font-bold text-white text-base sm:text-lg">{formatOrderPrice(item.amount, item.currencyCode)}</p>
                                      <p className="text-xs text-gray-400">
                                        {item.date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Status Badge */}
                                  <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20">
                                    <StatusIcon className={`w-4 h-4 flex-shrink-0 ${statusInfo.color}`} />
                                    <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                                    <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto mt-2 sm:mt-0">
                                      <span className="text-xs text-gray-400 truncate flex-1 sm:flex-initial">ID: {item.transactionId}</span>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(item.transactionId);
                                          toast({ title: "Copied!", description: "Transaction ID copied to clipboard" });
                                        }}
                                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
                                        title="Copy Transaction ID"
                                      >
                                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <p className="text-xs text-gray-500 mt-3 text-center">Payment was not completed. This order will not be processed.</p>
                                </>
                              );
                            })()}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
                )
              ) : activeTab === 'pending' ? (
                /* Refund Pending Tab */
                pendingRefunds.length === 0 ? (
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-12 text-center">
                      <div className="inline-block p-4 bg-white/5 rounded-full mb-4">
                        <Clock className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No Pending Refunds</h3>
                      <p className="text-gray-400 text-sm">You have no pending refund requests</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pendingRefunds.map((item, index) => {
                      const statusInfo = getOrderStatusInfo(item.status);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <Card className="bg-gradient-to-br from-black/80 to-slate-950/90 border border-orange-500/30 backdrop-blur-sm shadow-lg shadow-orange-500/10">
                            <CardContent className="p-4 sm:p-5">
                              {(() => {
                                const playerInfo = parsePlayerId(item.playerId);
                                return (
                                  <>
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                      {/* Package Icon + Details */}
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-600/20 border border-orange-500/30 overflow-hidden">
                                          {(() => {
                                            const { image, isFreeFire } = getPackageImageByOrder(item);
                                            return (
                                              <img 
                                                src={image} 
                                                alt={item.packageName}
                                                className={`w-10 h-10 object-contain ${isFreeFire ? 'scale-[1.4]' : ''}`}
                                                onError={(e) => {
                                                  (e.target as HTMLImageElement).src = FALLBACK_UC_LOGO;
                                                }}
                                              />
                                            );
                                          })()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <h3 className="font-semibold text-white text-base sm:text-lg truncate">{item.packageName}</h3>
                                          <p className="text-sm text-gray-400 truncate">ID: {playerInfo.id}</p>
                                          {playerInfo.name && (
                                            <p className="text-xs text-gray-500 truncate">IGN: {playerInfo.name}</p>
                                          )}
                                        </div>
                                      </div>
                                      
                                      {/* Price + Date */}
                                      <div className="text-left sm:text-right pl-14 sm:pl-0 flex-shrink-0">
                                        <p className="font-bold text-white text-base sm:text-lg">{formatOrderPrice(item.amount, item.currencyCode)}</p>
                                        <p className="text-xs text-gray-400">
                                          {item.date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                                        <span>Refund Processing</span>
                                        <span>50%</span>
                                      </div>
                                      <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: '50%' }}
                                          transition={{ duration: 1, delay: 0.5 }}
                                          className="h-full rounded-full bg-gradient-to-r from-orange-400 via-amber-500 to-amber-600"
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-600/10 border border-orange-500/20">
                                      <Clock className="w-4 h-4 text-orange-400 flex-shrink-0" />
                                      <span className="text-sm font-medium text-orange-400">Refund Pending</span>
                                      <span className="text-xs text-gray-400 w-full sm:w-auto sm:ml-auto mt-1 sm:mt-0">Refund within 7 to 15 days</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-white/5">
                                      <span className="text-xs text-gray-400 truncate flex-1">ID: {item.transactionId}</span>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(item.transactionId);
                                          toast({ title: "Copied!", description: "Transaction ID copied to clipboard" });
                                        }}
                                        className="p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
                                        title="Copy Transaction ID"
                                      >
                                        <Copy className="w-3 h-3 text-gray-400" />
                                      </button>
                                    </div>
                                  </>
                                );
                              })()}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )
              ) : activeTab === 'completed' ? (
                /* Refund Completed Tab */
                completedRefunds.length === 0 ? (
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-12 text-center">
                      <div className="inline-block p-4 bg-white/5 rounded-full mb-4">
                        <CheckCircle2 className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No Completed Refunds</h3>
                      <p className="text-gray-400 text-sm">Your completed refunds will appear here</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {completedRefunds.map((item, index) => {
                      const statusInfo = getStatusInfo(item.status);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <Card className="bg-gradient-to-br from-black/80 to-slate-950/90 border border-green-500/30 backdrop-blur-sm shadow-lg shadow-green-500/10">
                            <CardContent className="p-4 sm:p-5">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                {/* Package Icon + Details */}
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 overflow-hidden">
                                    {(() => {
                                      const { image, isFreeFire } = getPackageImageByOrder(item);
                                      return (
                                        <img 
                                          src={image} 
                                          alt={item.packageName}
                                          className={`w-10 h-10 object-contain ${isFreeFire ? 'scale-[1.4]' : ''}`}
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src = FALLBACK_UC_LOGO;
                                          }}
                                        />
                                      );
                                    })()}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-white text-base sm:text-lg truncate">{item.packageName}</h3>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm text-gray-400 truncate">ID: {item.transactionId}</p>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(item.transactionId);
                                          toast({ title: "Copied!", description: "Transaction ID copied to clipboard" });
                                        }}
                                        className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
                                        title="Copy Transaction ID"
                                      >
                                        <Copy className="w-3 h-3 text-gray-400" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Price + Date */}
                                <div className="text-left sm:text-right pl-14 sm:pl-0 flex-shrink-0">
                                  <p className="font-bold text-white text-base sm:text-lg">{formatOrderPrice(item.amount, item.currencyCode)}</p>
                                  <p className="text-xs text-gray-400">
                                    {item.date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                <span className="text-sm font-medium text-green-400">Refund Completed</span>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )
              ) : (
                /* Purchase History Tab */
                orderItems.length === 0 ? (
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-12 text-center">
                      <div className="inline-block p-4 bg-white/5 rounded-full mb-4">
                        <ShoppingBag className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No Purchase History</h3>
                      <p className="text-gray-400 text-sm">Your purchase history will appear here</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {/* Order Statistics Summary */}
                    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-purple-500/30 backdrop-blur-sm">
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-white text-lg mb-4">Order Summary</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="bg-green-500/20 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-green-400">{orderItems.filter(o => o.status === 'completed').length}</div>
                            <div className="text-xs text-gray-400">Completed</div>
                          </div>
                          <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-yellow-400">{orderItems.filter(o => o.status === 'pending' || o.status === 'processing').length}</div>
                            <div className="text-xs text-gray-400">Pending</div>
                          </div>
                          <div className="bg-red-500/20 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-red-400">{orderItems.filter(o => o.status === 'failed').length}</div>
                            <div className="text-xs text-gray-400">Failed</div>
                          </div>
                          <div className="bg-gray-500/20 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-gray-400">{orderItems.filter(o => o.status === 'cancelled').length}</div>
                            <div className="text-xs text-gray-400">Cancelled</div>
                          </div>
                        </div>
                        <div className="mt-3 text-center text-sm text-gray-400">
                          Total Orders: {orderItems.length}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Order List */}
                    {orderItems.map((item, index) => {
                      const statusInfo = getOrderStatusInfo(item.status);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <Card className="bg-gradient-to-br from-black/80 to-slate-950/90 border border-purple-500/30 backdrop-blur-sm shadow-lg shadow-purple-500/10">
                            <CardContent className="p-4 sm:p-5">
                              {(() => {
                                const playerInfo = parsePlayerId(item.playerId);
                                return (
                                  <>
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                      {/* Package Icon + Details */}
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 overflow-hidden">
                                          {(() => {
                                            const { image, isFreeFire } = getPackageImageByOrder(item);
                                            return (
                                              <img 
                                                src={image} 
                                                alt={item.packageName}
                                                className={`w-10 h-10 object-contain ${isFreeFire ? 'scale-[1.4]' : ''}`}
                                                onError={(e) => {
                                                  (e.target as HTMLImageElement).src = FALLBACK_UC_LOGO;
                                                }}
                                              />
                                            );
                                          })()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <h3 className="font-semibold text-white text-base sm:text-lg truncate">{item.packageName}</h3>
                                          <p className="text-sm text-gray-400 truncate">ID: {playerInfo.id}</p>
                                          {playerInfo.name && (
                                            <p className="text-xs text-gray-500 truncate">IGN: {playerInfo.name}</p>
                                          )}
                                        </div>
                                      </div>
                                      
                                      {/* Price + Date */}
                                      <div className="text-left sm:text-right pl-14 sm:pl-0 flex-shrink-0">
                                        <p className="font-bold text-white text-base sm:text-lg">{formatOrderPrice(item.amount, item.currencyCode)}</p>
                                        <p className="text-xs text-gray-400">
                                          {item.date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                                      <StatusIcon className={`w-4 h-4 flex-shrink-0 ${statusInfo.color}`} />
                                      <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                                      <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto mt-2 sm:mt-0">
                                        <span className="text-xs text-gray-400 truncate flex-1 sm:flex-initial">ID: {item.transactionId}</span>
                                        <button
                                          onClick={() => {
                                            navigator.clipboard.writeText(item.transactionId);
                                            toast({ title: "Copied!", description: "Transaction ID copied to clipboard" });
                                          }}
                                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
                                          title="Copy Transaction ID"
                                        >
                                          <Copy className="w-3.5 h-3.5 text-gray-400" />
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                );
                              })()}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )
              )}
            </motion.div>

            {/* Bottom Actions - Only Back to Home */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex justify-center"
            >
              <Button
                onClick={() => navigate("/")}
                className="bg-midasbuy-blue hover:bg-midasbuy-blue/90"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
