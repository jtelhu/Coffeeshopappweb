import { CheckCircle, Star, Sparkles } from 'lucide-react';
import { Order } from '../App';

interface OrderConfirmationProps {
  order: Order;
  onBackToMenu: () => void;
  onTrackOrder: () => void;
}

export function OrderConfirmation({ order, onBackToMenu, onTrackOrder }: OrderConfirmationProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[80vh]">
      <div className="bg-green-100 rounded-full p-6 mb-6">
        <CheckCircle className="w-24 h-24 text-green-600" />
      </div>
      
      <h2 className="text-gray-900 mb-2 text-center">Order Confirmed!</h2>
      <p className="text-gray-600 mb-6 text-center">
        Your order has been placed successfully
      </p>

      <div className="bg-white border-2 border-amber-900 rounded-lg p-6 mb-4 w-full max-w-sm">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 mb-1">Order Number</div>
          <div className="text-amber-900">{order.orderNumber}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Estimated Time</div>
          <div className="text-gray-900">{order.estimatedTime}</div>
        </div>
      </div>

      {/* Points Summary */}
      {(order.pointsUsed || order.pointsEarned) && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 w-full max-w-sm mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="text-gray-900 text-sm">Loyalty Points</h3>
          </div>
          <div className="space-y-2">
            {order.pointsUsed && order.pointsUsed > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Points Redeemed</span>
                <span className="text-red-600">-{order.pointsUsed} pts</span>
              </div>
            )}
            {order.pointsEarned && order.pointsEarned > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Points Earned</span>
                <span className="text-green-600 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-green-600" />
                  +{order.pointsEarned} pts
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 w-full max-w-sm mb-6">
        <h3 className="text-gray-900 text-sm mb-2">What&apos;s next?</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-amber-900">•</span>
            <span>We&apos;re preparing your order</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-900">•</span>
            <span>You&apos;ll receive a notification when it&apos;s ready</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-900">•</span>
            <span>Show this order number when picking up</span>
          </li>
        </ul>
      </div>

      <div className="flex gap-3 w-full max-w-sm">
        <button
          onClick={onTrackOrder}
          className="flex-1 bg-white border-2 border-amber-900 text-amber-900 px-6 py-3 rounded-lg hover:bg-amber-50 transition-colors"
        >
          Track Order
        </button>
        <button
          onClick={onBackToMenu}
          className="flex-1 bg-amber-900 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-colors"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}