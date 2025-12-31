import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  CreditCard, 
  Warehouse, 
  ShoppingCart, 
  BarChart3, 
  MapPin, 
  Shield, 
  HelpCircle, 
  Tag, 
  Settings, 
  Plus,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Home,
  FileText,
  Users,
  TrendingUp
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    children: [
      {
        id: 'add-product',
        label: 'Add New Product',
        icon: Plus,
      },
      {
        id: 'manage-products',
        label: 'Manage Products',
        icon: Package,
      },
    ]
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: FolderOpen,
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingCart,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Warehouse,
  },
  {
    id: 'payments',
    label: 'Payment Methods',
    icon: CreditCard,
  },
  {
    id: 'shipping',
    label: 'Shipping',
    icon: MapPin,
  },
  {
    id: 'coa',
    label: 'Lab Results (COA)',
    icon: Shield,
  },
  {
    id: 'faq',
    label: 'FAQ',
    icon: HelpCircle,
  },
  {
    id: 'promo-codes',
    label: 'Promo Codes',
    icon: Tag,
  },
  {
    id: 'guides',
    label: 'Guides',
    icon: FileText,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
  },
];

interface AdminSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
  onMobileClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentView,
  onViewChange,
  isCollapsed,
  onToggleCollapse,
  isMobile,
  onMobileClose,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['products']));

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.children) {
      toggleExpanded(item.id);
    } else {
      onViewChange(item.id);
      if (isMobile) {
        onMobileClose();
      }
    }
  };

  const isActive = (itemId: string) => {
    if (itemId === 'add-product' && currentView === 'add') return true;
    if (itemId === 'manage-products' && currentView === 'products') return true;
    return currentView === itemId;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50
        bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isMobile ? 'translate-x-0' : ''}
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobile ? 'w-64' : ''}
      `}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src="/logoo.jpg"
                  alt="StudyPulse"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">StudyPulse</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          )}
          
          {isCollapsed && !isMobile && (
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200 mx-auto">
              <img
                src="/logoo.jpg"
                alt="StudyPulse"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={onMobileClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}

          {/* Toggle button for desktop */}
          {!isMobile && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-2 space-y-1">
            {sidebarItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive(item.id)
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-between'}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>
                  
                  {!isCollapsed && item.children && (
                    <div className="flex items-center space-x-1">
                      {item.badge && (
                        <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {expandedItems.has(item.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </button>

                {/* Sub-items */}
                {!isCollapsed && item.children && expandedItems.has(item.id) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => handleItemClick(child)}
                        className={`
                          w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                          ${isActive(child.id)
                            ? 'bg-gray-100 text-gray-900 border-l-2 border-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        <child.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                        <span className="truncate">{child.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          {!isCollapsed && (
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
