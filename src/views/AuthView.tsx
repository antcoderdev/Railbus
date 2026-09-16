import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Globe, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';

interface AuthViewProps {
  onSuccess?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const { 
    t, 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    registerUser, 
    loginUser, 
    registeredUsers,
    adminAccount 
  } = useApp();

  const isLight = theme === 'light';
  const isFirstEverUser = registeredUsers.length === 0 && !adminAccount.isInitialized;

  // Tabs: 'login' | 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(isFirstEverUser ? 'signup' : 'login');

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('France');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickAdminFill = () => {
    setEmail('antcoder.dev@gmail.com');
    setFirstName('Antcoder');
    setLastName('Dev');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (!email.trim() || !password) {
      setStatus({ type: 'error', message: 'Veuillez renseigner votre email et mot de passe.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = loginUser(email, password);
      setIsSubmitting(false);
      if (res.success) {
        setStatus({ type: 'success', message: res.message });
        if (onSuccess) onSuccess();
      } else {
        setStatus({ type: 'error', message: res.message });
      }
    }, 250);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setStatus({ type: 'error', message: 'Veuillez remplir votre prénom, nom et adresse email.' });
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setStatus({ type: 'error', message: 'Veuillez saisir une adresse email valide.' });
      return;
    }

    if (!password || password.length < 6) {
      setStatus({ type: 'error', message: 'Le mot de passe doit contenir au moins 6 caractères.' });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Les deux mots de passe ne correspondent pas.' });
      return;
    }

    if (!acceptTerms) {
      setStatus({ type: 'error', message: 'Veuillez accepter les conditions d\'actionnariat.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = registerUser({
        firstName,
        lastName,
        email,
        phone,
        country,
        password
      });
      setIsSubmitting(false);

      if (res.success) {
        setStatus({ type: 'success', message: res.message });
        if (onSuccess) onSuccess();
      } else {
        setStatus({ type: 'error', message: res.message });
      }
    }, 300);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 sm:p-6 transition-colors duration-200 ${
      isLight ? 'bg-slate-50 text-slate-900' : theme === 'oled' ? 'bg-black text-white' : 'bg-[#0A0A0A] text-white'
    }`}>
      {/* Top Bar with Language & Day/Night Toggle */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between pt-2 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F2B01E] flex items-center justify-center text-black font-extrabold text-sm shadow-sm">
            RB
          </div>
          <span className="font-extrabold tracking-tight text-sm font-['Montserrat']">
            RAILBUS <span className="text-[#F2B01E]">MEMBERS</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Day / Night Theme Button */}
          <button
            type="button"
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            id="auth-theme-toggle"
            aria-label="Toggle Theme"
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
              isLight 
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm' 
                : 'bg-[#181818] border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            {isLight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[11px] font-bold">Jour</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#F2B01E]" />
                <span className="text-[11px] font-bold">Nuit</span>
              </>
            )}
          </button>

          {/* Language Selector */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            id="auth-lang-toggle"
            className={`px-2.5 py-2 rounded-lg border text-xs font-bold transition ${
              isLight 
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm' 
                : 'bg-[#181818] border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            {language.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md mx-auto my-auto py-4">
        <div className={`rounded-xl border p-6 shadow-sm transition ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#141414] border-white/10'
        }`}>
          {/* Brand Header */}
          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-xl bg-black border border-[#F2B01E] mx-auto mb-3 flex items-center justify-center">
              <img src="/icon.svg" alt="RAILBUS" className="w-8 h-8" />
            </div>
            <h1 className={`text-xl font-extrabold tracking-tight font-['Montserrat'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {authMode === 'login' ? 'Espace Actionnaire' : 'Créer un Compte Membre'}
            </h1>
            <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              {authMode === 'login' 
                ? 'Connectez-vous pour accéder à vos actions et dividendes' 
                : 'Souscrivez et accédez au registre officiel des actionnaires'}
            </p>
          </div>

          {/* First User Admin Notice Banner */}
          {isFirstEverUser && (
            <div className={`mb-5 p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
              isLight 
                ? 'bg-amber-50 border-amber-300 text-amber-900' 
                : 'bg-[#1C180E] border-[#F2B01E]/40 text-amber-200'
            }`}>
              <Crown className="w-4 h-4 text-[#F2B01E] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs">Première Inscription : Grand Administrateur</p>
                <p className={`text-[11px] mt-0.5 leading-relaxed ${isLight ? 'text-amber-800' : 'text-gray-300'}`}>
                  Le premier utilisateur inscrit recevra automatiquement le rôle de <strong>Grand Administrateur</strong> avec activation immédiate de son tableau de bord de gestion complet.
                </p>
              </div>
            </div>
          )}

          {/* Segment Mode Toggle (Connexion / Inscription) */}
          <div className={`p-1 rounded-lg border grid grid-cols-2 gap-1 mb-5 ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/50 border-white/10'
          }`}>
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setStatus({ type: 'idle', message: '' });
              }}
              id="auth-mode-login-tab"
              className={`py-2 rounded-md text-xs font-bold transition ${
                authMode === 'login'
                  ? 'bg-[#F2B01E] text-black shadow-sm'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setStatus({ type: 'idle', message: '' });
              }}
              id="auth-mode-signup-tab"
              className={`py-2 rounded-md text-xs font-bold transition flex items-center justify-center gap-1 ${
                authMode === 'signup'
                  ? 'bg-[#F2B01E] text-black shadow-sm'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Inscription</span>
              {isFirstEverUser && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          </div>

          {/* Feedback Status */}
          {status.type !== 'idle' && (
            <div className={`mb-4 p-3 rounded-lg border text-xs flex items-start gap-2 ${
              status.type === 'error'
                ? isLight ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}>
              {status.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
              )}
              <span className="leading-snug">{status.message}</span>
            </div>
          )}

          {/* Sign In Form */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="actionnaire@railbus.com"
                    id="auth-login-email"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs font-medium outline-none transition ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                        : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`block text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    Mot de passe
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    id="auth-login-password"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-xs font-medium outline-none transition ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                        : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                id="auth-login-submit"
                className="w-full py-2.5 mt-2 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs transition flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span>{isSubmitting ? 'Connexion en cours...' : 'Se connecter'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Quick Admin Helper if account exists */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleQuickAdminFill}
                  className={`text-[11px] hover:underline ${isLight ? 'text-slate-500' : 'text-gray-400'}`}
                >
                  Utiliser l'identifiant administrateur (antcoder.dev@gmail.com)
                </button>
              </div>
            </form>
          )}

          {/* Sign Up Form */}
          {authMode === 'signup' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    Prénom
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jean"
                    id="auth-signup-firstname"
                    className={`w-full px-3 py-2.5 rounded-lg border text-xs font-medium outline-none transition ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                        : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    Nom
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dupont"
                    id="auth-signup-lastname"
                    className={`w-full px-3 py-2.5 rounded-lg border text-xs font-medium outline-none transition ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                        : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre-email@domaine.com"
                    id="auth-signup-email"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs font-medium outline-none transition ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                        : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    Téléphone (optionnel)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    id="auth-signup-phone"
                    className={`w-full px-3 py-2.5 rounded-lg border text-xs font-medium outline-none transition ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                        : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    Pays
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    id="auth-signup-country"
                    className={`w-full px-2.5 py-2.5 rounded-lg border text-xs font-medium outline-none transition ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                        : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                    }`}
                  >
                    <option value="France">France</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Canada">Canada</option>
                    <option value="Sénégal">Sénégal</option>
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Cameroun">Cameroun</option>
                    <option value="Congo">Congo</option>
                    <option value="Émirats Arabes Unis">Émirats Arabes Unis</option>
                    <option value="États-Unis">États-Unis</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  Mot de passe (min. 6 caractères)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    id="auth-signup-password"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-xs font-medium outline-none transition ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                        : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    id="auth-signup-confirm-password"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs font-medium outline-none transition ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                        : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-1 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="auth-terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded border-gray-400 text-[#F2B01E] focus:ring-[#F2B01E]"
                />
                <label htmlFor="auth-terms" className={`text-[11px] leading-tight ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                  J'accepte la charte des actionnaires et les conditions de souscription RAILBUS Inc.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                id="auth-signup-submit"
                className="w-full py-2.5 mt-2 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs transition flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span>{isSubmitting ? 'Création en cours...' : isFirstEverUser ? 'Créer le Compte Grand Administrateur' : 'Créer mon Compte Actionnaire'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer Details */}
      <div className={`w-full max-w-md mx-auto text-center py-2 text-[11px] ${
        isLight ? 'text-slate-400' : 'text-gray-500'
      }`}>
        <p>RAILBUS Inc. • Plateforme Officielle de Registre d'Actionnaires</p>
        <p className="mt-0.5 font-mono text-[10px]">Sécurisé par Firebase & Chiffrement de Données</p>
      </div>
    </div>
  );
};
