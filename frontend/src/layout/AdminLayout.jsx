import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Package, Users, ShoppingBag,
  LogOut, ChevronLeft, ChevronRight,
  Store, Bell, Search, BarChart3, Tag, Sun, Moon, X,
  UserPlus, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosConfig';

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const notificationRef = useRef(null);

  useEffect(() => {
    const fetchNotificationData = async () => {
      try {
        const [ordersRes, usersRes] = await Promise.all([
          api.get('/orders').catch(() => ({ data: [] })),
          api.get('/users').catch(() => ({ data: [] }))
        ]);

        const realNotifications = [];
        const dismissedIds = JSON.parse(localStorage.getItem('dismissed_notifications') || '[]');
        const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');

        const recentOrders = (ordersRes.data || [])
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
          .slice(0, 5);

        recentOrders.forEach(o => {
          const id = `order-${o.id}`;
          if (!dismissedIds.includes(id)) {
            realNotifications.push({
              id,
              title: 'New Order',
              message: `Order #ORD-${o.id} for $${o.totalPrice.toFixed(2)}.`,
              time: new Date(o.orderDate).toLocaleDateString(),
              type: 'order',
              unread: o.status === 'Pending' && !readIds.includes(id)
            });
          }
        });

        const recentUsers = (usersRes.data || []).slice(-2);
        recentUsers.forEach(u => {
          const id = `user-${u.id}`;
          if (!dismissedIds.includes(id)) {
            realNotifications.push({
              id,
              title: 'New User',
              message: `${u.username} joined the platform.`,
              time: 'Recent',
              type: 'user',
              unread: !readIds.includes(id)
            });
          }
        });

        setNotifications(realNotifications);
        setLoadingNotifications(false);
      } catch (err) {
        setLoadingNotifications(false);
      }
    };
    fetchNotificationData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');
    const newRead = Array.from(new Set([...readIds, ...allIds]));
    localStorage.setItem('read_notifications', JSON.stringify(newRead));
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const dismissNotification = (id) => {
    const dismissedIds = JSON.parse(localStorage.getItem('dismissed_notifications') || '[]');
    const newDismissed = [...dismissedIds, id];
    localStorage.setItem('dismissed_notifications', JSON.stringify(newDismissed));
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (searchInput !== q) {
      setSearchInput(q);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q) searchParams.set('q', q);
    else searchParams.delete('q');
    setSearchParams(searchParams);
  };

  const clearSearch = () => {
    setSearchInput('');
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Customers = Users; // Alias for cleaner mapping

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/customers', icon: Customers, label: 'Customers' },
    { path: '/admin/categories', icon: Tag, label: 'Categories' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-admin-bg text-admin-text transition-colors duration-300 overflow-hidden font-sans relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative top-0 left-0 h-full z-50
        ${collapsed ? 'w-[80px]' : 'w-[260px]'} 
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-admin-card border-r border-admin-border flex flex-col transition-all duration-300 shrink-0 shadow-sm
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-admin-border">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg shadow-emerald-500/20">
            E
          </div>
          {!collapsed && (
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm text-admin-text leading-none mb-1">Ecommerce</span>
              <span className="text-[10px] font-semibold text-admin-muted uppercase tracking-wider">Admin Panel</span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {!collapsed && <p className="text-[10px] font-bold text-admin-muted uppercase tracking-widest mb-4 ml-2 opacity-50">Main Menu</p>}
          {menuItems.map(item => {
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${active
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                  : 'text-admin-muted hover:text-admin-text hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
              >
                <item.icon size={18} className={`shrink-0 ${active ? 'text-white' : 'text-admin-muted group-hover:text-emerald-500'}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-admin-border space-y-1">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-admin-muted hover:text-admin-text hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
            {isDarkMode ? <Sun size={18} className="shrink-0" /> : <Moon size={18} className="shrink-0" />}
            {!collapsed && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-admin-muted hover:text-admin-text hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
            <Store size={18} className="shrink-0" />
            {!collapsed && <span>View Store</span>}
          </Link>

          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-admin-muted hover:text-red-500 hover:bg-red-500/5 transition-all">
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>

          <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center p-2 mt-2 text-admin-muted hover:text-admin-text transition-all">
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-admin-card border-b border-admin-border flex items-center justify-between px-4 lg:px-8 shrink-0 z-30 transition-all">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-admin-muted hover:text-admin-text hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all"
            >
              <LayoutDashboard size={20} />
            </button>

            <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-3 bg-gray-100 dark:bg-white/5 border border-admin-border rounded-xl px-4 py-2 lg:px-5 lg:py-2.5 w-48 lg:w-96 group focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
              <Search size={18} className="text-admin-muted group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-transparent text-sm text-admin-text placeholder:text-admin-muted focus:outline-none w-full font-medium"
              />
            {searchInput && (
              <button type="button" onClick={clearSearch} className="text-admin-muted hover:text-admin-text p-1">
                <X size={14} />
              </button>
            )}
          </form>
        </div>

        <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2.5 text-admin-muted hover:text-admin-text hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all ${showNotifications ? 'bg-gray-100 dark:bg-white/5 text-admin-text' : ''}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-admin-card">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-admin-card border border-admin-border rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-admin-border flex items-center justify-between bg-gray-50/50 dark:bg-white/2">
                      <h3 className="font-bold text-sm">Notifications</h3>
                      <button onClick={markAllAsRead} className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline">Mark all as read</button>
                    </div>
                    <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                      {loadingNotifications ? (
                        <div className="p-10 flex flex-col items-center gap-2">
                          <div className="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                        </div>
                      ) : notifications.length > 0 ? (
                        <AnimatePresence initial={false}>
                          {notifications.map(n => (
                            <motion.div
                              key={n.id}
                              layout
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className={`p-4 border-b border-admin-border hover:bg-gray-50 dark:hover:bg-white/2 transition-colors flex gap-3 group relative ${n.unread ? 'bg-emerald-500/5' : ''}`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === 'order' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                {n.type === 'order' ? <ShoppingBag size={14} /> : <UserPlus size={14} />}
                              </div>
                              <div className="flex-1 text-left">
                                <p className="text-xs font-bold text-admin-text mb-0.5">{n.title}</p>
                                <p className="text-[11px] text-admin-muted leading-relaxed mb-1">{n.message}</p>
                                <span className="text-[10px] text-gray-400">{n.time}</span>
                              </div>

                              <div className="flex flex-col items-end gap-2 shrink-0">
                                {n.unread && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></div>}
                                <button
                                  onClick={(e) => { e.stopPropagation(); dismissNotification(n.id); }}
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      ) : (
                        <div className="p-10 text-center text-admin-muted">
                          <p className="text-xs">No recent notifications.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-admin-border">
              <div className="w-9 h-9 bg-admin-bg border border-admin-border rounded-xl flex items-center justify-center text-sm font-bold text-admin-text shadow-sm">
                {user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-left leading-tight">
                <p className="text-sm font-bold text-admin-text">{user?.username || 'Admin'}</p>
                <p className="text-[10px] text-admin-muted">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-admin-bg transition-colors duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
