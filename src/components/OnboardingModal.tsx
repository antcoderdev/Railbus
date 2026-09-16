import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Headphones, 
  Megaphone, 
  LayoutDashboard, 
  UserPlus, 
  History, 
  ArrowRight, 
  Check, 
  Globe,
  Sun
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { hasSeenOnboarding, completeOnboarding, language, setLanguage, t, theme } = useApp();
  const isLight = theme === 'light';
  const [currentSlide, setCurrentSlide] = useState(0);

  if (hasSeenOnboarding) {
    return null;
  }

  const slides = [
    {
      id: 0,
      titleKey: 'onboarding.slide1Title',
      descKey: 'onboarding.slide1Desc',
      icon: Headphones,
      badge: '24/7 SUPPORT',
    },
    {
      id: 1,
      titleKey: 'onboarding.slide2Title',
      descKey: 'onboarding.slide2Desc',
      icon: Megaphone,
      badge: 'OFFICIAL NEWS',
    },
    {
      id: 2,
      titleKey: 'onboarding.slide3Title',
      descKey: 'onboarding.slide3Desc',
      icon: LayoutDashboard,
      badge: 'ONE-TAP ACCESS',
    },
    {
      id: 3,
      titleKey: 'onboarding.slide4Title',
      descKey: 'onboarding.slide4Desc',
      icon: UserPlus,
      badge: 'REFERRAL BONUS',
    },
    {
      id: 4,
      titleKey: 'onboarding.slide5Title',
      descKey: 'onboarding.slide5Desc',
      icon: History,
      badge: 'TRANSPARENCY',
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
    }
  };

  const current = slides[currentSlide];
  const IconComponent = current.icon;

  return (
    <div 
      id="onboarding-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div className={`w-full max-w-md border rounded-xl p-6 shadow-xl flex flex-col justify-between min-h-[500px] transition ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
      } relative overflow-hidden`}>
        {/* Top Header: Logo & Language Selector */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#F2B01E] flex items-center justify-center text-black font-black">
              <Sun className="w-4 h-4 text-black" />
            </div>
            <span className={`font-extrabold tracking-wider text-sm font-['Montserrat'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
              RAIL<span className="text-[#C8880A] dark:text-[#F2B01E]">B</span>US
            </span>
          </div>

          <div className={`flex items-center gap-1 p-0.5 rounded-lg border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'
          }`}>
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                language === 'fr' 
                  ? 'bg-[#F2B01E] text-black shadow-sm' 
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                language === 'en' 
                  ? 'bg-[#F2B01E] text-black shadow-sm' 
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Center Visual Art & Slide Content */}
        <div className="my-auto py-5 flex flex-col items-center text-center relative z-10">
          {/* Stylized Icon Card */}
          <div className="relative mb-5">
            <div className={`w-20 h-20 rounded-xl border flex items-center justify-center shadow-sm ${
              isLight ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-[#1C1C1C] border-[#F2B01E]/40 text-[#F2B01E]'
            }`}>
              <IconComponent className="w-10 h-10 stroke-[1.8]" />
            </div>
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#F2B01E] text-black shadow-sm whitespace-nowrap">
              {current.badge}
            </span>
          </div>

          <h2 className={`text-xl font-extrabold tracking-tight mb-2 font-['Montserrat'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t(current.titleKey)}
          </h2>

          <p className={`text-xs sm:text-sm max-w-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
            {t(current.descKey)}
          </p>
        </div>

        {/* Bottom Pagination & Navigation Controls */}
        <div className={`relative z-10 pt-4 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all rounded-full ${
                  idx === currentSlide
                    ? 'w-6 h-1.5 bg-[#F2B01E]'
                    : isLight ? 'w-1.5 h-1.5 bg-slate-300' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={completeOnboarding}
              id="onboarding-skip"
              className={`text-xs font-semibold px-3 py-2 transition ${
                isLight ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('onboarding.skip', 'Passer')}
            </button>

            <button
              onClick={handleNext}
              id="onboarding-next"
              className="flex-1 max-w-[200px] py-2.5 px-4 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 active:scale-95 shadow-sm"
            >
              <span>
                {currentSlide === slides.length - 1
                  ? t('onboarding.getStarted', 'Accéder à mon espace')
                  : t('onboarding.next', 'Suivant')}
              </span>
              {currentSlide === slides.length - 1 ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
