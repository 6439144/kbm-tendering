# ADR 0004: Tenant model and audit design

- Status: Accepted
- Date: 2026-08-28

## Context

The product is multi-tenant. It must isolate tenants thoroughly while supporting configurable branding and approval flows. It also requires append-only audit records for compliance.

## Decision

Use a shared infrastructure model with strong tenant isolation at the application and data layers, a tenant ID on all relevant records, and Azure Cosmos DB as the append-only audit store with strict read-only audit APIs.

## Consequences

- Strong defense in depth against cross-tenant leakage.
- Explicit testing for tenant isolation and direct object access.
- Audit logs remain immutable and exportable with correlation IDs.
