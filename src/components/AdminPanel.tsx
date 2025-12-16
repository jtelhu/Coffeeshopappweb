import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Edit2, Trash2, TrendingUp, Clock, DollarSign, Package } from 'lucide-react';
import { DrinkItem } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AdminPanelProps {
  onBack: () => void;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
}

interface OrderAnalytics {
  id: string;
  orderNumber: string;
  items: any[];
  total: number;
  timestamp: string;
}

// Mock data for inventory and analytics
const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Espresso', category: 'Drinks', stock: 45 },
  { id: '2', name: 'Cappuccino', category: 'Drinks', stock: 38 },
  { id: '3', name: 'Latte', category: 'Drinks', stock: 52 },
  { id: '4', name: 'Mocha', category: 'Drinks', stock: 28 },
  { id: '5', name: 'Blueberry Muffin', category: 'Snacks', stock: 15 },
  { id: '6', name: 'Croissant', category: 'Snacks', stock: 22 },
  { id: '7', name: 'Peppermint Latte', category: 'Seasonal', stock: 8 },
  { id: '8', name: 'Gingerbread Cookie', category: 'Seasonal', stock: 31 },
];

const mockOrders: OrderAnalytics[] = [
  { id: '1', orderNumber: 'ORD-1001', items: [], total: 12.50, timestamp: '2024-12-15T08:30:00' },
  { id: '2', orderNumber: 'ORD-1002', items: [], total: 8.75, timestamp: '2024-12-15T09:15:00' },
  { id: '3', orderNumber: 'ORD-1003', items: [], total: 15.20, timestamp: '2024-12-15T09:45:00' },
  { id: '4', orderNumber: 'ORD-1004', items: [], total: 6.50, timestamp: '2024-12-15T10:20:00' },
  { id: '5', orderNumber: 'ORD-1005', items: [], total: 22.00, timestamp: '2024-12-15T11:00:00' },
  { id: '6', orderNumber: 'ORD-1006', items: [], total: 9.25, timestamp: '2024-12-15T11:30:00' },
  { id: '7', orderNumber: 'ORD-1007', items: [], total: 18.50, timestamp: '2024-12-15T12:00:00' },
  { id: '8', orderNumber: 'ORD-1008', items: [], total: 11.75, timestamp: '2024-12-15T13:15:00' },
];

