import React from 'react';
import { useApp } from '../context/AppContext';
import { Globe, Info, ShieldCheck, Sun, Moon, Crown, LogOut } from 'lucide-react';

interface HeaderProps {
  onOpenAbout?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAbout, onOpenAdmin }) => {
  const { user, language, setLanguage, t, activeTab, setActiveTab, theme, setTheme, logoutUser } = useApp();

  const isLight = theme === 'light';

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  const toggleTheme = () => {
    setTheme(isLight ? 'dark' : 'light');
  };

  const isAdmin = user.role === 'admin' || user.isFirstAdmin;

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 py-3 transition-colors ${
      isLight 
        ? 'bg-white/95 border-slate-200 text-slate-900 shadow-sm' 
        : 'bg-[#0A0A0A]/95 border-white/10 text-white'
    }`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Tag */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => setActiveTab('dashboard')}
          id="header-brand-logo"
        >
          {/* Emblem without gradient or glow */}
          <div className="w-8 h-8 rounded-lg bg-[#F2B01E] flex items-center justify-center text-black font-extrabold text-sm shadow-sm">
            RB
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-extrabold tracking-widest text-lg font-['Montserrat'] ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                RAIL<span className="text-[#F2B01E]">B</span>US
              </span>
              {isAdmin ? (
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold bg-[#F2B01E] text-black flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5" />
                  <span>Admin</span>
                </span>
              ) : (
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold bg-[#F2B01E]/20 text-[#F2B01E] border border-[#F2B01E]/30">
                  {t('app.activeStatus', 'Actif')}
                </span>
              )}
            </div>
            <p className={`text-[10px] font-medium tracking-tight ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              {isAdmin ? 'ADMINISTRATION CENTRALE' : t('app.memberTag', 'MEMBRES & ACTIONNAIRES')}
            </p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Day / Night Mode Toggle */}
          <button
            onClick={toggleTheme}
            id="header-theme-toggle"
            className={`p-1.5 rounded-lg border text-xs font-semibold transition ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
            }`}
            title={isLight ? 'Activer le mode sombre' : 'Activer le mode jour'}
          >
            {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-[#F2B01E]" />}
          </button>

          {/* Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            id="lang-toggle-button"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200'
            }`}
            title="Changer de langue / Switch language"
          >
            <Globe className="w-3.5 h-3.5 text-[#F2B01E]" />
            <span className="uppercase font-bold">{language}</span>
          </button>

          {/* About / Showcase Link Button */}
          <button
            onClick={() => setActiveTab('about')}
            id="header-about-button"
            className={`p-1.5 rounded-lg border transition ${
              activeTab === 'about'
                ? 'bg-[#F2B01E] text-black border-[#F2B01E]'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
            }`}
            title={t('nav.about', 'À propos de RAILBUS')}
          >
            <Info className="w-4 h-4" />
          </button>

          {/* User Avatar with initials */}
          <button
            onClick={() => setActiveTab('settings')}
            id="header-profile-button"
            className="flex items-center gap-1.5 pl-0.5 focus:outline-none"
            title={`${user.name} (${user.memberId})`}
          >
            <div className={`w-8 h-8 rounded-lg border-2 border-[#F2B01E] flex items-center justify-center text-xs font-bold ${
              isLight ? 'bg-slate-200 text-black' : 'bg-[#181818] text-[#F2B01E]'
            }`}>
              {user.initials || 'RB'}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
