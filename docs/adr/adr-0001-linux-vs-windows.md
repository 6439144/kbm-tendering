# ADR 0001: Linux containers as the default deployment target

- Status: Accepted
- Date: 2026-08-28

## Context

The project requires a production-capable multi-service SaaS with a free-tier bootstrap profile and no unnecessary Azure cost. Linux containers on Azure App Service are the simplest default target and support the containerized microservice requirement.

## Decision

Use Linux containers for all default services. Allow Windows containers only when a concrete Windows-only dependency is proven and approved.

## Consequences

- Simpler operation and consistent App Service plans.
- Better compatibility with free-tier/bootstrap constraints.
- Platform works well with GitHub Actions, App Service, and multi-service deployment.
- Windows-only scenarios remain available but require a deliberate ADR and approval path.
