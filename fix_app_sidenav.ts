import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Replace imports
content = content.replace(
  /import \{ BottomDock \} from '\.\/components\/BottomDock';/g,
  "import { SideNav } from './components/SideNav';"
);

// 2. Replace BottomDock with SideNav and remove mb-4 wrapper if possible
content = content.replace(
  /<div className="mb-4">\s*<BottomDock\s+onOpenMap=\{\(\) => setIsSideQuestsOpen\(true\)\}\s+onOpenInventory=\{\(\) => setIsDashboardOpen\(true\)\}\s+onOpenTahfidz=\{\(\) => setIsTahfidzOpen\(true\)\}\s+onOpenChat=\{\(\) => setIsChatOpen\(true\)\}\s+\/>\s*<\/div>/,
  `<SideNav 
                  onOpenMap={() => setIsSideQuestsOpen(true)}
                  onOpenInventory={() => setIsDashboardOpen(true)}
                  onOpenTahfidz={() => setIsTahfidzOpen(true)}
                  onOpenChat={() => setIsChatOpen(true)}
                />`
);

// 3. Just in case it wasn't wrapped in mb-4
content = content.replace(
  /<BottomDock /g,
  "<SideNav "
);

// 4. Update saveToFirebase to ensure it's fully background
content = content.replace(
  /const saveToFirebase = async \(newState: GameState, newLogs: StoryLog\[\]\) => \{([\s\S]*?)try \{ await setDoc\(doc\(db, 'saves', user\.uid\), \{ uid: user\.uid, displayName: user\.displayName \|\| user\.email\?\.split\('@'\)\[0\] \|\| "Anonim", email: user\.email, gameState: newState, logs: newLogs, lastUpdated: serverTimestamp\(\) \}, \{ merge: true \}\); \} catch \(error\) \{\}([\s\S]*?)\};/,
  `const saveToFirebase = (newState: GameState, newLogs: StoryLog[]) => {
    if (!user) return;
    // Optimistic UI Update: Jalankan setDoc di background tanpa memblokir thread
    setDoc(doc(db, 'saves', user.uid), { 
      uid: user.uid, 
      displayName: user.displayName || user.email?.split('@')[0] || "Anonim", 
      email: user.email, 
      gameState: newState, 
      logs: newLogs, 
      lastUpdated: serverTimestamp() 
    }, { merge: true }).catch(console.error);
  };`
);

fs.writeFileSync('src/App.tsx', content);
