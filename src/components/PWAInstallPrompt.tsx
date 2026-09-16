import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { t, theme } = useApp();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const isLight = theme === 'light';

  // If already running as installed standalone PWA or dismissed this session
  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (!ok) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {/* Native App Installation Notification dès l'entame */}
      <div 
        id="pwa-install-banner"
        className={`fixed top-3 left-3 right-3 max-w-lg mx-auto z-50 border rounded-lg p-3 shadow-md transition-all animate-fade-in ${
          isLight 
            ? 'bg-white border-slate-300 text-slate-900 shadow-slate-200/80' 
            : 'bg-[#161616] border-[#F2B01E]/40 text-white'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-black border border-[#F2B01E] flex items-center justify-center shrink-0">
              <img src="/icon.svg" alt="RAILBUS" className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F2B01E] animate-pulse" />
                <h4 className={`text-xs font-bold tracking-tight truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {t('app.installPWA', 'Installer l\'application RAILBUS')}
                </h4>
              </div>
              <p className={`text-[11px] truncate leading-tight mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                {t('app.installDesc', 'Expérience native plein écran & accès hors-ligne')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              id="pwa-install-trigger"
              className="px-2.5 py-1.5 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black text-xs font-bold transition flex items-center gap-1 active:scale-95 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('app.installButton', 'Installer')}</span>
            </button>

            <button
              onClick={() => setDismissed(true)}
              id="pwa-install-dismiss"
              className={`p-1.5 rounded-lg transition ${
                isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Fermer"
              title="Fermer la notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Guide Installation Modal (iOS / Android / Chrome Desktop) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className={`w-full max-w-sm border rounded-xl p-5 shadow-xl transition ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#181818] border-white/10 text-white'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#F2B01E]" />
                <h3 className={`font-bold text-sm tracking-tight ${isLight ? 'text-slate-900' : 'text-[#F2B01E]'}`}>
                  {isIOS ? 'Installation sur iPhone / iPad' : 'Installation sur Mobile & Ordinateur'}
                </h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className={`p-1 rounded-lg transition ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#F2B01E] text-black font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </div>
                    <div>
                      <p className="font-semibold">Bouton Partager</p>
                      <p className={`mt-0.5 flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                        Dans Safari, appuyez sur <Share2 className="w-3.5 h-3.5 text-[#F2B01E]" /> dans la barre de navigation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#F2B01E] text-black font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </div>
                    <div>
                      <p className="font-semibold">Sur l'écran d'accueil</p>
                      <p className={`mt-0.5 flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                        Sélectionnez <PlusSquare className="w-3.5 h-3.5 text-[#F2B01E]" /> "Sur l'écran d'accueil".
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#F2B01E] text-black font-bold flex items-center justify-center shrink-0 text-xs">
                      3
                    </div>
                    <div>
                      <p className="font-semibold">Confirmez l'ajout</p>
                      <p className={`mt-0.5 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                        Appuyez sur "Ajouter". L'icône RAILBUS se placera sur votre écran comme une application native.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#F2B01E] text-black font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </div>
                    <div>
                      <p className="font-semibold">Menu du navigateur</p>
                      <p className={`mt-0.5 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                        Sur Chrome / Edge / Firefox, ouvrez le menu (3 points verticaux en haut à droite).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#F2B01E] text-black font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </div>
                    <div>
                      <p className="font-semibold">Installer l'application</p>
                      <p className={`mt-0.5 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                        Cliquez sur "Installer l'application" ou "Ajouter à l'écran d'accueil".
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#F2B01E] text-black font-bold flex items-center justify-center shrink-0 text-xs">
                      3
                    </div>
                    <div>
                      <p className="font-semibold">Accès instantané</p>
                      <p className={`mt-0.5 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                        L'application se lance dans sa propre fenêtre native sans barre d'adresse.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs transition active:scale-[0.99]"
            >
              {t('app.close', 'J\'ai compris')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
