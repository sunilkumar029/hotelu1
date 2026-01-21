import React, { useState, useEffect } from 'react';
import Notification from './Notification';
import OrderEntryModal from './OrderEntryModal';

const TakeawayManagement = ({ locationSettings, nextOrderId, setNextOrderId }) => {
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [activeOrders, setActiveOrders] = useState([]);
    const [notification, setNotification] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/orders?type=TAKEAWAY')
            .then(res => {
                if (!res.ok) {
                    console.error('Server error:', res.status, res.statusText);
                    setActiveOrders([]);
                    return Promise.reject(new Error(`HTTP ${res.status}: ${res.statusText}`));
                }
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error('Orders response is not an array:', data);
                    setActiveOrders([]);
                    return;
                }
                setActiveOrders(data.filter(o => o.status !== 'completed'));
            })
            .catch(err => {
                console.error('Failed to fetch TAKEAWAY orders:', err);
                setActiveOrders([]);
            });
    }, []);

    const handleQuickOrder = () => {
        setShowOrderModal(true);
    };

    const handleOrderPlaced = async (orderData) => {
        try {
            const res = await fetch('http://localhost:3001/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            const placedOrder = await res.json();
            setActiveOrders(prev => [...prev, placedOrder]);
            setNotification({ message: 'Takeaway order placed!', type: 'success' });
        } catch (error) {
            setNotification({ message: 'Error placing takeaway order.', type: 'error' });
        }
        setShowOrderModal(false);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleMarkCompleted = async (orderId) => {
        try {
            await fetch(`http://localhost:3001/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'completed' })
            });
            setActiveOrders(prev => prev.filter(order => order.id !== orderId));
            setNotification({ message: `Takeaway Order #${orderId} marked as completed!`, type: 'success' });
        } catch (error) {
            setNotification({ message: 'Error completing takeaway order.', type: 'error' });
        }
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen rounded-lg shadow-inner">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Takeaway Order Management</h2>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <div className="flex justify-center mb-8">
                <button
                    onClick={handleQuickOrder}
                    className="btn-gradient px-6 py-3 flex items-center"
                >
                    Place New Takeaway Order
                </button>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Active Takeaway Orders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeOrders.length === 0 ? (
                    <p className="text-gray-500">No active takeaway orders.</p>
                ) : (
                    activeOrders.map(order => (
                        <div key={order.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                            <p className="text-lg font-semibold text-gray-800">Order #{order.id} - {order.table_name}</p>
                            <p className="text-sm text-gray-600">Status: <span className="capitalize font-medium">{order.status}</span></p>
                            <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
                                {(order.items || []).map((item, idx) => (
                                    <li key={idx}>{item.qty || item.quantity}x {item.name}</li>
                                ))}
                            </ul>
                            <p className="mt-2 text-md font-bold text-green-700">{locationSettings.currencySymbol}{(typeof order.total === 'number' && !isNaN(order.total) ? order.total : 0).toFixed(2)}</p>
                            <button
                                onClick={() => { setEditingOrder(order); setShowOrderModal(true); }}
                                className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold transition-colors"
                            >
                                Add More Items
                            </button>
                            <button
                                onClick={() => handleMarkCompleted(order.id)}
                                className="mt-4 w-full btn-gradient py-2"
                            >
                                Mark as Completed
                            </button>
                        </div>
                    ))
                )}
            </div>
            {showOrderModal && (
                <OrderEntryModal
                    table={editingOrder ? { id: 'Takeaway', status: 'available', capacity: 0 } : { id: 'Takeaway', status: 'available', capacity: 0 }}
                    onClose={() => { setShowOrderModal(false); setEditingOrder(null); }}
                    onOrderPlaced={editingOrder ? (orderData => {
                        setActiveOrders(prev => prev.map(o => o.id === editingOrder.id ? { ...o, items: orderData.items, total: orderData.total } : o));
                        setNotification({ message: `Takeaway order #${editingOrder.id} updated!`, type: 'success' });
                        setEditingOrder(null);
                        setTimeout(() => setNotification(null), 3000);
                    }) : handleOrderPlaced}
                    locationSettings={locationSettings}
                    nextOrderId={nextOrderId}
                    setNextOrderId={setNextOrderId}
                    orderType="TAKEAWAY"
                    initialOrder={editingOrder}
                />
            )}
        </div>
    );
};

export default TakeawayManagement; 