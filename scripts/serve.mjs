import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { build, root } from './build.mjs';
await build();
const base = path.join(root, 'dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.ico':'image/x-icon','.json':'application/json','.ttf':'font/ttf','.otf':'font/otf'};
createServer(async(req,res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const file = path.resolve(base, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!file.startsWith(base + path.sep)) throw Error('Invalid path');
    const data = await readFile(file);
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'});res.end(data);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(4173, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:4173'));
