// ===== Mock Data for OmniReply =====

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

export interface KBDocument {
  id: string;
  title: string;
  type: 'pdf' | 'url' | 'text' | 'faq';
  status: 'trained' | 'training' | 'pending' | 'error';
  lastUpdated: string;
  chunks: number;
  size: string;
}

// ===== CONTACTS =====
export const contacts: Contact[] = [
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
    tags: [], email: 'mohamed@example.com', phone: '+971 55-123-4567'
  },
  {
    id: '5', name: 'Lisa Wang', avatar: 'LW', avatarColor: '#F87171',
    lastMessage: '✅ Can you arrange that for me?', lastMessageTime: 'Sep 26',
    channel: 'whatsapp', unreadCount: 0, status: 'New Lead', assignedTo: null,
    tags: []
  },
  {
    id: '6', name: 'Ali Mahmoud', avatar: 'AM', avatarColor: '#FBBF24',
    lastMessage: '↩ Hello, just following up on our convo...', lastMessageTime: 'Sep 8',
    channel: 'linkedin', unreadCount: 0, status: 'New Lead', assignedTo: null,
    tags: []
  },
  {
    id: '7', name: 'Vicky Santos', avatar: 'VS', avatarColor: '#60A5FA',
    lastMessage: 'Yes, that would be great. Can you sh...', lastMessageTime: 'Aug 28',
    channel: 'whatsapp', unreadCount: 0, status: 'New Lead', assignedTo: null,
    tags: []
  },
  {
    id: '8', name: 'Ava Thompson', avatar: 'AT', avatarColor: '#A78BFA',
    lastMessage: 'I\'d like to learn more about your plans', lastMessageTime: 'Aug 9',
    channel: 'webchat', unreadCount: 2, status: 'New Lead', assignedTo: null,
    tags: []
  },
  {
    id: '9', name: 'James Park', avatar: 'JP', avatarColor: '#34D399',
    lastMessage: 'Thanks for the quick response!', lastMessageTime: 'Aug 5',
    channel: 'email', unreadCount: 0, status: 'Customer', assignedTo: 'Fahmy',
    tags: ['VIP']
  },
  {
    id: '10', name: 'Sofia Martinez', avatar: 'SM', avatarColor: '#FB923C',
    lastMessage: 'When is the next available slot?', lastMessageTime: 'Jul 30',
    channel: 'whatsapp', unreadCount: 1, status: 'Hot Lead', assignedTo: 'AI Sales Agent',
    tags: []
  }
];

// ===== MESSAGES =====
export const messages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', contactId: '1', content: 'Could you share with me your email address and company name?', timestamp: 'Jun 18, 2025 10:23 AM', sender: 'agent', type: 'text', agentName: 'AI Sales Agent', read: true },
    { id: 'm2', contactId: '1', content: 'Sure, its kara@abcd.com. I\'m from ABCD company.', timestamp: 'Jun 18, 2025 10:25 AM', sender: 'contact', type: 'text', read: true },
    { id: 'm3', contactId: '1', content: 'Contact fields updated (Email and Company)', timestamp: 'Jun 18, 2025 10:25 AM', sender: 'system', type: 'system', read: true },
    { id: 'm4', contactId: '1', content: 'Lifecycle Stage New Lead updated to Hot Lead by AI Sales Agent', timestamp: 'Jun 18, 2025 10:25 AM', sender: 'system', type: 'system', read: true },
    { id: 'm5', contactId: '1', content: 'Contact Assigned to You', timestamp: 'Jun 18, 2025 10:26 AM', sender: 'system', type: 'system', read: true },
    { id: 'm6', contactId: '1', content: 'Thank you for sharing, Kara. We\'ve got an available slot in 30 minutes. Would you be available?', timestamp: 'Jun 18, 2025 10:27 AM', sender: 'agent', type: 'text', agentName: 'You', read: true },
    { id: 'm7', contactId: '1', content: 'Yes, I am free.', timestamp: 'Jun 18, 2025 10:29 AM', sender: 'contact', type: 'text', read: true },
    { id: 'm8', contactId: '1', content: '@Sales team - user has confirmed the appointment.', timestamp: 'Jun 18, 2025 10:30 AM', sender: 'agent', type: 'text', agentName: 'You', read: true },
  ],
  '2': [
    { id: 'm9', contactId: '2', content: 'Hey there, I am interested in respond.io. How can I learn more?', timestamp: 'Oct 8, 2025 2:15 PM', sender: 'contact', type: 'text', read: true },
    { id: 'm10', contactId: '2', content: 'Thank you for the confirmation. Let me set up a quick overview for you.', timestamp: 'Oct 8, 2025 2:20 PM', sender: 'agent', type: 'text', agentName: 'AI Sales Agent', read: true },
  ]
};

