import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Watchlist({ onSelectStock }) {
  const [stocks, setStocks] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTicker, setActiveTicker] = useState(null);

  const fetchStocks = async () => {
    try {
      const res = await axios.get('https://stockwise-api-hxtg.onrender.com/api/stocks');
      setStocks(res.data);
    } catch (e) {}
  };

  useEffect(() => { fetchStocks(); }, []);

  const handleSearch = async (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 2) {
      const res = await axios.get(`https://stockwise-api-hxtg.onrender.com/api/stocks/search/${e.target.value}`);
      setSearchResults(res.data.slice(0, 5));
    } else { setSearchResults([]); }
  };

  const addStock = async (ticker) => {
    await axios.post('https://stockwise-api-hxtg.onrender.com/api/stocks', { ticker });
    setQuery(''); setSearchResults([]); fetchStocks();
  };

  // NEW: Remove Stock Function
  const removeStock = async (e, id) => {
    e.stopPropagation(); // Prevents clicking the row when clicking delete
    if (confirm('Remove from Watchlist?')) {
      await axios.delete(`https://stockwise-api-hxtg.onrender.com/api/stocks/${id}`);
      fetchStocks();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Search Bar */}
      <div className="watchlist-search">
        <input 
          placeholder=" +  Add Symbol" 
          value={query} 
          onChange={handleSearch}
        />
        {searchResults.length > 0 && (
          <div style={{ position: 'absolute', background: 'var(--bg-panel)', border: '1px solid var(--border)', width: '260px', zIndex: 50, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {searchResults.map(s => (
              <div key={s.symbol} onClick={() => addStock(s.symbol)} 
                   style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{s.symbol}</span>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.shortname}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {stocks.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                Your watchlist is empty.<br/>Add a symbol above.
            </div>
        )}
        {stocks.map(s => (
          <div 
            key={s._id} 
            className={`watchlist-item ${activeTicker === s.ticker ? 'selected' : ''}`}
            onClick={() => { onSelectStock(s.ticker); setActiveTicker(s.ticker); }}
          >
            <div>
              <div style={{ fontWeight: '600', fontSize: '13px' }}>{s.ticker}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>NSE</div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px' }}>{s.price ? s.price.toFixed(2) : '-'}</div>
                <div style={{ fontSize: '11px' }} className={s.changePercent >= 0 ? 'text-up' : 'text-down'}>
                    {s.changePercent ? s.changePercent.toFixed(2) + '%' : '0%'}
                </div>
                </div>
                
                {/* NEW: Delete Button */}
                <button className="delete-btn" onClick={(e) => removeStock(e, s._id)} title="Remove">
                    &times;
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Watchlist;