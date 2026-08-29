import http from 'node:http';

function request(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
  });
}

const checks = [
  'http://localhost:3001/api/health',
  'http://localhost:3000/health'
];

const results = await Promise.all(checks.map(async (url) => {
  const response = await request(url);
  return { url, status: response.status, body: response.body };
}));

for (const result of results) {
  if (result.status !== 200) {
    console.error(`Health check failed for ${result.url}: ${result.status}`);
    process.exit(1);
  }
  console.log(`${result.url} -> ${result.status}`);
}

console.log('All local health checks passed.');
