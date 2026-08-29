# ADR 0003: Workflow engine strategy

- Status: Proposed
- Date: 2026-08-28

## Context

The system needs configurable workflow capability with reminders, escalations, correction cycles, and audit history. A vendor-specific workflow engine could reduce implementation effort, but it would introduce product lock-in and marketplace obligations.

## Decision

Use a domain-agnostic workflow engine abstraction for the first iteration, with a constrained internal engine or a proven permissively licensed engine evaluated before adoption. The team will not hard-code workflow logic into domain aggregates.

## Consequences

- Clear separation between domain logic and workflow runtime.
- Easier future replacement or vendor integration.
- Additional engineering work before large workflow complexity is introduced.
