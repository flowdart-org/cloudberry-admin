import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Settings,
  PackageSearch,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import { cn } from "@/utils/tailwind";
import { ROUTES } from "@/config/routes.config";
import { Button } from "@/components/ui/button";
import { ComingSoonDialog } from "@/components/common/ComingSoonDialog";
import { useState } from "react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: ROUTES.DASHBOARD },
  { icon: Users, label: "Users", path: ROUTES.USERS },
  { icon: FolderTree, label: "Categories", path: ROUTES.CATEGORIES },
  { icon: Package, label: "Products", path: ROUTES.PRODUCTS },
  { icon: ShoppingCart, label: "Orders", path: ROUTES.ORDERS },
  { icon: Home, label: "Home Config", path: ROUTES.HOME_CONFIG },
  // { icon: Settings, label: "Settings", path: ROUTES.SETTINGS },
];

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleNavClick = (label: string) => (e: React.MouseEvent) => {
    if (label === "Inventory") {
      e.preventDefault(); // stop navigation
      setShowComingSoon(true);
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!isCollapsed && <h1 className="text-xl font-bold">Admin Panel</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Nav Menu */}
      <nav className="space-y-1 p-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.DASHBOARD}
            onClick={handleNavClick(item.label)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary",
                isCollapsed && "justify-center"
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Coming Soon Dialog */}
      <ComingSoonDialog
        open={showComingSoon}
        onOpenChange={setShowComingSoon}
      />
    </aside>
  );
};
