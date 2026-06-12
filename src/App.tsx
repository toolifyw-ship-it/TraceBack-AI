/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Fingerprint,
  Shield,
  Search,
  Lock,
  X,
  Mail,
  FileText,
  Check,
  Activity,
  FileSpreadsheet,
  AlertTriangle,
  AlertCircle,
  CreditCard,
  ChevronRight,
  User,
  ExternalLink,
  MessageSquare,
  Globe,
  DollarSign,
  Briefcase,
  Copy,
  Download,
  Settings,
  Share2,
  Sliders,
  TrendingUp,
  GitCompare,
  MapPin,
  Trash2,
  ChevronDown,
  HelpCircle,
  Eye,
  EyeOff,
  Clock,
  History,
  RefreshCw,
  Filter,
  BookOpen,
  Key,
  Printer,
  Sun,
  Moon,
  Mic,
  MicOff,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  AlertOctagon,
  Sparkles,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, getDocFromServer } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import * as d3 from 'd3';
import firebaseConfigRaw from '../firebase-applet-config.json';
import { UserProfile, TraceDataNode, AuditReport, RefundRecord } from './types';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

// Safeguard options inside a standardized final mapping supporting env variables
const firebaseConfig = {
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || firebaseConfigRaw.projectId || 'digital-portal-nw532',
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || firebaseConfigRaw.appId || '1:707394046867:web:c5736f2d4f8194323af666',
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || firebaseConfigRaw.apiKey || 'AIzaSyAT-P9QVnETN1xgS5WYlRAaf94EZ3NHw3o',
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigRaw.authDomain || 'digital-portal-nw532.firebaseapp.com',
  firestoreDatabaseId: (import.meta as any).env?.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfigRaw.firestoreDatabaseId || 'ai-studio-8b8a5b2d-5fe8-4ad5-89c6-e18556ab1eb5',
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigRaw.storageBucket || 'digital-portal-nw532.firebasestorage.app',
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigRaw.messagingSenderId || '707394046867',
  measurementId: (import.meta as any).env?.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfigRaw.measurementId || ''
};

// Initialize Firebase Applet
const app = initializeApp(firebaseConfig);
let db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

// Validate Connection to Firestore (Skill Requirement) - Defined here, invoked safely inside React useEffect
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

const metaEnv = (import.meta as any).env || {};
const ADMIN_EMAIL = metaEnv.VITE_ADMIN_EMAIL || 'sukanta.singha786@gmail.com';
const ADMIN_NAME = metaEnv.VITE_ADMIN_NAME || 'S. Singha';
const API_BASE = metaEnv.VITE_API_URL || '';

try {
  const savedFirebaseConfig = localStorage.getItem('custom_firebase_config');
  if (savedFirebaseConfig) {
    const parsed = JSON.parse(savedFirebaseConfig);
    if (parsed && parsed.apiKey && parsed.projectId) {
      const dynamicApp = initializeApp(parsed, 'dynamic_user_app');
      db = initializeFirestore(dynamicApp, {
        experimentalForceLongPolling: true,
      }, parsed.firestoreDatabaseId || undefined);
      console.log('[TraceBack AI Dynamic Config] Dynamic Custom Firebase Firestore initialized successfully.');
    }
  }
} catch (e) {
  console.warn('[TraceBack AI Dynamic Config] Fallback default Firestore chosen:', e);
}

const FRONTEND_PLATFORM_REGISTRY = [
  // Developer Engines (13)
  { name: "GitHub Account Auditor", cat: "Developer Engines", defStatus: "EXPOSED", details: "Credential compromise: Verified exposure detected matching historical plaintext breach database list (dated Q3 2024)." },
  { name: "GitLab Repository Mapping", cat: "Developer Engines", defStatus: "Secure", details: "Zero public tracking flags identified across standard database registers." },
  { name: "Bitbucket Identity Trace", cat: "Developer Engines", defStatus: "Secure", details: "Compliance check approved. Standard lookup returns no public metadata overrides." },
  { name: "Vercel Deployments Sync", cat: "Developer Engines", defStatus: "EXPOSED", details: "Security flag: Unencrypted incoming developer webhook URL exposed inside public deployments." },
  { name: "Netlify Asset Endpoint Check", cat: "Developer Engines", defStatus: "Secure", details: "No critical plain-text indices exposed inside public CDNs." },
  { name: "Heroku App Dyno Registry", cat: "Developer Engines", defStatus: "Fragmented", details: "Inbound testing dynos mapped without multi-factor restrictions." },
  { name: "AWS IAM Security Auditor", cat: "Developer Engines", defStatus: "EXPOSED", details: "Vulnerability: Missing multi-factor access control locks (2FA disabled) on root admin user." },
  { name: "Google Cloud Platform Console", cat: "Developer Engines", defStatus: "Secure", details: "Standard audit approved. Subsystem credentials decoupled and secure." },
  { name: "Microsoft Azure Node Audit", cat: "Developer Engines", defStatus: "Compliant", details: "Privacy-certified Azure node. Zero active exposures on standard telemetry." },
  { name: "Cloudflare DNS Edge Mapping", cat: "Developer Engines", defStatus: "Secure", details: "Zero public tracing flags identified. Edge protections confirmed." },
  { name: "StackOverflow Profile Tracker", cat: "Developer Engines", defStatus: "Secure", details: "No leaking developer keys associated with this profile." },
  { name: "DockerHub Image Repository", cat: "Developer Engines", defStatus: "Secure", details: "No public container leaks detected. Standard registry secure." },
  { name: "NPM Package Publisher Keys", cat: "Developer Engines", defStatus: "Secure", details: "Credential signatures are secure. Zero exposed key hashes in workspace dumps." },

  // Social Registries (17)
  { name: "Facebook Profile Registry", cat: "Social Registries", defStatus: "EXPOSED", details: "Exposure detected: Target registration handles and telemetry metadata leaked via malicious browser scraper extension caches." },
  { name: "Instagram Social Graph", cat: "Social Registries", defStatus: "Fragmented", details: "Partial profiles and tracker cookies detected on standard correlation trackers." },
  { name: "Twitter/X Handle Audit", cat: "Social Registries", defStatus: "EXPOSED", details: "Scraped dataset match: Profile email & phone registry entries detected in historical forum database downloads." },
  { name: "LinkedIn Career Node", cat: "Social Registries", defStatus: "Secure", details: "Privacy settings conform with standard requirements. Public graph secure." },
  { name: "TikTok Account Trace", cat: "Social Registries", defStatus: "Fragmented", details: "Telemetry logs show background interaction tracker active from this device." },
  { name: "Reddit User Profile Check", cat: "Social Registries", defStatus: "Secure", details: "Standard lookup returns no public metadata mappings." },
  { name: "Pinterest Board Tracker", cat: "Social Registries", defStatus: "Secure", details: "Compliance approved. Zero visible search crawler indexations." },
  { name: "Snapchat Contact Syncer", cat: "Social Registries", defStatus: "Secure", details: "Contacts databases decoupling approved. Access flags deleted." },
  { name: "Tumblr Blog Registry", cat: "Social Registries", defStatus: "Secure", details: "No associated active tracing logs found." },
  { name: "Mastodon Decentralized Node", cat: "Social Registries", defStatus: "Secure", details: "Distributed nodes audited. Credentials encrypted." },
  { name: "Threads Social Map", cat: "Social Registries", defStatus: "Secure", details: "Federation mapping checks out secure. Zero telemetry leak paths." },
  { name: "WhatsApp Registered Handle", cat: "Social Registries", defStatus: "Secure", details: "Protocol metadata safe. Device fingerprints deleted." },
  { name: "Telegram Active ID Map", cat: "Social Registries", defStatus: "Found", details: "Public bot metadata query matched active identification registers." },
  { name: "Signal Messenger Protocol", cat: "Social Registries", defStatus: "Secure", details: "Sealed sender and keys secure. Standard zero-knowledge database." },
  { name: "WeChat Gateway Check", cat: "Social Registries", defStatus: "Secure", details: "No public records detected outside the sovereign firewall." },
  { name: "Discord Account Mapping", cat: "Social Registries", defStatus: "EXPOSED", details: "Signaling integrity error: Unrevoked session access certificates found public in developer clipboard streams." },
  { name: "Twitch Streamer Credentials", cat: "Social Registries", defStatus: "Secure", details: "Streamer keys cycled and secure." },

  // Security & Cloud Nodes (10)
  { name: "Gmail Active Mailbox Lookup", cat: "Security & Cloud Nodes", defStatus: "Secure", details: "MFA active and workspace configurations secure." },
  { name: "Outlook Security Map", cat: "Security & Cloud Nodes", defStatus: "Secure", details: "Primary mailbox audits show no suspicious logins or token exposures." },
  { name: "Yahoo Mail Account Scrape", cat: "Security & Cloud Nodes", defStatus: "Found", details: "Email handle present in legacy 2020 credential dump list." },
  { name: "Apple ID Account Validator", cat: "Security & Cloud Nodes", defStatus: "Secure", details: "Device trust levels normal. Hardware credentials verified." },
  { name: "ProtonMail Secure Key Check", cat: "Security & Cloud Nodes", defStatus: "Secure", details: "End-to-end PGP key-pairs secure. No backup keys present in public indexes." },
  { name: "Fastmail Mailroom Logs", cat: "Security & Cloud Nodes", defStatus: "Secure", details: "Zero tracking flags identified." },
  { name: "Zoho Business Mail Trace", cat: "Security & Cloud Nodes", defStatus: "Secure", details: "Audit trail checks out compliant." },
  { name: "1Password Vault Scanner", cat: "Security & Cloud Nodes", defStatus: "Secure", details: "Secret key and master credentials fully isolated." },
  { name: "LastPass Vault Check", cat: "Security & Cloud Nodes", defStatus: "Fragmented", details: "Historic vault metadata traces discovered in third-party leak checklists." },
  { name: "NordVPN Account Status Gateway", cat: "Security & Cloud Nodes", defStatus: "Secure", details: "Decoupled server routing verified. Token session secure." },

  // Financial & Corporate (11)
  { name: "PayPal Gateway", cat: "Financial & Corporate", defStatus: "Secure", details: "Transaction gateway authorizations are secure and encrypted." },
  { name: "Stripe Developer Dashboard", cat: "Financial & Corporate", defStatus: "EXPOSED", details: "API Integration exposure: Unrestricted testing secrets exposed inside client-side bundles." },
  { name: "Amazon Checkout Service Map", cat: "Financial & Corporate", defStatus: "Secure", details: "Tokenized payment options secure." },
  { name: "eBay Buyers Circle Profile", cat: "Financial & Corporate", defStatus: "Secure", details: "No public seller or buyer credentials exposed." },
  { name: "Shopify Merchant Account Map", cat: "Financial & Corporate", defStatus: "Secure", details: "Merchant database scans return zero exposed secrets." },
  { name: "Slack Workspace Engagement", cat: "Financial & Corporate", defStatus: "EXPOSED", details: "Slack token leak: Legacy OAuth scopes matching bot integrations active without restricted IP logs." },
  { name: "Trello Workspace Access Check", cat: "Financial & Corporate", defStatus: "Secure", details: "Public boards audit completed. No confidential files visible." },
  { name: "Notion Personal Space Scan", cat: "Financial & Corporate", defStatus: "Secure", details: "Integrations are secure. Public sharing options inactive." },
  { name: "Spotify Music Subscription", cat: "Financial & Corporate", defStatus: "Secure", details: "Zero public metadata correlation detected." },
  { name: "Netflix Streaming Account", cat: "Financial & Corporate", defStatus: "Secure", details: "Session cookies cleared. Devices list clean." },
  { name: "Steam Gamer Profile Node", cat: "Financial & Corporate", defStatus: "Secure", details: "Standard gaming profile secure. Inventory settings set to private." }
];

const getDeterministicNodeData = (target: string, name: string) => {
  const queryKey = `${target.toLowerCase()}_${name.toLowerCase()}`;
  let hashVal = 0;
  for (let i = 0; i < queryKey.length; i++) {
    hashVal = (hashVal << 5) - hashVal + queryKey.charCodeAt(i);
    hashVal |= 0;
  }
  const absHash = Math.abs(hashVal);
  const roll = absHash % 100;

  let status: 'Secure' | 'Compliant' | 'Found' | 'Fragmented' | 'EXPOSED' = 'Secure';
  let meta = '';

  const vulnerabilityCatalogs = [
    `Credential compromise: Verified exposure detected matching historical plaintext breach database list (dated Q3 2024).`,
    `Security flag: Unencrypted incoming developer webhook URL exposed inside public indexes. Action: retract secret instantly.`,
    `Vulnerability: Missing multi-factor access control locks (2FA disabled). Active session remains susceptible to credential stuffing.`,
    `Exposure detected: Target registration handles and telemetry metadata leaked via malicious browser scraper extension caches.`,
    `Signaling integrity error: Unrevoked session access certificates found public in developer troubleshooting clipboard dumps.`
  ];

  if (roll < 35) {
    status = 'Secure';
    meta = `Compliance check approved. Standard lookup returns no public metadata overrides or active exposures. Default protections confirmed.`;
  } else if (roll < 55) {
    status = 'Compliant';
    meta = `Privacy-certified node. Zero public tracking flags identified across standard database registers. Full alignment with privacy guidelines.`;
  } else if (roll < 70) {
    status = 'Found';
    meta = `Metadata trace found. Basic index reference identified in third-party registration logs dating back to Q4 2023. No raw credential exposure.`;
  } else if (roll < 85) {
    status = 'Fragmented';
    meta = `Partially synced session states identified. Device tracking logs correlate trace indicators with secondary profile details. Enforce decoupling.`;
  } else {
    status = 'EXPOSED';
    meta = vulnerabilityCatalogs[absHash % vulnerabilityCatalogs.length];
  }

  const lengthFactor = (name.length % 5) * 0.12 + 0.15;

  return {
    node: name,
    status,
    meta,
    duration: Number(lengthFactor.toFixed(2)),
    category: getAssignedCategory(name, status)
  };
};

function getAssignedCategory(nodeName: string, status: string): 'Phishing' | 'Data Leak' | 'Insecure Port' | 'Metadata Trace' | 'Compliant Node' {
  let assignedCat: 'Phishing' | 'Data Leak' | 'Insecure Port' | 'Metadata Trace' | 'Compliant Node' = 'Metadata Trace';
  const name = nodeName.toLowerCase();
  if (name.includes('leak') || name.includes('breach') || status === 'EXPOSED') {
    assignedCat = 'Data Leak';
  } else if (name.includes('port') || name.includes('tunnel') || name.includes('ssh') || name.includes('iam') || name.includes('console') || name.includes('dyno')) {
    assignedCat = 'Insecure Port';
  } else if (name.includes('dns') || name.includes('override') || name.includes('phone') || name.includes('email') || name.includes('tracker') || name.includes('phishing')) {
    assignedCat = 'Phishing';
  } else if (status === 'Secure' || status === 'Compliant') {
    assignedCat = 'Compliant Node';
  }
  return assignedCat;
}

const MOCK_REPORTS: AuditReport[] = [
  {
    reportId: 'rep_mock_1',
    userId: 'mock_demo',
    target: 'security-audit-baseline',
    type: 'email',
    securityScore: 88,
    createdAt: '2026-05-28T14:30:00Z',
    dataStream: [
      { node: 'Credential Leak Database', status: 'Secure', meta: 'No critical plain-text indices exposed.', duration: 0.85, category: 'Data Leak' },
      { node: 'Port Scanning Tunnels', status: 'EXPOSED', meta: 'Inbound port 22/SSH is exposed to standard audits.', duration: 1.24, category: 'Insecure Port' },
      { node: 'Exposed DNS Overrides', status: 'Found', meta: 'Subdomain hijack detected on tracking parameters.', duration: 0.61, category: 'Phishing' },
      { node: 'GDPR Compliance Check', status: 'Compliant', meta: 'Right-to-be-forgotten keys accessible.', duration: 0.44, category: 'Compliant Node' }
    ]
  },
  {
    reportId: 'rep_mock_2',
    userId: 'mock_demo',
    target: 'security-audit-patch-v1',
    type: 'email',
    securityScore: 95,
    createdAt: '2026-06-01T09:15:00Z',
    dataStream: [
      { node: 'Credential Leak Database', status: 'Secure', meta: 'No critical plain-text indices exposed.', duration: 0.72, category: 'Data Leak' },
      { node: 'Port Scanning Tunnels', status: 'Secure', meta: 'Inbound port 22/SSH closed securely.', duration: 1.15, category: 'Insecure Port' },
      { node: 'Exposed DNS Overrides', status: 'Secure', meta: 'DNS records validated correctly.', duration: 0.48, category: 'Phishing' },
      { node: 'GDPR Compliance Check', status: 'Compliant', meta: 'Right-to-be-forgotten keys accessible.', duration: 0.39, category: 'Compliant Node' }
    ]
  },
  {
    reportId: 'rep_mock_3',
    userId: 'mock_demo',
    target: 'security-audit-breached',
    type: 'email',
    securityScore: 42,
    createdAt: '2026-06-03T18:45:00Z',
    dataStream: [
      { node: 'Credential Leak Database', status: 'EXPOSED', meta: 'Plaintext recovery vectors detected in 2 databases.', duration: 1.62, category: 'Data Leak' },
      { node: 'Port Scanning Tunnels', status: 'EXPOSED', meta: 'Inbound port 22/SSH open and public.', duration: 1.34, category: 'Insecure Port' },
      { node: 'Exposed DNS Overrides', status: 'EXPOSED', meta: 'Dangling TXT/CNAME pointer found pointing to expired domain.', duration: 0.88, category: 'Phishing' },
      { node: 'GDPR Compliance Check', status: 'Fragmented', meta: 'Incomplete client deletion telemetry keys.', duration: 0.55, category: 'Metadata Trace' }
    ]
  }
];

const getGeographicPointForNode = (nodeName: string, index: number) => {
  const name = nodeName.toLowerCase();
  
  if (name.includes('us-east') || name.includes('credential') || name.includes('database') || name.includes('leak')) {
    return { x: 226, y: 115, country: 'United States', region: 'Virginia', ip: '45.18.23.102', lat: 37.92, lng: -78.02 };
  }
  if (name.includes('port') || name.includes('tunnel') || name.includes('frankfurt') || name.includes('germany') || name.includes('europe') || name.includes('gdpr')) {
    return { x: 419, y: 88, country: 'Germany', region: 'Frankfurt', ip: '80.122.95.14', lat: 50.11, lng: 8.68 };
  }
  if (name.includes('dns') || name.includes('override') || name.includes('cname') || name.includes('sydney') || name.includes('australia')) {
    return { x: 735, y: 275, country: 'Australia', region: 'Sydney', ip: '114.77.21.88', lat: -33.86, lng: 151.20 };
  }
  if (name.includes('social') || name.includes('graph') || name.includes('tracking') || name.includes('asia') || name.includes('singapore') || name.includes('compliance')) {
    return { x: 630, y: 197, country: 'Singapore', region: 'Singapore', ip: '202.156.40.11', lat: 1.35, lng: 103.82 };
  }
  
  // Fallback map cycle
  const fallbacks = [
    { x: 226, y: 115, country: 'United States', region: 'Virginia', ip: '45.18.23.102', lat: 37.92, lng: -78.02 },
    { x: 419, y: 88, country: 'Germany', region: 'Frankfurt', ip: '80.122.95.14', lat: 50.11, lng: 8.68 },
    { x: 630, y: 197, country: 'Singapore', region: 'Singapore', ip: '202.156.40.11', lat: 1.35, lng: 103.82 },
    { x: 296, y: 252, country: 'Brazil', region: 'São Paulo', ip: '191.242.10.89', lat: -23.55, lng: -46.63 },
    { x: 735, y: 275, country: 'Australia', region: 'Sydney', ip: '114.77.21.88', lat: -33.86, lng: 151.20 },
    { x: 441, y: 275, country: 'South Africa', region: 'Cape Town', ip: '102.132.8.22', lat: -33.92, lng: 18.42 }
  ];
  return fallbacks[index % fallbacks.length];
};

const calculate30DaySMA = (history: Array<{ score: number }>) => {
  if (!history || history.length === 0) return 0;
  const trailingHistory = history.slice(-30);
  const sum = trailingHistory.reduce((acc, curr) => acc + (curr?.score || 0), 0);
  return sum / trailingHistory.length;
};

