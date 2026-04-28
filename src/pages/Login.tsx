import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'motion/react';
import { Cpu, Mail, Lock, LogIn, Github } from 'lucide-react';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center pt-20 px-4 min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5 p-12 relative"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl -mr-16 -mt-16"></div>
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-sky-500 rounded-2xl items-center justify-center mb-6 shadow-xl shadow-sky-500/30 group">
            <Cpu className="text-white w-8 h-8 group-hover:rotate-12 transition-transform" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase accent-glow">TECH<span className="text-sky-400">HAVEN</span></h2>
          <p className="text-slate-500 mt-2 font-black uppercase tracking-widest text-[10px]">
            {isRegister ? 'Join the tech revolution' : 'Access high performance hardware'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-black tracking-widest text-center uppercase">
              {error}
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="email" 
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-sky-500 outline-none rounded-2xl transition-all font-bold text-white text-sm placeholder:text-slate-700"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="password" 
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-sky-500 outline-none rounded-2xl transition-all font-bold text-white text-sm placeholder:text-slate-700"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center gap-3 group active:scale-95"
          >
            {isRegister ? 'Create Account' : 'Sign In'}
            <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[9px] uppercase font-black tracking-widest">
            <span className="bg-[#020617] px-4 text-slate-600">Secure Authentication</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 py-3 glass hover:bg-white/5 border border-white/5 rounded-2xl transition-all font-black uppercase tracking-widest text-[9px] text-slate-400 hover:text-white"
          >
            <img src="https://www.google.com/favicon.ico" className="w-3 h-3 grayscale group-hover:grayscale-0" alt="" />
            Google
          </button>
          <button className="flex items-center justify-center gap-3 py-3 glass hover:bg-white/5 border border-white/5 rounded-2xl transition-all font-black uppercase tracking-widest text-[9px] text-slate-400 hover:text-white">
            <Github className="w-3.5 h-3.5" />
            GitHub
          </button>
        </div>

        <p className="mt-10 text-center text-[10px] text-slate-600 font-black uppercase tracking-widest">
          {isRegister ? 'Already verified?' : 'New operator?'}
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="ml-2 text-sky-400 font-black hover:text-sky-300 pointer-events-auto"
          >
            {isRegister ? 'Sign In' : 'Register Now'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
