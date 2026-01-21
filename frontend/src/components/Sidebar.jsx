import React from 'react';
import {
  ShoppingCart, LayoutGrid, Utensils, Package, Receipt, ClipboardList, QrCode, Building, Users, UtensilsCrossed, LogOut
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, currentUser, locationSettings, handleLocationChange, handleLogout }) => (
  <aside className="w-72 bg-white text-gray-800 flex flex-col p-4 shadow min-h-screen" role="navigation" aria-label="Main navigation">
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-1">POS System</h1>
      <p className="text-sm text-gray-500 mb-1">Restaurant Management</p>
      {currentUser && (
        <p className="text-sm text-gray-700">Logged in as: <span className="font-semibold capitalize">{currentUser.name} ({currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)})</span></p>
      )}
      <div className="mt-4">
        <label htmlFor="country-select" className="block text-gray-700 text-sm mb-1">Country</label>
        <select
          id="country-select"
          value={locationSettings.country}
          onChange={handleLocationChange}
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
        >
          <option value="India">India</option>
          <option value="US">US</option>
          <option value="UK">UK</option>
        </select>
      </div>
    </div>
    <nav className="flex-grow" aria-label="Sidebar menu">
      <ul className="space-y-2">
        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'franchise' || currentUser.role === 'subfranchise' || currentUser.role === 'manager') && (
          <li>
            <button
              onClick={() => setActiveTab('dashboard')}
              aria-current={activeTab === 'dashboard' ? 'page' : undefined}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeTab === 'dashboard'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="mr-3 text-gray-700" size={22} /> <span className="truncate">Dashboard</span>
            </button>
          </li>
        )}
        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'subfranchise' || currentUser.role === 'waiter' || currentUser.role === 'manager') && (
          <li>
            <button
              onClick={() => setActiveTab('dine-in-management')}
              aria-current={activeTab === 'dine-in-management' ? 'page' : undefined}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeTab === 'dine-in-management'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Utensils className="mr-3 text-gray-700" size={22} /> <span className="truncate">Dine-In</span>
            </button>
          </li>
        )}
        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'subfranchise' || currentUser.role === 'waiter' || currentUser.role === 'manager') && (
          <li>
            <button
              onClick={() => setActiveTab('takeaway-management')}
              aria-current={activeTab === 'takeaway-management' ? 'page' : undefined}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeTab === 'takeaway-management'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingCart className="mr-3 text-gray-700" size={22} /> <span className="truncate">Takeaway</span>
            </button>
          </li>
        )}
        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'subfranchise' || currentUser.role === 'waiter' || currentUser.role === 'manager') && (
          <li>
            <button
              onClick={() => setActiveTab('qr-management')}
              aria-current={activeTab === 'qr-management' ? 'page' : undefined}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-lg font-semibold transition-colors duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeTab === 'qr-management'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <QrCode className="mr-3 text-gray-700" size={22} /> <span className="truncate">QR Code Management</span>
            </button>
          </li>
        )}
        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'subfranchise' || currentUser.role === 'chef' || currentUser.role === 'manager' || currentUser.role === 'waiter') && (
          <li>
            <button
              onClick={() => setActiveTab('kds')}
              aria-current={activeTab === 'kds' ? 'page' : undefined}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeTab === 'kds'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ClipboardList className="mr-3 text-gray-700" size={22} /> <span className="truncate">Kitchen Display</span>
            </button>
          </li>
        )}
        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'subfranchise' || currentUser.role === 'manager') && (
          <li>
            <button
              onClick={() => setActiveTab('inventory')}
              aria-current={activeTab === 'inventory' ? 'page' : undefined}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeTab === 'inventory'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package className="mr-3 text-gray-700" size={22} /> <span className="truncate">Inventory</span>
            </button>
          </li>
        )}
        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'subfranchise' || currentUser.role === 'manager' || currentUser.role === 'waiter') && (
          <li>
            <button
              onClick={() => setActiveTab('billing')}
              aria-current={activeTab === 'billing' ? 'page' : undefined}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeTab === 'billing'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Receipt className="mr-3 text-gray-700" size={22} /> <span className="truncate">Billing</span>
            </button>
          </li>
        )}
        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'subfranchise' || currentUser.role === 'manager') && (
          <li>
            <button
              onClick={() => setActiveTab('menu-management')}
              aria-current={activeTab === 'menu-management' ? 'page' : undefined}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeTab === 'menu-management'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UtensilsCrossed className="mr-3 text-gray-700" size={22} /> <span className="truncate">Menu Management</span>
            </button>
          </li>
        )}
        {currentUser && currentUser.role === 'admin' && (
          <li>
            <button
              onClick={() => setActiveTab('user-management')}
              aria-current={activeTab === 'user-management' ? 'page' : undefined}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeTab === 'user-management'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="mr-3 text-gray-700" size={22} /> <span className="truncate">User Management</span>
            </button>
          </li>
        )}
        {currentUser && currentUser.role === 'admin' && (
          <li>
            <button
              onClick={() => setActiveTab('permission-management')}
              aria-current={activeTab === 'permission-management' ? 'page' : undefined}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeTab === 'permission-management'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Building className="mr-3 text-gray-700" size={22} /> <span className="truncate">Permission Management</span>
            </button>
          </li>
        )}
        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'franchise') && (
          <li>
            <button
              onClick={() => setActiveTab('franchise-dashboard')}
              aria-current={activeTab === 'franchise-dashboard' ? 'page' : undefined}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeTab === 'franchise-dashboard'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Building className="mr-3 text-gray-700" size={22} /> <span className="truncate">Franchise Overview</span>
            </button>
          </li>
        )}
        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'franchise') && (
          <li>
            <button
              onClick={() => setActiveTab('subfranchise-management')}
              aria-current={activeTab === 'subfranchise-management' ? 'page' : undefined}
              className={`flex items-center flex-nowrap w-full px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeTab === 'subfranchise-management'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="mr-3 text-gray-700" size={20} /> <span className="truncate">Manage Sub-Franchises</span>
            </button>
          </li>
        )}
      </ul>
    </nav>
    <div className="mt-8 pt-4 border-t border-gray-200">
      <button
        onClick={handleLogout}
        className="flex items-center w-full px-4 py-3 rounded-xl text-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
      >
        <LogOut className="mr-3 text-gray-700" size={22} /> <span className="truncate">Logout</span>
      </button>
    </div>
  </aside>
);

export default Sidebar;