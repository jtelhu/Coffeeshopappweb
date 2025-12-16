import { useState } from 'react';
import { Coffee, Mail, Lock, Info } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToRegister: () => void;
}

export function Login({ onLogin, onNavigateToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  const handleDemoLogin = (type: 'admin' | 'customer') => {
    if (type === 'admin') {
      onLogin('admin@coffee.com', 'admin123');
    } else {
      onLogin('demo@customer.com', 'demo123');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="w-full max-w-lg">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Coffee className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">Java Coffee Shop</h1>
          <p className="text-gray-600">Your personalized coffee experience</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-4">
          <h2 className="text-gray-900 mb-6 text-center">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 text-sm">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 text-sm">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-900 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onNavigateToRegister}
              className="text-amber-900 hover:text-amber-800 text-sm"
            >
              Don't have an account? <span className="underline">Sign up</span>
            </button>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="mb-2">Demo Credentials:</p>
              <div className="space-y-2">
                <button
                  onClick={() => handleDemoLogin('admin')}
                  className="block w-full text-left bg-white rounded px-3 py-2 hover:bg-blue-100 transition-colors"
                >
                  <div className="text-xs text-blue-600 mb-1">Admin Account</div>
                  <div className="text-xs">admin@coffee.com / admin123</div>
                </button>
                <button
                  onClick={() => handleDemoLogin('customer')}
                  className="block w-full text-left bg-white rounded px-3 py-2 hover:bg-blue-100 transition-colors"
                >
                  <div className="text-xs text-blue-600 mb-1">Customer Account</div>
                  <div className="text-xs">demo@customer.com / demo123</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}