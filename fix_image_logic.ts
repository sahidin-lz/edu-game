import fs from 'fs';

// StatusBar.tsx
let statusContent = fs.readFileSync('src/components/StatusBar.tsx', 'utf-8');
statusContent = statusContent.replace(
  /const customImage = isCustom \? `https:\/\/api\.dicebear\.com[^`]+` : '';/,
  "const customImage = isCustom ? getCustomAvatarUrl(customSeed!) : '';"
);
statusContent = statusContent.replace(
  /import \{ AVATARS \} from '\.\.\/data\/avatars';/,
  "import { AVATARS, getCustomAvatarUrl } from '../data/avatars';"
);
fs.writeFileSync('src/components/StatusBar.tsx', statusContent);

// WelcomePopup.tsx
let welcomeContent = fs.readFileSync('src/components/WelcomePopup.tsx', 'utf-8');
welcomeContent = welcomeContent.replace(
  /const customImage = isCustom \? `https:\/\/api\.dicebear\.com[^`]+` : '';/,
  "const customImage = isCustom ? getCustomAvatarUrl(customSeed!) : '';"
);
// Ensure getCustomAvatarUrl is imported
if (!welcomeContent.includes('getCustomAvatarUrl')) {
  welcomeContent = welcomeContent.replace(
    /import \{ AVATARS \} from '\.\.\/data\/avatars';/,
    "import { AVATARS, getCustomAvatarUrl } from '../data/avatars';"
  );
}
fs.writeFileSync('src/components/WelcomePopup.tsx', welcomeContent);

console.log("Fixed customImage logic in StatusBar and WelcomePopup");
