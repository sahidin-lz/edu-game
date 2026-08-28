import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X, Lock, CheckCircle, Play, Sparkles, Loader2, Map as MapIcon, LayoutGrid } from 'lucide-react';
import { GameState } from '../types';
import { AVATARS, getCustomAvatarUrl } from '../data/avatars';

interface QuestBoardProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onStartQuest: (questId: number) => void;
  onGenerateAIQuest: () => void;
}

export function QuestBoard({ isOpen, onClose, gameState, onStartQuest, onGenerateAIQuest }: QuestBoardProps) {
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const avatar = AVATARS.find(a => a.id === gameState.avatarId) || AVATARS[0];

  useEffect(() => {
    if (isOpen && scrollContainerRef.current && viewMode === 'map') {
      const activeIndex = gameState.quests.findIndex(q => q.status === 'available');
      if (activeIndex !== -1) {
        const pos = getQuestPosition(activeIndex);
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
              top: Math.max(0, pos.y - scrollContainerRef.current.clientHeight / 2),
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    }
  }, [isOpen, viewMode, gameState.quests]);

  if (!isOpen) return null;

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    await onGenerateAIQuest();
    setIsGenerating(false);
  };

  
  const isCustom = gameState.avatarId?.startsWith('custom-');
  const customSeed = isCustom ? gameState.avatarId?.replace('custom-', '') : '';
  const avatarImg = isCustom 
    ? getCustomAvatarUrl(customSeed!) 
    : (AVATARS.find(a => a.id === gameState.avatarId)?.image || AVATARS[0].image);

  const getQuestPosition = (index: number) => {
    const ROW_HEIGHT = 200;
    const startY = 100;
    return {
      x: 50 + Math.sin(index * 1.5) * 30, // Zigzag pattern
      y: startY + (index * ROW_HEIGHT)
    };
  };

  const totalMapHeight = Math.max(800, (gameState.quests.length * 200) + 300);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-6xl h-[90vh] rounded-3xl flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-700">
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-amber-500 uppercase tracking-widest drop-shadow-md">PETA MISI</h2>
            <div className="flex gap-2 ml-4">
              <button 
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:bg-slate-800'}`}
              >
                <MapIcon size={20} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:bg-slate-800'}`}
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleGenerateClick} 
            disabled={isGenerating}
            className="hidden md:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 px-4 py-2 rounded-full font-bold text-sm border border-amber-500/30 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.2)] disabled:opacity-50"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Analisis Kasus Baru
          </button>
          
          <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent bg-slate-950">
          
          {viewMode === 'map' ? (
            <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" style={{ height: `${totalMapHeight}px` }}>
              {/* Realistic Map Background */}
              <div className="absolute inset-0 z-0">
                <div 
                  className="absolute inset-0 opacity-40 mix-blend-luminosity"
                  style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'contrast(1.2) grayscale(0.8)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
                <div className="absolute inset-0 opacity-30" 
                     style={{ 
                       backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 20%, #020617 100%), repeating-linear-gradient(rgba(15, 23, 42, 0.5) 0px, rgba(15, 23, 42, 0.5) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(15, 23, 42, 0.5) 0px, rgba(15, 23, 42, 0.5) 1px, transparent 1px, transparent 40px)',
                     }}>
                </div>
              </div>

              
              {/* SVG Connecting Lines */}
              <svg className="absolute top-0 left-0 w-full pointer-events-none z-0" style={{ height: `${totalMapHeight}px` }}>
                {gameState.quests.map((quest, i) => {
                  if (i === 0) return null;
                  const prevPos = getQuestPosition(i - 1);
                  const currPos = getQuestPosition(i);
                  const isCompletedOrAvailable = quest.status !== 'locked';
                  
                  return (
                    <line 
                      key={`line-${i}`} 
                      x1={`${prevPos.x}%`} 
                      y1={prevPos.y} 
                      x2={`${currPos.x}%`} 
                      y2={currPos.y} 
                      stroke={isCompletedOrAvailable ? '#f59e0b' : '#334155'}
                      strokeWidth={isCompletedOrAvailable ? "4" : "2"}
                      strokeDasharray={isCompletedOrAvailable ? "none" : "8 8"}
                      className="transition-colors duration-500"
                    />
                  );
                })}
              </svg>

              {/* Map Nodes */}
              {gameState.quests.map((quest, i) => {
                const isLocked = quest.status === 'locked';
                const isCompleted = quest.status === 'completed';
                const isAvailable = quest.status === 'available';
                const pos = getQuestPosition(i);

                return (
                  <div 
                    key={`node-${quest.id}`}
                    className="absolute flex flex-col items-center group z-10 w-[240px] transition-transform duration-500"
                    style={{ 
                      left: `${pos.x}%`, 
                      top: `${pos.y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {/* Bouncing Avatar for Available Quest */}
                    {/* AVATAR TERBANG JIKA MISI AKTIF */}
                    {isAvailable && (
                      <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="absolute -top-20 z-20 cursor-pointer"
                        onClick={() => onStartQuest(quest.id)}
                      >
                        <div className="relative">
                          <img 
                            src={avatarImg} 
                            alt="Lokasi Pemain"
                            className="w-16 h-16 rounded-full border-4 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] bg-slate-800 object-cover"
                          />
                          {/* Segitiga penunjuk ala Pin Map */}
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-amber-400"></div>
                        </div>
                      </motion.div>
                    )}

                    {/* Node Circle */}
                    {/* Node Asli Peta */}
                    <div onClick={() => !isLocked && onStartQuest(quest.id)} className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${isLocked ? 'bg-slate-900 border-slate-700 text-slate-600' : isCompleted ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-amber-900 border-amber-500 text-amber-400 animate-pulse-slow'}`}>
                       {isLocked ? <Lock size={14} /> : isCompleted ? <CheckCircle size={16} /> : <div className="w-3 h-3 bg-amber-400 rounded-full animate-ping" />}
                    </div>
                    
                    {/* Card Info Below Node */}
                    <div className={`
                      mt-4 p-4 rounded-xl border w-full text-center shadow-xl transition-all duration-300
                      ${isLocked ? 'bg-slate-900/80 border-slate-800 opacity-60' : 'bg-slate-800/95 border-slate-600 group-hover:border-amber-500 backdrop-blur-md'}
                    `}>
                      <div className="text-[10px] font-mono font-bold text-amber-500 mb-1 uppercase tracking-widest">{quest.lokasi}</div>
                      <h3 className={`text-sm font-bold line-clamp-2 ${isLocked ? 'text-slate-400' : 'text-slate-100'}`}>
                        {quest.judul_konflik}
                      </h3>
                      {isAvailable && (
                        <button 
                          onClick={() => onStartQuest(quest.id)}
                          className="mt-3 w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
                        >
                          Mulai Misi
                        </button>
                      )}
                      {isCompleted && (
                        <div className="mt-2 text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                          <CheckCircle size={12} /> Selesai
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Same grid view, skipped rewriting for brevity but keeping basic style */}
                {gameState.quests.map((quest) => {
                  const isLocked = quest.status === 'locked';
                  const isCompleted = quest.status === 'completed';
                  const isAvailable = quest.status === 'available';
                  return (
                    <div 
                      key={quest.id}
                      className={`
                        relative rounded-xl border p-5 flex flex-col transition-all duration-300
                        ${isLocked ? 'bg-slate-900 border-slate-800 opacity-50 grayscale' : ''}
                        ${isAvailable ? 'bg-slate-800 border-slate-600 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:-translate-y-1' : ''}
                        ${isCompleted ? 'bg-slate-900 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : ''}
                      `}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded 
                          ${quest.kategori === 'Main Quest' ? 'bg-amber-900/50 text-amber-400 border border-amber-700' : 'bg-blue-900/50 text-blue-400 border border-blue-700'}
                        `}>
                          {quest.kategori}
                        </span>
                        {isLocked && <Lock size={16} className="text-slate-500" />}
                        {isCompleted && <CheckCircle size={18} className="text-emerald-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-slate-400 mb-1 font-mono">{quest.lokasi}</div>
                        <h3 className="text-lg font-bold text-slate-100 mb-2 leading-tight">{quest.judul_konflik}</h3>
                        <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">{quest.deskripsi}</p>
                      </div>
                      <button
                        onClick={() => !isLocked && onStartQuest(quest.id)}
                        disabled={isLocked}
                        className={`
                          w-full py-3 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors
                          ${isLocked ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : ''}
                          ${isAvailable ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' : ''}
                          ${isCompleted ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-900' : ''}
                        `}
                      >
                        {isLocked ? <>Terkunci</> : isCompleted ? <>Lihat Hasil Evaluasi</> : <><Play size={14} /> Mulai Misi</>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
