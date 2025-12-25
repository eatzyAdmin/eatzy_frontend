const http = require('http');
const httpProxy = require('http-proxy');

// Create proxy server
const proxy = httpProxy.createProxyServer({
  ws: true, // Enable WebSocket support for HMR
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  if (!res.headersSent) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
  }
  res.end('Proxy error: ' + err.message);
});

// Route configuration
const routes = {
  '/customer': 'http://localhost:3000',
  '/driver': 'http://localhost:3001',
  '/restaurant': 'http://localhost:3002',
  '/admin': 'http://localhost:3003',
  '/super-admin': 'http://localhost:3004',
};

// Create server
const server = http.createServer((req, res) => {
  // Find matching route
  const route = Object.keys(routes).find(path => req.url.startsWith(path));

  if (route) {
    const target = routes[route];
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url} -> ${target}`);

    // Proxy the request
    proxy.web(req, res, { target });
  } else if (req.url === '/' || req.url === '') {
    // Redirect root to customer app
    res.writeHead(302, { 'Location': '/customer' });
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Handle WebSocket upgrade for HMR
server.on('upgrade', (req, socket, head) => {
  const route = Object.keys(routes).find(path => req.url.startsWith(path));

  if (route) {
    const target = routes[route];
    console.log(`[WS] ${req.url} -> ${target}`);
    proxy.ws(req, socket, head, { target });
  }
});

// Start server
const PORT = 8080;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log('🚀 Eatzy Proxy Server Started!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 Listening on: http://localhost:${PORT}`);
  console.log('');
  console.log('📱 Apps available at:');
  console.log('  • http://localhost:8080/customer');
  console.log('  • http://localhost:8080/driver');
  console.log('  • http://localhost:8080/restaurant');
  console.log('  • http://localhost:8080/admin');
  console.log('  • http://localhost:8080/super-admin');
  console.log('');
  console.log('⚠️  Make sure all 5 Next.js apps are running!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down proxy server...');
  server.close(() => {
    console.log('✅ Proxy server stopped');
    process.exit(0);
  });
});
