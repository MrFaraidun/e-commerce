import { useState, useEffect } from 'react';
import { CreditCard, Truck, CheckCircle2, AlertCircle, Loader2, Plus, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { addressService } from '../services/addressService';

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '', city: '', state: '', zipCode: '', country: ''
  });

  const fetchAddresses = async () => {
    try {
      const data = await addressService.getMyAddresses();
      setAddresses(data);
      if (data.length > 0) setSelectedAddressId(data[0].id);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const saved = await addressService.addAddress(newAddress);
      setAddresses([...addresses, saved]);
      setSelectedAddressId(saved.id);
      setShowAddAddress(false);
      setNewAddress({ street: '', city: '', state: '', zipCode: '', country: '' });
    } catch (err) {
      console.error("Failed to save address:", err);
      setError('Failed to save address.');
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!selectedAddressId) {
      setError('Please select or add a shipping address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderPayload = {
        status: 'Pending',
        totalPrice: parseFloat(totalPrice) || 0,
        shippingAddress: { id: selectedAddressId },
        items: cart.map(item => ({
          quantity: item.quantity,
          price: parseFloat(item.price) || 0,
          product: { id: item.id }
        }))
      };

      await orderService.create(orderPayload);
      setIsOrdered(true);
      setTimeout(() => {
        clearCart();
        navigate('/orders');
      }, 3000);
    } catch (err) {
      console.error("Order failed:", err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center px-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20"
        >
          <CheckCircle2 size={40} />
        </motion.div>
        <h2 className="text-2xl font-bold text-admin-text mb-2 text-center">Order Confirmed!</h2>
        <p className="text-admin-muted text-sm text-center">Your request has been securely processed. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-20 px-6 max-w-5xl mx-auto text-left">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-admin-text mb-2 tracking-tight">Checkout</h1>
        <p className="text-sm text-admin-muted font-medium">Complete your purchase securely.</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <div className="bg-admin-card border border-admin-border rounded-2xl p-8 shadow-sm">
            <div className="space-y-10">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                      <Truck size={18} />
                    </div>
                    <h2 className="text-sm font-bold text-admin-text uppercase tracking-widest">Shipping Address</h2>
                  </div>
                  {!showAddAddress && (
                    <button 
                      onClick={() => setShowAddAddress(true)}
                      className="flex items-center gap-2 text-[11px] font-bold text-emerald-500 uppercase tracking-wider hover:text-emerald-400 transition-colors"
                    >
                      <Plus size={14} /> Add New
                    </button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {showAddAddress ? (
                    <motion.form 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleAddAddress} 
                      className="space-y-4 bg-admin-bg p-6 rounded-2xl border border-admin-border"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input required type="text" placeholder="Street Address" value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} className="sm:col-span-2 bg-admin-card border border-admin-border rounded-xl px-4 py-3.5 text-sm text-admin-text focus:outline-none focus:border-emerald-500 transition-all" />
                        <input required type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} className="bg-admin-card border border-admin-border rounded-xl px-4 py-3.5 text-sm text-admin-text focus:outline-none focus:border-emerald-500 transition-all" />
                        <input required type="text" placeholder="State/Province" value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} className="bg-admin-card border border-admin-border rounded-xl px-4 py-3.5 text-sm text-admin-text focus:outline-none focus:border-emerald-500 transition-all" />
                        <input required type="text" placeholder="Zip Code" value={newAddress.zipCode} onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})} className="bg-admin-card border border-admin-border rounded-xl px-4 py-3.5 text-sm text-admin-text focus:outline-none focus:border-emerald-500 transition-all" />
                        <input required type="text" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({...newAddress, country: e.target.value})} className="bg-admin-card border border-admin-border rounded-xl px-4 py-3.5 text-sm text-admin-text focus:outline-none focus:border-emerald-500 transition-all" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="submit" className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all">Save Address</button>
                        <button type="button" onClick={() => setShowAddAddress(false)} className="px-6 bg-admin-border text-admin-muted py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-admin-border/80 transition-all">Cancel</button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-1 gap-3"
                    >
                      {addresses.length > 0 ? (
                        addresses.map((addr) => (
                          <div 
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                              selectedAddressId === addr.id 
                                ? 'bg-emerald-500/5 border-emerald-500 shadow-sm shadow-emerald-500/10' 
                                : 'bg-admin-bg border-admin-border hover:border-admin-muted'
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${selectedAddressId === addr.id ? 'bg-emerald-500 text-white' : 'bg-admin-card text-admin-muted'}`}>
                              <MapPin size={16} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-admin-text">{addr.street}</p>
                              <p className="text-xs text-admin-muted mt-0.5">{addr.city}, {addr.state} {addr.zipCode}</p>
                              <p className="text-[10px] font-black text-admin-muted uppercase tracking-widest mt-1.5">{addr.country}</p>
                            </div>
                            {selectedAddressId === addr.id && (
                              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                                <CheckCircle2 size={12} />
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="py-12 flex flex-col items-center justify-center bg-admin-bg rounded-2xl border border-dashed border-admin-border text-admin-muted">
                          <MapPin size={32} className="mb-4 opacity-20" />
                          <p className="text-sm font-medium mb-4">No addresses saved yet.</p>
                          <button onClick={() => setShowAddAddress(true)} className="px-6 py-2.5 bg-admin-card border border-admin-border rounded-xl text-xs font-bold uppercase tracking-widest hover:border-emerald-500 transition-all">Add First Address</button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <CreditCard size={18} />
                  </div>
                  <h2 className="text-sm font-bold text-admin-text uppercase tracking-widest">Payment Method</h2>
                </div>
                <div className="p-6 bg-admin-bg border border-admin-border rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-admin-card border border-admin-border rounded flex items-center justify-center text-[10px] font-black text-admin-muted italic">VISA</div>
                    <div>
                      <p className="text-sm font-bold text-admin-text">Cash on Delivery</p>
                      <p className="text-xs text-admin-muted mt-0.5">Pay when you receive your items.</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                    <CheckCircle2 size={12} />
                  </div>
                </div>
              </section>

              <button 
                onClick={handleOrder}
                disabled={loading || cart.length === 0 || !selectedAddressId}
                className="w-full bg-admin-text dark:bg-white text-admin-bg dark:text-black py-4.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Confirm Order'} — ${totalPrice}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-admin-card border border-admin-border rounded-2xl p-8 sticky top-28 shadow-sm">
            <h2 className="text-lg font-bold text-admin-text mb-2">Order Summary</h2>
            <p className="text-xs text-admin-muted font-medium mb-8">Includes all taxes and priority shipping.</p>
            
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-admin-muted font-medium">{item.quantity}x {item.name}</span>
                  <span className="text-admin-text font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-admin-border">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-admin-muted uppercase tracking-widest">Total Amount</span>
                <span className="text-3xl font-bold text-admin-text tracking-tighter">${totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Checkout;
