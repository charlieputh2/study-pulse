import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, ArrowRight, ExternalLink, MapPin, Phone, Mail, Shield, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TrackingOrder {
    id: string;
    order_status: string;
    payment_status: string;
    tracking_number: string | null;
    shipping_note: string | null;
    total_price: number;
    shipping_fee: number;
    order_items: {
        product_name: string;
        quantity: number;
    }[];
    created_at: string;
}

const OrderTracking: React.FC = () => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState<TrackingOrder | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        setError(null);
        setOrder(null);
        setHasSearched(true);

        try {
            // Use secure RPC function to fetch order
            const { data, error } = await supabase
                .rpc('get_order_details', {
                    order_id_input: orderId.trim()
                })
                .single();

            if (error) {
                // If no rows returned by function, it usually returns a different error or null data depending on setup,
                // but .single() will throw if 0 rows.
                if (error.code === 'PGRST116') {
                    setError('Order not found. Please check your Order ID and try again.');
                } else {
                    throw error;
                }
            } else if (data) {
                // RPC returns the row directly when using single()
                setOrder(data as TrackingOrder);
            } else {
                setError('Order not found.');
            }
        } catch (err) {
            console.error('Error fetching order:', err);
            setError('An error occurred while fetching your order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status: string) => {
        const steps = ['new', 'confirmed', 'processing', 'shipped', 'delivered'];
        const statusIndex = steps.indexOf(status);
        // If cancelled, it's a special state
        if (status === 'cancelled') return -1;
        return statusIndex;
    };

    const currentStep = order ? getStatusStep(order.order_status) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gold-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-blue-500/20 backdrop-blur-xl border border-blue-400/30 rounded-full">
                        <Truck className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-300 font-medium">Real-Time Order Tracking</span>
                    </div>
                    
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                        Track Your Order
                    </h1>
                    <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Enter your Order ID to check the current status of your package. Get real-time updates on your delivery.
                    </p>
                    
                    {/* Quick Stats */}
                    <div className="flex flex-wrap justify-center gap-8 mb-8">
                        <div className="flex items-center gap-2 text-blue-300">
                            <Shield className="w-5 h-5" />
                            <span className="text-sm">Secure Tracking</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-300">
                            <Zap className="w-5 h-5" />
                            <span className="text-sm">Real-Time Updates</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-300">
                            <MapPin className="w-5 h-5" />
                            <span className="text-sm">Live Location</span>
                        </div>
                    </div>
                </div>

                {/* Search Box */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                        <form onSubmit={handleTrack} className="space-y-6">
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300">
                                    <Search className="w-6 h-6" />
                                </div>
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="Enter Order ID (e.g., 8a2b3c...)"
                                    className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-xl border-2 border-blue-400/30 rounded-2xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all text-lg"
                                />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={loading || !orderId.trim()}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Tracking Your Order...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Track Order</span>
                                        <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                        </form>
                        
                        {/* Help Text */}
                        <div className="mt-6 text-center">
                            <p className="text-blue-300 text-sm">
                                Can't find your Order ID? Check your email or contact 
                                <a href="mailto:support@studypulse.com" className="text-blue-400 hover:text-blue-300 underline ml-1">
                                    support@studypulse.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {error && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-6 flex items-center gap-4 text-red-300 animate-fade-in">
                            <AlertCircle className="w-6 h-6 flex-shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {hasSearched && order && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                        {/* Status Card */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-white">
                                <div>
                                    <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">Order Status</p>
                                    <h2 className="text-3xl font-bold capitalize flex items-center gap-3 text-white">
                                        {order.order_status === 'new' && <Clock className="w-7 h-7 text-yellow-300" />}
                                        {order.order_status === 'confirmed' && <CheckCircle className="w-7 h-7 text-green-300" />}
                                        {order.order_status === 'processing' && <Package className="w-7 h-7 text-blue-300" />}
                                        {order.order_status === 'shipped' && <Truck className="w-7 h-7 text-purple-300" />}
                                        {order.order_status === 'delivered' && <CheckCircle className="w-7 h-7 text-green-400" />}
                                        {order.order_status === 'cancelled' && <AlertCircle className="w-7 h-7 text-red-400" />}
                                        <span className="capitalize">{order.order_status}</span>
                                    </h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/60 text-sm mb-1">Order ID</p>
                                    <p className="font-mono text-xl font-bold">{order.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="p-8">
                                {/* Progress Bar */}
                                {order.order_status !== 'cancelled' ? (
                                    <div className="mb-10">
                                        <div className="relative">
                                            <div className="absolute top-1/2 left-0 w-full h-2 bg-white/20 -translate-y-1/2 rounded-full" />
                                            <div
                                                className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500 -translate-y-1/2 rounded-full transition-all duration-700 ease-out"
                                                style={{ width: `${Math.min(100, Math.max(0, currentStep * 25))}%` }}
                                            />

                                            <div className="relative flex justify-between">
                                                {['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
                                                    const isCompleted = index <= currentStep;
                                                    const isCurrent = index === currentStep;

                                                    return (
                                                        <div key={step} className="flex flex-col items-center gap-3">
                                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-3 transition-all duration-500 bg-white/10 backdrop-blur-xl ${
                                                                isCompleted ? 'border-blue-400 text-blue-300' : 'border-white/20 text-white/40'
                                                            } ${isCurrent ? 'ring-4 ring-blue-400/30 scale-110 shadow-lg shadow-blue-400/20' : ''}`}>
                                                                {index < currentStep ? (
                                                                    <CheckCircle className="w-6 h-6" />
                                                                ) : (
                                                                    <div className={`w-4 h-4 rounded-full ${isCompleted ? 'bg-blue-400' : 'bg-white/20'}`} />
                                                                )}
                                                            </div>
                                                            <span className={`text-sm font-medium ${
                                                                isCompleted ? 'text-white' : 'text-white/40'
                                                            }`}>{step}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-red-400/30 text-red-300 mb-8 flex items-center gap-4">
                                        <AlertCircle className="w-8 h-8 text-red-400" />
                                        <div>
                                            <p className="font-bold text-lg">Order Cancelled</p>
                                            <p className="text-sm opacity-80">This order has been cancelled. Please contact support if you think this is a mistake.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Tracking Details Block */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                                        <h3 className="font-bold text-white mb-6 flex items-center gap-3 text-lg">
                                            <Truck className="w-6 h-6 text-blue-400" />
                                            Tracking Information
                                        </h3>

                                        {order.tracking_number ? (
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-xs text-white/60 uppercase font-bold tracking-wider mb-2">Tracking Number (J&T)</p>
                                                    <p className="text-2xl font-mono font-bold text-white tracking-wide bg-white/10 backdrop-blur-xl rounded-xl p-3 text-center">
                                                        {order.tracking_number}
                                                    </p>
                                                </div>

                                                <a
                                                    href={`https://www.jtexpress.ph/trajectoryQuery?bills=${order.tracking_number}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transform hover:scale-105"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                    Track on J&T Express
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-white/40">
                                                <Truck className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                                <p className="text-lg font-medium mb-2">No tracking number available yet</p>
                                                <p className="text-sm opacity-70">Check back later when your order is shipped</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        {order.shipping_note && (
                                            <div className="bg-blue-500/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30">
                                                <h3 className="font-bold text-white mb-3 flex items-center gap-3">
                                                    <Package className="w-5 h-5 text-blue-400" />
                                                    Shipping Update
                                                </h3>
                                                <p className="text-white/80 leading-relaxed">{order.shipping_note}</p>
                                            </div>
                                        )}

                                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                                            <h3 className="font-bold text-white mb-4 text-lg uppercase tracking-wider border-b border-white/10 pb-3">Order Summary</h3>
                                            <div className="space-y-3 mb-6">
                                                {order.order_items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm text-white/80">
                                                        <span>{item.quantity}x {item.product_name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-white/10 font-bold text-xl text-white">
                                                <span>Total</span>
                                                <span className="text-blue-300">₱{(order.total_price + (order.shipping_fee || 0)).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        
                        {/* Contact Support */}
                        <div className="text-center">
                            <div className="inline-flex items-center gap-6 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full">
                                <a href="tel:+1-234-567-8900" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-sm">+1-234-567-8900</span>
                                </a>
                                <a href="mailto:support@studypulse.com" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm">support@studypulse.com</span>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;
