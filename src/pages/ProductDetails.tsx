import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Cpu, 
  Component as ComponentIcon,
  Sparkles,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';
import { sampleProducts } from '../sampleData';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store';
import { cn } from '../lib/utils';
import { GoogleGenAI } from '@google/genai';

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  // For demo, we'll find by name since names are unique in our sample
  const product = sampleProducts.find(p => p.name === productId) || sampleProducts[0];

  useEffect(() => {
    // Fetch AI Recommendations via frontend SDK
    const fetchAI = async () => {
      setLoadingAI(true);
      try {
        const apiKey = (process.env as any).GEMINI_API_KEY;
        if (!apiKey) return;

        const ai = new GoogleGenAI({ apiKey });
        const prompt = `As a tech expert for "TechHaven" store, recommend 3 products based on:
          Preferences: Looking for performance and reliability
          Current Product: ${product.name}
          Return JSON array of objects with fields: name, reason (brief).`;

        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        const data = JSON.parse(result.text || '[]');
        setRecommendations(data);
      } catch (err) {
        console.error('AI Error:', err);
      }
      setLoadingAI(false);
    };
    fetchAI();
  }, [product.name]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 mb-24">
        
        {/* Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="aspect-square rounded-[3rem] overflow-hidden glass shadow-2xl relative p-8 group">
            <div className="absolute inset-0 bg-sky-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img src={product.images[0]} className="w-full h-full object-contain relative z-10 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[0, 0, 0, 0].map((_, i) => (
              <div key={i} className="aspect-square rounded-3xl glass border border-white/5 overflow-hidden cursor-pointer hover:border-sky-500 transition-all opacity-40 hover:opacity-100 p-2">
                <img src={product.images[0]} className="w-full h-full object-contain" alt="" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 glass text-sky-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-xs font-black text-amber-500 ml-4">
                <Star className="w-3.5 h-3.5 fill-current" /> {product.rating} <span className="text-slate-600 ml-1 font-medium tracking-tight">({product.numReviews} Verified)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-white tracking-tighter uppercase accent-glow">{product.name}</h1>
            <p className="text-slate-500 text-lg leading-relaxed font-medium max-w-xl">{product.description}</p>
          </div>

          <div className="flex items-end gap-6 mb-12">
            <div>
              <p className="text-[10px] items-center font-black uppercase text-slate-500 tracking-widest mb-2">Priority Price Unit</p>
              <div className="text-6xl font-black text-sky-400 font-mono tracking-tighter shadow-sky-500/10 shadow-xl">${product.price}</div>
            </div>
            {product.discountPrice && (
              <div className="mb-2">
                <span className="text-2xl text-slate-700 line-through font-mono tracking-tighter">${product.discountPrice}</span>
                <span className="ml-3 text-emerald-400 font-black text-[10px] bg-emerald-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest">SAVINGS ENABLED</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 mb-12 pb-12 border-b border-white/5">
            <div className="flex items-center gap-4 glass p-2 rounded-2xl border border-white/10">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-slate-500 hover:text-white"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-8 text-center font-black text-xl text-white font-mono">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-slate-500 hover:text-white"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <button 
              onClick={() => dispatch(addToCart({ id: product.name, name: product.name, price: product.price, image: product.images[0], quantity }))}
              className="flex-1 py-5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-sky-500/40 active:scale-95 transition-all"
            >
              <ShoppingCart className="w-6 h-6" /> Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="flex items-center gap-4 p-5 glass rounded-3xl border border-white/5">
               <ShieldCheck className="text-emerald-400 w-8 h-8" />
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Standard Warranty</p>
                  <p className="text-[10px] text-slate-500 font-bold">3 Year Manufacturer Seal</p>
               </div>
             </div>
             <div className="flex items-center gap-4 p-5 glass rounded-3xl border border-white/5">
               <Truck className="text-sky-400 w-8 h-8" />
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Fast Delivery</p>
                  <p className="text-[10px] text-slate-500 font-bold">Priority Orbital Shipping</p>
               </div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Details & Specs */}
      <div className="grid lg:grid-cols-12 gap-12 mb-24">
        <div className="lg:col-span-12 glass rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-3xl -mr-32 -mt-32"></div>
          <h3 className="text-3xl font-black mb-10 text-white tracking-tighter uppercase accent-glow border-b border-white/5 pb-6">Technical Specifications</h3>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-6">
            {Object.entries(product.specifications || {}).map(([key, val]: [string, any]) => (
              <div key={key} className="flex justify-between border-b border-white/5 py-4 group">
                <span className="text-slate-500 font-black uppercase tracking-widest text-[10px] group-hover:text-slate-400 transition-colors">{key}</span>
                <span className="font-bold text-slate-200 group-hover:text-sky-400 transition-colors uppercase tracking-tight text-sm">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <section className="mt-24">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-sky-400 border-sky-500/20 shadow-lg shadow-sky-500/10">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter accent-glow leading-none">Synergy Matching</h2>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mt-1">AI Powered Hardware Recommendations</p>
          </div>
          {loadingAI && <div className="ml-4 w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendations.length > 0 ? (
            recommendations.map((rec, i) => (
              <div key={i} className="p-8 glass rounded-[2.5rem] shadow-xl hover:bg-white/5 transition-all relative group h-full flex flex-col">
                <div className="flex items-center gap-2 text-[10px] font-black text-sky-400 uppercase tracking-widest mb-4">
                  <Star className="w-3 h-3 fill-current" /> High Compatibility
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-sky-400 transition-colors mb-4">{rec.name}</h4>
                <p className="text-slate-500 text-[11px] font-medium leading-relaxed mb-8 flex-1">{rec.reason}</p>
                <Link 
                  to={`/products/${rec.name}`}
                  className="inline-flex items-center gap-2 text-sky-400 font-black uppercase tracking-widest text-[10px] group-hover:text-sky-300 transition-colors"
                >
                  View Blueprint <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))
          ) : (
            [1, 2, 3].map(i => (
              <div key={i} className="h-64 glass rounded-[2.5rem] animate-pulse" />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
