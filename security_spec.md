# Trace-Back-AI Security Specification

## 1. Data Invariants
- **User Integrity**: A user profile must have `subscriptionStatus` initialized as `'free'` if created on the client side. Only server-side functions can upgrade users to `'pro'` or `'elite'`.
- **Identity Lock**: A user's `userId` must strictly align with `request.auth.uid`. No user can read or query resources belonging to other UIDs.
- **Support Inbox Privacy**: Inbound contact queries to `support_queries` can only be appended to the inbox by anyone (to allow guests to contact Support), but read or write queries are disabled to maintain perfect confidentiality.
- **Refund Guarantee Rules**: A user can submit a standard refund request under the 7-day policy. Once created, refund requests are immutable to prevent tampering of approval state from client side.

## 2. The "Dirty Dozen" Hack Payloads
1. **Self-Approve Premium Profile Creation**: UID `attacker` registers a profile with `subscriptionStatus: "elite"` and `paymentStatus: true`.
2. **Subscription Tier Hijack**: Authenticated user `userA` attempts to modify their profile status field from `'free'` to `'pro'`.
3. **Cross-User Account Leak**: Authenticated user `userA` attempts to read `/users/userB`'s private profile.
4. **Third-Party Report Hijack**: User `userA` submits a forensic scan target to `/audit_reports/report123` but overrides `userId` to `userB` to frame them or leak data.
5. **PII Query Scraping**: Unauthenticated attacker runs a wildcard list query against target profiles.
6. **Support Message Hijacking**: Guest user sends support query then attempts to read/list all other support queries to sniff user data or contact details.
7. **Refund Approval Manipulation**: User `userA` creates a refund request with `status: "approved"` to bypass administrative reviews.
8. **Stale Refund Payload Update**: User `userA` modifies a pending refund request's destination details post-submission.
9. **Denial-of-Wallet Identity Poisoning**: Creating IDs featuring 2KB malicious payload strings to crash DB processing engines.
10. **Timestamp Fraud**: Injecting clinical spoofed timestamps `createdAt: "2020-01-01"` inside a profile update to trick streak algorithms.
11. **Shadow Ghost Fields**: Injecting non-existent billing fields like `isAdmin: true` inside flat profiles to gain backdoor privileges.
12. **Malformed Scans Storage**: Injecting invalid nested objects inside simple scalar audit values.

## 3. Test Invariants (Unit & Security Rules)
All dirty payloads are denied at the security engine level:
```typescript
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
// Security tests verify that status, payment, and role mutations fail with PERMISSION_DENIED.
```
