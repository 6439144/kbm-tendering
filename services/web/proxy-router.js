const API_PROXY_TARGET = 'http://localhost:3001';

function isApiRequest(url = '') {
  const pathname = new URL(url, 'http://localhost').pathname;
  return pathname.startsWith('/api');
}

function getApiProxyTarget(url = '') {
  const parsed = new URL(url, 'http://localhost');
  return `${API_PROXY_TARGET}${parsed.pathname}${parsed.search}`;
}

module.exports = {
  API_PROXY_TARGET,
  isApiRequest,
  getApiProxyTarget
};
