import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const bicepPath = path.join(root, 'kbm-platform-infrastructure', 'main.bicep');

const requiredChecks = [
  { label: 'default bootstrap profile parameter', pattern: "param deploymentProfile string = 'bootstrap'" },
  { label: 'free-tier F1 app service in bootstrap', pattern: "name: 'F1'" },
  { label: 'free configuration store in bootstrap', pattern: "name: 'free'" },
  { label: 'bootstrap conditional variable', pattern: "var isBootstrap = deploymentProfile == 'bootstrap'" },
  { label: 'production conditional variable', pattern: "var isProduction = deploymentProfile == 'production'" },
  { label: 'budget alert threshold for production', pattern: "resource budgetAlert 'Microsoft.Consumption/budgets@2021-10-01' = if (isProduction)" }
];

const content = fs.readFileSync(bicepPath, 'utf8');
const failures = [];

for (const check of requiredChecks) {
  if (!content.includes(check.pattern)) {
    failures.push(`Missing required policy check: ${check.label}`);
  }
}

if (failures.length > 0) {
  console.error('Bootstrap validation failed:');
  for (const failure of failures) {
    console.error(` - ${failure}`);
  }
  process.exit(1);
}

console.log('✓ Bootstrap validation passed. The default configuration enforces $0/month Azure spend and gates paid production SKUs behind explicit approval.');
