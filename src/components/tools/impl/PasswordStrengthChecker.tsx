'use client';
import { useState } from 'react';

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<{score: number; feedback: string; strength: string; color: string} | null>(null);

  const check = () => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score += 1; else feedback.push('Use at least 8 characters');
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1; else feedback.push('Add lowercase letters');
    if (/[A-Z]/.test(password)) score += 1; else feedback.push('Add uppercase letters');
    if (/[0-9]/.test(password)) score += 1; else feedback.push('Add numbers');
    if (/[^a-zA-Z0-9]/.test(password)) score += 1; else feedback.push('Add special characters');

    let strength = 'Weak';
    let color = 'text-red-500';

    if (score >= 5) {
      strength = 'Strong';
      color = 'text-green-500';
    } else if (score >= 3) {
      strength = 'Medium';
      color = 'text-yellow-500';
    }

    setResult({
      score,
      feedback: feedback.length ? feedback.join(', ') : 'Password is strong!',
      strength,
      color
    });
  };

  return (
    <div className="space-y-6">
      <input
        type="text"
        value={password}
        onChange={e => {
          setPassword(e.target.value);
          if (e.target.value) check();
        }}
        placeholder="Enter password to check..."
        className="w-full px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {result && (
        <div className="bg-zinc-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Strength:</span>
            <span className={`text-xl font-bold ${result.color}`}>{result.strength}</span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                result.score >= 5 ? 'bg-green-500' : result.score >= 3 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${(result.score / 6) * 100}%` }}
            />
          </div>
          <p className="text-sm text-zinc-400">{result.feedback}</p>
        </div>
      )}
    </div>
  );
}
