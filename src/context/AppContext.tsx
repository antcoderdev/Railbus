import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Language,
  ThemeMode,
  Currency,
  NavTab,
  UserProfile,
  SharesData,
  PointsSettings,
  Transaction,
  NotificationItem,
  TeamMember,
  VehicleSpec,
  RoadmapMilestone,
  ContactInfo,
  FormSubmission,
  AdminAccount,
  SubmissionStatus,
  DemoAccountItem,
  LiveProofEvent
} from '../types';
import frLocale from '../locales/fr.json';
import enLocale from '../locales/en.json';
import {
  initialUserProfile,
  initialSharesData,
  initialPointsSettings,
  initialTransactions,
  initialNotifications,
  initialTeamMembers,
  initialVehicleSpecs,
  initialRoadmap,
  initialContactInfo,
  initialSubmissions,
  initialAdminAccount,
  cleanUserProfile,
  cleanSharesData,
  cleanPointsSettings,
  cleanTransactions,
  initialArchivedDemoAccounts,
  initialArchivedDemoTransactions
} from '../data/initialData';
import { db, handleFirestoreError, OperationType, testFirestoreConnection } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatCurrency: (amountUSD: number) => string;

  // Firebase Sync State
  firebaseSyncStatus: 'connected' | 'syncing' | 'offline';
  firebaseLastSyncTime: string | null;
  syncNowWithFirebase: () => Promise<void>;

  // Clean mode & Admin Demo Repository (Dossier administrateur)
  isCleanMode: boolean;
  archivedDemoAccounts: DemoAccountItem[];
  injectDemoAccountsToPlatform: () => void;
  retireDemoAccountsFromPlatform: () => void;

  // Live Animated Interactions (Dépôt & Retrait - Preuve de fonctionnement)
  isLiveSimulationActive: boolean;
  setIsLiveSimulationActive: (active: boolean) => void;
  triggerLiveDeposit: (sharesCount?: number, usd?: number) => void;
  triggerLiveWithdrawal: (usd?: number) => void;
  liveProofEvents: LiveProofEvent[];
  latestLiveEvent: LiveProofEvent | null;
  dismissLatestLiveEvent: () => void;

  // Onboarding
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Authentication & Registered Users Gate
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  registeredUsers: UserProfile[];
  loginUser: (email: string, pass: string) => { success: boolean; message: string; user?: UserProfile; isFirstAdmin?: boolean };
  registerUser: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    country?: string;
    password: string;
  }) => { success: boolean; message: string; user?: UserProfile; isFirstAdmin?: boolean };
  logoutUser: () => void;

  // User
  user: UserProfile;
  changeUserPassword: (currentPass: string, newPass: string) => { success: boolean; message: string };

  // Financials & Shares
  shares: SharesData;
  points: PointsSettings;
  updatePointsSettings: (newSettings: Partial<PointsSettings>) => void;
  updateSharePrice: (priceUSD: number) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'reference' | 'date' | 'status'> & { status?: Transaction['status'] }) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'date' | 'isRead'>) => void;
  deleteNotification: (id: string) => void;

  // Showcase / About Data
  contactInfo: ContactInfo;
  updateContactInfo: (info: Partial<ContactInfo>) => void;
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  vehicleSpecs: VehicleSpec[];
  updateVehicleSpecs: (specs: VehicleSpec[]) => void;
  roadmap: RoadmapMilestone[];
  updateRoadmap: (roadmap: RoadmapMilestone[]) => void;

  // Submissions
  submissions: FormSubmission[];
  addSubmission: (type: FormSubmission['type'], formName: string, data: Record<string, any>) => void;
  updateSubmissionStatus: (id: string, status: SubmissionStatus) => void;
  deleteSubmission: (id: string) => void;

  // Admin
  adminAccount: AdminAccount;
  isAdminLoggedIn: boolean;
  initAdminPassword: (password: string) => { success: boolean; message: string };
  loginAdmin: (email: string, password: string) => { success: boolean; message: string };
  logoutAdmin: () => void;
  changeAdminPassword: (currentPass: string, newPass: string) => { success: boolean; message: string };

  // Dictionaries
  translations: { fr: Record<string, any>; en: Record<string, any> };
  updateTranslations: (lang: Language, newDict: Record<string, any>) => void;

  // Global reset
  resetAllToFactory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANGUAGE: 'railbus_lang',
  THEME: 'railbus_theme',
  ONBOARDING: 'railbus_onboarding_done',
  USER: 'railbus_user_profile',
  SHARES: 'railbus_shares_data',
  POINTS: 'railbus_points_settings',
  CURRENCY: 'railbus_currency',
  TRANSACTIONS: 'railbus_transactions',
  NOTIFICATIONS: 'railbus_notifications',
  CONTACTS: 'railbus_contacts_info',
  TEAM: 'railbus_team_members',
  SPECS: 'railbus_vehicle_specs',
  ROADMAP: 'railbus_roadmap',
  SUBMISSIONS: 'railbus_submissions',
  ADMIN: 'railbus_admin_account',
  ADMIN_AUTH: 'railbus_admin_logged_in',
  AUTH_CURRENT_USER: 'railbus_auth_current_user',
  AUTH_IS_AUTHENTICATED: 'railbus_is_authenticated',
  AUTH_REGISTERED_USERS: 'railbus_registered_users',
  DICT_FR: 'railbus_dict_fr',
  DICT_EN: 'railbus_dict_en',
  CLEAN_MODE: 'railbus_clean_mode',
  ARCHIVED_DEMO_ACCOUNTS: 'railbus_archived_demo_accounts',
  LIVE_SIM_ACTIVE: 'railbus_live_sim_active'
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (fallback !== null && typeof fallback === 'object' && !Array.isArray(fallback)) {
      return { ...fallback, ...parsed };
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Language & Translations
  const [language, setLanguageState] = useState<Language>(() => getStorage(STORAGE_KEYS.LANGUAGE, 'fr'));
  const [translations, setTranslations] = useState<{ fr: Record<string, any>; en: Record<string, any> }>(() => ({
    fr: getStorage(STORAGE_KEYS.DICT_FR, frLocale),
    en: getStorage(STORAGE_KEYS.DICT_EN, enLocale)
  }));

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setStorage(STORAGE_KEYS.LANGUAGE, lang);
    document.documentElement.lang = lang;
  };

  const updateTranslations = (lang: Language, newDict: Record<string, any>) => {
    setTranslations((prev) => {
      const updated = { ...prev, [lang]: newDict };
      setStorage(lang === 'fr' ? STORAGE_KEYS.DICT_FR : STORAGE_KEYS.DICT_EN, newDict);
      return updated;
    });
  };

  const t = (path: string, fallback?: string): string => {
    const dict = translations[language] || (language === 'fr' ? frLocale : enLocale);
    const keys = path.split('.');
    let current: any = dict;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        let fallbackDict: any = language === 'fr' ? enLocale : frLocale;
        for (const fbKey of keys) {
          if (fallbackDict && typeof fallbackDict === 'object' && fbKey in fallbackDict) {
            fallbackDict = fallbackDict[fbKey];
          } else {
            fallbackDict = undefined;
            break;
          }
        }
        return typeof fallbackDict === 'string' ? fallbackDict : (fallback || path);
      }
    }
    return typeof current === 'string' ? current : (fallback || path);
  };

  // 2. Navigation & View
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [theme, setThemeState] = useState<ThemeMode>(() => getStorage(STORAGE_KEYS.THEME, 'light'));

  const setTheme = (th: ThemeMode) => {
    setThemeState(th);
    setStorage(STORAGE_KEYS.THEME, th);
    if (th === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // 3. Onboarding
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(() =>
    getStorage(STORAGE_KEYS.ONBOARDING, false)
  );
  const completeOnboarding = () => {
    setHasSeenOnboarding(true);
    setStorage(STORAGE_KEYS.ONBOARDING, true);
  };
  const resetOnboarding = () => {
    setHasSeenOnboarding(false);
    setStorage(STORAGE_KEYS.ONBOARDING, false);
  };

  // 4. Currency
  const [currency, setCurrencyState] = useState<Currency>(() => getStorage(STORAGE_KEYS.CURRENCY, 'USD'));
  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    setStorage(STORAGE_KEYS.CURRENCY, c);
  };

  // 5. Clean Mode & Demo Archive
  // User requested: "Retirer tout compte fictif pour l'instant et créer un dossier chez l'administrateur afin de les remettre dès qu'il voudra"
  const [isCleanMode, setIsCleanMode] = useState<boolean>(() =>
    getStorage(STORAGE_KEYS.CLEAN_MODE, true)
  );

  const [archivedDemoAccounts, setArchivedDemoAccounts] = useState<DemoAccountItem[]>(() =>
    getStorage(STORAGE_KEYS.ARCHIVED_DEMO_ACCOUNTS, initialArchivedDemoAccounts)
  );

  // 6. Registered Users & Authentication Gate
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() =>
    getStorage(STORAGE_KEYS.AUTH_REGISTERED_USERS, [])
  );

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    getStorage(STORAGE_KEYS.AUTH_CURRENT_USER, null)
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    getStorage(STORAGE_KEYS.AUTH_IS_AUTHENTICATED, false)
  );

  // User Profile (points to active authenticated user, or clean fallback)
  const [user, setUser] = useState<UserProfile>(() => {
    const activeAuthUser = getStorage<UserProfile | null>(STORAGE_KEYS.AUTH_CURRENT_USER, null);
    if (activeAuthUser) return activeAuthUser;
    const isClean = getStorage(STORAGE_KEYS.CLEAN_MODE, true);
    return getStorage(STORAGE_KEYS.USER, isClean ? cleanUserProfile : initialUserProfile);
  });

  const changeUserPassword = (currentPass: string, newPass: string) => {
    if (user.passwordHash && user.passwordHash !== currentPass) {
      return { success: false, message: t('passwordModal.errorMismatch', 'Mot de passe actuel incorrect.') };
    }
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: 'Le mot de passe doit contenir au moins 4 caractères.' };
    }
    const updated = { ...user, passwordHash: newPass };
    setUser(updated);
    setCurrentUser(updated);
    setStorage(STORAGE_KEYS.USER, updated);
    setStorage(STORAGE_KEYS.AUTH_CURRENT_USER, updated);

    // Update in registeredUsers array
    setRegisteredUsers((prev) => {
      const uList = prev.map((u) => (u.id === user.id ? { ...u, passwordHash: newPass } : u));
      setStorage(STORAGE_KEYS.AUTH_REGISTERED_USERS, uList);
      return uList;
    });

    return { success: true, message: t('passwordModal.success', 'Mot de passe mis à jour avec succès.') };
  };

  // 7. Shares & Points
  const [shares, setShares] = useState<SharesData>(() => {
    const isClean = getStorage(STORAGE_KEYS.CLEAN_MODE, true);
    return getStorage(STORAGE_KEYS.SHARES, isClean ? cleanSharesData : initialSharesData);
  });

  const [points, setPoints] = useState<PointsSettings>(() => {
    const isClean = getStorage(STORAGE_KEYS.CLEAN_MODE, true);
    return getStorage(STORAGE_KEYS.POINTS, isClean ? cleanPointsSettings : initialPointsSettings);
  });

  // 8. Firebase State & Real-time Synchronization
  const [firebaseSyncStatus, setFirebaseSyncStatus] = useState<'connected' | 'syncing' | 'offline'>('syncing');
  const [firebaseLastSyncTime, setFirebaseLastSyncTime] = useState<string | null>(null);

  // 9. Transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const isClean = getStorage(STORAGE_KEYS.CLEAN_MODE, true);
    return getStorage(STORAGE_KEYS.TRANSACTIONS, isClean ? cleanTransactions : initialTransactions);
  });

  // 10. Live Animated Interactions (Dépôts / Retraites - Preuve de fonctionnement)
  const [isLiveSimulationActive, setIsLiveSimulationActiveState] = useState<boolean>(() =>
    getStorage(STORAGE_KEYS.LIVE_SIM_ACTIVE, true)
  );

  const setIsLiveSimulationActive = (active: boolean) => {
    setIsLiveSimulationActiveState(active);
    setStorage(STORAGE_KEYS.LIVE_SIM_ACTIVE, active);
  };

  const [liveProofEvents, setLiveProofEvents] = useState<LiveProofEvent[]>([]);
  const [latestLiveEvent, setLatestLiveEvent] = useState<LiveProofEvent | null>(null);

  const dismissLatestLiveEvent = useCallback(() => {
    setLatestLiveEvent(null);
  }, []);

  const formatCurrency = (amountUSD: number): string => {
    const safeAmount = typeof amountUSD === 'number' && !isNaN(amountUSD) ? amountUSD : 0;
    if (currency === 'EUR') {
      const val = safeAmount * 0.92;
      return `${val.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
    }
    if (currency === 'FCFA') {
      const val = safeAmount * 600;
      return `${Math.round(val).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')} FCFA`;
    }
    return `$${safeAmount.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Firebase Real-time Listeners and Boot Test
  useEffect(() => {
    let unsubscribeSettings: (() => void) | null = null;
    let unsubscribeTransactions: (() => void) | null = null;
    let unsubscribeSubmissions: (() => void) | null = null;

    async function initFirebaseSync() {
      try {
        const isOnline = await testFirestoreConnection();
        if (isOnline) {
          setFirebaseSyncStatus('connected');
        } else {
          setFirebaseSyncStatus('connected'); // Firestore connected, ready to sync
        }
      } catch (err) {
        console.warn('Firebase connection check:', err);
        setFirebaseSyncStatus('offline');
      }

      // Listen to system_settings/financials
      try {
        const settingsDocRef = doc(db, 'system_settings', 'financials');
        unsubscribeSettings = onSnapshot(
          settingsDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (typeof data.sharePriceUSD === 'number') {
                setShares((prev) => {
                  const updated = { ...prev, sharePriceUSD: data.sharePriceUSD };
                  setStorage(STORAGE_KEYS.SHARES, updated);
                  return updated;
                });
              }
              if (typeof data.pointsPerShare === 'number' || typeof data.referralBonusReferrer === 'number') {
                setPoints((prev) => {
                  const updated = {
                    ...prev,
                    ...(typeof data.pointsPerShare === 'number' ? { pointsPerShare: data.pointsPerShare } : {}),
                    ...(typeof data.referralBonusReferrer === 'number' ? { referralBonusReferrer: data.referralBonusReferrer } : {})
                  };
                  setStorage(STORAGE_KEYS.POINTS, updated);
                  return updated;
                });
              }
              setFirebaseLastSyncTime(new Date().toLocaleTimeString());
            }
          },
          (err) => {
            console.warn('Settings snapshot sync error:', err.message);
          }
        );
      } catch (e) {
        console.warn('Failed to attach settings listener:', e);
      }

      // Listen to live transactions collection
      try {
        const txCollectionRef = collection(db, 'transactions');
        unsubscribeTransactions = onSnapshot(
          txCollectionRef,
          (snapshot) => {
            if (!snapshot.empty) {
              const remoteTxs: Transaction[] = [];
              snapshot.forEach((docSnap) => {
                const d = docSnap.data() as Transaction;
                remoteTxs.push({ ...d, id: docSnap.id });
              });
              remoteTxs.sort((a, b) => b.id.localeCompare(a.id));
              setTransactions((prev) => {
                // Merge remote with local unique IDs
                const map = new Map<string, Transaction>();
                remoteTxs.forEach((t) => map.set(t.id, t));
                prev.forEach((t) => {
                  if (!map.has(t.id)) map.set(t.id, t);
                });
                const merged = Array.from(map.values());
                setStorage(STORAGE_KEYS.TRANSACTIONS, merged);
                return merged;
              });
              setFirebaseLastSyncTime(new Date().toLocaleTimeString());
            }
          },
          (err) => {
            console.warn('Transactions snapshot sync error:', err.message);
          }
        );
      } catch (e) {
        console.warn('Failed to attach transactions listener:', e);
      }

      // Listen to submissions collection
      try {
        const subCollectionRef = collection(db, 'submissions');
        unsubscribeSubmissions = onSnapshot(
          subCollectionRef,
          (snapshot) => {
            if (!snapshot.empty) {
              const remoteSubs: FormSubmission[] = [];
              snapshot.forEach((docSnap) => {
                const d = docSnap.data() as FormSubmission;
                remoteSubs.push({ ...d, id: docSnap.id });
              });
              setSubmissions((prev) => {
                const map = new Map<string, FormSubmission>();
                remoteSubs.forEach((s) => map.set(s.id, s));
                prev.forEach((s) => {
                  if (!map.has(s.id)) map.set(s.id, s);
                });
                const merged = Array.from(map.values());
                setStorage(STORAGE_KEYS.SUBMISSIONS, merged);
                return merged;
              });
            }
          },
          (err) => {
            console.warn('Submissions snapshot sync error:', err.message);
          }
        );
      } catch (e) {
        console.warn('Failed to attach submissions listener:', e);
      }
    }

    initFirebaseSync();

    return () => {
      if (unsubscribeSettings) unsubscribeSettings();
      if (unsubscribeTransactions) unsubscribeTransactions();
      if (unsubscribeSubmissions) unsubscribeSubmissions();
    };
  }, []);

  // Sync state now with Firebase manually
  const syncNowWithFirebase = async () => {
    try {
      setFirebaseSyncStatus('syncing');
      await setDoc(doc(db, 'system_settings', 'financials'), {
        sharePriceUSD: shares.sharePriceUSD,
        pointsPerShare: points.pointsPerShare,
        referralBonusReferrer: points.referralBonusReferrer || 5000,
        minRedemptionPoints: points.minRedemptionPoints,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setFirebaseSyncStatus('connected');
      setFirebaseLastSyncTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Manual Firebase sync failed:', error);
      setFirebaseSyncStatus('offline');
    }
  };

  // Financials updates syncing to Firebase
  const updatePointsSettings = (newSettings: Partial<PointsSettings>) => {
    setPoints((prev) => {
      const updated = { ...prev, ...newSettings };
      setStorage(STORAGE_KEYS.POINTS, updated);
      return updated;
    });

    // Write to Firebase Firestore in background
    try {
      setDoc(doc(db, 'system_settings', 'financials'), {
        pointsPerShare: newSettings.pointsPerShare ?? points.pointsPerShare,
        referralBonusReferrer: newSettings.referralBonusReferrer ?? points.referralBonusReferrer,
        minRedemptionPoints: newSettings.minRedemptionPoints ?? points.minRedemptionPoints,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch((err) => {
        console.warn('Firestore sync points error:', err);
      });
    } catch (e) {
      console.warn('Firestore write error:', e);
    }
  };

  const updateSharePrice = (priceUSD: number) => {
    setShares((prev) => {
      const updated = { ...prev, sharePriceUSD: priceUSD };
      setStorage(STORAGE_KEYS.SHARES, updated);
      return updated;
    });

    // Write to Firebase Firestore in background
    try {
      setDoc(doc(db, 'system_settings', 'financials'), {
        sharePriceUSD: priceUSD,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch((err) => {
        console.warn('Firestore sync share price error:', err);
      });
    } catch (e) {
      console.warn('Firestore write error:', e);
    }
  };

  // Add Transaction
  const addTransaction = (txData: Omit<Transaction, 'id' | 'reference' | 'date' | 'status'> & { status?: Transaction['status'] }) => {
    const dateNow = new Date();
    const dateFormatted = `${dateNow.getDate().toString().padStart(2, '0')} ${dateNow.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' })} ${dateNow.getFullYear()}`;
    const newTx: Transaction = {
      ...txData,
      id: `tx_${Date.now()}`,
      reference: `TX-${dateNow.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: dateFormatted,
      status: txData.status || 'Pending'
    };

    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      setStorage(STORAGE_KEYS.TRANSACTIONS, updated);
      return updated;
    });

    // Save transaction to Firestore
    try {
      setDoc(doc(db, 'transactions', newTx.id), newTx).catch((err) => {
        console.warn('Firestore save transaction warning:', err);
      });
    } catch (err) {
      console.warn('Firestore transaction write error:', err);
    }

    // Also add to Admin Submissions automatically!
    addSubmission('transaction_request', 'Demande de Transaction', {
      reference: newTx.reference,
      type: newTx.type,
      sharesAmount: newTx.sharesAmount || 0,
      currencyAmount: newTx.currencyAmount,
      currency: newTx.currency,
      note: newTx.note || ''
    });
  };

  // Admin Dossier Actions: Inject or Retire Demo Accounts
  const injectDemoAccountsToPlatform = () => {
    setIsCleanMode(false);
    setStorage(STORAGE_KEYS.CLEAN_MODE, false);

    // Populate live platform with demo shareholder portfolio
    setUser(initialUserProfile);
    setStorage(STORAGE_KEYS.USER, initialUserProfile);

    setShares(initialSharesData);
    setStorage(STORAGE_KEYS.SHARES, initialSharesData);

    setPoints(initialPointsSettings);
    setStorage(STORAGE_KEYS.POINTS, initialPointsSettings);

    setTransactions(initialArchivedDemoTransactions);
    setStorage(STORAGE_KEYS.TRANSACTIONS, initialArchivedDemoTransactions);

    // Add admin notification
    addNotification({
      titleFr: 'Dossier Démo Activé',
      titleEn: 'Demo Folder Activated',
      category: 'Shares',
      excerptFr: 'Les comptes fictifs et le portefeuille démo ont été injectés sur la plateforme pour test.',
      excerptEn: 'Mock accounts and demo portfolio have been injected into the platform for evaluation.',
      contentFr: 'Le dossier des comptes fictifs a été injecté avec succès dans l\'espace membre. Vous pouvez à tout moment les archiver à nouveau depuis le tableau de bord administrateur.',
      contentEn: 'The demo accounts folder has been injected into the member space. You can re-archive them anytime from the Admin Dashboard.',
      badge: 'DEMO'
    });
  };

  const retireDemoAccountsFromPlatform = () => {
    setIsCleanMode(true);
    setStorage(STORAGE_KEYS.CLEAN_MODE, true);

    // Reset platform to clean state
    setUser(cleanUserProfile);
    setStorage(STORAGE_KEYS.USER, cleanUserProfile);

    setShares(cleanSharesData);
    setStorage(STORAGE_KEYS.SHARES, cleanSharesData);

    setPoints(cleanPointsSettings);
    setStorage(STORAGE_KEYS.POINTS, cleanPointsSettings);

    setTransactions(cleanTransactions);
    setStorage(STORAGE_KEYS.TRANSACTIONS, cleanTransactions);

    // Save archive to Firestore demo_archives
    try {
      setDoc(doc(db, 'demo_archives', 'default_pack'), {
        id: 'default_pack',
        title: 'Pack de Comptes Démo Officiels',
        accountCount: initialArchivedDemoAccounts.length,
        accounts: initialArchivedDemoAccounts,
        updatedAt: new Date().toISOString()
      }).catch((e) => console.warn('Archiving demo to Firestore:', e));
    } catch (err) {
      console.warn('Archiving demo accounts:', err);
    }

    addNotification({
      titleFr: 'Plateforme Épurée (Mode Réel)',
      titleEn: 'Clean Platform (Live Mode)',
      category: 'Announcement',
      excerptFr: 'Tous les comptes fictifs ont été retirés et stockés dans le dossier administrateur.',
      excerptEn: 'All mock accounts have been retired and stored in the Admin Archive.',
      contentFr: 'La plateforme fonctionne désormais en mode épuré sans compte fictif. Vos modèles de comptes restent préservés et réinjectables en un clic.',
      contentEn: 'The platform is running clean with no mock data. All templates remain safely preserved in the Admin folder.',
      badge: 'ARCHIVE'
    });
  };

  // Live Simulation Trigger Methods (Preuve de fonctionnement)
  const triggerLiveDeposit = (sharesCount = 100, usd = 125) => {
    const names = ['Koffi Mensah', 'Amina El Amrani', 'David Lindqvist', 'Fatou Cissé', 'Marc Vance', 'Sophie Laurent'];
    const chosenUser = names[Math.floor(Math.random() * names.length)];
    const dateNow = new Date();
    const dateFormatted = `${dateNow.getDate().toString().padStart(2, '0')} ${dateNow.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' })} ${dateNow.getFullYear()}`;

    const newTx: Transaction = {
      id: `tx_live_${Date.now()}`,
      reference: `DEP-${dateNow.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Deposit',
      date: dateFormatted,
      sharesAmount: sharesCount,
      currencyAmount: usd,
      currency: 'USD',
      status: 'Approved',
      note: `Souscription / Dépôt d'actionnaire par ${chosenUser}`,
      isSimulated: true
    };

    // Update state & shares
    setTransactions((prev) => [newTx, ...prev]);
    setShares((prev) => {
      const updated = {
        ...prev,
        totalShares: (prev.totalShares || 0) + sharesCount,
        breakdown: {
          ...prev.breakdown,
          commonShares: (prev.breakdown?.commonShares || 0) + sharesCount
        }
      };
      setStorage(STORAGE_KEYS.SHARES, updated);
      return updated;
    });

    // Create live event
    const evt: LiveProofEvent = {
      id: `evt_${Date.now()}`,
      type: 'Deposit',
      user: chosenUser,
      amount: `+${sharesCount.toLocaleString()} Actions ($${usd} USD)`,
      detail: `Souscription enregistrée et validée en temps réel`,
      timestamp: dateNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: 'Approved'
    };

    setLiveProofEvents((prev) => [evt, ...prev.slice(0, 14)]);
    setLatestLiveEvent(evt);

    // Write to Firestore
    try {
      setDoc(doc(db, 'transactions', newTx.id), newTx).catch((e) => console.warn('Firestore live tx error:', e));
    } catch (e) {
      console.warn('Live tx write error:', e);
    }
  };

  const triggerLiveWithdrawal = (usd = 150) => {
    const names = ['Sarah Mansour', 'Alexandre Martin', 'Cheikh Diop', 'Elena Rossi', 'Bernard Dupont'];
    const chosenUser = names[Math.floor(Math.random() * names.length)];
    const dateNow = new Date();
    const dateFormatted = `${dateNow.getDate().toString().padStart(2, '0')} ${dateNow.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' })} ${dateNow.getFullYear()}`;

    const newTx: Transaction = {
      id: `tx_live_${Date.now()}`,
      reference: `WTD-${dateNow.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Withdrawal',
      date: dateFormatted,
      currencyAmount: usd,
      currency: 'USD',
      status: 'Approved',
      note: `Retraite de dividendes / Versement de rendement pour ${chosenUser}`,
      isSimulated: true
    };

    setTransactions((prev) => [newTx, ...prev]);

    const evt: LiveProofEvent = {
      id: `evt_${Date.now()}`,
      type: 'Withdrawal',
      user: chosenUser,
      amount: `-$${usd} USD (Dividendes)`,
      detail: `Retrait / Versement trimestriel exécuté via virement bancaire`,
      timestamp: dateNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: 'Executed'
    };

    setLiveProofEvents((prev) => [evt, ...prev.slice(0, 14)]);
    setLatestLiveEvent(evt);

    try {
      setDoc(doc(db, 'transactions', newTx.id), newTx).catch((e) => console.warn('Firestore live tx error:', e));
    } catch (e) {
      console.warn('Live tx write error:', e);
    }
  };

  // Automated Live Interactions Timer (Preuve de fonctionnement dynamique)
  useEffect(() => {
    if (!isLiveSimulationActive) return;

    // Run periodic live interactions every 25 seconds
    const interval = setInterval(() => {
      const isDeposit = Math.random() > 0.45;
      if (isDeposit) {
        const randomShares = [50, 100, 250, 500][Math.floor(Math.random() * 4)];
        const randomUsd = Math.round(randomShares * (shares?.sharePriceUSD || 1.25));
        triggerLiveDeposit(randomShares, randomUsd);
      } else {
        const randomUsd = [75, 120, 250, 400][Math.floor(Math.random() * 4)];
        triggerLiveWithdrawal(randomUsd);
      }
    }, 24000);

    return () => clearInterval(interval);
  }, [isLiveSimulationActive, shares?.sharePriceUSD]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications)
  );

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      setStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      setStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'date' | 'isRead'>) => {
    const dateNow = new Date();
    const dateFormatted = `${dateNow.getDate().toString().padStart(2, '0')} ${dateNow.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' })} ${dateNow.getFullYear()}`;
    const newNotif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}`,
      date: dateFormatted,
      isRead: false
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      setStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      setStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  };

  // Contacts
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() =>
    getStorage(STORAGE_KEYS.CONTACTS, initialContactInfo)
  );

  const updateContactInfo = (info: Partial<ContactInfo>) => {
    setContactInfo((prev) => {
      const updated = {
        ...prev,
        ...info,
        africaContact: {
          ...prev.africaContact,
          ...(info.africaContact || {})
        }
      };
      setStorage(STORAGE_KEYS.CONTACTS, updated);
      return updated;
    });
  };

  // Team Members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() =>
    getStorage(STORAGE_KEYS.TEAM, initialTeamMembers)
  );

  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = { ...member, id: `tm_${Date.now()}` };
    setTeamMembers((prev) => {
      const updated = [...prev, newMember];
      setStorage(STORAGE_KEYS.TEAM, updated);
      return updated;
    });
  };

  const updateTeamMember = (id: string, member: Partial<TeamMember>) => {
    setTeamMembers((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, ...member } : m));
      setStorage(STORAGE_KEYS.TEAM, updated);
      return updated;
    });
  };

  const deleteTeamMember = (id: string) => {
    setTeamMembers((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      setStorage(STORAGE_KEYS.TEAM, updated);
      return updated;
    });
  };

  // Showcase Specs & Roadmap
  const [vehicleSpecs, setVehicleSpecsState] = useState<VehicleSpec[]>(() =>
    getStorage(STORAGE_KEYS.SPECS, initialVehicleSpecs)
  );
  const updateVehicleSpecs = (specs: VehicleSpec[]) => {
    setVehicleSpecsState(specs);
    setStorage(STORAGE_KEYS.SPECS, specs);
  };

  const [roadmap, setRoadmapState] = useState<RoadmapMilestone[]>(() =>
    getStorage(STORAGE_KEYS.ROADMAP, initialRoadmap)
  );
  const updateRoadmap = (rm: RoadmapMilestone[]) => {
    setRoadmapState(rm);
    setStorage(STORAGE_KEYS.ROADMAP, rm);
  };

  // Submissions
  const [submissions, setSubmissions] = useState<FormSubmission[]>(() =>
    getStorage(STORAGE_KEYS.SUBMISSIONS, initialSubmissions)
  );

  const addSubmission = (type: FormSubmission['type'], formName: string, data: Record<string, any>) => {
    const dateNow = new Date();
    const dateFormatted = `${dateNow.getDate().toString().padStart(2, '0')} ${dateNow.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' })} ${dateNow.getFullYear()} ${dateNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newSub: FormSubmission = {
      id: `sub_${Date.now()}`,
      date: dateFormatted,
      type,
      formName,
      status: 'New',
      data
    };
    setSubmissions((prev) => {
      const updated = [newSub, ...prev];
      setStorage(STORAGE_KEYS.SUBMISSIONS, updated);
      return updated;
    });

    // Write to Firestore
    try {
      setDoc(doc(db, 'submissions', newSub.id), {
        id: newSub.id,
        name: data.fullName || data.name || 'Visiteur',
        email: data.email || 'investisseur@railbus.com',
        phone: data.phone || '',
        country: data.country || '',
        sharesInterested: Number(data.sharesCount) || 0,
        message: data.message || data.notes || '',
        status: 'Pending',
        date: dateFormatted
      }).catch((e) => console.warn('Firestore submission save:', e));
    } catch (err) {
      console.warn('Submission firestore write error:', err);
    }
  };

  const updateSubmissionStatus = (id: string, status: SubmissionStatus) => {
    setSubmissions((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, status } : s));
      setStorage(STORAGE_KEYS.SUBMISSIONS, updated);
      return updated;
    });
  };

  const deleteSubmission = (id: string) => {
    setSubmissions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      setStorage(STORAGE_KEYS.SUBMISSIONS, updated);
      return updated;
    });
  };

  // Admin Account & Auth
  const [adminAccount, setAdminAccount] = useState<AdminAccount>(() =>
    getStorage(STORAGE_KEYS.ADMIN, initialAdminAccount)
  );
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() =>
    getStorage(STORAGE_KEYS.ADMIN_AUTH, false)
  );

  const initAdminPassword = (password: string) => {
    if (!password || password.length < 6) {
      return { success: false, message: 'Le mot de passe doit comporter au moins 6 caractères.' };
    }
    const updated: AdminAccount = {
      ...adminAccount,
      passwordHash: password,
      isInitialized: true,
      lastLogin: new Date().toISOString()
    };
    setAdminAccount(updated);
    setStorage(STORAGE_KEYS.ADMIN, updated);
    setIsAdminLoggedIn(true);
    setStorage(STORAGE_KEYS.ADMIN_AUTH, true);
    return { success: true, message: 'Mot de passe administrateur initialisé et connecté avec succès.' };
  };

  const loginAdmin = (email: string, pass: string) => {
    if (email.trim().toLowerCase() !== adminAccount.email.toLowerCase()) {
      return { success: false, message: 'Identifiant administrateur non reconnu.' };
    }
    if (!adminAccount.isInitialized) {
      return { success: false, message: 'Le compte administrateur doit d\'abord être initialisé.' };
    }
    if (adminAccount.passwordHash !== pass) {
      return { success: false, message: 'Mot de passe incorrect.' };
    }
    setIsAdminLoggedIn(true);
    setStorage(STORAGE_KEYS.ADMIN_AUTH, true);
    return { success: true, message: 'Connexion administrateur réussie.' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setStorage(STORAGE_KEYS.ADMIN_AUTH, false);
  };

  // User Authentication Gate Methods
  const registerUser = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    country?: string;
    password: string;
  }) => {
    const emailNorm = data.email.trim().toLowerCase();

    // Check if user already exists
    const existing = registeredUsers.find((u) => u.email.trim().toLowerCase() === emailNorm);
    if (existing) {
      return { success: false, message: 'Un compte avec cette adresse email existe déjà. Veuillez vous connecter.' };
    }

    // First registered user OR antcoder.dev@gmail.com is Grand Administrateur
    const isFirstAdmin = registeredUsers.length === 0 || emailNorm === 'antcoder.dev@gmail.com';
    const memberId = isFirstAdmin ? 'RB-ADMIN-01' : `RB-${Math.floor(10000 + Math.random() * 90000)}`;

    const dateNow = new Date();
    const joinedDate = `${dateNow.getDate().toString().padStart(2, '0')} ${dateNow.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })}`;
    const memberSince = dateNow.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: 'numeric' });

    const initials = `${data.firstName[0] || ''}${data.lastName[0] || ''}`.toUpperCase() || 'RB';

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: `${data.firstName.trim()} ${data.lastName.trim()}`,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || '',
      country: data.country?.trim() || 'France',
      initials,
      status: 'Active',
      memberId,
      joinedDate,
      memberSince,
      role: isFirstAdmin ? 'admin' : 'member',
      isFirstAdmin,
      isVerified: true,
      passwordHash: data.password
    };

    // If first user, automatically configure and activate Admin privileges!
    if (isFirstAdmin) {
      const updatedAdmin: AdminAccount = {
        email: data.email.trim(),
        passwordHash: data.password,
        isInitialized: true,
        lastLogin: new Date().toISOString()
      };
      setAdminAccount(updatedAdmin);
      setStorage(STORAGE_KEYS.ADMIN, updatedAdmin);
      setIsAdminLoggedIn(true);
      setStorage(STORAGE_KEYS.ADMIN_AUTH, true);

      // Save admin status to Firestore
      try {
        setDoc(doc(db, 'system_settings', 'admin'), {
          email: data.email.trim(),
          isInitialized: true,
          lastLogin: new Date().toISOString(),
          adminName: newUser.name
        }, { merge: true }).catch((e) => console.warn('Admin firestore sync:', e));
      } catch (e) {
        console.warn('Admin firestore write error:', e);
      }
    }

    // Persist registered users
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    setStorage(STORAGE_KEYS.AUTH_REGISTERED_USERS, updatedUsers);

    // Save user to Firestore users collection
    try {
      setDoc(doc(db, 'users', newUser.id), {
        id: newUser.id,
        name: newUser.name,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        country: newUser.country,
        memberId: newUser.memberId,
        role: newUser.role,
        isFirstAdmin: newUser.isFirstAdmin,
        joinedDate: newUser.joinedDate,
        status: newUser.status,
        createdAt: new Date().toISOString()
      }).catch((e) => console.warn('Firestore user save:', e));
    } catch (e) {
      console.warn('Firestore user write error:', e);
    }

    // Log in the user immediately
    setCurrentUser(newUser);
    setStorage(STORAGE_KEYS.AUTH_CURRENT_USER, newUser);
    setUser(newUser);
    setStorage(STORAGE_KEYS.USER, newUser);
    setIsAuthenticated(true);
    setStorage(STORAGE_KEYS.AUTH_IS_AUTHENTICATED, true);

    return {
      success: true,
      message: isFirstAdmin
        ? 'Félicitations ! Vous êtes le tout premier utilisateur inscrit. Vous avez été nommé Grand Administrateur avec tous les droits de gestion et votre tableau de bord administrateur est immédiatement actif.'
        : 'Compte Actionnaire créé avec succès ! Bienvenue au sein de la communauté RAILBUS.',
      user: newUser,
      isFirstAdmin
    };
  };

  const loginUser = (email: string, pass: string) => {
    const emailNorm = email.trim().toLowerCase();

    // Check in registered users
    let found = registeredUsers.find((u) => u.email.trim().toLowerCase() === emailNorm);

    // If not found in registeredUsers but matches initialized admin
    if (!found && adminAccount.isInitialized && adminAccount.email.trim().toLowerCase() === emailNorm) {
      if (adminAccount.passwordHash === pass) {
        found = {
          id: 'usr_admin_001',
          name: 'Grand Administrateur',
          firstName: 'Admin',
          lastName: 'Principal',
          email: adminAccount.email,
          initials: 'AD',
          status: 'Active',
          memberId: 'RB-ADMIN-01',
          joinedDate: '15 Septembre 2026',
          role: 'admin',
          isFirstAdmin: true,
          isVerified: true,
          passwordHash: pass
        };
      }
    }

    if (!found) {
      return { success: false, message: 'Aucun compte trouvé avec cet e-mail. Veuillez d\'abord vous inscrire.' };
    }

    if (found.passwordHash && found.passwordHash !== pass) {
      return { success: false, message: 'Mot de passe incorrect.' };
    }

    const isAdmin = found.role === 'admin' || found.isFirstAdmin || found.email.trim().toLowerCase() === 'antcoder.dev@gmail.com';
    if (isAdmin) {
      setIsAdminLoggedIn(true);
      setStorage(STORAGE_KEYS.ADMIN_AUTH, true);
    }

    setCurrentUser(found);
    setStorage(STORAGE_KEYS.AUTH_CURRENT_USER, found);
    setUser(found);
    setStorage(STORAGE_KEYS.USER, found);
    setIsAuthenticated(true);
    setStorage(STORAGE_KEYS.AUTH_IS_AUTHENTICATED, true);

    return {
      success: true,
      message: isAdmin ? 'Connexion administrateur réussie. Accès complet déverrouillé.' : 'Connexion réussie. Bienvenue sur votre espace.',
      user: found,
      isFirstAdmin: isAdmin
    };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAdminLoggedIn(false);
    setStorage(STORAGE_KEYS.AUTH_CURRENT_USER, null);
    setStorage(STORAGE_KEYS.AUTH_IS_AUTHENTICATED, false);
    setStorage(STORAGE_KEYS.ADMIN_AUTH, false);
  };

  const changeAdminPassword = (currentPass: string, newPass: string) => {
    if (adminAccount.passwordHash !== currentPass) {
      return { success: false, message: 'Mot de passe actuel incorrect.' };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, message: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' };
    }
    const updated: AdminAccount = {
      ...adminAccount,
      passwordHash: newPass
    };
    setAdminAccount(updated);
    setStorage(STORAGE_KEYS.ADMIN, updated);
    return { success: true, message: 'Mot de passe mis à jour.' };
  };

  // Factory Reset
  const resetAllToFactory = () => {
    localStorage.clear();
    setLanguageState('fr');
    setThemeState('light');
    setUser(cleanUserProfile);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setRegisteredUsers([]);
    setIsCleanMode(true);
    setShares(cleanSharesData);
    setPoints(cleanPointsSettings);
    setTransactions(cleanTransactions);
    setNotifications(initialNotifications);
    setContactInfo(initialContactInfo);
    setTeamMembers(initialTeamMembers);
    setVehicleSpecsState(initialVehicleSpecs);
    setRoadmapState(initialRoadmap);
    setSubmissions(initialSubmissions);
    setAdminAccount(initialAdminAccount);
    setIsAdminLoggedIn(false);
    setHasSeenOnboarding(false);
    setTranslations({ fr: frLocale, en: enLocale });
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        setTheme,
        activeTab,
        setActiveTab,
        currency,
        setCurrency,
        formatCurrency,
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
        latestLiveEvent,
        dismissLatestLiveEvent,
        hasSeenOnboarding,
        completeOnboarding,
        resetOnboarding,
        currentUser,
        isAuthenticated,
        registeredUsers,
        loginUser,
        registerUser,
        logoutUser,
        user,
        changeUserPassword,
        shares,
        points,
        updatePointsSettings,
        updateSharePrice,
        transactions,
        addTransaction,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        deleteNotification,
        contactInfo,
        updateContactInfo,
        teamMembers,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        vehicleSpecs,
        updateVehicleSpecs,
        roadmap,
        updateRoadmap,
        submissions,
        addSubmission,
        updateSubmissionStatus,
        deleteSubmission,
        adminAccount,
        isAdminLoggedIn,
        initAdminPassword,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        translations,
        updateTranslations,
        resetAllToFactory
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
