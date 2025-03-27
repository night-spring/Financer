import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, category: "Groceries", amount: 5000, date: "2025-03-01" },
    { id: 2, category: "Rent", amount: 15000, date: "2025-03-05" },
    { id: 3, category: "Utilities", amount: 3000, date: "2025-03-10" },
  ]);

  const [newExpense, setNewExpense] = useState({ category: "", amount: "", date: "" });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("2025-03");

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.amount || !newExpense.date) return;
    const expenseToAdd = { 
      ...newExpense, 
      id: expenses.length + 1, 
      amount: parseFloat(newExpense.amount),
      month: newExpense.date.slice(0, 7)
    };
    setExpenses([...expenses, expenseToAdd]);
    setNewExpense({ category: "", amount: "", date: "" });
  };

  const filteredExpenses = expenses.filter(expense => 
    (selectedCategory === "All" || expense.category === selectedCategory) &&
    expense.date.startsWith(selectedMonth)
  );

  const totalExpenses = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  const averageDaily = totalExpenses / new Date(selectedMonth).getDate();
  const categories = [...new Set(expenses.map(expense => expense.category))];

  const chartData = {
    labels: categories,
    datasets: [{
      data: categories.map(cat => 
        filteredExpenses.filter(e => e.category === cat).reduce((acc, e) => acc + e.amount, 0)
      ),
      backgroundColor: ['#4ADE80', '#60A5FA', '#C084FC', '#F472B6', '#F59E0B'],
    }]
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Groceries: '🛒',
      Rent: '🏠',
      Utilities: '💡',
      Transportation: '🚕',
      Entertainment: '🎬',
      Healthcare: '🏥'
    };
    return icons[category] || '💸';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-gray-800/50 backdrop-blur-md py-8 text-center shadow-xl border-b border-gray-700"
      >
        <h1 className="mt-8 text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Expense Manager
        </h1>
        <p className="mt-2 text-lg text-gray-300">Track and analyze your spending patterns</p>
      </motion.header>

      <div className="container mx-auto max-w-6xl p-4 mt-8 space-y-8">
        {/* Summary Cards */}
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Expense Form */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-gray-200 mb-6">New Expense</h2>
            <div className="space-y-4">
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full p-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400 text-gray-300"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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

          {/* Expense Chart */}
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
                className="p-2 bg-gray-700/30 border border-gray-600 rounded-lg text-gray-300"
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
                    legend: { labels: { color: '#fff' } },
                    tooltip: { callbacks: { label: (ctx) => `₹${ctx.raw.toLocaleString()}` } }
                  }
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Expenses List */}
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
              className="p-2 bg-gray-700/30 border border-gray-600 rounded-lg text-gray-300"
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
                className="p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition cursor-pointer"
              >
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

      {/* Footer */}
      <footer className="mt-12 bg-gray-900/50 backdrop-blur-md py-6 border-t border-gray-700/50">
        <div className="container mx-auto text-center text-gray-400">
        <p className="mt-4">&copy; 2025 Financer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ExpensesPage;