// ===== CHANNELS =====
export const channels: Channel[] = [
  { id: 'ch1', name: 'WhatsApp Business Platform (API)', description: 'Connect WhatsApp Business API via Facebook to enable...', icon: 'whatsapp', category: 'business-messaging', connected: true, popular: true, color: '#25D366' },
  { id: 'ch2', name: 'TikTok', description: 'Connect TikTok Business...', icon: 'tiktok', category: 'business-messaging', connected: false, beta: true, color: '#000000' },
  { id: 'ch3', name: 'Facebook Messenger', description: 'Connect Facebook to engage customers on...', icon: 'facebook', category: 'business-messaging', connected: false, popular: true, color: '#0084FF' },
  { id: 'ch4', name: 'Instagram', description: 'Connect Instagram to reply to private messages and build strong brand...', icon: 'instagram', category: 'business-messaging', connected: false, color: '#E4405F' },
  { id: 'ch5', name: 'Telegram', description: 'Connect Telegram Bot to provide real-time support when customers reach...', icon: 'telegram', category: 'business-messaging', connected: false, color: '#0088CC' },
  { id: 'ch6', name: 'LINE Official', description: 'Account to provide timely support to your...', icon: 'line', category: 'business-messaging', connected: false, color: '#00B900' },
  { id: 'ch7', name: 'WeChat', description: 'Connect WeChat Service Account for customer engagement, brand...', icon: 'wechat', category: 'business-messaging', connected: false, color: '#07C160' },
  { id: 'ch8', name: 'WhatsApp Cloud API', description: 'Connect WhatsApp Cloud API and manage your messages easily in one...', icon: 'whatsapp', category: 'business-messaging', connected: false, color: '#25D366' },
  { id: 'ch9', name: 'Custom Channel', description: 'Connect any channels not natively available in respond.io to expand yo...', icon: 'custom', category: 'business-messaging', connected: false, color: '#8B5CF6' },
  { id: 'ch10', name: 'LinkedIn', description: 'Connect LinkedIn to manage professional messages and build B2B relationships...', icon: 'linkedin', category: 'business-messaging', connected: false, color: '#0A66C2' },
  { id: 'ch11', name: 'Twilio Voice', description: 'Enable AI-powered voice call handling through Twilio integration...', icon: 'phone', category: 'calls', connected: false, color: '#F22F46' },
  { id: 'ch12', name: 'Gmail', description: 'Connect Gmail to manage email conversations in your unified inbox...', icon: 'email', category: 'email', connected: false, color: '#EA4335' },
  { id: 'ch13', name: 'SMS (Twilio)', description: 'Send and receive SMS messages through Twilio integration...', icon: 'sms', category: 'sms', connected: false, color: '#F22F46' },
  { id: 'ch14', name: 'Live Chat Widget', description: 'Add a live chat widget to your website for real-time customer support...', icon: 'webchat', category: 'live-chat', connected: false, color: '#3B82F6' },
];

// ===== WORKFLOWS =====
export const workflows: Workflow[] = [
  { id: 'wf1', name: 'Welcome Message', description: 'Send an automated welcome message when a new contact messages for the first time', status: 'active', trigger: 'New Conversation', actions: 3, lastRun: '2 min ago', runs: 1247, successRate: 99.2 },
  { id: 'wf2', name: 'Lead Qualification', description: 'Qualify incoming leads by asking a series of questions and routing to the right team', status: 'active', trigger: 'New Contact', actions: 7, lastRun: '15 min ago', runs: 834, successRate: 96.5 },
  { id: 'wf3', name: 'Away Message', description: 'Auto-reply outside business hours with expected response time', status: 'active', trigger: 'Message Received', actions: 2, lastRun: '1 hour ago', runs: 2156, successRate: 100 },
  { id: 'wf4', name: 'Appointment Reminder', description: 'Send reminder messages 24h and 1h before scheduled appointments', status: 'active', trigger: 'Scheduled', actions: 4, lastRun: '3 hours ago', runs: 567, successRate: 98.1 },
  { id: 'wf5', name: 'CSAT Survey', description: 'Send customer satisfaction survey after conversation is closed', status: 'draft', trigger: 'Conversation Closed', actions: 5, lastRun: 'Never', runs: 0, successRate: 0 },
  { id: 'wf6', name: 'Escalation Alert', description: 'Notify team lead when a conversation has been unassigned for more than 5 minutes', status: 'active', trigger: 'Timer', actions: 3, lastRun: '30 min ago', runs: 412, successRate: 97.8 },
  { id: 'wf7', name: 'Lead Scoring Update', description: 'Update lead score based on engagement and conversation outcomes', status: 'paused', trigger: 'Conversation Updated', actions: 6, lastRun: '2 days ago', runs: 189, successRate: 94.2 },
  { id: 'wf8', name: 'CRM Sync', description: 'Automatically sync contact data and conversation history to connected CRM', status: 'active', trigger: 'Contact Updated', actions: 4, lastRun: '5 min ago', runs: 3421, successRate: 99.7 },
];

