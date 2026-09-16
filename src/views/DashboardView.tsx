import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Coins, 
  ShoppingBag, 
  ArrowLeftRight, 
  Award, 
  PieChart, 
  UserPlus, 
  Sparkles, 
  Newspaper, 
  Info,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { NewTransactionModal } from '../components/NewTransactionModal';
import { ShareCertificateModal } from '../components/ShareCertificateModal';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    shares, 
    points, 
    currency, 
    setCurrency, 
    formatCurrency, 
    t, 
    setActiveTab,
    transactions,
    theme
  } = useApp();

  const isLight = theme === 'light';

  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any | null>(null);
  const [showReferralModal, setShowReferralModal] = useState(false);

  const totalValueUSD = shares.totalShares * shares.sharePriceUSD;

  const quickActions = [
    {
      id: 'buy',
      label: t('dashboard.actionBuyShares', 'Acheter Actions'),
      icon: ShoppingBag,
      color: 'text-[#C8880A] dark:text-[#F2B01E]',
      bg: isLight ? 'bg-amber-50 border-amber-200' : 'bg-[#F2B01E]/10 border-[#F2B01E]/20',
      action: () => setIsBuyModalOpen(true)
    },
    {
      id: 'tx',
      label: t('dashboard.actionTransactions', 'Transactions'),
      icon: ArrowLeftRight,
      color: 'text-sky-600 dark:text-sky-400',
      bg: isLight ? 'bg-sky-50 border-sky-200' : 'bg-sky-400/10 border-sky-400/20',
      action: () => setActiveTab('transactions')
    },
    {
      id: 'cert',
      label: t('dashboard.actionCertificates', 'Certificats'),
      icon: Award,
      color: 'text-amber-700 dark:text-amber-300',
      bg: isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-300/10 border-amber-300/20',
      action: () => setSelectedCert(shares.certificates[0] || null)
    },
    {
      id: 'shares',
      label: t('dashboard.actionMyShares', 'Mes Actions'),
      icon: PieChart,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-400/10 border-emerald-400/20',
      action: () => setActiveTab('shares')
    },
    {
      id: 'referral',
      label: t('dashboard.actionReferral', 'Parrainage'),
      icon: UserPlus,
      color: 'text-purple-600 dark:text-purple-400',
      bg: isLight ? 'bg-purple-50 border-purple-200' : 'bg-purple-400/10 border-purple-400/20',
      action: () => setShowReferralModal(true)
    },
    {
      id: 'points',
      label: t('dashboard.actionPoints', 'Mes Points'),
      icon: Coins,
      color: 'text-[#C8880A] dark:text-[#F2B01E]',
      bg: isLight ? 'bg-amber-50 border-amber-200' : 'bg-[#F2B01E]/10 border-[#F2B01E]/20',
      action: () => setIsBuyModalOpen(true)
    },
    {
      id: 'news',
      label: t('dashboard.actionNews', 'Actualités'),
      icon: Newspaper,
      color: 'text-blue-600 dark:text-blue-400',
      bg: isLight ? 'bg-blue-50 border-blue-200' : 'bg-blue-400/10 border-blue-400/20',
      action: () => setActiveTab('notifications')
    },
    {
      id: 'about',
      label: t('dashboard.actionExtras', 'À Propos'),
      icon: Info,
      color: 'text-rose-600 dark:text-rose-400',
      bg: isLight ? 'bg-rose-50 border-rose-200' : 'bg-rose-400/10 border-rose-400/20',
      action: () => setActiveTab('about')
    }
  ];

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-3.5 animate-fade-in">
      {/* User Greeting & Currency Switcher Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className={`text-[11px] font-medium block ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            {t('dashboard.greeting', 'Bonjour,')}
          </span>
          <h1 className={`text-xl font-extrabold tracking-tight font-['Montserrat'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {user.firstName} {user.lastName}
          </h1>
        </div>

        {/* Currency Switcher (USD / EUR / FCFA) */}
        <div className={`flex items-center gap-1 p-1 rounded-lg border shadow-sm ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#1A1A1A] border-white/10'
        }`}>
          {(['USD', 'EUR', 'FCFA'] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrency(curr)}
              className={`px-2 py-1 rounded-md text-[10.5px] font-bold tracking-tight transition ${
                currency === curr
                  ? 'bg-[#F2B01E] text-black shadow-sm'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Financial Cards: Total Shares & Total Points */}
      <div className="grid grid-cols-1 gap-3">
        {/* Total Shares Card (Solid Gold Top Border, No Gradient, Flat Elevation) */}
        <div className={`rounded-lg p-5 border shadow-sm relative overflow-hidden transition ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
        }`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#F2B01E]" />

          <div className="flex items-start justify-between relative z-10 mb-2">
            <div>
              <span className={`text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 ${
                isLight ? 'text-slate-500' : 'text-gray-400'
              }`}>
                <TrendingUp className="w-3.5 h-3.5 text-[#F2B01E]" />
                {t('dashboard.totalShares', 'Total Actions')}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-3xl font-extrabold tracking-tight font-['Montserrat'] ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {(shares?.totalShares ?? 0).toLocaleString()}
                </span>
                <span className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                  {t('dashboard.commonShares', 'Actions Ordinaires')}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-[10px] uppercase font-semibold block ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>
                {t('dashboard.sharePrice', 'Prix indicatif')}
              </span>
              <span className="text-xs font-bold text-[#C8880A] dark:text-[#F2B01E]">
                ${(shares?.sharePriceUSD ?? 1.25).toFixed(2)} USD
              </span>
            </div>
          </div>

          <div className={`pt-3 border-t flex items-center justify-between text-xs relative z-10 ${
            isLight ? 'border-slate-100' : 'border-white/10'
          }`}>
            <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>
              {t('dashboard.totalValue', 'Valeur estimée')}
            </span>
            <span className={`font-extrabold tracking-tight text-sm font-['Montserrat'] ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {formatCurrency(totalValueUSD)}
            </span>
          </div>
        </div>

        {/* Total Reward Points Card */}
        <div className={`rounded-lg p-4 border shadow-sm relative transition ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
        }`}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className={`text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 ${
                isLight ? 'text-slate-500' : 'text-gray-400'
              }`}>
                <Coins className="w-3.5 h-3.5 text-[#F2B01E]" />
                {t('dashboard.totalRewardPoints', 'Total Points de Récompense')}
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-extrabold text-[#C8880A] dark:text-[#F2B01E] tracking-tight font-['Montserrat']">
                  {(points?.totalRewardPoints ?? 0).toLocaleString()}
                </span>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>pts</span>
              </div>
            </div>

            <button
              onClick={() => setIsBuyModalOpen(true)}
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition ${
                isLight 
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200'
              }`}
            >
              {t('transactions.typeConvert', 'Convertir')}
            </button>
          </div>

          <div className={`mt-2 px-3 py-2 rounded-lg border flex items-center gap-2 text-[11px] ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-black/40 border-white/5 text-gray-300'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-[#F2B01E] shrink-0" />
            <span className="line-clamp-1">
              {(points?.pointsPerShare ?? 5000).toLocaleString()} pts = 1 action (min. {(points?.minRedemptionPoints ?? 250000).toLocaleString()} pts)
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className={`border rounded-lg p-4 shadow-sm transition ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
      }`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 font-['Montserrat'] ${
          isLight ? 'text-slate-600' : 'text-gray-400'
        }`}>
          {t('dashboard.quickActions', 'Actions Rapides')}
        </h3>

        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <button
                key={qa.id}
                id={`quick-action-${qa.id}`}
                onClick={qa.action}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition group ${
                  isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shadow-sm transition-transform group-hover:scale-105 ${qa.bg}`}>
                  <Icon className={`w-4 h-4 ${qa.color} stroke-[2]`} />
                </div>
                <span className={`text-[10px] font-semibold mt-1.5 text-center leading-tight line-clamp-1 ${
                  isLight ? 'text-slate-700' : 'text-gray-300'
                }`}>
                  {qa.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA Banner: Buy RAILBUS Shares (Solid Flat Background, No Glow, Less Rounded) */}
      <div className={`rounded-lg p-4 border shadow-sm relative transition ${
        isLight 
          ? 'bg-amber-50/80 border-amber-300 text-slate-900' 
          : 'bg-[#181818] border-[#F2B01E]/40 text-white'
      }`}>
        <div className="relative z-10">
          <div className="inline-block px-2 py-0.5 rounded bg-[#F2B01E]/20 text-amber-800 dark:text-[#F2B01E] text-[10px] font-bold tracking-wider uppercase mb-1.5 border border-[#F2B01E]/30">
            Actionnariat Stratégique
          </div>
          <h3 className="text-sm font-extrabold tracking-tight font-['Montserrat']">
            {t('dashboard.ctaTitle', 'Acheter des actions RAILBUS')}
          </h3>
          <p className={`text-xs mt-1 max-w-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
            {t('dashboard.ctaSubtitle', 'Développez votre participation dans l\'avenir du transport solaire mondial.')}
          </p>

          <button
            onClick={() => setIsBuyModalOpen(true)}
            id="dashboard-cta-buy-shares"
            className="mt-3 px-3.5 py-2 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs transition flex items-center gap-1.5 active:scale-95 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('dashboard.ctaButton', 'Acheter des actions')}</span>
          </button>
        </div>
      </div>

      {/* Recent Activity / Transactions Section */}
      <div className={`border rounded-lg p-4 shadow-sm transition ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-xs font-bold uppercase tracking-wider font-['Montserrat'] ${
            isLight ? 'text-slate-600' : 'text-gray-400'
          }`}>
            {t('dashboard.recentActivity', 'Activité Récente')}
          </h3>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-[#C8880A] dark:text-[#F2B01E] hover:underline flex items-center gap-0.5"
          >
            <span>{t('dashboard.viewAll', 'Voir tout')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {transactions.length === 0 ? (
            <div className={`p-4 text-center border rounded-lg text-xs ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-black/30 border-white/5 text-gray-400'
            }`}>
              {t('transactions.empty', 'Aucune transaction enregistrée. Mode réel épuré actif.')}
            </div>
          ) : (
            transactions.slice(0, 4).map((tx) => (
              <div
                key={tx.id}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-gray-300'
                  }`}>
                    <ArrowLeftRight className="w-3.5 h-3.5 text-[#F2B01E]" />
                  </div>
                  <div>
                    <h4 className={`font-semibold line-clamp-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{tx.type}</h4>
                    <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{tx.date}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {tx.sharesAmount ? `+${(tx.sharesAmount || 0).toLocaleString()} shs` : (tx.currencyAmount ? `${formatCurrency(tx.currencyAmount)}` : `${(tx.pointsAmount || 0).toLocaleString()} pts`)}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    tx.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                    tx.status === 'Pending' ? 'bg-amber-500/20 text-amber-800 dark:text-amber-400' :
                    'bg-rose-500/20 text-rose-700 dark:text-rose-400'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <NewTransactionModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />

      <ShareCertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      {/* Referral Quick Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className={`w-full max-w-sm border rounded-xl p-5 shadow-xl transition ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161616] border-white/10 text-white'
          }`}>
            <h3 className="text-base font-bold font-['Montserrat'] mb-1.5">
              {t('referral.title', 'Programme de Parrainage')}
            </h3>
            <p className={`text-xs leading-relaxed mb-3 ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
              {t('referral.bannerText', 'Chaque filleul reçoit 10 000 points et vous recevez 5 000 points.')}
            </p>

            <div className={`p-3 rounded-lg border text-center mb-4 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-black border-[#F2B01E]/40'
            }`}>
              <span className={`text-[10px] uppercase font-semibold block mb-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                {t('referral.yourCode', 'Votre Code Personnel')}
              </span>
              <span className="text-lg font-mono font-black text-[#F2B01E] tracking-widest">
                {points.referralCode}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowReferralModal(false)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition ${
                  isLight 
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                }`}
              >
                {t('app.close', 'Fermer')}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${t('referral.shareText')} ${points.referralCode}`
                  );
                  alert(t('app.copied', 'Copié !'));
                  setShowReferralModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black text-xs font-bold transition shadow-sm"
              >
                {t('referral.copyMessage', 'Copier')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
