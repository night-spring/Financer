import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const predefinedCategories = {
  'Groceries': '🛒',
  'Rent': '🏠',
  'Utilities': '💡',
  'Transportation': '🚕',
  'Entertainment': '🎬',
  'Healthcare': '🏥',
  'Dining': '🍴',
  'Education': '🎓',
  'Shopping': '🛍️',
  'Travel': '✈️',
  'Savings': '💰'
};

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState(() => {
    const token = localStorage.getItem('firebaseToken');
    if (!token) return [];
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [newExpense, setNewExpense] = useState({ 
    category: "", 
    amount: "", 
    date: "" 
  });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("2025-03");

  useEffect(() => {
    const token = localStorage.getItem('firebaseToken');
    if (token) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('firebaseToken');
      if (!token) {
        localStorage.removeItem('expenses');
        setExpenses([]);
      }
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.amount || !newExpense.date) return;
    
    const expenseToAdd = { 
      ...newExpense,
      id: Date.now(), 
      amount: parseFloat(newExpense.amount),
      month: newExpense.date.slice(0, 7)
    };
    
    setExpenses(prev => [...prev, expenseToAdd]);
    setNewExpense({ category: "", amount: "", date: "" });
  };

  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const filteredExpenses = expenses.filter(expense => 
    (selectedCategory === "All" || expense.category === selectedCategory) &&
    expense.date.startsWith(selectedMonth)
  );

  const totalExpenses = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  const averageDaily = totalExpenses / new Date(selectedMonth).getDate();
  const categories = [
    ...new Set([
      ...Object.keys(predefinedCategories),
      ...expenses.map(expense => expense.category)
    ])
  ].sort();

  // Organized chart data with non-zero values
  const chartData = {
    labels: categories
      .map(cat => ({
        category: cat,
        amount: filteredExpenses.filter(e => e.category === cat).reduce((acc, e) => acc + e.amount, 0)
      }))
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .map(item => item.category),
    
    datasets: [{
      data: categories
        .map(cat => filteredExpenses.filter(e => e.category === cat).reduce((acc, e) => acc + e.amount, 0))
        .filter(amount => amount > 0)
        .sort((a, b) => b - a),
      backgroundColor: [
        '#4ADE80', '#60A5FA', '#C084FC', '#F472B6', '#F59E0B',
        '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'
      ],
    }]
  };

  const getCategoryIcon = (category) => {
    return predefinedCategories[category] || '💸';
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-gray-800/50 backdrop-blur-md py-8 text-center shadow-xl border-b border-gray-700"
      >
        <h1 className="mt-16 text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Expense Manager
        </h1>
        <p className="mt-2 text-lg text-gray-300">Track and analyze your spending patterns</p>
      </motion.header>

      <div className="container mx-auto max-w-6xl p-4 mt-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h3 className="text-gray-400 text-sm">Monthly Total</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">
              ₹{totalExpenses.toLocaleString()}
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h3 className="text-gray-400 text-sm">Daily Average</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">
              ₹{averageDaily.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h3 className="text-gray-400 text-sm">Top Category</h3>
            <p className="text-2xl font-bold text-purple-400 mt-2">
              {categories[0] || '-'}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-gray-200 mb-6">New Expense</h2>
            <div className="space-y-4">
              <div className="relative">
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-300
                            focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                            appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOWNhM2FmIj48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')] 
                            bg-no-repeat bg-[length:20px_20px] bg-[center_right_1rem]"
                >
                  <option value="" className="bg-gray-800 text-gray-300">Select Category</option>
                  {categories.map(cat => (
                    <option 
                      key={cat} 
                      value={cat} 
                      className="bg-gray-800 text-gray-300 flex items-center"
                    >
                      <span className="mr-2">{getCategoryIcon(cat)}</span>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="w-full p-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400 text-gray-300 placeholder-gray-500"
              />
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="w-full p-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400 text-gray-300 placeholder-gray-500"
              />
              <motion.button
                onClick={handleAddExpense}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Add Expense
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-200">Spending Breakdown</h3>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300
                          focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                          appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI24IiBmaWxsPSIjOWNhM2FmIj48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')] 
                          bg-no-repeat bg-[length:20px_20px] bg-[center_right_1rem]"
              >
                <option value="2025-03">March 2025</option>
                <option value="2025-02">February 2025</option>
              </select>
            </div>
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
                        label: (ctx) => `₹${ctx.raw.toLocaleString()} (${((ctx.raw/totalExpenses)*100).toFixed(1)}%)`
                      } 
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
            <h2 className="text-xl font-semibold text-gray-200">Recent Expenses</h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300
                        focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                        appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOWNhM2FmIj48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')] 
                        bg-no-repeat bg-[length:20px_20px] bg-[center_right_1rem]"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <motion.div
                key={expense.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition cursor-pointer relative group"
              >
                <button
                  onClick={() => handleDeleteExpense(expense.id)}
                  className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-200">{expense.category}</h3>
                      <p className="text-sm text-gray-400">{expense.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-green-400">
                      ₹{expense.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-400">
                      {((expense.amount / totalExpenses) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
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

export default ExpensesPage;