# KBM Platform — Traceability Matrix

This matrix establishes complete forward and backward traceability from high-level business requirements (BRD / Trackers) to architecture modules, repository components, API endpoints, and automated tests.

| Requirement ID | Category | Bounded Context / Service | Primary Repository | API Endpoint / Interface | Test Suite / Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-001** | Intake | Procurement Service | `kbm-platform-procurement-service` | `POST /api/requests` | `procurement.test.js` |
| **FR-002** | Intake | Integration Service | `kbm-platform-integration-service` | `POST /api/integrations/raslni/webhook` | `integration.test.js` |
| **FR-003, FR-011** | Intake | Procurement Service | `kbm-platform-procurement-service` | `POST /api/requests/manual` | `procurement.test.js` |
| **FR-012, DOC-001** | Intake | Document Service | `kbm-platform-document-service` | `POST /api/documents/upload` | `document-store.test.js` |
| **FR-026, FR-027** | Workflow | Workflow Engine | `kbm-platform-workflow-service` | `POST /api/workflow/tasks/:id/transition` | `workflow.test.js` |
| **FR-019** | Catalog | Procurement Service | `kbm-platform-procurement-service` | `POST /api/tenders` | `domain.test.js` |
| **FR-005, FR-020** | Catalog | Procurement Service | `kbm-platform-procurement-service` | `GET /api/tenders/eligible` | `domain.test.js` |
| **FR-006, INT-003** | Payments | Payment Service | `kbm-platform-payment-service` | `POST /api/payments/checkout`, `POST /api/payments/knet/callback` | `payment.test.js` |
| **FR-007, DOC-002** | Payments | Payment Service | `kbm-platform-payment-service` | `GET /api/receipts/:id` | `domain.test.js` |
| **FR-015, DOC-003** | Vendor | Vendor Service | `kbm-platform-vendor-service` | `POST /api/vendors/register` | `vendor.test.js` |
| **FR-016, FR-009** | Vendor | Vendor Service | `kbm-platform-vendor-service` | `POST /api/vendors/:id/grade` | `vendor.test.js` |
| **FR-017** | Payments | Payment Service | `kbm-platform-payment-service` | `POST /api/vendors/:id/subscription/link` | `payment.test.js` |
| **FR-010, DOC-004** | Vendor | Vendor Service | `kbm-platform-vendor-service` | `POST /api/vendors/:id/upgrade-request` | `vendor.test.js` |
| **FR-013, FR-014** | Vendor | Vendor Service | `kbm-platform-vendor-service` | `POST /api/vendors/:id/block`, `POST /api/vendors/:id/unblock` | `vendor.test.js` |
| **FR-018** | Vendor | Vendor Service | `kbm-platform-vendor-service` | `POST /api/vendors/:id/exempt` | `vendor.test.js` |
| **NOT-001..005** | Notification| Notification Service | `kbm-platform-notification-service` | `GET /api/notifications`, `POST /api/notifications/dispatch` | `notification.test.js` |
| **SEC-001, SEC-002**| Security | UI & Document | `kbm-platform-ui`, `kbm-platform-document-service` | Dynamic Canvas Watermark, Secure Viewer | `e2e.test.js` |
| **SEC-003** | Security | Edge Gateway | `kbm-platform-edge` | Subnet & Network Boundary Guard | `edge.test.js` |
| **SEC-006** | Security | Shared Policy | `services/shared`, `kbm-platform-procurement-service` | Server-Side Authorizer | `tenant-policy.test.js` |
| **AUD-001** | Audit | Audit Service | `kbm-platform-audit-service` | `POST /api/audit/events`, `GET /api/audit/export` | `audit.test.js` |
| **MKT-001..005** | Marketplace | Marketplace Service | `kbm-platform-marketplace-service` | `POST /api/marketplace/resolve`, `POST /api/marketplace/activate`, `POST /api/marketplace/webhook` | `marketplace.test.js` |
| **TRK-PRAC-01..08** | Workflow | Workflow Engine | `kbm-platform-workflow-service` | Workflow Template: `TEMPLATE_PRACTICES` | `workflow.test.js` |
| **TRK-TEND-01..35** | Workflow | Workflow Engine | `kbm-platform-workflow-service` | Workflow Template: `TEMPLATE_TENDERS` | `workflow.test.js` |
