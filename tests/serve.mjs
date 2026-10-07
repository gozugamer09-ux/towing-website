// Minimal static file server for testing a built site folder (dist/ or dist-preview/).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json' };

export function serve(root, port = 0) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let file = path.join(root, p);
      if (p.endsWith('/')) file = path.join(file, 'index.html');
      if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        if (fs.existsSync(path.join(file, 'index.html'))) { res.writeHead(301, { Location: p + '/' }); return res.end(); }
        // Like Cloudflare Pages: the closest 404.html up the folder tree (es/404.html for /es/...).
        let dir = path.dirname(path.join(root, p.endsWith('/') ? p + 'x' : p));
        while (!fs.existsSync(path.join(dir, '404.html')) && dir.length > root.length) dir = path.dirname(dir);
        const notFound = path.join(dir, '404.html');
        res.writeHead(404, { 'Content-Type': TYPES['.html'] });
        return res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : 'Not found'); // the share bundle has no 404 page
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(port, () => resolve({ server, url: `http://localhost:${server.address().port}` }));
  });
}

if (process.argv[1].endsWith('serve.mjs')) {
  const { url } = await serve(process.argv[2] || 'dist', +(process.argv[3] || 4321));
  console.log('serving', url);
}
