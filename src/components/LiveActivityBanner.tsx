import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  X,
  Play,
  Pause,
  CloudCheck,
  Zap,
  Activity,
  CheckCircle2
} from 'lucide-react';

export const LiveActivityBanner: React.FC = () => {
  const {
    latestLiveEvent,
    dismissLatestLiveEvent,
    isLiveSimulationActive,
    setIsLiveSimulationActive,
    triggerLiveDeposit,
    triggerLiveWithdrawal,
    firebaseSyncStatus,
    firebaseLastSyncTime,
    isCleanMode,
    theme
  } = useApp();

  const isLight = theme === 'light';

  // Auto-dismiss the live event toast after 6.5 seconds
  useEffect(() => {
    if (!latestLiveEvent) return;
    const timer = setTimeout(() => {
      dismissLatestLiveEvent();
    }, 6500);
    return () => clearTimeout(timer);
  }, [latestLiveEvent, dismissLatestLiveEvent]);

  return (
    <>
      {/* 1. Live Animated Toast for Deposits & Withdrawals (Preuve de fonctionnement) */}
      {latestLiveEvent && (
        <div
          className={`fixed top-18 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-50 transition-all duration-300 ease-out border rounded-lg p-3.5 shadow-md backdrop-blur-md animate-in slide-in-from-top-4 ${
            latestLiveEvent.type === 'Deposit'
              ? isLight
                ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                : 'border-emerald-500/50 bg-[#0F1D15] text-white'
              : isLight
                ? 'border-amber-300 bg-amber-50 text-amber-950'
                : 'border-[#F2B01E]/50 bg-[#1D180F] text-white'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  latestLiveEvent.type === 'Deposit'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-[#F2B01E]/20 text-amber-700 dark:text-[#F2B01E] border-[#F2B01E]/30'
                }`}
              >
                {latestLiveEvent.type === 'Deposit' ? (
                  <ArrowDownLeft className="w-4 h-4 animate-bounce" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 animate-pulse" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      latestLiveEvent.type === 'Deposit'
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        : 'bg-[#F2B01E]/20 text-amber-800 dark:text-[#F2B01E]'
                    }`}
                  >
                    {latestLiveEvent.type === 'Deposit' ? 'DÉPÔT EN DIRECT' : 'RETRAIT / RETRAITE VALIDÉ'}
                  </span>
                  <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    {latestLiveEvent.timestamp}
                  </span>
                </div>

                <div className={`font-extrabold text-sm mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {latestLiveEvent.amount}
                </div>

                <div className={`text-xs mt-0.5 line-clamp-1 ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                  <span className="font-semibold">{latestLiveEvent.user}</span> • {latestLiveEvent.detail}
                </div>

                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>Enregistré & synchronisé Firestore</span>
                </div>
              </div>
            </div>

            <button
              onClick={dismissLatestLiveEvent}
              className={`p-1 rounded-lg transition ${
                isLight ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white'
              }`}
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Compact Proof & Firestore Status Pill Bar */}
      <div className="max-w-4xl mx-auto px-4 pt-2">
        <div className={`rounded-lg border px-3 py-2 flex items-center justify-between gap-2 shadow-sm text-xs transition ${
          isLight 
            ? 'bg-white border-slate-200 text-slate-900' 
            : 'bg-[#141414] border-white/10 text-white'
        }`}>
          <div className="flex items-center gap-2 overflow-hidden">
            {/* Pulsing indicator */}
            <span className="relative flex h-2 w-2 shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLiveSimulationActive ? 'bg-emerald-400' : 'bg-gray-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveSimulationActive ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
            </span>

            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-[11px] flex items-center gap-1">
                <Activity className="w-3 h-3 text-[#F2B01E]" />
                <span className="hidden sm:inline">Preuve en Direct :</span>
                <span className={isLiveSimulationActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}>
                  {isLiveSimulationActive ? 'Dépôts & Retraits actifs' : 'Simulation en pause'}
                </span>
              </span>

              {/* Firestore Cloud Sync Badge */}
              <span className={`hidden md:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${
                isLight 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
              }`}>
                <CloudCheck className="w-3 h-3" />
                <span>Firestore {firebaseSyncStatus === 'connected' ? 'Connecté' : 'Synchronisé'}</span>
                {firebaseLastSyncTime && <span className="opacity-70">({firebaseLastSyncTime})</span>}
              </span>

              {isCleanMode && (
                <span className={`hidden lg:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${
                  isLight 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  <span>Plateforme épurée (0 compte fictif)</span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Trigger Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => triggerLiveDeposit(100, 125)}
              className={`px-2 py-1 rounded-lg border font-bold text-[11px] flex items-center gap-1 transition ${
                isLight 
                  ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800' 
                  : 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-300'
              }`}
              title="Créer un dépôt instantané"
            >
              <Zap className="w-3 h-3 text-emerald-500" />
              <span>+ Dépôt</span>
            </button>

            <button
              onClick={() => triggerLiveWithdrawal(150)}
              className={`px-2 py-1 rounded-lg border font-bold text-[11px] flex items-center gap-1 transition ${
                isLight 
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800' 
                  : 'bg-[#F2B01E]/15 hover:bg-[#F2B01E]/25 border-[#F2B01E]/30 text-[#F2B01E]'
              }`}
              title="Créer un retrait de dividendes instantané"
            >
              <ArrowUpRight className="w-3 h-3 text-[#F2B01E]" />
              <span>- Retrait</span>
            </button>

            <button
              onClick={() => setIsLiveSimulationActive(!isLiveSimulationActive)}
              className={`p-1 rounded-lg transition ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
              title={isLiveSimulationActive ? 'Mettre en pause' : 'Reprendre la simulation'}
            >
              {isLiveSimulationActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
