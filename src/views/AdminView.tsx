import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Inbox, 
  DollarSign, 
  Users, 
  Phone, 
  Bell, 
  BookOpen, 
  Trash2, 
  Save, 
  Plus, 
  Eye, 
  X,
  FileText,
  FolderArchive,
  Play,
  Pause,
  Zap,
  ArrowDownLeft,
  ArrowUpRight,
  Activity,
  CloudCheck,
  Database,
  RefreshCw,
  Download,
  Check
} from 'lucide-react';
import { SubmissionStatus } from '../types';

interface AdminViewProps {
  onBackToApp: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onBackToApp }) => {
  const {
    adminAccount,
    isAdminLoggedIn,
    initAdminPassword,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword,
    submissions,
    updateSubmissionStatus,
    deleteSubmission,
    shares,
    updateSharePrice,
    points,
    updatePointsSettings,
    contactInfo,
    updateContactInfo,
    teamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    notifications,
    addNotification,
    deleteNotification,
    translations,
    updateTranslations,
    t,
    firebaseSyncStatus,
    firebaseLastSyncTime,
    syncNowWithFirebase,
    isCleanMode,
    archivedDemoAccounts,
    injectDemoAccountsToPlatform,
    retireDemoAccountsFromPlatform,
    isLiveSimulationActive,
    setIsLiveSimulationActive,
    triggerLiveDeposit,
    triggerLiveWithdrawal,
    liveProofEvents,
    transactions
  } = useApp();

  // Login & Init States
  const [emailInput, setEmailInput] = useState('antcoder.dev@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Admin Active Tab
  const [activeAdminTab, setActiveAdminTab] = useState<
    'submissions' | 'demo_archive' | 'live_proof' | 'finance' | 'contacts' | 'team' | 'news' | 'security' | 'translations'
  >('demo_archive');

  // Change Admin Password State
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmNewAdminPass, setConfirmNewAdminPass] = useState('');
  const [pwChangeStatus, setPwChangeStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  // Selected Submission Detail
  const [selectedSub, setSelectedSub] = useState<any | null>(null);

  // New Notification Form State
  const [newNotifType, setNewNotifType] = useState<'News' | 'Notification'>('News');
  const [newNotifTitleFr, setNewNotifTitleFr] = useState('');
  const [newNotifTitleEn, setNewNotifTitleEn] = useState('');
  const [newNotifBodyFr, setNewNotifBodyFr] = useState('');
  const [newNotifBodyEn, setNewNotifBodyEn] = useState('');

  // Editable Financials State
  const [editPriceUSD, setEditPriceUSD] = useState((shares?.sharePriceUSD ?? 1.25).toString());
  const [editPointsPerShare, setEditPointsPerShare] = useState((points?.pointsPerShare ?? 5000).toString());
  const [editReferralBonus, setEditReferralBonus] = useState((points?.referralBonusReferrer ?? points?.referralBonusPoints ?? 5000).toString());
  const [isSyncingFirebaseManual, setIsSyncingFirebaseManual] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Custom Live Trigger State
  const [customUser, setCustomUser] = useState('');
  const [customShares, setCustomShares] = useState('100');
  const [customAmountUSD, setCustomAmountUSD] = useState('125');

  // Editable Africa Contact State
  const [africaName, setAfricaName] = useState(contactInfo.africaContact.name);
  const [africaTitle, setAfricaTitle] = useState(contactInfo.africaContact.roleFr || 'Directeur Régional');
  const [africaEmail, setAfricaEmail] = useState(contactInfo.africaContact.email);
  const [africaPhone, setAfricaPhone] = useState(contactInfo.africaContact.phone);
  const [africaRegion, setAfricaRegion] = useState(contactInfo.africaContact.region);

  // New Team Member Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberBio, setNewMemberBio] = useState('');

  // Translation Editor State
  const [dictLang, setDictLang] = useState<'fr' | 'en'>('fr');
  const [dictKeyInput, setDictKeyInput] = useState('app.memberTag');
  const [dictValInput, setDictValInput] = useState(translations.fr.app?.memberTag || '');

  // 1. Handle Admin Authentication
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    // If first time initialization
    if (!adminAccount.isInitialized || !adminAccount.passwordHash) {
      if (emailInput.trim().toLowerCase() !== 'antcoder.dev@gmail.com') {
        setLoginError(t('admin.unauthorizedEmail', 'Accès refusé : Seule l\'adresse antcoder.dev@gmail.com est autorisée.'));
        return;
      }
      if (passwordInput !== confirmPasswordInput) {
        setLoginError('Les deux mots de passe ne correspondent pas.');
        return;
      }
      const res = initAdminPassword(passwordInput);
      if (res.success) {
        setLoginSuccess(res.message);
      } else {
        setLoginError(res.message);
      }
      return;
    }

    // Standard Login
    const res = loginAdmin(emailInput, passwordInput);
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  // 2. Handle Admin Password Change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminPass !== confirmNewAdminPass) {
      setPwChangeStatus({ type: 'error', message: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }
    const res = changeAdminPassword(currentAdminPass, newAdminPass);
    if (res.success) {
      setPwChangeStatus({ type: 'success', message: res.message });
      setCurrentAdminPass('');
      setNewAdminPass('');
      setConfirmNewAdminPass('');
    } else {
      setPwChangeStatus({ type: 'error', message: res.message });
    }
  };

  // 3. Handle Saving Financial Settings
  const handleSaveFinancials = () => {
    const pUSD = parseFloat(editPriceUSD) || 1.25;
    const pPoints = parseInt(editPointsPerShare, 10) || 5000;
    const pRef = parseInt(editReferralBonus, 10) || 5000;

    updateSharePrice(pUSD);
    updatePointsSettings({
      pointsPerShare: pPoints,
      referralBonusReferrer: pRef
    });
    setSyncFeedback('Barèmes enregistrés et synchronisés sur Firebase Firestore !');
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  // 4. Manual Firebase Sync
  const handleManualFirebaseSync = async () => {
    setIsSyncingFirebaseManual(true);
    try {
      await syncNowWithFirebase();
      setSyncFeedback('Synchronisation Firebase réussie avec succès !');
    } catch (err) {
      setSyncFeedback('Erreur lors de la synchronisation Firebase.');
    } finally {
      setIsSyncingFirebaseManual(false);
      setTimeout(() => setSyncFeedback(null), 4000);
    }
  };

  // 5. Handle Saving Contacts
  const handleSaveContacts = () => {
    updateContactInfo({
      africaContact: {
        name: africaName,
        roleFr: africaTitle,
        roleEn: africaTitle,
        email: africaEmail,
        phone: africaPhone,
        region: africaRegion
      }
    });
    setSyncFeedback('Coordonnées du contact Afrique mises à jour.');
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  // 6. Handle Adding Team Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberRole) return;
    addTeamMember({
      name: newMemberName,
      roleFr: newMemberRole,
      roleEn: newMemberRole,
      bioFr: newMemberBio || 'Membre de l\'équipe dirigeante RAILBUS.',
      bioEn: newMemberBio || 'Member of the RAILBUS leadership team.',
      initials: newMemberName.slice(0, 2).toUpperCase()
    });
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberBio('');
    setSyncFeedback('Nouveau dirigeant ajouté avec succès.');
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  // 7. Handle Adding News / Notification
  const handleAddNotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotifTitleFr || !newNotifBodyFr) return;
    addNotification({
      category: newNotifType === 'News' ? 'News' : 'Announcement',
      titleFr: newNotifTitleFr,
      titleEn: newNotifTitleEn || newNotifTitleFr,
      excerptFr: newNotifBodyFr.slice(0, 100),
      excerptEn: (newNotifBodyEn || newNotifBodyFr).slice(0, 100),
      contentFr: newNotifBodyFr,
      contentEn: newNotifBodyEn || newNotifBodyFr,
      badge: 'OFFICIEL'
    });
    setNewNotifTitleFr('');
    setNewNotifTitleEn('');
    setNewNotifBodyFr('');
    setNewNotifBodyEn('');
    setSyncFeedback('Notification publiée à tous les actionnaires.');
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  // 8. Handle Translation Update
  const handleSaveDictValue = () => {
    const keys = dictKeyInput.split('.');
    const dictCopy = JSON.parse(JSON.stringify(translations[dictLang]));
    let cur = dictCopy;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!cur[keys[i]]) cur[keys[i]] = {};
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = dictValInput;
    updateTranslations(dictLang, dictCopy);
    setSyncFeedback(`Clé ${dictKeyInput} mise à jour dans le dictionnaire.`);
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  // 9. Download Demo Pack
  const handleDownloadDemoJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(archivedDemoAccounts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'railbus_demo_accounts_pack.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // IF NOT LOGGED IN -> SHOW AUTH SCREEN
  if (!isAdminLoggedIn) {
    const isFirstTime = !adminAccount.isInitialized || !adminAccount.passwordHash;

    return (
      <div className="min-h-screen bg-[#0C0C0C] text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#141414] border border-[#F2B01E]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#F2B01E]/15 border border-[#F2B01E]/40 flex items-center justify-center text-[#F2B01E] mx-auto mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-white font-['Montserrat']">
              {t('admin.title', 'Console d\'Administration')}
            </h1>
            <p className="text-xs text-gray-400">
              Accès strictement restreint à <span className="text-[#F2B01E] font-mono">antcoder.dev@gmail.com</span>
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {loginSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{loginSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                {t('admin.emailLabel', 'Email Administrateur')}
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="antcoder.dev@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F2B01E]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                {isFirstTime ? 'Initialiser votre mot de passe' : t('admin.passwordLabel', 'Mot de passe')}
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F2B01E]"
                required
              />
            </div>

            {isFirstTime && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Confirmer le mot de passe initial
                </label>
                <input
                  type="password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F2B01E]"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              id="admin-login-button"
              className="w-full py-3 rounded-xl bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs transition shadow-md shadow-[#F2B01E]/20"
            >
              {isFirstTime ? 'Initialiser & Se connecter' : t('admin.loginButton', 'Connexion Administrateur')}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onBackToApp}
              className="text-xs text-gray-400 hover:text-white transition underline underline-offset-4"
            >
              Retour à l'application RAILBUS
            </button>
          </div>
        </div>
      </div>
    );
  }

  // IF LOGGED IN -> FULL ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white pb-20">
      {/* Admin Top Bar */}
      <header className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F2B01E] flex items-center justify-center text-black font-black">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm font-['Montserrat'] tracking-wide">
                  RAILBUS <span className="text-[#F2B01E]">ADMIN</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                  <CloudCheck className="w-3 h-3" />
                  <span>Firestore Sync</span>
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">antcoder.dev@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToApp}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200"
            >
              Voir l'App
            </button>
            <button
              onClick={logoutAdmin}
              id="admin-logout-button"
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Feedback notification */}
      {syncFeedback && (
        <div className="max-w-6xl mx-auto px-4 pt-3">
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{syncFeedback}</span>
            </div>
            <button onClick={() => setSyncFeedback(null)} className="text-emerald-300 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'demo_archive', label: 'Dossier Démo & Fictif', icon: FolderArchive, highlight: true },
            { id: 'live_proof', label: 'Preuve en Direct (Animée)', icon: Activity, highlight: true },
            { id: 'finance', label: 'Finance & Firebase Sync', icon: DollarSign },
            { id: 'submissions', label: `Demandes (${submissions.length})`, icon: Inbox },
            { id: 'contacts', label: 'Contacts & Afrique', icon: Phone },
            { id: 'team', label: 'Équipe Dirigeante', icon: Users },
            { id: 'news', label: 'Actualités & Notifs', icon: Bell },
            { id: 'translations', label: 'Dictionnaire FR/EN', icon: BookOpen },
            { id: 'security', label: 'Sécurité Admin', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-nav-${tab.id}`}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#F2B01E] text-black shadow-lg shadow-[#F2B01E]/10'
                    : tab.highlight
                    ? 'bg-amber-500/10 text-[#F2B01E] hover:bg-amber-500/20 border border-[#F2B01E]/20'
                    : 'bg-[#161616] text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Admin Content Container */}
      <main className="max-w-6xl mx-auto px-4 pt-4">

        {/* TAB 1: DOSSIER DEMO & COMPTES FICTIFS (Demande spécifique utilisateur) */}
        {activeAdminTab === 'demo_archive' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <FolderArchive className="w-5 h-5 text-[#F2B01E]" />
                    <h2 className="text-base font-bold text-white font-['Montserrat']">
                      Dossier Démo & Archive des Comptes Fictifs
                    </h2>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 max-w-2xl">
                    Conformément à vos directives, tous les comptes fictifs ont été retirés de la plateforme de production et préservés ici dans votre dossier administrateur. Vous pouvez les réinjecter à volonté pour alimenter la plateforme ou revenir au mode épuré en un clic.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleDownloadDemoJson}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exporter JSON</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isCleanMode
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${isCleanMode ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
                  <div>
                    <span className="font-extrabold text-sm block">
                      {isCleanMode ? 'Plateforme en Mode Épuré (Production)' : 'Comptes Fictifs Injectés (Mode Démonstration)'}
                    </span>
                    <span className="text-xs opacity-85">
                      {isCleanMode
                        ? 'Aucun compte fictif actif. La plateforme est prête pour les vrais actionnaires.'
                        : 'Les comptes démo alimentent actuellement le tableau de bord et le portefeuille pour démonstration.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isCleanMode ? (
                    <button
                      onClick={injectDemoAccountsToPlatform}
                      className="px-4 py-2 rounded-xl bg-[#F2B01E] hover:bg-[#E8B923] text-black font-extrabold text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Alimenter avec les comptes démo</span>
                    </button>
                  ) : (
                    <button
                      onClick={retireDemoAccountsFromPlatform}
                      className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Retirer & Revenir au mode épuré</span>
                    </button>
                  )}
                </div>
              </div>

              {/* List of Archived Accounts in Admin Folder */}
              <div className="pt-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#F2B01E]" />
                  <span>Comptes Démo Stockés dans le Dossier ({archivedDemoAccounts.length})</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {archivedDemoAccounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 hover:border-white/20 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#F2B01E]/15 border border-[#F2B01E]/30 flex items-center justify-center text-[#F2B01E] font-black text-xs">
                            {acc.avatarInitials}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-white">{acc.name}</h4>
                            <p className="text-[11px] text-gray-400 font-mono">{acc.email}</p>
                          </div>
                        </div>

                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-bold text-[#F2B01E]">
                          {acc.memberId}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-[10px] text-gray-400 block">Actions</span>
                          <span className="font-extrabold text-emerald-400">{acc.shares.toLocaleString()}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-[10px] text-gray-400 block">Points RAILBUS</span>
                          <span className="font-extrabold text-[#F2B01E]">{acc.points.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-white/5">
                        <span className="truncate">{acc.role}</span>
                        <span className="text-emerald-400 font-medium">Préservé en dossier</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PREUVE EN DIRECT & INTERACTIONS ANIMEES (Demande spécifique utilisateur) */}
        {activeAdminTab === 'live_proof' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-base font-bold text-white font-['Montserrat']">
                      Générateur d'Interactions Animées (Preuve de Fonctionnement)
                    </h2>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 max-w-2xl">
                    Moteur de simulation en temps réel pour démontrer les transactions de dépôts d'actions et de retraites (retraits de dividendes) avec animation immédiate et synchronisation Firestore.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsLiveSimulationActive(!isLiveSimulationActive)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      isLiveSimulationActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/5 text-gray-400 border border-white/10'
                    }`}
                  >
                    {isLiveSimulationActive ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Simulation Active</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Simulation en Pause</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instant Action Triggers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-[#0F1E16] border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ArrowDownLeft className="w-4 h-4" />
                      <span>Dépôt / Souscription Animé</span>
                    </span>
                    <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                      Preuve Immédiate
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Génère un dépôt d'actions instantané avec notification animée et mise à jour du portefeuille.
                  </p>
                  <button
                    onClick={() => triggerLiveDeposit(100, 125)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                  >
                    <Zap className="w-4 h-4" />
                    <span>⚡ Déclencher un Dépôt (+100 Actions / $125 USD)</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#1F170F] border border-[#F2B01E]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-[#F2B01E] uppercase tracking-wider flex items-center gap-1.5">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>Retraite / Retrait Dividende</span>
                    </span>
                    <span className="text-[10px] text-[#F2B01E] bg-[#F2B01E]/20 px-2 py-0.5 rounded-full font-bold">
                      Preuve Immédiate
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Génère un versement/retrait de dividendes trimestriel avec notification animée et journal de bord.
                  </p>
                  <button
                    onClick={() => triggerLiveWithdrawal(150)}
                    className="w-full py-2.5 rounded-xl bg-[#F2B01E] hover:bg-[#E8B923] text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-[#F2B01E]/20"
                  >
                    <Zap className="w-4 h-4" />
                    <span>⚡ Déclencher une Retraite ($150 USD)</span>
                  </button>
                </div>
              </div>

              {/* Stream of Live Proof Events */}
              <div className="pt-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Journal des Interactions Animées Récentes</span>
                </h3>

                {liveProofEvents.length === 0 ? (
                  <div className="p-6 text-center bg-black/40 border border-white/5 rounded-xl text-xs text-gray-400">
                    Aucune interaction déclenchée pour le moment. Cliquez sur les boutons ci-dessus pour déclencher un dépôt ou un retrait animé.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {liveProofEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              evt.type === 'Deposit'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-[#F2B01E]/20 text-[#F2B01E] border border-[#F2B01E]/30'
                            }`}
                          >
                            {evt.type === 'Deposit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-white">{evt.user}</span>
                              <span className="text-[10px] text-gray-400">{evt.timestamp}</span>
                            </div>
                            <span className="text-[11px] text-gray-300">{evt.detail}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`font-black text-xs block ${
                              evt.type === 'Deposit' ? 'text-emerald-400' : 'text-[#F2B01E]'
                            }`}
                          >
                            {evt.amount}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-medium">✓ Validé & Enregistré</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FINANCIAL PARAMETERS & FIREBASE SYNC */}
        {activeAdminTab === 'finance' && (
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-5 max-w-2xl">
            {/* Firebase Live Synchronizer Card */}
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudCheck className="w-5 h-5 text-blue-400" />
                  <h3 className="font-extrabold text-sm text-white">
                    Synchronisation Cloud Firebase Firestore
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {firebaseSyncStatus === 'connected' ? 'En Ligne & Connecté' : firebaseSyncStatus}
                </span>
              </div>

              <div className="text-xs text-gray-300 space-y-1">
                <p>
                  <span className="text-gray-400">Projet Cloud :</span> <span className="font-mono text-white">gen-lang-client-0339585288</span>
                </p>
                <p>
                  <span className="text-gray-400">Document Principal :</span> <span className="font-mono text-white">system_settings/financials</span>
                </p>
                {firebaseLastSyncTime && (
                  <p>
                    <span className="text-gray-400">Dernière mise à jour :</span> <span className="font-mono text-emerald-400">{firebaseLastSyncTime}</span>
                  </p>
                )}
              </div>

              <button
                onClick={handleManualFirebaseSync}
                disabled={isSyncingFirebaseManual}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingFirebaseManual ? 'animate-spin' : ''}`} />
                <span>{isSyncingFirebaseManual ? 'Synchronisation en cours...' : 'Synchroniser maintenant avec Firestore'}</span>
              </button>
            </div>

            <div>
              <h2 className="text-base font-bold text-white font-['Montserrat']">
                Barèmes & Paramètres Financiers
              </h2>
              <p className="text-xs text-gray-400">
                Toute modification effectuée ici est immédiatement synchronisée sur Firestore et répercutée en direct sur l'application des membres.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Prix indicatif de l'action ordinaire (USD)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={editPriceUSD}
                  onChange={(e) => setEditPriceUSD(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#F2B01E]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Barème de conversion (Points par action)
                </label>
                <input
                  type="number"
                  step="500"
                  value={editPointsPerShare}
                  onChange={(e) => setEditPointsPerShare(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#F2B01E]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Bonus de Parrainage Parrain (Points)
                </label>
                <input
                  type="number"
                  step="500"
                  value={editReferralBonus}
                  onChange={(e) => setEditReferralBonus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:border-[#F2B01E]"
                />
              </div>

              <button
                onClick={handleSaveFinancials}
                className="w-full mt-2 py-3 rounded-xl bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-[#F2B01E]/20"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder & Synchroniser Firestore</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SUBMISSIONS MANAGEMENT */}
        {activeAdminTab === 'submissions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-['Montserrat']">
                Demandes & Formulaires Reçus
              </h2>
              <span className="text-xs text-gray-400">
                {submissions.length} entrée(s) stockée(s)
              </span>
            </div>

            {submissions.length === 0 ? (
              <div className="p-8 text-center bg-[#141414] border border-white/10 rounded-2xl">
                <p className="text-xs text-gray-400">Aucune soumission pour le moment.</p>
              </div>
            ) : (
              submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/20 transition space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-[#F2B01E] font-bold">
                          {sub.type}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {sub.formName}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{sub.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={sub.status}
                        onChange={(e) => updateSubmissionStatus(sub.id, e.target.value as SubmissionStatus)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                          sub.status === 'Processed'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : sub.status === 'Archived'
                            ? 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <option value="New" className="bg-[#181818] text-amber-400">Nouveau</option>
                        <option value="Processed" className="bg-[#181818] text-emerald-400">Traité</option>
                        <option value="Archived" className="bg-[#181818] text-gray-400">Archivé</option>
                      </select>

                      <button
                        onClick={() => deleteSubmission(sub.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-300">
                    <pre className="font-mono text-[11px] whitespace-pre-wrap">
                      {JSON.stringify(sub.data, null, 2)}
                    </pre>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 5: CONTACTS & AFRICA REGIONAL */}
        {activeAdminTab === 'contacts' && (
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4 max-w-lg">
            <div>
              <h2 className="text-base font-bold text-white font-['Montserrat']">
                Coordonnées Direction Afrique
              </h2>
              <p className="text-xs text-gray-400">
                Ces informations sont visibles sur toute l'application et les pages vitrines.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Nom du Directeur Régional</label>
                <input
                  type="text"
                  value={africaName}
                  onChange={(e) => setAfricaName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Titre Officiel</label>
                <input
                  type="text"
                  value={africaTitle}
                  onChange={(e) => setAfricaTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Email officiel Afrique</label>
                <input
                  type="email"
                  value={africaEmail}
                  onChange={(e) => setAfricaEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Téléphone / WhatsApp Afrique</label>
                <input
                  type="tel"
                  value={africaPhone}
                  onChange={(e) => setAfricaPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Région couverte</label>
                <input
                  type="text"
                  value={africaRegion}
                  onChange={(e) => setAfricaRegion(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/10 text-white"
                />
              </div>

              <button
                onClick={handleSaveContacts}
                className="w-full mt-2 py-2.5 rounded-xl bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Mettre à jour les contacts Afrique</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: TEAM MANAGEMENT */}
        {activeAdminTab === 'team' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white font-['Montserrat']">
              Gestion de l'Équipe RAILBUS
            </h2>

            <form onSubmit={handleAddMember} className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-3 text-xs max-w-lg">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#F2B01E]" />
                <span>Ajouter un membre dirigeant</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black border border-white/10 text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Rôle / Titre"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black border border-white/10 text-white"
                  required
                />
              </div>
              <textarea
                placeholder="Courte biographie"
                rows={2}
                value={newMemberBio}
                onChange={(e) => setNewMemberBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#F2B01E] text-black font-bold text-xs"
              >
                Ajouter à l'équipe
              </button>
            </form>

            <div className="space-y-2.5 max-w-lg">
              {teamMembers.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{m.name}</h4>
                    <span className="text-[11px] text-[#F2B01E]">{m.roleFr}</span>
                  </div>
                  <button
                    onClick={() => deleteTeamMember(m.id)}
                    className="p-1.5 text-gray-500 hover:text-rose-400"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: NEWS & NOTIFICATIONS PUBLISHER */}
        {activeAdminTab === 'news' && (
          <div className="space-y-4 max-w-lg">
            <h2 className="text-base font-bold text-white font-['Montserrat']">
              Diffuser une Actualité ou Notification
            </h2>

            <form onSubmit={handleAddNotif} className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={newNotifType === 'News'}
                    onChange={() => setNewNotifType('News')}
                    className="accent-[#F2B01E]"
                  />
                  <span>Actualité (News)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={newNotifType === 'Notification'}
                    onChange={() => setNewNotifType('Notification')}
                    className="accent-[#F2B01E]"
                  />
                  <span>Notification Opérationnelle</span>
                </label>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Titre (Français)</label>
                <input
                  type="text"
                  value={newNotifTitleFr}
                  onChange={(e) => setNewNotifTitleFr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Titre (Anglais)</label>
                <input
                  type="text"
                  value={newNotifTitleEn}
                  onChange={(e) => setNewNotifTitleEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Message (Français)</label>
                <textarea
                  rows={3}
                  value={newNotifBodyFr}
                  onChange={(e) => setNewNotifBodyFr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Message (Anglais)</label>
                <textarea
                  rows={2}
                  value={newNotifBodyEn}
                  onChange={(e) => setNewNotifBodyEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#F2B01E] text-black font-bold text-xs"
              >
                Publier la notification
              </button>
            </form>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase">Historique publié</h3>
              {notifications.map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-semibold text-white">{n.titleFr}</h4>
                    <span className="text-[10px] text-gray-400">{n.date}</span>
                  </div>
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="p-1.5 text-gray-500 hover:text-rose-400"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: TRANSLATIONS DICTIONARY EDITOR */}
        {activeAdminTab === 'translations' && (
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4 max-w-lg text-xs">
            <h2 className="text-base font-bold text-white font-['Montserrat']">
              Éditeur de Dictionnaire Bilingue
            </h2>
            <p className="text-gray-400">
              Modifiez n'importe quel texte ou titre de l'application en direct.
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDictLang('fr')}
                className={`px-3 py-1.5 rounded-xl font-bold ${dictLang === 'fr' ? 'bg-[#F2B01E] text-black' : 'bg-white/5 text-gray-400'}`}
              >
                Français (FR)
              </button>
              <button
                onClick={() => setDictLang('en')}
                className={`px-3 py-1.5 rounded-xl font-bold ${dictLang === 'en' ? 'bg-[#F2B01E] text-black' : 'bg-white/5 text-gray-400'}`}
              >
                English (EN)
              </button>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Clé du dictionnaire</label>
              <input
                type="text"
                value={dictKeyInput}
                onChange={(e) => setDictKeyInput(e.target.value)}
                placeholder="Ex: dashboard.greeting"
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Valeur traduite</label>
              <textarea
                rows={3}
                value={dictValInput}
                onChange={(e) => setDictValInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white"
              />
            </div>

            <button
              onClick={handleSaveDictValue}
              className="w-full py-2.5 rounded-xl bg-[#F2B01E] text-black font-bold"
            >
              Mettre à jour le texte
            </button>
          </div>
        )}

        {/* TAB 9: ADMIN SECURITY (PASSWORD CHANGE) */}
        {activeAdminTab === 'security' && (
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4 max-w-md">
            <div>
              <h2 className="text-base font-bold text-white font-['Montserrat']">
                Changement de Mot de Passe Admin
              </h2>
              <p className="text-xs text-gray-400">
                Modification réservée à antcoder.dev@gmail.com.
              </p>
            </div>

            {pwChangeStatus.type === 'success' && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{pwChangeStatus.message}</span>
              </div>
            )}

            {pwChangeStatus.type === 'error' && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pwChangeStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Mot de passe admin actuel
                </label>
                <input
                  type="password"
                  value={currentAdminPass}
                  onChange={(e) => setCurrentAdminPass(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/10 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Nouveau mot de passe (min 6 caractères)
                </label>
                <input
                  type="password"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/10 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={confirmNewAdminPass}
                  onChange={(e) => setConfirmNewAdminPass(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/10 text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#F2B01E] text-black font-bold transition shadow"
              >
                Mettre à jour le mot de passe admin
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
