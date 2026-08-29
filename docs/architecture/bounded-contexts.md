# Proposed bounded contexts

## 1. Identity, Tenant, and Access Management
- Responsibilities: tenancy, users, roles, org units, MFA settings, external identity configuration, session policies, access control.
- Key data: tenant, user, role, entitlement, policy, consent, delegation.
- Boundaries: internal and external auth flows remain separated by configuration.

## 2. Workflow and Task Management
- Responsibilities: workflow definition versioning, task state, transitions, reminders, escalations, SLA, correction loops, delegation.
- Key data: workflow definitions, task instances, assignments, decisions, comments, history.

## 3. Procurement Request and Tender Management
- Responsibilities: request intake, approval, tender creation, publication, eligibility checks, purchase, and receipt generation.
- Key data: request, tender, activities, grade rules, purchase records, tender status, public catalogue.

## 4. Vendor Qualification and Grading
- Responsibilities: registration, documents, classification, gradings, upgrades, subscriptions, blocks, exemptions.
- Key data: vendor profile, organization, grade history, documents, approval records, payments, blocks.

## 5. Catalog, Eligibility, and Publication
- Responsibilities: tender visibility, vendor filter logic, direct-object access enforcement, tenant catalog configuration.
- Key data: eligibility matrix, published tender metadata, activities, grade thresholds.

## 6. Payments, Subscription, Refund, and Receipt
- Responsibilities: KNET transaction verification, annual subscription state, receipt generation, refunds, failed-payment handling.
- Key data: payment session, receipt, invoice, subscription status, cancellation.

## 7. Document/EDMS Management
- Responsibilities: upload, checksum, classification, retention, preview, watermarking, access policy, legal hold.
- Key data: document metadata, blob references, retention rules, audit links.

## 8. Notification
- Responsibilities: templates, event-driven notifications, delivery tracking, escalations, reminder schedules.
- Key data: notification template, recipient, channel, delivery status, event correlation.

## 9. Integration Gateway and Adapters
- Responsibilities: Raslni, KNET, Ministry of Commerce, EDMS, email/SMS, finance adapters, external workflow connectors.
- Key data: adapter configuration, payload mappings, retries, dead-letter data.

## 10. Audit and Compliance
- Responsibilities: append-only event capture, tamper evidence, export, legal hold, retention, read-only audit APIs.
- Key data: audit event stream, policy, retention metadata, checkpoints.

## 11. Reporting/Read Models
- Responsibilities: dashboards, reporting, operational metrics, tenant admin reporting, product analytics.
- Key data: read models and materialized views.

## 12. Microsoft Marketplace Provisioning and Entitlements
- Responsibilities: offer activation, tenant provisioning, entitlement mapping, plan lifecycle, billing hooks.
- Key data: plan, entitlement, marketplace offer, activation state.
