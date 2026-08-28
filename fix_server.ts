import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const regex = /app\.post\("\/api\/music", async \(req, res\) => \{[\s\S]*?\}\);/g;
content = content.replace(regex, '');

fs.writeFileSync('server.ts', content);
