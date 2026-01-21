import React, { useState, useEffect } from 'react';
import Notification from './Notification';

const WaiterDeliveryPanel = ({ locationSettings }) => {
  const [readyOrders, setReadyOrders] = useState([]);
  const [notification, setNotification] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchReadyOrders();
    const interval = setInterval(fetchReadyOrders, 3000); // Auto-refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchReadyOrders = () => {
    const token = localStorage.getItem('authToken');
    fetch('http://localhost:3001/api/orders?status=ready', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
      .then(res => res.json())
      .then(data => {
        const filtered = Array.isArray(data) 
          ? data.filter(o => o.type === 'DINE_IN') 
          : [];
        setReadyOrders(filtered);
      })
      .catch(err => {
        console.error('Error fetching ready orders:', err);
        setReadyOrders([]);
      });
  };

  const handleConfirmDelivery = async (orderId) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}/confirm-delivery`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tax_rate: locationSettings.taxRate || 0.05 })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Remove from ready orders
      setReadyOrders(prev => prev.filter(o => o.id !== orderId));
      setSelectedOrder(null);
      setNotification({ 
        message: `✅ Order #${orderId} delivered! Bill generated automatically.`, 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error confirming delivery:', error);
      setNotification({ 
        message: 'Error confirming delivery. Please try again.', 
        type: 'error' 
      });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const OrderCard = ({ order }) => {
    const prepTime = Math.floor((Date.now() - new Date(order.timestamp).getTime()) / 60000);
    
    return (
      <div className="bg-white rounded-lg shadow-lg border-4 border-green-500 p-5 mb-4 hover:shadow-xl transition-all">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm font-bold text-gray-600">Order #{order.id}</p>
            <p className="text-3xl font-bold text-green-600">Table {order.table_name}</p>
          </div>
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-center">
            <div className="text-2xl">✅</div>
            <div className="text-xs mt-1">READY</div>
          </div>
        </div>

        {/* Time Info */}
        <p className="text-xs text-gray-600 mb-4">
          🕐 Ready for pickup | Prep time: {prepTime}m
        </p>

        {/* Order Items */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-3 text-sm">Items Ready:</h4>
          <ul className="space-y-2">
            {(order.items || []).map((item, idx) => (
              <li key={idx} className="text-gray-800 flex justify-between items-center text-sm">
                <span className="flex items-center">
                  <span className="font-bold text-green-600 mr-2">{item.quantity || item.qty}x</span>
                  <span>{item.name}</span>
                </span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {locationSettings.currencySymbol}{item.price}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t pt-3 mt-3 font-bold text-right text-gray-900 text-lg">
            Total: {locationSettings.currencySymbol}{order.total}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleConfirmDelivery(order.id)}
          className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-4 px-4 rounded-lg shadow-md transition-all transform hover:scale-105 text-lg"
        >
          🚚 Confirm Delivery & Close Order
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-lg shadow-inner">
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Waiter Delivery Panel</h2>
      <p className="text-center text-gray-600 mb-6">
        {readyOrders.length === 0 
          ? '🎉 No orders ready for delivery' 
          : `📦 ${readyOrders.length} order(s) ready for delivery`}
      </p>

      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Auto-refresh toggle */}
      <div className="mb-6 flex items-center justify-center">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="w-4 h-4 text-green-600 rounded"
          />
          <span className="ml-2 text-gray-700 font-semibold">Auto-refresh (every 3 seconds)</span>
        </label>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {readyOrders.length > 0 ? (
          readyOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-md p-12 text-center border-2 border-dashed border-green-300">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">All caught up!</p>
            <p className="text-gray-600">No orders are ready for delivery right now.</p>
            <p className="text-gray-500 text-sm mt-4">Refreshing automatically every 3 seconds...</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {readyOrders.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{readyOrders.length}</div>
              <div className="text-gray-600 text-sm">Orders Ready</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">
                {locationSettings.currencySymbol}{readyOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
              </div>
              <div className="text-gray-600 text-sm">Total Amount</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {readyOrders.reduce((sum, o) => sum + (o.items || []).length, 0)}
              </div>
              <div className="text-gray-600 text-sm">Total Items</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaiterDeliveryPanel;
