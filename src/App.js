import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

// --- STYLES (CSS-in-JS) ---
// A professional, multi-page design system.
const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a', // Near-black background
    fontFamily: "'Inter', sans-serif",
    color: '#e5e5e5', // Off-white for text
  },
  mainLayout: {
    display: 'flex',
  },
  navbar: {
    width: '240px',
    backgroundColor: '#141414',
    borderRight: '1px solid #262626',
    padding: '2rem 1rem',
    height: '100vh',
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
  },
  navTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'white',
    padding: '0 1rem',
    marginBottom: '2rem',
  },
  navLink: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    marginBottom: '0.5rem',
    color: isActive ? 'white' : '#a3a3a3',
    backgroundColor: isActive ? 'rgba(63, 138, 242, 0.2)' : 'transparent',
    fontWeight: isActive ? '600' : '400',
    cursor: 'pointer',
    border: '1px solid transparent',
    borderColor: isActive ? '#3f8af2' : 'transparent',
  }),
  contentArea: {
    marginLeft: '240px',
    width: 'calc(100% - 240px)',
    padding: '2rem 3rem',
  },
  header: {
    borderBottom: '1px solid #262626',
    paddingBottom: '1.5rem',
    marginBottom: '2rem',
  },
  h1: {
    fontSize: '2.25rem',
    fontWeight: '700',
    color: 'white',
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: 'white',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #262626',
    paddingBottom: '0.75rem',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '2rem',
    perspective: '2000px',
  },
  card: (color = 'from-gray-700 to-gray-900') => ({
    position: 'relative',
    borderRadius: '1rem',
    padding: '1.5rem',
    color: 'white',
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)',
    ...{
      'from-slate-700': { '--from-color': '#334155', '--to-color': '#0f172a' },
      'from-sky-600': { '--from-color': '#0284c7', '--to-color': '#3730a3' },
      'from-amber-500': { '--from-color': '#f59e0b', '--to-color': '#b91c1c' },
      'from-emerald-600': { '--from-color': '#059669', '--to-color': '#115e59' },
    }[color.split(' ')[0]],
    background: `linear-gradient(145deg, var(--from-color, #334155), var(--to-color, #0f172a))`,
    transformStyle: 'preserve-3d',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '260px',
  }),
  statsBox: {
    backgroundColor: '#141414',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid #262626',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backgroundColor: '#3f8af2',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
  },
  input: {
    backgroundColor: '#1f1f1f',
    color: '#e5e5e5',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    border: '1px solid #3a3a3a',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '1rem',
  },
  footer: {
      textAlign: 'center',
      color: '#525252',
      marginTop: '3rem',
      padding: '1.5rem 0',
      fontSize: '0.875rem'
  },
  bestChoiceTape: {
      position: 'absolute',
      top: '1rem',
      left: '-1.5rem',
      background: 'rgba(63, 138, 242, 0.8)',
      backdropFilter: 'blur(4px)',
      color: 'white',
      fontSize: '0.875rem',
      fontWeight: 'bold',
      padding: '0.5rem 2rem',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      transform: 'rotate(-15deg)',
      transformOrigin: 'center',
      borderLeft: '2px solid rgba(255,255,255,0.3)',
      borderRight: '2px solid rgba(255,255,255,0.3)',
  }
};

// --- DUMMY DATA ---
const DUMMY_CARDS = [
  { id: 1, bankName: 'Apex Financial', cardName: 'Obsidian Tier', lastFourDigits: '4242', statementDate: 20, dueDate: 10, creditLimit: 80000, currentUsage: 22000, color: 'from-slate-700 to-slate-900' },
  { id: 2, bankName: 'Meridian Trust', cardName: 'Solaris', lastFourDigits: '8931', statementDate: 5, dueDate: 25, creditLimit: 150000, currentUsage: 61000, color: 'from-amber-500 to-red-700' },
  { id: 3, bankName: 'Nexus Bank', cardName: 'Quantum', lastFourDigits: '1121', statementDate: 15, dueDate: 5, creditLimit: 200000, currentUsage: 45000, color: 'from-sky-600 to-indigo-800' },
];
const DUMMY_TRANSACTIONS = [];
const TRANSACTION_CATEGORIES = ["Groceries", "Dining", "Travel", "Shopping", "Utilities", "Entertainment", "Other"];

