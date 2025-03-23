import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const handleNavigation = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900 animate-gradient-x">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex items-center justify-center text-center"
      >
        <div className="max-w-4xl relative z-10">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-green-300 to-blue-400 bg-clip-text text-transparent mb-6"
          >
            Financial Freedom
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
          >
            Transform your financial future with AI-powered insights and real-time analytics
          </motion.p>

          <motion.button
            onClick={handleNavigation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
          >
            Start Your Journey
          </motion.button>
        </div>
      </motion.section>

      {/* CTA Section */}
      <div className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-500/10 -skew-y-3" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto text-center relative"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of users already achieving their financial goals
          </p>
          <motion.button
            onClick={handleNavigation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
          >
            Get Started Free
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white/5 py-8 mt-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 Financial Nexus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const features = [
  { title: "Smart Portfolios", description: "AI-optimized investment portfolios that adapt to market conditions" },
  { title: "Expense Analytics", description: "Automatic categorization and spending pattern recognition" },
  { title: "FD Optimization", description: "Maximize returns with intelligent deposit management" },
  { title: "Market Comparisons", description: "Real-time comparison of financial instruments" },
  { title: "AI Assistant", description: "24/7 financial guidance through natural conversations" },
  { title: "Wealth Tracking", description: "Interactive dashboards with predictive analytics" },
];

export default LandingPage;