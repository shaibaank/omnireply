const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  getConversations: async () => {
    const res = await fetch(`${API_BASE_URL}/conversations`);
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return res.json();
  },
  
  getConversationMessages: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/conversations/${id}`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },
  
  sendMessage: async (id: string, text: string, channel: string) => {
    const res = await fetch(`${API_BASE_URL}/conversations/${id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, channel })
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  triggerAIReply: async (conversationId: string) => {
    const res = await fetch(`${API_BASE_URL}/ai/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId })
    });
    if (!res.ok) throw new Error('Failed to trigger AI reply');
    return res.json();
  },

  triggerInboundWhatsapp: async (phone: string, text: string) => {
    const res = await fetch(`${API_BASE_URL}/webhooks/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, text })
    });
    if (!res.ok) throw new Error('Failed to trigger webhook');
    return res.text();
  },

  makeOutboundCall: async (phone: string) => {
    const res = await fetch(`${API_BASE_URL}/calls/outbound`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    if (!res.ok) throw new Error('Failed to make outbound call');
    return res.json();
  },

  getAnalyticsSummary: async () => {
    const res = await fetch(`${API_BASE_URL}/analytics/summary`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  sendWhatsappOutbound: async (phone: string, text: string, name?: string) => {
    const res = await fetch(`${API_BASE_URL}/whatsapp/outbound`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, text, name })
    });
    if (!res.ok) throw new Error('Failed to send WhatsApp message');
    return res.json();
  }
};
