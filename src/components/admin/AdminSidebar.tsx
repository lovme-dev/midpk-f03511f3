import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Image, 
  CreditCard, 
  Settings,
  Menu,
  X,
  FileText,
  Bell,
  History,
  BellRing,
  MessageSquare,
  TrendingUp,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCustomerInquiriesCount } from '@/hooks/useCustomerInquiriesCount';
import { useRedeemCodesCount } from '@/hooks/useRedeemCodesCount';
import { usePendingOrdersCount } from '@/hooks/usePendingOrdersCount';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'revenue', label: 'Revenue Analytics', icon: TrendingUp },
  { id: 'customer-inquiries', label: 'Customer Inquiries', icon: MessageSquare },
  { id: 'redeem-codes', label: 'Redeem Codes', icon: Gift },
  { id: 'notification-settings', label: 'Notification Settings', icon: BellRing },
  { id: 'send-notification', label: 'Send Notification', icon: Bell },
  { id: 'notification-history', label: 'Notification History', icon: History },
  { id: 'pubg-uc-management', label: 'PUBG UC Management', icon: Package },
  { id: 'packages', label: 'UC Packages', icon: Package },
  { id: 'pubg-accounts', label: 'PUBG Accounts', icon: Package },
  { id: 'blogs', label: 'Blog Management', icon: FileText },
  { id: 'banners', label: 'PUBG Banners', icon: Image },
  { id: 'freefire-banners', label: 'Free Fire Banners', icon: Image },
  { id: 'bgmi-banners', label: 'BGMI Banners', icon: Image },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'assets', label: 'Site Assets', icon: Image },
  { id: 'payment', label: 'Payment Settings', icon: CreditCard },
  { id: 'content', label: 'Content Blocks', icon: Settings },
  { id: 'admins', label: 'Admin Management', icon: Settings },
];

export function AdminSidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: AdminSidebarProps) {
  const { unreadCount } = useCustomerInquiriesCount();
  const { pendingCount: redeemCodesCount } = useRedeemCodesCount();
  const { pendingCount: ordersCount } = usePendingOrdersCount();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-56 lg:w-64 bg-[#0a1628] border-r border-[#1a2a3f] transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-3 lg:p-4 border-b border-[#1a2a3f] flex-shrink-0">
          <h2 className="text-base lg:text-xl font-bold text-white">Admin Panel</h2>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-2 lg:p-4 space-y-1 lg:space-y-2 [-ms-overflow-style:none] [scrollbar-width:thin] [scrollbar-color:#1a2a3f_transparent]">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const showInquiriesBadge = item.id === 'customer-inquiries' && unreadCount > 0;
            const showRedeemBadge = item.id === 'redeem-codes' && redeemCodesCount > 0;
            const showOrdersBadge = item.id === 'orders' && ordersCount > 0;
            const showBadge = showInquiriesBadge || showRedeemBadge || showOrdersBadge;
            const badgeCount = showInquiriesBadge ? unreadCount : showRedeemBadge ? redeemCodesCount : ordersCount;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 lg:gap-3 px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-lg text-left transition-colors text-xs lg:text-sm",
                  activeTab === item.id
                    ? "bg-[#3b7ddd] text-white"
                    : "text-[#8b9cb8] hover:bg-[#1a2a3f] hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium flex-1 truncate">{item.label}</span>
                {showBadge && (
                  <Badge 
                    variant={showOrdersBadge ? "default" : "destructive"}
                    className={cn(
                      "text-[9px] lg:text-[10px] px-1 lg:px-1.5 py-0 min-w-[18px] lg:min-w-[20px] h-4 lg:h-5 flex items-center justify-center animate-pulse",
                      showOrdersBadge && "bg-yellow-500 hover:bg-yellow-600"
                    )}
                  >
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export function AdminSidebarTrigger({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="lg:hidden"
      onClick={() => setIsOpen(true)}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}