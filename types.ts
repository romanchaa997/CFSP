
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ScanResult {
  id: string;
  url: string;
  timestamp: string;
  riskScore: number;
  riskLevel: RiskLevel;
  features: {
    domainAge: number; // in days
    sslValid: boolean;
    serverLocation: string;
    licenseFound: boolean;
    regulatoryBlacklisted: boolean;
    paymentMethods: string[];
    withdrawalDelayAvg: number;
  };
  aiAssessment?: string;
}

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  created: string;
  lastUsed: string;
}

export interface Statistics {
  totalScanned: number;
  fraudDetected: number;
  avgAccuracy: number;
  revenueMRR: number;
  activeEnterpriseClients: number;
}

export type AppView = 'DASHBOARD' | 'SCANNER' | 'HISTORY' | 'COMPLIANCE' | 'API_CONFIG' | 'BILLING';
export type Theme = 'dark' | 'light';
