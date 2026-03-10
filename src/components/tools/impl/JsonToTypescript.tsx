'use client';

import { memo, useState, useCallback } from 'react';

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

function getType(value: JsonValue): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'any[]';
    const types = [...new Set(value.map(getType))];
    if (types.length === 1) return `${types[0]}[]`;
    return `(${types.join(' | ')})[]`;
  }
  switch (typeof value) {
    case 'string': return 'string';
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    case 'object': return 'object';
    default: return 'any';
  }
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (_, c: string) => c.toUpperCase());
}

function generateInterface(
  obj: Record<string, JsonValue>,
  name: string,
  interfaces: Map<string, string>,
  useInterface: boolean,
): string {
  const keyword = useInterface ? 'interface' : 'type';
  const equals = useInterface ? '' : ' =';
  const lines: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    let type: string;

    if (value === null) {
      type = 'null';
    } else if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null && !Array.isArray(value[0])) {
        const itemName = `${toPascalCase(key)}Item`;
        generateInterface(value[0] as Record<string, JsonValue>, itemName, interfaces, useInterface);
        type = `${itemName}[]`;
      } else {
        type = getType(value);
      }
    } else if (typeof value === 'object') {
      const nestedName = toPascalCase(key);
      generateInterface(value as Record<string, JsonValue>, nestedName, interfaces, useInterface);
      type = nestedName;
    } else {
      type = getType(value);
    }

    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
    lines.push(`  ${safeKey}: ${type};`);
  }

  const interfaceStr = `${keyword} ${name}${equals} {\n${lines.join('\n')}\n}`;
  interfaces.set(name, interfaceStr);
  return interfaceStr;
}

function JsonToTypescript() {
  const [json, setJson] = useState('');
  const [rootName, setRootName] = useState('Root');
  const [useInterface, setUseInterface] = useState(true);
  const [result, setResult] = useState('');

  const handleConvert = useCallback(() => {
    try {
      const parsed = JSON.parse(json) as JsonValue;
      const interfaces = new Map<string, string>();

      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0] !== null && !Array.isArray(parsed[0])) {
          generateInterface(parsed[0] as Record<string, JsonValue>, rootName, interfaces, useInterface);
          const mainType = `type ${rootName}Array = ${rootName}[];`;
          interfaces.set(rootName + 'Array', mainType);
        } else {
          interfaces.set(rootName, `type ${rootName} = ${getType(parsed)};`);
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        generateInterface(parsed as Record<string, JsonValue>, rootName, interfaces, useInterface);
      } else {
        interfaces.set(rootName, `type ${rootName} = ${getType(parsed)};`);
      }

      setResult(Array.from(interfaces.values()).join('\n\n'));
    } catch (e) {
      setResult('Error: Invalid JSON input');
    }
  }, [json, rootName, useInterface]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">JSON to TypeScript Converter</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">JSON Input</label>
            <textarea
              value={json}
              onChange={(e) => setJson(e.target.value)}
              placeholder='{"name": "John", "age": 30, "active": true}'
              rows={8}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Root Type Name</label>
              <input
                type="text"
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                placeholder="Root"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useInterface}
                  onChange={(e) => setUseInterface(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-zinc-300 text-sm">Use interface (vs type)</span>
              </label>
            </div>
          </div>
          <button
            onClick={handleConvert}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate TypeScript
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">TypeScript Output</h3>
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

export default memo(JsonToTypescript);
