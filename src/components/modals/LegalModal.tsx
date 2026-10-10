import React from 'react';
import { X, Shield } from 'lucide-react';
import { sound } from '../../lib/audio';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => {
          sound.playPop();
          onClose();
        }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-2xl z-10 my-8 max-h-[85vh] overflow-y-auto">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          type="button"
          data-cursor="Close"
          className="absolute top-6 right-6 w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#F4A300] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#F4A300] mb-2">
          <Shield className="h-4 w-4" />
          <span>Legal & Confectionery Governance</span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6">
          {title}
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          {isPrivacy ? (
            <>
              <p>
                <strong>1. Confidentiality by Default:</strong> All client inquiries, product blueprints, codebase repositories, and architectural specifications are treated with ironclad confidentiality under mutual non-disclosure obligations.
              </p>
              <p>
                <strong>2. Data Collection:</strong> We collect only the information provided in our brief submission forms (name, work email, project vision) strictly to prepare customized proposals and contract deliverables. We never sell, lease, or distribute prospect data.
              </p>
              <p>
                <strong>3. Infrastructure Security:</strong> Client data is protected using TLS 1.3 encryption in transit and AES-256 at rest across certified Google Cloud and AWS facilities.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>1. Source Code Ownership:</strong> Upon settlement of agreed project milestone invoices, all proprietary source code, assets, and design files become 100% intellectual property of the client with zero vendor lock-in.
              </p>
              <p>
                <strong>2. Chilled Warranty:</strong> All project deliverables include a standard 30-day post-launch warranty covering defect remediation, bug fixes, and deployment performance assurance.
              </p>
              <p>
                <strong>3. SLA Retainers:</strong> Monthly retainer arrangements operate on 30-day rolling cycles with guaranteed response times and proactive security monitoring.
              </p>
            </>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex justify-end">
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            type="button"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
