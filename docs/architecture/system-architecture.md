# KBM Procurement & Tender Management Platform — Complete System Architecture

```
========================================================================================
                      KBM ENTERPRISE MULTI-TENANT ARCHITECTURE
========================================================================================
```

## 1. High-Level Architectural Topology

```mermaid
graph TB
    subgraph "1. Client & Presentation Layer (Bilingual UI / Portals)"
        STAFF["🏛️ Internal Staff Portal<br/>(Intake, Workflow Tracker, Publishing)"]
        ADMIN["⚙️ Tenant Admin Portal<br/>(Vendor Governance, Audit Explorer)"]
        VENDOR["🏢 Qualified Vendor Portal<br/>(Eligibility, KNET, Watermarked Viewer)"]
        MKT["🛒 Marketplace SaaS Portal<br/>(SaaS Fulfillment v2 Onboarding)"]
    end

    subgraph "2. Edge & Security Gateway Layer (OWASP ASVS Hardened)"
        EDGE["🛡️ Edge Gateway & Reverse Proxy<br/>(Rate Limiting, HSTS, CSP, Tenant Context)"]
        AUTH_MW["🔑 Auth & Tenant Policy Middleware<br/>(Role Verification, IDOR / BOLA Prevention)"]
    end

    subgraph "3. Microservices & Domain Bounded Contexts"
        WF["🔄 Workflow Service<br/>(8-Step Practices & 35-Step Tenders Engine)"]
        PROC["📋 Procurement Service<br/>(Intake, MoCI Activity & Grade Eligibility)"]
        VEND["🏢 Vendor Service<br/>(3-Grade Classification, Suspensions, Upgrades)"]
        PAY["💳 Payment Service<br/>(KNET Checkout, Idempotent Webhook, Receipts)"]
        DOC["📄 Document Service<br/>(MIME Allowlist, Dynamic Anti-Screenshot Watermark)"]
        NOTIF["🔔 Notification Service<br/>(NOT-001..NOT-005 Action Engine)"]
        AUDIT["🔒 Audit & Compliance Service<br/>(SHA-256 Hash Chaining, Tamper Verification)"]
        MKT_SVC["🛒 Marketplace Service<br/>(Azure Marketplace Fulfillment v2)"]
    end

    subgraph "4. Integration Adapters Layer"
        RASLNI_ADAPT["🏛️ Raslni G2G Adapter<br/>(Electronic Government Correspondence)"]
        MOCI_ADAPT["📑 MoCI Catalog Adapter<br/>(Commercial Activity Codes & Grades)"]
        ENTRA_ADAPT["👥 Entra ID / SSO Adapter<br/>(AD Group-to-Role Mapping)"]
    end

    subgraph "5. Data Persistence & Cryptographic Ledger"
        COSMOS["🗄️ Azure Cosmos DB Free Tier (1,000 RU/s, 25 GB)<br/>(Shared Database: kbm-procurement-db | Key: /tenantId)"]
        BLOB["📦 Azure Blob Storage / Azurite<br/>(Encrypted Tender Specs & Scans: kbmbootstrapsa)"]
        APPCONFIG["⚙️ Azure App Configuration<br/>(Feature Flags & Settings: kbm-bootstrap-appconfig)"]
    end

    subgraph "6. External Government & Enterprise Systems"
        G2G["🇰🇼 Kuwait G2G Network (Raslni)"]
        MOCI_SYS["🏛️ Ministry of Commerce & Industry"]
        KNET_GW["💳 KNET Payment Gateway"]
        AZ_MKT["☁️ Microsoft Azure Commercial Marketplace"]
        AZ_AD["🏢 Microsoft Entra ID (Active Directory)"]
    end

    %% Client to Edge
    STAFF --> EDGE
    ADMIN --> EDGE
    VENDOR --> EDGE
    MKT --> EDGE

    %% Edge to Services
    EDGE --> AUTH_MW
    AUTH_MW --> WF
    AUTH_MW --> PROC
    AUTH_MW --> VEND
    AUTH_MW --> PAY
    AUTH_MW --> DOC
    AUTH_MW --> NOTIF
    AUTH_MW --> AUDIT
    AUTH_MW --> MKT_SVC

    %% Service Interconnections
    PROC --> WF
    PROC --> VEND
    PROC --> DOC
    PAY --> AUDIT
    WF --> AUDIT
    VEND --> NOTIF
    MKT_SVC --> AUDIT

    %% Integrations
    PROC --> RASLNI_ADAPT
    PROC --> MOCI_ADAPT
    AUTH_MW --> ENTRA_ADAPT

    %% Adapters to External
    RASLNI_ADAPT --> G2G
    MOCI_ADAPT --> MOCI_SYS
    ENTRA_ADAPT --> AZ_AD
    PAY --> KNET_GW
    MKT_SVC --> AZ_MKT

    %% Persistence
    AUDIT --> COSMOS
    PROC --> COSMOS
    VEND --> COSMOS
    WF --> COSMOS
    DOC --> BLOB
    EDGE --> APPCONFIG
```

---

## 2. End-to-End Tender Lifecycle Journey Architecture

