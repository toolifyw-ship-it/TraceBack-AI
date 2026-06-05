import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Ensure standard user-agent and settings for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const app = express();
app.use(express.json());

const PORT = 3000;

// Simple database in memory to handle server-side demo flow or config validations
// In a full production build, we sync these or look them up from Firestore
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
  parentContact?: string;
}

// In-memory sync database mockup so server validations like lockout, payments, and 5% limit refund can run beautifully.
const usersDb: Record<string, TempAuthUser> = {};
const refundRequests: Array<{ refundId: string; userId: string; email: string; status: string }> = [];

let approvedRefundsCount = 0;
let totalPaidUsersCount = 10; // default bootstrapped seed users to prove rules

// 1. Core API: Gemini API Forensic Scan Generator
app.post('/api/forensic/trace', async (req, res) => {
  const { target, type, userId } = req.body;

  if (!target) {
    return res.status(400).json({ error: 'Target query is required.' });
  }

  try {
    // Call Gemini API to perform robust footprint research
    const model = 'gemini-3.5-flash';
    const response = await ai.models.generateContent({
      model,
      contents: `Explain digital footprint audit trace details for target: "${target}" of type "${type}". 
Generate mock forensic details. Ensure accuracy, look up potential breaches related to similar patterns or security recommendations.
Format the output strictly as a JSON object matching this schema:
{
  "securityScore": <number between 10 and 100>,
  "dataStream": [
    {
      "node": "Full name of Node scanned",
      "status": "One of: Secure, Found, EXPOSED, Fragmented, Compliant",
      "meta": "Detailed description description of findings or recommended defensive action"
    }
  ]
}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['securityScore', 'dataStream'],
          properties: {
            securityScore: { type: Type.INTEGER, description: 'Trace safety index' },
            dataStream: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['node', 'status', 'meta'],
                properties: {
                  node: { type: Type.STRING },
                  status: { type: Type.STRING },
                  meta: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const text = response.text || '';
    const parsedData = JSON.parse(text);

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error('Gemini Trace Failure:', error);
    res.status(500).json({
      error: 'Failed to carry out intelligence trace.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// 2. Subscription Expiry / Force Lockout Status Sync API
app.post('/api/user/sync-status', (req, res) => {
  const { userId, email, phone, age, subscriptionStatus, subscriptionExpires, paymentStatus, parentContact } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'UserID is required' });
  }

  // Update in-memory tracker
  usersDb[userId] = {
    userId,
    email: email || '',
    phone: phone || '',
    age: Number(age) || 0,
    subscriptionStatus: subscriptionStatus || 'free',
    subscriptionExpires: subscriptionExpires || '',
    paymentStatus: !!paymentStatus,
    parentContact: parentContact || '',
    createdAt: usersDb[userId]?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  res.json({ success: true, user: usersDb[userId] });
});

// Lockout Evaluation Hook
app.get('/api/user/status/:userId', (req, res) => {
  const { userId } = req.params;
  const user = usersDb[userId];

  if (!user) {
    return res.json({ locked: false });
  }

  const now = new Date();
  const expiry = user.subscriptionExpires ? new Date(user.subscriptionExpires) : null;
  const isExpired = expiry ? now > expiry : false;

  // Subscription expiry logic
  // subscription_status = expired AND payment_not_received = true
  const paymentReceived = user.paymentStatus;
  const isPremiumPlan = user.subscriptionStatus !== 'free';

  const shouldLock = isPremiumPlan && isExpired && !paymentReceived;

  res.json({
    locked: shouldLock,
    isExpired,
    paymentReceived,
    details: {
      subscriptionStatus: user.subscriptionStatus,
      expires: user.subscriptionExpires,
    },
  });
});

// 3. Subscription simulation hooks (Stripe / Razorpay Demo Mock server validation)
app.post('/api/payment/simulate', (req, res) => {
  const { userId, plan } = req.body;
  const user = usersDb[userId];

  if (!user) {
    return res.status(404).json({ error: 'User node not found.' });
  }

  // Simulate server-side payment validation
  const expiryDate = new Date();
  if (plan === 'yearly') {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  } else {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  }

  user.subscriptionStatus = plan;
  user.subscriptionExpires = expiryDate.toISOString();
  user.paymentStatus = true;
  user.updatedAt = new Date().toISOString();

  totalPaidUsersCount++;

  res.json({
    success: true,
    message: `Secure Payment verified server-side for plan: ${plan}`,
    user,
  });
});

// 4. Contact Form Inbound Submission & Email Hook (Sends alert to sukanta.singha786@gmail.com)
app.post('/api/contact/submit', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Fields validation error.' });
  }

  console.log(`[ALERT] Inbound support forensic message to sukanta.singha786@gmail.com:`);
  console.log(`From: ${name} <${email}>`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);

  // Simulates outbound mail success
  res.json({
    success: true,
    message: 'Forensic request successfully submitted to the support queue.',
  });
});

// 5. Subscription Refund Enforcement Engine
// "Refund Rule: Only 5% of total successful users can receive refunds."
// Example: 100 Paid Users -> Max 5 Refunds
app.get('/api/refunds/analytics', (req, res) => {
  const refundPercentage = totalPaidUsersCount > 0 ? (approvedRefundsCount / totalPaidUsersCount) * 100 : 0;
  res.json({
    totalUsers: totalPaidUsersCount,
    totalRefundsApproved: approvedRefundsCount,
    refundPercentage: Math.round(refundPercentage * 100) / 100,
    limitReached: refundPercentage >= 5.0,
  });
});

app.post('/api/refunds/request', (req, res) => {
  const { userId, email, reason } = req.body;

  if (!userId || !email || !reason) {
    return res.status(400).json({ error: 'Missing refund fields.' });
  }

  // Check 5% rule before accepting or approving
  const currentPercentage = totalPaidUsersCount > 0 ? (approvedRefundsCount / totalPaidUsersCount) * 100 : 0;

  if (currentPercentage >= 5.0) {
    return res.json({
      success: false,
      message: 'REFUND ERROR: Relational risk quota exceeded. We cannot approve refunds exceeding 5% of the total paid user base. Contact compliance at support@traceback.ai.',
      allowed: false,
    });
  }

  // Accept request
  const refundId = 'ref_' + Math.random().toString(36).substr(2, 9);
  const newRefund = { refundId, userId, email, reason, status: 'pending' };
  refundRequests.push(newRefund);

  res.json({
    success: true,
    refundId,
    message: 'Refund request generated successfully. Awaiting compliance validation.',
    allowed: true,
  });
});

// 6. Mock Email Summary Trigger Endpoint
app.post('/api/forensic/email-summary', (req, res) => {
  const { email, target, securityScore, verdict, scannedNodes } = req.body;

  if (!email || !target) {
    return res.status(400).json({ error: 'Email and target fields are required.' });
  }

  console.log(`======================================================================`);
  console.log(`[MOCK EMAIL SERVER SENT]`);
  console.log(`To: ${email}`);
  console.log(`Subject: TraceBack AI Forensic Audit Report - ${target}`);
  console.log(`----------------------------------------------------------------------`);
  console.log(`Audit Target: ${target}`);
  console.log(`Safety Index Check: ${securityScore}% (${verdict})`);
  console.log(`Detected Nodes / Breach Channels:`);
  
  if (Array.isArray(scannedNodes)) {
    scannedNodes.forEach((item) => {
      console.log(` - [${item.status || 'REPORTED'}] ${item.node || ''}: ${item.meta || ''}`);
    });
  } else {
    console.log(` - No nodes scanned.`);
  }
  console.log(`======================================================================`);

  res.json({
    success: true,
    message: `A diagnostic cyber audit summary has been flagged and transmitted to your verified registered address: ${email}`,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/refunds/approve', (req, res) => {
  const { refundId } = req.body;
  const reqObj = refundRequests.find((r) => r.refundId === refundId);

  if (!reqObj) {
    return res.status(404).json({ error: 'Refund inquiry node not found.' });
  }

  const currentPercentage = totalPaidUsersCount > 0 ? (approvedRefundsCount / totalPaidUsersCount) * 100 : 0;
  if (currentPercentage >= 5.0) {
    reqObj.status = 'declined';
    return res.json({
      success: false,
      message: 'Failed to approve. Action blocked by security percentage threshold (5% rule).',
    });
  }

  reqObj.status = 'approved';
  approvedRefundsCount++;

  // Sync user status back to free
  const user = usersDb[reqObj.userId];
  if (user) {
    user.subscriptionStatus = 'free';
    user.paymentStatus = false;
    user.subscriptionExpires = '';
  }

  res.json({
    success: true,
    message: 'Refund approved legally. User credential keys retracted.',
    stats: {
      totalPaidUsersCount,
      approvedRefundsCount,
    },
  });
});

// Mount Vite middleware for dev or Serve compiled client
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TRACE-BACK-AI SYSTEM CORE] Running securely on port ${PORT}`);
  });
}

startServer();
