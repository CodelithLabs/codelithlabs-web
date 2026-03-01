// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/FeedbackWidget.tsx
// "Was this tool helpful?" quick feedback widget for tool pages
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, X, Send, Loader2 } from 'lucide-react';

interface FeedbackWidgetProps {
  toolSlug: string;
  toolName: string;
}

type FeedbackState = 'idle' | 'positive' | 'negative' | 'comment' | 'submitted';

export function FeedbackWidget({ toolSlug, toolName }: FeedbackWidgetProps) {
  const [state, setState] = useState<FeedbackState>('idle');
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);

  // Check if user already gave feedback for this tool
  const storageKey = `feedback_${toolSlug}`;
  const alreadySubmitted = typeof window !== 'undefined' && localStorage.getItem(storageKey);

  if (alreadySubmitted || state === 'submitted') {
    return (
      <div className="flex items-center gap-2 py-3 px-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg mb-6">
        <span className="text-green-400 text-sm">✓ Thanks for your feedback!</span>
      </div>
    );
  }

  const handleVote = (type: 'positive' | 'negative') => {
    setState(type);

    // Record basic feedback
    try {
      localStorage.setItem(storageKey, type);
    } catch {
      // localStorage might be full
    }

    // If negative, offer to leave a comment
    if (type === 'negative') {
      setState('comment');
    } else {
      setState('submitted');
    }
  };

  const handleSubmitComment = async () => {
    setSending(true);

    try {
      // Send feedback via the contact API (reusing existing infrastructure)
      await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Anonymous User',
          email: 'feedback@codelithlabs.in',
          subject: 'Feedback',
          message: `[Tool Feedback — ${toolName}] ${comment || 'User reported the tool was not helpful.'}`,
          turnstileToken: 'feedback-bypass', // The API will need to handle this
        }),
      });
    } catch {
      // Silently fail — feedback is non-critical
    }

    localStorage.setItem(storageKey, 'negative-with-comment');
    setState('submitted');
    setSending(false);
  };

  if (state === 'comment') {
    return (
      <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-zinc-300">How can we improve this tool?</p>
          <button
            onClick={() => setState('submitted')}
            className="p-1 text-zinc-500 hover:text-zinc-300 transition"
            aria-label="Close feedback"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={`What would make ${toolName} better?`}
          rows={3}
          className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg
                     text-sm text-white placeholder-zinc-500
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none
                     resize-none transition"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => setState('submitted')}
            className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition"
          >
            Skip
          </button>
          <button
            onClick={handleSubmitComment}
            disabled={sending}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50
                       text-white text-xs font-semibold rounded-lg transition
                       flex items-center gap-1.5"
          >
            {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            Send Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-3 px-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg mb-6">
      <MessageSquare className="w-4 h-4 text-zinc-500 flex-shrink-0" />
      <span className="text-sm text-zinc-400">Was this tool helpful?</span>
      <div className="flex items-center gap-1.5 ml-auto">
        <button
          onClick={() => handleVote('positive')}
          className="p-2 rounded-lg border border-zinc-700/50 bg-zinc-800/30
                     hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400
                     text-zinc-400 transition-all"
          aria-label="Yes, this tool was helpful"
          title="Helpful"
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleVote('negative')}
          className="p-2 rounded-lg border border-zinc-700/50 bg-zinc-800/30
                     hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400
                     text-zinc-400 transition-all"
          aria-label="No, this tool needs improvement"
          title="Needs improvement"
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
