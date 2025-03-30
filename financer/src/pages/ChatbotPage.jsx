import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { text: "Welcome! How can I assist you with your finances today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
      .replace(/\n\*/g, "<br>&#8226; "); // Bullet points
  };

  const fetchBotResponse = async (message) => {
    const token = localStorage.getItem("firebaseToken");
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return formatMessage(data.response);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      return "Sorry, I'm having trouble connecting to the server. Please try again later.";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const botResponse = await fetchBotResponse(userMessage.text);
      const botMessage = { text: botResponse, sender: "bot" };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { 
        text: "Sorry, I couldn't process your request. Please try again.", 
        sender: "bot" 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900">
      <div className="mt-8 container mx-auto max-w-3xl p-4 mt-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 overflow-hidden"
        >
          <div className="mt-8 h-[450px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-md px-4 py-3 rounded-2xl ${
                  msg.sender === "user" 
                    ? "bg-gradient-to-br from-green-500/20 to-blue-600/20 border border-green-400/30"
                    : "bg-gray-700/50 border border-gray-600/30"
                }`}>
                  <p 
                    className={`text-sm ${
                      msg.sender === "user" ? "text-green-400" : "text-gray-300"
                    }`} 
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-700/50 border border-gray-600/30 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="border-t border-gray-700/50 p-4 bg-gray-900/30 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about investments, expenses, or financial planning..."
              className="flex-grow p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-green-400 text-gray-300 placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <motion.button
              onClick={handleSend}
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </motion.button>
          </div>
        </motion.div>
      </div>
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

export default ChatbotPage;
