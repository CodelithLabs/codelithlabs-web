'use client';
import { useState } from 'react';

export default function YamlToJson() {
  const [yaml, setYaml] = useState('');
  const [json, setJson] = useState('');

  const convert = () => {
    try {
      // Simple YAML parser (supports basic key-value, nested objects, arrays)
      const yamlToJson = (yamlStr: string): any => {
        const lines = yamlStr.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
        const result: any = {};
        const stack: any[] = [{ obj: result, indent: -1 }];

        for (const line of lines) {
          const indent = line.search(/\S/);
          const content = line.trim();

          // Pop stack to correct level
          while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
            stack.pop();
          }

          if (content.startsWith('- ')) {
            // Array item
            const value = content.substring(2).trim();
            const parent = stack[stack.length - 1].obj;
            if (!Array.isArray(parent[parent._lastKey])) {
              parent[parent._lastKey] = [];
            }
            parent[parent._lastKey].push(value);
          } else if (content.includes(':')) {
            // Key-value pair
            const [key, ...valParts] = content.split(':');
            const value = valParts.join(':').trim();
            const parent = stack[stack.length - 1].obj;

            if (value === '' || value === '{}' || value === '[]') {
              // Nested object
              parent[key.trim()] = {};
              parent._lastKey = key.trim();
              stack.push({ obj: parent[key.trim()], indent });
            } else {
              // Simple value
              parent[key.trim()] = value;
              parent._lastKey = key.trim();
            }
          }
        }

        // Clean up helper properties
        const clean = (obj: any): any => {
          if (typeof obj !== 'object' || obj === null) return obj;
          delete obj._lastKey;
          for (const key in obj) {
            obj[key] = clean(obj[key]);
          }
          return obj;
        };

        return clean(result);
      };

      const result = yamlToJson(yaml);
      setJson(JSON.stringify(result, null, 2));
    } catch (e: any) {
      setJson(`Error: ${e.message}`);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <textarea
        value={yaml}
        onChange={e => setYaml(e.target.value)}
        className="h-64 bg-zinc-800 p-4 rounded text-white font-mono"
        placeholder="name: John&#10;age: 30&#10;skills:&#10;  - JavaScript&#10;  - TypeScript"
      />
      <textarea
        readOnly
        value={json}
        className="h-64 bg-zinc-900 p-4 rounded text-green-400 font-mono"
        placeholder="JSON Output"
      />
      <button
        onClick={convert}
        className="col-span-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Convert to JSON
      </button>
    </div>
  );
}
