'use client';

import { memo, useState, useCallback } from 'react';

function CurlToFetch() {
  const [curl, setCurl] = useState('');
  const [result, setResult] = useState('');

  const handleConvert = useCallback(() => {
    try {
      let curlCmd = curl.trim();
      
      // Extract URL
      const urlMatch = curlCmd.match(/curl\s+(?:['"]([^'"]+)['"]|([^\s]+))/i) || 
                       curlCmd.match(/(?:^|\s)['"]?(https?:\/\/[^\s'"]+)['"]?/);
      const url = urlMatch?.[1] || urlMatch?.[2] || '';

      if (!url) {
        setResult('Error: Could not parse URL from curl command');
        return;
      }

      // Extract method
      let method = 'GET';
      const methodMatch = curlCmd.match(/-X\s+['"]?(\w+)['"]?/i);
      if (methodMatch) {
        method = methodMatch[1].toUpperCase();
      } else if (curlCmd.includes('-d') || curlCmd.includes('--data')) {
        method = 'POST';
      }

      // Extract headers
      const headers: { [key: string]: string } = {};
      const headerRegex = /-H\s+['"]([^:]+):\s*([^'"]+)['"]/gi;
      let headerMatch;
      while ((headerMatch = headerRegex.exec(curlCmd)) !== null) {
        headers[headerMatch[1].trim()] = headerMatch[2].trim();
      }

      // Extract data
      let body = '';
      const dataMatch = curlCmd.match(/(?:--data|-d)\s+['"]([^'"]+)['"]/);
      if (dataMatch) {
        body = dataMatch[1];
      }

      // Build fetch code
      let fetchCode = `const response = await fetch('${url}'`;
      
      const hasOptions = method !== 'GET' || Object.keys(headers).length > 0 || body;
      
      if (hasOptions) {
        fetchCode += ', {\n';
        
        if (method !== 'GET') {
          fetchCode += `  method: '${method}',\n`;
        }
        
        if (Object.keys(headers).length > 0) {
          fetchCode += '  headers: {\n';
          for (const [key, value] of Object.entries(headers)) {
            fetchCode += `    '${key}': '${value}',\n`;
          }
          fetchCode += '  },\n';
        }
        
        if (body) {
          // Try to parse as JSON
          try {
            JSON.parse(body);
            fetchCode += `  body: JSON.stringify(${body}),\n`;
          } catch {
            fetchCode += `  body: '${body.replace(/'/g, "\\'")}',\n`;
          }
        }
        
        fetchCode += '}';
      }
      
      fetchCode += ');\n\n';
      fetchCode += 'const data = await response.json();\n';
      fetchCode += 'console.log(data);';

      setResult(fetchCode);
    } catch (e) {
      setResult('Error: Could not parse curl command');
    }
  }, [curl]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">cURL to Fetch Converter</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">cURL Command</label>
            <textarea
              value={curl}
              onChange={(e) => setCurl(e.target.value)}
              placeholder={`curl -X POST 'https://api.example.com/data' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer token123' \\
  -d '{"name": "John", "email": "john@example.com"}'`}
              rows={8}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          <button
            onClick={handleConvert}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Convert to Fetch
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">JavaScript Fetch</h3>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
            >
              Copy
            </button>
          </div>
          <pre className="bg-zinc-900 rounded-lg p-4 text-green-400 text-sm overflow-x-auto font-mono whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

export default memo(CurlToFetch);
