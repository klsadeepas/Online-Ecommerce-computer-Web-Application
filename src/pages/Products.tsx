import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Plus, 
  Star, 
  Tag, 
  ChevronDown 
} from 'lucide-react';
import { sampleProducts } from '../sampleData';

const Products = () => {
  const [products, setProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(3000);
  const [sortBy, setSortBy] = useState('Popularity');
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const [isBudgetExpanded, setIsBudgetExpanded] = useState(true);
  const dispatch = useDispatch();

  const categories = ['All', 'Laptops', 'Desktop PCs', 'CPUs', 'GPUs', 'RAM', 'Storage', 'Motherboards', 'Accessories'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesPrice = p.price <= priceRange;
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a: any, b: any) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="glass rounded-3xl p-6 shadow-xl border border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <Search className="w-3 h-3 text-sky-500" /> Search Hardware
            </h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Model, brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600 font-medium"
              />
            </div>

            {/* Categories Section */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <button 
                onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                className="w-full flex items-center justify-between group mb-4"
              >
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">Categories</h3>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isCategoriesExpanded ? '' : '-rotate-90'}`} />
              </button>
              
              <AnimatePresence initial={false}>
                {isCategoriesExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-1 pb-2">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            selectedCategory === cat 
                              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
                              : 'text-slate-500 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Budget Section */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <button 
                onClick={() => setIsBudgetExpanded(!isBudgetExpanded)}
                className="w-full flex items-center justify-between group mb-6"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">Budget</h3>
                  {isBudgetExpanded && <span className="text-[11px] font-black text-sky-400 font-mono ml-2">${priceRange}</span>}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isBudgetExpanded ? '' : '-rotate-90'}`} />
              </button>

              <AnimatePresence initial={false}>
                {isBudgetExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4">
                      <div className="relative h-2 w-full bg-white/5 rounded-full px-1">
                        <input 
                          type="range" 
                          min="0" 
                          max="3000" 
                          step="50"
                          value={priceRange}
                          onChange={(e) => setPriceRange(parseInt(e.target.value))}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                        />
                        <div 
                          className="h-1 bg-sky-500 rounded-full mt-0.5 shadow-[0_0_10px_rgba(14,165,233,0.5)]" 
                          style={{ width: `${(priceRange / 3000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500 mt-4 font-black uppercase tracking-widest">
                        <span>$0</span>
                        <span>$3K Max</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 bg-sky-500/10 border-sky-500/20">
            <p className="text-xs font-black text-sky-400 mb-1 uppercase tracking-widest">Pro Build</p>
            <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">Let our experts design and build your performance rig.</p>
            <Link to="/pc-builder" className="block w-full py-2.5 bg-sky-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-center text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-colors">Configure Now</Link>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <h2 className="text-4xl font-black tracking-tighter text-white uppercase accent-glow">
                {selectedCategory}
              </h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                {filteredProducts.length} items available in stock
              </p>
            </div>
            <div className="glass flex items-center gap-3 px-4 py-2 rounded-2xl border border-white/10 group">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sort:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-black bg-transparent border-none outline-none cursor-pointer text-sky-400 uppercase tracking-wider"
              >
                <option className="bg-[#020617]">Popularity</option>
                <option className="bg-[#020617]">Price: Low to High</option>
                <option className="bg-[#020617]">Price: High to Low</option>
                <option className="bg-[#020617]">Rating</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product: any, idx) => (
                <motion.div
                  layout
                  key={product.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group glass rounded-3xl overflow-hidden shadow-xl hover:bg-white/5 transition-all relative flex flex-col"
                >
                  {/* Image Container */}
                  <div className="aspect-[4/3] overflow-hidden relative bg-white/5 m-3 rounded-2xl">
                    <Link to={`/products/${product.name}`}>
                      <img 
                        src={product.images?.[0] || 'https://via.placeholder.com/400'} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      />
                    </Link>
                    {product.isFeatured && (
                      <div className="absolute top-4 left-4 bg-sky-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-sky-500/40 uppercase tracking-widest">
                        <Tag className="w-2.5 h-2.5" /> Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 pt-2 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">{product.brand}</span>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                        <Star className="w-2.5 h-2.5 fill-current" /> {product.rating}
                      </div>
                    </div>
                    <Link to={`/products/${product.name}`}>
                      <h3 className="text-lg font-black tracking-tight text-white mb-2 group-hover:text-sky-400 transition-colors uppercase line-clamp-1">{product.name}</h3>
                    </Link>
                    <p className="text-slate-500 text-[11px] font-medium leading-relaxed mb-6 line-clamp-2 h-9">{product.description}</p>
                    
                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-white font-mono leading-none">${product.price}</span>
                        {product.discountPrice && (
                          <span className="text-[10px] text-slate-500 line-through font-mono mt-0.5">${product.discountPrice}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => dispatch(addToCart({ id: product.name, name: product.name, price: product.price, image: product.images[0], quantity: 1 }))}
                        className="w-10 h-10 bg-white/5 hover:bg-sky-500 text-slate-400 hover:text-white rounded-xl transition-all border border-white/10 flex items-center justify-center active:scale-90"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
