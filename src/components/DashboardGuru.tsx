import React, { useState, useEffect, useRef } from 'react';
import { Users, Brain, Heart, AlertTriangle, ScrollText, Activity, ShieldAlert, X, Eye, Ear, Megaphone, Send, Trash2, Download, LogOut } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { getAkademikPersona } from '../utils/persona';
import { Target, Map, User, GraduationCap, History } from 'lucide-react';
import { collection as firestoreCollection, query as firestoreQuery, onSnapshot as firestoreOnSnapshot, doc, deleteDoc } from 'firebase/firestore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardGuru({ isOpen, onClose }: Props) {
  const [chatLogs, setChatLogs] = useState<any[]>([]);
  const [gameActions, setGameActions] = useState<any[]>([]);
  const [activeCalls, setActiveCalls] = useState<Record<string, any>>({});
  const [saranText, setSaranText] = useState("");
  const [saranTarget, setSaranTarget] = useState("all");
  const [studentList, setStudentList] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const pcsRef = useRef<Record<string, RTCPeerConnection>>({});
  
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser || !isOpen) return;

    // Fetch students from Firestore 'saves' collection
    const q = firestoreQuery(firestoreCollection(db, "saves"));
    const unsubscribe = firestoreOnSnapshot(q, (snapshot) => {
      const students: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (currentUser?.email && data.email === currentUser.email) return; // Skip admin (self)
        
        const state = data.gameState || {};
        students.push({
          id: doc.id,
          nama: data.displayName || data.email?.split('@')[0] || "Anonim",
          email: data.email,
          avatarId: state.avatarId,
          sosiologi: state.faham || 0,
          akhlak: state.hifdz || 0, // Using hifdz for Akhlak
          uang: state.uang_qris || 0,
          energi: state.energi || 0,
          level: (state.currentScenarioIndex || 0) + 1,
          status: state.status_kota || "Aman",
          ukhuwah: state.ukhuwah || 0,
          logs: data.logs || [],
        });
      });
      setStudentList(students);
    });

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/p2p`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'chat') {
          setChatLogs(prev => [...prev, data.message].slice(-50));
        } else if (data.type === 'game-action') {
          setGameActions(prev => [data, ...prev].slice(0, 50));
        } else if (data.type === 'call-started') {
          setActiveCalls(prev => ({
            ...prev,
            [data.callerId]: data
          }));
        } else if (data.type === 'call-ended') {
          setActiveCalls(prev => {
            const copy = { ...prev };
            delete copy[data.callerId];
            return copy;
          });
        }
      } catch (err) {}
    };

    return () => {
      unsubscribe();
      ws.close();
    };
  }, [currentUser, isOpen]);

  const sendSaran = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saranText.trim() || !wsRef.current) return;
    
    wsRef.current.send(JSON.stringify({
      type: 'saran-ilahi',
      text: saranText,
      target: saranTarget
    }));
    
    setSaranText("");
    alert("Saran Ilahi terkirim!");
  };

  const handleWiretap = (call: any, intercept: boolean) => {
    alert(intercept ? "Mengaktifkan Intervensi Suara..." : "Memulai Penyadapan...");
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus data save game untuk siswa: ${name}? Ini akan menghapus semua progres mereka.`)) {
      try {
        await deleteDoc(doc(db, "saves", id));
        alert(`Data ${name} berhasil dihapus.`);
      } catch (error) {
        console.error("Gagal menghapus:", error);
        alert("Gagal menghapus user.");
      }
    }
  };

  const handleDownloadCSV = () => {
    if (studentList.length === 0) return;
    
    // Header
    let csv = 'Nama Siswa,Level,Sisa Uang (Rp),Energi,Skor Sosiologi (Faham),Skor Akhlak (Hifdz),Status Kota\n';
    
    // Data rows
    studentList.forEach(s => {
      csv += `"${s.nama}","${s.level}","${s.uang}","${s.energi}","${s.sosiologi}","${s.akhlak}","${s.status}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekap_siswa_alkahfi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 overflow-y-auto font-sans text-slate-200">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-900/50 border border-purple-500 rounded-full flex items-center justify-center text-purple-400">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-widest">God's Eye Dashboard</h1>
              <p className="text-xs text-slate-400 font-mono">Real-time Admin Monitor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleDownloadCSV}
              className="px-3 py-2 bg-emerald-900/50 hover:bg-emerald-800 border border-emerald-700 rounded-lg text-emerald-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
              title="Download Data Siswa (CSV)"
            >
              <Download size={16} /> Export CSV
            </button>
            <button 
              onClick={() => auth.signOut()}
              className="px-3 py-2 bg-red-900/50 hover:bg-red-800 border border-red-700 rounded-lg text-red-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
              title="Keluar / Logout"
            >
              <LogOut size={16} /> Logout Admin
            </button>
          </div>
        </div>

        {/* TABEL REKAP & KONTROL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom Kiri: Tabel Analitik */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-800 bg-slate-900/80">
                <h2 className="text-sm font-bold text-emerald-400 tracking-widest uppercase flex items-center gap-2">
                  <Users size={16} /> Tabel Rekapitulasi Siswa
                </h2>
              </div>
              
              <div className="p-4 overflow-x-auto">
                {studentList.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Database kosong. Belum ada siswa yang mendaftar atau memulai petualangan.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="p-3 text-slate-400 uppercase font-bold text-xs tracking-wider">Nama Siswa</th>
                        <th className="p-3 text-slate-400 uppercase font-bold text-xs tracking-wider">Level</th>
                        <th className="p-3 text-slate-400 uppercase font-bold text-xs tracking-wider">Sisa Bekal</th>
                        <th className="p-3 text-slate-400 uppercase font-bold text-xs tracking-wider text-center">Skor Faham</th>
                        <th className="p-3 text-slate-400 uppercase font-bold text-xs tracking-wider text-center">Skor Hifdz</th>
                        <th className="p-3 text-slate-400 uppercase font-bold text-xs tracking-wider text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentList.map(s => (
                        <tr key={s.id} onClick={() => setSelectedStudent(s)} className="border-b border-slate-800/50 hover:bg-slate-800/50 cursor-pointer transition-colors">
                          <td className="p-3 font-semibold text-white">{s.nama}</td>
                          <td className="p-3 text-emerald-400 font-bold">Lvl {s.level}</td>
                          <td className="p-3">
                            <div className="text-amber-400 text-xs">Rp {s.uang.toLocaleString('id-ID')}</div>
                            <div className="text-cyan-400 text-xs">⚡ {s.energi}</div>
                          </td>
                          <td className="p-3 text-center">
                            <span className="bg-blue-900/40 border border-blue-700/50 text-blue-400 px-2 py-1 rounded text-xs">{s.sosiologi}</span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="bg-amber-900/40 border border-amber-700/50 text-amber-400 px-2 py-1 rounded text-xs">{s.akhlak}</span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteUser(s.id, s.nama)}
                              className="p-1.5 bg-red-950 hover:bg-red-900 text-red-400 hover:text-red-300 rounded border border-red-900/50 transition-colors tooltip"
                              title="Hapus Save Siswa"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Form Saran Ilahi */}
            <div className="bg-amber-950/20 border border-amber-900/50 rounded-xl shadow-lg p-5">
              <h2 className="text-sm font-bold text-amber-500 tracking-widest uppercase flex items-center gap-2 mb-4">
                <Megaphone size={16} /> Saran Ilahi (Direct Advice)
              </h2>
              <form onSubmit={sendSaran} className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <select 
                    value={saranTarget} 
                    onChange={e => setSaranTarget(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">Semua Siswa</option>
                    {studentList.map(s => (
                      <option key={s.id} value={s.nama}>{s.nama}</option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    value={saranText}
                    onChange={e => setSaranText(e.target.value)}
                    placeholder="Tulis pesan atau peringatan ilahi..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 placeholder-slate-500"
                  />
                  <button 
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors"
                  >
                    <Send size={14} /> Kirim
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Kolom Kanan: Live Monitoring */}
          <div className="lg:col-span-1 space-y-6">
            {/* Panel Panggilan Suara */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col min-h-[250px]">
              <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
                <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                  <Ear size={16} className="text-purple-400" /> Active Voice Calls
                </h2>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
              </div>
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-center">
                {Object.values(activeCalls).length === 0 ? (
                  <div className="text-center text-slate-500">
                    <Ear size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm italic">Listening...<br/>Tidak ada panggilan aktif.</p>
                  </div>
                ) : (
                  Object.values(activeCalls).map((call: any, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-sm text-white font-semibold">
                          {call.callerEmail.split('@')[0]} <span className="text-slate-500 mx-2">📞</span> {call.receiverEmail.split('@')[0]}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleWiretap(call, false)}
                          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-cyan-400 transition-colors tooltip"
                          title="Dengar Diam-diam"
                        >
                          <Ear size={16} />
                        </button>
                        <button 
                          onClick={() => handleWiretap(call, true)}
                          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-amber-400 transition-colors tooltip"
                          title="Intervensi Suara"
                        >
                          <Megaphone size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Global Chat Monitor */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-[400px]">
              <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
                <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                  <Activity size={16} className="text-blue-400" /> Global Chat Monitor
                </h2>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
                {chatLogs.length === 0 ? (
                  <div className="text-center text-slate-500 mt-20">
                    <Activity size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm italic">Listening...<br/>Belum ada obrolan masuk.</p>
                  </div>
                ) : (
                  chatLogs.map((log, i) => (
                    <div key={i} className="text-slate-300">
                      <span className="text-slate-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{" "}
                      <span className="text-blue-400 font-bold">{log.senderEmail.split('@')[0]}:</span>{" "}
                      <span className="text-slate-200">"{log.text}"</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
            
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border-2 border-emerald-500 flex items-center justify-center shrink-0">
                  <img 
                    src={selectedStudent.avatarId ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.avatarId}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.email}`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h2 className="font-bold text-lg tracking-widest uppercase text-emerald-400">{selectedStudent.nama}</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Level {selectedStudent.level} • {selectedStudent.status}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              
              {/* PROFIL AKADEMIK / PERSONA */}
              <div className="bg-slate-950/80 border border-slate-700 rounded-xl p-5 mb-8 shadow-inner">
                <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 flex items-center gap-2 mb-4">
                  <Target size={14} className="text-amber-400" /> Profil Akademik Siswa
                </h3>
                
                {(() => {
                  const persona = getAkademikPersona(selectedStudent.sosiologi, selectedStudent.akhlak, selectedStudent.ukhuwah);
                  return (
                    <div className="text-center mb-6">
                      <h1 className={`text-2xl font-black uppercase tracking-widest ${persona.color} mb-2`}>{persona.title}</h1>
                      <p className="text-xs text-slate-400 italic leading-relaxed">"{persona.desc}"</p>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Sosiologi (Faham)</div>
                    <div className="text-2xl font-black text-blue-400">{selectedStudent.sosiologi}</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Agama (Hifdz)</div>
                    <div className="text-2xl font-black text-emerald-400">{selectedStudent.akhlak}</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Sosial (Ukhuwah)</div>
                    <div className="text-2xl font-black text-indigo-400">{selectedStudent.ukhuwah}</div>
                  </div>
                </div>
              </div>

              {/* RIWAYAT LOGS */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs uppercase font-bold tracking-widest text-slate-300 flex items-center gap-2">
                  <History size={14} className="text-amber-400" /> Misi Diselesaikan
                </h3>
              </div>
              
              <div className="space-y-4">
                {(() => {
                  const dilemmas: any[] = [];
                  let currentDilemma: any = {};
                  (selectedStudent.logs || []).forEach((log: any) => {
                    if (log.type === 'narrative') {
                      if (currentDilemma.narrative) { dilemmas.push(currentDilemma); currentDilemma = {}; }
                      currentDilemma.narrative = log;
                    } else if (log.type === 'player_action') {
                      currentDilemma.action = log;
                    } else if (log.type === 'evaluation') {
                      currentDilemma.evaluation = log;
                      dilemmas.push(currentDilemma);
                      currentDilemma = {};
                    }
                  });
                  if (currentDilemma.narrative && !dilemmas.includes(currentDilemma)) dilemmas.push(currentDilemma);
                  const reversed = [...dilemmas].reverse();
                  
                  if (reversed.length === 0) return <div className="text-center py-4 opacity-50 text-slate-400 text-sm">Belum ada riwayat.</div>;
                  
                  return reversed.map((d, i) => (
                    <div key={i} className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                      {d.narrative && <p className="text-xs text-slate-300 italic mb-2 line-clamp-2">{d.narrative.content}</p>}
                      {d.action && <p className="text-xs text-blue-300 mb-2 border-l-2 border-blue-500 pl-2">Tindakan: "{d.action.content}"</p>}
                      {d.evaluation && (
                        <p className="text-[10px] text-emerald-400 bg-emerald-950/30 p-2 rounded">
                          Evaluasi: {d.evaluation.evaluation?.evaluasi?.saran_guru || 'Diselesaikan'}
                        </p>
                      )}
                    </div>
                  ));
                })()}
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
