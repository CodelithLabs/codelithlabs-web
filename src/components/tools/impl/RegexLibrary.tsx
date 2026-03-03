'use client';
import { useState, useCallback, memo, useMemo } from 'react';
import { Search, Copy, Check, Code, AlertCircle, TestTube } from 'lucide-react';

interface RegexPattern {
  name: string;
  pattern: string;
  description: string;
  category: string;
  example: string;
  flags?: string;
}

const REGEX_PATTERNS: RegexPattern[] = [
  // Email & Identity
  { name: 'Email Address', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', description: 'Validates standard email format', category: 'Email & Identity', example: 'user@example.com' },
  { name: 'Email (RFC 5322)', pattern: '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])', description: 'RFC 5322 compliant email validation', category: 'Email & Identity', example: 'user@example.com' },
  { name: 'Username', pattern: '^[a-zA-Z0-9_]{3,16}$', description: 'Alphanumeric username, 3-16 chars', category: 'Email & Identity', example: 'john_doe123' },
  
  // Phone Numbers
  { name: 'US Phone', pattern: '^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$', description: 'US phone number with optional formatting', category: 'Phone Numbers', example: '(555) 123-4567' },
  { name: 'International Phone', pattern: '^\\+?[1-9]\\d{1,14}$', description: 'E.164 international phone format', category: 'Phone Numbers', example: '+14155552671' },
  { name: 'Indian Phone', pattern: '^(\\+91[\\-\\s]?)?[0]?(91)?[789]\\d{9}$', description: 'Indian mobile number', category: 'Phone Numbers', example: '+91 9876543210' },
  
  // URLs & Networks
  { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', description: 'HTTP/HTTPS URLs', category: 'URLs & Networks', example: 'https://www.example.com/path?query=1' },
  { name: 'IPv4 Address', pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$', description: 'Valid IPv4 address', category: 'URLs & Networks', example: '192.168.1.1' },
  { name: 'IPv6 Address', pattern: '^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$', description: 'IPv6 address (full form)', category: 'URLs & Networks', example: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' },
  { name: 'MAC Address', pattern: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$', description: 'MAC address with : or - separator', category: 'URLs & Networks', example: '00:1A:2B:3C:4D:5E' },
  
  // Passwords & Security
  { name: 'Strong Password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', description: 'Min 8 chars, uppercase, lowercase, number, special', category: 'Passwords & Security', example: 'Password1!' },
  { name: 'MD5 Hash', pattern: '^[a-fA-F0-9]{32}$', description: 'MD5 hash string', category: 'Passwords & Security', example: 'd41d8cd98f00b204e9800998ecf8427e' },
  { name: 'SHA-256 Hash', pattern: '^[a-fA-F0-9]{64}$', description: 'SHA-256 hash string', category: 'Passwords & Security', example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
  
  // Dates & Times
  { name: 'Date (YYYY-MM-DD)', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$', description: 'ISO 8601 date format', category: 'Dates & Times', example: '2024-03-15' },
  { name: 'Date (MM/DD/YYYY)', pattern: '^(0[1-9]|1[0-2])\\/(0[1-9]|[12][0-9]|3[01])\\/\\d{4}$', description: 'US date format', category: 'Dates & Times', example: '03/15/2024' },
  { name: 'Date (DD/MM/YYYY)', pattern: '^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}$', description: 'European date format', category: 'Dates & Times', example: '15/03/2024' },
  { name: 'Time (24h)', pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$', description: '24-hour time format', category: 'Dates & Times', example: '14:30:00' },
  { name: 'Time (12h)', pattern: '^(0?[1-9]|1[0-2]):[0-5][0-9]\\s?(AM|PM|am|pm)$', description: '12-hour time with AM/PM', category: 'Dates & Times', example: '2:30 PM' },
  
  // Credit Cards
  { name: 'Credit Card (Generic)', pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$', description: 'Visa, Mastercard, Amex, Discover', category: 'Financial', example: '4111111111111111' },
  { name: 'CVV/CVC', pattern: '^[0-9]{3,4}$', description: 'Credit card security code', category: 'Financial', example: '123' },
  
  // Numbers & Currency
  { name: 'Integer', pattern: '^-?\\d+$', description: 'Positive or negative integer', category: 'Numbers', example: '-42' },
  { name: 'Decimal', pattern: '^-?\\d*\\.?\\d+$', description: 'Decimal number', category: 'Numbers', example: '3.14159' },
  { name: 'Currency (USD)', pattern: '^\\$?\\d{1,3}(,\\d{3})*(\\.\\d{2})?$', description: 'US dollar format', category: 'Numbers', example: '$1,234.56' },
  { name: 'Percentage', pattern: '^-?\\d+(\\.\\d+)?%$', description: 'Percentage value', category: 'Numbers', example: '50.5%' },
  { name: 'Hex Color', pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$', description: 'Hex color code', category: 'Numbers', example: '#FF5733' },
  
  // Text Patterns
  { name: 'Slug', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', description: 'URL-friendly slug', category: 'Text Patterns', example: 'my-blog-post-title' },
  { name: 'Alphanumeric', pattern: '^[a-zA-Z0-9]+$', description: 'Only letters and numbers', category: 'Text Patterns', example: 'abc123' },
  { name: 'No Special Chars', pattern: '^[a-zA-Z0-9\\s]+$', description: 'Letters, numbers, spaces only', category: 'Text Patterns', example: 'Hello World 123' },
  { name: 'HTML Tag', pattern: '<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)', description: 'Match HTML tags', category: 'Text Patterns', example: '<div class="container">content</div>' },
  
  // IDs & Codes
  { name: 'UUID v4', pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$', description: 'UUID version 4', category: 'IDs & Codes', example: '550e8400-e29b-41d4-a716-446655440000' },
  { name: 'US SSN', pattern: '^(?!000|666|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0000)\\d{4}$', description: 'US Social Security Number', category: 'IDs & Codes', example: '123-45-6789' },
  { name: 'US ZIP Code', pattern: '^\\d{5}(-\\d{4})?$', description: 'US ZIP code with optional +4', category: 'IDs & Codes', example: '12345-6789' },
  { name: 'Indian PIN Code', pattern: '^[1-9][0-9]{5}$', description: 'Indian postal code', category: 'IDs & Codes', example: '400001' },
  { name: 'UK Postcode', pattern: '^([A-Z]{1,2}\\d[A-Z\\d]? ?\\d[A-Z]{2}|GIR ?0AA)$', description: 'UK postcode format', category: 'IDs & Codes', example: 'SW1A 1AA' },
  
  // File & Code
  { name: 'File Extension', pattern: '\\.[a-zA-Z0-9]+$', description: 'Extract file extension', category: 'Files & Code', example: 'document.pdf' },
  { name: 'Image Files', pattern: '\\.(jpg|jpeg|png|gif|webp|svg|bmp)$', description: 'Common image extensions', category: 'Files & Code', example: 'photo.jpg', flags: 'i' },
  { name: 'Variable Name (JS)', pattern: '^[a-zA-Z_$][a-zA-Z0-9_$]*$', description: 'Valid JavaScript variable', category: 'Files & Code', example: 'myVariable' },
];

const RegexLibraryComponent = function RegexLibrary() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [testInput, setTestInput] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<RegexPattern | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const categories = useMemo(() => {
    return [...new Set(REGEX_PATTERNS.map(p => p.category))];
  }, []);

  const filteredPatterns = useMemo(() => {
    return REGEX_PATTERNS.filter(p => {
      const matchesSearch = search === '' || 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === '' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const copyPattern = useCallback(async (pattern: string, idx: number) => {
    await navigator.clipboard.writeText(pattern);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }, []);

  const testPattern = useCallback((pattern: RegexPattern) => {
    setSelectedPattern(pattern);
    setTestInput(pattern.example);
  }, []);

  const testResult = useMemo(() => {
    if (!selectedPattern || !testInput) return null;
    try {
      const regex = new RegExp(selectedPattern.pattern, selectedPattern.flags || '');
      const matches = testInput.match(regex);
      return {
        isMatch: regex.test(testInput),
        matches,
      };
    } catch {
      return { isMatch: false, matches: null, error: true };
    }
  }, [selectedPattern, testInput]);

  return (
    <div className="space-y-4">
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 text-sm text-purple-200">
        <Code className="w-4 h-4 inline mr-2" />
        <strong>Regex Library:</strong> Common regex patterns for validation, parsing, and matching. Click to copy or test patterns.
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patterns..."
            className="w-full bg-zinc-900 text-white p-2 pl-10 rounded-lg border border-zinc-800"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-zinc-900 text-white p-2 rounded-lg border border-zinc-800"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Test Panel */}
      {selectedPattern && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TestTube className="w-4 h-4 text-purple-400" />
              <span className="font-medium text-white">Testing: {selectedPattern.name}</span>
            </div>
            <button
              onClick={() => setSelectedPattern(null)}
              className="text-zinc-500 hover:text-zinc-300 text-sm"
            >
              Close
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Enter test string..."
              className="flex-1 bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
            <div className={`px-4 py-2 rounded font-medium ${
              testResult?.isMatch 
                ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                : 'bg-red-900/30 text-red-400 border border-red-500/30'
            }`}>
              {testResult?.isMatch ? '✓ Match' : '✗ No Match'}
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-500 font-mono bg-zinc-800 p-2 rounded">
            /{selectedPattern.pattern}/{selectedPattern.flags || ''}
          </div>
        </div>
      )}

      {/* Pattern List */}
      <div className="space-y-2">
        {filteredPatterns.map((pattern, idx) => (
          <div 
            key={idx}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{pattern.name}</span>
                  <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded">
                    {pattern.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{pattern.description}</p>
                <code className="text-xs text-purple-300 bg-zinc-800 px-2 py-1 rounded mt-2 block overflow-x-auto">
                  {pattern.pattern}
                </code>
                <div className="text-xs text-zinc-600 mt-1">
                  Example: <span className="text-zinc-400">{pattern.example}</span>
                </div>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => testPattern(pattern)}
                  className="p-2 text-zinc-500 hover:text-purple-400 hover:bg-zinc-800 rounded"
                  title="Test pattern"
                >
                  <TestTube className="w-4 h-4" />
                </button>
                <button
                  onClick={() => copyPattern(pattern.pattern, idx)}
                  className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-zinc-800 rounded"
                  title="Copy pattern"
                >
                  {copiedIdx === idx ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredPatterns.length === 0 && (
          <div className="text-center py-8 text-zinc-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No patterns found matching your search.</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="text-center text-xs text-zinc-500">
        Showing {filteredPatterns.length} of {REGEX_PATTERNS.length} patterns
      </div>

      {/* Regex Cheatsheet */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">Quick Regex Reference</h4>
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-zinc-500 mb-1">Characters</div>
            <div className="space-y-0.5 text-zinc-400">
              <div><code className="text-purple-300">.</code> Any character</div>
              <div><code className="text-purple-300">\\d</code> Digit [0-9]</div>
              <div><code className="text-purple-300">\\w</code> Word char [a-zA-Z0-9_]</div>
              <div><code className="text-purple-300">\\s</code> Whitespace</div>
            </div>
          </div>
          <div>
            <div className="text-zinc-500 mb-1">Quantifiers</div>
            <div className="space-y-0.5 text-zinc-400">
              <div><code className="text-purple-300">*</code> 0 or more</div>
              <div><code className="text-purple-300">+</code> 1 or more</div>
              <div><code className="text-purple-300">?</code> 0 or 1</div>
              <div><code className="text-purple-300">{'{n,m}'}</code> n to m times</div>
            </div>
          </div>
          <div>
            <div className="text-zinc-500 mb-1">Anchors</div>
            <div className="space-y-0.5 text-zinc-400">
              <div><code className="text-purple-300">^</code> Start of string</div>
              <div><code className="text-purple-300">$</code> End of string</div>
              <div><code className="text-purple-300">\\b</code> Word boundary</div>
              <div><code className="text-purple-300">(?=...)</code> Lookahead</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(RegexLibraryComponent);
