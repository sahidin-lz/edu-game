import React, { useState, useEffect } from 'react';
import { BookOpen, MapIcon } from 'lucide-react';
// IMPORT BARU KITA
import { TopHUD } from './components/TopHUD';
import { BottomDock } from './components/BottomDock';

import { StoryLogView } from './components/StoryLogView';
import { ActionInput } from './components/ActionInput';
import { ProfileModal } from './components/ProfileModal';
import { Dashboard } from './components/Dashboard';
import { QuestBoard } from './components/QuestBoard';
import { CertificateView } from './components/CertificateView';
import { DashboardGuru } from './components/DashboardGuru';
import { GameState, StoryLog, EvaluationResult } from './types';
import { audioEngine } from './lib/audio';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { scenarioBank } from './data/scenarioData';
import { ChatWidget } from './components/ChatWidget';
import { MiniGameTahfidz } from './components/MiniGameTahfidz';
import { LandingPage } from './components/LandingPage';
import { AvatarSelection } from './components/AvatarSelection';
import { WelcomePopup } from './components/WelcomePopup';
import { MissionResultPopup } from './components/MissionResultPopup';

const INITIAL_STATE: GameState = {
  energi: 100,
  maxEnergi: 100,
  uang_qris: 150000,
  hifdz: 50,
  faham: 50,
  ukhuwah: 50,
  ketegangan_sosial: 40,
  locationContext: `Basecamp Kafilah - Bersiap untuk perjalanan.`,
  status_kota: "Aman",
  equipment: { alasKaki: null, pakaian: null },
  currentScenarioIndex: 0,
  quests: scenarioBank
};

