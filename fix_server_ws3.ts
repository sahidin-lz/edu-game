import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');
content = content.replace(
  /if \(app\.ws\) app\.ws\('/g,
  `if ((app as any).ws) (app as any).ws('`
);
fs.writeFileSync('server.ts', content);
