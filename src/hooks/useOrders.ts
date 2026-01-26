import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_barangay: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip_code: string;
  order_items: any[];
  total_price: number;
  shipping_fee: number;
  shipping_location: string;
  courier: string;
  is_cod: boolean;
  courier_fee: number;
  payment_method_id: string | null;
  payment_method_name: string | null;
  payment_proof_url: string | null;
  contact_method: string | null;
  notes: string | null;
  order_status: string;
  payment_status: string;
  promo_code_id: string | null;
  promo_code: string | null;
  discount_applied: number;
  created_at: string;
  updated_at: string;
}

export const useOrders = (userEmail?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // If user email is provided, filter by user
      if (userEmail) {
        query = query.eq('customer_email', userEmail);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          ...orderData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;

      // Refresh orders list
      await fetchOrders();

      return { success: true, data };
    } catch (err) {
      console.error('Error creating order:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create order' 
      };
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      const updateData: any = {
        order_status: status,
        updated_at: new Date().toISOString(),
      };

      if (paymentStatus) {
        updateData.payment_status = paymentStatus;
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, ...updateData }
            : order
        )
      );

      return { success: true, data };
    } catch (err) {
      console.error('Error updating order status:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update order status' 
      };
    }
  };

  const getOrderById = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (err) {
      console.error('Error fetching order:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to fetch order' 
      };
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      // Remove from local state
      setOrders(prev => prev.filter(order => order.id !== orderId));

      return { success: true };
    } catch (err) {
      console.error('Error deleting order:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete order' 
      };
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userEmail]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrderStatus,
    getOrderById,
    deleteOrder,
  };
};
