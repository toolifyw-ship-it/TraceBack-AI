import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

dotenv.config();

// --- VERCEL COMPATIBLE SAFE FIREBASE LOADING ---
let firebaseConfig;

if (process.env.VITE_FIREBASE_CONFIG) {
  // Vercel deployment variables values match nibe
  try {
    firebaseConfig = JSON.parse(process.env.VITE_FIREBASE_CONFIG);
  } catch (e) {
    console.error("Failed to parse VITE_FIREBASE_CONFIG json string.");
    firebaseConfig = null;
  }
} else {
  // Shudhu local system run time loop condition paths structure checking
  try {
    const localConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(localConfigPath)) {
      firebaseConfig = JSON.parse(fs.readFileSync(localConfigPath, 'utf-8'));
    }
  } catch (err) {
    console.warn("Local JSON file load warning context path skipped.");
  }
}

// Fail-safe default dummy configuration object placeholder layout mapping logic
if (!firebaseConfig) {
  firebaseConfig = {
    apiKey: "mock-key-placeholder",
    authDomain: "mock-domain.firebaseapp.com",
    projectId: "mock-project",
    storageBucket: "mock-bucket.appspot.com",
    messagingSenderId: "00000000",
    appId: "1:0000:web:mock",
    firestoreDatabaseId: "(default)"
  };
}

const firebaseApp = initializeApp(firebaseConfig);
const db = initializeFirestore(firebaseApp, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || '(default)');

// Ensure standard user-agent and settings for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export const app = express();
app.use(express.json());

const PORT = 3000;

interface TempAuthUser {
  userId: string;
  email: string;
  phone: string;
  age: number;
  subscriptionStatus: 'free' | 'pro' | 'elite';
  subscriptionExpires: string;
  paymentStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

const usersDb: Record<string, TempAuthUser> = {};
const refundRequests: Array<{
  refundId: string;
  userId: string;
  email: string;
  reason: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
  updatedAt: string;
}> = [];

let approvedRefundsCount = 0;

function generateFallbackData(target: string, type: 'email' | 'phone') {
  return {
    reportId: `fallback_${Math.random().toString(36).substring(2, 11)}`,
    userId: 'guest_user',
    target,
    type,
    securityScore: 78,
    dataStream: [
      { node: "Secure Node Verification", status: "Secure", meta: "SSL and Encryption rules pass", duration: 12 },
      { node: "Inbound Port Scan Matrix", status: "Compliant", meta: "Zero vulnerabilities caught", duration: 45 },
      { node: "Leaked Credential Lookup", status: "Found", meta: "Aged data found in public dump indexes", duration: 110, category: "Data Leak" }
    ],
    createdAt: new Date().toISOString()
  };
}

// REST APIs
app.post('/api/auth/register-check', (req, res) => {
  const { email, phone, userId } = req.body;
  if (!email || !phone || !userId) {
    return res.status(400).json({ success: false, message: 'Missing fields.' });
  }
  const emailLower = email.toLowerCase().trim();
  const phoneTrim = phone.trim();

  const abuseFound = Object.values(usersDb).some(
    (u) => (u.email.toLowerCase() === emailLower || u.phone === phoneTrim) && u.userId !== userId
  );

  if (abuseFound) {
    return res.json({
      success: false,
      abuseDetected: true,
      message: 'Abuse Flagged: Identity elements linked to another active free account configuration layout.',
    });
  }

  if (!usersDb[userId]) {
    usersDb[userId] = {
      userId,
      email: emailLower,
      phone: phoneTrim,
      age: 21,
      subscriptionStatus: 'free',
      subscriptionExpires: new Date(Date.now() + 30 * 86400000).toISOString(),
      paymentStatus: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  res.json({ success: true, abuseDetected: false, user: usersDb[userId] });
});

app.post('/api/audit/generate', async (req, res) => {
  const { target, type } = req.body;
  if (!target || !type) {
    return res.status(400).json({ success: false, message: 'Missing target details.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ success: true, isFallback: true, report: generateFallbackData(target, type) });
  }

  try {
    const prompt = `Perform a mock cybersecurity deep forensic profile evaluation trace simulation context layout report analysis matching targets on the input criteria. Target: "${target}", Mode: "${type}". Extract metrics dynamic values structured as raw json schema format object.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reportId: { type: Type.STRING },
            userId: { type: Type.STRING },
            target: { type: Type.STRING },
            type: { type: Type.STRING },
            securityScore: { type: Type.INTEGER },
            dataStream: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  node: { type: Type.STRING },
                  status: { type: Type.STRING },
                  meta: { type: Type.STRING },
                  duration: { type: Type.INTEGER },
                  category: { type: Type.STRING },
                },
                required: ['node', 'status', 'meta'],
              },
            },
            createdAt: { type: Type.STRING },
          },
          required: ['reportId', 'target', 'type', 'securityScore', 'dataStream'],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty model response trace.");
    const parsedReport = JSON.parse(jsonText);
    res.json({ success: true, isFallback: false, report: parsedReport });
  } catch (error) {
    res.json({ success: true, isFallback: true, report: generateFallbackData(target, type) });
  }
});

app.post('/api/refunds/submit', (req, res) => {
  const { userId, email, reason } = req.body;
  if (!userId || !email || !reason) {
    return res.status(400).json({ success: false, message: 'Missing data criteria.' });
  }

  const newReq = {
    refundId: `ref_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    email,
    reason,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  refundRequests.push(newReq);
  res.json({ success: true, refund: newReq });
});

app.post('/api/refunds/process-approve', (req, res) => {
  const { refundId } = req.body;
  const reqObj = refundRequests.find((r) => r.refundId === refundId);

  if (!reqObj) {
    return res.status(404).json({ success: false, message: 'Target refund record not found.' });
  }
  if (reqObj.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'Request processed already.' });
  }

  const totalPaidUsersCount = Object.values(usersDb).filter((u) => u.paymentStatus).length || 1;
  const currentPercentage = totalPaidUsersCount > 0 ? ((approvedRefundsCount + 1) / totalPaidUsersCount) * 100 : 0;
  
  if (currentPercentage >= 5.0) {
    reqObj.status = 'declined';
    return res.json({
      success: false,
      message: 'Failed to approve. Action blocked by security percentage threshold (5% rule).',
    });
  }

  reqObj.status = 'approved';
  approvedRefundsCount++;

  const user = usersDb[reqObj.userId];
  if (user) {
    user.subscriptionStatus = 'free';
    user.paymentStatus = false;
    user.subscriptionExpires = '';
  }

  res.json({
    success: true,
    message: 'Refund approved legally.',
    stats: { totalPaidUsersCount, approvedRefundsCount },
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`Server executing successfully on http://localhost:${PORT}`);
    });
  }
}

startServer();
