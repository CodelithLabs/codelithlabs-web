'use client';
import { useState, useCallback, memo } from 'react';
import { Braces, Copy, Plus, Trash2, Play, AlertCircle } from 'lucide-react';

interface QueryField {
  name: string;
  alias?: string;
  args: { name: string; value: string }[];
  subFields: QueryField[];
}

const GraphqlQueryBuilderComponent = function GraphqlQueryBuilder() {
  const [operationType, setOperationType] = useState<'query' | 'mutation'>('query');
  const [operationName, setOperationName] = useState('');
  const [fields, setFields] = useState<QueryField[]>([
    { name: 'users', alias: '', args: [{ name: 'limit', value: '10' }], subFields: [
      { name: 'id', alias: '', args: [], subFields: [] },
      { name: 'name', alias: '', args: [], subFields: [] },
      { name: 'email', alias: '', args: [], subFields: [] },
    ]},
  ]);
  const [variables, setVariables] = useState('');
  const [copied, setCopied] = useState(false);

  const addField = useCallback((parentPath: number[] = []) => {
    const newField: QueryField = { name: '', alias: '', args: [], subFields: [] };
    
    setFields(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (parentPath.length === 0) {
        clone.push(newField);
      } else {
        let target = clone;
        for (let i = 0; i < parentPath.length - 1; i++) {
          target = target[parentPath[i]].subFields;
        }
        target[parentPath[parentPath.length - 1]].subFields.push(newField);
      }
      return clone;
    });
  }, []);

  const removeField = useCallback((path: number[]) => {
    setFields(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (path.length === 1) {
        clone.splice(path[0], 1);
      } else {
        let target = clone;
        for (let i = 0; i < path.length - 2; i++) {
          target = target[path[i]].subFields;
        }
        target[path[path.length - 2]].subFields.splice(path[path.length - 1], 1);
      }
      return clone;
    });
  }, []);

  const updateField = useCallback((path: number[], updates: Partial<QueryField>) => {
    setFields(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      let target = clone;
      for (let i = 0; i < path.length - 1; i++) {
        target = target[path[i]].subFields;
      }
      target[path[path.length - 1]] = { ...target[path[path.length - 1]], ...updates };
      return clone;
    });
  }, []);

  const generateQuery = useCallback(() => {
    const buildField = (field: QueryField, indent: number): string => {
      if (!field.name) return '';
      
      const spaces = '  '.repeat(indent);
      let line = spaces;
      
      if (field.alias) {
        line += `${field.alias}: `;
      }
      line += field.name;
      
      if (field.args.length > 0) {
        const args = field.args
          .filter(a => a.name && a.value)
          .map(a => {
            // Detect if value should be quoted
            const isNumber = /^\d+$/.test(a.value);
            const isBoolean = ['true', 'false'].includes(a.value.toLowerCase());
            const isVariable = a.value.startsWith('$');
            const isNull = a.value === 'null';
            
            if (isNumber || isBoolean || isVariable || isNull) {
              return `${a.name}: ${a.value}`;
            }
            return `${a.name}: "${a.value}"`;
          })
          .join(', ');
        if (args) {
          line += `(${args})`;
        }
      }
      
      if (field.subFields.length > 0) {
        const subFieldLines = field.subFields
          .map(sf => buildField(sf, indent + 1))
          .filter(l => l)
          .join('\n');
        if (subFieldLines) {
          line += ` {\n${subFieldLines}\n${spaces}}`;
        }
      }
      
      return line;
    };

    let query = operationType;
    if (operationName) {
      query += ` ${operationName}`;
    }
    query += ' {\n';
    
    fields.forEach(field => {
      const fieldStr = buildField(field, 1);
      if (fieldStr) {
        query += fieldStr + '\n';
      }
    });
    
    query += '}';
    return query;
  }, [operationType, operationName, fields]);

  const renderFieldEditor = (field: QueryField, path: number[], depth: number = 0) => (
    <div key={path.join('-')} className={`${depth > 0 ? 'ml-4 pl-4 border-l border-zinc-700' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={field.alias}
          onChange={(e) => updateField(path, { alias: e.target.value })}
          placeholder="alias"
          className="w-20 bg-zinc-800 text-zinc-400 p-1.5 rounded border border-zinc-700 text-xs"
        />
        <span className="text-zinc-500">:</span>
        <input
          type="text"
          value={field.name}
          onChange={(e) => updateField(path, { name: e.target.value })}
          placeholder="fieldName"
          className="flex-1 bg-zinc-800 text-white p-1.5 rounded border border-zinc-700 text-sm font-mono"
        />
        <button
          onClick={() => {
            const newArgs = [...field.args, { name: '', value: '' }];
            updateField(path, { args: newArgs });
          }}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          +arg
        </button>
        <button
          onClick={() => addField(path)}
          className="text-xs text-green-400 hover:text-green-300"
        >
          +sub
        </button>
        <button
          onClick={() => removeField(path)}
          className="p-1 text-zinc-500 hover:text-red-400"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Arguments */}
      {field.args.length > 0 && (
        <div className="ml-4 mb-2 space-y-1">
          {field.args.map((arg, argIdx) => (
            <div key={argIdx} className="flex items-center gap-2">
              <input
                type="text"
                value={arg.name}
                onChange={(e) => {
                  const newArgs = [...field.args];
                  newArgs[argIdx] = { ...newArgs[argIdx], name: e.target.value };
                  updateField(path, { args: newArgs });
                }}
                placeholder="argName"
                className="w-24 bg-zinc-800 text-zinc-300 p-1 rounded border border-zinc-700 text-xs"
              />
              <span className="text-zinc-600">:</span>
              <input
                type="text"
                value={arg.value}
                onChange={(e) => {
                  const newArgs = [...field.args];
                  newArgs[argIdx] = { ...newArgs[argIdx], value: e.target.value };
                  updateField(path, { args: newArgs });
                }}
                placeholder="value"
                className="flex-1 bg-zinc-800 text-zinc-300 p-1 rounded border border-zinc-700 text-xs"
              />
              <button
                onClick={() => {
                  const newArgs = field.args.filter((_, i) => i !== argIdx);
                  updateField(path, { args: newArgs });
                }}
                className="text-zinc-500 hover:text-red-400"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Sub-fields */}
      {field.subFields.map((sf, sfIdx) => renderFieldEditor(sf, [...path, sfIdx], depth + 1))}
    </div>
  );

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateQuery());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Braces className="w-4 h-4 inline mr-2" />
        <strong>GraphQL Query Builder:</strong> Visually build GraphQL queries and mutations with fields, arguments, and nested selections.
      </div>

      {/* Operation Type */}
      <div className="flex items-center gap-4">
        <div className="flex">
          <button
            onClick={() => setOperationType('query')}
            className={`px-4 py-2 rounded-l-lg text-sm ${
              operationType === 'query'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Query
          </button>
          <button
            onClick={() => setOperationType('mutation')}
            className={`px-4 py-2 rounded-r-lg text-sm ${
              operationType === 'mutation'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Mutation
          </button>
        </div>
        <input
          type="text"
          value={operationName}
          onChange={(e) => setOperationName(e.target.value)}
          placeholder="OperationName (optional)"
          className="flex-1 bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm"
        />
      </div>

      {/* Fields Editor */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-zinc-300">Fields</h4>
          <button
            onClick={() => addField()}
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Field
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((field, idx) => renderFieldEditor(field, [idx]))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={copyToClipboard}
          className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy Query'}
        </button>
      </div>

      {/* Output */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-zinc-400">Generated Query</h4>
        <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 font-mono overflow-auto">
          {generateQuery()}
        </pre>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">Tips:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Use $varName for variables in argument values</li>
          <li>• Numbers, booleans, and null are not quoted</li>
          <li>• Add nested fields for object types</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(GraphqlQueryBuilderComponent);
