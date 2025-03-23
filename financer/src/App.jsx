import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import ChatbotPage from "./pages/ChatbotPage.jsx";
import PortfoliosPage from "./pages/PortfoliosPage.jsx";
import FDPage from "./pages/FDPage.jsx";
import ExpensesPage from "./pages/ExpensesPage.jsx";
import ComparisonsPage from "./pages/ComparisonsPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import StocksPage from "./pages/StocksPage.jsx";

const App = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-neon-green-100">
      {/* Navigation Bar - Excluded from Landing Page */}
      {location.pathname !== '/' && (
        <nav className="fixed w-full top-0 z-50 bg-gray-800 shadow-lg">
          <ul className="max-w-7xl mx-auto flex justify-center items-center p-4 space-x-6">
            {[
              { name: "Home", path: "/home" },
              { name: "Chatbot", path: "/chatbot" },
              { name: "Portfolios", path: "/portfolios" },
              { name: "FD", path: "/fd" },
              { name: "Expenses", path: "/expenses" },
              { name: "Stocks", path: "/stocks" },
              { name: "Comparisons", path: "/comparisons" }
             
            ].map((item, index) => (
              <li key={index} className="relative group">
                <Link 
                  to={item.path} 
                  className="text-gray-300 hover:text-white px-3 py-2 transition-colors duration-300 font-medium text-sm uppercase tracking-wider relative"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Page Content */}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/portfolios" element={<PortfoliosPage />} />
          <Route path="/fd" element={<FDPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/comparisons" element={<ComparisonsPage />} />\
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