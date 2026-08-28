import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the "Tamat - Semua Misi Selesai" div with an empty fragment because we will render a full screen overlay for Tamat
content = content.replace("""          ) : gameState.status_kota === 'Tamat' ? (
            <div className="p-6 bg-slate-900 border-t border-slate-800 flex justify-center text-amber-400 font-bold uppercase tracking-widest text-center">
              Tamat - Semua Misi Selesai
            </div>""", """          ) : gameState.status_kota === 'Tamat' ? (
            null
""")

tamat_screen = """
      {gameState.status_kota === 'Tamat' && (
        <div className="absolute inset-0 z-40 bg-slate-950 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-1000">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
          <div className="bg-slate-900/90 border-2 border-amber-500/50 p-8 md:p-12 rounded-3xl shadow-[0_0_80px_rgba(245,158,11,0.2)] max-w-3xl w-full text-center z-10 backdrop-blur-md">
            <div className="w-24 h-24 bg-amber-950 border-4 border-amber-500 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(245,158,11,0.5)]">
              🏆
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
              Perjalanan Selesai
            </h2>
            <p className="text-slate-300 mb-8 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Alhamdulillah, kamu telah menyelesaikan seluruh misi utama! Terima kasih atas dedikasi dan perjalananmu yang luar biasa di Nusantara.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <div className="text-2xl font-bold text-emerald-400 mb-1">{gameState.faham}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Skor Faham</div>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <div className="text-2xl font-bold text-cyan-400 mb-1">{gameState.hifdz}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Skor Hifdz</div>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <div className="text-2xl font-bold text-amber-400 mb-1">Rp {(gameState.uang_qris / 1000).toFixed(0)}k</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Sisa QRIS</div>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <div className="text-2xl font-bold text-purple-400 mb-1">⚡ {gameState.energi}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Sisa Energi</div>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('alkahfi_save_state');
                window.location.reload();
              }}
              className="w-full md:w-auto px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 mx-auto"
            >
              🔄 Ulang dari Awal
            </button>
          </div>
        </div>
      )}
"""

content = content.replace("<StoryLogView logs={logs} loading={loading} />", "<StoryLogView logs={logs} loading={loading} />\n" + tamat_screen)

with open('src/App.tsx', 'w') as f:
    f.write(content)
