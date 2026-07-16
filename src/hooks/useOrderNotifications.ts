import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  user_id: string;
  package_id: string | null;
  price: number;
  status: string;
  payment_method: string;
  transaction_id: string;
  player_id: string;
  created_at: string;
  updated_at: string;
  // Currency code for the order (e.g., 'PKR', 'USD', 'RUB')
  currency_code: string | null;
  // Email tracking
  email_sent_at: string | null;
  // New product fields for non-UC orders
  product_type: string | null;
  product_name: string | null;
  product_code: string | null;
  product_amount: string | null;
  // Enriched data (loaded separately)
  profiles: {
    full_name: string;
    email: string;
  } | null;
  uc_packages: {
    name: string;
    uc_amount: number;
  } | null;
}

export function useOrderNotifications() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Function to play notification sound
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(900, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio notification not available:', error);
    }
  };

  // Load initial orders using two-step fetch (no nested joins)
  const loadOrders = async () => {
    if (isLoading) {
      console.log('Already loading orders, skipping...');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Loading orders (two-step fetch)...');
      
      // Step 1: Fetch all orders (simple select, no joins)
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error loading orders:', ordersError);
        throw ordersError;
      }

      if (!ordersData || ordersData.length === 0) {
        console.log('No orders found');
        setOrders([]);
        setIsInitialized(true);
        return;
      }

      console.log('Orders fetched:', ordersData.length);

      // Step 2: Get unique user_ids and package_ids
      const userIds = [...new Set(ordersData.map(o => o.user_id).filter(Boolean))];
      const packageIds = [...new Set(ordersData.map(o => o.package_id).filter(Boolean))];

      // Step 3: Fetch profiles for those user_ids
      let profilesMap: Record<string, { full_name: string; email: string }> = {};
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', userIds);

        if (!profilesError && profilesData) {
          profilesData.forEach(p => {
            profilesMap[p.user_id] = { full_name: p.full_name || '', email: p.email || '' };
          });
        }
      }

      // Step 4: Fetch uc_packages for those package_ids
      let packagesMap: Record<string, { name: string; uc_amount: number }> = {};
      if (packageIds.length > 0) {
        const { data: packagesData, error: packagesError } = await supabase
          .from('uc_packages')
          .select('id, name, uc_amount')
          .in('id', packageIds);

        if (!packagesError && packagesData) {
          packagesData.forEach(p => {
            packagesMap[p.id] = { name: p.name, uc_amount: p.uc_amount };
          });
        }
      }

      // Step 5: Merge data
      const enrichedOrders: Order[] = ordersData.map(order => ({
        ...order,
        profiles: profilesMap[order.user_id] || null,
        uc_packages: order.package_id ? packagesMap[order.package_id] || null : null,
      }));

      console.log('Enriched orders:', enrichedOrders.length);
      setOrders(enrichedOrders);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Always load orders on mount (don't rely on stale isInitialized)
    loadOrders();

    // Subscribe to real-time order updates
    const channel = supabase
      .channel('order_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        async (payload) => {
          console.log('New order received:', payload);
          
          const newOrder = payload.new as any;
          
          // Show toast notification
          toast({
            title: "🛒 New Order Received!",
            description: `Order #${newOrder.id.slice(0, 8)} - ₹${newOrder.price}`,
            duration: 5000,
          });

          // Play notification sound
          playNotificationSound();

          // Update order count
          setNewOrderCount(prev => prev + 1);

          // Fetch profile for this order
          let profile = null;
          if (newOrder.user_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('user_id, full_name, email')
              .eq('user_id', newOrder.user_id)
              .maybeSingle();
            if (profileData) {
              profile = { full_name: profileData.full_name || '', email: profileData.email || '' };
            }
          }

          // Fetch package for this order
          let ucPackage = null;
          if (newOrder.package_id) {
            const { data: packageData } = await supabase
              .from('uc_packages')
              .select('id, name, uc_amount')
              .eq('id', newOrder.package_id)
              .maybeSingle();
            if (packageData) {
              ucPackage = { name: packageData.name, uc_amount: packageData.uc_amount };
            }
          }

          // Note: Automatic refund email is now sent from PaymentSuccessPage when customer cancels
          // This prevents duplicate emails since useOrderNotifications only runs when admin panel is open

          // Add the new order to the current list
          setOrders(prev => {
            const exists = prev.some(o => o.id === newOrder.id);
            if (exists) return prev;
            
            return [{
              ...newOrder,
              profiles: profile,
              uc_packages: ucPackage,
            } as Order, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order updated:', payload);
          
          const updatedOrder = payload.new as any;
          
          // Show toast for status changes
          if (payload.old && payload.old.status !== updatedOrder.status) {
            toast({
              title: "📦 Order Status Updated",
              description: `Order #${updatedOrder.id.slice(0, 8)} - Status: ${updatedOrder.status}`,
              duration: 3000,
            });
          }

          // Update orders state (preserve enriched data)
          setOrders(prev => prev.map(order => 
            order.id === updatedOrder.id 
              ? { ...order, ...updatedOrder, profiles: order.profiles, uc_packages: order.uc_packages } 
              : order
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, isInitialized]);

  const markNotificationsAsRead = () => {
    setNewOrderCount(0);
  };

  return {
    orders,
    newOrderCount,
    markNotificationsAsRead,
    loadOrders,
    isLoading
  };
}
