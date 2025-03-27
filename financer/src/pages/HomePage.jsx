import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      title: "Expense Tracking",
      icon: "💸",
      description: "Monitor your spending patterns with detailed analytics",
      action: () => navigate("/expenses")
    },
    {
      title: "Stock Comparison",
      icon: "📈",
      description: "Analyze and compare stock performance metrics",
      action: () => navigate("/comparisons")
    },
    {
      title: "Financial Insights",
      icon: "🔍",
      description: "Get personalized financial recommendations",
      action: () => navigate("/insights")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-gray-800/50 backdrop-blur-md py-8 text-center shadow-xl border-b border-gray-700"
      >
        <h1 className="mt-8 text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Financer
        </h1>
        <p className="mt-2 text-lg text-gray-300">Your Comprehensive Financial Management Suite</p>
      </motion.header>

      {/* Hero Section */}
      <div className="container mx-auto max-w-6xl px-4 mt-16">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700"
        >
          <div className="text-center space-y-6">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Master Your Finances
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Unify your financial life with intelligent tracking, analysis, and 
              predictive insights powered by AI-driven analytics.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg"
            >
              Get Started
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gray-700/20 p-6 rounded-xl border border-gray-600"
            >
              <div className="text-4xl text-green-400">₹10M+</div>
              <div className="text-gray-400 mt-2">Managed Assets</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gray-700/20 p-6 rounded-xl border border-gray-600"
            >
              <div className="text-4xl text-blue-400">50k+</div>
              <div className="text-gray-400 mt-2">Active Users</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gray-700/20 p-6 rounded-xl border border-gray-600"
            >
              <div className="text-4xl text-purple-400">24/7</div>
              <div className="text-gray-400 mt-2">Market Monitoring</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700 cursor-pointer"
              onClick={feature.action}
            >
              <div className="text-6xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-200 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
              <motion.button
                whileHover={{ x: 5 }}
                className="mt-4 text-green-400 flex items-center gap-2"
              >
                Explore Now
                <span className="text-xl">→</span>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Value Proposition */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 mt-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gray-200">
                Smart Financial Analysis
              </h3>
              <p className="text-gray-400 text-lg">
                Our AI-powered system analyzes your financial patterns to provide:
              </p>
              <ul className="space-y-2 text-green-400">
                <li>• Predictive budget recommendations</li>
                <li>• Investment opportunity alerts</li>
                <li>• Risk assessment reports</li>
                <li>• Tax optimization strategies</li>
              </ul>
            </div>
            <div className="h-64 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-xl border border-gray-600 flex items-center justify-center">
              <span className="text-6xl">📊</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-gray-900/50 backdrop-blur-md py-6 border-t border-gray-700/50">
        <div className="container mx-auto text-center text-gray-400">
          <p>“Financial freedom is available to those who learn about it and work for it.”</p>
          <p className="mt-4">&copy; 2025 Financer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;