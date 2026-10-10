import React, { useEffect, useState } from 'react';
import { Activity, Clock, RefreshCw } from 'lucide-react';
import { getStoredActivityLogs } from '../../lib/contentStore';

export const AdminActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    const items = getStoredActivityLogs();
    setLogs(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-1">
            <Activity className="h-3.5 w-3.5" />
            <span>Audit Trail</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Administrative Activity Log
          </h1>
        </div>

        <button
          onClick={fetchLogs}
          type="button"
          className="p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          title="Refresh Logs"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        {loading ? (
          <div className="py-8 text-center text-xs font-mono text-[var(--text-muted)]">
            Loading activity audit entries...
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-[var(--text-muted)]">
            No administrative activity recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] text-xs"
              >
                <div>
                  <div className="font-semibold text-[var(--text-primary)] font-mono text-xs">
                    {log.action}
                  </div>
                  <p className="text-[var(--text-secondary)] mt-1">{log.details}</p>
                  <div className="text-[10px] font-mono text-[var(--text-muted)] mt-2">
                    Acting User: {log.userEmail}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[var(--text-muted)] shrink-0 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
