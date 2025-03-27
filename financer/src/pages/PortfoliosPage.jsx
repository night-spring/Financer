import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const FinancialsPage = () => {
  const [financials, setFinancials] = useState([
    { id: 1, type: "Fixed Deposits", balance: 500000, allocation: 25, color: "#4ADE80" },
    { id: 2, type: "Stocks", balance: 1200000, allocation: 60, color: "#60A5FA" },
    { id: 3, type: "Mutual Funds", balance: 300000, allocation: 15, color: "#C084FC" },
  ]);

  const totalBalance = financials.reduce((acc, item) => acc + item.balance, 0);

  const chartData = {
    labels: financials.map(item => item.type),
    datasets: [{
      data: financials.map(item => item.allocation),
      backgroundColor: financials.map(item => item.color),
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 2,
    }]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900">
      {/* Header */}
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
        {/* Summary Cards */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700">
            <h3 className="text-gray-400 text-sm">Total Portfolio Value</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">
              ₹{totalBalance.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700">
            <h3 className="text-gray-400 text-sm">Investment Vehicles</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">
              {financials.length}
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700">
            <h3 className="text-gray-400 text-sm">Top Performer</h3>
            <p className="text-2xl font-bold text-purple-400 mt-2">
              Stocks ↗
            </p>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Allocation Chart */}
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-200 mb-4">Investment Distribution</h3>
            <div className="h-64">
              <Pie 
                data={chartData}
                options={{
                  plugins: {
                    legend: {
                      labels: { color: '#fff' }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.label}: ${context.raw}%`
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Investment List */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-200">Investment Breakdown</h3>
              <button className="bg-green-400/10 text-green-400 px-4 py-2 rounded-lg hover:bg-green-400/20 transition">
                + New Investment
              </button>
            </div>

            <div className="space-y-4">
              {financials.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.type === 'Fixed Deposits' ? '🏦' : 
                       item.type === 'Stocks' ? '📈' : '📊'}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-200">{item.type}</h4>
                      <p className="text-sm text-gray-400">{item.allocation}% Allocation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-200">
                      ₹{item.balance.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      {(item.balance/totalBalance*100).toFixed(1)}% of total
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
        >
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Annual Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <p className="text-gray-400">Fixed Deposits Yield</p>
              <p className="text-2xl text-green-400">7.5%</p>
            </div>
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <p className="text-gray-400">Stocks Growth</p>
              <p className="text-2xl text-blue-400">24.8%</p>
            </div>
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <p className="text-gray-400">MF Returns</p>
              <p className="text-2xl text-purple-400">15.2%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-gray-900/50 backdrop-blur-md py-6 border-t border-gray-700/50">
        <div className="container mx-auto text-center text-gray-400">
          <p className="mt-4">&copy; 2025 WealthManager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FinancialsPage;