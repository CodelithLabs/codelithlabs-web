'use client';
import { useState, useCallback, memo } from 'react';
import { Building2, Copy, Download, Check, AlertCircle } from 'lucide-react';

interface LocalBusinessData {
  name: string;
  type: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  priceRange: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;
  image: string;
  logo: string;
  sameAs: string[];
  paymentAccepted: string[];
  currenciesAccepted: string;
}

const BUSINESS_TYPES = [
  'LocalBusiness',
  'Restaurant',
  'Dentist',
  'Attorney',
  'Physician',
  'AccountingService',
  'AutoRepair',
  'BankOrCreditUnion',
  'BarOrPub',
  'BeautySalon',
  'CafeOrCoffeeShop',
  'ChildCare',
  'Electrician',
  'FitnessCenter',
  'Florist',
  'HairSalon',
  'HealthClub',
  'HomeAndConstructionBusiness',
  'Hotel',
  'InsuranceAgency',
  'LegalService',
  'MovingCompany',
  'Pharmacy',
  'Plumber',
  'RealEstateAgent',
  'SportsClub',
  'Store',
  'TravelAgency',
  'VeterinaryCare',
];

const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Apple Pay',
  'Google Pay',
  'PayPal',
  'Bank Transfer',
  'Check',
  'Invoice',
];

