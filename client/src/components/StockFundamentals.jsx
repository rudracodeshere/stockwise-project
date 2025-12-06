import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StockFundamentals({ ticker }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (ticker) {
      axios.get(`http://localhost:5000/api/stocks/${ticker}/fundamentals`)
        .then(res => setData(res.data))
        .catch(e => console.error(e));
    }
  }, [ticker]);

  if (!ticker || !data) return null;

  // Helper for formatting large numbers (Crores)
  const fmt = (n) => n ? n.toLocaleString('en-IN') : '-';
  const cr = (n) => n ? (n / 10000000).toFixed(2) + ' Cr' : '-';

  return (
    <div className="card" style={{ marginTop: '20px' }}>
       <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '15px', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', letterSpacing: '1px' }}>
          KEY STATISTICS
       </div>
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px' }}>
          <Stat label="Market Cap" value={cr(data.marketCap)} />
          <Stat label="P/E Ratio" value={data.peRatio?.toFixed(2)} />
          <Stat label="52W High" value={fmt(data.high52)} color="var(--up)" />
          <Stat label="52W Low" value={fmt(data.low52)} color="var(--down)" />
          <Stat label="Volume" value={fmt(data.volume)} />
          <Stat label="Book Value" value={data.bookValue?.toFixed(2)} />
       </div>
    </div>
  );
}

const Stat = ({ label, value, color }) => (
  <div>
    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '14px', fontWeight: '600', color: color || 'var(--text-main)' }}>{value}</div>
  </div>
);

export default StockFundamentals;