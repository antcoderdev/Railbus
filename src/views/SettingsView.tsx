import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Globe, 
  Moon, 
  Sun,
  Lock, 
  User, 
  Share2, 
  Copy, 
  Check, 
  Headphones, 
  MessageSquare, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ExternalLink, 
  RotateCcw, 
  Briefcase,
  ChevronRight,
  Info,
  Key,
  Crown,
  LogOut
} from 'lucide-react';
import { ChangePasswordModal } from '../components/ChangePasswordModal';

interface SettingsViewProps {
  onOpenAdmin: () => void;
  onOpenFoundingPartner: () => void;
  onOpenContactSupport: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onOpenAdmin,
  onOpenFoundingPartner,
  onOpenContactSupport
}) => {
  const { 
    user, 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    points, 
    currency, 
    setCurrency, 
    contactInfo, 
    t, 
    resetAllToFactory,
    logoutUser 
  } = useApp();

  const isLight = theme === 'light';
  const isAdmin = user.role === 'admin' || user.isFirstAdmin;

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(
      `${t('referral.shareText')} ${points.referralCode}`
    );
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RAILBUS Members',
          text: `${t('referral.shareText')} ${points.referralCode}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      handleCopyReferral();
    }
  };

  return (
    <div className="pb-28 pt-3 px-4 max-w-md mx-auto space-y-4 animate-fade-in">
      {/* View Header */}
      <div>
        <h1 className={`text-xl font-extrabold tracking-tight font-['Montserrat'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {t('settings.title', 'Paramètres & Profil')}
        </h1>
        <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
          {t('settings.profile', 'Gestion du compte et préférences')}
        </p>
      </div>

      {/* Admin Quick Action Banner if user is Admin */}
      {isAdmin && (
        <div className={`rounded-lg p-4 border flex items-center justify-between shadow-sm ${
          isLight ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-[#18150C] border-[#F2B01E]/40 text-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F2B01E] text-black flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs tracking-tight">Tableau de Bord Administrateur</h3>
              <p className={`text-[11px] leading-tight ${isLight ? 'text-amber-900' : 'text-gray-300'}`}>
                Accédez à la gestion centrale des souscriptions, validations et simulation.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAdmin}
            id="settings-open-admin-btn"
            className="px-3 py-2 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs transition shrink-0 active:scale-95 shadow-sm"
          >
            Ouvrir
          </button>
        </div>
      )}

      {/* User Profile Card */}
      <div className={`rounded-lg p-5 border shadow-sm transition ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
      }`}>
        <div className="flex items-center gap-3.5 mb-4">
          <div className={`w-12 h-12 rounded-lg border-2 border-[#F2B01E] flex items-center justify-center text-base font-bold shrink-0 ${
            isLight ? 'bg-slate-100 text-black' : 'bg-[#1E1E1E] text-[#F2B01E]'
          }`}>
            {user.initials || 'RB'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className={`text-sm font-bold truncate font-['Montserrat'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {user.name}
              </h2>
              {isAdmin ? (
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#F2B01E] text-black shrink-0">
                  Admin
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{user.isVerified ? t('settings.verified', 'Vérifié') : 'En attente'}</span>
                </span>
              )}
            </div>
            <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{user.email}</p>
            <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
              {t('settings.memberSince', 'Membre depuis')} : {user.memberSince} • ID: {user.memberId}
            </p>
          </div>
        </div>

        {/* User Details Grid */}
        <div className={`grid grid-cols-2 gap-2 pt-3 border-t text-xs ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
          <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'}`}>
            <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{t('settings.country', 'Pays')}</span>
            <span className="font-semibold">{user.country}</span>
          </div>
          <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'}`}>
            <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{t('settings.phone', 'Téléphone')}</span>
            <span className="font-semibold truncate block">{user.phone}</span>
          </div>
        </div>

        {/* Change User Password Button */}
        <button
          onClick={() => setIsPasswordModalOpen(true)}
          id="settings-change-password-button"
          className={`w-full mt-3 py-2.5 px-3 rounded-lg border text-xs font-semibold transition flex items-center justify-between ${
            isLight 
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800' 
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#F2B01E]" />
            <span>{t('settings.changePassword', 'Changer mon mot de passe')}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Referral Program Section */}
      <div className={`rounded-lg p-5 border shadow-sm space-y-3 transition ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-xs font-bold uppercase tracking-wider font-['Montserrat'] ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
            {t('referral.title', 'Programme de Parrainage')}
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#F2B01E]/20 text-amber-800 dark:text-[#F2B01E]">
            {points.totalReferrals} {t('referral.referralsCount', 'parrainés')}
          </span>
        </div>

        <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
          {t('referral.subtitle', 'Gagnez 50 actions de bonus pour chaque investisseur parrainé.')}
        </p>

        {/* Code Container */}
        <div className={`flex items-center justify-between p-3 rounded-lg border ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/50 border-white/10'
        }`}>
          <div>
            <span className={`text-[10px] block ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>
              {t('referral.code', 'Votre code de parrainage')}
            </span>
            <span className="font-mono font-extrabold text-sm text-[#F2B01E] tracking-widest">
              {points.referralCode}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyReferral}
              id="copy-referral-button"
              className={`p-2 rounded-lg border transition ${
                isLight 
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
              }`}
              title="Copier le code"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleNativeShare}
              id="share-referral-button"
              className="px-3 py-2 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('referral.share', 'Partager')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Section: Language, Currency, Day/Night Theme */}
      <div className={`rounded-lg p-5 border shadow-sm space-y-3.5 transition ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
      }`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider font-['Montserrat'] ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
          {t('settings.preferences', 'Préférences')}
        </h3>

        {/* Language Selection */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-xs font-medium">
            <Globe className="w-4 h-4 text-[#F2B01E]" />
            <span>{t('settings.language', 'Langue')}</span>
          </div>

          <div className={`flex items-center gap-1 p-1 rounded-lg border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/50 border-white/10'
          }`}>
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition ${
                language === 'fr' 
                  ? 'bg-[#F2B01E] text-black shadow-sm' 
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              Français
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition ${
                language === 'en' 
                  ? 'bg-[#F2B01E] text-black shadow-sm' 
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Currency Selection */}
        <div className={`flex items-center justify-between pt-2 border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
          <div className="text-xs font-medium">
            <span>{t('settings.currency', 'Devise de calcul')}</span>
          </div>

          <div className={`flex items-center gap-1 p-1 rounded-lg border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/50 border-white/10'
          }`}>
            {(['USD', 'EUR', 'XOF', 'AED'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2 py-1.5 rounded-md text-xs font-bold transition ${
                  currency === c 
                    ? 'bg-[#F2B01E] text-black shadow-sm' 
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Theme: Mode Jour (Clair) / Sombre / OLED */}
        <div className={`flex items-center justify-between pt-2 border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
          <div className="flex items-center gap-2 text-xs font-medium">
            {isLight ? <Sun className="w-4 h-4 text-amber-600" /> : <Moon className="w-4 h-4 text-[#F2B01E]" />}
            <span>{t('settings.theme', 'Thème d\'affichage')}</span>
          </div>

          <div className={`flex items-center gap-1 p-1 rounded-lg border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/50 border-white/10'
          }`}>
            <button
              onClick={() => setTheme('light')}
              id="theme-select-light"
              className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition ${
                theme === 'light' 
                  ? 'bg-[#F2B01E] text-black shadow-sm' 
                  : isLight ? 'text-slate-600' : 'text-gray-400 hover:text-white'
              }`}
            >
              Jour
            </button>
            <button
              onClick={() => setTheme('dark')}
              id="theme-select-dark"
              className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition ${
                theme === 'dark' 
                  ? 'bg-[#F2B01E] text-black shadow-sm' 
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sombre
            </button>
            <button
              onClick={() => setTheme('oled')}
              id="theme-select-oled"
              className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition ${
                theme === 'oled' 
                  ? 'bg-[#F2B01E] text-black shadow-sm' 
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              OLED
            </button>
          </div>
        </div>
      </div>

      {/* Official Contacts & Support Section */}
      <div className={`rounded-lg p-5 border shadow-sm space-y-3 transition ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
      }`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider font-['Montserrat'] flex items-center gap-1.5 ${
          isLight ? 'text-slate-600' : 'text-gray-400'
        }`}>
          <Headphones className="w-4 h-4 text-[#F2B01E]" />
          {t('contact.title', 'Contact & Support')}
        </h3>

        {/* Fast Action Buttons: WhatsApp & General Contact Form */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={contactInfo.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition ${
              isLight 
                ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800' 
                : 'bg-emerald-600/10 hover:bg-emerald-600/20 border-emerald-500/30 text-emerald-400'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={onOpenContactSupport}
            id="open-support-form-button"
            className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition ${
              isLight 
                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
            }`}
          >
            <Mail className="w-4 h-4 text-[#F2B01E]" />
            <span>{t('contact.supportEmail', 'Support')}</span>
          </button>
        </div>

        {/* Founding Partner Interest Declaration Banner */}
        <button
          onClick={onOpenFoundingPartner}
          id="open-founding-partner-button"
          className={`w-full p-3.5 rounded-lg border text-left transition group ${
            isLight 
              ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-100/70' 
              : 'bg-[#181818] border-[#F2B01E]/40 hover:border-[#F2B01E]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#F2B01E]" />
              <span className={`text-xs font-bold font-['Montserrat'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {t('contact.foundingPartner', 'Déclaration d\'intérêt Founding Partner')}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#F2B01E] group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
            Partenariat institutionnel & souscription de grands comptes
          </p>
        </button>

        {/* Regional Africa Official Contact (M. Bakwa Kamara) */}
        <div className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/50 border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#F2B01E]">
              {contactInfo.africaContact.title}
            </span>
            <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{contactInfo.africaContact.region}</span>
          </div>
          <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {contactInfo.africaContact.name}
          </h4>
          <div className="flex flex-col gap-1 pt-1 text-[11px]">
            <a href={`mailto:${contactInfo.africaContact.email}`} className="hover:text-[#F2B01E] flex items-center gap-1.5 text-gray-500 dark:text-gray-300">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>{contactInfo.africaContact.email}</span>
            </a>
            <a href={`tel:${contactInfo.africaContact.phone}`} className="hover:text-[#F2B01E] flex items-center gap-1.5 text-gray-500 dark:text-gray-300">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>{contactInfo.africaContact.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* App Info & Actions */}
      <div className={`rounded-lg p-5 border shadow-sm space-y-3 text-xs transition ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
      }`}>
        <div className="flex items-center justify-between">
          <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>{t('settings.appVersion', 'Version de l\'application')}</span>
          <span className="font-mono font-bold">v2.5.0 (Native PWA • Multi-Thème)</span>
        </div>

        <div className="flex items-center justify-between">
          <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>Service Worker & Hors-Ligne</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            Actif & Sécurisé
          </span>
        </div>

        {/* Actions: Log Out & Reset Demo */}
        <div className={`pt-3 border-t flex items-center justify-between gap-2 ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
          <button
            onClick={() => {
              if (confirm('Voulez-vous vraiment vous déconnecter de votre compte actionnaire ?')) {
                logoutUser();
              }
            }}
            id="settings-logout-button"
            className="px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Se déconnecter</span>
          </button>

          <button
            onClick={onOpenAdmin}
            id="admin-portal-link"
            className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
              isLight 
                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-[#F2B01E]'
            }`}
            title="Espace d'administration réservé"
          >
            <Key className="w-3.5 h-3.5 text-[#F2B01E]" />
            <span>Administration</span>
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};
