# Gate 1 architecture baseline

## Purpose

The Gate 1 baseline defines the platform-level architecture that will support the first executable vertical slice while preserving future service extraction, auditability, and tenant isolation.

## Architecture decisions

### 1) Tenant model
- Shared infrastructure with strong application-layer and row-level isolation.
- Every tenant-scoped record carries a tenant identifier.
- Cross-tenant access is denied by default and only allowed through explicit policy review.

### 2) Service boundaries
- Identity/Tenant/Access Management
- Workflow and Task Management
- Procurement Request and Tender Management
- Vendor Qualification and Grading
- Catalog, Eligibility, and Publication
- Payments, Subscription, Refund, and Receipt
- Document/EDMS Management
- Notification
- Integration Gateway and Adapters
- Audit and Compliance
- Reporting/Read Models
- Marketplace Provisioning and Entitlements

### 3) Trust boundaries
- Internal staff zone and external vendor zone remain logically separate.
- Approval logic is executed server-side; the client cannot be the source of truth.
- Tender eligibility is enforced in the procurement service and not dependent on UI filters alone.

### 4) Workflow enforcement
- Workflow definitions are versioned and separate from runtime instances.
- State transitions are auditable and recorded in a task history stream.
- Future specialist stages remain behind feature flags as required by the BRD.

### 5) Security baseline
- Entra ID or equivalent federated identity for internal staff.
- Vendor B2B/B2C strategy remains configurable.
- MFA and Conditional Access readiness are treated as operational requirements, not optional UI polish.
- Object-level authorization is enforced server-side using tenant + role + ownership policies.

## Example authorization model

The shared tenant-policy service enforces the following logic:

- A user can access a tenant only when the tenant id matches.
- Staff and tenant-admin roles are allowed to access tenant-scoped objects in the same tenant.
- Vendor users can access only objects they own in the same tenant.
- Different tenants cannot access each other’s resources even if they share the same UI or route path.

## Data ownership

- Relational transactional data stays in Azure SQL or a bootstrap equivalent.
- Append-only audit data stays in Cosmos DB.
- Document binaries remain in secure blob storage, with metadata and access governance in the owning service.

## Operational baseline

- Health endpoints and structured logs are required for each service.
- In bootstrap, local message transport and Azurite or local filesystem are used.
- In production, the same contracts route to Azure Service Bus, Blob Storage, and SQL without changing application-facing APIs.

## Gate 1 review questions

- Is the internal/external security boundary approved for this tenant?
- Is the staff identity provider configuration confirmed for the target client?
- Are the workflow outcomes and escalation rules acceptable as configuration rather than hard-coded values?
- Is the vendor grade model system-wide or per activity?
- Is the block/exemption policy acceptable as a configurable rule set pending owner sign-off?
