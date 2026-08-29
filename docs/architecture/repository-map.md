# Repository map

| Repository | Purpose | Notes |
| --- | --- | --- |
| kbm-platform-ui | Staff, vendor, tenant-admin, and operator front-end apps | React + TypeScript |
| kbm-platform-edge | API gateway / BFF with shared edge policies | Central ingress and auth integration |
| kbm-platform-workflow-service | Workflow engine adapters and orchestration | Domain-owned workflow service |
| kbm-platform-procurement-service | Tender and request management | Core Phase 1 domain |
| kbm-platform-vendor-service | Vendor registration, grades, blocks, exemptions | Domain-owned qualification logic |
| kbm-platform-payment-service | KNET purchase, subscriptions, receipts | Payment verification and ledger |
| kbm-platform-document-service | Secure document lifecycle and EDMS | Blob + metadata management |
| kbm-platform-notification-service | Notifications and reminders | Event-driven delivery |
| kbm-platform-integration-service | Adapters and connectors | Raslni, KNET, EDMS, Ministry of Commerce |
| kbm-platform-audit-service | Immutable audit capture and export | Cosmos-backed |
| kbm-platform-marketplace-service | Microsoft Marketplace integrations | Offer and entitlement handling |
| kbm-platform-contracts | OpenAPI and event schemas | Shared contracts and compatibility tests |
| kbm-platform-infrastructure | Bicep, policies, environment config | Azure deployment and cost controls |
| kbm-platform-qa | E2E, contract, performance, security tests | Cross-service validation |
| kbm-platform-docs | Product, architecture, docs | Operational and marketplace docs |
| kbm-repo-template | Reusable template for standards | CODEOWNERS, CI, releases |

A bootstrap repository manifest is included under bootstrap/repo-manifest.json and can be used to materialize directories or automation.
