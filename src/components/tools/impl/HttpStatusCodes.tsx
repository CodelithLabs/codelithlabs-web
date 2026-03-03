'use client';
import { useState, useMemo, memo } from 'react';
import { Info, Search, Copy, Check } from 'lucide-react';

interface HttpStatus {
  code: number;
  name: string;
  description: string;
  category: string;
}

const HTTP_STATUSES: HttpStatus[] = [
  // 1xx Informational
  { code: 100, name: 'Continue', description: 'Server received request headers, client should proceed with body', category: '1xx Informational' },
  { code: 101, name: 'Switching Protocols', description: 'Server is switching protocols as requested', category: '1xx Informational' },
  { code: 102, name: 'Processing', description: 'Server is processing request (WebDAV)', category: '1xx Informational' },
  { code: 103, name: 'Early Hints', description: 'Returns some response headers before final response', category: '1xx Informational' },
  
  // 2xx Success
  { code: 200, name: 'OK', description: 'Request succeeded. Standard response for successful HTTP requests', category: '2xx Success' },
  { code: 201, name: 'Created', description: 'Request succeeded and new resource created. Typical for POST requests', category: '2xx Success' },
  { code: 202, name: 'Accepted', description: 'Request accepted for processing, but not completed yet', category: '2xx Success' },
  { code: 203, name: 'Non-Authoritative Information', description: 'Returned meta-information is not from origin server', category: '2xx Success' },
  { code: 204, name: 'No Content', description: 'Request succeeded but no content to return. Common for DELETE', category: '2xx Success' },
  { code: 205, name: 'Reset Content', description: 'Request succeeded, client should reset document view', category: '2xx Success' },
  { code: 206, name: 'Partial Content', description: 'Partial resource delivered (Range header). Used for resumable downloads', category: '2xx Success' },
  { code: 207, name: 'Multi-Status', description: 'Multiple status codes for multiple resources (WebDAV)', category: '2xx Success' },
  
  // 3xx Redirection
  { code: 300, name: 'Multiple Choices', description: 'Multiple options for the resource', category: '3xx Redirection' },
  { code: 301, name: 'Moved Permanently', description: 'Resource moved permanently. Future requests should use new URL', category: '3xx Redirection' },
  { code: 302, name: 'Found', description: 'Resource temporarily at different URI. Use original for future requests', category: '3xx Redirection' },
  { code: 303, name: 'See Other', description: 'Response found at different URI. Use GET for redirect', category: '3xx Redirection' },
  { code: 304, name: 'Not Modified', description: 'Resource not modified since last request. Use cached version', category: '3xx Redirection' },
  { code: 307, name: 'Temporary Redirect', description: 'Temporary redirect, use same HTTP method', category: '3xx Redirection' },
  { code: 308, name: 'Permanent Redirect', description: 'Permanent redirect, use same HTTP method', category: '3xx Redirection' },
  
  // 4xx Client Error
  { code: 400, name: 'Bad Request', description: 'Malformed request syntax, invalid parameters', category: '4xx Client Error' },
  { code: 401, name: 'Unauthorized', description: 'Authentication required. Include WWW-Authenticate header', category: '4xx Client Error' },
  { code: 402, name: 'Payment Required', description: 'Reserved for future use (digital payment)', category: '4xx Client Error' },
  { code: 403, name: 'Forbidden', description: 'Server understood but refuses to authorize. Authentication won\'t help', category: '4xx Client Error' },
  { code: 404, name: 'Not Found', description: 'Resource not found at specified URI', category: '4xx Client Error' },
  { code: 405, name: 'Method Not Allowed', description: 'HTTP method not allowed for this resource', category: '4xx Client Error' },
  { code: 406, name: 'Not Acceptable', description: 'Can\'t provide content matching Accept headers', category: '4xx Client Error' },
  { code: 407, name: 'Proxy Authentication Required', description: 'Authentication with proxy required', category: '4xx Client Error' },
  { code: 408, name: 'Request Timeout', description: 'Server timed out waiting for request', category: '4xx Client Error' },
  { code: 409, name: 'Conflict', description: 'Request conflicts with current state of resource', category: '4xx Client Error' },
  { code: 410, name: 'Gone', description: 'Resource permanently removed, no forwarding address', category: '4xx Client Error' },
  { code: 411, name: 'Length Required', description: 'Content-Length header required', category: '4xx Client Error' },
  { code: 412, name: 'Precondition Failed', description: 'Precondition in headers evaluated to false', category: '4xx Client Error' },
  { code: 413, name: 'Payload Too Large', description: 'Request entity too large for server to process', category: '4xx Client Error' },
  { code: 414, name: 'URI Too Long', description: 'Request URI too long for server to process', category: '4xx Client Error' },
  { code: 415, name: 'Unsupported Media Type', description: 'Media type not supported by server', category: '4xx Client Error' },
  { code: 416, name: 'Range Not Satisfiable', description: 'Requested range not available', category: '4xx Client Error' },
  { code: 417, name: 'Expectation Failed', description: 'Expect header requirements cannot be met', category: '4xx Client Error' },
  { code: 418, name: 'I\'m a Teapot', description: 'April Fools\' joke RFC 2324. Server refuses to brew coffee', category: '4xx Client Error' },
  { code: 422, name: 'Unprocessable Entity', description: 'Request well-formed but semantic errors (WebDAV)', category: '4xx Client Error' },
  { code: 423, name: 'Locked', description: 'Resource is locked (WebDAV)', category: '4xx Client Error' },
  { code: 429, name: 'Too Many Requests', description: 'Rate limited. Check Retry-After header', category: '4xx Client Error' },
  { code: 451, name: 'Unavailable For Legal Reasons', description: 'Blocked for legal reasons (censorship)', category: '4xx Client Error' },
  
  // 5xx Server Error
  { code: 500, name: 'Internal Server Error', description: 'Generic server error, unexpected condition', category: '5xx Server Error' },
  { code: 501, name: 'Not Implemented', description: 'Server doesn\'t support functionality required', category: '5xx Server Error' },
  { code: 502, name: 'Bad Gateway', description: 'Invalid response from upstream server', category: '5xx Server Error' },
  { code: 503, name: 'Service Unavailable', description: 'Server temporarily unavailable (overload/maintenance)', category: '5xx Server Error' },
  { code: 504, name: 'Gateway Timeout', description: 'Upstream server didn\'t respond in time', category: '5xx Server Error' },
  { code: 505, name: 'HTTP Version Not Supported', description: 'HTTP version in request not supported', category: '5xx Server Error' },
  { code: 507, name: 'Insufficient Storage', description: 'Server unable to store representation (WebDAV)', category: '5xx Server Error' },
  { code: 508, name: 'Loop Detected', description: 'Infinite loop detected while processing (WebDAV)', category: '5xx Server Error' },
  { code: 511, name: 'Network Authentication Required', description: 'Client needs to authenticate for network access', category: '5xx Server Error' },
];

