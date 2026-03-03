'use client';
import { useState, useCallback, memo } from 'react';
import { FileCode, Copy, Plus, Trash2, Download, Eye, EyeOff } from 'lucide-react';

interface EnvVar {
  key: string;
  value: string;
  comment: string;
  isSecret: boolean;
}

const DotenvEditorComponent = function DotenvEditor() {
  const [vars, setVars] = useState<EnvVar[]>([
    { key: 'NODE_ENV', value: 'development', comment: '', isSecret: false },
    { key: 'DATABASE_URL', value: 'postgresql://localhost:5432/mydb', comment: 'Database connection string', isSecret: false },
  ]);
  const [rawMode, setRawMode] = useState(false);
  const [rawText, setRawText] = useState('');
  const [showSecrets, setShowSecrets] = useState(false);
  const [copied, setCopied] = useState(false);

  const addVar = useCallback(() => {
    setVars(prev => [...prev, { key: '', value: '', comment: '', isSecret: false }]);
  }, []);

  const removeVar = useCallback((idx: number) => {
    setVars(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const updateVar = useCallback((idx: number, field: keyof EnvVar, value: string | boolean) => {
    setVars(prev => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v));
  }, []);

  const generateEnvFile = useCallback(() => {
    let output = '';
    vars.forEach(v => {
      if (v.comment) {
        output += `# ${v.comment}\n`;
      }
      if (v.key) {
        // Quote value if it contains spaces or special characters
        const needsQuotes = /[\s#$]/.test(v.value);
        const quotedValue = needsQuotes ? `"${v.value}"` : v.value;
        output += `${v.key}=${quotedValue}\n`;
      }
    });
    return output.trim();
  }, [vars]);

  const parseEnvFile = useCallback((text: string) => {
    const lines = text.split('\n');
    const newVars: EnvVar[] = [];
    let currentComment = '';

    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('#')) {
        currentComment = trimmed.substring(1).trim();
      } else if (trimmed && trimmed.includes('=')) {
        const eqIdx = trimmed.indexOf('=');
        const key = trimmed.substring(0, eqIdx).trim();
        let value = trimmed.substring(eqIdx + 1).trim();
        
        // Remove surrounding quotes
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // Detect secrets
        const isSecret = /secret|password|key|token|api_key/i.test(key);
        
        newVars.push({ key, value, comment: currentComment, isSecret });
        currentComment = '';
      }
    });

    setVars(newVars);
  }, []);

  const toggleRawMode = () => {
    if (!rawMode) {
      setRawText(generateEnvFile());
    } else {
      parseEnvFile(rawText);
    }
    setRawMode(!rawMode);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rawMode ? rawText : generateEnvFile());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const content = rawMode ? rawText : generateEnvFile();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseEnvFile(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <FileCode className="w-4 h-4 inline mr-2" />
        <strong>.env Editor:</strong> Create and edit environment files. Supports comments, secret detection, and both visual and raw edit modes.
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={toggleRawMode}
          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
            rawMode ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          }`}
        >
          <FileCode className="w-3 h-3" />
          {rawMode ? 'Visual Mode' : 'Raw Mode'}
        </button>
        <button
          onClick={() => setShowSecrets(!showSecrets)}
          className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-lg text-sm flex items-center gap-1"
        >
          {showSecrets ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {showSecrets ? 'Hide' : 'Show'} Secrets
        </button>
        <label className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-lg text-sm cursor-pointer">
          Upload .env
          <input type="file" accept=".env,.txt" onChange={handleFileUpload} className="hidden" />
        </label>
        <div className="flex-1" />
        <button
          onClick={copyToClipboard}
          className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-lg flex items-center gap-1"
        >
          <Copy className="w-3 h-3" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={downloadFile}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-1"
        >
          <Download className="w-3 h-3" />
          Download
        </button>
      </div>

      {/* Editor */}
      {rawMode ? (
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          className="w-full h-96 bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 font-mono resize-y"
          placeholder="# Your .env file content
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/mydb"
        />
      ) : (
        <div className="space-y-2">
          {vars.map((v, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="flex-1 grid md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={v.key}
                    onChange={(e) => updateVar(idx, 'key', e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
                    placeholder="KEY"
                    className="bg-zinc-800 text-white p-2 rounded border border-zinc-700 font-mono text-sm"
                  />
                  <div className="relative">
                    <input
                      type={v.isSecret && !showSecrets ? 'password' : 'text'}
                      value={v.value}
                      onChange={(e) => updateVar(idx, 'value', e.target.value)}
                      placeholder="value"
                      className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 font-mono text-sm pr-8"
                    />
                    {v.isSecret && (
                      <span className="absolute right-2 top-2 text-orange-400 text-xs">🔒</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => updateVar(idx, 'isSecret', !v.isSecret)}
                  className={`p-2 rounded ${v.isSecret ? 'text-orange-400' : 'text-zinc-500 hover:text-zinc-400'}`}
                  title="Mark as secret"
                >
                  {v.isSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => removeVar(idx)}
                  className="p-2 text-zinc-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={v.comment}
                onChange={(e) => updateVar(idx, 'comment', e.target.value)}
                placeholder="Add comment (optional)"
                className="mt-2 w-full bg-zinc-800 text-zinc-400 p-2 rounded border border-zinc-700 text-xs"
              />
            </div>
          ))}

          <button
            onClick={addVar}
            className="w-full py-2 border border-dashed border-zinc-700 hover:border-zinc-600 rounded-lg text-zinc-400 hover:text-zinc-300 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Variable
          </button>
        </div>
      )}

      {/* Preview */}
      {!rawMode && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-zinc-400">Preview</h4>
          <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 font-mono overflow-x-auto">
            {generateEnvFile() || '# Empty .env file'}
          </pre>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">Tips:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Keys are auto-converted to UPPERCASE with underscores</li>
          <li>• Values with spaces are automatically quoted</li>
          <li>• Click the eye icon to mark sensitive values as secrets</li>
          <li>• Upload existing .env files to edit them</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(DotenvEditorComponent);
