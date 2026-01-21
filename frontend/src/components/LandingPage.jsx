import React, { useState, useEffect } from 'react';
import { ChevronRight, Menu, X, Clock, Zap, MapPin, Users, QrCode, TrendingUp, Utensils, CreditCard } from 'lucide-react';

const LandingPage = ({ onNavigateToLogin, onNavigateToQR }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    // Fetch menu items for display
    fetchMenuItems();
    
    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/menu');
      const data = await response.json();
      setMenuItems(data);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const getFilteredItems = () => {
    if (selectedCategory === 'All') return menuItems;
    return menuItems.filter(item => item.category === selectedCategory);
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}>
              <div className="text-3xl text-orange-600"><Utensils size={28} /></div>
              <div>
                <span className="text-2xl font-bold text-gray-900">POS System</span>
                <p className="text-xs text-gray-500">Restaurant Management</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#menu" className="text-gray-700 hover:text-orange-600 font-medium transition">Menu</a>
              <a href="#features" className="text-gray-700 hover:text-orange-600 font-medium transition">Features</a>
              <a href="#about" className="text-gray-700 hover:text-orange-600 font-medium transition">About</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={onNavigateToQR}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                Order Now
              </button>
              <button
                onClick={onNavigateToLogin}
                className="px-6 py-2.5 rounded-lg border-2 border-orange-500 text-orange-600 font-semibold hover:bg-orange-50 transition"
              >
                Staff Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 p-4 space-y-3">
              <a href="#menu" className="block text-gray-700 hover:text-orange-600 py-2 font-medium">Menu</a>
              <a href="#features" className="block text-gray-700 hover:text-orange-600 py-2 font-medium">Features</a>
              <a href="#about" className="block text-gray-700 hover:text-orange-600 py-2 font-medium">About</a>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigateToQR(); }}
                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold mt-2"
              >
                Order Now
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigateToLogin(); }}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-orange-500 text-orange-600 font-semibold"
              >
                Staff Login
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 via-white to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-semibold mb-6">
                ✨ Modern Restaurant Management
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Delicious Food,<br/><span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Modern Service</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience seamless food ordering with our smart QR code system. Track your order in real-time and enjoy faster, better service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onNavigateToQR}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg hover:shadow-2xl transition transform hover:scale-105 active:scale-95"
                >
                  <QrCode size={20} />
                  <span>Order via QR Code</span>
                </button>
                <button
                  onClick={onNavigateToLogin}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-orange-500 text-orange-600 font-bold text-lg hover:bg-orange-50 transition"
                >
                  <span>Staff Portal</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-6 text-center border border-orange-200">
                      <div className="mb-3 text-orange-500"><Zap size={28} /></div>
                      <p className="font-bold text-gray-900">Fast Service</p>
                    <p className="text-sm text-gray-600 mt-1">Quick order processing</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-2xl p-6 text-center border border-red-200">
                    <div className="mb-3 text-red-500"><Utensils size={28} /></div>
                    <p className="font-bold text-gray-900">Fresh Food</p>
                    <p className="text-sm text-gray-600 mt-1">Premium ingredients</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-2xl p-6 text-center border border-yellow-200">
                    <div className="mb-3 text-yellow-500"><Clock size={28} /></div>
                    <p className="font-bold text-gray-900">Real-time Track</p>
                    <p className="text-sm text-gray-600 mt-1">Live order updates</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl p-6 text-center border border-green-200">
                    <div className="mb-3 text-green-500"><CreditCard size={28} /></div>
                    <p className="font-bold text-gray-900">Easy Payment</p>
                    <p className="text-sm text-gray-600 mt-1">Multiple options</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section id="menu" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Menu</h2>
            <p className="text-xl text-gray-600">Explore our delicious selection of dishes</p>
          </div>

          {/* Category Filter */}
          <div className="flex overflow-x-auto gap-3 mb-8 justify-center pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.slice(0, 6).map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition border border-gray-100 overflow-hidden"
              >
                  <div className="bg-gradient-to-r from-orange-400 to-red-400 h-32 flex items-center justify-center">
                  <Utensils size={36} className="text-white" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-500">₹{item.price}</span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={onNavigateToQR}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold hover:shadow-lg transition"
            >
              View Full Menu & Order
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600">Modern technology meets delicious food</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <QrCode size={28} className="mx-auto" />, title: 'QR Code Ordering', description: 'Scan and order directly from your table. No waiting, no paper menus.' },
              { icon: <Clock size={28} className="mx-auto" />, title: 'Real-time Tracking', description: 'Track your order status from kitchen to table with live updates every 2 seconds.' },
              { icon: <CreditCard size={28} className="mx-auto" />, title: 'Easy Payments', description: 'Multiple payment options including cash, UPI, and card. Transparent billing.' },
              { icon: <Utensils size={28} className="mx-auto" />, title: 'Expert Kitchen', description: 'Our professional kitchen staff prepares each dish with care and quality.' },
              { icon: <Zap size={28} className="mx-auto" />, title: 'Fast Service', description: 'Average preparation time under 15 minutes. Fastest service in the city.' },
              { icon: <TrendingUp size={28} className="mx-auto" />, title: 'Premium Quality', description: 'Only fresh ingredients. Hygiene and quality are our top priorities.' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition border border-gray-100 text-center">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl mb-8 opacity-90">Scan the QR code on your table and start enjoying our delicious food now!</p>
          <button
            onClick={onNavigateToQR}
            className="px-8 py-4 rounded-xl bg-white text-orange-600 font-bold text-lg hover:shadow-2xl transition transform hover:scale-105"
          >
            Order Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl text-orange-600"><Utensils size={20} /></div>
                <span className="text-xl font-bold text-gray-900">POS System</span>
              </div>
              <p>Delicious food, modern service, unforgettable experience.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#menu" className="hover:text-orange-500 transition">Menu</a></li>
                <li><a href="#features" className="hover:text-orange-500 transition">Features</a></li>
                <li><a href="#about" className="hover:text-orange-500 transition">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Hours</h4>
              <ul className="space-y-2">
                <li>Mon-Fri: 11am - 11pm</li>
                <li>Sat-Sun: 10am - 12am</li>
                <li>Holidays: 12pm - 11pm</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>📞 +91 98765 43210</li>
                <li>📧 hello@possystem.com</li>
                <li>📍 Downtown Area</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-600">&copy; 2026 POS System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
