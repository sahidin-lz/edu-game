import fs from 'fs';

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
appContent = appContent.replace(/p-4 md:pr-28 /g, 'p-4 pr-20 md:pr-28 ');
appContent = appContent.replace(/px-4 md:pr-28 /g, 'px-4 pr-20 md:pr-28 ');
appContent = appContent.replace(/p-6 pb-8 md:pr-28 /g, 'p-6 pb-8 pr-20 md:pr-28 ');
fs.writeFileSync('src/App.tsx', appContent);

let actionContent = fs.readFileSync('src/components/ActionInput.tsx', 'utf-8');
actionContent = actionContent.replace(/p-4 md:pr-28 /g, 'p-4 pr-20 md:pr-28 ');
fs.writeFileSync('src/components/ActionInput.tsx', actionContent);

