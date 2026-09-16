export type Language = 'fr' | 'en';

export type ThemeMode = 'light' | 'dark' | 'oled';

export type Currency = 'USD' | 'EUR' | 'FCFA';

export type NavTab = 'dashboard' | 'shares' | 'transactions' | 'notifications' | 'settings' | 'about';

export type UserRole = 'admin' | 'member';

export interface UserProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  avatarUrl?: string;
  initials: string;
  status: 'Active' | 'Pending' | 'Suspended';
  memberId: string;
  joinedDate: string;
  role?: UserRole;
  isFirstAdmin?: boolean;
  passwordHash?: string;
  isVerified?: boolean;
  memberSince?: string;
}

export interface SharesData {
  totalShares: number;
  sharePriceUSD: number;
  breakdown: {
    commonShares: number;
    preferredShares: number;
    founderShares: number;
  };
  certificates: ShareCertificate[];
}

export interface ShareCertificate {
  id: string;
  certificateNumber: string;
  shareholderName: string;
  sharesCount: number;
  sharesType: string;
  issueDate: string;
  jurisdiction: string;
  nominalValue: string;
  signature: string;
}

export interface PointsSettings {
  totalRewardPoints: number;
  pointsPerShare: number;
  minRedemptionPoints: number;
  referralBonusPoints: number;
  referralBonusReferrer?: number;
  welcomeBonusPoints: number;
  referralCode: string;
  referralCount?: number;
  successfulReferralsCount: number;
  pointsEarnedFromReferrals?: number;
  currencyRates: {
    USD: number;
    EUR: number;
    FCFA: number;
  };
}

export type TransactionStatus = 'Approved' | 'Pending' | 'Rejected';

export interface Transaction {
  id: string;
  reference: string;
  type: 'Deposit' | 'Withdrawal' | 'Share Purchase' | 'Reward Points Conversion' | 'Share Transfer' | 'Dividend / Bonus';
  date: string;
  sharesAmount?: number;
  pointsAmount?: number;
  currencyAmount?: number;
  currency?: Currency;
  status: TransactionStatus;
  note?: string;
  isSimulated?: boolean;
}

export interface DemoAccountItem {
  id: string;
  name: string;
  email: string;
  memberId: string;
  shares: number;
  points: number;
  role: string;
  joinedDate: string;
  status: 'Archived in Admin Folder' | 'Active on Platform';
  avatarInitials: string;
}

export interface LiveProofEvent {
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'Points Conversion' | 'Share Transfer';
  user: string;
  amount: string;
  detail: string;
  timestamp: string;
  status: 'Approved' | 'Executed';
}

export interface NotificationItem {
  id: string;
  titleFr: string;
  titleEn: string;
  category: 'News' | 'Announcement' | 'Shares' | 'Event';
  date: string;
  isRead: boolean;
  excerptFr: string;
  excerptEn: string;
  contentFr: string;
  contentEn: string;
  badge?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  roleFr: string;
  roleEn: string;
  bioFr?: string;
  bioEn?: string;
  photoUrl?: string;
  initials: string;
}

export interface VehicleSpec {
  featureFr: string;
  featureEn: string;
  valueFr: string;
  valueEn: string;
}

export interface RoadmapMilestone {
  id: string;
  year: string;
  dateStrFr: string;
  dateStrEn: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface ContactInfo {
  supportEmail: string;
  generalEmail: string;
  investEmail: string;
  hqAddress: string;
  hqCity: string;
  hqPhone: string;
  website: string;
  africaContact: {
    name: string;
    roleFr: string;
    roleEn: string;
    email: string;
    phone: string;
    region: string;
  };
}

export type SubmissionType = 'founding_partner' | 'support_ticket' | 'transaction_request';

export type SubmissionStatus = 'New' | 'Processed' | 'Archived';

export interface FormSubmission {
  id: string;
  date: string;
  type: SubmissionType;
  formName: string;
  status: SubmissionStatus;
  data: Record<string, any>;
}

export interface AdminAccount {
  email: string;
  passwordHash: string;
  isInitialized: boolean;
  lastLogin?: string;
}
