# KBM Platform — Requirements Inventory & Classification

This document serves as the single source of truth for requirements classification, source attribution, and lifecycle status for the **KBM Procurement & Tender Management Platform**.

## Requirement Classification Schema

Every requirement is tagged with an authoritative source:
- `USER`: Directly specified in user master prompt instructions.
- `BRD-CONFIRMED`: Verified requirement from MOI Tender Platform BRD (v0.1).
- `BRD-PROPOSED`: Proposed enhancement requiring explicit client ratification.
- `TRACKER-REFERENCE`: Historical workflow reference from Ministry Excel trackers (Practices / Tenders).
- `ENGINEERING-RECOMMENDATION`: Architectural, security, or operational best practice.

---

## 1. Confirmed BRD Phase 1 Functional Requirements

| Req ID | Title | Description | Source | Status |
| :--- | :--- | :--- | :--- | :--- |
| **FR-001** | Tender Request Submission | Requesting department submits tender request to Tender Department. | `BRD-CONFIRMED` | Implemented |
| **FR-002** | Raslni Electronic Intake | Receive electronic tender requests via Raslni integration. | `BRD-CONFIRMED` | Implemented |
| **FR-003** | Official GM Letter Intake | Support intake originating from General Manager official letter. | `BRD-CONFIRMED` | Implemented |
| **FR-004** | Tender Dept Intake Receipt | Tender Department receives and logs incoming requests. | `BRD-CONFIRMED` | Implemented |
| **FR-005** | Vendor Tender Viewing | Registered vendors view tenders through the platform. | `BRD-CONFIRMED` | Implemented |
| **FR-006** | KNET Tender Purchase | Vendors purchase tender documents via KNET payment gateway. | `BRD-CONFIRMED` | Implemented |
| **FR-007** | Printable Purchase Receipt | Vendors generate and print official branded payment receipts. | `BRD-CONFIRMED` | Implemented |
| **FR-009** | 3-Grade Vendor Hierarchy | Record vendor grades as First Grade, Second Grade, or Third Grade. | `BRD-CONFIRMED` | Implemented |
| **FR-010** | Grade Upgrade Request | Vendors submit upgrade requests with supporting qualification files. | `BRD-CONFIRMED` | Implemented |
| **FR-011** | Manual Request Recording | Staff manually record paper requests into the system. | `BRD-CONFIRMED` | Implemented |
| **FR-012** | Mandatory Scanned GM Letter | Scanned copy of GM letter is mandatory for manual intake. | `BRD-CONFIRMED` | Implemented |
| **FR-013** | Vendor Account Suspension | Admin can suspend/ban vendor; blocked users cannot log in. | `BRD-CONFIRMED` | Implemented |
| **FR-014** | Auto-Reinstatement | System automatically restores access when date-range block expires. | `BRD-CONFIRMED` | Implemented |
| **FR-015** | Vendor Portal Registration | Companies apply to become vendors submitting qualification files. | `BRD-CONFIRMED` | Implemented |
| **FR-016** | Document-Based Grading | Grading authority assigns grade based on submitted registration files. | `BRD-CONFIRMED` | Implemented |
| **FR-017** | 1-Year KNET Subscription | Approved vendors receive KNET link for 1-year annual subscription. | `BRD-CONFIRMED` | Implemented |
| **FR-018** | Fee Exemption | Admin can grant fee exemptions to designated vendors. | `BRD-CONFIRMED` | Implemented |
| **FR-019** | Tender Creation & Targeting | Create tenders specifying target MoCI activities and grade rule. | `BRD-CONFIRMED` | Implemented |
| **FR-020** | Server-Side Eligibility Filter | Only matching activity and grade tenders are shown and accessible. | `BRD-CONFIRMED` | Implemented |
| **FR-026** | Internal Approval Workflow | Execute internal approval cycle with routing, decisions, and comments. | `BRD-CONFIRMED` | Implemented |
| **FR-027** | Audited Approval Cycle | Record immutable audit log for every step, actor, and decision. | `BRD-CONFIRMED` | Implemented |
| **FR-028** | Three Dedicated Interfaces | Administration, Staff/Team, and Vendor external interfaces. | `BRD-CONFIRMED` | Implemented |
| **FR-029** | Internal Premises Hosting | Administration and Staff interfaces hosted in internal security zone. | `BRD-CONFIRMED` | Implemented |
| **FR-030** | External Vendor Zone | Vendor interface is the only interface exposed externally. | `BRD-CONFIRMED` | Implemented |
| **FR-031** | Role-Aware Dashboards | Personalized dashboard for every role upon login. | `BRD-CONFIRMED` | Implemented |
| **FR-032** | Platform Administration | Administrator configures system settings and reference data. | `BRD-CONFIRMED` | Implemented |
| **FR-033** | Full-Scope Configuration | Configuration covers both internal and external operational rules. | `BRD-CONFIRMED` | Implemented |
| **FR-034** | Dev & Prod Environments | Development and Production environments for each interface. | `BRD-CONFIRMED` | Implemented |
| **FR-035** | User Account Management | Admin creates, amends, enables, and disables user accounts. | `BRD-CONFIRMED` | Implemented |
| **FR-036** | Role & Permission Mapping | Define and assign roles across all interfaces. | `BRD-CONFIRMED` | Implemented |

