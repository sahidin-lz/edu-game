import React from 'react';
import { Map, Package, BookOpen, Globe } from 'lucide-react';

interface Props {
  onOpenMap: () => void;
  onOpenInventory: () => void;
  onOpenTahfidz: () => void;
  onOpenChat: () => void;
}

export function BottomDock({ onOpenMap, onOpenInventory, onOpenTahfidz, onOpenChat }: Props) {
  const navItems = [
    { id: 'map', icon: <Map size={22} />, label: 'Peta Utama', color: 'text-amber-400', bg: 'hover:bg-amber-500/10 hover:border-amber-500/50', action: onOpenMap },
    { id: 'inv', icon: <Package size={22} />, label: 'Logistik', color: 'text-indigo-400', bg: 'hover:bg-indigo-500/10 hover:border-indigo-500/50', action: onOpenInventory },
    { id: 'quran', icon: <BookOpen size={22} />, label: 'Murojaah', color: 'text-emerald-400', bg: 'hover:bg-emerald-500/10 hover:border-emerald-500/50', action: onOpenTahfidz },
    { id: 'chat', icon: <Globe size={22} />, label: 'Sosial', color: 'text-blue-400', bg: 'hover:bg-blue-500/10 hover:border-blue-500/50', action: onOpenChat },
  ];

  return (
    <div className="mx-auto w-max pointer-events-auto z-40 mb-6">
      <div className="bg-slate-900/80 backdrop-blur-xl px-2 py-2 rounded-3xl border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center justify-center gap-1.5 w-20 h-20 rounded-2xl transition-all duration-300 group border border-transparent ${item.bg}`}
          >
            <div className={`transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 ${item.color}`}>
              {item.icon}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-widest text-slate-500 group-hover:${item.color} transition-colors`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
