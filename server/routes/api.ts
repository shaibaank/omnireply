import { Router } from 'express';
import twilio from 'twilio';
import axios from 'axios';
import {
  contacts,
  messages,
  callLogs,
  dashboardStats,
  Contact,
  Message
} from '../data';

const router = Router();

const normalizePhone = (raw: string) => {
  const cleaned = String(raw || '').trim().replace('whatsapp:', '');
  if (!cleaned) return '';
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
};

// Retrieve contacts
router.get('/conversations', (req, res) => {
  res.json(contacts);
});

// Retrieve messages for a contact
router.get('/conversations/:id', (req, res) => {
  const { id } = req.params;
  const contactMessages = messages[id] || [];
  res.json(contactMessages);
});

// Send a message
router.post('/conversations/:id/messages', async (req, res) => {
  const { id } = req.params;
  const { text, channel } = req.body;

  const contact = contacts.find(c => c.id === id);
  if (!contact) return res.status(404).json({ error: 'Contact not found' });

  const newMessage: Message = {
    id: `m-${Date.now()}`,
    contactId: id,
    content: text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sender: 'agent',
    type: 'text',
    agentName: 'You',
    read: true
  };

  if (!messages[id]) {
    messages[id] = [];
  }
  messages[id].push(newMessage);
  contact.lastMessage = text;
  contact.lastMessageTime = 'Just now';

  // Integration: Twilio WhatsApp
  if (channel === 'whatsapp' && contact.phone && process.env.TWILIO_ACCOUNT_SID) {
    try {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: text,
        from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
        to: `whatsapp:${normalizePhone(contact.phone)}` // Must be verified in sandbox
      });
      console.log('Twilio WhatsApp sent successfully');
    } catch (err) {
      console.error('Twilio Error:', err);
    }
  }

  res.json(newMessage);
});

// Outbound WhatsApp (start a new chat)
router.post('/whatsapp/outbound', async (req, res) => {
  const { phone, text, name } = req.body;
  if (!phone || !text) return res.status(400).json({ error: 'Phone and text required' });
  if (!process.env.TWILIO_ACCOUNT_SID) return res.status(500).json({ error: 'Twilio not configured' });

  const normalized = normalizePhone(phone);
  if (!normalized) return res.status(400).json({ error: 'Invalid phone' });

  let contact = contacts.find(c => c.phone === normalized);
  if (!contact) {
    contact = {
      id: `c-${Date.now()}`,
      name: name || `WhatsApp ${normalized.slice(-4)}`,
      avatar: (name || 'W').charAt(0).toUpperCase(),
      avatarColor: '#25D366',
      lastMessage: text,
      lastMessageTime: 'Just now',
      channel: 'whatsapp',
      unreadCount: 0,
      status: 'New Lead',
      assignedTo: null,
      tags: ['Outbound'],
      phone: normalized
    };
    contacts.unshift(contact);
  } else {
    contact.lastMessage = text;
    contact.lastMessageTime = 'Just now';
  }

  const outboundMessage: Message = {
    id: `m-${Date.now()}`,
    contactId: contact.id,
    content: text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sender: 'agent',
    type: 'text',
    agentName: 'You',
    read: true
  };

  if (!messages[contact.id]) messages[contact.id] = [];
  messages[contact.id].push(outboundMessage);

  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: text,
      from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
      to: `whatsapp:${normalized}`
    });
  } catch (err) {
    console.error('Twilio Error:', err);
    return res.status(500).json({ error: 'Failed to send WhatsApp message' });
  }

  res.json({ contact, message: outboundMessage });
});

// Trigger AI Reply
router.post('/ai/reply', async (req, res) => {
  const { conversationId } = req.body;
  
  if (!messages[conversationId]) {
    return res.status(404).json({ error: 'No messages found' });
  }

  const thread = messages[conversationId];
  const lastMessage = thread[thread.length - 1].content;

  try {
    // Integration: OpenRouter
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful customer support AI for OmniReply. Keep responses very brief." },
        { role: "user", content: lastMessage }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const aiText = response.data.choices[0].message.content;

    const aiMessage: Message = {
      id: `m-ai-${Date.now()}`,
      contactId: conversationId,
      content: `${aiText} [AI stub with provider swap-ready]`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'agent',
      type: 'text',
      agentName: 'AI Sales Agent',
      read: true
    };

    messages[conversationId].push(aiMessage);
    
    const contact = contacts.find(c => c.id === conversationId);
    if (contact) {
      contact.lastMessage = aiText;
      contact.lastMessageTime = 'Just now';
    }

    res.json(aiMessage);
  } catch (err) {
    console.error('OpenRouter Error:', err);
    res.status(500).json({ error: 'AI failed to reply' });
  }
});

