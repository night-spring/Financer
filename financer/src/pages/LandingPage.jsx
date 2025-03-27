import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } }
  };

  const handleNavigation = () => navigate('/auth');

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900">
      {/* Navigation Header */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed w-full top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Financer
          </span>
          <motion.button
            onClick={handleNavigation}
            whileHover={{ scale: 1.05 }}
            className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen flex items-center justify-center text-center px-4"
      >
        <div className="max-w-4xl relative z-10 space-y-8 pt-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-block mb-4 text-green-400 bg-green-900/20 px-4 py-2 rounded-full text-sm">
                Welcome to Financer
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeUp}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-green-300 to-blue-400 bg-clip-text text-transparent min-h-[210px] leading-tight"
            >
              Smart Wealth Management
            </motion.h1>

            
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-gray-300 mt-6 max-w-3xl mx-auto leading-relaxed"
            >
              Powered by <strong className="text-green-400">Financer</strong>'s AI-driven platform - 
              Optimize investments, maximize returns, and achieve financial freedom with precision.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10">
              <motion.button
                onClick={handleNavigation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-green-500/20 transition-all"
              >
                Start with Financer →
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Why Choose Financer?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Next-generation features for modern investors
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 hover:border-green-400/30 transition-all"
              >
                <div className="mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-green-400/20 to-blue-500/20 flex items-center justify-center">
                    {index % 3 === 0 ? '📈' : index % 3 === 1 ? '💡' : '⚡'}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="py-20 bg-gradient-to-r from-green-400/10 to-blue-500/10"
      >
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-green-400 mb-3">15K+</div>
            <div className="text-gray-300">Financer Community Members</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-400 mb-3">₹850Cr+</div>
            <div className="text-gray-300">Assets Managed</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-purple-400 mb-3">98%</div>
            <div className="text-gray-300">User Satisfaction Rate</div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-gray-400 px-4">
          <div className="mb-6">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Financer
            </span>
          </div>
          <p className="mb-4">
            Revolutionizing personal finance management since 2024
          </p>
          <p>&copy; 2025 Financer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const features = [
  { title: "AI Portfolios", description: "Financer's machine learning algorithms optimize your investments 24/7" },
  { title: "FD Management", description: "Smart fixed deposit allocation with automatic renewal system" },
  { title: "Stock Analytics", description: "Real-time market insights powered by Financer's analytics engine" },
  { title: "Mutual Funds", description: "Curated selections from Financer's expert team" },
  { title: "Expense Tracking", description: "AI-powered categorization and spending optimization" },
  { title: "Wealth Forecast", description: "Predictive financial modeling exclusive to Financer" },
];

export default LandingPage;
