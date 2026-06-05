/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  userId: string;
  email: string;
  phone: string;
  age: number;
  subscriptionStatus: 'free' | 'pro' | 'elite';
  subscriptionExpires: string; // ISO timestamp
  parentContact?: string;
  paymentStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TraceDataNode {
  node: string;
  status: 'Secure' | 'Found' | 'EXPOSED' | 'Fragmented' | 'Compliant';
  meta: string;
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
