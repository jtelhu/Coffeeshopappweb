import { CartItem } from '../App';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
  total: number;
  loyaltyPoints: number;
}

export function Cart({ cart, onUpdateQuantity, onRemove, onCheckout, onContinueShopping, total, loyaltyPoints }: CartProps) {
  const getItemPrice = (item: CartItem) => {
    let price = item.drink.price;
    const isSnack = item.drink.category === 'Snacks';
    
    // Only add size charges for drinks, not snacks
    if (!isSnack) {
      if (item.customization.size === 'Medium') price += 0.5;
      if (item.customization.size === 'Large') price += 1.0;
    }
    
    price += item.customization.extras.length * 0.5;
    return price;
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[60vh]">
        <ShoppingBag className="w-24 h-24 mb-4" style={{ color: 'rgba(0, 5, 0, 0.2)' }} />
        <h2 style={{ color: '#000500' }} className="mb-2">Your cart is empty</h2>
        <p style={{ color: 'rgba(0, 5, 0, 0.6)' }} className="mb-6 text-center">Add some delicious drinks to get started!</p>
        <button
          onClick={onContinueShopping}
          className="px-6 py-3 rounded-lg transition-colors"
          style={{
            backgroundColor: '#d60000',
            color: '#fafaff'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#910c0c';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#d60000';
          }}
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h2 style={{ color: '#000500' }} className="mb-6">Your Cart</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="rounded-lg shadow-sm p-4 md:p-6" style={{
              backgroundColor: '#fafaff',
              border: '1px solid rgba(0, 5, 0, 0.1)'
            }}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 style={{ color: '#000500' }} className="mb-1">{item.drink.name}</h3>
                  <p className="text-sm mb-2" style={{ color: 'rgba(0, 5, 0, 0.6)' }}>
                    {item.customization.size} • {item.customization.milk} • {item.customization.ice}
                  </p>
                  {item.customization.extras.length > 0 && (
                    <p className="text-sm" style={{ color: 'rgba(0, 5, 0, 0.6)' }}>
                      +{item.customization.extras.join(', ')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(214, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Trash2 className="w-5 h-5" style={{ color: '#d60000' }} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 rounded-lg p-1" style={{ backgroundColor: 'rgba(0, 5, 0, 0.05)' }}>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 5, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Minus className="w-4 h-4" style={{ color: '#000500' }} />
                  </button>
                  <span className="w-8 text-center" style={{ color: '#000500' }}>{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 5, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Plus className="w-4 h-4" style={{ color: '#000500' }} />
                  </button>
                </div>
                <span style={{ color: '#d60000' }}>
                  ${(getItemPrice(item) * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary - Sidebar on desktop */}
        <div className="lg:col-span-1">
          <div className="rounded-lg shadow-sm p-6 sticky top-24" style={{
            backgroundColor: '#fafaff',
            border: '1px solid rgba(0, 5, 0, 0.1)'
          }}>
            <h3 style={{ color: '#000500' }} className="mb-4">Order Summary</h3>
            
            <div className="rounded-lg p-4 mb-4" style={{
              backgroundColor: 'rgba(214, 0, 0, 0.1)',
              border: '1px solid rgba(214, 0, 0, 0.3)'
            }}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span style={{ color: '#910c0c' }}>You'll earn ⭐</span>
                <span style={{ color: '#910c0c' }}>{Math.floor(total)} points</span>
              </div>
              <div className="text-xs" style={{ color: '#540000' }}>
                New balance: {loyaltyPoints + Math.floor(total)} pts
              </div>
            </div>

            <div className="space-y-2 mb-4 pb-4 border-b" style={{ borderColor: 'rgba(0, 5, 0, 0.1)' }}>
              <div className="flex justify-between text-sm" style={{ color: 'rgba(0, 5, 0, 0.6)' }}>
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: 'rgba(0, 5, 0, 0.6)' }}>
                <span>Tax</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span style={{ color: '#000500' }}>Total</span>
              <span style={{ color: '#d60000' }}>${(total * 1.08).toFixed(2)}</span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-3 rounded-lg transition-colors mb-3"
              style={{
                backgroundColor: '#000500',
                color: '#fafaff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#540000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#000500';
              }}
            >
              Proceed to Checkout
            </button>
            
            <button
              onClick={onContinueShopping}
              className="w-full py-3 rounded-lg transition-colors"
              style={{
                backgroundColor: '#fafaff',
                color: '#000500',
                border: '1px solid #000500'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 5, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fafaff';
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}