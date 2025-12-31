import React from 'react';
import { 
  Package, 
  TrendingUp, 
  Star, 
  FolderOpen, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Activity,
  ArrowUp,
  ArrowDown,
  MoreHorizontal
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  onClick 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <button className="p-1 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>

      {change && (
        <div className="mt-4 flex items-center space-x-1">
          {change.type === 'increase' ? (
            <ArrowUp className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${
            change.type === 'increase' ? 'text-green-500' : 'text-red-500'
          }`}>
            {change.value}%
          </span>
          <span className="text-xs text-gray-500">{change.period}</span>
        </div>
      )}
    </div>
  );
};

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
  badge?: number;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  onClick,
  badge
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200 text-left group"
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${color} group-hover:scale-105 transition-transform`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
            {badge && (
              <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );
};

interface ActivityItemProps {
  type: 'order' | 'product' | 'user' | 'system';
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ 
  type, 
  title, 
  description, 
  time, 
  icon: Icon 
}) => {
  const typeColors = {
    order: 'bg-blue-50 text-blue-600',
    product: 'bg-green-50 text-green-600',
    user: 'bg-purple-50 text-purple-600',
    system: 'bg-gray-50 text-gray-600',
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${typeColors[type]} flex-shrink-0`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0">{time}</span>
    </div>
  );
};

interface AdminDashboardCardsProps {
  stats: {
    totalProducts: number;
    availableProducts: number;
    featuredProducts: number;
    totalCategories: number;
    totalOrders?: number;
    totalRevenue?: number;
    totalUsers?: number;
  };
  onNavigate: (view: string) => void;
}

const AdminDashboardCards: React.FC<AdminDashboardCardsProps> = ({ 
  stats, 
  onNavigate 
}) => {
  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Create a new product listing',
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      action: 'add-product'
    },
    {
      title: 'Manage Products',
      description: 'View and edit existing products',
      icon: Package,
      color: 'bg-green-50 text-green-600',
      action: 'manage-products'
    },
    {
      title: 'View Orders',
      description: 'Manage customer orders',
      icon: ShoppingCart,
      color: 'bg-purple-50 text-purple-600',
      action: 'orders'
    },
    {
      title: 'Manage Categories',
      description: 'Organize product categories',
      icon: FolderOpen,
      color: 'bg-orange-50 text-orange-600',
      action: 'categories'
    },
    {
      title: 'Sales Analytics',
      description: 'View sales reports and insights',
      icon: TrendingUp,
      color: 'bg-red-50 text-red-600',
      action: 'analytics'
    },
    {
      title: 'Site Settings',
      description: 'Configure website settings',
      icon: Activity,
      color: 'bg-gray-50 text-gray-600',
      action: 'settings'
    },
  ];

  const recentActivity = [
    {
      type: 'order' as const,
      title: 'New Order #1234',
      description: 'Customer placed an order',
      time: '2 min ago',
      icon: ShoppingCart
    },
    {
      type: 'product' as const,
      title: 'Product Updated',
      description: 'BPC-157 price updated',
      time: '15 min ago',
      icon: Package
    },
    {
      type: 'user' as const,
      title: 'New Registration',
      description: 'New user signed up',
      time: '1 hour ago',
      icon: Users
    },
    {
      type: 'system' as const,
      title: 'Backup Completed',
      description: 'Database backup successful',
      time: '2 hours ago',
      icon: Activity
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          change={{ value: 12, type: 'increase', period: 'from last month' }}
          icon={Package}
          color="blue"
          onClick={() => onNavigate('manage-products')}
        />
        <StatCard
          title="Available Products"
          value={stats.availableProducts}
          change={{ value: 8, type: 'increase', period: 'from last week' }}
          icon={TrendingUp}
          color="green"
          onClick={() => onNavigate('manage-products')}
        />
        <StatCard
          title="Featured Products"
          value={stats.featuredProducts}
          icon={Star}
          color="purple"
          onClick={() => onNavigate('manage-products')}
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          change={{ value: 2, type: 'increase', period: 'from last month' }}
          icon={FolderOpen}
          color="orange"
          onClick={() => onNavigate('categories')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <QuickActionCard
                  key={index}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  color={action.color}
                  onClick={() => onNavigate(action.action)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-1">
              {recentActivity.map((activity, index) => (
                <ActivityItem
                  key={index}
                  type={activity.type}
                  title={activity.title}
                  description={activity.description}
                  time={activity.time}
                  icon={activity.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardCards;
