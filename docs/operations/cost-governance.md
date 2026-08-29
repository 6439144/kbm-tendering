# Cost governance baseline

## Goal

Keep the product aligned to the zero-cost bootstrap policy and make production deployment explicit, reviewable, and reversible.

## Required controls

- Default deployment profile is bootstrap.
- Any production deployment requires explicit owner sign-off.
- Azure cost alerts at warning and critical thresholds.
- Forecast alerts and monthly budget review.
- Resource tags for product, environment, tenant, owner, cost center, and expiry date.
- Auto-shutdown where the environment supports it.
- Weekly orphan review and cleanup discipline.
- Log sampling and retention caps to avoid runaway cost.
- Scale-out disabled in bootstrap.

## Deployment guardrail

A change is not allowed to continue when:

- the deployment profile is production without approved cost evidence
- paid-only Azure SKUs are selected without a recorded approval record
- no rollback or budget alert process exists

## Decision log reference

See [docs/decisions/decision-log.md](docs/decisions/decision-log.md) and [docs/bootstrap/production-cost-model.md](docs/bootstrap/production-cost-model.md).
