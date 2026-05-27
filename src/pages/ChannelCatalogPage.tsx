import React, { useState } from 'react';
import {
  ChevronLeft, Search, Plus, Radio, Bot, Shield, Check, Info,
  Smartphone, Mail, MessageSquare, AlertCircle
} from 'lucide-react';
import { channels as initialChannels, Channel } from '../data/mockData';
import './ChannelCatalogPage.css';

export default function ChannelCatalogPage() {
  const [channelsList, setChannelsList] = useState<Channel[]>(initialChannels);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'channels' | string>('channels');
  const [activeCatalogTab, setActiveCatalogTab] = useState<'all' | 'business-messaging' | 'calls' | 'sms' | 'email' | 'live-chat'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Channel connection state
  const handleConnectChannel = (id: string) => {
    setChannelsList(prev => prev.map(ch => {
      if (ch.id === id) {
        return { ...ch, connected: !ch.connected };
      }
      return ch;
    }));
  };

  // Filter channels based on tab & search query
  const filteredChannels = channelsList.filter(ch => {
    const matchesTab = activeCatalogTab === 'all' || ch.category === activeCatalogTab;
    const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ch.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getChannelLogo = (icon: string, color: string) => {
    switch (icon) {
      case 'whatsapp':
        return (
          <div className="catalog-channel-logo-circle" style={{ backgroundColor: color }}>
            <i className="ri-whatsapp-fill" style={{ fontSize: 24, color: 'white' }}></i>
          </div>
        );
      case 'tiktok':
        return (
          <div className="catalog-channel-logo-circle" style={{ backgroundColor: '#000000' }}>
            <i className="ri-tiktok-fill" style={{ fontSize: 24, color: 'white' }}></i>
          </div>
        );
      case 'facebook':
        return (
          <div className="catalog-channel-logo-circle" style={{ backgroundColor: color }}>
            <i className="ri-facebook-circle-fill" style={{ fontSize: 24, color: 'white' }}></i>
          </div>
        );
      case 'instagram':
        return (
          <div className="catalog-channel-logo-circle bg-instagram-gradient">
            <i className="ri-instagram-fill" style={{ fontSize: 24, color: 'white' }}></i>
          </div>
        );
      case 'telegram':
        return (
          <div className="catalog-channel-logo-circle" style={{ backgroundColor: color }}>
            <i className="ri-telegram-fill" style={{ fontSize: 24, color: 'white' }}></i>
          </div>
        );
      case 'linkedin':
        return (
          <div className="catalog-channel-logo-circle" style={{ backgroundColor: color }}>
            <i className="ri-linkedin-fill" style={{ fontSize: 24, color: 'white' }}></i>
          </div>
        );
      case 'phone':
        return (
          <div className="catalog-channel-logo-circle" style={{ backgroundColor: color }}>
            <i className="ri-phone-fill" style={{ fontSize: 22, color: 'white' }}></i>
          </div>
        );
      case 'email':
        return (
          <div className="catalog-channel-logo-circle" style={{ backgroundColor: color }}>
            <i className="ri-mail-fill" style={{ fontSize: 22, color: 'white' }}></i>
          </div>
        );
      case 'sms':
        return (
          <div className="catalog-channel-logo-circle" style={{ backgroundColor: color }}>
            <i className="ri-chat-sms-fill" style={{ fontSize: 22, color: 'white' }}></i>
          </div>
        );
      case 'webchat':
        return (
          <div className="catalog-channel-logo-circle" style={{ backgroundColor: color }}>
            <i className="ri-chat-4-fill" style={{ fontSize: 22, color: 'white' }}></i>
          </div>
        );
      default:
        return (
          <div className="catalog-channel-logo-circle" style={{ backgroundColor: '#8B5CF6' }}>
            <i className="ri-links-fill" style={{ fontSize: 22, color: 'white' }}></i>
          </div>
        );
    }
  };

  return (
    <div className="channel-catalog-page-container">
      {/* LEFT SETTINGS SIDEBAR */}
      <div className="settings-sidebar">
        <div className="settings-sidebar-header">
          <h3>Workspace settings</h3>
        </div>
        
        <div className="settings-nav-scroll">
          <div className="settings-nav-section">
            <span className="settings-nav-section-title">General settings</span>
            <button className="settings-nav-link">General info</button>
          </div>

          <div className="settings-nav-section">
            <span className="settings-nav-section-title">User role settings</span>
            <button className="settings-nav-link">User settings</button>
            <button className="settings-nav-link">Team settings</button>
          </div>

          <div className="settings-nav-section">
            <span className="settings-nav-section-title">Apps</span>
            <button 
              className={`settings-nav-link active`}
              onClick={() => setActiveSettingsTab('channels')}
            >
              Channels
            </button>
            <button className="settings-nav-link">Integrations</button>
            <button className="settings-nav-link">Growth widgets</button>
          </div>

          <div className="settings-nav-section">
            <span className="settings-nav-section-title">Inbox settings</span>
            <button className="settings-nav-link">Contact fields</button>
            <button className="settings-nav-link">Lifecycle</button>
            <button className="settings-nav-link">Closing notes</button>
            <button className="settings-nav-link">Snippets</button>
            <button className="settings-nav-link">Tags</button>
            <button className="settings-nav-link">AI Assist</button>
            <button className="settings-nav-link">AI Prompts</button>
            <button className="settings-nav-link settings-nav-link-badge">
              <span>Calls</span>
              <span className="nav-new-badge">New</span>
            </button>
          </div>

          <div className="settings-nav-section">
            <span className="settings-nav-section-title">Data settings</span>
            <button className="settings-nav-link">Files</button>
            <button className="settings-nav-link">Contacts import</button>
            <button className="settings-nav-link">Data export</button>
          </div>
        </div>
      </div>

      {/* RIGHT CATALOG PANEL */}
      <div className="catalog-content-panel">
        <div className="catalog-header">
          <div className="catalog-header-title-row">
            <button className="icon-btn-back">
              <ChevronLeft size={20} />
            </button>
            <div className="catalog-title-text">
              <h2>Channel Catalog</h2>
              <p>Manage your messaging channels and discover new ones to help you acquire more customers.</p>
            </div>
          </div>
        </div>

        {/* Tab filters and search */}
        <div className="catalog-filters-bar">
          <div className="catalog-tabs">
            <button 
              className={`catalog-tab ${activeCatalogTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCatalogTab('all')}
            >
              All
            </button>
            <button 
              className={`catalog-tab ${activeCatalogTab === 'business-messaging' ? 'active' : ''}`}
              onClick={() => setActiveCatalogTab('business-messaging')}
            >
              Business Messaging
            </button>
            <button 
              className={`catalog-tab ${activeCatalogTab === 'calls' ? 'active' : ''}`}
              onClick={() => setActiveCatalogTab('calls')}
            >
              Calls
            </button>
            <button 
              className={`catalog-tab ${activeCatalogTab === 'sms' ? 'active' : ''}`}
              onClick={() => setActiveCatalogTab('sms')}
            >
              SMS
            </button>
            <button 
              className={`catalog-tab ${activeCatalogTab === 'email' ? 'active' : ''}`}
              onClick={() => setActiveCatalogTab('email')}
            >
              Email
            </button>
            <button 
              className={`catalog-tab ${activeCatalogTab === 'live-chat' ? 'active' : ''}`}
              onClick={() => setActiveCatalogTab('live-chat')}
            >
              Live Chat
            </button>
          </div>

          <div className="search-input catalog-search-input">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search Channel Catalog"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Grid cards */}
        <div className="catalog-scroll-area">
          <div className="catalog-section-label">
            <h4>Business Messaging</h4>
          </div>

          <div className="catalog-grid">
            {filteredChannels.map(ch => (
              <div key={ch.id} className={`channel-catalog-card ${ch.connected ? 'connected-card' : ''}`}>
                <div className="card-top-header">
                  {ch.popular && <span className="card-badge badge-popular">Popular</span>}
                  {ch.beta && <span className="card-badge badge-beta">Beta</span>}
                  <div className="card-logo-container">
                    {getChannelLogo(ch.icon, ch.color)}
                  </div>
                </div>

                <div className="card-body">
                  <h4>{ch.name}</h4>
                  <p>{ch.description}</p>
                </div>

                <div className="card-footer">
                  <button 
                    className={`btn w-full ${ch.connected ? 'btn-secondary connected-btn' : 'btn-primary'}`}
                    onClick={() => handleConnectChannel(ch.id)}
                  >
                    {ch.connected ? (
                      <>
                        <Check size={14} />
                        <span>Connected</span>
                      </>
                    ) : (
                      'Connect'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
