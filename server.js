/**
 * KBM Platform - Cloud & Production Server Entrypoint
 * Starts both the Procurement API Gateway (Port 3001)
 * and the Public Web Portal & Reverse Proxy (Port from process.env.PORT or 8080).
 */

const { spawn } = require('child_process');
const path = require('path');

const rootDir = __dirname;
const port = process.env.PORT || process.env.WEBSITES_PORT || 8080;

console.log(`[KBM Cloud] Initializing platform services on port ${port}...`);

// 1. Start Backend Procurement API (Port 3001)
const apiProcess = spawn(process.execPath, [path.join(rootDir, 'services', 'procurement-api', 'server.js')], {
  cwd: rootDir,
  env: { ...process.env, API_PORT: '3001' },
  stdio: 'inherit'
});

// 2. Start Web Portal & Reverse Proxy (Port from process.env.PORT or 8080)
const webProcess = spawn(process.execPath, [path.join(rootDir, 'services', 'web', 'web-server.js')], {
  cwd: rootDir,
  env: { ...process.env, PORT: String(port) },
  stdio: 'inherit'
});

const cleanup = (code) => {
  console.log(`[KBM Cloud] Shutting down services...`);
  try { apiProcess.kill('SIGTERM'); } catch (e) {}
  try { webProcess.kill('SIGTERM'); } catch (e) {}
  process.exit(code || 0);
};

process.on('SIGTERM', () => cleanup(0));
process.on('SIGINT', () => cleanup(0));

apiProcess.on('exit', (code) => {
  console.error(`[KBM Cloud] API process exited with code ${code}`);
  cleanup(code || 1);
});

webProcess.on('exit', (code) => {
  console.error(`[KBM Cloud] Web process exited with code ${code}`);
  cleanup(code || 1);
});

