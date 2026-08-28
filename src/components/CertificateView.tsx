import React from 'react';
import { Download, RefreshCcw, Award } from 'lucide-react';
import { GameState } from '../types';

interface Props {
  user: any;
  userProfile: any;
  gameState: GameState;
  onReset: () => void;
}

export function CertificateView({ user, userProfile, gameState, onReset }: Props) {
  const handlePrint = () => {
    window.print();
  };

  const name = userProfile?.displayName || user?.email?.split('@')[0] || "Siswa Anonim";
  const date = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const avgScore = (gameState.faham + gameState.hifdz + gameState.ukhuwah) / 3;
  let predicate = "Sosiolog Pemula";
  if (avgScore >= 85) {
    predicate = "Sosiolog Muda Berakhlak Mulia";
  } else if (avgScore >= 70) {
    predicate = "Sosiolog Teladan Nusantara";
  }

  return (
    <div className="absolute inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 animate-in zoom-in duration-1000 overflow-y-auto">
      {/* Container for Print / Web View */}
      <div className="w-full max-w-4xl flex flex-col items-center mt-20 md:mt-0">
        
        {/* Certificate Card */}
        <div 
          id="certificate-card" 
          className="relative w-full bg-slate-50 text-slate-800 p-8 sm:p-12 md:p-16 border-[12px] border-double border-emerald-800 shadow-2xl print:shadow-none print:border-emerald-800"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}
        >
          {/* Watermark / Decorative */}
          <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
            <Award size={400} className="text-emerald-900" />
          </div>

          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-900 rounded-full flex items-center justify-center mb-6 shadow-lg print:border print:border-emerald-900">
              <Award size={40} className="text-amber-400" />
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-emerald-900 uppercase tracking-widest mb-2 font-serif">
              Sertifikat Penghargaan
            </h1>
            <p className="text-emerald-700 font-bold tracking-widest uppercase mb-10 text-sm sm:text-base">
              GAME AL KAHFI - Sosiologi Membumi
            </p>

            <p className="text-slate-600 mb-4 italic font-serif text-lg">
              Dengan bangga diberikan kepada:
            </p>

            <h2 className="text-3xl sm:text-5xl font-bold text-amber-600 mb-6 font-serif border-b-2 border-amber-300 pb-2 inline-block px-8 uppercase">
              {name}
            </h2>

            <p className="text-slate-700 max-w-2xl mx-auto leading-relaxed mb-8 text-sm sm:text-base font-medium">
              Atas dedikasi dan pencapaiannya dalam menyelesaikan seluruh misi perjalanan sosial di Nusantara, serta menunjukkan pemahaman sosiologis dan akhlak mulia.
            </p>

            <div className="w-full max-w-xl mx-auto bg-emerald-50/80 rounded-xl border border-emerald-200 p-6 mb-8 shadow-sm">
              <h3 className="text-emerald-900 font-bold uppercase tracking-widest text-sm mb-4 border-b border-emerald-200 pb-2">
                Predikat: <span className="text-amber-600">{predicate}</span>
              </h3>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-700 mb-1">{gameState.faham}</div>
                  <div className="text-[10px] uppercase font-bold text-emerald-600/70 tracking-widest">Sosiologi (Faham)</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-700 mb-1">{gameState.hifdz}</div>
                  <div className="text-[10px] uppercase font-bold text-emerald-600/70 tracking-widest">Akhlak (Hifdz)</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-700 mb-1">{gameState.ukhuwah}</div>
                  <div className="text-[10px] uppercase font-bold text-emerald-600/70 tracking-widest">Ukhuwah</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between w-full max-w-md mx-auto items-end mt-4">
              <div className="text-center">
                <div className="w-32 border-b border-slate-400 mb-2 mx-auto"></div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Instruktur</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-700 mb-2">{date}</p>
                <div className="w-32 border-b border-slate-400 mb-2 mx-auto"></div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tanggal</p>
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 print:hidden mb-20 md:mb-0">
          <button
            onClick={handlePrint}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-widest flex items-center justify-center gap-3"
          >
            <Download size={18} /> Unduh / Cetak
          </button>
          
          <button
            onClick={onReset}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl shadow-lg transition-all uppercase tracking-widest flex items-center justify-center gap-3 border border-slate-700"
          >
            <RefreshCcw size={18} /> Ulang dari Awal
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: landscape; margin: 0; }
          body * { visibility: hidden; }
          #certificate-card, #certificate-card * { visibility: visible; }
          #certificate-card { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100vw; 
            height: 100vh;
            border-width: 16px;
            box-sizing: border-box;
            background-color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
