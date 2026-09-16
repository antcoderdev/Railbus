import {
  UserProfile,
  SharesData,
  PointsSettings,
  Transaction,
  NotificationItem,
  TeamMember,
  VehicleSpec,
  RoadmapMilestone,
  ContactInfo,
  FormSubmission,
  AdminAccount
} from '../types';

export const initialUserProfile: UserProfile = {
  id: 'usr_88421',
  name: 'Alexandre Martin',
  firstName: 'Alexandre',
  lastName: 'Martin',
  email: 'alexandre.martin@example.com',
  initials: 'AM',
  status: 'Active',
  memberId: 'RB-88421',
  joinedDate: '15 Janvier 2024',
  passwordHash: 'member2025' // default demo password for standard member
};

export const initialSharesData: SharesData = {
  totalShares: 5000,
  sharePriceUSD: 1.25,
  breakdown: {
    commonShares: 4000,
    preferredShares: 1000,
    founderShares: 0
  },
  certificates: [
    {
      id: 'cert_001',
      certificateNumber: 'RB-SH-2025-0842',
      shareholderName: 'Alexandre Martin',
      sharesCount: 5000,
      sharesType: 'Common Stock Class A',
      issueDate: '15 Janvier 2025',
      jurisdiction: 'State of Delaware, USA',
      nominalValue: '$0.001 Par Value per Share',
      signature: 'Hans Henrik, Corporate Secretary'
    }
  ]
};

export const initialPointsSettings: PointsSettings = {
  totalRewardPoints: 35000,
  pointsPerShare: 5000,
  minRedemptionPoints: 250000,
  referralBonusPoints: 5000,
  referralBonusReferrer: 5000,
  welcomeBonusPoints: 10000,
  referralCode: 'RAILBUS-AM88',
  referralCount: 3,
  successfulReferralsCount: 3,
  pointsEarnedFromReferrals: 15000,
  currencyRates: {
    USD: 1.25,
    EUR: 1.15,
    FCFA: 750
  }
};

