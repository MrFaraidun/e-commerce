import { useState, useEffect } from 'react';
import { ShoppingCart, Star, ArrowLeft, ShieldCheck, Truck, RefreshCw, Minus, Plus, Trash2, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodData, revData] = await Promise.all([
          productService.getById(id),
          reviewService.getProductReviews(id)
        ]);
        setProduct(prodData);
        setReviews(revData);
      } catch (err) {
        console.error("Fetch error:", err);
        setProduct({ id, name: 'Product', price: 0, description: 'Could not load product details.', category: { name: 'Unknown' } });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setReviewLoading(true);
    try {
      const newReview = await reviewService.addReview({
        rating: userRating,
        comment: comment,
        product: { id: parseInt(id) }
      });
      setReviews([newReview, ...reviews]);
      setComment('');
      setUserRating(5);
    } catch (err) {
      console.error("Review failed:", err);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-glow/20 border-t-emerald-glow rounded-full animate-spin"></div>
    </div>
  );

  const handleAddToCart = () => {
    if (!isAuthenticated) { navigate('/auth'); return; }
    addToCart(product, quantity);
    navigate('/cart');
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="pt-6 pb-20 px-6 max-w-7xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-dusty-olive-600 hover:text-emerald-glow transition-colors mb-8 group text-sm font-semibold"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-tea-green-800/50 border border-tea-green-500 rounded-3xl overflow-hidden aspect-square flex items-center justify-center"
        >
          {product.imageUrl && product.imageUrl.startsWith('http') ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[120px] font-black text-tea-green-500/20">{product.name?.charAt(0)}</span>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
          {product.category?.name && (
            <span className="text-xs font-bold text-emerald-glow uppercase tracking-wider mb-3">{product.category.name}</span>
          )}
          <h1 className="text-3xl md:text-4xl font-black text-carbon-black-100 mb-4 tracking-tight">{product.name}</h1>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1 text-emerald-glow">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < Math.round(avgRating) ? "currentColor" : "none"} className={i < Math.round(avgRating) ? "" : "text-dusty-olive-600"} />
              ))}
            </div>
            <span className="text-xs text-dusty-olive-600 font-medium">{avgRating} ({reviews.length} reviews)</span>
          </div>

          <p className="text-3xl font-black text-carbon-black-100 mb-6">${product.price?.toFixed(2)}</p>

          <p className="text-dusty-olive-500 leading-relaxed mb-8 text-sm">{product.description}</p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex items-center bg-tea-green-800 border border-tea-green-500 rounded-xl px-1">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-dusty-olive-600 hover:text-carbon-black-100 transition-colors"><Minus size={16} /></button>
              <span className="px-5 font-bold text-carbon-black-100 text-sm">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-dusty-olive-600 hover:text-carbon-black-100 transition-colors"><Plus size={16} /></button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-glow text-white py-3.5 px-6 rounded-xl font-bold hover:bg-emerald-glow/80 transition-all shadow-lg shadow-emerald-glow/20 active:scale-[0.98]"
            >
              <ShoppingCart size={18} />
              {isAuthenticated ? 'Add to Cart' : 'Sign in to Purchase'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-tea-green-500">
            {[
              { icon: Truck, label: 'Free Shipping' },
              { icon: ShieldCheck, label: 'Warranty' },
              { icon: RefreshCw, label: 'Easy Returns' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs font-semibold text-dusty-olive-600">
                <div className="w-8 h-8 bg-tea-green-800 rounded-lg flex items-center justify-center text-emerald-glow border border-tea-green-500">
                  <Icon size={14} />
                </div>
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <section className="pt-16 border-t border-tea-green-500">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Review List */}
          <div className="flex-1">
            <h2 className="text-2xl font-black text-carbon-black-100 mb-8 tracking-tight">Customer Reviews</h2>
            <div className="space-y-8">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="pb-8 border-b border-tea-green-500/50 last:border-0 group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-tea-green-800 rounded-full flex items-center justify-center text-emerald-glow border border-tea-green-500">
                          <UserIcon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-carbon-black-100">{rev.user?.username || 'Guest User'}</p>
                          <div className="flex items-center gap-1 text-emerald-glow mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "" : "text-dusty-olive-600"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-dusty-olive-500 uppercase tracking-widest">
                          {new Date(rev.date).toLocaleDateString()}
                        </span>
                        {user && user.id === rev.user?.id && (
                          <button 
                            onClick={() => handleDeleteReview(rev.id)}
                            className="text-red-500/0 group-hover:text-red-500 transition-all p-1 hover:bg-red-500/10 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-dusty-olive-500 text-sm leading-relaxed pl-13">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center bg-tea-green-800/20 rounded-3xl border border-dashed border-tea-green-500 text-dusty-olive-600">
                  <Star size={32} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">No reviews yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>

          {/* Review Form */}
          <div className="w-full md:w-80 lg:w-96">
            <div className="bg-tea-green-800/50 border border-tea-green-500 rounded-3xl p-8 sticky top-28">
              <h3 className="text-lg font-black text-carbon-black-100 mb-2 tracking-tight">Write a Review</h3>
              <p className="text-xs text-dusty-olive-500 font-medium mb-8">Share your experience with others.</p>

              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-dusty-olive-600 mb-3 block">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setUserRating(num)}
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                            userRating >= num 
                              ? 'bg-emerald-glow/10 border-emerald-glow text-emerald-glow' 
                              : 'bg-tea-green-800 border-tea-green-500 text-dusty-olive-600'
                          }`}
                        >
                          <Star size={18} fill={userRating >= num ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-dusty-olive-600 mb-3 block">Comment</label>
                    <textarea 
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you think of the product?"
                      className="w-full bg-tea-green-800 border border-tea-green-500 rounded-2xl p-4 text-sm text-carbon-black-100 placeholder:text-dusty-olive-600 focus:outline-none focus:border-emerald-glow transition-all min-h-[120px] resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={reviewLoading}
                    className="w-full bg-emerald-glow text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-glow/80 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {reviewLoading ? 'Posting...' : 'Post Review'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-dusty-olive-500 mb-6 font-medium">You must be signed in to leave a review.</p>
                  <button 
                    onClick={() => navigate('/auth')}
                    className="w-full bg-tea-green-800 border border-tea-green-500 text-carbon-black-100 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-tea-green-500 transition-all"
                  >
                    Go to Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


export default ProductDetails;
