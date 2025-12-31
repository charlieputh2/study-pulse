import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, AlertCircle, Search, Mail, Phone, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip_code: string;
  shipping_country: string;
  order_items: {
    product_id?: string;
    product_name: string;
    variation_id?: string;
    variation_name?: string;
    quantity: number;
    price: number;
  }[];
  total_price: number;
  payment_method_id: string | null;
  payment_method_name: string | null;
  payment_status: string;
  order_status: 'new' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Additional fields for processed orders
  customer_address?: string;
  tracking_number?: string | null;
  shipping_note?: string | null;
  shipping_fee?: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [trackingMode, setTrackingMode] = useState<'browse' | 'track'>('browse');
  const [trackingEmail, setTrackingEmail] = useState('');
  const [trackingPhone, setTrackingPhone] = useState('');
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [trackedOrders, setTrackedOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (trackingMode === 'browse') {
      fetchOrders();
    }
  }, [trackingMode]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting orders fetch...');
      
      // Try the simplest possible query first
      const { error: simpleError } = await supabase
        .from('orders')
        .select('id')
        .limit(1);
        
      if (simpleError) {
        console.error('Simple query failed:', simpleError);
        setError(`Cannot access orders table: ${simpleError.message}`);
        return;
      }
      
      console.log('Simple query successful, table is accessible');
      
      // Now try a slightly more complex query
      const { data: testData, error: testError } = await supabase
        .from('orders')
        .select('id, customer_name, created_at')
        .limit(5);
        
      if (testError) {
        console.error('Test query failed:', testError);
        setError(`Cannot fetch order data: ${testError.message}`);
        return;
      }
      
      console.log('Test query successful, found', testData?.length || 0, 'orders');
      
      // If all tests pass, try the full query
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Full query failed:', error);
        setError(`Full query failed: ${error.message}`);
        
        // Try with explicit columns as fallback
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('orders')
          .select('id, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_state, shipping_zip_code, shipping_country, order_items, total_price, payment_method_id, payment_method_name, payment_status, order_status, notes, created_at, updated_at')
          .order('created_at', { ascending: false });
          
        if (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
          setError(`All queries failed: ${fallbackError.message}`);
          return;
        }
        
        console.log('Fallback query successful:', fallbackData?.length || 0, 'orders');
        
        if (fallbackData && fallbackData.length > 0) {
          console.log('Processing', fallbackData.length, 'orders');
          
          // Parse the order_items JSONB field
          const processedOrders = fallbackData.map(order => {
            try {
              return {
                ...order,
                order_items: typeof order.order_items === 'string' 
                  ? JSON.parse(order.order_items) 
                  : order.order_items || [],
                // Combine address fields for display
                customer_address: `${order.shipping_address || ''}, ${order.shipping_city || ''}, ${order.shipping_state || ''}, ${order.shipping_zip_code || ''}, ${order.shipping_country || ''}`,
                // Use notes as shipping_note for compatibility
                tracking_number: null, // Not in current schema
                shipping_note: order.notes,
                shipping_fee: 0 // Not in current schema, default to 0
              };
            } catch (parseError) {
              console.error('Error parsing order items for order', order.id, parseError);
              return {
                ...order,
                order_items: [],
                customer_address: `${order.shipping_address || ''}, ${order.shipping_city || ''}, ${order.shipping_state || ''}, ${order.shipping_zip_code || ''}, ${order.shipping_country || ''}`,
                tracking_number: null,
                shipping_note: order.notes,
                shipping_fee: 0
              };
            }
          });
          
          setOrders(processedOrders);
          console.log('Orders processed successfully');
        } else {
          console.log('No orders found in database');
          setOrders([]);
        }
        return;
      }
      
      if (data && data.length > 0) {
        console.log('Processing', data.length, 'orders');
        
        // Parse the order_items JSONB field
        const processedOrders = data.map(order => {
          try {
            return {
              ...order,
              order_items: typeof order.order_items === 'string' 
                ? JSON.parse(order.order_items) 
                : order.order_items || [],
              // Combine address fields for display
              customer_address: `${order.shipping_address || ''}, ${order.shipping_city || ''}, ${order.shipping_state || ''}, ${order.shipping_zip_code || ''}, ${order.shipping_country || ''}`,
              // Use notes as shipping_note for compatibility
              tracking_number: null, // Not in current schema
              shipping_note: order.notes,
              shipping_fee: 0 // Not in current schema, default to 0
            };
          } catch (parseError) {
            console.error('Error parsing order items for order', order.id, parseError);
            return {
              ...order,
              order_items: [],
              customer_address: `${order.shipping_address || ''}, ${order.shipping_city || ''}, ${order.shipping_state || ''}, ${order.shipping_zip_code || ''}, ${order.shipping_country || ''}`,
              tracking_number: null,
              shipping_note: order.notes,
              shipping_fee: 0
            };
          }
        });
        
        setOrders(processedOrders);
        console.log('Orders processed successfully');
      } else {
        console.log('No orders found in database');
        setOrders([]);
      }
    } catch (err) {
      console.error('Unexpected error fetching orders:', err);
      setError('Unexpected error occurred. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const trackOrder = async () => {
    try {
      setTrackingLoading(true);
      setTrackingError(null);
      setTrackedOrders([]);
      
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      
      // Build query based on provided information
      if (trackingOrderId) {
        query = query.eq('id', trackingOrderId);
      } else if (trackingEmail) {
        query = query.eq('customer_email', trackingEmail);
      } else if (trackingPhone) {
        query = query.eq('customer_phone', trackingPhone);
      } else {
        setTrackingError('Please provide at least one tracking detail (Order ID, Email, or Phone)');
        return;
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error tracking order:', error);
        setTrackingError(`Failed to track order: ${error.message}`);
        return;
      }
      
      if (data && data.length > 0) {
        // Process the tracked orders
        const processedOrders = data.map(order => {
          try {
            return {
              ...order,
              order_items: typeof order.order_items === 'string' 
                ? JSON.parse(order.order_items) 
                : order.order_items || [],
              customer_address: `${order.shipping_address || ''}, ${order.shipping_city || ''}, ${order.shipping_state || ''}, ${order.shipping_zip_code || ''}, ${order.shipping_country || ''}`,
              tracking_number: null,
              shipping_note: order.notes,
              shipping_fee: 0
            };
          } catch (parseError) {
            console.error('Error parsing order items for order', order.id, parseError);
            return {
              ...order,
              order_items: [],
              customer_address: `${order.shipping_address || ''}, ${order.shipping_city || ''}, ${order.shipping_state || ''}, ${order.shipping_zip_code || ''}, ${order.shipping_country || ''}`,
              tracking_number: null,
              shipping_note: order.notes,
              shipping_fee: 0
            };
          }
        });
        
        setTrackedOrders(processedOrders);
      } else {
        setTrackingError('No orders found with the provided information');
      }
    } catch (err) {
      console.error('Unexpected error tracking order:', err);
      setTrackingError('Unexpected error occurred. Please try again.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      case 'processing': return 'bg-orange-100 text-orange-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Tracking</h1>
          <p className="text-gray-600">Track your orders without login - just provide your order details</p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setTrackingMode('track')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                trackingMode === 'track'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Search className="w-5 h-5 inline mr-2" />
              Track My Order
            </button>
            <button
              onClick={() => setTrackingMode('browse')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                trackingMode === 'browse'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Package className="w-5 h-5 inline mr-2" />
              Browse All Orders
            </button>
          </div>
        </div>

        {/* Tracking Mode */}
        {trackingMode === 'track' && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Track Your Order</h2>
            <p className="text-gray-600 mb-6">Enter any one of the following details to find your order:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Order ID
                </label>
                <input
                  type="text"
                  placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
                  value={trackingOrderId}
                  onChange={(e) => setTrackingOrderId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={trackingEmail}
                  onChange={(e) => setTrackingEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+63-912-345-6789"
                  value={trackingPhone}
                  onChange={(e) => setTrackingPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <button
              onClick={trackOrder}
              disabled={trackingLoading || (!trackingOrderId && !trackingEmail && !trackingPhone)}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {trackingLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                  Tracking...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 inline mr-2" />
                  Track Order
                </>
              )}
            </button>
            
            {trackingError && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{trackingError}</p>
              </div>
            )}
          </div>
        )}

        {/* Browse Mode */}
        {trackingMode === 'browse' && (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading orders...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Orders List */}
        {((trackingMode === 'browse' && !loading && !error) || (trackingMode === 'track' && !trackingLoading && !trackingError)) && (
          <>
            {((trackingMode === 'browse' && filteredOrders.length === 0) || (trackingMode === 'track' && trackedOrders.length === 0)) ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {trackingMode === 'track' ? 'No Orders Found' : 'No Orders Found'}
                </h3>
                <p className="text-gray-500">
                  {trackingMode === 'track' 
                    ? 'No orders found with the provided information. Please check your details and try again.'
                    : (searchTerm || statusFilter !== 'all') 
                      ? 'Try adjusting your search or filters.'
                      : 'No orders have been placed yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {(trackingMode === 'track' ? trackedOrders : filteredOrders).map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="p-6">
                      {/* Order Header */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                              {getStatusIcon(order.order_status)}
                              <span className="capitalize">{order.order_status}</span>
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-xl font-bold text-gray-900">₱{order.total_price.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Customer</p>
                            <p className="font-medium text-gray-900">{order.customer_name}</p>
                            <p className="text-sm text-gray-600">{order.customer_email}</p>
                            <p className="text-sm text-gray-600">{order.customer_phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
                            <p className="text-sm text-gray-900">{order.customer_address}</p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">Items ({order.order_items.length})</p>
                        <div className="space-y-2">
                          {order.order_items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="text-gray-700">{item.quantity}x {item.product_name}</span>
                              <span className="font-medium text-gray-900">₱{item.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                            <p className="text-sm text-gray-900">{order.payment_method_name || 'Not specified'}</p>
                            <p className="text-xs text-gray-600">Status: {order.payment_status}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Order Date</p>
                            <p className="text-sm text-gray-900">{formatDate(order.created_at)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Note */}
                      {order.shipping_note && (
                        <div className="mb-4">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm text-blue-800">
                              <strong>Note:</strong> {order.shipping_note}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
