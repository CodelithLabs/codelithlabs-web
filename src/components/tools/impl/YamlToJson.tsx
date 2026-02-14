'use client';
import { useState } from 'react';

export default function YamlToJson() {
  const [yaml, setYaml] = useState('');
  const [json, setJson] = useState('');

  const convert = () => {
    try {
      // Simple YAML parser (supports basic key-value, nested objects, arrays)
      const yamlToJson = (yamlStr: string): Record<string, unknown> => {
        const lines = yamlStr.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
        const result: Record<string, unknown> = {};
        const stack: Array<{ obj: Record<string, unknown>; indent: number; lastKey?: string }> = [{ obj: result, indent: -1 }];

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
            const stackTop = stack[stack.length - 1];
            const lastKey = stackTop.lastKey;
            if (lastKey && !Array.isArray(stackTop.obj[lastKey])) {
              stackTop.obj[lastKey] = [];
            }
            if (lastKey) {
              (stackTop.obj[lastKey] as unknown[]).push(value);
            }
          } else if (content.includes(':')) {
            // Key-value pair
            const [key, ...valParts] = content.split(':');
            const value = valParts.join(':').trim();
            const stackTop = stack[stack.length - 1];

            if (value === '' || value === '{}' || value === '[]') {
              // Nested object
              stackTop.obj[key.trim()] = {};
              stack.push({ obj: stackTop.obj[key.trim()] as Record<string, unknown>, indent, lastKey: key.trim() });
            } else {
              // Simple value
              stackTop.obj[key.trim()] = value;
              stackTop.lastKey = key.trim();
            }
          }
        }

        return result;
      };

      const result = yamlToJson(yaml);
      setJson(JSON.stringify(result, null, 2));
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      setJson(`Error: ${errorMessage}`);
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
