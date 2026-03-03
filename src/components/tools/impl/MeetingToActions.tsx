'use client';
import { useState, useCallback, memo } from 'react';
import { CheckSquare, Copy, Sparkles, Trash2 } from 'lucide-react';

interface ActionItem {
  action: string;
  assignee?: string;
  priority: 'high' | 'medium' | 'low';
}

const MeetingToActionsComponent = function MeetingToActions() {
  const [input, setInput] = useState('');
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [copied, setCopied] = useState(false);

  const extractActions = useCallback(() => {
    if (!input.trim()) return;

    const lines = input.split('\n').filter(l => l.trim());
    const actionItems: ActionItem[] = [];

    // Patterns that indicate action items
    const actionPatterns = [
      /(?:will|shall|should|need to|needs to|must|has to|have to)\s+(.+)/i,
      /(?:action|todo|task|assigned):\s*(.+)/i,
      /(?:@\w+)\s+(?:will|to|should)\s+(.+)/i,
      /^[-•*]\s*(.+)/,
      /^\d+[.)]\s*(.+)/,
      /(?:by|before|deadline|due)\s+(?:\w+\s+\d+|\d+\/\d+)/i,
    ];

    // Extract assignee pattern
    const assigneePattern = /@(\w+)|(\w+)\s+(?:will|should|to)/i;

    lines.forEach(line => {
      const trimmed = line.trim();
      
      for (const pattern of actionPatterns) {
        const match = trimmed.match(pattern);
        if (match) {
          let action = match[1] || trimmed;
          action = action.replace(/^[-•*]\s*/, '').trim();
          
          // Skip if too short or looks like a header
          if (action.length < 10 || action.endsWith(':')) continue;

          // Extract assignee
          const assigneeMatch = trimmed.match(assigneePattern);
          const assignee = assigneeMatch ? (assigneeMatch[1] || assigneeMatch[2]) : undefined;

          // Determine priority
          let priority: 'high' | 'medium' | 'low' = 'medium';
          if (/urgent|asap|critical|immediately|priority|important/i.test(trimmed)) {
            priority = 'high';
          } else if (/when possible|optional|nice to have|eventually/i.test(trimmed)) {
            priority = 'low';
          }

          // Avoid duplicates
          if (!actionItems.some(a => a.action.toLowerCase() === action.toLowerCase())) {
            actionItems.push({ action, assignee, priority });
          }
          break;
        }
      }
    });

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    actionItems.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    setActions(actionItems);
  }, [input]);

  const copyActions = useCallback(() => {
    const text = actions.map(a => {
      const assigneeText = a.assignee ? ` (@${a.assignee})` : '';
      const priorityEmoji = a.priority === 'high' ? '🔴' : a.priority === 'medium' ? '🟡' : '🟢';
      return `${priorityEmoji} ${a.action}${assigneeText}`;
    }).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [actions]);

  const removeAction = (idx: number) => {
    setActions(prev => prev.filter((_, i) => i !== idx));
  };

  const priorityColors = {
    high: 'bg-red-900/30 border-red-500/30 text-red-400',
    medium: 'bg-yellow-900/30 border-yellow-500/30 text-yellow-400',
    low: 'bg-green-900/30 border-green-500/30 text-green-400',
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <CheckSquare className="w-4 h-4 inline mr-2" />
        <strong>Meeting to Actions:</strong> Extract action items from meeting notes. Automatically detects tasks, assignees, and priorities.
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Paste your meeting notes:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your meeting notes here...

Example:
- @John will prepare the presentation by Friday
- Need to review the budget proposal (urgent)
- Sarah should schedule follow-up meeting
- Action: Update project timeline"
          className="w-full h-48 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-zinc-500 resize-y focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        onClick={extractActions}
        disabled={!input.trim()}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Extract Action Items
      </button>

      {actions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Action Items ({actions.length})</h3>
            <button
              onClick={copyActions}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          </div>

          <div className="space-y-2">
            {actions.map((action, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-lg border ${priorityColors[action.priority]}`}
              >
                <div className="flex-1">
                  <p className="text-zinc-200">{action.action}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    {action.assignee && (
                      <span className="text-zinc-400">@{action.assignee}</span>
                    )}
                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                      action.priority === 'high' ? 'bg-red-900/50 text-red-300' :
                      action.priority === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                      'bg-green-900/50 text-green-300'
                    }`}>
                      {action.priority}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeAction(idx)}
                  className="p-1 text-zinc-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-4 text-xs text-zinc-500 pt-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full" /> High: {actions.filter(a => a.priority === 'high').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full" /> Medium: {actions.filter(a => a.priority === 'medium').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" /> Low: {actions.filter(a => a.priority === 'low').length}
            </span>
          </div>
        </div>
      )}

      {actions.length === 0 && input.trim() && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center text-zinc-400">
          No action items detected. Try using keywords like &quot;will&quot;, &quot;need to&quot;, &quot;action:&quot;, or bullet points.
        </div>
      )}
    </div>
  );
};

export default memo(MeetingToActionsComponent);
