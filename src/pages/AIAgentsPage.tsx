import React, { useState } from 'react';
import {
  Bot, Plus, Play, Pause, Edit, Trash, ChevronLeft, Sparkles,
  Phone, Globe, RefreshCw, Smile, Image as ImageIcon, FileText, Check, MoreVertical
} from 'lucide-react';
import { aiAgents as initialAgents, Contact } from '../data/mockData';
import './AIAgentsPage.css';

interface Message {
  sender: 'user' | 'agent';
  content: string;
  time: string;
}

export default function AIAgentsPage() {
  const [agentsList, setAgentsList] = useState(initialAgents);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'fields'>('chat');
  const [testMessages, setTestMessages] = useState<Message[]>([
    { sender: 'agent', content: 'Hi there! I am your AI Sales Agent. How can I assist you with OmniReply today? 🤖', time: '10:23 AM' }
  ]);
  const [testInput, setTestInput] = useState('');
  
  // Toggles and Form States
  const [agentName, setAgentName] = useState('Sales Agent');
  const [agentEmoji, setAgentEmoji] = useState('🤖');
  const [agentInstructions, setAgentInstructions] = useState(`# CONTEXT
- You're speaking to someone exploring our products.
- They may be new, returning, or just browsing.
- Your goal is to guide them to the right product or plan.

# ROLE & COMMUNICATION STYLE
- You're a warm, helpful, and relaxed sales guide—never pushy.
- Ask one question at a time. Keep replies short, clear, and encouraging.`);
  
  const [closeConversations, setCloseConversations] = useState(true);
  const [addComments, setAddComments] = useState(true);
  const [handleCalls, setHandleCalls] = useState(true);
  const [callContext, setCallContext] = useState(`# CALL CONTEXT
You are handling an inbound voice call.
This call is informational only and does not support bookings or confirmations.

# AGENT ROLE
You help answer general questions about cars, models, and features.
You do not handle scheduling, reservations, or confirmations.`);

  const handleToggleStatus = (id: string) => {
    setAgentsList(prev => prev.map(ag => {
      if (ag.id === id) {
        return { ...ag, status: ag.status === 'active' ? 'paused' : 'active' };
      }
      return ag;
    }));
  };

  const handleSendTestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;

    const userMsg: Message = { sender: 'user', content: testInput, time: 'Now' };
    setTestMessages(prev => [...prev, userMsg]);
    setTestInput('');

    // Simulated Agent thinking response
    setTimeout(() => {
      let reply = "I understand you're asking about our multi-channel platform. We support WhatsApp, Facebook, Instagram, LinkedIn, and Voice Calls automation natively! 🚀";
      if (testInput.toLowerCase().includes('price') || testInput.toLowerCase().includes('cost')) {
        reply = "Our plans start at just $49/month, including WhatsApp API integration and 1 custom AI agent. Would you like to schedule a quick 10-minute demo to see it in action?";
      } else if (testInput.toLowerCase().includes('call') || testInput.toLowerCase().includes('phone')) {
        reply = "Yes! I can handle voice calls directly. Simply connect a Twilio or VoIP channel, define the Call Context instructions, and I will handle support calls when your team is busy.";
      }
      const agentReply: Message = { sender: 'agent', content: reply, time: 'Now' };
      setTestMessages(prev => [...prev, agentReply]);
    }, 1000);
  };

  return (
    <div className="ai-agents-page-container">
      {isEditing ? (
        <div className="agent-editor-layout animate-fade-in">
          {/* EDITOR LEFT COLUMN */}
          <div className="editor-left-column">
            <div className="editor-top-nav-bar">
              <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
                <ChevronLeft size={16} />
                <span>Cancel</span>
              </button>
              <div className="nav-title-group">
                <h2>Create AI Agent</h2>
              </div>
              <button className="btn btn-primary btn-sm publish-btn" onClick={() => {
                setIsEditing(false);
                // Simple save simulation
              }}>
                Publish
              </button>
            </div>

            <div className="editor-scroll-body">
              {/* Configuration Section */}
              <div className="editor-section-card">
                <h3>Configuration</h3>
                <p className="card-desc">Clearly define what AI Agent is responsible for and how it supports your business.</p>
                
                <div className="form-group-row">
                  <div className="emoji-select-box">
                    <span className="selected-emoji">{agentEmoji}</span>
                  </div>
                  <div className="form-input-box">
                    <label>Emoji &amp; Name</label>
                    <input 
                      type="text" 
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                    />
                  </div>
                </div>
                <button className="text-link-btn text-xs show-desc-btn">Show description</button>
              </div>

              {/* Instructions Section */}
              <div className="editor-section-card">
                <h3>Instructions</h3>
                <p className="card-desc">Describe the AI Agent's role, communication style, and the actions it should perform. Give step-by-step instructions using clear, actionable language.</p>
                
                <div className="instructions-textarea-wrapper">
                  <textarea 
                    value={agentInstructions}
                    onChange={(e) => setAgentInstructions(e.target.value)}
                    rows={8}
                  />
                  <div className="textarea-toolbar">
                    <div className="toolbar-left-icons">
                      <button className="toolbar-icon-btn"><FileText size={16} /></button>
                      <button className="toolbar-icon-btn"><Smile size={16} /></button>
                    </div>
                    
                    <div className="toolbar-right-links">
                      <div className="prompt-templates-btn">
                        <span>Add prompt templates</span>
                      </div>
                      <button className="btn btn-secondary btn-sm optimize-spark-btn">
                        <Sparkles size={14} />
                        <span>Optimize</span>
                      </button>
                    </div>
                  </div>
                </div>
                <button className="text-link-btn text-xs mt-2">Learn how to write this</button>
              </div>

              {/* Actions Section */}
              <div className="editor-section-card">
                <h3>Actions</h3>
                <p className="card-desc">Assign actions the AI Agent can take during a conversation. Each action only works if it's enabled.</p>
                
                {/* Action 1: Close conversations */}
                <div className="action-toggle-row-group">
                  <div className="action-toggle-header">
                    <div>
                      <h4>Close conversations</h4>
                      <p className="sub-desc">AI Agent can close a conversation based on your guidelines.</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={closeConversations}
                        onChange={() => setCloseConversations(!closeConversations)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                {/* Action 2: Add comments */}
                <div className="action-toggle-row-group">
                  <div className="action-toggle-header">
                    <div>
                      <h4>Add comments</h4>
                      <p className="sub-desc">AI Agent can add internal comments to share quick context with your other agents.</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={addComments}
                        onChange={() => setAddComments(!addComments)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  {addComments && (
                    <div className="action-collapsible-content">
                      <label className="inner-lbl">When and how should this action be performed?</label>
                      <div className="inner-textarea-box">
                        <textarea defaultValue="When passing the contact to another agent or team, add a comment with a conversation summary and suggest next action." rows={3} />
                        <div className="textarea-mini-toolbar">
                          <button className="btn btn-secondary btn-sm optimize-spark-btn">
                            <Sparkles size={14} />
                            <span>Optimize</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action 3: Handle calls */}
                <div className="action-toggle-row-group">
                  <div className="action-toggle-header">
                    <div>
                      <h4>Handle calls</h4>
                      <p className="sub-desc">Let the AI Agent answer and manage voice calls for you.</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={handleCalls}
                        onChange={() => setHandleCalls(!handleCalls)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  {handleCalls && (
                    <div className="action-collapsible-content">
                      <label className="inner-lbl">Describe how the AI Agent should handle calls</label>
                      <div className="inner-textarea-box">
                        <textarea 
                          value={callContext}
                          onChange={(e) => setCallContext(e.target.value)}
                          rows={6} 
                        />
                        <div className="textarea-mini-toolbar">
                          <button className="btn btn-secondary btn-sm optimize-spark-btn">
                            <Sparkles size={14} />
                            <span>Optimize</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* EDITOR RIGHT COLUMN (Testing Panel) */}
          <div className="editor-right-column">
            <div className="testing-panel-header">
              <h3>Test AI Agent</h3>
              <div className="testing-header-right">
                <button className="reset-chat-btn">
                  <RefreshCw size={14} />
                  <span>Reset Chat</span>
                </button>
              </div>
            </div>

            <div className="testing-tabs-bar">
              <button 
                className={`test-tab ${activeTab === 'chat' ? 'active' : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                Chat
              </button>
              <button 
                className={`test-tab ${activeTab === 'fields' ? 'active' : ''}`}
                onClick={() => setActiveTab('fields')}
              >
                Contact fields
              </button>
            </div>

            <div className="testing-content-area">
              {activeTab === 'chat' ? (
                <div className="testing-chat-panel">
                  <div className="test-chat-scroll">
                    {testMessages.map((msg, index) => {
                      const isAgent = msg.sender === 'agent';
                      return (
                        <div key={index} className={`test-bubble-row ${isAgent ? 'incoming-ai' : 'outgoing-user'}`}>
                          {isAgent && <span className="ai-badge-circle">🤖</span>}
                          <div className="test-bubble-content">
                            <p>{msg.content}</p>
                            <span className="test-bubble-time">{msg.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <form className="test-composer-input-row" onSubmit={handleSendTestMessage}>
                    <input 
                      type="text" 
                      placeholder="Enter message here"
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                    />
                    <button type="submit" className="test-send-btn">
                      <i className="ri-send-plane-2-fill"></i>
                    </button>
                  </form>
                  <p className="disclaimer-txt">Actions taken by the AI Agent here are for testing only and won't impact your live setup.</p>
                </div>
              ) : (
                <div className="testing-fields-panel">
                  <div className="fields-grid-list">
                    <div className="field-row-item">
                      <span className="field-lbl">First Name</span>
                      <input type="text" placeholder="Not captured yet" disabled />
                    </div>
                    <div className="field-row-item">
                      <span className="field-lbl">Email</span>
                      <input type="text" placeholder="Not captured yet" disabled />
                    </div>
                    <div className="field-row-item">
                      <span className="field-lbl">Phone</span>
                      <input type="text" placeholder="Not captured yet" disabled />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="agent-list-layout page-scroll animate-fade-in">
          <div className="agent-list-header-row">
            <div>
              <h2>AI Agents</h2>
              <p>Configure autonomous AI sales and support agents for WhatsApp, Calls, and Inbox channels.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <Plus size={16} />
              <span>Create Agent</span>
            </button>
          </div>

          <div className="agents-grid">
            {agentsList.map(agent => (
              <div key={agent.id} className="agent-overview-card">
                <div className="card-top-identity">
                  <div className="agent-profile">
                    <span className="agent-emoji-bg">{agent.emoji}</span>
                    <div>
                      <h3>{agent.name}</h3>
                      <span className="tag tag-blue text-xs">{agent.status}</span>
                    </div>
                  </div>
                  
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={agent.status === 'active'}
                      onChange={() => handleToggleStatus(agent.id)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <p className="agent-desc-para">{agent.description}</p>

                <div className="agent-meta-metrics">
                  <div className="metric-box">
                    <span className="box-lbl">Conversations</span>
                    <span className="box-val">{agent.conversations}</span>
                  </div>
                  <div className="metric-box">
                    <span className="box-lbl">Resolution</span>
                    <span className="box-val">{agent.resolution}%</span>
                  </div>
                  <div className="metric-box">
                    <span className="box-lbl">Voice Calls</span>
                    <span className="box-val">{agent.handledCalls ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>

                <div className="agent-card-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => {
                    setAgentName(agent.name);
                    setAgentEmoji(agent.emoji);
                    setIsEditing(true);
                  }}>
                    <Edit size={14} />
                    <span>Configure</span>
                  </button>
                  <button className="icon-btn-delete"><Trash size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
