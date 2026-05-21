import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, CreditCard, MapPin, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { orderService } from '../services/orderService';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getById(id);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const getStatusInfo = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: <Clock size={20} />, label: 'Pending' };
      case 'SHIPPED': return { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: <Truck size={20} />, label: 'Shipped' };
      case 'DELIVERED':
      case 'COMPLETED': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: <CheckCircle size={20} />, label: 'Completed' };
      case 'CANCELLED': return { color: 'text-red-500', bg: 'bg-red-500/10', icon: <XCircle size={20} />, label: 'Cancelled' };
      default: return { color: 'text-gray-500', bg: 'bg-gray-500/10', icon: <Package size={20} />, label: 'Processing' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-tea-green-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-tea-green-900 flex flex-col items-center justify-center text-admin-text p-6">
        <Package size={60} className="text-admin-muted mb-4" />
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-admin-muted mb-8 text-center max-w-md">We couldn't find the order you're looking for. It might have been deleted or moved.</p>
        <Link to="/orders" className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const status = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-tea-green-900 dark:bg-admin-bg mesh-gradient py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Link to="/orders" className="p-3 bg-white/5 border border-admin-border rounded-2xl hover:bg-white/10 transition-all text-admin-text">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-4xl font-black text-admin-text tracking-tighter glow-text">Order #{order.id}</h1>
              <div className="flex items-center gap-4 text-sm text-admin-muted mt-1">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(order.orderDate).toLocaleDateString()}</span>
                <span className="w-1 h-1 bg-admin-muted rounded-full"></span>
                <span className="font-bold text-admin-text">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 font-bold ${status.color} ${status.bg} border-current/20`}>
            {status.icon} {status.label}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card overflow-hidden">
              <div className="px-8 py-6 border-b border-admin-border bg-admin-card/50">
                <h3 className="text-lg font-bold text-admin-text flex items-center gap-2">
                  <Package size={18} className="text-emerald-500" /> Order Items
                </h3>
              </div>
              <div className="divide-y divide-admin-border/50">
                {order.items?.map((item) => (
                  <div key={item.id} className="p-8 flex items-center gap-6 group hover:bg-white/[0.02] transition-colors">
                    <div className="w-20 h-20 bg-white/5 rounded-2xl border border-admin-border overflow-hidden shrink-0">
                      {item.product?.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-admin-muted">
                          {item.product?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-admin-text mb-1 group-hover:text-emerald-500 transition-colors">{item.product?.name}</h4>
                      <p className="text-sm text-admin-muted line-clamp-1">{item.product?.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-admin-text font-black">${item.price.toFixed(2)}</div>
                      <div className="text-xs text-admin-muted">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-admin-card/50 flex justify-between items-center border-t border-admin-border">
                <span className="text-admin-muted font-bold">Total Amount</span>
                <span className="text-3xl font-black text-admin-text tracking-tighter glow-text">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Sidebar: Details */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="glass-card p-8">
              <h3 className="text-lg font-bold text-admin-text mb-6 flex items-center gap-2 border-b border-admin-border pb-4">
                <CreditCard size={18} className="text-emerald-500" /> Customer Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-admin-muted mb-1 block">Full Name</label>
                  <div className="text-admin-text font-bold">{order.user?.username || 'Guest'}</div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-admin-muted mb-1 block">Email Address</label>
                  <div className="text-admin-text font-bold">{order.user?.email}</div>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="glass-card p-8">
              <h3 className="text-lg font-bold text-admin-text mb-6 flex items-center gap-2 border-b border-admin-border pb-4">
                <MapPin size={18} className="text-emerald-500" /> Shipping Details
              </h3>
              <div className="space-y-4">
                {order.shippingAddress ? (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
                      <Truck size={18} />
                    </div>
                    <div>
                      <p className="text-admin-text font-bold text-sm leading-tight">{order.shippingAddress.street}</p>
                      <p className="text-admin-muted text-xs mt-1">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-2">{order.shippingAddress.country}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                      <Truck size={14} />
                    </div>
                    <p className="text-sm text-admin-muted italic">
                      Standard Priority Shipping to your saved address.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
