import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');
content = content.replace(
  /const \{ app, getWss \} = expressWs\(express\(\)\);/,
  `const app = express();\nlet getWss: any;\nif (!process.env.VERCEL) {\n  const wsInstance = expressWs(app);\n  getWss = wsInstance.getWss;\n}`
);
content = content.replace(
  /app\.ws\('\/live',/g,
  `if (!process.env.VERCEL) app.ws('/live',`
);
content = content.replace(
  /app\.ws\('\/ws\/p2p',/g,
  `if (!process.env.VERCEL) app.ws('/ws/p2p',`
);

fs.writeFileSync('server.ts', content);