export const initialTransactions: Transaction[] = [
  {
    id: 'tx_101',
    reference: 'TX-2025-0419',
    type: 'Share Purchase',
    date: '15 Jan 2025',
    sharesAmount: 4000,
    currencyAmount: 5000,
    currency: 'USD',
    status: 'Approved',
    note: 'Souscription initiale actions ordinaires (Common Shares)'
  },
  {
    id: 'tx_102',
    reference: 'TX-2025-0588',
    type: 'Reward Points Conversion',
    date: '02 Fév 2025',
    sharesAmount: 1,
    pointsAmount: 5000,
    status: 'Approved',
    note: 'Conversion de points de fidélité en 1 action ordinaire'
  },
  {
    id: 'tx_103',
    reference: 'TX-2025-0692',
    type: 'Share Purchase',
    date: '28 Fév 2025',
    sharesAmount: 1000,
    currencyAmount: 1250,
    currency: 'USD',
    status: 'Approved',
    note: 'Achat complémentaire actions privilégiées (Preferred)'
  },
  {
    id: 'tx_104',
    reference: 'TX-2025-0720',
    type: 'Dividend / Bonus',
    date: '10 Mar 2025',
    pointsAmount: 15000,
    status: 'Approved',
    note: 'Attribution bonus de parrainage (3 filleuls validés)'
  },
  {
    id: 'tx_105',
    reference: 'TX-2025-0814',
    type: 'Share Transfer',
    date: '14 Sep 2026',
    sharesAmount: 500,
    status: 'Pending',
    note: 'Demande de transfert de 500 actions vers compte affilié'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    titleFr: 'Big Step Forward : Le Development Hub RAILBUS',
    titleEn: 'Big Step Forward: The RAILBUS Development Hub',
    category: 'News',
    date: '12 Sep 2026',
    isRead: false,
    badge: 'Important',
    excerptFr: 'RAILBUS dévoile son futur centre technologique de ~50 000 m² à Dubai Silicon Oasis.',
    excerptEn: 'RAILBUS unveils plans for its future ~50,000 m² state-of-the-art Development Hub in Dubai Silicon Oasis.',
    contentFr: 'Nous avons l’immense fierté d’annoncer une avancée majeure dans notre déploiement mondial : la formalisation de notre Development Hub de 50 000 m² au sein de Dubai Silicon Oasis. Cette infrastructure de pointe accueillera nos bancs d’essai de propulsion à induction linéaire, notre piste d’accélération solaire et la chaîne d’assemblage pilote de nos rames de nouvelle génération.',
    contentEn: 'We are immensely proud to announce a historic milestone in our global expansion: the formalization of our 50,000 m² Development Hub inside Dubai Silicon Oasis. This advanced facility will house linear induction test tracks, our solar energy proving grounds, and the pilot assembly line for our next-generation rolling stock.'
  },
  {
    id: 'notif_2',
    titleFr: 'Welcome Aboard : Bienvenue sur RAILBUS Members',
    titleEn: 'Welcome Aboard: Welcome to RAILBUS Members',
    category: 'Announcement',
    date: '15 Jan 2025',
    isRead: true,
    excerptFr: 'Découvrez vos actions, certificats numériques et suivez les développements clés en un seul tap.',
    excerptEn: 'Explore your share ledger, digital Delaware certificates, and track corporate updates seamlessly.',
    contentFr: 'Bienvenue au sein de la communauté des actionnaires de RAILBUS Inc. Votre espace membre vous permet d’accéder en temps réel à votre registre d’actions, de télécharger vos certificats certifiés du Delaware, de suivre l’évolution de la valeur et de parrainer vos proches pour cumuler des points de fidélité convertibles.',
    contentEn: 'Welcome to the RAILBUS Inc. shareholder family. Your dedicated member portal enables you to review your equity portfolio in real time, export official Delaware certificates, monitor share value growth, and invite partners to accumulate convertible reward points.'
  },
  {
    id: 'notif_3',
    titleFr: 'Essais de capture solaire sur voies aériennes concluants',
    titleEn: 'Solar Track Continuous Current Collection Validated',
    category: 'News',
    date: '05 Août 2026',
    isRead: true,
    excerptFr: 'Les capteurs de courant continu confirment un rendement de transmission supérieur à 98%.',
    excerptEn: 'Direct current collection system confirms power transfer efficiency surpassing 98% under peak conditions.',
    contentFr: 'Nos équipes d’ingénierie dirigées par Anthony Joy ont validé avec succès les tests d’endurance de captage d’énergie sur rail composite. L’alimentation directe en courant continu depuis les toitures solaires élimine les pertes de conversion et garantit une autonomie continue sans interruption.',
    contentEn: 'Our engineering teams led by Anthony Joy have successfully concluded endurance runs for direct current collection on composite guideways. Direct DC transfer directly from track solar canopies eliminates conversion losses, securing non-stop autonomous operations.'
  }
];

