import React, { useState } from 'react';
import {
  BookOpen, Plus, Search, HelpCircle, FileText, Globe, RefreshCw, Trash,
  UploadCloud, CheckCircle, AlertTriangle, AlertCircle
} from 'lucide-react';
import { kbDocuments as initialDocs, KBDocument } from '../data/mockData';
import './KnowledgeBasePage.css';

export default function KnowledgeBasePage() {
  const [docsList, setDocsList] = useState<KBDocument[]>(initialDocs);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeTab, setActiveTypeTab] = useState<'all' | 'pdf' | 'url' | 'text' | 'faq'>('all');

  const filteredDocs = docsList.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeTypeTab === 'all' || doc.type === activeTypeTab;
    return matchesSearch && matchesType;
  });

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText size={18} className="doc-icon color-pdf" />;
      case 'url': return <Globe size={18} className="doc-icon color-url" />;
      case 'faq': return <HelpCircle size={18} className="doc-icon color-faq" />;
      default: return <FileText size={18} className="doc-icon color-text" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'trained':
        return (
          <span className="kb-status-badge trained">
            <CheckCircle size={12} />
            <span>Trained</span>
          </span>
        );
      case 'training':
        return (
          <span className="kb-status-badge training">
            <RefreshCw size={12} className="spin-icon" />
            <span>Training</span>
          </span>
        );
      case 'pending':
        return (
          <span className="kb-status-badge pending">
            <ClockIcon />
            <span>Pending</span>
          </span>
        );
      default:
        return (
          <span className="kb-status-badge error">
            <AlertCircle size={12} />
            <span>Error</span>
          </span>
        );
    }
  };

  return (
    <div className="kb-page-container">
      <div className="page-header">
        <div>
          <h1>Knowledge Base</h1>
          <p className="subtitle">Upload manuals, catalogs, FAQs, and URLs to train your autonomous conversational AI agents.</p>
        </div>

        <button className="btn btn-primary">
          <Plus size={16} />
          <span>Add Source</span>
        </button>
      </div>

      <div className="kb-content-scroll page-scroll">
        {/* Stats and training summary summary */}
        <div className="kb-summary-row">
          <div className="summary-card">
            <span className="summary-lbl">Total Documents</span>
            <span className="summary-val">{docsList.length}</span>
          </div>
          <div className="summary-card">
            <span className="summary-lbl">Trained Chunks</span>
            <span className="summary-val">558</span>
          </div>
          <div className="summary-card progress-summary-card">
            <span className="summary-lbl">AI Training Sync Status</span>
            <div className="training-progress-bar-container">
              <div className="training-progress-filled" style={{ width: '85%' }}></div>
            </div>
            <span className="training-percent-txt">85% Sync Completed</span>
          </div>
        </div>

        {/* Filters and upload grid */}
        <div className="kb-filters-bar">
          <div className="kb-tabs">
            <button 
              className={`kb-tab-btn ${activeTypeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTypeTab('all')}
            >
              All Sources
            </button>
            <button 
              className={`kb-tab-btn ${activeTypeTab === 'pdf' ? 'active' : ''}`}
              onClick={() => setActiveTypeTab('pdf')}
            >
              PDF Manuals
            </button>
            <button 
              className={`kb-tab-btn ${activeTypeTab === 'url' ? 'active' : ''}`}
              onClick={() => setActiveTypeTab('url')}
            >
              Web URLs
            </button>
            <button 
              className={`kb-tab-btn ${activeTypeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTypeTab('faq')}
            >
              Q&amp;A FAQs
            </button>
          </div>

          <div className="search-input kb-search-box">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search knowledge sources..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table representation */}
        <div className="kb-table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Source Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Chunks</th>
                <th>File Size</th>
                <th>Added</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div className="doc-title-cell">
                      {getDocIcon(doc.type)}
                      <span className="doc-title-txt">{doc.title}</span>
                    </div>
                  </td>
                  <td><span className="tag tag-gray text-xs">{doc.type}</span></td>
                  <td>{getStatusLabel(doc.status)}</td>
                  <td>{doc.chunks}</td>
                  <td>{doc.size}</td>
                  <td>{doc.lastUpdated}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="kb-actions-cell">
                      <button className="icon-btn"><RefreshCw size={14} /></button>
                      <button className="icon-btn-delete"><Trash size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upload Zone */}
        <div className="kb-upload-dropzone">
          <UploadCloud size={40} className="upload-icon" />
          <h3>Drag &amp; drop document to sync with AI</h3>
          <p>Supports PDF, DOCX, CSV, TXT up to 25MB.</p>
          <button className="btn btn-secondary mt-2">Select File</button>
        </div>
      </div>
    </div>
  );
}

// Inline minimal clock icon
function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2 }}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}
