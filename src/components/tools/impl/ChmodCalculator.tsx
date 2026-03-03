'use client';
import { useState, useCallback, memo } from 'react';
import { Shield, Copy, RotateCcw, Check } from 'lucide-react';

type PermissionKey = 'r' | 'w' | 'x';

const ChmodCalculatorComponent = function ChmodCalculator() {
  const [permissions, setPermissions] = useState({
    owner: { r: true, w: true, x: false },
    group: { r: true, w: false, x: false },
    other: { r: true, w: false, x: false },
  });
  const [numericInput, setNumericInput] = useState('644');
  const [copied, setCopied] = useState<string | null>(null);

  const calculateNumeric = useCallback(() => {
    const calc = (perms: { r: boolean; w: boolean; x: boolean }) => 
      (perms.r ? 4 : 0) + (perms.w ? 2 : 0) + (perms.x ? 1 : 0);
    
    return `${calc(permissions.owner)}${calc(permissions.group)}${calc(permissions.other)}`;
  }, [permissions]);

  const calculateSymbolic = useCallback(() => {
    const calc = (perms: { r: boolean; w: boolean; x: boolean }) =>
      `${perms.r ? 'r' : '-'}${perms.w ? 'w' : '-'}${perms.x ? 'x' : '-'}`;
    
    return `-${calc(permissions.owner)}${calc(permissions.group)}${calc(permissions.other)}`;
  }, [permissions]);

  const togglePermission = (role: 'owner' | 'group' | 'other', perm: PermissionKey) => {
    setPermissions(prev => ({
      ...prev,
      [role]: { ...prev[role], [perm]: !prev[role][perm] },
    }));
  };

  const parseNumeric = useCallback((value: string) => {
    if (!/^[0-7]{3,4}$/.test(value)) return;
    
    const digits = value.slice(-3);
    const parse = (digit: string) => {
      const num = parseInt(digit, 10);
      return { r: (num & 4) !== 0, w: (num & 2) !== 0, x: (num & 1) !== 0 };
    };

    setPermissions({
      owner: parse(digits[0]),
      group: parse(digits[1]),
      other: parse(digits[2]),
    });
  }, []);

  const handleNumericChange = (value: string) => {
    setNumericInput(value);
    parseNumeric(value);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const commonPresets = [
    { name: '644', desc: 'Default file' },
    { name: '755', desc: 'Executable' },
    { name: '777', desc: 'Full access' },
    { name: '600', desc: 'Private file' },
    { name: '700', desc: 'Private dir' },
    { name: '444', desc: 'Read-only' },
  ];

  const numeric = calculateNumeric();
  const symbolic = calculateSymbolic();

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Shield className="w-4 h-4 inline mr-2" />
        <strong>Chmod Calculator:</strong> Convert between numeric (octal) and symbolic chmod permissions. Click checkboxes or enter numeric value.
      </div>

      {/* Numeric Input */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Numeric Value</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={numericInput}
            onChange={(e) => handleNumericChange(e.target.value)}
            maxLength={4}
            className="flex-1 bg-zinc-800 text-white text-2xl font-mono p-3 rounded-lg border border-zinc-700 focus:border-blue-500 text-center"
            placeholder="644"
          />
          <button
            onClick={() => copyToClipboard(numeric, 'numeric')}
            className="px-4 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white"
          >
            {copied === 'numeric' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Permission Grid */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div></div>
          <div className="text-zinc-400 font-medium">Read (r)</div>
          <div className="text-zinc-400 font-medium">Write (w)</div>
          <div className="text-zinc-400 font-medium">Execute (x)</div>
          
          {(['owner', 'group', 'other'] as const).map(role => (
            <>
              <div key={`${role}-label`} className="text-zinc-300 font-medium text-left capitalize py-2">
                {role}
              </div>
              {(['r', 'w', 'x'] as const).map(perm => (
                <button
                  key={`${role}-${perm}`}
                  onClick={() => togglePermission(role, perm)}
                  className={`p-2 rounded-lg border transition-colors ${
                    permissions[role][perm]
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-600'
                  }`}
                >
                  {permissions[role][perm] ? perm : '-'}
                </button>
              ))}
            </>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-zinc-400">Numeric</span>
            <button
              onClick={() => copyToClipboard(`chmod ${numeric}`, 'chmod-num')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              {copied === 'chmod-num' ? 'Copied!' : 'Copy command'}
            </button>
          </div>
          <div className="font-mono text-2xl text-white">{numeric}</div>
          <code className="text-xs text-zinc-500 mt-2 block">chmod {numeric} filename</code>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-zinc-400">Symbolic</span>
            <button
              onClick={() => copyToClipboard(symbolic, 'symbolic')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              {copied === 'symbolic' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="font-mono text-2xl text-white">{symbolic}</div>
          <code className="text-xs text-zinc-500 mt-2 block">ls -l output format</code>
        </div>
      </div>

      {/* Common Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-zinc-400">Common Presets</span>
          <button
            onClick={() => handleNumericChange('644')}
            className="text-xs text-zinc-500 hover:text-zinc-400 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {commonPresets.map(preset => (
            <button
              key={preset.name}
              onClick={() => handleNumericChange(preset.name)}
              className={`p-2 rounded-lg border text-center transition-colors ${
                numeric === preset.name
                  ? 'bg-blue-900/30 border-blue-500/50'
                  : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <div className="font-mono text-white">{preset.name}</div>
              <div className="text-xs text-zinc-500">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Reference */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">Quick Reference:</strong>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div><span className="text-blue-400">4</span> = Read (r)</div>
          <div><span className="text-blue-400">2</span> = Write (w)</div>
          <div><span className="text-blue-400">1</span> = Execute (x)</div>
        </div>
        <div className="mt-2">Add values together: rwx = 4+2+1 = 7, rw- = 4+2 = 6, r-- = 4</div>
      </div>
    </div>
  );
};

export default memo(ChmodCalculatorComponent);
