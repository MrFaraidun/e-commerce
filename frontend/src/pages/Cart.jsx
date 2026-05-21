import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-tea-green-800 border border-tea-green-500 rounded-2xl flex items-center justify-center text-dusty-olive-600 mb-6">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-2xl font-black text-carbon-black-100 mb-2">Your cart is empty</h2>
        <p className="text-dusty-olive-600 text-sm mb-6">Browse our shop to find something you love</p>
        <Link to="/shop" className="bg-emerald-glow text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-glow/80 transition-all shadow-lg shadow-emerald-glow/20">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-20 px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-carbon-black-100 mb-8 tracking-tight">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-tea-green-800/50 border border-tea-green-500 rounded-2xl p-4 md:p-5 flex gap-4 items-center"
              >
                <div className="w-20 h-20 bg-tea-green-700/30 rounded-xl shrink-0 flex items-center justify-center overflow-hidden">
                  {item.imageUrl?.startsWith('http') ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-2xl text-tea-green-500/30">{item.name?.charAt(0)}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm text-carbon-black-100 truncate mr-2">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-dusty-olive-600 hover:text-red-500 transition-colors p-1 shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-tea-green-800 border border-tea-green-500 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-dusty-olive-600 hover:text-carbon-black-100"><Minus size={12} /></button>
                      <span className="px-3 text-xs font-bold text-carbon-black-100">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-dusty-olive-600 hover:text-carbon-black-100"><Plus size={12} /></button>
                    </div>
                    <span className="text-sm font-bold text-carbon-black-100">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-tea-green-800/50 border border-tea-green-500 rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-carbon-black-100 mb-6 pb-4 border-b border-tea-green-500">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-dusty-olive-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-dusty-olive-600">
                <span>Shipping</span>
                <span className="text-emerald-glow font-bold">FREE</span>
              </div>
              <div className="pt-3 border-t border-tea-green-500 flex justify-between items-center">
                <span className="font-bold text-carbon-black-100">Total</span>
                <span className="text-xl font-black text-carbon-black-100">${totalPrice}</span>
              </div>
            </div>

            <Link to="/checkout" className="w-full flex items-center justify-center gap-2 bg-emerald-glow text-white py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-glow/80 transition-all shadow-lg shadow-emerald-glow/20 group">
              Checkout
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
