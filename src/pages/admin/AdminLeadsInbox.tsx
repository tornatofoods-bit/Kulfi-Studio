import React, { useEffect, useState } from 'react';
import {
  Inbox,
  Search,
  Download,
  Trash2,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { sound } from '../../lib/audio';
import {
  fetchStoredLeads,
  updateStoredLeadStatus,
  deleteStoredLead,
} from '../../lib/contentStore';

interface LeadItem {
  id: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export const AdminLeadsInbox: React.FC = () => {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    const items = await fetchStoredLeads();
    setLeads(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = (id: string, status: LeadItem['status']) => {
    sound.playPop();
    updateStoredLeadStatus(id, status);
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
    if (selectedLead?.id === id) {
      setSelectedLead({ ...selectedLead, status });
    }
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this client lead record permanently?')) return;
    sound.playPop();
    deleteStoredLead(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (selectedLead?.id === id) setSelectedLead(null);
  };

  const exportCSV = () => {
    sound.playChime();
    const headers = ['Name', 'Email', 'Company', 'Service', 'Budget', 'Timeline', 'Date', 'Status', 'Message'];
    const rows = leads.map((l) => [
      `"${l.name || ''}"`,
      `"${l.email || ''}"`,
      `"${l.company || ''}"`,
      `"${l.service || ''}"`,
      `"${l.budget || ''}"`,
      `"${l.timeline || ''}"`,
      `"${l.createdAt || ''}"`,
      `"${l.status || ''}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kulfi_studio_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = leads.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-1">
            <Inbox className="h-3.5 w-3.5" />
            <span>Client Communications</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Project Leads Inbox ({leads.length})
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLeads}
            type="button"
            className="p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            title="Refresh Leads"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            onClick={exportCSV}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[#F4A300] text-[var(--text-primary)] transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by client name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs focus:border-[#F4A300] focus:outline-hidden"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] self-start sm:self-auto">
          {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => {
                sound.playPop();
                setFilterStatus(status);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-[#1E1410] text-white dark:bg-[#FFFDF8] dark:text-[#1E1410]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table & Detail Viewer Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Leads Table */}
        <div className="lg:col-span-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)]">
              Loading inbound leads...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-xs font-mono text-[var(--text-muted)]">
              No inquiries match current search parameters.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-color)]">
              {filtered.map((lead) => {
                const isSelected = selectedLead?.id === lead.id;
                return (
                  <div
                    key={lead.id}
                    onClick={() => {
                      sound.playPop();
                      setSelectedLead(lead);
                    }}
                    className={`p-4 transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#F4A300]/10 border-l-4 border-l-[#F4A300]'
                        : 'hover:bg-[var(--bg-surface-subtle)]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-semibold text-[var(--text-primary)] truncate">
                          {lead.name}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {lead.company ? `(${lead.company})` : ''}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] truncate">
                        {lead.service || 'General Inquiry'} · {lead.budget || 'Custom'}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ''}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md font-mono text-[10px] uppercase font-semibold ${
                          lead.status === 'new'
                            ? 'bg-[#F4A300]/20 text-[#C77700]'
                            : lead.status === 'replied'
                            ? 'bg-[#84C57E]/20 text-[#2E7D32]'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Lead Detailed Card */}
        <div className="lg:col-span-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-xs sticky top-24">
          {selectedLead ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                    {selectedLead.name}
                  </h3>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="text-xs font-mono text-[#F4A300] hover:underline block mt-0.5"
                  >
                    {selectedLead.email}
                  </a>
                </div>

                <button
                  onClick={() => handleDelete(selectedLead.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg"
                  title="Delete Lead"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 border-t border-[var(--border-color)] flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusChange(selectedLead.id, 'read')}
                  className="px-3 py-1 rounded-lg text-xs font-mono border border-[var(--border-color)] hover:border-[#F4A300]"
                >
                  Mark Read
                </button>
                <button
                  onClick={() => handleStatusChange(selectedLead.id, 'replied')}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-[#84C57E]/20 text-[#2E7D32] dark:text-[#84C57E]"
                >
                  Mark Replied
                </button>
                <button
                  onClick={() => handleStatusChange(selectedLead.id, 'archived')}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  Archive
                </button>
              </div>

              {/* Brief Metadata */}
              <div className="space-y-2 text-xs font-mono text-[var(--text-secondary)] p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)]">
                <div><strong>Service:</strong> {selectedLead.service || 'N/A'}</div>
                <div><strong>Budget:</strong> {selectedLead.budget || 'N/A'}</div>
                <div><strong>Timeline:</strong> {selectedLead.timeline || 'N/A'}</div>
                <div><strong>Company:</strong> {selectedLead.company || 'N/A'}</div>
                <div><strong>Date:</strong> {selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleString() : 'N/A'}</div>
              </div>

              {/* Message Body */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Project Vision & Requirements:
                </h4>
                <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                  {selectedLead.message}
                </div>
              </div>

              {/* Direct Reply Email Action */}
              <a
                href={`mailto:${selectedLead.email}?subject=Regarding%20your%20project%20inquiry%20with%20Kulfi%20Studio`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Reply Directly via Email</span>
              </a>
            </div>
          ) : (
            <div className="py-16 text-center text-xs font-mono text-[var(--text-muted)]">
              Select an inquiry from the list to view project specifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
