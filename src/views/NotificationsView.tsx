import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Megaphone, 
  CheckCheck, 
  ChevronRight, 
  Sparkles, 
  Calendar, 
  X,
  ExternalLink
} from 'lucide-react';
import { NotificationItem } from '../types';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    t, 
    language,
    theme 
  } = useApp();

  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'All' | 'News'>('All');
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);

  const filtered = notifications.filter((n) => {
    if (activeTab === 'News') return n.type === 'News';
    return true;
  });

  const handleOpenNotif = (notif: NotificationItem) => {
    markNotificationAsRead(notif.id);
    setSelectedNotif(notif);
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-3.5 animate-fade-in">
      {/* Header & Mark all as read */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-extrabold tracking-tight font-['Montserrat'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t('notifications.title', 'Centre de Notifications')}
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            {t('notifications.subtitle', 'Mises à jour actionnaires, communiqués et statuts')}
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          id="notifications-mark-all-read"
          className="text-xs font-bold text-[#C8880A] dark:text-[#F2B01E] hover:underline flex items-center gap-1"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>{t('notifications.markAllRead', 'Tout marquer comme lu')}</span>
        </button>
      </div>

      {/* Tabs: All / News */}
      <div className={`grid grid-cols-2 gap-1.5 p-1 rounded-lg border ${
        isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#141414] border-white/10'
      }`}>
        <button
          onClick={() => setActiveTab('All')}
          id="notif-tab-all"
          className={`py-2 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'All'
              ? 'bg-[#F2B01E] text-black shadow-sm'
              : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>{t('notifications.tabAll', 'Toutes')}</span>
        </button>
        <button
          onClick={() => setActiveTab('News')}
          id="notif-tab-news"
          className={`py-2 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'News'
              ? 'bg-[#F2B01E] text-black shadow-sm'
              : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>{t('notifications.tabNews', 'Actualités')}</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className={`p-8 text-center border rounded-lg ${
            isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#141414] border-white/10 text-gray-400'
          }`}>
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">
              {t('notifications.empty', 'Aucune notification à afficher.')}
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const title = language === 'fr' ? item.titleFr : item.titleEn;
            const body = language === 'fr' ? item.bodyFr : item.bodyEn;

            return (
              <div
                key={item.id}
                onClick={() => handleOpenNotif(item)}
                className={`p-3.5 rounded-lg border transition cursor-pointer relative overflow-hidden ${
                  item.isRead
                    ? isLight 
                      ? 'bg-white border-slate-200 text-slate-900 opacity-80 hover:opacity-100' 
                      : 'bg-[#141414] border-white/5 opacity-80 hover:opacity-100'
                    : isLight
                      ? 'bg-amber-50/50 border-amber-300 text-slate-900 shadow-sm'
                      : 'bg-[#181818] border-[#F2B01E]/40 shadow-sm text-white'
                }`}
              >
                {!item.isRead && (
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-[#F2B01E]" />
                )}

                <div className="flex items-start gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    item.type === 'News'
                      ? isLight ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-[#F2B01E]/10 text-[#F2B01E] border-[#F2B01E]/20'
                  }`}>
                    {item.type === 'News' ? (
                      <Megaphone className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${
                        isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white/5 text-gray-300 border-white/10'
                      }`}>
                        {item.type}
                      </span>
                      <span className={`text-[10px] flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    </div>

                    <h3 className={`text-xs font-bold leading-snug line-clamp-1 ${
                      isLight ? 'text-slate-900' : item.isRead ? 'text-gray-200' : 'text-white'
                    }`}>
                      {title}
                    </h3>
                    <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                      {body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed Announcement Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className={`w-full max-w-md border rounded-xl p-5 shadow-xl transition ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161616] border-white/10 text-white'
          } relative`}>
            <button
              onClick={() => setSelectedNotif(null)}
              className={`absolute top-4 right-4 p-1.5 rounded-lg transition ${
                isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              aria-label={t('app.close', 'Fermer')}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F2B01E]/20 text-amber-800 dark:text-[#F2B01E] border border-[#F2B01E]/30">
                {selectedNotif.type}
              </span>
              <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                {selectedNotif.date}
              </span>
            </div>

            <h3 className="text-base font-bold font-['Montserrat'] leading-tight mb-3">
              {language === 'fr' ? selectedNotif.titleFr : selectedNotif.titleEn}
            </h3>

            <div className={`text-xs leading-relaxed space-y-2.5 py-3 border-y ${isLight ? 'border-slate-200 text-slate-700' : 'border-white/10 text-gray-300'}`}>
              <p>
                {language === 'fr' ? selectedNotif.bodyFr : selectedNotif.bodyEn}
              </p>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                RAILBUS Communication Hub
              </span>
              <button
                onClick={() => setSelectedNotif(null)}
                className="px-3.5 py-2 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs transition shadow-sm"
              >
                {t('app.close', 'Fermer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
