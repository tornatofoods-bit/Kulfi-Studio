import React from 'react';
import { X, BookOpen, Clock } from 'lucide-react';
import { BlogPost } from '../../types';
import { sound } from '../../lib/audio';

interface ArticleModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ post, onClose }) => {
  if (!post) return null;

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
      <div className="relative w-full max-w-2xl rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
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

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-2">
            <span className="text-[#F4A300] font-semibold">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>{post.date}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
            {post.title}
          </h2>
        </div>

        {/* Content Paragraphs */}
        <div className="space-y-4 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed pt-4 border-t border-[var(--border-color)]">
          {post.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
          <span>Kulfi Studio Engineering Dispatch</span>
          <span>© 2026 Kulfi Studio</span>
        </div>
      </div>
    </div>
  );
};
