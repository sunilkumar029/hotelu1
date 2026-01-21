import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const Dashboard = ({ locationSettings }) => {
    const [salesData, setSalesData] = useState({
        liveOrders: 0,
        totalSalesToday: 0,
        topSellingItems: [],
        profitLoss: 0,
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/orders');
                if (!res.ok) {
                    console.error('Server error:', res.status, res.statusText);
                    setSalesData({
                        liveOrders: 0,
                        totalSalesToday: 0,
                        topSellingItems: [],
                        profitLoss: 0,
                    });
                    return;
                }
                const orders = await res.json();
                if (!Array.isArray(orders)) {
                    console.error('Orders response is not an array:', orders);
                    setSalesData({
                        liveOrders: 0,
                        totalSalesToday: 0,
                        topSellingItems: [],
                        profitLoss: 0,
                    });
                    return;
                }
                const completedOrders = orders.filter(o => o.status === 'completed');
                const liveOrders = orders.filter(o => o.status !== 'completed').length;
                const totalSalesToday = completedOrders.reduce((sum, order) => sum + order.total, 0);

                const itemCounts = {};
                completedOrders.forEach(order => {
                    (order.items || []).forEach(item => {
                        itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.quantity || item.qty);
                    });
                });

                const topSellingItems = Object.entries(itemCounts)
                    .sort(([, countA], [, countB]) => countB - countA)
                    .slice(0, 5)
                    .map(([name, count]) => ({ name, count }));

                // Simple mock profit/loss calculation
                const profitLoss = totalSalesToday * 0.7 - 50; // Example: 70% revenue, minus fixed costs

                setSalesData({
                    liveOrders,
                    totalSalesToday: totalSalesToday.toFixed(2),
                    topSellingItems,
                    profitLoss: profitLoss.toFixed(2),
                });
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            }
        };
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const getProfitLossColor = (value) => {
        const num = parseFloat(value);
        if (num > 0) return 'text-green-600';
        if (num < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen rounded-lg shadow-inner">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Dashboard & Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-lg text-gray-600">Live Orders</p>
                    <p className="text-4xl font-bold text-orange-600 mt-2">{salesData.liveOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-lg text-gray-600">Total Sales Today</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">{locationSettings.currencySymbol}{salesData.totalSalesToday}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-lg text-gray-600">Today's Profit/Loss</p>
                    <p className={`text-4xl font-bold mt-2 ${getProfitLossColor(salesData.profitLoss)}`}>{locationSettings.currencySymbol}{salesData.profitLoss}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-lg text-gray-600">Avg. Order Value</p>
                    <p className="text-4xl font-bold text-purple-600 mt-2">
                        {locationSettings.currencySymbol}{salesData.liveOrders > 0 ? (parseFloat(salesData.totalSalesToday) / salesData.liveOrders).toFixed(2) : '0.00'}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Orders by Type Pie Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Orders by Type</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Dine-In', value: 8 },
                                    { name: 'Takeaway', value: 5 },
                                    { name: 'QR Code', value: 3 },
                                ]}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label
                            >
                                <Cell key="dinein" fill="#34d399" />
                                <Cell key="takeaway" fill="#60a5fa" />
                                <Cell key="qr" fill="#f59e42" />
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Sales Trend Line Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Sales Trend (Today)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={[
                            { hour: '10 AM', sales: 10 },
                            { hour: '11 AM', sales: 20 },
                            { hour: '12 PM', sales: 15 },
                            { hour: '1 PM', sales: 30 },
                            { hour: '2 PM', sales: 22 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Top-Selling Items (Today)</h3>
                {salesData.topSellingItems.length === 0 ? (
                    <p className="text-gray-500">No sales data yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {salesData.topSellingItems.map((item, index) => (
                            <li key={index} className="py-3 flex justify-between items-center">
                                <span className="text-lg font-medium text-gray-900">{item.name}</span>
                                <span className="text-lg text-gray-600">{item.count} sold</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Dashboard; 