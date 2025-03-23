import React, { useState } from "react";
import { motion } from "framer-motion";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { text: "Welcome! How can I assist you with your finances today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage = { text: "Thank you for your query. Let me process that!", sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-gray-800/50 backdrop-blur-md py-6 text-center shadow-xl border-b border-gray-700"
      >
        <h1 className="pt-8 text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Financial Assistant
        </h1>
        <p className="mt-2 text-lg text-gray-300">AI-powered financial guidance at your fingertips</p>
      </motion.header>

      {/* Chat Area */}
      <div className="container mx-auto max-w-3xl p-4 mt-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 overflow-hidden"
        >
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
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
                  <p className={`text-sm ${
                    msg.sender === "user" ? "text-green-400" : "text-gray-300"
                  }`}>
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700/50 p-4 bg-gray-900/30 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about investments, expenses, or financial planning..."
              className="flex-grow p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-green-400 text-gray-300 placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <motion.button
              onClick={handleSend}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Send
            </motion.button>
          </div>
        </motion.div>
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

export default ChatbotPage;