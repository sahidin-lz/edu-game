import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace import
content = content.replace("import { DilemmaArchive } from './components/DilemmaArchive';", "import { ProfileModal } from './components/ProfileModal';")

# Replace toggle prop in StatusBar
content = content.replace("onToggleArchive={() => setIsArchiveOpen(!isArchiveOpen)}", "onToggleProfile={() => setIsArchiveOpen(!isArchiveOpen)}")

# Replace DilemmaArchive usage
old_archive = """<DilemmaArchive 
        isOpen={isArchiveOpen} 
        onClose={() => setIsArchiveOpen(false)} 
        logs={logs} 
      />"""

new_archive = """<ProfileModal 
        isOpen={isArchiveOpen} 
        onClose={() => setIsArchiveOpen(false)} 
        logs={logs} 
        user={user}
        userProfile={userProfile}
        gameState={gameState}
      />"""

content = content.replace(old_archive, new_archive)

with open('src/App.tsx', 'w') as f:
    f.write(content)

