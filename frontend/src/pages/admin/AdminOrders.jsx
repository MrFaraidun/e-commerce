import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Search as SearchIcon, Filter, X, ShoppingBag, Calendar, RefreshCcw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { orderService } from '../../services/orderService';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    orderService.getAll()
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o => {
    const matchesSearch = o.id.toString().includes(query) || o.status.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusStyle = {
    Completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', icon: CheckCircle },
    Processing: { bg: 'bg-amber-500/10', text: 'text-amber-500', icon: RefreshCcw },
    Cancelled: { bg: 'bg-red-500/10', text: 'text-red-500', icon: XCircle },
    Pending: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: Clock },
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await orderService.updateStatus(id, newStatus);
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch { alert('Error updating order status'); }
  };

  if (loading) {
    return <div className="flex flex-col items-center justify-center h-[60vh] gap-2"><div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div><p className="text-xs font-bold text-admin-muted uppercase tracking-widest">Loading Orders...</p></div>;
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-admin-text mb-1">Orders</h1>
          <p className="text-sm text-admin-muted font-medium">{orders.length} total transactions recorded.</p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all border ${
              statusFilter !== 'All' 
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10' 
                : 'bg-admin-card border-admin-border text-admin-text hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            <Filter size={18} /> {statusFilter === 'All' ? 'Filter Status' : statusFilter} <ChevronDown size={14} className={showFilters ? 'rotate-180' : ''} />
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-3 w-56 bg-admin-card border border-admin-border rounded-xl shadow-xl z-50 p-2 overflow-hidden">
                {['All', 'Pending', 'Processing', 'Completed', 'Cancelled'].map(status => (
                  <button key={status} onClick={() => { setStatusFilter(status); setShowFilters(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === status ? 'bg-emerald-500/10 text-emerald-500' : 'text-admin-muted hover:bg-gray-100 dark:hover:bg-white/5 hover:text-admin-text'}`}>
                    {status}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-admin-bg/50 border-b border-admin-border">
                <th className="text-[10px] font-bold text-admin-muted uppercase tracking-widest px-8 py-4">Order ID</th>
                <th className="text-[10px] font-bold text-admin-muted uppercase tracking-widest px-8 py-4 hidden md:table-cell">Date</th>
                <th className="text-[10px] font-bold text-admin-muted uppercase tracking-widest px-8 py-4">Total Price</th>
                <th className="text-[10px] font-bold text-admin-muted uppercase tracking-widest px-8 py-4">Status</th>
                <th className="text-right text-[10px] font-bold text-admin-muted uppercase tracking-widest px-8 py-4 w-48">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {filtered.map(order => {
                const s = statusStyle[order.status] || statusStyle.Pending;
                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-8 py-5 font-bold text-sm text-admin-text">#ORD-{order.id}</td>
                    <td className="px-8 py-5 hidden md:table-cell text-xs text-admin-muted font-medium">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-8 py-5 font-bold text-sm text-admin-text">${order.totalPrice?.toFixed(2)}</td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${s.bg} ${s.text} rounded-lg text-[10px] font-bold uppercase tracking-wider`}>
                        <s.icon size={12} /> {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <select 
                        value={order.status} 
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="bg-admin-bg border border-admin-border rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-admin-muted focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
