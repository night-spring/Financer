import React, { useState, useEffect } from "react";
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
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/stocks');
        if (!response.ok) {
          throw new Error('Failed to fetch stocks');
        }
        
        const data = await response.json();
        console.log("Fetched Stocks Data:", data); // Debugging step to inspect structure
  
        // Determine the correct array source
        let stocksArray = [];
        if (Array.isArray(data)) {
          stocksArray = data; // API directly returns an array
        } else if (data && Array.isArray(data.stocks)) {
          stocksArray = data.stocks; // Extract from `data.stocks`
        } else {
          throw new Error("Invalid data format: Expected an array inside 'stocks' key");
        }
  
        // Transform API data to match required format
        const formattedStocks = stocksArray.map(stock => ({
          ...stock,
          price: `₹${parseFloat(stock.price).toFixed(2)}`,
          change: `${stock.change >= 0 ? '+' : ''}${parseFloat(stock.change).toFixed(1)}%`,
          historical: Array.isArray(stock.historical) ? stock.historical : [] // Default to an empty array if missing
        }));
  
        setStocks(formattedStocks);
      } catch (err) {
        console.error("Stock Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStocks();
  }, []);
  
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

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center text-gray-300 py-8">
            Loading market data...
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 py-8">
            Error: {error}
          </div>
        )}

        {/* Stocks Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map((stock, index) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700 hover:border-green-400 transition-all"
              >
                {/* ... rest of the stock card component remains the same ... */}
              </motion.div>
            ))}
          </div>
        )}
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