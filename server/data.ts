// ===== In-Memory DB for OmniReply Backend =====

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  lastMessage: string;
  lastMessageTime: string;
  channel: 'whatsapp' | 'instagram' | 'facebook' | 'linkedin' | 'phone' | 'email' | 'webchat';
  unreadCount: number;
  status: 'New Lead' | 'Hot Lead' | 'Payment' | 'Customer' | 'Closed - Won' | 'Closed - Lost';
  assignedTo: string | null;
  tags: string[];
  email?: string;
  phone?: string;
  company?: string;
}

export interface Message {
  id: string;
  contactId: string;
  content: string;
  timestamp: string;
  sender: 'contact' | 'agent' | 'system';
  type: 'text' | 'image' | 'file' | 'system';
  agentName?: string;
  read: boolean;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'business-messaging' | 'calls' | 'sms' | 'email' | 'live-chat';
  connected: boolean;
  popular?: boolean;
  beta?: boolean;
  color: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'paused';
  trigger: string;
  actions: number;
  lastRun: string;
  runs: number;
  successRate: number;
}

export interface AIAgent {
  id: string;
  name: string;
  emoji: string;
  description: string;
  status: 'active' | 'draft' | 'paused';
  channels: string[];
  conversations: number;
  resolution: number;
  handledCalls: boolean;
}

export interface CallLog {
  id: string;
  contactName: string;
  contactAvatar: string;
  avatarColor: string;
  direction: 'inbound' | 'outbound';
  status: 'completed' | 'missed' | 'voicemail' | 'in-progress';
  duration: string;
  timestamp: string;
  channel: string;
  agentName: string;
  recording: boolean;
}

// ===== CONTACTS =====
export let contacts: Contact[] = [
  {
    id: '1', name: 'Kara Finley', avatar: 'KF', avatarColor: '#F472B6',
    lastMessage: 'Hi Kara! 👋 How can I help you today?', lastMessageTime: 'Yesterday',
    channel: 'whatsapp', unreadCount: 0, status: 'Hot Lead', assignedTo: 'AI Sales Agent',
    tags: ['VIP'], email: 'kara@abcd.com', phone: '+1 555-0142', company: 'ABCD Company'
  },
  {
    id: '2', name: 'Lee Chen', avatar: 'LC', avatarColor: '#FBBF24',
    lastMessage: '↩ Thank you for the confirmation. Let...', lastMessageTime: 'Oct 8',
    channel: 'facebook', unreadCount: 0, status: 'New Lead', assignedTo: null,
    tags: [], email: 'lee@example.com', phone: '+1 555-0198'
  },
  {
    id: '3', name: 'Shanny Rodriguez', avatar: 'SR', avatarColor: '#34D399',
    lastMessage: '↩ I see. I think we can accommodate...', lastMessageTime: 'Oct 6',
    channel: 'instagram', unreadCount: 0, status: 'Customer', assignedTo: 'Fahmy',
    tags: ['Campaigns'], email: 'shanny@example.com'
  },
  {
    id: '4', name: 'Mohamed Hassan', avatar: 'MH', avatarColor: '#818CF8',
    lastMessage: '↩ Yes sure!', lastMessageTime: 'Sep 30',
    channel: 'whatsapp', unreadCount: 0, status: 'Payment', assignedTo: null,
    tags: [], email: 'mohamed@example.com', phone: '+919000371602'
  }
];

// ===== MESSAGES =====
export let messages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', contactId: '1', content: 'Could you share with me your email address and company name?', timestamp: 'Jun 18, 2025 10:23 AM', sender: 'agent', type: 'text', agentName: 'AI Sales Agent', read: true },
    { id: 'm2', contactId: '1', content: 'Sure, its kara@abcd.com. I\'m from ABCD company.', timestamp: 'Jun 18, 2025 10:25 AM', sender: 'contact', type: 'text', read: true },
    { id: 'm6', contactId: '1', content: 'Thank you for sharing, Kara. We\'ve got an available slot in 30 minutes. Would you be available?', timestamp: 'Jun 18, 2025 10:27 AM', sender: 'agent', type: 'text', agentName: 'You', read: true },
    { id: 'm7', contactId: '1', content: 'Yes, I am free.', timestamp: 'Jun 18, 2025 10:29 AM', sender: 'contact', type: 'text', read: true },
  ],
  '4': [
    { id: 'm8', contactId: '4', content: 'Hi, I need help.', timestamp: 'Sep 30, 2025 10:23 AM', sender: 'contact', type: 'text', read: true }
  ]
};

// ===== CALL LOGS =====
export let callLogs: CallLog[] = [
  { id: 'cl1', contactName: 'Kara Finley', contactAvatar: 'KF', avatarColor: '#F472B6', direction: 'inbound', status: 'completed', duration: '4:32', timestamp: '10 min ago', channel: 'WhatsApp', agentName: 'AI Sales Agent', recording: true },
];

// ===== DASHBOARD STATS =====
export let dashboardStats = {
  totalConversations: 2847,
  activeConversations: 124,
  resolvedToday: 89,
  avgResponseTime: '1.2m',
  totalLeads: 456,
  conversionRate: 23.5,
  channelBreakdown: [
    { channel: 'WhatsApp', count: 1234, percentage: 43 },
    { channel: 'Facebook', count: 567, percentage: 20 },
    { channel: 'Instagram', count: 432, percentage: 15 },
    { channel: 'LinkedIn', count: 289, percentage: 10 },
    { channel: 'Phone', count: 198, percentage: 7 },
    { channel: 'Other', count: 127, percentage: 5 },
  ],
  recentActivity: [
    { action: 'New lead captured', contact: 'Kara Finley', channel: 'WhatsApp', time: '2 min ago' },
  ],
  weeklyConversations: [
    { day: 'Mon', count: 145 },
    { day: 'Tue', count: 198 },
    { day: 'Wed', count: 167 },
    { day: 'Thu', count: 234 },
    { day: 'Fri', count: 189 },
    { day: 'Sat', count: 78 },
    { day: 'Sun', count: 56 },
  ]
};
