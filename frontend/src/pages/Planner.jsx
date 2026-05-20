import React, { useState, useContext, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// Ảnh Bờ Hồ ban đêm làm nền chatbox
const CHATBOX_BG = 'https://images.unsplash.com/photo-1599708153386-62bf23145451?q=80&w=1600&auto=format&fit=crop';

const Planner = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Xin chào! 🏮 Tôi là HanoMate AI. Tôi có thể giúp bạn lên kế hoạch tham quan Hà Nội, gợi ý địa điểm ăn uống, xem giá cả thực tế và tạo lịch trình tối ưu. Bạn muốn khám phá gì hôm nay?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    try {
      const response = await chatWithAI(userMessage);
      setMessages(prev => [...prev, { role: 'ai', content: response.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: '❌ Có lỗi xảy ra. Vui lòng thử lại.' }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    '🍜 Tour ẩm thực phố cổ 2 tiếng',
    '🏮 Lịch trình 1 ngày Hà Nội',
    '💰 Phở bò ngon nhất giá hợp lý',
    '☕ Cà phê đẹp Hà Nội',
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      backgroundImage: `url(${CHATBOX_BG})`,
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
      position: 'relative',
    }}>
      {/* Background overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,10,25,0.75)', backdropFilter: 'blur(2px)' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 820, width: '100%', margin: '0 auto', padding: '100px 20px 20px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', borderRadius: 50, padding: '8px 20px 8px 12px', marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#D4A017,#FF8C00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '1rem' }}>H</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '.88rem' }}>HanoMate AI</div>
              <div style={{ color: '#10B981', fontSize: '.72rem', fontWeight: 600 }}>● Online</div>
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 8 }}>
            AI Trip Planner 🗓️
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '.9rem' }}>Lên kế hoạch du lịch Hà Nội với AI thông minh nhất</p>
        </div>

        {/* Quick suggestions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => setInput(s)} style={{
              padding: '8px 16px', borderRadius: 50,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.8)', fontSize: '.8rem', fontWeight: 500, cursor: 'pointer',
              backdropFilter: 'blur(8px)', transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,160,23,0.2)'; e.currentTarget.style.borderColor = 'rgba(212,160,23,0.4)'; e.currentTarget.style.color = '#FFD700'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}>
              {s}
            </button>
          ))}
        </div>

        {/* Chat messages */}
        <div style={{
          flex: 1, overflowY: 'auto', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 16,
          padding: '24px', borderRadius: 20,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(12px)', minHeight: 350,
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-end' }}>
              {msg.role === 'ai' && (
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#D4A017,#FF8C00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 900, color: '#fff', flexShrink: 0, marginBottom: 2 }}>H</div>
              )}
              <div style={{
                maxWidth: '75%', padding: '13px 18px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                background: msg.role === 'user' ? 'linear-gradient(135deg,#D4A017,#FF8C00)' : 'rgba(255,255,255,0.1)',
                border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.12)' : 'none',
                backdropFilter: 'blur(8px)',
              }}>
                <p style={{ color: '#fff', fontSize: '.92rem', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-line' }}>{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#D4A017,#FF8C00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 900, color: '#fff', flexShrink: 0 }}>H</div>
              <div style={{ padding: '13px 20px', borderRadius: '4px 18px 18px 18px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4A017', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{
          display: 'flex', gap: 12, padding: '16px 16px', borderRadius: 20,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Hỏi về địa điểm, ẩm thực, lịch trình Hà Nội..."
            style={{
              flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: '.92rem',
              fontFamily: 'Inter, sans-serif', outline: 'none',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 22px', borderRadius: 12, border: 'none',
              background: loading || !input.trim() ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#D4A017,#FF8C00)',
              color: '#fff', fontWeight: 700, fontSize: '.9rem', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', flexShrink: 0,
              boxShadow: loading || !input.trim() ? 'none' : '0 4px 16px rgba(212,160,23,0.4)',
            }}>
            Gửi ✨
          </button>
        </div>

        <style>{`
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Planner;
