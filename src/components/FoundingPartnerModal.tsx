import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';

interface FoundingPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FoundingPartnerModal: React.FC<FoundingPartnerModalProps> = ({ isOpen, onClose }) => {
  const { t, addSubmission, user, theme } = useApp();
  const isLight = theme === 'light';

  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    country: user.country || '',
    organization: '',
    intendedAmountUSD: '50000',
    notes: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSubmission('founding_partner', 'Intérêt Founding Partner', {
      name: formData.name,
      email: formData.email,
      country: formData.country,
      organization: formData.organization,
      intendedAmountUSD: formData.intendedAmountUSD,
      notes: formData.notes
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div 
      id="founding-partner-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div className={`w-full max-w-md border rounded-xl p-5 shadow-xl transition relative ${
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

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#F2B01E] mx-auto animate-bounce" />
            <h3 className="text-base font-bold font-['Montserrat']">
              {t('app.success', 'Demande envoyée')}
            </h3>
            <p className={`text-xs max-w-xs mx-auto ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
              Notre direction exécutive et le directeur régional prendront contact avec vous sous 24 à 48h.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#F2B01E]/15 border border-[#F2B01E]/30 flex items-center justify-center text-[#C8880A] dark:text-[#F2B01E]">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-['Montserrat']">
                  {t('contact.foundingPartner', 'Déclaration Founding Partner')}
                </h3>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Participation stratégique et grands investisseurs
                </p>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                {t('contact.name', 'Nom complet')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-xs outline-none transition ${
                  isLight 
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                    : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                }`}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  Email professionnel
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  {t('settings.country', 'Pays')}
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-xs outline-none transition ${
                    isLight 
                      ? 'bg-white border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                      : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                Organisation / Entreprise / Fonds
              </label>
              <input
                type="text"
                placeholder="Ex: Holding Familiale, Fonds d'Infrastructure..."
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-xs outline-none transition ${
                  isLight 
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                    : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                Montant d'investissement envisagé (USD)
              </label>
              <select
                value={formData.intendedAmountUSD}
                onChange={(e) => setFormData({ ...formData, intendedAmountUSD: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-xs outline-none transition ${
                  isLight 
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                    : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                }`}
              >
                <option value="10000">$10,000 - $25,000 USD</option>
                <option value="50000">$50,000 - $100,000 USD</option>
                <option value="250000">$250,000 - $500,000 USD</option>
                <option value="1000000">$1,000,000+ USD (Institutional)</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                Message / Précisions
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Précisez votre intérêt, région de déploiement visée..."
                className={`w-full px-3 py-2 rounded-lg border text-xs outline-none transition ${
                  isLight 
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                    : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                }`}
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
                id="submit-founding-partner"
                className="px-4 py-2 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs transition flex items-center gap-1.5 active:scale-95 shadow-sm"
              >
                <span>{t('contact.send', 'Transmettre la déclaration')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
