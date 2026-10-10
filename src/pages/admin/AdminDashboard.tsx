import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  FolderGit2,
  Briefcase,
  Sparkles,
  ArrowUpRight,
  Database,
  FileCode,
  Download,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  fetchStoredLeads,
  getStoredActivityLogs,
  loadFullContent,
  downloadContentJson,
} from '../../lib/contentStore';
import { sound } from '../../lib/audio';

export const AdminDashboard: React.FC = () => {
  const { user } = useAdminAuth();
  const [leadsCount, setLeadsCount] = useState<number>(0);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [versionNum, setVersionNum] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const fullContent = await loadFullContent();
        setVersionNum(fullContent.version || 1);

        const storedLeads = await fetchStoredLeads();
        setLeadsCount(storedLeads.length);
        setRecentLeads(storedLeads.slice(0, 5));

        const storedLogs = getStoredActivityLogs();
        setRecentLogs(storedLogs.slice(0, 5));
      } catch (err) {
        console.warn('Dashboard data fetch notification:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Kulfi Studio Head Confectionery</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Welcome, {user?.displayName || user?.email?.split('@')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-xl leading-relaxed">
            Manage all frontend typography, 3D kulfi physics, client deliverables, pricing scoops, and inbound project briefs. Stored in 100% free flat-file JSON format.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              sound.playChime();
              downloadContentJson();
            }}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-[#F4A300]" />
            <span>Export content.json</span>
          </button>

          <Link
            to="/admin/leads"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] transition-colors shrink-0 shadow-sm"
          >
            <span>View Inbound Leads</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">New Inquiries</span>
            <Inbox className="h-4 w-4 text-[#F4A300]" />
          </div>
          <div className="font-display text-3xl font-bold text-[var(--text-primary)] tabular-nums">
            {leadsCount}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1 font-mono">
            Direct client brief submissions
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Flavours / Services</span>
            <Briefcase className="h-4 w-4 text-[#84C57E]" />
          </div>
          <div className="font-display text-3xl font-bold text-[var(--text-primary)] tabular-nums">
            6
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1 font-mono">
            Active digital capabilities
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Case Studies</span>
            <FolderGit2 className="h-4 w-4 text-[#F7A8B8]" />
          </div>
          <div className="font-display text-3xl font-bold text-[var(--text-primary)] tabular-nums">
            4
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1 font-mono">
            Featured live scoops
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Storage Engine</span>
            <FileCode className="h-4 w-4 text-[#84C57E]" />
          </div>
          <div className="font-display text-2xl font-bold text-[#84C57E]">
            v{versionNum} Flat-File
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1 font-mono">
            content.json (100% Free)
          </div>
        </div>
      </div>

      {/* Grid: Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Quick Actions Grid */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-4">
              Quick Confectionery Editors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/admin/hero"
                className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] hover:border-[#F4A300] hover:bg-[var(--bg-surface-hover)] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-display text-sm font-semibold text-[var(--text-primary)]">
                    Hero & 3D Parameters
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Headlines, rotation, sprinkles
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[#F4A300] transition-colors" />
              </Link>

              <Link
                to="/admin/services"
                className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] hover:border-[#F4A300] hover:bg-[var(--bg-surface-hover)] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-display text-sm font-semibold text-[var(--text-primary)]">
                    Flavour Menu (Services)
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Rates, deliverables, tech
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[#F4A300] transition-colors" />
              </Link>

              <Link
                to="/admin/projects"
                className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] hover:border-[#F4A300] hover:bg-[var(--bg-surface-hover)] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-display text-sm font-semibold text-[var(--text-primary)]">
                    Case Studies & Proof
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Metrics, challenge, solution
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[#F4A300] transition-colors" />
              </Link>

              <Link
                to="/admin/pricing"
                className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] hover:border-[#F4A300] hover:bg-[var(--bg-surface-hover)] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-display text-sm font-semibold text-[var(--text-primary)]">
                    Pricing & Scoops
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Project vs monthly retainers
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[#F4A300] transition-colors" />
              </Link>
            </div>
          </div>

          {/* Recent Leads Preview */}
          <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
                Recent Inbound Inquiries
              </h3>
              <Link
                to="/admin/leads"
                className="text-xs font-mono text-[#F4A300] hover:underline"
              >
                View all ({leadsCount}) →
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <div className="text-center py-8 text-xs text-[var(--text-muted)] font-mono">
                No inquiries submitted yet. Form submissions will appear here live.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-color)]">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[var(--text-primary)]">
                        {lead.name}{' '}
                        <span className="text-[var(--text-muted)] font-normal">
                          ({lead.email})
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        {lead.service} · {lead.budget || 'Custom'}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md font-mono text-[10px] uppercase bg-[#84C57E]/10 text-[#2E7D32] dark:text-[#84C57E]">
                      {lead.status || 'new'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Recent Activity Log */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
              Activity Audit Trail
            </h3>
            <Link
              to="/admin/activity"
              className="text-xs font-mono text-[#F4A300] hover:underline"
            >
              All Logs →
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <div className="text-center py-8 text-xs text-[var(--text-muted)] font-mono">
              No recent administrative actions recorded.
            </div>
          ) : (
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <div key={log.id} className="text-xs pb-3 border-b border-[var(--border-color)] last:border-0">
                  <div className="font-medium text-[var(--text-primary)]">
                    {log.details || log.action}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-muted)] mt-1">
                    <span>{log.userEmail}</span>
                    <span>·</span>
                    <span>{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Recent'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
