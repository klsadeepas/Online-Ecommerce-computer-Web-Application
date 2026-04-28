import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';
import { User, Package, MapPin, Award, ChevronRight, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const q = query(
            collection(db, 'orders'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
          const snap = await getDocs(q);
          setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
          console.error("Orders fetch failed:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [user]);

  if (!user) return (
    <div className="pt-40 text-center">
      <div className="glass inline-block p-10 rounded-[2.5rem] border border-white/5">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Access Restricted</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">Verification Required to Access Profile Data</p>
        <Link to="/login" className="px-8 py-3 bg-sky-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-sky-500/30">Authorize Now</Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-12 gap-12">
        
        {/* User Info Card */}
        <div className="lg:col-span-4">
          <div className="glass rounded-[2.5rem] p-10 sticky top-24 shadow-2xl border border-sky-500/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl -mr-16 -mt-16"></div>
            <div className="text-center mb-10">
              <div className="w-24 h-24 glass bg-sky-500/10 mx-auto rounded-[2rem] flex items-center justify-center text-sky-400 mb-6 shadow-2xl border border-white/5 relative group">
                <User className="w-10 h-10 group-hover:scale-110 transition-transform" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter accent-glow">{user.displayName || 'Tech Enthusiast'}</h2>
              <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mt-2 italic">{user.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-5 glass bg-white/5 rounded-3xl text-center border border-white/5">
                <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest mb-1 leading-none">Loyalty</p>
                <p className="text-2xl font-black text-sky-400 font-mono tracking-tighter">{user.points || 250}</p>
              </div>
              <div className="p-5 glass bg-white/5 rounded-3xl text-center border border-white/5">
                <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest mb-1 leading-none">Status</p>
                <p className="text-2xl font-black text-emerald-400 font-mono tracking-tighter uppercase">Gold</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link to="/wishlist" className="flex items-center justify-between p-5 glass bg-white/5 rounded-[1.5rem] hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[10px] group border border-white/5">
                Verified Favorites <ChevronRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/settings" className="flex items-center justify-between p-5 glass bg-white/5 rounded-[1.5rem] hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[10px] group border border-white/5">
                Protocol Settings <ChevronRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-5xl font-black text-white uppercase tracking-tighter accent-glow">Deployment History</h1>
              <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mt-2">Verified Units: {orders.length}</p>
            </div>
          </div>

          <div className="space-y-8">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-40 glass rounded-[2.5rem] animate-pulse border border-white/5" />)
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-[2.5rem] p-8 hover:bg-white/5 transition-all group border border-white/5 relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1 glass bg-sky-500/10 text-sky-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-sky-400/20 shadow-lg shadow-sky-500/10">
                          Unit #{order.id.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deployed: {new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mb-8">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="w-14 h-14 rounded-2xl glass bg-white/5 p-2 border border-white/10 hover:scale-110 transition-transform">
                            <img src={item.image} className="w-full h-full object-contain opacity-80" alt="" />
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-8">
                        <div>
                          <p className="text-[8px] uppercase font-black text-slate-600 tracking-widest mb-1.5 leading-none">Security Status</p>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                             <span className="text-xs font-black text-white uppercase tracking-widest">{order.status}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase font-black text-slate-600 tracking-widest mb-1.5 leading-none">Total Value</p>
                          <p className="text-xl font-black text-sky-400 font-mono tracking-tighter">${order.total}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end justify-between md:flex-col md:items-end md:gap-4 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-10 min-w-[180px]">
                      <Link 
                        to={`/orders/${order.id}`}
                        className="w-full py-3 bg-sky-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-center shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
                      >
                        Track Unit
                      </Link>
                      <button className="w-full py-3 glass bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                        Manifest
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-20 glass rounded-[3rem] border-2 border-dashed border-white/10 text-center">
                <Package className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No active or historical deployments registered.</p>
                <Link to="/products" className="inline-block mt-8 text-sky-400 font-black uppercase tracking-widest text-[10px] hover:text-sky-300">Browse Catalog →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
