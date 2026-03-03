'use client';
import { useState, useCallback, memo } from 'react';
import { ShoppingBag, Copy, Download, Plus, Trash2, Check, AlertCircle } from 'lucide-react';

interface ProductData {
  name: string;
  description: string;
  brand: string;
  sku: string;
  mpn: string;
  gtin: string;
  image: string;
  price: string;
  currency: string;
  availability: string;
  condition: string;
  url: string;
  ratingValue: string;
  reviewCount: string;
}

const AVAILABILITY_OPTIONS = [
  { value: 'https://schema.org/InStock', label: 'In Stock' },
  { value: 'https://schema.org/OutOfStock', label: 'Out of Stock' },
  { value: 'https://schema.org/PreOrder', label: 'Pre-Order' },
  { value: 'https://schema.org/BackOrder', label: 'Back Order' },
  { value: 'https://schema.org/Discontinued', label: 'Discontinued' },
  { value: 'https://schema.org/LimitedAvailability', label: 'Limited Availability' },
];

const CONDITION_OPTIONS = [
  { value: 'https://schema.org/NewCondition', label: 'New' },
  { value: 'https://schema.org/RefurbishedCondition', label: 'Refurbished' },
  { value: 'https://schema.org/UsedCondition', label: 'Used' },
  { value: 'https://schema.org/DamagedCondition', label: 'Damaged' },
];

const ProductSchemaGeneratorComponent = function ProductSchemaGenerator() {
  const [product, setProduct] = useState<ProductData>({
    name: '',
    description: '',
    brand: '',
    sku: '',
    mpn: '',
    gtin: '',
    image: '',
    price: '',
    currency: 'USD',
    availability: 'https://schema.org/InStock',
    condition: 'https://schema.org/NewCondition',
    url: '',
    ratingValue: '',
    reviewCount: '',
  });
  const [copied, setCopied] = useState(false);

  const updateProduct = useCallback((field: keyof ProductData, value: string) => {
    setProduct(prev => ({ ...prev, [field]: value }));
  }, []);

  const generateSchema = useCallback(() => {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
    };

    if (product.name) schema.name = product.name;
    if (product.description) schema.description = product.description;
    if (product.image) schema.image = product.image;
    if (product.url) schema.url = product.url;
    if (product.sku) schema.sku = product.sku;
    if (product.mpn) schema.mpn = product.mpn;
    if (product.gtin) schema.gtin = product.gtin;

    if (product.brand) {
      schema.brand = {
        '@type': 'Brand',
        name: product.brand,
      };
    }

    if (product.price) {
      schema.offers = {
        '@type': 'Offer',
        price: parseFloat(product.price),
        priceCurrency: product.currency,
        availability: product.availability,
        itemCondition: product.condition,
        ...(product.url && { url: product.url }),
      };
    }

    if (product.ratingValue && product.reviewCount) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: parseFloat(product.ratingValue),
        reviewCount: parseInt(product.reviewCount),
        bestRating: 5,
        worstRating: 1,
      };
    }

    return JSON.stringify(schema, null, 2);
  }, [product]);

  const getValidationErrors = useCallback(() => {
    const errors: string[] = [];
    if (!product.name) errors.push('Product name is required');
    if (!product.price) errors.push('Price is required for offers');
    if (!product.image) errors.push('Image URL is recommended');
    if (product.ratingValue && !product.reviewCount) {
      errors.push('Review count required with rating');
    }
    return errors;
  }, [product]);

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
    a.download = 'product-schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const errors = getValidationErrors();

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <ShoppingBag className="w-4 h-4 inline mr-2" />
        <strong>Product Schema Generator:</strong> Create Schema.org Product structured data for rich search results with pricing, availability, and reviews.
      </div>

      {/* Basic Info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-medium text-zinc-300">Product Information</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs text-zinc-500 block mb-1">Product Name *</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => updateProduct('name', e.target.value)}
              placeholder="Product Name"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-zinc-500 block mb-1">Description</label>
            <textarea
              value={product.description}
              onChange={(e) => updateProduct('description', e.target.value)}
              placeholder="Product description..."
              rows={3}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Brand</label>
            <input
              type="text"
              value={product.brand}
              onChange={(e) => updateProduct('brand', e.target.value)}
              placeholder="Brand Name"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Product URL</label>
            <input
              type="url"
              value={product.url}
              onChange={(e) => updateProduct('url', e.target.value)}
              placeholder="https://example.com/product"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-zinc-500 block mb-1">Image URL</label>
            <input
              type="url"
              value={product.image}
              onChange={(e) => updateProduct('image', e.target.value)}
              placeholder="https://example.com/product-image.jpg"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Identifiers */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-medium text-zinc-300">Product Identifiers</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">SKU</label>
            <input
              type="text"
              value={product.sku}
              onChange={(e) => updateProduct('sku', e.target.value)}
              placeholder="SKU-12345"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">MPN (Manufacturer Part #)</label>
            <input
              type="text"
              value={product.mpn}
              onChange={(e) => updateProduct('mpn', e.target.value)}
              placeholder="MPN-12345"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">GTIN/UPC/EAN</label>
            <input
              type="text"
              value={product.gtin}
              onChange={(e) => updateProduct('gtin', e.target.value)}
              placeholder="012345678901"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-medium text-zinc-300">Pricing & Availability</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Price *</label>
            <input
              type="number"
              value={product.price}
              onChange={(e) => updateProduct('price', e.target.value)}
              placeholder="99.99"
              step="0.01"
              min="0"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Currency</label>
            <select
              value={product.currency}
              onChange={(e) => updateProduct('currency', e.target.value)}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Availability</label>
            <select
              value={product.availability}
              onChange={(e) => updateProduct('availability', e.target.value)}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            >
              {AVAILABILITY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Condition</label>
            <select
              value={product.condition}
              onChange={(e) => updateProduct('condition', e.target.value)}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            >
              {CONDITION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-medium text-zinc-300">Aggregate Rating (Optional)</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Average Rating (1-5)</label>
            <input
              type="number"
              value={product.ratingValue}
              onChange={(e) => updateProduct('ratingValue', e.target.value)}
              placeholder="4.5"
              step="0.1"
              min="1"
              max="5"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Number of Reviews</label>
            <input
              type="number"
              value={product.reviewCount}
              onChange={(e) => updateProduct('reviewCount', e.target.value)}
              placeholder="127"
              min="1"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
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

export default memo(ProductSchemaGeneratorComponent);
