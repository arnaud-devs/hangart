"use client";

import { Home, Image, Users, Calendar, BarChart3, Settings, X, LogOut, User, ChevronDown, ChevronRight, CreditCard, CheckCircle, UploadCloud, Folder, Package } from "lucide-react";
import { FiUser, FiHeart, FiTrendingUp } from "react-icons/fi";
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout?: () => void;
  onProfileClick?: () => void;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface SidebarItem {
  icon: any;
  label: string;
  href: string;
  children?: SidebarItem[];
}


const sidebarItemsByRole: Record<string, SidebarItem[]> = {
  ADMIN: [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Artists", href: "/dashboard/artists" },
    { icon: Users, label: "Buyers", href: "/dashboard/buyers" },
    { icon: Users, label: "Users", href: "/dashboard/users" },
    { icon: Image, label: "Artworks", href: "/dashboard/artworks" },
    { icon: Package, label: "Orders", href: "/dashboard/orders" },
    { icon: CreditCard, label: "Payments", href: "/dashboard/payments" },
    { icon: CheckCircle, label: "Approvals", href: "/dashboard/approvals" },
    { icon: Folder, label: "Museums", href: "/dashboard/museums" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
  ],
  ARTIST: [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Image, label: "My Artworks", href: "/dashboard/artworks" },
    { icon: CreditCard, label: "Transactions", href: "/dashboard/transactions" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
  ],
  BUYER: [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Image, label: "Browse Artworks", href: "/dashboard/artworks" },
    { icon: FiHeart as any, label: "Wishlist", href: "/dashboard/wishlist" },
    { icon: CreditCard, label: "Orders", href: "/dashboard/orders" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
  ],
  MUSEUM: [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Folder, label: "Collections", href: "/dashboard/collections" },
    { icon: Image, label: "Request Works", href: "/dashboard/requests" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
  ],
};

export const Sidebar = ({ 
  isOpen, 
  setIsOpen,
  onLogout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (e) {}
    try { window.location.href = '/login'; } catch (e) {}
  },
  onProfileClick = () => console.log("Profile clicked"),
}: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const readUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(Array.isArray(parsedUser) ? parsedUser[0] : parsedUser);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    };

    readUser();

    // respond to storage changes (other tabs) and window focus so sidebar updates when demo login changes user
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === 'user') readUser();
    };
    const onFocus = () => readUser();
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);

    // Automatically expand parent items when child is active
    const sidebarItems = getSidebarItems();
    const activeParent = sidebarItems.find((item: SidebarItem) => 
      item.children?.some(child => pathname.startsWith(child.href)));
    if (activeParent) {
      setExpandedItems(prev => ({ ...prev, [activeParent.label]: true }));
    }

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, [pathname]);

  // Close sidebar on route change (mobile) and on Escape key
  useEffect(() => {
    if (pathname) setIsOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pathname, setIsOpen]);

  const getSidebarItems = () => {
    const roleKey = user?.role ? user.role.toUpperCase() : "ADMIN";
    return sidebarItemsByRole[roleKey] || sidebarItemsByRole["ADMIN"];
  };

  const toggleItemExpansion = (label: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const isActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const renderSidebarItem = (item: SidebarItem, index: number, depth = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.label];
    const active = isActive(item.href);

    return (
      <div key={`${index}-${depth}`} className="space-y-1">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleItemExpansion(item.label);
            } else if (item.href !== "#") {
              router.push(item.href);
              setIsOpen(false);
            }
          }}
          aria-current={active ? 'page' : undefined}
          className={`group flex items-center w-full px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 relative ${
            active
              ? 'bg-gradient-to-r from-emerald-50 to-emerald-100/80 text-emerald-700 shadow-sm border border-emerald-200/50 dark:from-emerald-700 dark:to-emerald-800 dark:text-emerald-200'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-[1.02] dark:hover:bg-gray-700 dark:hover:text-gray-100'
          }`}
          style={{ paddingLeft: `${depth * 16 + 16}px` }}
        >
          <Icon className={`w-5 h-5 mr-4 transition-all duration-200 ${
            active 
              ? 'text-emerald-600 dark:text-emerald-300' 
              : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200'
          }`} />
          <span className="font-semibold">{item.label}</span>
          
          {hasChildren && (
            <span className="ml-auto">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </span>
          )}
          
          {active && !hasChildren && (
            <div className="absolute right-2 w-2 h-2 bg-emerald-500 rounded-full"></div>
          )}
        </button>
        
        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {item.children?.map((child, childIndex) => 
              renderSidebarItem(child, childIndex, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay with higher z-index */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-2xl transform transition-all duration-300 ease-out border-r border-gray-100 dark:border-gray-700 flex flex-col h-screen lg:h-screen lg:top-0 lg:left-0 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`} role="navigation" aria-label="Main sidebar">
        
        {/* Fixed Header */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-700 dark:to-teal-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Image className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Hangart
                </span>
                <p className="text-xs text-gray-500 dark:text-white -mt-0.5">Online Art Gallery</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700 transition-colors group"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-100" />
            </button>
          </div>
        </div>
        
        {/* Scrollable Navigation */}
          <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-6 space-y-2" aria-label="Sidebar links">
            {getSidebarItems().map((item: SidebarItem, index: number) => renderSidebarItem(item, index))}
          </nav>
        </div>

        {/* Fixed Footer */}
        <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={user?.profileImage || '/person-m-3.webp'} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.firstName} {user?.lastName}</div>
                <div className="text-xs text-gray-500 dark:text-gray-300">{user?.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowUserMenu(prev => !prev); }}
                aria-label="Open user menu"
                className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                title="User menu"
              >
                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => onLogout()}
                aria-label="Logout"
                className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {showUserMenu && (
            <div className="mt-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-3 shadow-sm">
              <button onClick={() => { onProfileClick(); setShowUserMenu(false); setIsOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">Profile</button>
              <button onClick={() => { onLogout(); setShowUserMenu(false); setIsOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};