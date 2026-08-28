#!/bin/bash
cat << 'INNER_EOF' > src/components/QuestBoard.tsx
import React, { useState, useRef, useEffect } from 'react';
import { GameState } from '../types';
import { X, Lock, Play, CheckCircle, Sparkles, Loader2, Map as MapIcon, List } from 'lucide-react';
import { Scenario } from '../data/scenarioData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onStartQuest: (questId: number) => void;
  onGenerateAIQuest: () => Promise<void>;
}

export function QuestBoard({ isOpen, onClose, gameState, onStartQuest, onGenerateAIQuest }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [currentPage, setCurrentPage] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(gameState.quests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuests = gameState.quests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (isOpen && viewMode === 'map' && scrollContainerRef.current) {
      const activeIndex = paginatedQuests.findIndex(q => q.status === 'available');
      if (activeIndex !== -1) {
        const pos = getQuestPosition(activeIndex);
        scrollContainerRef.current.scrollTo({
          top: Math.max(0, pos.y - scrollContainerRef.current.clientHeight / 2),
          behavior: 'smooth'
        });
      }
    }
  }, [isOpen, viewMode, paginatedQuests]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    await onGenerateAIQuest();
    setIsGenerating(false);
  };

  const questsPerRow = 3;
  const rowHeight = 250;
  const totalRows = Math.ceil(paginatedQuests.length / questsPerRow);
  const totalMapHeight = Math.max(totalRows * rowHeight, 400);

  const getQuestPosition = (index: number) => {
    const row = Math.floor(index / questsPerRow);
    const col = index % questsPerRow;
    const isEvenRow = row % 2 === 0;
    const xProgress = isEvenRow ? col / (questsPerRow - 1) : 1 - (col / (questsPerRow - 1));
    
    return {
      x: 20 + (xProgress * 60), 
      y: 100 + (row * rowHeight)
    };
  };

  return (
    <div className={`fixed inset-y-0 left-0 w-full lg:w-3/4 bg-slate-900 border-r border-slate-800 shadow-2xl z-40 transform transition-transform duration-500 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-100 mb-1">
              Peta Konflik Sosial
            </h2>
            <p className="text-slate-400 text-sm font-mono">Status: {gameState.quests.filter(q=>q.status==='completed').length} / {gameState.quests.length} Misi Selesai</p>
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button 
                onClick={() => setViewMode('map')}
                className={`p-2 rounded flex items-center justify-center transition-colors ${viewMode === 'map' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                title="Tampilan Peta"
              >
                <MapIcon size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                title="Tampilan Daftar"
              >
                <List size={18} />
              </button>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Action Bar (Pagination + AI Kasus) */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 disabled:opacity-50 font-bold text-sm"
            >
              Prev
            </button>
            <span className="text-slate-400 text-sm font-mono px-3">
              Hal {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 disabled:opacity-50 font-bold text-sm"
            >
              Next
            </button>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-900/50 hover:bg-indigo-800 text-indigo-300 border border-indigo-700/50 rounded-lg text-sm font-bold transition-all hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Kasus AI Baru
          </button>
        </div>

        {/* Content Area */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent bg-slate-950">
          
          {viewMode === 'map' ? (
            <div className="relative w-full" style={{ height: `${totalMapHeight}px` }}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
              
              <svg className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: `${totalMapHeight}px` }}>
                {paginatedQuests.map((quest, i) => {
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
                      stroke={isCompletedOrAvailable ? '#10b981' : '#334155'}
                      strokeWidth={isCompletedOrAvailable ? "4" : "2"}
                      strokeDasharray={isCompletedOrAvailable ? "none" : "8 8"}
                      className="transition-colors duration-500"
                    />
                  );
                })}
              </svg>

              {paginatedQuests.map((quest, i) => {
                const isLocked = quest.status === 'locked';
                const isCompleted = quest.status === 'completed';
                const isAvailable = quest.status === 'available';
                const pos = getQuestPosition(i);

                return (
                  <div 
                    key={`node-${quest.id}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10 w-[200px]"
                    style={{ left: `${pos.x}%`, top: `${pos.y}px` }}
                    onClick={() => !isLocked && onStartQuest(quest.id)}
                  >
                    <div className={`
                      w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-xl
                      ${isLocked ? 'bg-slate-900 border-slate-700 text-slate-600 grayscale' : ''}
                      ${isAvailable ? 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse-slow' : ''}
                      ${isCompleted ? 'bg-emerald-500 border-emerald-300 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]' : ''}
                    `}>
                      {isLocked ? <Lock size={20} /> : isCompleted ? <CheckCircle size={28} /> : <Play size={24} className="ml-1" />}
                    </div>
                    
                    <div className={`
                      mt-3 p-3 rounded-xl border w-full text-center shadow-xl transition-all duration-300
                      ${isLocked ? 'bg-slate-900/80 border-slate-800 opacity-60' : 'bg-slate-800/90 border-slate-600 group-hover:border-emerald-500 backdrop-blur-md'}
                    `}>
                      <div className="text-[10px] font-mono font-bold text-emerald-400 mb-1 uppercase tracking-widest">{quest.lokasi}</div>
                      <h3 className={`text-sm font-bold line-clamp-2 ${isLocked ? 'text-slate-400' : 'text-slate-100'}`}>
                        {quest.judul_konflik}
                      </h3>
                      {isCompleted && (
                        <div className="mt-2 text-[10px] text-slate-400 italic">Lihat Review</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedQuests.map((quest) => {
                  const isLocked = quest.status === 'locked';
                  const isCompleted = quest.status === 'completed';
                  const isAvailable = quest.status === 'available';

                  return (
                    <div 
                      key={quest.id}
                      className={`
                        relative rounded-xl border p-5 flex flex-col transition-all duration-300
                        ${isLocked ? 'bg-slate-900 border-slate-800 opacity-50 grayscale' : ''}
                        ${isAvailable ? 'bg-slate-800 border-slate-600 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:-translate-y-1' : ''}
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

                      <div className="bg-slate-950/50 rounded-lg p-3 mb-4 border border-slate-800 flex justify-between items-center text-xs">
                        <div className="text-amber-400 font-bold">+ Rp {quest.reward_qris?.toLocaleString('id-ID') || 0}</div>
                        <div className="text-red-400 font-bold">- {quest.cost_energi || 0} Energi</div>
                      </div>

                      <button
                        onClick={() => !isLocked && onStartQuest(quest.id)}
                        disabled={isLocked}
                        className={`
                          w-full py-3 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors
                          ${isLocked ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : ''}
                          ${isAvailable ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : ''}
                          ${isCompleted ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-900' : ''}
                        `}
                      >
                        {isLocked ? (
                          <>Terkunci</>
                        ) : isCompleted ? (
                          <>Lihat Hasil Evaluasi</>
                        ) : (
                          <><Play size={14} /> Mulai Misi</>
                        )}
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
INNER_EOF
bash fix_quest_board.sh