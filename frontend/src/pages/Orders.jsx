import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowLeft, ExternalLink, Calendar, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'SHIPPED': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'DELIVERED':
      case 'COMPLETED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'CANCELLED': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return <Clock size={14} />;
      case 'SHIPPED': return <Truck size={14} />;
      case 'DELIVERED':
      case 'COMPLETED': return <CheckCircle size={14} />;
      case 'CANCELLED': return <XCircle size={14} />;
      default: return <Package size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-tea-green-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tea-green-900 dark:bg-admin-bg mesh-gradient py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Link to="/profile" className="p-3 bg-white/5 border border-admin-border rounded-2xl hover:bg-white/10 transition-all text-admin-text">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-4xl font-black text-admin-text tracking-tighter glow-text">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Package size={40} />
            </div>
            <h2 className="text-2xl font-bold text-admin-text mb-2">No orders yet</h2>
            <p className="text-admin-muted mb-8">Your shopping journey is just one click away!</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
              Explore Shop
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card overflow-hidden group hover:premium-shadow"
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 border-b border-admin-border/50">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 bg-admin-bg/50 rounded-2xl flex items-center justify-center text-admin-text border border-admin-border group-hover:border-emerald-500/30 transition-colors">
                      <Package size={24} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-admin-text">Order #{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-admin-muted">
                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(order.orderDate).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><CreditCard size={12} /> ${order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Link 
                    to={`/orders/${order.id}`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-admin-border rounded-xl text-xs font-bold text-admin-text hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all"
                  >
                    View Details <ExternalLink size={14} />
                  </Link>
                </div>
                
                {/* Mini Item Preview */}
                <div className="bg-admin-bg/20 p-4 flex gap-3 overflow-x-auto no-scrollbar">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-lg border border-admin-border overflow-hidden group/item relative">
                      {item.product?.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-admin-muted bg-admin-bg/50">
                          {item.product?.name?.charAt(0) || 'P'}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">x{item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
