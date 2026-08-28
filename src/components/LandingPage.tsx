import React, { useState } from 'react';
import { LogIn, UserPlus, Lock, GraduationCap, Shield, Eye, EyeOff, Sparkles } from 'lucide-react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { motion } from 'motion/react';

export function LandingPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.log("Auth error intercepted");
      if (error.code === 'auth/operation-not-allowed') {
        setError('Login Google belum diaktifkan di Firebase Console. Silakan aktifkan di menu Authentication -> Sign-in method.');
      } else {
        setError(error.message);
      }
    }
  };

  const handleStudentAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const isEmailInput = username.includes('@');
      let virtualEmail = username.toLowerCase().trim();
      
      if (!isEmailInput) {
        const sanitizedUsername = username.toLowerCase().replace(/[^a-z0-9_.-]/g, '');
        if (!sanitizedUsername) {
          throw new Error("Username tidak valid (hanya gunakan huruf dan angka)");
        }
        virtualEmail = `${sanitizedUsername}@alkahfi-rpg.com`;
      }

      if (mode === 'register') {
        if (!name.trim()) throw new Error("Nama harus diisi");
        const userCredential = await createUserWithEmailAndPassword(auth, virtualEmail, password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, virtualEmail, password);
      }
    } catch (err: any) {
      console.log("Auth error intercepted");
      if (err.code === 'auth/email-already-in-use') setError('Username sudah digunakan.');
      else if (err.code === 'auth/invalid-email') setError('Format username tidak valid.');
      else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') setError('Username atau password salah.');
      else if (err.code === 'auth/weak-password') setError('Password minimal 6 karakter.');
      else if (err.code === 'auth/operation-not-allowed') setError('Sistem Login (Email/Password) belum diaktifkan di Firebase Console Anda. Silakan aktifkan di menu Authentication -> Sign-in method.');
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* 1. CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-30 mix-blend-luminosity scale-105 animate-[pulse_20s_ease-in-out_infinite]"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'contrast(1.2) grayscale(0.2)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/40" />
        
        {/* Epic Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md flex flex-col items-center mt-10"
      >
        {/* 2. GAME LOGO & TITLE */}
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="w-20 h-20 bg-slate-900 rounded-2xl border-2 border-emerald-500 flex items-center justify-center font-bold text-slate-100 shadow-[0_0_40px_rgba(16,185,129,0.5)] mb-6 text-3xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-emerald-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          AK
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-amber-600 drop-shadow-[0_0_20px_rgba(245,158,11,0.4)] mb-2 uppercase text-center">
          AL-KAHFI
        </h1>
        
        <p className="text-emerald-400 font-mono text-xs mb-8 text-center tracking-[0.3em] uppercase bg-emerald-950/50 px-4 py-1 rounded-full border border-emerald-900/50">
          Sosiologi Membumi
        </p>

        {/* 3. GLASSMORPHISM LOGIN PANEL */}
        <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* Mode Switcher */}
          <div className="flex bg-slate-950/80 rounded-xl p-1.5 border border-slate-800 mb-8 relative">
            <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-slate-800 rounded-lg shadow-md transition-all duration-300 ease-out ${mode === 'login' ? 'left-1.5' : 'left-[calc(50%+6px)]'}`}></div>
            
            <button 
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors relative z-10 ${mode === 'login' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <LogIn size={16} /> Masuk
            </button>
            <button 
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors relative z-10 ${mode === 'register' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <UserPlus size={16} /> Daftar
            </button>
          </div>

          <form onSubmit={handleStudentAuth} className="space-y-5 mb-8">
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-red-950/50 border border-red-500/50 text-red-200 text-xs font-medium rounded-xl text-center flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                {error}
              </motion.div>
            )}
            
            {mode === 'register' && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                  <GraduationCap size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="Nama Lengkap Siswa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-sm shadow-inner"
                />
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                <UserPlus size={18} />
              </div>
              <input 
                type="text" 
                required
                placeholder="Username (misal: budi_123)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-sm shadow-inner"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="Password (minimal 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-4 pl-12 pr-12 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-sm shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* EPIC SUBMIT BUTTON */}
            <button 
              type="submit"
              disabled={loading}
              className={`relative w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all duration-300 mt-4 overflow-hidden group
                ${loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-0.5'}
              `}
            >
              {!loading && <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>}
              {loading ? (
                'Memproses Koneksi...'
              ) : mode === 'login' ? (
                <><Sparkles size={16} className="text-emerald-200" /> Mulai Petualangan</>
              ) : (
                <><UserPlus size={16} /> Daftar Siswa Baru</>
              )}
            </button>
          </form>

          {/* 4. SEPARATOR & ADMIN LOGIN (Subtle) */}
          <div className="relative flex items-center py-2 mb-6">
            <div className="flex-grow border-t border-slate-700/50"></div>
            <span className="flex-shrink-0 mx-4 text-slate-600 text-[10px] uppercase tracking-widest font-bold bg-slate-900 px-2">Akses Instruktur</span>
            <div className="flex-grow border-t border-slate-700/50"></div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full py-3.5 bg-slate-950/50 border border-slate-800 hover:border-amber-500/30 hover:bg-slate-900 rounded-xl font-bold text-slate-400 hover:text-amber-400 text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all group"
          >
            <Shield size={16} className="text-slate-500 group-hover:text-amber-500 transition-colors" /> 
            Login God's Eye (Guru)
          </button>

        </div>
      </motion.div>

      {/* CSS Animation for Button Shimmer */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