const LocalBusinessSchemaComponent = function LocalBusinessSchema() {
  const [data, setData] = useState<LocalBusinessData>({
    name: '',
    type: 'LocalBusiness',
    description: '',
    url: '',
    telephone: '',
    email: '',
    priceRange: '$$',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    latitude: '',
    longitude: '',
    image: '',
    logo: '',
    sameAs: [''],
    paymentAccepted: ['Credit Card', 'Cash'],
    currenciesAccepted: 'USD',
  });
  const [copied, setCopied] = useState(false);

  const updateData = useCallback((field: keyof LocalBusinessData, value: string | string[]) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateSameAs = useCallback((idx: number, value: string) => {
    setData(prev => ({
      ...prev,
      sameAs: prev.sameAs.map((s, i) => i === idx ? value : s),
    }));
  }, []);

  const addSameAs = () => {
    setData(prev => ({ ...prev, sameAs: [...prev.sameAs, ''] }));
  };

  const removeSameAs = (idx: number) => {
    setData(prev => ({ ...prev, sameAs: prev.sameAs.filter((_, i) => i !== idx) }));
  };

  const togglePayment = (method: string) => {
    setData(prev => ({
      ...prev,
      paymentAccepted: prev.paymentAccepted.includes(method)
        ? prev.paymentAccepted.filter(p => p !== method)
        : [...prev.paymentAccepted, method],
    }));
  };

  const generateSchema = useCallback(() => {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': data.type || 'LocalBusiness',
    };

    if (data.name) schema.name = data.name;
    if (data.description) schema.description = data.description;
    if (data.url) schema.url = data.url;
    if (data.telephone) schema.telephone = data.telephone;
    if (data.email) schema.email = data.email;
    if (data.priceRange) schema.priceRange = data.priceRange;
    if (data.image) schema.image = data.image;
    if (data.logo) schema.logo = data.logo;
    if (data.currenciesAccepted) schema.currenciesAccepted = data.currenciesAccepted;

    if (data.paymentAccepted.length > 0) {
      schema.paymentAccepted = data.paymentAccepted.join(', ');
    }

    if (data.streetAddress || data.city || data.state || data.postalCode) {
      schema.address = {
        '@type': 'PostalAddress',
        ...(data.streetAddress && { streetAddress: data.streetAddress }),
        ...(data.city && { addressLocality: data.city }),
        ...(data.state && { addressRegion: data.state }),
        ...(data.postalCode && { postalCode: data.postalCode }),
        ...(data.country && { addressCountry: data.country }),
      };
    }

    if (data.latitude && data.longitude) {
      schema.geo = {
        '@type': 'GeoCoordinates',
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      };
    }

    const validSameAs = data.sameAs.filter(s => s.trim());
    if (validSameAs.length > 0) {
      schema.sameAs = validSameAs;
    }

    return JSON.stringify(schema, null, 2);
  }, [data]);

  const getValidationErrors = useCallback(() => {
    const errors: string[] = [];
    if (!data.name) errors.push('Business name is required');
    if (!data.streetAddress && !data.city) errors.push('Address information recommended');
    if (!data.telephone && !data.email) errors.push('Contact information recommended');
    return errors;
  }, [data]);

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
    a.download = 'local-business-schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const errors = getValidationErrors();

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Building2 className="w-4 h-4 inline mr-2" />
        <strong>Local Business Schema Generator:</strong> Create Schema.org LocalBusiness structured data for enhanced local search presence.
      </div>

      {/* Basic Info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-medium text-zinc-300">Basic Information</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Business Name *</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData('name', e.target.value)}
              placeholder="Your Business Name"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Business Type</label>
            <select
              value={data.type}
              onChange={(e) => updateData('type', e.target.value)}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            >
              {BUSINESS_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-zinc-500 block mb-1">Description</label>
            <textarea
              value={data.description}
              onChange={(e) => updateData('description', e.target.value)}
              placeholder="Brief description of your business..."
              rows={2}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Website URL</label>
            <input
              type="url"
              value={data.url}
              onChange={(e) => updateData('url', e.target.value)}
              placeholder="https://yourbusiness.com"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Price Range</label>
            <select
              value={data.priceRange}
              onChange={(e) => updateData('priceRange', e.target.value)}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            >
              <option value="$">$ (Budget)</option>
              <option value="$$">$$ (Moderate)</option>
              <option value="$$$">$$$ (Premium)</option>
              <option value="$$$$">$$$$ (Luxury)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-medium text-zinc-300">Contact Information</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Phone Number</label>
            <input
              type="tel"
              value={data.telephone}
              onChange={(e) => updateData('telephone', e.target.value)}
              placeholder="+1-555-123-4567"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => updateData('email', e.target.value)}
              placeholder="contact@business.com"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-medium text-zinc-300">Address</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs text-zinc-500 block mb-1">Street Address</label>
            <input
              type="text"
              value={data.streetAddress}
              onChange={(e) => updateData('streetAddress', e.target.value)}
              placeholder="123 Main Street"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">City</label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => updateData('city', e.target.value)}
              placeholder="San Francisco"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">State/Region</label>
            <input
              type="text"
              value={data.state}
              onChange={(e) => updateData('state', e.target.value)}
              placeholder="CA"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Postal Code</label>
            <input
              type="text"
              value={data.postalCode}
              onChange={(e) => updateData('postalCode', e.target.value)}
              placeholder="94102"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Country Code</label>
            <input
              type="text"
              value={data.country}
              onChange={(e) => updateData('country', e.target.value)}
              placeholder="US"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Latitude</label>
            <input
              type="text"
              value={data.latitude}
              onChange={(e) => updateData('latitude', e.target.value)}
              placeholder="37.7749"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Longitude</label>
            <input
              type="text"
              value={data.longitude}
              onChange={(e) => updateData('longitude', e.target.value)}
              placeholder="-122.4194"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-2">Payment Methods</h4>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map(method => (
            <button
              key={method}
              onClick={() => togglePayment(method)}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                data.paymentAccepted.includes(method)
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {data.paymentAccepted.includes(method) && <Check className="w-3 h-3 inline mr-1" />}
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-zinc-300">Social Media Links</h4>
          <button onClick={addSameAs} className="text-xs text-blue-400 hover:text-blue-300">
            + Add Link
          </button>
        </div>
        <div className="space-y-2">
          {data.sameAs.map((url, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => updateSameAs(idx, e.target.value)}
                placeholder="https://facebook.com/yourbusiness"
                className="flex-1 bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm"
              />
              {data.sameAs.length > 1 && (
                <button
                  onClick={() => removeSameAs(idx)}
                  className="text-zinc-500 hover:text-red-400 px-2"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Validation Errors */}
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
    </div>
  );
};

export default memo(LocalBusinessSchemaComponent);
