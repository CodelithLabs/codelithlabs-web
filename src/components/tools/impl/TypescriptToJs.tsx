'use client';
import { useState, useCallback, memo } from 'react';
import { FileCode, Copy, ArrowRight, AlertCircle, Settings } from 'lucide-react';

interface ConversionOptions {
  removeTypes: boolean;
  convertInterfaces: boolean;
  convertEnums: boolean;
  removeImports: boolean;
  addJsDoc: boolean;
}

const TypescriptToJsComponent = function TypescriptToJs() {
  const [tsCode, setTsCode] = useState(`interface User {
  id: number;
  name: string;
  email?: string;
}

enum Status {
  Active = 'active',
  Inactive = 'inactive',
}

function greet(user: User): string {
  const greeting: string = \`Hello, \${user.name}!\`;
  return greeting;
}

const getStatus = (isActive: boolean): Status => {
  return isActive ? Status.Active : Status.Inactive;
};

class UserService {
  private users: User[] = [];
  
  public addUser(user: User): void {
    this.users.push(user);
  }
  
  public getUsers(): User[] {
    return this.users;
  }
}`);
  const [jsCode, setJsCode] = useState('');
  const [options, setOptions] = useState<ConversionOptions>({
    removeTypes: true,
    convertInterfaces: true,
    convertEnums: true,
    removeImports: true,
    addJsDoc: false,
  });
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const convertToJs = useCallback(() => {
    try {
      let result = tsCode;
      const warns: string[] = [];

      // Remove type imports
      if (options.removeImports) {
        result = result.replace(/^import\s+type\s+.*?;?\s*$/gm, '');
        result = result.replace(/import\s*{\s*type\s+[^}]+}\s+from\s+['"][^'"]+['"];?\s*/g, '');
      }

      // Remove interface declarations
      if (options.convertInterfaces) {
        result = result.replace(/^interface\s+\w+\s*(?:extends\s+[\w,\s]+)?\s*{[\s\S]*?^}/gm, (match) => {
          if (options.addJsDoc) {
            const name = match.match(/interface\s+(\w+)/)?.[1];
            return `/**\n * @typedef {Object} ${name}\n */`;
          }
          return '';
        });
        
        // Also handle single-line interfaces
        result = result.replace(/interface\s+\w+\s*{[^}]+}/g, '');
      }

      // Remove type declarations
      result = result.replace(/^type\s+\w+\s*=\s*[^;]+;?\s*$/gm, '');

      // Convert enums to objects
      if (options.convertEnums) {
        result = result.replace(/enum\s+(\w+)\s*{([^}]+)}/g, (_, name, body: string) => {
          const entries = body.split(',')
            .map((e: string) => e.trim())
            .filter((e: string) => e)
            .map((e: string) => {
              const [key, val] = e.split('=').map((s: string) => s.trim());
              if (val) {
                return `  ${key}: ${val}`;
              }
              return `  ${key}: '${key}'`;
            });
          return `const ${name} = {\n${entries.join(',\n')}\n}`;
        });
      }

      // Remove type annotations if enabled
      if (options.removeTypes) {
        // Function return types
        result = result.replace(/\):\s*[\w<>\[\]|&\s,{}]+\s*(?=\{|=>)/g, ') ');
        
        // Function parameter types  
        result = result.replace(/:\s*[\w<>\[\]|&\s,{}]+(?=[,)])/g, '');
        
        // Variable declarations with types
        result = result.replace(/:\s*[\w<>\[\]|&\s,{}]+\s*(?==)/g, ' ');
        
        // Class property types
        result = result.replace(/:\s*[\w<>\[\]|&\s,{}]+\s*(?=;)/g, '');
        
        // Generic type parameters in functions
        result = result.replace(/<[\w,\s]+>(?=\s*\()/g, '');
        
        // Access modifiers
        result = result.replace(/\b(private|public|protected|readonly)\s+/g, '');
        
        // as assertions
        result = result.replace(/\s+as\s+[\w<>\[\]|&\s,{}]+/g, '');
        
        // Non-null assertions
        result = result.replace(/!/g, '');
        
        // Optional chaining types (keep ?.)
        // Already handled
        
        // Remove any remaining angle brackets for generics
        result = result.replace(/Array<(\w+)>/g, '$1[]');
        result = result.replace(/Promise<[\w\[\]<>,\s]+>/g, 'Promise');
      }

      // Clean up empty lines
      result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
      result = result.trim();

      // Check for potential issues
      if (result.includes(':')) {
        const remainingTypes = (result.match(/:\s*\w+/g) || []).length;
        if (remainingTypes > 0) {
          warns.push(`${remainingTypes} potential type annotations may need manual review`);
        }
      }

      setJsCode(result);
      setErrors(warns);
    } catch (e) {
      setErrors([e instanceof Error ? e.message : 'Conversion failed']);
      setJsCode('');
    }
  }, [tsCode, options]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <FileCode className="w-4 h-4 inline mr-2" />
        <strong>TypeScript to JavaScript Converter:</strong> Remove type annotations, convert interfaces/enums, and transform TypeScript code to plain JavaScript.
      </div>

      {/* Options Toggle */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300"
      >
        <Settings className="w-4 h-4" />
        Conversion Options
      </button>

      {/* Options Panel */}
      {showOptions && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={options.removeTypes}
              onChange={(e) => setOptions({ ...options, removeTypes: e.target.checked })}
              className="rounded"
            />
            Remove type annotations
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={options.convertInterfaces}
              onChange={(e) => setOptions({ ...options, convertInterfaces: e.target.checked })}
              className="rounded"
            />
            Remove interfaces
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={options.convertEnums}
              onChange={(e) => setOptions({ ...options, convertEnums: e.target.checked })}
              className="rounded"
            />
            Convert enums to objects
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={options.removeImports}
              onChange={(e) => setOptions({ ...options, removeImports: e.target.checked })}
              className="rounded"
            />
            Remove type imports
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={options.addJsDoc}
              onChange={(e) => setOptions({ ...options, addJsDoc: e.target.checked })}
              className="rounded"
            />
            Add JSDoc comments
          </label>
        </div>
      )}

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">TypeScript Code</label>
        <textarea
          value={tsCode}
          onChange={(e) => setTsCode(e.target.value)}
          placeholder="Paste TypeScript code here..."
          className="w-full h-64 bg-zinc-800 text-white p-4 rounded-lg border border-zinc-700 font-mono text-sm resize-y"
        />
      </div>

      {/* Convert Button */}
      <button
        onClick={convertToJs}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
      >
        Convert to JavaScript
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Warnings */}
      {errors.length > 0 && (
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
          {errors.map((err, i) => (
            <div key={i} className="text-sm text-orange-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {err}
            </div>
          ))}
        </div>
      )}

      {/* Output */}
      {jsCode && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">JavaScript Output</label>
            <button
              onClick={copyToClipboard}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm text-green-300 font-mono overflow-auto max-h-80">
            {jsCode}
          </pre>
        </div>
      )}

      {/* Reference */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">What gets converted:</strong>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          <div>• Type annotations</div>
          <div>• Interface declarations</div>
          <div>• Enum → const object</div>
          <div>• Access modifiers</div>
          <div>• Type imports</div>
          <div>• Generic parameters</div>
        </div>
        <div className="mt-2 text-orange-400">Note: Complex type expressions may need manual review.</div>
      </div>
    </div>
  );
};

export default memo(TypescriptToJsComponent);
