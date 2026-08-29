@description('Deployment profile selection. Default is bootstrap to enforce $0/month Azure spend until production approval.')
@allowed([
  'bootstrap'
  'production'
])
param deploymentProfile string = 'bootstrap'

@description('Primary Azure region.')
param location string = 'westeurope'

@description('Unique platform prefix.')
param prefix string = 'kbm'

@description('Target monthly budget threshold in USD.')
param monthlyBudgetUsd int = 500

var isBootstrap = deploymentProfile == 'bootstrap'
var isProduction = deploymentProfile == 'production'

// Tagging Governance
var defaultTags = {
  Product: 'KBM-Procurement-Platform'
  Environment: deploymentProfile
  CostProfile: isBootstrap ? 'ZeroCostFreeBootstrap' : 'PaidProductionGated'
  AutoShutdown: isBootstrap ? 'AlwaysOn-FreeQuotaOnly' : 'Configurable'
}

// -------------------------------------------------------------
// 1. BOOTSTRAP PROFILE ($0/month Azure Free Tier Only)
// -------------------------------------------------------------
resource bootstrapAppServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = if (isBootstrap) {
  name: '${prefix}-bootstrap-asp'
  location: location
  tags: defaultTags
  kind: 'linux'
  sku: {
    name: 'F1'
    tier: 'Free'
  }
  properties: {
    reserved: true
  }
}

resource bootstrapAppConfig 'Microsoft.AppConfiguration/configurationStores@2023-08-01-preview' = if (isBootstrap) {
  name: '${prefix}-bootstrap-appconfig'
  location: location
  tags: defaultTags
  sku: {
    name: 'free'
  }
  properties: {
    disableLocalAuth: false
  }
}

resource bootstrapStorage 'Microsoft.Storage/storageAccounts@2023-01-01' = if (isBootstrap) {
  name: '${prefix}bootstrapsa'
  location: location
  tags: defaultTags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    supportsHttpsTrafficOnly: true
  }
}

// -------------------------------------------------------------
// 2. PRODUCTION PROFILE (Gated Behind Explicit Approval)
// -------------------------------------------------------------
resource prodAppServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = if (isProduction) {
  name: '${prefix}-prod-asp'
  location: location
  tags: defaultTags
  kind: 'linux'
  sku: {
    name: 'P1v3'
    tier: 'PremiumV3'
    capacity: 2
  }
  properties: {
    reserved: true
  }
}

resource prodKeyVault 'Microsoft.KeyVault/vaults@2023-07-01' = if (isProduction) {
  name: '${prefix}-prod-kv'
  location: location
  tags: defaultTags
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
  }
}

resource prodServiceBus 'Microsoft.ServiceBus/namespaces@2022-10-01-preview' = if (isProduction) {
  name: '${prefix}-prod-sb'
  location: location
  tags: defaultTags
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
}

// Budget Alert Configuration
resource budgetAlert 'Microsoft.Consumption/budgets@2021-10-01' = if (isProduction) {
  name: '${prefix}-monthly-budget'
  properties: {
    category: 'Cost'
    amount: monthlyBudgetUsd
    timeGrain: 'Monthly'
    timePeriod: {
      startDate: '2026-09-01T00:00:00Z'
    }
    notifications: {
      Actual_80_Percent: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 80
        contactEmails: [
          'finops-alerts@kbm-platform.demo'
        ]
      }
      Forecasted_100_Percent: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 100
        thresholdType: 'Forecasted'
        contactEmails: [
          'finops-alerts@kbm-platform.demo'
        ]
      }
    }
  }
}

output activeProfile string = deploymentProfile
output targetAzureMonthlyCostUsd int = isBootstrap ? 0 : monthlyBudgetUsd
output bootstrapAppPlanName string = isBootstrap ? bootstrapAppServicePlan.name : 'N/A'
output productionAppPlanName string = isProduction ? prodAppServicePlan.name : 'N/A'
