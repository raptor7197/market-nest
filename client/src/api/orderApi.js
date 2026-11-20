import api from './axios';

export const orderApi = {
  createOrder: async (data, idempotencyKey) =>
    (
      await api.post('/orders', data, {
        headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
      })
    ).data,
  getMyOrders: async (params = {}) => (await api.get('/orders/my', { params })).data,
  getOrderById: async (id) => (await api.get(`/orders/${id}`)).data,
  cancelOrder: async (id) => (await api.post(`/orders/${id}/cancel`)).data,
  getBrandOrders: async (params = {}) => (await api.get('/orders/brand', { params })).data,
  getBrandOrderStats: async () => (await api.get('/orders/brand/stats')).data,
  updateOrderStatus: async (id, status) =>
    (await api.patch(`/orders/${id}/status`, { status })).data,
};
