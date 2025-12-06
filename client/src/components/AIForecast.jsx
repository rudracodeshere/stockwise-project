import React, { useState } from 'react';
import axios from 'axios';

function AIForecast() {
  const [ticker, setTicker] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async (e) => {
    e.preventDefault();
    if (!ticker) return;
    setLoading(true);
    setData(null);
    try {
      const res = await axios.get(`https://stockwise-api-hxtg.onrender.com/api/stocks/${ticker.toUpperCase()}/forecast`);
      setData(res.data);
    } catch (error) {
      alert("Analysis failed. Please check the stock symbol (e.g. use 'TCS' or 'TCS.NS').");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
          AI TRADE PREDICTOR 🧠
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
          Algorithmic Technical Analysis + NLP News Sentiment
        </p>
      </div>

      {/* SEARCH */}
      <form onSubmit={analyze} style={{ display: 'flex', gap: '10px', maxWidth: '600px', margin: '0 auto 50px auto' }}>
        <input 
          placeholder="Enter Stock Symbol (e.g. RELIANCE)" 
          value={ticker} 
          onChange={e => setTicker(e.target.value)}
          style={{ 
            padding: '15px 25px', 
            fontSize: '16px', 
            borderRadius: '50px', 
            border: '2px solid var(--border)', 
            background: 'var(--bg-panel)',
            flex: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
          }}
        />
        <button type="submit" disabled={loading} style={{ 
          padding: '0 35px', 
          borderRadius: '50px', 
          background: '#131722', 
          color: 'white', 
          border: 'none', 
          fontWeight: 'bold', 
          fontSize: '14px', 
          cursor: 'pointer',
          letterSpacing: '1px',
          transition: '0.2s'
        }}>
          {loading ? '...' : 'PREDICT'}
        </button>
      </form>

      {/* RESULTS DISPLAY (With Safety Checks) */}
      {data && (
        <div className="card" style={{ borderTop: `6px solid ${data.color === 'var(--up)' ? '#00b341' : data.color === 'var(--down)' ? '#ff3b30' : '#787b86'}` }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '32px' }}>{data.symbol?.replace('.NS','') || ticker}</h1>
              <div style={{ fontSize: '18px', color: 'var(--text-muted)', marginTop: '5px' }}>
                ₹{data.currentPrice ? data.currentPrice.toFixed(2) : '-'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>AI Recommendation</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: data.color }}>
                {data.signal}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Confidence: {data.totalScore ? data.totalScore.toFixed(2) : '0.00'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
              <h4 style={{ marginBottom: '15px', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Technical Indicators</h4>
              
              <IndicatorRow label="RSI (14)" value={data.details?.rsi || '-'} />
              <IndicatorRow label="50-Day MA" value={data.details?.sma50 || '-'} />
              <IndicatorRow label="200-Day MA" value={data.details?.sma200 || '-'} />
              
              <div style={{ marginTop: '15px', fontSize: '13px', color: 'var(--text-muted)' }}>
                *Technical Score: <strong>{data.details?.techScore || 0}</strong>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '15px', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>News Sentiment</h4>
              
              <div style={{ background: 'var(--bg-app)', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>Combined News Score</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: data.details?.newsSentiment > 0 ? 'var(--up)' : data.details?.newsSentiment < 0 ? 'var(--down)' : 'var(--text-muted)' }}>
                    {data.details?.newsSentiment ? (data.details.newsSentiment > 0 ? '+' : '') + data.details.newsSentiment : '0'}
                </div>
                <div style={{ fontSize: '11px', marginTop: '5px', color: 'var(--text-main)' }}>
                    {data.details?.newsSentiment > 0 ? 'Positive Outlook' : data.details?.newsSentiment < 0 ? 'Negative Outlook' : 'Neutral'}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {!data && !loading && (
        <div style={{ textAlign: 'center', marginTop: '60px', opacity: 0.5 }}>
          <div style={{ fontSize: '48px', marginBottom: '10px', filter: 'grayscale(1)' }}>📊</div>
          <p style={{ color: 'var(--text-muted)' }}>Enter a ticker above to run the dual-engine analysis.</p>
        </div>
      )}
    </div>
  );
}

const IndicatorRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
    <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{label}</span>
    <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{value}</span>
  </div>
);

export default AIForecast;