import fs from 'fs';

// --- Fix WelcomePopup.tsx ---
let welcomeContent = fs.readFileSync('src/components/WelcomePopup.tsx', 'utf-8');
const avatarLookup = `
  const isCustom = gameState.avatarId?.startsWith('custom-');
  const customSeed = isCustom ? gameState.avatarId?.replace('custom-', '') : '';
  const customImage = isCustom ? \`https://api.dicebear.com/7.x/adventurer/svg?seed=\${encodeURIComponent(customSeed!)}&backgroundColor=b6e3f4\` : '';
  
  const avatar = isCustom ? { name: gameState.playerName || 'Siswa', image: customImage } : (AVATARS.find(a => a.id === gameState.avatarId) || AVATARS[0]);
`;
welcomeContent = welcomeContent.replace(/const avatar = AVATARS\.find\(a => a\.id === gameState\.avatarId\) \|\| AVATARS\[0\];/, avatarLookup);
fs.writeFileSync('src/components/WelcomePopup.tsx', welcomeContent);

// --- Fix StatusBar.tsx ---
let statusContent = fs.readFileSync('src/components/StatusBar.tsx', 'utf-8');

// We need to import AVATARS and logic
const statusImports = `import { AVATARS } from '../data/avatars';\n`;
statusContent = statusContent.replace(/import { GameState } from '\.\.\/types';/, `import { GameState } from '../types';\n${statusImports}`);

const statusAvatarLogic = `
  const isCustom = state.avatarId?.startsWith('custom-');
  const customSeed = isCustom ? state.avatarId?.replace('custom-', '') : '';
  const customImage = isCustom ? \`https://api.dicebear.com/7.x/adventurer/svg?seed=\${encodeURIComponent(customSeed!)}&backgroundColor=b6e3f4\` : '';
  const avatar = isCustom ? { name: userProfile?.displayName || 'Siswa', image: customImage } : (AVATARS.find(a => a.id === state.avatarId) || AVATARS[0]);
`;

// Insert after function declaration
statusContent = statusContent.replace(/export function StatusBar\([^)]+\) \{/, `export function StatusBar({ state, onToggleProfile, onToggleDashboard, onToggleSideQuests, onToggleAdmin, onToggleChat, onToggleTahfidz, user, userProfile }: Props) {${statusAvatarLogic}`);

// Replace the AK box with the avatar image
const akBox = `<div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center font-bold text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]">AK</div>`;
const avatarBox = `
          <div className="relative group cursor-pointer" onClick={onToggleProfile}>
            <img src={avatar.image} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] object-cover bg-slate-800" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
          </div>
`;
statusContent = statusContent.replace(akBox, avatarBox);

fs.writeFileSync('src/components/StatusBar.tsx', statusContent);

console.log("WelcomePopup and StatusBar fixed");
