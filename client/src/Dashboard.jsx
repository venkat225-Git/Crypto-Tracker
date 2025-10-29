import React, { useState } from "react";
import { useEffect } from "react";
import './Dasboard.css'

const Dashboard = () => {

    const [track,setTrack] = useState([])
    const [search,setSearch] = useState("")
    const [filter,setFilter] = useState("track")

    const handle = async() =>{
        const data = await fetch("http://localhost:5000/api/coins")
        const response = await data.json()
        setTrack(response)
    }
    useEffect(() => {
        handle()
        const interval = setInterval(() => {
        handle()
        }, 30 * 60 * 1000);

        return () => clearInterval(interval); 
    }, []);

    const handlesearch = (e) =>{
      setSearch(e.target.value)
    }



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

      <input placeholder="search your crypto" className="search-bar" onChange={handlesearch}></input>



       <select 
         value={filter}
         className="filter-dropdown"
         onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="gainers">Gainers</option>
        <option value="losers">Losers</option>
      </select>



      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>Coin Name</th>
            <th>Symbol</th>
            <th>image</th>
            <th>Current Price(USD)</th>
            <th>marketcap</th>
            <th>24 hrs Change</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.symbol}</td>
                <td>
                   <img src={p.image} alt={p.name} width="25" style={{ marginRight: "10px" }}/>
                      {p.name}
                </td>
                <td>{p.current_price}</td>
                <td>{p.market_cap}</td>
                <td>{p.price_change_percentage_24h}</td>
                <td>{p.last_updated}</td>
              </tr>
        ))}
        </tbody>
      </table>

    </div>
  );
};

export default Dashboard;
