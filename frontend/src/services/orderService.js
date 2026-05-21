import api from '../api/axiosConfig';

export const orderService = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/orders/${id}`);
  }
};