const HttpStatusCodesComponent = function HttpStatusCodes() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const categories = useMemo(() => 
    [...new Set(HTTP_STATUSES.map(s => s.category))], 
  []);

  const filteredStatuses = useMemo(() => {
    return HTTP_STATUSES.filter(status => {
      const matchesSearch = 
        status.code.toString().includes(search) ||
        status.name.toLowerCase().includes(search.toLowerCase()) ||
        status.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = !selectedCategory || status.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const copyCode = (code: number) => {
    navigator.clipboard.writeText(code.toString());
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const getCategoryColor = (category: string) => {
    if (category.startsWith('1xx')) return 'text-blue-400 bg-blue-900/30 border-blue-500/30';
    if (category.startsWith('2xx')) return 'text-green-400 bg-green-900/30 border-green-500/30';
    if (category.startsWith('3xx')) return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30';
    if (category.startsWith('4xx')) return 'text-orange-400 bg-orange-900/30 border-orange-500/30';
    if (category.startsWith('5xx')) return 'text-red-400 bg-red-900/30 border-red-500/30';
    return 'text-zinc-400 bg-zinc-900/30 border-zinc-500/30';
  };

  const getCodeColor = (code: number) => {
    if (code < 200) return 'text-blue-400';
    if (code < 300) return 'text-green-400';
    if (code < 400) return 'text-yellow-400';
    if (code < 500) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Info className="w-4 h-4 inline mr-2" />
        <strong>HTTP Status Codes Reference:</strong> Search and browse all HTTP status codes with descriptions and use cases.
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code, name, or description..."
          className="w-full bg-zinc-800 text-white p-3 pl-10 rounded-lg border border-zinc-700 focus:border-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            !selectedCategory
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          All ({HTTP_STATUSES.length})
        </button>
        {categories.map(cat => {
          const count = HTTP_STATUSES.filter(s => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                selectedCategory === cat
                  ? getCategoryColor(cat)
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {cat.split(' ')[0]} ({count})
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="space-y-2">
        {filteredStatuses.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">No status codes match your search</div>
        ) : (
          filteredStatuses.map(status => (
            <div
              key={status.code}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-start gap-4 hover:border-zinc-700 transition-colors"
            >
              <button
                onClick={() => copyCode(status.code)}
                className={`font-mono text-2xl font-bold min-w-[4rem] text-center ${getCodeColor(status.code)} hover:opacity-80`}
                title="Click to copy"
              >
                {copied === status.code ? <Check className="w-6 h-6 mx-auto" /> : status.code}
              </button>
              <div className="flex-1">
                <div className="font-medium text-white">{status.name}</div>
                <div className="text-sm text-zinc-400 mt-1">{status.description}</div>
              </div>
              <button
                onClick={() => copyCode(status.code)}
                className="p-2 text-zinc-500 hover:text-zinc-300"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Quick Reference */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">Quick Reference:</strong>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
          <div><span className="text-blue-400 font-bold">1xx</span> Informational</div>
          <div><span className="text-green-400 font-bold">2xx</span> Success</div>
          <div><span className="text-yellow-400 font-bold">3xx</span> Redirection</div>
          <div><span className="text-orange-400 font-bold">4xx</span> Client Error</div>
          <div><span className="text-red-400 font-bold">5xx</span> Server Error</div>
        </div>
      </div>
    </div>
  );
};

export default memo(HttpStatusCodesComponent);
