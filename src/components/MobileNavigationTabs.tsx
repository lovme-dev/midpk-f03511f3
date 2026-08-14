
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ShoppingBag, Gift, Calendar, ClipboardList } from "lucide-react";

const MobileNavigationTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navLinks = [
    { name: "PURCHASE", path: "/", icon: ShoppingBag },
    { name: "REDEEM", path: "/redeem", icon: Gift },
    { name: "EVENTS", path: "/events", icon: Calendar },
    { name: "ORDER", path: "/order-center", icon: ClipboardList },
  ];
  // Admin link shown in Header menu for mobile to avoid duplication

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path === "/redeem" && location.pathname === "/redeem") return true;
    if (path === "/events" && location.pathname === "/events") return true;
    if (path === "/order-center" && location.pathname === "/order-center") return true;
    return false;
  };

  return (
    <div className="mb-4 overflow-x-auto pb-1 mt-4 md:hidden">
      <div className="flex min-w-max justify-center gap-4 px-4">
        {navLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <button 
              key={link.path}
              onClick={() => handleNavigate(link.path)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 min-w-[65px]",
                isActive(link.path) 
                  ? "text-[#33C3F0] bg-white/5" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <IconComponent 
                size={16}
                className={cn(
                  "transition-colors",
                  isActive(link.path) ? "text-[#33C3F0]" : "text-gray-400"
                )}
              />
              <span className="font-bold tracking-wide text-[10px]">
                {link.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default MobileNavigationTabs;
