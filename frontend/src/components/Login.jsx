import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.message || 'Login failed');
                setLoading(false);
                return;
            }

            const data = await res.json();
            // Inform App of successful login (App will handle navigation)
            onLogin(data.user, data.token);
        } catch (err) {
            setError('Login failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                    <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">POS System</h1>
                    <p className="text-sm text-gray-600">Staff Portal</p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
                            placeholder="Enter username"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
                            placeholder="Enter password"
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm italic mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-lg"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                        <li><strong>Admin:</strong> admin / admin</li>
                        <li><strong>Manager:</strong> manager1 / pass</li>
                        <li><strong>Waiter:</strong> waiter1 / pass</li>
                        <li><strong>Chef:</strong> chef1 / pass</li>
                        <li><strong>Franchise:</strong> franchise1 / pass</li>
                    </ul>
                </div>

                <div className="mt-6 text-center">
                    <a href="/" className="text-orange-600 hover:text-orange-700 text-sm font-semibold">← Back to Restaurant</a>
                </div>
            </div>
        </div>
    );
};

export default Login;