import React, { useState } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StocksPage = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [timeRange, setTimeRange] = useState('1M');

  // In the stocks array, remove the extra historical nesting:
const stocks = [
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: "₹3,450.50",
    change: "+2.5%",
    sector: "IT",
    risk: "Low",
    historical: { // Remove the extra historical layer
      '1D': [3420, 3435, 3440, 3450, 3450],
      '1W': [3400, 3420, 3430, 3445, 3450],
      '1M': [3200, 3250, 3350, 3400, 3450],
      '1Y': [2800, 3000, 3200, 3300, 3450]
    }
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    price: "₹2,850.00",
    change: "+1.2%",
    sector: "Energy",
    risk: "Medium",
    historical: { // Remove the extra historical layer
      '1D': [2820, 2835, 2840, 2850, 2850],
      '1W': [2800, 2820, 2830, 2845, 2850],
      '1M': [2600, 2700, 2750, 2800, 2850],
      '1Y': [2000, 2200, 2500, 2700, 2850]
    }
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    price: "₹1,650.75",
    change: "-0.5%",
    sector: "Banking",
    risk: "Medium",
    historical: { // Remove the extra historical layer
      '1D': [1640, 1650, 1655, 1650, 1650],
      '1W': [1620, 1630, 1640, 1650, 1650],
      '1M': [1500, 1550, 1600, 1630, 1650],
      '1Y': [1200, 1350, 1450, 1550, 1650]
    }
  }
];

  const getChartData = (historical) => ({
    labels: historical.map((_, i) => `${i + 1}`),
    datasets: [{
      label: 'Price',
      data: historical,
      borderColor: '#4ADE80',
      tension: 0.4,
      pointRadius: 0,
    }]
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-gray-800/50 backdrop-blur-md py-8 text-center shadow-xl border-b border-gray-700"
      >
        <h1 className="mt-8 text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Stock Analytics
        </h1>
        <p className="mt-2 text-lg text-gray-300">Real-time market data and historical performance</p>
      </motion.header>

      <div className="container mx-auto max-w-6xl p-4 mt-8 space-y-8">
        {/* Time Range Filter */}
        <div className="flex justify-end">
          <div className="bg-gray-800/50 backdrop-blur-lg p-2 rounded-xl border border-gray-700">
            {['1D', '1W', '1M', '1Y'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 mx-1 rounded-lg ${
                  timeRange === range 
                    ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700/30'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Stocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700 hover:border-green-400 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{stock.symbol}</h2>
                  <p className="text-gray-400">{stock.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  stock.change.startsWith('+') 
                    ? 'bg-green-400/20 text-green-400' 
                    : 'bg-red-400/20 text-red-400'
                }`}>
                  {stock.change}
                </span>
              </div>

              <div className="h-32 mb-4">
                <Line
                  data={getChartData(stock.historical[timeRange])}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { display: false },
                      y: { display: false }
                    }
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-700/20 p-3 rounded-lg">
                  <p className="text-gray-400">Price</p>
                  <p className="text-white font-medium">{stock.price}</p>
                </div>
                <div className="bg-gray-700/20 p-3 rounded-lg">
                  <p className="text-gray-400">Sector</p>
                  <p className="text-white font-medium">{stock.sector}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedStock(stock)}
                className="w-full mt-4 bg-gradient-to-r from-green-400/20 to-blue-500/20 p-3 rounded-lg text-green-400 border border-green-400/30 hover:border-green-400/60"
              >
                View Details
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Stock Details Modal */}
        {selectedStock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedStock(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-gray-800/95 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-white">{selectedStock.name}</h2>
                <button 
                  onClick={() => setSelectedStock(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-700/20 p-4 rounded-xl">
                    <p className="text-gray-400">Current Price</p>
                    <p className="text-2xl text-green-400">{selectedStock.price}</p>
                  </div>
                  <div className="bg-gray-700/20 p-4 rounded-xl">
                    <p className="text-gray-400">52 Week Range</p>
                    <p className="text-xl text-white">
                      {Math.min(...selectedStock.historical['1Y'])} - {Math.max(...selectedStock.historical['1Y'])}
                    </p>
                  </div>
                </div>

                <div className="h-64">
                  <Line
                    data={getChartData(selectedStock.historical['1Y'])}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: { mode: 'index', intersect: false }
                      },
                      scales: {
                        x: { grid: { color: '#374151' }, ticks: { color: '#9CA3AF' } },
                        y: { grid: { color: '#374151' }, ticks: { color: '#9CA3AF' } }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700/20 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">P/E Ratio</p>
                  <p className="text-white">28.5</p>
                </div>
                <div className="bg-gray-700/20 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Market Cap</p>
                  <p className="text-white">₹12.5T</p>
                </div>
                <div className="bg-gray-700/20 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Dividend Yield</p>
                  <p className="text-white">1.8%</p>
                </div>
                <div className="bg-gray-700/20 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Volume</p>
                  <p className="text-white">2.5M</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-gray-900/50 backdrop-blur-md py-6 border-t border-gray-700/50">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2025 Financial Nexus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default StocksPage;