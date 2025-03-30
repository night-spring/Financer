import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const predefinedBanks = {
  'SBI': '🏦',
  'HDFC': '🏛️',
  'ICICI': '🏢',
  'Axis Bank': '🏤',
  'Kotak Mahindra': '🏨',
  'PNB': '🏣'
};

const FDPage = () => {
  const [fds, setFds] = useState(() => {
    const token = localStorage.getItem('firebaseToken');
    if (!token) return [];
    const savedFDs = localStorage.getItem('fds');
    return savedFDs ? JSON.parse(savedFDs) : [];
  });

  const [newFd, setNewFd] = useState({ 
    bank: "", 
    amount: "", 
    rate: "", 
    tenure: "", 
    startDate: "" 
  });
  const [sortBy, setSortBy] = useState("date");
  const [selectedBank, setSelectedBank] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem('firebaseToken');
    if (token) {
      localStorage.setItem('fds', JSON.stringify(fds));
    }
  }, [fds]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('firebaseToken');
      if (!token) {
        localStorage.removeItem('fds');
        setFds([]);
      }
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleAddFD = () => {
    if (!Object.values(newFd).every(Boolean)) return;
    
    const fdToAdd = { 
      ...newFd,
      id: Date.now(), 
      amount: parseFloat(newFd.amount), 
      rate: parseFloat(newFd.rate), 
      tenure: parseInt(newFd.tenure),
      interest: (parseFloat(newFd.amount) * parseFloat(newFd.rate) * parseInt(newFd.tenure)) / 1200
    };
    
    setFds(prev => [...prev, fdToAdd]);
    setNewFd({ bank: "", amount: "", rate: "", tenure: "", startDate: "" });
  };

  const handleDeleteFD = (id) => {
    setFds(prev => prev.filter(fd => fd.id !== id));
  };

  const sortedFds = [...fds].sort((a, b) => {
    if (sortBy === "amount") return b.amount - a.amount;
    if (sortBy === "rate") return b.rate - a.rate;
    return new Date(b.startDate) - new Date(a.startDate);
  });

  const filteredFds = sortedFds.filter(fd => 
    selectedBank === "All" || fd.bank === selectedBank
  );

  const totalInvestment = filteredFds.reduce((acc, fd) => acc + fd.amount, 0);
  const totalInterest = filteredFds.reduce((acc, fd) => acc + fd.interest, 0);
  const banks = [...new Set([...Object.keys(predefinedBanks), ...fds.map(fd => fd.bank)])].sort();

  const chartData = {
    labels: filteredFds.map(fd => fd.bank),
    datasets: [{
      label: 'FD Amount',
      data: filteredFds.map(fd => fd.amount),
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

  const getBankIcon = (bank) => {
    return predefinedBanks[bank] || '🏦';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900">
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
            <h3 className="text-gray-400 text-sm">Top Bank</h3>
            <p className="text-2xl font-bold text-purple-400 mt-2">
              {banks[0] || '-'}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-gray-200 mb-6">Add New FD</h2>
            <div className="space-y-4">
              <div className="relative">
                <select
                  value={newFd.bank}
                  onChange={(e) => setNewFd({ ...newFd, bank: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-300
                            focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                            appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOWNhM2FmIj48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')] 
                            bg-no-repeat bg-[length:20px_20px] bg-[center_right_1rem]"
                >
                  <option value="" className="bg-gray-800 text-gray-300">Select Bank</option>
                  {banks.map(bank => (
                    <option 
                      key={bank} 
                      value={bank} 
                      className="bg-gray-800 text-gray-300 flex items-center"
                    >
                      <span className="mr-2">{getBankIcon(bank)}</span>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>
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

          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-200">FD Distribution</h3>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300
                          focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                          appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOWNhM2FmIj48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')] 
                          bg-no-repeat bg-[length:20px_20px] bg-[center_right_1rem]"
              >
                <option value="All">All Banks</option>
                {banks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
            <div className="h-64">
              <Bar 
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { 
                      callbacks: {
                        label: (context) => `₹${context.raw.toLocaleString()}`,
                        footer: (items) => {
                          const fd = filteredFds[items[0].dataIndex];
                          return `Interest: ₹${fd.interest.toLocaleString()}\nRate: ${fd.rate}%`;
                        }
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

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-200">Your Fixed Deposits</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300
                        focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                        appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOWNhM2FmIj48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')] 
                        bg-no-repeat bg-[length:20px_20px] bg-[center_right_1rem]"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="rate">Sort by Rate</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredFds.map((fd) => (
              <motion.div
                key={fd.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition cursor-pointer relative group"
              >
                <button
                  onClick={() => handleDeleteFD(fd.id)}
                  className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getBankIcon(fd.bank)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-200">{fd.bank}</h3>
                      <p className="text-sm text-gray-400">
                        {calculateMaturityDate(fd.startDate, fd.tenure)} • {fd.tenure} months
                      </p>
                    </div>
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