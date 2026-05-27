import React, { useState } from 'react';
import {
  Search, SlidersHorizontal, ChevronDown, ChevronRight,
  MoreVertical, Check, CheckCheck, Send, Smile, Paperclip,
  Image as ImageIcon, FileText, Phone, Play, X, User,
  ChevronLeft, Info, Eye, Clock, CheckSquare, MessageSquare, AlertCircle, RefreshCw, Bot
} from 'lucide-react';
import { Contact, Message, contacts as mockContacts, messages as mockMessages } from '../data/mockData';
import { api } from '../services/api';
import './InboxPage.css';

export default function InboxPage() {
  const [contactsList, setContactsList] = useState<Contact[]>(mockContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(mockContacts[0] ?? null);
  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [activeTab, setActiveTab] = useState<'chats' | 'calls'>('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  // Accordion states
  const [aiAgentsOpen, setAiAgentsOpen] = useState(true);
  const [lifecycleOpen, setLifecycleOpen] = useState(true);
  const [teamInboxOpen, setTeamInboxOpen] = useState(true);
  const [customInboxOpen, setCustomInboxOpen] = useState(true);

  // Active filter tab at bottom of Left Panel
  const [bottomFilter, setBottomFilter] = useState<'all' | 'by-me' | 'by-others'>('all');

  // Load initial contacts
  React.useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await api.getConversations();
        setContactsList(data);
        if (data.length > 0 && !selectedContact) {
          setSelectedContact(data[0]);
        }
      } catch (err) {
        console.error('Failed to load contacts', err);
        setContactsList(mockContacts);
        if (!selectedContact && mockContacts.length > 0) {
          setSelectedContact(mockContacts[0]);
        }
      }
    };
    loadContacts();
    // Poll for new contacts/messages in background
    const interval = setInterval(loadContacts, 3000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  // Load messages when contact selected
  React.useEffect(() => {
    if (!selectedContact) return;
    const loadMessages = async () => {
      try {
        const msgs = await api.getConversationMessages(selectedContact.id);
        setChatMessages(prev => ({ ...prev, [selectedContact.id]: msgs }));
      } catch (err) {
        console.error('Failed to load messages', err);
        const fallback = mockMessages[selectedContact.id] || [];
        setChatMessages(prev => ({ ...prev, [selectedContact.id]: fallback }));
      }
    };
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedContact?.id]);

  // Handle contact selection
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedContact) return;
    
    const text = messageInput;
    setMessageInput(''); // clear immediately

    try {
      const newMsg = await api.sendMessage(selectedContact.id, text, selectedContact.channel);
      setChatMessages(prev => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg]
      }));
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleAiReply = async () => {
    if (!selectedContact) return;
    try {
      const newMsg = await api.triggerAIReply(selectedContact.id);
      setChatMessages(prev => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg]
      }));
    } catch (err) {
      console.error('AI reply failed', err);
    }
  };

  const handleOutboundWhatsapp = async () => {
    const phone = window.prompt('WhatsApp number (E.164, e.g. +14155550123)');
    if (!phone) return;
    const text = window.prompt('Message to send');
    if (!text) return;
    const name = window.prompt('Contact name (optional)') || undefined;
    try {
      const result = await api.sendWhatsappOutbound(phone, text, name);
      setContactsList(prev => [result.contact, ...prev.filter(c => c.id !== result.contact.id)]);
      setSelectedContact(result.contact);
      setChatMessages(prev => ({
        ...prev,
        [result.contact.id]: [...(prev[result.contact.id] || []), result.message]
      }));
    } catch (err) {
      console.error('Outbound WhatsApp failed', err);
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return '#25D366';
      case 'facebook': return '#1877F2';
      case 'instagram': return '#E1306C';
      case 'linkedin': return '#0A66C2';
      case 'phone': return '#3B82F6';
      case 'email': return '#EA4335';
      default: return '#9CA3AF';
    }
  };

  const getChannelIconClass = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return 'ri-whatsapp-fill';
      case 'facebook': return 'ri-facebook-box-fill';
      case 'instagram': return 'ri-instagram-fill';
      case 'linkedin': return 'ri-linkedin-box-fill';
      default: return 'ri-chat-1-fill';
    }
  };

  // Filter contacts
  const filteredContacts = contactsList.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (c.lastMessage && c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (bottomFilter === 'by-me') {
      return matchesSearch && c.assignedTo === 'Fahmy';
    }
    if (bottomFilter === 'by-others') {
      return matchesSearch && c.assignedTo && c.assignedTo !== 'Fahmy';
    }
    return matchesSearch;
  });

  const currentMessages = selectedContact ? (chatMessages[selectedContact.id] || []) : [];

  if (!selectedContact) {
    return <div className="inbox-page-container flex items-center justify-center h-full text-gray-500">Loading inbox...</div>;
  }

  return (
    <div className="inbox-page-container">
      {/* LEFT PANEL */}
      <div className="inbox-left-panel">
        {/* Header */}
        <div className="inbox-left-header">
          <div className="inbox-title-container">
            <h2>Inbox</h2>
            <div className="header-icon-buttons">
              <button className="icon-btn"><Search size={18} /></button>
              <button className="icon-btn"><SlidersHorizontal size={18} /></button>
              <button className="icon-btn" onClick={handleOutboundWhatsapp} title="Send outbound WhatsApp">
                <Phone size={18} />
              </button>
            </div>
          </div>
          
          <div className="inbox-main-tabs">
            <button 
              className={`inbox-tab ${activeTab === 'chats' ? 'active' : ''}`}
              onClick={() => setActiveTab('chats')}
            >
              Chats
            </button>
            <button 
              className={`inbox-tab ${activeTab === 'calls' ? 'active' : ''}`}
              onClick={() => setActiveTab('calls')}
            >
              Calls
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="inbox-filter-bar">
          <div className="filter-dropdown">
            <span>All, Newest</span>
            <ChevronDown size={14} />
          </div>
          <div className="unreplied-toggle">
            <label className="switch-label">
              <input type="checkbox" />
              <span className="switch-slider"></span>
            </label>
            <span>Unreplied</span>
          </div>
        </div>

        {/* Scrollable contact lists & sections */}
        <div className="inbox-sidebar-scroll">
          <div className="contacts-list">
            {filteredContacts.slice(0, 4).map(contact => (
              <div 
                key={contact.id} 
                className={`contact-item-row ${selectedContact.id === contact.id ? 'selected' : ''}`}
                onClick={() => handleSelectContact(contact)}
              >
                <div className="avatar-wrapper">
                  <div className="contact-avatar-circle" style={{ backgroundColor: contact.avatarColor }}>
                    {contact.avatar}
                  </div>
                  <span className="channel-badge" style={{ backgroundColor: getChannelColor(contact.channel) }}>
                    <i className={getChannelIconClass(contact.channel)}></i>
                  </span>
                </div>
                <div className="contact-item-info">
                  <div className="contact-item-top">
                    <span className="contact-item-name">{contact.name}</span>
                    <span className="contact-item-time">{contact.lastMessageTime}</span>
                  </div>
                  <div className="contact-item-mid">
                    <span className="contact-item-msg">{contact.lastMessage}</span>
                  </div>
                  <div className="contact-item-bot">
                    <span className="tag tag-blue text-xs">{contact.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Agents Accordion */}
          <div className="sidebar-accordion">
            <div className="accordion-trigger" onClick={() => setAiAgentsOpen(!aiAgentsOpen)}>
              <div className="trigger-left">
                {aiAgentsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span>AI Agents</span>
              </div>
              <span className="accordion-badge">50</span>
            </div>
            {aiAgentsOpen && (
              <div className="accordion-content">
                <div className="sub-item-row active">
                  <Bot size={16} className="sub-item-icon" />
                  <span>AI Sales Agent</span>
                  <span className="count-tag">50</span>
                </div>
              </div>
            )}
          </div>

          {/* Lifecycle Accordion */}
          <div className="sidebar-accordion">
            <div className="accordion-trigger" onClick={() => setLifecycleOpen(!lifecycleOpen)}>
              <div className="trigger-left">
                {lifecycleOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span>Lifecycle</span>
              </div>
              <span className="accordion-badge">23</span>
            </div>
            {lifecycleOpen && (
              <div className="accordion-content">
                <div className="sub-item-row">
                  <span className="lifecycle-dot color-blue"></span>
                  <span>New Lead</span>
                  <span className="count-tag">13</span>
                </div>
                <div className="sub-item-row">
                  <span className="lifecycle-dot color-orange"></span>
                  <span>Hot Lead</span>
                  <span className="count-tag">2</span>
                </div>
                <div className="sub-item-row">
                  <span className="lifecycle-dot color-purple"></span>
                  <span>Payment</span>
                  <span className="count-tag">2</span>
                </div>
                <div className="sub-item-row">
                  <span className="lifecycle-dot color-green"></span>
                  <span>Customer</span>
                  <span className="count-tag">6</span>
                </div>
              </div>
            )}
          </div>

          {/* Team Inbox Accordion */}
          <div className="sidebar-accordion">
            <div className="accordion-trigger" onClick={() => setTeamInboxOpen(!teamInboxOpen)}>
              <div className="trigger-left">
                {teamInboxOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span>Team Inbox</span>
              </div>
              <span className="accordion-badge">+</span>
            </div>
            {teamInboxOpen && (
              <div className="accordion-content">
                <div className="sub-item-row">
                  <span>Sales APAC</span>
                  <span className="count-tag">1</span>
                </div>
                <div className="sub-item-row">
                  <span>Sales EMEA</span>
                  <span className="count-tag">0</span>
                </div>
                <div className="sub-item-row">
                  <span>Marketing APAC</span>
                  <span className="count-tag">1</span>
                </div>
                <div className="sub-item-row">
                  <span>Marketing EMEA</span>
                  <span className="count-tag">6</span>
                </div>
              </div>
            )}
          </div>

          {/* Custom Inbox Accordion */}
          <div className="sidebar-accordion">
            <div className="accordion-trigger" onClick={() => setCustomInboxOpen(!customInboxOpen)}>
              <div className="trigger-left">
                {customInboxOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span>Custom Inbox</span>
              </div>
              <span className="accordion-badge">+</span>
            </div>
            {customInboxOpen && (
              <div className="accordion-content">
                <div className="sub-item-row">
                  <span>Campaigns</span>
                  <span className="count-tag">12</span>
                </div>
                <div className="sub-item-row">
                  <span>VIP Clients</span>
                  <span className="count-tag">5</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom selector tabs */}
        <div className="inbox-sidebar-footer">
          <div className="footer-filter-tabs">
            <button 
              className={`footer-filter-tab ${bottomFilter === 'all' ? 'active' : ''}`}
              onClick={() => setBottomFilter('all')}
            >
              All
            </button>
            <button 
              className={`footer-filter-tab ${bottomFilter === 'by-me' ? 'active' : ''}`}
              onClick={() => setBottomFilter('by-me')}
            >
              By Me
            </button>
            <button 
              className={`footer-filter-tab ${bottomFilter === 'by-others' ? 'active' : ''}`}
              onClick={() => setBottomFilter('by-others')}
            >
              By Others
            </button>
          </div>
        </div>
      </div>

      {/* MIDDLE PANEL (Chat Area) */}
      <div className="inbox-middle-panel">
        {/* Top Header */}
        <div className="chat-area-header">
          <div className="header-contact-details">
            <div className="contact-avatar-circle" style={{ backgroundColor: selectedContact.avatarColor }}>
              {selectedContact.avatar}
            </div>
            <div className="contact-header-text">
              <div className="contact-name-row">
                <h3>{selectedContact.name}</h3>
                <span className="tag tag-yellow text-xs">{selectedContact.status}</span>
                <ChevronRight size={14} className="breadcrumb-arrow" />
              </div>
              <span className="assignee-text">
                Assigned to <strong>{selectedContact.assignedTo || 'Unassigned'}</strong>
              </span>
            </div>
          </div>

          <div className="chat-header-actions">
            <div className="assignee-dropdown-btn">
              <span>{selectedContact.assignedTo || 'Assign Agent'}</span>
              <ChevronDown size={14} />
            </div>
            
            <button className="icon-btn"><Search size={18} /></button>
            <button className="icon-btn"><Clock size={18} /></button>
            <button className="icon-btn"><Phone size={18} /></button>
            <button className="icon-btn" onClick={() => setRightPanelOpen(!rightPanelOpen)}>
              <Info size={18} />
            </button>
            
            <button className="btn btn-secondary btn-sm close-conv-btn">
              <Check size={14} />
              <span>Close</span>
            </button>
            
            <button className="icon-btn"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Message History */}
        <div className="chat-messages-scroll">
          <div className="chat-messages-inner">
            <div className="date-separator">
              <span>Jun 18, 2025</span>
            </div>

            {currentMessages.map(msg => {
              if (msg.type === 'system') {
                return (
                  <div key={msg.id} className="system-message-row">
                    <span>{msg.content}</span>
                  </div>
                );
              }

              const isMe = msg.sender === 'agent';
              return (
                <div key={msg.id} className={`message-bubble-wrapper ${isMe ? 'outgoing' : 'incoming'}`}>
                  {!isMe && (
                    <div className="msg-avatar" style={{ backgroundColor: selectedContact.avatarColor }}>
                      {selectedContact.avatar}
                    </div>
                  )}
                  <div className="message-bubble-body">
                    {isMe && <span className="bubble-agent-name">{msg.agentName}</span>}
                    <div className="message-bubble-content">
                      <p>{msg.content}</p>
                    </div>
                    <div className="message-bubble-footer">
                      <span className="bubble-time">{msg.timestamp}</span>
                      {isMe && <CheckCheck size={14} className="read-receipt-check" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Composer */}
        <form className="chat-composer" onSubmit={handleSendMessage}>
          <div className="composer-top-bar">
            <div className="composer-channel-selector">
              <span className="channel-dot" style={{ backgroundColor: getChannelColor(selectedContact.channel) }}></span>
              <span className="channel-name-txt">{selectedContact.channel === 'whatsapp' ? 'WhatsApp' : 'Inbox'}</span>
              <ChevronDown size={14} />
            </div>

            <button type="button" className="ai-assist-spark-btn" onClick={handleAiReply}>
              <Bot size={16} />
              <span>AI Assist</span>
            </button>
          </div>

          <div className="composer-input-area">
            <textarea 
              placeholder="Use '/' for snippets, '$' for variables, ':' for emoji"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
          </div>

          <div className="composer-actions-bar">
            <div className="composer-toolbar-left">
              <button type="button" className="toolbar-btn"><Smile size={18} /></button>
              <button type="button" className="toolbar-btn"><Paperclip size={18} /></button>
              <button type="button" className="toolbar-btn"><ImageIcon size={18} /></button>
              <button type="button" className="toolbar-btn"><FileText size={18} /></button>
              <button type="button" className="toolbar-btn"><i className="ri-code-s-slash-line" style={{ fontSize: 18 }}></i></button>
              <button type="button" className="toolbar-btn"><i className="ri-whatsapp-line" style={{ fontSize: 18 }}></i></button>
            </div>

            <div className="composer-toolbar-right">
              <button type="submit" className="btn btn-primary send-msg-btn">
                <Send size={14} />
                <span>Send</span>
              </button>
            </div>
          </div>

          <div className="composer-bottom-links">
            <button type="button" className="composer-link-action">
              <i className="ri-chat-new-line"></i> Add comment
            </button>
            <button type="button" className="composer-link-action right-aligned-link">
              <RefreshCw size={14} /> Summarize
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT PANEL (Contact Info) */}
      {rightPanelOpen && (
        <div className="inbox-right-panel">
          <div className="right-panel-header">
            <h3>Contact Details</h3>
            <button className="icon-btn" onClick={() => setRightPanelOpen(false)}><X size={18} /></button>
          </div>

          <div className="right-panel-scroll">
            <div className="right-panel-profile-card">
              <div className="large-profile-avatar" style={{ backgroundColor: selectedContact.avatarColor }}>
                {selectedContact.avatar}
              </div>
              <h4>{selectedContact.name}</h4>
              <span className="profile-lifecycle-pill">{selectedContact.status}</span>
            </div>

            <div className="profile-quick-actions">
              <button className="action-circle-btn"><Phone size={18} /></button>
              <button className="action-circle-btn"><i className="ri-mail-line" style={{ fontSize: 18 }}></i></button>
              <button className="action-circle-btn"><i className="ri-message-3-line" style={{ fontSize: 18 }}></i></button>
              <button className="action-circle-btn"><MoreVertical size={18} /></button>
            </div>

            <div className="profile-info-section">
              <div className="section-title">
                <h5>Contact Info</h5>
                <button className="edit-link-btn">Edit</button>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-val">{selectedContact.email || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-val">{selectedContact.phone || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Company</span>
                  <span className="info-val">{selectedContact.company || '-'}</span>
                </div>
              </div>
            </div>

            <div className="profile-info-section">
              <div className="section-title">
                <h5>Tags</h5>
              </div>
              <div className="tags-container-flow">
                {selectedContact.tags.map(tag => (
                  <span key={tag} className="tag tag-blue">{tag}</span>
                ))}
                <button className="add-tag-btn">+ Add Tag</button>
              </div>
            </div>

            <div className="profile-info-section">
              <div className="section-title">
                <h5>Notes</h5>
              </div>
              <div className="notes-list-box">
                <div className="empty-notes">
                  <FileText size={24} />
                  <span>No notes created for this contact.</span>
                </div>
                <button className="btn btn-secondary btn-sm w-full">+ Add Note</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
