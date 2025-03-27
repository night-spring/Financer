import React, { useEffect, useState } from "react";

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/stocks"); // Replace with actual API
        if (!response.ok) throw new Error("Failed to fetch stocks");

        const result = await response.json();
        const stockData = result.data || []; // Extract data array safely

        const formattedStocks = stockData.map((stock) => ({
          symbol: stock.symbol || "N/A",
          name: stock.meta?.companyName || stock.symbol || "Unknown Stock",
          lastPrice: `₹${parseFloat(stock.lastPrice).toFixed(2)}`,
          pChange: `${stock.pChange >= 0 ? "+" : ""}${parseFloat(stock.pChange).toFixed(2)}%`,
          chartToday: stock.chartTodayPath || null, // Include today's chart if available
        }));

        setStocks(formattedStocks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-white mb-6">Stock Prices</h1>

      {loading && <p className="text-center text-gray-300">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map((stock, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-md bg-gray-800 border-gray-700 text-white"
            >
              <h2 className="text-xl font-semibold">{stock.name} ({stock.symbol})</h2>
              <p className="text-lg mt-2">
                Last Price: <span className="font-bold text-green-400">{stock.lastPrice}</span>
              </p>
              <p className={`text-lg mt-1 ${stock.pChange.includes('-') ? 'text-red-400' : 'text-green-400'}`}>
                Change: {stock.pChange}
              </p>
              {stock.chartToday && (
                <img src={stock.chartToday} alt={`${stock.symbol} Chart`} className="mt-2 rounded-md" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockList;
