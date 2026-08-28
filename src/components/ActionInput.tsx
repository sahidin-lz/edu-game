import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Type, Loader2, BookOpen, AlertTriangle, Sparkles } from 'lucide-react';

interface Props {
  onActionSubmit: (action: string, type: 'teks_esai' | 'suara_orasi') => void;
  disabled: boolean;
  locationContext?: string;
}

export function ActionInput({ onActionSubmit, disabled, locationContext }: Props) {
  const [text, setText] = useState('');
  const [inputType, setInputType] = useState<'teks_esai' | 'suara_orasi'>('teks_esai');
  const [isRecording, setIsRecording] = useState(false);
  const [groundingResult, setGroundingResult] = useState<string | null>(null);
  const [isGrounding, setIsGrounding] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'id-ID';
        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setText(currentTranscript.trim());
        };
        recognitionRef.current.onerror = () => setIsRecording(false);
        recognitionRef.current.onend = () => setIsRecording(false);
      } else {
        setIsSpeechSupported(false);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onActionSubmit(text, inputType);
    setText('');
    setGroundingResult(null);
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      alert("Browser Anda tidak mendukung fitur Suara. Gunakan mode Teks.");
      setInputType('teks_esai');
      return;
    }
    setText('');
    setInputType('suara_orasi');
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Lentera AI (Search Fakta & Dalil)
  const handleLenteraAI = async () => {
    if (!text.trim()) {
      alert("Tuliskan kata kunci di kotak teks (misal: 'konflik suku di indonesia' atau 'dalil tentang adil') sebelum menyalakan LENTERA AI!");
      return;
    }
    setIsGrounding(true);
    setGroundingResult("Lentera AI sedang mencari referensi dunia dan literatur Islam...");
    try {
      const res = await fetch('/api/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `Carikan fakta dunia/berita/literatur Islam ringkas tentang: ${text}`, type: 'search' })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGroundingResult(data.result);
    } catch (err: any) {
      setGroundingResult("Gagal mendapatkan referensi: " + err.message);
    } finally {
      setIsGrounding(false);
    }
  };

  return (
    <div className="w-full relative z-10 flex flex-col gap-3 p-4 pr-20 md:pr-28 bg-slate-950 border-t border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      
      {/* TOOLBAR ATAS (Mode & Lentera AI) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 max-w-5xl mx-auto w-full">
        
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setInputType('teks_esai')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all ${inputType === 'teks_esai' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Type size={14} /> Teks
          </button>
          <button
            type="button"
            onClick={() => isSpeechSupported && setInputType('suara_orasi')}
            disabled={!isSpeechSupported}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all ${!isSpeechSupported ? 'opacity-30 cursor-not-allowed' : inputType === 'suara_orasi' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Mic size={14} /> Suara
          </button>
        </div>

        <div className="flex items-center gap-3">
          
          
          {/* LENTERA AI BUTTON */}
          <button
            type="button"
            onClick={handleLenteraAI}
            disabled={disabled || isGrounding}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/30 text-amber-400 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)] disabled:opacity-50"
          >
            {isGrounding ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            LENTERA AI
          </button>
        </div>
      </div>

      {/* HASIL LENTERA AI */}
      {groundingResult && (
        <div className="max-w-5xl mx-auto w-full p-4 bg-slate-900 border border-amber-500/30 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-amber-500 h-full"></div>
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-amber-500 mb-2 flex items-center gap-2">
            <BookOpen size={14} /> Literasi LENTERA AI
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed font-serif">{groundingResult}</p>
          <button onClick={() => setGroundingResult(null)} className="absolute top-4 right-4 text-[10px] text-slate-500 font-bold uppercase hover:text-white transition-colors">Tutup</button>
        </div>
      )}

      {/* AREA INPUT UTAMA */}
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto w-full relative">
        {inputType === 'teks_esai' || !isSpeechSupported ? (
          <div className="relative group">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={disabled || isRecording}
              placeholder="Ketik argumen, solusi sosiologi, atau dalil pembelaan Anda di sini..."
              className="w-full bg-slate-900/80 border-2 border-slate-700 focus:border-emerald-500 rounded-2xl p-4 pr-32 text-slate-200 placeholder-slate-600 outline-none resize-none min-h-[100px] shadow-inner transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={disabled || !text.trim()}
              className="absolute bottom-3 right-3 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all uppercase text-[10px] font-bold tracking-widest"
            >
              {disabled ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Kirim
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-700">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={disabled}
              className={`p-6 rounded-full transition-all duration-300 ${isRecording ? 'bg-red-500 text-white scale-110 shadow-[0_0_40px_rgba(239,68,68,0.6)] animate-pulse' : 'bg-slate-800 border border-slate-600 text-slate-400 hover:text-emerald-400 hover:border-emerald-500'}`}
            >
              <Mic size={36} />
            </button>
            <p className={`mt-4 text-[10px] font-bold tracking-widest uppercase ${isRecording ? 'text-red-400' : 'text-slate-500'}`}>
              {isRecording ? "Merekam Orasi... (Klik untuk Selesai)" : "Klik Mic Untuk Mulai Orasi"}
            </p>
            {text && !isRecording && (
              <div className="mt-6 w-full max-w-2xl bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center gap-4">
                <span className="text-slate-300 italic text-sm line-clamp-2">"{text}"</span>
                <button type="submit" onClick={handleSubmit} disabled={disabled} className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all shadow-md">
                   Kirim
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
