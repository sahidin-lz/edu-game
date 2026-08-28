import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldRender = `{activeQuest && activeQuest.ayat_arab && (
                <div className="px-4 py-3 bg-emerald-950/20 border-b border-emerald-900/30 flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <BookOpen size={64} />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/50 px-2 py-1 rounded border border-emerald-900/50">Ayat Rujukan Misi</span>
                    <span className="text-xs text-emerald-200 font-medium">{activeQuest.ayat_rujukan}</span>
                  </div>
                  <p className="text-right font-arabic text-xl md:text-2xl leading-loose text-emerald-100" dir="rtl">
                    {activeQuest.ayat_arab}
                  </p>
                  <p className="text-xs italic text-emerald-200/80 leading-relaxed border-l-2 border-emerald-800 pl-3 mt-1">
                    "{activeQuest.ayat_terjemahan}"
                  </p>
                </div>
              )}`;

const newRender = `{activeQuest && activeQuest.ayat_arab && (
                <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800 flex flex-col gap-2 relative overflow-hidden transition-all duration-500">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <BookOpen size={64} />
                  </div>
                  
                  {!showAyatHint ? (
                    <div className="flex flex-col items-center justify-center p-4">
                      <p className="text-sm text-slate-300 text-center mb-3">Tantangan ini memiliki referensi <strong>{activeQuest.ayat_rujukan}</strong>.<br/>Apakah kamu hafal ayat ini atau butuh bantuan?</p>
                      <button 
                        onClick={() => setShowAyatHint(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded shadow transition-colors"
                      >
                        Tampilkan Surat dan Artinya
                      </button>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/50 px-2 py-1 rounded border border-emerald-900/50">Bantuan Ayat</span>
                          <span className="text-xs text-emerald-200 font-medium">{activeQuest.ayat_rujukan}</span>
                        </div>
                      </div>
                      <p className="text-right font-arabic text-xl md:text-2xl leading-loose text-emerald-100" dir="rtl">
                        {activeQuest.ayat_arab}
                      </p>
                      <p className="text-xs italic text-emerald-200/80 leading-relaxed border-l-2 border-emerald-800 pl-3 mt-1">
                        "{activeQuest.ayat_terjemahan}"
                      </p>
                    </div>
                  )}
                </div>
              )}`;

content = content.replace(oldRender, newRender);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx patched successfully.');
