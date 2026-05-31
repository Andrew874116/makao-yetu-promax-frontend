import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MortgageCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(5000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [interestRate, setInterestRate] = useState(12.5);
  const [loanTermYears, setLoanTermYears] = useState(20);
  const [income, setIncome] = useState(50000);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [result, setResult] = useState(null);

  const calculateMortgage = () => {
    const downPaymentAmount = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPaymentAmount;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;
    
    let monthlyPayment = 0;
    if (monthlyInterestRate > 0) {
      monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    } else {
      monthlyPayment = loanAmount / numberOfPayments;
    }
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    const incomePercent = (monthlyPayment / income) * 100;
    
    setResult({ monthlyPayment, totalPayment, totalInterest, loanAmount, downPaymentAmount, incomePercent });
    
    // AI Advice
    if (incomePercent > 40) {
      setAiAdvice({ level: 'warning', message: '⚠️ This mortgage would take over 40% of your income. Consider a cheaper property or larger down payment.', color: '#E63030' });
    } else if (incomePercent > 30) {
      setAiAdvice({ level: 'caution', message: '📊 This mortgage would take about 30% of your income. Manageable but be careful with other expenses.', color: '#F5D200' });
    } else {
      setAiAdvice({ level: 'good', message: '✅ Great! This mortgage fits comfortably within your budget. You could even save extra each month.', color: '#4CAF50' });
    }
  };

  const formatCurrency = (num) => 'Ksh ' + Math.round(num).toLocaleString();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.1)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '40px', color: 'var(--text)', textDecoration: 'none', marginBottom: '2rem' }}>← Back</Link>
        
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#F5D200', marginBottom: '0.5rem' }}>🏦 AI Mortgage Calculator</h1>
        <p style={{ color: 'rgba(255,255,255,.6)', marginBottom: '2rem' }}>Calculate payments + Get AI advice on affordability</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ color: '#F5D200', marginBottom: '1rem' }}>📝 Property Details</h3>
            <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)' }}>Property Price (Ksh)</label>
            <input type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(Number(e.target.value))} style={{ width: '100%', padding: '10px', marginBottom: '1rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
            
            <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)' }}>Down Payment (%)</label>
            <input type="range" min="0" max="50" step="5" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))} style={{ width: '100%' }} />
            <div style={{ textAlign: 'right', marginBottom: '1rem', fontSize: '0.8rem', color: '#F5D200' }}>{downPaymentPercent}%</div>
            
            <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)' }}>Interest Rate (%)</label>
            <input type="number" step="0.5" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} style={{ width: '100%', padding: '10px', marginBottom: '1rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
            
            <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)' }}>Loan Term (Years)</label>
            <select value={loanTermYears} onChange={(e) => setLoanTermYears(Number(e.target.value))} style={{ width: '100%', padding: '10px', marginBottom: '1rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}>
              <option value={5}>5 years</option><option value={10}>10 years</option><option value={15}>15 years</option>
              <option value={20}>20 years</option><option value={25}>25 years</option><option value={30}>30 years</option>
            </select>
            
            <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)' }}>Your Monthly Income (Ksh)</label>
            <input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} style={{ width: '100%', padding: '10px', marginBottom: '1rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
            
            <button onClick={calculateMortgage} style={{ width: '100%', padding: '12px', background: '#E63030', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Calculate & Get AI Advice</button>
          </div>
          
          <div>
            {aiAdvice && (
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '1rem', marginBottom: '1rem', borderLeft: `4px solid ${aiAdvice.color}` }}>
                <p style={{ color: aiAdvice.color }}>{aiAdvice.message}</p>
              </div>
            )}
            
            {result && (
              <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
                <h3 style={{ color: '#F5D200', marginBottom: '1rem' }}>📊 Your Results</h3>
                <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg)', borderRadius: '12px', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem' }}>Monthly Payment</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#F5D200' }}>{formatCurrency(result.monthlyPayment)}</div>
                  <div style={{ fontSize: '0.7rem' }}>({result.incomePercent.toFixed(1)}% of your income)</div>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Property Price:</span><strong>{formatCurrency(propertyPrice)}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Down Payment:</span><strong>{formatCurrency(result.downPaymentAmount)}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#E63030' }}><span>Loan Amount:</span><strong>{formatCurrency(result.loanAmount)}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Total Interest:</span><strong>{formatCurrency(result.totalInterest)}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}><span>Total Payment:</span><strong>{formatCurrency(result.totalPayment)}</strong></div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.3)', textAlign: 'center', marginTop: '2rem' }}>* AI advice is based on general financial guidelines (30% income rule). Consult a financial advisor.</p>
      </div>
    </div>
  );
}