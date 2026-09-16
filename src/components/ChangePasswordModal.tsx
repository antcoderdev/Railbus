import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { t, changeUserPassword, theme } = useApp();
  const isLight = theme === 'light';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatus({ type: 'error', message: t('passwordModal.errorEmpty', 'Veuillez remplir tous les champs.') });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: t('passwordModal.errorMismatch', 'Les deux mots de passe ne correspondent pas.') });
      return;
    }

    const res = changeUserPassword(currentPassword, newPassword);
    if (res.success) {
      setStatus({ type: 'success', message: res.message });
      setTimeout(() => {
        setStatus({ type: 'idle', message: '' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }, 1500);
    } else {
      setStatus({ type: 'error', message: res.message });
    }
  };

  return (
    <div 
      id="change-password-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div className={`w-full max-w-sm border rounded-xl p-5 shadow-xl transition relative ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161616] border-white/10 text-white'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition ${
            isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          aria-label={t('app.close', 'Fermer')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="w-8 h-8 rounded-lg bg-[#F2B01E]/15 border border-[#F2B01E]/30 flex items-center justify-center text-[#C8880A] dark:text-[#F2B01E]">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold font-['Montserrat']">
              {t('passwordModal.title', 'Changer mon mot de passe')}
            </h3>
            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              {t('settings.changePasswordDesc', 'Sécurité de votre compte membre')}
            </p>
          </div>
        </div>

        {status.type === 'success' && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{status.message}</span>
          </div>
        )}

        {status.type === 'error' && (
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              {t('passwordModal.current', 'Mot de passe actuel')}
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-3 py-2 rounded-lg border text-xs outline-none transition ${
                isLight 
                  ? 'bg-white border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                  : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              {t('passwordModal.new', 'Nouveau mot de passe')}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-3 py-2 rounded-lg border text-xs outline-none transition ${
                isLight 
                  ? 'bg-white border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                  : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              {t('passwordModal.confirm', 'Confirmer le mot de passe')}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-3 py-2 rounded-lg border text-xs outline-none transition ${
                isLight 
                  ? 'bg-white border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                  : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
              }`}
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition border ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border-white/10'
              }`}
            >
              {t('app.cancel', 'Annuler')}
            </button>
            <button
              type="submit"
              id="confirm-change-password-button"
              className="px-4 py-2 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs transition active:scale-95 shadow-sm"
            >
              {t('passwordModal.submit', 'Valider')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
