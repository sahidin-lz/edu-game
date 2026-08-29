import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');
content = content.replace(
  /if \(\!process\.env\.VERCEL\) app\.ws\('/g,
  `if (app.ws) app.ws('`
);
fs.writeFileSync('server.ts', content);
