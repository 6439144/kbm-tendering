# Bootstrap runbook

## Purpose

This runbook makes the zero-cost bootstrap profile explicit and keeps production deployment behind an approval gate.

## Default posture

- Default deployment profile: bootstrap
- Paid Azure resources are not provisioned by default
- Production deployment requires owner approval, budget review, rollback plan, and cost alert setup

## Local developer workflow

1. Install Node.js 20 and Docker Desktop or equivalent.
2. Run `npm install` in the workspace root.
3. Run `npm run bootstrap:validate`.
4. Start the local API and portal services with `npm run api` and `npm run web`.
5. Validate the local flow in the browser: tenant creation, vendor registration, tender creation, purchase simulation, and audit export.

## Production approval gate

Production deployment is not allowed unless all of the following are recorded:

- estimated monthly cost
- free allowance and overage trigger
- owner and cost center
- expiry date and rollback plan
- budget alert thresholds
- resource tags and auto-shutdown criteria

## Cost governance

- Keep the bootstrap deployment profile free by default.
- Do not enable paid overages or autoscale in bootstrap.
- Keep deployment tags for product, environment, tenant, owner, and cost center.
- Review resource usage weekly and remove orphaned resources.

## Emergency stop

- Disable or delete the production deployment profile.
- Remove the production environment resources.
- Preserve previous image digest or backup before any promotion.