```mermaid
flowchart TD
    subgraph "Stage 1: Intake & Needs Assessment"
        A1["Channel A: Raslni G2G Message"] --> A3["Intake Registration"]
        A2["Channel B: GM Letter + Mandatory Scan"] --> A3
        A3 --> A4["Budget Allocation (CAIT / MoF)"]
    end

    subgraph "Stage 2: Technical & Legal Approvals"
        A4 --> B1["Purchase Committee Technical Review"]
        B1 --> B2["Fatwa & Legislation Legal Review"]
        B2 --> B3["Internal Audit & Compliance Verification"]
    end

    subgraph "Stage 3: Public Launch & CAPT Prequalification"
        B3 --> C1["Central Agency for Public Tenders (CAPT) Approval"]
        C1 --> C2["Official Gazette (Kuwait Alyawm) Publishing"]
        C2 --> C3["Server-Side Vendor Eligibility Evaluation (MoCI Activity + Grade)"]
    end

    subgraph "Stage 4: Evaluation, Award & KNET Payment"
        C3 --> D1["Anti-Screenshot Watermarked Booklet Access"]
        D1 --> D2["KNET Payment Checkout & Receipt Issuance (REC-YYYY-SEQ)"]
        D2 --> D3["Bid Opening & Technical Evaluation Committee"]
        D3 --> D4["Award Decision & Financial Commitment"]
    end

    subgraph "Stage 5: Regulatory Oversight & Execution (100%)"
        D4 --> E1["State Audit Bureau (ديوان المحاسبة) Pre-Contract Approval"]
        E1 --> E2["Final Performance Guarantee & Proofs Receipt"]
        E2 --> E3["Official Contract Execution 100% (Undersecretary Signature)"]
        E3 --> E4["Immutable SHA-256 Audit Seal in Cosmos DB"]
    end
```

---

## 3. Database Architecture & Multi-Tenant Partitioning

### Azure Cosmos DB Free Tier Specification

* **Account Name**: `kbm-cosmos-uyhsofjy5a23s` (West Europe)
* **Tier**: 100% Lifetime Free Tier (`enableFreeTier: true` — 1,000 RU/s + 25 GB storage free at $0.00/mo)
* **Database**: `kbm-procurement-db` (Shared 1,000 RU/s throughput)
* **Partition Key**: `/tenantId` (ensuring physical and logical isolation across all tenant collections)

```
kbm-procurement-db
├── 📁 Tenders       (Partition Key: /tenantId) — Published tenders, MoCI codes, pricing, eligibility rules
├── 📁 Vendors       (Partition Key: /tenantId) — Vendor registries, 3-grade tiers, suspensions, exemptions
├── 📁 Workflows     (Partition Key: /tenantId) — 35-step statutory approval task instances, SLAs, history
└── 📁 AuditEvents   (Partition Key: /tenantId) — Append-only SHA-256 cryptographic audit ledger
```

---

## 4. Multi-Tenant Data Isolation & BOLA Defense

```mermaid
graph TD
    subgraph "Multi-Tenant Data Isolation & BOLA Defense"
        REQ["Incoming API Request<br/>(Bearer Token + TenantId)"] --> GATE["Edge Gateway"]
        GATE --> POL{"Tenant Policy Check<br/>(tenant-policy.js)"}
        
        POL -- "Cross-Tenant Access" --> REJ["🚫 403 Forbidden<br/>(Cross-Tenant Breach Blocked)"]
        POL -- "Vendor Accessing Other Vendor Object" --> REJ2["🚫 403 Forbidden<br/>(IDOR / BOLA Blocked)"]
        POL -- "Authorized Tenant & Owner" --> PASS["✓ Route to Bounded Microservice"]
    end

    subgraph "Cosmos DB Cryptographic Tamper-Evidence (AuditEvents)"
        PASS --> EVT["Append Audit Event"]
        EVT --> HASH["Compute SHA-256 Digest<br/>hash = SHA256(Payload + PrevHash)"]
        HASH --> LEDGER["Cosmos DB AuditEvents Container (/tenantId)"]
        LEDGER --> VERIF{"verifyChainIntegrity()"}
        VERIF -- "Valid Hash Links" --> V_OK["🟢 100% Tamper-Free Verified"]
        VERIF -- "Tampered Block" --> V_FAIL["🔴 Tamper Detected at brokenAtIndex"]
    end
```

---

## 5. Live Azure Deployment & Infrastructure Topology

| Architectural Component | Live Azure Resource | Configuration / SKU | Status |
| :--- | :--- | :--- | :---: |
| **Resource Group** | `rg-kbm-platform` (West Europe) | Azure Cloud Subscription | **Active** |
| **Web App (Host)** | `kbm-platform-portal` | Node 22 LTS (Linux App Service) | **🟢 Running (200 OK)** |
| **App Service Plan** | `kbm-bootstrap-asp` | Dedicated B1 (Linux) | **Active** |
| **NoSQL Database** | `kbm-cosmos-uyhsofjy5a23s` | **Azure Cosmos DB Free Tier (1,000 RU/s)** | **Active** |
| **Document Storage** | `kbmbootstrapsa` | Azure Blob Storage (Standard_LRS) | **Active** |
| **App Configuration** | `kbm-bootstrap-appconfig` | Azure App Configuration (Free Tier) | **Active** |
| **Live Portal URL** | `https://kbm-platform-portal.azurewebsites.net` | Public HTTPS Web App | **Active** |