---

## 2. Notification & Document Requirements

| Req ID | Title | Description | Source | Status |
| :--- | :--- | :--- | :--- | :--- |
| **NOT-001** | Subscription Renewal Alert | Automated renewal reminder sent prior to subscription expiration. | `BRD-CONFIRMED` | Implemented |
| **NOT-002** | New Application Alert | Staff notified when new vendor registration is submitted. | `BRD-CONFIRMED` | Implemented |
| **NOT-003** | Grade Upgrade Alert | Vendor notified when grade upgrade request is approved/rejected. | `BRD-CONFIRMED` | Implemented |
| **NOT-004** | Registration Approval Alert | Approval notice sent with KNET subscription payment link. | `BRD-CONFIRMED` | Implemented |
| **NOT-005** | Suspension/Ban Alert | Vendor notified upon account suspension or blocking. | `BRD-CONFIRMED` | Implemented |
| **DOC-001** | Scanned GM Letter Attachment | Secure storage and access for mandatory intake letter scan. | `BRD-CONFIRMED` | Implemented |
| **DOC-002** | Official Purchase Receipt | Digital and printable payment confirmation artifact. | `BRD-CONFIRMED` | Implemented |
| **DOC-003** | Vendor Registration Docs | Multi-file qualification dossier (commercial license, etc.). | `BRD-CONFIRMED` | Implemented |
| **DOC-004** | Grade Upgrade Dossier | Supporting evidence files for higher grade qualification. | `BRD-CONFIRMED` | Implemented |
| **DOC-005** | Tender Document & Specs | Tender booklet with dynamic anti-screenshot watermarking. | `BRD-CONFIRMED` | Implemented |

---

## 3. Security, Audit & Integration Requirements

| Req ID | Title | Description | Source | Status |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-001** | Anti-Screenshot Deterrence | Visual watermarking and deterrence against unauthorized capture. | `BRD-CONFIRMED` | Implemented |
| **SEC-002** | Pre & Post Purchase Protection | Content protection active both before and after tender purchase. | `BRD-CONFIRMED` | Implemented |
| **SEC-003** | Premises Access Enforcement | Internal portals restricted to internal network boundaries. | `BRD-CONFIRMED` | Implemented |
| **SEC-004** | Server-Side Payment Verification | KNET payments verified server-side; redirects never trusted. | `BRD-PROPOSED` | Implemented |
| **SEC-006** | Server-Side Eligibility Check | Eligibility enforced on direct API/object access, not only UI lists. | `BRD-CONFIRMED` | Implemented |
| **AUD-001** | Immutable Audit Trail | Append-only event log with SHA-256 hash chaining and actor context. | `BRD-CONFIRMED` | Implemented |
| **INT-001** | Raslni Interface Adapter | Connector for electronic government correspondence. | `BRD-CONFIRMED` | Implemented |
| **INT-002** | MoCI Classification Adapter | Ministry of Commerce activity codes synchronization. | `BRD-CONFIRMED` | Implemented |
| **INT-003** | KNET Payment Gateway Adapter | Payment link issuance and idempotent transaction webhook. | `BRD-CONFIRMED` | Implemented |
| **INT-004** | Active Directory / Entra ID | Enterprise single sign-on and directory federation. | `BRD-CONFIRMED` | Implemented |
