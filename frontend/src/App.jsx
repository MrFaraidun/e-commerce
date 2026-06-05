import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import AdminLayout from './layout/AdminLayout';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Sparkles, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="min-h-[70vh] lg:min-h-[85vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden py-10 lg:py-0">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-emerald-glow/5 rounded-full blur-[80px] lg:blur-[120px] -z-10"></div>
    
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-6 lg:mb-8">
      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-neutral-950 dark:bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 shadow-2xl border border-white/10 dark:border-black/5 hover:rotate-6 transition-transform duration-300">
        <span className="text-2xl lg:text-3xl font-serif font-black text-white dark:text-neutral-950">V</span>
      </div>
      <h1 className="text-4xl md:text-7xl font-black text-carbon-black-100 mb-4 tracking-tight leading-tight">
        Veloce <span className="text-emerald-glow">Store</span>
      </h1>
      <p className="text-dusty-olive-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
        Discover premium products at great prices. Quality meets convenience in one beautiful store.
      </p>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-12 lg:mb-16 w-full sm:w-auto">
      <Link to="/shop" className="flex items-center justify-center gap-2 bg-emerald-glow text-white px-6 py-3.5 lg:px-8 lg:py-4 rounded-2xl font-bold hover:bg-emerald-glow/80 transition-all shadow-xl shadow-emerald-glow/20 active:scale-95 text-sm lg:text-base">
        <ShoppingBag size={18} /> Start Shopping <ArrowRight size={16} />
      </Link>
      <Link to="/auth" className="flex items-center justify-center gap-2 bg-tea-green-800 text-carbon-black-100 border border-tea-green-500 px-6 py-3.5 lg:px-8 lg:py-4 rounded-2xl font-bold hover:border-emerald-glow/30 transition-all text-sm lg:text-base">
        Create Account
      </Link>
    </motion.div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap justify-center gap-4">
      {[
        { icon: ShoppingBag, text: 'Free Shipping' },
        { icon: Shield, text: 'Secure Checkout' },
        { icon: Sparkles, text: 'Premium Quality' },
      ].map(({ icon: Icon, text }) => (
        <div key={text} className="flex items-center gap-2 px-4 py-2 bg-tea-green-800/50 border border-tea-green-500 rounded-full text-xs font-semibold text-dusty-olive-600">
          <Icon size={14} className="text-emerald-glow" /> {text}
        </div>
      ))}
    </motion.div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <Routes>
                {/* Storefront — uses MainLayout */}
                <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                <Route path="/auth" element={<MainLayout><Auth /></MainLayout>} />
                <Route path="/shop" element={<MainLayout><Shop /></MainLayout>} />
                <Route path="/product/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
                <Route path="/cart" element={<MainLayout><ProtectedRoute><Cart /></ProtectedRoute></MainLayout>} />
                <Route path="/checkout" element={<MainLayout><ProtectedRoute><Checkout /></ProtectedRoute></MainLayout>} />
                <Route path="/profile" element={<MainLayout><ProtectedRoute><Profile /></ProtectedRoute></MainLayout>} />
                <Route path="/wishlist" element={<MainLayout><ProtectedRoute><Wishlist /></ProtectedRoute></MainLayout>} />
                <Route path="/orders" element={<MainLayout><ProtectedRoute><Orders /></ProtectedRoute></MainLayout>} />
                <Route path="/orders/:id" element={<MainLayout><ProtectedRoute><OrderDetails /></ProtectedRoute></MainLayout>} />

                {/* Admin Panel — uses AdminLayout */}
                <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
                <Route path="/admin/customers" element={<AdminRoute><AdminLayout><AdminCustomers /></AdminLayout></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminRoute><AdminLayout><AdminCategories /></AdminLayout></AdminRoute>} />
                <Route path="/admin/analytics" element={<AdminRoute><AdminLayout><AdminAnalytics /></AdminLayout></AdminRoute>} />
              </Routes>
            </Router>
            {/* Watermark Badge */}
            <a
              href="https://faraidun.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="watermark-badge"
            >
              <span className="watermark-dot"></span>
              MADE BY FARAIDUN
            </a>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
