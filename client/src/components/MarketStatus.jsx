import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MarketStatus() {
  const [indices, setIndices] = useState([]);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await axios.get('https://stockwise-api-hxtg.onrender.com/api/stocks/market/status');
        setIndices(res.data);
      } catch (error) {
        console.error("Error loading market status");
      }
    };
    fetchMarket();
  }, []);

  if (indices.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: '24px', width: '100%' }}>
      {indices.map((index) => (
        <div key={index.symbol} className="card" style={{ 
          flex: 1,
          marginBottom: 0, /* Override default card margin */
          borderLeft: `5px solid ${index.percentChange >= 0 ? '#10b981' : '#ef4444'}`
        }}>
          <h4 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>{index.name}</h4>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '8px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)' }}>
              {index.price.toLocaleString('en-IN')}
            </span>
            <span style={{ 
              fontWeight: '600', 
              color: index.percentChange >= 0 ? '#10b981' : '#ef4444' 
            }}>
              {index.change.toFixed(2)} ({index.percentChange.toFixed(2)}%)
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MarketStatus;