// --- ICONS ---
const DashboardIcon = () => (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 14.5v5M12.5 10.5v9M8.5 6.5v13M4.5 12.5v7"></path></svg>);
const ReportsIcon = () => (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.5 14.5a2 2 0 100-4 2 2 0 000 4z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.5 8.5a2 2 0 100-4 2 2 0 000 4zM8.5 20.5a2 2 0 100-4 2 2 0 000 4zM15.5 14.5a2 2 0 100-4 2 2 0 000 4zM4.75 12.25v-1.5a3 3 0 013-3h8.5a3 3 0 013 3v8.5a3 3 0 01-3 3h-1.5"></path></svg>);
const ProfileIcon = () => (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14.5a4 4 0 100-8 4 4 0 000 8z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.5 19.5v-3a4 4 0 00-4-4h-5a4 4 0 00-4 4v3"></path></svg>);
const PlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" style={{height: '1.25rem', width: '1.25rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" /> </svg> );
const XIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" style={{height: '1rem', width: '1rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /> </svg> );
const CardChipIcon = () => (<svg width="48" height="38" fill="none" viewBox="0 0 48 38"><rect width="48" height="38" fill="#dcae54" rx="4"></rect><rect width="32" height="24" x="8" y="7" stroke="#b0842b" strokeWidth="2" rx="2"></rect><path stroke="#b0842b" strokeLinecap="round" strokeWidth="2" d="M16 7v24M32 7v24M8 19h32"></path></svg>);

// --- HELPER & CORE LOGIC ---
function AnimatedNumber({ value, currency = false, percentage = false }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => {
    const rounded = Math.round(current);
    return `${currency ? '₹' : ''}${rounded.toLocaleString()}${percentage ? '%' : ''}`;
  });
  useEffect(() => { spring.set(value); }, [spring, value]);
  return <motion.span>{display}</motion.span>;
}

const selectBestCard = (cards, purchaseDate) => {
  if (!cards || cards.length === 0) return null;
  const purchaseDay = purchaseDate.getDate();
  const recommendations = cards.map(card => {
    let statementMonth = purchaseDate.getMonth(); let statementYear = purchaseDate.getFullYear();
    if (purchaseDay > card.statementDate) { statementMonth += 1; if (statementMonth > 11) { statementMonth = 0; statementYear += 1; } }
    let dueMonth = statementMonth; let dueYear = statementYear;
    if (card.dueDate < card.statementDate) { dueMonth += 1; if (dueMonth > 11) { dueMonth = 0; dueYear += 1; } }
    const paymentDueDate = new Date(dueYear, dueMonth, card.dueDate);
    const daysUntilDue = Math.ceil((paymentDueDate - purchaseDate) / (1000 * 60 * 60 * 24));
    return { ...card, daysUntilDue, paymentDueDate };
  });
  recommendations.sort((a, b) => b.daysUntilDue - a.daysUntilDue);
  return recommendations[0];
};

// --- GAUGE COMPONENT ---
const RealTimeGauge = ({ value, label, color }) => {
    const GAUGE_RADIUS = 80;
    const STROKE_WIDTH = 15;
    const CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;
    const percentage = useSpring(0, { stiffness: 50, damping: 20 });
    const strokeDashoffset = useTransform(percentage, (p) => CIRCUMFERENCE - (p / 100) * CIRCUMFERENCE);
    useEffect(() => { percentage.set(value > 100 ? 100 : value); }, [value, percentage]);
    return (
        <div style={{ backgroundColor: '#141414', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #262626', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#a3a3a3', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>{label}</p>
            <div style={{ position: 'relative', width: GAUGE_RADIUS * 2, height: GAUGE_RADIUS * 2 }}>
                <svg width={GAUGE_RADIUS * 2} height={GAUGE_RADIUS * 2} viewBox={`0 0 ${GAUGE_RADIUS * 2} ${GAUGE_RADIUS * 2}`} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={GAUGE_RADIUS} cy={GAUGE_RADIUS} r={GAUGE_RADIUS - STROKE_WIDTH / 2} fill="transparent" stroke="#262626" strokeWidth={STROKE_WIDTH} />
                    <motion.circle cx={GAUGE_RADIUS} cy={GAUGE_RADIUS} r={GAUGE_RADIUS - STROKE_WIDTH / 2} fill="transparent" stroke={color || '#f59e0b'} strokeWidth={STROKE_WIDTH} strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'white' }}>
                        <AnimatedNumber value={value} percentage={true} />
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- UI COMPONENTS ---

const CreditCard = ({ card, isRecommended = false, onDelete, onLogTransaction }) => (
  <motion.div className="metallic-card" layout initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ type: 'spring' }} style={styles.card(card.color)} whileHover={{ scale: 1.05, rotateY: 8, boxShadow: "0px 30px 60px -15px rgba(0,0,0,0.5)" }} >
    <div className="holographic-overlay"></div>
    <div style={{flexGrow: 1}}>
        <motion.button onClick={() => onDelete(card.id)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', width: '1.75rem', height: '1.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }} aria-label="Delete card" whileHover={{ scale: 1.2, rotate: 90, background: 'rgba(239, 68, 68, 0.8)' }} > <XIcon /> </motion.button>
        {isRecommended && ( <motion.div style={styles.bestChoiceTape} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: -15 }} transition={{ delay: 0.5, type: 'spring', stiffness: 500 }} > Best Choice </motion.div> )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', transform: 'translateZ(20px)' }}>
          <h3 className="engraved-text" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{card.bankName}</h3>
          <CardChipIcon />
        </div>
        <div className="engraved-text" style={{ fontFamily: 'monospace', fontSize: '1.75rem', letterSpacing: '0.1em', marginBottom: '1.5rem', transform: 'translateZ(40px)' }}>**** **** **** {card.lastFourDigits}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.875rem', transform: 'translateZ(20px)' }}>
          <div className="engraved-text-light"> <p style={{ opacity: 0.7 }}>Current Usage</p> <p style={{ fontWeight: '600', fontSize: '1.125rem' }}>₹{card.currentUsage.toLocaleString()}</p> </div>
          <div className="engraved-text-light" style={{textAlign: 'right'}}> <p style={{ opacity: 0.7 }}>Limit</p> <p style={{ fontWeight: '600', fontSize: '1.125rem' }}>₹{card.creditLimit.toLocaleString()}</p> </div>
        </div>
    </div>
    <motion.button onClick={() => onLogTransaction(card.id)} style={{...styles.button, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', marginTop: '1.5rem', width: '100%'}} whileHover={{background: 'rgba(255,255,255,0.2)'}}>
        Log Transaction
    </motion.button>
  </motion.div>
);

const AddCardModal = ({ isOpen, onClose, onAddCard }) => {
    const [formData, setFormData] = useState({ bankName: '', cardName: '', lastFourDigits: '', creditLimit: '', currentUsage: '', statementDate: '', dueDate: '' });
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleSubmit = (e) => {
        e.preventDefault();
        const newCard = { id: Date.now(), ...formData, creditLimit: Number(formData.creditLimit), currentUsage: Number(formData.currentUsage), statementDate: Number(formData.statementDate), dueDate: Number(formData.dueDate), color: `from-emerald-600 to-teal-800` };
        onAddCard(newCard);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }} onClick={onClose} >
                    <motion.div initial={{ scale: 0.9, y: -50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: -50 }} style={{ background: '#1f1f1f', color: '#e5e5e5', borderRadius: '1rem', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', width: '100%', maxWidth: '500px', border: '1px solid #3a3a3a' }} onClick={e => e.stopPropagation()} >
                        <h2 style={{...styles.h2, border: 'none', padding: 0}}>Add a New Credit Card</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                           {/* Form inputs remain the same */}
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank Name" required style={styles.input} />
                                <input name="cardName" value={formData.cardName} onChange={handleChange} placeholder="Card Name" required style={styles.input} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input name="lastFourDigits" value={formData.lastFourDigits} onChange={handleChange} placeholder="Last 4 Digits" required type="number" style={styles.input} />
                                <input name="creditLimit" value={formData.creditLimit} onChange={handleChange} placeholder="Credit Limit (₹)" required type="number" style={styles.input} />
                            </div>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input name="currentUsage" value={formData.currentUsage} onChange={handleChange} placeholder="Current Usage (₹)" required type="number" style={styles.input} />
                                <input name="statementDate" value={formData.statementDate} onChange={handleChange} placeholder="Statement Date (1-31)" required type="number" min="1" max="31" style={styles.input} />
                            </div>
                             <input name="dueDate" value={formData.dueDate} onChange={handleChange} placeholder="Due Date (1-31)" required type="number" min="1" max="31" style={styles.input} />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem' }}>
                                <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{...styles.button, padding: '0.5rem 1.5rem'}}>Add Card</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const AddTransactionModal = ({ isOpen, onClose, onAddTransaction, cardId }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(TRANSACTION_CATEGORIES[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !category || !cardId) return;
        onAddTransaction({
            cardId: cardId,
            amount: Number(amount),
            category: category,
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }} onClick={onClose}>
                    <motion.div initial={{ scale: 0.9, y: -50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: -50 }} style={{ background: '#1f1f1f', color: '#e5e5e5', borderRadius: '1rem', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', width: '100%', maxWidth: '400px', border: '1px solid #3a3a3a' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ ...styles.h2, border: 'none', padding: 0 }}>Log Transaction</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{display: 'block', marginBottom: '0.5rem', color: '#a3a3a3'}}>Amount (₹)</label>
                                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 1500" required style={styles.input} />
                            </div>
                            <div>
                                <label style={{display: 'block', marginBottom: '0.5rem', color: '#a3a3a3'}}>Category</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input}>
                                    {TRANSACTION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem' }}>
                                <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ ...styles.button, padding: '0.5rem 1.5rem' }}>Log</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// --- PAGE COMPONENTS ---

const Dashboard = ({ cards, onAddButtonClick, onDeleteCard, onLogTransaction }) => {
  const [today] = useState(new Date());
  const bestCard = useMemo(() => selectBestCard(cards, today), [cards, today]);
  
  const { totalUsage, totalLimit } = useMemo(() => {
    const totalUsage = cards.reduce((acc, card) => acc + card.currentUsage, 0);
    const totalLimit = cards.reduce((acc, card) => acc + card.creditLimit, 0);
    return { totalUsage, totalLimit };
  }, [cards]);

  const StatItem = ({ label, value, currency = false, color }) => (
    <div style={{backgroundColor: '#141414', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #262626'}}>
      <p style={{ color: '#a3a3a3', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{label}</p>
      <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: color || 'white' }}>
        <AnimatedNumber value={value} currency={currency} />
      </p>
    </div>
  );

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.h1}>Dashboard</h1>
        <p style={{color: '#a3a3a3'}}>A quick overview of your financial health.</p>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
        <StatItem label="Total Credit Limit" value={totalLimit} currency={true} color="#3f8af2" />
        <StatItem label="Total Amount Used" value={totalUsage} currency={true} color="#e11d48" />
        <RealTimeGauge label="Overall Utilization" value={totalLimit > 0 ? parseFloat(((totalUsage / totalLimit) * 100).toFixed(2)) : 0} color="#f59e0b" />
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h2 style={{...styles.h2, border: 'none', padding: 0, margin: 0}}>Your Cards</h2>
          <motion.button onClick={onAddButtonClick} style={styles.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} > <PlusIcon /> Add New Card </motion.button>
      </div>
      <AnimatePresence>
        <div style={styles.cardGrid}>
            {cards.map(card => ( <CreditCard key={card.id} card={card} isRecommended={card.id === bestCard?.id} onDelete={onDeleteCard} onLogTransaction={onLogTransaction} /> ))}
        </div>
      </AnimatePresence>
      {cards.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', background: '#141414', borderRadius: '1rem', border: '1px solid #262626' }}>
            <h3 style={{...styles.h2, fontSize: '1.5rem', marginBottom: '0.5rem', border: 'none'}}>Your wallet is empty!</h3>
            <p style={{color: '#a3a3a3', marginBottom: '1.5rem'}}>Click "Add New Card" to get started.</p>
          </div>
      )}
      {bestCard && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#3f8af2', background: 'rgba(63, 138, 242, 0.1)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(63, 138, 242, 0.2)' }}>
          <p style={{ fontWeight: 'bold' }}>Recommendation for today ({today.toLocaleDateString()}):</p>
          <p>Use the <span style={{ fontWeight: 'bold' }}>{bestCard.bankName} {bestCard.cardName}</span> to get the longest interest-free period (~{bestCard.daysUntilDue} days).</p>
        </div>
      )}
    </div>
  );
};

const Reports = ({ cards, transactions }) => {
    const barData = useMemo(() => cards.map(c => ({ name: c.bankName.split(' ')[0], Usage: c.currentUsage, Limit: c.creditLimit })), [cards]);
    const pieData = useMemo(() => {
        const totalUsage = cards.reduce((acc, card) => acc + card.currentUsage, 0);
        const totalLimit = cards.reduce((acc, card) => acc + card.creditLimit, 0);
        return [ { name: 'Total Used', value: totalUsage }, { name: 'Remaining Limit', value: Math.max(0, totalLimit - totalUsage) } ];
    }, [cards]);

    return (
        <div>
            <div style={styles.header}>
                <h1 style={styles.h1}>Financial Reports</h1>
                <p style={{color: '#a3a3a3'}}>Dive deeper into your spending habits.</p>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '2rem'}}>
                <div style={styles.statsBox}>
                    <h2 style={styles.h2}>Recent Transactions</h2>
                    <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                                <tr style={{borderBottom: '1px solid #262626'}}>
                                    <th style={{padding: '0.75rem', textAlign: 'left', color: '#a3a3a3'}}>Date</th>
                                    <th style={{padding: '0.75rem', textAlign: 'left', color: '#a3a3a3'}}>Card</th>
                                    <th style={{padding: '0.75rem', textAlign: 'left', color: '#a3a3a3'}}>Category</th>
                                    <th style={{padding: '0.75rem', textAlign: 'right', color: '#a3a3a3'}}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.sort((a,b) => b.date - a.date).map(t => {
                                    const card = cards.find(c => c.id === t.cardId);
                                    return (
                                        <tr key={t.id} style={{borderBottom: '1px solid #262626'}}>
                                            <td style={{padding: '0.75rem'}}>{new Date(t.date).toLocaleDateString()}</td>
                                            <td style={{padding: '0.75rem'}}>{card ? card.bankName : 'N/A'}</td>
                                            <td style={{padding: '0.75rem'}}>{t.category}</td>
                                            <td style={{padding: '0.75rem', textAlign: 'right', color: '#e11d48', fontWeight: '600'}}>₹{t.amount.toLocaleString()}</td>
                                        </tr>
                                    )
                                })}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{textAlign: 'center', padding: '2rem', color: '#a3a3a3'}}>No transactions logged yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={styles.statsBox}>
                    <h2 style={styles.h2}>Usage vs. Limit</h2>
                    <div style={{height: '400px'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                                <XAxis dataKey="name" stroke="#a3a3a3" />
                                <YAxis stroke="#a3a3a3" tickFormatter={(val) => `₹${val/1000}k`} />
                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #3a3a3a', borderRadius: '0.5rem'}} />
                                <Legend />
                                <Bar dataKey="Usage" fill="#e11d48" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Limit" fill="#3f8af2" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Profile = () => (
    <div>
        <div style={styles.header}>
            <h1 style={styles.h1}>Profile</h1>
            <p style={{color: '#a3a3a3'}}>Manage your account settings.</p>
        </div>
        <div style={styles.statsBox}>
            <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
                <div style={{width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(145deg, #3f8af2, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <span style={{fontSize: '3rem', fontWeight: 'bold', color: 'white'}}>R</span>
                </div>
                <div>
                    <h2 style={{...styles.h2, border: 'none', padding: 0, margin: 0, fontSize: '2rem'}}>Rehan</h2>
                    <p style={{color: '#a3a3a3'}}>Member Since: August 2025</p>
                </div>
            </div>
        </div>
    </div>
);


// --- MAIN APP COMPONENT ---
export default function App() {
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem('creditCards');
    return savedCards ? JSON.parse(savedCards) : DUMMY_CARDS;
  });
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : DUMMY_TRANSACTIONS;
  });

  const [isCardModalOpen, setCardModalOpen] = useState(false);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => { localStorage.setItem('creditCards', JSON.stringify(cards)); }, [cards]);
  useEffect(() => { localStorage.setItem('transactions', JSON.stringify(transactions)); }, [transactions]);

  const addCard = (newCard) => { setCards(prevCards => [...prevCards, newCard]); };
  const deleteCard = (cardId) => { setCards(prevCards => prevCards.filter(card => card.id !== cardId)); };
  
  const handleLogTransactionClick = (cardId) => {
      setActiveCardId(cardId);
      setTransactionModalOpen(true);
  };

  const addTransaction = (transactionData) => {
      setTransactions(prev => [...prev, {id: Date.now(), date: Date.now(), ...transactionData}]);
      setCards(prevCards => prevCards.map(card => 
          card.id === transactionData.cardId 
          ? { ...card, currentUsage: card.currentUsage + transactionData.amount }
          : card
      ));
  };

  const renderPage = () => {
      switch (currentPage) {
          case 'dashboard':
              return <Dashboard cards={cards} onAddButtonClick={() => setCardModalOpen(true)} onDeleteCard={deleteCard} onLogTransaction={handleLogTransactionClick} />;
          case 'reports':
              return <Reports cards={cards} transactions={transactions} />;
          case 'profile':
              return <Profile />;
          default:
              return <Dashboard cards={cards} onAddButtonClick={() => setCardModalOpen(true)} onDeleteCard={deleteCard} onLogTransaction={handleLogTransactionClick} />;
      }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        .metallic-card::before {
          content: ''; position: absolute; top: 0; right: 0; bottom: 0; left: 0;
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c8TV1mAAAAG3RSTlNAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAvEOwtAAAAYklEQVR42u3PSQEAAAjAoHv/fp8tfgCtIuHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4e-');
          opacity: 0.05; z-index: 0; pointer-events: none;
        }
        .holographic-overlay {
          position: absolute; top: 0; right: 0; bottom: 0; left: 0;
          background: linear-gradient(110deg, transparent 25%, rgba(255, 255, 255, 0.25) 45%, rgba(255, 255, 255, 0.25) 55%, transparent 75%);
          background-size: 250% 250%;
          opacity: 0;
          transition: opacity 0.5s ease, background-position 0.5s ease;
        }
        .metallic-card:hover .holographic-overlay {
          opacity: 1;
          background-position: -150% -150%;
        }
        .engraved-text {
            text-shadow: 0px 1px 1px rgba(0,0,0,0.7), 0px -1px 1px rgba(255,255,255,0.1);
        }
        .engraved-text-light {
            text-shadow: 0px 1px 1px rgba(0,0,0,0.4);
        }
      `}</style>
      <AddCardModal isOpen={isCardModalOpen} onClose={() => setCardModalOpen(false)} onAddCard={addCard} />
      <AddTransactionModal isOpen={isTransactionModalOpen} onClose={() => setTransactionModalOpen(false)} onAddTransaction={addTransaction} cardId={activeCardId} />
      <div style={styles.appContainer}>
        <div style={styles.mainLayout}>
            <nav style={styles.navbar}>
                <div style={styles.navTitle}>CardWise</div>
                <div>
                    <div style={styles.navLink(currentPage === 'dashboard')} onClick={() => setCurrentPage('dashboard')}> <DashboardIcon /> Dashboard </div>
                    <div style={styles.navLink(currentPage === 'reports')} onClick={() => setCurrentPage('reports')}> <ReportsIcon /> Reports </div>
                    <div style={styles.navLink(currentPage === 'profile')} onClick={() => setCurrentPage('profile')}> <ProfileIcon /> Profile </div>
                </div>
            </nav>
            <main style={styles.contentArea}>
                {renderPage()}
            </main>
        </div>
        <footer style={styles.footer}>
            <p>Made by Rehan</p>
        </footer>
      </div>
    </>
  );
}
