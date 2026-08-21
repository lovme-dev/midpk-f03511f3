import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export type TabType = "purchase" | "wow" | "redeem" | "shop" | "events";

interface InPageNavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

type IconProps = { className?: string; size?: number };

/* Filled thumbs-up: solid palm, outlined cuff */
const ThumbUpFilled = ({ className, size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M7 10.5 11 3a2.6 2.6 0 0 1 2.6 2.6V9h4.6a2 2 0 0 1 1.96 2.4l-1.3 6.4A2.4 2.4 0 0 1 16.5 20H7z"
      fill="currentColor"
    />
    <rect x="2.6" y="10" width="4.4" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.8" fill="none" />
  </svg>
);

/* Shopping bag: filled body, outlined handle (as in reference) */
const BagIcon = ({ className, size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M8.2 8V6.2a3.8 3.8 0 0 1 7.6 0V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path
      d="M4.6 8h14.8a1 1 0 0 1 1 1.1l-1 10a2 2 0 0 1-2 1.8H6.6a2 2 0 0 1-2-1.8l-1-10A1 1 0 0 1 4.6 8z"
      fill="currentColor"
    />
  </svg>
);

/* Ticket: solid */
const TicketFilled = ({ className, size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M2.5 7.5A1.5 1.5 0 0 1 4 6h16a1.5 1.5 0 0 1 1.5 1.5V10a2 2 0 0 0 0 4v2.5A1.5 1.5 0 0 1 20 18H4a1.5 1.5 0 0 1-1.5-1.5V14a2 2 0 0 0 0-4z"
      fill="currentColor"
    />
    <path d="M9.6 9.4v5.2M14.4 9.4v5.2" stroke="#0a1628" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/* Shopping cart: filled basket, outlined wheels */
const CartIcon = ({ className, size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M1.8 3h2.1a1 1 0 0 1 .97.76L5.4 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M5.9 6h15.3a.8.8 0 0 1 .78.99l-1.5 6.2a2 2 0 0 1-1.94 1.53H8.1a2 2 0 0 1-1.95-1.55L4.6 6.99A.8.8 0 0 1 5.38 6z" fill="currentColor" />
    <circle cx="9" cy="19.5" r="1.7" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <circle cx="18" cy="19.5" r="1.7" stroke="currentColor" strokeWidth="1.8" fill="none" />
  </svg>
);

/* Flame: solid */
const FlameFilled = ({ className, size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12.6 2.2c.3 2.5-.7 4-2.1 5.4-1.6 1.6-3.9 3.2-3.9 6.5A7.4 7.4 0 0 0 14 21.4a7.4 7.4 0 0 0 5.4-7.1c0-4.3-3-6.7-4.6-9.1-.6-.9-1.4-2-2.2-3.1z"
      fill="currentColor"
    />
    <path d="M11.2 13c.2 1.2-.4 1.9-1 2.6-.6.7-1 1.3-1 2.2a2.9 2.9 0 0 0 5.8.1c0-1.9-1.5-2.9-2.3-3.9-.5-.5-1-1-1.5-1z" fill="#0a1628" opacity="0.35" />
  </svg>
);

const InPageNavigationTabs = ({ activeTab, onTabChange }: InPageNavigationTabsProps) => {
  const { t } = useTranslation();

  const navLinks = [
    { name: t('tabs.uc', { defaultValue: 'UC' }), id: "purchase" as TabType, icon: ThumbUpFilled },
    { name: t('tabs.wow', { defaultValue: 'WOW' }), id: "wow" as TabType, icon: BagIcon },
    { name: t('tabs.redeem', { defaultValue: 'REDEEM' }), id: "redeem" as TabType, icon: TicketFilled },
    { name: t('tabs.shop', { defaultValue: 'SHOP' }), id: "shop" as TabType, icon: CartIcon },
    { name: t('tabs.events', { defaultValue: 'EVENTS' }), id: "events" as TabType, icon: FlameFilled },
  ];

  return (
    <div className="w-full bg-[#0a1628]" dir="ltr">
      <div
        className="flex justify-center items-center gap-1 md:gap-4 overflow-x-auto max-w-4xl mx-auto px-2 md:px-8 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {navLinks.map((link) => {
          const IconComponent = link.icon;
          const isActive = activeTab === link.id;

          return (
            <button
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={cn(
                "relative flex items-center justify-center gap-1.5 px-2 md:px-4 py-3 md:py-4 transition-all duration-300 whitespace-nowrap",
                isActive
                  ? "text-[#33C3F0] bg-[#151a28] rounded-t-xl"
                  : "text-gray-400 hover:text-gray-300 bg-[#0a1628]",
              )}
            >
              {isActive && (
                <div
                  className="absolute inset-0 pointer-events-none rounded-t-xl overflow-hidden"
                  style={{
                    background: 'radial-gradient(ellipse 100% 80% at 50% -10%, rgba(51, 195, 240, 0.25) 0%, rgba(51, 195, 240, 0.08) 50%, transparent 80%)',
                  }}
                />
              )}
              {isActive && (
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-3 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center bottom, rgba(51, 195, 240, 0.5) 0%, rgba(51, 195, 240, 0.15) 60%, transparent 90%)',
                    filter: 'blur(4px)',
                  }}
                />
              )}
              <IconComponent
                size={15}
                className={cn(
                  "transition-colors relative z-10 shrink-0",
                  isActive ? "text-[#33C3F0]" : "text-gray-400"
                )}
              />
              <span className={cn(
                "font-extrabold tracking-wide text-[13px] md:text-[15px] relative z-10",
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
