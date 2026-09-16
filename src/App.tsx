import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LiveActivityBanner } from './components/LiveActivityBanner';
import { BottomNav } from './components/BottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { OnboardingModal } from './components/OnboardingModal';
import { FoundingPartnerModal } from './components/FoundingPartnerModal';
import { ContactSupportModal } from './components/ContactSupportModal';

import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';
import { MySharesView } from './views/MySharesView';
import { TransactionsView } from './views/TransactionsView';
import { NotificationsView } from './views/NotificationsView';
import { SettingsView } from './views/SettingsView';
import { AboutRailbusView } from './views/AboutRailbusView';
import { AdminView } from './views/AdminView';

export function App() {
  const { activeTab, setActiveTab, theme, isAuthenticated, user } = useApp();
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isFoundingPartnerOpen, setIsFoundingPartnerOpen] = useState(false);
  const [isContactSupportOpen, setIsContactSupportOpen] = useState(false);

  const isLight = theme === 'light';

  // Check URL path or hash for #admin or /admin
  useEffect(() => {
    const checkAdminPath = () => {
      if (
        window.location.pathname.startsWith('/admin') ||
        window.location.hash === '#admin'
      ) {
        setIsAdminRoute(true);
      }
    };
    checkAdminPath();
    window.addEventListener('popstate', checkAdminPath);
    window.addEventListener('hashchange', checkAdminPath);

    return () => {
      window.removeEventListener('popstate', checkAdminPath);
      window.removeEventListener('hashchange', checkAdminPath);
    };
  }, []);

  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
    setIsAdminRoute(true);
  };

  const handleBackToApp = () => {
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    }
    setIsAdminRoute(false);
  };

  // 1. If not authenticated, require registration or login
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${
        isLight ? 'bg-slate-50 text-slate-900' : theme === 'oled' ? 'bg-black text-white' : 'bg-[#0A0A0A] text-white'
      }`}>
        <OfflineIndicator />
        <PWAInstallPrompt />
        <AuthView onSuccess={() => {}} />
      </div>
    );
  }

  // 2. If on Admin Route, display dedicated Admin View
  if (isAdminRoute) {
    return (
      <div className={`min-h-screen ${
        isLight ? 'bg-slate-100 text-slate-900' : theme === 'oled' ? 'bg-black text-white' : 'bg-[#0A0A0A] text-white'
      }`}>
        <AdminView onBackToApp={handleBackToApp} />
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 select-none sm:select-auto ${
        isLight ? 'bg-slate-100 text-slate-900' : theme === 'oled' ? 'bg-black text-gray-100' : 'bg-[#0A0A0A] text-gray-100'
      }`}
    >
      {/* Offline Status Badge */}
      <OfflineIndicator />

      {/* Main Top Header */}
      <Header 
        onOpenAbout={() => setActiveTab('about')}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Live Proof of Execution Banner (Animated Deposits & Withdrawals) */}
      <LiveActivityBanner />

      {/* Primary Scrollable Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'shares' && <MySharesView />}
        {activeTab === 'transactions' && <TransactionsView />}
        {activeTab === 'notifications' && <NotificationsView />}
        {activeTab === 'settings' && (
          <SettingsView
            onOpenAdmin={handleOpenAdmin}
            onOpenFoundingPartner={() => setIsFoundingPartnerOpen(true)}
            onOpenContactSupport={() => setIsContactSupportOpen(true)}
          />
        )}
        {activeTab === 'about' && (
          <AboutRailbusView
            onOpenFoundingPartner={() => setIsFoundingPartnerOpen(true)}
            onOpenContactSupport={() => setIsContactSupportOpen(true)}
          />
        )}
      </main>

      {/* Bottom Sticky Navigation Bar */}
      <BottomNav />

      {/* PWA Floating Install Prompt & iOS Safari Modal */}
      <PWAInstallPrompt />

      {/* First-launch 5-Slide Onboarding */}
      <OnboardingModal />

      {/* Modals Accessible Globally */}
      <FoundingPartnerModal
        isOpen={isFoundingPartnerOpen}
        onClose={() => setIsFoundingPartnerOpen(false)}
      />

      <ContactSupportModal
        isOpen={isContactSupportOpen}
        onClose={() => setIsContactSupportOpen(false)}
      />
    </div>
  );
}

export default App;
