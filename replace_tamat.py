import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Need to import CertificateView
if "import { CertificateView }" not in content:
    content = content.replace("import { DashboardGuru }", "import { CertificateView } from './components/CertificateView';\nimport { DashboardGuru }")

# Replace the previous tamat screen
old_tamat_screen = r"\{gameState\.status_kota === 'Tamat' && \(\s*<div className=\"absolute inset-0 z-40 bg-slate-950 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-1000\">.*?Ulang dari Awal\s*</button>\s*</div>\s*</div>\s*\)\}"

new_tamat_screen = """{gameState.status_kota === 'Tamat' && (
        <CertificateView 
          user={user} 
          userProfile={userProfile} 
          gameState={gameState} 
          onReset={() => {
            localStorage.removeItem('alkahfi_save_state');
            window.location.reload();
          }} 
        />
      )}"""

content = re.sub(old_tamat_screen, new_tamat_screen, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)

