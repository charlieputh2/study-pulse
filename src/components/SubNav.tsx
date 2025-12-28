import React from 'react';
import { Grid, FlaskConical, Sparkles, Leaf, Package, Flame, Zap, Brain, HeartPulse, Activity, Shield, Infinity, Droplets } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';

interface SubNavProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const iconMap: { [key: string]: React.ReactElement } = {
  Grid: <Grid className="w-5 h-5" />,
  FlaskConical: <FlaskConical className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Leaf: <Leaf className="w-5 h-5" />,
  Package: <Package className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  HeartPulse: <HeartPulse className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Infinity: <Infinity className="w-5 h-5" />,
  Droplets: <Droplets className="w-5 h-5" />,
};

const SubNav: React.FC<SubNavProps> = ({ selectedCategory, onCategoryClick }) => {
  const { categories, loading } = useCategories();

  // Fallback categories aligned to requested taxonomy when DB is empty
  const fallbackCategories = [
    { id: 'metabolic', name: 'Metabolic & Weight Mgmt', icon: 'Flame' },
    { id: 'energy', name: 'Energy', icon: 'Zap' },
    { id: 'beauty', name: 'Beauty & Anti-aging', icon: 'Sparkles' },
    { id: 'cognitive', name: 'Cognitive Support', icon: 'Brain' },
    { id: 'hormonal', name: 'Hormonal & Sexual', icon: 'HeartPulse' },
    { id: 'muscle', name: 'Muscle & Growth', icon: 'Activity' },
    { id: 'antioxidant', name: 'Antioxidant', icon: 'Shield' },
    { id: 'longevity', name: 'Longevity', icon: 'Infinity' },
    { id: 'recovery', name: 'Injury Recovery', icon: 'Shield' },
    { id: 'anti-inflammatory', name: 'Anti-inflammatory', icon: 'Droplets' },
    { id: 'special-blends', name: 'Special Blends', icon: 'FlaskConical' },
    { id: 'topicals', name: 'Topicals', icon: 'Package' },
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  if (loading) {
    return (
      <div className="bg-white shadow-sm border-b border-gray-100 hidden md:block">
        <div className="container mx-auto px-4 py-4">
          <div className="flex space-x-3 overflow-x-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse bg-gray-100 h-10 w-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="bg-white shadow-sm sticky top-[64px] md:top-[72px] lg:top-[80px] z-40 border-b border-navy-900/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-2 py-3 md:py-4 overflow-x-auto scrollbar-hide">
          {displayCategories.map((category) => {
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap
                  transition-all duration-200 text-sm border
                  ${isSelected
                    ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                    : 'bg-white text-gray-600 hover:text-navy-900 border-navy-900 hover:bg-gray-50'
                  }
                `}
              >
                <span>
                  {React.cloneElement(iconMap[category.icon] || <Grid className="w-4 h-4" />, {
                    className: `w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-theme-text'}`
                  })}
                </span>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hide scrollbar for better aesthetics */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
};

export default SubNav;
