import React, { useState, useEffect, useRef } from 'react';
import Notification from './Notification';
import { CheckCircle, Printer, Tag, CreditCard, DollarSign, Smartphone, Globe, Utensils } from 'lucide-react';

const BillingPage = ({ locationSettings }) => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedBill, setSelectedBill] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [notification, setNotification] = useState(null);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [discountType, setDiscountType] = useState('percent'); // 'percent' or 'fixed'
    const billRef = useRef(null);
    const taxRate = locationSettings.taxRate || 0.05;

    useEffect(() => {
        fetchDeliveredOrders();
        const interval = setInterval(fetchDeliveredOrders, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchDeliveredOrders = () => {
        const token = localStorage.getItem('authToken');
        fetch('http://localhost:3001/api/orders?status=delivered', {
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        })
            .then(res => res.json())
            .then(data => {
                const filtered = Array.isArray(data) ? data : [];
                setOrders(filtered);
            })
            .catch(err => {
                console.error('Error fetching delivered orders:', err);
                setOrders([]);
            });
    };

    const fetchBillForOrder = async (orderId) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${orderId}/bill`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            if (response.ok) {
                const bill = await response.json();
                setSelectedBill(bill);
                return bill;
            }
        } catch (error) {
            console.error('Error fetching bill:', error);
        }
        return null;
    };

    const calculateTotals = (order, discount = 0, discountTypeParam = 'percent') => {
        if (!order) return { subtotal: 0, discount: 0, discountAmount: 0, tax: 0, total: 0 };
        const subtotal = (order.items || []).reduce((sum, item) => sum + item.price * (item.quantity || item.qty), 0);
        
        // Calculate discount
        let discountAmount = 0;
        if (discount > 0) {
            if (discountTypeParam === 'percent') {
                discountAmount = subtotal * (discount / 100);
            } else {
                discountAmount = discount;
            }
        }
        
        const afterDiscount = subtotal - discountAmount;
        const tax = afterDiscount * taxRate;
        const total = afterDiscount + tax;
        
        return { subtotal, discount, discountAmount, tax, total, afterDiscount };
    };

    const handleSelectOrder = async (order) => {
        setSelectedOrder(order);
        setDiscountPercent(0);
        setDiscountType('percent');
        const bill = await fetchBillForOrder(order.id);
        if (!bill) {
            const totals = calculateTotals(order, 0, 'percent');
            setSelectedBill({
                subtotal: totals.subtotal,
                tax: totals.tax,
                total: totals.total,
                bill_status: 'pending'
            });
        }
    };

    const handleCompletePayment = async () => {
        if (!selectedOrder) {
            setNotification({ message: 'Please select an order to process payment.', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
            return;
        }

        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${selectedOrder.id}/complete-payment`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ payment_method: paymentMethod })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setNotification({ 
                message: `✅ Payment completed for Order #${selectedOrder.id} (${paymentMethod})!`, 
                type: 'success' 
            });
            setTimeout(() => setNotification(null), 3000);
            
            handlePrintBill();
            
            // Remove from orders list
            setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
            setSelectedOrder(null);
            setSelectedBill(null);
            setPaymentMethod('cash');
        } catch (error) {
            console.error('Error completing payment:', error);
            setNotification({ message: 'Error completing payment.', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handlePrintBill = () => {
        if (selectedOrder) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>Print Bill</title>');
            printWindow.document.write('<link href="https://cdn.tailwindcss.com" rel="stylesheet">');
            printWindow.document.write('<style>body { font-family: \'Inter\', sans-serif; margin: 20px; } .bill-header { text-align: center; margin-bottom: 20px; } .bill-items table { width: 100%; border-collapse: collapse; margin-top: 10px; } .bill-items th, .bill-items td { border: 1px solid #ddd; padding: 8px; text-align: left; } .bill-summary { margin-top: 20px; text-align: right; } .bill-summary div { display: flex; justify-content: space-between; margin-bottom: 5px; } .bill-footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #555; } @media print { body { margin: 0; } .no-print { display: none; } }</style></head><body>');
            const totals = currentOrderTotals || calculateTotals(selectedOrder, discountPercent, discountType);
            printWindow.document.write(`
                <div class="bill-header">
                    <h1 class="text-2xl font-bold">Restaurant POS Bill</h1>
                    <p class="text-sm">Order ID: ${selectedOrder.id} | Table: ${selectedOrder.table_name}</p>
                    <p class="text-sm">Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>
                <div class="bill-items">
                    <table class="w-full">
                        <thead>
                            <tr>
                                <th class="py-2 px-4 bg-gray-100 font-semibold text-sm text-gray-700">Item</th>
                                <th class="py-2 px-4 bg-gray-100 font-semibold text-sm text-gray-700 text-right">Qty</th>
                                <th class="py-2 px-4 bg-gray-100 font-semibold text-sm text-gray-700 text-right">Price</th>
                                <th class="py-2 px-4 bg-gray-100 font-semibold text-sm text-gray-700 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${selectedOrder.items.map(item => `
                                <tr>
                                    <td class="py-2 px-4 text-sm text-gray-800">${item.name}</td>
                                    <td class="py-2 px-4 text-sm text-gray-800 text-right">${item.quantity || item.qty}</td>
                                    <td class="py-2 px-4 text-sm text-gray-800 text-right">${locationSettings.currencySymbol}${item.price.toFixed(2)}</td>
                                    <td class="py-2 px-4 text-sm text-gray-800 text-right">${locationSettings.currencySymbol}${(item.price * (item.quantity || item.qty)).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="bill-summary">
                    <div class="text-md">
                        <span>Subtotal:</span>
                        <span>${locationSettings.currencySymbol}${totals.subtotal.toFixed(2)}</span>
                    </div>
                    ${discountPercent > 0 ? `
                    <div class="text-md text-red-600">
                        <span>Discount (${discountType === 'percent' ? discountPercent + '%' : locationSettings.currencySymbol + discountPercent}):</span>
                        <span>-${locationSettings.currencySymbol}${totals.discountAmount.toFixed(2)}</span>
                    </div>
                    <div class="text-md">
                        <span>After Discount:</span>
                        <span>${locationSettings.currencySymbol}${totals.afterDiscount.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    <div class="text-md">
                        <span>Tax (${taxRate * 100}%):</span>
                        <span>${locationSettings.currencySymbol}${totals.tax.toFixed(2)}</span>
                    </div>
                    <div class="text-lg font-bold border-t border-gray-300 pt-2 mt-2">
                        <span>Total Payable:</span>
                        <span>${locationSettings.currencySymbol}${totals.total.toFixed(2)}</span>
                    </div>
                    <p class="text-md mt-2">Payment Method: <span class="capitalize">${paymentMethod}</span></p>
                </div>
                <div class="bill-footer">
                    <p>Thank you for your business!</p>
                </div>
            `);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        } else {
            setNotification({ message: 'No order selected to print.', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const currentOrderTotals = calculateTotals(selectedOrder, discountPercent, discountType);

    return (
        <div className="p-6 bg-gray-50 min-h-screen rounded-lg shadow-inner">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Billing Page</h2>
            <p className="text-center text-gray-600 mb-6">
                {orders.length === 0 
                    ? (<span className="inline-flex items-center gap-2"><CheckCircle className="text-green-500" />All orders billed!</span>)
                    : `${orders.length} order(s) ready for payment`}
            </p>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Delivered Orders</h3>
                    {orders.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2"><CheckCircle size={48} className="text-green-500 mx-auto"/></div>
                            <p className="text-gray-500 text-lg">No orders waiting for payment.</p>
                            <p className="text-gray-400 text-sm mt-2">Orders appear here after waiters confirm delivery.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div
                                    key={order.id}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedOrder?.id === order.id ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-200 hover:bg-gray-50'}`}
                                    onClick={() => handleSelectOrder(order)}
                                >
                                    <p className="text-lg font-bold text-gray-800">Order #{order.id}</p>
                                    <p className="text-md text-gray-700 font-semibold"><Utensils className="inline mr-2 text-orange-500"/> Table {order.table_name}</p>
                                    <p className="text-sm text-gray-600 mt-1">Items: {(order.items || []).map(item => `${item.quantity || item.qty}x ${item.name}`).join(', ')}</p>
                                    <p className="text-lg text-green-600 font-bold mt-2">{locationSettings.currencySymbol}{order.total.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md" ref={billRef}>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Bill Details</h3>
                    {!selectedOrder ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2"><Printer size={40} className="mx-auto text-gray-500"/></div>
                            <p className="text-gray-500 text-lg">Select an order to view bill details.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
                                <p className="text-xl font-bold text-gray-900">Order #{selectedOrder.id}</p>
                                <p className="text-gray-700"><Utensils className="inline mr-2 text-orange-500"/> Table: {selectedOrder.table_name}</p>
                                <p className="text-gray-600 text-sm mt-1">Status: Delivered</p>
                            </div>
                            <div className="mb-4">
                                <h4 className="text-lg font-semibold text-gray-700 mb-3">Items:</h4>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    {(selectedOrder.items || []).map((item, index) => (
                                        <div key={index} className="flex justify-between text-gray-800">
                                            <span>{item.quantity || item.qty}x {item.name}</span>
                                            <span className="font-semibold">{locationSettings.currencySymbol}{(item.price * (item.quantity || item.qty)).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2 text-lg">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Subtotal:</span>
                                    <span className="font-semibold text-gray-900">{locationSettings.currencySymbol}{currentOrderTotals.subtotal.toFixed(2)}</span>
                                </div>
                                {discountPercent > 0 && (
                                    <>
                                        <div className="flex justify-between text-red-600">
                                            <span className="text-gray-700">Discount ({discountType === 'percent' ? discountPercent + '%' : locationSettings.currencySymbol + discountPercent}):</span>
                                            <span className="font-semibold">-{locationSettings.currencySymbol}{currentOrderTotals.discountAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-800">
                                            <span>After Discount:</span>
                                            <span className="font-semibold">{locationSettings.currencySymbol}{currentOrderTotals.afterDiscount.toFixed(2)}</span>
                                        </div>
                                    </>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Tax ({taxRate * 100}%):</span>
                                    <span className="font-semibold text-gray-900">{locationSettings.currencySymbol}{currentOrderTotals.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-2xl font-bold pt-3 border-t border-gray-300">
                                    <span className="text-gray-800">Total:</span>
                                    <span className="text-green-600">{locationSettings.currencySymbol}{currentOrderTotals.total.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-orange-800 mb-3"><Tag className="inline mr-2"/> Apply Discount:</h4>
                                <div className="flex gap-3 mb-3">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={discountType === 'percent'}
                                            onChange={() => setDiscountType('percent')}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-700">Percentage (%)</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={discountType === 'fixed'}
                                            onChange={() => setDiscountType('fixed')}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-700">Fixed Amount</span>
                                    </label>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={discountPercent}
                                        onChange={(e) => {
                                            const value = Math.max(0, parseFloat(e.target.value) || 0);
                                            if (discountType === 'percent' && value > 100) {
                                                setDiscountPercent(100);
                                            } else if (discountType === 'fixed' && value > currentOrderTotals.subtotal) {
                                                setDiscountPercent(currentOrderTotals.subtotal);
                                            } else {
                                                setDiscountPercent(value);
                                            }
                                        }}
                                        placeholder={discountType === 'percent' ? 'Enter %' : 'Enter amount'}
                                        className="flex-1 p-2 border border-orange-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                        min="0"
                                        step={discountType === 'percent' ? '1' : '0.01'}
                                    />
                                    <button
                                        onClick={() => setDiscountPercent(0)}
                                        className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold"
                                    >
                                        Clear
                                    </button>
                                </div>
                                {discountPercent > 0 && (
                                        <p className="text-sm text-orange-700 mt-2">
                                        Discount Amount: {locationSettings.currencySymbol}{currentOrderTotals.discountAmount.toFixed(2)}
                                    </p>
                                )}
                            </div>
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-700 mb-3">Payment Method:</h4>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="upi">UPI</option>
                                    <option value="online">Online Payment</option>
                                </select>
                            </div>
                            <button
                                onClick={handleCompletePayment}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg mt-6 text-xl shadow-lg transition-all transform hover:scale-105"
                            >
                                Complete Payment & Close Order
                            </button>
                            <button
                                onClick={handlePrintBill}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-lg mt-3 shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Printer /> Print Bill
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillingPage; 