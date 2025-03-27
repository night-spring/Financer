import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FDPage = () => {
  const [fds, setFds] = useState([
    { 
      id: 1, 
      bank: "Bank A", 
      amount: 100000, 
      rate: 5.5, 
      tenure: 12, 
      startDate: "2024-01-01",
      interest: (100000 * 5.5 * 12) / 1200 // Added interest calculation for initial data
    },
    { 
      id: 2, 
      bank: "Bank B", 
      amount: 200000, 
      rate: 6.0, 
      tenure: 24, 
      startDate: "2024-02-15",
      interest: (200000 * 6.0 * 24) / 1200
    },
    { 
      id: 3, 
      bank: "Bank C", 
      amount: 150000, 
      rate: 5.8, 
      tenure: 18, 
      startDate: "2024-03-10",
      interest: (150000 * 5.8 * 18) / 1200
    },
  ]);

  const [newFd, setNewFd] = useState({ bank: "", amount: "", rate: "", tenure: "", startDate: "" });

  const handleAddFD = () => {
    if (!Object.values(newFd).every(Boolean)) return;
    const fdToAdd = { 
      ...newFd, 
      id: fds.length + 1, 
      amount: parseFloat(newFd.amount), 
      rate: parseFloat(newFd.rate), 
      tenure: parseInt(newFd.tenure),
      interest: (parseFloat(newFd.amount) * parseFloat(newFd.rate) * parseInt(newFd.tenure)) / 1200

    };
    setFds([...fds, fdToAdd]);
    setNewFd({ bank: "", amount: "", rate: "", tenure: "", startDate: "" });
  };

  const totalInvestment = fds.reduce((acc, fd) => acc + fd.amount, 0);
  const totalInterest = fds.reduce((acc, fd) => acc + fd.interest, 0);

  const chartData = {
    labels: fds.map(fd => fd.bank),
    datasets: [{
      label: 'FD Amount',
      data: fds.map(fd => fd.amount),
      backgroundColor: '#4ADE80',
      borderColor: '#059669',
      borderWidth: 1
    }]
  };

  const calculateMaturityDate = (startDate, tenure) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + tenure);
    return date.toLocaleDateString();
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
          Fixed Deposit Manager
        </h1>
        <p className="mt-2 text-lg text-gray-300">Track and optimize your fixed deposit investments</p>
      </motion.header>

      <div className="container mx-auto max-w-6xl p-4 mt-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h3 className="text-gray-400 text-sm">Total Investment</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">
              ₹{totalInvestment.toLocaleString()}
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h3 className="text-gray-400 text-sm">Estimated Interest</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">
              ₹{totalInterest.toLocaleString()}
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h3 className="text-gray-400 text-sm">Average Rate</h3>
            <p className="text-3xl font-bold text-purple-400 mt-2">
            {((fds.reduce((acc, fd) => acc + fd.rate, 0) / fds.length).toFixed(1))}
            </p>
          </motion.div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FD Form */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-gray-200 mb-6">Add New FD</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Bank Name"
                value={newFd.bank}
                onChange={(e) => setNewFd({ ...newFd, bank: e.target.value })}
                className="w-full p-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400 text-gray-300 placeholder-gray-500"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newFd.amount}
                onChange={(e) => setNewFd({ ...newFd, amount: e.target.value })}
                className="w-full p-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400 text-gray-300 placeholder-gray-500"
              />
              <input
                type="number"
                placeholder="Interest Rate (%)"
                value={newFd.rate}
                onChange={(e) => setNewFd({ ...newFd, rate: e.target.value })}
                className="w-full p-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400 text-gray-300 placeholder-gray-500"
              />
              <input
                type="number"
                placeholder="Tenure (months)"
                value={newFd.tenure}
                onChange={(e) => setNewFd({ ...newFd, tenure: e.target.value })}
                className="w-full p-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400 text-gray-300 placeholder-gray-500"
              />
              <input
                type="date"
                value={newFd.startDate}
                onChange={(e) => setNewFd({ ...newFd, startDate: e.target.value })}
                className="w-full p-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400 text-gray-300 placeholder-gray-500"
              />
              <motion.button
                onClick={handleAddFD}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Add Fixed Deposit
              </motion.button>
            </div>
          </motion.div>

          {/* FD Chart */}
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-200 mb-4">FD Distribution</h3>
            <div className="h-64">
              <Bar 
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { 
                      callbacks: {
                        label: (context) => `₹${context.raw.toLocaleString()}`
                      }
                    }
                  },
                  scales: {
                    y: {
                      ticks: { color: '#9CA3AF' },
                      grid: { color: '#374151' }
                    },
                    x: {
                      ticks: { color: '#9CA3AF' }
                    }
                  }
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* FD List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-200">Your Fixed Deposits</h2>
            <div className="flex gap-2">
              <button className="bg-green-400/10 text-green-400 px-4 py-2 rounded-lg hover:bg-green-400/20 transition">
                Sort by Date
              </button>
              <button className="bg-blue-400/10 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-400/20 transition">
                Sort by Amount
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {fds.map((fd) => (
              <motion.div
                key={fd.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-200">{fd.bank}</h3>
                    <p className="text-sm text-gray-400">
                      {calculateMaturityDate(fd.startDate, fd.tenure)} • {fd.tenure} months
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-green-400">
                      ₹{fd.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-400">
                      {fd.rate}% • ₹{fd.interest.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-gray-600 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                    style={{ width: `${(fd.tenure / 36) * 100}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
     <footer className="mt-16 bg-gray-900/50 backdrop-blur-md py-6 border-t border-gray-700/50">
       <div className="container mx-auto text-center text-gray-400">
         {/* Logo with Gradient Border */}
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

export default FDPage;