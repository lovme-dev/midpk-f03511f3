import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ThumbsUp, Gift, ShoppingCart, Home } from "lucide-react";

const FreeFireNavigationTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const navLinks = [
    { name: "DIAMONDS", path: "/free-fire", icon: ThumbsUp },
    { name: "REDEEM", path: "/redeem", icon: Gift },
    { name: "SHOP", path: "/gaming-shop", icon: ShoppingCart },
    { name: "EVENTS", path: "/events", icon: Home },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (!mounted) return null;

  const isActive = (path: string) => {
    if (path === "/free-fire" && location.pathname === "/free-fire") return true;
    if (path === "/gaming-shop" && location.pathname === "/gaming-shop") return true;
    if (path === "/redeem" && location.pathname === "/redeem") return true;
    if (path === "/events" && location.pathname === "/events") return true;
    return false;
  };

  return (
    <div className="w-full bg-[#13182B] py-2 md:py-3 hidden md:block">
      <div className="flex justify-center items-center gap-4 md:gap-24 overflow-x-auto px-2">
        {navLinks.map((link) => {
          const IconComponent = link.icon;
          const active = isActive(link.path);
          return (
            <button 
              key={link.path}
              onClick={() => handleNavigate(link.path)}
              className="flex items-center gap-2 px-2 md:px-3 py-2 whitespace-nowrap"
            >
              {/* Icons only visible on desktop */}
              <IconComponent 
                size={20}
                className={cn(
                  "hidden md:block",
                  active ? "text-[#33C3F0]" : "text-white"
                )}
              />
              <span className={cn(
                "font-semibold tracking-wide text-xs md:text-sm",
                active ? "text-[#33C3F0]" : "text-white"
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

export default FreeFireNavigationTabs;