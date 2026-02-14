// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/PasswordGenerator.tsx
// Production-Grade Password Generator - Cryptographically Secure
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useEffect } from 'react';

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: '', color: '' });

  // Character sets
  const CHARSET = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  };

  // Generate secure random password
  const generatePassword = () => {
    let charset = '';
    if (options.uppercase) charset += CHARSET.uppercase;
    if (options.lowercase) charset += CHARSET.lowercase;
    if (options.numbers) charset += CHARSET.numbers;
    if (options.symbols) charset += CHARSET.symbols;

    if (charset === '') {
      setPassword('');
      setStrength({ score: 0, label: 'None', color: '#71717A' });
      return;
    }

    // Use crypto.getRandomValues for cryptographic security
    const randomValues = new Uint32Array(options.length);
    crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < options.length; i++) {
      result += charset[randomValues[i] % charset.length];
    }

    // Ensure at least one character from each selected type
    if (options.uppercase && !/[A-Z]/.test(result)) {
      const pos = randomValues[0] % result.length;
      result = result.substring(0, pos) + CHARSET.uppercase[randomValues[1] % CHARSET.uppercase.length] + result.substring(pos + 1);
    }
    if (options.lowercase && !/[a-z]/.test(result)) {
      const pos = randomValues[0] % result.length;
      result = result.substring(0, pos) + CHARSET.lowercase[randomValues[1] % CHARSET.lowercase.length] + result.substring(pos + 1);
    }
    if (options.numbers && !/[0-9]/.test(result)) {
      const pos = randomValues[0] % result.length;
      result = result.substring(0, pos) + CHARSET.numbers[randomValues[1] % CHARSET.numbers.length] + result.substring(pos + 1);
    }
    if (options.symbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(result)) {
      const pos = randomValues[0] % result.length;
      result = result.substring(0, pos) + CHARSET.symbols[randomValues[1] % CHARSET.symbols.length] + result.substring(pos + 1);
    }

    setPassword(result);
    calculateStrength(result);
    setCopied(false);
  };

  // Calculate password strength
  const calculateStrength = (pwd: string) => {
    let score = 0;

    // Length scoring
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;

    // Character variety scoring
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    // No repeating patterns
    if (!/(.)\1{2,}/.test(pwd)) score += 1;

    let label = '';
    let color = '';

    if (score <= 2) {
      label = 'Weak';
      color = '#EF4444';
    } else if (score <= 4) {
      label = 'Fair';
      color = '#F59E0B';
    } else if (score <= 6) {
      label = 'Good';
      color = '#3B82F6';
    } else {
      label = 'Strong';
      color = '#10B981';
    }

    setStrength({ score, label, color });
  };

  // Copy to clipboard with enhanced feedback
  const copyToClipboard = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy password');
    }
  };

  // Generate initial password on mount
  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">

      {/* Password Display */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Generated Password:
        </label>
        <div className="relative">
          <input
            type="text"
            value={password}
            readOnly
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-4 pr-24
                     text-white font-mono text-lg focus:outline-none focus:border-blue-500
                     select-all transition-all"
            placeholder="Configure options below..."
          />
          <button
            onClick={copyToClipboard}
            className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-medium
                     transition-all ${
                       copied
                         ? 'bg-green-600 text-white'
                         : 'bg-blue-600 hover:bg-blue-700 text-white'
                     }`}
          >
            {copied ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </span>
            ) : (
              'Copy'
            )}
          </button>
        </div>
      </div>

      {/* Password Strength Indicator */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">Password Strength:</span>
          <span className="text-sm font-bold" style={{ color: strength.color }}>
            {strength.label}
          </span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{
              width: `${(strength.score / 8) * 100}%`,
              backgroundColor: strength.color,
            }}
          />
        </div>
      </div>

      {/* Length Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-zinc-300">
            Password Length:
          </label>
          <span className="text-sm font-bold text-white bg-zinc-800 px-3 py-1 rounded-lg">
            {options.length}
          </span>
        </div>
        <input
          type="range"
          min="4"
          max="64"
          value={options.length}
          onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
          className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                   [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500
                   [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-xs text-zinc-500 mt-1">
          <span>4</span>
          <span>Recommended: 12-16</span>
          <span>64</span>
        </div>
      </div>

      {/* Character Options */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3">
          Include Characters:
        </label>
        <div className="space-y-3">

          {/* Uppercase */}
          <label className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors group">
            <div>
              <span className="text-white font-medium">Uppercase (A-Z)</span>
              <span className="block text-xs text-zinc-500 mt-0.5">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
            </div>
            <input
              type="checkbox"
              checked={options.uppercase}
              onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
              className="w-5 h-5 rounded border-zinc-600 text-blue-600
                       focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-zinc-900
                       cursor-pointer"
            />
          </label>

          {/* Lowercase */}
          <label className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors group">
            <div>
              <span className="text-white font-medium">Lowercase (a-z)</span>
              <span className="block text-xs text-zinc-500 mt-0.5">abcdefghijklmnopqrstuvwxyz</span>
            </div>
            <input
              type="checkbox"
              checked={options.lowercase}
              onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
              className="w-5 h-5 rounded border-zinc-600 text-blue-600
                       focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-zinc-900
                       cursor-pointer"
            />
          </label>

          {/* Numbers */}
          <label className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors group">
            <div>
              <span className="text-white font-medium">Numbers (0-9)</span>
              <span className="block text-xs text-zinc-500 mt-0.5">0123456789</span>
            </div>
            <input
              type="checkbox"
              checked={options.numbers}
              onChange={(e) => setOptions({ ...options, numbers: e.target.checked })}
              className="w-5 h-5 rounded border-zinc-600 text-blue-600
                       focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-zinc-900
                       cursor-pointer"
            />
          </label>

          {/* Symbols */}
          <label className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors group">
            <div>
              <span className="text-white font-medium">Symbols</span>
              <span className="block text-xs text-zinc-500 mt-0.5 break-all">
                !@#$%^&*()_+-=[]&#123;&#125;|;:,&lt;&gt;?
              </span>
            </div>
            <input
              type="checkbox"
              checked={options.symbols}
              onChange={(e) => setOptions({ ...options, symbols: e.target.checked })}
              className="w-5 h-5 rounded border-zinc-600 text-blue-600
                       focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-zinc-900
                       cursor-pointer"
            />
          </label>

        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg
                 font-semibold rounded-lg transition-all flex items-center justify-center gap-2
                 hover:scale-[1.02] active:scale-[0.98]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Generate New Password
      </button>

      {/* Security Tips */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-sm">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div className="space-y-1 text-zinc-300">
            <p className="font-medium text-green-400">Password Security Tips:</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              <li>Use a unique password for each account</li>
              <li>Aim for at least 12 characters for strong security</li>
              <li>Enable two-factor authentication (2FA) when available</li>
              <li>Store passwords in a reputable password manager</li>
              <li>Never share passwords via email or text</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-zinc-300">
            <strong className="text-blue-400">100% Secure:</strong> Passwords are generated using
            cryptographically secure random values in your browser. Nothing is sent to our servers.
          </p>
        </div>
      </div>

    </div>
  );
}
