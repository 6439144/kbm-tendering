# Decision register and assumptions log

## D-001: Default bootstrap profile is zero-cost
- Status: Approved
- Decision: The bootstrap profile must target monthly Azure spend of $0 by default and only use free-tier or local services.
- Rationale: The product owner requires low initial investment and explicit approval before any paid Azure SKU.
- Impact: Local containers, emulators, and App Service F1 where supported are preferred.

## D-002: Linux containers are the default production target
- Status: Approved
- Decision: Use Linux containers on Azure App Service unless there is documented reason to require Windows containers.
- Rationale: Simplifies platform consistency, avoids mixed App Service plans, and aligns with Azure containerized deployment guidance.

## D-003: Phase 1 excludes later-stage modules
- Status: Approved
- Decision: Bid opening, technical/financial evaluation, award, contract management, guarantees, and legal paper-letter custody remain feature-flagged future work.
- Rationale: Explicit BRD scope boundary states these are out of scope for Phase 1.

## D-004: Tracker-based workflows are reference templates only
- Status: Approved
- Decision: Practices and Tenders spreadsheet workflows are treated as TRACKER-REFERENCE templates, not approved requirements.
- Rationale: Historical trackers show process examples and should be configurable, but not automatically approved.

## D-005: Configurable tenant roles instead of hard-coded identities
- Status: Approved
- Decision: Actors such as IT, Finance, CAIT, Purchase Committee, Procurement and Warehouses, Control, CAPT, Fatwa and Legislation, Audit Bureau, Financial Control, and Undersecretaries are modeled as tenant-configurable roles.
- Rationale: The product must support multiple tenants without client-specific code forks.

## D-006: Payment callbacks use server-side verification and idempotency
- Status: Approved
- Decision: KNET purchase callbacks must be server-side verified and idempotent; no trust in client-side scripts.
- Rationale: Prevents replay, tampering, and duplicate-payment effects.

## D-007: Audit events are immutable and append-only
- Status: Approved
- Decision: Use Azure Cosmos DB for append-only audit events with controlled export and no update/delete paths to audit records.
- Rationale: Mandatory audit and compliance requirements.

## D-008: Product naming and identities remain configurable
- Status: Approved
- Decision: Publisher, display name, URLs, and email identities are platform-level configuration rather than fixed constants.
- Rationale: Brand and legal-clearance work must be configurable and avoid premature claims.

## Assumptions

- A production Azure environment will be approved only after cost modeling and explicit product-owner sign-off.
- A single shared PostgreSQL/SQL deployment can serve as the bootstrap transactional database while retaining an explicit path to separate databases per bounded context in production.
- The initial vertical slice can be implemented in a modular host while maintaining extraction seams for independent services.
