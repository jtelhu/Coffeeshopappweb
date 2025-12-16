import { UserData } from '../App';
import { User, Mail, Phone, Award, LogOut, ChevronLeft, Shield, Crown, Medal, Trophy } from 'lucide-react';

interface ProfileProps {
  user: UserData;
  onLogout: () => void;
  onBack: () => void;
  onAdminPanel?: () => void;
}

export function Profile({ user, onLogout, onBack, onAdminPanel }: ProfileProps) {
  const getLoyaltyTier = () => {
    if (user.loyaltyPoints >= 500) return { name: 'Gold', color: 'from-yellow-600 to-yellow-700', icon: Crown, textColor: 'text-yellow-50' };
    if (user.loyaltyPoints >= 200) return { name: 'Silver', color: 'from-slate-500 to-slate-600', icon: Trophy, textColor: 'text-slate-50' };
    return { name: 'Bronze', color: 'from-amber-700 to-amber-800', icon: Medal, textColor: 'text-amber-50' };
  };

  const tier = getLoyaltyTier();
  const TierIcon = tier.icon;
  const nextLevelPoints = user.loyaltyPoints >= 500 ? 0 : user.loyaltyPoints >= 200 ? 500 - user.loyaltyPoints : 200 - user.loyaltyPoints;
  const progressPercentage = user.loyaltyPoints >= 500 ? 100 : 
    user.loyaltyPoints >= 200 ? ((user.loyaltyPoints - 200) / 300) * 100 : 
    (user.loyaltyPoints / 200) * 100;

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-gray-900">My Profile</h2>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-amber-900 rounded-full flex items-center justify-center text-blue">
            {user.role === 'admin' ? <Shield className="w-8 h-8" /> : <User className="w-8 h-8" />}
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">{user.name}</h3>
            {user.role === 'admin' && (
              <span className="inline-block bg-amber-900 text-white text-xs px-2 py-1 rounded">
                Admin
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="w-5 h-5" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="w-5 h-5" />
            <span>{user.phone}</span>
          </div>
        </div>
      </div>

      {/* Loyalty Rewards with Tier Badge */}
      <div className={`bg-gradient-to-br ${tier.color} rounded-lg shadow-lg p-6 mb-4 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6" />
            <h3>Loyalty Rewards</h3>
          </div>
          <div className="flex items-center gap-1 bg-black bg-opacity-20 px-3 py-1 rounded-full">
            <TierIcon className="w-4 h-4" />
            <span className="text-sm">{tier.name}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-end mb-2">
            <span className="text-white text-opacity-90 text-sm">{tier.name} Member</span>
            <span className="text-2xl">⭐ {user.loyaltyPoints}</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {nextLevelPoints > 0 && (
            <p className="text-white text-opacity-90 text-sm mt-2">
              {nextLevelPoints} points to {tier.name === 'Bronze' ? 'Silver' : 'Gold'}
            </p>
          )}
          {user.loyaltyPoints >= 500 && (
            <p className="text-white text-opacity-90 text-sm mt-2">
              🎉 You've reached the highest tier!
            </p>
          )}
        </div>

        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <p className="text-sm text-black text-opacity-90 mb-2">Tier Benefits</p>
          <ul className="space-y-1 text-sm">
            {tier.name === 'Bronze' && (
              <>
                <li className="text-sm text-black text-opacity-90 mb-2">• Earn 1 point per $1 spent</li>
                <li className="text-sm text-black text-opacity-90 mb-2">• Birthday reward</li>
                <li className="text-sm text-black text-opacity-90 mb-2">• Exclusive offers</li>
              </>
            )}
            {tier.name === 'Silver' && (
              <>
                <li className="text-sm text-black text-opacity-90 mb-2">• Earn 1.5 points per $1 spent</li>
                <li className="text-sm text-black text-opacity-90 mb-2">• Free birthday drink</li>
                <li className="text-sm text-black text-opacity-90 mb-2">• Early access to new items</li>
                <li className="text-sm text-black text-opacity-90 mb-2">• 10% off all orders</li>
              </>
            )}
            {tier.name === 'Gold' && (
              <>
                <li className="text-sm text-black text-opacity-90 mb-2">• Earn 2 points per $1 spent</li>
                <li className="text-sm text-black text-opacity-90 mb-2">• Free birthday cake & drink</li>
                <li className="text-sm text-black text-opacity-90 mb-2">• Priority service</li>
                <li className="text-sm text-black text-opacity-90 mb-2">• 15% off all orders</li>
                <li className="text-sm text-black text-opacity-90 mb-2">• Free delivery on all orders</li>
              </>
            )}
          </ul>
        </div>

        <div className="mt-4 pt-4 border-t border-white border-opacity-20">
          <p className="text-sm text-white text-opacity-90 mb-2">Redeem Your Points</p>
          <div className="text-xs space-y-1 text-white text-opacity-80">
            <p>• 100 pts = $1.00 off your order</p>
            <p>• Apply points at checkout</p>
          </div>
        </div>
      </div>

      {/* Order Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <h3 className="text-gray-900 mb-4">Order Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-amber-900 mb-1">{user.orders.length}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-amber-900 mb-1">{user.loyaltyPoints}</div>
            <div className="text-sm text-gray-600">Points Earned</div>
          </div>
        </div>
      </div>

      {/* Admin Panel Access (if admin) */}
      {user.role === 'admin' && onAdminPanel && (
        <button
          onClick={onAdminPanel}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-4"
        >
          <Shield className="w-5 h-5" />
          Open Admin Panel
        </button>
      )}

      {/* Admin Badge (if admin) */}
      {user.role === 'admin' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-blue-900">Admin Access</h3>
          </div>
          <p className="text-sm text-blue-700">
            You have administrator privileges. This account can access advanced features and settings.
          </p>
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}