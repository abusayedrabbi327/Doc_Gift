import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Package,
  Users,
  LogOut,
  Heart,
  FileText,
  Menu,
  X,
  User,
  Bell,
  CreditCard,
  Settings,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  userRole?: string;
  userName?: string;
}

export function DashboardLayout({ children, navItems }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, cart } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userName = currentUser
    ? currentUser.role === 'doctor'
      ? currentUser.data.name
      : currentUser.role === 'sales'
      ? currentUser.data.name
      : currentUser.data.name
    : 'User';

  const userRole = currentUser
    ? currentUser.role === 'doctor'
      ? 'Doctor'
      : currentUser.role === 'sales'
      ? 'Sales Representative'
      : 'Administrator'
    : 'User';

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSettings = () => {
    if (currentUser?.role === 'doctor') navigate('/doctor/profile');
    else if (currentUser?.role === 'sales') navigate('/sales/profile');
    else navigate('/admin');
    setIsSidebarOpen(false);
  };

  // Inject cart badge for doctor nav
  const enrichedNavItems = navItems.map(item => {
    if (item.path === '/doctor/cart' && cartCount > 0) {
      return { ...item, badge: cartCount };
    }
    return item;
  });

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-border"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-60 bg-white border-r border-border flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-4 py-5 border-b border-border">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('/')}>
            <div className="w-8 h-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-foreground tracking-tight text-sm">Gift Exchange</span>
          </div>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground truncate leading-tight">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          <ul className="space-y-0.5">
            {enrichedNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left ${
                      active
                        ? 'bg-[#1E3A8A] text-white'
                        : 'text-foreground hover:bg-[#f1f5f9]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                        active ? 'bg-white/20 text-white' : 'bg-[#22C55E] text-white'
                      }`}>
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-border space-y-0.5">
          <button
            onClick={handleSettings}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-foreground hover:bg-[#f1f5f9] transition-all"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full lg:w-auto min-w-0">
        <div className="lg:hidden h-14" />
        {children}
      </main>
    </div>
  );
}

export const doctorNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/doctor', icon: LayoutDashboard },
  { label: 'Browse Gifts', path: '/doctor/products', icon: ShoppingBag },
  { label: 'My Cart', path: '/doctor/cart', icon: ShoppingCart },
  { label: 'My Orders', path: '/doctor/orders', icon: Package },
  { label: 'My Profile', path: '/doctor/profile', icon: User },
];

export const salesNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/sales', icon: LayoutDashboard },
  { label: 'Manage Doctors', path: '/sales/doctors', icon: Users },
  { label: 'Order Queue', path: '/sales/orders', icon: FileText },
  { label: 'My Profile', path: '/sales/profile', icon: User },
];

export const adminNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Products', path: '/admin/products', icon: ShoppingBag },
  { label: 'Orders', path: '/admin/orders', icon: Package },
  { label: 'Requests', path: '/admin/requests', icon: Bell },
];
