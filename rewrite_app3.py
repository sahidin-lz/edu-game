import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace transit screen buttons
old_transit = """              <button
                onClick={handleNextScenario}
                disabled={gameState.energi <= 20}
                className="w-full max-w-2xl py-4 mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all uppercase tracking-widest flex items-center justify-center gap-3 text-sm"
              >
                Lanjutkan Perjalanan (Rihlah)
              </button>
              <button
                onClick={() => setIsSideQuestsOpen(true)}
                className="w-full max-w-2xl py-3 mt-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-3 text-sm"
              >
                🗺️ Buka Peta Petualangan
              </button>"""

new_transit = """              <button
                onClick={() => setIsSideQuestsOpen(true)}
                className="w-full max-w-2xl py-4 mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all uppercase tracking-widest flex items-center justify-center gap-3 text-sm"
              >
                🚀 Lanjutkan Petualangan
              </button>"""

content = content.replace(old_transit, new_transit)

# Need to update handleActionSubmit to check for the Tamat status.
# Currently handleActionSubmit evaluates to Aman/Harmonis and updates quest status. 
# We should check if ALL main quests are completed after this.
# Instead of doing that in handleNextScenario, we do it in handleActionSubmit.

def replace_action_submit(m):
    return """
          if (currentQuest.kategori === 'Main Quest') {
            // Unlock next Main Quest
            const nextMainQuestIndex = updatedQuests.findIndex((q, i) => i > gameState.currentScenarioIndex && q.kategori === 'Main Quest');
            if (nextMainQuestIndex !== -1) {
              updatedQuests[nextMainQuestIndex] = { ...updatedQuests[nextMainQuestIndex], status: 'available' };
            } else {
              // ALL MAIN QUESTS COMPLETED
              result.status_kota = "Tamat";
            }
          }
"""

content = re.sub(r"""
\s*if\s*\(currentQuest\.kategori\s*===\s*'Main\sQuest'\)\s*\{\s*
\s*//\s*Unlock\s*next\s*Main\s*Quest\s*
\s*const\s*nextMainQuestIndex\s*=\s*updatedQuests\.findIndex\(\(q,\s*i\)\s*=>\s*i\s*>\s*gameState\.currentScenarioIndex\s*&&\s*q\.kategori\s*===\s*'Main\sQuest'\);\s*
\s*if\s*\(nextMainQuestIndex\s*!==\s*-1\)\s*\{\s*
\s*updatedQuests\[nextMainQuestIndex\]\s*=\s*\{\s*\.\.\.updatedQuests\[nextMainQuestIndex\],\s*status:\s*'available'\s*\};\s*
\s*\}\s*
\s*\}\s*""", replace_action_submit(''), content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
