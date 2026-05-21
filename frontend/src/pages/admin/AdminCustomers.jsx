import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Shield, User as UserIcon, Trash2, ShieldAlert, Plus, X, Save, Lock, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosConfig';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'USER' });

  const fetchUsers = () => {
    setLoading(true);
    api.get('/users')
      .then(res => { setCustomers(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = customers.filter(c => 
    c.username.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase())
  );

  const openCreate = () => {
    setEditingUser(null);
    setFormData({ username: '', email: '', password: '', role: 'USER' });
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email, password: '', role: user.role });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // For editing, only send password if it's not empty
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await api.put(`/users/${editingUser.id}`, { ...editingUser, ...payload });
      } else {
        await api.post('/users', formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert('Error saving user: ' + (err.response?.data || err.message));
    }
  };

  const toggleRole = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Change ${user.username}'s role to ${newRole}?`)) return;
    try {
      await api.put(`/users/${user.id}`, { ...user, role: newRole });
      fetchUsers();
    } catch { alert('Error updating user role'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Permanently delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch { alert('Error deleting user'); }
  };

  if (loading) {
    return <div className="flex flex-col items-center justify-center h-[60vh] gap-2"><div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div><p className="text-xs font-bold text-admin-muted uppercase tracking-widest">Loading Customers...</p></div>;
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-admin-text mb-1">Customers & Staff</h1>
          <p className="text-sm text-admin-muted font-medium">{customers.length} registered accounts in the system.</p>
        </div>
        <button 
          onClick={openCreate} 
          className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-admin-bg/50 border-b border-admin-border">
                <th className="text-[10px] font-bold text-admin-muted uppercase tracking-widest px-8 py-4">User</th>
                <th className="text-[10px] font-bold text-admin-muted uppercase tracking-widest px-8 py-4 hidden md:table-cell">Email Address</th>
                <th className="text-[10px] font-bold text-admin-muted uppercase tracking-widest px-8 py-4 text-center">Authorization</th>
                <th className="text-right text-[10px] font-bold text-admin-muted uppercase tracking-widest px-8 py-4 w-48">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-admin-bg border border-admin-border rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-all">
                        <UserIcon size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-admin-text leading-none mb-1">{user.username}</span>
                        <span className="text-[10px] font-bold text-admin-muted uppercase tracking-wider opacity-60">ID: #{user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 hidden md:table-cell text-xs text-admin-muted font-medium">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="opacity-50" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'ADMIN' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-gray-100 dark:bg-white/5 text-admin-muted'
                    }`}>
                      <Shield size={12} /> {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(user)} className="p-2 text-admin-muted hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all border border-transparent hover:border-emerald-500/20" title="Edit User">
                        <UserPlus size={16} />
                      </button>
                      <button onClick={() => toggleRole(user)} className="p-2 text-admin-muted hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all border border-transparent hover:border-amber-500/20" title="Toggle Role">
                        <ShieldAlert size={16} />
                      </button>
                      <button onClick={() => deleteUser(user.id)} className="p-2 text-admin-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20" title="Delete Account">
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
                <h2 className="text-xl font-bold text-admin-text">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-admin-muted uppercase tracking-wider">Username</label>
                  <input required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-emerald-500/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-admin-muted uppercase tracking-wider">Email Address</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-emerald-500/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-admin-muted uppercase tracking-wider">{editingUser ? 'New Password (Optional)' : 'Password'}</label>
                  <div className="relative">
                    <input required={!editingUser} type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-emerald-500/50 transition-all" />
                    <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-admin-muted opacity-50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-admin-muted uppercase tracking-wider">Role</label>
                  <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer">
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-admin-text dark:bg-white text-admin-bg dark:text-black py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg mt-4 flex items-center justify-center gap-2">
                  <Save size={18} /> {editingUser ? 'Save Changes' : 'Create Account'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCustomers;
