# KBM Platform — STRIDE Threat Model & Security Controls

This document details the STRIDE threat analysis across the KBM SaaS architecture, identifying specific threat vectors, impact ratings, mitigations, and verification mechanisms.

```
========================================================================================
                              STRIDE THREAT MATRIX
========================================================================================
```

| STRIDE Category | Threat Vector | Impact | Target Component | Architecture Mitigation | Verification Test |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Spoofing** | Attacker impersonates internal MOI staff or legitimate vendor identity. | High | Edge Gateway / Auth Service | Microsoft Entra ID OIDC tokens, signed JWTs with short expiry (15m), server-side signature validation. | `auth-service.test.js` |
| **Tampering** | Man-in-the-middle modifies KNET payment callback amount or status. | Critical | Payment Gateway Adapter | Server-side cryptographic HMAC SHA-256 validation of callback payload; direct server-to-server inquiry. | `payment.test.js` |
| **Tampering** | Rogue actor alters historical workflow decision or audit records. | High | Audit Service / Cosmos DB | Append-only store with immutable SHA-256 hash chaining (`previousHash` -> `currentHash`). | `audit.test.js` |
| **Repudiation** | Staff member denies issuing an approval or rejection. | Medium | Workflow Engine | Comprehensive audit event generated for every transition containing actor ID, IP, timestamp, role, and comment. | `workflow.test.js` |
| **Information Disclosure** | Ineligible vendor accesses tender technical documents or cross-tenant data. | Critical | Procurement API / Document Service | Server-side eligibility evaluation on every direct object access; strict tenant and vendor ID scoping. | `tenant-policy.test.js`, `domain.test.js` |
| **Information Disclosure** | Vendor captures tender pages via browser screenshots. | Medium | Vendor Portal UI / Document Service | Dynamic Canvas Security Watermarking (vendor name, Tax ID, timestamp, IP) + no-cache and anti-print headers. | `e2e.test.js` |
| **Denial of Service** | Malicious bot spams tender purchase or registration endpoints. | Medium | Edge Gateway | Edge rate limiting (100 req/min per IP), request body size limits (10MB max), and input validation schemas. | `edge.test.js` |
| **Elevation of Privilege** | Vendor user accesses internal MOI administration endpoints. | Critical | Edge Gateway / Tenant Policy | Role-based and claim-based access control (`ROLE_STAFF`, `ROLE_TENANT_ADMIN`, `ROLE_OPERATOR`) enforced at middleware. | `tenant-policy.test.js` |

---

## Content Deterrence & Anti-Screenshot Architecture

While browser environments cannot technically intercept hardware cameras or OS-level screen grabbers with 100% mathematical guarantee, KBM implements active deterrence controls:

1. **Dynamic Visual Watermarking**: Rendered via non-bypassable HTML5 canvas and SVG overlay with rotated translucent text:
   `CONFIDENTIAL - MOI TENDER - {Vendor_Name} ({Vendor_CR}) - {Timestamp} - {Client_IP}`
2. **Context Menu & Print Interception**: Disabled standard right-click download and custom CSS `@media print { display: none; }` with dedicated watermarked print generator.
3. **Short-Lived Signed URLs**: Document blobs are accessible solely through HMAC-signed temporary tokens with a 5-minute TTL.
4. **View Auditing**: Every access to tender documents records an immutable audit log entry.

