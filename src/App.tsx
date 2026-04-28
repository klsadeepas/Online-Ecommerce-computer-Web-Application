import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState, setUser, setLoading } from './store';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Cpu, 
  Monitor, 
  MousePointer2, 
  HardDrive, 
  Box, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Star
} from 'lucide-react';
import { cn } from './lib/utils';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PCBuilder from './pages/PCBuilder';
import Admin from './pages/Admin';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import { GoogleGenAI } from '@google/genai';

const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(setUser(null));
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-2 shadow-2xl">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white accent-glow">TECH<span className="text-sky-400">HAVEN</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <Link to="/products" className="hover:text-sky-400 transition-colors">Products</Link>
            <Link to="/pc-builder" className="hover:text-sky-400 transition-colors">PC Builder</Link>
            <Link to="/orders" className="hover:text-sky-400 transition-colors">Orders</Link>
            {user?.isAdmin && (
              <Link to="/admin" className="text-sky-400 font-black">Admin</Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-slate-300 hover:bg-white/5 rounded-xl transition-all">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-sky-500 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg shadow-sky-500/40 animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] uppercase font-bold text-slate-500 leading-none">Account</p>
                    <p className="text-xs font-bold text-slate-300 group-hover:text-sky-400 transition-colors">{user.displayName || 'User'}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-sky-400 border-sky-500/20">
                    <User className="w-4 h-4" />
                  </div>
                </Link>
                <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-sky-500/20 active:scale-95">
                Login
              </Link>
            )}
            
            <button className="md:hidden p-2 text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden mt-2 glass rounded-2xl p-6 overflow-hidden flex flex-col gap-4 text-center font-bold uppercase tracking-widest text-sm text-slate-400"
          >
            <Link to="/products" onClick={() => setIsMenuOpen(false)} className="hover:text-sky-400">Products</Link>
            <Link to="/pc-builder" onClick={() => setIsMenuOpen(false)} className="hover:text-sky-400">PC Builder</Link>
            <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="hover:text-sky-400">Orders</Link>
            {user?.isAdmin && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-sky-400">Admin Dashboard</Link>}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-[#020617] z-[100] flex items-center justify-center">
    <div className="mesh-bg" />
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360]
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-sky-500/40"
    >
      <Cpu className="text-white w-8 h-8" />
    </motion.div>
  </div>
);

// --- Main App Wrapper ---
export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        
        dispatch(setUser({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
          isAdmin: userData.isAdmin || authUser.email === 'admin@gmail.com',
          ...userData
        }));
      } else {
        dispatch(setUser(null));
      }
      setAuthReady(true);
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!authReady) return <LoadingScreen />;

  return (
    <BrowserRouter>
      <div className="min-h-screen relative selection:bg-sky-500/30 selection:text-sky-200 transition-colors duration-300">
        <div className="mesh-bg" />
        <Navbar />
        <main className="pt-24 pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/pc-builder" element={<PCBuilder />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Profile />} />
            <Route path="/orders/:orderId" element={<OrderTracking />} />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <footer className="max-w-7xl mx-auto mt-12 pb-12 flex flex-col md:flex-row items-center justify-between text-[10px] text-slate-500 font-black uppercase tracking-widest px-4 gap-4">
          <div className="flex gap-6">
            <span>API Status: Operational</span>
            <span className="hidden sm:inline">Global Stock: 98%</span>
            <span className="hidden sm:inline">Region: Northern Virginia</span>
          </div>
          <div className="flex gap-6">
            <span>© 2026 TechHaven Systems</span>
            <Link to="#" className="text-sky-500 hover:text-sky-400 transition-colors">Privacy Protocol</Link>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
