import fs from 'fs';

let content = fs.readFileSync('vercel.json', 'utf-8');
const config = JSON.parse(content);
config.functions = {
  "api/**/*.ts": {
    "maxDuration": 60
  }
};
fs.writeFileSync('vercel.json', JSON.stringify(config, null, 2));
