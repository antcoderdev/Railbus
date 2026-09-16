import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PieChart as PieIcon, 
  Award, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  Download, 
  ExternalLink,
  Lock,
  Layers
} from 'lucide-react';
import { ShareCertificateModal } from '../components/ShareCertificateModal';

export const MySharesView: React.FC = () => {
  const { shares, formatCurrency, t, user, theme } = useApp();
  const isLight = theme === 'light';
  const [activeCert, setActiveCert] = useState<any | null>(null);

  const total = shares.totalShares;
  const commonPct = total > 0 ? (shares.breakdown.commonShares / total) * 100 : 0;
  const preferredPct = total > 0 ? (shares.breakdown.preferredShares / total) * 100 : 0;
  const totalValUSD = total * shares.sharePriceUSD;

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-3.5 animate-fade-in">
      {/* View Header */}
      <div>
        <h1 className={`text-xl font-extrabold tracking-tight font-['Montserrat'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {t('shares.title', 'Portefeuille d\'Actions')}
        </h1>
        <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
          {t('shares.subtitle', 'Détail de vos participations au capital de RAILBUS Inc.')}
        </p>
      </div>

      {/* Portfolio Value Summary Card */}
      <div className={`rounded-lg p-5 border shadow-sm relative overflow-hidden transition ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
      }`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#F2B01E]" />
        
        <span className={`text-[11px] uppercase tracking-wider font-semibold block ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
          {t('shares.indicativeValue', 'Valeur Globale Estimée')}
        </span>
        <div className={`text-3xl font-extrabold tracking-tight font-['Montserrat'] mt-1 ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          {formatCurrency(totalValUSD)}
        </div>

        <div className={`grid grid-cols-2 gap-3 mt-4 pt-3 border-t text-xs ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
          <div>
            <span className={`block ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{t('shares.totalVolume', 'Total actions')}</span>
            <span className="font-extrabold text-[#C8880A] dark:text-[#F2B01E] text-base font-['Montserrat']">
              {(shares?.totalShares ?? 0).toLocaleString()}
            </span>
          </div>
          <div>
            <span className={`block ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{t('dashboard.sharePrice', 'Prix unitaire')}</span>
            <span className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
              ${(shares?.sharePriceUSD ?? 1.25).toFixed(2)} USD
            </span>
          </div>
        </div>
      </div>

      {/* Share Distribution Breakdown & Visual Segmented Bar */}
      <div className={`rounded-lg p-5 border shadow-sm space-y-3.5 transition ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-xs font-bold uppercase tracking-wider font-['Montserrat'] flex items-center gap-1.5 ${
            isLight ? 'text-slate-600' : 'text-gray-300'
          }`}>
            <Layers className="w-3.5 h-3.5 text-[#F2B01E]" />
            {t('shares.breakdown', 'Répartition des Actions')}
          </h3>
          <span className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            100% Nominatif
          </span>
        </div>

        {/* Visual Segmented Bar (Solid Flat Colors, No Gradients) */}
        <div className={`h-2.5 w-full rounded-md overflow-hidden flex p-0.5 border ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/60 border-white/10'
        }`}>
          <div 
            style={{ width: `${commonPct}%` }}
            className="h-full bg-[#F2B01E] rounded-sm"
            title={`Actions Ordinaires: ${commonPct.toFixed(1)}%`}
          />
          <div 
            style={{ width: `${preferredPct}%` }}
            className="h-full bg-sky-500 rounded-sm"
            title={`Actions Privilégiées: ${preferredPct.toFixed(1)}%`}
          />
        </div>

        {/* Breakdown Items List */}
        <div className="space-y-2 pt-1 text-xs">
          {/* Common Shares */}
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-md bg-[#F2B01E]" />
              <div>
                <h4 className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {t('shares.common', 'Actions Ordinaires (Common)')}
                </h4>
                <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Class A Voting Stock</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`font-extrabold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {(shares?.breakdown?.commonShares ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-[#C8880A] dark:text-[#F2B01E] block font-semibold">
                {commonPct.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Preferred Shares */}
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-md bg-sky-500" />
              <div>
                <h4 className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {t('shares.preferred', 'Actions Privilégiées (Preferred)')}
                </h4>
                <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Priority Dividend Stock</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`font-extrabold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {(shares?.breakdown?.preferredShares ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-sky-600 dark:text-sky-400 block font-semibold">
                {preferredPct.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Share Certificates Section */}
      <div className={`rounded-lg p-5 border shadow-sm space-y-3 transition ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider font-['Montserrat'] flex items-center gap-1.5 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <Award className="w-4 h-4 text-[#F2B01E]" />
              {t('shares.certificatesTitle', 'Certificats d\'Actions')}
            </h3>
            <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              {t('shares.certificatesDesc', 'Documents juridiques certifiés État du Delaware.')}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
          {shares.certificates.map((cert) => (
            <div
              key={cert.id}
              className={`p-3.5 rounded-lg border relative flex flex-col justify-between gap-2.5 transition ${
                isLight 
                  ? 'bg-amber-50/60 border-amber-200 text-slate-900' 
                  : 'bg-black/50 border-[#F2B01E]/30 text-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#F2B01E]/20 text-amber-800 dark:text-[#F2B01E] font-bold">
                    {cert.certificateNumber}
                  </span>
                  <h4 className={`text-sm font-bold mt-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {cert.sharesType}
                  </h4>
                  <span className={`text-xs block ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                    {(cert.sharesCount ?? 0).toLocaleString()} {t('dashboard.commonShares', 'Actions Ordinaires')}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-lg bg-[#F2B01E]/15 border border-[#F2B01E]/40 flex items-center justify-center text-[#C8880A] dark:text-[#F2B01E]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className={`flex items-center justify-between pt-2 border-t text-xs ${
                isLight ? 'border-amber-200/60' : 'border-white/10'
              }`}>
                <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  {cert.issueDate}
                </span>

                <button
                  onClick={() => setActiveCert(cert)}
                  id={`view-cert-${cert.id}`}
                  className="px-3 py-1.5 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t('shares.viewCertificate', 'Voir le Certificat')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      <ShareCertificateModal
        certificate={activeCert}
        onClose={() => setActiveCert(null)}
      />
    </div>
  );
};
