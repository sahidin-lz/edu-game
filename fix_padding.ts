import fs from 'fs';

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
// Fix Hologram Briefing Card padding
appContent = appContent.replace(
  /<div className="p-4 bg-slate-900\/80 border-l-4 border-amber-500 shadow-lg relative z-10 backdrop-blur-xl">/,
  '<div className="p-4 md:pr-28 bg-slate-900/80 border-l-4 border-amber-500 shadow-lg relative z-10 backdrop-blur-xl">'
);

// Fix Referensi header padding
appContent = appContent.replace(
  /<div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-950">/,
  '<div className="px-4 md:pr-28 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-950">'
);

// Fix Ayat content padding
appContent = appContent.replace(
  /<div className="p-6 pb-8 bg-gradient-to-br from-emerald-950 to-slate-900 border-b border-emerald-900\/50 shadow-\[0_0_30px_rgba\(16,185,129,0\.2\)\] animate-in fade-in slide-in-from-bottom-2 relative overflow-hidden">/,
  '<div className="p-6 pb-8 md:pr-28 bg-gradient-to-br from-emerald-950 to-slate-900 border-b border-emerald-900/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-in fade-in slide-in-from-bottom-2 relative overflow-hidden">'
);

fs.writeFileSync('src/App.tsx', appContent);

let actionContent = fs.readFileSync('src/components/ActionInput.tsx', 'utf-8');
// Fix ActionInput padding
actionContent = actionContent.replace(
  /<div className="w-full relative z-10 flex flex-col gap-3 p-4 bg-slate-950 border-t border-slate-800 shadow-\[0_-10px_30px_rgba\(0,0,0,0\.8\)\]">/,
  '<div className="w-full relative z-10 flex flex-col gap-3 p-4 md:pr-28 bg-slate-950 border-t border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">'
);
fs.writeFileSync('src/components/ActionInput.tsx', actionContent);

