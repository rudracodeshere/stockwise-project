import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MarketOverview({ onSelectStock }) { // Accept the prop here
  const [indices, setIndices] = useState([]);
  const [movers, setMovers] = useState({ gainers: [], losers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resIndices, resMovers] = await Promise.all([
          axios.get('http://localhost:5000/api/stocks/market/status'),
          axios.get('http://localhost:5000/api/stocks/market/movers')
        ]);
        setIndices(resIndices.data);
        setMovers(resMovers.data);
      } catch (error) {
        console.error("Market data error");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading Market Data...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontWeight: '300', fontSize: '24px' }}>Market Dashboard 🇮🇳</h2>
      
      {/* 1. INDICES GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {indices.map((idx) => (
          <div key={idx.symbol} className="card" style={{ 
            borderTop: `4px solid ${idx.percentChange >= 0 ? '#00b341' : '#ff3b30'}`,
            padding: '25px'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '5px', letterSpacing: '1px' }}>
                {idx.symbol === '^NSEI' ? 'NSE' : 'BSE'} INDEX
            </div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                {idx.name}
            </div>
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '32px', fontWeight: '300', lineHeight: '1' }}>
                  {idx.price.toLocaleString('en-IN')}
              </span>
              <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: idx.percentChange >= 0 ? 'var(--up)' : 'var(--down)' }}>
                    {idx.percentChange > 0 ? '+' : ''}{idx.percentChange.toFixed(2)}%
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. MARKET MOVERS (Gainers & Losers) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Pass the function down to the tables */}
        <MoversTable title="Top Gainers 🚀" data={movers.gainers} color="var(--up)" onSelectStock={onSelectStock} />
        <MoversTable title="Top Losers 📉" data={movers.losers} color="var(--down)" onSelectStock={onSelectStock} />
      </div>

    </div>
  );
}

// Sub-component for the tables
const MoversTable = ({ title, data, color, onSelectStock }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="card">
      <h3 style={{ 
        borderBottom: '1px solid var(--border)', 
        paddingBottom: '15px', 
        marginBottom: '10px', 
        color: color, 
        fontSize: '16px',
        display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        {title}
      </h3>
      
      <div>
        {data.map((s, index) => {
            if (!s || !s.symbol) return null; 

            // Clean symbol for display (remove .NS) but keep original for API calls if needed
            const displaySymbol = s.symbol.replace('.NS','');

            return (
                <div 
                  key={s.symbol || index} 
                  onClick={() => onSelectStock(s.symbol)} // CLICK ACTION ADDED
                  className="mover-row" // Used for hover effect
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '12px 10px', // Added horizontal padding for hover effect 
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer', // Show hand cursor
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'} // Hover effect
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                <div>
                    <span style={{ fontWeight: 'bold', fontSize: '14px', display: 'block' }}>
                        {displaySymbol}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {s.shortName || 'NSE'}
                    </span>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '500' }}>₹{s.regularMarketPrice ? s.regularMarketPrice.toLocaleString() : '-'}</div>
                    <div style={{ 
                      color: color, 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      background: color === 'var(--up)' ? 'rgba(0,179,65,0.1)' : 'rgba(255,59,48,0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginTop: '2px'
                    }}>
                    {s.regularMarketChangePercent ? (s.regularMarketChangePercent > 0 ? '+' : '') + s.regularMarketChangePercent.toFixed(2) + '%' : '0%'}
                    </div>
                </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default MarketOverview;