export interface UserProfile {
  userId: string;
  email: string;
  phone: string;
  age: number;
  subscriptionStatus: 'free' | 'pro' | 'elite';
  subscriptionExpires: string;
  parentContact?: string;
  paymentStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TraceDataNode {
  node: string;
  status: 'Secure' | 'Found' | 'EXPOSED' | 'Fragmented' | 'Compliant';
  meta: string;
  duration?: number;
  category?: 'Phishing' | 'Data Leak' | 'Insecure Port' | 'Metadata Trace' | 'Compliant Node';
}

export interface AuditReport {
  reportId: string;
  userId: string;
  target: string;
  type: 'email' | 'phone';
  securityScore: number;
  dataStream: TraceDataNode[];
  createdAt: string;
}

export interface SupportQuery {
  queryId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface RefundRecord {
  refundId: string;
  userId: string;
  email: string;
  reason: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsStats {
  totalUsers: number;
  totalRefundsApproved: number;
  refundPercentage: number;
}