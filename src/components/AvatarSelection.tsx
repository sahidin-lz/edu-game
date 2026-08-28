import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AVATARS, getCustomAvatarUrl } from '../data/avatars';

interface AvatarSelectionProps {
  onSelect: (avatarId: string, customImage?: string) => void;
}

export function AvatarSelection({ onSelect }: AvatarSelectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customSeed, setCustomSeed] = useState<string>('');

  const isCustom = selectedId === 'custom';
  const customImage = getCustomAvatarUrl(customSeed || 'User');

  const handleConfirm = () => {
    if (selectedId) {
      if (selectedId === 'custom') {
        // Encode custom seed into a fake ID format so we can render it later
        onSelect(`custom-${customSeed}`, customImage); 
      } else {
        onSelect(selectedId);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center p-4 md:p-8 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 mt-12"
      >
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
          Pilih Karaktermu
        </h1>
        <p className="text-slate-400 mt-2">Pilih atau buat sendiri avatar yang akan mewakili perjuanganmu di Nusantara.</p>
      </motion.div>

      <div className="w-full max-w-7xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Custom Avatar Slot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setSelectedId('custom')}
          className={`relative cursor-pointer rounded-2xl border-4 overflow-hidden transition-all duration-300 ${isCustom ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.5)] scale-105 z-10' : 'border-slate-800 hover:border-slate-600'}`}
        >
          <div className="bg-slate-900 p-4 flex flex-col items-center h-full text-center">
            <img src={customImage} alt="Custom" className="w-20 h-20 md:w-24 md:h-24 rounded-full mb-3 border-4 border-slate-800 bg-slate-800" />
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-2">Avatar Custom</h3>
            
            {isCustom ? (
              <input 
                type="text" 
                autoFocus
                placeholder="Ketik namamu..." 
                value={customSeed}
                onChange={(e) => setCustomSeed(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-slate-950 border border-amber-500/50 rounded p-2 text-xs text-center text-white focus:outline-none focus:border-amber-400"
              />
            ) : (
              <p className="text-[10px] text-slate-400">Buat karakter unikmu sendiri!</p>
            )}

            <AnimatePresence>
              {isCustom && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute top-2 right-2 text-amber-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 drop-shadow-md" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {AVATARS.map((avatar, index) => {
          const isSelected = selectedId === avatar.id;
          return (
            <motion.div
              key={avatar.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedId(avatar.id)}
              className={`relative cursor-pointer rounded-2xl border-4 overflow-hidden transition-all duration-300 ${isSelected ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.5)] scale-105 z-10' : 'border-slate-800 hover:border-slate-600 hover:scale-105'}`}
            >
              <div className="bg-slate-900 p-4 flex flex-col items-center h-full text-center justify-between">
                <div>
                  <img src={avatar.image} alt={avatar.name} className="w-20 h-20 md:w-24 md:h-24 rounded-full mb-3 border-4 border-slate-800 bg-slate-800 mx-auto" />
                  <h3 className="text-xs md:text-sm font-bold text-slate-100 uppercase tracking-widest mb-2 leading-tight">{avatar.name}</h3>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">{avatar.description}</p>
                
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute top-2 right-2 text-amber-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 drop-shadow-md" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: selectedId ? 1 : 0.5, y: 0 }}
        disabled={!selectedId}
        onClick={handleConfirm}
        className="mt-12 px-12 py-4 mb-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-black text-xl rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:shadow-none uppercase tracking-widest transition-all sticky bottom-4 z-50"
      >
        Konfirmasi
      </motion.button>
    </div>
  );
}
