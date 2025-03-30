import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/stocks");
        const text = await response.text();
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        if (!text) throw new Error("Empty response from server");

        const result = JSON.parse(text);
        if (result.error) throw new Error(result.error);
        if (!result.data || !Array.isArray(result.data)) {
          throw new Error("Invalid data structure received from server");
        }

        const formattedStocks = result.data
          .filter(stock => stock?.symbol)
          .map(stock => ({
            symbol: stock.symbol,
            name: stock.meta?.companyName || stock.symbol,
            lastPrice: stock.lastPrice ? `₹${parseFloat(stock.lastPrice).toFixed(2)}` : "N/A",
            pChange: stock.pChange ? `${stock.pChange >= 0 ? "+" : ""}${parseFloat(stock.pChange).toFixed(2)}%` : "N/A",
            chartToday: stock.chartTodayPath,
            otherDetails: {
              open: stock.open,
              high: stock.high,
              low: stock.low,
              volume: stock.volume
            }
          }));

        setStocks(formattedStocks);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Stock Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-gray-800/50 backdrop-blur-md py-8 text-center shadow-xl border-b border-gray-700"
      >
        <h1 className="mt-16 text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Market Watch
        </h1>
        <p className="mt-2 text-lg text-gray-300">Real-time equity market tracking</p>
      </motion.header>

      <div className="container mx-auto max-w-6xl p-4 mt-8 space-y-8">
        {loading && (
          <div className="text-center text-gray-300">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block text-4xl"
            >
              ⏳
            </motion.div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 p-4 rounded-xl bg-red-900/30">
            ⚠️ Error: {error}
          </div>
        )}

        {/* Summary Cards */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700">
            <h3 className="text-gray-400 text-sm">Total Listed Stocks</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">
              {stocks.length}
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700">
            <h3 className="text-gray-400 text-sm">Most Active</h3>
            <p className="text-2xl font-bold text-blue-400 mt-2">
              {stocks[0]?.symbol || 'N/A'}
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700">
            <h3 className="text-gray-400 text-sm">Total Volume</h3>
            <p className="text-2xl font-bold text-purple-400 mt-2">
              {stocks.reduce((sum, stock) => sum + (stock.otherDetails.volume || 0), 0).toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* Stock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedStock(stock)}
              className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700 
                        cursor-pointer hover:bg-gray-700/30 transition-all group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-200">{stock.symbol}</h2>
                  <p className="text-gray-400 text-sm mt-1">{stock.name}</p>
                </div>
                <span className={`text-lg font-semibold ${
                  stock.pChange.startsWith('+') ? 'text-green-400' : 
                  stock.pChange === 'N/A' ? 'text-gray-400' : 'text-red-400'
                }`}>
                  {stock.pChange.startsWith('+') ? '▲' : 
                   stock.pChange === 'N/A' ? '' : '▼'} {stock.pChange}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-200">
                  {stock.lastPrice}
                </p>
                <div className="h-1 bg-gray-700 rounded-full mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stock.pChange.startsWith('+') ? 'bg-green-400' : 
                      stock.pChange === 'N/A' ? 'bg-gray-400' : 'bg-red-400'
                    }`}
                    style={{ 
                      width: `${Math.min(
                        Math.abs(stock.pChange === 'N/A' ? 0 : 
                        parseFloat(stock.pChange)), 
                        100
                      )}%` 
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedStock && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-800/90 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 max-w-2xl w-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-200">
                    {selectedStock.symbol}
                  </h2>
                  <p className="text-gray-400 mt-1">{selectedStock.name}</p>
                </div>
                <button
                  onClick={() => setSelectedStock(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-700/30 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Price Details</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Current Price</span>
                        <p className="text-2xl font-bold text-green-400">
                          {selectedStock.lastPrice}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Daily Change</span>
                        <p className={`text-2xl font-bold ${
                          selectedStock.pChange.startsWith('+') ? 'text-green-400' : 
                          selectedStock.pChange === 'N/A' ? 'text-gray-400' : 'text-red-400'
                        }`}>
                          {selectedStock.pChange}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-700/30 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Trading Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Open</span>
                        <span className="text-blue-400">
                          ₹{selectedStock.otherDetails.open?.toFixed(2) || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">High</span>
                        <span className="text-green-400">
                          ₹{selectedStock.otherDetails.high?.toFixed(2) || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Low</span>
                        <span className="text-red-400">
                          ₹{selectedStock.otherDetails.low?.toFixed(2) || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Volume</span>
                        <span className="text-purple-400">
                          {selectedStock.otherDetails.volume?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedStock.chartToday && (
                    <div className="bg-gray-700/30 p-4 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-200 mb-2">Price Movement</h3>
                      <img
                        src={selectedStock.chartToday}
                        alt="Price Chart"
                        className="w-full h-32 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockList;