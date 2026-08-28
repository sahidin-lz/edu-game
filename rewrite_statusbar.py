import re

with open('src/components/StatusBar.tsx', 'r') as f:
    content = f.read()

# Replace onToggleArchive with onToggleProfile
content = content.replace("onToggleArchive:", "onToggleProfile:")
content = content.replace("onToggleArchive,", "onToggleProfile,")

# Remove the Arsip button
arsip_btn = """          <button 
            onClick={onToggleArchive}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded transition-colors whitespace-nowrap"
          >
            <Archive size={14} className="text-cyan-400" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300 hidden lg:inline">Arsip</span>
          </button>"""

content = content.replace(arsip_btn, "")
content = content.replace("Archive,", "")

# Add onOpenProfile prop to AuthButton
content = content.replace("<AuthButton user={user} />", "<AuthButton user={user} onOpenProfile={onToggleProfile} />")

with open('src/components/StatusBar.tsx', 'w') as f:
    f.write(content)

