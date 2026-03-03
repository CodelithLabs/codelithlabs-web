'use client';
import { useState , memo } from 'react';
import { GitCompare } from 'lucide-react';

const DiffCheckerComponent = function DiffChecker() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diff, setDiff] = useState<{ type: 'same' | 'added' | 'removed'; line: string; lineNum1?: number; lineNum2?: number }[]>([]);

  const compute = () => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLen = Math.max(lines1.length, lines2.length);
    const result: { type: 'same' | 'added' | 'removed'; line: string; lineNum1?: number; lineNum2?: number }[] = [];

    // Simple line-by-line diff using LCS
    const m = lines1.length, n = lines2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = lines1[i-1] === lines2[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);

    let i = m, j = n;
    const ops: { type: 'same' | 'added' | 'removed'; line: string; lineNum1?: number; lineNum2?: number }[] = [];
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && lines1[i-1] === lines2[j-1]) {
        ops.unshift({ type: 'same', line: lines1[i-1], lineNum1: i, lineNum2: j });
        i--; j--;
      } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
        ops.unshift({ type: 'added', line: lines2[j-1], lineNum2: j });
        j--;
      } else {
        ops.unshift({ type: 'removed', line: lines1[i-1], lineNum1: i });
        i--;
      }
    }
    setDiff(ops);
  };

  const stats = {
    added: diff.filter(d => d.type === 'added').length,
    removed: diff.filter(d => d.type === 'removed').length,
    same: diff.filter(d => d.type === 'same').length,
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <GitCompare className="w-4 h-4 inline mr-2" /><strong>Text Diff Checker:</strong> Compare two texts side by side and see additions, removals, and unchanged lines using LCS algorithm.
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="text-sm block mb-1">Original Text</label><textarea value={text1} onChange={e => setText1(e.target.value)} rows={10} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 font-mono text-xs" placeholder="Paste original text..." /></div>
        <div><label className="text-sm block mb-1">Modified Text</label><textarea value={text2} onChange={e => setText2(e.target.value)} rows={10} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 font-mono text-xs" placeholder="Paste modified text..." /></div>
      </div>
      <button onClick={compute} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Compare</button>
      {diff.length > 0 && (
        <>
          <div className="flex gap-4 text-sm">
            <span className="text-gray-400">Total: {diff.length} lines</span>
            <span className="text-green-400">+{stats.added} added</span>
            <span className="text-red-400">-{stats.removed} removed</span>
            <span className="text-gray-500">{stats.same} unchanged</span>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            {diff.map((d, idx) => (
              <div key={idx} className={`flex font-mono text-xs border-b border-zinc-800/30 ${d.type === 'added' ? 'bg-green-900/20' : d.type === 'removed' ? 'bg-red-900/20' : ''}`}>
                <div className="w-10 text-right text-gray-600 px-2 py-1 select-none">{d.lineNum1 || ''}</div>
                <div className="w-10 text-right text-gray-600 px-2 py-1 select-none">{d.lineNum2 || ''}</div>
                <div className={`w-6 text-center py-1 select-none ${d.type === 'added' ? 'text-green-400' : d.type === 'removed' ? 'text-red-400' : 'text-gray-700'}`}>{d.type === 'added' ? '+' : d.type === 'removed' ? '-' : ' '}</div>
                <pre className={`flex-1 py-1 px-2 whitespace-pre-wrap ${d.type === 'added' ? 'text-green-300' : d.type === 'removed' ? 'text-red-300' : 'text-gray-400'}`}>{d.line}</pre>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default memo(DiffCheckerComponent);
