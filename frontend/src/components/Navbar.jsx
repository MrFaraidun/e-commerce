import { useState } from 'react';
import { ShoppingCart, Menu, LogIn, Sun, Moon, X, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between border-b border-admin-border bg-admin-card/80 sticky top-0 z-50 backdrop-blur-xl transition-all">
      <Link to="/" className="flex items-center gap-2 lg:gap-3 hover:opacity-90 transition-all group shrink-0">
        <div className="w-8 h-8 lg:w-9 lg:h-9 bg-neutral-950 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-neutral-950 font-serif font-black shadow-lg group-hover:scale-105 transition-all">
          V
        </div>
        <span className="text-sm lg:text-base font-black tracking-widest text-admin-text hidden sm:block">VELOCE</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-widest text-admin-muted">
        <Link to="/shop" className={`hover:text-admin-text transition-all relative py-1 ${isActive('/shop') ? 'text-emerald-500' : ''}`}>
          Shop
          {isActive('/shop') && <motion.div layoutId="nav-active" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />}
        </Link>
        {isAuthenticated && (
          <Link to="/orders" className={`hover:text-admin-text transition-all relative py-1 ${isActive('/orders') ? 'text-emerald-500' : ''}`}>
            Orders
            {isActive('/orders') && <motion.div layoutId="nav-active" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />}
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin" className="hover:text-emerald-500 transition-all flex items-center gap-2 text-admin-text/80">
            <LayoutDashboard size={14} className="text-emerald-500" /> Dashboard
          </Link>
        )}
      </div>

      <div className="flex items-center gap-1 lg:gap-2">
        <button onClick={toggleTheme} className="hidden sm:flex p-2 lg:p-2.5 text-admin-muted hover:text-admin-text transition-all rounded-xl hover:bg-gray-100 dark:hover:bg-white/5">
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Link to="/cart" className={`p-2.5 text-admin-muted hover:text-admin-text transition-all relative rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 ${isActive('/cart') ? 'text-emerald-500 bg-emerald-500/5' : ''}`}>
          <ShoppingCart size={18} />
          {totalItems > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-admin-card shadow-sm">
              {totalItems}
            </span>
          )}
        </Link>
        
        {isAuthenticated && user ? (
          <div className="flex items-center gap-1 lg:gap-2 pl-2 border-l border-admin-border ml-1 lg:ml-2">
            <Link to="/profile" className={`flex items-center gap-3 px-2 lg:px-3 py-2 rounded-xl transition-all group ${isActive('/profile') ? 'bg-emerald-500/10' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>
              <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center text-[10px] lg:text-xs font-bold transition-all ${isActive('/profile') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-admin-bg border border-admin-border text-admin-text'}`}>
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-widest hidden lg:block ${isActive('/profile') ? 'text-emerald-500' : 'text-admin-muted group-hover:text-admin-text'}`}>
                {user?.username?.split(' ')[0] || 'User'}
              </span>
            </Link>
            <button onClick={handleLogout} className="hidden sm:flex p-2 lg:p-2.5 text-admin-muted hover:text-red-500 transition-all rounded-xl hover:bg-red-500/5" title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link to="/auth" className="flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 bg-admin-text dark:bg-white text-admin-bg dark:text-black rounded-xl text-[10px] lg:text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg ml-1 lg:ml-2">
            Sign In
          </Link>
        )}
        
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2.5 text-admin-text hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl ml-1 transition-all">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[73px] left-0 right-0 bg-admin-card border-b border-admin-border p-6 flex flex-col gap-2 md:hidden z-50 shadow-2xl"
          >
            <Link to="/shop" onClick={() => setMobileOpen(false)} className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isActive('/shop') ? 'bg-emerald-500/10 text-emerald-500' : 'text-admin-muted hover:bg-gray-100 dark:hover:bg-white/5'}`}>
              Shop {isActive('/shop') && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>}
            </Link>
            {isAuthenticated && (
              <Link to="/orders" onClick={() => setMobileOpen(false)} className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isActive('/orders') ? 'bg-emerald-500/10 text-emerald-500' : 'text-admin-muted hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                My Orders {isActive('/orders') && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>}
              </Link>
            )}
            <Link to="/profile" onClick={() => setMobileOpen(false)} className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isActive('/profile') ? 'bg-emerald-500/10 text-emerald-500' : 'text-admin-muted hover:bg-gray-100 dark:hover:bg-white/5'}`}>
              Profile {isActive('/profile') && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>}
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/5 transition-all">
                Admin Dashboard
              </Link>
            )}
            <button onClick={() => { toggleTheme(); setMobileOpen(false); }} className="sm:hidden flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-admin-muted hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'} {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            {isAuthenticated && (
              <button onClick={handleLogout} className="px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all text-left">
                Sign Out
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
