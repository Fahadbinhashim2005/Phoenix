import api from './client';
import { Quotation, Subscription } from '../types';

export const subscriptionsApi = {
  // Quotations
  getQuotations: async (params?: { status?: string; customer_id?: number; search?: string }): Promise<Quotation[]> => {
    const res = await api.get('/api/quotations', { params });
    return res.data;
  },
  getQuotation: async (id: number): Promise<Quotation> => {
    const res = await api.get(`/api/quotations/${id}`);
    return res.data;
  },
  createQuotation: async (data: Partial<Quotation>): Promise<Quotation> => {
    const res = await api.post('/api/quotations', data);
    return res.data;
  },
  updateQuotation: async (id: number, data: Partial<Quotation>): Promise<Quotation> => {
    const res = await api.put(`/api/quotations/${id}`, data);
    return res.data;
  },
  cancelQuotation: async (id: number) => {
    const res = await api.delete(`/api/quotations/${id}`);
    return res.data;
  },
  confirmQuotation: async (id: number): Promise<Subscription> => {
    const res = await api.post(`/api/quotations/${id}/confirm`);
    return res.data;
  },

  // Subscriptions
  getSubscriptions: async (params?: { status?: string; customer_id?: number; search?: string }): Promise<Subscription[]> => {
    const res = await api.get('/api/subscriptions', { params });
    return res.data;
  },
  getSubscription: async (id: number): Promise<Subscription> => {
    const res = await api.get(`/api/subscriptions/${id}`);
    return res.data;
  },
  createSubscription: async (data: Partial<Subscription>): Promise<Subscription> => {
    const res = await api.post('/api/subscriptions', data);
    return res.data;
  },
  updateSubscription: async (id: number, data: Partial<Subscription>): Promise<Subscription> => {
    const res = await api.put(`/api/subscriptions/${id}`, data);
    return res.data;
  },
  confirmSubscription: async (id: number): Promise<Subscription> => {
    const res = await api.post(`/api/subscriptions/${id}/confirm`);
    return res.data;
  },
  activateSubscription: async (id: number): Promise<Subscription> => {
    const res = await api.post(`/api/subscriptions/${id}/activate`);
    return res.data;
  },
  pauseSubscription: async (id: number): Promise<Subscription> => {
    const res = await api.post(`/api/subscriptions/${id}/pause`);
    return res.data;
  },
  resumeSubscription: async (id: number): Promise<Subscription> => {
    const res = await api.post(`/api/subscriptions/${id}/resume`);
    return res.data;
  },
  renewSubscription: async (id: number): Promise<Subscription> => {
    const res = await api.post(`/api/subscriptions/${id}/renew`);
    return res.data;
  },
  closeSubscription: async (id: number, close_reason: string): Promise<Subscription> => {
    const res = await api.post(`/api/subscriptions/${id}/close`, { close_reason });
    return res.data;
  },
  getDueForBilling: async (): Promise<Subscription[]> => {
    const res = await api.get('/api/subscriptions/due-for-billing');
    return res.data;
  },
};
