'use client';
import { useState, useCallback, memo } from 'react';
import { Database, Copy, ArrowRight, AlertCircle } from 'lucide-react';

const SqlToMongodbComponent = function SqlToMongodb() {
  const [sqlQuery, setSqlQuery] = useState(`SELECT name, email, age
FROM users
WHERE age > 21 AND status = 'active'
ORDER BY created_at DESC
LIMIT 10`);
  const [mongoQuery, setMongoQuery] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const convertToMongo = useCallback(() => {
    try {
      const sql = sqlQuery.trim();
      const errs: string[] = [];
      
      // Normalize whitespace and handle multi-line
      const normalized = sql.replace(/\s+/g, ' ').trim();
      
      // Parse SELECT
      const selectMatch = normalized.match(/SELECT\s+(.+?)\s+FROM/i);
      const fromMatch = normalized.match(/FROM\s+(\w+)/i);
      const whereMatch = normalized.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|\s+GROUP|\s*$)/i);
      const orderMatch = normalized.match(/ORDER\s+BY\s+(.+?)(?:\s+LIMIT|\s*$)/i);
      const limitMatch = normalized.match(/LIMIT\s+(\d+)/i);
      const offsetMatch = normalized.match(/OFFSET\s+(\d+)/i);
      
      if (!selectMatch || !fromMatch) {
        setErrors(['Invalid SQL query. Must include SELECT and FROM clauses.']);
        setMongoQuery('');
        return;
      }

      const collection = fromMatch[1];
      const fields = selectMatch[1].trim();
      
      // Build MongoDB query
      let mongoCode = `db.${collection}.find(\n`;
      
      // Parse WHERE clause
      const filter: Record<string, unknown> = {};
      if (whereMatch) {
        const whereClause = whereMatch[1];
        
        // Split by AND/OR (simplified - not handling OR properly)
        if (whereClause.toLowerCase().includes(' or ')) {
          errs.push('OR clauses require $or operator - manual adjustment may be needed');
        }
        
        const conditions = whereClause.split(/\s+AND\s+/i);
        
        conditions.forEach(cond => {
          // Parse condition patterns
          const patterns = [
            { regex: /(\w+)\s*=\s*'([^']+)'/i, op: '$eq', quoteVal: true },
            { regex: /(\w+)\s*=\s*(\d+)/i, op: '$eq', quoteVal: false },
            { regex: /(\w+)\s*!=\s*'([^']+)'/i, op: '$ne', quoteVal: true },
            { regex: /(\w+)\s*<>\s*'([^']+)'/i, op: '$ne', quoteVal: true },
            { regex: /(\w+)\s*>\s*(\d+)/i, op: '$gt', quoteVal: false },
            { regex: /(\w+)\s*>=\s*(\d+)/i, op: '$gte', quoteVal: false },
            { regex: /(\w+)\s*<\s*(\d+)/i, op: '$lt', quoteVal: false },
            { regex: /(\w+)\s*<=\s*(\d+)/i, op: '$lte', quoteVal: false },
            { regex: /(\w+)\s+LIKE\s+'%([^']+)%'/i, op: '$regex', quoteVal: true },
            { regex: /(\w+)\s+IN\s*\(([^)]+)\)/i, op: '$in', quoteVal: true },
            { regex: /(\w+)\s+IS\s+NULL/i, op: '$eq', val: null },
            { regex: /(\w+)\s+IS\s+NOT\s+NULL/i, op: '$ne', val: null },
          ];

          let matched = false;
          for (const p of patterns) {
            const m = cond.match(p.regex);
            if (m) {
              matched = true;
              const field = m[1];
              let value: unknown;

              if ('val' in p) {
                value = p.val;
              } else if (p.op === '$in') {
                // Parse IN values
                value = m[2].split(',').map(v => {
                  const trimmed = v.trim();
                  if (trimmed.startsWith("'")) return trimmed.slice(1, -1);
                  return isNaN(Number(trimmed)) ? trimmed : Number(trimmed);
                });
              } else if (p.op === '$regex') {
                value = m[2];
              } else {
                value = p.quoteVal ? m[2] : Number(m[2]);
              }

              if (p.op === '$eq') {
                filter[field] = value;
              } else if (p.op === '$regex') {
                filter[field] = { $regex: value, $options: 'i' };
              } else {
                filter[field] = { [p.op]: value };
              }
              break;
            }
          }

          if (!matched) {
            errs.push(`Could not parse condition: ${cond}`);
          }
        });
      }

      mongoCode += `  ${JSON.stringify(filter, null, 2).replace(/\n/g, '\n  ')},\n`;

      // Build projection
      if (fields !== '*') {
        const projection: Record<string, number> = {};
        fields.split(',').forEach(f => {
          const col = f.trim().split(/\s+AS\s+/i)[0].trim();
          if (col !== '*') {
            projection[col] = 1;
          }
        });
        mongoCode += `  ${JSON.stringify(projection)}\n`;
      } else {
        mongoCode += `  {}\n`;
      }

      mongoCode += `)`;

      // Add sort
      if (orderMatch) {
        const sortParts = orderMatch[1].split(',').map(part => {
          const [field, dir] = part.trim().split(/\s+/);
          return `${field}: ${dir?.toUpperCase() === 'DESC' ? -1 : 1}`;
        });
        mongoCode += `.sort({ ${sortParts.join(', ')} })`;
      }

      // Add skip/limit
      if (offsetMatch) {
        mongoCode += `.skip(${offsetMatch[1]})`;
      }
      if (limitMatch) {
        mongoCode += `.limit(${limitMatch[1]})`;
      }

      setMongoQuery(mongoCode);
      setErrors(errs);
    } catch (e) {
      setErrors([e instanceof Error ? e.message : 'Conversion failed']);
      setMongoQuery('');
    }
  }, [sqlQuery]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mongoQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    {
      name: 'Simple SELECT',
      sql: `SELECT * FROM users WHERE active = 1`,
    },
    {
      name: 'With ORDER & LIMIT',
      sql: `SELECT name, email FROM users WHERE age >= 18 ORDER BY created_at DESC LIMIT 20`,
    },
    {
      name: 'IN clause',
      sql: `SELECT * FROM products WHERE category IN ('electronics', 'books', 'games')`,
    },
    {
      name: 'LIKE pattern',
      sql: `SELECT * FROM posts WHERE title LIKE '%javascript%'`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Database className="w-4 h-4 inline mr-2" />
        <strong>SQL to MongoDB Converter:</strong> Convert SQL SELECT queries to MongoDB find() syntax. Supports WHERE, ORDER BY, LIMIT, and more.
      </div>

      {/* Examples */}
      <div className="flex flex-wrap gap-2">
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setSqlQuery(ex.sql)}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg"
          >
            {ex.name}
          </button>
        ))}
      </div>

      {/* SQL Input */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">SQL Query</label>
        <textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          placeholder="Enter SQL SELECT query..."
          className="w-full h-40 bg-zinc-800 text-white p-4 rounded-lg border border-zinc-700 font-mono text-sm resize-y"
        />
      </div>

      {/* Convert Button */}
      <button
        onClick={convertToMongo}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
      >
        Convert to MongoDB
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Errors */}
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
      {mongoQuery && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">MongoDB Query</label>
            <button
              onClick={copyToClipboard}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm text-green-300 font-mono overflow-auto">
            {mongoQuery}
          </pre>
        </div>
      )}

      {/* Reference */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">Supported SQL Features:</strong>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
          <div>• SELECT fields</div>
          <div>• WHERE conditions</div>
          <div>• ORDER BY</div>
          <div>• LIMIT / OFFSET</div>
          <div>• Comparison operators</div>
          <div>• IN clause</div>
          <div>• LIKE (to $regex)</div>
          <div>• IS NULL / NOT NULL</div>
        </div>
        <div className="mt-2 text-orange-400">Note: Complex JOINs and subqueries require manual conversion.</div>
      </div>
    </div>
  );
};

export default memo(SqlToMongodbComponent);