export const initialTeamMembers: TeamMember[] = [
  { id: 'tm_1', name: 'Hans Henrik', roleFr: 'Partenaire & Conseiller', roleEn: 'Partner & Advisor', initials: 'HH' },
  { id: 'tm_2', name: 'Anthony Joy', roleFr: 'Responsable Ingénierie', roleEn: 'Head of Engineering', initials: 'AJ' },
  { id: 'tm_3', name: 'Mark Maclaurin', roleFr: 'Directeur Financier', roleEn: 'Chief Financial Officer', initials: 'MM' },
  { id: 'tm_4', name: 'Rawan Kamal', roleFr: 'Responsable Relations Investisseurs', roleEn: 'Head of Investor Relations', initials: 'RK' },
  { id: 'tm_5', name: 'Darina Shir', roleFr: 'Designer Industrielle Senior', roleEn: 'Senior Industrial Designer', initials: 'DS' },
  { id: 'tm_6', name: 'Martin Spaso', roleFr: 'Ingénieur Mécanique Senior', roleEn: 'Senior Mechanical Engineer', initials: 'MS' },
  { id: 'tm_7', name: 'Aleks Irinics', roleFr: 'Responsable Ingénierie Véhicules', roleEn: 'Head of Vehicle Engineering', initials: 'AI' },
  { id: 'tm_8', name: 'Marc Behnam', roleFr: 'Ingénieur Sécurité', roleEn: 'Safety Engineer', initials: 'MB' },
  { id: 'tm_9', name: 'Donya Jafari', roleFr: 'Cheffe de Projet', roleEn: 'Project Manager', initials: 'DJ' },
  { id: 'tm_10', name: 'Melih Bilgic', roleFr: 'Ingénieur Systèmes Senior', roleEn: 'Senior Systems Engineer', initials: 'MB' },
  { id: 'tm_11', name: 'Yathin Kumar', roleFr: 'Responsable Achats', roleEn: 'Head of Procurement', initials: 'YK' },
  { id: 'tm_12', name: 'Abdullah Zakria', roleFr: 'Ingénieur EDS', roleEn: 'EDS Engineer', initials: 'AZ' },
  { id: 'tm_13', name: 'Michael Zakaria', roleFr: 'Responsable Partenariats', roleEn: 'Head of Partnerships', initials: 'MZ' },
  { id: 'tm_14', name: 'Nilesh Khankhoje', roleFr: 'Responsable Partenariats Senior', roleEn: 'Senior Partnerships Manager', initials: 'NK' },
  { id: 'tm_15', name: 'Kathiravan Kasinathan', roleFr: 'Ingénieur CAE Senior', roleEn: 'Senior CAE Engineer', initials: 'KK' }
];

export const initialVehicleSpecs: VehicleSpec[] = [
  { featureFr: 'Capacité passagers', featureEn: 'Passenger Capacity', valueFr: '28 assis + 12 debout (nominal), jusqu\'à 40 passagers selon configuration', valueEn: '28 seated + 12 standing (nominal), up to 40 passengers depending on layout' },
  { featureFr: 'Poids en charge', featureEn: 'Loaded Weight', valueFr: '10 000 kg (passagers assis)', valueEn: '10,000 kg (seated passengers)' },
  { featureFr: 'Vitesse maximale', featureEn: 'Maximum Speed', valueFr: 'jusqu\'à 100 km/h', valueEn: 'up to 100 km/h' },
  { featureFr: 'Vitesse max en courbe', featureEn: 'Curve Speed Limit', valueFr: 'R20m = 16 km/h / R50 = 26 km/h / R100 = 36 km/h', valueEn: 'R20m = 16 km/h / R50 = 26 km/h / R100 = 36 km/h' },
  { featureFr: 'Accélération / Décélération', featureEn: 'Acceleration / Deceleration', valueFr: '1,2 m/s² typique', valueEn: '1.2 m/s² typical' },
  { featureFr: 'Décélération d\'urgence', featureEn: 'Emergency Deceleration', valueFr: '3 m/s² max', valueEn: '3 m/s² max' },
  { featureFr: 'Climatisation', featureEn: 'Air Conditioning', valueFr: 'Système HVAC complet embarqué', valueEn: 'Full on-board integrated HVAC system' },
  { featureFr: 'Mode de propulsion', featureEn: 'Propulsion System', valueFr: 'Moteurs à induction linéaire et rotatifs', valueEn: 'Linear induction and rotary electric motors' },
  { featureFr: 'Transfert d\'énergie', featureEn: 'Energy Transfer', valueFr: 'Captage continu de courant continu (DC)', valueEn: 'Continuous direct current (DC) collection' },
  { featureFr: 'Guidage', featureEn: 'Guidance Mechanism', valueFr: 'Rails captifs avec roues d\'aiguillage embarquées', valueEn: 'Captive rails with on-board switching wheels' },
  { featureFr: 'Évacuation d\'urgence', featureEn: 'Emergency Evacuation', valueFr: 'Portes de secours bilatérales des deux côtés', valueEn: 'Bilateral emergency doors on both sides' },
  { featureFr: 'Ouverture des portes', featureEn: 'Door Clear Opening', valueFr: '900 mm large x 1 950 mm haut', valueEn: '900 mm width x 1,950 mm height' },
  { featureFr: 'Dimensions (version WGS)', featureEn: 'Dimensions (WGS version)', valueFr: '11,5 m longueur, 2,6 m largeur, 2,9 m hauteur', valueEn: '11.5 m length, 2.6 m width, 2.9 m height' }
];

