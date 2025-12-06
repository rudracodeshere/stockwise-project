import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MarketScanner() {
  const [movers, setMovers] = useState({ gainers: [], losers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/stocks/market/movers')
      .then(res => setMovers(res.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Scanning Market...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '30px', fontWeight: '300' }}>Market Scanner 📡</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <ScannerList title="Top Gainers" data={movers.gainers} type="up" />
        <ScannerList title="Top Losers" data={movers.losers} type="down" />
      </div>
    </div>
  );
}

const ScannerList = ({ title, data, type }) => (
  <div className="card">
    <div style={{ 
        paddingBottom: '15px', marginBottom: '10px', borderBottom: '1px solid var(--border)',
        color: type === 'up' ? 'var(--up)' : 'var(--down)', fontWeight: 'bold', fontSize: '16px' 
    }}>
        {title}
    </div>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
            {data.map(s => (
                <tr key={s.symbol} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 0' }}>
                        <div style={{ fontWeight: 'bold' }}>{s.symbol.replace('.NS','')}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>NSE</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '500' }}>{s.regularMarketPrice}</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                        <div style={{ 
                            color: type === 'up' ? 'var(--up)' : 'var(--down)', fontWeight: 'bold',
                            background: type === 'up' ? 'rgba(0,179,65,0.1)' : 'rgba(255,59,48,0.1)',
                            padding: '4px 8px', borderRadius: '4px', display: 'inline-block', fontSize: '12px'
                        }}>
                            {s.regularMarketChangePercent.toFixed(2)}%
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
  </div>
);

export default MarketScanner;