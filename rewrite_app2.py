import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update isAtBasecamp layout
old_basecamp = """      {isAtBasecamp ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
          <div className="bg-slate-900/80 border-2 border-emerald-500/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] max-w-2xl w-full text-center z-10 backdrop-blur-md">
            <div className="w-24 h-24 bg-emerald-950 border-4 border-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              🏕️
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Basecamp Kafilah
            </h2>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
              Kamu sedang berada di basecamp. Persiapkan dirimu sebelum memulai perjalanan ke berbagai daerah.
            </p>
            
            <div className="flex justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-1">{gameState.currentScenarioIndex}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Total Capaian Level</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">Rp {(gameState.uang_qris / 1000).toFixed(0)}k</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Modal Perjalanan</div>
              </div>
            </div>

            <button
              onClick={() => handleStartQuest(gameState.quests[0].id)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 mb-4"
            >
              🚀 Mulai Petualangan
            </button>
            <button
              onClick={() => setIsSideQuestsOpen(true)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-3 text-sm"
            >
              🗺️ Buka Peta Petualangan
            </button>
          </div>
        </div>
      ) : ("""

new_basecamp = """      {isAtBasecamp ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
          <div className="bg-slate-900/80 border-2 border-emerald-500/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] max-w-2xl w-full text-center z-10 backdrop-blur-md">
            <div className="w-24 h-24 bg-emerald-950 border-4 border-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(16,185,129,0.5)] overflow-hidden">
              <img src={userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Persiapan Petualangan
            </h2>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
              Halo, <strong>{userProfile?.displayName || user?.email?.split('@')[0]}</strong>! Persiapkan dirimu sebelum memulai perjalanan ke berbagai daerah.
            </p>
            
            <div className="flex justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-1">{gameState.currentScenarioIndex + 1}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Level Saat Ini</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">⚡ {gameState.energi}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Sisa Energi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-1">Rp {(gameState.uang_qris / 1000).toFixed(0)}k</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Modal (QRIS)</div>
              </div>
            </div>

            <button
              onClick={() => setIsSideQuestsOpen(true)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 mb-4"
            >
              🚀 Mulai Petualangan
            </button>
          </div>
        </div>
      ) : ("""

content = content.replace(old_basecamp, new_basecamp)

with open('src/App.tsx', 'w') as f:
    f.write(content)