export const initialRoadmap: RoadmapMilestone[] = [
  {
    id: 'rm_2020',
    year: '2020',
    dateStrFr: 'Année 2020',
    dateStrEn: 'Year 2020',
    titleFr: 'Lancement du Projet RAILBUS',
    titleEn: 'RAILBUS Inception & Vehicle Concept',
    descriptionFr: 'Présentation du premier concept de véhicule et brevet préliminaire de propulsion solaire sur voie aérienne.',
    descriptionEn: 'Introduction of the pioneer vehicle concept and patent filing for elevated solar transit guideways.',
    status: 'completed'
  },
  {
    id: 'rm_2024',
    year: '2024',
    dateStrFr: 'Année 2024',
    dateStrEn: 'Year 2024',
    titleFr: 'Constitution & Premiers Accords',
    titleEn: 'Formal Incorporation & Strategic Agreements',
    descriptionFr: 'Constitution formelle de la société RAILBUS Inc. dans le Delaware et signature des premiers partenariats industriels.',
    descriptionEn: 'Formal incorporation of RAILBUS Inc. in Delaware and signature of pioneer industrial alliances.',
    status: 'completed'
  },
  {
    id: 'rm_2025',
    year: '2025',
    dateStrFr: 'Année 2025',
    dateStrEn: 'Year 2025',
    titleFr: 'Ouverture aux Souscriptions Publiques',
    titleEn: 'Public Share Reservation & Portal Launch',
    descriptionFr: 'Ouverture officielle de la réservation d’actions au public et déploiement de la plateforme actionnaires.',
    descriptionEn: 'Official opening of share subscription to private members and shareholder portal deployment.',
    status: 'completed'
  },
  {
    id: 'rm_nov2025',
    year: '2025',
    dateStrFr: 'Novembre 2025',
    dateStrEn: 'November 2025',
    titleFr: 'Vidéo de Démonstration Officielle',
    titleEn: 'Official Vehicle Demonstration Video',
    descriptionFr: 'Diffusion mondiale de la vidéo de démonstration dynamique du véhicule RAILBUS en environnement grandeur réelle.',
    descriptionEn: 'Worldwide release of the dynamic full-scale demonstration video showcasing vehicle capabilities.',
    status: 'current'
  },
  {
    id: 'rm_sep2026',
    year: '2026',
    dateStrFr: 'Septembre 2026',
    dateStrEn: 'September 2026',
    titleFr: 'Lancement du Development Hub (~50 000 m²)',
    titleEn: 'Launch of ~50,000 m² Development Hub',
    descriptionFr: 'Inauguration du hub d’innovation et centre de tests technologiques à Dubai Silicon Oasis.',
    descriptionEn: 'Inauguration of the comprehensive innovation center and test track facility in Dubai Silicon Oasis.',
    status: 'upcoming'
  },
  {
    id: 'rm_nov2026',
    year: '2026',
    dateStrFr: 'Novembre 2026',
    dateStrEn: 'November 2026',
    titleFr: 'Partenariat Stratégique Majeur',
    titleEn: 'Major Strategic Partnership Signing',
    descriptionFr: 'Signature d’un protocole d’accord stratégique pour l’intégration de corridors pilotes urbains.',
    descriptionEn: 'Execution of key institutional partnership agreements for commercial pilot corridor deployment.',
    status: 'upcoming'
  },
  {
    id: 'rm_dec2027',
    year: '2027',
    dateStrFr: 'Décembre 2027 (prévisionnel)',
    dateStrEn: 'December 2027 (forecasted)',
    titleFr: 'Mise en Service Pilote Pré-Commerciale',
    titleEn: 'Pre-Commercial Pilot Service Commissioning',
    descriptionFr: 'Lancement de la première ligne pilote en conditions réelles d’exploitation avec passagers.',
    descriptionEn: 'Revenue-demonstration passenger pilot operations on initial certified route section.',
    status: 'upcoming'
  },
  {
    id: 'rm_2028',
    year: '2027-2028',
    dateStrFr: '2027 - 2028 (prévisionnel)',
    dateStrEn: '2027 - 2028 (forecasted)',
    titleFr: 'Déploiement Commercial International',
    titleEn: 'Full Commercial Deployment',
    descriptionFr: 'Extension du réseau dans les premières métropoles partenaires à l’échelle internationale.',
    descriptionEn: 'Full network expansion across initial global partner metropolitan authorities.',
    status: 'upcoming'
  }
];

