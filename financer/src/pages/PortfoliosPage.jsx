import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const FinancialsPage = () => {
  const [financials, setFinancials] = useState(() => {
    const token = localStorage.getItem('firebaseToken');
    if (!token) return [];
    const savedData = localStorage.getItem('financials');
    return savedData ? JSON.parse(savedData) : [];
  });

  const [newInvestment, setNewInvestment] = useState({
    type: "Fixed Deposits",
    balance: "",
    color: "#4ADE80"
  });

  const [sortBy, setSortBy] = useState("balance");
  const [performanceMetrics] = useState({
    'Fixed Deposits': { rate: 7.5, volatility: 0.8 },
    'Stocks': { rate: 12.4, volatility: 15.2 },
    'Mutual Funds': { rate: 9.8, volatility: 5.6 },
    'Bonds': { rate: 6.3, volatility: 2.1 },
    'Real Estate': { rate: 8.9, volatility: 7.4 }
  });

  useEffect(() => {
    const token = localStorage.getItem('firebaseToken');
    if (token) {
      localStorage.setItem('financials', JSON.stringify(financials));
    }
  }, [financials]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('firebaseToken');
      if (!token) {
        localStorage.removeItem('financials');
        setFinancials([]);
      }
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const totalBalance = financials.reduce((acc, item) => acc + item.balance, 0);
  const topPerformer = financials.length > 0 
    ? financials.reduce((max, item) => item.balance > max.balance ? item : max)
    : null;

  const calculateAllocation = (balance) => {
    return totalBalance > 0 ? ((balance / totalBalance) * 100).toFixed(1) : 0;
  };

  const calculateRisk = (type) => {
    const metric = performanceMetrics[type] || { volatility: 0 };
    return metric.volatility < 5 ? 'Low' :
           metric.volatility < 10 ? 'Moderate' : 'High';
  };

  const handleAddInvestment = () => {
    if (!newInvestment.type || !newInvestment.balance) return;
    
    const investment = {
      id: Date.now(),
      type: newInvestment.type,
      balance: parseFloat(newInvestment.balance),
      color: newInvestment.color,
      allocation: calculateAllocation(parseFloat(newInvestment.balance)),
      added: new Date().toISOString().split('T')[0]
    };

    setFinancials(prev => [...prev, investment]);
    setNewInvestment({ type: "Fixed Deposits", balance: "", color: "#4ADE80" });
  };

  const handleDeleteInvestment = (id) => {
    setFinancials(prev => prev.filter(item => item.id !== id));
  };

  const sortedFinancials = [...financials].sort((a, b) => {
    if (sortBy === "balance") return b.balance - a.balance;
    if (sortBy === "type") return a.type.localeCompare(b.type);
    return new Date(b.added) - new Date(a.added);
  });

  const chartData = {
    labels: sortedFinancials.map(item => item.type),
    datasets: [{
      data: sortedFinancials.map(item => item.balance),
      backgroundColor: sortedFinancials.map(item => item.color),
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 2,
    }]
  };

  const investmentIcons = {
    'Fixed Deposits': '🏦',
    'Stocks': '📈',
    'Mutual Funds': '📊',
    'Bonds': '📉',
    'Real Estate': '🏠',
    'Crypto': '₿',
    'ETF': '📄'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-gray-800/50 backdrop-blur-md py-8 text-center shadow-xl border-b border-gray-700"
      >
        <h1 className="mt-16 text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Investment Portfolio
        </h1>
        <p className="mt-2 text-lg text-gray-300">Holistic view of your financial investments</p>
      </motion.header>

      <div className="container mx-auto max-w-6xl p-4 mt-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h3 className="text-gray-400 text-sm">Portfolio Value</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">
              ₹{totalBalance.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {financials.length} investment vehicles
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h3 className="text-gray-400 text-sm">Estimated Annual Yield</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">
              {financials.reduce((acc, item) => {
                const rate = performanceMetrics[item.type]?.rate || 0;
                return acc + (item.balance * (rate/100));
              }, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h3 className="text-gray-400 text-sm">Top Performer</h3>
            <p className="text-2xl font-bold text-purple-400 mt-2">
              {topPerformer?.type || 'N/A'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {topPerformer ? calculateAllocation(topPerformer.balance) + '%' : ''}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-200 mb-6">Portfolio Allocation</h3>
            <div className="h-64">
              <Pie 
                data={chartData}
                options={{
                  plugins: {
                    legend: {
                      labels: { 
                        color: '#fff',
                        font: { size: 14 }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const value = context.raw || 0;
                          const percent = (value / totalBalance * 100).toFixed(1);
                          return `${context.label}: ₹${value.toLocaleString()} (${percent}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-200">Manage Investments</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300
                          focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                          appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOWNhM2FmIj48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')] 
                          bg-no-repeat bg-[length:20px_20px] bg-[center_right_1rem]"
              >
                <option value="balance">Sort by Value</option>
                <option value="type">Sort by Type</option>
                <option value="date">Sort by Date</option>
              </select>
            </div>

            <div className="space-y-4">
              {sortedFinancials.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition cursor-pointer relative group"
                >
                  <button
                    onClick={() => handleDeleteInvestment(item.id)}
                    className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="flex items-center space-x-4">
                    <div 
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: item.color }}
                    >
                      {investmentIcons[item.type] || '💼'}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-200">{item.type}</h4>
                      <p className="text-sm text-gray-400">
                        Added: {item.added}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-200">
                      ₹{item.balance.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      {calculateAllocation(item.balance)}% • {calculateRisk(item.type)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-200 mb-6">Add New Investment</h3>
            <div className="space-y-4">
              <select
                value={newInvestment.type}
                onChange={(e) => setNewInvestment({ ...newInvestment, type: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-300
                          focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                          appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOWNhM2FmIj48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')] 
                          bg-no-repeat bg-[length:20px_20px] bg-[center_right_1rem]"
              >
                {Object.keys(investmentIcons).map(type => (
                  <option key={type} value={type} className="bg-gray-800 text-gray-300">
                    {type}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Investment Amount"
                value={newInvestment.balance}
                onChange={(e) => setNewInvestment({ ...newInvestment, balance: e.target.value })}
                className="w-full p-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400 text-gray-300 placeholder-gray-500"
              />
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={newInvestment.color}
                  onChange={(e) => setNewInvestment({ ...newInvestment, color: e.target.value })}
                  className="h-10 w-16 rounded-lg cursor-pointer"
                />
                <span className="text-gray-300">Chart Color</span>
              </div>
              <motion.button
                onClick={handleAddInvestment}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Add Investment
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-200 mb-6">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(performanceMetrics).map(([type, metrics]) => (
                <div key={type} className="p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-6 w-6 rounded-md flex items-center justify-center"
                         style={{ backgroundColor: financials.find(f => f.type === type)?.color || '#4ADE80' }}>
                      {investmentIcons[type] || '💼'}
                    </div>
                    <h4 className="text-gray-200 font-medium">{type}</h4>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Return:</span>
                    <span className="text-green-400">{metrics.rate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Risk:</span>
                    <span className={`
                      ${metrics.volatility < 5 ? 'text-green-400' : 
                        metrics.volatility < 10 ? 'text-yellow-400' : 'text-red-400'}
                    `}>
                      {calculateRisk(type)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="mt-16 bg-gray-900/50 backdrop-blur-md py-6 border-t border-gray-700/50">
        <div className="container mx-auto text-center text-gray-400">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="flex justify-center mb-4"
          >
            <div className="relative z-20 p-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500">
              <div className="bg-gray-800 p-1 rounded-full">
                <img 
                  src="/financer.png" 
                  alt="Footer Logo" 
                  className="h-12 w-12 object-contain" 
                />
              </div>
            </div>
          </motion.div>
          <p>“Financial freedom is available to those who learn about it and work for it.”</p>
          <p className="mt-4">&copy; 2025 Financer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FinancialsPage;