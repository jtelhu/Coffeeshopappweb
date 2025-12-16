import { useState } from 'react';
import { Menu } from './components/Menu';
import { DrinkCustomizer } from './components/DrinkCustomizer';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderConfirmation } from './components/OrderConfirmation';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Profile } from './components/Profile';
import { OrderTracking } from './components/OrderTracking';
import { AdminPanel } from './components/AdminPanel';
import { ChristmasDecorations } from './components/ChristmasDecorations';
import { ShoppingCart, Home, User, Package } from 'lucide-react';
import { projectId, publicAnonKey } from './utils/supabase/info';

export interface DrinkItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export interface CustomizationOptions {
  size: 'Small' | 'Medium' | 'Large';
  milk: string;
  sweetness: number;
  ice: 'No Ice' | 'Less Ice' | 'Regular Ice' | 'Extra Ice';
  extras: string[];
  temperature: 'Hot' | 'Iced';
  coffeeStrength: string;
  flavor: string;
  topping: string;
  drizzle: string;
}

export interface CartItem {
  drink: DrinkItem;
  customization: CustomizationOptions;
  quantity: number;
  id: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  loyaltyPoints: number;
  orders: Order[];
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  status: 'preparing' | 'ready' | 'out-for-delivery' | 'completed';
  type: 'pickup' | 'delivery';
  timestamp: Date;
  address?: string;
  estimatedTime: string;
  pointsUsed?: number;
  pointsEarned?: number;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'menu' | 'customize' | 'cart' | 'checkout' | 'confirmation' | 'login' | 'register' | 'profile' | 'orders' | 'admin'>('login');
  const [selectedDrink, setSelectedDrink] = useState<DrinkItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-8eeb856c`;

  const handleDrinkSelect = (drink: DrinkItem) => {
    setSelectedDrink(drink);
    setCurrentView('customize');
  };

  const handleAddToCart = (customization: CustomizationOptions) => {
    if (selectedDrink) {
      const newCartItem: CartItem = {
        drink: selectedDrink,
        customization,
        quantity: 1,
        id: Date.now().toString(),
      };
      setCart([...cart, newCartItem]);
      setCurrentView('menu');
      setSelectedDrink(null);
    }
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveFromCart(id);
    } else {
      setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
    }
  };

  const handlePlaceOrder = async (orderType: 'pickup' | 'delivery', address?: string, pointsUsed: number = 0) => {
    const orderNum = `#${Math.floor(10000 + Math.random() * 90000)}`;
    const total = getTotal();
    const pointsEarned = Math.floor(total);
    
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: orderNum,
      items: [...cart],
      total,
      status: 'preparing',
      type: orderType,
      timestamp: new Date(),
      address: address,
      estimatedTime: '15-20 minutes',
      pointsUsed,
      pointsEarned,
    };

    setCurrentOrder(newOrder);
    
    if (user) {
      const newPoints = user.loyaltyPoints - pointsUsed + pointsEarned;
      const updatedUser = {
        ...user,
        loyaltyPoints: newPoints,
        orders: [newOrder, ...user.orders],
      };
      setUser(updatedUser);

      // Save order and points to backend
      try {
        await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(newOrder)
        });

        await fetch(`${API_BASE}/loyalty/${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ points: newPoints })
        });
      } catch (error) {
        console.error('Error saving order data:', error);
      }
    }

    setCurrentView('confirmation');
    setCart([]);

    // Simulate order status updates
    setTimeout(() => {
      if (currentOrder) {
        setCurrentOrder({ ...newOrder, status: 'ready' });
      }
    }, 10000);
  };

  const handleLogin = async (email: string, password: string) => {
    // Mock authentication - in real app, this would call backend
    const mockUser: UserData = {
      id: email === 'admin@coffee.com' ? 'admin-1' : '1',
      name: email === 'admin@coffee.com' ? 'Admin User' : 'Coffee Lover',
      email,
      phone: '+1 (555) 123-4567',
      role: email === 'admin@coffee.com' ? 'admin' : 'customer',
      loyaltyPoints: 150,
      orders: [],
    };

    // Fetch loyalty points from backend
    try {
      const response = await fetch(`${API_BASE}/loyalty/${mockUser.id}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await response.json();
      if (data.points !== undefined) {
        mockUser.loyaltyPoints = data.points;
      }
    } catch (error) {
      console.error('Error fetching loyalty points:', error);
    }

    setUser(mockUser);
    setCurrentView('menu');
  };

  const handleRegister = (name: string, email: string, phone: string, password: string) => {
    const newUser: UserData = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role: 'customer',
      loyaltyPoints: 0,
      orders: [],
    };
    setUser(newUser);
    setCurrentView('menu');
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setCurrentView('login');
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      let price = item.drink.price;
      const isSnack = item.drink.category === 'Snacks';
      
      // Only add size charges for drinks, not snacks
      if (!isSnack) {
        if (item.customization.size === 'Medium') price += 0.5;
        if (item.customization.size === 'Large') price += 1.0;
      }
      
      price += item.customization.extras.length * 0.5;
      return total + (price * item.quantity);
    }, 0);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Show login/register screens without header/nav
  if (!user && (currentView === 'login' || currentView === 'register')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ChristmasDecorations />
        {currentView === 'login' && (
          <Login 
            onLogin={handleLogin} 
            onNavigateToRegister={() => setCurrentView('register')}
          />
        )}
        {currentView === 'register' && (
          <Register 
            onRegister={handleRegister}
            onNavigateToLogin={() => setCurrentView('login')}
          />
        )}
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ChristmasDecorations />
        <Login 
          onLogin={handleLogin} 
          onNavigateToRegister={() => setCurrentView('register')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafaff' }}>
      {/* Christmas Decorations */}
      <ChristmasDecorations />
      
      {/* Header */}
      <header style={{ backgroundColor: '#660000' }} className="text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: '#d60000' }}>☕</div>
            <div>
              <h1 className="text-lg flex items-center gap-2">
                Java Coffee Shop 
                <span className="text-2xl">🎄</span>
              </h1>
              <p className="text-sm" style={{ color: '#fafaff', opacity: 0.8 }}>Welcome, {user.name}! 🎅</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setCurrentView('menu')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: currentView === 'menu' ? '#d60000' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (currentView !== 'menu') {
                  e.currentTarget.style.backgroundColor = 'rgba(84, 0, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== 'menu') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Home className="w-5 h-5" />
              <span>Menu</span>
            </button>
            <button
              onClick={() => setCurrentView('orders')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: currentView === 'orders' ? '#d60000' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (currentView !== 'orders') {
                  e.currentTarget.style.backgroundColor = 'rgba(84, 0, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== 'orders') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Package className="w-5 h-5" />
              <span>Orders</span>
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: currentView === 'profile' ? '#d60000' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (currentView !== 'profile') {
                  e.currentTarget.style.backgroundColor = 'rgba(84, 0, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== 'profile') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs" style={{ color: '#fafaff', opacity: 0.8 }}>Rewards</div>
              <div className="text-sm">⭐ {user.loyaltyPoints} pts</div>
            </div>
            <button
              onClick={() => setCurrentView('cart')}
              className="relative p-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(84, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" style={{ backgroundColor: '#d60000' }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pb-20 md:pb-8 px-4 lg:px-8">
        {currentView === 'menu' && (
          <Menu onDrinkSelect={handleDrinkSelect} />
        )}
        {currentView === 'customize' && selectedDrink && (
          <DrinkCustomizer
            drink={selectedDrink}
            onAddToCart={handleAddToCart}
            onCancel={() => {
              setCurrentView('menu');
              setSelectedDrink(null);
            }}
          />
        )}
        {currentView === 'cart' && (
          <Cart
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveFromCart}
            onCheckout={() => setCurrentView('checkout')}
            onContinueShopping={() => setCurrentView('menu')}
            total={getTotal()}
            loyaltyPoints={user.loyaltyPoints}
          />
        )}
        {currentView === 'checkout' && (
          <Checkout
            cart={cart}
            total={getTotal()}
            onPlaceOrder={handlePlaceOrder}
            onBack={() => setCurrentView('cart')}
            user={user}
          />
        )}
        {currentView === 'confirmation' && currentOrder && (
          <OrderConfirmation
            order={currentOrder}
            onBackToMenu={() => setCurrentView('menu')}
            onTrackOrder={() => setCurrentView('orders')}
          />
        )}
        {currentView === 'profile' && (
          <Profile 
            user={user} 
            onLogout={handleLogout}
            onBack={() => setCurrentView('menu')}
            onAdminPanel={user.role === 'admin' ? () => setCurrentView('admin') : undefined}
          />
        )}
        {currentView === 'orders' && (
          <OrderTracking 
            orders={user.orders}
            onBack={() => setCurrentView('menu')}
          />
        )}
        {currentView === 'admin' && user.role === 'admin' && (
          <AdminPanel onBack={() => setCurrentView('profile')} />
        )}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      {currentView !== 'customize' && currentView !== 'checkout' && currentView !== 'confirmation' && currentView !== 'admin' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-md mx-auto flex justify-around p-3">
            <button
              onClick={() => setCurrentView('menu')}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: currentView === 'menu' ? '#d60000' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (currentView !== 'menu') {
                  e.currentTarget.style.backgroundColor = 'rgba(84, 0, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== 'menu') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Menu</span>
            </button>
            <button
              onClick={() => setCurrentView('orders')}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: currentView === 'orders' ? '#d60000' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (currentView !== 'orders') {
                  e.currentTarget.style.backgroundColor = 'rgba(84, 0, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== 'orders') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Package className="w-6 h-6" />
              <span className="text-xs">Orders</span>
            </button>
            <button
              onClick={() => setCurrentView('cart')}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(84, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs">Cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: currentView === 'profile' ? '#d60000' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (currentView !== 'profile') {
                  e.currentTarget.style.backgroundColor = 'rgba(84, 0, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== 'profile') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}