import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Cpu, Box, Monitor, MousePointer2, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass min-h-[500px] flex items-center shadow-2xl">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-sky-500/10 mix-blend-overlay"></div>
          <img 
            src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=2600" 
            alt="Hardware" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-8 py-16 md:px-16 w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 bg-sky-500/20 backdrop-blur-md rounded-full text-sky-400 text-[10px] font-black uppercase tracking-widest mb-4 border border-sky-500/30">
              Future of Hardware
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1] tracking-tighter accent-glow">
              BUILD YOUR <span className="text-sky-400">DREAM RIG</span> TODAY.
            </h1>
            <p className="text-slate-400 text-lg mb-8 max-w-md font-medium leading-relaxed">
              The ultimate destination for gamers, creators, and enthusiasts. Premium components and custom builds delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold transition-all shadow-xl shadow-sky-500/40 flex items-center gap-2 group active:scale-95">
                Shop Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/pc-builder" className="px-8 py-4 glass text-white rounded-xl font-bold transition-all hover:bg-white/5 active:scale-95">
                Custom Builder
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mt-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white uppercase accent-glow">Shop by Category</h2>
            <p className="text-slate-500 mt-2 font-medium">Find exactly what you need for your setup.</p>
          </div>
          <Link to="/products" className="text-sky-400 font-bold uppercase tracking-widest text-[11px] hover:text-sky-300 transition-colors flex items-center gap-1 group">
            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Laptops', icon: <Monitor className="w-6 h-6" />, count: '120+', color: 'sky' },
            { name: 'GPUs', icon: <Box className="w-6 h-6" />, count: '45+', color: 'indigo' },
            { name: 'CPUs', icon: <Cpu className="w-6 h-6" />, count: '30+', color: 'amber' },
            { name: 'Peripherals', icon: <MousePointer2 className="w-6 h-6" />, count: '200+', color: 'rose' },
          ].map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="group p-8 rounded-3xl glass shadow-xl hover:bg-white/5 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-sky-500/10 transition-colors"></div>
              <div className="inline-flex p-3 rounded-2xl bg-white/5 text-sky-400 border border-white/10 mb-6 transition-transform group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-sky-500/20">
                {cat.icon}
              </div>
              <h3 className="text-lg font-black tracking-tight text-white uppercase">{cat.name}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{cat.count} Products</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PC Builder Promo */}
      <section className="mt-24 rounded-3xl glass p-8 md:p-16 text-white overflow-hidden relative shadow-2xl">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none transform translate-x-1/4">
          <Cpu className="w-full h-full text-sky-400" />
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sky-500/10 to-transparent"></div>
        <div className="relative z-10 max-w-xl">
          <span className="inline-block px-3 py-1 bg-sky-500/20 backdrop-blur-md rounded-full text-sky-400 text-[9px] font-black uppercase tracking-widest mb-6 border border-sky-500/30">
            Intelligent Configurator
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight accent-glow">START YOUR <span className="text-sky-400 text-shadow-none">NEXT BUILD</span></h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
            Our intelligent configurator checks compatibility in real-time. Pick your parts, we'll handle the rest.
          </p>
          <Link to="/pc-builder" className="inline-flex px-10 py-4 bg-sky-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-sky-600 transition-all shadow-xl shadow-sky-500/40 active:scale-95">
            Open Configurator
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
