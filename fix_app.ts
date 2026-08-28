import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldSection = `            {/* Jika sedang KRISIS (Waspada): Tampilkan Form Input (Esai/Suara) */}
            {!isIdle && gameState.status_kota !== 'Tamat' && (
              <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pointer-events-auto">
                {activeQuest && activeQuest.ayat_arab && (
                  <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                    <p className="text-xs text-slate-400">Referensi: <strong>{activeQuest.ayat_rujukan}</strong></p>
                    <button onClick={() => setShowAyatHint(!showAyatHint)} className="text-[10px] uppercase text-indigo-400 font-bold hover:text-indigo-300">
                      {showAyatHint ? 'Sembunyikan' : 'Lihat Ayat'}
                    </button>
                  </div>
                )}
                {showAyatHint && activeQuest?.ayat_arab && (
                  <div className="p-4 bg-slate-900 border-b border-slate-800 animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-right font-arabic text-xl leading-loose text-emerald-300" dir="rtl">{activeQuest.ayat_arab}</p>
                    <p className="text-[10px] italic text-slate-400 mt-2">"{activeQuest.ayat_terjemahan}"</p>
                  </div>
                )}
                <ActionInput onActionSubmit={handleActionSubmit} disabled={loading} locationContext={gameState.locationContext} />
              </div>
            )}`;

const newSection = `            {/* Jika sedang KRISIS (Waspada): Tampilkan Form Input (Esai/Suara) */}
            {!isIdle && gameState.status_kota !== 'Tamat' && (
              <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pointer-events-auto">
                
                {/* HOLOGRAM BRIEFING CARD */}
                {activeQuest && (
                  <div className="p-4 bg-slate-900/80 border-l-4 border-amber-500 shadow-lg relative z-10 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-1 rounded">Kategori Misi: {activeQuest.kategori}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{activeQuest.judul_konflik}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{activeQuest.deskripsi}</p>
                  </div>
                )}

                {activeQuest && activeQuest.ayat_arab && (
                  <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                    <p className="text-xs text-slate-400">Referensi: <strong>{activeQuest.ayat_rujukan}</strong></p>
                    <button onClick={() => setShowAyatHint(!showAyatHint)} className="text-[10px] uppercase text-indigo-400 font-bold hover:text-indigo-300">
                      {showAyatHint ? 'Sembunyikan' : 'Lihat Ayat'}
                    </button>
                  </div>
                )}
                
                {showAyatHint && activeQuest?.ayat_arab && (
                  <div className="p-6 bg-gradient-to-br from-emerald-950 to-slate-900 border-b border-emerald-900/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-in fade-in slide-in-from-bottom-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <p className="text-right font-arabic text-3xl leading-[2.5] text-emerald-300 font-bold drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] relative z-10" dir="rtl">{activeQuest.ayat_arab}</p>
                    <p className="text-xs italic text-emerald-100/70 mt-4 relative z-10 border-t border-emerald-900/30 pt-3">"{activeQuest.ayat_terjemahan}"</p>
                  </div>
                )}
                <ActionInput onActionSubmit={handleActionSubmit} disabled={loading} locationContext={gameState.locationContext} />
              </div>
            )}`;

content = content.replace(oldSection, newSection);

fs.writeFileSync('src/App.tsx', content);
