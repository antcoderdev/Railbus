import React from 'react';
import { useApp } from '../context/AppContext';
import { NavTab } from '../types';
import { LayoutDashboard, PieChart, ArrowLeftRight, Bell, Settings } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, notifications, theme } = useApp();

  const isLight = theme === 'light';
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems: { id: NavTab; labelKey: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
    { id: 'shares', labelKey: 'nav.shares', icon: PieChart },
    { id: 'transactions', labelKey: 'nav.transactions', icon: ArrowLeftRight },
    { id: 'notifications', labelKey: 'nav.notifications', icon: Bell },
    { id: 'settings', labelKey: 'nav.settings', icon: Settings },
  ];

  return (
    <nav 
      aria-label="Navigation principale"
      className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t px-2 py-1.5 pb-safe transition-colors ${
        isLight 
          ? 'bg-white/95 border-slate-200' 
          : 'bg-[#0C0C0C]/95 border-white/10'
      }`}
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 relative rounded-lg transition duration-150 ${
                isActive 
                  ? 'text-[#C8880A] dark:text-[#F2B01E]' 
                  : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {item.id === 'notifications' && unreadCount > 0 && (
                  <span className={`absolute -top-1.5 -right-2 bg-[#F2B01E] text-black text-[10px] font-extrabold rounded-md min-w-4 h-4 px-1 flex items-center justify-center ring-2 ${
                    isLight ? 'ring-white' : 'ring-[#0C0C0C]'
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[10.5px] mt-1 tracking-tight font-medium ${
                isActive 
                  ? 'font-bold text-[#C8880A] dark:text-[#F2B01E]' 
                  : isLight ? 'text-slate-600' : 'text-gray-400'
              }`}>
                {t(item.labelKey)}
              </span>

              {/* Active flat underline indicator */}
              {isActive && (
                <span className="w-4 h-0.5 rounded-full bg-[#F2B01E] absolute -bottom-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
