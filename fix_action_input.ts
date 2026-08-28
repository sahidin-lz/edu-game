import fs from 'fs';

let content = fs.readFileSync('src/components/ActionInput.tsx', 'utf-8');

// Remove import
content = content.replace(/import \{ MusicGenerator \} from '\.\/MusicGenerator';\n/, '');

// Remove the MusicGenerator element and its wrapper
content = content.replace(/<div className="w-48 hidden md:block">\s*<MusicGenerator context=\{locationContext \|\| 'A tense situation'\} \/>\s*<\/div>/, '');

fs.writeFileSync('src/components/ActionInput.tsx', content);
