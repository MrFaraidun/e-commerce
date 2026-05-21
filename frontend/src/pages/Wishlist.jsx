import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist, toggleWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optionally remove from wishlist when adding to cart
    // toggleWishlist(product); 
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tea-green-900 dark:bg-admin-bg py-12 px-6 mesh-gradient">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-left">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-black text-admin-text mb-3 tracking-tighter glow-text"
          >
            My Wishlist
          </motion.h1>
          <p className="text-admin-muted text-sm font-medium">You have {wishlist.length} item(s) saved for later</p>
        </div>

        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-20 text-center flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-6">
              <Heart size={48} />
            </div>
            <h2 className="text-2xl font-bold text-admin-text mb-2">Your wishlist is empty</h2>
            <p className="text-admin-muted text-sm mb-8 max-w-xs mx-auto">Save items you love to keep track of them and buy them later.</p>
            <Link to="/shop" className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">
              Go to Shop <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {wishlist.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card overflow-hidden group hover:premium-shadow"
                >
                  <div className="aspect-square bg-white/5 relative overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl font-black text-admin-muted/20">
                        {product.name?.charAt(0)}
                      </div>
                    )}
                    <button 
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-4 right-4 p-2.5 bg-white dark:bg-black/40 backdrop-blur-md text-red-500 rounded-xl shadow-lg hover:scale-110 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="p-6 text-left">
                    <h3 className="font-bold text-admin-text mb-1 truncate">{product.name}</h3>
                    <p className="text-admin-muted text-xs mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-black text-admin-text">${product.price?.toFixed(2)}</span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-500/80 transition-all shadow-lg shadow-emerald-500/20"
                      >
                        <ShoppingCart size={14} /> Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
