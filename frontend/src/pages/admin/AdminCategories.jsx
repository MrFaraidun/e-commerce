import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, Save, Search as SearchIcon, Tag, ChevronDown, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosConfig';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', icon: '' });

  const fetchCategories = () => {
    setLoading(true);
    api.get('/categories')
      .then(res => { setCategories(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const openCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', icon: '' });
    setShowModal(true);
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, icon: category.icon || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      alert('Error saving category: ' + (err.response?.data || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Products in this category may become uncategorized.')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch { alert('Error deleting category'); }
  };

  if (loading) {
    return <div className="flex flex-col items-center justify-center h-[60vh] gap-2"><div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div><p className="text-xs font-bold text-admin-muted uppercase tracking-widest">Loading Categories...</p></div>;
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-admin-text mb-1">Categories</h1>
          <p className="text-sm text-admin-muted font-medium">Organize your products into meaningful groupings.</p>
        </div>
        <button 
          onClick={openCreate} 
          className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-admin-bg/50 border-b border-admin-border">
                <th className="text-[10px] font-bold text-admin-muted uppercase tracking-widest px-8 py-4">Category Name</th>
                <th className="text-[10px] font-bold text-admin-muted uppercase tracking-widest px-8 py-4 hidden md:table-cell">Icon / Ref</th>
                <th className="text-right text-[10px] font-bold text-admin-muted uppercase tracking-widest px-8 py-4 w-48">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {filtered.map(category => (
                <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-admin-bg border border-admin-border rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-all">
                        <Tag size={18} />
                      </div>
                      <span className="font-bold text-sm text-admin-text">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 hidden md:table-cell text-left text-xs text-admin-muted font-medium">
                    {category.icon || 'No specific icon'}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(category)} className="p-2 text-admin-muted hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all border border-transparent hover:border-emerald-500/20">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="p-2 text-admin-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 10 }} 
              className="bg-admin-card border border-admin-border rounded-2xl p-8 max-w-lg w-full shadow-2xl relative z-10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-admin-text">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-admin-muted uppercase tracking-wider">Category Name</label>
                  <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-emerald-500/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-admin-muted uppercase tracking-wider">Icon / Metadata Reference</label>
                  <input value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-emerald-500/50 transition-all" placeholder="e.g. ELECTRONICS" />
                </div>
                <button type="submit" className="w-full bg-admin-text dark:bg-white text-admin-bg dark:text-black py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg mt-4 flex items-center justify-center gap-2">
                  <Save size={18} /> {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;
