import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const data = await authService.login(formData.email, formData.password);
        login(data.user, data.token);
        navigate('/shop');
      } else {
        await authService.register(formData.name, formData.email, formData.password);
        const data = await authService.login(formData.email, formData.password);
        login(data.user, data.token);
        navigate('/shop');
      }
    } catch (err) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      }
      setError(errorMessage);
      console.error("Auth error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full p-8 md:p-10 bg-tea-green-800/50 border border-tea-green-500 rounded-3xl backdrop-blur-xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-glow rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-glow/30">
            <span className="text-xl font-black text-white">E</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-carbon-black-100 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-dusty-olive-600 text-sm">
            {isLogin ? 'Sign in to your account' : 'Join us to start shopping'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dusty-olive-500" size={18} />
              <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full bg-tea-green-900 border border-tea-green-500 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-emerald-glow/50 transition-all text-sm text-carbon-black-100 placeholder:text-dusty-olive-500" />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dusty-olive-500" size={18} />
            <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full bg-tea-green-900 border border-tea-green-500 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-emerald-glow/50 transition-all text-sm text-carbon-black-100 placeholder:text-dusty-olive-500" />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dusty-olive-500" size={18} />
            <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full bg-tea-green-900 border border-tea-green-500 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-emerald-glow/50 transition-all text-sm text-carbon-black-100 placeholder:text-dusty-olive-500" />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-glow text-white py-3.5 rounded-xl font-bold hover:bg-emerald-glow/80 transition-all active:scale-[0.98] shadow-lg shadow-emerald-glow/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-sm text-dusty-olive-600 hover:text-emerald-glow transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {isLogin && import.meta.env.DEV && (
          <div className="mt-4 p-3 bg-tea-green-800 border border-tea-green-500 rounded-xl text-center">
            <p className="text-[10px] text-dusty-olive-600 font-semibold mb-1">Demo Accounts</p>
            <p className="text-[11px] text-dusty-olive-500">Admin: admin@enterprise.com / admin123</p>
            <p className="text-[11px] text-dusty-olive-500">User: user@enterprise.com / user123</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
