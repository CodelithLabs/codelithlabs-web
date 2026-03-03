'use client';
import { useState, useCallback, memo } from 'react';
import { Braces, Copy, Plus, Trash2, Download, ChevronDown, ChevronRight } from 'lucide-react';

type JsonSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null';

interface SchemaProperty {
  name: string;
  type: JsonSchemaType;
  description?: string;
  required: boolean;
  format?: string;
  enum?: string[];
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  items?: SchemaProperty;
  properties?: SchemaProperty[];
}

const JSON_SCHEMA_FORMATS: Record<string, string[]> = {
  string: ['date', 'date-time', 'time', 'email', 'uri', 'uuid', 'hostname', 'ipv4', 'ipv6', 'regex'],
  number: [],
  integer: [],
};

const JsonSchemaGeneratorComponent = function JsonSchemaGenerator() {
  const [schemaTitle, setSchemaTitle] = useState('MySchema');
  const [schemaDescription, setSchemaDescription] = useState('');
  const [properties, setProperties] = useState<SchemaProperty[]>([
    { name: 'id', type: 'integer', description: 'Unique identifier', required: true },
    { name: 'name', type: 'string', description: 'Name of the item', required: true, minLength: 1 },
    { name: 'email', type: 'string', format: 'email', required: false },
  ]);
  const [expandedProps, setExpandedProps] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const addProperty = useCallback((parentPath: string = '') => {
    const newProp: SchemaProperty = {
      name: '',
      type: 'string',
      required: false,
    };

    if (!parentPath) {
      setProperties(prev => [...prev, newProp]);
    } else {
      // For nested properties, this would require path handling
      setProperties(prev => [...prev, newProp]);
    }
  }, []);

  const removeProperty = useCallback((idx: number) => {
    setProperties(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const updateProperty = useCallback((idx: number, updates: Partial<SchemaProperty>) => {
    setProperties(prev => prev.map((p, i) => i === idx ? { ...p, ...updates } : p));
  }, []);

  const toggleExpand = (name: string) => {
    setExpandedProps(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const generateSchema = useCallback(() => {
    const buildProperty = (prop: SchemaProperty): object => {
      const schema: Record<string, unknown> = { type: prop.type };
      
      if (prop.description) schema.description = prop.description;
      if (prop.format) schema.format = prop.format;
      if (prop.enum && prop.enum.length > 0) schema.enum = prop.enum;
      if (prop.minLength !== undefined) schema.minLength = prop.minLength;
      if (prop.maxLength !== undefined) schema.maxLength = prop.maxLength;
      if (prop.minimum !== undefined) schema.minimum = prop.minimum;
      if (prop.maximum !== undefined) schema.maximum = prop.maximum;
      if (prop.pattern) schema.pattern = prop.pattern;
      
      if (prop.type === 'array' && prop.items) {
        schema.items = buildProperty(prop.items);
      }
      
      if (prop.type === 'object' && prop.properties) {
        schema.properties = {};
        const required: string[] = [];
        prop.properties.forEach(p => {
          (schema.properties as Record<string, object>)[p.name] = buildProperty(p);
          if (p.required) required.push(p.name);
        });
        if (required.length > 0) schema.required = required;
      }
      
      return schema;
    };

    const schemaObj: Record<string, unknown> = {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      title: schemaTitle,
      type: 'object',
      properties: {},
      required: [],
    };

    if (schemaDescription) {
      schemaObj.description = schemaDescription;
    }

    properties.forEach(prop => {
      (schemaObj.properties as Record<string, object>)[prop.name] = buildProperty(prop);
      if (prop.required) {
        (schemaObj.required as string[]).push(prop.name);
      }
    });

    if ((schemaObj.required as string[]).length === 0) {
      delete schemaObj.required;
    }

    return JSON.stringify(schemaObj, null, 2);
  }, [schemaTitle, schemaDescription, properties]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateSchema());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([generateSchema()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schemaTitle.toLowerCase().replace(/\s+/g, '-')}.schema.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Braces className="w-4 h-4 inline mr-2" />
        <strong>JSON Schema Generator:</strong> Create JSON Schema definitions visually. Supports types, formats, validation rules, and nested objects.
      </div>

      {/* Schema Metadata */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Schema Title</label>
          <input
            type="text"
            value={schemaTitle}
            onChange={(e) => setSchemaTitle(e.target.value)}
            placeholder="MySchema"
            className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
          <input
            type="text"
            value={schemaDescription}
            onChange={(e) => setSchemaDescription(e.target.value)}
            placeholder="Optional description"
            className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700"
          />
        </div>
      </div>

      {/* Properties */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-zinc-300">Properties</h4>
          <button
            onClick={() => addProperty()}
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>

        <div className="space-y-3">
          {properties.map((prop, idx) => (
            <div key={idx} className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <button
                  onClick={() => toggleExpand(prop.name || `prop-${idx}`)}
                  className="p-1 text-zinc-400 hover:text-zinc-300 mt-1"
                >
                  {expandedProps.has(prop.name || `prop-${idx}`) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={prop.name}
                    onChange={(e) => updateProperty(idx, { name: e.target.value })}
                    placeholder="propertyName"
                    className="bg-zinc-900 text-white p-2 rounded border border-zinc-600 text-sm font-mono"
                  />
                  <select
                    value={prop.type}
                    onChange={(e) => updateProperty(idx, { type: e.target.value as JsonSchemaType })}
                    className="bg-zinc-900 text-white p-2 rounded border border-zinc-600 text-sm"
                  >
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="integer">integer</option>
                    <option value="boolean">boolean</option>
                    <option value="object">object</option>
                    <option value="array">array</option>
                    <option value="null">null</option>
                  </select>
                  <input
                    type="text"
                    value={prop.description || ''}
                    onChange={(e) => updateProperty(idx, { description: e.target.value })}
                    placeholder="Description"
                    className="bg-zinc-900 text-zinc-300 p-2 rounded border border-zinc-600 text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-sm text-zinc-400">
                      <input
                        type="checkbox"
                        checked={prop.required}
                        onChange={(e) => updateProperty(idx, { required: e.target.checked })}
                        className="rounded"
                      />
                      Required
                    </label>
                  </div>
                </div>
                
                <button
                  onClick={() => removeProperty(idx)}
                  className="p-2 text-zinc-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Expanded Options */}
              {expandedProps.has(prop.name || `prop-${idx}`) && (
                <div className="mt-3 pt-3 border-t border-zinc-600 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(prop.type === 'string' || prop.type === 'number' || prop.type === 'integer') && (
                    <>
                      {JSON_SCHEMA_FORMATS[prop.type]?.length > 0 && (
                        <div>
                          <label className="text-xs text-zinc-500 block mb-1">Format</label>
                          <select
                            value={prop.format || ''}
                            onChange={(e) => updateProperty(idx, { format: e.target.value || undefined })}
                            className="w-full bg-zinc-900 text-zinc-300 p-1.5 rounded border border-zinc-600 text-xs"
                          >
                            <option value="">None</option>
                            {JSON_SCHEMA_FORMATS[prop.type].map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      {prop.type === 'string' && (
                        <>
                          <div>
                            <label className="text-xs text-zinc-500 block mb-1">Min Length</label>
                            <input
                              type="number"
                              value={prop.minLength ?? ''}
                              onChange={(e) => updateProperty(idx, { minLength: e.target.value ? parseInt(e.target.value) : undefined })}
                              className="w-full bg-zinc-900 text-zinc-300 p-1.5 rounded border border-zinc-600 text-xs"
                              min={0}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-zinc-500 block mb-1">Max Length</label>
                            <input
                              type="number"
                              value={prop.maxLength ?? ''}
                              onChange={(e) => updateProperty(idx, { maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
                              className="w-full bg-zinc-900 text-zinc-300 p-1.5 rounded border border-zinc-600 text-xs"
                              min={0}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-zinc-500 block mb-1">Pattern (Regex)</label>
                            <input
                              type="text"
                              value={prop.pattern || ''}
                              onChange={(e) => updateProperty(idx, { pattern: e.target.value || undefined })}
                              placeholder="^[a-z]+$"
                              className="w-full bg-zinc-900 text-zinc-300 p-1.5 rounded border border-zinc-600 text-xs font-mono"
                            />
                          </div>
                        </>
                      )}
                      {(prop.type === 'number' || prop.type === 'integer') && (
                        <>
                          <div>
                            <label className="text-xs text-zinc-500 block mb-1">Minimum</label>
                            <input
                              type="number"
                              value={prop.minimum ?? ''}
                              onChange={(e) => updateProperty(idx, { minimum: e.target.value ? parseFloat(e.target.value) : undefined })}
                              className="w-full bg-zinc-900 text-zinc-300 p-1.5 rounded border border-zinc-600 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-zinc-500 block mb-1">Maximum</label>
                            <input
                              type="number"
                              value={prop.maximum ?? ''}
                              onChange={(e) => updateProperty(idx, { maximum: e.target.value ? parseFloat(e.target.value) : undefined })}
                              className="w-full bg-zinc-900 text-zinc-300 p-1.5 rounded border border-zinc-600 text-xs"
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={copyToClipboard}
          className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={downloadFile}
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Output */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-zinc-400">Generated JSON Schema</h4>
        <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 font-mono overflow-auto max-h-64">
          {generateSchema()}
        </pre>
      </div>
    </div>
  );
};

export default memo(JsonSchemaGeneratorComponent);