const getAppBackgroundClass = (status: string) => {
  switch (status) {
    case 'Aman': case 'Harmonis': return 'bg-emerald-950';
    case 'Kacau': return 'bg-orange-950';
    case 'Kritis': return 'bg-red-950';
    case 'Tamat': return 'bg-indigo-950';
    case 'Waspada': default: return 'bg-slate-950';
  }
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [logs, setLogs] = useState<StoryLog[]>([{ id: '1', type: 'narrative', content: INITIAL_STATE.locationContext }]);
  const [loading, setLoading] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isSideQuestsOpen, setIsSideQuestsOpen] = useState(false);
  const [isDashboardGuruOpen, setIsDashboardGuruOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isTahfidzOpen, setIsTahfidzOpen] = useState(false);
  const [showAyatHint, setShowAyatHint] = useState(false);
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [missionResult, setMissionResult] = useState<EvaluationResult | null>(null);
  const [saranIlahi, setSaranIlahi] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const handleSelectAvatar = (avatarId: string) => {
    setGameState(prev => {
      const newState = { ...prev, avatarId, playerName: userProfile?.displayName || "Siswa" };
      saveToFirebase(newState, logs);
      return newState;
    });
    setShowAvatarSelection(false);
    setShowWelcomePopup(true);
  };

  const handleCloseWelcome = () => {
    setShowWelcomePopup(false);
    if (userProfile?.role === 'STUDENT') setIsSideQuestsOpen(true);
  };

  const handleEquip = (type: 'alasKaki' | 'pakaian', itemId: string) => {
    import('./data/items').then(({ INVENTORY_ITEMS }) => {
      const item = INVENTORY_ITEMS.find(i => i.id === itemId);
      if (item) {
        setGameState(prev => {
          const newState = { ...prev, equipment: { ...prev.equipment, [type]: itemId } };
          if (item.effect.maxEnergi) {
            newState.maxEnergi = (newState.maxEnergi || 100) + item.effect.maxEnergi;
            newState.energi = Math.min(newState.energi + item.effect.maxEnergi, newState.maxEnergi);
          }
          if (item.effect.ukhuwah) newState.ukhuwah = Math.min(100, newState.ukhuwah + item.effect.ukhuwah);
          if (item.effect.faham) newState.faham = Math.min(100, newState.faham + item.effect.faham);
          saveToFirebase(newState, logs);
          return newState;
        });
      }
    });
  };

  const handleBuy = (itemId: string) => {
    import('./data/items').then(({ SHOP_ITEMS }) => {
      const item = SHOP_ITEMS.find(i => i.id === itemId);
      if (item && gameState.uang_qris >= item.price) {
        setGameState(prev => {
          const newState = {
            ...prev,
            uang_qris: Math.max(0, prev.uang_qris - item.price),
            energi: Math.min(prev.maxEnergi || 100, prev.energi + (item.effect.energi || 0)),
            ukhuwah: Math.min(100, prev.ukhuwah + (item.effect.ukhuwah || 0))
          };
          saveToFirebase(newState, logs);
          return newState;
        });
      }
    });
  };

  const handleCompleteTahfidz = (bonusHifdz: number, costEnergi: number) => {
    setGameState(prev => {
      const newState = { ...prev, hifdz: Math.min(100, prev.hifdz + bonusHifdz), energi: Math.max(0, prev.energi - costEnergi) };
      const newLog: StoryLog = { id: Date.now().toString(), type: 'narrative', content: `Berhasil menyelesaikan Murojaah. Mendapat bonus Hifdz +${bonusHifdz}.` };
      const newLogs = [...logs, newLog];
      setLogs(newLogs);
      saveToFirebase(newState, newLogs);
      return newState;
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        let role = 'STUDENT';
        const adminEmails = ['sahidin30@gmail.com', 'sahidi30@gmail.com'];
        if (currentUser.email && adminEmails.includes(currentUser.email.toLowerCase())) {
          role = 'ADMIN';
        } else {
          try {
            if (currentUser.email) {
              const adminDoc = await getDoc(doc(db, "admins", currentUser.email));
              if (adminDoc.exists()) role = 'ADMIN';
            }
          } catch (e) { console.error(e); }
        }
        
        const profile = { uid: currentUser.uid, displayName: currentUser.displayName, email: currentUser.email, photoURL: currentUser.photoURL, role: role, lastActiveAt: serverTimestamp() };
        setUserProfile(profile);
        if (role === 'ADMIN') setIsDashboardGuruOpen(true);

        try {
          const docRef = doc(db, 'saves', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.gameState) {
              setGameState(data.gameState as GameState);
              if (!(data.gameState as GameState).avatarId && role === 'STUDENT') setShowAvatarSelection(true);
              else if (role === 'STUDENT') setShowWelcomePopup(true);
            }
            if (data.logs) setLogs(data.logs as StoryLog[]);
          } else {
            await setDoc(docRef, { uid: currentUser.uid, displayName: currentUser.displayName || currentUser.email?.split('@')[0] || "Anonim", email: currentUser.email, createdAt: serverTimestamp(), lastUpdated: serverTimestamp(), gameState: INITIAL_STATE, logs: logs });
            if (role === 'STUDENT') setShowAvatarSelection(true);
          }
        } catch (error) { console.error(error); }
        
        try { await setDoc(doc(db, 'users', currentUser.uid), profile, { merge: true }); } catch (error) {}
      } else {
        setUserProfile(null);
        setGameState(INITIAL_STATE);
        setLogs([{ id: '1', type: 'narrative', content: INITIAL_STATE.locationContext }]);
        setIsDashboardGuruOpen(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/p2p`;
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'saran-ilahi') {
          const userName = user.displayName || user.email?.split('@')[0] || '';
          if (data.target === 'all' || userName.toLowerCase().includes(data.target.toLowerCase()) || data.target.toLowerCase().includes(userName.toLowerCase())) {
            setSaranIlahi(data.text);
          }
        }
      } catch(e) {}
    };
    return () => ws.close();
  }, [user]);

  const saveToFirebase = async (newState: GameState, newLogs: StoryLog[]) => {
    if (!user) return;
    try { await setDoc(doc(db, 'saves', user.uid), { uid: user.uid, displayName: user.displayName || user.email?.split('@')[0] || "Anonim", email: user.email, gameState: newState, logs: newLogs, lastUpdated: serverTimestamp() }, { merge: true }); } catch (error) {}
  };

  const handleResetData = async () => {
    if (!user) return;
    if (window.confirm("Apakah Anda yakin ingin menghapus semua progres game Anda dan mengulang dari awal?")) {
      try { await deleteDoc(doc(db, 'saves', user.uid)); await deleteDoc(doc(db, 'users', user.uid)); window.location.reload(); } catch (error) { alert("Gagal menghapus data."); }
    }
  };

  const handleActionSubmit = async (actionText: string, inputType: 'teks_esai' | 'suara_orasi') => {
    audioEngine.init();
    const actionLog: StoryLog = { id: Date.now().toString() + '-action', type: 'player_action', content: actionText, inputType };
    const newLogsWithAction = [...logs, actionLog];
    setLogs(newLogsWithAction);
    setLoading(true);

    try {
      const response = await fetch('/api/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state: gameState, action: actionText, inputType }) });
      if (!response.ok) throw new Error('Gagal mendapatkan respon dari Dosen Kehidupan.');
      const result: EvaluationResult = await response.json();

      if (user) {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${protocol}//${window.location.host}/ws/p2p`);
        ws.onopen = () => {
          ws.send(JSON.stringify({ type: 'game-action', id: Date.now().toString(), waktu: new Date().toLocaleTimeString(), nama: user.email?.split('@')[0] || 'Siswa', aksi: `Mengirim aksi: "${actionText}"`, skor_ai: result.perubahan_status.ketegangan_sosial_kota < 0 ? '+90' : '-30', time: Date.now(), text: `Siswa "${user.email?.split('@')[0]}" mengirim keputusan: ${actionText}` }));
          setTimeout(() => ws.close(), 1000);
        };
      }

      if (result.perubahan_status.ketegangan_sosial_kota > 0 || result.perubahan_status.ukhuwah < 0) {
        audioEngine.playNegative();
        if (result.perubahan_status.ketegangan_sosial_kota > 0) { setAnimationClass('animate-shake animate-flash-red'); setTimeout(() => setAnimationClass(''), 600); }
      } else {
        audioEngine.playPositive();
        if (result.perubahan_status.ketegangan_sosial_kota < 0) { setAnimationClass('animate-flash-green'); setTimeout(() => setAnimationClass(''), 600); }
      }

      let updatedQuests = [...gameState.quests];
      let rewardQris = 0;
      if (result.status_kota === 'Aman' || result.status_kota === 'Harmonis') {
        const currentQuest = updatedQuests[gameState.currentScenarioIndex];
        if (currentQuest) {
          updatedQuests[gameState.currentScenarioIndex] = { ...currentQuest, status: 'completed' };
          rewardQris = currentQuest.reward_qris || 0;
          if (currentQuest.kategori === 'Main Quest') {
            const nextMainQuestIndex = updatedQuests.findIndex((q, i) => i > gameState.currentScenarioIndex && q.kategori === 'Main Quest');
            if (nextMainQuestIndex !== -1) updatedQuests[nextMainQuestIndex] = { ...updatedQuests[nextMainQuestIndex], status: 'available' };
            else result.status_kota = "Tamat";
          }
        }
      }

      const newState = {
        ...gameState,
        energi: Math.max(0, Math.min(100, gameState.energi + result.perubahan_status.energi)),
        uang_qris: Math.max(0, gameState.uang_qris + result.perubahan_status.uang_qris + rewardQris),
        hifdz: Math.max(0, Math.min(100, gameState.hifdz + result.perubahan_status.hifdz)),
        faham: Math.max(0, Math.min(100, gameState.faham + result.perubahan_status.faham)),
        ukhuwah: Math.max(0, Math.min(100, gameState.ukhuwah + result.perubahan_status.ukhuwah)),
        ketegangan_sosial: Math.max(0, Math.min(100, gameState.ketegangan_sosial + result.perubahan_status.ketegangan_sosial_kota)),
        locationContext: result.narasi_rpg.cerita_konsekuensi,
        status_kota: result.status_kota,
        quests: updatedQuests
      };
      
      setGameState(newState);

      const evalLog: StoryLog = { id: Date.now().toString() + '-eval', type: 'evaluation', content: '', evaluation: result };
      const narrativeLog: StoryLog = { id: Date.now().toString() + '-narrative', type: 'narrative', content: result.narasi_rpg.cerita_konsekuensi };
      const finalLogs = [...newLogsWithAction, evalLog, narrativeLog];
      
      setLogs(finalLogs);
      saveToFirebase(newState, finalLogs);
      setMissionResult(result);

    } catch (error: any) {
      setLogs(prev => [...prev, { id: Date.now().toString() + '-error', type: 'narrative', content: error?.message || "Terjadi kesalahan API." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyFood = () => {
    if (gameState.uang_qris >= 15000 && gameState.energi < 100) {
      audioEngine.playPositive();
      setGameState(prev => {
        const newState = { ...prev, uang_qris: prev.uang_qris - 15000, energi: Math.min(100, prev.energi + 20) };
        const newLogs = [...logs, { id: Date.now().toString() + '-buy', type: 'narrative', content: 'Membeli makanan (-Rp 15.000, +20 Energi).' } as StoryLog];
        setLogs(newLogs); saveToFirebase(newState, newLogs);
        return newState;
      });
    }
  };

  const handleWriteArticle = () => {
    if (gameState.energi >= 10) {
      audioEngine.playPositive();
      const earned = Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000;
      setGameState(prev => {
        const newState = { ...prev, energi: prev.energi - 10, uang_qris: prev.uang_qris + earned };
        const newLogs = [...logs, { id: Date.now().toString() + '-write', type: 'narrative', content: `Menulis artikel Sosiologi (-10 Energi, +Rp ${earned.toLocaleString('id-ID')}).` } as StoryLog];
        setLogs(newLogs); saveToFirebase(newState, newLogs);
        return newState;
      });
    }
  };

  const handleStartQuest = (questId: number) => {
    setShowAyatHint(false);
    const questIndex = gameState.quests.findIndex(q => q.id === questId);
    if (questIndex === -1) return;
    const quest = gameState.quests[questIndex];
    if (gameState.currentScenarioIndex === questIndex && gameState.status_kota === "Waspada") { setIsSideQuestsOpen(false); return; }
    if (gameState.energi < (quest.cost_energi || 0)) { alert("Energi tidak cukup!"); return; }
    
    setAnimationClass('animate-in fade-in duration-1000');
    setTimeout(() => setAnimationClass(''), 1000);
    
    setGameState(prev => {
      let fullContext = `[${quest.lokasi}] ${quest.deskripsi}`;
      if (quest.ayat_arab && quest.ayat_terjemahan) fullContext += `\n\n**Ayat Rujukan (${quest.ayat_rujukan}):**\n${quest.ayat_arab}\n*"${quest.ayat_terjemahan}"*`;
      const newState = { ...prev, energi: prev.energi - (quest.cost_energi || 0), currentScenarioIndex: questIndex, status_kota: "Waspada", locationContext: fullContext };
      const newLogs = [...logs, { id: Date.now().toString() + '-start', type: 'narrative', content: `**MEMULAI MISI: ${quest.judul_konflik}**\n\n${fullContext}` } as StoryLog];
      setLogs(newLogs); saveToFirebase(newState, newLogs);
      return newState;
    });
    setIsSideQuestsOpen(false); 
  };

  const handleGenerateAIQuest = async () => {
    try {
      const response = await fetch('/api/gemini/generate-quest', { method: 'POST' });
      if (!response.ok) throw new Error('Gagal memuat misi');
      const newQuest = await response.json();
      setGameState(prev => { const newState = { ...prev, quests: [...prev.quests, newQuest] }; saveToFirebase(newState, logs); return newState; });
    } catch (err) { alert('Gagal membuat misi baru.'); }
  };

  if (!user) return <LandingPage />;
  if (userProfile?.role === 'ADMIN') return <DashboardGuru isOpen={true} onClose={() => {}} />;

  const isAtBasecamp = logs.length <= 1 && gameState.status_kota === 'Aman' && gameState.currentScenarioIndex === 0;
  const activeQuest = gameState.quests[gameState.currentScenarioIndex];
  const isIdle = gameState.status_kota === 'Aman' || gameState.status_kota === 'Harmonis';

  return (
    <div className={`flex flex-col h-screen ${getAppBackgroundClass(gameState.status_kota)} text-slate-200 overflow-hidden font-sans relative ${animationClass}`}>
      
      {/* 1. TOP HUD SELALU ADA */}
      <TopHUD 
        state={gameState} 
        userProfile={userProfile} 
        onOpenProfile={() => setIsArchiveOpen(true)}
        onOpenAdmin={() => setIsDashboardGuruOpen(true)}
      />

      {isAtBasecamp ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 pt-20 animate-in zoom-in duration-700 relative z-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
          <div className="bg-slate-900/80 border-2 border-emerald-500/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] max-w-2xl w-full text-center z-10 backdrop-blur-md">
            <h2 className="text-3xl font-bold text-white mb-8 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Persiapan Petualangan
            </h2>
            <button
              onClick={() => handleStartQuest(gameState.quests[0].id)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105"
            >
               Mulai Petualangan Pertama
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 relative flex flex-col pt-20 overflow-hidden">
          
          {/* 2. AREA TENGAH (SCROLLABLE LOGS) */}
          <div className="flex-1 overflow-y-auto pb-48 relative">
            <StoryLogView logs={logs} loading={loading} />
            {gameState.status_kota === 'Tamat' && (
              <CertificateView user={user} userProfile={userProfile} gameState={gameState} onReset={handleResetData} />
            )}
          </div>

          {/* 3. AREA BAWAH (DOCK & INPUT ACTION) */}
          <div className="absolute bottom-0 left-0 w-full flex flex-col pointer-events-none z-30">
            
            {/* Navigasi Melayang (Selalu bisa diakses asalkan belum tamat) */}
            {gameState.status_kota !== 'Tamat' && (
              <div className="mb-4">
                <BottomDock 
                  onOpenMap={() => setIsSideQuestsOpen(true)}
                  onOpenInventory={() => setIsDashboardOpen(true)}
                  onOpenTahfidz={() => setIsTahfidzOpen(true)}
                  onOpenChat={() => setIsChatOpen(true)}
                />
              </div>
            )}

            {/* Jika sedang IDLE (Aman): Tampilkan Menu Transit */}
            {isIdle && gameState.status_kota !== 'Tamat' && (
              <div className="p-4 bg-slate-950/95 border-t border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col gap-3">
                <div className="flex gap-4 w-full max-w-2xl mx-auto">
                  <button onClick={handleBuyFood} disabled={gameState.uang_qris < 15000 || gameState.energi >= 100} className="flex-1 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-emerald-400 font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-50">
                    Makan (15k)
                  </button>
                  <button onClick={handleWriteArticle} disabled={gameState.energi < 10} className="flex-1 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-cyan-400 font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-50">
                    Tulis Artikel
                  </button>
                </div>
                <button onClick={() => setIsSideQuestsOpen(true)} className="w-full max-w-2xl mx-auto py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all">
                  <MapIcon size={18} /> Buka Peta Untuk Lanjut
                </button>
              </div>
            )}

            {/* Jika sedang KRISIS (Waspada): Tampilkan Form Input (Esai/Suara) */}
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
            )}
          </div>

        </div>
      )}
      
      {/* POPUPS & OVERLAYS */}
      {showAvatarSelection && <AvatarSelection onSelect={handleSelectAvatar} />}
      {showWelcomePopup && <WelcomePopup gameState={gameState} onContinue={handleCloseWelcome} />}
      {missionResult && <MissionResultPopup evaluation={missionResult} gameState={gameState} onClose={() => setMissionResult(null)} />}
      
      <ProfileModal isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} logs={logs} user={user} userProfile={userProfile} gameState={gameState} />
      <Dashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} gameState={gameState} onEquip={handleEquip} onBuy={handleBuy} onResetData={handleResetData} />
      <QuestBoard isOpen={isSideQuestsOpen} onClose={() => setIsSideQuestsOpen(false)} gameState={gameState} onStartQuest={handleStartQuest} onGenerateAIQuest={handleGenerateAIQuest} />
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <MiniGameTahfidz isOpen={isTahfidzOpen} onClose={() => setIsTahfidzOpen(false)} gameState={gameState} onComplete={handleCompleteTahfidz} />

      {saranIlahi && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-amber-950 border-2 border-amber-500 rounded-2xl max-w-lg w-full p-8 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-amber-400 mb-4 uppercase">Saran Dosen</h2>
            <p className="text-lg text-amber-100 mb-8">"{saranIlahi}"</p>
            <button onClick={() => setSaranIlahi(null)} className="px-8 py-3 bg-amber-600 text-white font-bold rounded-xl uppercase">Mengerti</button>
          </div>
        </div>
      )}
    </div>
  );
}
