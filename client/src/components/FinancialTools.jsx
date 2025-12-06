import React, { useState } from 'react';

function FinancialTools() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', fontWeight: '300' }}>Trader's Utility Belt 🛠️</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <BrokerageCalc />
        <PositionSizeCalc />
        <PivotPoints />
      </div>
    </div>
  );
}

// --- TOOL 1: Brokerage Estimator (Simplified for India) ---
function BrokerageCalc() {
  const [buy, setBuy] = useState(100);
  const [sell, setSell] = useState(110);
  const [qty, setQty] = useState(50);

  const turnover = (buy + sell) * qty;
  const grossProfit = (sell - buy) * qty;
  
  // Approx charges (Brokerage + STT + Exchange + GST + Stamp) ~ 0.1% for Delivery/Intraday mix approx
  const charges = turnover * 0.001; 
  const netProfit = grossProfit - charges;

  return (
    <div className="card">
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '15px', fontWeight: 'bold', color: 'var(--accent)' }}>
        NET PROFIT ESTIMATOR
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Buy Price</label>
            <input type="number" value={buy} onChange={e => setBuy(Number(e.target.value))} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sell Price</label>
            <input type="number" value={sell} onChange={e => setSell(Number(e.target.value))} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quantity</label>
          <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} />
        </div>

        <div style={{ marginTop: '15px', padding: '15px', background: 'var(--bg-app)', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Gross P&L:</span>
            <span>{grossProfit.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Est. Charges:</span>
            <span style={{ color: 'var(--down)' }}>-{charges.toFixed(2)}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '5px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>Net Profit:</span>
            <span style={{ color: netProfit >= 0 ? 'var(--up)' : 'var(--down)' }}>
              {netProfit.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- TOOL 2: Position Sizing (Risk Management) ---
function PositionSizeCalc() {
  const [capital, setCapital] = useState(100000);
  const [riskPer, setRiskPer] = useState(1); // 1% risk
  const [entry, setEntry] = useState(500);
  const [stopLoss, setStopLoss] = useState(480);

  const riskAmount = capital * (riskPer / 100);
  const lossPerShare = entry - stopLoss;
  const qty = lossPerShare > 0 ? Math.floor(riskAmount / lossPerShare) : 0;
  const totalExposure = qty * entry;

  return (
    <div className="card">
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '15px', fontWeight: 'bold', color: 'var(--accent)' }}>
        RISK & POSITION SIZING
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Capital</label>
          <input type="number" value={capital} onChange={e => setCapital(Number(e.target.value))} />
        </div>
        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Risk per Trade (%)</label>
          <input type="number" value={riskPer} onChange={e => setRiskPer(Number(e.target.value))} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Entry Price</label>
            <input type="number" value={entry} onChange={e => setEntry(Number(e.target.value))} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Stop Loss</label>
            <input type="number" value={stopLoss} onChange={e => setStopLoss(Number(e.target.value))} />
          </div>
        </div>

        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Recommended Quantity</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-main)' }}>{qty}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Capital Required: ₹{totalExposure.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- TOOL 3: Pivot Points (Technical Analysis) ---
function PivotPoints() {
  const [high, setHigh] = useState(1520);
  const [low, setLow] = useState(1480);
  const [close, setClose] = useState(1500);

  const pp = (high + low + close) / 3;
  const r1 = (2 * pp) - low;
  const s1 = (2 * pp) - high;
  const r2 = pp + (high - low);
  const s2 = pp - (high - low);

  return (
    <div className="card">
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '15px', fontWeight: 'bold', color: 'var(--accent)' }}>
        PIVOT POINT ANALYZER
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        <div><label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>High</label><input type="number" value={high} onChange={e => setHigh(Number(e.target.value))} /></div>
        <div><label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Low</label><input type="number" value={low} onChange={e => setLow(Number(e.target.value))} /></div>
        <div><label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Close</label><input type="number" value={close} onChange={e => setClose(Number(e.target.value))} /></div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <LevelRow label="Resist 2" val={r2} color="var(--down)" />
        <LevelRow label="Resist 1" val={r1} color="rgba(255, 59, 48, 0.6)" />
        <LevelRow label="PIVOT" val={pp} color="var(--accent)" bold />
        <LevelRow label="Support 1" val={s1} color="rgba(0, 179, 65, 0.6)" />
        <LevelRow label="Support 2" val={s2} color="var(--up)" />
      </div>
    </div>
  );
}

function LevelRow({ label, val, color, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', background: 'var(--bg-app)', borderRadius: '4px' }}>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: bold ? 'bold' : 'normal', color: color }}>{val.toFixed(2)}</span>
    </div>
  );
}

export default FinancialTools;