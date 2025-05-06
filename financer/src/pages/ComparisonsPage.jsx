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

const ComparisonsPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch("https://financer-backend-zeta.vercel.app/stocks");
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
            price: stock.lastPrice ? parseFloat(stock.lastPrice) : 0,
            change: stock.pChange ? parseFloat(stock.pChange) : 0,
            rawPrice: stock.lastPrice,
            rawChange: stock.pChange,
            historical: stock.historical || [],
            otherDetails: {
              open: stock.open,
              high: stock.high,
              low: stock.low,
              volume: stock.volume
            },
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

  const getChartData = (historical) => ({
    labels: ['4D', '3D', '2D', '1D', 'Today'],
    datasets: [{
      label: 'Price',
      data: historical,
      borderColor: '#4ADE80',
      tension: 0.4,
      pointRadius: 0,
    }]
  });

  const sortedStocks = [...stocks].sort((a, b) => {
    if (sortBy === "price") {
      return sortOrder === "desc" ? b.price - a.price : a.price - b.price;
    }
    return sortOrder === "desc" ? b.change - a.change : a.change - b.change;
  });

  const totalPages = Math.ceil(sortedStocks.length / itemsPerPage);
  const paginatedStocks = sortedStocks.slice(
    (pageNumber - 1) * itemsPerPage,
    pageNumber * itemsPerPage
  );

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-gray-800/50 backdrop-blur-md py-8 text-center shadow-xl border-b border-gray-700"
      >
        <h1 className="mt-16 text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Stock Comparison
        </h1>
        <p className="mt-2 text-lg text-gray-300">Analyze and compare stock performance</p>
      </motion.header>

      <div className="container mx-auto max-w-6xl p-4 mt-8 space-y-8">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-xl border border-gray-700"
  >
    <label className="text-gray-300 text-sm">Sort By</label>
    <select
      value={sortBy}
      onChange={(e) => handleSortChange(e.target.value)}
      className="w-full mt-2 p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300
                focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50 focus:border-emerald-400
                appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOWNhM2FmIj48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')] 
                bg-no-repeat bg-[length:20px_20px] bg-[center_right_1rem]"
    >
      <option value="price" className="bg-gray-800 text-gray-300">Price</option>
      <option value="change" className="bg-gray-800 text-gray-300">Daily Change</option>
    </select>
  </motion.div>

  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-xl border border-gray-700"
  >
    <label className="text-gray-300 text-sm">Order</label>
    <select
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
      className="w-full mt-2 p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300
                focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50 focus:border-emerald-400
                appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOWNhM2FmIj48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')] 
                bg-no-repeat bg-[length:20px_20px] bg-[center_right_1rem]"
    >
      <option value="desc" className="bg-gray-800 text-gray-300">High</option>
      <option value="asc" className="bg-gray-800 text-gray-300">Low</option>
    </select>
  </motion.div>

  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-xl border border-gray-700"
  >
    <label className="text-gray-300 text-sm">Items Per Page</label>
    <select
      value={itemsPerPage}
      onChange={(e) => {
        setItemsPerPage(Number(e.target.value));
        setPageNumber(1);
      }}
      className="w-full mt-2 p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300
                focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50 focus:border-emerald-400
                appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOWNhM2FmIj48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')] 
                bg-no-repeat bg-[length:20px_20px] bg-[center_right_1rem]"
    >
      <option value={10} className="bg-gray-800 text-gray-300">10 Stocks</option>
      <option value={20} className="bg-gray-800 text-gray-300">20 Stocks</option>
    </select>
  </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-xl border border-gray-700"
          >
            <div className="flex justify-between items-center h-full">
              <div>
                <p className="text-gray-300 text-sm">Current Page</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  {pageNumber} / {totalPages}
                </p>
              </div>
              <div className="text-3xl">📄</div>
            </div>
          </motion.div>
        </div>

        {/* Loading and Error States */}
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

        {/* Stocks Table */}
        {!loading && !error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-left border-b border-gray-700">
                    <th className="pb-4">Stock</th>
                    <th className="pb-4 cursor-pointer" onClick={() => handleSortChange("price")}>
                      Price {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="pb-4 cursor-pointer" onClick={() => handleSortChange("change")}>
                      Change {sortBy === "change" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStocks.map((stock) => (
                    <motion.tr 
                      key={stock.symbol}
                      whileHover={{ scale: 1.01 }}
                      className="border-b border-gray-700 hover:bg-gray-800/20"
                    >
                      <td className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-500/20 p-3 rounded-lg">
                            {stock.symbol}
                          </div>
                          <div>
                            <p className="text-gray-200 font-medium">{stock.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-200">
                        ₹{stock.rawPrice?.toFixed(2) || 'N/A'}
                      </td>
                      <td className={stock.change >= 0 ? "text-green-400" : "text-red-400"}>
                        {stock.change >= 0 ? '+' : ''}{stock.rawChange?.toFixed(2)}%
                      </td>
                      <td>
                        <motion.button
                          onClick={() => setSelectedStock(selectedStock === stock.symbol ? null : stock.symbol)}
                          whileHover={{ scale: 1.05 }}
                          className="bg-gradient-to-r from-green-400/20 to-blue-500/20 px-4 py-2 rounded-lg text-green-400 border border-green-400/30"
                        >
                          {selectedStock === stock.symbol ? "Hide" : "Analyze"}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                disabled={pageNumber === 1}
                className="px-4 py-2 rounded-lg bg-gray-700/30 border border-gray-600 text-gray-300 disabled:opacity-50"
              >
                Previous
              </motion.button>
              
              <span className="text-gray-400">
                Showing {(pageNumber - 1) * itemsPerPage + 1} -{' '}
                {Math.min(pageNumber * itemsPerPage, sortedStocks.length)} of{' '}
                {sortedStocks.length} stocks
              </span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))}
                disabled={pageNumber === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-700/30 border border-gray-600 text-gray-300 disabled:opacity-50"
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Detailed Analysis */}
        {selectedStock && (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700 space-y-6"
  >
    {paginatedStocks
      .filter(stock => stock.symbol === selectedStock)
      .map(stock => (
        <div key={stock.symbol} className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-200">{stock.name} Analysis</h3>
            <button 
              onClick={() => setSelectedStock(null)}
              className="text-gray-400 hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700/20 p-4 rounded-xl">
              <p className="text-gray-400 text-sm">Current Price</p>
              <p className="text-2xl text-green-400 mt-1">
                ₹{stock.rawPrice?.toFixed(2) || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-700/20 p-4 rounded-xl">
              <p className="text-gray-400 text-sm">Daily Change</p>
              <p className={`text-2xl ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'} mt-1`}>
                {stock.change >= 0 ? '+' : ''}{stock.rawChange?.toFixed(2)}%
              </p>
            </div>
          </div>

          {stock.chartToday && (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative border-2 border-emerald-400/20 rounded-xl p-4 bg-gradient-to-br from-gray-900/50 to-emerald-900/20"
  >
    {/* Chart Header */}
    <div className="flex items-center justify-between mb-3">
      <span className="text-emerald-400 text-sm font-mono">Live Chart</span>
      <span className="text-gray-400 text-sm">{stock.symbol}</span>
    </div>

    {/* Image Container with Loading State */}
    <div className="relative group">
      <img 
        src={stock.chartToday}
        alt={`${stock.name} historical price chart`}
        className="w-full h-64 object-cover rounded-lg border border-emerald-400/10 bg-gray-800/30"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
      
      {/* Loading Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-emerald-400 text-2xl"
        >
          ⏳
        </motion.div>
      </div>
    </div>

    {/* Chart Footer */}
    <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
      <span>Intraday Performance</span>
      <div className="flex items-center space-x-2">
        <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></span>
        <span>Live Data</span>
      </div>
    </div>

    {/* Hover Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none">
      <div className="absolute bottom-4 left-4 text-xs text-emerald-400">
        Updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  </motion.div>
)}
        </div>
      ))}
  </motion.div>
)}
      </div>

      {/* Footer */}
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

export default ComparisonsPage;