import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactSupportModal: React.FC<ContactSupportModalProps> = ({ isOpen, onClose }) => {
  const { t, addSubmission, user, theme } = useApp();
  const isLight = theme === 'light';

  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    subject: '',
    category: 'Shareholder Support',
    message: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSubmission('contact_support', `Support: ${formData.subject || 'Demande Membre'}`, {
      name: formData.name,
      email: formData.email,
      category: formData.category,
      subject: formData.subject,
      message: formData.message
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div 
      id="contact-support-modal"
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
              {t('app.success', 'Message envoyé')}
            </h3>
            <p className={`text-xs max-w-xs mx-auto ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
              Notre équipe d'assistance aux actionnaires a bien reçu votre ticket.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#F2B01E]/15 border border-[#F2B01E]/30 flex items-center justify-center text-[#C8880A] dark:text-[#F2B01E]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-['Montserrat']">
                  {t('contact.title', 'Support Actionnaires')}
                </h3>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Assistance technique, transfert de parts et documentation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  {t('contact.name', 'Nom')}
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
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  Email
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
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                Catégorie de la demande
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-xs outline-none transition ${
                  isLight 
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                    : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                }`}
              >
                <option value="Shareholder Support">Assistance Actionnaire / Certificats</option>
                <option value="Transaction Inquiry">Question sur une Transaction</option>
                <option value="Points & Referral">Points de récompense & Parrainage</option>
                <option value="Partnership & City Deployment">Partenariats & Villes pilotes</option>
                <option value="Technical Issue">Signaler un bug dans la PWA</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                Objet
              </label>
              <input
                type="text"
                placeholder="Ex: Demande de duplicata de certificat"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
                {t('contact.message', 'Message')}
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Décrivez votre demande en détail..."
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
                id="submit-contact-support"
                className="px-4 py-2 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs transition flex items-center gap-1.5 active:scale-95 shadow-sm"
              >
                <span>{t('contact.send', 'Envoyer')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
