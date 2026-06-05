import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen text-carbon-black-100">
      <Navbar />
      <main className="min-h-[calc(100vh-72px)]">
        {children}
      </main>
      <footer className="bg-carbon-black-500 text-white py-16 px-6 mt-16 border-t border-tea-green-500/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-serif font-black text-sm">V</div>
              <span className="text-base font-black tracking-widest uppercase">Veloce</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">Premium products. Simple shopping. Great prices.</p>
          </div>
          <div>
            <h4 className="font-bold text-xs mb-4 uppercase tracking-widest text-emerald-glow">Shop</h4>
            <ul className="text-gray-400 text-xs space-y-2.5">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Best Sellers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs mb-4 uppercase tracking-widest text-emerald-glow">Support</h4>
            <ul className="text-gray-400 text-xs space-y-2.5">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-white/5 text-center text-gray-500 text-[10px] uppercase tracking-widest">
          © 2026 Veloce Store
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
