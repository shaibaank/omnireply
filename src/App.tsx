import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import InboxPage from './pages/InboxPage';
import ContactsPage from './pages/ContactsPage';
import AIAgentsPage from './pages/AIAgentsPage';
import WorkflowsPage from './pages/WorkflowsPage';
import ChannelCatalogPage from './pages/ChannelCatalogPage';
import AICallPage from './pages/AICallPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/inbox" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/ai-agents/*" element={<AIAgentsPage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/channels" element={<ChannelCatalogPage />} />
          <Route path="/ai-call" element={<AICallPage />} />
          <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<DashboardPage />} />
          <Route path="/help" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}