export const initialContactInfo: ContactInfo = {
  supportEmail: 'support@railbus.com',
  generalEmail: 'members@railbus.com',
  investEmail: 'invest@railbus.com',
  hqAddress: 'D102 Dubai Silicon Oasis, Émirats Arabes Unis',
  hqCity: 'Dubaï',
  hqPhone: '+971 4 338 8962',
  website: 'https://railbus.com',
  africaContact: {
    name: 'M. Bakwa Kamara',
    roleFr: 'Responsable Investissement (Afrique)',
    roleEn: 'Head of Investment (Africa)',
    email: 'bakwa.kamara@railbus.com',
    phone: '+221 77 123 45 67',
    region: 'Afrique'
  }
};

export const initialSubmissions: FormSubmission[] = [
  {
    id: 'sub_001',
    date: '14 Sep 2026 14:22',
    type: 'founding_partner',
    formName: 'Devenir Partenaire Fondateur',
    status: 'New',
    data: {
      fullName: 'Oumar Diop',
      country: 'Sénégal',
      city: 'Dakar',
      email: 'oumar.diop@invest-sahel.com',
      phone: '+221 78 450 11 22',
      investmentTier: '100,000 USD'
    }
  },
  {
    id: 'sub_002',
    date: '12 Sep 2026 09:15',
    type: 'support_ticket',
    formName: 'Contact & Support',
    status: 'Processed',
    data: {
      fullName: 'Marie-Claire Voisin',
      email: 'mc.voisin@finance-paris.fr',
      subject: 'Certificat Delaware électronique',
      message: 'Bonjour, je souhaite obtenir une copie signée scellée de mon certificat pour ma fiducie familiale.'
    }
  },
  {
    id: 'sub_003',
    date: '10 Sep 2026 18:40',
    type: 'transaction_request',
    formName: 'Demande de Transaction',
    status: 'New',
    data: {
      operationType: 'Achat d\'actions',
      sharesCount: '2000',
      currency: 'USD',
      notes: 'Règlement par virement bancaire SWIFT.'
    }
  }
];

export const initialAdminAccount: AdminAccount = {
  email: 'antcoder.dev@gmail.com',
  passwordHash: '', // Uninitialized on first visit; created by admin
  isInitialized: false,
  lastLogin: undefined
};

// Clean Production State (No mock accounts)
export const cleanUserProfile: UserProfile = {
  id: 'usr_real_001',
  name: 'Membre Actionnaire',
  firstName: 'Membre',
  lastName: 'Actionnaire',
  email: 'membre.officiel@railbus.com',
  initials: 'MO',
  status: 'Active',
  memberId: 'RB-00001',
  joinedDate: '15 Septembre 2026'
};

