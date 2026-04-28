import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, removeFromCart, updateQuantity, clearCart } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, Plus, Minus, CreditCard, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const Cart = () => {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to checkout');
      return;
    }

    try {
      alert('Stripe Integration Ready: In a real production environment, this would redirect to Stripe Checkout.');
    } catch (error) {
      console.error(error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center text-center px-4 min-h-[60vh]">
        <div className="w-32 h-32 glass rounded-[2.5rem] flex items-center justify-center text-slate-700 mb-8 shadow-2xl relative group">
          <div className="absolute inset-0 bg-sky-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <ShoppingBag className="w-16 h-16 relative z-10" />
        </div>
        <h2 className="text-4xl font-black mb-3 text-white tracking-tighter uppercase accent-glow">EMPTY ARSENAL</h2>
        <p className="text-slate-500 mb-10 max-w-xs font-medium uppercase tracking-widest text-[10px]">Prepare for glory. Start adding tech to your setup.</p>
        <Link to="/products" className="px-10 py-4 bg-sky-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-sky-600 transition-all shadow-xl shadow-sky-500/30 active:scale-95">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter text-white uppercase flex items-center gap-4 accent-glow">
          CHECKOUT <span className="text-sky-500/30 font-thin">/ {items.length} UNITS</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex flex-col sm:flex-row items-center gap-8 p-6 glass rounded-[2rem] shadow-xl hover:bg-white/5 transition-all relative"
              >
                <div className="w-28 h-28 glass rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 p-2">
                  <img src={item.image} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" alt={item.name} />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-black text-xl text-white tracking-tight group-hover:text-sky-400 transition-colors uppercase truncate max-w-[280px]">{item.name}</h3>
                  <p className="text-sky-500 font-mono font-black text-lg mt-1 tracking-tighter">${item.price}</p>
                </div>

                <div className="flex items-center gap-5 glass p-2 rounded-2xl border border-white/10">
                  <button 
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-slate-500 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-black text-white font-mono">{item.quantity}</span>
                  <button 
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-slate-500 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button 
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-red-400 glass hover:bg-red-500/10 rounded-2xl transition-all border border-white/5 group-hover:border-white/10"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <button 
            onClick={() => dispatch(clearCart())}
            className="text-slate-600 text-[10px] font-black uppercase tracking-widest hover:text-red-400 transition-colors pt-6 flex items-center gap-2 group ml-4"
          >
            <Trash2 className="w-4 h-4 transition-transform group-hover:rotate-12" /> Empty Arsenal
          </button>
        </div>

        <div className="lg:col-span-4">
          <div className="glass rounded-[2.5rem] p-8 sticky top-24 shadow-2xl border border-sky-500/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl -mr-16 -mt-16"></div>
            <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-tighter accent-glow">Mission Summary</h2>
            
            <div className="space-y-5 mb-10">
              <div className="flex justify-between text-slate-500 text-xs font-black uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="font-mono text-slate-300 tracking-tighter">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-xs font-black uppercase tracking-widest">
                <span>Logistic Fee</span>
                <span className="text-emerald-500 font-mono tracking-tighter">FREE</span>
              </div>
              <div className="flex justify-between text-slate-500 text-xs font-black uppercase tracking-widest">
                <span>Est. Tax</span>
                <span className="font-mono text-slate-300 tracking-tighter">$0.00</span>
              </div>
              <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                <span className="font-black text-lg text-white uppercase tracking-tighter">Total Priority</span>
                <span className="text-3xl font-black text-sky-400 font-mono tracking-tighter shadow-sky-500/20 shadow-xl">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleCheckout}
                className="w-full py-5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-sky-500/40 group transition-all active:scale-95"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex flex-col items-center gap-3 py-6 glass rounded-2xl bg-white/5 border-white/5 mt-4">
                <CreditCard className="text-slate-600 w-6 h-6" />
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest text-center leading-relaxed max-w-[180px]">
                  Secure encrypted transaction via Stripe Systems
                </p>
              </div>

              <div className="p-5 glass rounded-2xl flex items-start gap-4 border-emerald-500/10">
                <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-wide">
                  Buyer protection active. verified performance hardware.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
