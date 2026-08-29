import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const api = spawn(process.execPath, ['services/procurement-api/server.js'], {
  cwd: rootDir,
  stdio: 'inherit'
});

const web = spawn(process.execPath, ['services/web/web-server.js'], {
  cwd: rootDir,
  stdio: 'inherit'
});

const shutdown = () => {
  api.kill('SIGTERM');
  web.kill('SIGTERM');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

api.on('exit', (code, signal) => {
  console.log(`API process exited (${code ?? signal})`);
  if (!web.killed) web.kill('SIGTERM');
  process.exit(code ?? 1);
});

web.on('exit', (code, signal) => {
  console.log(`Web process exited (${code ?? signal})`);
  if (!api.killed) api.kill('SIGTERM');
  process.exit(code ?? 1);
});

console.log('Starting KBM API and web portal...');
