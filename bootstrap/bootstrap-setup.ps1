$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$repoNames = @(
  'kbm-platform-ui',
  'kbm-platform-edge',
  'kbm-platform-workflow-service',
  'kbm-platform-procurement-service',
  'kbm-platform-vendor-service',
  'kbm-platform-payment-service',
  'kbm-platform-document-service',
  'kbm-platform-notification-service',
  'kbm-platform-integration-service',
  'kbm-platform-audit-service',
  'kbm-platform-marketplace-service',
  'kbm-platform-contracts',
  'kbm-platform-infrastructure',
  'kbm-platform-qa',
  'kbm-platform-docs',
  'kbm-repo-template'
)

foreach ($name in $repoNames) {
  $path = Join-Path $root $name
  if (-not (Test-Path $path)) {
    New-Item -ItemType Directory -Path $path -Force | Out-Null
  }

  $readme = Join-Path $path 'README.md'
  if (-not (Test-Path $readme)) {
    @(
      "# $name",
      '',
      'This repository is a scaffold for the KBM platform and will be expanded in later implementation gates.',
      '',
      '## Purpose',
      '',
      'See the repository map and Gate 0 planning docs for expected ownership and responsibilities.',
      '',
      '## Current status',
      '',
      '- Local scaffold created',
      '- CI/CD and application code to be implemented in later gates',
      '- Production deployment not enabled by default'
    ) | Set-Content -Path $readme
  }
}

Write-Host 'Repository scaffold created successfully.'
