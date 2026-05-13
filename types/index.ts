export interface MetaData {
  clientName: string;
  clientEmail: string;
  deployId: string;
}

export interface TrustAsset {
  id: string;
  description: string;
  costBasis: number;
  coa: string;
  dateAcquired: string;
  noteHolder?: string;
}

export interface DemandNote {
  id: string;
  amount: number;
  date: string;
  holder: string;
}

export interface Trust {
  name: string;
  ein: string;
  situs: string;
  established: string;
  renewalDate: string;
  renewalPeriod: string;
  assets: TrustAsset[];
  demandNotes: DemandNote[];
  draws: any[];
  expenses: any[];
  income: any[];
  beneficiaries: any[];
  minutes: any[];
}

export interface Trustee {
  role: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  appointed: string;
}

export interface Governance {
  protector: {
    name: string;
    phone: string;
    email: string;
    appointed: string;
  };
  trustees: Trustee[];
  successors: any[];
  settlor: {
    name: string;
    phone: string;
    email: string;
  };
  triggerStatus: string;
  triggerNotes: string;
}

export interface PMA {
  name: string;
  ein: string;
  trustee: string;
  established: string;
  type: string;
  situs: string;
  mission: string;
  purpose: string;
  articles: string;
  bylaws: string;
  annualMeetingDate: string;
  lastAnnualMeeting: string;
  donations: any[];
  expenses: any[];
  members: any[];
  income: any[];
  resolutions: any[];
}

export interface AppState {
  meta: MetaData;
  trust: Trust;
  governance: Governance;
  portfolio: any;
  pma: PMA;
  llc: any;
  insurance: any;
  annuities: any;
  banking: any;
  documents: any;
  contacts: any[];
  calendar: any[];
  distributions: any[];
  netWorthHistory: any[];
  succession: any;
  taxData: { year: string };
  settings: any;
  auditLog: any[];
  aiHistory: any[];
  personalTax: any;
  clientProfile: any;
  taxSavings: any;
  debt: any;
  retirement: any;
  realEstate: any;
  cashFlow: any;
  billPay: any;
  compliance: any;
  clientCalls: any[];
  opsManualGenerated: any;
  financialProfile: any;
}
