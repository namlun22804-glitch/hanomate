import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// AI endpoints
export const chatWithAI = async (message, history = []) => {
  const { data } = await api.post('/ai/chat', { message, history });
  return data;
};

export const generateItinerary = async (params) => {
  const { data } = await api.post('/ai/itinerary', params);
  return data;
};

export const checkPrice = async (query) => {
  const { data } = await api.post('/ai/price-check', { query });
  return data;
};

export const getSuggestions = async (type = 'all', limit = 6) => {
  const { data } = await api.get(`/ai/suggest?type=${type}&limit=${limit}`);
  return data;
};

// Streaming: returns an EventSource-like fetch stream
export const streamChat = async (message, history = [], onChunk, onDone, onError) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') { onDone?.(); return; }
          try {
            const parsed = JSON.parse(data);
            if (parsed.chunk) onChunk?.(parsed.chunk);
            if (parsed.error) onError?.(parsed.error);
          } catch (_) {}
        }
      }
    }
    onDone?.();
  } catch (err) {
    onError?.(err.message);
  }
};

// Price reports
export const submitPriceReport = async (reportData) => {
  const { data } = await api.post('/reports', reportData);
  return data;
};

export const getReports = async () => {
  const { data } = await api.get('/reports');
  return data;
};

export default api;