export const cleanSharesData: SharesData = {
  totalShares: 0,
  sharePriceUSD: 1.25,
  breakdown: {
    commonShares: 0,
    preferredShares: 0,
    founderShares: 0
  },
  certificates: []
};

export const cleanPointsSettings: PointsSettings = {
  totalRewardPoints: 0,
  pointsPerShare: 5000,
  minRedemptionPoints: 250000,
  referralBonusPoints: 5000,
  referralBonusReferrer: 5000,
  welcomeBonusPoints: 0,
  referralCode: 'RAILBUS-OFFICIAL',
  referralCount: 0,
  successfulReferralsCount: 0,
  pointsEarnedFromReferrals: 0,
  currencyRates: {
    USD: 1.25,
    EUR: 1.15,
    FCFA: 750
  }
};

export const cleanTransactions: Transaction[] = [];

// Archived Mock Accounts preserved in the Admin Dossier
export const initialArchivedDemoAccounts = [
  {
    id: 'demo_usr_01',
    name: 'Alexandre Martin',
    email: 'alexandre.martin@example.com',
    memberId: 'RB-88421',
    shares: 5000,
    points: 35000,
    role: 'Actionnaire Fondateur / Common Stock',
    joinedDate: '15 Janvier 2024',
    status: 'Archived in Admin Folder' as const,
    avatarInitials: 'AM'
  },
  {
    id: 'demo_usr_02',
    name: 'Sarah Mansour',
    email: 'sarah.mansour@invest-partners.ae',
    memberId: 'RB-91042',
    shares: 12500,
    points: 80000,
    role: 'Investisseur Privilégié / Preferred Stock',
    joinedDate: '02 Mars 2025',
    status: 'Archived in Admin Folder' as const,
    avatarInitials: 'SM'
  },
  {
    id: 'demo_usr_03',
    name: 'Jean-Paul Kamga',
    email: 'jp.kamga@ecotransit-africa.org',
    memberId: 'RB-73108',
    shares: 2500,
    points: 15000,
    role: 'Membre Partenaire / Afrique',
    joinedDate: '18 Mai 2025',
    status: 'Archived in Admin Folder' as const,
    avatarInitials: 'JK'
  },
  {
    id: 'demo_usr_04',
    name: 'Fonds Horizon Solar Mobility',
    email: 'contact@horizon-mobility-fund.lu',
    memberId: 'RB-00412',
    shares: 50000,
    points: 350000,
    role: 'Actionnaire Institutionnel',
    joinedDate: '10 Novembre 2024',
    status: 'Archived in Admin Folder' as const,
    avatarInitials: 'HS'
  }
];

export const initialArchivedDemoTransactions: Transaction[] = [
  {
    id: 'demo_tx_01',
    reference: 'TX-2026-00918',
    type: 'Share Purchase',
    date: '14 Sep 2026 14:32',
    sharesAmount: 1000,
    currencyAmount: 1250,
    currency: 'USD',
    status: 'Approved',
    note: 'Souscription officielle d\'actions ordinaires Class A',
    isSimulated: true
  },
  {
    id: 'demo_tx_02',
    reference: 'TX-2026-00845',
    type: 'Reward Points Conversion',
    date: '02 Sep 2026 11:20',
    sharesAmount: 2,
    pointsAmount: 10000,
    status: 'Approved',
    note: 'Conversion de points de fidélité en actions',
    isSimulated: true
  },
  {
    id: 'demo_tx_03',
    reference: 'TX-2026-00712',
    type: 'Dividend / Bonus',
    date: '15 Août 2026 09:00',
    currencyAmount: 180,
    currency: 'USD',
    status: 'Approved',
    note: 'Distribution trimestrielle de dividendes',
    isSimulated: true
  }
];

