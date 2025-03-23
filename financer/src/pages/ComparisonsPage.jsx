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

const stockData = [
  { 
    symbol: "TCS", 
    name: "Tata Consultancy Services", 
    price: "₹3,450.50", 
    change: "+2.5%", 
    marketCap: "₹12.5T", 
    peRatio: 30.5, 
    dividendYield: "1.8%", 
    week52: "₹3,100 - ₹3,600",
    historical: [3200, 3250, 3350, 3400, 3450],
    sector: "IT",
    risk: "Low"
  },
  { 
    symbol: "INFY", 
    name: "Infosys Limited", 
    price: "₹1,550.75", 
    change: "-0.8%", 
    marketCap: "₹6.8T", 
    peRatio: 25.2, 
    dividendYield: "2.1%", 
    week52: "₹1,400 - ₹1,650",
    historical: [1450, 1500, 1520, 1550, 1555],
    sector: "IT",
    risk: "Medium"
  },
  { 
    symbol: "RELIANCE", 
    name: "Reliance Industries", 
    price: "₹2,850.00", 
    change: "+1.2%", 
    marketCap: "₹19.2T", 
    peRatio: 28.7, 
    dividendYield: "0.9%", 
    week52: "₹2,500 - ₹3,000",
    historical: [2600, 2700, 2750, 2800, 2850],
    sector: "Energy",
    risk: "High"
  },
];

const ComparisonsPage = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedSector, setSelectedSector] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

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

  const filteredStocks = stockData.filter(stock => 
    (selectedSector === "All" || stock.sector === selectedSector) &&
    (riskFilter === "All" || stock.risk === riskFilter)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-gray-800/50 backdrop-blur-md py-8 text-center shadow-xl border-b border-gray-700"
      >
        <h1 className="mt-8 text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Stock Comparison
        </h1>
        <p className="mt-2 text-lg text-gray-300">Analyze and compare stock performance</p>
      </motion.header>

      <div className="container mx-auto max-w-6xl p-4 mt-8 space-y-8">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-xl border border-gray-700"
          >
            <label className="text-gray-300 text-sm">Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full mt-2 p-2 bg-gray-700/30 border border-gray-600 rounded-lg text-gray-300"
            >
              <option value="All">All Sectors</option>
              <option value="IT">Information Technology</option>
              <option value="Energy">Energy</option>
            </select>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-xl border border-gray-700"
          >
            <label className="text-gray-300 text-sm">Risk Level</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full mt-2 p-2 bg-gray-700/30 border border-gray-600 rounded-lg text-gray-300"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-xl border border-gray-700"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-300 text-sm">Stocks Showing</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  {filteredStocks.length}
                </p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </motion.div>
        </div>

        {/* Stocks Table */}
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
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Change</th>
                  <th className="pb-4">Market Cap</th>
                  <th className="pb-4">P/E Ratio</th>
                  <th className="pb-4">52 Week</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock) => (
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
                          <p className="text-gray-400 text-sm">{stock.sector}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-gray-200">{stock.price}</td>
                    <td className={stock.change.startsWith('+') ? "text-green-400" : "text-red-400"}>
                      {stock.change}
                    </td>
                    <td className="text-gray-200">{stock.marketCap}</td>
                    <td className="text-gray-200">{stock.peRatio}</td>
                    <td className="text-gray-400">{stock.week52}</td>
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
        </motion.div>

        {/* Detailed Analysis */}
        {selectedStock && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700 space-y-6"
          >
            {filteredStocks
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-700/20 p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">Dividend Yield</p>
                      <p className="text-2xl text-blue-400 mt-1">{stock.dividendYield}</p>
                    </div>
                    <div className="bg-gray-700/20 p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">Risk Level</p>
                      <p className="text-2xl text-purple-400 mt-1">{stock.risk}</p>
                    </div>
                    <div className="bg-gray-700/20 p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">Volume (Avg)</p>
                      <p className="text-2xl text-green-400 mt-1">₹2.5M</p>
                    </div>
                  </div>

                  <div className="h-64">
                    <Line 
                      data={getChartData(stock.historical)}
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
              ))}
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

export default ComparisonsPage;