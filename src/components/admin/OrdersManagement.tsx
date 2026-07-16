import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useOrderNotifications } from '@/hooks/useOrderNotifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatOrderPrice } from '@/utils/formatOrderPrice';
import { EmailPreviewDialog, EmailCustomizations } from '@/components/admin/EmailPreviewDialog';
import { RecalculateOrdersDialog } from '@/components/admin/RecalculateOrdersDialog';
import { ArchivedOrdersDialog } from '@/components/admin/ArchivedOrdersDialog';
import { 
  Search, 
  Download, 
  Eye, 
  Mail, 
  Filter, 
  Calendar,
  CheckSquare,
  Square,
  Send,
  Clock,
  DollarSign,
  User,
  Package,
  Copy,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
  currency_code: string | null;
  email_sent_at: string | null;
  // New product fields for non-UC orders
  product_type: string | null;
  product_name: string | null;
  product_code: string | null;
  product_amount: string | null;
  profiles: {
    full_name: string;
    email: string;
  } | null;
  uc_packages: {
    name: string;
    uc_amount: number;
  } | null;
}

interface EmailTemplate {
  subject: string;
  body: string;
}

const emailTemplates: Record<string, EmailTemplate> = {
  confirmation: {
    subject: "Order Confirmation - Your UC Purchase",
    body: "Dear {customerName},\n\nYour order has been confirmed!\n\nOrder Details:\n- Package: {packageName}\n- Amount: {amount} UC\n- Price: ₹{price}\n- Order ID: {orderId}\n\nThank you for your purchase!\n\nBest regards,\nMidasbuy Team"
  },
  completion: {
    subject: "Order Completed - UC Delivered",
    body: "Dear {customerName},\n\nGreat news! Your UC has been delivered to your account.\n\nOrder Details:\n- Package: {packageName}\n- Amount: {amount} UC\n- Player ID: {playerId}\n- Order ID: {orderId}\n\nEnjoy your game!\n\nBest regards,\nMidasbuy Team"
  },
  denial: {
    subject: "Order Update - Action Required",
    body: "Dear {customerName},\n\nWe need to discuss your recent order.\n\nOrder Details:\n- Package: {packageName}\n- Order ID: {orderId}\n\nPlease contact us for further assistance.\n\nBest regards,\nMidasbuy Team"
  },
  refund: {
    subject: "Refund Processed",
    body: "Dear {customerName},\n\nYour refund has been processed.\n\nOrder Details:\n- Package: {packageName}\n- Refund Amount: ₹{price}\n- Order ID: {orderId}\n\nThe refund will reflect in your account within 5-7 business days.\n\nBest regards,\nMidasbuy Team"
  }
};

// Country to language mapping for email language detection
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  'PKR': 'PK', 'INR': 'IN', 'BDT': 'BD', 'NPR': 'NP', 'LKR': 'LK',
  'RUB': 'RU', 'UAH': 'UA', 'KZT': 'KZ', 'UZS': 'UZ', 'GEL': 'GE',
  'AED': 'AE', 'SAR': 'SA', 'QAR': 'QA', 'KWD': 'KW', 'BHD': 'BH', 'OMR': 'OM', 'JOD': 'JO', 'EGP': 'EG',
  'TRY': 'TR', 'ILS': 'IL', 'IRR': 'IR', 'IQD': 'IQ',
  'IDR': 'ID', 'MYR': 'MY', 'THB': 'TH', 'VND': 'VN', 'PHP': 'PH', 'SGD': 'SG',
  'JPY': 'JP', 'KRW': 'KR', 'CNY': 'CN', 'TWD': 'TW', 'HKD': 'HK',
  'EUR': 'EU', 'GBP': 'GB', 'USD': 'US', 'CAD': 'CA', 'AUD': 'AU',
  'BRL': 'BR', 'MXN': 'MX', 'ARS': 'AR', 'CLP': 'CL', 'COP': 'CO', 'PEN': 'PE',
  'NGN': 'NG', 'ZAR': 'ZA', 'KES': 'KE', 'GHS': 'GH', 'TZS': 'TZ', 'UGX': 'UG',
};

