'use client';
import { useState, useCallback, memo } from 'react';
import { Clock, Copy, Download, Plus, Trash2, Check } from 'lucide-react';

interface DayHours {
  day: string;
  opens: string;
  closes: string;
  closed: boolean;
}

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const HoursSchemaGeneratorComponent = function HoursSchemaGenerator() {
  const [hours, setHours] = useState<DayHours[]>(
    DAYS_OF_WEEK.map((day, idx) => ({
      day,
      opens: '09:00',
      closes: '17:00',
      closed: idx >= 5, // Saturday and Sunday closed by default
    }))
  );
  const [specialHours, setSpecialHours] = useState<{ date: string; opens: string; closes: string; closed: boolean }[]>([]);
  const [copied, setCopied] = useState(false);

  const updateHours = useCallback((idx: number, field: 'opens' | 'closes' | 'closed', value: string | boolean) => {
    setHours(prev => prev.map((h, i) => i === idx ? { ...h, [field]: value } : h));
  }, []);

  const applyToAll = (field: 'opens' | 'closes', value: string) => {
    setHours(prev => prev.map(h => h.closed ? h : { ...h, [field]: value }));
  };

  const copyHours = (sourceIdx: number) => {
    const source = hours[sourceIdx];
    setHours(prev => prev.map((h, i) => 
      i === sourceIdx || h.closed ? h : { ...h, opens: source.opens, closes: source.closes }
    ));
  };

  const addSpecialHours = () => {
    setSpecialHours(prev => [...prev, { date: '', opens: '09:00', closes: '17:00', closed: false }]);
  };

  const removeSpecialHours = (idx: number) => {
    setSpecialHours(prev => prev.filter((_, i) => i !== idx));
  };

  const updateSpecialHours = (idx: number, field: string, value: string | boolean) => {
    setSpecialHours(prev => prev.map((h, i) => i === idx ? { ...h, [field]: value } : h));
  };

  const generateSchema = useCallback(() => {
    const openingHoursSpec = hours
      .filter(h => !h.closed)
      .map(h => ({
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': `https://schema.org/${h.day}`,
        'opens': h.opens,
        'closes': h.closes,
      }));

    const specialOpeningHours = specialHours
      .filter(h => h.date)
      .map(h => {
        if (h.closed) {
          return {
            '@type': 'OpeningHoursSpecification',
            'validFrom': h.date,
            'validThrough': h.date,
            'opens': '00:00',
            'closes': '00:00',
          };
        }
        return {
          '@type': 'OpeningHoursSpecification',
          'validFrom': h.date,
          'validThrough': h.date,
          'opens': h.opens,
          'closes': h.closes,
        };
      });

    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': '[Your Business Name]',
      'openingHoursSpecification': openingHoursSpec,
    };

    if (specialOpeningHours.length > 0) {
      schema.specialOpeningHoursSpecification = specialOpeningHours;
    }

    return JSON.stringify(schema, null, 2);
  }, [hours, specialHours]);

  const generateHumanReadable = useCallback(() => {
    return hours
      .map(h => `${h.day}: ${h.closed ? 'Closed' : `${h.opens} - ${h.closes}`}`)
      .join('\n');
  }, [hours]);

  const copyToClipboard = (type: 'schema' | 'readable') => {
    navigator.clipboard.writeText(type === 'schema' ? generateSchema() : generateHumanReadable());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([generateSchema()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'opening-hours-schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Clock className="w-4 h-4 inline mr-2" />
        <strong>Opening Hours Schema Generator:</strong> Create Schema.org OpeningHoursSpecification for local SEO. Supports regular and special hours.
      </div>

      {/* Regular Hours */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">Regular Hours</h4>
        <div className="space-y-2">
          {hours.map((h, idx) => (
            <div key={h.day} className="flex items-center gap-2 flex-wrap">
              <div className="w-24 text-sm text-zinc-300">{h.day}</div>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={h.closed}
                  onChange={(e) => updateHours(idx, 'closed', e.target.checked)}
                  className="rounded"
                />
                <span className="text-zinc-400">Closed</span>
              </label>
              {!h.closed && (
                <>
                  <input
                    type="time"
                    value={h.opens}
                    onChange={(e) => updateHours(idx, 'opens', e.target.value)}
                    className="bg-zinc-800 text-white p-1.5 rounded border border-zinc-700 text-sm"
                  />
                  <span className="text-zinc-500">to</span>
                  <input
                    type="time"
                    value={h.closes}
                    onChange={(e) => updateHours(idx, 'closes', e.target.value)}
                    className="bg-zinc-800 text-white p-1.5 rounded border border-zinc-700 text-sm"
                  />
                  <button
                    onClick={() => copyHours(idx)}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Copy to all
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => applyToAll('opens', '09:00')}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded"
          >
            All open 9 AM
          </button>
          <button
            onClick={() => applyToAll('closes', '17:00')}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded"
          >
            All close 5 PM
          </button>
          <button
            onClick={() => applyToAll('closes', '21:00')}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded"
          >
            All close 9 PM
          </button>
        </div>
      </div>

      {/* Special Hours */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-zinc-300">Special Hours (Holidays, etc.)</h4>
          <button
            onClick={addSpecialHours}
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Date
          </button>
        </div>

        {specialHours.length === 0 ? (
          <div className="text-sm text-zinc-500 text-center py-2">No special hours added</div>
        ) : (
          <div className="space-y-2">
            {specialHours.map((h, idx) => (
              <div key={idx} className="flex items-center gap-2 flex-wrap">
                <input
                  type="date"
                  value={h.date}
                  onChange={(e) => updateSpecialHours(idx, 'date', e.target.value)}
                  className="bg-zinc-800 text-white p-1.5 rounded border border-zinc-700 text-sm"
                />
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={h.closed}
                    onChange={(e) => updateSpecialHours(idx, 'closed', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-zinc-400">Closed</span>
                </label>
                {!h.closed && (
                  <>
                    <input
                      type="time"
                      value={h.opens}
                      onChange={(e) => updateSpecialHours(idx, 'opens', e.target.value)}
                      className="bg-zinc-800 text-white p-1.5 rounded border border-zinc-700 text-sm"
                    />
                    <span className="text-zinc-500">to</span>
                    <input
                      type="time"
                      value={h.closes}
                      onChange={(e) => updateSpecialHours(idx, 'closes', e.target.value)}
                      className="bg-zinc-800 text-white p-1.5 rounded border border-zinc-700 text-sm"
                    />
                  </>
                )}
                <button
                  onClick={() => removeSpecialHours(idx)}
                  className="p-1 text-zinc-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => copyToClipboard('schema')}
          className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
        >
          <Copy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy Schema'}
        </button>
        <button
          onClick={() => copyToClipboard('readable')}
          className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
        >
          <Copy className="w-4 h-4" />
          Copy Readable
        </button>
        <button
          onClick={downloadFile}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Preview */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-zinc-400 mb-2">Human Readable</h4>
          <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-300 font-mono h-48 overflow-auto">
            {generateHumanReadable()}
          </pre>
        </div>
        <div>
          <h4 className="text-sm font-medium text-zinc-400 mb-2">Schema.org JSON-LD</h4>
          <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-300 font-mono h-48 overflow-auto">
            {generateSchema()}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default memo(HoursSchemaGeneratorComponent);
