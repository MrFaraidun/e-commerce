import { useEffect, useState } from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    Promise.all([
      productService.getAll().catch(() => []),
      categoryService.getAll().catch(() => [])
    ]).then(([prodData, catData]) => {
      setProducts(prodData);
      setCategories(catData);
      setLoading(false);
    });
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
      p.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.assign('/auth');
      return;
    }
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-glow/20 border-t-emerald-glow rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dusty-olive-600 font-semibold">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-carbon-black-100 mb-3 tracking-tight"
        >
          Shop
        </motion.h1>
        <p className="text-dusty-olive-600 text-sm font-medium">Discover premium products curated for you</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="flex-1 bg-tea-green-800 border border-tea-green-500 rounded-2xl px-5 py-3 flex items-center gap-3 focus-within:border-emerald-glow/50 transition-all">
          <Search size={18} className="text-dusty-olive-600 shrink-0" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent focus:outline-none text-sm w-full text-carbon-black-100 placeholder:text-dusty-olive-600" 
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'All' 
                ? 'bg-emerald-glow text-white shadow-lg shadow-emerald-glow/20' 
                : 'bg-tea-green-800 text-dusty-olive-600 border border-tea-green-500 hover:border-emerald-glow/30'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.name 
                  ? 'bg-emerald-glow text-white shadow-lg shadow-emerald-glow/20' 
                  : 'bg-tea-green-800 text-dusty-olive-600 border border-tea-green-500 hover:border-emerald-glow/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-dusty-olive-600 mb-6 font-semibold">
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-dusty-olive-600 font-bold text-lg mb-2">No products found</p>
          <p className="text-dusty-olive-600 text-sm">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Link to={`/product/${product.id}`} className="block group">
                <div className="bg-tea-green-800/50 border border-tea-green-500 rounded-2xl overflow-hidden hover:border-emerald-glow/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-glow/5 hover:-translate-y-1">
                  {/* Image */}
                  <div className="aspect-square bg-tea-green-700/30 overflow-hidden relative">
                    {product.imageUrl && product.imageUrl.startsWith('http') ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl font-black text-tea-green-500/30">{product.name?.charAt(0)}</span>
                      </div>
                    )}
                    {product.category?.name && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-carbon-black-100/70 backdrop-blur-sm text-white rounded-full text-[10px] font-bold">
                        {product.category.name}
                      </span>
                    )}
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
                      className="absolute top-3 right-3 p-2.5 rounded-xl bg-white/10 dark:bg-black/40 backdrop-blur-md transition-all shadow-lg active:scale-75 z-20 cursor-pointer group/heart"
                    >
                      <Heart 
                        size={18} 
                        className={`transition-all duration-300 ${
                          isInWishlist(product.id) 
                            ? 'text-red-500 fill-red-500 scale-110' 
                            : 'text-white group-hover/heart:text-red-400'
                        }`} 
                      />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-carbon-black-100 mb-1 group-hover:text-emerald-glow transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-dusty-olive-600 text-xs leading-relaxed mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-carbon-black-100">${product.price?.toFixed(2)}</span>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-10 h-10 bg-emerald-glow text-white rounded-xl flex items-center justify-center hover:bg-emerald-glow/80 transition-all shadow-md shadow-emerald-glow/20 active:scale-95"
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
