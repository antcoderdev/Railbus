import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeftRight, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Filter,
  DollarSign,
  Coins,
  Share2,
  ArrowDownLeft,
  ArrowUpRight,
  Gift
} from 'lucide-react';
import { NewTransactionModal } from '../components/NewTransactionModal';
import { Transaction } from '../types';

export const TransactionsView: React.FC = () => {
  const { transactions, formatCurrency, t, theme } = useApp();
  const isLight = theme === 'light';

  const [filterStatus, setFilterStatus] = useState<'All' | 'Approved' | 'Pending' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesStatus = filterStatus === 'All' || tx.status === filterStatus;
    const matchesSearch =
      tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>{t('transactions.statusApproved', 'Approuvé')}</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>{t('transactions.statusPending', 'En attente')}</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            <span>{t('transactions.statusRejected', 'Rejeté')}</span>
          </span>
        );
    }
  };

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'Deposit':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-[#C8880A] dark:text-[#F2B01E]" />;
      case 'Share Purchase':
        return <DollarSign className="w-4 h-4 text-[#C8880A] dark:text-[#F2B01E]" />;
      case 'Reward Points Conversion':
        return <Coins className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'Share Transfer':
        return <Share2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'Dividend / Bonus':
        return <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <DollarSign className="w-4 h-4 text-[#C8880A] dark:text-[#F2B01E]" />;
    }
  };

  return (
    <div className="pb-28 pt-3 px-4 max-w-md mx-auto space-y-3.5 animate-fade-in relative min-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-extrabold tracking-tight font-['Montserrat'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t('transactions.title', 'Historique des Transactions')}
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            {t('transactions.subtitle', 'Suivi de vos souscriptions, conversions et transferts')}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          id="new-tx-header-button"
          className="px-3 py-2 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs flex items-center gap-1 transition active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">{t('transactions.submitRequest', 'Nouvelle demande')}</span>
        </button>
      </div>

      {/* Search Input & Status Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('transactions.searchPlaceholder', 'Rechercher par référence, type...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-xs placeholder:text-gray-400 outline-none transition ${
              isLight 
                ? 'bg-white border-slate-300 text-slate-900 focus:border-[#F2B01E]' 
                : 'bg-[#141414] border-white/10 text-white focus:border-[#F2B01E]'
            }`}
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {(['All', 'Approved', 'Pending', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
                filterStatus === st
                  ? 'bg-[#F2B01E] text-black border-[#F2B01E] shadow-sm'
                  : isLight 
                    ? 'bg-white text-slate-600 hover:text-slate-900 border-slate-200' 
                    : 'bg-[#141414] text-gray-400 hover:text-white border-white/5'
              }`}
            >
              {st === 'All' ? t('notifications.tabAll', 'Toutes') : t(`transactions.status${st}`, st)}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className={`p-8 text-center border rounded-lg ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#141414] border-white/10'
          }`}>
            <ArrowLeftRight className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-60" />
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              {t('transactions.empty', 'Aucune transaction trouvée pour ces critères.')}
            </p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className={`p-3.5 rounded-lg border transition shadow-sm space-y-2 ${
                isLight 
                  ? 'bg-white border-slate-200 text-slate-900 hover:border-slate-300' 
                  : 'bg-[#141414] border-white/10 text-white hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
                  }`}>
                    {getTypeIcon(tx.type)}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {tx.type}
                    </h4>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>
                      {tx.reference}
                    </span>
                  </div>
                </div>

                <div>
                  {getStatusBadge(tx.status)}
                </div>
              </div>

              {tx.note && (
                <p className={`text-[11px] p-2 rounded-lg border italic ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-black/30 border-white/5 text-gray-300'
                }`}>
                  "{tx.note}"
                </p>
              )}

              <div className={`flex items-center justify-between pt-2 border-t text-xs ${
                isLight ? 'border-slate-100' : 'border-white/5'
              }`}>
                <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{tx.date}</span>

                <div className="text-right">
                  {tx.sharesAmount != null && (
                    <span className="font-extrabold text-[#C8880A] dark:text-[#F2B01E] block font-['Montserrat']">
                      +{(tx.sharesAmount || 0).toLocaleString()} Actions
                    </span>
                  )}
                  {tx.currencyAmount != null && (
                    <span className={`text-[11px] font-semibold block ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                      {formatCurrency(tx.currencyAmount)}
                    </span>
                  )}
                  {tx.pointsAmount != null && (
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold block">
                      -{(tx.pointsAmount || 0).toLocaleString()} pts
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button '+' (Flat Solid Color, No Glow, Less Rounded) */}
      <button
        onClick={() => setIsModalOpen(true)}
        id="fab-add-transaction"
        className="fixed bottom-20 right-5 z-40 w-11 h-11 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black flex items-center justify-center shadow-md active:scale-95 transition-transform"
        title={t('transactions.submitRequest', 'Nouvelle demande')}
        aria-label={t('transactions.submitRequest', 'Nouvelle demande')}
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* New Transaction Modal */}
      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
