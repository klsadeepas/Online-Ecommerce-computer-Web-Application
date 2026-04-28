import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit, 
  TrendingUp,
  DollarSign,
  AlertCircle
} from 'lucide-react';

const Admin = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('Overview');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', brand: '', category: 'Laptops', price: 0, stock: 0, description: '', images: ['']
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const pSnap = await getDocs(collection(db, 'products'));
    setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    
    const oSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
    setOrders(oSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        createdAt: new Date().toISOString(),
        rating: 0,
        numReviews: 0
      });
      setIsAdding(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="pt-40 flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-3xl font-black mb-2">Access Denied</h2>
        <p className="text-zinc-500">You do not have administrative privileges.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black">Control Center</h1>
          <p className="text-zinc-500 mt-1 font-medium">Manage TechHaven inventory and operations.</p>
        </div>
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl">
          {['Overview', 'Products', 'Orders', 'Users'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Revenue', value: '$45,290', icon: <DollarSign />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { label: 'Sales', value: '1,240', icon: <TrendingUp />, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Products', value: products.length.toString(), icon: <Package />, color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: 'Users', value: '842', icon: <Users />, color: 'text-violet-500', bg: 'bg-violet-50' },
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                <div className={`p-3 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="p-8 bg-zinc-900 rounded-[2.5rem] text-white">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Sales Analytics</h3>
                <BarChart3 className="text-zinc-500" />
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="flex-1 bg-blue-600 rounded-t-xl"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-zinc-500 font-bold uppercase tracking-widest px-2">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Product Inventory</h3>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-5 h-5" /> Add New Product
            </button>
          </div>

          {isAdding && (
            <motion.form 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAddProduct}
              className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <input required placeholder="Product Name" className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl outline-none" onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                <input required placeholder="Brand" className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl outline-none" onChange={e => setNewProduct({...newProduct, brand: e.target.value})} />
                <input required type="number" placeholder="Price" className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl outline-none" onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
                <input required type="number" placeholder="Stock" className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl outline-none" onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} />
              </div>
              <div className="space-y-4">
                <textarea required placeholder="Description" rows={4} className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl outline-none" onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                <select className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl outline-none" onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                  <option>Laptops</option>
                  <option>CPUs</option>
                  <option>GPUs</option>
                  <option>RAM</option>
                  <option>Storage</option>
                  <option>Motherboards</option>
                  <option>Accessories</option>
                </select>
                <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Save Product</button>
              </div>
            </motion.form>
          )}

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Product</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Category</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Stock</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Price</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold">{p.name}</td>
                    <td className="px-6 py-4 uppercase text-xs font-bold opacity-60 tracking-tighter">{p.category}</td>
                    <td className="px-6 py-4">{p.stock}</td>
                    <td className="px-6 py-4 font-bold">${p.price}</td>
                    <td className="px-6 py-4 flex gap-4">
                      <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-blue-600 transition-all"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => deleteDoc(doc(db, 'products', p.id)).then(fetchData)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-zinc-400 hover:text-red-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