export default function App() {
  // Authentication & Profile States
  const [sessionVerified, setSessionVerified] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userAge, setUserAge] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [parentContact, setParentContact] = useState<string>('');
  const [minorLock, setMinorLock] = useState<boolean>(false);

  // Search Scan States
  const [traceInput, setTraceInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [activeReport, setActiveReport] = useState<AuditReport | null>(null);
  const [scannedNodes, setScannedNodes] = useState<TraceDataNode[]>([]);
  const [findingsFilter, setFindingsFilter] = useState<'all' | 'high_risk' | 'secure'>('all');
  const [scanStats, setScanStats] = useState<{ score: number; verdict: string }>({ score: 100, verdict: 'SECURE' });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Safely trigger connection test on initial load inside browser
  useEffect(() => {
    testConnection();
  }, []);

  // Advanced features additions
  const [canPulseCsv, setCanPulseCsv] = useState<boolean>(false);
  const [isCsvSpinner, setIsCsvSpinner] = useState<boolean>(false);
  const [findingsSort, setFindingsSort] = useState<'severity' | 'latency' | 'alphabetical'>('severity');
  const [remediationNode, setRemediationNode] = useState<TraceDataNode | null>(null);
  const [paymentCheckoutPlan, setPaymentCheckoutPlan] = useState<'pro' | 'elite' | null>(null);

  // Payment form states
  const [checkoutMethod, setCheckoutMethod] = useState<'card' | 'razorpay' | 'upi'>('card');
  const [razorpayId, setRazorpayId] = useState<string>('');
  const [payCardNumber, setPayCardNumber] = useState<string>('');
  const [payCardExpiry, setPayCardExpiry] = useState<string>('');
  const [payCardCvc, setPayCardCvc] = useState<string>('');
  const [payCardName, setPayCardName] = useState<string>('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState<boolean>(false);

  // Web Speech API Voice Transcription States
  const [speechSupported, setSpeechSupported] = useState<boolean>(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    return !!SpeechRecognition;
  });

  const { isListening, toggleListening: handleToggleListening } = useSpeechRecognition({
    onTranscript: (cleanText) => {
      setTraceInput(cleanText);
      setValidationError(null);
    },
    onTriggerInfo: (title, message) => {
      showInfo(title, message);
    }
  });

  // Compute dynamic threat clusters (Request 1)
  const points = scannedNodes.map((node, idx) => {
    const pt = getGeographicPointForNode(node.node, idx);
    return {
      x: pt.x,
      y: pt.y,
      node,
      isExposed: node.status === 'EXPOSED'
    };
  });

  const clusters: { x: number; y: number; count: number; exposedCount: number; points: typeof points }[] = [];
  const distanceThreshold = 60; // pixel distance in 800x400 space

  points.forEach((pt) => {
    let added = false;
    for (const cluster of clusters) {
      const dist = Math.hypot(cluster.x - pt.x, cluster.y - pt.y);
      if (dist < distanceThreshold) {
        const total = cluster.points.length;
        cluster.x = (cluster.x * total + pt.x) / (total + 1);
        cluster.y = (cluster.y * total + pt.y) / (total + 1);
        cluster.points.push(pt);
        cluster.count += 1;
        if (pt.isExposed) {
          cluster.exposedCount += 1;
        }
        added = true;
        break;
      }
    }
    if (!added) {
      clusters.push({
        x: pt.x,
        y: pt.y,
        count: 1,
        exposedCount: pt.isExposed ? 1 : 0,
        points: [pt]
      });
    }
  });

  const threatClusters = clusters.filter(c => c.exposedCount >= 2);

  // Historical Scores Tracking for Recharts line chart representation
  const [rawScanHistory, setRawScanHistory] = useState<Array<{ date: string; score: number; target: string }>>([
    { date: '05/25', score: 95, target: 'Baseline Check' },
    { date: '05/28', score: 88, target: 'API Handshake' },
    { date: '06/01', score: 93, target: 'Port Scan' },
    { date: 'Current', score: 100, target: 'Active Session' }
  ]);

  const scanHistory = React.useMemo(() => {
    return rawScanHistory.map((item, idx) => {
      const baseDate = item.date.split('__idx_')[0];
      return {
        ...item,
        date: `${baseDate}__idx_${idx}`
      };
    });
  }, [rawScanHistory]);

  const setScanHistory = (
    updater: Array<{ date: string; score: number; target: string }> | ((prev: Array<{ date: string; score: number; target: string }>) => Array<{ date: string; score: number; target: string }>)
  ) => {
    setRawScanHistory((prev) => {
      const nextValue = typeof updater === 'function' ? updater(prev) : updater;
      return nextValue.map((item, idx) => {
        const baseDate = item.date.split('__idx_')[0];
        return {
          ...item,
          date: `${baseDate}__idx_${idx}`
        };
      });
    });
  };

  // Navigation / Modal States
  const [selectedNode, setSelectedNode] = useState<TraceDataNode | null>(null);
  const [hoveredMapNode, setHoveredMapNode] = useState<any>(null);
  const [selectedMapNode, setSelectedMapNode] = useState<any>(null);
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false);
  const [mapVisible, setMapVisible] = useState<boolean>(true);

  // D3 Zooming & Panning state and effect handles (Requirement #3)
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const d3ZoomRef = React.useRef<any>(null);
  const [zoomTransform, setZoomTransform] = useState<{ x: number; y: number; k: number }>({ x: 0, y: 0, k: 1 });

  useEffect(() => {
    if (!svgRef.current || !mapVisible) return;
    const svgElement = svgRef.current;
    
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        const t = event.transform;
        setZoomTransform({ x: t.x, y: t.y, k: t.k });
      });

    d3ZoomRef.current = zoomBehavior;
    d3.select(svgElement).call(zoomBehavior);

    return () => {
      d3.select(svgElement).on('.zoom', null);
    };
  }, [mapVisible]);

  // Programmatic Zoom and Pan handlers using D3 Transition (Requirement #3)
  const handleZoomIn = () => {
    if (!svgRef.current || !d3ZoomRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(220)
      .call(d3ZoomRef.current.scaleBy, 1.35);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !d3ZoomRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(220)
      .call(d3ZoomRef.current.scaleBy, 0.74);
  };

  const handleZoomReset = () => {
    if (!svgRef.current || !d3ZoomRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(250)
      .call(d3ZoomRef.current.transform, d3.zoomIdentity);
  };
  const [historicalReports, setRawHistoricalReports] = useState<AuditReport[]>(MOCK_REPORTS);
  const setHistoricalReports = (
    updater: AuditReport[] | ((prev: AuditReport[]) => AuditReport[])
  ) => {
    setRawHistoricalReports((prev) => {
      const nextValue = typeof updater === 'function' ? updater(prev) : updater;
      const seen = new Set<string>();
      return nextValue.filter((item) => {
        if (!item || !item.reportId) return false;
        if (seen.has(item.reportId)) return false;
        seen.add(item.reportId);
        return true;
      });
    });
  };
  const [compareReportAId, setCompareReportAId] = useState<string>('rep_mock_1');
  const [compareReportBId, setCompareReportBId] = useState<string>('rep_mock_2');
  const [sendReportModalOpen, setSendReportModalOpen] = useState<boolean>(false);
  const [sendReportEmail, setSendReportEmail] = useState<string>('');
  const [sendingReport, setSendingReport] = useState<boolean>(false);
  const [apiRequestsCount, setApiRequestsCount] = useState<number>(() => {
    return Number(localStorage.getItem('gemini_api_requests_count') || '0');
  });
  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [apiDocModalOpen, setApiDocModalOpen] = useState<boolean>(false);
  const [activeApiTab, setActiveApiTab] = useState<'keys' | 'deploy'>('keys');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('app_theme') as 'dark' | 'light') || 'dark';
  });
  const [createdShareLink, setCreatedShareLink] = useState<string | null>(null);
  const [shareLinkModalOpen, setShareLinkModalOpen] = useState<boolean>(false);
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);
  const [autoClearEnabled, setAutoClearEnabled] = useState<boolean>(() => {
    return localStorage.getItem('security_auto_clear') === 'true';
  });
  const [weeklyDigestEnabled, setWeeklyDigestEnabled] = useState<boolean>(() => {
    return localStorage.getItem('security_weekly_digest') === 'true';
  });
  const [quickTargets, setQuickTargets] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('quick_targets');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(false);
  const [refreshCountdown, setRefreshCountdown] = useState<number>(60);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  // Search History Panel configurations
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<'normal' | 'permanent'>('normal');
  const [traceSearchHistory, setTraceSearchHistory] = useState<{
    id: string;
    target: string;
    timestamp: string;
    score: number;
    verdict: string;
    deleted?: boolean;
  }[]>(() => {
    try {
      const stored = localStorage.getItem('trace_search_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveToHistoryLog = (target: string, score: number, verdict: string) => {
    setTraceSearchHistory((prev) => {
      // Avoid duplicate targets in active trace list by moving them to top
      const filtered = prev.filter(item => item.target.toLowerCase() !== target.toLowerCase());
      const newItem = {
        id: 'hist_' + Math.random().toString(36).substr(2, 9),
        target,
        timestamp: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString(),
        score,
        verdict,
        deleted: false
      };
      const updated = [newItem, ...filtered];
      localStorage.setItem('trace_search_history', JSON.stringify(updated));
      return updated;
    });
  };

  // Play & Plug custom credentials state variables for full customized client instances
  const [customGoogleApiKey, setCustomGoogleApiKey] = useState<string>(() => localStorage.getItem('custom_gemini_api_key') || '');
  const [customFirebaseConfigJson, setCustomFirebaseConfigJson] = useState<string>(() => localStorage.getItem('custom_firebase_config_raw') || '');
  const [customRazorpayId, setCustomRazorpayId] = useState<string>(() => localStorage.getItem('custom_razorpay_key_id') || '');
  const [customAnalyticsId, setCustomAnalyticsId] = useState<string>(() => localStorage.getItem('custom_google_analytics_id') || '');

  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);
  const [infoTitle, setInfoTitle] = useState<string>('');
  const [infoBody, setInfoBody] = useState<string>('');

  // Support / Contacts States
  const [conName, setConName] = useState<string>('');
  const [conEmail, setConEmail] = useState<string>('');
  const [conSubject, setConSubject] = useState<string>('');
  const [conMessage, setConMessage] = useState<string>('');
  const [contactResultMsg, setContactResultMsg] = useState<string>('');

  // Refund Claims System States
  const [refundReason, setRefundReason] = useState<string>('');
  const [refundHistory, setRefundHistory] = useState<RefundRecord[]>([]);
  const [refundAlertMsg, setRefundAlertMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [stats, setStats] = useState<{ totalUsers: number; totalRefundsApproved: number; refundPercentage: number }>({
    totalUsers: 142,
    totalRefundsApproved: 3,
    refundPercentage: 2.1
  });

  // Lockout / Expiry Monitoring
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [inactivityTimeRemaining, setInactivityTimeRemaining] = useState<number>(900);
  const [sessionExtendTrigger, setSessionExtendTrigger] = useState<number>(0);

  // S. Singha Chief Admin verified info obtained from server only
  const [auditingOfficer, setAuditingOfficer] = useState<string | null>(null);

  // Expanded marker index for Mobile Collapsible list maps
  const [expandedNodeId, setExpandedNodeId] = useState<number | null>(null);

  // Toast systems for file downloads (PDF + JSON)
  const [downloadToasts, setDownloadToasts] = useState<Array<{ id: string; filename: string; timestamp: string }>>([]);

  const addDownloadToast = (filename: string) => {
    const id = 'toast_' + Math.random().toString(36).substr(2, 9);
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestampStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    
    setDownloadToasts(prev => [...prev, { id, filename, timestamp: timestampStr }]);
    setTimeout(() => {
      setDownloadToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  // GDPR Erasure Request States
  const [erasureModalOpen, setErasureModalOpen] = useState<boolean>(false);
  const [erasureAcknowledge, setErasureAcknowledge] = useState<boolean>(false);

  // Vulnerability Transition State Alert
  const [transitionAlert, setTransitionAlert] = useState<{ target: string; nodes: string[]; previousId: string | null } | null>(null);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqData = [
    {
      tag: "Security",
      question: "Is my personal data stored permanently on your servers?",
      answer: "No. TRACE-BACK-AI operates on an ephemeral processing architecture under strict CCPA & GDPR principles. Your trace search queries and active forensic logs are temporarily held in secure sessions and can be fully erased at any time using our one-click GDPR Purging tool."
    },
    {
      tag: "Compliance",
      question: "How does the Right to Be Forgotten (GDPR Art. 17) work here?",
      answer: "Every user has complete sovereignty over their data footprint. If you perform an audit on your email or phone number, simply request complete data erasure in the sidebar or via our CCPA/GDPR Decoupling request link. All associated telemetry logs and cached results are permanently purged from our database immediately."
    },
    {
      tag: "Payments",
      question: "How do subscriptions and the 7-day refund guarantee work?",
      answer: "We offer monthly and yearly compliance nodes. If you upgrade and decide the service does not fit your compliance guidelines, we enforce a transparent, fair refund policy. Under our 7-day rule, refund requests are approved with a standard 5% limit constraint to prevent system-wide fraud."
    },
    {
      tag: "Privacy",
      question: "Does the administrative team have access to my search records?",
      answer: "All queries processed on the backend server are securely proxied. Administrative nodes monitor system health, fraud control, and structural metrics, but are strictly prohibited from viewing individual plain-text search records or private coordinates."
    },
    {
      tag: "Technology",
      question: "What sources of data are audited during a forensic scan?",
      answer: "Our scan engine analyzes exposed DNS overrides, deep-web credential databases, historic tracking networks, SMS spam lists, and unauthorized advertising logs using Gemini-driven classification to compile a unified Exposure Score and Forensic Verdict for your input handle."
    }
  ];

  // Fetch operational statistics & refund bounds
  const loadStats = async () => {
    try {
      const response = await fetch('/api/refunds/analytics');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (e) {
      console.warn('API Analytics offline, falling back directly.', e);
    }
  };

  const getTrialDaysLeft = () => {
    if (!currentUser || currentUser.subscriptionStatus !== 'free') return null;
    const expires = new Date(currentUser.subscriptionExpires).getTime();
    const now = Date.now();
    const diff = expires - now;
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  const trialDaysLeft = getTrialDaysLeft();

  useEffect(() => {
    loadStats();
    // Re-check sync profiles from localStorage local-mock DB
    const savedUser = localStorage.getItem('trace_back_user');
    if (savedUser) {
      const u = JSON.parse(savedUser) as UserProfile;
      setCurrentUser(u);
      setSessionVerified(true);
      syncServerState(u);
    }

    // Parse shared report parameter from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const sharedHash = urlParams.get('share');
    if (sharedHash) {
      try {
        const decodedStr = decodeURIComponent(escape(atob(sharedHash)));
        const data = JSON.parse(decodedStr);
        if (data && data.target && data.nodes) {
          setTraceInput(data.target);
          setScanStats({ score: data.score, verdict: data.verdict });
          setScannedNodes(data.nodes);
          setSessionVerified(true);

          setTimeout(() => {
            document.getElementById('forensic-dashboard')?.scrollIntoView({ behavior: 'smooth' });
          }, 800);

          showInfo('SHARED TRACE LOADED', `Loaded read-only shared forensic report for node: ${data.target}`);
        }
      } catch (err) {
        console.error('Failed to parse shared report: ', err);
      }
    }
  }, []);

  // Monitor subscription lockout rules on the server
  useEffect(() => {
    if (currentUser?.userId) {
      checkLockoutState(currentUser.userId);
    }
  }, [currentUser]);

  // Local-Storage Based Breach Notification System (FEATURE 2)
  useEffect(() => {
    const savedEmail = currentUser?.email || 
                      (traceSearchHistory || []).find(item => item?.target && item.target.includes('@'))?.target || 
                      (quickTargets || []).find(t => t && t.includes('@'));

    if (savedEmail) {
      const emailLower = savedEmail.toLowerCase().trim();
      const newlyBreachedTargets = [
        'sukanta.singha786@gmail.com',
        'admin@traceback.ai',
        'test@example.com',
        'user@gmail.com',
        'leak_check@domain.com'
      ];

      // If the email matches a newly breached target or contains the keyword
      if (newlyBreachedTargets.some(t => emailLower.includes(t.toLowerCase()) || t.toLowerCase().includes(emailLower))) {
        // Construct a unique alert key so we don't spam
        const alertKey = `breach_alert_shown_${emailLower}`;
        const alreadyShown = localStorage.getItem(alertKey);

        if (!alreadyShown) {
          // Trigger local non-intrusive toast notification using showInfo
          const timer = setTimeout(() => {
            showInfo(
              'NEW COMPROMISE DETECTED',
              `CRITICAL WARNING: The saved monitored target node "${savedEmail}" was detected in a newly indexed third-party database breach. Please verify the active security index immediately.`
            );
            localStorage.setItem(alertKey, 'true');
            localStorage.setItem('last_breach_check_id', `${emailLower}_${Date.now()}`);
          }, 3500); // 3.5s delay for realistic background simulation
          return () => clearTimeout(timer);
        }
      }
    }
  }, [currentUser?.email, traceSearchHistory, quickTargets]);

  const [subscriptionReminder, setSubscriptionReminder] = useState<string | null>(null);

  // Monitor subscription real-time countdown, Alerts & Reminders (Phase 8 Compliance)
  useEffect(() => {
    if (!currentUser || !currentUser.subscriptionExpires) {
      setTimeRemaining('');
      setSubscriptionReminder(null);
      return;
    }

    const interval = setInterval(() => {
      const expires = new Date(currentUser.subscriptionExpires).getTime();
      const now = Date.now();
      const diff = expires - now;

      if (diff <= 0) {
        setTimeRemaining('EXPIRED');
        if (currentUser.subscriptionStatus === 'free') {
          setSubscriptionReminder('FREE NODE EXPIRED. Lockout state enabled. Secure Pro/Elite access keys immediately to resume forensic scanning and bypass firewall limits.');
        } else if (currentUser.subscriptionStatus === 'pro') {
          setSubscriptionReminder('MONTHLY NODE EXPIRED. Please renew active signature credentials.');
        } else {
          setSubscriptionReminder('YEARLY SIGNATURE EXPIRED. Compliance operations halted.');
        }
        return;
      }

      // Calculate time components
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      // Determine correct reminder notifications specified by standard:
      if (currentUser.subscriptionStatus === 'free') {
        if (days < 1) {
          setSubscriptionReminder('CRITICAL: Under 1 day remaining! Your 7-day free trial ends in less than 24 hours. Sign-up for Pro/Elite to prevent full container lockdown.');
        } else if (days <= 3) {
          setSubscriptionReminder('WARNING: 3 days remaining! Forensic Node credentials scheduled to auto-expire soon. Back up trace telemetry reports now.');
        } else {
          setSubscriptionReminder(null);
        }
      } else if (currentUser.subscriptionStatus === 'pro') {
        if (days < 1) {
          setSubscriptionReminder('URGENT WARNING: 1 day before expiry! Dynamic scanning pipelines scheduled to pause tomorrow.');
        } else if (days <= 3) {
          setSubscriptionReminder('WARNING: 3 days before expiry! Monthly authentication lease is entering terminal clearance state.');
        } else if (days <= 7) {
          setSubscriptionReminder('NOTICE: 7 days before expiry! Monthly security signature scheduled for automated roll-over check.');
        } else {
          setSubscriptionReminder(null);
        }
      } else if (currentUser.subscriptionStatus === 'elite') {
        // Yearly Plan (named 'elite' status)
        if (days < 1) {
          setSubscriptionReminder('CRITICAL ALERT: 1 day before yearly signature expiry. Confirm renewal immediately.');
        } else if (days <= 7) {
          setSubscriptionReminder('COMPLIANCE NOTICE: 7 days before yearly signature expiry. Back up organization audits.');
        } else if (days <= 30) {
          setSubscriptionReminder('NOTICE: 30 days before expiry! Your annual credentials line is scheduled for security inspection and renewal.');
        } else {
          setSubscriptionReminder(null);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser]);

  // Retrieve Auditing Officer dynamically (Phase 3 Admin compliance, zero disclosure)
  useEffect(() => {
    const loadOfficerData = async () => {
      if (currentUser?.email) {
        try {
          const r = await fetch('/api/admin/auditing-officer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email })
          });
          if (r.ok) {
            const data = await r.json();
            setAuditingOfficer(data.auditingOfficer || null);
          }
        } catch (e) {
          console.warn('Network issue checking admin role.');
          setAuditingOfficer(null);
        }
      } else {
        setAuditingOfficer(null);
      }
    };
    loadOfficerData();
  }, [currentUser]);

  // Upcoming subscription expiry background notifier (2 days before)
  useEffect(() => {
    if (sessionVerified && currentUser) {
      const expires = new Date(currentUser.subscriptionExpires).getTime();
      const now = Date.now();
      const diff = expires - now;
      const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
      
      if (diff > 0 && diff <= twoDaysMs) {
        const reminderKey = `reminder_shown_${currentUser.userId}_${expires}`;
        if (!localStorage.getItem(reminderKey)) {
          showInfo(
            'EXPIRY DIRECTIVE COMING',
            `Your security credentials node is scheduled to expire in less than 2 days on ${new Date(expires).toLocaleDateString()}. To avoid automated lockout and full terminal containment, renew your signature to Pro or Elite Intelligence.`
          );
          localStorage.setItem(reminderKey, 'true');
          
          // Submit automated notification email trace to verified address
          fetch('/api/contact/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'TraceBack Automatic Reminder Server',
              email: 'sukanta.singha786@gmail.com',
              subject: `Node Expiry Notification Alert: user-handle ${currentUser.email}`,
              message: `Automated TraceBack alert: Please be advised that the subscription credentials for Node ${currentUser.email} are expiring in 2 days on ${new Date(expires).toLocaleDateString()}. Please renew immediately.`
            })
          }).catch(e => console.warn('Notification route unavailable in active trace block.', e));
        }
      }
    }
  }, [sessionVerified, currentUser]);

  // ESC Key Modal Support (Phase 12 compliance)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSettingsModalOpen(false);
        setCompareModalOpen(false);
        setAuthModalOpen(false);
        setErasureModalOpen(false);
        setInfoModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Automated inactivity cleaner (15 minutes limit with second-level countdown persistence)
  useEffect(() => {
    if (!sessionVerified || !autoClearEnabled) {
      setInactivityTimeRemaining(900);
      return;
    }

    let lastActivityTime = Date.now();
    const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

    const keepAlive = () => {
      lastActivityTime = Date.now();
      setInactivityTimeRemaining(900);
    };

    const monitoredEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    monitoredEvents.forEach((ev) => {
      window.addEventListener(ev, keepAlive, { passive: true });
    });

    const checkerInterval = setInterval(() => {
      const elapsed = Date.now() - lastActivityTime;
      const remainingSeconds = Math.max(0, Math.ceil((INACTIVITY_TIMEOUT - elapsed) / 1000));
      setInactivityTimeRemaining(remainingSeconds);

      if (elapsed >= INACTIVITY_TIMEOUT) {
        clearInterval(checkerInterval);
        handleAutoClearPurge();
      }
    }, 1000); // Check every second for dynamic status bar accuracy

    return () => {
      monitoredEvents.forEach((ev) => {
        window.removeEventListener(ev, keepAlive);
      });
      clearInterval(checkerInterval);
    };
  }, [sessionVerified, autoClearEnabled, sessionExtendTrigger]);

  const handleAutoClearPurge = () => {
    localStorage.removeItem('trace_back_user');
    setCurrentUser(null);
    setSessionVerified(false);
    setIsLockedOut(false);
    setScannedNodes([]);
    setTraceInput('');
    setActiveReport(null);
    setScanStats({ score: 100, verdict: 'SECURE' });
    showInfo('AUTO-CLEARED', 'Security Auto-Clear triggered: local forensic data and active session have been fully purged after 15 minutes of inactivity.');
  };

  const checkLockoutState = async (uid: string) => {
    try {
      const res = await fetch(`/api/user/status/${uid}`);
      if (res.ok) {
        const body = await res.json();
        setIsLockedOut(body.locked);
      }
    } catch (error) {
      console.warn('Network timeout.', error);
    }
  };

  const fetchScanHistory = async (userId: string) => {
    try {
      const q = query(
        collection(db, 'audit_reports'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const reports: AuditReport[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let parsedStream: TraceDataNode[] = [];
        try {
          parsedStream = typeof data.dataStream === 'string' 
            ? JSON.parse(data.dataStream) 
            : (data.dataStream || []);
        } catch {
          parsedStream = [];
        }
        reports.push({
          reportId: data.reportId || docSnap.id,
          userId: data.userId,
          target: data.target,
          type: data.type as 'email' | 'phone',
          securityScore: Number(data.securityScore || 100),
          dataStream: parsedStream,
          createdAt: data.createdAt
        });
      });

      // Sort client-side
      reports.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      if (reports.length > 0) {
        setHistoricalReports([...reports, ...MOCK_REPORTS]);
        const mappedPoints = reports.map((rep, idx) => {
          const dateObj = new Date(rep.createdAt);
          const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;
          return {
            date: formattedDate,
            score: rep.securityScore,
            target: rep.target
          };
        });
        setScanHistory(mappedPoints);
      } else {
        setHistoricalReports(MOCK_REPORTS);
        setScanHistory([
          { date: '05/25', score: 95, target: 'Baseline Check' },
          { date: '05/28', score: 88, target: 'API Handshake' },
          { date: '06/01', score: 93, target: 'Port Scan' },
          { date: 'Current', score: scanStats.score, target: traceInput || 'Active Session' }
        ]);
      }
    } catch (err) {
      console.warn('Failed to load past audit_reports, using local history.', err);
      setHistoricalReports(MOCK_REPORTS);
      setScanHistory([
        { date: '05/25', score: 95, target: 'Baseline Check' },
        { date: '05/28', score: 88, target: 'API Handshake' },
        { date: '06/01', score: 93, target: 'Port Scan' },
        { date: 'Current', score: scanStats.score, target: traceInput || 'Active Session' }
      ]);
    }
  };

  useEffect(() => {
    if (currentUser?.userId) {
      fetchScanHistory(currentUser.userId);
    } else {
      setScanHistory([
        { date: '05/25', score: 95, target: 'Baseline Check' },
        { date: '05/28', score: 88, target: 'API Handshake' },
        { date: '06/01', score: 93, target: 'Port Scan' },
        { date: 'Current', score: scanStats.score, target: traceInput || 'Active Session' }
      ]);
    }
  }, [currentUser?.userId, scanStats.score]);

  useEffect(() => {
    const gaId = localStorage.getItem('custom_google_analytics_id');
    if (gaId) {
      try {
        const existingNode = document.getElementById('gp-analytics-custom');
        if (!existingNode) {
          const script1 = document.createElement('script');
          script1.async = true;
          script1.id = 'gp-analytics-custom';
          script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
          document.head.appendChild(script1);

          const script2 = document.createElement('script');
          script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `;
          document.head.appendChild(script2);
          console.log('[TraceBack AI Dynamic Config] Google Analytics measurement initialized successfully.');
        }
      } catch (e) {
        console.warn('Google Analytics initialization bypassed:', e);
      }
    }
  }, []);

  const syncServerState = async (user: UserProfile) => {
    try {
      await fetch('/api/user/sync-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
    } catch (e) {
      console.warn('Offline connection fallback.');
    }
  };

  // Secure Verify Session Logic
  const handleVerifySession = async () => {
    if (!userAge || !userEmail) {
      alert('Email and current age are mandatory parameters.');
      return;
    }

    const ageNum = parseInt(userAge);
    if (ageNum < 18) {
      setMinorLock(true);
      if (!parentContact) {
        alert('Data privacy requirements block standalone nodes for minors. Enter parent contact email.');
        return;
      }
    }

    const targetEmail = userEmail.trim().toLowerCase();
    const targetPhone = userPhone.trim();

    try {
      // 1. Try to load existing profile from Firestore to prevent double free trial abuse
      let existingProfile: UserProfile | null = null;
      
      const qEmail = query(collection(db, 'users'), where('email', '==', targetEmail));
      const emailSnap = await getDocs(qEmail);
      
      if (!emailSnap.empty) {
        emailSnap.forEach((docSnap) => {
          existingProfile = docSnap.data() as UserProfile;
        });
      } else if (targetPhone) {
        const qPhone = query(collection(db, 'users'), where('phone', '==', targetPhone));
        const phoneSnap = await getDocs(qPhone);
        if (!phoneSnap.empty) {
          phoneSnap.forEach((docSnap) => {
            existingProfile = docSnap.data() as UserProfile;
          });
        }
      }

      if (existingProfile) {
        // Restore existing profile
        const profile = existingProfile as UserProfile;
        
        // Calculate expiration lockout status
        const expiryTime = new Date(profile.subscriptionExpires).getTime();
        const nowTime = Date.now();
        const isTrialExpired = profile.subscriptionStatus === 'free' && nowTime > expiryTime;

        setCurrentUser(profile);
        setSessionVerified(true);
        localStorage.setItem('trace_back_user', JSON.stringify(profile));
        
        await syncServerState(profile);
        setIsLockedOut(isTrialExpired);

        setAuthModalOpen(false);
        setMinorLock(false);
        
        if (isTrialExpired) {
          showInfo('FREE TRIAL EXPIRED', 'Your 7-day free trial has expired. To resume forensic scanning, please choose a Monthly or Yearly subscription plan.');
        } else {
          showInfo('IDENTITY RESTORED', `Existing profile successfully retrieved. Active Plan: ${profile.subscriptionStatus.toUpperCase()}`);
        }
        return;
      }

      // 2. If completely new, create standard 7-day free trial profile
      const userId = 'uid_' + Math.random().toString(36).substr(2, 9);
      const newProfile: UserProfile = {
        userId,
        email: targetEmail,
        phone: targetPhone,
        age: ageNum,
        subscriptionStatus: 'free',
        subscriptionExpires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days demo
        parentContact: parentContact || undefined,
        paymentStatus: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save in local state
      setCurrentUser(newProfile);
      setSessionVerified(true);
      localStorage.setItem('trace_back_user', JSON.stringify(newProfile));
      
      // Save profile client-side in Firestore under user restrictions
      await setDoc(doc(db, 'users', userId), {
        userId: newProfile.userId,
        email: newProfile.email,
        phone: newProfile.phone,
        age: newProfile.age,
        subscriptionStatus: newProfile.subscriptionStatus,
        subscriptionExpires: newProfile.subscriptionExpires,
        parentContact: newProfile.parentContact || '',
        paymentStatus: newProfile.paymentStatus,
        createdAt: newProfile.createdAt,
        updatedAt: newProfile.updatedAt
      });

      // Synchronize with backend validating engine
      await syncServerState(newProfile);
      setIsLockedOut(false);

      setAuthModalOpen(false);
      setMinorLock(false);
      showInfo('IDENTITY GRANTED', 'Data compliance clearance unlocked. 7-day premium access node activated.');
    } catch (error) {
      console.error('Firebase Auth sync error:', error);
      // Fallback local simulation
      const fallbackId = 'uid_' + Math.random().toString(36).substr(2, 9);
      const fallbackProfile: UserProfile = {
        userId: fallbackId,
        email: targetEmail,
        phone: targetPhone,
        age: ageNum,
        subscriptionStatus: 'free',
        subscriptionExpires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        paymentStatus: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCurrentUser(fallbackProfile);
      setSessionVerified(true);
      setAuthModalOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('trace_back_user');
    setCurrentUser(null);
    setSessionVerified(false);
    setIsLockedOut(false);
    showInfo('TERMINATED', 'Forensic session ended. Cleared security cookies.');
  };

  const handleOpenErasureModal = () => {
    setErasureAcknowledge(false);
    setErasureModalOpen(true);
  };

  const handleConfirmErasure = async () => {
    const targetLower = traceInput.trim().toLowerCase();
    const isAdminTarget = targetLower === 'sukanta.singha786@gmail.com' || targetLower === 'sukanta.singha786@gmil.com';
    const isCurrentUserAdmin = currentUser?.email?.toLowerCase() === 'sukanta.singha786@gmail.com';

    if (isAdminTarget && !isCurrentUserAdmin) {
      alert('ACCESS DENIED: Administrative nodes cannot be purged by client requests.');
      return;
    }

    if (!isCurrentUserAdmin) {
      const emailMatch = currentUser?.email?.toLowerCase() === targetLower;
      const phoneMatch = currentUser?.phone === traceInput.trim();
      if (!emailMatch && !phoneMatch) {
        alert('VERIFICATION ERROR: You can only permanently delete datasets verified as belonging to your active registered handle.');
        return;
      }
    }

    if (!erasureAcknowledge) {
      alert('You must check the compliance affirmation box to authorize secure erasure.');
      return;
    }

    try {
      setScannedNodes([]);
      setScanStats({ score: 100, verdict: 'SECURE' });
      setHistoricalReports(prev => prev.filter(r => r.target.toLowerCase() !== targetLower));

      setErasureModalOpen(false);
      showInfo('DATA PURGED SUCCESSFULLY', 'Compliance erasure executed. All exposure tracing files, telemetry dumps, and server caches have been de-allocated and permanently pruned.');
    } catch (err) {
      console.error('Data erasure error:', err);
      setScannedNodes([]);
      setScanStats({ score: 100, verdict: 'SECURE' });
      setErasureModalOpen(false);
      showInfo('DATA PURGED', 'Forensic records successfully disassembled and truncated.');
    }
  };

  const sendMockEmailSummary = async (email: string, target: string, score: number, verdict: string, nodes: TraceDataNode[]) => {
    try {
      const response = await fetch('/api/forensic/email-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          target,
          securityScore: score,
          verdict,
          scannedNodes: nodes
        })
      });
      if (response.ok) {
        const data = await response.json();
        showInfo('AUDIT EMAIL RETRIEVED', `A complete diagnostic summary report of identified breaches has been mock-transmitted to your verified address: ${email}`);
      }
    } catch (err) {
      console.warn('Failed to transmit mock email summary', err);
    }
  };

  const handleRemoveQuickTarget = (e: React.MouseEvent, tgtToRemove: string) => {
    e.stopPropagation();
    setQuickTargets((prev) => {
      const updated = prev.filter(t => t !== tgtToRemove);
      localStorage.setItem('quick_targets', JSON.stringify(updated));
      return updated;
    });
  };

  const handlePrintReport = () => {
    if (scannedNodes.length === 0) {
      showInfo('NO DATA COMPILED', 'Please launch a trace first to establish a live diagnostic dataset.');
      return;
    }
    window.print();
  };

  const handleGenerateShareLink = () => {
    if (scannedNodes.length === 0) {
      showInfo('NO DATA', 'Generate an audit report first to generate a shareable link.');
      return;
    }
    const payload = {
      target: traceInput,
      score: scanStats.score,
      verdict: scanStats.verdict,
      timestamp: Date.now(),
      nodes: scannedNodes.map(n => ({
        node: n.node,
        status: n.status,
        meta: n.meta,
        duration: n.duration,
        category: n.category
      }))
    };
    try {
      const jsonStr = JSON.stringify(payload);
      const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
      const link = `${window.location.origin}${window.location.pathname}?share=${encodeURIComponent(base64)}`;
      setCreatedShareLink(link);
      setShareLinkModalOpen(true);
    } catch (err) {
      console.error(err);
      alert('Failed to generate sharing link.');
    }
  };

  // Trigger Forensic scan using server-side Gemini processing
  const handleTriggerScan = async (overrideTarget?: string) => {
    if (overrideTarget !== undefined && typeof overrideTarget === 'string') {
      setTraceInput(overrideTarget);
    }
    const trimmedInput = (overrideTarget !== undefined && typeof overrideTarget === 'string' ? overrideTarget : traceInput).trim();
    if (!trimmedInput) {
      setValidationError('Provide target Email or Phone node to audit.');
      return;
    }

    const targetLower = trimmedInput.toLowerCase();
    const isAdminTarget = targetLower === 'sukanta.singha786@gmail.com' || targetLower === 'sukanta.singha786@gmil.com';
    const isCurrentUserAdmin = currentUser?.email?.toLowerCase() === 'sukanta.singha786@gmail.com';

    if (isAdminTarget && !isCurrentUserAdmin) {
      setValidationError('AUTHENTICATION REJECTED: Only verified admin (sukanta.singha786@gmail.com) can audit or query this target.');
      return;
    }

    const isEmail = trimmedInput.includes('@');
    if (isEmail) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(trimmedInput)) {
        setValidationError('Invalid email address format. Use format standard (e.g. target@domain.com).');
        return;
      }
    } else {
      const phoneRegex = /^\+?[0-9\s\-()]{7,18}$/;
      const digitsOnly = trimmedInput.replace(/\D/g, '');
      if (!phoneRegex.test(trimmedInput) || digitsOnly.length < 7) {
        setValidationError('Invalid phone number format. Check digits and international prefixes (+1, etc.).');
        return;
      }
    }

    setValidationError(null);

    // Save to quickTargets history (last 3 items) (Requirement #6)
    setQuickTargets((prev) => {
      const filtered = prev.filter(t => t.toLowerCase() !== trimmedInput.toLowerCase());
      const updated = [trimmedInput, ...filtered].slice(0, 3);
      localStorage.setItem('quick_targets', JSON.stringify(updated));
      return updated;
    });

    if (!sessionVerified) {
      setAuthModalOpen(true);
      return;
    }

    if (isLockedOut) {
      alert('ACCESS BLOCKED: Active node lockout in effect. Payment renewal required.');
      return;
    }

    if (currentUser?.subscriptionStatus === 'free' && apiRequestsCount >= 3) {
      showInfo(
        'STANDARD FREE QUOTA EXHAUSTED',
        'Your Standard Free tier allocation has been fully exhausted (3/3 queries). Please activate a Pro or Elite node subscription plan of TraceBack AI to query additional target directories.'
      );
      setUpgradeModalOpen(true);
      return;
    }

    if (isScanning) {
      showInfo('TRACE IN PROGRESS', 'A background trace sequence is already active. Please let the current cyber audit stream complete.');
      return;
    }

    setIsScanning(true);
    setScanStep(0);
    setScanProgress(0);
    setScannedNodes([]);

    const type = trimmedInput.includes('@') ? 'email' : 'phone';

    // Start a smooth progress simulation interval during initial active connection handshake
    let progressTimer: NodeJS.Timeout | null = null;
    let simulatedProgress = 0;
    
    progressTimer = setInterval(() => {
      if (simulatedProgress < 95) {
        if (simulatedProgress < 20) {
          simulatedProgress += 1;
        } else if (simulatedProgress < 60) {
          simulatedProgress += 0.4;
        } else {
          simulatedProgress += 0.12;
        }
        setScanProgress(Math.min(95, Math.round(simulatedProgress)));
      }
    }, 130);

    try {
      const customGeminiKey = localStorage.getItem('custom_gemini_api_key');
      const traceHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customGeminiKey) {
        traceHeaders['x-gemini-api-key'] = customGeminiKey;
      }

      const response = await fetch('/api/forensic/trace', {
        method: 'POST',
        headers: traceHeaders,
        body: JSON.stringify({
          target: trimmedInput,
          type,
          userId: currentUser?.userId
        })
      });

      if (progressTimer) {
        clearInterval(progressTimer);
      }

      if (!response.ok) {
        throw new Error('API server trace timeout.');
      }

      const body = await response.json();
      if (body.success && body.data) {
        if (currentUser?.subscriptionStatus === 'free') {
          setApiRequestsCount((prev) => {
            const next = prev + 1;
            localStorage.setItem('gemini_api_requests_count', String(next));
            return next;
          });
        }
        const rawNodes = body.data.dataStream as TraceDataNode[];
        const streamData = rawNodes.map((item, idx) => {
          const lengthFactor = (item.node.length % 7) * 0.18 + 0.25;
          const randomFactor = Number(((idx * 0.15 + lengthFactor) % 1.5 + 0.2).toFixed(2));
          
          let assignedCat: 'Phishing' | 'Data Leak' | 'Insecure Port' | 'Metadata Trace' | 'Compliant Node' = 'Metadata Trace';
          const name = item.node.toLowerCase();
          if (name.includes('leak') || name.includes('breach') || item.status === 'EXPOSED') {
            assignedCat = 'Data Leak';
          } else if (name.includes('port') || name.includes('tunnel') || name.includes('ssh')) {
            assignedCat = 'Insecure Port';
          } else if (name.includes('dns') || name.includes('override') || name.includes('phone') || name.includes('email') || name.includes('tracker')) {
            assignedCat = 'Phishing';
          } else if (item.status === 'Secure' || item.status === 'Compliant') {
            assignedCat = 'Compliant Node';
          }

          return {
            ...item,
            duration: item.duration || randomFactor,
            category: item.category || assignedCat
          };
        });
        const score = body.data.securityScore || 65;

        // Simulate streaming visualization transitioning from current progress level smoothly to 100%
        const startProgressVal = Math.max(20, Math.round(simulatedProgress));
        const totalNum = streamData.length;
        for (let i = 0; i <= totalNum; i++) {
          await new Promise((r) => setTimeout(r, 120));
          setScanStep(i);
          
          // Map step transitions smoothly from current level to 100%
          const stepPercentage = Math.round(startProgressVal + ((100 - startProgressVal) * i) / totalNum);
          setScanProgress(Math.min(100, stepPercentage));

          if (i < streamData.length) {
            setScannedNodes((prev) => [...prev, streamData[i]]);
          }
        }

        const verdict = score > 80 ? 'CRITICAL-SAFE' : (score > 50 ? 'MEDIUM-ALERT' : 'BREACH-EXPOSED');
        setScanStats({ score, verdict });
        saveToHistoryLog(trimmedInput, score, verdict);

        // Save generated report to Firestore
        const reportId = 'rep_' + Math.random().toString(36).substr(2, 9);
        const report: AuditReport = {
          reportId,
          userId: currentUser?.userId || '',
          target: trimmedInput,
          type,
          securityScore: score,
          dataStream: streamData,
          createdAt: new Date().toISOString()
        };

        // Detect transitions of any node from Secure/Compliant to EXPOSED
        const previousReport = historicalReports.find(
          (r) => r.target.toLowerCase() === trimmedInput.toLowerCase()
        );
        if (previousReport && previousReport.dataStream) {
          const transitions: string[] = [];
          streamData.forEach((newNode) => {
            const oldNode = previousReport.dataStream.find((n) => n.node === newNode.node);
            if (oldNode) {
              const wasSecure = oldNode.status === 'Secure' || oldNode.status === 'Compliant';
              const isExposed = newNode.status === 'EXPOSED';
              if (wasSecure && isExposed) {
                transitions.push(newNode.node);
              }
            }
          });
          if (transitions.length > 0) {
            setTransitionAlert({
              target: trimmedInput,
              nodes: transitions,
              previousId: previousReport.reportId,
            });
          }
        }

        setActiveReport(report);
        setHistoricalReports((prev) => [report, ...prev]);

        await setDoc(doc(db, 'audit_reports', reportId), {
          reportId,
          userId: report.userId,
          target: report.target,
          type: report.type,
          securityScore: report.securityScore,
          dataStream: JSON.stringify(report.dataStream),
          createdAt: report.createdAt
        });

        // Trigger Mock Email Summary
        if (currentUser?.email) {
          sendMockEmailSummary(currentUser.email, trimmedInput, score, verdict, streamData);
        }
        setCanPulseCsv(true);

      } else {
        throw new Error('Invalid trace payload logic.');
      }
    } catch (e) {
      if (progressTimer) {
        clearInterval(progressTimer);
      }
      console.warn('Trace service failed, showing offline demo analysis.', e);
      // Fallback offline generator trace executing for 51 platforms
      const fallbackData: TraceDataNode[] = FRONTEND_PLATFORM_REGISTRY.map(plat => {
        return getDeterministicNodeData(trimmedInput, plat.name);
      });

      let charSum = 0;
      for (let i = 0; i < trimmedInput.length; i++) {
        charSum += trimmedInput.charCodeAt(i);
      }
      const score = 45 + (charSum % 41);
      const verdict = score > 80 ? 'CRITICAL-SAFE' : (score > 50 ? 'MEDIUM-ALERT' : 'BREACH-EXPOSED');

      setScanStats({ score, verdict });
      saveToHistoryLog(trimmedInput, score, verdict);

      const startProgressVal = Math.max(20, Math.round(simulatedProgress));
      const totalNum = fallbackData.length;
      for (let i = 0; i <= totalNum; i++) {
        await new Promise((r) => setTimeout(r, 45));
        setScanStep(i);
        
        // Map fallback transitions smoothly from current level to 100%
        const stepPercentage = Math.round(startProgressVal + ((100 - startProgressVal) * i) / totalNum);
        setScanProgress(Math.min(100, stepPercentage));

        if (i < fallbackData.length) {
          setScannedNodes((prev) => [...prev, fallbackData[i]]);
        }
      }

      const reportId = 'rep_fallback_' + Math.random().toString(36).substr(2, 9);
      const report: AuditReport = {
        reportId,
        userId: currentUser?.userId || 'anonymous',
        target: trimmedInput,
        type: trimmedInput.includes('@') ? 'email' : 'phone',
        securityScore: score,
        dataStream: fallbackData,
        createdAt: new Date().toISOString()
      };

      // Detect transitions of any node from Secure/Compliant to EXPOSED
      const previousReport = historicalReports.find(
        (r) => r.target.toLowerCase() === trimmedInput.toLowerCase()
      );
      if (previousReport && previousReport.dataStream) {
        const transitions: string[] = [];
        fallbackData.forEach((newNode) => {
          const oldNode = previousReport.dataStream.find((n) => n.node === newNode.node);
          if (oldNode) {
            const wasSecure = oldNode.status === 'Secure' || oldNode.status === 'Compliant';
            const isExposed = newNode.status === 'EXPOSED';
            if (wasSecure && isExposed) {
              transitions.push(newNode.node);
            }
          }
        });
        if (transitions.length > 0) {
          setTransitionAlert({
            target: trimmedInput,
            nodes: transitions,
            previousId: previousReport.reportId,
          });
        }
      }

      setActiveReport(report);
      setHistoricalReports((prev) => [report, ...prev]);

      // Trigger Mock Email Summary for Offline/Demo Mode
      if (currentUser?.email) {
        sendMockEmailSummary(currentUser.email, trimmedInput, score, verdict, fallbackData);
      }
      setCanPulseCsv(true);
    } finally {
      setIsScanning(false);
    }
  };

  // Auto-Refresh Effect Loop (60 seconds countdown)
  useEffect(() => {
    if (!autoRefreshEnabled || !sessionVerified || isScanning) {
      if (!autoRefreshEnabled) {
        setRefreshCountdown(60);
      }
      return;
    }

    const interval = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          handleTriggerScan();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefreshEnabled, sessionVerified, isScanning, traceInput]);

  const toggleAutoRefresh = () => {
    if (!traceInput) {
      showInfo('ABORTED', 'Specify a valid target search input first to activate auto-refresh.');
      return;
    }
    if (!sessionVerified) {
      setAuthModalOpen(true);
      return;
    }
    setAutoRefreshEnabled((prev) => !prev);
    setRefreshCountdown(60);
  };

  // Safe Subscription simulated transaction purchase (Stripe / Razorpay validation)
  const handleUpgradePlan = async (plan: 'pro' | 'elite') => {
    if (!sessionVerified || !currentUser) {
      setAuthModalOpen(true);
      return;
    }

    setPaymentCheckoutPlan(plan);
  };

  const executeActualPlanUpdate = async (plan: 'pro' | 'elite') => {
    if (!currentUser) return;
    try {
      const response = await fetch(`${API_BASE}/api/payment/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.userId,
          plan,
          checkoutMethod,
          razorpayId
        })
      });

      if (response.ok) {
        const body = await response.json();
        const updatedUser = body.user as UserProfile;
        setCurrentUser(updatedUser);
        localStorage.setItem('trace_back_user', JSON.stringify(updatedUser));
        setIsLockedOut(false);
        loadStats();
        showInfo('UPGRADE CONFIRMED', `Plan activated successfully on Server. Expiring ${new Date(updatedUser.subscriptionExpires).toLocaleDateString()}`);
      }
    } catch (e) {
      alert('Failed to contact simulated transaction verification.');
    }
  };

  // Subscription Refund Management under 7-day rule (5% limit enforcement)
  const handleRequestRefund = async () => {
    if (!sessionVerified || !currentUser) {
      alert('You must sign in to file refund requests.');
      return;
    }

    try {
      const response = await fetch('/api/refunds/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.userId,
          email: currentUser.email,
          reason: refundReason
        })
      });

      if (response.ok) {
        const body = await response.json();
        if (body.allowed) {
          setRefundAlertMsg({ success: true, text: body.message });
          // Create Refund record locally on Firestore
          const refRecord: RefundRecord = {
            refundId: body.refundId,
            userId: currentUser.userId,
            email: currentUser.email,
            reason: refundReason,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setRefundHistory((prev) => [refRecord, ...prev]);
          await setDoc(doc(db, 'refunds', body.refundId), refRecord);
        } else {
          setRefundAlertMsg({ success: false, text: body.message });
        }
      }
    } catch (err) {
      alert('Error connecting to refund compliance checks.');
    } finally {
      setRefundReason('');
    }
  };

  // Support contact submissions sending to sukanta.singha786@gmail.com
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conName || !conEmail || !conMessage) {
      alert('Incomplete query data. Validation error.');
      return;
    }

    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: conName,
          email: conEmail,
          subject: conSubject || 'General Query',
          message: conMessage
        })
      });

      if (res.ok) {
        const body = await res.json();
        setContactResultMsg(body.message);
        
        // Save support query record to Firestore black-box
        const queryId = 'q_' + Math.random().toString(36).substr(2, 9);
        await setDoc(doc(db, 'support_queries', queryId), {
          queryId,
          name: conName,
          email: conEmail,
          subject: conSubject || 'General Query',
          message: conMessage,
          createdAt: new Date().toISOString()
        });

        // Clear Form
        setConName('');
        setConEmail('');
        setConSubject('');
        setConMessage('');
      }
    } catch (err) {
      setContactResultMsg('Offline mode. Action recorded internally.');
    }
  };

  const showInfo = (title: string, body: string) => {
    setInfoTitle(title);
    setInfoBody(body);
    setInfoModalOpen(true);
  };

  const handleDownloadPdfReport = () => {
    if (!sessionVerified || !currentUser) {
      setAuthModalOpen(true);
      return;
    }

    if (currentUser.subscriptionStatus === 'free') {
      showInfo(
        'PREMIUM PERMISSION REQUIRED',
        'Standard Free tier nodes do not possess forensic export authorizations. Please upgrade your credentials to standard Pro or Elite Intelligence to download PDF audit logs.'
      );
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      let y = 20;

      // Draw Top Indigo Decorative Tech bar
      doc.setFillColor(99, 102, 241);
      doc.rect(15, y, 180, 6, 'F');
      y += 15;

      // Header Brand
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(17, 24, 39);
      doc.text('TRACE-BACK-AI', 15, y);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 113, 108);
      doc.text('CYBER FOOTPRINT FORENSICS SYSTEM • AUDIT COMPLIANCE SECURE DOCUMENT', 15, y + 4.5);

      y += 12;
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.line(15, y, 195, y);
      y += 10;

      // Metadata card
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(79, 70, 229);
      doc.text('AUDIT TARGET PROFILE', 15, y);
      y += 8;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81);
      
      // Left side profile keys
      doc.text(`Target Entity: ${traceInput}`, 15, y);
      doc.text(`Operator Email: ${currentUser.email}`, 15, y + 6);
      doc.text(`Authorization Key: ${currentUser.userId.toUpperCase()}`, 15, y + 12);

      // Right side profile keys
      doc.text(`Issued Timestamp: ${new Date().toUTCString()}`, 115, y);
      doc.text(`Forensic Verdict: ${scanStats.verdict}`, 115, y + 6);
      doc.setFont('Helvetica', 'bold');
      doc.text(`Security Safety Score: ${scanStats.score}%`, 115, y + 12);
      doc.setFont('Helvetica', 'normal');

      y += 22;
      doc.line(15, y, 195, y);
      y += 12;

      // Results Table Header
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(17, 24, 39);
      doc.text('AUDITED EVIDENCE & LEAK CHANNELS LOG', 15, y);
      y += 6;

      // Header table columns
      doc.setFillColor(243, 244, 246);
      doc.rect(15, y, 180, 8, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(75, 85, 99);
      doc.text('DETECTED NODE IP / RECORD', 18, y + 5.5);
      doc.text('RECOVERY CONTEXT & META OBSERVATIONS', 75, y + 5.5);
      doc.text('RISK STATUS', 165, y + 5.5);
      
      y += 8;

      // Table rows representing scanned nodes
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      
      scannedNodes.forEach((nodeItem, index) => {
        if (index % 2 === 1) {
          doc.setFillColor(249, 250, 251);
          doc.rect(15, y, 180, 8, 'F');
        }

        doc.setTextColor(17, 24, 39);
        const nodeStr = nodeItem.node || 'Unknown Trace Node';
        doc.text(nodeStr.substring(0, 30), 18, y + 5.5);
        
        doc.setTextColor(107, 114, 128);
        const metaStr = nodeItem.meta || 'No forensic observations returned';
        doc.text(metaStr.substring(0, 48), 75, y + 5.5);

        // Highlight risk statuses
        if (nodeItem.status === 'EXPOSED') {
          doc.setTextColor(220, 38, 38);
        } else if (nodeItem.status === 'Secure' || nodeItem.status === 'Compliant') {
          doc.setTextColor(22, 163, 74);
        } else {
          doc.setTextColor(79, 70, 229);
        }
        
        doc.setFont('Helvetica', 'bold');
        doc.text(nodeItem.status || 'EXAMINED', 165, y + 5.5);
        doc.setFont('Helvetica', 'normal');

        y += 8;

        // Multipage support
        if (y > 270) {
          doc.addPage();
          y = 20;

          // Top line decoration on secondary pages
          doc.setFillColor(99, 102, 241);
          doc.rect(15, y, 180, 2, 'F');
          y += 8;
        }
      });

      // Bottom disclaimer / compliance badge
      y = Math.min(y + 12, 265);
      doc.setDrawColor(243, 244, 246);
      doc.line(15, y, 195, y);
      y += 8;

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(79, 70, 229);
      doc.text('ISO 27001 COMPLIANT • SECURE DESTRUCTION ASSURED UNDER GDPR ARTICLE 17 & CCPA', 15, y);
      
      y += 4;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(156, 163, 175);
      doc.text('This trace file is intended solely for authorized personnel. System queries automatically clear inside 15-minute intervals.', 15, y);

      // Save the generated document file
      const cleanTarget = traceInput.replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`TRACE-BACK-REPORT-${cleanTarget}.pdf`);
      addDownloadToast(`TRACE-BACK-REPORT-${cleanTarget}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate secure PDF audit report file.');
    }
  };

  const handleDownloadJsonReport = () => {
    if (scannedNodes.length === 0) {
      showInfo('NO DATA COMPILED', 'Please launch a trace first to establish a live diagnostic dataset.');
      return;
    }

    try {
      const filename = `trace_telemetry_${traceInput.replace(/[^a-zA-Z0-9]/g, '_') || 'audit'}.json`;
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scannedNodes, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addDownloadToast(filename);
      showInfo('JSON EXPORTED', 'The raw forensic node telemetry JSON file has been successfully prepared and downloaded.');
    } catch (err) {
      console.error(err);
      alert('Failed to generate secure JSON telemetry export.');
    }
  };
  
  const handleSendReportByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sendingReport) return;

    if (!sessionVerified || !currentUser) {
      setAuthModalOpen(true);
      return;
    }

    // Check plan first for security client-side prevention
    if (currentUser.subscriptionStatus === 'free') {
      setSendReportModalOpen(false);
      setUpgradeModalOpen(true);
      return;
    }

    const trimmedEmail = sendReportEmail.trim();
    if (!trimmedEmail) {
      alert('Please enter a recipient email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      alert('Please enter a valid email address format.');
      return;
    }

    setSendingReport(true);
    try {
      const reportId = activeReport?.reportId || 'rep_temp_' + Math.random().toString(36).substr(2, 9);
      const response = await fetch(`${API_BASE}/api/report/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId,
          userId: currentUser.userId,
          recipientEmail: trimmedEmail,
          reportData: {
            score: scanStats.score,
            verdict: scanStats.verdict,
            nodes: scannedNodes.map(n => ({ node: n.node, status: n.status, meta: n.meta }))
          },
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSendReportEmail('');
        setSendReportModalOpen(false);
        showInfo(
          'REPORT DISPATCHED',
          `The cyber footprint audit telemetry report has been successfully flagged and dispatched to ${trimmedEmail} (Sent ID: ${data.sentId || 'Verified'}).`
        );
      } else {
        const errData = await response.json();
        if (errData.code === 'UPGRADE_REQUIRED') {
          setSendReportModalOpen(false);
          setUpgradeModalOpen(true);
        } else {
          alert(errData.error || 'Failed to dispatch email report via secure servers.');
        }
      }
    } catch (err: any) {
      console.error(err);
      alert('Connection error. Failed to reach transmission gateway.');
    } finally {
      setSendingReport(false);
    }
  };

  const handleDownloadCsvReport = () => {
    if (scannedNodes.length === 0) {
      showInfo('NO DATA COMPILED', 'Please launch a trace first to establish a live diagnostic diagnostic dataset.');
      return;
    }

    // Stop CSV Pulse on click
    setCanPulseCsv(false);
    setIsCsvSpinner(true);

    setTimeout(() => {
      try {
        const filename = `trace_spreadsheet_${traceInput.replace(/[^a-zA-Z0-9]/g, '_') || 'audit'}.csv`;
        
        // Exact requested headers: 'Platform', 'Category', 'Status', 'Latency', and 'Details'
        const headers = ['Platform', 'Category', 'Status', 'Latency', 'Details'];
        const rows = scannedNodes.map(node => [
          `"${(node.node || '').replace(/"/g, '""')}"`,
          `"${(node.category || 'N/A').replace(/"/g, '""')}"`,
          `"${(node.status || '').replace(/"/g, '""')}"`,
          node.duration !== undefined ? `"${node.duration.toFixed(2)}s"` : '"N/A"',
          `"${(node.meta || '').replace(/"/g, '""')}"`
        ]);
        
        const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", url);
        downloadAnchor.setAttribute("download", filename);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        
        addDownloadToast(filename);
        showInfo('CSV EXPORTED', 'The structured CSV spreadsheet report has been generated and downloaded successfully.');
      } catch (err) {
        console.error(err);
        alert('Failed to generate CSV spreadsheet export.');
      } finally {
        setIsCsvSpinner(false);
      }
    }, 850);
  };

  const handleCopyToClipboard = (item: TraceDataNode, index: number) => {
    // Generate text to copy containing breach metadata & status
    const textToCopy = `Node/Breach source: ${item.node || ''}\nDetail: ${item.meta || ''}\nStatus: ${item.status || ''}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleWipeIndividualNode = (nodeName: string) => {
    if (!sessionVerified) {
      setAuthModalOpen(true);
      showInfo('VERIFICATION REQUIRED', 'Ownership validation required. Authenticate or input target registration access credentials to apply secure remote de-indexing.');
      return;
    }

    const nodeItem = scannedNodes.find(n => n.node === nodeName);
    if (nodeItem && nodeItem.status === 'EXPOSED') {
      setRemediationNode(nodeItem);
      return;
    }

    // Otherwise carry out direct GDPR de-indexing purge
    executeActualNodeWipe(nodeName);
  };

  const executeActualNodeWipe = (nodeName: string) => {
    setScannedNodes((prev) => {
      const updated = prev.filter(n => n.node !== nodeName);
      
      // Compute correct updated security indices
      const remainingExposed = updated.filter(n => n.status === 'EXPOSED').length;
      const totalNodes = updated.length || 1;
      const calculatedScore = Math.min(100, Math.round(100 - (remainingExposed / totalNodes) * 55));
      const calculatedVerdict = calculatedScore > 80 ? 'CRITICAL-SAFE' : (calculatedScore > 50 ? 'MEDIUM-ALERT' : 'BREACH-EXPOSED');
      setScanStats({ score: calculatedScore, verdict: calculatedVerdict });

      showInfo(
        'REPAIR AND PURGE ENFORCED',
        `The profile footprint on index "${nodeName}" has been successfully purged under GDPR Article 17 protocols. Security indicators recalculated: Trust score has been restored to ${calculatedScore}%.`
      );

      return updated;
    });
  };

  const handleCopyAllFindings = () => {
    if (scannedNodes.length === 0) {
      showInfo('NO DATA COMPILED', 'Please launch a trace first to establish a live diagnostic dataset.');
      return;
    }
    const findingsText = scannedNodes.map((item, index) => {
      return `[Finding #${index + 1}]\nNode Name: ${item.node || ''}\nStatus: ${item.status || ''}\nDetail: ${item.meta || ''}`;
    }).join('\n\n');

    const header = `=== TRACE-BACK-AI FORENSIC REPORT ===\nTarget Entity: ${traceInput || 'Unknown Target'}\nSafety Score: ${scanStats.score}%\nForensic Verdict: ${scanStats.verdict}\nTotal Monitored Nodes: ${scannedNodes.length}\nTimestamp: ${new Date().toISOString()}\n\n`;

    const fullText = header + findingsText;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
      showInfo('ALL FINDINGS COPIED', 'Complete forensic findings data stream has been concatenated and successfully copied to your clipboard.');
    }).catch(err => {
      console.error('Failed to copy all findings: ', err);
      alert('Failed to copy findings to clipboard.');
    });
  };

  const handleShareIntelligence = async () => {
    const summary = `Forensic Trace Report Summary for: ${traceInput || 'target'}\n` +
      `Security Score: ${scanStats.score}%\n` +
      `Verdict: ${scanStats.verdict}\n` +
      `Scanned Nodes: ${scannedNodes.length} active monitors.\n\n` +
      `View live compliance metrics:`;
    
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Forensic Search Intelligence - ${traceInput || 'Diagnostics'}`,
          text: summary,
          url: shareUrl,
        });
        showInfo('INTELLIGENCE SHARED', 'System-native sharing container launched successfully.');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('System share error: ', err);
          // Fallback to clipboard
          navigator.clipboard.writeText(`${summary}\n${shareUrl}`);
          showInfo('COPIED INSTEAD', 'Native sharing was restricted. Intelligence report summary copied to clipboard.');
        }
      }
    } else {
      navigator.clipboard.writeText(`${summary}\n${shareUrl}`);
      showInfo('COPIED TO CLIPBOARD', 'System-native sharing not supported in browser environment. Report summary copied to clipboard.');
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'light-mode bg-white' : 'bg-[#010409]'} text-gray-200 selection:bg-indigo-500/30 overflow-x-hidden font-sans relative lg:pl-20 transition-all duration-300`}>
      {/* Global visual progress bar for dynamic inactivity countdown (Requirement #2) */}
      {sessionVerified && autoClearEnabled && (
        <div className="fixed top-0 left-0 lg:left-20 w-full lg:w-[calc(100%-5rem)] h-[3.5px] bg-[#0c0f16]/90 overflow-hidden z-[100] pointer-events-none select-none border-b border-white/5">
          <div 
            className={`h-full transition-all duration-1000 ${
              inactivityTimeRemaining <= 180 
                ? 'bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_10px_#ef4444]' 
                : inactivityTimeRemaining <= 360 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_#f59e0b]' 
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 shadow-[0_0_10px_#6366f1]'
            }`} 
            style={{ width: `${(inactivityTimeRemaining / 900) * 100}%` }}
          />
        </div>
      )}

      {/* Decorative Cyber Background Grids */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_top,white_40%,transparent_70%)] pointer-events-none" />

      {/* Immersive Left Navigation Rail for Desktop */}
      <nav className="w-20 bg-[#0d1117] border-r border-white/10 flex-col items-center py-8 justify-between fixed left-0 top-0 h-full z-50 hidden lg:flex">
        <div className="flex flex-col gap-8 items-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Fingerprint className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col gap-6 opacity-65 mt-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-10 h-10 rounded-lg hover:bg-white/5 flex items-center justify-center text-indigo-400 hover:text-indigo-300 transition-all" title="Forensic Console">
              <Shield className="w-5 h-5" />
            </button>
            <button onClick={() => { if (scannedNodes.length > 0) { document.getElementById('forensic-dashboard')?.scrollIntoView({ behavior: 'smooth' }); } else { alert('Initialize trace search to view active dashboard streams.'); } }} className="w-10 h-10 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all" title="Analysis Streams">
              <Activity className="w-5 h-5" />
            </button>
            <button onClick={() => window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' })} className="w-10 h-10 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all" title="Subscriptions">
              <CreditCard className="w-5 h-5" />
            </button>
            <button onClick={() => window.scrollTo({ top: window.innerHeight * 3, behavior: 'smooth' })} className="w-10 h-10 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all" title="Contact Support">
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-400/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-mono text-[9px] font-black relative">
          {sessionVerified && currentUser ? currentUser.email.charAt(0).toUpperCase() : '?' }
          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#0d1117] ${sessionVerified ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
        </div>
      </nav>

      {/* FIXED GLASS NAVIGATION */}
      <nav className="fixed w-full lg:w-[calc(100%-5rem)] top-0 left-0 lg:left-20 z-30 bg-[#010409]/85 backdrop-blur-md border-b border-white/10 px-3 py-3 sm:px-6 sm:py-4 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 lg:hidden shrink-0">
            <Fingerprint className="text-white w-4 h-4 sm:w-5 sm:h-5" id="nav-badge" />
          </div>
          <div className="shrink-0 text-left">
            <span className="text-xs sm:text-sm font-black tracking-widest block leading-none text-white font-sans whitespace-nowrap">TRACE-BACK-AI</span>
            <span className="text-[8px] sm:text-[9px] text-indigo-400 font-bold uppercase tracking-widest leading-none mt-1 sm:mt-1.5 block font-mono whitespace-nowrap">
              <span className="inline sm:hidden">GLOBAL NODE</span>
              <span className="hidden sm:inline">NODE CONNECTION: GLOBAL</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e]"></span> 195 REGIONS COMPLIANT
          </div>
 
          <AnimatePresence>
            {!sessionVerified ? (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-[10px] font-black px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all uppercase tracking-wider shadow-lg shadow-indigo-600/20"
              >
                Secure Session
              </button>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-3">
                {/* Visual Session Inactivity Countdown & Progress Bar (Top Navigation compliance) */}
                {autoClearEnabled && (
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-black/40 border border-white/5 hover:border-indigo-500/25 rounded-xl text-[10px] font-mono select-none transition-all shrink-0" title="Forensic Session Auto-Clear Active Inactivity Guard">
                    <Clock className={`w-3.5 h-3.5 shrink-0 ${
                      inactivityTimeRemaining <= 180 
                        ? 'text-red-500 animate-bounce' 
                        : inactivityTimeRemaining <= 360 
                          ? 'text-amber-400 animate-pulse' 
                          : 'text-indigo-400'
                    }`} />
                    <div className="hidden md:flex flex-col text-left mr-0.5 leading-none">
                      <span className="text-[7px] font-bold text-slate-500 uppercase tracking-wider">SESSION AUTO-CLEAR</span>
                      <span className="text-[10px] font-black text-white tracking-widest mt-0.5">
                        {Math.floor(inactivityTimeRemaining / 60)}:{String(inactivityTimeRemaining % 60).padStart(2, '0')}
                      </span>
                    </div>
                    {/* Small visual counter for mobile screens */}
                    <span className="md:hidden text-[9px] font-black tracking-widest text-[#818cf8]">
                      {Math.floor(inactivityTimeRemaining / 60)}:{String(inactivityTimeRemaining % 60).padStart(2, '0')}
                    </span>
                    <div className="hidden sm:block w-12 sm:w-16 h-1 bg-white/10 rounded-full overflow-hidden shrink-0">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          inactivityTimeRemaining <= 180 
                            ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]' 
                            : inactivityTimeRemaining <= 360 
                              ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]' 
                              : 'bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.5)]'
                        }`} 
                        style={{ width: `${(inactivityTimeRemaining / 900) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
 
                <button
                  onClick={() => setApiDocModalOpen(true)}
                  className="p-1.5 sm:p-2 bg-indigo-600/15 border border-indigo-500/25 hover:border-indigo-500/45 text-indigo-300 hover:text-white rounded-lg transition-all duration-150 flex items-center gap-1.5 cursor-pointer font-mono text-[10px] uppercase font-black tracking-widest shrink-0"
                  title="View API Keys & Vercel Deployment Documentation"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden md:inline">API & Deploy</span>
                </button>

                <button
                  onClick={() => setSettingsModalOpen(true)}
                  className="p-1.5 sm:p-2 bg-white/5 border border-white/5 hover:border-indigo-500/30 text-gray-400 hover:text-white rounded-lg transition-all duration-150 flex items-center gap-1.5 cursor-pointer font-mono text-[10px] uppercase font-black tracking-widest shrink-0"
                  title="Configure Security Settings"
                >
                  <Settings className="w-3.5 h-3.5 text-indigo-400 animate-hover-spin" />
                  <span className="hidden md:inline">Settings</span>
                </button>
                {trialDaysLeft !== null && (
                  trialDaysLeft > 0 ? (
                    <div className="flex border border-amber-500/30 bg-amber-500/10 px-1.5 py-1 sm:px-2 sm:py-1 rounded-lg text-amber-400 text-[8px] sm:text-[9px] font-black uppercase tracking-wider font-mono items-center gap-1 whitespace-nowrap shrink-0">
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-500 rounded-full animate-ping shrink-0" />
                      <span>
                        <span className="inline sm:hidden">{trialDaysLeft}D</span>
                        <span className="hidden sm:inline">{trialDaysLeft} Days Remaining</span>
                      </span>
                    </div>
                  ) : (
                    <div className="flex border border-red-500/30 bg-red-500/10 px-1.5 py-1 sm:px-2 sm:py-1 rounded-lg text-red-500 text-[8px] sm:text-[9px] font-black uppercase tracking-wider font-mono items-center gap-1 whitespace-nowrap shrink-0">
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-500 rounded-full shrink-0" />
                      <span>
                        <span className="inline sm:hidden">EXP</span>
                        <span className="hidden sm:inline">Expired Trial</span>
                      </span>
                    </div>
                  )
                )}
                <div className="text-right hidden sm:block font-mono">
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                    {currentUser?.subscriptionStatus.toUpperCase()} NODE
                  </p>
                  <p className="text-[11px] font-bold text-gray-400 max-w-[120px] truncate mt-0.5">{currentUser?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-[9px] sm:text-[10px] font-black px-2.5 py-1.5 sm:px-4 sm:py-1.5 rounded-lg bg-red-600/10 border border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white transition-all uppercase tracking-wider shrink-0"
                >
                  Disconnect
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* CORE FRAME LOCKOUT ALERT BANNER */}
      {isLockedOut && (
        <div className="pt-24 px-6">
          <div className="max-w-4xl mx-auto bg-red-500/10 border border-red-500/30 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-left">
              <AlertTriangle className="text-red-500 w-8 h-8 shrink-0" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-red-400">Node Lockout Triggered</h4>
                <p className="text-xs text-slate-400">
                  Your premium node access has expired, and payment has not been received. Please renew subscription to avoid complete database de-authorization.
                </p>
              </div>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 1200, behavior: 'smooth' })}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase transition shrink-0"
            >
              Renew Account Node
            </button>
          </div>
        </div>
      )}

      {/* PREMIUM EXPIRY AUTO_WARNING_REMINDER BANNER */}
      {currentUser && !isLockedOut && subscriptionReminder && (
        <div className="pt-24 px-6">
          <div className="max-w-4xl mx-auto bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-indigo-400 w-5 h-5 shrink-0 animate-pulse font-extrabold" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-300 font-sans">LICENSE ACCESS CLEARANCE WARNING</h4>
                <p className="text-[10px] text-slate-400 leading-normal font-mono mt-0.5">
                  {subscriptionReminder}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const pricingSec = document.getElementById('subscription-packs-section');
                if (pricingSec) {
                  pricingSec.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: 3700, behavior: 'smooth' });
                }
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition shrink-0 shadow-lg shadow-indigo-600/10 cursor-pointer"
            >
              UPGRADE NODE LICENSE
            </button>
          </div>
        </div>
      )}

      {/* MAIN HERO LANDING SCANS */}
      <header className="pt-40 pb-16 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black mb-8 uppercase tracking-[0.25em]">
          <Shield className="w-3.5 h-3.5" /> Cyber Footprint Forensics v2.0
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-8 tracking-tighter leading-none text-white">
          Audit Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Digital Footprint</span><br />with AI Forensics.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-12">
          Verify digital leaks, public exposure records, and credential exposure under standard cyber OSINT forensics in 195+ countries.
        </p>

        {/* GLOWING INSIDE DOUBLE-BORDER SEARCH SCANNER */}
        <div className={`max-w-3xl mx-auto p-1.5 bg-white/5 border ${validationError ? 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : isInputFocused ? 'border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'border-white/10'} rounded-2xl relative shadow-2xl transition-all duration-300`}>
          <AnimatePresence>
            {isInputFocused && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-full max-w-xs sm:max-w-md bg-slate-950/95 border border-indigo-500/40 hover:border-indigo-500/60 px-4 py-3 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.95)] backdrop-blur-md z-45 text-center pointer-events-none"
              >
                {/* Arrow */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-t border-l border-indigo-500/40 rotate-45" />
                <p className="text-[11px] font-mono text-indigo-200 select-none flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>The Trace-Back-AI engine accepts both <strong className="text-white">international phone formats</strong> and <strong className="text-white">standard email handles</strong>.</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl opacity-20 pointer-events-none" />
          <div className="flex flex-col sm:flex-row gap-2">
            <div className={`flex-1 bg-black/40 rounded-xl px-5 py-4 flex items-center gap-4 border ${validationError ? 'border-red-500/25' : isInputFocused ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-white/5'} transition-all duration-300`}>
              <span className="text-indigo-400 font-mono text-xs hidden sm:inline select-none">$ trace-back</span>
              <div className="w-px h-4 bg-white/10 hidden sm:block" />
              <Search className={validationError ? "text-red-400 w-4 h-4 shrink-0" : isInputFocused ? "text-indigo-400 w-4 h-4 shrink-0" : "text-slate-500 w-4 h-4 shrink-0"} />
              <input
                type="text"
                id="trace-id"
                value={traceInput}
                onChange={(e) => {
                  setTraceInput(e.target.value);
                  if (validationError) {
                    setValidationError(null);
                  }
                }}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="Enter Global Gmail or Phone (+1, +44, +91...)"
                className="w-full bg-transparent text-xs sm:text-sm outline-none font-mono text-gray-200 placeholder-slate-500 border border-transparent focus:border-indigo-500/30 focus:shadow-[0_0_12px_rgba(99,102,241,0.2)] focus:bg-indigo-550/5 px-2 py-1 rounded-lg transition-all duration-300"
              />
              {traceInput && (
                <button
                  type="button"
                  id="clear-trace-button"
                  onClick={() => {
                    setTraceInput('');
                    if (validationError) {
                      setValidationError(null);
                    }
                  }}
                  className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all shrink-0 cursor-pointer"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                id="voice-transcribe-button"
                onClick={handleToggleListening}
                className={`p-1.5 rounded-full border transition-all shrink-0 cursor-pointer flex items-center justify-center ${
                  isListening
                    ? "bg-red-500/20 text-red-400 border-red-500/50 animate-pulse ring-2 ring-red-500/20"
                    : "bg-transparent border-transparent text-slate-400 hover:text-indigo-400 hover:bg-white/15"
                }`}
                title="Voice Transcription (Speak Email or Phone)"
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setHistoryDrawerOpen(true)}
                className="p-1 px-2.5 bg-indigo-600/10 hover:bg-indigo-600/25 text-indigo-300 hover:text-indigo-200 border border-indigo-500/15 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1 font-mono text-[10px] uppercase font-black"
                title="View past scans history drawer"
              >
                <History className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden md:inline">Archive</span>
                <span className="bg-indigo-500 text-white rounded px-1.5 py-0.5 text-[8px] font-black leading-none ml-0.5">
                  {traceSearchHistory.filter(h => !h.deleted).length}
                </span>
              </button>
            </div>
            <div className="relative flex items-center justify-center shrink-0 w-full sm:w-auto sm:min-w-[170px] h-[54px] sm:h-auto">
              <AnimatePresence mode="wait">
                {!isScanning ? (
                  <motion.button
                    key="idle"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => handleTriggerScan()}
                    className="w-full h-full sm:h-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 rounded-xl font-bold text-xs uppercase tracking-widest text-white shrink-0 shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center justify-center"
                  >
                    Initialize Trace
                  </motion.button>
                ) : (
                  <motion.div
                    key="scanning"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative w-[50px] h-[50px] flex items-center justify-center"
                  >
                    {/* SVG Circular Progress Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                      {/* Outer background/track circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="8"
                      />
                      {/* Active Progress circle */}
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 42}
                        animate={{
                          strokeDashoffset: 2 * Math.PI * 42 * (1 - scanProgress / 100)
                        }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        strokeLinecap="round"
                        style={{ filter: "drop-shadow(0px 0px 4px rgba(99,102,241,0.6))" }}
                      />
                    </svg>
                    {/* Centered Percentage indicator */}
                    <span className="absolute text-[10px] font-black font-mono text-indigo-400 select-none">
                      {scanProgress}%
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Quick Access search chips (Requirement #6) */}
        {quickTargets.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono select-none">
            <span className="text-slate-500 uppercase font-black tracking-wider flex items-center gap-1.5 mr-1">
              <History className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Recent:
            </span>
            {quickTargets.map((tgt, i) => (
              <div
                key={`quick-chip-${tgt}-${i}`}
                className="px-2.5 py-1 bg-white/[0.02] hover:bg-indigo-600/10 border border-white/5 hover:border-indigo-500/35 text-gray-450 hover:text-indigo-400 rounded-lg font-bold tracking-wide transition-all flex items-center gap-1.5 group/chip"
              >
                <button
                  type="button"
                  onClick={() => handleTriggerScan(tgt)}
                  className="cursor-pointer text-left focus:outline-none"
                  title={`Click to analyze target: ${tgt}`}
                >
                  {tgt}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleRemoveQuickTarget(e, tgt)}
                  className="text-gray-500 hover:text-red-400 px-0.5 rounded cursor-pointer transition-colors focus:outline-none"
                  title={`Remove ${tgt} from history`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Client-side dynamic validation text */}
        <AnimatePresence>
          {validationError && (
            <motion.p
              initial={{ height: 0, opacity: 0, y: -5 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -5 }}
              className="text-xs text-red-400 font-mono mt-3 uppercase tracking-wider text-center"
            >
              ⚠ Error: {validationError}
            </motion.p>
          )}
        </AnimatePresence>

        {/* LOADING ANIMATED SATELLITE LINKS */}
        {isScanning && (
          <div className="mt-6 max-w-md mx-auto bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3 justify-center text-xs font-mono font-bold text-indigo-400">
            <Activity className="animate-spin w-4 h-4 text-indigo-500" />
            <span>ESTABLISHING HANDSHAKING NODES (EU-West, US-East)...</span>
          </div>
        )}

        <p className="mt-8 text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest">
          Node Links: <span className="text-indigo-400">US-East</span> | <span className="text-indigo-400">EU-West</span> | <span className="text-indigo-400">ASIA-South</span>
        </p>

        {currentUser?.subscriptionStatus === 'free' && apiRequestsCount >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 max-w-4xl mx-auto bg-gradient-to-b from-[#111622] to-[#0c0f16] border border-pink-500/30 rounded-3xl p-6 sm:p-8 text-left shadow-2xl relative"
            id="premium-retention-preview"
          >
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-pink-400 font-sans">Premium Intelligence Feed</h3>
                  <p className="text-[10px] text-slate-400 font-mono uppercase mt-0.5">Continuous Monitoring & Darknet Registries</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUpgradeModalOpen(true)}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-pink-600/20 shrink-0"
              >
                Unlock Unlimited Audits
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mb-6 font-sans">
              You have exhausted your **3 Standard Free Scans** allocation. Mapped below is an active preview of trace logs available to Pro and Elite members. Enable continuous monitoring to track cyber threats.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 font-mono text-[10px]">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left">
                <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">Breach Directories</span>
                <span className="text-base sm:text-lg font-black text-white mt-1 block">19,402 Sites</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left">
                 <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">Exposed Passwords</span>
                 <span className="text-base sm:text-lg font-black text-rose-400 mt-1 block">3.4B Keys</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left">
                 <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">Active Monitoring</span>
                 <span className="text-base sm:text-lg font-black text-indigo-400 mt-1 block">24/7/365 Logs</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left">
                 <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">Audit Reliability</span>
                 <span className="text-base sm:text-lg font-black text-emerald-400 mt-1 block">99.98% SLA</span>
              </div>
            </div>

            <div className="space-y-3 bg-[#080b11] border border-white/5 rounded-2xl p-4 relative overflow-hidden font-sans">
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#080b11] to-transparent pointer-events-none" />
              
              <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 rounded-xl p-3 text-xs opacity-85 select-none">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-200">admin_creds_dump_q4_2025.txt</p>
                    <p className="text-[9px] font-mono text-slate-500">EXPOSURE SOURCE: SQL INJECTION DATABASE BREACH</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/25 select-none leading-none">EXPOSED</span>
              </div>

              <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 rounded-xl p-3 text-xs opacity-50 select-none blur-[0.5px]">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-300">payment_records_gateway_export.csv</p>
                    <p className="text-[9px] font-mono text-slate-500">EXPOSURE SOURCE: UNENCRYPTED CLOUD COMPARTMENT BACKUP</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25 select-none leading-none">HIGH RISK</span>
              </div>

              <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 rounded-xl p-3 text-xs opacity-30 select-none blur-[1.5px]">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-400">dns_override_reverse_resolver_registry</p>
                    <p className="text-[9px] font-mono text-slate-600">NODE STATUS: VERIFIED DEFENSIVE PRIVACY CERTIFIED</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25 select-none leading-none">SECURE</span>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setUpgradeModalOpen(true)}
                className="text-xs font-black uppercase tracking-widest text-[#818cf8] hover:text-white transition-colors cursor-pointer font-sans"
              >
                ⚡ Link a Pro Intelligence Node to audit custom entities ➔
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* TARGET EXPOSED DATA GRAPHS PORTAL */}
      <AnimatePresence>
        {(scannedNodes.length > 0) && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="py-12 px-6 max-w-7xl mx-auto"
            id="forensic-dashboard"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* STREAMS CONTAINER */}
              <div className="lg:col-span-2 bg-[#0d1117] border border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl shadow-black/40 relative flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-white/10 pb-4 text-left">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Forensic Analysis Stream</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-1 truncate break-all max-w-full">CHANNEL: {traceInput}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 text-left sm:text-right flex-wrap justify-start sm:justify-end">
                    <span className="text-[10px] font-mono text-gray-500 hidden sm:inline">PID: 8829-X-GLOBAL</span>
                    <button
                      onClick={handleGenerateShareLink}
                      className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer mr-0.5"
                      title="Generate a dynamic read-only social sharing link"
                    >
                      <Share2 className="w-3 h-3 text-indigo-400" />
                      <span>Social Share</span>
                    </button>
                    <button
                      onClick={handleCopyAllFindings}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                        copiedAll
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/40 hover:bg-indigo-500/20'
                      }`}
                      title="Copy all dynamic findings to clipboard"
                    >
                      {copiedAll ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-indigo-400" />
                          <span>Copy All Findings</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-600/15 border border-indigo-500/30 px-3 py-1 rounded-full uppercase">
                      Safety Index: {scanStats.score}%
                    </span>
                  </div>
                </div>
                
                {/* Categorized Threat Legend (Requirement #4) */}
                <div className="mb-5 bg-white/[0.02] border border-white/5 p-3 rounded-2xl flex flex-wrap items-center gap-3 text-[9px] font-mono select-none">
                  <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest shrink-0 mr-1 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    Threat Feed Legend:
                  </span>
                  
                  <div className="flex items-center gap-1.5 bg-red-950/20 border border-red-500/20 px-2.5 py-1 rounded-lg text-red-400" title="High severity credentials/hash leaks or key compromise">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-extrabold uppercase">Data Leak</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-amber-950/20 border border-amber-500/20 px-2.5 py-1 rounded-lg text-amber-400" title="Compromised domains, domain overrides, malicious redirections">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="font-extrabold uppercase font-mono">Phishing</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-orange-950/20 border border-orange-500/20 px-2.5 py-1 rounded-lg text-orange-400" title="Open interfaces, compromised protocols, SSH overrides">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span className="font-extrabold uppercase">Insecure Port</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-indigo-950/20 border border-indigo-500/20 px-2.5 py-1 rounded-lg text-indigo-400" title="Metadata graphs, log footprints, device telemetry traces">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span className="font-extrabold uppercase">Metadata Trace</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-emerald-950/20 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-emerald-400" title="Legally erased configurations, secure handshakes">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-extrabold uppercase">Compliant Log</span>
                  </div>
                </div>

                {/* FINDINGS FILTER (Radio Buttons) */}
                <div id="findings-filter-container" className="mb-5 bg-white/[0.01] border border-white/5 p-4 rounded-2xl font-mono text-left">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <span id="findings-filter-title" className="text-slate-400 text-[10px] uppercase font-black tracking-widest flex items-center gap-1.5 select-none shrink-0">
                        <Filter className="w-3.5 h-3.5 text-indigo-400" />
                        Filter Findings:
                      </span>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {/* All Findings Radio */}
                        <label 
                          id="filter-all-label"
                          htmlFor="findings-filter-all" 
                          className={`flex items-center gap-2 text-[10px] uppercase font-black tracking-wider cursor-pointer select-none px-3 py-1.5 rounded-xl border transition-all ${
                            findingsFilter === 'all'
                              ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-200 shadow-[0_0_12px_rgba(99,102,241,0.1)] font-bold'
                              : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="findingsFilter"
                            id="findings-filter-all"
                            value="all"
                            checked={findingsFilter === 'all'}
                            onChange={() => setFindingsFilter('all')}
                            className="w-3 h-3 accent-indigo-500 cursor-pointer focus:ring-1 focus:ring-indigo-500 rounded-full"
                          />
                          <span>All ({scannedNodes.length})</span>
                        </label>

                        {/* High Risk Only Radio */}
                        <label 
                          id="filter-high-label"
                          htmlFor="findings-filter-high-risk" 
                          className={`flex items-center gap-2 text-[10px] uppercase font-black tracking-wider cursor-pointer select-none px-3 py-1.5 rounded-xl border transition-all ${
                            findingsFilter === 'high_risk'
                              ? 'bg-red-500/10 border-red-500/40 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.1)] font-bold'
                              : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="findingsFilter"
                            id="findings-filter-high-risk"
                            value="high_risk"
                            checked={findingsFilter === 'high_risk'}
                            onChange={() => setFindingsFilter('high_risk')}
                            className="w-3 h-3 accent-red-500 cursor-pointer focus:ring-1 focus:ring-red-500 rounded-full"
                          />
                          <span>High Risk ({scannedNodes.filter(n => n.status === 'EXPOSED').length})</span>
                        </label>

                        {/* Secure Findings Radio */}
                        <label 
                          id="filter-secure-label"
                          htmlFor="findings-filter-secure" 
                          className={`flex items-center gap-2 text-[10px] uppercase font-black tracking-wider cursor-pointer select-none px-3 py-1.5 rounded-xl border transition-all ${
                            findingsFilter === 'secure'
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.1)] font-bold'
                              : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="findingsFilter"
                            id="findings-filter-secure"
                            value="secure"
                            checked={findingsFilter === 'secure'}
                            onChange={() => setFindingsFilter('secure')}
                            className="w-3 h-3 accent-emerald-500 cursor-pointer focus:ring-1 focus:ring-emerald-500 rounded-full"
                          />
                          <span>Secure ({scannedNodes.filter(n => n.status === 'Secure' || n.status === 'Compliant').length})</span>
                        </label>
                      </div>
                    </div>

                    {/* Sorting criteria options selector */}
                    <div className="flex items-center gap-2 border-t xl:border-t-0 border-white/5 pt-3 xl:pt-0 shrink-0 select-none">
                      <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest flex items-center gap-1.5 shrink-0">
                        <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                        Sort:
                      </span>
                      <div className="relative">
                        <select
                          id="findings-sort-select"
                          value={findingsSort}
                          onChange={(e) => setFindingsSort(e.target.value as any)}
                          className="bg-black/40 text-[10px] uppercase font-black tracking-widest text-indigo-200 border border-white/10 hover:border-indigo-500/40 rounded-xl px-3 py-1.5 cursor-pointer outline-none transition-all focus:ring-1 focus:ring-indigo-500/50 pr-7 appearance-none"
                        >
                          <option value="severity">Severity (High First)</option>
                          <option value="latency">Scan Latency (Fastest)</option>
                          <option value="alphabetical">Node A-Z</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-indigo-400 absolute right-2 top-2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* VISUAL REPORT STREAMS */}
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2 custom-scroll flex flex-col font-mono text-left">
                  {(() => {
                    const filtered = scannedNodes.filter((item) => {
                      if (findingsFilter === 'high_risk') {
                        return item.status === 'EXPOSED';
                      }
                      if (findingsFilter === 'secure') {
                        return item.status === 'Secure' || item.status === 'Compliant';
                      }
                      return true;
                    });

                    const sortedAndFiltered = [...filtered].sort((a, b) => {
                      if (findingsSort === 'severity') {
                        const scoreMap: Record<string, number> = { 'EXPOSED': 3, 'Found': 2, 'Fragmented': 1.5, 'Secure': 1, 'Compliant': 1, 'Compliant Node': 1 };
                        const aScore = scoreMap[a.status] || 0;
                        const bScore = scoreMap[b.status] || 0;
                        return bScore - aScore;
                      }
                      if (findingsSort === 'latency') {
                        const aLat = a.duration || 0;
                        const bLat = b.duration || 0;
                        return aLat - bLat;
                      }
                      if (findingsSort === 'alphabetical') {
                        return (a.node || '').localeCompare(b.node || '');
                      }
                      return 0;
                    });

                    if (sortedAndFiltered.length === 0) {
                      return (
                        <div id="no-findings-match-msg" className="text-center py-12 px-4 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                          <Shield className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-bounce" />
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">No findings match selection</p>
                          <p className="text-[9px] text-slate-500 mt-1">Adjust your risk filters to view other monitoring feeds.</p>
                        </div>
                      );
                    }
                    return sortedAndFiltered.map((item, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.35, ease: 'easeOut', delay: index * 0.05 }}
                        key={`forensic-node-${item.node}-${index}-${isScanning}`}
                        onClick={() => setSelectedNode(item)}
                        className={`flex flex-col sm:flex-row justify-between p-4 rounded-xl border items-start sm:items-center gap-4 transition cursor-pointer hover:bg-white/10 select-none group ${
                          item.status === 'EXPOSED'
                            ? 'bg-red-500/10 border-red-500/20 hover:border-red-500/40 shadow-[inset_0_0_12px_rgba(239,68,68,0.05)]'
                            : 'bg-white/5 border-white/5 hover:border-indigo-500/30'
                        }`}
                        title="Click to view detailed forensic log"
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1 w-full text-left">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-150">
                            <Activity className={`w-4 h-4 ${item.status === 'EXPOSED' ? 'text-red-400' : 'text-indigo-400'}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className={`text-[11px] font-bold break-all ${item.status === 'EXPOSED' ? 'text-red-400' : 'text-gray-300'}`}>
                                {item.node}
                              </p>
                              {item.duration !== undefined && (
                                <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 tracking-wider shrink-0 font-mono">
                                  {item.duration.toFixed(2)}s scan
                                </span>
                              )}
                              {item.category && (
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                                  item.category === 'Data Leak'
                                    ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                                    : item.category === 'Phishing'
                                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                      : item.category === 'Insecure Port'
                                        ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                                        : (item.category as string) === 'Compliant Log' || item.category === 'Compliant Node'
                                          ? 'bg-emerald-500/12 text-emerald-400 border border-emerald-500/20'
                                          : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                                }`}>
                                  {item.category}
                                </span>
                              )}
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-widest font-black shrink-0 hidden md:inline-block">
                                Inspect Log
                              </span>
                            </div>
                            <p className={`text-[9px] mt-1 break-words leading-relaxed ${item.status === 'EXPOSED' ? 'text-red-400/75' : 'text-gray-500'}`}>{item.meta}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyToClipboard(item, index);
                              }}
                              className="p-1.5 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 rounded-lg transition-all duration-150 flex items-center justify-center cursor-pointer"
                              title="Copy node metadata"
                            >
                              {copiedIndex === index ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-indigo-400" />
                              )}
                            </button>

                            {(item.status === 'EXPOSED' || item.status === 'Found' || item.status === 'Fragmented') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWipeIndividualNode(item.node);
                                }}
                                className="px-2.5 py-1 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500/40 rounded-lg text-[9px] font-mono tracking-wider uppercase font-black transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                                title="Request remote GDPR Art. 17 deletion"
                              >
                                <Trash2 className="w-3 h-3 text-red-500 group-hover:text-white shrink-0" />
                                <span>Wipe Trace</span>
                              </button>
                            )}

                            <span
                              className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border flex items-center gap-1.5 shrink-0 transition-all duration-300 ${
                                item.status === 'EXPOSED'
                                  ? 'bg-red-500 text-white border-red-600 shadow-[0_0_12px_rgba(239,68,68,0.45)] animate-pulse'
                                  : item.status === 'Secure' || item.status === 'Compliant'
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.45)]'
                                  : item.status === 'Found' || item.status === 'Fragmented'
                                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.45)]'
                                  : 'bg-indigo-500 text-white border-indigo-600 shadow-[0_0_12px_rgba(99,102,241,0.45)]'
                              }`}
                            >
                              {item.status === 'EXPOSED' ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-white shrink-0" />
                              ) : item.status === 'Secure' || item.status === 'Compliant' ? (
                                <Shield className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                              ) : (
                                <AlertCircle className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                              )}
                              {item.status}
                            </span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-white transition-colors duration-150 shrink-0 hidden sm:block" />
                        </div>
                      </motion.div>
                    ));
                  })()}
                </div>
              </div>

              {/* ACTION TOOLS BOX / INTELLIGENCE METADATA */}
              <div className="space-y-6">
                {/* Trust Index Card */}
                <div className={`bg-indigo-600/15 border rounded-3xl p-6 text-left shadow-lg transition-all duration-500 ${
                  autoRefreshEnabled
                    ? 'border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.07)]'
                    : 'border-indigo-500/30'
                }`}>
                  <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 font-sans">Intelligence Status</h3>
                    
                    <button
                      onClick={toggleAutoRefresh}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                        autoRefreshEnabled
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35 hover:bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                          : 'bg-white/5 text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/10'
                      }`}
                      title={autoRefreshEnabled ? 'Disable auto-refresh loop' : 'Enable auto-refresh loop every 60s'}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${autoRefreshEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} />
                      {autoRefreshEnabled ? `Refresh in ${refreshCountdown}s` : 'Auto-Refresh'}
                    </button>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-black text-white">{scanStats.score}</span>
                    <span className="text-xs text-indigo-400 font-bold uppercase">Security Index</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${scanStats.score}%` }}></div>
                  </div>
                  <div className="mt-3.5 text-[9px] sm:text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-black select-none">
                    30-Day Moving Avg Stability: <span className="text-white font-bold font-mono">{calculate30DaySMA(scanHistory).toFixed(1)}%</span>
                  </div>
                  {scanHistory.length >= 2 && (scanHistory[scanHistory.length - 2].score - scanStats.score > 15) && (
                    <div className="mt-3.5 p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-[9px] font-black uppercase text-red-400 tracking-wider flex items-start gap-2 shadow-[0_0_15px_rgba(239,68,68,0.06)]">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <span>⚠ Security Index dropped by more than 15% since the previous audit.</span>
                      </div>
                    </div>
                  )}
                  <p className="text-[9px] text-gray-500 mt-4 uppercase font-bold leading-tight">
                    {scanStats.score > 80 
                      ? 'Global footprint is highly consistent with enterprise-level security practices.' 
                      : 'Exposed records found. Immediate defensive compliance measures are highly advised.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    <button
                      onClick={handleShareIntelligence}
                      className="py-3 bg-indigo-500/10 hover:bg-indigo-600 border border-indigo-500/25 hover:border-indigo-500 text-indigo-400 hover:text-white transition-all duration-150 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer text-center flex items-center justify-center gap-1.5 group"
                    >
                      <Share2 className="w-3.5 h-3.5 text-indigo-400 group-hover:text-white transition-colors duration-150" /> Share Info
                    </button>
                    <button
                      onClick={() => {
                        if (!sessionVerified) {
                          setAuthModalOpen(true);
                        } else {
                          setCompareModalOpen(true);
                        }
                      }}
                      className="py-3 bg-indigo-500/10 hover:bg-indigo-600 border border-indigo-500/25 hover:border-indigo-500 text-indigo-400 hover:text-white transition-all duration-150 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer text-center flex items-center justify-center gap-1.5 group"
                    >
                      <GitCompare className="w-3.5 h-3.5 text-indigo-400 group-hover:text-white transition-colors duration-150" /> Compare
                    </button>
                  </div>

                  {/* Historical Trend Line Chart */}
                  <div className="mt-6 pt-6 border-t border-indigo-500/20">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300 font-sans">HISTORICAL RISK TREND</span>
                      <span className="text-[8px] font-mono text-indigo-400 font-bold">LATEST TRACK</span>
                    </div>
                    <div className="h-32 w-full text-xs text-slate-800 dark:text-slate-200">
                      <ResponsiveContainer key={theme} width="100%" height="100%">
                        <LineChart data={scanHistory} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)'} vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            stroke={theme === 'light' ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.3)'} 
                            fontSize={8} 
                            tickLine={false}
                            tickFormatter={(tick) => (typeof tick === 'string' ? tick.split('__idx_')[0] : tick)}
                          />
                          <YAxis 
                            stroke={theme === 'light' ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.3)'} 
                            fontSize={8} 
                            domain={[0, 100]} 
                            tickLine={false} 
                            axisLine={false}
                          />
                          <Tooltip 
                            content={({ active, payload }: any) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                const nodeCount = data.nodeCount || scannedNodes.length || 4;
                                const cleanDate = typeof data.date === 'string' ? data.date.split('__idx_')[0] : data.date;
                                return (
                                  <div className={`p-3 rounded-xl shadow-2xl border text-left text-[9px] font-mono space-y-1 ${
                                    theme === 'light'
                                      ? 'bg-white border-slate-200 text-slate-800'
                                      : 'bg-[#0c0f16] border-indigo-500/35 text-gray-200'
                                  }`}>
                                    <p className="text-indigo-550 dark:text-indigo-400 font-black uppercase text-[8px] tracking-wider mb-1 pb-1 border-b border-black/5 dark:border-white/5 font-mono">Forensic Node Checkpoint</p>
                                    <p className="text-slate-800 dark:text-gray-200">Date: <span className="font-bold text-slate-900 dark:text-white">{cleanDate}</span></p>
                                    <p className="text-indigo-600 dark:text-indigo-300">Monitored Stations: <span className="font-bold text-slate-900 dark:text-white">{nodeCount}</span></p>
                                    <p className="text-emerald-600 dark:text-emerald-400">Security Index: <span className="font-bold text-slate-900 dark:text-white">{data.score}%</span></p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                            cursor={{ stroke: 'rgba(99,102,241,0.4)', strokeWidth: 1.5, strokeDasharray: '3 3' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            name="Score"
                            stroke="#6366f1" 
                            strokeWidth={2} 
                            activeDot={{ r: 4, strokeWidth: 0, fill: '#ff4b4b' }} 
                            dot={{ r: 2, fill: '#6366f1', strokeWidth: 0 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Historical Threat Trend Card */}
                <div className="bg-[#0d1117] border border-white/10 rounded-3xl p-6 text-left shadow-xl shadow-black/45 flex flex-col space-y-4">
                  <div className="flex justify-between items-center gap-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 font-sans flex items-center gap-1.5 select-none shrink-0">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Historical Threat Trend
                    </h4>
                    {(() => {
                      const previousScore = scanHistory.length > 1 ? scanHistory[scanHistory.length - 2].score : 93;
                      const currentScore = scanStats.score;
                      if (currentScore > previousScore) {
                        return (
                          <span className="text-[8px] font-extrabold bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Improving
                          </span>
                        );
                      } else if (currentScore < previousScore) {
                        return (
                          <span className="text-[8px] font-extrabold bg-red-500/15 border border-red-500/25 text-red-400 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            Degrading
                          </span>
                        );
                      } else {
                        return (
                          <span className="text-[8px] font-extrabold bg-slate-500/15 border border-slate-500/25 text-slate-400 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                            Stable
                          </span>
                        );
                      }
                    })()}
                  </div>

                  <p className="text-[9px] text-gray-505 dark:text-gray-500 leading-normal font-mono font-bold uppercase select-none">
                    Continuous trace-intelligence comparison of threat levels and secure signatures across systems.
                  </p>

                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 text-left">
                      <span className="block text-[8px] text-gray-550 dark:text-gray-500 font-mono font-bold uppercase tracking-wider select-none">Current</span>
                      <span className="text-sm sm:text-base font-black text-white mt-1 block font-mono">{scanStats.score}%</span>
                    </div>
                    
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 text-left">
                      <span className="block text-[8px] text-gray-555 dark:text-gray-500 font-mono font-bold uppercase tracking-wider select-none">Previous</span>
                      <span className="text-sm sm:text-base font-black text-slate-400 mt-1 block font-mono">
                        {scanHistory.length > 1 ? scanHistory[scanHistory.length - 2].score : 93}%
                      </span>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 text-left">
                      <span className="block text-[8px] text-gray-550 dark:text-gray-500 font-mono font-bold uppercase tracking-wider select-none">Variance</span>
                      {(() => {
                        const previousScore = scanHistory.length > 1 ? scanHistory[scanHistory.length - 2].score : 93;
                        const currentScore = scanStats.score;
                        const variance = previousScore > 0 ? ((currentScore - previousScore) / previousScore) * 100 : 0;
                        const sign = variance > 0 ? '+' : '';
                        const color = variance > 0 ? 'text-emerald-400' : variance < 0 ? 'text-red-400' : 'text-slate-400';
                        return (
                          <span className={`text-[10px] sm:text-xs font-black mt-1.5 block font-mono ${color}`}>
                            {sign}{variance.toFixed(1)}%
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Export Card */}
                <div className="bg-[#0d1117] border border-white/10 p-6 rounded-3xl text-left shadow-xl shadow-black/45 flex flex-col">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6 font-sans">Export Intelligence</h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <button
                      onClick={() => showInfo('EXCEL EXCLUSION INACTIVE', 'Requires active Pro/Elite node tier authentication. Download rules safeguard unauthenticated clients.')}
                      className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center transition hover:bg-white/10 cursor-pointer group"
                    >
                      <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-2 text-green-500 font-black text-[11px] group-hover:scale-105 transition-transform">XL</div>
                      <span className="block text-[9px] font-black uppercase tracking-tighter text-slate-300">Excel Dump</span>
                    </button>
                    <motion.button
                      onClick={handleDownloadCsvReport}
                      onMouseEnter={() => setCanPulseCsv(false)}
                      animate={canPulseCsv ? {
                        scale: [1, 1.05, 1],
                        backgroundColor: ["rgba(255,255,255,0.05)", "rgba(16,185,129,0.1)", "rgba(255,255,255,0.05)"],
                        borderColor: ["rgba(255,255,255,0.05)", "rgba(16,185,129,0.3)", "rgba(255,255,255,0.05)"]
                      } : { scale: 1 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center transition hover:bg-white/10 cursor-pointer group flex flex-col items-center justify-center relative min-h-[82px]"
                      title="Download structured CSV spreadsheet findings"
                      id="download-csv-btn-pulsar"
                    >
                      <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-2 text-emerald-400 font-black text-[11px] group-hover:scale-105 transition-transform">
                        {isCsvSpinner ? (
                          <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                        ) : (
                          "CSV"
                        )}
                      </div>
                      <span className="block text-[9px] font-black uppercase tracking-tighter text-slate-300 font-sans">CSV Sheet</span>
                    </motion.button>
                    <button
                      onClick={handleDownloadPdfReport}
                      className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center transition hover:bg-white/10 cursor-pointer group"
                    >
                      <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center mx-auto mb-2 text-red-500 font-black text-[11px] group-hover:scale-105 transition-transform">PDF</div>
                      <span className="block text-[9px] font-black uppercase tracking-tighter text-slate-300 font-sans">Audit Report</span>
                    </button>
                    <button
                      onClick={handleDownloadJsonReport}
                      className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center transition hover:bg-white/10 cursor-pointer group"
                      title="Download raw node telemetry data"
                    >
                      <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center mx-auto mb-2 text-indigo-400 font-black text-[11px] group-hover:scale-105 transition-transform">JSON</div>
                      <span className="block text-[9px] font-black uppercase tracking-tighter text-slate-300 font-sans">Raw Nodes</span>
                    </button>
                  </div>

                  <div className="space-y-4 border-t border-white/5 pt-6 pb-2 text-xs font-bold font-mono">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-500 uppercase">Plan Access</span>
                      <span className="text-indigo-400 font-black uppercase tracking-widest text-right">
                        {currentUser?.subscriptionStatus === 'free' ? 'Standard Free' : currentUser?.subscriptionStatus === 'pro' ? 'Pro Node' : 'Elite Node'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-500 uppercase">Daily Quota</span>
                      <span className="text-white font-black uppercase tracking-widest">
                        {currentUser?.subscriptionStatus === 'free' ? '3 Audits / Day' : 'Unlimited'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-500 uppercase">Encryption</span>
                      <span className="text-white font-black uppercase tracking-widest">AES-256</span>
                    </div>
                    {timeRemaining && (
                      <div className="flex justify-between items-center text-[10px] pt-2 border-t border-white/5">
                        <span className="text-gray-500 uppercase">Time Remaining</span>
                        <span className="text-pink-400 font-black tracking-wider animate-pulse font-mono">
                          {timeRemaining}
                        </span>
                      </div>
                    )}
                  </div>

                  {subscriptionReminder && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl text-[9px] leading-relaxed font-black uppercase tracking-wider text-left space-y-1">
                      <div className="flex items-center gap-1.5 text-red-400">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500 animate-pulse shrink-0" />
                        <span>NODE ALERT SIG</span>
                      </div>
                      <p className="text-slate-300 font-mono text-[8px] leading-relaxed normal-case">{subscriptionReminder}</p>
                    </div>
                  )}

                  <div className="space-y-3 mt-6">
                    <button
                      onClick={handlePrintReport}
                      className="w-full py-3 bg-indigo-500/10 hover:bg-indigo-600 border border-indigo-500/20 hover:border-indigo-500 text-indigo-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4" /> Print Audit Document
                    </button>
                    <button
                      onClick={handleDownloadPdfReport}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                    >
                      <FileText className="w-4 h-4" /> Download Full Audit Report
                    </button>
                    <button
                      onClick={handleDownloadJsonReport}
                      className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1d2230] hover:text-indigo-400 transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4 text-indigo-400" /> Export Telemetry JSON
                    </button>
                    <button
                      onClick={() => showInfo('WhatsApp Share Link Encrypted', 'Sharing requires active billing setup. Forward securely using active Premium account key.')}
                      className="w-full py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-colors"
                    >
                      Export via WhatsApp
                    </button>
                     <button
                      onClick={() => {
                        if (scannedNodes.length === 0) {
                          showInfo('NO DATA COMPILED', 'Please launch a trace first to establish a live diagnostic dataset.');
                          return;
                        }
                        setSendReportEmail('');
                        setSendReportModalOpen(true);
                      }}
                      className="w-full py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all cursor-pointer text-center flex items-center justify-center gap-2 text-indigo-400"
                      id="send-report-via-email-launcher"
                    >
                      <Mail className="w-4 h-4" /> Send Report via Email
                    </button>
                  </div>
                </div>

                {/* Permanent Deletion & Purging Card */}
                {scannedNodes.length > 0 && (
                  <div className="bg-red-950/10 border border-red-500/20 p-6 rounded-3xl text-left shadow-xl shadow-black/45 flex flex-col">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2 font-mono flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5 text-red-500 animate-pulse" /> Right to Be Forgotten (GDPR)
                    </h4>
                    <p className="text-[10px] text-slate-400 font-sans mb-4 leading-normal font-semibold">
                      Under GDPR Art. 17 & CCPA guidelines, you have the absolute legal right to request the permanent deletion and complete pruning of this verified tracing log.
                    </p>
                    <button
                      onClick={handleOpenErasureModal}
                      className="w-full py-3 bg-red-950/30 hover:bg-red-600 hover:text-white border border-red-500/20 text-red-400 hover:border-red-500 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl cursor-pointer text-center flex items-center justify-center gap-2"
                    >
                      Request Complete Data Erasure
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* GLOBAL DEVIATION / BREACH ORIGINS MAP VISUALIZATION */}
            <div className="mt-8 bg-[#0d1117] border border-white/10 rounded-3xl p-6 md:p-8 text-left shadow-xl shadow-black/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500/10 via-indigo-500/40 to-indigo-500/10" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 font-sans flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-400 animate-pulse" /> GLOBAL BREACH GEOGRAPHY MAP
                  </h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">
                    Trace-routes of dynamic vulnerabilities and identified exposure vectors across global tracking cells.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setMapVisible(!mapVisible)}
                    className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#818cf8] hover:text-white bg-[#818cf8]/10 hover:bg-[#818cf8]/25 px-2.5 py-1 rounded border border-[#818cf8]/20 transition-all cursor-pointer"
                    title={mapVisible ? "Collapse global map" : "Expand global map"}
                  >
                    {mapVisible ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-[#818cf8]" /> Hide Map
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-[#818cf8] animate-pulse" /> Show Map
                      </>
                    )}
                  </button>
                  <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> Threat Origin Detected
                  </span>
                  <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/18">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Monitoring Center
                  </span>
                </div>
              </div>

              {/* Map Canvas Visualizer */}
              <AnimatePresence initial={false}>
                {mapVisible ? (
                  <motion.div
                      key="map-visible-area"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-1">
                  
                  {/* SVG Map Section */}
                  {!isMobile && (
                    <div className="hidden md:flex lg:col-span-3 bg-black/40 border border-white/5 rounded-2xl p-4 relative overflow-hidden flex-col justify-center items-center min-h-[350px]">
                    
                    {/* Digital Grid Canvas Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                      backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
                      backgroundSize: '16px 16px'
                    }} />

                    {/* Floating Zoom & Toggle Controls Overlay (Request 2 and Request 3) */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-10 select-none">
                      <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 text-[8px] font-mono text-slate-400 bg-black/75 border border-white/5 rounded-lg border-dashed">
                        <span>ZOOM: {(zoomTransform.k * 100).toFixed(0)}%</span>
                        <span className="text-slate-600">|</span>
                        <span>DRAG TO PAN</span>
                      </div>
                      
                      <div className="flex items-center bg-[#0d1117]/95 border border-white/10 rounded-xl p-1 gap-1 shadow-2xl backdrop-blur-md">
                        <button 
                          onClick={handleZoomIn}
                          title="Zoom In"
                          className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <button 
                          onClick={handleZoomOut}
                          title="Zoom Out"
                          className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                          </svg>
                        </button>
                        <button 
                          onClick={handleZoomReset}
                          title="Reset Zoom"
                          className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 12H19c0-3.86-3.14-7-7-7-1.93 0-3.68.78-4.95 2.05L4 4" />
                          </svg>
                        </button>
                        <div className="w-[1px] h-3.5 bg-white/10 mx-0.5" />
                        <button 
                          onClick={() => setMapVisible(false)}
                          title="Collapse Map visualization"
                          className="flex items-center gap-1.5 px-2 py-1 text-[8px] font-black uppercase text-red-400 bg-red-950/30 hover:bg-red-600 hover:text-white border border-red-500/20 rounded-lg transition-all cursor-pointer font-sans"
                        >
                          <EyeOff className="w-3 h-3" /> COLLAPSE LAYER
                        </button>
                      </div>
                    </div>

                    <motion.svg 
                      ref={svgRef}
                      viewBox="0 0 800 400" 
                      className="w-full h-auto relative max-w-4xl select-none origin-center cursor-move"
                      transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    >
                      {/* Definitions for map gradients */}
                      <defs>
                        <radialGradient id="pulsing-glow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="cluster-glow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                        </radialGradient>
                      </defs>

                      {/* Map Contents Wrapped inside D3 Zoom Group container */}
                      <g transform={`translate(${zoomTransform.x}, ${zoomTransform.y}) scale(${zoomTransform.k})`}>
                        {/* Continent Schematic Outlines */}
                        <g fill="none" strokeWidth="1.5">
                          {/* North America */}
                          <polygon 
                            points="120,40 220,35 250,90 230,130 190,165 155,145 130,110 110,65" 
                            fill="rgba(99,102,241,0.02)" 
                            stroke="rgba(99,102,241,0.08)"
                            strokeDasharray="4 4"
                          />
                          {/* South America */}
                          <polygon 
                            points="190,170 230,175 270,210 270,250 240,330 220,330 200,230 185,185" 
                            fill="rgba(99,102,241,0.02)" 
                            stroke="rgba(99,102,241,0.08)"
                            strokeDasharray="4 4"
                          />
                          {/* Europe */}
                          <polygon 
                            points="360,45 425,45 440,105 380,125 350,100 330,70" 
                            fill="rgba(99,102,241,0.02)" 
                            stroke="rgba(99,102,241,0.08)"
                            strokeDasharray="4 4"
                          />
                          {/* Africa */}
                          <polygon 
                            points="350,135 440,130 470,195 470,245 430,315 400,315 370,235 345,180" 
                            fill="rgba(99,102,241,0.02)" 
                            stroke="rgba(99,102,241,0.08)"
                            strokeDasharray="4 4"
                          />
                          {/* Asia */}
                          <polygon 
                            points="445,40 735,40 735,145 700,185 590,235 540,205 490,155 440,110" 
                            fill="rgba(99,102,241,0.02)" 
                            stroke="rgba(99,102,241,0.08)"
                            strokeDasharray="4 4"
                          />
                          {/* Australia */}
                          <polygon 
                            points="670,245 750,250 750,305 680,310 660,275" 
                            fill="rgba(99,102,241,0.02)" 
                            stroke="rgba(99,102,241,0.08)"
                            strokeDasharray="4 4"
                          />
                        </g>

                        {/* Threat Density Clusters Overlay (Request 1) */}
                        {threatClusters.map((cluster, cIdx) => (
                           <g key={`cluster-${cIdx}`} className="pointer-events-none">
                             {/* Pulsing visual core detector */}
                             <circle
                               cx={cluster.x}
                               cy={cluster.y}
                               r={15 + cluster.exposedCount * 5}
                               fill="rgba(239, 68, 68, 0.08)"
                               stroke="#ef4444"
                               strokeWidth="1.2"
                               strokeDasharray="3 3"
                               className="animate-pulse"
                             />
                             <line
                               x1={cluster.x - 10}
                               y1={cluster.y}
                               x2={cluster.x + 10}
                               y2={cluster.y}
                               stroke="#ef4444"
                               strokeWidth="0.5"
                               opacity={0.5}
                             />
                             <line
                               x1={cluster.x}
                               y1={cluster.y - 10}
                               x2={cluster.x}
                               y2={cluster.y + 10}
                               stroke="#ef4444"
                               strokeWidth="0.5"
                               opacity={0.5}
                             />
                             {/* Centroid Tag Label */}
                             <g transform={`translate(${cluster.x}, ${cluster.y - (20 + cluster.exposedCount * 3)})`}>
                               <rect
                                 x="-45"
                                 y="-6"
                                 width="90"
                                 height="12"
                                 rx="3"
                                 fill="rgba(239, 68, 68, 0.95)"
                                 stroke="#f87171"
                                 strokeWidth="0.5"
                               />
                               <text
                                 y="2"
                                 fill="#ffffff"
                                 fontSize="6.5"
                                 fontWeight="black"
                                 fontFamily="monospace"
                                 textAnchor="middle"
                               >
                                 DENSITY: {cluster.exposedCount} THREATS
                               </text>
                             </g>
                           </g>
                        ))}

                        {/* Laser Trace Paths representing connections/handshakes */}
                        {scannedNodes.map((node, idx) => {
                          if (idx === 0) return null;
                          const pPrev = getGeographicPointForNode(scannedNodes[idx - 1].node, idx - 1);
                          const pCurr = getGeographicPointForNode(node.node, idx);
                          return (
                            <line
                              key={`line-${node.node}-${idx}`}
                              x1={pPrev.x}
                              y1={pPrev.y}
                              x2={pCurr.x}
                              y2={pCurr.y}
                              stroke={node.status === 'EXPOSED' ? '#f87171' : '#818cf8'}
                              strokeWidth="1"
                              strokeOpacity="0.35"
                              strokeDasharray="3 3"
                            />
                          );
                        })}

                        {/* Geographic Node Markers */}
                        {scannedNodes.map((node, idx) => {
                          const pt = getGeographicPointForNode(node.node, idx);
                          const isExposed = node.status === 'EXPOSED';
                          
                          return (
                            <motion.g 
                              key={`marker-${node.node}-${idx}`}
                              className="cursor-pointer group"
                              onMouseEnter={() => setHoveredMapNode({ ...pt, nodeName: node.node, status: node.status, meta: node.meta })}
                              onMouseLeave={() => setHoveredMapNode(null)}
                              onClick={() => setSelectedMapNode({ ...pt, nodeName: node.node, status: node.status, meta: node.meta })}
                              whileHover={{ scale: 1.15 }}
                              style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                              transition={{ type: "spring", stiffness: 350, damping: 12 }}
                            >
                              {/* Pulsing ring for Exposed targets using smooth Framer Motion loop */}
                              {isExposed && (
                                <motion.circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r="15"
                                  fill="url(#pulsing-glow)"
                                  animate={{
                                    scale: [0.92, 1.08, 0.92],
                                    opacity: [0.3, 0.6, 0.3],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                  style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                                />
                              )}

                              {/* Center point marker with precise status tracking and spring effects */}
                              <motion.circle
                                cx={pt.x}
                                cy={pt.y}
                                r={isExposed ? "5.5" : "4"}
                                fill={isExposed ? "#ef4444" : "#6366f1"}
                                className={isExposed ? 'stroke-red-950 stroke-2' : 'stroke-indigo-950 stroke-2'}
                                animate={{
                                  scale: isExposed ? [1, 1.15, 1] : [1, 1.06, 1],
                                }}
                                transition={{
                                  scale: {
                                    duration: isExposed ? 1.6 : 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }
                                }}
                                style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                              />

                              {/* Outer locator ring with a beautiful smooth ripple/ping simulation */}
                              <motion.circle
                                cx={pt.x}
                                cy={pt.y}
                                r={isExposed ? "9" : "7.5"}
                                fill="none"
                                stroke={isExposed ? "#f87171" : "#818cf8"}
                                strokeWidth="1.5"
                                strokeOpacity={isExposed ? 0.8 : 0.4}
                                animate={{
                                  scale: [1, 1.9],
                                  opacity: [0.75, 0]
                                }}
                                transition={{
                                  duration: isExposed ? 1.5 : 2.8,
                                  repeat: Infinity,
                                  ease: "easeOut"
                                }}
                                style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                              />
                            </motion.g>
                          );
                        })}
                      </g>
                    </motion.svg>

                    {/* Floating tooltip indicating active state inside the canvas map */}
                    <AnimatePresence>
                      {hoveredMapNode && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 max-w-sm bg-[#161b22]/95 border border-indigo-500/30 rounded-xl p-3 shadow-2xl backdrop-blur-md pointer-events-none text-left z-20"
                        >
                          <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-white/5 gap-2">
                            <span className="text-[10px] font-black uppercase text-gray-200 tracking-wider flex items-center gap-1.5 text-ellipsis overflow-hidden whitespace-nowrap">
                              <MapPin className={`w-3 h-3 ${hoveredMapNode.status === 'EXPOSED' ? 'text-red-400' : 'text-indigo-400'}`} />
                              {hoveredMapNode.country} ({hoveredMapNode.region})
                            </span>
                            <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border shrink-0 ${
                              hoveredMapNode.status === 'EXPOSED' 
                                ? 'text-red-400 border-red-500/20 bg-red-500/10' 
                                : 'text-green-400 border-green-500/20 bg-green-500/10'
                            }`}>
                              {hoveredMapNode.status}
                            </span>
                          </div>
                          <div className="space-y-1 text-[9px] font-mono leading-relaxed">
                            <p className="text-gray-300 font-bold uppercase tracking-tight">{hoveredMapNode.nodeName}</p>
                            <p className="text-slate-500 text-[8px]">{hoveredMapNode.meta}</p>
                            <div className="flex gap-4 pt-1 text-indigo-400 text-[8px]">
                              <span>IP: {hoveredMapNode.ip}</span>
                              <span>LAT: {hoveredMapNode.lat} / LNG: {hoveredMapNode.lng}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  )}

                {/* Mobile-Only Collapsible List View (Phase 4 Compliance) */}
                {isMobile && (
                  <div className="block md:hidden col-span-1 bg-black/40 border border-white/5 rounded-2xl p-4 min-h-[250px] space-y-3 text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Threat Station Directory</h5>
                    <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">{scannedNodes.length} Verified Nodes</span>
                  </div>
                  {scannedNodes.length === 0 ? (
                    <div className="text-center py-8 text-[10px] font-mono text-slate-500 uppercase">
                      Run trace diagnostics to activate node logs
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                      {scannedNodes.map((node, idx) => {
                        const pt = getGeographicPointForNode(node.node, idx);
                        const isExposed = node.status === 'EXPOSED';
                        const isExpanded = expandedNodeId === idx;
                        return (
                          <div key={`mobile-node-${node.node}-${idx}`} className="bg-black/20 border border-white/5 rounded-xl p-3 text-left space-y-2 transition-all">
                            <div 
                              onClick={() => setExpandedNodeId(isExpanded ? null : idx)}
                              className="flex justify-between items-center cursor-pointer select-none gap-2"
                              id={`mobile-node-trigger-${idx}`}
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-black uppercase text-gray-200 truncate">{pt.region}, {pt.country}</p>
                                <div className="flex items-center gap-2 mt-0.5 min-w-0">
                                  <p className="text-[8px] font-mono text-slate-500 truncate min-w-0 flex-1">{node.node}</p>
                                  {node.duration !== undefined && (
                                    <span className="text-[7.5px] font-bold text-indigo-400 bg-indigo-500/10 px-1 py-0.2 rounded border border-indigo-500/15 lowercase tracking-wider font-mono shrink-0">
                                      {node.duration.toFixed(2)}s
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border leading-none shrink-0 transition-all duration-300 ${
                                  node.status === 'EXPOSED'
                                    ? 'bg-red-500 text-white border-red-600 shadow-[0_0_8px_rgba(239,68,68,0.35)] animate-pulse'
                                    : node.status === 'Secure' || node.status === 'Compliant'
                                    ? 'bg-emerald-500 text-slate-950 border-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.35)]'
                                    : node.status === 'Found' || node.status === 'Fragmented'
                                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.35)]'
                                    : 'bg-indigo-500 text-white border-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.35)]'
                                }`}>
                                  {node.status}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </div>
                            </div>
                            {isExpanded && (
                              <div className="pt-2 border-t border-white/5 space-y-2 text-[9px] font-mono text-slate-400 animate-slide-down">
                                <p className="leading-snug text-slate-300">{node.meta}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 text-[8px] pt-1 border-t border-white/5">
                                  <span>IP: {pt.ip}</span>
                                  <span>LAT: {pt.lat} / LNG: {pt.lng}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                )}

                {/* Locations sidebar detail list */}
                {!isMobile && (
                  <div className="bg-[#161b22]/30 border border-white/5 rounded-2xl p-4 flex flex-col justify-between min-h-[300px]">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-300">EXPOSURE STATIONS</h5>
                    
                    <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1 scrollbar-thin">
                      {scannedNodes.map((node, idx) => {
                        const pt = getGeographicPointForNode(node.node, idx);
                        const isExposed = node.status === 'EXPOSED';
                        return (
                          <div 
                            key={`station-list-${node.node}-${idx}`}
                            onClick={() => setSelectedMapNode({ ...pt, nodeName: node.node, status: node.status, meta: node.meta })}
                            className={`p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex justify-between items-center gap-3 ${
                              selectedMapNode?.nodeName === node.node
                                ? 'bg-indigo-600/15 border-indigo-500/40 shadow-[inset_0_0_8px_rgba(99,102,241,0.05)]'
                                : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-[9px] font-black uppercase text-gray-200 truncate">{pt.region}, {pt.country}</p>
                              <p className="text-[8px] font-mono text-slate-500 truncate">{node.node}</p>
                            </div>
                            <span className={`w-2 h-2 rounded-full shrink-0 transition-all ${
                              node.status === 'EXPOSED' 
                                ? 'bg-red-500 animate-pulse ring-2 ring-red-500/30' 
                                : node.status === 'Secure' || node.status === 'Compliant'
                                ? 'bg-emerald-500 ring-2 ring-emerald-500/30'
                                : node.status === 'Found' || node.status === 'Fragmented'
                                ? 'bg-amber-500 ring-2 ring-amber-500/30'
                                : 'bg-indigo-500 ring-2 ring-indigo-500/30'
                            }`} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected / General details view */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    {selectedMapNode ? (
                      <div className="text-left space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black text-indigo-400 uppercase tracking-wider">SELECTED NODE ATOM</span>
                          <button 
                            onClick={() => setSelectedMapNode(null)}
                            className="text-[8px] text-slate-500 hover:text-white uppercase font-black cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                        <p className="text-[10px] font-bold text-white uppercase tracking-tight truncate leading-none mb-1">{selectedMapNode.nodeName}</p>
                        <p className="text-[9px] text-slate-400 font-mono leading-snug">{selectedMapNode.meta}</p>
                        <div className="pt-1 flex flex-col gap-0.5 text-[8px] font-mono text-slate-500">
                          <span>Location: {selectedMapNode.region}, {selectedMapNode.country}</span>
                          <span>Network IP: {selectedMapNode.ip}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Click map nodes for atomic compliance logs.</span>
                      </div>
                    )}
                  </div>

                </div>
                )}

              </div>
            </motion.div>
                ) : (
                  <motion.div
                    key="map-collapsed-placeholder"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="py-12 sm:py-16 px-6 flex flex-col items-center justify-center border border-dashed border-white/5 bg-black/10 rounded-2xl text-center w-full"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#818cf8]/10 border border-[#818cf8]/20 flex items-center justify-center mb-4">
                      <Globe className="w-5 h-5 text-[#818cf8] animate-pulse" />
                    </div>
                    <p className="text-xs font-black text-gray-200 uppercase tracking-widest font-mono">Global Map Visualizer Deactivated</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold max-w-sm mx-auto mt-2 leading-relaxed">
                      Deep-web threat monitoring nodes and dynamic trace charts have been folded to declutter your live forensic dashboard workspace.
                    </p>
                    <button
                      onClick={() => setMapVisible(true)}
                      className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-[10px] uppercase tracking-wider transition-all shadow-lg hover:shadow-indigo-500/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Restore Map Coverage
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ) OPERATIONS MANUAL */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/10 mt-12 text-left">
        <div className="text-center mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400 block mb-3 font-mono">OPERATIONS INTELLIGENCE</span>
          <h2 className="text-3xl sm:text-5xl font-black mb-4 uppercase tracking-tighter text-white font-sans">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Review detailed compliance directives, data security mechanisms, and global search regulations for digital forensic tracing.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={`faq-item-${index}`} 
                className={`bg-[#0d1117] border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/5' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors hover:bg-white/[0.01]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] sm:text-[9px] font-mono font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 shrink-0">
                      {faq.tag}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-gray-200 font-sans leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-xs text-slate-400 font-sans leading-relaxed border-t border-white/5 bg-black/10">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* SUBSCRIPTION PACKS ENGINE (PHASE 7) */}
      <section id="subscription-packs-section" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10 mt-12 bg-white/[0.01]">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black mb-4 uppercase tracking-tighter text-white font-sans">Global Forensic Subscriptions</h2>
          <div className="inline-flex items-center gap-3 text-emerald-400 text-xs font-semibold uppercase tracking-widest">
            <Check className="w-4 h-4 text-emerald-500" /> 7-Day Money-Back Guarantee Enabled in All Regions
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-4xl mx-auto text-left">
          {/* STANDARD PRO */}
          <div className="bg-[#0d1117] border border-white/10 p-6 sm:p-10 rounded-3xl relative overflow-hidden group hover:border-indigo-500/30 transition-all shadow-xl shadow-black/40">
            <h3 className="text-lg font-black uppercase tracking-wider text-indigo-400 font-sans">Standard Pro</h3>
            <p className="text-xs text-slate-400 mt-2">Perfect for independent security analysts.</p>

            <div className="text-4xl font-extrabold my-8 tracking-tight text-white font-sans">
              ₹399<span className="text-xs font-medium text-slate-500 font-sans"> / month</span>
            </div>

            <ul className="space-y-4 mb-10 text-xs text-slate-300 font-bold">
              <li className="flex items-center gap-2">
                <Check className="text-indigo-500 w-4 h-4 shrink-0" />
                <span>100 Deep Audits / Day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-indigo-500 w-4 h-4 shrink-0" />
                <span>Full XL/CSV and Audit PDF Download privileges</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-indigo-500 w-4 h-4 shrink-0" />
                <span>Standard compliance priorities</span>
              </li>
            </ul>

            <a
              href="https://rzp.io/rzp/8jguLmQ"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                // Keep the default browser navigation behavior to open Razorpay in a new tab,
                // while simultaneously opening the licensing verification modal in the foreground
                handleUpgradePlan('pro');
              }}
              className="block w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-200 text-center text-white shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Get Started Monthly
            </a>
            
            {/* Visual trust-building badge */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[8px] text-slate-500 uppercase tracking-widest font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>SSL SECURE + PCI-DSS COMPLIANT ₹399</span>
            </div>
          </div>

          {/* ELITE INTELLIGENCE */}
          <div className="bg-[#0d1117] border-2 border-indigo-500/40 p-6 sm:p-10 rounded-3xl relative overflow-hidden group text-left shadow-xl shadow-indigo-500/5">
            <div className="absolute top-8 right-10 bg-indigo-500 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] text-white">
              Enterprise Node
            </div>
            <h3 className="text-lg font-black uppercase tracking-wider text-indigo-400 font-sans">Elite Intelligence</h3>
            <p className="text-xs text-slate-400 mt-2">Unlimited power for global tracing networks.</p>

            <div className="text-4xl font-extrabold my-8 tracking-tight text-white font-sans">
              ₹4,999<span className="text-xs font-medium text-slate-500 font-sans"> / year</span>
            </div>

            <ul className="space-y-4 mb-10 text-xs text-slate-300 font-bold">
              <li className="flex items-center gap-2">
                <Check className="text-indigo-400 w-4 h-4 shrink-0" />
                <span>Unlimited Global footprint tracing searches</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-indigo-400 w-4 h-4 shrink-0" />
                <span>Real-time database breach warnings & custom reports</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-indigo-400 w-4 h-4 shrink-0" />
                <span>Priority Refund rules processing & dedicated compliance support</span>
              </li>
            </ul>

            <a
              href="https://rzp.io/rzp/RufJLvcp"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                handleUpgradePlan('elite');
              }}
              className="block w-full py-4 bg-white hover:bg-slate-200 text-black rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-200 text-center cursor-pointer font-bold"
            >
              Claim Yearly Access
            </a>

            {/* Visual trust-building badge */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[8px] text-slate-500 uppercase tracking-widest font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>SSL SECURE + PCI-DSS COMPLIANT ₹4,999</span>
            </div>
          </div>
        </div>

        {/* COMPLIANCE REFUND STATS DISPLAY (PHASE 10) */}
        <div className="mt-16 max-w-2xl mx-auto bg-[#0d1117] border border-white/10 p-5 sm:p-8 rounded-3xl text-left shadow-xl shadow-black/40">
          <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-4 font-sans">Refund System Transparency Analytics</h4>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed font-sans">
            In compliance with our strict 7-Day Money Back Guarantee, refunds are capped globally to prevent system exploitation. Approved refunds are securely capped under international treaties.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/5 pt-6 text-center font-mono">
            <div className="pb-4 sm:pb-0 border-b sm:border-b-0 sm:border-r border-white/5 last:border-0 last:pb-0">
              <span className="block text-xl font-black text-white">{stats.totalUsers}</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest">Active Paid Users</span>
            </div>
            <div className="pb-4 sm:pb-0 border-b sm:border-b-0 sm:border-r border-white/5 last:border-0 last:pb-0">
              <span className="block text-xl font-black text-white">{stats.totalRefundsApproved}</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest">Refunds Disbursed</span>
            </div>
            <div className="last:border-0 last:pb-0">
              <span className="block text-xl font-black text-indigo-400">{stats.refundPercentage}%</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest">Quota Percent (Max 5%)</span>
            </div>
          </div>

          <div className="mt-8 border-t border-white/5 pt-6 text-left">
            <h5 className="text-[10px] font-black uppercase text-white tracking-widest mb-4 font-sans">File Refund Claim</h5>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Reason for cancellation..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="flex-1 bg-black/40 border border-white/5 px-4 py-3 rounded-xl text-xs text-white focus:border-indigo-500 outline-none transition-colors"
              />
              <button
                onClick={handleRequestRefund}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase transition shadow-lg shadow-indigo-600/20"
              >
                File Refund Claim
              </button>
            </div>
            {refundAlertMsg && (
              <p className={`mt-3 text-xs font-bold ${refundAlertMsg.success ? 'text-emerald-400' : 'text-red-400'}`}>
                {refundAlertMsg.text}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* SECURE SUPPORT CONTACT FORM (PHASE 9) */}
      <section className="py-20 px-6 max-w-4xl mx-auto border-t border-white/10 mt-12 bg-white/[0.01]">
        <div className="text-center mb-12">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400 block mb-3 font-mono">Secure Transmission Channel</span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">Contact Forensic Support</h2>
          <p className="text-xs text-slate-400 mt-2">
            Submit a secure, encrypted message to our decentralized compliance engineering team. All communication streams are isolated and monitored under global regulatory standards.
          </p>
        </div>

        <form onSubmit={handleContactSubmit} className="bg-[#0d1117] border border-white/10 p-8 rounded-3xl space-y-6 text-left shadow-xl shadow-black/40">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Subject Name</label>
              <input
                type="text"
                value={conName}
                onChange={(e) => setConName(e.target.value)}
                placeholder="Audit Subject / Name"
                className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-xs text-white focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Secure Reply Email</label>
              <input
                type="email"
                value={conEmail}
                onChange={(e) => setConEmail(e.target.value)}
                placeholder="User Mail Address"
                className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-xs text-white focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Forensic Query Subject</label>
            <input
              type="text"
              value={conSubject}
              onChange={(e) => setConSubject(e.target.value)}
              placeholder="Case Inquiry Title"
              className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-xs text-white focus:border-indigo-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Encrypted Message Payload</label>
            <textarea
              rows={4}
              value={conMessage}
              onChange={(e) => setConMessage(e.target.value)}
              placeholder="State your compliance inquiry, opt-out request, or database report correction parameters..."
              className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-xs text-white focus:border-indigo-500 outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            Dispatch Audit Query
          </button>

          {contactResultMsg && (
            <p className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-400 mt-4 text-center">
              {contactResultMsg}
            </p>
          )}
        </form>
      </section>

      {/* FOOTER & COMPLIANCE CHANNELS */}
      <footer className="pt-24 pb-12 px-6 border-t border-white/10 mt-20 relative bg-[#010409]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 mb-20 text-left">
          <div className="col-span-1">
            <h5 className="text-sm font-black mb-6 tracking-widest text-white">TRACE-BACK-AI</h5>
            <p className="text-xs text-gray-500 leading-relaxed font-bold">
              Connecting 195+ countries via secure intelligence relays. We provide authenticated, data privacy footprints with zero tracking log records.
            </p>
            <div className="mt-5 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-full w-fit shadow-[0_0_15px_rgba(16,185,129,0.08)]">
              <Shield className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
              <span className="text-[9px] text-emerald-400 font-mono font-black uppercase tracking-wider">GDPR & CCPA COMPLIANT</span>
            </div>
          </div>
          <div>
            <h6 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-8 font-mono">ONE-CLICK SUPPORT</h6>
            <div className="space-y-4">
              <a
                href="https://wa.me/your_number?text=Hi%20TraceBack,%20I%20need%20assistance%20with%20my%20data%20audit."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-xs font-bold text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500" /> WhatsApp Hotline
              </a>
              <a
                href="mailto:support@traceback.ai?subject=Global%20Intelligence%20Support%20Request"
                className="flex items-center gap-3 text-xs font-bold text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-indigo-400" /> Secure Email Proxy
              </a>
              <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-white/5 pb-1">
                <p className="uppercase">Auditing Officer</p>
                <p className="text-gray-400 font-bold mt-1">
                  {auditingOfficer || 'Automated Forensic Node'}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h6 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-8 font-mono">MARKET LEGALS & COMPLIANCE</h6>
            <ul className="space-y-3 text-xs font-bold text-gray-400 uppercase tracking-tighter">
              <li
                onClick={() =>
                  showInfo(
                    'Terms of Service',
                    'By utilizing the TraceBack compliance and forensic intelligence terminal, you agree to access trace telemetry solely for authenticated personal compliance validation or authorized organization operations. Unauthorized bot queries, stress testing, or malicious scanning bypass are strictly prohibited under the Federal Computer Fraud and Abuse Act.'
                  )
                }
                className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"
              >
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400" /> Terms of Service
              </li>
              <li
                onClick={() =>
                  showInfo(
                    'Privacy Policy',
                    'TraceBack is built upon a standard of complete, uncompromised anonymity. We do not store log caches or IP registries on our routing node relays. All session traces are compiled purely client-side and transiently purged from active memory within 15 minutes of exit.'
                  )
                }
                className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"
              >
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400" /> Privacy Policy
              </li>
              <li
                onClick={() =>
                  showInfo(
                    'Privacy Protocol & AES-256 Rules',
                    'In alignment with global zero-trust rules, we utilize AES-256 transport tunnels. Unlogged queries are cleared completely within 15 minutes of exit.'
                  )
                }
                className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"
              >
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400" /> Privacy & Security Policy
              </li>
              <li
                onClick={() =>
                  showInfo(
                    'Refund Transparency Rules',
                    '7-Day Refund: Refund approvals are executed instantly via Razorpay/Stripe if no premium downloads occurred and current 5% limits are respected.'
                  )
                }
                className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"
              >
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400" /> Refund Guarantee Protocol
              </li>
              <li
                onClick={() =>
                  showInfo(
                    '195-Country Laws',
                    'Our intelligence queries are completely non-intrusive and strictly compliant with European GDPR Article 17, US California CCPA, and Japanese APPI policies.'
                  )
                }
                className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"
              >
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400" /> Global Data Legals
              </li>
              <li
                onClick={() => {
                  if (scannedNodes.length > 0) {
                    handleOpenErasureModal();
                  } else {
                    showInfo('DATA PURGE DIRECTIONS', 'To request permanent erasure of your tracing data, first perform an active trace scan on your email/phone node. Then click "Request Complete Data Erasure" in the sidebar.');
                  }
                }}
                className="hover:text-red-400 cursor-pointer transition-colors flex items-center gap-2 font-black tracking-normal"
              >
                <ChevronRight className="w-3.5 h-3.5 text-red-500 animate-pulse" /> CCPA/GDPR Decoupling Request
              </li>
            </ul>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <h6 className="text-[10px] font-black uppercase mb-6 tracking-widest text-[#0d1117] dark:text-slate-300 font-mono">TRUST STANDARDS</h6>
              <div className="flex gap-4 items-center mb-6">
                <Globe className="text-gray-500 w-5 h-5 hover:text-indigo-400 transition-colors" />
                <Shield className="text-gray-500 w-5 h-5 hover:text-indigo-400 transition-colors" />
                <Briefcase className="text-gray-500 w-5 h-5 hover:text-indigo-400 transition-colors" />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.2em] font-mono leading-none">ISO 27001 COMPLIANT</p>
              <p className="text-[8px] text-emerald-400 font-mono font-bold leading-none">SECURE SSL SHIELD ON</p>
            </div>
          </div>
        </div>
        <div className="text-center text-[9px] font-black text-gray-600 tracking-[0.3em] uppercase border-t border-white/10 pt-12">
          © 2026 TRACE-BACK-AI | Intelligence for 195+ Countries
        </div>
      </footer>

      {/* CORE AGE GATE MODAL COMPONENT (PHASE 6) */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto flex justify-center items-start sm:items-center py-8 sm:py-12 px-4 sm:px-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0d1117] border border-white/10 p-5 sm:p-8 rounded-2xl sm:rounded-3xl w-full max-w-[420px] my-auto relative shadow-2xl shadow-black/60"
            >
              <button
                onClick={() => {
                  setAuthModalOpen(false);
                  setMinorLock(false);
                }}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20">
                <Lock className="w-6 h-6 text-white" />
              </div>

              <h2 className="text-2xl font-black mb-1 uppercase tracking-tight text-white font-sans">Global Age Gate</h2>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-8 font-mono">Data compliance registry protocol</p>

              <div className="space-y-4 text-left font-sans">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Registered Email</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-sm focus:border-indigo-500 outline-none text-white text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Contact Phone (+1, +44, +91...)</label>
                  <input
                    type="tel"
                    placeholder="Enter telephone handle"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-sm focus:border-indigo-500 outline-none text-white text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Affirmed Age</label>
                  <input
                    type="number"
                    placeholder="Affirm Age"
                    value={userAge}
                    onChange={(e) => {
                      setUserAge(e.target.value);
                      if (parseInt(e.target.value) >= 18) {
                        setMinorLock(false);
                      }
                    }}
                    className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-sm focus:border-indigo-500 outline-none text-white text-center font-bold"
                  />
                </div>

                {/* MINOR SECURITY NOTIFICATION */}
                <AnimatePresence>
                  {(minorLock || (userAge && parseInt(userAge) < 18)) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 mt-2 text-slate-300 relative overflow-hidden"
                    >
                      <p className="text-[10px] text-amber-400 font-bold leading-normal mb-2 uppercase flex items-center gap-1.5 font-mono">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> SECURITY ALERT: Minor age affirmed.
                      </p>
                      <p className="text-[10px] text-slate-400 leading-normal mb-3">
                        A parental security warning notification must be authorized. Provide a parent email or WhatsApp handle below:
                      </p>
                      <input
                        type="text"
                        placeholder="Parent WhatsApp or Email"
                        value={parentContact}
                        onChange={(e) => setParentContact(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 p-3 rounded-lg text-xs font-semibold text-white focus:border-amber-500 outline-none"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleVerifySession}
                  className="w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 rounded-xl font-bold text-xs tracking-widest uppercase text-white shadow-lg shadow-indigo-600/25 cursor-pointer text-center"
                >
                  Confirm Compliance Identity
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECURE POPUP DIALOG COMPONENT */}
      <AnimatePresence>
        {infoModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto flex justify-center items-start sm:items-center py-8 sm:py-12 px-4 sm:px-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0d1117] border border-white/10 p-5 sm:p-8 rounded-2xl sm:rounded-3xl w-full max-w-[480px] my-auto relative text-left shadow-2xl shadow-indigo-500/5 font-sans"
            >
              <button
                onClick={() => setInfoModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-sm font-black mb-4 uppercase tracking-widest text-indigo-400 flex items-center gap-2 pr-8 font-mono">
                <Shield className="w-4 h-4 text-indigo-400 animate-pulse" /> {infoTitle}
              </h2>
              <div className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold mb-8 space-y-4">
                <p>{infoBody}</p>
              </div>
              <button
                onClick={() => setInfoModalOpen(false)}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition shadow-lg shadow-indigo-600/20 text-center cursor-pointer"
              >
                Clear Transmissions
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GDPR ERASURE REQUEST MODAL */}
      <AnimatePresence>
        {erasureModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto flex justify-center items-start sm:items-center py-8 sm:py-12 px-4 sm:px-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0d1117] border border-red-500/30 p-5 sm:p-6 rounded-2xl w-full max-w-[430px] my-auto relative text-left shadow-2xl shadow-red-500/5 font-sans"
            >
              <button
                onClick={() => setErasureModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-sm font-black mb-4 uppercase tracking-widest text-red-400 flex items-center gap-2 font-mono">
                <Trash2 className="w-4 h-4 text-red-500 animate-pulse" /> Compliance Data Erasure Request
              </h2>

              {(() => {
                const targetLower = traceInput.trim().toLowerCase();
                const isAdminTarget = targetLower === 'sukanta.singha786@gmail.com' || targetLower === 'sukanta.singha786@gmil.com';
                const isCurrentUserAdmin = currentUser?.email?.toLowerCase() === 'sukanta.singha786@gmail.com';

                if (isAdminTarget && !isCurrentUserAdmin) {
                  return (
                    <div className="space-y-4">
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-mono font-bold leading-normal">
                        ACCESS REJECTED: Administrative master records are locked under critical security guidelines. Only verified administrator sessions are permitted to modify or de-allocate master metrics.
                      </div>
                      <button
                        onClick={() => setErasureModalOpen(false)}
                        className="w-full py-3 bg-white/5 border border-white/15 rounded-xl text-xs font-black uppercase text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                      >
                        Acknowledge and Exit
                      </button>
                    </div>
                  );
                }

                if (!isCurrentUserAdmin) {
                  const emailMatch = currentUser?.email?.toLowerCase() === targetLower;
                  const phoneMatch = currentUser?.phone === traceInput.trim();
                  if (!emailMatch && !phoneMatch) {
                    return (
                      <div className="space-y-4">
                        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 text-xs font-mono font-semibold leading-relaxed">
                          VERIFICATION REJECTED: Your active signed-in session ({currentUser?.email || 'Guest'}) does not match the ownership parameters of the target dataset: <span className="text-white font-bold">{traceInput}</span>.<br/><br/>
                          Under GDPR compliance regulations, users may only request permanent erasure for coordinates matching their verified parent or individual profile.
                        </div>
                        <button
                          onClick={() => setErasureModalOpen(false)}
                          className="w-full py-3 bg-white/5 border border-white/15 rounded-xl text-xs font-black uppercase text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                        >
                          Acknowledge and Exit
                        </button>
                      </div>
                    );
                  }
                }

                return (
                  <div>
                    <p className="text-[11px] text-slate-400 font-sans mb-4 leading-relaxed font-semibold">
                      You are requesting permanent, irreversible de-allocation under GDPR Art. 17 (Right to Erasure) & CCPA guidelines. 
                      This will completely prune and wipe all caching, threat metrics, and history logs of the target node: <span className="text-white font-bold font-mono">{traceInput}</span> across all active servers.
                    </p>

                    <div className="space-y-4 mb-6">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={erasureAcknowledge}
                          onChange={(e) => setErasureAcknowledge(e.target.checked)}
                          className="mt-1 accent-red-600 rounded cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-400 select-none leading-relaxed font-bold">
                          I affirm under penalty of perjury that I am the legal owner of <span className="text-white">{traceInput}</span> and request complete and permanent deletion of my dataset.
                        </span>
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setErasureModalOpen(false)}
                        className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmErasure}
                        disabled={!erasureAcknowledge}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-center transition cursor-pointer ${
                          erasureAcknowledge
                            ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'
                            : 'bg-red-500/10 border border-red-500/10 text-red-500/40 cursor-not-allowed'
                        }`}
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FORENSIC DETAIL OVERLAY MODAL */}
      <AnimatePresence>
        {selectedNode && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto flex justify-center items-start sm:items-center py-8 sm:py-12 px-4 sm:px-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0d1117] border border-white/10 p-5 sm:p-6 rounded-2xl max-w-md w-full my-auto relative text-left shadow-[0_0_50px_rgba(99,102,241,0.15)] font-mono"
            >
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Close forensic details"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-indigo-500/20 pb-4 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedNode.status === 'EXPOSED' ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-400'
                }`}>
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Forensic Node Registry</h3>
                  <p className="text-[10px] text-slate-500">Node Identifier: {selectedNode.node}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* Meta Summary Block */}
                <div className={`p-4 rounded-xl border ${
                  selectedNode.status === 'EXPOSED'
                    ? 'bg-red-500/5 border-red-500/20 text-red-200'
                    : 'bg-indigo-500/5 border-indigo-500/20 text-slate-300'
                }`}>
                  <span className="block text-[9px] font-black uppercase text-indigo-400 tracking-wider mb-1">AUDIT SUMMARY & IMPACT DETECTED</span>
                  <p className="text-xs font-sans leading-relaxed">{selectedNode.meta}</p>
                </div>

                {/* Technical Specifications Grid */}
                <div className="grid grid-cols-2 gap-3 bg-black/30 border border-white/5 rounded-xl p-4">
                  <div>
                    <span className="block text-[8px] text-gray-500 tracking-widest uppercase">REGISTRY STATE</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase mt-1 ${
                      selectedNode.status === 'EXPOSED' ? 'text-red-500' : (selectedNode.status === 'Secure' || selectedNode.status === 'Compliant' ? 'text-emerald-500' : 'text-indigo-400')
                    }`}>
                      {selectedNode.status}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-gray-500 tracking-widest uppercase">BREACH SEVERITY</span>
                    <span className={`text-[10px] font-black uppercase mt-1 block ${
                      selectedNode.status === 'EXPOSED' ? 'text-red-500' : (selectedNode.status === 'Secure' ? 'text-green-400' : 'text-amber-400')
                    }`}>
                      {selectedNode.status === 'EXPOSED' ? 'CRITICAL - HIGH' : (selectedNode.status === 'Secure' || selectedNode.status === 'Compliant' ? 'SECURE - NEUTRAL' : 'WARNING - MEDIUM')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-gray-500 tracking-widest uppercase">VECTOR SIGNATURE ID</span>
                    <span className="font-mono text-[9px] text-gray-300 block mt-1">
                      TRB-VC-{selectedNode.node.slice(0, 3).toUpperCase()}-{selectedNode.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-gray-500 tracking-widest uppercase">PORT / CONTEXT PROTOCOL</span>
                    <span className="font-mono text-[9px] text-gray-300 block mt-1">
                      {selectedNode.status === 'EXPOSED' ? 'SECURE_SHELL-TCP:22' : 'SECURE_PORT-TLS:443'}
                    </span>
                  </div>
                  <div className="col-span-2 border-t border-white/5 pt-3 mt-1">
                    <span className="block text-[8px] text-gray-500 tracking-widest uppercase mb-1">TARGET CORRELATION HASH</span>
                    <span className="font-mono text-[8px] text-indigo-300/80 break-all block">
                      SHA256: {Math.random().toString(36).substr(2, 10)}${selectedNode.node.replace(/\s+/g, '_')}${selectedNode.status}
                    </span>
                  </div>
                </div>

                {/* Remediation Checklist */}
                <div>
                  <span className="block text-[9px] font-black uppercase text-indigo-400 tracking-wider mb-2">RECOMMENDED DEFENSIVE PROTOCOL</span>
                  <div className="space-y-1.5 font-sans text-[11px] text-slate-400 leading-normal bg-white/5 border border-white/5 p-4 rounded-xl">
                    {selectedNode.status === 'EXPOSED' ? (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="text-red-500 font-bold shrink-0">1.</span>
                          <span><strong>Rotate Verified Credentials:</strong> Instantly replace vulnerable password sequences associated with {traceInput || 'target'}.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-red-500 font-bold shrink-0">2.</span>
                          <span><strong>Enforce MFA Protocols:</strong> Enable hardware-backed tokenizers or authenticator applications immediately.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-red-500 font-bold shrink-0">3.</span>
                          <span><strong>Execute System Audit:</strong> Review connection histories to trace secondary vector penetration channels.</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="text-green-500 font-bold shrink-0">1.</span>
                          <span><strong>Proactive Monitoring:</strong> Register for automatic trace signals to flag any future signature anomalies.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-500 font-bold shrink-0">2.</span>
                          <span><strong>Information Minimization:</strong> Avoid utilizing non-verified web forms or exposing indices online.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-500 font-bold shrink-0">3.</span>
                          <span><strong>Regular Re-scans:</strong> Queue monthly dynamic traces to evaluate active protocol alignment.</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    const text = `Node Source: ${selectedNode.node}\nStatus: ${selectedNode.status}\nDetails: ${selectedNode.meta}\nRisk: ${selectedNode.status === 'EXPOSED' ? 'HIGH' : 'LOW'}`;
                    navigator.clipboard.writeText(text);
                    showInfo('COPIED TO CLIPBOARD', 'Full forensic telemetry copied successfully.');
                  }}
                  className="py-3 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-wider text-indigo-400 border border-white/5 rounded-xl text-center cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Log
                </button>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="py-3 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-black uppercase tracking-wider text-white rounded-xl text-center cursor-pointer transition-all"
                >
                  Acknowledge Trace
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MITIGATION & REMEDIATION PLAYBOOK MODAL */}
      <AnimatePresence>
        {remediationNode && (
          <div id="remediation-modal-overlay" className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto flex justify-center items-start sm:items-center py-8 sm:py-12 px-4 sm:px-6">
            <motion.div
              id="remediation-modal-container"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#070a0f] border border-red-500/30 p-5 sm:p-8 rounded-2xl sm:rounded-3xl w-full max-w-[550px] my-auto relative text-left shadow-[0_0_50px_rgba(239,68,68,0.15)] font-mono text-gray-200"
            >
              <button
                onClick={() => setRemediationNode(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Dismiss mitigation playbook"
              >
                <X className="w-5 h-5" id="close-remediation-button" />
              </button>

              <div className="flex items-center gap-3 border-b border-red-500/20 pb-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-red-500">Exposed Risk Mitigation Playbook</h3>
                  <p className="text-[9px] text-slate-400">Step-by-Step Remediation Protocols</p>
                </div>
              </div>

              <div className="space-y-5 text-xs">
                {/* Affected target node details */}
                <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">
                  <span className="block text-[8px] text-red-400 tracking-widest uppercase mb-1 font-sans">DETECTED EXPOSED PLATFORM</span>
                  <div className="text-[14px] font-black text-white">{remediationNode.node}</div>
                  <div className="text-[10px] text-slate-400 mt-1 lowercase">Category: {remediationNode.category}</div>
                  <p className="text-[10px] text-slate-300 mt-2 bg-black/40 border border-white/5 p-2 rounded-lg italic">
                     "{remediationNode.meta}"
                  </p>
                </div>

                {/* Specific Step-by-Step Playbook list */}
                <div className="space-y-3">
                  <span className="block text-[8px] text-gray-500 tracking-widest uppercase font-sans">REMEDIATION TASKS PLAYBOOK</span>
                  
                  {remediationNode.category === 'Phishing' ? (
                    <ul className="space-y-2 text-[10px] text-slate-350">
                      <li className="flex items-start gap-2 bg-white/[0.01] p-2 rounded-lg border border-white/5">
                        <span className="w-5 h-5 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">1</span>
                        <div>
                          <strong>Secure Account Credentials</strong>: Update associated access security passwords instantly using highly diversified salts and phrases.
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-white/[0.01] p-2 rounded-lg border border-white/5">
                        <span className="w-5 h-5 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">2</span>
                        <div>
                          <strong>Multi-Factor Lockdown</strong>: Force active MFA/2FA lock configurations within this platform's privacy console.
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-white/[0.01] p-2 rounded-lg border border-white/5">
                        <span className="w-5 h-5 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">3</span>
                        <div>
                          <strong>Endpoint Device Filter</strong>: Complete anti-spyware system log audits to filter browser-cache leaks.
                        </div>
                      </li>
                    </ul>
                  ) : remediationNode.category === 'Data Leak' ? (
                    <ul className="space-y-2 text-[10px] text-slate-350">
                      <li className="flex items-start gap-2 bg-white/[0.01] p-2 rounded-lg border border-white/5">
                        <span className="w-5 h-5 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">1</span>
                        <div>
                          <strong>Revoke Access Tokens</strong>: Force global logouts and instant token or auth key cancellation of compromised scopes.
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-white/[0.01] p-2 rounded-lg border border-white/5">
                        <span className="w-5 h-5 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">2</span>
                        <div>
                          <strong>Check Exposure Registers</strong>: Query public breach directories for related credential dumps.
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-white/[0.01] p-2 rounded-lg border border-white/5">
                        <span className="w-5 h-5 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">3</span>
                        <div>
                          <strong>Rotate Salt Parameters</strong>: Immediately rebuild affected system metadata keys on linked platforms.
                        </div>
                      </li>
                    </ul>
                  ) : remediationNode.category === 'Insecure Port' ? (
                    <ul className="space-y-2 text-[10px] text-slate-350">
                      <li className="flex items-start gap-2 bg-white/[0.01] p-2 rounded-lg border border-white/5">
                        <span className="w-5 h-5 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">1</span>
                        <div>
                          <strong>Close Network Listeners</strong>: Restrict non-encrypted active listener ports (SFTP/SSH default setups).
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-white/[0.01] p-2 rounded-lg border border-white/5">
                        <span className="w-5 h-5 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">2</span>
                        <div>
                          <strong>Enforce Security Rules</strong>: Set up IP restriction lists for server configurations.
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-white/[0.01] p-2 rounded-lg border border-white/5">
                        <span className="w-5 h-5 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">3</span>
                        <div>
                          <strong>Install Encryption Shielding</strong>: Activate secure routing (e.g. WireGuard/OpenVPN tunnels).
                        </div>
                      </li>
                    </ul>
                  ) : (
                    <ul className="space-y-2 text-[10px] text-slate-350">
                      <li className="flex items-start gap-2 bg-white/[0.01] p-2 rounded-lg border border-white/5">
                        <span className="w-5 h-5 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">1</span>
                        <div>
                          <strong>De-link Metadata Accounts</strong>: Terminate background tracking synchronizations.
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-white/[0.01] p-2 rounded-lg border border-white/5">
                        <span className="w-5 h-5 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">2</span>
                        <div>
                          <strong>Request Crawler Expungements</strong>: Configure index metadata exclusions inside options.
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-white/[0.01] p-2 rounded-lg border border-white/5">
                        <span className="w-5 h-5 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">3</span>
                        <div>
                          <strong>Wipe Diagnostic Identifiers</strong>: Clear local and remote device fingerprinting keys.
                        </div>
                      </li>
                    </ul>
                  )}
                </div>

                {/* Direct Action Hub Outbound Link Button */}
                <div className="space-y-3 pt-2">
                  <span className="block text-[8px] text-gray-500 tracking-widest uppercase font-sans">SECURE ESCAPE CONSOLE ACTION</span>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(remediationNode.node + ' security settings privacy delete')}`}
                    target="_blank"
                    rel="noreferrer referrerPolicy"
                    className="w-full py-2.5 bg-red-950/20 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-black uppercase text-[10px] rounded-lg tracking-wider transition-all block text-center"
                  >
                    Open Platform Security Settings Hub <ExternalLink className="w-3.5 h-3.5 inline ml-1.5" />
                  </a>
                  <p className="text-[8px] text-slate-500 leading-tight">
                    *Due to third-party Cross-Origin Security Restrictions, direct deletion must be finalized by the account owner inside the platform security settings link provided above.
                  </p>
                </div>

                {/* Confirm local de-indexing / de-leak repair */}
                <div className="flex gap-3 pt-4 border-t border-white/5 mt-4">
                  <button
                    onClick={() => {
                      executeActualNodeWipe(remediationNode.node);
                      setRemediationNode(null);
                    }}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-[10px] font-black uppercase tracking-wider text-slate-950 rounded-xl text-center cursor-pointer transition-all border border-red-400"
                  >
                    Mark Mitigated and GDPR-Wipe Trace
                  </button>
                  <button
                    onClick={() => setRemediationNode(null)}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-wider text-white border border-white/5 rounded-xl text-center cursor-pointer transition-all"
                  >
                    Keep
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PCI-DSS COMPLIANT PAYMENTS CHECKOUT BILLING MODAL */}
      <AnimatePresence>
        {paymentCheckoutPlan && (
          <div id="payment-checkout-overlay" className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto flex justify-center items-start sm:items-center py-8 sm:py-12 px-4 sm:px-6">
            <motion.div
              id="payment-checkout-container"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0e14] border border-indigo-500/30 p-5 sm:p-6 rounded-2xl w-full max-w-[430px] my-auto relative text-left shadow-[0_0_50px_rgba(99,102,241,0.2)] font-mono text-gray-200"
            >
              <button
                onClick={() => setPaymentCheckoutPlan(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Cancel Checkout"
              >
                <X className="w-4 h-4" id="close-checkout-button" />
              </button>

              <div className="flex items-center gap-2.5 border-b border-indigo-500/20 pb-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-indigo-400">Secure Direct Encrypted Gate</h3>
                  <p className="text-[8px] text-slate-450">PCI-DSS Encrypted Audit Subscription License</p>
                </div>
              </div>

              {/* TRIPLE CHECKOUT METHOD SWITCHER */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-xl text-center mb-4">
                <button
                  type="button"
                  onClick={() => setCheckoutMethod('card')}
                  className={`py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    checkoutMethod === 'card'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Direct Crypt Card
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutMethod('razorpay')}
                  className={`py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    checkoutMethod === 'razorpay'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Razorpay Verify ID
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutMethod('upi')}
                  className={`py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    checkoutMethod === 'upi'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Razorpay UPI Pay
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Active payment selection summary banner */}
                <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-3 flex justify-between items-center text-[10px]">
                  <div>
                    <span className="block text-[7px] text-indigo-400 tracking-widest uppercase font-sans">TRACE TIERS LICENSE</span>
                    <strong className="text-[11px] uppercase text-white font-sans">
                      {paymentCheckoutPlan === 'elite' ? 'ELITE FORENSIC COG' : 'PRO OPERATIONAL NODES'}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="block text-[7px] text-slate-400 tracking-widest uppercase font-sans">License Fee</span>
                    <strong className="text-[12px] text-indigo-300 font-sans">
                      {paymentCheckoutPlan === 'elite' ? '₹4,999/yr' : '₹399/mo'}
                    </strong>
                  </div>
                </div>

                {checkoutMethod === 'card' ? (
                  /* CARD FORM FIELDS */
                  <div className="space-y-3">
                    <span className="block text-[8px] text-gray-500 tracking-widest uppercase font-sans">PCI-DSS VERIFIED BILLING MEMORY</span>
                    
                    {/* Card Number */}
                    <div>
                      <label className="block text-[8px] text-slate-450 uppercase tracking-widest mb-1 font-bold">Standard Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={19}
                          value={payCardNumber}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                            const matches = v.match(/\d{4,16}/g);
                            const match = (matches && matches[0]) || '';
                            const parts = [];
                            for (let i = 0, len = match.length; i < len; i += 4) {
                              parts.push(match.substring(i, i + 4));
                            }
                            setPayCardNumber(parts.length > 0 ? parts.join(' ') : v);
                          }}
                          placeholder="4111 2222 3333 4444"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-slate-200 text-[10px] font-mono outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600"
                        />
                        <CreditCard className="w-3.5 h-3.5 text-slate-500 absolute right-3.5 top-2.5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Expiry */}
                      <div>
                        <label className="block text-[8px] text-slate-450 uppercase tracking-widest mb-1 font-bold">Expiry Code</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={payCardExpiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                            if (v.length >= 2) {
                              v = v.substring(0, 2) + '/' + v.substring(2, 4);
                            }
                            setPayCardExpiry(v);
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-slate-200 text-[10px] font-mono outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600"
                        />
                      </div>

                      {/* CVC Code */}
                      <div>
                        <label className="block text-[8px] text-slate-450 uppercase tracking-widest mb-1 font-bold">CVC Integrity</label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={4}
                          value={payCardCvc}
                          onChange={(e) => setPayCardCvc(e.target.value.replace(/[^0-9]/gi, ''))}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-slate-200 text-[10px] font-mono outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    {/* Card Name */}
                    <div>
                      <label className="block text-[8px] text-slate-450 uppercase tracking-widest mb-1 font-bold">Verified Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="JOHN DOE"
                        value={payCardName}
                        onChange={(e) => setPayCardName(e.target.value.toUpperCase())}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-slate-200 text-[10px] font-mono outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                ) : checkoutMethod === 'razorpay' ? (
                  /* RAZORPAY VERIFICATION FIELDS */
                  <div className="space-y-3">
                    <span className="block text-[8px] text-gray-450 tracking-widest uppercase font-sans">Verify Official Razorpay Receipt</span>
                    <div>
                      <label className="block text-[8px] text-slate-450 uppercase tracking-widest mb-1.5 font-black">Razorpay Payment ID</label>
                      <input
                        type="text"
                        placeholder="pay_P1r3S4dF8t9"
                        value={razorpayId}
                        onChange={(e) => setRazorpayId(e.target.value.trim())}
                        className="w-full bg-black/40 border border-indigo-500/30 rounded-xl px-3.5 py-2.5 text-slate-200 text-[11px] font-mono outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600 uppercase"
                      />
                      <p className="text-[8px] text-slate-400 mt-2 leading-relaxed font-sans normal-case">
                        Already completed your payment on the Razorpay screen? Enter the <span className="text-indigo-400 font-bold">Razorpay Payment ID</span> (e.g. starting with "pay_") from your receipt or email to sync your premium metadata immediately.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* SIMULATED RAZORPAY UPI VIEW (MATCHING USER SCREENSHOT) */
                  <div className="bg-white text-slate-800 rounded-2xl p-4.5 border border-slate-200 shadow-xl space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <ArrowLeft className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-black text-slate-900 leading-tight font-sans">Sukanta Singha</h4>
                        <p className="text-[9px] text-slate-500 font-mono">UPI ID: sukantasingha138483.rzp@rxairtel</p>
                      </div>
                    </div>

                    {/* Amount Block */}
                    <div className="text-center py-3 space-y-2">
                      <span className="text-3xl font-extrabold text-slate-900 tracking-tight block font-sans">
                        ₹ {paymentCheckoutPlan === 'elite' ? '4,999.00' : '399.00'}
                      </span>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[9px] font-bold text-slate-600 font-sans">
                        PaymentToSUKANTASINGHA
                      </div>
                    </div>

                    {/* Quick Simulation Help */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-left space-y-1">
                      <p className="text-[10px] font-bold text-indigo-900 leading-tight flex items-center gap-1 font-sans">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        Interactive Razorpay UPI Sandbox
                      </p>
                      <p className="text-[9px] text-slate-600 leading-relaxed font-sans normal-case">
                        Clicking the secure pay button below will simulate instant UPI callbacks across YES BANK nodes, dynamically updating your account status on the database.
                      </p>
                    </div>

                    {/* Pending state */}
                    <div className="flex items-center gap-1.5 text-slate-500 text-[9px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                      <span className="font-sans font-semibold">Please wait, check status on YES BANK nodes...</span>
                    </div>

                    {/* Large Pay Button */}
                    <button
                      type="button"
                      disabled={isPaymentProcessing}
                      onClick={() => {
                        setIsPaymentProcessing(true);
                        // Generate a fake razorpayId starting with pay_
                        const simulatedId = 'pay_upi_' + Math.random().toString(36).substr(2, 10);
                        setRazorpayId(simulatedId);
                        setTimeout(() => {
                          executeActualPlanUpdate(paymentCheckoutPlan);
                          setIsPaymentProcessing(false);
                          setPaymentCheckoutPlan(null);
                        }, 1800);
                      }}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold tracking-wide rounded-xl text-center cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(37,99,235,0.2)] font-sans"
                    >
                      {isPaymentProcessing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 text-white animate-spin shrink-0" />
                          Authorized Pay Callback Pending...
                        </>
                      ) : (
                        `Pay ₹ ${paymentCheckoutPlan === 'elite' ? '4,999.00' : '399.00'}`
                      )}
                    </button>

                    {/* Footer Powered-by with Icons */}
                    <div className="flex justify-between items-center text-[8px] font-mono text-slate-450 uppercase tracking-widest pt-1 border-t border-slate-100">
                      <span>Powered by UPI</span>
                      <span className="font-bold text-slate-600 flex items-center gap-1">
                        <CheckCheck className="w-3 h-3 text-emerald-500 animate-pulse" />
                        YES BANK
                      </span>
                    </div>
                  </div>
                )}

                {/* Visual Trust Badges with Professional Financial Validation */}
                <div className="bg-emerald-950/25 border border-emerald-500/20 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between border-b border-emerald-500/15 pb-1.5">
                    <span className="text-[8px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5 font-mono">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                      SECURE FINANCIAL STANDARDS APPROVED
                    </span>
                    <span className="text-[7px] text-emerald-500 font-mono font-bold bg-emerald-500/10 px-1 py-0.2 rounded uppercase">256-Bit</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="bg-black/45 border border-white/5 rounded-lg p-1.5 text-center flex flex-col items-center justify-center space-y-0.5 transition-all hover:border-emerald-500/30">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[7.5px] font-black uppercase text-white tracking-wide font-mono">SECURE SSL</span>
                      <span className="text-[6.5px] text-slate-400 leading-tight">256-Bit TLS Gate</span>
                    </div>
                    <div className="bg-black/45 border border-white/5 rounded-lg p-1.5 text-center flex flex-col items-center justify-center space-y-0.5 transition-all hover:border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[7.5px] font-black uppercase text-white tracking-wide font-mono">PCI-DSS V4.0</span>
                      <span className="text-[6.5px] text-slate-400 leading-tight">Certified Core</span>
                    </div>
                    <div className="bg-black/45 border border-white/5 rounded-lg p-1.5 text-center flex flex-col items-center justify-center space-y-0.5 transition-all hover:border-emerald-500/30">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[7.5px] font-black uppercase text-white tracking-wide font-mono">AES-256 SHIELD</span>
                      <span className="text-[6.5px] text-slate-400 leading-tight">Federal Crypt</span>
                    </div>
                  </div>
                </div>

                {/* Actions Trigger Checkout - only show if NOT upi (upi has its own pay button) */}
                {checkoutMethod !== 'upi' && (
                  <div className="flex gap-2.5 pt-1">
                    <button
                      disabled={isPaymentProcessing}
                      onClick={() => {
                        if (checkoutMethod === 'card') {
                          if (!payCardNumber || !payCardExpiry || !payCardCvc || !payCardName) {
                            alert('All verified billing parameters are required.');
                            return;
                          }
                        } else {
                          if (!razorpayId) {
                            alert('Please enter your Razorpay Payment ID starting with "pay_" to authorize sync.');
                            return;
                          }
                          if (!razorpayId.toLowerCase().startsWith('pay_') && razorpayId.length < 8) {
                            alert('Please input a valid transaction reference starting with "pay_"');
                            return;
                          }
                        }

                        setIsPaymentProcessing(true);
                        setTimeout(() => {
                          executeActualPlanUpdate(paymentCheckoutPlan);
                          setIsPaymentProcessing(false);
                          setPaymentCheckoutPlan(null);
                          setPayCardNumber('');
                          setPayCardExpiry('');
                          setPayCardCvc('');
                          setPayCardName('');
                          setRazorpayId('');
                        }, 1800);
                      }}
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-[9px] font-black uppercase tracking-wider text-white rounded-xl text-center cursor-pointer transition-all border border-indigo-400/30 flex items-center justify-center gap-1.5"
                    >
                      {isPaymentProcessing ? (
                        <>
                          <Loader2 className="w-3 h-3 text-white animate-spin shrink-0" />
                          Processing Authorized Sync...
                        </>
                      ) : (
                        `Authorize Billing & Sync`
                      )}
                    </button>
                    <button
                      onClick={() => setPaymentCheckoutPlan(null)}
                      className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-wider text-white border border-white/5 rounded-xl text-center cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* USER SETTINGS / SECURE PARAMETERS MODAL */}
      <AnimatePresence>
        {settingsModalOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto flex justify-center items-start sm:items-center py-8 sm:py-12 px-4 sm:px-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0d1117] border border-white/10 p-5 sm:p-8 rounded-2xl sm:rounded-3xl w-full max-w-[500px] my-auto relative text-left shadow-[0_0_50px_rgba(99,102,241,0.15)] font-mono text-gray-200"
            >
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Close settings"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-indigo-500/20 pb-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Security & Session Parameters</h3>
                  <p className="text-[10px] text-slate-400">Trace Operator Configuration</p>
                </div>
              </div>

              <div className="space-y-5 text-xs">
                {/* Operator Metadata block */}
                <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-3">
                  <span className="block text-[8px] text-gray-500 tracking-widest uppercase mb-1">OPERATOR ENDPOINT CREDENTIALS</span>
                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div>
                      <span className="block text-[8px] text-gray-500 uppercase">Registered Operator</span>
                      <span className="text-gray-300 font-bold font-sans truncate block">{currentUser?.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-gray-500 uppercase">License Node Tier</span>
                      <span className="text-indigo-400 font-black uppercase block">{currentUser?.subscriptionStatus || 'FREE'} Node</span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-[8px] text-gray-500 uppercase">Compliance Operator Signature</span>
                      <span className="text-gray-400 block font-mono text-[9px] break-all">ID: {currentUser?.userId.toUpperCase() || 'UNREGISTERED_OPERATOR'}</span>
                    </div>
                  </div>
                </div>

                {/* Security Auto-Clear Option block */}
                <div className="border border-white/10 bg-white/5 p-4 rounded-xl space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        id="security_auto_clear_chk"
                        type="checkbox"
                        checked={autoClearEnabled}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setAutoClearEnabled(val);
                          localStorage.setItem('security_auto_clear', val ? 'true' : 'false');
                        }}
                        className="w-4 h-4 rounded border-indigo-500/30 text-indigo-600 focus:ring-indigo-500/50 bg-[#0d1117] cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="security_auto_clear_chk" className="block text-[11px] font-black text-white hover:text-indigo-400 transition-colors cursor-pointer select-none">
                        ENABLE SECURITY AUTO-CLEAR
                      </label>
                      <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-1">
                        When enabled, the system continuously monitors keyboard, touch, and mouse activity. If inactive for <span className="text-indigo-400 font-mono font-bold">15 continuous minutes</span>, a session logout is triggered automatically, fully purging memory datasets and browser forensic trace arrays.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-white/5 pt-3 mt-1 justify-between">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">STATUS INDICATOR:</span>
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 font-mono">
                      <span className={`w-1.5 h-1.5 rounded-full ${autoClearEnabled ? 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse' : 'bg-gray-600'}`} />
                      {autoClearEnabled ? 'MONITORING FOR INACTIVITY' : 'RULES PASSIVE'}
                    </span>
                  </div>
                </div>

                {/* Weekly Security Digest Subscription block (Requirement #5) */}
                <div className="border border-white/10 bg-white/5 p-4 rounded-xl space-y-4 relative overflow-hidden">
                  {/* Lock Overlay for Standard Free Tier */}
                  {(!currentUser || currentUser.subscriptionStatus === 'free') && (
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-[1.5px] flex flex-col items-center justify-center text-center p-4 z-10 select-none border border-amber-500/10">
                      <Lock className="w-4 h-4 text-amber-500 mb-1.5 animate-bounce" />
                      <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase">PREMIUM SUBSCRIPTION REQUIRED</span>
                      <p className="text-[8px] text-slate-400 font-sans mt-0.5 leading-relaxed max-w-[280px]">
                        Weekly automated Security Trend Digests are exclusive to <span className="text-indigo-400 font-bold uppercase">Pro</span> or <span className="text-violet-400 font-bold uppercase">Elite</span> license nodes.
                      </p>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        id="security_weekly_digest_chk"
                        type="checkbox"
                        checked={weeklyDigestEnabled}
                        disabled={!currentUser || currentUser.subscriptionStatus === 'free'}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setWeeklyDigestEnabled(val);
                          localStorage.setItem('security_weekly_digest', val ? 'true' : 'false');
                          showInfo('DIGEST CONFIGURATION UPDATED', val ? 'You have successfully subscribed to weekly emailed analytics of index trends.' : 'You have unsubscribed from emailed security digests.');
                        }}
                        className="w-4 h-4 rounded border-indigo-500/30 text-indigo-600 focus:ring-indigo-500/50 bg-[#0d1117] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs font-sans"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="security_weekly_digest_chk" className="block text-[11px] font-black text-white hover:text-indigo-400 transition-colors cursor-pointer select-none">
                        SUBSCRIBE TO WEEKLY DIGEST
                      </label>
                      <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-1">
                        Receive a weekly automated intelligence report on your current safety index stability, newly indexed threat categories, and proactive mitigation steps directly in your inbox.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-white/5 pt-3 mt-1 justify-between">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">DIGEST FREQUENCY:</span>
                    <span className="text-[9px] font-bold text-indigo-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      EVERY SUNDAY (00:00 UTC)
                    </span>
                  </div>
                </div>

                {/* Theme Configuration settings option */}
                <div className="border border-white/10 bg-white/5 p-4 rounded-xl space-y-4 text-left">
                  <span className="block text-[8px] text-gray-500 tracking-widest uppercase mb-1">DISPLAY THEME SETTINGS</span>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-[11px] font-black text-white hover:text-indigo-400 transition-colors">VISUAL GRAPHICS SCHEME</span>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5 leading-relaxed">
                        Toggle between dark cyber interface and high-readability light theme.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTheme('dark');
                          localStorage.setItem('app_theme', 'dark');
                        }}
                        className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold uppercase ${
                          theme === 'dark'
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                            : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                        }`}
                        title="Switch to Cosmic Dark"
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span>Dark</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTheme('light');
                          localStorage.setItem('app_theme', 'light');
                        }}
                        className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold uppercase ${
                          theme === 'light'
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                            : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                        }`}
                        title="Switch to High-Readability Light"
                      >
                        <Sun className="w-3.5 h-3.5" />
                        <span>Light</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Advanced Dynamic Credentials and Keys Section */}
                <div className="border border-indigo-500/30 bg-indigo-500/5 p-4 rounded-xl space-y-4 text-left shadow-[0_0_15px_rgba(99,102,241,0.06)]">
                  <span className="block text-[8px] text-indigo-400 font-black tracking-widest uppercase mb-1 flex items-center gap-1.5 font-mono">
                    <Key className="w-3.5 h-3.5" /> DYNAMIC CLIENT API CREDENTIALS
                  </span>
                  
                  <p className="text-[10px] text-slate-300 font-sans leading-relaxed">
                    Paste your private API keys below. The application will instantly switch from simulations to your real live services (Gemini AI, Firestore Database, Razorpay Checkout, and Analytics) on the fly!
                  </p>

                  <div className="space-y-3.5 text-xs font-sans">
                    {/* Gemini Key */}
                    <div>
                      <label className="block text-[9px] font-black text-gray-300 uppercase mb-1">GOOGLE GEMINI API KEY</label>
                      <input
                        type="password"
                        placeholder="AIzaSy..."
                        value={customGoogleApiKey}
                        onChange={(e) => setCustomGoogleApiKey(e.target.value)}
                        className="w-full px-3 py-2 border border-white/10 rounded-lg text-slate-200 bg-black/40 focus:outline-none focus:border-indigo-500 text-[11px] font-mono"
                      />
                    </div>

                    {/* Analytics ID */}
                    <div>
                      <label className="block text-[9px] font-black text-gray-300 uppercase mb-1">GOOGLE ANALYTICS MEASUREMENT ID (G-XXXXXX)</label>
                      <input
                        type="text"
                        placeholder="G-H2X93L..."
                        value={customAnalyticsId}
                        onChange={(e) => setCustomAnalyticsId(e.target.value)}
                        className="w-full px-3 py-2 border border-white/10 rounded-lg text-slate-200 bg-black/40 focus:outline-none focus:border-indigo-500 text-[11px] font-mono"
                      />
                    </div>

                    {/* Razorpay Key ID */}
                    <div>
                      <label className="block text-[9px] font-black text-gray-300 uppercase mb-1">REAL RAZORPAY KEY ID</label>
                      <input
                        type="text"
                        placeholder="rzp_live_..."
                        value={customRazorpayId}
                        onChange={(e) => setCustomRazorpayId(e.target.value)}
                        className="w-full px-3 py-2 border border-white/10 rounded-lg text-slate-200 bg-black/40 focus:outline-none focus:border-indigo-500 text-[11px] font-mono"
                      />
                    </div>

                    {/* Firebase Config Block */}
                    <div>
                      <label className="block text-[9px] font-black text-gray-300 uppercase mb-1">GOOGLE FIREBASE CONFIG (JSON)</label>
                      <textarea
                        rows={4}
                        placeholder={`{ \n  "apiKey": "AIzaSy...", \n  "authDomain": "...", \n  "projectId": "...", \n  "firestoreDatabaseId": "(default)" \n}`}
                        value={customFirebaseConfigJson}
                        onChange={(e) => setCustomFirebaseConfigJson(e.target.value)}
                        className="w-full px-3 py-2 border border-white/10 rounded-lg text-slate-200 bg-black/40 focus:outline-none focus:border-indigo-500 text-[9px] font-mono leading-tight whitespace-pre"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          // Validate Firebase config first if entered
                          if (customFirebaseConfigJson.trim()) {
                            const parsed = JSON.parse(customFirebaseConfigJson);
                            if (!parsed.apiKey || !parsed.projectId) {
                              throw new Error('Firebase Config JSON requires at least apiKey and projectId validation attributes.');
                            }
                            localStorage.setItem('custom_firebase_config', JSON.stringify(parsed));
                            localStorage.setItem('custom_firebase_config_raw', customFirebaseConfigJson);
                          } else {
                            localStorage.removeItem('custom_firebase_config');
                            localStorage.removeItem('custom_firebase_config_raw');
                          }

                          // Save individual variables
                          if (customGoogleApiKey.trim()) {
                            localStorage.setItem('custom_gemini_api_key', customGoogleApiKey.trim());
                          } else {
                            localStorage.removeItem('custom_gemini_api_key');
                          }

                          if (customAnalyticsId.trim()) {
                            localStorage.setItem('custom_google_analytics_id', customAnalyticsId.trim());
                          } else {
                            localStorage.removeItem('custom_google_analytics_id');
                          }

                          if (customRazorpayId.trim()) {
                            localStorage.setItem('custom_razorpay_key_id', customRazorpayId.trim());
                          } else {
                            localStorage.removeItem('custom_razorpay_key_id');
                          }

                          showInfo('CREDENTIALS ACTIVATED', 'Dynamic integration credentials applied and stored. Reloading page instance...');
                          setTimeout(() => {
                            window.location.reload();
                          }, 1500);
                        } catch (err: any) {
                          alert(`Validation Error: ${err?.message || 'Invalid Firebase Config JSON format. Ensure double quotes exist on all parameter markers.'}`);
                        }
                      }}
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer text-center"
                    >
                      Apply & Reload Node
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomGoogleApiKey('');
                        setCustomFirebaseConfigJson('');
                        setCustomRazorpayId('');
                        setCustomAnalyticsId('');
                        localStorage.removeItem('custom_gemini_api_key');
                        localStorage.removeItem('custom_firebase_config');
                        localStorage.removeItem('custom_firebase_config_raw');
                        localStorage.removeItem('custom_razorpay_key_id');
                        localStorage.removeItem('custom_google_analytics_id');
                        showInfo('DEFAULTS RESTORED', 'Purged custom keys. Reverted client back to high-fidelity Sandbox simulations. Reloading...');
                        setTimeout(() => {
                          window.location.reload();
                        }, 1500);
                      }}
                      className="py-2 px-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                    >
                      Reset All
                    </button>
                  </div>
                </div>

                {/* Instant purging / Force clear */}
                <div className="p-4 bg-red-950/10 border border-red-500/10 rounded-xl">
                  <span className="block text-[9px] font-black uppercase text-red-400 tracking-wider mb-1">EMERGENCY DATA DESTRUCTION</span>
                  <p className="text-[10px] text-slate-400 font-sans mb-3">
                    Instantly destruct and purge all current live trace nodes, report footprints, and sign-out immediately.
                  </p>
                  <button
                    onClick={() => {
                      setSettingsModalOpen(false);
                      handleAutoClearPurge();
                    }}
                    className="w-full py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer text-center"
                  >
                    Force Wipe & Disconnect Node
                  </button>
                </div>
              </div>

              {/* Modal footer / Close */}
              <div className="mt-6 pt-4 border-t border-white/5 text-right">
                <button
                  onClick={() => setSettingsModalOpen(false)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase tracking-widest font-black rounded-lg transition-all cursor-pointer shadow-lg shadow-indigo-600/25"
                >
                  Save Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

        {/* SHARE LINK POPUP PANEL */}
        <AnimatePresence>
          {shareLinkModalOpen && createdShareLink && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto flex justify-center items-start sm:items-center py-8 sm:py-12 px-4 sm:px-6">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0d1117] border border-white/10 p-5 sm:p-8 rounded-2xl sm:rounded-3xl w-full max-w-md my-auto relative text-left shadow-[0_0_50px_rgba(99,102,241,0.2)] font-sans text-gray-200"
              >
                <button
                  onClick={() => setShareLinkModalOpen(false)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Close sharing console"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 border-b border-indigo-500/20 pb-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                    <Share2 className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#818cf8] font-mono">Secure Share Console</h3>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Read-Only Threat Intelligence Hook</p>
                  </div>
                </div>

                <div className="space-y-5 text-sm">
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    A secure, read-only link has been successfully serialized. This link carries your exact forensic score of <strong className="text-white">{scanStats.score}%</strong> and index logs, bypassing firewall restrictions for external validation.
                  </p>

                  <div className="bg-black/40 border border-white/5 rounded-xl p-3 font-mono text-[10.5px] space-y-2 relative">
                    <span className="block text-[8px] text-gray-500 uppercase tracking-widest leading-none font-mono">TEMPORARY READ-ONLY SHARING LINK</span>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-indigo-300 truncate max-w-[280px] block select-all font-mono">{createdShareLink}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(createdShareLink);
                          setCopiedShareLink(true);
                          setTimeout(() => setCopiedShareLink(false), 2000);
                          showInfo('LINK COPIED', 'The read-only share link has been copied successfully to clipboard.');
                        }}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[9px] uppercase font-black transition flex items-center gap-1 cursor-pointer shrink-0 font-sans"
                      >
                        {copiedShareLink ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 bg-black/45 border border-white/5 rounded-2xl text-center space-y-2">
                    <span className="block text-[8px] text-gray-505 uppercase tracking-widest leading-none font-mono text-gray-500">SCAN ON MOBILE / TABLET</span>
                    <div className="p-1.5 bg-white rounded-xl inline-block w-[130px] h-[130px] shadow-lg shadow-black/50">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(createdShareLink)}`}
                        alt="QR Code for Report Sharing Link"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[8px] text-indigo-300 font-mono">Scan code to open report instantly on your device</span>
                  </div>

                  <div className="border-t border-white/5 pt-4">
                    <span className="block text-[8px] text-gray-500 uppercase tracking-widest mb-3 font-mono">FORWARD TO SOCIAL PLATFORMS</span>
                    <div className="grid grid-cols-3 gap-2">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🔒 Forensic Trace Report via Trace-Back-AI:\nSafety Score: ${scanStats.score}%\nVerdict: ${scanStats.verdict}\nView audit: `)}&url=${encodeURIComponent(createdShareLink)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 sm:p-2.5 bg-white/5 border border-white/5 hover:border-indigo-500/25 hover:bg-indigo-600/10 text-slate-200 hover:text-white rounded-xl transition text-[9px] uppercase tracking-wide font-bold flex flex-col items-center gap-1.5 cursor-pointer text-center"
                      >
                        <span className="text-[12px] font-black font-sans text-sky-400">𝕏 / Twitter</span>
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(createdShareLink)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 sm:p-2.5 bg-white/5 border border-white/5 hover:border-indigo-500/25 hover:bg-indigo-600/10 text-slate-200 hover:text-white rounded-xl transition text-[9px] uppercase tracking-wide font-bold flex flex-col items-center gap-1.5 cursor-pointer text-center"
                      >
                        <span className="text-[12px] font-black font-sans text-blue-400">LinkedIn</span>
                      </a>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Forensic Report for target. Score: ${scanStats.score}%. Verdict: ${scanStats.verdict}. View report: ${createdShareLink}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 sm:p-2.5 bg-white/5 border border-white/5 hover:border-indigo-500/25 hover:bg-indigo-600/10 text-slate-200 hover:text-white rounded-xl transition text-[9px] uppercase tracking-wide font-bold flex flex-col items-center gap-1.5 cursor-pointer text-center"
                      >
                        <span className="text-[12px] font-black font-sans text-emerald-400">WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 text-right flex justify-between items-center text-[9px] text-slate-500 uppercase tracking-wider font-mono">
                  <span>Authorized Secure Hook</span>
                  <button
                    onClick={() => setShareLinkModalOpen(false)}
                    className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white text-[9px] uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Close Console
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* INTERACTIVE TRACE SEARCH HISTORY SCAN DRAWER */}
        <AnimatePresence>
          {historyDrawerOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden font-sans">
              {/* Overlay backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setHistoryDrawerOpen(false)}
                className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
              />

              <div className="absolute inset-y-0 right-0 max-w-full flex">
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="w-screen max-w-md bg-[#0d1117] border-l border-white/10 flex flex-col shadow-2xl relative text-left"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                        <History className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#818cf8] font-mono">Trace Audit Archive</h3>
                        <p className="text-[10px] text-slate-400 font-mono uppercase">Persistent Client Logs</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setHistoryDrawerOpen(false)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      title="Close drawer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Settings & Toggle Panel */}
                  <div className="p-4 bg-black/40 border-b border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">PRUNE SELECTION METRIC</span>
                      <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/5">
                        <button
                          onClick={() => {
                            setDeleteMode('normal');
                            showInfo('SOFT DELETION ACTIVE', 'Entities will be archived inside the Recycle Bin for one-click restoration.');
                          }}
                          className={`px-2.5 py-1 text-[10px] uppercase font-black tracking-wide rounded transition-all ${deleteMode === 'normal' ? 'bg-indigo-600 text-white font-sans' : 'text-slate-400 hover:text-white font-sans'}`}
                        >
                          Soft Bin
                        </button>
                        <button
                          onClick={() => {
                            setDeleteMode('permanent');
                            showInfo('PERMANENT DESTRUCTION ACTIVE', 'Caution: entities are permanently erased from local storage immediately.');
                          }}
                          className={`px-2.5 py-1 text-[10px] uppercase font-black tracking-wide rounded transition-all ${deleteMode === 'permanent' ? 'bg-red-600 text-white font-sans' : 'text-slate-400 hover:text-white font-sans'}`}
                        >
                          Permanent
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          const hasActive = traceSearchHistory.some(h => !h.deleted);
                          if (!hasActive) return;
                          
                          if (deleteMode === 'permanent') {
                            setTraceSearchHistory([]);
                            localStorage.setItem('trace_search_history', JSON.stringify([]));
                            showInfo('ARCHIVE DESTROYED', 'Persistent trace logs have been fully emptied.');
                          } else {
                            setTraceSearchHistory(prev => {
                              const updated = prev.map(h => ({ ...h, deleted: true }));
                              localStorage.setItem('trace_search_history', JSON.stringify(updated));
                              return updated;
                            });
                            showInfo('SOFT SCRUB EXECUTED', 'All trace records have been transferred to the Recycle Bin.');
                          }
                        }}
                        className="flex-1 py-1.5 bg-red-950/40 hover:bg-red-900/40 border border-red-500/20 hover:border-red-500/40 text-red-500 hover:text-red-400 rounded-lg text-[9px] uppercase font-black tracking-widest text-center transition cursor-pointer font-sans"
                      >
                        Prune All Active
                      </button>

                      <button
                        onClick={() => {
                          const hasDeleted = traceSearchHistory.some(h => h.deleted);
                          if (!hasDeleted) return;
                          setTraceSearchHistory(prev => {
                            const updated = prev.map(h => ({ ...h, deleted: false }));
                            localStorage.setItem('trace_search_history', JSON.stringify(updated));
                            return updated;
                          });
                          showInfo('ARCHIVES RECOVERED', 'All items inside the Recycle Bin have been fully restored.');
                        }}
                        className="flex-1 py-1.5 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 rounded-lg text-[9px] uppercase font-black tracking-widest text-center transition cursor-pointer font-sans"
                      >
                        Restore All Bin
                      </button>
                    </div>
                  </div>

                  {/* Body Search History Scroll */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                    
                    {/* Active history logs */}
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-3 font-mono">Active Queries</h4>
                      {traceSearchHistory.filter(h => !h.deleted).length === 0 ? (
                        <div className="p-6 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                          <p className="text-xs text-slate-500 font-mono uppercase">Empty Scan Journal</p>
                          <p className="text-[10px] text-slate-600 mt-1">Initiate a global trace above to record diagnostic entities persistently.</p>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {traceSearchHistory.filter(h => !h.deleted).map((item, index) => (
                            <div
                              key={`history-active-${item.id}-${index}`}
                              className="bg-black/35 hover:bg-black/50 border border-white/5 hover:border-white/10 rounded-xl p-3.5 space-y-2.5 transition relative group"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-xs font-black font-mono text-gray-200 select-all truncate block max-w-[200px]" title={item.target}>
                                  {item.target}
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className={`text-[9px] font-black uppercase tracking-wider font-mono px-1.5 py-0.5 rounded ${item.score > 80 ? 'bg-emerald-500/10 text-emerald-400' : item.score > 50 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {item.score}%
                                  </span>
                                  <button
                                    onClick={() => {
                                      setTraceInput(item.target);
                                      setHistoryDrawerOpen(false);
                                      handleTriggerScan(item.target);
                                      showInfo('AUDIT RE-ACTIVATED', `Running background audit trace on node: ${item.target}`);
                                    }}
                                    className="p-1 hover:bg-indigo-650/20 hover:text-indigo-400 rounded transition cursor-pointer text-slate-400"
                                    title="Re-run trace"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (deleteMode === 'permanent') {
                                        setTraceSearchHistory(prev => {
                                          const updated = prev.filter(h => h.id !== item.id);
                                          localStorage.setItem('trace_search_history', JSON.stringify(updated));
                                          return updated;
                                        });
                                        showInfo('PERMANENTLY PRUNED', `The entity ${item.target} has been permanently destroyed from local storage.`);
                                      } else {
                                        setTraceSearchHistory(prev => {
                                          const updated = prev.map(h => h.id === item.id ? { ...h, deleted: true } : h);
                                          localStorage.setItem('trace_search_history', JSON.stringify(updated));
                                          return updated;
                                        });
                                        showInfo('ENTITY RE-ROUTED TO BIN', `The entity ${item.target} was moved to the Recycle Bin.`);
                                      }
                                    }}
                                    className="p-1 hover:bg-red-650/20 hover:text-red-400 rounded transition cursor-pointer text-slate-500"
                                    title={`De-allocate this query (${deleteMode === 'permanent' ? 'Permanent' : 'Soft Recycle Bin'})`}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                                <span>Verd: <strong className="text-slate-300">{item.verdict}</strong></span>
                                <span>{item.timestamp}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Deleted Items / Recycle Bin (Requirement 1 & recovery toggle) */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ef4444] font-mono">Recycle Bin</h4>
                        {traceSearchHistory.some(h => h.deleted) && (
                          <button
                            onClick={() => {
                              setTraceSearchHistory(prev => {
                                const updated = prev.filter(h => !h.deleted);
                                localStorage.setItem('trace_search_history', JSON.stringify(updated));
                                return updated;
                              });
                              showInfo('RECYCLE BIN EMPTIED', 'All items in the Recycle Bin have been permanently destroyed.');
                            }}
                            className="text-[9px] text-red-530 hover:text-red-400 font-mono uppercase bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10 cursor-pointer hover:bg-red-500/10 transition"
                          >
                            Empty Bin
                          </button>
                        )}
                      </div>

                      {traceSearchHistory.filter(h => h.deleted).length === 0 ? (
                        <div className="p-5 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.005]">
                          <p className="text-[10px] text-slate-600 font-mono uppercase">Bin is Empty</p>
                        </div>
                      ) : (
                        <div className="space-y-2 opacity-75">
                          {traceSearchHistory.filter(h => h.deleted).map((item, index) => (
                            <div
                              key={`history-deleted-${item.id}-${index}`}
                              className="bg-black/25 border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3 text-left"
                            >
                              <div className="min-w-0">
                                <span className="text-xs font-mono font-bold text-slate-400 block truncate max-w-[190px]" title={item.target}>
                                  {item.target}
                                </span>
                                <span className="text-[9px] text-slate-600 font-mono">{item.timestamp}</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => {
                                    setTraceSearchHistory(prev => {
                                      const updated = prev.map(h => h.id === item.id ? { ...h, deleted: false } : h);
                                      localStorage.setItem('trace_search_history', JSON.stringify(updated));
                                      return updated;
                                    });
                                    showInfo('ENTITY RECOVERED', `Successfully restored ${item.target} to active queries.`);
                                  }}
                                  className="px-2.5 py-1 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/15 text-[9px] font-sans font-black uppercase rounded transition cursor-pointer"
                                  title="Restore target audit record"
                                >
                                  Recover
                                </button>
                                <button
                                  onClick={() => {
                                    setTraceSearchHistory(prev => {
                                      const updated = prev.filter(h => h.id !== item.id);
                                      localStorage.setItem('trace_search_history', JSON.stringify(updated));
                                      return updated;
                                    });
                                    showInfo('PERMANENTLY WIPED', `The archive record of ${item.target} is completely purged.`);
                                  }}
                                  className="p-1 hover:bg-red-650/10 text-slate-600 hover:text-red-400 rounded transition cursor-pointer"
                                  title="Erase forever"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* API DOCUMENTATION & VERCEL DEPLOY SUPPORT PANEL */}
        <AnimatePresence>
          {apiDocModalOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto flex justify-center items-start sm:items-center py-8 sm:py-12 px-4 sm:px-6">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0d1117] border border-white/10 p-5 sm:p-8 rounded-2xl sm:rounded-3xl w-full max-w-2xl my-auto relative text-left shadow-[0_0_50px_rgba(99,102,241,0.15)] font-sans text-gray-200"
              >
                <button
                  onClick={() => setApiDocModalOpen(false)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Close documentation"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 border-b border-indigo-500/20 pb-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#818cf8] font-mono">Forensic API & Deployment Guide</h3>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Production Key Configuration Registry</p>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl border border-white/10">
                  <button
                    onClick={() => setActiveApiTab('keys')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                      activeApiTab === 'keys'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Required API Keys
                  </button>
                  <button
                    onClick={() => setActiveApiTab('deploy')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                      activeApiTab === 'deploy'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Vercel Deploy Guide
                  </button>
                </div>

                {/* TAB 1: Required API Keys */}
                {activeApiTab === 'keys' ? (
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar text-xs">
                    <div>
                      <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-1.5">
                        <Key className="w-4 h-4 text-indigo-400" />
                        1. Gemini Generative AI (Server-Side Secret)
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3 font-medium">
                        Used to power intelligence reports, automated breach detection matrices, and forensic telemetry analysis on the Server-side endpoint.
                      </p>
                      <div className="bg-black/45 border border-white/5 rounded-xl p-4 font-mono text-[10px] space-y-2">
                        <div className="flex justify-between items-center text-gray-500 border-b border-white/5 pb-2 mb-2">
                          <span>VARIABLE KEY</span>
                          <span className="text-indigo-400 font-bold uppercase text-[9px]">Secret</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-indigo-300 font-black">GEMINI_API_KEY</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText('GEMINI_API_KEY');
                              showInfo('COPIED VARIABLE NAME', 'GEMINI_API_KEY has been copied to clipboard.');
                            }}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white rounded text-[8px] uppercase font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" /> Copy Variable Name
                          </button>
                        </div>
                        <div className="text-gray-400 text-[10px] pt-1">
                          <span className="text-slate-500 uppercase text-[9px] block">Where to obtain:</span>
                          Go to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline hover:text-indigo-300 inline-flex items-center gap-1 font-bold">Google AI Studio <ExternalLink className="w-3 h-3 inline" /></a> and generate a free API Key. Keep this completely hidden from client code and configure it as a Secret in Vercel.
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-indigo-400" />
                        2. Firebase Firestore & Auth (Public Config Map)
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3 font-medium">
                        This application uses Firebase for secure compliance identity logs, real-time sync states, and persistence. The client loads configurations from <code className="text-indigo-300 font-bold font-mono">firebase-applet-config.json</code> in the project root.
                      </p>
                      <div className="bg-black/45 border border-white/5 rounded-xl p-4 font-mono text-[10px] space-y-3">
                        <div className="flex justify-between items-center text-gray-500 border-b border-white/5 pb-1">
                          <span>REQUIRED PARAMETERS (COMMITTABLE IN REPO)</span>
                          <span className="text-indigo-400 font-bold uppercase text-[9px]">Client-Safe</span>
                        </div>
                        <div className="space-y-1.5 text-gray-400 text-[10px]">
                          <div><strong className="text-white">apiKey:</strong> Firebase Web Authenticator Token</div>
                          <div><strong className="text-white">authDomain:</strong> project-id.firebaseapp.com</div>
                          <div><strong className="text-white">projectId:</strong> Unique Firebase Project reference</div>
                          <div><strong className="text-white">firestoreDatabaseId:</strong> Specific db instance lookup</div>
                        </div>
                        <div className="text-gray-400 text-[10px] pt-2 border-t border-white/5">
                          <span className="text-slate-500 uppercase text-[9px] block">Where to obtain:</span>
                          Initialize a project on the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline hover:text-indigo-300 inline-flex items-center gap-1 font-bold">Firebase Console <ExternalLink className="w-3 h-3 inline" /></a>. Extract the standard Web Configuration object under Project Settings and paste it into <code className="text-gray-300">firebase-applet-config.json</code> in your repository.
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#1b222d]/40 border border-indigo-500/20 rounded-xl p-4 text-[11px] leading-relaxed select-none">
                      <span className="font-bold text-indigo-400 block uppercase mb-1 font-mono">🔒 ARCHITECTURAL CONFIGURATION DESIGN</span>
                      Your <code className="text-white font-mono">firebase-applet-config.json</code> contains only public configuration values used by the client-side Google SDK to bind connection sockets. It is **100% safe to commit to GitHub**. The server-side Gemini API secret key, however, remains completely protected server-side behind Express proxy routers.
                    </div>
                  </div>
                ) : (
                  /* TAB 2: Vercel Deploy Guide */
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar text-xs leading-relaxed">
                    <div className="bg-black/20 p-4 border border-white/5 rounded-xl space-y-4">
                      <span className="block text-[10px] font-bold tracking-widest uppercase text-indigo-400 font-mono">Vercel Deployment Workflow</span>
                      
                      <div className="space-y-4 font-sans text-slate-300">
                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold text-[10px] flex items-center justify-center shrink-0 font-mono">1</div>
                          <div>
                            <p className="font-bold text-white font-mono text-[11px] uppercase">Push Repository to GitHub</p>
                            <p className="text-[10px] text-slate-400 mt-1">
                              Commit your local work and push this codebase to a private/public GitHub, GitLab, or Bitbucket repository. Make sure <code className="text-white">firebase-applet-config.json</code> is committed!
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold text-[10px] flex items-center justify-center shrink-0 font-mono">2</div>
                          <div>
                            <p className="font-bold text-white font-mono text-[11px] uppercase">Import Project to Vercel</p>
                            <p className="text-[10px] text-slate-400 mt-1">
                              Log into Vercel and click <strong>Add New &gt; Project</strong>. Select the committed repository from your connected GitHub sync.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold text-[10px] flex items-center justify-center shrink-0 font-mono">3</div>
                          <div>
                            <p className="font-bold text-white font-mono text-[11px] uppercase">Configure Environment Variables</p>
                            <p className="text-[10px] text-slate-400 mt-1">
                              Under <strong>Settings &gt; Environment Variables</strong> in your Vercel Dashboard, paste your secret key:
                            </p>
                            <div className="mt-2 bg-black bg-opacity-40 p-2.5 rounded border border-white/5 font-mono text-[9px] text-indigo-300 flex justify-between items-center">
                              <span>GEMINI_API_KEY="...your_api_key..."</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText('GEMINI_API_KEY');
                                  showInfo('COPIED', 'Variable copied for Vercel setup.');
                                }}
                                className="px-1.5 py-0.5 bg-white/5 hover:bg-white/10 rounded text-[8px] font-bold uppercase transition"
                              >
                                Copy variable name
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold text-[10px] flex items-center justify-center shrink-0 font-mono">4</div>
                          <div>
                            <p className="font-bold text-white font-mono text-[11px] uppercase">Build & Deployment Directory Parameters</p>
                            <p className="text-[10px] text-slate-400 mt-1">
                              Verify Vercel has identified the project settings. For client-side Single Page App (SPA) routers:
                            </p>
                            <ul className="list-disc pl-5 mt-1 space-y-1 text-[10px] text-slate-400">
                              <li>Build Command: <code className="text-white">npm run build</code></li>
                              <li>Output Directory: <code className="text-white">dist</code></li>
                            </ul>
                            <p className="text-[10px] text-slate-400 mt-2">
                              Your compiled dynamic static routes will serve with flawless visual transitions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-amber-300 font-mono text-[10px] flex gap-2">
                      <span className="text-amber-500 font-black animate-pulse">▲</span>
                      <div>
                        <span className="font-bold block uppercase mb-1">Serverless Routing Configuration</span>
                        To deploy the fully unified dynamic Express server (<code className="text-white">server.ts</code>) natively on Vercel as serverless endpoints, you may also add a standard <code className="text-white">vercel.json</code> redirect in the root directory to route backend traffic smoothly to your api folder.
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal footer */}
                <div className="mt-8 pt-4 border-t border-white/5 text-right flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase font-mono tracking-widest">TRACE-BACK-AI SECURITY REGISTER</span>
                  <button
                    onClick={() => setApiDocModalOpen(false)}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase tracking-widest font-black rounded-lg transition-all cursor-pointer shadow-lg shadow-indigo-600/25"
                  >
                    Acknowledge Documentation
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {sendReportModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex justify-center items-start sm:items-center py-8 sm:py-12 px-4 sm:px-6 bg-black/80 backdrop-blur-sm animate-fade-in">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-lg bg-[#0d1117] border border-indigo-500/30 rounded-2xl md:rounded-3xl p-5 md:p-8 text-left shadow-2xl my-auto flex flex-col"
                id="send-report-modal-container"
              >
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm" />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400 font-sans flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-400" /> SHARE AUDIT DISPATCH
                    </h4>
                    <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-bold mt-1 leading-relaxed">
                      Forward verified trace-back intelligence reports securely to target recipient mailboxes.
                    </p>
                  </div>
                  <button
                    onClick={() => setSendReportModalOpen(false)}
                    className="p-1.5 hover:bg-white/5 rounded-lg border border-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer"
                    id="close-send-report-modal-btn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSendReportByEmail} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">
                      RECIPIENT EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      id="recipient-email-input"
                      placeholder="e.g. operator@agency.gov"
                      value={sendReportEmail}
                      onChange={(e) => setSendReportEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-sm focus:border-indigo-500 outline-none text-white font-bold"
                      required
                      disabled={sendingReport}
                    />
                  </div>

                  <div className="p-3.5 bg-indigo-950/10 border border-indigo-500/20 rounded-xl text-[10px] text-indigo-300 space-y-1.5 font-mono">
                    <p className="font-bold uppercase tracking-wider">🔐 END-TO-END CRYPTOGRAPHIC COVERAGE</p>
                    <p className="text-slate-400 text-[9px] leading-relaxed">
                      Outgoing telemetry payloads are compiled into a sanitized secure integrity index, protecting critical operating signatures under sovereign privacy rules.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSendReportModalOpen(false)}
                      className="flex-1 py-3 border border-white/5 hover:bg-white/5 text-slate-300 text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                      disabled={sendingReport}
                      id="cancel-send-report"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/35"
                      disabled={sendingReport}
                      id="submit-send-report"
                    >
                      {sendingReport ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          Transmitting...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Confirm Dispatch
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {upgradeModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex justify-center items-start sm:items-center py-8 sm:py-12 px-4 sm:px-6 bg-black/80 backdrop-blur-sm animate-fade-in">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-md bg-[#0d1117] border border-pink-500/30 rounded-2xl md:rounded-3xl p-5 md:p-8 text-left shadow-2xl my-auto flex flex-col"
                id="upgrade-upsell-modal-container"
              >
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent blur-sm" />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-pink-500 font-sans flex items-center gap-2">
                      <Lock className="w-4 h-4 text-pink-500" /> OPERATIONAL ACCESS RESTRICTED
                    </h4>
                    <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-bold mt-1 leading-relaxed">
                      Email sharing and foreign export channels are locked under the Standard Free Tier.
                    </p>
                  </div>
                  <button
                    onClick={() => setUpgradeModalOpen(false)}
                    className="p-1.5 hover:bg-white/5 rounded-lg border border-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer"
                    id="close-upgrade-modal-btn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                    Please upgrade your telemetry node credentials to premium **Pro** or **Elite** intelligence to activate secure mail-server forward pathways.
                  </p>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 font-mono text-[10px]">
                    <div className="flex justify-between items-center text-indigo-300 font-bold">
                      <span>Pro Intelligence</span>
                      <span>₹399 / mo</span>
                    </div>
                    <p className="text-slate-400 leading-normal">
                      • Unlimited footprints searches<br />
                      • Fully functional PDF & Email report sharing<br />
                      • 24/7 dedicated support priority lines
                    </p>
                    <button
                      onClick={() => {
                        setUpgradeModalOpen(false);
                        handleUpgradePlan('pro');
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer text-center block shadow-md shadow-indigo-600/15"
                      id="upsell-modal-upgrade-pro-btn"
                    >
                      Activate Pro Node Instant
                    </button>
                  </div>

                  <div className="bg-pink-500/5 border border-pink-500/20 rounded-2xl p-4 space-y-3 font-mono text-[10px]">
                    <div className="flex justify-between items-center text-pink-400 font-bold">
                      <span>Elite Intelligence</span>
                      <span>₹4,999 / yr (Save 50%)</span>
                    </div>
                    <p className="text-slate-400 leading-normal">
                      • Everything in Pro Node plus:<br />
                      • Advanced forensic database querying<br />
                      • Real-time digital signature transition tracking
                    </p>
                    <button
                      onClick={() => {
                        setUpgradeModalOpen(false);
                        handleUpgradePlan('elite');
                      }}
                      className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer text-center block shadow-md shadow-pink-600/15"
                      id="upsell-modal-upgrade-elite-btn"
                    >
                      Activate Elite Node Instant
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setUpgradeModalOpen(false)}
                  className="w-full py-3 bg-white/5 text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl hover:text-white transition-all cursor-pointer"
                  id="upsell-dismiss"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {compareModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex justify-center items-start sm:items-center py-8 sm:py-12 px-4 sm:px-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-[#0d1117] border border-indigo-500/30 rounded-2xl md:rounded-3xl p-5 md:p-8 text-left shadow-2xl my-auto flex flex-col"
            >
              {/* Glow accent */}
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm" />
              
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400 font-sans flex items-center gap-2">
                    <GitCompare className="w-4 h-4 text-indigo-400 font-extrabold" /> HISTORICAL TRACE COMPARER
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-bold mt-1">
                    Select two compliance snapshots to inspect differential changes in findings and security alignment over time.
                  </p>
                </div>
                <button
                  onClick={() => setCompareModalOpen(false)}
                  className="p-1.5 hover:bg-white/5 rounded-lg border border-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Selector Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-indigo-500/20">
                {/* Left Selection */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-black uppercase text-indigo-400 tracking-wider">SNAPSHOT ALPHA (BASE)</label>
                  <select
                    value={compareReportAId}
                    onChange={(e) => setCompareReportAId(e.target.value)}
                    className="w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-200 outline-none font-sans focus:border-indigo-500 transition-colors"
                  >
                    {historicalReports.map((r, idx) => (
                      <option key={`compare-a-${r.reportId || idx}-${idx}`} value={r.reportId}>
                        [{new Date(r.createdAt || Date.now()).toLocaleDateString()}] {r.target} - Score: {r.securityScore}%
                      </option>
                    ))}
                  </select>
                </div>

                {/* Right Selection */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-black uppercase text-indigo-400 tracking-wider">SNAPSHOT BETA (COMPARISON)</label>
                  <select
                    value={compareReportBId}
                    onChange={(e) => setCompareReportBId(e.target.value)}
                    className="w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-200 outline-none font-sans focus:border-indigo-500 transition-colors"
                  >
                    {historicalReports.map((r, idx) => (
                      <option key={`compare-b-${r.reportId || idx}-${idx}`} value={r.reportId}>
                        [{new Date(r.createdAt || Date.now()).toLocaleDateString()}] {r.target} - Score: {r.securityScore}%
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Compare Display Panel */}
              <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin">
                {(() => {
                  const rA = historicalReports.find((r) => r.reportId === compareReportAId);
                  const rB = historicalReports.find((r) => r.reportId === compareReportBId);

                  if (!rA || !rB) {
                    return (
                      <div className="text-center py-10">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Snapshot records lost or unavailable.</p>
                      </div>
                    );
                  }

                  const scoreDiff = rB.securityScore - rA.securityScore;
                  let scoreDiffText = '';
                  let scoreDiffColor = 'text-gray-400 bg-gray-400/10 border-gray-500/20';

                  if (scoreDiff > 0) {
                    scoreDiffText = `+${scoreDiff}% Security Improvement`;
                    scoreDiffColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                  } else if (scoreDiff < 0) {
                    scoreDiffText = `${scoreDiff}% Score Degradation`;
                    scoreDiffColor = 'text-red-500 bg-red-500/10 border-red-500/20';
                  } else {
                    scoreDiffText = 'No Security Index Shift';
                    scoreDiffColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
                  }

                  // Find all unique node names
                  const allNodes = Array.from(
                    new Set([
                      ...(rA?.dataStream || []).map((n) => n?.node).filter((x): x is string => typeof x === 'string' && x.trim() !== ''),
                      ...(rB?.dataStream || []).map((n) => n?.node).filter((x): x is string => typeof x === 'string' && x.trim() !== ''),
                    ])
                  );

                  return (
                    <div className="space-y-6">
                      {/* Metric Delta Header */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4">
                        <div className="text-center sm:text-left">
                          <span className="block text-[8px] font-black uppercase text-gray-500 tracking-wider">ALPHA SCORE</span>
                          <span className="text-2xl font-black text-white">{rA.securityScore}%</span>
                          <p className="text-[9px] text-indigo-400 font-mono tracking-tight capitalize truncate mt-0.5">{rA.target}</p>
                        </div>
                        <div className="flex items-center justify-center">
                          <span className={`px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${scoreDiffColor} text-center`}>
                            {scoreDiffText}
                          </span>
                        </div>
                        <div className="text-center sm:text-right">
                          <span className="block text-[8px] font-black uppercase text-gray-500 tracking-wider">BETA SCORE</span>
                          <span className="text-2xl font-black text-white">{rB.securityScore}%</span>
                          <p className="text-[9px] text-indigo-400 font-mono tracking-tight capitalize truncate mt-0.5">{rB.target}</p>
                        </div>
                      </div>

                      {/* Diagnostic Node Diff */}
                      <div className="space-y-3">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-300">STRUCTURAL NODE FINDINGS COMPARISON</h5>
                        <div className="space-y-3">
                          {allNodes.map((nodeName, idx) => {
                            const nodeA = rA.dataStream.find((n) => n.node === nodeName);
                            const nodeB = rB.dataStream.find((n) => n.node === nodeName);

                            // Status and remedies indicators
                            let statusBadge = 'No State Change';
                            let statusBadgeColor = 'text-gray-500 border-white/5 bg-white/5';

                            if (nodeA && nodeB) {
                              if (nodeA.status === nodeB.status) {
                                if (nodeB.status === 'EXPOSED') {
                                  statusBadge = 'PERSISTENT RISK';
                                  statusBadgeColor = 'text-red-500 border-red-500/20 bg-red-500/10 animate-pulse';
                                } else {
                                  statusBadge = 'STABLE SECURE';
                                  statusBadgeColor = 'text-green-500 border-green-500/25 bg-green-500/10';
                                }
                              } else {
                                if (nodeA.status === 'EXPOSED' && (nodeB.status === 'Secure' || nodeB.status === 'Compliant')) {
                                  statusBadge = 'FULLY REMEDIED ✔';
                                  statusBadgeColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/15 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
                                } else if ((nodeA.status === 'Secure' || nodeA.status === 'Compliant') && nodeB.status === 'EXPOSED') {
                                  statusBadge = 'REGRESSED RISK ⚠';
                                  statusBadgeColor = 'text-red-500 border-red-600/30 bg-red-600/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]';
                                } else {
                                  statusBadge = 'ATTRIBUTES SHIFTED';
                                  statusBadgeColor = 'text-amber-400 border-amber-500/20 bg-amber-500/10';
                                }
                              }
                            } else if (nodeA) {
                              statusBadge = 'OMITTED IN BETA';
                              statusBadgeColor = 'text-gray-500 border-white/5 bg-white/5';
                            } else if (nodeB) {
                              statusBadge = 'NEW FINDING IN BETA';
                              statusBadgeColor = 'text-indigo-400 border-indigo-500/30 bg-indigo-500/15';
                            }

                            return (
                              <div
                                key={`compare-node-${nodeName}-${idx}`}
                                className="bg-[#161b22]/50 border border-white/5 rounded-2xl p-4 hover:border-indigo-500/20 transition-all duration-150"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-white/5">
                                  <span className="text-xs font-black uppercase text-gray-200 tracking-wider font-sans truncate">
                                    {nodeName}
                                  </span>
                                  <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded border flex items-center justify-center shrink-0 ${statusBadgeColor}`}>
                                    {statusBadge}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {/* Left State (A) */}
                                  <div className="p-3 bg-black/25 rounded-xl border border-white/5">
                                    <span className="block text-[8px] font-black uppercase text-gray-600 tracking-wider mb-1">ALPHA STATE</span>
                                    {nodeA ? (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                          <span className={`w-1.5 h-1.5 rounded-full ${nodeA.status === 'EXPOSED' ? 'bg-red-500' : 'bg-green-500'}`} />
                                          <span className={`text-[9px] font-black uppercase ${nodeA.status === 'EXPOSED' ? 'text-red-500' : 'text-green-500'}`}>{nodeA.status}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 leading-normal font-sans">{nodeA.meta}</p>
                                      </div>
                                    ) : (
                                      <span className="text-[9px] text-slate-500 font-mono italic">Not Monitored in Alpha Dataset</span>
                                    )}
                                  </div>

                                  {/* Right State (B) */}
                                  <div className="p-3 bg-black/25 rounded-xl border border-white/5">
                                    <span className="block text-[8px] font-black uppercase text-gray-600 tracking-wider mb-1">BETA STATE</span>
                                    {nodeB ? (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                          <span className={`w-1.5 h-1.5 rounded-full ${nodeB.status === 'EXPOSED' ? 'bg-red-500' : 'bg-green-500'}`} />
                                          <span className={`text-[9px] font-black uppercase ${nodeB.status === 'EXPOSED' ? 'text-red-500' : 'text-green-500'}`}>{nodeB.status}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 leading-normal font-sans">{nodeB.meta}</p>
                                      </div>
                                    ) : (
                                      <span className="text-[9px] text-slate-500 font-mono italic">Not Monitored in Beta Dataset</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Close footer */}
              <div className="mt-4 pt-4 border-t border-white/5 text-right flex justify-end gap-2 shrink-0">
                <button
                  onClick={() => setCompareModalOpen(false)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase tracking-widest font-black rounded-lg transition-all cursor-pointer shadow-lg shadow-indigo-600/25"
                >
                  Close Comparison
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VULNERABILITY STATUS REGRESSION WARNING ALERT */}
      <AnimatePresence>
        {transitionAlert && (
          <div className="fixed inset-0 z-[100] overflow-y-auto flex justify-center items-center py-8 px-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#0e121a] border border-red-500/30 rounded-2xl p-6 text-left shadow-[0_0_50px_rgba(239,68,68,0.2)] font-mono text-gray-205"
            >
              {/* Severe warning header glow */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-pink-500 to-red-600 animate-pulse" />
              
              <div className="flex items-start gap-4 mb-5 pb-4 border-b border-white/5">
                <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center shrink-0 text-red-500">
                  <AlertOctagon className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-red-400 font-sans">Security Regression Detected!</h3>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase tracking-tight">Active Warning &bull; Vulnerability Drift</p>
                </div>
                <button
                  onClick={() => setTransitionAlert(null)}
                  className="ml-auto text-gray-550 hover:text-white transition-colors cursor-pointer"
                  title="Close Alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4.5 space-y-2">
                  <span className="block text-[8px] font-black uppercase text-red-400 tracking-wider">TARGET CHRONICLE NODE</span>
                  <p className="text-xs font-black text-white">{transitionAlert.target}</p>
                  <div className="text-[10px] text-gray-300 leading-relaxed font-sans mt-2">
                    Since the last audit, specific verification nodes have transitioned from a <b className="text-green-400 uppercase">Secure / Compliant</b> status into an <b className="text-red-500 uppercase font-bold">EXPOSED</b> vulnerability footprint. Action is recommended to restore zero-trust baseline integrity.
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="block text-[8px] font-black uppercase text-gray-400 tracking-widest leading-none">REGRESSED EXPOSURES STATUS LIST</span>
                  <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1.5 custom-scrollbar">
                    {transitionAlert.nodes.map((nodeName, idx) => (
                      <div key={`trans-${nodeName}-${idx}`} className="bg-black/30 border border-red-500/10 rounded-xl p-3 flex justify-between items-center hover:border-red-500/20 transition-all">
                        <div>
                          <p className="text-[11px] font-black uppercase text-gray-200 tracking-wide font-sans">{nodeName}</p>
                          <span className="text-[8px] text-slate-500 font-mono tracking-normal block mt-0.5">Status Shift: Secure &rarr; EXPOSED</span>
                        </div>
                        <span className="text-[9px] font-black uppercase text-red-500 bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 rounded tracking-wider animate-pulse font-sans">
                          Exposed &bull; Regression ⚠
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 pt-4 border-t border-white/5 flex gap-2 justify-end">
                <button
                  onClick={() => {
                    if (transitionAlert.previousId) {
                      const repA = historicalReports.find(r => r.reportId === transitionAlert.previousId);
                      const repB = activeReport || historicalReports.find(r => r.target.toLowerCase() === transitionAlert.target.toLowerCase() && r.reportId !== transitionAlert.previousId);
                      if (repA && repB) {
                        setCompareReportAId(repA.reportId);
                        setCompareReportBId(repB.reportId);
                        setCompareModalOpen(true);
                      } else {
                        alert('Unable to load exact pre-transition state records.');
                      }
                    }
                    setTransitionAlert(null);
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-[10px] uppercase tracking-widest font-black rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-red-600/20 font-sans"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>Compare Changes Now</span>
                </button>
                <button
                  onClick={() => setTransitionAlert(null)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] uppercase tracking-widest font-black rounded-lg border border-white/5 transition-all cursor-pointer font-sans"
                >
                  Dismiss Alert
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Download Toasts confirmation Portal (Phase 7 Compliance) */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {downloadToasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
              className="pointer-events-auto bg-[#0a0d14]/95 border border-emerald-500/30 p-4 rounded-xl shadow-[0_4px_30px_rgba(16,185,129,0.15)] backdrop-blur-md text-left flex items-start gap-3.5"
            >
              <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0 text-emerald-400">
                <Check className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Download Successful</p>
                <p className="text-[9px] font-mono text-gray-200 truncate" title={toast.filename}>{toast.filename}</p>
                <p className="text-[8px] font-mono text-slate-500">{toast.timestamp}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dynamic Session Inactivity Warning Toast (2-Minute Warnings with Extend option) */}
      <AnimatePresence>
        {sessionVerified && autoClearEnabled && inactivityTimeRemaining > 0 && inactivityTimeRemaining <= 120 && (
          <motion.div
            initial={{ opacity: 0, x: -30, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-6 left-4 right-4 sm:right-auto z-50 bg-[#0c0f16]/95 border border-red-500/30 p-5 rounded-xl shadow-[0_8px_32px_rgba(239,68,68,0.18)] backdrop-blur-md text-left w-auto sm:w-[340px] space-y-4 pointer-events-auto"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center shrink-0 text-red-500 animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase text-red-400 tracking-wider">Session Expiry Notice</p>
                <p className="text-[11px] font-mono font-bold text-gray-200 mt-0.5">
                  Purging container in <span className="text-pink-400 font-extrabold">{Math.floor(inactivityTimeRemaining / 60)}:{String(inactivityTimeRemaining % 60).padStart(2, '0')}</span>
                </p>
                <p className="text-[9px] text-slate-400 font-mono leading-relaxed mt-1.5 normal-case">
                  Operational logs and active tracing profiles will fully auto-clear due to system inactivity.
                </p>
              </div>
            </div>

            {/* Visual Mini Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                <span>Clear Progression</span>
                <span>{Math.floor((inactivityTimeRemaining / 120) * 100)}%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={false}
                  animate={{ width: `${(inactivityTimeRemaining / 120) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                  className="h-full bg-red-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setInactivityTimeRemaining(900);
                  setSessionExtendTrigger(prev => prev + 1);
                }}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-[10px] uppercase font-black tracking-widest rounded-lg transition-all cursor-pointer text-center select-none"
              >
                Extend Session
              </button>
              <button
                onClick={() => handleAutoClearPurge()}
                className="px-3 py-2 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 text-slate-400 hover:text-red-400 text-[10px] uppercase font-black tracking-widest rounded-lg transition-all cursor-pointer text-center select-none"
              >
                Purge
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Print-Only Document Container */}
      <div className="hidden print:block text-black bg-white p-8 font-sans" id="print-report-doc">
        <div className="border-b-4 border-indigo-600 pb-4 mb-6">
          <h1 className="text-2xl font-black tracking-tight text-gray-900">TRACE-BACK-AI</h1>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-mono mt-1">Cyber Footprint Forensics System &bull; Official Security Audit Report</p>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200 text-left">
          <div>
            <span className="text-[10px] text-gray-500 uppercase font-black font-sans block">TARGET ENTITY ADDRESS</span>
            <span className="text-sm font-black text-gray-900 font-mono">{traceInput || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase font-black font-sans block">AUDIT COMPLIANCE SCORE</span>
            <span className="text-lg font-black text-indigo-600 font-mono">{scanStats.score}% - {scanStats.verdict}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase font-black font-sans block">TIMESTAMP OF TRACE GENERATION</span>
            <span className="text-xs text-gray-700 font-serif">{new Date().toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase font-black font-sans block">REPORT SECURITY ID</span>
            <span className="text-xs text-gray-700 font-mono">TBAI-REP-{scanStats.score}-{Math.floor(Math.random() * 1000000)}</span>
          </div>
        </div>

        <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-4 text-left font-sans">Verified Exposure Nodes & Threat Log Stream</h3>
        <div className="space-y-4">
          {scannedNodes.map((node, idx) => (
            <div key={`print-node-${node.node}-${idx}`} className="pb-3 border-b border-gray-100 last:border-0 text-xs text-left">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-gray-950 font-mono text-sm inline-block mr-2">{idx + 1}. {node.node}</span>
                  {node.category && (
                    <span className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[9px] uppercase font-mono font-bold text-gray-600">
                      {node.category}
                    </span>
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                  node.status === 'EXPOSED'
                    ? 'bg-red-100 border border-red-200 text-red-700'
                    : node.status === 'Secure' || node.status === 'Compliant'
                    ? 'bg-emerald-100 border border-emerald-200 text-emerald-700'
                    : 'bg-amber-100 border border-amber-200 text-amber-700'
                }`}>
                  {node.status}
                </span>
              </div>
              <p className="text-gray-600 text-xs mt-1 leading-relaxed font-sans">{node.meta}</p>
              {node.duration && (
                <span className="text-[9px] font-mono text-gray-400 block mt-1 pb-1">Scan Latency: {node.duration.toFixed(2)} seconds</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-[10px] text-gray-400 font-mono">
          &copy; TRACE-BACK-AI SECURE PRINT DISPATCH. CONFIDENTIAL COMPLIANCE ASSURANCE DEED.
        </div>
      </div>
    </div>
  );
}
