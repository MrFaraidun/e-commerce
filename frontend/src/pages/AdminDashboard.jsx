import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, DollarSign, Users, ArrowUpRight, ArrowDownRight, ShoppingBag, BarChart2, Search as SearchIcon, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    Promise.all([
      productService.getAll().catch(() => []),
      userService.getAll().catch(() => []),
      orderService.getAll().catch(() => [])
    ]).then(([prodData, userData, orderData]) => {
      setProducts(prodData || []);
      setUsers(userData || []);
      setOrders(orderData || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-admin-muted uppercase tracking-widest">Loading Dashboard...</p>
      </div>
    );
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(query.toLowerCase())
  );

  const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const salesGoalPercent = Math.min(Math.round((totalRevenue / 10000) * 100), 100);
  const productAvailabilityPercent = Math.min(Math.round((products.length / 50) * 100), 100);
  const customerEngagement = users.length > 0 ? 92 : 0;

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, change: '+12%', up: true, color: 'emerald' },
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, change: '+24.5%', up: true, color: 'emerald' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, change: '+5.1%', up: true, color: 'emerald' },
    { label: 'Total Customers', value: users.length, icon: Users, change: '+18%', up: true, color: 'emerald' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 lg:space-y-8">
      <div className="text-left mb-6 lg:mb-10">
        <h1 className="text-xl lg:text-2xl font-bold text-admin-text mb-1">Dashboard Overview</h1>
        <p className="text-[11px] lg:text-sm text-admin-muted font-medium">Monitor your store performance and inventory in real-time.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {stats.map(stat => (
          <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-admin-card border border-admin-border p-4 lg:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <stat.icon size={20} className="text-emerald-500" />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            <div className="text-left">
              <p className="text-2xl lg:text-3xl font-bold text-admin-text mb-0.5 tracking-tight">{stat.value}</p>
              <p className="text-[10px] lg:text-xs text-admin-muted font-semibold uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        <div className="lg:col-span-2 bg-admin-card border border-admin-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-admin-border flex items-center justify-between">
            <h2 className="font-bold text-admin-text text-sm">Recently Added Products</h2>
            <Link to="/admin/products" className="text-xs text-emerald-500 hover:underline font-bold uppercase tracking-wider">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-admin-bg/50 border-b border-admin-border">
                  <th className="text-[10px] font-bold text-admin-muted uppercase tracking-widest px-6 py-4">Product</th>
                  <th className="text-[10px] font-bold text-admin-muted uppercase tracking-widest px-6 py-4 hidden md:table-cell">Category</th>
                  <th className="text-right text-[10px] font-bold text-admin-muted uppercase tracking-widest px-6 py-4">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {(query ? filteredProducts : products).slice(0, 5).map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-10 h-10 bg-admin-bg border border-admin-border rounded-lg overflow-hidden shrink-0">
                          {product.imageUrl?.startsWith('http') ? (
                            <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-admin-muted">{product.name?.charAt(0)}</div>
                          )}
                        </div>
                        <span className="font-bold text-sm text-admin-text">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-left">
                      <span className="text-xs text-admin-muted font-medium">{product.category?.name || '—'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-sm text-admin-text">${product.price?.toFixed(2)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-admin-border">
              <h2 className="font-bold text-admin-text text-sm">Quick Insights</h2>
              <BarChart2 size={16} className="text-admin-muted" />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span className="text-admin-muted">Revenue Target</span>
                  <span className="text-emerald-500">{salesGoalPercent}%</span>
                </div>
                <div className="h-1.5 bg-admin-bg border border-admin-border rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${salesGoalPercent}%` }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span className="text-admin-muted">Engagement Index</span>
                  <span className="text-emerald-500">{customerEngagement}%</span>
                </div>
                <div className="h-1.5 bg-admin-bg border border-admin-border rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${customerEngagement}%` }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <Link 
            to="/admin/analytics" 
            className="w-full mt-10 py-3.5 bg-admin-text dark:bg-white text-admin-bg dark:text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            Full Analytics <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