const COUNTRY_TO_LANGUAGE: Record<string, { code: string; name: string; flag: string }> = {
  PK: { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  IN: { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  BD: { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  RU: { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  UA: { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  KZ: { code: 'kk', name: 'Kazakh', flag: '🇰🇿' },
  TR: { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  SA: { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  AE: { code: 'ar', name: 'Arabic', flag: '🇦🇪' },
  EG: { code: 'ar', name: 'Arabic', flag: '🇪🇬' },
  ID: { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  MY: { code: 'ms', name: 'Malay', flag: '🇲🇾' },
  TH: { code: 'th', name: 'Thai', flag: '🇹🇭' },
  VN: { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  PH: { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
  JP: { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  KR: { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  CN: { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  BR: { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  MX: { code: 'es', name: 'Spanish', flag: '🇲🇽' },
  DE: { code: 'de', name: 'German', flag: '🇩🇪' },
  FR: { code: 'fr', name: 'French', flag: '🇫🇷' },
  IT: { code: 'it', name: 'Italian', flag: '🇮🇹' },
  ES: { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  NL: { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  PL: { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  US: { code: 'en', name: 'English', flag: '🇺🇸' },
  GB: { code: 'en', name: 'English', flag: '🇬🇧' },
  CA: { code: 'en', name: 'English', flag: '🇨🇦' },
  AU: { code: 'en', name: 'English', flag: '🇦🇺' },
  NG: { code: 'en', name: 'English', flag: '🇳🇬' },
  ZA: { code: 'en', name: 'English', flag: '🇿🇦' },
  KE: { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
  EU: { code: 'en', name: 'English', flag: '🇪🇺' },
};

// Get email language info from currency code
const getEmailLanguageInfo = (currencyCode: string | null): { code: string; name: string; flag: string } => {
  if (!currencyCode) return { code: 'en', name: 'English', flag: '🌐' };
  const country = CURRENCY_TO_COUNTRY[currencyCode.toUpperCase()];
  if (!country) return { code: 'en', name: 'English', flag: '🌐' };
  return COUNTRY_TO_LANGUAGE[country] || { code: 'en', name: 'English', flag: '🌐' };
};

// Helper function to parse player_id correctly
const parsePlayerId = (playerId: string | null): string => {
  if (!playerId) return 'N/A';
  
  // Check if it's JSON format
  try {
    if (playerId.startsWith('{') || playerId.startsWith('[')) {
      const parsed = JSON.parse(playerId);
      // If it's an object with id field, extract it
      if (parsed && typeof parsed === 'object') {
        return parsed.id || parsed.player_id || JSON.stringify(parsed).substring(0, 20) + '...';
      }
      return String(parsed);
    }
  } catch {
    // Not JSON, return as is
  }
  
  return playerId;
};

// Order ID Cell with Copy functionality - Shows Transaction ID (same as customer sees)
const OrderIdCell = ({ transactionId }: { transactionId: string }) => {
  const [copied, setCopied] = useState(false);
  
  // Extract the short unique part from transaction_id (e.g., "ORD-1769505708418-kte8k508f" -> "kte8k508f")
  const getShortDisplay = () => {
    if (!transactionId) return 'N/A';
    const parts = transactionId.split('-');
    if (parts.length >= 3) {
      // Show last part which is the unique identifier
      return parts[parts.length - 1].toUpperCase();
    }
    return transactionId.substring(0, 8);
  };
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transactionId || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-foreground" title={transactionId}>
        {getShortDisplay()}
      </span>
      <button
        onClick={handleCopy}
        className="p-1 hover:bg-muted rounded transition-colors"
        title="Copy Order ID"
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3 text-muted-foreground" />
        )}
      </button>
    </div>
  );
};

// Player ID Cell with proper parsing
const PlayerIdCell = ({ playerId }: { playerId: string | null }) => {
  const [copied, setCopied] = useState(false);
  const displayId = parsePlayerId(playerId);
  
  const handleCopy = async () => {
    if (!playerId) return;
    try {
      await navigator.clipboard.writeText(displayId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-xs sm:text-sm bg-muted px-2 py-1 rounded text-foreground max-w-[120px] truncate">
        {displayId}
      </span>
      {playerId && displayId !== 'N/A' && (
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-muted rounded transition-colors"
          title="Copy Player ID"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3 text-muted-foreground" />
          )}
        </button>
      )}
    </div>
  );
};

// Inline Email Editor for table rows
const InlineEmailEditor = ({
  order,
  onEmailUpdate
}: {
  order: Order;
  onEmailUpdate: (newEmail: string) => Promise<void>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState(order.profiles?.email || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editedEmail || editedEmail === order.profiles?.email) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onEmailUpdate(editedEmail);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update email:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedEmail(order.profiles?.email || '');
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          type="email"
          value={editedEmail}
          onChange={(e) => setEditedEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-6 text-xs w-28 sm:w-36"
          autoFocus
          disabled={isSaving}
        />
        <Button 
          size="sm" 
          className="h-6 px-2 text-xs"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? '...' : '✓'}
        </Button>
        <Button 
          size="sm" 
          variant="ghost"
          className="h-6 px-2 text-xs"
          onClick={() => {
            setIsEditing(false);
            setEditedEmail(order.profiles?.email || '');
          }}
          disabled={isSaving}
        >
          ✕
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2 group">
      <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
      <p className="text-xs sm:text-sm text-primary truncate max-w-[80px] sm:max-w-full">
        {order.profiles?.email || 'No email'}
      </p>
      <button
        onClick={() => {
          setEditedEmail(order.profiles?.email || '');
          setIsEditing(true);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-primary hover:underline"
        title="Edit Email"
      >
        ✏️
      </button>
    </div>
  );
};

// Editable Customer Info Section
const CustomerInfoSection = ({ 
  order, 
  onEmailUpdate 
}: { 
  order: Order; 
  onEmailUpdate: (newEmail: string) => Promise<void>; 
}) => {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editedEmail, setEditedEmail] = useState(order.profiles?.email || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveEmail = async () => {
    if (!editedEmail || editedEmail === order.profiles?.email) {
      setIsEditingEmail(false);
      return;
    }
    setIsSaving(true);
    try {
      await onEmailUpdate(editedEmail);
      setIsEditingEmail(false);
    } catch (error) {
      console.error('Failed to update email:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-muted/20 p-4 rounded-lg">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <User className="h-4 w-4" />
        Customer Information
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="font-medium">{order.profiles?.full_name || 'No name'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Email
            {!isEditingEmail && (
              <button 
                onClick={() => {
                  setEditedEmail(order.profiles?.email || '');
                  setIsEditingEmail(true);
                }}
                className="text-xs text-primary hover:underline"
              >
                ✏️ Edit
              </button>
            )}
          </p>
          {isEditingEmail ? (
            <div className="flex flex-col gap-2 mt-1">
              <Input
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                placeholder="customer@example.com"
                className="h-8 text-sm"
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={handleSaveEmail}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => setIsEditingEmail(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="font-medium">{order.profiles?.email || 'No email'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export function OrdersManagement() {
  const { orders: liveOrders, newOrderCount, markNotificationsAsRead, loadOrders } = useOrderNotifications();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  // Email preview state
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false);
  const [emailPreviewOrder, setEmailPreviewOrder] = useState<Order | null>(null);
  const [emailPreviewType, setEmailPreviewType] = useState<'confirmation' | 'refund'>('confirmation');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  // Use live orders directly, no need for local state duplication
  const orders = useMemo(() => {
    return Array.isArray(liveOrders) ? liveOrders : [];
  }, [liveOrders]);

  // Initialize data loading once (stable, no re-runs)
  const hasInitializedRef = React.useRef(false);
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const init = async () => {
      setLoading(true);
      try {
        await loadOrders();
        markNotificationsAsRead();
      } catch (error) {
        console.error('Failed to initialize orders:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Optimized order stats calculation - separate Failed and Cancelled
  const orderStats = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const pending = orders.filter(o => o.status === 'pending').length;
    // Failed = payment not completed (customer backed out before payment)
    const failed = orders.filter(o => o.status === 'failed').length;
    // Cancelled = payment completed but order cancelled (will be refunded)
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const refunded = orders.filter(o => o.status === 'refunded').length;
    const gopayfast = orders.filter(o => o.payment_method === 'gopayfast').length;
    
    return { total, completed, pending, failed, cancelled, refunded, gopayfast };
  }, [orders]);

  // Archived orders count (separate query)
  const [archivedCount, setArchivedCount] = useState(0);
  useEffect(() => {
    const fetchArchivedCount = async () => {
      const { count, error } = await supabase
        .from('orders_archive')
        .select('*', { count: 'exact', head: true });
      if (!error && count !== null) {
        setArchivedCount(count);
      }
    };
    fetchArchivedCount();
  }, []);

  // Handle email update for customer profile
  const handleEmailUpdate = async (order: Order, newEmail: string) => {
    try {
      // Update email in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ email: newEmail, updated_at: new Date().toISOString() })
        .eq('user_id', order.user_id);

      if (profileError) throw profileError;

      // Log admin action
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.rpc('log_admin_action', {
          p_admin_id: user.id,
          p_action_type: 'update_customer_email',
          p_target_id: order.id,
          p_details: { 
            old_email: order.profiles?.email,
            new_email: newEmail,
            user_id: order.user_id
          },
        });
      }

      toast({
        title: "✅ Email Updated",
        description: `Customer email updated to ${newEmail}. Refund emails ab isi address pe jayengi.`,
      });

      // Reload orders to reflect the change
      await loadOrders();
    } catch (error) {
      console.error('Error updating email:', error);
      toast({
        title: "Email Update Failed",
        description: "Customer email update karne mein masla hua",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Find the order to get details for email
      const orderToUpdate = orders.find(o => o.id === orderId);
      
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.rpc('log_admin_action', {
          p_admin_id: user.id,
          p_action_type: 'update_order_status',
          p_target_id: orderId,
          p_details: { new_status: newStatus },
        });
      }

      // Send push notification to user about order status change
      if (orderToUpdate) {
        const packageName = orderToUpdate.uc_packages?.name || orderToUpdate.product_name || 'Package';
        
        try {
          await supabase.functions.invoke('send-order-status-notification', {
            body: {
              user_id: orderToUpdate.user_id,
              order_id: orderToUpdate.id,
              new_status: newStatus,
              order_details: {
                packageName,
              },
            },
          });
          console.log('[OrdersManagement] Push notification sent for status:', newStatus);
        } catch (pushError) {
          console.error('Failed to send push notification:', pushError);
        }
        
        // Notify admins when order is cancelled or failed
        if (newStatus === 'cancelled' || newStatus === 'failed') {
          try {
            await supabase.functions.invoke('notify-admin-new-order', {
              body: {
                event_type: 'order_cancelled',
                order_details: {
                  order_id: orderToUpdate.id,
                  package_name: packageName,
                  price: orderToUpdate.price || 0,
                  player_id: orderToUpdate.player_id || 'N/A',
                },
              },
            });
            console.log('[OrdersManagement] Admin notification sent for cancelled order');
          } catch (notifyError) {
            console.error('Failed to notify admins about cancellation:', notifyError);
          }
        }

        // 🔥 AUTOMATIC REFUND EMAIL: Send when order is cancelled OR refund_review (if email not already sent)
        // Check email_sent_at to prevent duplicate emails
        if ((newStatus === 'cancelled' || newStatus === 'refund_review') && !orderToUpdate.email_sent_at) {
          try {
            const ucAmount = orderToUpdate.uc_packages?.uc_amount || parseInt(orderToUpdate.product_amount || '0') || 0;
            
            await supabase.functions.invoke('send-order-email', {
              body: {
                userId: orderToUpdate.user_id,
                orderId: orderToUpdate.id,
                emailType: 'refund',
                orderDetails: {
                  packageName,
                  ucAmount,
                  price: orderToUpdate.price || 0,
                  paymentMethod: orderToUpdate.payment_method || 'Unknown',
                  playerId: orderToUpdate.player_id || 'N/A',
                  transactionId: orderToUpdate.transaction_id || orderToUpdate.id,
                  productType: orderToUpdate.product_type || null,
                  productName: orderToUpdate.product_name || null,
                  productCode: orderToUpdate.product_code || null,
                  productAmount: orderToUpdate.product_amount || null,
                  currencyCode: orderToUpdate.currency_code || 'PKR',
                },
              },
            });
            console.log('[OrdersManagement] Automatic refund email sent for order:', newStatus);
            toast({
              title: "آٹومیٹک ای میل بھیج دی گئی",
              description: "Customer کو refund email خود بخود بھیج دی گئی",
            });
          } catch (emailError) {
            console.error('Failed to send automatic refund email:', emailError);
            toast({
              title: "Email Error",
              description: "Automatic refund email بھیجنے میں مسئلہ ہوا",
              variant: "destructive",
            });
          }
        }
      }

      // Send refund email when status is changed to refunded (manual trigger) - only if not already sent
      if (newStatus === 'refunded' && orderToUpdate && !orderToUpdate.email_sent_at) {
        try {
          const ucAmount = orderToUpdate.uc_packages?.uc_amount || parseInt(orderToUpdate.product_amount || '0') || 0;
          const packageName = orderToUpdate.uc_packages?.name || orderToUpdate.product_name || 'Package';
          
          await supabase.functions.invoke('send-order-email', {
            body: {
              userId: orderToUpdate.user_id,
              orderId: orderToUpdate.id,
              emailType: 'refund',
              orderDetails: {
                packageName,
                ucAmount,
                price: orderToUpdate.price || 0,
                paymentMethod: orderToUpdate.payment_method || 'Unknown',
                playerId: orderToUpdate.player_id || 'N/A',
                transactionId: orderToUpdate.transaction_id || orderToUpdate.id,
                productType: orderToUpdate.product_type || null,
                productName: orderToUpdate.product_name || null,
                productCode: orderToUpdate.product_code || null,
                productAmount: orderToUpdate.product_amount || null,
                currencyCode: orderToUpdate.currency_code || 'PKR',
              },
            },
          });
          toast({
            title: "Refund Email Sent",
            description: "Customer has been notified about the refund",
          });
        } catch (emailError) {
          console.error('Failed to send refund email:', emailError);
        }
      }

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });

      // Order will be updated via real-time subscription, no need to reload
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const bulkUpdateStatus = async () => {
    if (!bulkStatus || selectedOrders.size === 0) return;

    try {
      const orderIds = Array.from(selectedOrders);
      const { error } = await supabase
        .from('orders')
        .update({ status: bulkStatus, updated_at: new Date().toISOString() })
        .in('id', orderIds);

      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        for (const orderId of orderIds) {
          await supabase.rpc('log_admin_action', {
            p_admin_id: user.id,
            p_action_type: 'bulk_update_order_status',
            p_target_id: orderId,
            p_details: { new_status: bulkStatus },
          });
        }
      }

      toast({
        title: "Success",
        description: `${orderIds.length} orders updated successfully`,
      });

      setSelectedOrders(new Set());
      setBulkStatus('');
      // Orders will be updated via real-time subscription, no need to reload
    } catch (error) {
      console.error('Error bulk updating orders:', error);
      toast({
        title: "Error",
        description: "Failed to update orders",
        variant: "destructive",
      });
    }
  };

  const exportOrders = () => {
    const csv = [
      ['Order ID', 'Customer Name', 'Email', 'Package', 'Amount', 'Price', 'Status', 'Payment Method', 'Player ID', 'Product Type', 'Transaction ID', 'Created Date', 'Updated Date'],
      ...filteredOrders.map(order => {
        const packageName = order.uc_packages?.name || order.product_name || 'Unknown';
        const amount = order.uc_packages?.uc_amount || order.product_amount || 'N/A';
        return [
          order.id,
          order.profiles?.full_name || 'Unknown',
          order.profiles?.email || 'Unknown',
          packageName,
          amount,
          order.price,
          order.status,
          order.payment_method || 'Not specified',
          order.player_id || 'N/A',
          order.product_type || 'UC',
          order.transaction_id || 'N/A',
          new Date(order.created_at).toLocaleDateString(),
          new Date(order.updated_at).toLocaleDateString()
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const openEmailDialog = (order: Order, templateKey?: string) => {
    setSelectedOrder(order);
    
    if (templateKey && emailTemplates[templateKey]) {
      const template = emailTemplates[templateKey];
      const packageName = order.uc_packages?.name || order.product_name || 'Unknown Package';
      const amount = order.uc_packages?.uc_amount || order.product_amount || '0';
      const populatedSubject = template.subject;
      const populatedBody = template.body
        .replace('{customerName}', order.profiles?.full_name || order.profiles?.email || 'Customer')
        .replace('{packageName}', packageName)
        .replace('{amount}', String(amount))
        .replace('{price}', order.price.toString())
        .replace('{orderId}', order.id)
        .replace('{playerId}', order.player_id || 'N/A');
      
      setEmailSubject(populatedSubject);
      setEmailBody(populatedBody);
    } else {
      setEmailSubject('');
      setEmailBody('');
    }
    
    setEmailDialogOpen(true);
  };

  const sendEmail = async () => {
    if (!selectedOrder || !emailSubject || !emailBody) return;

    // In a real implementation, you would send the email via an API
    // For now, we'll just open the user's email client
    const mailtoLink = `mailto:${selectedOrder.profiles?.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink);

    // Log the email action
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.rpc('log_admin_action', {
        p_admin_id: user.id,
        p_action_type: 'send_email',
        p_target_id: selectedOrder.id,
        p_details: { 
          email: selectedOrder.profiles?.email,
          subject: emailSubject 
        },
      });
    }

    toast({
      title: "Email Opened",
      description: "Email client opened with pre-filled content",
    });

    setEmailDialogOpen(false);
  };

  // Helper to get country code from currency code for language detection
  const getCountryFromCurrency = (currencyCode: string): string => {
    const currencyToCountry: Record<string, string> = {
      'PKR': 'PK', 'USD': 'US', 'EUR': 'DE', 'GBP': 'GB', 'RUB': 'RU',
      'INR': 'IN', 'AED': 'AE', 'SAR': 'SA', 'BDT': 'BD', 'MYR': 'MY',
      'IDR': 'ID', 'PHP': 'PH', 'THB': 'TH', 'VND': 'VN', 'TRY': 'TR',
      'JPY': 'JP', 'CNY': 'CN', 'KRW': 'KR', 'KZT': 'KZ', 'BRL': 'BR',
      'ARS': 'AR', 'CLP': 'CL', 'COP': 'CO', 'PEN': 'PE', 'MXN': 'MX',
      'ZAR': 'ZA', 'NGN': 'NG', 'EGP': 'EG', 'PLN': 'PL', 'CZK': 'CZ',
      'HUF': 'HU', 'RON': 'RO', 'BGN': 'BG', 'UAH': 'UA', 'SEK': 'SE',
      'NOK': 'NO', 'DKK': 'DK', 'CHF': 'CH', 'SGD': 'SG', 'HKD': 'HK',
      'TWD': 'TW', 'NZD': 'NZ', 'AUD': 'AU', 'CAD': 'CA', 'IRR': 'IR',
      'ILS': 'IL', 'JOD': 'JO', 'KWD': 'KW', 'QAR': 'QA', 'BHD': 'BH',
      'OMR': 'OM', 'LBP': 'LB', 'IQD': 'IQ', 'NPR': 'NP', 'LKR': 'LK',
    };
    return currencyToCountry[currencyCode?.toUpperCase()] || 'US';
  };

  // Send confirmation or refund email via backend
  const sendBackendEmail = async (order: Order, emailType: 'confirmation' | 'refund', customizations?: EmailCustomizations) => {
    try {
      const ucAmount = order.uc_packages?.uc_amount || parseInt(order.product_amount || '0') || 0;
      const packageName = customizations?.customPackageName || order.uc_packages?.name || order.product_name || 'Package';
      
      // Get country code from currency for language detection
      const countryCode = getCountryFromCurrency(order.currency_code || 'PKR');
      
      toast({
        title: "Sending Email...",
        description: `Sending ${emailType} email to ${order.profiles?.email} (${countryCode})`,
      });

      const { data, error } = await supabase.functions.invoke('send-order-email', {
        body: {
          userId: order.user_id,
          orderId: order.id,
          emailType: emailType,
          orderDetails: {
            packageName,
            ucAmount: customizations?.customAmount ? parseInt(customizations.customAmount) || ucAmount : ucAmount,
            price: order.price || 0,
            paymentMethod: order.payment_method || 'Unknown',
            playerId: order.player_id || 'N/A',
            transactionId: order.transaction_id || order.id,
            // Pass product type details for dynamic email content
            productType: order.product_type || null,
            productName: customizations?.customPackageName || order.product_name || null,
            productCode: order.product_code || null,
            productAmount: customizations?.customAmount || order.product_amount || null,
            currencyCode: order.currency_code || 'PKR',
            countryCode: countryCode, // For language detection in email
          },
          // Pass customizations to edge function
          customizations: customizations ? {
            customSubject: customizations.customSubject,
            customDeliveryMessage: customizations.customDeliveryMessage,
            customNote: customizations.customNote,
          } : undefined,
        },
      });

      if (error) {
        console.error('Email send error:', error);
        toast({
          title: "Email Failed",
          description: `Failed to send ${emailType} email: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      // Log the email action
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.rpc('log_admin_action', {
          p_admin_id: user.id,
          p_action_type: `send_${emailType}_email`,
          p_target_id: order.id,
          p_details: { 
            email: order.profiles?.email,
            emailType,
            productType: order.product_type,
            productName: order.product_name,
            response: data
          },
        });
      }

      toast({
        title: "Email Sent!",
        description: `${emailType === 'confirmation' ? 'Confirmation' : 'Refund'} email sent to ${order.profiles?.email}`,
      });
    } catch (error: any) {
      console.error('Failed to send email:', error);
      toast({
        title: "Email Failed",
        description: `Failed to send email: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Open email preview dialog
  const openEmailPreview = (order: Order, type: 'confirmation' | 'refund') => {
    setEmailPreviewOrder(order);
    setEmailPreviewType(type);
    setEmailPreviewOpen(true);
  };

  // Handle sending email from preview with customizations
  const handleSendEmailFromPreview = async (customizations: EmailCustomizations) => {
    if (!emailPreviewOrder) return;
    
    setIsSendingEmail(true);
    try {
      await sendBackendEmail(emailPreviewOrder, emailPreviewType, customizations);
      setEmailPreviewOpen(false);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    const newSelection = new Set(selectedOrders);
    if (newSelection.has(orderId)) {
      newSelection.delete(orderId);
    } else {
      newSelection.add(orderId);
    }
    setSelectedOrders(newSelection);
  };

  const selectAllOrders = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(order => order.id)));
    }
  };

  // Memoized filtered orders to prevent unnecessary re-calculations
  const filteredOrders = useMemo(() => orders.filter(order => {
    const matchesSearch = 
      order.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.player_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.payment_method === paymentFilter;
    
    const orderDate = new Date(order.created_at);
    const matchesDateFrom = !dateFrom || orderDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || orderDate <= new Date(dateTo + 'T23:59:59');
    
    return matchesSearch && matchesStatus && matchesPayment && matchesDateFrom && matchesDateTo;
  }), [orders, searchTerm, statusFilter, paymentFilter, dateFrom, dateTo]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'refund_review': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case 'gopayfast': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'easypaisa': return 'bg-green-100 text-green-800 border-green-200';
      case 'jazzcash': return 'bg-red-100 text-red-800 border-red-200';
      case 'bank_transfer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'stripe': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (price: number, currencyCode: string | null) => {
    return formatOrderPrice(price, currencyCode);
  };

  const isPakistaniOrder = (currencyCode: string | null) => {
    return currencyCode?.toUpperCase() === 'PKR';
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Orders Management</h1>
        </div>
        <Card className="border-0 shadow-lg bg-card">
          <CardContent className="p-4 sm:p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-12 sm:h-16 bg-muted rounded-lg"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Orders Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage customer orders and communications</p>
        </div>
        
        {/* Quick Stats - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 w-full">
          <div className="bg-primary/20 px-3 py-2 sm:px-4 sm:py-3 rounded-lg relative">
            <div className="text-xs sm:text-sm text-muted-foreground">Total Orders</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{orderStats.total}</div>
            {newOrderCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {newOrderCount > 99 ? '99+' : newOrderCount}
              </div>
            )}
          </div>
          <div className="bg-green-500/20 px-3 py-2 sm:px-4 sm:py-3 rounded-lg">
            <div className="text-xs sm:text-sm text-muted-foreground">Completed</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400">
              {orderStats.completed}
            </div>
          </div>
          <div className="bg-yellow-500/20 px-3 py-2 sm:px-4 sm:py-3 rounded-lg">
            <div className="text-xs sm:text-sm text-muted-foreground">Pending</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400">
              {orderStats.pending}
            </div>
          </div>
          <div className="bg-red-500/20 px-3 py-2 sm:px-4 sm:py-3 rounded-lg">
            <div className="text-xs sm:text-sm text-muted-foreground">Failed</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-400">
              {orderStats.failed}
            </div>
          </div>
          <div className="bg-gray-500/20 px-3 py-2 sm:px-4 sm:py-3 rounded-lg">
            <div className="text-xs sm:text-sm text-muted-foreground">Cancelled</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-400">
              {orderStats.cancelled}
            </div>
          </div>
          <div className="bg-purple-500/20 px-3 py-2 sm:px-4 sm:py-3 rounded-lg">
            <div className="text-xs sm:text-sm text-muted-foreground">Refunded</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-400">
              {orderStats.refunded}
            </div>
          </div>
          <div className="bg-emerald-500/20 px-3 py-2 sm:px-4 sm:py-3 rounded-lg">
            <div className="text-xs sm:text-sm text-muted-foreground">🇵🇰 Pakistani</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-400">
              {orderStats.gopayfast}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm bg-card">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background text-foreground"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background text-foreground">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="bg-background text-foreground">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground z-50">
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="gopayfast">🇵🇰 GoPayFast</SelectItem>
                <SelectItem value="easypaisa">EasyPaisa</SelectItem>
                <SelectItem value="jazzcash">JazzCash</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="From"
                className="bg-background text-foreground flex-1"
              />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="To"
                className="bg-background text-foreground flex-1"
              />
            </div>

            <Button onClick={exportOrders} variant="outline" className="text-foreground border-border">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <ArchivedOrdersDialog archivedCount={archivedCount} />
            
            <RecalculateOrdersDialog 
              orders={orders as any}
              onOrdersUpdated={loadOrders}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedOrders.size > 0 && (
        <Card className="border-primary/20 bg-primary/10">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <span className="text-sm font-medium text-foreground">
                {selectedOrders.size} order(s) selected
              </span>
              <Select value={bulkStatus} onValueChange={setBulkStatus}>
                <SelectTrigger className="w-full sm:w-40 bg-background text-foreground">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground z-50">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="refund_review">Refund Review</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  onClick={bulkUpdateStatus} 
                  disabled={!bulkStatus}
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  Update
                </Button>
                <Button 
                  onClick={() => setSelectedOrders(new Set())} 
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none text-foreground"
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Card className="border-0 shadow-lg bg-card overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/20 p-3 sm:p-4 lg:p-6 sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center text-foreground">
              Orders ({filteredOrders.length})
              {newOrderCount > 0 && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs animate-pulse ml-2">
                  {newOrderCount} New!
                </span>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllOrders}
                className="flex items-center gap-2 text-foreground text-xs sm:text-sm"
              >
                {selectedOrders.size === filteredOrders.length ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Select All</span>
                <span className="sm:hidden">All</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 max-h-[70vh] overflow-y-auto">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow className="bg-muted/50">
                  <TableHead className="w-10 sm:w-12"></TableHead>
                  <TableHead className="min-w-[100px] text-foreground">Order ID</TableHead>
                  <TableHead className="min-w-[120px] sm:min-w-[180px] text-foreground">Customer</TableHead>
                  <TableHead className="min-w-[80px] sm:min-w-[120px] text-foreground">Package</TableHead>
                  <TableHead className="text-foreground hidden md:table-cell">Player ID</TableHead>
                  <TableHead className="text-foreground">Amount</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground hidden xl:table-cell">Email Lang</TableHead>
                  <TableHead className="text-foreground hidden lg:table-cell">Payment</TableHead>
                  <TableHead className="text-foreground hidden sm:table-cell">Date</TableHead>
                  <TableHead className="min-w-[100px] sm:min-w-[180px] text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 sm:py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
                        <p className="text-sm sm:text-lg font-medium text-muted-foreground">No orders found</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Try adjusting your search filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/20">
                      <TableCell className="p-2 sm:p-4">
                        <Checkbox
                          checked={selectedOrders.has(order.id)}
                          onCheckedChange={() => toggleOrderSelection(order.id)}
                        />
                      </TableCell>
                      
                      {/* Order ID with Copy Button - Same as customer sees */}
                      <TableCell className="p-2 sm:p-4">
                        <OrderIdCell transactionId={order.transaction_id} />
                      </TableCell>
                      
                      <TableCell className="p-2 sm:p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                            <p className="font-medium text-xs sm:text-sm text-foreground truncate max-w-[80px] sm:max-w-full">{order.profiles?.full_name || 'No name'}</p>
                          </div>
                          <InlineEmailEditor 
                            order={order} 
                            onEmailUpdate={(newEmail) => handleEmailUpdate(order, newEmail)}
                          />
                        </div>
                      </TableCell>
                      
                      <TableCell className="p-2 sm:p-4">
                        <div className="space-y-1">
                          <p className="font-medium text-xs sm:text-sm text-foreground truncate max-w-[80px] sm:max-w-[120px]">{order.uc_packages?.name || order.product_name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {order.uc_packages?.uc_amount || order.product_amount || 'N/A'} {order.product_type || 'UC'}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell className="p-2 sm:p-4 hidden md:table-cell">
                        <PlayerIdCell playerId={order.player_id} />
                      </TableCell>
                      
                      <TableCell className="p-2 sm:p-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span className="font-semibold text-xs sm:text-sm text-foreground">{formatCurrency(order.price, order.currency_code)}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="p-2 sm:p-4">
                        <Badge className={`${getStatusColor(order.status)} text-xs`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      
                      {/* Email Language */}
                      <TableCell className="p-2 sm:p-4 hidden xl:table-cell">
                        {(() => {
                          const langInfo = getEmailLanguageInfo(order.currency_code);
                          return (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500 text-xs px-2 py-0.5">
                              {langInfo.flag} {langInfo.name}
                            </Badge>
                          );
                        })()}
                      </TableCell>
                      
                      <TableCell className="p-2 sm:p-4 hidden lg:table-cell">
                        <Badge className={`${getPaymentMethodBadge(order.payment_method)} text-xs`}>
                          {isPakistaniOrder(order.currency_code) && '🇵🇰 '}
                          {order.payment_method === 'gopayfast' ? 'GoPayFast' : 
                           order.payment_method?.replace('_', ' ') || 'N/A'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="p-2 sm:p-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span className="text-xs sm:text-sm text-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="p-2 sm:p-4">
                        <div className="flex gap-1 flex-wrap items-center">
                          {/* Email Delivered Tag - shows when email was sent */}
                          {order.email_sent_at && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500 text-xs px-2 py-0.5 h-6 sm:h-7">
                              ✓ Delivered
                            </Badge>
                          )}
                          {/* Email Preview Buttons */}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-400 border-green-500 hover:bg-green-500/20 text-xs px-2 py-1 h-7 sm:h-8"
                            onClick={() => openEmailPreview(order, 'confirmation')}
                          >
                            <Send className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">Confirm</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-400 border-red-500 hover:bg-red-500/20 text-xs px-2 py-1 h-7 sm:h-8"
                            onClick={() => openEmailPreview(order, 'refund')}
                          >
                            <DollarSign className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">Refund</span>
                          </Button>

                          {/* View Details */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-foreground text-xs px-2 py-1 h-7 sm:h-8">
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  Order Details
                                  {isPakistaniOrder(order.currency_code) && (
                                    <Badge className="bg-emerald-100 text-emerald-800">🇵🇰 Pakistani Order</Badge>
                                  )}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Customer Info */}
                                <CustomerInfoSection 
                                  order={order} 
                                  onEmailUpdate={(newEmail) => handleEmailUpdate(order, newEmail)}
                                />

                                {/* Currency & Payment Details */}
                                {order.currency_code && (
                                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-800">
                                      💳 Payment Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-blue-600">Payment Gateway</p>
                                        <p className="font-medium text-blue-800">
                                          {order.payment_method === 'gopayfast' ? 'GoPayFast' : 
                                           order.payment_method?.replace('_', ' ')}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-blue-600">Currency</p>
                                        <p className="font-medium text-blue-800">{order.currency_code?.toUpperCase()}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Order Info */}
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Order ID</p>
                                      <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{order.id}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Package</p>
                                      <p className="font-medium">{order.uc_packages?.name || order.product_name || 'Custom Package'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Amount</p>
                                      <p className="font-medium">{order.uc_packages?.uc_amount || order.product_amount || 'N/A'} {order.product_type || 'UC'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Price</p>
                                      <p className="font-bold text-lg">{formatCurrency(order.price, order.currency_code)}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Status</p>
                                      <Badge className={getStatusColor(order.status)}>
                                        {order.status}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Payment Method</p>
                                      <Badge className={getPaymentMethodBadge(order.payment_method)}>
                                        {isPakistaniOrder(order.currency_code) && '🇵🇰 '}
                                        {order.payment_method === 'gopayfast' ? 'GoPayFast' : 
                                         order.payment_method?.replace('_', ' ') || 'Not specified'}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Player ID</p>
                                      <p className="font-mono text-sm bg-muted px-2 py-1 rounded">
                                        {order.player_id || 'Not provided'}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Product Type</p>
                                      <p className="font-medium">{order.product_type || 'PUBG UC'}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Transaction Info */}
                                <div className="bg-muted/20 p-4 rounded-lg">
                                  <h4 className="font-semibold mb-3">Transaction Details</h4>
                                  <div className="space-y-2">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Transaction ID</p>
                                      <p className="font-mono text-sm">{order.transaction_id || 'Not provided'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-muted-foreground">Created Date</p>
                                        <p className="font-medium">{new Date(order.created_at).toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Last Updated</p>
                                        <p className="font-medium">{new Date(order.updated_at).toLocaleString()}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Status Update */}
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold mb-3">Update Order Status</h4>
                                  <Select 
                                    value={order.status} 
                                    onValueChange={(value) => updateOrderStatus(order.id, value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="failed">Failed</SelectItem>
                                      <SelectItem value="refunded">Refunded</SelectItem>
                                      <SelectItem value="refund_review">Refund Review</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Email to Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">To: {selectedOrder?.profiles?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Email message"
                rows={10}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={sendEmail} disabled={!emailSubject || !emailBody}>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Preview Dialog */}
      <EmailPreviewDialog
        open={emailPreviewOpen}
        onOpenChange={setEmailPreviewOpen}
        order={emailPreviewOrder}
        emailType={emailPreviewType}
        onSendEmail={handleSendEmailFromPreview}
        isSending={isSendingEmail}
      />
    </div>
  );
}