// ===== AI AGENTS =====
export const aiAgents: AIAgent[] = [
  { id: 'ag1', name: 'Sales Agent', emoji: '🤖', description: 'Handles product inquiries, qualifies leads, and books appointments', status: 'active', channels: ['WhatsApp', 'Facebook', 'Instagram', 'Web Chat'], conversations: 1247, resolution: 87, handledCalls: true },
  { id: 'ag2', name: 'Support Agent', emoji: '🛠️', description: 'Provides technical support and troubleshooting guidance', status: 'active', channels: ['WhatsApp', 'Email', 'Web Chat'], conversations: 856, resolution: 92, handledCalls: false },
  { id: 'ag3', name: 'Booking Agent', emoji: '📅', description: 'Manages appointment scheduling and calendar coordination', status: 'active', channels: ['WhatsApp', 'Phone'], conversations: 432, resolution: 95, handledCalls: true },
  { id: 'ag4', name: 'FAQ Bot', emoji: '❓', description: 'Answers frequently asked questions from the knowledge base', status: 'draft', channels: ['All'], conversations: 0, resolution: 0, handledCalls: false },
];

// ===== CALL LOGS =====
export const callLogs: CallLog[] = [
  { id: 'cl1', contactName: 'Kara Finley', contactAvatar: 'KF', avatarColor: '#F472B6', direction: 'inbound', status: 'completed', duration: '4:32', timestamp: '10 min ago', channel: 'WhatsApp', agentName: 'AI Sales Agent', recording: true },
  { id: 'cl2', contactName: 'James Park', contactAvatar: 'JP', avatarColor: '#34D399', direction: 'outbound', status: 'completed', duration: '2:15', timestamp: '25 min ago', channel: 'Twilio', agentName: 'Booking Agent', recording: true },
  { id: 'cl3', contactName: 'Sofia Martinez', contactAvatar: 'SM', avatarColor: '#FB923C', direction: 'inbound', status: 'missed', duration: '0:00', timestamp: '1 hour ago', channel: 'WhatsApp', agentName: '-', recording: false },
  { id: 'cl4', contactName: 'Ali Mahmoud', contactAvatar: 'AM', avatarColor: '#FBBF24', direction: 'inbound', status: 'voicemail', duration: '0:45', timestamp: '2 hours ago', channel: 'Twilio', agentName: 'AI Sales Agent', recording: true },
  { id: 'cl5', contactName: 'Lee Chen', contactAvatar: 'LC', avatarColor: '#FBBF24', direction: 'outbound', status: 'completed', duration: '8:12', timestamp: '3 hours ago', channel: 'Twilio', agentName: 'Support Agent', recording: true },
  { id: 'cl6', contactName: 'Vicky Santos', contactAvatar: 'VS', avatarColor: '#60A5FA', direction: 'inbound', status: 'completed', duration: '3:47', timestamp: '5 hours ago', channel: 'WhatsApp', agentName: 'Booking Agent', recording: false },
  { id: 'cl7', contactName: 'Ava Thompson', contactAvatar: 'AT', avatarColor: '#A78BFA', direction: 'inbound', status: 'in-progress', duration: '1:23', timestamp: 'Now', channel: 'Twilio', agentName: 'AI Sales Agent', recording: true },
  { id: 'cl8', contactName: 'Mohamed Hassan', contactAvatar: 'MH', avatarColor: '#818CF8', direction: 'outbound', status: 'completed', duration: '5:56', timestamp: 'Yesterday', channel: 'Twilio', agentName: 'Support Agent', recording: true },
];

// ===== KNOWLEDGE BASE =====
export const kbDocuments: KBDocument[] = [
  { id: 'kb1', title: 'Product Catalog 2025', type: 'pdf', status: 'trained', lastUpdated: '2 days ago', chunks: 234, size: '4.2 MB' },
  { id: 'kb2', title: 'FAQ - General Questions', type: 'faq', status: 'trained', lastUpdated: '1 week ago', chunks: 89, size: '156 KB' },
  { id: 'kb3', title: 'Pricing Page', type: 'url', status: 'trained', lastUpdated: '3 days ago', chunks: 45, size: '89 KB' },
  { id: 'kb4', title: 'Return Policy', type: 'text', status: 'trained', lastUpdated: '1 month ago', chunks: 12, size: '24 KB' },
  { id: 'kb5', title: 'Technical Documentation', type: 'pdf', status: 'training', lastUpdated: '1 hour ago', chunks: 0, size: '12.8 MB' },
  { id: 'kb6', title: 'Onboarding Guide', type: 'pdf', status: 'pending', lastUpdated: 'Just now', chunks: 0, size: '3.1 MB' },
  { id: 'kb7', title: 'Company Blog Posts', type: 'url', status: 'trained', lastUpdated: '5 days ago', chunks: 178, size: '567 KB' },
  { id: 'kb8', title: 'Shipping Information', type: 'text', status: 'error', lastUpdated: '2 hours ago', chunks: 0, size: '8 KB' },
];

// ===== DASHBOARD STATS =====
export const dashboardStats = {
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
    { action: 'Appointment booked', contact: 'Lee Chen', channel: 'Facebook', time: '15 min ago' },
    { action: 'Conversation resolved', contact: 'Shanny Rodriguez', channel: 'Instagram', time: '32 min ago' },
    { action: 'Lead qualified', contact: 'Mohamed Hassan', channel: 'WhatsApp', time: '1 hour ago' },
    { action: 'CSAT survey sent', contact: 'Lisa Wang', channel: 'WhatsApp', time: '2 hours ago' },
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
