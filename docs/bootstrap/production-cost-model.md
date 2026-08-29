# Production cost model

## Default business rule

Production deployment is disabled by default. Any infrastructure provisioned in production requires an explicit approval gate with cost, owner, expiry, rollback, and alert thresholds.

## Three cost scenarios

| Scenario | Monthly estimate | Core assumptions | Approval notes |
| --- | --- | --- | --- |
| Low | $1,200-$2,500 | Small tenant footprint, one SQL DB, modest App Service footprint, minimal Redis, low bandwidth | Requires operational owner and per-tenant cost guardrails |
| Base | $3,000-$7,000 | Multi-service topology, staging slots, analytics, audit retention, backup, App Insights | Suitable for limited SaaS rollout |
| High | $8,000-$20,000+ | Production multi-tenant scale, WAF/Front Door, APIM, multiple web apps, stronger retention, monitoring | Only after business volume, SLO, and budget approval |

## Resource-by-resource reason

- Azure Front Door Premium + WAF: justified for protected external ingress and DDoS/WAF controls.
- Azure API Management: required for versioned API exposure and policy control at scale.
- App Service production web apps: required for independent service scaling and deployment slots.
- Azure SQL Database: required for relational transactional data and concurrency at production scale.
- Cosmos DB: required for append-only immutable audit with retention and search.
- Blob Storage: required for document binaries, legal hold, and retention policies.
- Service Bus: required for reliable async workflow and integration messaging.
- Key Vault/App Configuration: required for secrets and centralized configuration.
- Monitoring/Insights: required for reliability and SLO tracking.

## Approval gate checklist

- Estimated monthly cost
- Free allowance and expected overage trigger
- Resource owner and cost center
- Expiry date and shutdown/rollback plan
- Budget alert thresholds and thresholds for forecast alerting
- Environment-specific tags and auto-shutdown eligibility
- Approval record stored in decision log
