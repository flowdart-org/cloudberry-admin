import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FolderTree, 
  Settings,
  PackageSearch,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/routes.config';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.DASHBOARD },
  { icon: Package, label: 'Products', path: ROUTES.PRODUCTS },
  { icon: FolderTree, label: 'Categories', path: ROUTES.CATEGORIES },
  { icon: ShoppingCart, label: 'Orders', path: ROUTES.ORDERS },
  { icon: Users, label: 'Users', path: ROUTES.USERS },
  { icon: PackageSearch, label: 'Inventory', path: ROUTES.INVENTORY },
  { icon: Settings, label: 'Settings', path: ROUTES.SETTINGS },
];

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!isCollapsed && (
          <h1 className="text-xl font-bold">Admin Panel</h1>
        )}
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

      <nav className="space-y-1 p-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.DASHBOARD}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary',
                isCollapsed && 'justify-center'
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
