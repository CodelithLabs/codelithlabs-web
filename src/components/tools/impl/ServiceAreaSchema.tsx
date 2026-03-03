'use client';
import { useState, useCallback, memo } from 'react';
import { Map, Copy, Download, Plus, Trash2, Check } from 'lucide-react';

interface AreaServed {
  type: 'City' | 'State' | 'Country' | 'GeoCircle' | 'PostalCode';
  name: string;
  // For GeoCircle
  latitude?: string;
  longitude?: string;
  radius?: string;
}

const ServiceAreaSchemaComponent = function ServiceAreaSchema() {
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('LocalBusiness');
  const [areas, setAreas] = useState<AreaServed[]>([
    { type: 'City', name: 'Austin' },
    { type: 'City', name: 'Round Rock' },
  ]);
  const [copied, setCopied] = useState(false);

  const addArea = useCallback((type: AreaServed['type'] = 'City') => {
    setAreas(prev => [...prev, { type, name: '' }]);
  }, []);

  const removeArea = useCallback((idx: number) => {
    setAreas(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const updateArea = useCallback((idx: number, field: keyof AreaServed, value: string) => {
    setAreas(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  }, []);

  const generateSchema = useCallback(() => {
    const areaServed = areas
      .filter(a => a.name || (a.type === 'GeoCircle' && a.latitude && a.longitude))
      .map(area => {
        if (area.type === 'GeoCircle') {
          return {
            '@type': 'GeoCircle',
            'geoMidpoint': {
              '@type': 'GeoCoordinates',
              'latitude': parseFloat(area.latitude || '0'),
              'longitude': parseFloat(area.longitude || '0'),
            },
            'geoRadius': area.radius || '50000', // meters
          };
        }

        if (area.type === 'PostalCode') {
          return {
            '@type': 'PostalAddress',
            'postalCode': area.name,
          };
        }

        return {
          '@type': area.type,
          'name': area.name,
        };
      });

    const schema = {
      '@context': 'https://schema.org',
      '@type': businessType || 'LocalBusiness',
      'name': businessName || '[Your Business Name]',
      'areaServed': areaServed.length === 1 ? areaServed[0] : areaServed,
    };

    return JSON.stringify(schema, null, 2);
  }, [businessName, businessType, areas]);

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
    a.download = 'service-area-schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const commonCities = ['Austin', 'Dallas', 'Houston', 'San Antonio', 'Fort Worth', 'El Paso'];
  const states = ['Texas', 'California', 'Florida', 'New York', 'Illinois'];

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Map className="w-4 h-4 inline mr-2" />
        <strong>Service Area Schema Generator:</strong> Create Schema.org areaServed markup for service-area businesses (mobile services, delivery, etc.).
      </div>

      {/* Business Info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">Business Information</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your Business Name"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Business Type</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            >
              <option value="LocalBusiness">Local Business</option>
              <option value="HomeAndConstructionBusiness">Home & Construction</option>
              <option value="ProfessionalService">Professional Service</option>
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
              <option value="MovingCompany">Moving Company</option>
              <option value="DeliveryService">Delivery Service</option>
              <option value="Locksmith">Locksmith</option>
              <option value="CleaningService">Cleaning Service</option>
            </select>
          </div>
        </div>
      </div>

      {/* Service Areas */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-zinc-300">Service Areas</h4>
          <div className="flex gap-2">
            <button onClick={() => addArea('City')} className="text-xs text-blue-400 hover:text-blue-300">+City</button>
            <button onClick={() => addArea('State')} className="text-xs text-blue-400 hover:text-blue-300">+State</button>
            <button onClick={() => addArea('GeoCircle')} className="text-xs text-blue-400 hover:text-blue-300">+Radius</button>
            <button onClick={() => addArea('PostalCode')} className="text-xs text-blue-400 hover:text-blue-300">+ZIP</button>
          </div>
        </div>

        <div className="space-y-2">
          {areas.map((area, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-zinc-800 p-2 rounded">
              <select
                value={area.type}
                onChange={(e) => updateArea(idx, 'type', e.target.value as AreaServed['type'])}
                className="bg-zinc-700 text-white p-1.5 rounded border border-zinc-600 text-sm"
              >
                <option value="City">City</option>
                <option value="State">State</option>
                <option value="Country">Country</option>
                <option value="GeoCircle">Radius</option>
                <option value="PostalCode">ZIP Code</option>
              </select>

              {area.type === 'GeoCircle' ? (
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={area.latitude || ''}
                    onChange={(e) => updateArea(idx, 'latitude', e.target.value)}
                    placeholder="Latitude"
                    className="bg-zinc-700 text-white p-1.5 rounded border border-zinc-600 text-sm"
                  />
                  <input
                    type="text"
                    value={area.longitude || ''}
                    onChange={(e) => updateArea(idx, 'longitude', e.target.value)}
                    placeholder="Longitude"
                    className="bg-zinc-700 text-white p-1.5 rounded border border-zinc-600 text-sm"
                  />
                  <input
                    type="text"
                    value={area.radius || ''}
                    onChange={(e) => updateArea(idx, 'radius', e.target.value)}
                    placeholder="Radius (m)"
                    className="bg-zinc-700 text-white p-1.5 rounded border border-zinc-600 text-sm"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={area.name}
                  onChange={(e) => updateArea(idx, 'name', e.target.value)}
                  placeholder={area.type === 'PostalCode' ? 'ZIP Code' : `${area.type} name`}
                  className="flex-1 bg-zinc-700 text-white p-1.5 rounded border border-zinc-600 text-sm"
                />
              )}

              <button
                onClick={() => removeArea(idx)}
                disabled={areas.length === 1}
                className="p-1.5 text-zinc-500 hover:text-red-400 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Quick Add */}
        <div className="mt-3 pt-3 border-t border-zinc-700">
          <div className="text-xs text-zinc-500 mb-2">Quick Add:</div>
          <div className="flex flex-wrap gap-2">
            {commonCities.filter(c => !areas.some(a => a.name === c)).map(city => (
              <button
                key={city}
                onClick={() => setAreas(prev => [...prev, { type: 'City', name: city }])}
                className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs rounded"
              >
                + {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={copyToClipboard}
          className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy Schema'}
        </button>
        <button
          onClick={downloadFile}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-zinc-400">Generated Schema</h4>
        <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-300 font-mono overflow-auto max-h-64">
          {generateSchema()}
        </pre>
      </div>

      {/* Tips */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">Usage Tips:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Use for businesses without a physical storefront (mobile services)</li>
          <li>• GeoCircle is best for radius-based service areas</li>
          <li>• List all major cities/neighborhoods you serve</li>
          <li>• Combine with LocalBusiness schema for complete coverage</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(ServiceAreaSchemaComponent);
