import fs from 'fs';

let content = fs.readFileSync('src/components/QuestBoard.tsx', 'utf-8');

// We will replace the entire file, but first I need the original imports.
// It's easier to just overwrite it entirely.
