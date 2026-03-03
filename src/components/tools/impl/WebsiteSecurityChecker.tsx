'use client';
import { useState , memo } from 'react';
import { ShieldCheck, AlertTriangle, Check, X } from 'lucide-react';

const WebsiteSecurityCheckerComponent = function WebsiteSecurityChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{ checks: { name: string; status: 'pass' | 'fail' | 'warn'; detail: string }[]; score: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!url.trim()) return;
    setLoading(true);
    const checks: { name: string; status: 'pass' | 'fail' | 'warn'; detail: string }[] = [];
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http')) normalizedUrl = 'https://' + normalizedUrl;

    // HTTPS Check
    checks.push(normalizedUrl.startsWith('https://') ? { name: 'HTTPS', status: 'pass', detail: 'Site uses HTTPS encryption' } : { name: 'HTTPS', status: 'fail', detail: 'Site does not use HTTPS - data is transmitted in plain text' });

    // DNS & Connectivity
    try {
      const res = await fetch(normalizedUrl, { mode: 'no-cors', signal: AbortSignal.timeout(5000) });
      checks.push({ name: 'Connectivity', status: 'pass', detail: 'Site is reachable and responding' });
    } catch {
      checks.push({ name: 'Connectivity', status: 'warn', detail: 'Could not connect (may be CORS-related)' });
    }

    // URL Analysis 
    const urlObj = new URL(normalizedUrl);
    checks.push(urlObj.hostname.includes('www.') || urlObj.hostname.split('.').length >= 2 ? { name: 'Domain', status: 'pass', detail: `Domain: ${urlObj.hostname}` } : { name: 'Domain', status: 'warn', detail: 'Unusual domain structure' });

    // Mixed Content Check (basic)
    checks.push(!normalizedUrl.includes('http://') || normalizedUrl.startsWith('http://') ? { name: 'Mixed Content', status: 'pass', detail: 'No obvious mixed content issues in URL' } : { name: 'Mixed Content', status: 'warn', detail: 'URL references HTTP resources' });

    // Port Check
    checks.push(!urlObj.port || ['80', '443'].includes(urlObj.port) ? { name: 'Standard Port', status: 'pass', detail: 'Using standard HTTP/HTTPS ports' } : { name: 'Standard Port', status: 'warn', detail: `Non-standard port: ${urlObj.port}` });

    // Subdomain Analysis
    const subdomains = urlObj.hostname.split('.').length - 2;
    checks.push(subdomains <= 1 ? { name: 'Subdomain', status: 'pass', detail: `${subdomains} subdomain level(s) - normal` } : { name: 'Subdomain', status: 'warn', detail: `${subdomains} subdomain levels - excessive subdomains can be suspicious` });

    // Known suspicious patterns
    const suspicious = ['login', 'secure', 'account', 'verify', 'update', 'confirm'].filter(w => urlObj.pathname.toLowerCase().includes(w));
    checks.push(suspicious.length === 0 ? { name: 'Phishing Patterns', status: 'pass', detail: 'No common phishing URL patterns detected' } : { name: 'Phishing Patterns', status: 'warn', detail: `URL contains sensitive keywords: ${suspicious.join(', ')}` });

    // TLD Check
    const tld = urlObj.hostname.split('.').pop() || '';
    const safeTlds = ['com', 'org', 'net', 'edu', 'gov', 'io', 'dev', 'app', 'in', 'co', 'uk', 'de', 'fr', 'jp'];
    checks.push(safeTlds.includes(tld) ? { name: 'TLD Trust', status: 'pass', detail: `.${tld} is a commonly trusted TLD` } : { name: 'TLD Trust', status: 'warn', detail: `.${tld} is less common - verify the domain manually` });

    const score = Math.round((checks.filter(c => c.status === 'pass').length / checks.length) * 100);
    setResult({ checks, score });
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <ShieldCheck className="w-4 h-4 inline mr-2" /><strong>Website Security Checker:</strong> Quick security analysis of any URL - checks HTTPS, domain trust, phishing patterns, and more.
      </div>
      <div className="flex gap-2">
        <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} placeholder="example.com" className="flex-1 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 font-mono" />
        <button onClick={check} disabled={loading} className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50">{loading ? 'Checking...' : 'Check'}</button>
      </div>
      {result && (
        <div className="space-y-3">
          <div className={`rounded-lg p-6 text-center border ${result.score >= 80 ? 'bg-green-900/30 border-green-500/30' : result.score >= 50 ? 'bg-yellow-900/30 border-yellow-500/30' : 'bg-red-900/30 border-red-500/30'}`}>
            <div className="text-4xl font-bold ${result.score >= 80 ? 'text-green-400' : result.score >= 50 ? 'text-yellow-400' : 'text-red-400'}">{result.score}/100</div>
            <div className="text-sm text-gray-300 mt-1">{result.score >= 80 ? 'Looking Good' : result.score >= 50 ? 'Some Concerns' : 'Needs Attention'}</div>
          </div>
          <div className="space-y-2">
            {result.checks.map((c, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${c.status === 'pass' ? 'bg-green-900/10 border-green-500/20' : c.status === 'warn' ? 'bg-yellow-900/10 border-yellow-500/20' : 'bg-red-900/10 border-red-500/20'}`}>
                {c.status === 'pass' ? <Check className="w-5 h-5 text-green-400 mt-0.5" /> : c.status === 'warn' ? <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" /> : <X className="w-5 h-5 text-red-400 mt-0.5" />}
                <div><div className="font-semibold text-sm">{c.name}</div><div className="text-xs text-gray-400">{c.detail}</div></div>
              </div>
            ))}
          </div>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-200">⚠️ This is a basic client-side check. For comprehensive security analysis, use tools like Mozilla Observatory or Qualys SSL Labs.</div>
        </div>
      )}
    </div>
  );
}

export default memo(WebsiteSecurityCheckerComponent);
