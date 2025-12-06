import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Portfolio() {
  const [holdings, setHoldings] = useState([]);
  const [form, setForm] = useState({ ticker: '', qty: '', price: '' });
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState('MARKET');
  const [productType, setProductType] = useState('LONGTERM');

  // --- 1. FETCH DATA ---
  const load = async () => {
    try { 
      const res = await axios.get('https://stockwise-api-hxtg.onrender.com/api/portfolio'); 
      setHoldings(Array.isArray(res.data) ? res.data : []); 
    } catch(e) { console.error(e); }
  };
  
  useEffect(() => { load(); }, []);

  // --- 2. ACTIONS ---
  const buy = async (e) => {
    e.preventDefault();
    if(!form.ticker || !form.qty || !form.price) return;
    
    const btn = document.getElementById('buy-btn');
    if(btn) { btn.innerText = 'Processing...'; btn.disabled = true; btn.style.opacity = 0.7; }

    try {
        await axios.post('https://stockwise-api-hxtg.onrender.com/api/portfolio/buy', { 
        ticker: form.ticker.toUpperCase(), quantity: Number(form.qty), price: Number(form.price) 
        });
        setForm({ ticker: '', qty: '', price: '' }); 
        await load();
    } catch(e) { alert('Order Failed'); }
    
    if(btn) { btn.innerText = 'BUY STOCK'; btn.disabled = false; btn.style.opacity = 1; }
  };

  const remove = async (id) => {
    if(confirm('Sell this position completely?')) { 
      await axios.delete(`https://stockwise-api-hxtg.onrender.com/api/portfolio/${id}`); 
      load(); 
    }
  };

  // --- 3. DEMO DATA ---
  const loadDemoData = async () => {
    setLoading(true);
    const demoStocks = [
      { ticker: 'RELIANCE', quantity: 10, price: 2400 },
      { ticker: 'TCS', quantity: 5, price: 3500 },
      { ticker: 'HDFCBANK', quantity: 20, price: 1500 },
      { ticker: 'ZOMATO', quantity: 100, price: 140 }
    ];
    for (let stock of demoStocks) { await axios.post('https://stockwise-api-hxtg.onrender.com/api/portfolio/buy', stock); }
    await load();
    setLoading(false);
  };

  // --- 4. SAFE MATH ---
  const totals = holdings.reduce((acc, h) => {
    const qty = Number(h.quantity) || 0;
    const buyPrice = Number(h.buyPrice) || 0;
    const currentPrice = Number(h.currentPrice) || 0;
    return {
      inv: acc.inv + (buyPrice * qty),
      val: acc.val + (currentPrice > 0 ? currentPrice * qty : buyPrice * qty)
    };
  }, { inv: 0, val: 0 });

  const totalPnL = totals.val - totals.inv;
  const pnlPercent = totals.inv > 0 ? (totalPnL / totals.inv) * 100 : 0;
  const requiredMargin = (Number(form.qty) || 0) * (Number(form.price) || 0);

  // --- 5. AI ANALYSIS ---
  const aiAnalysis = () => {
    if (holdings.length === 0) return { score: 0, msg: "Portfolio is empty.", color: 'var(--text-muted)' };
    const sorted = [...holdings].sort((a,b) => (b.currentValue || 0) - (a.currentValue || 0));
    const largestPct = totals.val > 0 ? (sorted[0].currentValue / totals.val) * 100 : 0;
    
    if (largestPct > 50) return { score: 45, msg: `Concentration Risk: ${sorted[0].ticker} is ${largestPct.toFixed(0)}% of assets.`, color: 'var(--down)' };
    if (totalPnL < 0) return { score: 60, msg: "Market correction. Consider averaging down.", color: '#f0ad4e' };
    return { score: 94, msg: "Healthy Diversification.", color: 'var(--up)' };
  };
  const analysis = aiAnalysis();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Net Worth</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold' }}>₹{totals.val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="card" style={{ borderLeft: `4px solid ${totalPnL >= 0 ? 'var(--up)' : 'var(--down)'}` }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Total P&L</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: totalPnL >= 0 ? 'var(--up)' : 'var(--down)' }}>
            {totalPnL >= 0 ? '+' : ''}{totalPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="card" style={{ borderLeft: `4px solid ${pnlPercent >= 0 ? 'var(--up)' : 'var(--down)'}` }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Return</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: pnlPercent >= 0 ? 'var(--up)' : 'var(--down)' }}>
            {pnlPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* HOLDINGS TABLE */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: '400px' }}>
          <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-panel)' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>HOLDINGS</h3>
            {holdings.length === 0 && (
              <button onClick={loadDemoData} disabled={loading} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: '0.2s' }}>
                {loading ? 'Populating...' : '+ Demo Data'}
              </button>
            )}
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-app)', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <tr>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Instrument</th>
                <th style={{ textAlign: 'right' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Avg.</th>
                <th style={{ textAlign: 'right' }}>LTP</th>
                <th style={{ textAlign: 'right' }}>Cur. Val</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>P&L</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map(h => (
                <tr key={h._id} style={{ borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
                  <td style={{ padding: '12px 20px', fontWeight: 'bold', color: 'var(--text-main)' }}>{h.ticker}</td>
                  <td style={{ textAlign: 'right' }}>{h.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{h.buyPrice.toFixed(2)}</td>
                  <td style={{ textAlign: 'right', color: h.currentPrice > h.buyPrice ? 'var(--up)' : 'var(--down)' }}>{h.currentPrice ? h.currentPrice.toFixed(2) : '-'}</td>
                  <td style={{ textAlign: 'right', fontWeight: '600' }}>{h.currentValue ? Math.round(h.currentValue).toLocaleString() : '-'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: h.profitLoss >= 0 ? 'var(--up)' : 'var(--down)', paddingRight: '20px' }}>
                    {h.profitLoss ? h.profitLoss.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'} <br/>
                    <span style={{ fontSize: '10px', fontWeight: 'normal', opacity: 0.8 }}>{h.percentChange ? h.percentChange.toFixed(2) + '%' : '0.00%'}</span>
                  </td>
                  <td>
                    <button onClick={() => remove(h._id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', opacity: 0.6 }}>&times;</button>
                  </td>
                </tr>
              ))}
              {holdings.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '24px', marginBottom: '10px', opacity: 0.5 }}>💼</div>
                    No holdings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* SIDEBAR PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ORDER ENTRY FORM (REDESIGNED) */}
          <div className="card" style={{ padding: '0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            
            {/* Header Strip */}
            <div style={{ background: 'var(--accent)', color: 'white', padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>Place Order</span>
                <span style={{ fontSize: '10px', fontWeight: 'bold', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '3px' }}>NSE</span>
            </div>
            
            <div style={{ padding: '20px' }}>
                {/* Product Toggles (Segmented Control) */}
                <div style={{ display: 'flex', marginBottom: '15px', background: 'var(--bg-app)', padding: '3px', borderRadius: '6px' }}>
                    <div onClick={() => setProductType('INTRADAY')} 
                         style={{ 
                           flex: 1, textAlign: 'center', padding: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', borderRadius: '4px', transition: '0.2s',
                           background: productType === 'INTRADAY' ? 'var(--bg-panel)' : 'transparent', 
                           color: productType === 'INTRADAY' ? 'var(--accent)' : 'var(--text-muted)', 
                           boxShadow: productType === 'INTRADAY' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' 
                         }}>
                         INTRADAY
                    </div>
                    <div onClick={() => setProductType('LONGTERM')} 
                         style={{ 
                           flex: 1, textAlign: 'center', padding: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', borderRadius: '4px', transition: '0.2s',
                           background: productType === 'LONGTERM' ? 'var(--bg-panel)' : 'transparent', 
                           color: productType === 'LONGTERM' ? 'var(--accent)' : 'var(--text-muted)', 
                           boxShadow: productType === 'LONGTERM' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' 
                         }}>
                         LONGTERM
                    </div>
                </div>

                <form onSubmit={buy} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Inputs */}
                    <div style={{ position: 'relative' }}>
                        <label style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-muted)', position: 'absolute', top: '8px', left: '12px' }}>SYMBOL</label>
                        <input value={form.ticker} onChange={e=>setForm({...form, ticker:e.target.value})} style={{ paddingTop: '22px', paddingBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px', borderRadius: '6px' }} required />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <label style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-muted)', position: 'absolute', top: '8px', left: '12px' }}>QTY</label>
                            <input type="number" value={form.qty} onChange={e=>setForm({...form, qty:e.target.value})} style={{ paddingTop: '22px', paddingBottom: '8px', fontWeight: 'bold', fontSize: '14px', borderRadius: '6px' }} required />
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <label style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-muted)', position: 'absolute', top: '8px', left: '12px' }}>PRICE</label>
                            <input type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} style={{ paddingTop: '22px', paddingBottom: '8px', fontWeight: 'bold', fontSize: '14px', borderRadius: '6px' }} required />
                        </div>
                    </div>

                    {/* Order Type (Modern Chips) */}
                    <div style={{ display: 'flex', gap: '8px', margin: '5px 0' }}>
                        <div onClick={() => setOrderType('MARKET')} 
                             style={{ flex: 1, padding: '8px', fontSize: '11px', textAlign: 'center', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontWeight: '600',
                                      background: orderType === 'MARKET' ? 'rgba(41, 98, 255, 0.1)' : 'transparent', color: orderType === 'MARKET' ? 'var(--accent)' : 'var(--text-muted)', borderColor: orderType === 'MARKET' ? 'var(--accent)' : 'var(--border)' }}>
                            MARKET
                        </div>
                        <div onClick={() => setOrderType('LIMIT')} 
                             style={{ flex: 1, padding: '8px', fontSize: '11px', textAlign: 'center', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontWeight: '600',
                                      background: orderType === 'LIMIT' ? 'rgba(41, 98, 255, 0.1)' : 'transparent', color: orderType === 'LIMIT' ? 'var(--accent)' : 'var(--text-muted)', borderColor: orderType === 'LIMIT' ? 'var(--accent)' : 'var(--border)' }}>
                            LIMIT
                        </div>
                    </div>

                    {/* Margin Info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '10px 0', borderTop: '1px dashed var(--border)', marginTop: '5px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Margin Required</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>₹{requiredMargin.toLocaleString()}</span>
                    </div>

                    {/* Submit Button - NO BORDER, CLEAN SHADOW */}
                    <button id="buy-btn" type="submit" 
                        style={{ 
                            width: '100%', height: '45px', fontSize: '14px', fontWeight: 'bold', 
                            background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', 
                            cursor: 'pointer', boxShadow: '0 4px 6px rgba(41, 98, 255, 0.2)', transition: '0.2s' 
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        BUY STOCK
                    </button>
                </form>
            </div>
          </div>

          {/* AI ANALYST CARD (CLEANER) */}
          <div className="card" style={{ border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', display:'flex', alignItems:'center', gap:'8px' }}>
                    <span style={{fontSize:'16px'}}>🤖</span> Portfolio Analyst
                </h4>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: analysis.color }}>{analysis.score}/100</span>
            </div>
            
            <div style={{ height: '4px', width: '100%', background: 'var(--bg-app)', borderRadius: '2px', overflow: 'hidden', marginBottom: '15px' }}>
                <div style={{ height: '100%', width: `${analysis.score}%`, background: analysis.color, transition: 'width 0.5s ease' }}></div>
            </div>

            <div style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-muted)' }}>
              {analysis.msg}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Portfolio;