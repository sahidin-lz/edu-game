import React from 'react';
import { motion } from 'motion/react';
import { Trophy, ArrowRight, BookOpen, Brain, ShieldAlert, Star } from 'lucide-react';
import { EvaluationResult, GameState } from '../types';

// Tambahkan gameState ke dalam Props agar kita bisa membaca Level saat ini
export function MissionResultPopup({ evaluation, gameState, onClose }: { evaluation: EvaluationResult, gameState: GameState, onClose: () => void }) {
  const isSuccess = evaluation.perubahan_status.ketegangan_sosial_kota < 0 && !evaluation.indikasi_curang;
  
  // Kalkulasi EXP realistis ala Game RPG
  const currentLevel = gameState.currentScenarioIndex + 1;
  const expGained = isSuccess ? (evaluation.evaluasi.skor_sosiologi + (evaluation.evaluasi.skor_akhlak || 0)) * 5 : 10;

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className={`w-full max-w-2xl rounded-3xl border-2 p-6 md:p-8 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden mt-10 md:mt-0 ${isSuccess ? 'bg-emerald-950/40 border-emerald-500' : 'bg-red-950/40 border-red-500'}`}
      >
        {/* PROGRESS BAR EXP (Animasi di atas kotak) */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800">
           <motion.div 
             initial={{ width: "0%" }} 
             animate={{ width: isSuccess ? "100%" : "30%" }} 
             transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
             className={`h-full ${isSuccess ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'bg-red-500'}`} 
           />
        </div>

        {/* HEADER: PERINGKAT & EXP */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <Star className="text-amber-400" size={20} fill="currentColor" />
             </div>
             <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Peringkat Sosiolog</div>
                <div className="text-lg font-black text-amber-400">LEVEL {currentLevel}</div>
             </div>
          </div>
          <div className="text-right">
             <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">EXP Diperoleh</div>
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="text-xl font-bold text-emerald-400">
               +{expGained} EXP
             </motion.div>
          </div>
        </div>

        {/* ICON KEMENANGAN */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
            className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 border-4 shadow-lg ${isSuccess ? 'bg-emerald-900 border-emerald-400 text-emerald-400' : 'bg-red-900 border-red-400 text-red-400'}`}
          >
            {isSuccess ? <Trophy size={40} /> : <ShieldAlert size={40} />}
          </motion.div>
          <h2 className={`text-3xl font-black uppercase tracking-widest ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
            {isSuccess ? 'Misi Berhasil' : 'Misi Gagal'}
          </h2>
          <p className="text-slate-300 mt-2 italic">"{evaluation.narasi_rpg.cerita_konsekuensi}"</p>
        </div>

        {/* GRID SKOR */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
            <Brain className="mx-auto text-blue-400 mb-2" size={24}/>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Sosiologi</div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }} className="text-4xl font-black text-white">
              {evaluation.evaluasi.skor_sosiologi}
            </motion.div>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
            <BookOpen className="mx-auto text-amber-400 mb-2" size={24}/>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Akhlak</div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: "spring" }} className="text-4xl font-black text-white">
              {evaluation.evaluasi.skor_akhlak || 0}
            </motion.div>
          </div>
        </div>

        {/* ANALISIS GURU */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 mb-8">
          <h4 className="text-xs text-emerald-400 uppercase tracking-widest font-bold mb-2">Evaluasi Dosen Kehidupan:</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{evaluation.evaluasi.saran_guru}</p>
        </div>

        {/* TOMBOL LANJUT (Tidak lagi membuka peta paksa) */}
        <button 
          onClick={onClose}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02]"
        >
          Lanjutkan Perjalanan <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
}
