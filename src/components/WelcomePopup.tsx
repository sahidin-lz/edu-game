import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AVATARS, getCustomAvatarUrl } from '../data/avatars';
import { GameState } from '../types';

interface WelcomePopupProps {
  gameState: GameState;
  onContinue: () => void;
}

export function WelcomePopup({ gameState, onContinue }: WelcomePopupProps) {
  
  const isCustom = gameState.avatarId?.startsWith('custom-');
  const customSeed = isCustom ? gameState.avatarId?.replace('custom-', '') : '';
  const customImage = isCustom ? getCustomAvatarUrl(customSeed!) : '';
  
  const avatar = isCustom ? { name: gameState.playerName || 'Siswa', image: customImage } : (AVATARS.find(a => a.id === gameState.avatarId) || AVATARS[0]);

  
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, rotate: -15, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
        className="relative z-10 w-48 h-48 md:w-64 md:h-64 mb-8"
      >
        <img 
          src={avatar.image} 
          alt={avatar.name}
          className="w-full h-full rounded-full border-8 border-amber-500 bg-slate-800 shadow-[0_0_50px_rgba(245,158,11,0.6)] object-cover"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -bottom-4 -right-4 bg-emerald-600 border-4 border-slate-900 w-16 h-16 rounded-full flex items-center justify-center font-black text-xl text-white shadow-lg"
        >
          Lv.{gameState.level || 1}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center z-10 mb-12"
      >
        <h2 className="text-xl md:text-2xl text-amber-400 font-bold uppercase tracking-widest mb-1">
          Selamat Datang Kembali,
        </h2>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-widest drop-shadow-lg mb-6">
          {gameState.playerName || "Pemain"}
        </h1>
        
        <div className="flex gap-4 justify-center">
          <div className="bg-slate-900 border border-slate-700 px-6 py-3 rounded-xl flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div className="text-left">
              <div className="text-xs text-slate-400 uppercase font-bold">Energi</div>
              <div className="text-lg text-emerald-400 font-bold">{gameState.energi} / {gameState.maxEnergi}</div>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-700 px-6 py-3 rounded-xl flex items-center gap-3">
            <span className="text-2xl">🪙</span>
            <div className="text-left">
              <div className="text-xs text-slate-400 uppercase font-bold">Uang QRIS</div>
              <div className="text-lg text-amber-400 font-bold">Rp {gameState.uang_qris.toLocaleString('id-ID')}</div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className="relative z-10 px-12 py-4 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-black text-2xl rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)] uppercase tracking-widest overflow-hidden group"
      >
        <motion.div 
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
        />
        <span className="relative z-10">Lanjutkan Misi</span>
      </motion.button>
    </div>
  );
}
