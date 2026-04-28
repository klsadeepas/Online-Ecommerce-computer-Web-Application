import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Navigation,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [status, setStatus] = useState('PROCESSING');
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060 });
  const [steps, setSteps] = useState([
    { name: 'Blueprint Verified', time: '10:30 AM', done: true, icon: <ShieldCheck /> },
    { name: 'Hardware Assembly', time: '11:45 AM', done: true, icon: <Package /> },
    { name: 'Orbital Transit', time: '2:15 PM', done: false, icon: <Truck /> },
    { name: 'Final Decryption', time: '--', done: false, icon: <CheckCircle2 /> },
  ]);

  useEffect(() => {
    // Simulated live updates for demo
    const timer = setTimeout(() => {
      setStatus('SHIPPED');
      setSteps(prev => prev.map(s => s.name === 'Orbital Transit' ? { ...s, done: true, time: '3:00 PM' } : s));
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [orderId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase accent-glow">Live Deployment</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">
            Unit ID: <span className="text-sky-400 font-black">{orderId?.slice(-12)}</span>
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-3 px-8 py-4 glass hover:bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-white/5 active:scale-95">
            <Phone className="w-4 h-4 text-sky-400" /> Operator Support
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Real-time Map Simulation */}
        <div className="lg:col-span-8">
          <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden glass shadow-2xl border border-white/5 p-4">
            <div className="absolute inset-0 grayscale opacity-20 pointer-events-none">
               <div className="w-full h-full bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:30px_30px]"></div>
            </div>

            {/* Simulated Map UI */}
            <div className="relative w-full h-full bg-slate-950/50 rounded-[2.5rem] overflow-hidden border border-white/5">
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-sky-500/30 fill-none stroke-[2] stroke-dash-offset-[10]">
                <path d="M100 500 Q 400 100 800 400" className="animate-[dash_20s_linear_infinite]" />
              </svg>

              {/* Delivery Icon */}
              <motion.div 
                animate={{ 
                  x: [100, 800],
                  y: [500, 400]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute z-20 origin-center -ml-12 -mt-12"
              >
                <div className="p-4 glass bg-sky-500/20 rounded-2xl shadow-2xl shadow-sky-500/30 border border-sky-500/30 flex items-center gap-4">
                  <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="whitespace-nowrap hidden md:block">
                    <p className="text-[9px] font-black uppercase tracking-tighter leading-none mb-1 text-sky-400">Tactical Status</p>
                    <p className="text-xs font-black uppercase tracking-widest text-white">{status}</p>
                  </div>
                </div>
                <div className="w-0.5 h-12 bg-gradient-to-b from-sky-500 to-transparent mx-auto mt-2 animate-pulse"></div>
              </motion.div>

              {/* Destination Marker */}
              <div className="absolute top-[400px] left-[800px] z-10 -ml-6 -mt-6">
                <div className="w-12 h-12 glass rounded-full flex items-center justify-center shadow-2xl border-2 border-sky-500 animate-bounce">
                  <MapPin className="w-6 h-6 text-sky-500" />
                </div>
                <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[8px] font-black uppercase tracking-widest bg-sky-500 text-white px-3 py-1 rounded-full shadow-lg shadow-sky-500/30">Arrival Point</span>
                </div>
              </div>

              {/* Stats Overlay */}
              <div className="absolute bottom-8 left-8 z-30">
                <div className="p-8 glass rounded-[2.5rem] shadow-2xl border border-white/5 md:w-80 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl -mr-16 -mt-16"></div>
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-12 h-12 glass bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[8px] uppercase font-black text-slate-500 tracking-widest mb-1">Logistics Estimate</p>
                      <p className="text-2xl font-black text-white font-mono tracking-tighter shadow-emerald-500/10 shadow-xl">18 MINS</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 glass bg-white/5 rounded-2xl border border-white/5">
                    <Navigation className="w-4 h-4 text-sky-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">Sectors: 2-B, 4-A • Broadway Hub</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="lg:col-span-4">
          <div className="glass rounded-[3rem] p-10 shadow-2xl border border-sky-500/10 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl -mr-16 -mt-16"></div>
            <h3 className="text-2xl font-black mb-12 flex items-center gap-4 text-white uppercase tracking-tighter accent-glow">
              <Package className="w-6 h-6 text-sky-400" /> Manifest History
            </h3>

            <div className="relative space-y-16 ml-2">
              <div className="absolute left-6 top-4 bottom-4 w-px bg-white/5 shadow-lg"></div>

              {steps.map((step, idx) => (
                <div key={idx} className="relative flex gap-8 group">
                  <div className={cn(
                    "relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 border-2",
                    step.done ? "bg-sky-500 border-sky-500 text-white shadow-xl shadow-sky-500/30" : "bg-slate-900 border-white/10 text-slate-600 group-hover:border-white/20"
                  )}>
                    {step.done ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-slate-500 transition-colors" />}
                  </div>
                  <div>
                    <h4 className={cn(
                      "text-sm font-black uppercase tracking-widest leading-none mb-2 transition-colors",
                      step.done ? "text-white" : "text-slate-600"
                    )}>
                      {step.name}
                    </h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-mono italic">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-10 border-t border-white/5">
              <div className="flex items-start gap-4 p-5 glass rounded-[1.5rem] bg-sky-500/5 border border-sky-500/10 text-sky-400">
                <ShieldCheck className="w-6 h-6 flex-shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-wide leading-relaxed">
                  Deployment secured by TechHaven Protocol. Driver credential verification active.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
