# Security Specification & Threat Model

## 1. Data Invariants
- Members can only modify or view authorized records.
- System financial parameters (`/system_settings/financials`) can only be modified by authorized administrators (`antcoder.dev@gmail.com`).
- Demo archive repository (`/demo_archives/{archiveId}`) is strictly accessible to administrators for staging, injecting, or archiving test datasets.
- Transactions must strictly validate numeric constraints (`sharesAmount >= 0`, `currencyAmount >= 0`).
- Contact submissions can be created by visitors/members (`status: 'Pending'`), but only modified or reviewed by administrators.

## 2. The "Dirty Dozen" Threat Payloads
1. **Unauthenticated System Override**: Attempting to write to `/system_settings/financials` without authentication or admin privileges.
2. **Negative Balance Manipulation**: Injecting `{ sharesAmount: -50000 }` to artificially manipulate share counts.
3. **Ghost Role Injection**: Adding `{ role: 'admin' }` to member profile to escalate privileges.
4. **Forged Status Modification**: Setting a transaction directly to `Approved` by an unverified third party.
5. **Unauthorized Demo Injection**: Bypassing admin authentication to write to `/demo_archives`.
6. **Denial-of-Wallet Long String**: Injecting a 2MB note into a submission or transaction record.
7. **Contact Submission Hijacking**: Modifying an investor submission from `Pending` to `Reviewed` by a regular client.
8. **Spoofed Member Identifier**: Overwriting another member's profile document with arbitrary data.
9. **Direct Deletion of Ledger**: Calling delete on transactions or system settings without admin approval.
10. **Archive Poisoning**: Corrupting `payloadJson` in the demo folder with dangerous executable strings.
11. **Malicious Path Traversal ID**: Attempting to write to document IDs containing special regex characters or slashes.
12. **Unverified Email Claim Spoof**: Impersonating an admin email without verified token status.
