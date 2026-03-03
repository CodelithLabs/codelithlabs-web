'use client';
import { useState, useCallback, memo } from 'react';
import { MapPin, Check, AlertTriangle, X, Plus, Trash2, Copy } from 'lucide-react';

interface NapEntry {
  source: string;
  name: string;
  address: string;
  phone: string;
  url?: string;
}

interface NapIssue {
  field: 'name' | 'address' | 'phone';
  source: string;
  expected: string;
  found: string;
  severity: 'error' | 'warning';
}

const NapCheckerComponent = function NapChecker() {
  const [canonical, setCanonical] = useState<NapEntry>({
    source: 'Canonical (Your Website)',
    name: '',
    address: '',
    phone: '',
    url: '',
  });
  const [citations, setCitations] = useState<NapEntry[]>([
    { source: 'Google Business Profile', name: '', address: '', phone: '', url: '' },
    { source: 'Yelp', name: '', address: '', phone: '', url: '' },
  ]);
  const [issues, setIssues] = useState<NapIssue[]>([]);
  const [checked, setChecked] = useState(false);

  const commonSources = [
    'Google Business Profile',
    'Yelp',
    'Facebook',
    'Apple Maps',
    'Bing Places',
    'Yellow Pages',
    'BBB',
    'TripAdvisor',
    'Foursquare',
    'Angi',
    'LinkedIn',
    'Citysearch',
  ];

  const addCitation = (source?: string) => {
    setCitations(prev => [...prev, {
      source: source || 'Custom Source',
      name: '',
      address: '',
      phone: '',
      url: '',
    }]);
  };

  const removeCitation = (idx: number) => {
    setCitations(prev => prev.filter((_, i) => i !== idx));
  };

  const updateCanonical = (field: keyof NapEntry, value: string) => {
    setCanonical(prev => ({ ...prev, [field]: value }));
    setChecked(false);
  };

  const updateCitation = (idx: number, field: keyof NapEntry, value: string) => {
    setCitations(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
    setChecked(false);
  };

  const normalizeString = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[.,#\-()]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/street/gi, 'st')
      .replace(/avenue/gi, 'ave')
      .replace(/road/gi, 'rd')
      .replace(/drive/gi, 'dr')
      .replace(/boulevard/gi, 'blvd')
      .replace(/suite/gi, 'ste')
      .trim();
  };

  const normalizePhone = (phone: string): string => {
    return phone.replace(/\D/g, '');
  };

  const checkConsistency = useCallback(() => {
    const foundIssues: NapIssue[] = [];

    citations.forEach(citation => {
      // Check name
      if (citation.name && normalizeString(citation.name) !== normalizeString(canonical.name)) {
        foundIssues.push({
          field: 'name',
          source: citation.source,
          expected: canonical.name,
          found: citation.name,
          severity: 'error',
        });
      }

      // Check address
      if (citation.address && normalizeString(citation.address) !== normalizeString(canonical.address)) {
        foundIssues.push({
          field: 'address',
          source: citation.source,
          expected: canonical.address,
          found: citation.address,
          severity: 'error',
        });
      }

      // Check phone
      if (citation.phone && normalizePhone(citation.phone) !== normalizePhone(canonical.phone)) {
        foundIssues.push({
          field: 'phone',
          source: citation.source,
          expected: canonical.phone,
          found: citation.phone,
          severity: 'warning',
        });
      }
    });

    setIssues(foundIssues);
    setChecked(true);
  }, [canonical, citations]);

  const getSourceStatus = (source: string) => {
    const sourceIssues = issues.filter(i => i.source === source);
    if (sourceIssues.length === 0) return 'ok';
    if (sourceIssues.some(i => i.severity === 'error')) return 'error';
    return 'warning';
  };

  const copyReport = () => {
    let report = `NAP Consistency Report\n${'='.repeat(40)}\n\n`;
    report += `CANONICAL INFORMATION\n`;
    report += `Name: ${canonical.name}\n`;
    report += `Address: ${canonical.address}\n`;
    report += `Phone: ${canonical.phone}\n\n`;

    if (issues.length === 0) {
      report += `✅ All citations are consistent!\n`;
    } else {
      report += `ISSUES FOUND (${issues.length})\n${'-'.repeat(20)}\n`;
      issues.forEach(issue => {
        report += `\n${issue.source} - ${issue.field.toUpperCase()}\n`;
        report += `  Expected: ${issue.expected}\n`;
        report += `  Found: ${issue.found}\n`;
      });
    }

    navigator.clipboard.writeText(report);
  };

  const unusedSources = commonSources.filter(
    s => !citations.some(c => c.source === s)
  );

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <MapPin className="w-4 h-4 inline mr-2" />
        <strong>NAP Checker:</strong> Verify Name, Address, Phone consistency across your business citations for local SEO health.
      </div>

      {/* Canonical Information */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">Your Official NAP (Canonical)</h4>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Business Name</label>
            <input
              type="text"
              value={canonical.name}
              onChange={(e) => updateCanonical('name', e.target.value)}
              placeholder="Your Exact Business Name"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Address</label>
            <input
              type="text"
              value={canonical.address}
              onChange={(e) => updateCanonical('address', e.target.value)}
              placeholder="123 Main St, Suite 100, City, ST 12345"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Phone Number</label>
            <input
              type="tel"
              value={canonical.phone}
              onChange={(e) => updateCanonical('phone', e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Citations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-zinc-300">Citations to Check</h4>
          <div className="flex gap-2">
            <select
              onChange={(e) => e.target.value && addCitation(e.target.value)}
              className="bg-zinc-800 text-zinc-300 text-sm p-1 rounded border border-zinc-700"
              value=""
            >
              <option value="">Add source...</option>
              {unusedSources.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={() => addCitation()}
              className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded"
            >
              <Plus className="w-3 h-3 inline mr-1" />
              Custom
            </button>
          </div>
        </div>

        {citations.map((citation, idx) => (
          <div
            key={idx}
            className={`bg-zinc-900 border rounded-lg p-4 ${
              checked
                ? getSourceStatus(citation.source) === 'ok'
                  ? 'border-green-500/50'
                  : getSourceStatus(citation.source) === 'error'
                  ? 'border-red-500/50'
                  : 'border-orange-500/50'
                : 'border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {checked && (
                  getSourceStatus(citation.source) === 'ok' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : getSourceStatus(citation.source) === 'error' ? (
                    <X className="w-4 h-4 text-red-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                  )
                )}
                <input
                  type="text"
                  value={citation.source}
                  onChange={(e) => updateCitation(idx, 'source', e.target.value)}
                  className="bg-transparent text-zinc-300 font-medium"
                />
              </div>
              <button
                onClick={() => removeCitation(idx)}
                className="p-1 text-zinc-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <input
                type="text"
                value={citation.name}
                onChange={(e) => updateCitation(idx, 'name', e.target.value)}
                placeholder="Business Name"
                className={`bg-zinc-800 text-white p-2 rounded border text-sm ${
                  checked && issues.some(i => i.source === citation.source && i.field === 'name')
                    ? 'border-red-500'
                    : 'border-zinc-700'
                }`}
              />
              <input
                type="text"
                value={citation.address}
                onChange={(e) => updateCitation(idx, 'address', e.target.value)}
                placeholder="Address"
                className={`bg-zinc-800 text-white p-2 rounded border text-sm ${
                  checked && issues.some(i => i.source === citation.source && i.field === 'address')
                    ? 'border-red-500'
                    : 'border-zinc-700'
                }`}
              />
              <input
                type="text"
                value={citation.phone}
                onChange={(e) => updateCitation(idx, 'phone', e.target.value)}
                placeholder="Phone"
                className={`bg-zinc-800 text-white p-2 rounded border text-sm ${
                  checked && issues.some(i => i.source === citation.source && i.field === 'phone')
                    ? 'border-orange-500'
                    : 'border-zinc-700'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Check Button */}
      <button
        onClick={checkConsistency}
        disabled={!canonical.name || !canonical.address || !canonical.phone}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium"
      >
        Check NAP Consistency
      </button>

      {/* Results */}
      {checked && (
        <div className="space-y-4">
          {/* Summary */}
          <div className={`rounded-lg p-4 ${
            issues.length === 0 
              ? 'bg-green-900/20 border border-green-500/30'
              : 'bg-red-900/20 border border-red-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {issues.length === 0 ? (
                  <>
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-green-200 font-medium">All citations are consistent!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-red-200 font-medium">{issues.length} inconsistencies found</span>
                  </>
                )}
              </div>
              <button
                onClick={copyReport}
                className="text-xs text-zinc-400 hover:text-zinc-300 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copy Report
              </button>
            </div>
          </div>

          {/* Issue Details */}
          {issues.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-zinc-300">Issues Found</h4>
              {issues.map((issue, idx) => (
                <div key={idx} className="border-l-2 border-red-500 pl-3 py-1">
                  <div className="text-sm text-zinc-300">
                    <strong>{issue.source}</strong> - {issue.field}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    <span className="text-green-400">Expected:</span> {issue.expected}
                  </div>
                  <div className="text-xs text-zinc-500">
                    <span className="text-red-400">Found:</span> {issue.found}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">Why NAP Consistency Matters:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Consistent NAP signals trust to search engines</li>
          <li>• Inconsistencies can hurt local search rankings</li>
          <li>• Focus on major directories first (Google, Yelp, Facebook)</li>
          <li>• Use exact formatting everywhere (St vs Street)</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(NapCheckerComponent);
