import React, { useState, useEffect } from 'react';
import { fetchWithErrorHandling } from '../utils/api';
import Notification from './Notification';
import MenuItemForm from './MenuItemForm';

const MenuManagement = ({ locationSettings }) => {
    const [menuItems, setMenuItems] = useState(() => []);
    const [notification, setNotification] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Safe filter function to prevent errors
    const safeFilter = (items, predicate) => {
        if (!Array.isArray(items)) return [];
        try {
            return items.filter(predicate);
        } catch (error) {
            console.error('Filter error:', error);
            return [];
        }
    };

    const fetchMenuItems = async () => {
        setIsLoading(true);
        try {
            const data = await fetchWithErrorHandling('http://localhost:3001/api/menu');
            // Ensure we always set an array, even if data is null/undefined
            const safeData = Array.isArray(data) ? data : [];
            console.log('Fetched menu items:', safeData);
            setMenuItems(safeData);
        } catch (error) {
            console.error('Error in fetchMenuItems:', error);
            setMenuItems([]);
            setNotification({
                message: error.message || 'Failed to load menu items',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const handleAddMenuItem = async (item) => {
        try {
            console.log('Adding new menu item:', item);
            const newItem = await fetchWithErrorHandling('http://localhost:3001/api/menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            console.log('New item added:', newItem);
            setMenuItems(prev => [...prev, newItem]);
            setNotification({ 
                message: 'Menu item added successfully!', 
                type: 'success' 
            });
        } catch (error) {
            console.error('Error adding menu item:', error);
            setNotification({ 
                message: `Error adding menu item: ${error.message || 'Please try again'}`, 
                type: 'error' 
            });
        }
        setShowAddForm(false);
        setEditingItem(null);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleUpdateMenuItem = async (item) => {
        try {
            console.log('Updating menu item:', item);
            const updated = await fetchWithErrorHandling(`http://localhost:3001/api/menu/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            console.log('Item updated:', updated);
            setMenuItems(prev => prev.map(m => m.id === item.id ? updated : m));
            setNotification({ 
                message: 'Menu item updated successfully!', 
                type: 'success' 
            });
        } catch (error) {
            console.error('Error updating menu item:', error);
            setNotification({ 
                message: `Error updating menu item: ${error.message || 'Please try again'}`, 
                type: 'error' 
            });
        }
        setShowAddForm(false);
        setEditingItem(null);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleDeleteItem = async (id, name) => {
        try {
            console.log('Deleting item:', id);
            await fetchWithErrorHandling(`http://localhost:3001/api/menu/${id}`, { 
                method: 'DELETE' 
            });
            // Use safeFilter to prevent errors
            setMenuItems(prev => safeFilter(prev, item => item.id !== id));
            setNotification({ 
                message: `Menu item '${name}' deleted successfully!`, 
                type: 'success' 
            });
        } catch (error) {
            console.error('Error deleting menu item:', error);
            setNotification({ 
                message: `Error deleting menu item: ${error.message || 'Please try again'}`, 
                type: 'error' 
            });
        }
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen rounded-lg shadow-inner">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Menu Management</h2>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => { setShowAddForm(true); setEditingItem(null); }}
                    className="btn-gradient px-4 py-2.5 flex items-center"
                >
                    Add New Menu Item
                </button>
            </div>
            {showAddForm && (
                <MenuItemForm
                    onSave={editingItem ? handleUpdateMenuItem : handleAddMenuItem}
                    onCancel={() => { setShowAddForm(false); setEditingItem(null); }}
                    initialData={editingItem || {}}
                    locationSettings={locationSettings}
                />
            )}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Current Menu Items</h3>
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
                    </div>
                ) : menuItems.length === 0 ? (
                    <p className="text-gray-500">No menu items added yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {menuItems.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{locationSettings.currencySymbol}{item.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => { setEditingItem(item); setShowAddForm(true); }}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteItem(item.id, item.name)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuManagement; 