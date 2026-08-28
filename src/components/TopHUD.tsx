import React from 'react';
import { Wallet, Brain, BookOpen, LogOut, ShieldAlert, AlertTriangle } from 'lucide-react';
import { GameState } from '../types';
import { auth } from '../lib/firebase';
import { LiveApiButton } from './LiveApiButton';

interface Props {
  state: GameState;
  userProfile: any;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
}

export function TopHUD({ state, userProfile, onOpenProfile, onOpenAdmin }: Props) {
  const avatarImg = state.avatarId 
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${state.avatarId}` 
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.email}`;

  const energiPercent = Math.min(100, (state.energi / (state.maxEnergi || 100)) * 100);

  return (
    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none z-50">
      
      {/* KIRI: Avatar, Nama, Level & Bar Energi */}
      <div 
        onClick={onOpenProfile}
        className="pointer-events-auto cursor-pointer flex items-center gap-3 bg-slate-900/80 backdrop-blur-md p-1.5 pr-4 rounded-full border border-slate-700 shadow-lg hover:bg-slate-800 transition-colors"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 bg-slate-800 shrink-0">
          <img src={avatarImg} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white uppercase tracking-widest text-[10px]">
            {state.playerName || userProfile?.displayName || 'Sosiolog'} <span className="text-emerald-400">(Lv.{state.currentScenarioIndex + 1})</span>
          </span>
          <div className="w-24 md:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div className="bg-yellow-400 h-full transition-all duration-500" style={{ width: `${energiPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* TENGAH: Indikator Ketegangan Kota (Muncul jika sedang krisis) */}
      {state.status_kota !== 'Aman' && state.status_kota !== 'Tamat' && (
        <div className="hidden md:flex pointer-events-auto items-center gap-2 bg-red-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-red-900/50 shadow-lg animate-pulse">
          <AlertTriangle size={14} className="text-red-500" />
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Krisis: {state.ketegangan_sosial}%</span>
        </div>
      )}

      {/* KANAN: Resource Poin & Settings */}
      <div className="pointer-events-auto flex items-center gap-2">
        <LiveApiButton />
        
        <div className="hidden md:flex bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700 shadow-lg overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-r border-slate-700 tooltip" title="Saldo QRIS">
            <Wallet size={12} className="text-emerald-400" /> <span className="text-[10px] font-bold text-white">{(state.uang_qris / 1000).toFixed(0)}k</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-r border-slate-700 tooltip" title="Poin Sosiologi (Faham)">
            <Brain size={12} className="text-blue-400" /> <span className="text-[10px] font-bold text-white">{state.faham}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 tooltip" title="Poin Akhlak (Hifdz)">
            <BookOpen size={12} className="text-amber-400" /> <span className="text-[10px] font-bold text-white">{state.hifdz}</span>
          </div>
        </div>

        <div className="flex gap-2 ml-2">
          {userProfile?.role === 'ADMIN' && (
            <button onClick={onOpenAdmin} className="p-2 bg-slate-900 border border-slate-700 text-pink-400 rounded-full hover:bg-slate-800 shadow-lg">
              <ShieldAlert size={14} />
            </button>
          )}
          <button onClick={() => auth.signOut()} className="p-2 bg-slate-900 border border-slate-700 text-slate-400 rounded-full hover:text-red-400 shadow-lg">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
