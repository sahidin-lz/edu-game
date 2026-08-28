import React from 'react';
import { X, ShieldAlert, GraduationCap, User, LogOut, Map, History } from 'lucide-react';
import { StoryLog, GameState } from '../types';
import { auth } from '../lib/firebase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  logs: StoryLog[];
  user: any;
  userProfile: any;
  gameState: GameState;
}

export function ProfileModal({ isOpen, onClose, logs, user, userProfile, gameState }: Props) {
  // Group logs into Dilemmas
  const dilemmas: { narrative?: StoryLog; action?: StoryLog; evaluation?: StoryLog }[] = [];
  
  let currentDilemma: any = {};
  
  logs.forEach((log) => {
    if (log.type === 'narrative') {
      if (currentDilemma.narrative) {
        dilemmas.push(currentDilemma);
        currentDilemma = {};
      }
      currentDilemma.narrative = log;
    } else if (log.type === 'player_action') {
      currentDilemma.action = log;
    } else if (log.type === 'evaluation') {
      currentDilemma.evaluation = log;
      dilemmas.push(currentDilemma);
      currentDilemma = {};
    }
  });

  if (currentDilemma.narrative && !dilemmas.includes(currentDilemma)) {
    dilemmas.push(currentDilemma);
  }

  const reversedDilemmas = [...dilemmas].reverse();
  const name = userProfile?.displayName || user?.email?.split('@')[0] || "Anonim";

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border-2 border-emerald-500 flex items-center justify-center">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User size={20} className="text-slate-400" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-widest uppercase text-emerald-400">{name}</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Level {gameState.currentScenarioIndex + 1} • {userProfile?.role || 'STUDENT'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-300 flex items-center gap-2">
              <History size={14} className="text-amber-400" /> Jejak Perjalanan
            </h3>
            <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded-full border border-slate-800">
              {reversedDilemmas.length} Misi Selesai
            </span>
          </div>

          <div className="space-y-6">
            {reversedDilemmas.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <Map className="mx-auto mb-4 opacity-50 text-slate-500" size={32} />
                <p className="text-sm text-slate-400">Belum ada jejak perjalanan yang terekam.</p>
              </div>
            ) : (
              reversedDilemmas.map((dilemma, idx) => (
                <div key={idx} className="bg-slate-950/50 border border-slate-800 rounded-lg overflow-hidden flex flex-col relative group">
                  <div className="absolute top-0 left-0 w-1 bg-slate-700 h-full group-hover:bg-amber-500 transition-colors"></div>
                  
                  {dilemma.narrative && (
                    <div className="p-4 border-b border-slate-800">
                      <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                        <ShieldAlert size={12} /> Situasi
                      </h4>
                      <p className="text-sm text-slate-300 font-serif italic line-clamp-3 group-hover:line-clamp-none transition-all">
                        {dilemma.narrative.content}
                      </p>
                    </div>
                  )}

                  {dilemma.action && (
                    <div className="p-4 bg-slate-900 border-b border-slate-800">
                      <h4 className="text-[10px] uppercase font-bold tracking-widest text-blue-500 mb-2 flex items-center gap-2">
                        <User size={12} /> Tindakan & Keputusan
                      </h4>
                      <p className="text-sm text-blue-100">
                        "{dilemma.action.content}"
                      </p>
                    </div>
                  )}

                  {dilemma.evaluation?.evaluation && (
                    <div className="p-4 bg-emerald-950/20">
                      <h4 className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 mb-3 flex items-center gap-2">
                        <GraduationCap size={12} /> Konsekuensi & Evaluasi
                      </h4>
                      
                      <div className="flex gap-4 mb-3">
                        <div className="flex-1">
                          <span className="text-[10px] text-slate-500 uppercase block mb-1">Sos (Faham)</span>
                          <div className={`font-mono text-sm font-bold ${getScoreColor(dilemma.evaluation.evaluation.evaluasi?.skor_sosiologi || 0)}`}>
                            {dilemma.evaluation.evaluation.evaluasi?.skor_sosiologi || 0}
                          </div>
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] text-slate-500 uppercase block mb-1">Akhlak (Hifdz)</span>
                          <div className={`font-mono text-sm font-bold ${getScoreColor(dilemma.evaluation.evaluation.evaluasi?.skor_akhlak || 0)}`}>
                            {dilemma.evaluation.evaluation.evaluasi?.skor_akhlak || 0}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-emerald-200/80 leading-relaxed group-hover:line-clamp-none transition-all">
                        {dilemma.evaluation.evaluation.evaluasi?.saran_guru || "-"}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <button 
            onClick={() => auth.signOut()}
            className="w-full py-3 bg-red-950/30 hover:bg-red-900/50 text-red-400 font-bold rounded-lg transition-colors uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-red-900/50"
          >
            <LogOut size={14} /> Keluar / Logout
          </button>
        </div>
      </div>
    </>
  );
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-rose-500';
}
