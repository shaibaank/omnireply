import React, { useState } from 'react';
import {
  Users, Search, Plus, FileSpreadsheet, Share2, Mail, Phone,
  MessageSquare, ChevronRight, X, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';
import { contacts as initialContacts, Contact } from '../data/mockData';
import './ContactsPage.css';

export default function ContactsPage() {
  const [contactsList, setContactsList] = useState<Contact[]>(initialContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lifecycleFilter, setLifecycleFilter] = useState<'all' | string>('all');
  const [sortField, setSortField] = useState<'name' | 'status' | 'assignedTo'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Handle row sorting
  const handleSort = (field: 'name' | 'status' | 'assignedTo') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getChannelIconClass = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return 'ri-whatsapp-fill color-whatsapp';
      case 'facebook': return 'ri-facebook-box-fill color-facebook';
      case 'instagram': return 'ri-instagram-fill color-instagram';
      case 'linkedin': return 'ri-linkedin-box-fill color-linkedin';
      default: return 'ri-chat-3-fill';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'New Lead': return 'tag-blue';
      case 'Hot Lead': return 'tag-yellow';
      case 'Customer': return 'tag-green';
      case 'Payment': return 'tag-purple';
      default: return 'tag-gray';
    }
  };

  // Filter & sort contacts
  const filteredContacts = contactsList
    .filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (c.phone && c.phone.includes(searchQuery));
      const matchesLifecycle = lifecycleFilter === 'all' || c.status === lifecycleFilter;
      return matchesSearch && matchesLifecycle;
    })
    .sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      
      if (sortOrder === 'asc') {
        return valA.localeCompare(valB);
      } else {
        return valB.localeCompare(valA);
      }
    });

  return (
    <div className="contacts-page-container">
      <div className="contacts-main-layout">
        <div className="page-header">
          <div>
            <h1>Contacts</h1>
            <p className="subtitle">Manage customer data, lifecycle stages, tags, and agent assignments across channels.</p>
          </div>

          <div className="page-header-actions">
            <button className="btn btn-secondary">
              <FileSpreadsheet size={16} />
              <span>Import CSV</span>
            </button>
            <button className="btn btn-secondary">
              <Share2 size={16} />
              <span>Export</span>
            </button>
            <button className="btn btn-primary">
              <Plus size={16} />
              <span>Add Contact</span>
            </button>
          </div>
        </div>

        <div className="contacts-content-panel page-scroll">
          {/* Filters row */}
          <div className="contacts-filters-bar">
            <div className="search-input contacts-search-box">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search contacts by name, email, phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="lifecycle-filter-pills">
              <button 
                className={`filter-pill ${lifecycleFilter === 'all' ? 'active' : ''}`}
                onClick={() => setLifecycleFilter('all')}
              >
                All Contacts ({contactsList.length})
              </button>
              <button 
                className={`filter-pill ${lifecycleFilter === 'New Lead' ? 'active' : ''}`}
                onClick={() => setLifecycleFilter('New Lead')}
              >
                New Leads
              </button>
              <button 
                className={`filter-pill ${lifecycleFilter === 'Hot Lead' ? 'active' : ''}`}
                onClick={() => setLifecycleFilter('Hot Lead')}
              >
                Hot Leads
              </button>
              <button 
                className={`filter-pill ${lifecycleFilter === 'Customer' ? 'active' : ''}`}
                onClick={() => setLifecycleFilter('Customer')}
              >
                Customers
              </button>
            </div>
          </div>

          {/* Table display */}
          <div className="contacts-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}><input type="checkbox" /></th>
                  <th className="sortable-header" onClick={() => handleSort('name')}>
                    <span>Name</span>
                    <ArrowUpDown size={12} />
                  </th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Channel</th>
                  <th className="sortable-header" onClick={() => handleSort('status')}>
                    <span>Lifecycle</span>
                    <ArrowUpDown size={12} />
                  </th>
                  <th>Tags</th>
                  <th className="sortable-header" onClick={() => handleSort('assignedTo')}>
                    <span>Assigned To</span>
                    <ArrowUpDown size={12} />
                  </th>
                  <th>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map(contact => (
                  <tr 
                    key={contact.id} 
                    className={`contact-row ${selectedContact?.id === contact.id ? 'active-row' : ''}`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <td onClick={(e) => e.stopPropagation()}><input type="checkbox" /></td>
                    <td>
                      <div className="contact-identity-cell">
                        <div className="contact-avatar-circle" style={{ backgroundColor: contact.avatarColor, width: 32, height: 32, fontSize: 12 }}>
                          {contact.avatar}
                        </div>
                        <span className="contact-full-name">{contact.name}</span>
                      </div>
                    </td>
                    <td>{contact.email || '-'}</td>
                    <td>{contact.phone || '-'}</td>
                    <td>
                      <span className="channel-table-icon">
                        <i className={getChannelIconClass(contact.channel)}></i>
                      </span>
                    </td>
                    <td>
                      <span className={`tag ${getStatusClass(contact.status)}`}>{contact.status}</span>
                    </td>
                    <td>
                      <div className="tags-cell-container">
                        {contact.tags.map(t => (
                          <span key={t} className="tag tag-blue text-xs">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td>{contact.assignedTo || 'Unassigned'}</td>
                    <td>{contact.lastMessageTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="table-footer-pagination">
            <span>Showing 1-{filteredContacts.length} of {filteredContacts.length} contacts</span>
          </div>
        </div>
      </div>

      {/* CONTACT DETAILS SLIDE-OUT PANEL */}
      {selectedContact && (
        <div className="contact-slideout-panel animate-slide-in-right">
          <div className="slideout-header">
            <h3>Contact Profile</h3>
            <button className="icon-btn close-slideout" onClick={() => setSelectedContact(null)}>
              <X size={18} />
            </button>
          </div>

          <div className="slideout-scroll-body">
            <div className="slideout-profile-card">
              <div className="large-profile-avatar" style={{ backgroundColor: selectedContact.avatarColor }}>
                {selectedContact.avatar}
              </div>
              <h2>{selectedContact.name}</h2>
              <span className={`tag ${getStatusClass(selectedContact.status)}`}>{selectedContact.status}</span>
            </div>

            <div className="profile-quick-actions">
              <button className="action-circle-btn"><Phone size={16} /></button>
              <button className="action-circle-btn"><Mail size={16} /></button>
              <button className="action-circle-btn"><MessageSquare size={16} /></button>
            </div>

            <div className="profile-info-section">
              <div className="section-title">
                <h5>Contact Info</h5>
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
                <h5>Agent Assignment</h5>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Assigned Agent</span>
                  <span className="info-val">{selectedContact.assignedTo || 'Unassigned'}</span>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
