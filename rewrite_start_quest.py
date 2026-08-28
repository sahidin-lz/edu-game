import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_code = """    setGameState(prev => {
      const newState = {
        ...prev,
        energi: prev.energi - (quest.cost_energi || 0),
        currentScenarioIndex: questIndex,
        status_kota: "Waspada",
        locationContext: `[${quest.lokasi}] ${quest.deskripsi}`
      };
      
      const newLog: StoryLog = {
        id: Date.now().toString() + '-narrative',
        type: 'narrative',
        content: `**MEMULAI MISI: ${quest.judul_konflik}**\\n\\n${newState.locationContext}`,
      };"""

new_code = """    setGameState(prev => {
      let fullContext = `[${quest.lokasi}] ${quest.deskripsi}`;
      if (quest.ayat_arab && quest.ayat_terjemahan) {
        fullContext += `\\n\\n**Ayat Rujukan (${quest.ayat_rujukan}):**\\n${quest.ayat_arab}\\n*"${quest.ayat_terjemahan}"*`;
      }

      const newState = {
        ...prev,
        energi: prev.energi - (quest.cost_energi || 0),
        currentScenarioIndex: questIndex,
        status_kota: "Waspada",
        locationContext: fullContext
      };
      
      const newLog: StoryLog = {
        id: Date.now().toString() + '-narrative',
        type: 'narrative',
        content: `**MEMULAI MISI: ${quest.judul_konflik}**\\n\\n${fullContext}`,
      };"""

content = content.replace(old_code, new_code)

with open('src/App.tsx', 'w') as f:
    f.write(content)
