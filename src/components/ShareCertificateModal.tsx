import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Award, Printer, X, CheckCircle2 } from 'lucide-react';
import { ShareCertificate } from '../types';

interface ShareCertificateModalProps {
  certificate: ShareCertificate | null;
  onClose: () => void;
}

export const ShareCertificateModal: React.FC<ShareCertificateModalProps> = ({
  certificate,
  onClose
}) => {
  const { t, language, theme } = useApp();
  const isLight = theme === 'light';

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className={`w-full max-w-xl border rounded-xl p-5 sm:p-7 shadow-xl transition relative my-auto ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition print:hidden ${
            isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          aria-label={t('app.close', 'Fermer')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Card Preview (Flat, high-contrast, no gradient) */}
        <div className={`print:m-0 print:border-none p-6 sm:p-8 rounded-lg border-2 border-double relative overflow-hidden ${
          isLight 
            ? 'bg-amber-50/40 border-amber-400/80 text-slate-900' 
            : 'bg-[#181818] border-[#F2B01E]/60 text-white'
        }`}>
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <span className="text-8xl font-black tracking-widest text-[#F2B01E]">RAILBUS</span>
          </div>

          {/* Certificate Header */}
          <div className="text-center relative z-10 mb-5">
            <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded border text-[10px] font-bold tracking-widest uppercase mb-2 ${
              isLight 
                ? 'bg-amber-100/80 border-amber-300 text-amber-900' 
                : 'bg-[#F2B01E]/10 border-[#F2B01E]/40 text-[#F2B01E]'
            }`}>
              <ShieldCheck className="w-3 h-3" />
              <span>{certificate.jurisdiction}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-widest font-['Montserrat']">
              RAIL<span className="text-[#C8880A] dark:text-[#F2B01E]">B</span>US INC.
            </h2>
            <p className={`text-xs mt-1 uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              {t('shares.certificatesTitle', 'Certificat d\'Actions d\'Entreprise')}
            </p>
            <div className="w-24 h-0.5 bg-[#F2B01E] mx-auto mt-2" />
          </div>

          {/* Certificate Body */}
          <div className="relative z-10 space-y-3.5 text-center my-5">
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
              {language === 'fr' 
                ? 'Ceci certifie que le membre ci-dessous est le détenteur officiel inscrit de :'
                : 'This certifies that the member named below is the registered holder of:'}
            </p>

            <div className={`py-2 rounded-lg border ${
              isLight ? 'bg-white border-amber-200' : 'bg-black/40 border-white/5'
            }`}>
              <div className="text-2xl sm:text-3xl font-black text-[#C8880A] dark:text-[#F2B01E] tracking-tight font-['Montserrat']">
                {(certificate?.sharesCount ?? 0).toLocaleString()}
              </div>
              <div className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-gray-200'}`}>
                {certificate.sharesType}
              </div>
            </div>

            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
              {t('shares.registeredTo', 'Enregistré au nom de')} :
            </p>
            <div className="text-lg sm:text-xl font-bold underline decoration-[#F2B01E] decoration-2 underline-offset-4">
              {certificate.shareholderName}
            </div>
          </div>

          {/* Certificate Details Grid */}
          <div className={`grid grid-cols-2 gap-3 pt-3.5 border-t relative z-10 text-[11px] ${
            isLight ? 'border-amber-200' : 'border-[#F2B01E]/30'
          }`}>
            <div>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{t('shares.certificateNumber', 'Certificat N°')}</span>
              <span className="font-mono font-bold">{certificate.certificateNumber}</span>
            </div>
            <div className="text-right">
              <span className={`block ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{t('shares.issueDate', 'Date d\'émission')}</span>
              <span className="font-semibold">{certificate.issueDate}</span>
            </div>
            <div>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{t('shares.parValue', 'Valeur nominale')}</span>
              <span className={`font-mono ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>{certificate.nominalValue}</span>
            </div>
            <div className="text-right flex flex-col items-end justify-end">
              <div className="w-20 border-b border-dashed border-gray-400 mb-0.5" />
              <span className="text-[10px] text-[#C8880A] dark:text-[#F2B01E] italic font-serif">{certificate.signature}</span>
            </div>
          </div>

          {/* Gold Seal Emblem */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-[#C8880A] dark:text-[#F2B01E] text-xs font-bold relative z-10">
            <Award className="w-4 h-4" />
            <span className="tracking-widest uppercase text-[10px]">
              {t('shares.sealedDelaware', 'Scellé & Enregistré État du Delaware')}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2.5 mt-5 print:hidden">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition border ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' 
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
            }`}
          >
            {t('app.close', 'Fermer')}
          </button>
          <button
            onClick={handlePrint}
            id="print-certificate-button"
            className="px-4 py-2 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>{t('shares.downloadPDF', 'Imprimer / Sauvegarder')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
