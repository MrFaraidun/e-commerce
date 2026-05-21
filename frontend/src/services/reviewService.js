import api from '../api/axiosConfig';

export const reviewService = {
  getProductReviews: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  addReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  deleteReview: async (id) => {
    await api.delete(`/reviews/${id}`);
  }
};
