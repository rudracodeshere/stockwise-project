import React, { useState } from 'react';

function SIPCalculator() {
  const [investment, setInvestment] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const calculateSIP = () => {
    const i = rate / 12 / 100;
    const n = years * 12;
    const futureValue = investment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = investment * n;
    const wealthGained = futureValue - totalInvested;

    return { invested: totalInvested, gained: wealthGained, total: futureValue };
  };

  const result = calculateSIP();

  return (
    <div>
      <h3>💰 SIP Calculator</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px 0' }}>
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>
            <span>Monthly (₹)</span>
            <span>{investment}</span>
          </label>
          <input type="range" min="500" max="100000" step="500" value={investment} onChange={e => setInvestment(Number(e.target.value))} />
        </div>

        <div>
           <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>
            <span>Returns (%)</span>
            <span>{rate}%</span>
          </label>
          <input type="range" min="5" max="30" step="0.5" value={rate} onChange={e => setRate(Number(e.target.value))} />
        </div>

        <div>
           <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>
            <span>Period (Years)</span>
            <span>{years} Yr</span>
          </label>
          <input type="range" min="1" max="40" step="1" value={years} onChange={e => setYears(Number(e.target.value))} />
        </div>
      </div>

      <div style={{ padding: '15px', background: 'var(--bg-input)', borderRadius: 'var(--radius)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
          <span style={{color: 'var(--text-muted)'}}>Invested</span>
          <strong>₹{result.invested.toLocaleString('en-IN')}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
          <span style={{color: 'var(--text-muted)'}}>Wealth Gained</span>
          <strong style={{ color: 'var(--success)' }}>₹{result.gained.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '1rem', fontWeight: '600' }}>Total Value</span>
          <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent)' }}>
            ₹{result.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SIPCalculator;