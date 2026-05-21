import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, Save, Search as SearchIcon, Tag, ChevronDown, Package, Image as ImageIcon, DollarSign, Type, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '', categoryId: '' });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      productService.getAll(),
      categoryService.getAll()
    ]).then(([productsData, categoriesData]) => {
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description?.toLowerCase().includes(query.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(query.toLowerCase())
  );

  const openCreate = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', imageUrl: '', categoryId: '' });
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({ 
      name: product.name, 
      description: product.description, 
      price: product.price, 
      imageUrl: product.imageUrl || '',
      categoryId: product.category?.id || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { categoryId, ...rest } = formData;
    const payload = { 
      ...rest, 
      price: parseFloat(formData.price),
      category: categoryId ? { id: parseInt(categoryId) } : null
    };
    
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, payload);
      } else {
        await productService.create(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Error saving product: ' + (err.response?.data || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productService.delete(id);
      fetchData();
    } catch { alert('Error deleting product'); }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-admin-muted uppercase tracking-widest">Loading Products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 lg:gap-6 mb-6 lg:mb-10 text-left">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-admin-text mb-1">Products</h1>
          <p className="text-[11px] lg:text-sm text-admin-muted font-medium">Manage your boutique inventory and categories.</p>
        </div>
        <button 
          onClick={openCreate} 
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Main Table Content */}
      <div className="bg-admin-card border border-admin-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-admin-bg/50 border-b border-admin-border">
                <th className="text-[10px] font-bold text-admin-muted uppercase tracking-widest px-4 lg:px-8 py-4">Product</th>
                <th className="text-[10px] font-bold text-admin-muted uppercase tracking-widest px-8 py-4 hidden lg:table-cell">Category</th>
                <th className="text-right text-[10px] font-bold text-admin-muted uppercase tracking-widest px-4 lg:px-8 py-4">Price</th>
                <th className="text-right text-[10px] font-bold text-admin-muted uppercase tracking-widest px-4 lg:px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors group">
                  <td className="px-4 lg:px-8 py-4 lg:py-5">
                    <div className="flex items-center gap-3 lg:gap-4 text-left">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-admin-bg border border-admin-border rounded-xl overflow-hidden shrink-0">
                        {product.imageUrl?.startsWith('http') ? (
                          <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-admin-muted bg-gray-100">{product.name?.charAt(0)}</div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs lg:text-sm text-admin-text line-clamp-1">{product.name}</span>
                        <span className="text-[9px] lg:text-[10px] text-admin-muted uppercase font-bold tracking-tight">ID: #{product.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 hidden lg:table-cell text-left">
                    <span className="px-3 py-1 bg-admin-bg border border-admin-border text-admin-muted rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-4 lg:px-8 py-4 lg:py-5 text-right font-bold text-xs lg:text-sm text-admin-text">
                    ${product.price?.toFixed(2)}
                  </td>
                  <td className="px-4 lg:px-8 py-4 lg:py-5 text-right">
                    <div className="flex items-center justify-end gap-1 lg:gap-2">
                      <button onClick={() => openEdit(product)} className="p-1.5 lg:p-2 text-admin-muted hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all">
                        <Pencil size={14} className="lg:hidden" />
                        <Pencil size={16} className="hidden lg:block" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 lg:p-2 text-admin-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={14} className="lg:hidden" />
                        <Trash2 size={16} className="hidden lg:block" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simplified Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 10 }} 
              className="bg-admin-card border border-admin-border rounded-2xl p-4 lg:p-8 max-w-2xl w-full shadow-2xl relative z-10 overflow-y-auto max-h-[95vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <h2 className="text-lg lg:text-xl font-bold text-admin-text">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-admin-muted uppercase tracking-wider">Product Name</label>
                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-emerald-500/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-admin-muted uppercase tracking-wider">Category</label>
                    <div className="relative">
                      <select required value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer">
                        <option value="" disabled>Select category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-admin-muted pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-admin-muted uppercase tracking-wider">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-emerald-500/50 transition-all resize-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-admin-muted uppercase tracking-wider">Price (USD)</label>
                    <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-emerald-500/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-admin-muted uppercase tracking-wider">Image URL</label>
                    <input value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-emerald-500/50 transition-all" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-admin-text dark:bg-white text-admin-bg dark:text-black py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg mt-4 flex items-center justify-center gap-2">
                  <Save size={18} /> {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
