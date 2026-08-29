@description('Deployment profile selection. Default is bootstrap with Azure Cosmos DB Free Tier ($0/month).')
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
  CostProfile: isBootstrap ? 'ZeroCostFreeBootstrapWithCosmosDB' : 'PaidProductionGated'
  AutoShutdown: isBootstrap ? 'AlwaysOn-FreeQuotaOnly' : 'Configurable'
}

// -------------------------------------------------------------
// 1. BOOTSTRAP PROFILE (Azure Free Tier + Cosmos DB Free Tier)
// -------------------------------------------------------------
resource bootstrapAppServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = if (isBootstrap) {
  name: '${prefix}-bootstrap-asp'
  location: location
  tags: defaultTags
  kind: 'linux'
  sku: {
    name: 'B1'
    tier: 'Basic'
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

// Azure Cosmos DB Account (100% Free Tier: 1,000 RU/s + 25 GB Free for Lifetime)
resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: '${prefix}-cosmos-${uniqueString(resourceGroup().id)}'
  location: location
  tags: defaultTags
  kind: 'GlobalDocumentDB'
  properties: {
    enableFreeTier: true
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
  }
}

// Cosmos DB SQL Database with Shared 1,000 RU/s Free Tier
resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  parent: cosmosAccount
  name: 'kbm-procurement-db'
  properties: {
    resource: {
      id: 'kbm-procurement-db'
    }
    options: {
      throughput: 1000
    }
  }
}

// Containers with Partition Key /tenantId
resource tendersContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: cosmosDb
  name: 'Tenders'
  properties: {
    resource: {
      id: 'Tenders'
      partitionKey: {
        paths: [
          '/tenantId'
        ]
        kind: 'Hash'
      }
    }
  }
}

resource auditContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: cosmosDb
  name: 'AuditEvents'
  properties: {
    resource: {
      id: 'AuditEvents'
      partitionKey: {
        paths: [
          '/tenantId'
        ]
        kind: 'Hash'
      }
    }
  }
}

resource vendorsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: cosmosDb
  name: 'Vendors'
  properties: {
    resource: {
      id: 'Vendors'
      partitionKey: {
        paths: [
          '/tenantId'
        ]
        kind: 'Hash'
      }
    }
  }
}

resource workflowsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: cosmosDb
  name: 'Workflows'
  properties: {
    resource: {
      id: 'Workflows'
      partitionKey: {
        paths: [
          '/tenantId'
        ]
        kind: 'Hash'
      }
    }
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

output activeProfile string = deploymentProfile
output targetAzureMonthlyCostUsd int = isBootstrap ? 0 : monthlyBudgetUsd
output cosmosAccountEndpoint string = cosmosAccount.properties.documentEndpoint
output cosmosAccountName string = cosmosAccount.name
output cosmosDatabaseName string = cosmosDb.name
