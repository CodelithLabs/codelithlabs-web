'use client';
import { useState , memo } from 'react';

const JsonToYamlComponent = function JsonToYaml() {
  const [json, setJson] = useState('');
  const [yaml, setYaml] = useState('');

  const convert = () => {
    try {
      const obj = JSON.parse(json);
      // Simple recursive YAML serializer (Production use usually requires a lib like js-yaml, this is a basic version)
      const toYaml = (data: unknown, indent = 0): string => {
        if (typeof data !== 'object' || data === null) return String(data);
        const space = ' '.repeat(indent);
        const dataObj = data as Record<string, unknown>;
        return Object.keys(dataObj).map(k => `${space}${k}: ${typeof dataObj[k] === 'object' ? '\n' + toYaml(dataObj[k], indent + 2) : dataObj[k]}`).join('\n');
      };
      setYaml(toYaml(obj));
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Invalid JSON';
      setYaml(errorMessage);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <textarea value={json} onChange={e => setJson(e.target.value)} className="h-64 bg-zinc-800 p-4 rounded text-white" placeholder="JSON Input" />
      <textarea readOnly value={yaml} className="h-64 bg-zinc-900 p-4 rounded text-green-400" placeholder="YAML Output" />
      <button onClick={convert} className="col-span-full py-2 bg-blue-600 text-white rounded">Convert</button>
    </div>
  );
}

export default memo(JsonToYamlComponent);
