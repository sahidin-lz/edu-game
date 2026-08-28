import fs from 'fs';

let content = fs.readFileSync('src/components/QuestBoard.tsx', 'utf-8');

// Need to inject getCustomAvatarUrl and logic for the avatarImg inside QuestBoard
if (!content.includes('getCustomAvatarUrl')) {
  content = content.replace(/import \{ AVATARS \} from '\.\.\/data\/avatars';/, "import { AVATARS, getCustomAvatarUrl } from '../data/avatars';");
}

const customImageLogic = `
  const isCustom = gameState.avatarId?.startsWith('custom-');
  const customSeed = isCustom ? gameState.avatarId?.replace('custom-', '') : '';
  const avatarImg = isCustom 
    ? getCustomAvatarUrl(customSeed!) 
    : (AVATARS.find(a => a.id === gameState.avatarId)?.image || AVATARS[0].image);
`;

// Insert the logic before getQuestPosition
content = content.replace(/const getQuestPosition =/, customImageLogic + '\n  const getQuestPosition =');

// Replace the bouncing avatar logic inside the map
const oldAvatarNode = /\{isAvailable && \(\s*<motion\.div\s*animate=\{\{ y: \[0, -15, 0\] \}\}\s*transition=\{\{ repeat: Infinity, duration: 1\.5, ease: "easeInOut" \}\}\s*className="absolute -top-24 z-20 cursor-pointer"\s*onClick=\{\(\) => onStartQuest\(quest\.id\)\}\s*>\s*<img\s*src=\{avatar\.image\}\s*alt="Current Location"\s*className="w-16 h-16 rounded-full border-4 border-amber-400 shadow-\[0_0_20px_rgba\(245,158,11,0\.6\)\] bg-slate-800 object-cover"\s*\/>\s*<div className="w-4 h-4 bg-amber-400 rotate-45 mx-auto -mt-2 border-r-4 border-b-4 border-amber-400"><\/div>\s*<\/motion\.div>\s*\)\}/m;

const newAvatarNode = `{/* AVATAR TERBANG JIKA MISI AKTIF */}
                    {isAvailable && (
                      <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="absolute -top-20 z-20 cursor-pointer"
                        onClick={() => onStartQuest(quest.id)}
                      >
                        <div className="relative">
                          <img 
                            src={avatarImg} 
                            alt="Lokasi Pemain"
                            className="w-16 h-16 rounded-full border-4 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] bg-slate-800 object-cover"
                          />
                          {/* Segitiga penunjuk ala Pin Map */}
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-amber-400"></div>
                        </div>
                      </motion.div>
                    )}`;

content = content.replace(oldAvatarNode, newAvatarNode);

// Update Node Circle style to match prompt
const oldNodeCircle = /<div\s*onClick=\{\(\) => !isLocked && onStartQuest\(quest\.id\)\}\s*className=\{`\s*w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer\s*\$\{isLocked \? 'bg-slate-900 border-slate-700 text-slate-600 grayscale' : ''\}\s*\$\{isAvailable \? 'bg-amber-900 border-amber-500 text-amber-400 scale-110 shadow-\[0_0_30px_rgba\(245,158,11,0\.4\)\]' : 'group-hover:scale-110'\}\s*\$\{isCompleted \? 'bg-emerald-600 border-emerald-400 text-white shadow-\[0_0_20px_rgba\(16,185,129,0\.5\)\]' : ''\}\s*`\}\s*>\s*\{isLocked \? <Lock size=\{16\} \/> : isCompleted \? <span className="text-xl">🏁<\/span> : <div className="w-4 h-4 bg-amber-400 rounded-full animate-ping" \/>\}\s*<\/div>/m;

const newNodeCircle = `{/* Node Asli Peta */}
                    <div onClick={() => !isLocked && onStartQuest(quest.id)} className={\`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer \${isLocked ? 'bg-slate-900 border-slate-700 text-slate-600' : isCompleted ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-amber-900 border-amber-500 text-amber-400 animate-pulse-slow'}\`}>
                       {isLocked ? <Lock size={14} /> : isCompleted ? <CheckCircle size={16} /> : <div className="w-3 h-3 bg-amber-400 rounded-full animate-ping" />}
                    </div>`;

content = content.replace(oldNodeCircle, newNodeCircle);

fs.writeFileSync('src/components/QuestBoard.tsx', content);
console.log("QuestBoard avatar pin map applied.");
