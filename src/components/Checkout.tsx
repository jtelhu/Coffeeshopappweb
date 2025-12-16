import { useState } from 'react';
import { CartItem } from '../App';
import { MapPin, Clock, ChevronLeft, Star } from 'lucide-react';
import { CreditCard } from 'lucide-react';

interface CheckoutProps {
  cart: CartItem[];
  total: number;
  onPlaceOrder: (orderType: 'pickup' | 'delivery', deliveryAddress?: string, pointsUsed?: number) => void;
  onBack: () => void;
  user: { name: string; email: string; phone: string; loyaltyPoints: number };
}

export function Checkout({ cart, total, onPlaceOrder, onBack, user }: CheckoutProps) {
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedTime, setSelectedTime] = useState('ASAP');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pointsToUse, setPointsToUse] = useState(0);

  const deliveryFee = orderType === 'delivery' ? 2.99 : 0;
  
  // Calculate points discount (100 points = $1)
  const maxPointsUsable = Math.min(user.loyaltyPoints, Math.floor(total * 100));
  const pointsDiscount = pointsToUse / 100;
  
  const subtotalAfterDiscount = Math.max(0, total - pointsDiscount);
  const tax = (subtotalAfterDiscount + deliveryFee) * 0.08;
  const finalTotal = subtotalAfterDiscount + deliveryFee + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder(orderType, orderType === 'delivery' ? deliveryAddress : undefined, pointsToUse);
  };

  const timeOptions = ['ASAP', '15 min', '30 min', '45 min', '1 hour'];

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="sticky top-16 bg-white border-b border-gray-200 p-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2>Checkout</h2>
      </div>

      <div className="max-w-5xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Order Type */}
            <div>
              <label className="block text-gray-900 mb-3">Order Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    orderType === 'pickup'
                      ? 'border-amber-900 bg-amber-50 text-amber-900'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <MapPin className="w-6 h-6 mx-auto mb-2" />
                  <div>Pickup</div>
                  <div className="text-xs text-gray-500 mt-1">Free</div>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    orderType === 'delivery'
                      ? 'border-amber-900 bg-amber-50 text-amber-900'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <div>Delivery</div>
                  <div className="text-xs text-gray-500 mt-1">$2.99</div>
                </button>
              </div>
            </div>

            {/* Delivery Address */}
            {orderType === 'delivery' && (
              <div>
                <label className="block text-gray-900 mb-2">Delivery Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your address"
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                />
              </div>
            )}

            {/* Pickup Location */}
            {orderType === 'pickup' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-900 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-gray-900 mb-1">Bean & Brew - Downtown</div>
                    <div className="text-sm text-gray-600">123 Coffee Street, Suite 100</div>
                    <div className="text-sm text-gray-600">Open until 9:00 PM</div>
                  </div>
                </div>
              </div>
            )}

            {/* Time Selection */}
            <div>
              <label className="block text-gray-900 mb-3">When do you want it?</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {timeOptions.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      selectedTime === time
                        ? 'bg-amber-900 text-white'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Loyalty Points Redemption */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-amber-600" />
                <h3 className="text-gray-900">Use Loyalty Points</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                You have {user.loyaltyPoints} points available (100 points = $1.00)
              </p>
              {user.loyaltyPoints > 0 && (
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max={maxPointsUsable}
                    step="100"
                    value={pointsToUse}
                    onChange={(e) => setPointsToUse(parseInt(e.target.value))}
                    className="w-full accent-amber-900"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Using {pointsToUse} points
                    </span>
                    <span className="text-amber-900">
                      -${pointsDiscount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPointsToUse(0)}
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Use 0
                    </button>
                    <button
                      type="button"
                      onClick={() => setPointsToUse(Math.min(500, maxPointsUsable))}
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      disabled={maxPointsUsable < 500}
                    >
                      Use 500
                    </button>
                    <button
                      type="button"
                      onClick={() => setPointsToUse(maxPointsUsable)}
                      className="flex-1 px-3 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition-colors text-sm"
                      disabled={maxPointsUsable === 0}
                    >
                      Use Max
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-gray-900 mb-3">Payment Method</label>
              <div className="space-y-2">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                    <div>
                      <div className="text-gray-900">Credit/Debit Card</div>
                      <div className="text-sm text-gray-500">•••• 4242</div>
                    </div>
                  </div>
                  <button type="button" className="text-amber-900 text-sm">Change</button>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 text-gray-600">💳</div>
                    <div className="text-gray-900">Apple Pay</div>
                  </div>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 text-gray-600">🏦</div>
                    <div className="text-gray-900">PayPal</div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24 space-y-3">
              <h3 className="text-gray-900 mb-4">Order Summary</h3>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {pointsToUse > 0 && (
                <div className="flex justify-between text-amber-600 text-sm">
                  <span>Points Discount ({pointsToUse} pts)</span>
                  <span>-${pointsDiscount.toFixed(2)}</span>
                </div>
              )}
              {orderType === 'delivery' && (
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between text-gray-900 mb-4">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-amber-900 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors"
                >
                  Place Order - ${finalTotal.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}