const mockTopItems = [
  { name: 'Peppermint Latte', count: 45, revenue: 225.00 },
  { name: 'Cappuccino', count: 38, revenue: 190.00 },
  { name: 'Gingerbread Cookie', count: 32, revenue: 128.00 },
  { name: 'Mocha', count: 28, revenue: 154.00 },
  { name: 'Hot Chocolate', count: 25, revenue: 112.50 },
];

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'menu' | 'inventory' | 'analytics'>('menu');
  const [menuItems, setMenuItems] = useState<DrinkItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [orders, setOrders] = useState<OrderAnalytics[]>(mockOrders);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DrinkItem | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-8eeb856c`;

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'menu') {
        await fetchMenuItems();
      }
      // Inventory and Analytics use mock data - just simulate loading
      setTimeout(() => setLoading(false), 300);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${API_BASE}/menu`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await response.json();
      setMenuItems(data.items || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch(`${API_BASE}/inventory`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await response.json();
      setInventory(data.inventory || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE}/analytics/orders`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleSaveMenuItem = async (item: DrinkItem) => {
    try {
      const url = editingItem ? `${API_BASE}/menu/${item.id}` : `${API_BASE}/menu`;
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        await fetchMenuItems();
        setIsEditDialogOpen(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/menu/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      if (response.ok) {
        await fetchMenuItems();
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const handleUpdateInventory = async (id: string, stock: number) => {
    try {
      await fetch(`${API_BASE}/inventory/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ stock })
      });
      await fetchInventory();
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  // Analytics calculations
  const totalRevenue = orders.reduce((sum, order) => sum + (order?.total || 0), 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Top selling items
  const itemSales: { [key: string]: { name: string; count: number; revenue: number } } = {};
  orders.forEach(order => {
    if (!order || !order.items) return;
    order.items?.forEach((item: any) => {
      if (!item || !item.drink) return;
      const key = item.drink.name;
      if (!itemSales[key]) {
        itemSales[key] = { name: key, count: 0, revenue: 0 };
      }
      itemSales[key].count += item.quantity;
      itemSales[key].revenue += item.drink.price * item.quantity;
    });
  });
  const topItems = Object.values(itemSales).sort((a, b) => b.count - a.count).slice(0, 5);

  // Peak hours
  const hourlyOrders: { [key: number]: number } = {};
  orders.forEach(order => {
    const hour = new Date(order.timestamp).getHours();
    hourlyOrders[hour] = (hourlyOrders[hour] || 0) + 1;
  });
  const peakHour = Object.entries(hourlyOrders).sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-16 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-600">Manage your coffee shop</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'menu' ? 'bg-amber-900 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'inventory' ? 'bg-amber-900 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'analytics' ? 'bg-amber-900 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading...</div>
        ) : (
          <>
            {/* Menu Management Tab */}
            {activeTab === 'menu' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-900">Menu Items</h3>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setIsEditDialogOpen(true);
                    }}
                    className="flex items-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {menuItems.filter(item => item !== null && item !== undefined).map(item => (
                    <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h4 className="text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <p className="text-amber-900">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsEditDialogOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory Management Tab */}
            {activeTab === 'inventory' && (
              <div>
                <h3 className="text-gray-900 mb-4">Inventory Management (Demo)</h3>
                <div className="space-y-3">
                  {mockInventory.map(item => (
                    <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.category}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          item.stock > 20 ? 'bg-green-100 text-green-700' :
                          item.stock > 10 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.stock} in stock
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Total Revenue</span>
                    </div>
                    <div className="text-gray-900">${totalRevenue.toFixed(2)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Package className="w-4 h-4" />
                      <span className="text-sm">Total Orders</span>
                    </div>
                    <div className="text-gray-900">{totalOrders}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">Avg Order Value</span>
                    </div>
                    <div className="text-gray-900">${averageOrderValue.toFixed(2)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Peak Hour</span>
                    </div>
                    <div className="text-gray-900">
                      {peakHour ? `${peakHour[0]}:00` : '9:00'}
                    </div>
                  </div>
                </div>

                {/* Top Selling Items */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="text-gray-900 mb-4">Top Selling Items (Demo)</h3>
                  <div className="space-y-3">
                    {mockTopItems.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center">
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-600">{item.count} sold</div>
                          </div>
                        </div>
                        <div className="text-amber-900">${item.revenue.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="text-gray-900 mb-4">Recent Orders (Demo)</h3>
                  <div className="space-y-3">
                    {orders.slice(0, 10).map(order => (
                      <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <div className="text-gray-900">{order.orderNumber}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(order.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-amber-900">${order.total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <MenuItemDialog
          item={editingItem}
          onSave={handleSaveMenuItem}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

interface MenuItemDialogProps {
  item: DrinkItem | null;
  onSave: (item: DrinkItem) => void;
  onClose: () => void;
}

function MenuItemDialog({ item, onSave, onClose }: MenuItemDialogProps) {
  const [formData, setFormData] = useState<DrinkItem>(
    item || {
      id: Date.now().toString(),
      name: '',
      category: 'drinks',
      price: 0,
      image: '',
      description: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-gray-900 mb-4">{item ? 'Edit Item' : 'Add New Item'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
            >
              <option value="drinks">Drinks</option>
              <option value="snacks">Snacks</option>
              <option value="seasonal">Seasonal</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-2">Price</label>
            <input
              type="number"
              step="0.01"
              value={isNaN(formData.price) ? '' : formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-2">Image URL</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
              rows={3}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}