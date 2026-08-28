import fs from 'fs';

let content = fs.readFileSync('src/components/QuestBoard.tsx', 'utf-8');

// 1. Replace map wrappers and background
const oldMapRegex = /<div className="relative w-full overflow-hidden flex justify-center perspective-\[2000px\]" style=\{\{ height: `\$\{totalMapHeight\}px` \}\}>\s*\{\/\* 3D Map Plane \*\/\}\s*<div[^>]*>\s*\{\/\* Terrain \/ City Condition Texture \*\/\}\s*<div[^>]*>\s*<\/div>\s*\{\/\* Grid Floor \*\/\}\s*<div[^>]*><\/div>/;

const newMapBackground = `<div className="relative w-full rounded-xl overflow-hidden border border-slate-800 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" style={{ height: \`\${totalMapHeight}px\` }}>
              {/* Realistic Map Background */}
              <div className="absolute inset-0 z-0">
                <div 
                  className="absolute inset-0 opacity-40 mix-blend-luminosity"
                  style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'contrast(1.2) grayscale(0.8)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
                <div className="absolute inset-0 opacity-30" 
                     style={{ 
                       backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 20%, #020617 100%), repeating-linear-gradient(rgba(15, 23, 42, 0.5) 0px, rgba(15, 23, 42, 0.5) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(15, 23, 42, 0.5) 0px, rgba(15, 23, 42, 0.5) 1px, transparent 1px, transparent 40px)',
                     }}>
                </div>
              </div>`;
content = content.replace(oldMapRegex, newMapBackground);

// 2. Replace node transformations
const oldNodeTransformRegex = /transform: 'translate\(-50%, -50%\) rotateX\(-35deg\)' \/\/ Counter-rotate to stand up/;
const newNodeTransform = `transform: 'translate(-50%, -50%)'`;
content = content.replace(new RegExp(oldNodeTransformRegex.source, 'g'), newNodeTransform);

// 3. Remove the extra closing div
// Look for </div></div></div> ) : ( and reduce by one </div>
content = content.replace(/<\/div>\s*<\/div>\s*\)\s*:\s*\(/, "</div>\n          ) : (");

fs.writeFileSync('src/components/QuestBoard.tsx', content);
console.log("Map flattened and realistic background applied.");