// Twilio Webhook / Inbound WhatsApp Simulation
router.post('/webhooks/whatsapp', (req, res) => {
  // Twilio sends data like Body, From, To
  const body = req.body.Body || req.body.text || "Hello from WhatsApp!";
  const from = req.body.From || req.body.phone || "+919000371602"; 
  
  // Clean phone string if it has whatsapp: prefix
  const cleanedFrom = from.replace('whatsapp:', '');

  let contact = contacts.find(c => c.phone === cleanedFrom);
  
  if (!contact) {
    contact = {
      id: `c-${Date.now()}`,
      name: `User ${cleanedFrom.slice(-4)}`,
      avatar: 'U',
      avatarColor: '#10B981',
      lastMessage: body,
      lastMessageTime: 'Just now',
      channel: 'whatsapp',
      unreadCount: 1,
      status: 'New Lead',
      assignedTo: null,
      tags: [],
      phone: cleanedFrom
    };
    contacts.unshift(contact);
  } else {
    contact.lastMessage = body;
    contact.lastMessageTime = 'Just now';
    contact.unreadCount += 1;
  }

  if (!messages[contact.id]) {
    messages[contact.id] = [];
  }

  const inboundMessage: Message = {
    id: `m-${Date.now()}`,
    contactId: contact.id,
    content: body,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sender: 'contact',
    type: 'text',
    read: false
  };

  messages[contact.id].push(inboundMessage);

  res.status(200).send('<Response></Response>'); // Twilio expects TwiML
});

// Outbound Call (VAPI)
router.post('/calls/outbound', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });
  if (!process.env.VAPI_PRIVATE_KEY) {
    return res.status(500).json({ error: 'Missing VAPI_PRIVATE_KEY' });
  }
  if (!process.env.VAPI_ASSISTANT_ID) {
    return res.status(500).json({ error: 'Missing VAPI_ASSISTANT_ID' });
  }

  try {
    const response = await axios.post('https://api.vapi.ai/call/phone', {
      phoneNumber: {
        twilioPhoneNumber: process.env.VAPI_TWILIO_NUMBER || "+14155238886"
      },
      customer: {
        number: phone
      },
      assistantId: process.env.VAPI_ASSISTANT_ID
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Add to mock call logs
    callLogs.unshift({
      id: response.data.id || `cl-${Date.now()}`,
      contactName: `Outbound ${phone}`,
      contactAvatar: 'O',
      avatarColor: '#3B82F6',
      direction: 'outbound',
      status: 'in-progress',
      duration: '0:00',
      timestamp: 'Just now',
      channel: 'VAPI',
      agentName: 'AI Voice Agent',
      recording: false
    });

    res.json(response.data);
  } catch (err: any) {
    console.error('VAPI Error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to initiate call', details: err?.response?.data || err.message });
  }
});

// Analytics
router.get('/analytics/summary', (req, res) => {
  res.json(dashboardStats);
});

// Capture Lead
router.post('/leads/capture', (req, res) => {
  const { name, email, phone } = req.body;
  const newContact: Contact = {
    id: `c-${Date.now()}`,
    name: name || 'New Lead',
    avatar: name ? name.charAt(0) : 'L',
    avatarColor: '#8B5CF6',
    lastMessage: 'Captured via web form',
    lastMessageTime: 'Just now',
    channel: 'webchat',
    unreadCount: 0,
    status: 'New Lead',
    assignedTo: null,
    tags: ['Web Lead'],
    email,
    phone
  };
  contacts.unshift(newContact);
  res.json(newContact);
});

// Booking Slots
router.post('/booking/slots', (req, res) => {
  res.json([
    { id: 1, time: '10:00 AM', date: 'Tomorrow' },
    { id: 2, time: '02:00 PM', date: 'Tomorrow' },
    { id: 3, time: '11:00 AM', date: 'Next Friday' }
  ]);
});

// Booking Confirm
router.post('/booking/confirm', (req, res) => {
  const { conversationId, slotId } = req.body;
  if (!messages[conversationId]) messages[conversationId] = [];
  
  messages[conversationId].push({
    id: `m-sys-${Date.now()}`,
    contactId: conversationId,
    content: `System: Meeting booked successfully (Slot ID: ${slotId})`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sender: 'system',
    type: 'system',
    read: true
  });
  
  res.json({ success: true });
});

export default router;
