import React, { useEffect, useState } from 'react';
import { Ticket, Pizza, Flame, Utensils, IceCream, CupSoda, Droplet } from 'lucide-react';

interface CategoryBarProps {
  activeCategory: string;
  onCategoryClick: (category: string) => void;
}

interface CategoryObj {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({ activeCategory, onCategoryClick }) => {
  const [isSticky, setIsSticky] = useState(false);

  const categories: CategoryObj[] = [
    { id: 'deals', label: 'Deals', icon: <Ticket className="w-4 h-4" /> },
    { id: 'pizzas', label: 'Pizzas', icon: <Pizza className="w-4 h-4" /> },
    { id: 'starters', label: 'Starters & Sides', icon: <Flame className="w-4 h-4" /> },
    { id: 'pasta', label: 'Pastas', icon: <Utensils className="w-4 h-4" /> },
    { id: 'desserts', label: 'Desserts', icon: <IceCream className="w-4 h-4" /> },
    { id: 'beverages', label: 'Beverages', icon: <CupSoda className="w-4 h-4" /> },
    { id: 'dips', label: 'Gourmet Dips', icon: <Droplet className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const headerElement = document.getElementById('app-header');
      const headerHeight = headerElement ? headerElement.offsetHeight : 80;
      const scrollPosition = window.scrollY;
      
      setIsSticky(scrollPosition > headerHeight + 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`w-full transition-all duration-300 z-30 ${
        isSticky 
          ? 'sticky top-20 bg-neutral-950/95 shadow-lg border-b border-red-500/10 backdrop-blur-md py-3' 
          : 'bg-neutral-900 border-b border-neutral-800 py-4'
      }`}
      id="category-navigation-bar"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-start overflow-x-auto gap-2 md:gap-3 scrollbar-none py-1 mask-right">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryClick(cat.id)}
                className={`flex items-center gap-1.5 md:gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 shrink-0 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/25 border border-red-500'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
                id={`cat-tab-${cat.id}`}
              >
                <span className={isActive ? 'text-yellow-400' : 'text-neutral-500'}>
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
