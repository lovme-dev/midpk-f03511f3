import { cn } from "@/lib/utils";
import { ThumbsUp, Gift, ShoppingCart, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

export type TabType = "purchase" | "redeem" | "shop" | "events";

interface InPageNavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const InPageNavigationTabs = ({ activeTab, onTabChange }: InPageNavigationTabsProps) => {
  const { t } = useTranslation();
  
  const navLinks = [
    { name: t('tabs.purchase', { defaultValue: 'PURCHASE' }), id: "purchase" as TabType, icon: ThumbsUp },
    { name: t('tabs.redeem', { defaultValue: 'REDEEM' }), id: "redeem" as TabType, icon: Gift },
    { name: t('tabs.shop', { defaultValue: 'SHOP' }), id: "shop" as TabType, icon: ShoppingCart },
    { name: t('tabs.events', { defaultValue: 'EVENTS' }), id: "events" as TabType, icon: Calendar },
  ];

  return (
    <div className="w-full bg-[#0a1628]" dir="ltr">
      {/* Full width container with justify-between for PC spread */}
      <div className="flex justify-between items-center overflow-x-auto max-w-4xl mx-auto px-4 md:px-8">
        {navLinks.map((link, index) => {
          const IconComponent = link.icon;
          const isActive = activeTab === link.id;
          const isFirst = index === 0;
          const isLast = index === navLinks.length - 1;
          
          return (
            <button 
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={cn(
                "relative flex items-center justify-center gap-2 px-3 md:px-4 py-3 md:py-4 transition-all duration-300 whitespace-nowrap",
                isActive 
                  ? "text-[#33C3F0] bg-[#151a28] rounded-t-xl" 
                  : "text-gray-400 hover:text-gray-300 bg-[#0a1628]",
                // Mobile only: move first item left, last item right
                isFirst && "ml-[-4%] md:ml-0",
                isLast && "mr-[-4%] md:mr-0"
              )}
            >
              {/* Cyan glow effect - spreads into background behind text */}
              {isActive && (
                <div 
                  className="absolute inset-0 pointer-events-none rounded-t-xl overflow-hidden"
                  style={{
                    background: 'radial-gradient(ellipse 100% 80% at 50% -10%, rgba(51, 195, 240, 0.25) 0%, rgba(51, 195, 240, 0.08) 50%, transparent 80%)',
                  }}
                />
              )}
              {/* Top edge glow highlight */}
              {isActive && (
                <div 
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-3 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center bottom, rgba(51, 195, 240, 0.5) 0%, rgba(51, 195, 240, 0.15) 60%, transparent 90%)',
                    filter: 'blur(4px)',
                  }}
                />
              )}
              {/* Icons only visible on desktop */}
              <IconComponent 
                size={18}
                className={cn(
                  "transition-colors hidden md:block relative z-10",
                  isActive ? "text-[#33C3F0]" : "text-gray-400"
                )}
              />
              <span className={cn(
                "font-extrabold tracking-wide text-[12px] md:text-[14px] relative z-10",
                isActive ? "text-[#33C3F0]" : "text-gray-400"
              )}>
                {link.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InPageNavigationTabs;
