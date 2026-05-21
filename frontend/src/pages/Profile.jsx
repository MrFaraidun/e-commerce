import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Heart, LogOut, Shield, ExternalLink, Loader2, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Profile = () => {
  const { user, logout, isAdmin } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get('/orders/my-orders')
        .then(res => {
          setOrderCount(res.data.length);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-admin-bg py-16 px-6 overflow-hidden">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-5xl mx-auto space-y-12"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-admin-border pb-10 text-left">
          <div>
            <h1 className="text-4xl font-bold text-admin-text mb-2 tracking-tight">Account Overview</h1>
            <p className="text-sm text-admin-muted font-medium">Review your shopping activity and profile status.</p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10">
                Admin Dashboard <ExternalLink size={14} />
              </Link>
            )}
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 px-5 py-3 rounded-xl transition-all text-xs font-bold border border-transparent hover:border-red-500/20">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </motion.div>

        {/* Profile Identity */}
        <motion.div 
          variants={itemVariants}
          className="w-full bg-admin-card border border-admin-border p-12 rounded-[2rem] flex flex-col md:flex-row items-center md:items-start gap-10 group shadow-sm text-center md:text-left"
        >
          <div className="relative">
            <div className="w-28 h-28 bg-admin-bg border-4 border-admin-border rounded-[2rem] flex items-center justify-center text-admin-text text-5xl font-bold shadow-xl relative z-10 group-hover:scale-105 transition-transform">
              {user.username?.charAt(0)?.toUpperCase()}
            </div>
            <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          
          <div className="space-y-6 flex-1">
            <div>
              <h2 className="text-4xl font-bold text-admin-text mb-2 tracking-tighter">{user.username}</h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-admin-muted">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border flex items-center gap-2 ${
                isAdmin ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
              }`}>
                <Shield size={12} /> {isAdmin ? 'Authorized Administrator' : 'Standard Account'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Activity Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants} className="bg-admin-card border border-admin-border p-10 rounded-[2rem] group shadow-sm hover:shadow-md transition-all">
            <Link to="/orders" className="flex flex-col justify-between h-full w-full gap-12">
              <div className="flex justify-between items-start">
                <div className="p-5 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform">
                  <Package size={32} />
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">Sync Complete</span>
              </div>
              <div className="text-left">
                <h3 className="text-admin-muted font-bold text-[11px] uppercase tracking-widest mb-3 opacity-60">Total Orders Placed</h3>
                <div className="flex items-baseline gap-4">
                  {loading ? <Loader2 size={32} className="animate-spin text-admin-muted" /> : <p className="text-7xl font-bold text-admin-text tracking-tighter">{orderCount}</p>}
                  <p className="text-xs text-admin-muted font-bold uppercase tracking-widest">Transactions</p>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-admin-card border border-admin-border p-10 rounded-[2rem] group shadow-sm hover:shadow-md transition-all">
            <Link to="/wishlist" className="flex flex-col justify-between h-full w-full gap-12">
              <div className="flex justify-between items-start">
                <div className="p-5 bg-red-500/10 rounded-2xl text-red-500 group-hover:scale-110 transition-transform">
                  <Heart size={32} fill={wishlist.length > 0 ? "currentColor" : "none"} />
                </div>
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20">Saved Items</span>
              </div>
              <div className="text-left">
                <h3 className="text-admin-muted font-bold text-[11px] uppercase tracking-widest mb-3 opacity-60">Your Wishlist</h3>
                <div className="flex items-baseline gap-4">
                  <p className="text-7xl font-bold text-admin-text tracking-tighter">{wishlist.length}</p>
                  <p className="text-xs text-admin-muted font-bold uppercase tracking-widest">Products</p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Info Box */}
        <motion.div variants={itemVariants} className="bg-admin-card border border-admin-border p-8 rounded-[2rem] text-center">
          <p className="text-xs text-admin-muted font-medium italic">
            "More profile features like saved addresses and payment management are coming soon in a future update."
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
