import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('firebaseToken');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const API_URL = 'http://localhost:8000';

  const handleAuth = async (endpoint) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      if (endpoint === 'login') {
        localStorage.setItem('firebaseToken', data.token);
        navigate('/home');
      } else {
        setIsLogin(true);
        setError('Account created successfully! Please login.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAuth(isLogin ? 'login' : 'signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
      >
        <div className="flex justify-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            {isLogin ? 'Firebase Login' : 'Firebase Signup'}
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-200 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Login with Firebase' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            {isLogin ? "Need an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-green-400 hover:underline focus:outline-none"
            >
              {isLogin ? 'Sign up instead' : 'Login instead'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;