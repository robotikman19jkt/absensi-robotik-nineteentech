// ═══════════════════════════════════════════════════════════════
// NineteenTech Robotic Club Server - MAN 19 Jakarta Selatan
// Built with native Node.js (Zero dependencies required!)
// Features: Auto IP Detection, JSON Database Sync, Static Server
// ═══════════════════════════════════════════════════════════════

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'database.json');

// MIME types mapping
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// Ambil IP lokal WiFi / LAN agar siswa di lab bisa akses dari HP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = decodeURI(req.url.split('?')[0]);

  // ── API: GET DATABASE ──
  if (req.method === 'GET' && reqPath === '/api/db') {
    if (fs.existsSync(DATA_FILE)) {
      try {
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(content);
        return;
      } catch(e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Gagal membaca database.json' }));
        return;
      }
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('null');
      return;
    }
  }

  // ── API: SAVE DATABASE ──
  if (req.method === 'POST' && reqPath === '/api/db') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Batasi payload maksimal 10MB
      if (body.length > 10 * 1024 * 1024) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload terlalu besar' }));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        JSON.parse(body); // Validasi format JSON
        fs.writeFileSync(DATA_FILE, body, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', updated_at: new Date().toISOString() }));
      } catch(err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Format JSON tidak valid' }));
      }
    });
    return;
  }

  // ── STATIC FILE SERVING ──
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(ROOT, reqPath);

  // Security check: cegah path traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log('\n=============================================================');
  console.log('🤖  NINETEENTECH ROBOTIC CLUB - SERVER ABSENSI ONLINE');
  console.log('    Sekolah: MAN 19 Jakarta Selatan');
  console.log('=============================================================');
  console.log(`\n✅  Akses di Laptop (Admin) : http://localhost:${PORT}`);
  console.log(`📱  Akses dari HP Siswa     : http://${localIP}:${PORT}`);
  console.log(`💾  Database tersimpan di  : ${DATA_FILE}`);
  console.log('    (Pastikan HP siswa & laptop terhubung ke WiFi / hotspot yang sama)\n');
  console.log('Tekan Ctrl + C untuk mematikan server.\n');
});
