import { Order } from '../App';
import { ChevronLeft, Package, Clock, CheckCircle, Truck, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RatingDialog } from './RatingDialog';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface OrderTrackingProps {
  orders: Order[];
  onBack: () => void;
}

export function OrderTracking({ orders, onBack }: OrderTrackingProps) {
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderRatings, setOrderRatings] = useState<{ [orderId: string]: any }>({});

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-8eeb856c`;

  useEffect(() => {
    // Fetch ratings for all completed orders
    const fetchRatings = async () => {
      const completedOrders = orders.filter(o => o.status === 'completed');
      for (const order of completedOrders) {
        try {
          const response = await fetch(`${API_BASE}/ratings/${order.id}`, {
            headers: { 'Authorization': `Bearer ${publicAnonKey}` }
          });
          const data = await response.json();
          if (data.rating) {
            setOrderRatings(prev => ({ ...prev, [order.id]: data.rating }));
          }
        } catch (error) {
          console.error(`Error fetching rating for order ${order.id}:`, error);
        }
      }
    };
    fetchRatings();
  }, [orders]);

  const handleRateOrder = (order: Order) => {
    setSelectedOrder(order);
    setRatingDialogOpen(true);
  };

  const handleRatingSubmit = () => {
    // Refresh ratings
    if (selectedOrder) {
      fetch(`${API_BASE}/ratings/${selectedOrder.id}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.rating) {
            setOrderRatings(prev => ({ ...prev, [selectedOrder.id]: data.rating }));
          }
        })
        .catch(error => console.error('Error refreshing rating:', error));
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'preparing':
        return <Clock className="w-6 h-6 text-orange-500" />;
      case 'ready':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'out-for-delivery':
        return <Truck className="w-6 h-6 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for Pickup';
      case 'out-for-delivery':
        return 'Out for Delivery';
      case 'completed':
        return 'Completed';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'preparing':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'ready':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'out-for-delivery':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-gray-900">Order Tracking</h2>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Package className="w-24 h-24 text-gray-300 mb-4" />
          <h3 className="text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-600 text-center">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-gray-900">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">{formatDate(order.timestamp)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              {/* Order Status Timeline */}
              {order.status !== 'completed' && (
                <div className="p-4 bg-amber-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="text-gray-900 mb-1">{getStatusText(order.status)}</p>
                      <p className="text-sm text-gray-600">
                        {order.status === 'preparing' && `Estimated time: ${order.estimatedTime}`}
                        {order.status === 'ready' && 'Your order is ready for pickup!'}
                        {order.status === 'out-for-delivery' && 'Your order is on the way!'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="p-4">
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">
                    {order.type === 'delivery' ? '🚚 Delivery' : '📍 Pickup'}
                    {order.address && ` • ${order.address}`}
                  </p>
                </div>

                <div className="space-y-2 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.quantity}x {item.drink.name}
                      </span>
                      <span className="text-gray-600">
                        {item.customization.size}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-gray-700">Total</span>
                  <span className="text-amber-900">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Reorder Button */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                {order.status === 'completed' && !orderRatings[order.id] ? (
                  <button 
                    onClick={() => handleRateOrder(order)}
                    className="w-full bg-amber-900 text-white py-2 rounded-lg hover:bg-amber-800 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Rate This Order
                  </button>
                ) : order.status === 'completed' && orderRatings[order.id] ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= orderRatings[order.id].rating
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">Thanks for your feedback!</p>
                  </div>
                ) : (
                  <button className="w-full bg-amber-900 text-white py-2 rounded-lg hover:bg-amber-800 transition-colors text-sm">
                    Reorder
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {ratingDialogOpen && selectedOrder && (
        <RatingDialog
          orderId={selectedOrder.id}
          orderNumber={selectedOrder.orderNumber}
          onClose={() => {
            setRatingDialogOpen(false);
            setSelectedOrder(null);
          }}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
}