import React, { useState, useEffect } from 'react';
import Notification from './Notification';

const OrderEntryModal = ({ table, onClose, onOrderPlaced, locationSettings, nextOrderId, setNextOrderId, orderType, initialOrder }) => {
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState({});
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/menu')
            .then(res => res.json())
            .then(setMenu);
    }, []);

    // Pre-fill cart if initialOrder is provided
    useEffect(() => {
        if (initialOrder && initialOrder.items) {
            const prefill = {};
            initialOrder.items.forEach(item => {
                prefill[item.productId || item.id] = {
                    ...item,
                    id: item.productId || item.id,
                    qty: item.quantity || item.qty || 1
                };
            });
            setCart(prefill);
        }
    }, [initialOrder]);

    const addToCart = (item) => {
        setCart(prevCart => ({
            ...prevCart,
            [item.id]: {
                ...item,
                qty: (prevCart[item.id]?.qty || 0) + 1
            }
        }));
        setNotification({ message: `${item.name} added to cart!`, type: 'success' });
        setTimeout(() => setNotification(null), 3000);
    };

    const updateCartQty = (itemId, change) => {
        setCart(prevCart => {
            const newCart = { ...prevCart };
            const item = newCart[itemId];
            if (item) {
                item.qty += change;
                if (item.qty <= 0) {
                    delete newCart[itemId];
                }
            }
            return newCart;
        });
    };

    const clearCart = () => {
        setCart({});
        setNotification({ message: "Cart cleared!", type: "success" });
        setTimeout(() => setNotification(null), 3000);
    };

    const placeOrder = async () => {
        const orderItems = Object.values(cart).map(item => ({
            productId: item.id,
            name: item.name,
            quantity: item.qty,
            price: item.price
        }));
        if (orderItems.length === 0) {
            setNotification({ message: "Cart is empty. Please add items.", type: "error" });
            setTimeout(() => setNotification(null), 3000);
            return;
        }
        const newOrder = {
            table_name: table && table.id ? table.id : '',
            items: orderItems,
            total: Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0),
            status: 'pending',
            type: orderType,
            timestamp: new Date().toISOString()
        };
        try {
            const res = await fetch('http://localhost:3001/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder)
            });
            const placedOrder = await res.json();
            setCart({});
            onOrderPlaced(placedOrder);
            setNotification({ message: 'Order placed successfully!', type: 'success' });
            setTimeout(() => {
                setNotification(null);
                onClose();
            }, 1500);
        } catch (error) {
            setNotification({ message: 'Error placing order.', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const totalAmount = Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800">
                        New {orderType === 'TAKEAWAY' ? 'Takeaway' : 'Dine-In'} Order for {table && table.id === 'Takeaway' ? 'Takeaway' : table && table.id ? `Table ${table.id}` : ''}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
                <div className="p-6 flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Menu Items</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {menu.map(item => (
                                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between shadow-sm">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-600">{locationSettings.currencySymbol}{item.price.toFixed(2)}</p>
                                    </div>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="bg-orange-400 hover:bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg"
                                    >
                                        +
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Current Order</h4>
                        {Object.keys(cart).length === 0 ? (
                            <p className="text-gray-500">Add items to order.</p>
                        ) : (
                            <>
                                {Object.values(cart).map(item => (
                                    <div key={item.id} className="flex items-center justify-between border-b border-gray-200 py-2 last:border-b-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-600">{locationSettings.currencySymbol}{item.price.toFixed(2)} x {item.qty}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => updateCartQty(item.id, -1)}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold"
                                            >
                                                -
                                            </button>
                                            <span className="font-semibold text-gray-900">{item.qty}</span>
                                            <button
                                                onClick={() => updateCartQty(item.id, 1)}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4 pt-3 border-t border-gray-300 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-800">Total:</span>
                                    <span className="text-xl font-bold text-green-700">{locationSettings.currencySymbol}{totalAmount}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="p-4 border-t border-gray-200 flex justify-end space-x-4">
                    <button
                        onClick={clearCart}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Clear Cart
                    </button>
                    <button
                        onClick={placeOrder}
                        className="btn-gradient px-6 py-3"
                    >
                        Confirm Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderEntryModal; 