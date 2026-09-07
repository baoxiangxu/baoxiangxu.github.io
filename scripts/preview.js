#!/usr/bin/env node
/**
 * Serves build/ for local preview and prints a LAN address so the site can be
 * opened on a phone.
 *
 * Written in Node rather than as a shell script so Windows, macOS and Linux
 * all run the exact same code — the hand-written .bat had escaping and
 * delayed-expansion bugs, and both shells needed Python just to serve files.
 * Node is already required to build the site.
 */
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..', 'build');
const START_PORT = 4173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2',
};

if (!fs.existsSync(path.join(ROOT, 'index.html'))) {
  console.error('\n  还没有构建结果 / No build yet.\n');
  console.error('  请先在终端里执行 / Run this first:\n');
  console.error('      npm install     (只需第一次 / first time only)');
  console.error('      npm run build\n');
  process.exit(1);
}

const send = (res, status, body, type) => {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
};

const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (rel.endsWith('/')) rel += 'index.html';

  // Resolve inside build/ only — never serve anything above it.
  const file = path.join(ROOT, path.normalize(rel).replace(/^([/\\])+/, ''));
  if (!file.startsWith(ROOT)) return send(res, 403, 'Forbidden', 'text/plain');

  fs.readFile(file, (err, data) => {
    if (!err) {
      return send(res, 200, data, MIME[path.extname(file).toLowerCase()] || 'application/octet-stream');
    }
    // Single-page app: unknown paths without a file extension fall back to the
    // app shell, the same way GitHub Pages uses 200.html.
    if (!path.extname(file)) {
      return fs.readFile(path.join(ROOT, 'index.html'), (e2, shell) =>
        e2 ? send(res, 404, 'Not found', 'text/plain') : send(res, 200, shell, MIME['.html'])
      );
    }
    send(res, 404, 'Not found', 'text/plain');
  });
});

const lanAddress = () => {
  for (const list of Object.values(os.networkInterfaces())) {
    for (const net of list || []) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('169.254.')) {
        return net.address;
      }
    }
  }
  return null;
};

const openBrowser = (url) => {
  const cmd =
    process.platform === 'win32' ? ['cmd', ['/c', 'start', '""', url]]
    : process.platform === 'darwin' ? ['open', [url]]
    : ['xdg-open', [url]];
  try {
    spawn(cmd[0], cmd[1], { stdio: 'ignore', detached: true }).unref();
  } catch {
    /* opening the browser is a convenience, not a requirement */
  }
};

const listen = (port) => {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && port < START_PORT + 20) return listen(port + 1);
    throw err;
  });
  server.listen(port, '0.0.0.0', () => {
    const lan = lanAddress();
    console.log('');
    console.log('  个人网站本地预览 / Local preview');
    console.log('  ──────────────────────────────────────────────');
    console.log(`  这台电脑 / This computer:  http://localhost:${port}`);
    if (lan) {
      console.log(`  手机打开 / On your phone:  http://${lan}:${port}`);
      console.log('                             (需连同一个 Wi-Fi；首次可能弹出防火墙提示，点「允许」)');
    } else {
      console.log('  手机打开 / On your phone:  未检测到局域网地址，请先连上 Wi-Fi');
    }
    console.log('');
    console.log('  停止预览 / Stop:  关闭这个窗口，或按 Ctrl + C');
    console.log('  ──────────────────────────────────────────────');
    console.log('');
    openBrowser(`http://localhost:${port}`);
  });
};

listen(START_PORT);
