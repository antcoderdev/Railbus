import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sun, 
  Zap, 
  Globe, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Leaf, 
  Milestone, 
  Briefcase, 
  Mail, 
  Phone, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface AboutRailbusViewProps {
  onOpenFoundingPartner: () => void;
  onOpenContactSupport: () => void;
}

export const AboutRailbusView: React.FC<AboutRailbusViewProps> = ({
  onOpenFoundingPartner,
  onOpenContactSupport
}) => {
  const { 
    vehicleSpecs, 
    teamMembers, 
    roadmap, 
    contactInfo, 
    t, 
    language, 
    setActiveTab,
    theme
  } = useApp();

  const isLight = theme === 'light';

  const [activeSection, setActiveSection] = useState<
    'vehicles' | 'railpod' | 'tracks' | 'stations' | 'about' | 'team' | 'impact' | 'roadmap' | 'invest' | 'contact'
  >('vehicles');

  const navSections = [
    { id: 'vehicles', label: 'Véhicules' },
    { id: 'railpod', label: 'RAILPOD' },
    { id: 'tracks', label: 'Voies & Pistes' },
    { id: 'stations', label: 'Gares' },
    { id: 'about', label: 'À Propos' },
    { id: 'team', label: 'Équipe' },
    { id: 'impact', label: 'Impact Vert' },
    { id: 'roadmap', label: 'Feuille de Route' },
    { id: 'invest', label: 'Investir' },
    { id: 'contact', label: 'Contacts' },
  ] as const;

  return (
    <div className="pb-28 pt-3 px-4 max-w-md mx-auto space-y-4 animate-fade-in">
      {/* Top Banner (Flat, solid color, no gradient) */}
      <div className={`rounded-xl p-4 border transition relative overflow-hidden ${
        isLight 
          ? 'bg-amber-50 border-amber-300 text-slate-900' 
          : 'bg-[#181818] border-[#F2B01E]/40 text-white'
      }`}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-[#F2B01E] animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C8880A] dark:text-[#F2B01E]">
            RAILBUS.COM OFFICIAL SHOWCASE
          </span>
        </div>
        <h1 className="text-lg font-extrabold tracking-tight font-['Montserrat']">
          Le Futur du Transport Solaire
        </h1>
        <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
          Système de transport ferroviaire léger surélevé, 100% autonome et alimenté par l'énergie solaire.
        </p>
      </div>

      {/* 10 Sub-Sections Navigation Pills (Scrollable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {navSections.map((sec) => (
          <button
            key={sec.id}
            id={`about-tab-${sec.id}`}
            onClick={() => setActiveSection(sec.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition border ${
              activeSection === sec.id
                ? 'bg-[#F2B01E] text-black border-[#F2B01E] shadow-sm'
                : isLight
                  ? 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                  : 'bg-[#141414] text-gray-400 hover:text-white border-white/5'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: VEHICLES */}
      {activeSection === 'vehicles' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className={`border rounded-xl p-4 transition ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#141414] border-white/10'
          }`}>
            <h2 className="text-sm font-bold font-['Montserrat'] mb-1">
              Gamme de Véhicules RAILBUS
            </h2>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Des modules ultra-légers à sustentation guidée optimisant le flux de passagers et de fret.
            </p>
          </div>

          <div className="space-y-3">
            {vehicleSpecs.map((spec) => (
              <div
                key={spec.id}
                className={`p-4 rounded-xl border transition space-y-3 ${
                  isLight 
                    ? 'bg-white border-slate-200 hover:border-amber-400' 
                    : 'bg-[#141414] border-white/10 hover:border-[#F2B01E]/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#C8880A] dark:text-[#F2B01E] tracking-wider">
                      {spec.category}
                    </span>
                    <h3 className="text-sm font-bold mt-0.5">
                      {spec.name}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    isLight 
                      ? 'bg-amber-100 text-amber-900 border-amber-300' 
                      : 'bg-[#F2B01E]/15 text-[#F2B01E] border-[#F2B01E]/30'
                  }`}>
                    {spec.capacity}
                  </span>
                </div>

                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                  {spec.description}
                </p>

                <div className={`grid grid-cols-2 gap-2 pt-2 border-t text-[11px] ${
                  isLight ? 'border-slate-100' : 'border-white/5'
                }`}>
                  <div className={`p-2 rounded-lg ${isLight ? 'bg-slate-50' : 'bg-black/40'}`}>
                    <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Vitesse de croisière</span>
                    <span className="font-bold">{spec.speed}</span>
                  </div>
                  <div className={`p-2 rounded-lg ${isLight ? 'bg-slate-50' : 'bg-black/40'}`}>
                    <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Alimentation</span>
                    <span className="font-bold text-[#C8880A] dark:text-[#F2B01E]">{spec.power}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: RAILPOD */}
      {activeSection === 'railpod' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className={`rounded-xl p-5 border space-y-3 transition ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#141414] border-white/10'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C8880A] dark:text-[#F2B01E]">
              POD INDIVIDUEL ET FAMILIAL
            </span>
            <h2 className="text-base font-extrabold font-['Montserrat']">
              RAILPOD : La mobilité sur demande
            </h2>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
              Le RAILPOD est une capsule intelligente ultra-légère conçue pour transporter de 1 à 4 passagers sans arrêts intermédiaires. Commandé via smartphone, il rejoint directement la destination choisie sur le réseau surélevé.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className={`p-3 rounded-lg border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/50 border-white/5'
              }`}>
                <Cpu className="w-4 h-4 text-[#C8880A] dark:text-[#F2B01E] mb-1" />
                <span className="font-bold block">Conduite Autonome</span>
                <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>IA & capteurs LIDAR</span>
              </div>
              <div className={`p-3 rounded-lg border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/50 border-white/5'
              }`}>
                <Zap className="w-4 h-4 text-[#C8880A] dark:text-[#F2B01E] mb-1" />
                <span className="font-bold block">Zéro Attente</span>
                <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Flux continu sans congestion</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: TRACKS & INFRASTRUCTURE */}
      {activeSection === 'tracks' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className={`rounded-xl p-5 border space-y-3 transition ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#141414] border-white/10'
          }`}>
            <h2 className="text-base font-bold font-['Montserrat']">
              Voies Surélevées à Énergie Solaire
            </h2>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
              L'infrastructure RAILBUS utilise des piliers légers et des travées modulaires préfabriquées intégrées de panneaux photovoltaïques à haut rendement.
            </p>

            <div className={`space-y-2 pt-1 text-xs ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8880A] dark:text-[#F2B01E] shrink-0 mt-0.5" />
                <span><strong>Coût divisé par 5 :</strong> Jusqu'à 80% moins cher que la construction d'un métro lourd conventionnel.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8880A] dark:text-[#F2B01E] shrink-0 mt-0.5" />
                <span><strong>Emprise au sol minimale :</strong> Installable au-dessus des terre-pleins centraux d'autoroutes et boulevards urbains.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8880A] dark:text-[#F2B01E] shrink-0 mt-0.5" />
                <span><strong>Production d'énergie positive :</strong> Les voies produisent plus d'électricité solaire que la consommation nécessaire des navettes.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: STATIONS */}
      {activeSection === 'stations' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className={`rounded-xl p-5 border space-y-3 transition ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#141414] border-white/10'
          }`}>
            <h2 className="text-base font-bold font-['Montserrat']">
              Gares & Hubs Intelligents
            </h2>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
              Des stations compactes, sécurisées et climatisées, implantées à proximité immédiate des zones résidentielles, aéroports, universités et centres d'affaires.
            </p>
            <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-black/40 border-white/5 text-gray-300'
            }`}>
              <p className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Caractéristiques clés :</p>
              <p>• Embarquement et débarquement en dérivation (hors voie principale pour maintenir le flux continu).</p>
              <p>• Portillons automatiques et accès biométrique / QR code sécurisé.</p>
              <p>• Micro-réseau avec stockage par batteries tampons pour garantir un service 24/7 en tout temps.</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: ABOUT COMPANY */}
      {activeSection === 'about' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className={`rounded-xl p-5 border space-y-3 text-xs leading-relaxed transition ${
            isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#141414] border-white/10 text-gray-300'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C8880A] dark:text-[#F2B01E]">
              SOCIÉTÉ RAILBUS INC.
            </span>
            <h2 className="text-base font-bold font-['Montserrat']">
              Pionnier de la mobilité propre
            </h2>
            <p>
              RAILBUS Inc. est une société par actions enregistrée dans l'État du Delaware (États-Unis), dont la mission est de révolutionner le transport collectif urbain mondial grâce à une solution ferroviaire légère solaire décarbonée.
            </p>
            <p>
              L'entreprise réunit des ingénieurs ferroviaires, des experts en intelligence artificielle et des spécialistes en énergies renouvelables autour d'une vision commune : éliminer les embouteillages et offrir un transport propre accessible à tous.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 6: TEAM */}
      {activeSection === 'team' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className={`border rounded-xl p-4 transition ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#141414] border-white/10'
          }`}>
            <h2 className="text-sm font-bold font-['Montserrat'] mb-1">
              Équipe Dirigeante & Conseil
            </h2>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Des leaders visionnaires menant l'expansion technologique et géographique.
            </p>
          </div>

          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#141414] border-white/10'
                }`}
              >
                <div className={`w-11 h-11 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${
                  isLight 
                    ? 'bg-amber-50 border-amber-300 text-amber-900' 
                    : 'bg-[#1E1E1E] border-[#F2B01E]/40 text-[#F2B01E]'
                }`}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold">
                      {member.name}
                    </h3>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>
                      {member.location}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-[#C8880A] dark:text-[#F2B01E] block mt-0.5">
                    {member.role}
                  </span>

                  <p className={`text-[11px] mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: GREEN IMPACT */}
      {activeSection === 'impact' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className={`rounded-xl p-5 border space-y-3 transition ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#141414] border-white/10'
          }`}>
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-500" />
              <h2 className="text-base font-bold font-['Montserrat']">
                Impact Écologique & Sociétal
              </h2>
            </div>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
              En remplaçant les autobus thermiques et les trajets individuels en voiture, RAILBUS permet d'éviter des millions de tonnes de CO2 chaque année.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-['Montserrat']">100%</span>
                <span className="block text-[11px] mt-1 font-semibold">Énergie Solaire</span>
                <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Zéro émission de GES</span>
              </div>
              <div className="p-3 rounded-lg bg-[#F2B01E]/10 border border-[#F2B01E]/20">
                <span className="text-2xl font-black text-[#C8880A] dark:text-[#F2B01E] font-['Montserrat']">-75%</span>
                <span className="block text-[11px] mt-1 font-semibold">Temps de Trajet</span>
                <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Circulation en site propre surélevé</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 8: ROADMAP */}
      {activeSection === 'roadmap' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className={`border rounded-xl p-4 transition ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#141414] border-white/10'
          }`}>
            <h2 className="text-sm font-bold font-['Montserrat'] mb-1">
              Feuille de Route Stratégique
            </h2>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Des jalons clairs vers le déploiement commercial mondial.
            </p>
          </div>

          <div className="space-y-3 relative pl-4 border-l-2 border-[#F2B01E]/40 ml-2">
            {roadmap.map((m) => (
              <div key={m.id} className="relative pl-3 space-y-1">
                <span className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                  isLight ? 'border-white' : 'border-black'
                } ${
                  m.status === 'Completed' ? 'bg-emerald-500' :
                  m.status === 'In Progress' ? 'bg-[#F2B01E] animate-pulse' : 'bg-gray-400'
                }`} />

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#C8880A] dark:text-[#F2B01E] uppercase">
                    {m.year}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                    m.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                    m.status === 'In Progress' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400' : 
                    isLight ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-gray-400'
                  }`}>
                    {m.status}
                  </span>
                </div>

                <h3 className="text-xs font-bold">
                  {m.title}
                </h3>
                <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 9: INVEST / BECOME SHAREHOLDER */}
      {activeSection === 'invest' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className={`rounded-xl p-5 border space-y-3 transition ${
            isLight 
              ? 'bg-amber-50/50 border-amber-300 text-slate-900' 
              : 'bg-[#181818] border-[#F2B01E]/40 text-white'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C8880A] dark:text-[#F2B01E]">
              OPPORTUNITÉ ACTIONNAIRE
            </span>
            <h2 className="text-base font-extrabold font-['Montserrat']">
              Prenez part à la révolution du transport
            </h2>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
              En tant que membre actionnaire, vous détenez des parts certifiées dans RAILBUS Inc. et bénéficiez de conditions privilégiées lors des futures phases de levée de fonds et d'introduction.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8880A] dark:text-[#F2B01E]" />
                <span>Titres officiels émis sous juridiction Delaware (USA)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8880A] dark:text-[#F2B01E]" />
                <span>Programme de parrainage récompensé en actions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8880A] dark:text-[#F2B01E]" />
                <span>Accès prioritaire aux projets et villes pilotes</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full mt-2 py-2.5 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
            >
              <span>Accéder à mon espace souscription</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 10: CONTACTS */}
      {activeSection === 'contact' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className={`rounded-xl p-5 border space-y-3 transition ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#141414] border-white/10'
          }`}>
            <h2 className="text-base font-bold font-['Montserrat']">
              Coordonnées Officielles
            </h2>

            {/* Global Contacts */}
            <div className={`space-y-2 text-xs ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              <div className={`p-3 rounded-lg border space-y-1 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'
              }`}>
                <span className="text-[10px] uppercase font-bold text-[#C8880A] dark:text-[#F2B01E]">Siège Mondial (USA)</span>
                <p className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>RAILBUS Inc. — Delaware, États-Unis</p>
                <p className={isLight ? 'text-slate-500' : 'text-gray-400'}>Email : contact@railbus.com / invest@railbus.com</p>
                <p className={isLight ? 'text-slate-500' : 'text-gray-400'}>Site Web : https://railbus.com</p>
              </div>

              {/* Africa Regional Director */}
              <div className={`p-3.5 rounded-lg border space-y-1.5 ${
                isLight 
                  ? 'bg-amber-50/60 border-amber-300' 
                  : 'bg-black/60 border-[#F2B01E]/40'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#C8880A] dark:text-[#F2B01E]">Direction Régionale Afrique</span>
                  <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{contactInfo.africaContact.region}</span>
                </div>
                <h4 className="font-bold text-sm">
                  {contactInfo.africaContact.name}
                </h4>
                <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                  {contactInfo.africaContact.title}
                </p>
                <div className="pt-1 space-y-1 text-xs">
                  <a href={`mailto:${contactInfo.africaContact.email}`} className="text-[#C8880A] dark:text-[#F2B01E] hover:underline flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{contactInfo.africaContact.email}</span>
                  </a>
                  <a href={`tel:${contactInfo.africaContact.phone}`} className="hover:underline flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{contactInfo.africaContact.phone}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={onOpenContactSupport}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition ${
                  isLight 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200' 
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                }`}
              >
                Envoyer un message
              </button>
              <button
                onClick={onOpenFoundingPartner}
                className="flex-1 py-2 rounded-lg bg-[#F2B01E] hover:bg-[#E8B923] text-black text-xs font-bold transition active:scale-95 shadow-sm"
              >
                Devenir Partenaire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
