# KBM Platform Infrastructure

This directory contains the bootstrap infrastructure-as-code skeleton for the KBM platform.

## Default behavior

- deploymentProfile defaults to `bootstrap`
- paid resources are disabled unless an explicit production approval gate is recorded
- bootstrap uses free-tier or local alternatives to satisfy the zero-cost baseline

## Example

```bash
az deployment sub create \
  --location eastus \
  --template-file main.bicep \
  --parameters deploymentProfile=bootstrap
```
