# Free bootstrap resource matrix

| Capability | Bootstrap decision | Why it is acceptable |
| --- | --- | --- |
| App Service | Use Linux containers on App Service F1 when supported by region/subscription | Valid free-tier choice for dev/demo and capped workloads |
| SQL Database | Azure SQL Database free offer or local SQL container | Free/zero-cost bootstrap for early validation |
| Cosmos DB | One lifetime-free account with shared throughput for audit demo containers | Keeps within free allowances |
| App Configuration | Use free tier and cache values in app | Avoids over-quota request growth |
| Storage | Local Azurite or local filesystem | No paid Azure storage during bootstrap |
| Messaging | Local/embedded message transport or in-memory broker | Avoids paid Service Bus in bootstrap |
| Cache | None by default | Redis is only paid and not required for vertical slice |
| Identity | Microsoft Entra ID Free and dev identities | Meets bootstrap requirement |
| Registry | GitHub Container Registry or equivalent free registry | Avoids ACR paid SKUs |
| Front Door/APIM | Not provisioned in bootstrap | Explicitly excluded from zero-cost profile |
| Private endpoints / VNet | Not provisioned in bootstrap | Production-only architecture |
| Paid App Service plan | Not used | F1 only when region eligible |
| SSL/TLS certs | Use dev/self-signed or local certificates | No paid certificate purchase |
| SMS/live KNET | Sandbox/mock adapter only | No production cost |

## Bootstrap profile guardrails

- No production secrets or live client data in bootstrap deployment.
- No paid Azure resource activation without explicit approval.
- App Service scaling disabled in bootstrap.
- Paid overages disabled where supported.
- Cost alerts and cleanup procedures remain active even when using free tiers.
