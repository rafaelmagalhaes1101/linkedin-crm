// Servidor opcional para desenvolvimento local. Não é necessário na Vercel.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, resolve, sep } from 'node:path';
const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ttf':'font/ttf'};
createServer(async (req,res) => {
    try {
        const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
        let path=resolve(root,'.'+pathname);
        if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);return res.end();}
        if((await stat(path)).isDirectory())path=resolve(path,'index.html');
        const bytes=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'});res.end(bytes);
    } catch {res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Página não encontrada.');}
}).listen(port,()=>console.log(`ROASCE CRM Demo: http://localhost:${port}`));
