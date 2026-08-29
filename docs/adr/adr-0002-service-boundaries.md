# ADR 0002: Bounded-context service boundaries

- Status: Accepted
- Date: 2026-08-28

## Context

The product spans identity, workflows, tender operations, vendor qualification, payment, documents, audit, integrations, and marketplace. Strong service boundaries are required to preserve tenant isolation and reduce distributed-monolith risk.

## Decision

Use bounded contexts with separate ownership, data, and APIs. Keep a modular-host bootstrap deployment only as an interim cost-constraint measure, with extraction seams that allow independent production service deployment later.

## Consequences

- Domain logic remains isolated and independently testable.
- Cross-context data writes are forbidden.
- Bootstrap remains viable under free-tier constraints.
- Production deployment can evolve to separate App Service web apps without rewriting domain logic.
