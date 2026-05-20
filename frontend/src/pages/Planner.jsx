import React, { useState } from 'react';
import { chatWithAI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Planner = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Xin chào! 🏮 Tôi là HanoMate. Hãy cho tôi biết bạn muốn khám phá gì nhé!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    try {
      const response = await chatWithAI(userMessage);
      setMessages((prev) => [...prev, { role: 'ai', content: response.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', content: '❌ Có lỗi xảy ra.' }]);
    } finally {
      setLoading(false);
    }
  };

  const bubble = (isUser) => ({
    maxWidth: '75%', padding: '14px 18px', borderRadius: '16px', fontSize: '0.95rem',
    lineHeight: 1.6, alignSelf: isUser ? 'flex-end' : 'flex-start',
    background: isUser ? 'linear-gradient(135deg,#e94560,#c73650)' : 'rgba(26,26,46,0.8)',
    border: isUser ? 'none' : '1px solid rgba(233,69,96,0.15)', color: '#eaeaea',
  });

  return (
    <div style={{ maxWidth: 800, margin: '100px auto 40px', padding: '0 20px', minHeight: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24, fontSize: '1.5rem' }}>🗓️ AI Trip Planner</h2>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((msg, i) => (<div key={i} style={bubble(msg.role === 'user')}>{msg.content}</div>))}
        {loading && <LoadingSpinner message="AI đang lập lịch trình..." />}
      </div>
      <div style={{ display: 'flex', gap: 12, padding: 16, background: 'rgba(26,26,46,0.8)', border: '1px solid rgba(233,69,96,0.15)', borderRadius: 16 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập yêu cầu..." style={{ flex: 1, background: '#16213e', border: '1px solid rgba(233,69,96,0.2)', borderRadius: 10, padding: '12px 16px', color: '#eaeaea', fontSize: '0.95rem', fontFamily: 'Inter', outline: 'none' }} />
        <button onClick={handleSend} className="btn btn-primary" disabled={loading || !input.trim()}>Gửi ✨</button>
      </div>
    </div>
  );
};

export default Planner;
