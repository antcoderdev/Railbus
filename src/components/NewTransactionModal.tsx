import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { Transaction } from '../types';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose }) => {
  const { t, addTransaction, shares, points, currency, formatCurrency, theme } = useApp();
  const isLight = theme === 'light';

  const [operationType, setOperationType] = useState<Transaction['type']>('Share Purchase');
  const [sharesAmount, setSharesAmount] = useState<string>('500');
  const [pointsAmount, setPointsAmount] = useState<string>('5000');
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (operationType === 'Share Purchase') {
      const sharesCount = parseInt(sharesAmount, 10) || 100;
      const amountUSD = sharesCount * shares.sharePriceUSD;
      addTransaction({
        type: 'Share Purchase',
        sharesAmount: sharesCount,
        currencyAmount: amountUSD,
        currency: currency,
        status: 'Pending',
        note: notes || 'Souscription de nouvelles actions'
      });
    } else if (operationType === 'Reward Points Conversion') {
      const pts = parseInt(pointsAmount, 10) || 5000;
      const convertedShares = Math.floor(pts / points.pointsPerShare);
      addTransaction({
        type: 'Reward Points Conversion',
        pointsAmount: pts,
        sharesAmount: convertedShares,
        status: 'Approved',
        note: notes || `Conversion de ${pts.toLocaleString()} points en ${convertedShares} action(s)`
      });
    } else {
      const sharesCount = parseInt(sharesAmount, 10) || 100;
      addTransaction({
        type: 'Share Transfer',
        sharesAmount: sharesCount,
        status: 'Pending',
        note: notes || 'Demande de cession / transfert de titres'
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div 
      id="new-transaction-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div className={`w-full max-w-md border rounded-xl p-5 shadow-xl transition relative ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161616] border-white/10 text-white'
      }`}>
        {/* Close Button */}
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
              {t('app.success', 'Succès')}
            </h3>
            <p className={`text-xs max-w-xs mx-auto ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
              {t('transactions.requestSubmitted', 'Votre demande a été enregistrée avec succès.')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <h3 className="text-base font-bold font-['Montserrat']">
                {t('transactions.modalTitle', 'Soumettre une demande')}
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                {t('transactions.subtitle', 'Achats d\'actions, conversions de points et transferts')}
              </p>
            </div>

            {/* Operation Type Selection */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                {t('transactions.modalType', 'Type d\'opération')}
              </label>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <button
                  type="button"
                  onClick={() => setOperationType('Share Purchase')}
                  className={`p-2 rounded-lg border transition flex flex-col items-center gap-1 ${
                    operationType === 'Share Purchase'
                      ? 'bg-[#F2B01E] text-black font-bold border-[#F2B01E] shadow-sm'
                      : isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{t('transactions.typeBuy', 'Achat')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOperationType('Reward Points Conversion')}
                  className={`p-2 rounded-lg border transition flex flex-col items-center gap-1 ${
                    operationType === 'Reward Points Conversion'
                      ? 'bg-[#F2B01E] text-black font-bold border-[#F2B01E] shadow-sm'
                      : isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{t('transactions.typeConvert', 'Points')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOperationType('Share Transfer')}
                  className={`p-2 rounded-lg border transition flex flex-col items-center gap-1 ${
                    operationType === 'Share Transfer'
                      ? 'bg-[#F2B01E] text-black font-bold border-[#F2B01E] shadow-sm'
                      : isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{t('transactions.typeTransfer', 'Transfert')}</span>
                </button>
              </div>
            </div>

            {/* Dynamic Inputs based on type */}
            {operationType === 'Share Purchase' && (
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  {t('transactions.amountShares', 'Nombre d\'actions')}
                </label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={sharesAmount}
                  onChange={(e) => setSharesAmount(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold outline-none transition ${
                    isLight 
                      ? 'bg-white border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                      : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                  }`}
                  required
                />
                <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Prix unitaire : <span className="font-semibold">${shares.sharePriceUSD}</span> | 
                  Total estimé : <span className="text-[#C8880A] dark:text-[#F2B01E] font-bold">{formatCurrency((parseInt(sharesAmount, 10) || 0) * shares.sharePriceUSD)}</span>
                </p>
              </div>
            )}

            {operationType === 'Reward Points Conversion' && (
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  {t('transactions.amountPoints', 'Points à convertir')}
                </label>
                <input
                  type="number"
                  min="5000"
                  step="5000"
                  value={pointsAmount}
                  onChange={(e) => setPointsAmount(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold outline-none transition ${
                    isLight 
                      ? 'bg-white border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                      : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                  }`}
                  required
                />
                <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Taux : {(points?.pointsPerShare ?? 5000).toLocaleString()} pts = 1 action | Actions obtenues : <span className="text-[#C8880A] dark:text-[#F2B01E] font-bold">{Math.floor((parseInt(pointsAmount, 10) || 0) / (points?.pointsPerShare || 5000))}</span>
                </p>
              </div>
            )}

            {operationType === 'Share Transfer' && (
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  {t('transactions.amountShares', 'Nombre d\'actions à transférer')}
                </label>
                <input
                  type="number"
                  min="1"
                  max={shares?.totalShares ?? 5000}
                  value={sharesAmount}
                  onChange={(e) => setSharesAmount(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold outline-none transition ${
                    isLight 
                      ? 'bg-white border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                      : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                  }`}
                  required
                />
                <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Solde disponible : {(shares?.totalShares ?? 0).toLocaleString()} actions ordinaires
                </p>
              </div>
            )}

            {/* Note / Instruction */}
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                {t('transactions.notes', 'Remarques ou instructions')}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Bénéficiaire du transfert, méthode de paiement..."
                className={`w-full px-3 py-2 rounded-lg border text-xs placeholder:text-gray-400 outline-none transition ${
                  isLight 
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                    : 'bg-black/50 border-white/10 text-white focus:border-[#F2B01E]'
                }`}
              />
            </div>

            {/* Submit Button (Flat, No Glow, Less Rounded) */}
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
                id="submit-transaction-button"
                className="px-4 py-2 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs transition flex items-center gap-1.5 active:scale-95 shadow-sm"
              >
                <span>{t('transactions.submitRequest', 'Envoyer ma demande')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
