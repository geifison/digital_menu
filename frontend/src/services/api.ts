// src/services/api.ts

import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface Category {
  id: string;
  name: string;
  menu_items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  base_price: string;
  is_available: boolean;
  image_url?: string;
  variants: Variant[];
  modifier_groups: ModifierGroup[];
}

export interface Variant {
  id: string;
  name: string;
  additional_price: string;
  modifier_groups: ModifierGroup[];
}

export interface ModifierGroup {
  id: string;
  display_name: string;
  is_required: boolean;
  min_choices: number;
  max_choices: number;
  options: ModifierOption[];
}

export interface ModifierOption {
  id: string;
  name: string;
  additional_price: string;
}

export interface Order {
  id: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_observation?: string;
  payment_method: string;
  change_for?: string;
  total_price: number;
  created_at: string;
  items_json: {
    name: string;
    variant?: string;
    modifiers?: string[];
    price: number;
  }[];
}

const api = axios.create({
  baseURL: `${API_URL}/api/v1/`,
});

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('categories/');
  return response.data;
};

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>('orders/');
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<Order> => {
  const response = await api.patch<Order>(`orders/${orderId}/`, { status });
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const response = await api.post('orders/', orderData);
  return response.data;
};

export default api;