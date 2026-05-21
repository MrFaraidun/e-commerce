import api from '../api/axiosConfig';

export const addressService = {
  getMyAddresses: async () => {
    const response = await api.get('/addresses/my');
    return response.data;
  },

  addAddress: async (addressData) => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },

  deleteAddress: async (id) => {
    await api.delete(`/addresses/${id}`);
  }
};
