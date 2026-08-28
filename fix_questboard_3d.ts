import fs from 'fs';

let content = fs.readFileSync('src/components/QuestBoard.tsx', 'utf-8');

// We'll update the `viewMode === 'map'` block.
const oldMapBlock = `<div className="relative w-full" style={{ height: \`\${totalMapHeight}px\` }}>
              {/* Topographic Background (CSS patterns) */}
              <div className="absolute inset-0 opacity-20" 
                   style={{ 
                     backgroundImage: 'repeating-radial-gradient(circle at 0 0, transparent 0, #0f172a 10px), repeating-linear-gradient(#1e293b, #1e293b)',
                     backgroundSize: '100px 100px'
                   }}>
              </div>`;

const newMapBlock = `<div className="relative w-full overflow-hidden flex justify-center perspective-[2000px]" style={{ height: \`\${totalMapHeight}px\` }}>
              {/* 3D Map Plane */}
              <div 
                className="absolute w-[120%] left-[-10%] top-0 transform-style-3d origin-top transition-transform duration-1000"
                style={{ 
                  height: \`\${totalMapHeight}px\`,
                  transform: 'rotateX(35deg) translateY(-50px) scale(0.9)' 
                }}
              >
                {/* Terrain / City Condition Texture */}
                <div className="absolute inset-0 opacity-30 shadow-[inset_0_0_100px_#020617]" 
                     style={{ 
                       backgroundImage: 'repeating-radial-gradient(circle at 50% 0%, transparent 0, #0f172a 15px), radial-gradient(circle at 50% 50%, #1e293b, #020617)',
                       backgroundSize: '150px 150px, 100% 100%'
                     }}>
                </div>
                {/* Grid Floor */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.2) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
`;

content = content.replace(oldMapBlock, newMapBlock);

// For nodes, we need to counter-rotate them so they stand up.
// Find the node wrapper:
const oldNodeBlock = `<div 
                    key={\`node-\${quest.id}\`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10 w-[240px]"
                    style={{ left: \`\${pos.x}%\`, top: \`\${pos.y}px\` }}`;

const newNodeBlock = `<div 
                    key={\`node-\${quest.id}\`}
                    className="absolute flex flex-col items-center group z-10 w-[240px] transition-transform duration-500"
                    style={{ 
                      left: \`\${pos.x}%\`, 
                      top: \`\${pos.y}px\`,
                      transform: 'translate(-50%, -50%) rotateX(-35deg)' // Counter-rotate to stand up
                    }}`;

content = content.replace(/<div \s*key=\{`node-\$\{quest\.id\}`\}\s*className="absolute transform -translate-x-1\/2 -translate-y-1\/2 flex flex-col items-center group z-10 w-\[240px\]"\s*style=\{\{ left: `\$\{pos\.x\}%`, top: `\$\{pos\.y\}px` \}\}/g, newNodeBlock);


// Close the new wrapper div right before `) : (` which is the end of the map view.
content = content.replace(/<\/div>\s*\)\s*:\s*\(/, "</div>\n            </div>\n          ) : (");

fs.writeFileSync('src/components/QuestBoard.tsx', content);
console.log("QuestBoard modified for 2.5D");
