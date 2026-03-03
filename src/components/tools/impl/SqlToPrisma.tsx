'use client';

import { memo, useState, useCallback } from 'react';

function SqlToPrisma() {
  const [sql, setSql] = useState('');
  const [result, setResult] = useState('');

  const handleConvert = useCallback(() => {
    try {
      const lines = sql.split('\n');
      const models: string[] = [];
      let currentModel = '';
      let fields: string[] = [];

      const sqlTypeToPrisma: { [key: string]: string } = {
        'int': 'Int',
        'integer': 'Int',
        'bigint': 'BigInt',
        'smallint': 'Int',
        'tinyint': 'Int',
        'decimal': 'Decimal',
        'numeric': 'Decimal',
        'float': 'Float',
        'double': 'Float',
        'real': 'Float',
        'varchar': 'String',
        'char': 'String',
        'text': 'String',
        'longtext': 'String',
        'mediumtext': 'String',
        'tinytext': 'String',
        'boolean': 'Boolean',
        'bool': 'Boolean',
        'date': 'DateTime',
        'datetime': 'DateTime',
        'timestamp': 'DateTime',
        'time': 'DateTime',
        'json': 'Json',
        'jsonb': 'Json',
        'uuid': 'String',
        'blob': 'Bytes',
        'binary': 'Bytes',
      };

      for (const line of lines) {
        const trimmed = line.trim().toLowerCase();

        // Match CREATE TABLE
        const tableMatch = trimmed.match(/create\s+table\s+(?:if\s+not\s+exists\s+)?[`"]?(\w+)[`"]?\s*\(/i);
        if (tableMatch) {
          if (currentModel && fields.length > 0) {
            models.push(`model ${currentModel} {\n${fields.join('\n')}\n}`);
          }
          currentModel = tableMatch[1].charAt(0).toUpperCase() + tableMatch[1].slice(1);
          fields = [];
          continue;
        }

        // Skip if no current model
        if (!currentModel) continue;

        // Parse field
        const fieldMatch = line.trim().match(/^[`"]?(\w+)[`"]?\s+(\w+)(?:\([\d,]+\))?(.*)$/i);
        if (fieldMatch && !trimmed.startsWith('primary') && !trimmed.startsWith('foreign') && !trimmed.startsWith('unique') && !trimmed.startsWith('key') && !trimmed.startsWith('constraint')) {
          const [, fieldName, sqlType, modifiers] = fieldMatch;
          const prismaType = sqlTypeToPrisma[sqlType.toLowerCase()] || 'String';
          
          let decorators: string[] = [];
          const isNullable = !modifiers.toLowerCase().includes('not null');
          const isPrimary = modifiers.toLowerCase().includes('primary key');
          const isAutoIncrement = modifiers.toLowerCase().includes('auto_increment') || modifiers.toLowerCase().includes('serial');
          
          if (isPrimary) {
            decorators.push('@id');
          }
          if (isAutoIncrement) {
            decorators.push('@default(autoincrement())');
          }
          if (modifiers.toLowerCase().includes('default now()') || modifiers.toLowerCase().includes('current_timestamp')) {
            decorators.push('@default(now())');
          }
          if (fieldName.toLowerCase() === 'updated_at') {
            decorators.push('@updatedAt');
          }

          const nullable = isNullable && !isPrimary ? '?' : '';
          const decoratorStr = decorators.length > 0 ? ' ' + decorators.join(' ') : '';
          
          fields.push(`  ${fieldName} ${prismaType}${nullable}${decoratorStr}`);
        }

        // End of table
        if (trimmed.includes(');') || trimmed === ')') {
          if (currentModel && fields.length > 0) {
            models.push(`model ${currentModel} {\n${fields.join('\n')}\n}`);
          }
          currentModel = '';
          fields = [];
        }
      }

      // Handle last model if exists
      if (currentModel && fields.length > 0) {
        models.push(`model ${currentModel} {\n${fields.join('\n')}\n}`);
      }

      const prismaSchema = `// This is your Prisma schema file
// Learn more about it: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

${models.join('\n\n')}`;

      setResult(prismaSchema);
    } catch (e) {
      setResult('Error: Could not parse SQL. Please check your input.');
    }
  }, [sql]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">SQL to Prisma Schema Converter</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">SQL Input</label>
            <textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder={`CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);`}
              rows={10}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          <button
            onClick={handleConvert}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Convert to Prisma
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Prisma Schema</h3>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
            >
              Copy
            </button>
          </div>
          <pre className="bg-zinc-900 rounded-lg p-4 text-green-400 text-sm overflow-x-auto font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

export default memo(SqlToPrisma);
