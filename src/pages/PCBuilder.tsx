import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Monitor, 
  Keyboard, 
  HardDrive, 
  Box, 
  Settings, 
  AlertCircle, 
  Trash2,
  CheckCircle2,
  ShoppingBag
} from 'lucide-react';
import { sampleProducts } from '../sampleData';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store';
import { cn } from '../lib/utils';

const PCBuilder = () => {
  const [selections, setSelections] = useState<Record<string, any>>({
    CPU: null,
    Motherboard: null,
    GPU: null,
    RAM: null,
    Storage: null,
    Case: null,
    PSU: null,
  });
  const [activeCategory, setActiveCategory] = useState('CPU');
  const dispatch = useDispatch();

  const slots = [
    { id: 'CPU', name: 'Processor', icon: <Cpu /> },
    { id: 'Motherboards', name: 'Motherboard', icon: <Box /> },
    { id: 'GPUs', name: 'Graphics Card', icon: <Box /> },
    { id: 'RAM', name: 'Memory', icon: <Box /> },
    { id: 'Storage', name: 'Storage', icon: <HardDrive /> },
    { id: 'PSU', name: 'Power Supply', icon: <Settings /> },
  ];

  const total: number = Object.values(selections).reduce((acc: number, item: any) => acc + (Number(item?.price) || 0), 0);

  const availableItems = sampleProducts.filter(p => {
    if (activeCategory === 'Motherboards') return p.category === 'Motherboards';
    if (activeCategory === 'GPUs') return p.category === 'GPUs';
    if (activeCategory === 'CPUs') return p.category === 'CPUs';
    return p.category === activeCategory;
  });

  const checkCompatibility = () => {
    const warnings = [];
    if (selections.CPU && selections.Motherboard) {
      if (selections.CPU.specifications?.Socket !== selections.Motherboard.specifications?.Socket) {
        warnings.push(`Mismatch: ${selections.CPU.name} uses ${selections.CPU.specifications?.Socket} but ${selections.Motherboard.name} uses ${selections.Motherboard.specifications?.Socket}.`);
      }
    }
    return warnings;
  };

  const warnings = checkCompatibility();

  const handleSelect = (item: any) => {
    const categoryKey = activeCategory === 'Motherboards' ? 'Motherboard' : 
                       activeCategory === 'GPUs' ? 'GPU' : activeCategory;
    setSelections(prev => ({ ...prev, [categoryKey]: item }));
  };

  const handleAddAllToCart = () => {
    Object.values(selections).forEach((item: any) => {
      if (item) {
        dispatch(addToCart({ 
          id: item.name, 
          name: item.name, 
          price: item.price, 
          image: item.images?.[0] || '', 
          quantity: 1 
        }));
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Left Column: Build Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-3xl p-8 sticky top-24 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl -mr-16 -mt-16"></div>
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-tighter accent-glow">
              <Settings className="w-6 h-6 text-sky-400" /> Configurator
            </h2>
            
            <div className="space-y-4">
              {slots.map(slot => {
                const item = selections[slot.id === 'Motherboards' ? 'Motherboard' : slot.id === 'GPUs' ? 'GPU' : slot.id];
                return (
                  <div 
                    key={slot.id}
                    onClick={() => setActiveCategory(slot.id)}
                    className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      activeCategory === slot.id 
                        ? 'border-sky-500/50 bg-sky-500/10 shadow-lg shadow-sky-500/5' 
                        : 'border-white/5 hover:border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${item ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20 rotate-3' : 'bg-white/5 text-slate-500 group-hover:text-slate-300'}`}>
                        {React.cloneElement(slot.icon as React.ReactElement, { size: 18 })}
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest leading-none mb-1">{slot.name}</p>
                        <p className={`text-xs font-bold uppercase tracking-tight truncate max-w-[140px] ${item ? 'text-white' : 'text-slate-600 italic'}`}>
                          {item ? item.name : 'Select Component'}
                        </p>
                      </div>
                    </div>
                    {item && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-sky-400 font-mono">${item.price}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelections(prev => ({ ...prev, [slot.id === 'Motherboards' ? 'Motherboard' : slot.id === 'GPUs' ? 'GPU' : slot.id]: null }));
                          }}
                          className="p-1.5 hover:bg-red-500/20 hover:text-red-400 text-slate-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-10 pt-8 border-t border-white/5">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">Total Build Cost</p>
                  <p className="text-3xl font-black text-white font-mono tracking-tighter">${total.toFixed(2)}</p>
                </div>
                {warnings.length > 0 && (
                  <div className="flex items-center gap-1.5 text-red-500 animate-pulse bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Errors</span>
                  </div>
                )}
              </div>

              {warnings.length > 0 && (
                <div className="mb-8 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                  {warnings.map((w, i) => (
                    <p key={i} className="text-[10px] text-red-400 font-bold leading-relaxed flex gap-2 mb-2 last:mb-0 uppercase tracking-tight">
                      <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" /> {w}
                    </p>
                  ))}
                </div>
              )}

              <button 
                onClick={handleAddAllToCart}
                disabled={total === 0 || warnings.length > 0}
                className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-sky-500/30 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ShoppingBag className="w-5 h-5" /> Add Build to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Component Browser */}
        <div className="lg:col-span-8">
          <div className="mb-10">
            <span className="text-sky-500 text-[10px] font-black uppercase tracking-widest bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
              Browser
            </span>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase mt-4 accent-glow">
              Pick Your {activeCategory === 'Motherboards' ? 'Motherboard' : activeCategory === 'GPUs' ? 'GPU' : activeCategory}
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Only compatible components are listed for this slot.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {availableItems.length > 0 ? (
              availableItems.map(item => (
                <motion.div
                  layout
                  key={item.name}
                  className={cn(
                    "p-5 rounded-3xl border-2 transition-all cursor-pointer group flex flex-col justify-between overflow-hidden relative",
                    selections[activeCategory === 'Motherboards' ? 'Motherboard' : activeCategory === 'GPUs' ? 'GPU' : activeCategory]?.name === item.name
                      ? 'border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/10'
                      : 'border-white/5 glass hover:bg-white/5 hover:border-white/10'
                  )}
                  onClick={() => handleSelect(item)}
                >
                  <div className="flex gap-5">
                    <div className="w-24 h-24 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 p-2">
                      <img src={item.images?.[0]} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" alt="" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-white group-hover:text-sky-400 transition-colors uppercase leading-tight tracking-tight">{item.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-2 font-black uppercase tracking-widest">
                        <span className="text-sky-400/70">{item.brand}</span>
                        <span>•</span>
                        <div className="flex items-center text-emerald-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-xl font-black text-white font-mono tracking-tighter">${item.price}</div>
                    <button className={cn(
                      "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      selections[activeCategory === 'Motherboards' ? 'Motherboard' : activeCategory === 'GPUs' ? 'GPU' : activeCategory]?.name === item.name
                        ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                    )}>
                      {selections[activeCategory === 'Motherboards' ? 'Motherboard' : activeCategory === 'GPUs' ? 'GPU' : activeCategory]?.name === item.name ? 'Selected ✅' : 'Select'}
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 py-20 text-center glass rounded-3xl border-2 border-dashed border-white/10">
                <AlertCircle className="w-12 h-12 text-slate-700 mx-auto mb-6" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No components available in this category yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCBuilder;
