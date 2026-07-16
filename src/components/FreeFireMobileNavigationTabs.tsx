import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const FreeFireMobileNavigationTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navLinks = [
    { name: "DIAMONDS", path: "/free-fire" },
    { name: "SHOP", path: "/gaming-shop" },
    { name: "EVENTS", path: "/events" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === "/free-fire" && location.pathname === "/free-fire") return true;
    if (path === "/gaming-shop" && location.pathname === "/gaming-shop") return true;
    if (path === "/events" && location.pathname === "/events") return true;
    return false;
  };

  return (
    <div className="mb-0 overflow-x-auto pb-0 mt-0 md:hidden">
      <div className="flex min-w-max border-b border-gray-700">
        {navLinks.map((link) => (
          <button 
            key={link.path}
            onClick={() => handleNavigate(link.path)}
            className={cn(
              "text-gray-400 font-bold tracking-wide px-4 py-2 relative hover:text-white transition-colors text-xs",
              isActive(link.path) ? "text-white" : ""
            )}
          >
            {link.name}
            {isActive(link.path) && (
              <span className="absolute bottom-0 left-0 w-full h-0"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FreeFireMobileNavigationTabs;