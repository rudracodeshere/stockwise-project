import React, { useState } from 'react';
import axios from 'axios';

function TickerSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    setSearching(true);
    setHasSearched(false);
    setResults([]); 

    try {
      const res = await axios.get(`https://stockwise-api-hxtg.onrender.com/api/stocks/search/${query}`);
      setResults(res.data.slice(0, 5)); // Show top 5
    } catch (error) {
      console.error("Search error");
    }
    
    setSearching(false);
    setHasSearched(true);
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '10px', color: 'var(--text-muted)' }}>Find Symbol</h3>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
        <input 
          placeholder="Company (e.g. TATA)" 
          value={query} 
          onChange={e => setQuery(e.target.value)}
          style={{ marginBottom: 0, fontSize: '0.9rem' }}
        />
        <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0 12px', borderRadius: '8px', cursor: 'pointer' }} disabled={searching}>
          {searching ? '...' : '🔍'}
        </button>
      </form>

      {/* SEARCHING STATE */}
      {searching && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Searching...</div>}

      {/* RESULTS LIST */}
      {results.length > 0 && (
        <div style={{ background: 'var(--bg-input)', borderRadius: '8px', padding: '10px', border: '1px solid var(--border)' }}>
          {results.map((item) => (
            <div key={item.symbol} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
              <div>
                <span style={{ fontWeight: 'bold', color: 'var(--accent)', display: 'block' }}>{item.symbol}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.shortname || item.longname}</span>
              </div>
              <button 
                onClick={() => {navigator.clipboard.writeText(item.symbol); alert(`Copied ${item.symbol}! Paste it in Watchlist.`)}}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
                title="Copy to Clipboard"
              >
                📋
              </button>
            </div>
          ))}
        </div>
      )}

      {/* NO RESULTS STATE */}
      {hasSearched && !searching && results.length === 0 && (
        <div style={{ fontSize: '0.8rem', color: 'var(--danger)', fontStyle: 'italic' }}>
          No Indian stocks found for "{query}".
        </div>
      )}
    </div>
  );
}

export default TickerSearch;