import React, { useState, useEffect } from 'react';
import Notification from './Notification';

const KitchenDisplaySystem = () => {
    const [orders, setOrders] = useState([]);
    const [notification, setNotification] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [permissions, setPermissions] = useState([]);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        fetchPermissions();
        fetchOrders();
        // Refresh orders every 2 seconds
        const orderInterval = setInterval(fetchOrders, 2000);
        // Refresh permissions every 5 seconds to catch role/permission changes
        const permissionInterval = setInterval(fetchPermissions, 5000);
        return () => {
            clearInterval(orderInterval);
            clearInterval(permissionInterval);
        };
    }, []);

    const fetchPermissions = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch('http://localhost:3001/api/my-permissions', {
                headers: { 'Authorization': token ? `Bearer ${token}` : '' }
            });
            const data = await response.json();
            console.log('📦 Fetched permissions from API:', data);
            setPermissions(data.permissions || []);
            setUserRole(data.role || '');
            console.log('✅ Permissions set to:', data.permissions);
        } catch (err) {
            console.error('❌ Error fetching permissions:', err);
            // If error, allow all permissions for admin/chef roles
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.log('🔐 User from token:', payload);
                    if (payload.role === 'admin' || payload.role === 'chef') {
                        console.log('⭐ Chef/Admin role detected - granting all permissions');
                        setPermissions(['*']);
                    }
                    setUserRole(payload.role || '');
                } catch (e) {
                    console.error('Error parsing token:', e);
                }
            }
        }
    };

    const hasPermission = (permissionName) => {
        const hasWildcard = permissions.includes('*');
        const hasPermissionInList = permissions.includes(permissionName);
        const result = hasWildcard || hasPermissionInList;
        
        // If chef role specifically - grant all KDS permissions as failsafe
        if (userRole === 'chef') {
            const chefPermissions = ['mark_order_preparing', 'mark_order_ready', 'confirm_order_delivery'];
            if (chefPermissions.includes(permissionName)) {
                console.log(`✅ Chef role detected - AUTO GRANTING: ${permissionName}`);
                return true;
            }
        }
        
        console.log(`🔍 Checking permission: "${permissionName}"`);
        console.log(`   User Role: ${userRole}`);
        console.log(`   Current permissions: ${JSON.stringify(permissions)}`);
        console.log(`   Has wildcard (*): ${hasWildcard}`);
        console.log(`   Has in list: ${hasPermissionInList}`);
        console.log(`   Result: ${result}`);
        
        return result;
    };

    const fetchOrders = () => {
        fetch('http://localhost:3001/api/orders')
            .then(res => res.json())
            .then(data => setOrders(data.filter(o => o.status !== 'completed')))
            .catch(err => console.error('Error fetching orders:', err));
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        // Check permission before updating
        if (newStatus === 'preparing' && !hasPermission('mark_order_preparing')) {
            setNotification({ message: '❌ You don\'t have permission to mark orders as preparing', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
            return;
        }
        if (newStatus === 'ready' && !hasPermission('mark_order_ready')) {
            setNotification({ message: '❌ You don\'t have permission to mark orders as ready', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
            return;
        }
        if (newStatus === 'completed' && !hasPermission('confirm_order_delivery')) {
            setNotification({ message: '❌ You don\'t have permission to mark orders as delivered', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
            return;
        }

        const token = localStorage.getItem('authToken');
        try {
            let response;
            
            // For delivery (completed), use the confirm-delivery endpoint which auto-generates bills
            if (newStatus === 'completed') {
                response = await fetch(`http://localhost:3001/api/orders/${orderId}/confirm-delivery`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                    },
                    body: JSON.stringify({ tax_rate: 0.05 })
                });
            } else {
                // For other status changes, use the regular update endpoint
                response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                    },
                    body: JSON.stringify({ status: newStatus })
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update order status');
            }

            setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
            setNotification({ 
                message: newStatus === 'completed' 
                    ? `✅ Order #${orderId} delivered & bill generated` 
                    : `✅ Order #${orderId} → ${newStatus.toUpperCase()}`, 
                type: 'success' 
            });
        } catch (error) {
            console.error('Error updating order status:', error);
            setNotification({ message: `Error: ${error.message || 'Could not update order status'}`, type: 'error' });
        }
        setTimeout(() => setNotification(null), 3000);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return 'bg-red-100 border-red-300';
            case 'preparing': return 'bg-yellow-100 border-yellow-300';
            case 'ready': return 'bg-green-100 border-green-300';
            default: return 'bg-gray-100 border-gray-300';
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending': return { icon: '⏳', label: 'PENDING', color: 'bg-red-500' };
            case 'preparing': return { icon: '👨‍🍳', label: 'PREPARING', color: 'bg-yellow-500' };
            case 'ready': return { icon: '✅', label: 'READY', color: 'bg-green-500' };
            default: return { icon: '❓', label: 'UNKNOWN', color: 'bg-gray-500' };
        }
    };

    const OrderCard = ({ order, onStatusChange }) => {
        const statusBadge = getStatusBadge(order.status);
        return (
            <div className={`rounded-lg shadow-lg border-2 p-5 flex flex-col justify-between h-full transition-all ${getStatusColor(order.status)}`}>
                <div>
                    {/* Order Header with Table and Status */}
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <p className="text-sm font-bold text-gray-600">Order #{order.id}</p>
                            <p className="text-2xl font-bold text-gray-900">Table <span className="text-3xl text-orange-600">{order.table_name}</span></p>
                        </div>
                        <div className={`${statusBadge.color} text-white px-3 py-2 rounded-lg font-bold text-center`}>
                            <div className="text-2xl">{statusBadge.icon}</div>
                            <div className="text-xs mt-1">{statusBadge.label}</div>
                        </div>
                    </div>

                    {/* Time Info */}
                    <p className="text-xs text-gray-600 mb-4">
                        🕐 {new Date(order.timestamp).toLocaleTimeString()} 
                        {' '} • {Math.floor((Date.now() - new Date(order.timestamp).getTime()) / 60000)}m ago
                    </p>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg p-3 mb-3">
                        <h4 className="font-bold text-gray-800 mb-2 text-sm">Items to Prepare:</h4>
                        <ul className="space-y-1">
                            {(order.items || []).map((item, idx) => (
                                <li key={idx} className="text-gray-800 flex justify-between items-center text-sm">
                                    <span><strong>{item.qty || item.quantity}x</strong> {item.name}</span>
                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">₹{item.price}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t pt-2 mt-2 font-bold text-right text-gray-900">
                            Total: ₹{order.total}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t-2 border-gray-300 space-y-2">
                    {order.status === 'pending' && (
                        <button
                            onClick={() => onStatusChange(order.id, 'preparing')}
                            disabled={!hasPermission('mark_order_preparing')}
                            className={`w-full text-white font-bold py-3 rounded-lg shadow-md transition-all transform ${
                                hasPermission('mark_order_preparing')
                                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 cursor-pointer'
                                    : 'bg-gray-400 cursor-not-allowed opacity-60'
                            }`}
                            title={!hasPermission('mark_order_preparing') ? '❌ No permission to mark as preparing' : ''}
                        >
                            👨‍🍳 Mark Preparing
                        </button>
                    )}
                    {order.status === 'preparing' && (
                        <button
                            onClick={() => onStatusChange(order.id, 'ready')}
                            disabled={!hasPermission('mark_order_ready')}
                            className={`w-full text-white font-bold py-3 rounded-lg shadow-md transition-all transform ${
                                hasPermission('mark_order_ready')
                                    ? 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 hover:scale-105 cursor-pointer'
                                    : 'bg-gray-400 cursor-not-allowed opacity-60'
                            }`}
                            title={!hasPermission('mark_order_ready') ? '❌ No permission to mark as ready' : ''}
                        >
                            ✅ Mark Ready for Pickup
                        </button>
                    )}
                    {order.status === 'ready' && (
                        <button
                            onClick={() => onStatusChange(order.id, 'completed')}
                            disabled={!hasPermission('confirm_order_delivery')}
                            className={`w-full text-white font-bold py-3 rounded-lg shadow-md transition-all transform ${
                                hasPermission('confirm_order_delivery')
                                    ? 'primary-gradient hover:scale-105 hover:shadow-lg cursor-pointer'
                                    : 'bg-gray-400 cursor-not-allowed opacity-60'
                            }`}
                            title={!hasPermission('confirm_order_delivery') ? '❌ No permission to confirm delivery' : ''}
                        >
                            🎉 Mark Delivered
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const preparingOrders = orders.filter(o => o.status === 'preparing');
    const readyOrders = orders.filter(o => o.status === 'ready');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-white mb-2">🍳 Kitchen Display System</h1>
                <p className="text-gray-300">Manage orders in real-time • Auto-refreshing every 3 seconds</p>
                <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className="mt-2 text-xs text-orange-400 hover:text-orange-300 underline"
                >
                    {autoRefresh ? '🔄 Auto-refresh ON' : '⏸ Auto-refresh OFF'}
                </button>
            </div>

            {/* 3-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* NEW ORDERS - Red/Pending */}
                <div className="rounded-xl shadow-2xl overflow-hidden border-2 border-red-500 bg-red-950">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 text-center">
                        <h2 className="text-2xl font-bold text-white">⏳ NEW ORDERS</h2>
                        <p className="text-red-100 text-sm mt-1">{pendingOrders.length} waiting</p>
                    </div>
                    <div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {pendingOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-xl">✓ All caught up!</p>
                                <p className="text-gray-600 text-sm mt-2">No pending orders</p>
                            </div>
                        ) : (
                            pendingOrders.map(order => (
                                <OrderCard key={order.id} order={order} onStatusChange={handleUpdateOrderStatus} />
                            ))
                        )}
                    </div>
                </div>

                {/* IN PROGRESS - Yellow/Preparing */}
                <div className="rounded-xl shadow-2xl overflow-hidden border-2 border-yellow-500 bg-yellow-950">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 text-center">
                        <h2 className="text-2xl font-bold text-white">👨‍🍳 PREPARING</h2>
                        <p className="text-yellow-100 text-sm mt-1">{preparingOrders.length} in progress</p>
                    </div>
                    <div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {preparingOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-xl">✓ Nothing cooking</p>
                                <p className="text-gray-600 text-sm mt-2">All items are prepared</p>
                            </div>
                        ) : (
                            preparingOrders.map(order => (
                                <OrderCard key={order.id} order={order} onStatusChange={handleUpdateOrderStatus} />
                            ))
                        )}
                    </div>
                </div>

                {/* READY - Green/Ready */}
                <div className="rounded-xl shadow-2xl overflow-hidden border-2 border-green-500 bg-green-950">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-center">
                        <h2 className="text-2xl font-bold text-white">✅ READY FOR PICKUP</h2>
                        <p className="text-green-100 text-sm mt-1">{readyOrders.length} ready</p>
                    </div>
                    <div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {readyOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-xl">✓ No ready orders</p>
                                <p className="text-gray-600 text-sm mt-2">Waiting for items</p>
                            </div>
                        ) : (
                            readyOrders.map(order => (
                                <OrderCard key={order.id} order={order} onStatusChange={handleUpdateOrderStatus} />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {notification && (
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                    onClose={() => setNotification(null)} 
                />
            )}
        </div>
    );
};

export default KitchenDisplaySystem; 