import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import ChatbotPage from "./pages/ChatbotPage.jsx";
import PortfoliosPage from "./pages/PortfoliosPage.jsx";
import FDPage from "./pages/FDPage.jsx";
import ExpensesPage from "./pages/ExpensesPage.jsx";
import ComparisonsPage from "./pages/ComparisonsPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import AuthPage from './pages/AuthPage.jsx';
import StocksPage from "./pages/StocksPage.jsx";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('firebaseToken');  // Clear authentication token
    navigate('/auth');  // This is what redirects to the auth page
  };

  return (
    <div className="min-h-screen bg-neon-green-100">
      {/* Navigation Bar - Excluded from Landing Page and Auth Page */}
      {!['/', '/auth'].includes(location.pathname) && (
    <nav className="fixed w-full top-0 z-50 bg-gray-800 shadow-lg">
    <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
      {/* Logo and Text on left - both clickable */}
      <NavLink to="/" className="flex items-center space-x-2 hover:no-underline">
        <div className="p-0.5 rounded-full bg-gradient-to-r from-green-400 to-blue-500">
          <img 
            src="/financer.png" 
            alt="Logo" 
            className="h-8 w-8 object-contain rounded-full bg-gray-800" 
          />
        </div>
        <span className="text-white font-bold text-lg hover:text-green-400 transition-colors duration-200">
          Financer
        </span>
      </NavLink>
  
      {/* Navigation Links */}
      <ul className="flex space-x-6">
        {[
          { name: "Home", path: "/home" },
          { name: "AI Advisor", path: "/advisor" },
          { name: "Portfolios", path: "/portfolios" },
          { name: "FD", path: "/fd" },
          { name: "Expenses", path: "/expenses" },
          { name: "Stocks", path: "/stocks" },
          { name: "Comparisons", path: "/comparisons" }
        ].map((item, index) => (
          <li key={index} className="relative group">
            <NavLink 
              to={item.path}
              className={({ isActive }) => 
                `text-gray-300 hover:text-white px-3 py-2 transition-colors duration-300 font-medium text-sm uppercase tracking-wider relative ${
                  isActive ? "text-white" : ""
                }`
              }
            >
              {item.name}
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-400 ${
                location.pathname === item.path ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              } transition-opacity duration-300`}></span>
            </NavLink>
          </li>
        ))}
      </ul>
  
      {/* Logout Button remains same */}
      <button
        onClick={handleLogout}
        className="text-red-400 hover:text-red-300 px-3 py-2 transition-colors duration-300 font-medium text-sm uppercase tracking-wider group relative"
      >
        Logout
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </button>
    </div>
  </nav>
      )}

      {/* Page Content */}
      <div className="">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/advisor" element={<ChatbotPage />} />
          <Route path="/portfolios" element={<PortfoliosPage />} />
          <Route path="/fd" element={<FDPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/comparisons" element={<ComparisonsPage />} />
          <Route path="/stocks" element={<StocksPage />} />
        </Routes>
      </div>
    </div>
  );
};

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;