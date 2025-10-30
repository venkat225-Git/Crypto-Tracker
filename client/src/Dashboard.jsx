import React, { useState, useEffect } from "react";
import "./Dasboard.css";

const Dashboard = () => {
  const [track, setTrack] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const handle = async () => {
    try {
      const data = await fetch("https://crypto-tracker-ngqq.onrender.com/api/coins");
      const response = await data.json();

      // ✅ Store only the array
      if (Array.isArray(response.data)) {
        setTrack(response.data);
      } else {
        console.error("Unexpected API format:", response);
        setTrack([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTrack([]);
    }
  };

  useEffect(() => {
    handle();

    const interval = setInterval(() => {
      handle();
    }, 30 * 60 * 1000); // every 30 minutes

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // ✅ Filter logic with safe checks
  let filtered = track.filter((item) => {
    if (filter === "gainers") return item.price_change_percentage_24h > 0;
    if (filter === "losers") return item.price_change_percentage_24h < 0;
    return true;
  });

  filtered = filtered.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Crypto Tracker</h2>

      <input
        placeholder="Search your crypto"
        className="search-bar"
        onChange={handleSearch}
      />

      <select
        value={filter}
        className="filter-dropdown"
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="gainers">Gainers</option>
        <option value="losers">Losers</option>
      </select>

      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>Coin Name</th>
            <th>Symbol</th>
            <th>Image</th>
            <th>Current Price (USD)</th>
            <th>Market Cap</th>
            <th>24h Change</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.coinId}>
              <td>{p.name}</td>
              <td>{p.symbol}</td>
              <td>
                <img
                  src={p.image}
                  alt={p.name}
                  width="25"
                  style={{ marginRight: "10px" }}
                />
              </td>
              <td>${p.current_price}</td>
              <td>${p.market_cap.toLocaleString()}</td>
              <td
                style={{
                  color: p.price_change_percentage_24h >= 0 ? "green" : "red",
                }}
              >
                {p.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td>{new Date(p.last_updated).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
