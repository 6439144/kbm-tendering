# KBM Procurement & Tender Management SaaS Platform

[![Tests](https://img.shields.io/badge/Tests-35%2F35%20Passing-brightgreen)]()
[![Zero-Cost Bootstrap](https://img.shields.io/badge/Azure%20Bootstrap-%240%2Fmo%20Free%20Tier-blue)]()
[![Bilingual](https://img.shields.io/badge/UI-Arabic%20RTL%20%7C%20English%20LTR-purple)]()
[![Marketplace](https://img.shields.io/badge/Microsoft%20Marketplace-SaaS%20Fulfillment%20v2-orange)]()

Production-grade, bilingual (Arabic RTL / English LTR), multi-tenant SaaS platform for government and enterprise procurement and tender management, built according to the **KBM Master Build Prompt**, **Ministry of Interior (MOI) BRD**, and **Historical Practices & Tenders Workflow Trackers**.

---

## 1. 16-Repository Architecture

The platform bounded contexts are strictly partitioned across 16 discrete repositories:

```
c:/Users/kabed/KBM Tendering/
├── kbm-platform-contracts/          # OpenAPI v3 Specs, CloudEvents Schemas, Contract Tests
├── kbm-platform-edge/               # Edge Gateway, Reverse Proxy, Rate Limiting, Security Headers
├── kbm-platform-procurement-service/# Tender Intake (Raslni & GM Letter), Publication, Eligibility
├── kbm-platform-vendor-service/     # Onboarding, Grading (1st-3rd), Suspension, Exemptions
├── kbm-platform-workflow-service/   # Versioned Engine, Practices & Tenders Tracker Templates
├── kbm-platform-payment-service/    # KNET Adapter, Idempotent Callbacks, Receipt Generation
├── kbm-platform-document-service/   # Storage, Secure Tokenized Access, Watermarking Metadata
├── kbm-platform-notification-service# Notifications Engine (Email/SMS sandbox, Expiry Alerts)
├── kbm-platform-integration-service/# Adapters for Raslni, MoCI Activity Codes, KNET, Entra ID
├── kbm-platform-audit-service/      # Cosmos DB Append-Only Model, SHA-256 Hash Chaining
├── kbm-platform-marketplace-service/# Azure Marketplace SaaS Fulfillment v2 API & Webhooks
├── kbm-platform-ui/                 # Bilingual Portals (Staff, Vendor, Tenant Admin, Operator)
├── kbm-platform-infrastructure/     # Bicep IaC (Bootstrap $0/mo vs Production), Budget Alerts
├── kbm-platform-qa/                 # E2E Test Suites, Negative Security Tests, Performance
├── kbm-platform-docs/               # Gate 0-5 Docs, ADRs, Threat Models, Marketplace Offer Pack
└── kbm-repo-template/               # Standard CI/CD, CODEOWNERS, Security & Contribution Rules
```

---

## 2. Core Capabilities Implemented

1. **Bilingual Arabic/English (RTL/LTR) Experience**: Native support with Cairo & Inter typography across all 4 portals.
2. **4 Role-Aware Portals**:
   - **Internal Staff Portal**: Intake requests (Raslni & GM letter scan upload), workflow task reviews, tender publishing.
   - **Vendor Portal**: Qualification onboarding, annual subscription, eligible tenders catalog, dynamic anti-screenshot watermarked viewer, KNET checkout.
   - **Tenant Admin Portal**: Vendor grading (1st/2nd/3rd), date-range suspensions, exemptions, immutable audit explorer with live SHA-256 chain verification.
   - **Platform Operator Portal**: Multi-tenant management, SaaS subscriptions, feature flags, health diagnostics.
3. **Historical Workflow Trackers**: Pre-seeded editable templates for **Practices (8 tasks, 3 stages)** and **Tenders (35 tasks, 5 stages)** with relative weights and SLAs.
4. **Anti-Screenshot Content Deterrence**: Dynamic HTML5 Canvas watermarking overlay (Company name, CR, IP, timestamp).
5. **KNET Payment & Printable Receipts**: Idempotent callbacks, signature verification, and official branded receipts (`REC-YYYY-SEQ`).
6. **Microsoft Marketplace SaaS Fulfillment v2**: Turnkey landing page, purchase token resolution (`/api/marketplace/resolve`), subscription activation, and webhook processing.
7. **Zero-Cost Free Bootstrap Compliance**: Target $0/month Azure consumption on Free Tier (F1 App Service, Free App Config, Cosmos DB Free Tier) with parameterized Bicep IaC.

---

## 3. Quick Start & Demonstration

### Start Local Services
```powershell
# Start both backend API (port 3001) and web portal (port 3000)
npm start
```
Then open: **http://localhost:3000**

### Demo Login Credentials
- **Staff Portal**: `staff@kbm.demo` / `password123`
- **Tenant Admin**: `tenant-admin@kbm.demo` / `password123`
- **Vendor Portal**: `vendor@kbm.demo` / `password123`

---

## 4. Verification & Quality Gates

```powershell
# Run the complete test suite (35/35 passing)
npm test

# Run the end-to-end vertical slice smoke test
npm run smoke

# Run the zero-cost bootstrap governance policy check
npm run bootstrap:validate
```
