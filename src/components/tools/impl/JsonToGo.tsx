'use client';

import { memo, useState, useCallback } from 'react';

function JsonToGo() {
  const [json, setJson] = useState('');
  const [structName, setStructName] = useState('Root');
  const [result, setResult] = useState('');

  const toGoType = (value: any): string => {
    if (value === null) return 'interface{}';
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]interface{}';
      return `[]${toGoType(value[0])}`;
    }
    switch (typeof value) {
      case 'string': return 'string';
      case 'number': return Number.isInteger(value) ? 'int' : 'float64';
      case 'boolean': return 'bool';
      case 'object': return 'struct';
      default: return 'interface{}';
    }
  };

  const toPascalCase = (str: string): string => {
    return str
      .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (_, c) => c.toUpperCase());
  };

  const generateStruct = useCallback((obj: any, name: string, structs: Map<string, string>): string => {
    const fields: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
      const fieldName = toPascalCase(key);
      let goType: string;

      if (value === null) {
        goType = 'interface{}';
      } else if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
          const itemName = fieldName + 'Item';
          generateStruct(value[0], itemName, structs);
          goType = `[]${itemName}`;
        } else {
          goType = toGoType(value);
        }
      } else if (typeof value === 'object') {
        generateStruct(value, fieldName, structs);
        goType = fieldName;
      } else {
        goType = toGoType(value);
      }

      fields.push(`\t${fieldName} ${goType} \`json:"${key}"\``);
    }

    const structStr = `type ${name} struct {\n${fields.join('\n')}\n}`;
    structs.set(name, structStr);
    return structStr;
  }, []);

  const handleConvert = useCallback(() => {
    try {
      const parsed = JSON.parse(json);
      const structs = new Map<string, string>();

      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === 'object') {
          generateStruct(parsed[0], structName, structs);
        } else {
          structs.set(structName, `type ${structName} = ${toGoType(parsed)}`);
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        generateStruct(parsed, structName, structs);
      } else {
        structs.set(structName, `type ${structName} = ${toGoType(parsed)}`);
      }

      setResult(Array.from(structs.values()).reverse().join('\n\n'));
    } catch (e) {
      setResult('Error: Invalid JSON input');
    }
  }, [json, structName, generateStruct]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">JSON to Go Struct Converter</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">JSON Input</label>
            <textarea
              value={json}
              onChange={(e) => setJson(e.target.value)}
              placeholder='{"name": "John", "age": 30, "email": "john@example.com"}'
              rows={8}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Struct Name</label>
            <input
              type="text"
              value={structName}
              onChange={(e) => setStructName(e.target.value)}
              placeholder="Root"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleConvert}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate Go Struct
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Go Struct</h3>
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

export default memo(JsonToGo);
