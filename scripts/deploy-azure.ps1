<#
.SYNOPSIS
    Deploys the KBM Procurement Platform to Microsoft Azure.
.DESCRIPTION
    Provisions Azure Infrastructure using Bicep (Zero-Cost Bootstrap by default)
    and deploys the application code to Azure App Service.
#>

param (
    [string]$ResourceGroup = "rg-kbm-platform",
    [string]$Location = "westeurope",
    [ValidateSet("bootstrap", "production")]
    [string]$Profile = "bootstrap",
    [string]$AppName = "kbm-tendering-$((Get-Random -Minimum 1000 -Maximum 9999))"
)

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "         KBM PLATFORM -- AZURE CLOUD DEPLOYMENT SCRIPT          " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "Profile:        $Profile" -ForegroundColor Yellow
Write-Host "Resource Group: $ResourceGroup" -ForegroundColor Yellow
Write-Host "Location:       $Location" -ForegroundColor Yellow
Write-Host "App Name:       $AppName" -ForegroundColor Yellow
Write-Host ""

# Ensure Azure CLI in current session PATH
$azCmd = "az"
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    $azPath = "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin"
    if (Test-Path "$azPath\az.cmd") {
        $env:PATH = $azPath + ";" + $env:PATH
        $azCmd = "$azPath\az.cmd"
    } else {
        Write-Error "Azure CLI ('az') is not found. Please install it from https://aka.ms/installazurecliwindows"
        exit 1
    }
}

# Ensure Logged In
$accountJson = & $azCmd account show --output json 2>$null
if (-not $accountJson) {
    Write-Host "Please sign in to your Azure account in the browser window..." -ForegroundColor Cyan
    & $azCmd login --output none
    $accountJson = & $azCmd account show --output json
}

$account = $accountJson | ConvertFrom-Json
Write-Host "Connected to Azure Subscription: $($account.name) ($($account.id))" -ForegroundColor Green

# 1. Create Resource Group
Write-Host "`n[1/3] Ensuring Resource Group '$ResourceGroup' in '$Location'..." -ForegroundColor Cyan
& $azCmd group create --name $ResourceGroup --location $Location --output none
Write-Host "Resource Group Ready." -ForegroundColor Green

# 2. Deploy Bicep Infrastructure
Write-Host "`n[2/3] Deploying Azure Bicep Infrastructure (Profile: $Profile)..." -ForegroundColor Cyan
& $azCmd deployment group create --resource-group $ResourceGroup --template-file ./kbm-platform-infrastructure/main.bicep --parameters deploymentProfile=$Profile --output none
Write-Host "Infrastructure Provisioned Successfully!" -ForegroundColor Green

# 3. Create Web App and Deploy Code
Write-Host "`n[3/3] Creating and Deploying Web App '$AppName'..." -ForegroundColor Cyan
$planName = if ($Profile -eq "bootstrap") { "kbm-bootstrap-asp" } else { "kbm-prod-asp" }

& $azCmd webapp create --resource-group $ResourceGroup --plan $planName --name $AppName --runtime "NODE:20-lts" --output none

# Configure Startup Command
& $azCmd webapp config set --resource-group $ResourceGroup --name $AppName --startup-file "npm start" --output none

# Deploy Zip Package
Write-Host "Archiving project files..." -ForegroundColor Cyan
$zipFile = Join-Path $env:TEMP "kbm-deploy-$((Get-Date).Ticks).zip"
Compress-Archive -Path "apps", "kbm-*", "services", "scripts", "package.json", "README.md" -DestinationPath $zipFile -Force

Write-Host "Uploading application package to Azure Web App..." -ForegroundColor Cyan
& $azCmd webapp deploy --resource-group $ResourceGroup --name $AppName --src-path $zipFile --type zip --output none

if (Test-Path $zipFile) {
    Remove-Item -Path $zipFile -Force -ErrorAction SilentlyContinue
}

$webUrl = "https://$AppName.azurewebsites.net"
Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT COMPLETE! KBM PLATFORM IS LIVE ON AZURE            " -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host "Live Web Portal: $webUrl" -ForegroundColor Cyan
Write-Host "API Health:      $webUrl/health" -ForegroundColor Cyan
