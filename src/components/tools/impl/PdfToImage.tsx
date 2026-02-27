'use client';
import { useState } from 'react';
import { FileText, Download, Upload } from 'lucide-react';

export default function PdfToImage() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <FileText className="w-4 h-4 inline mr-2" /><strong>PDF to Image (Coming Soon):</strong> Convert PDF pages to high-quality images. This tool requires a PDF rendering library.
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
        <FileText className="w-16 h-16 mx-auto text-gray-600 mb-4" />
        <div className="text-lg font-semibold text-gray-400 mb-2">PDF to Image Converter</div>
        <div className="text-sm text-gray-500 max-w-md mx-auto">This tool converts PDF documents to PNG/JPG images page by page. Upload your PDF and download individual pages as images.</div>
        <div className="mt-6 bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-lg p-8">
          <Upload className="w-8 h-8 mx-auto text-gray-500 mb-2" />
          <div className="text-sm text-gray-400">Drop PDF here or click to upload</div>
          <div className="text-xs text-gray-600 mt-1">Max file size: 10MB</div>
        </div>
        <div className="mt-4 text-xs text-yellow-400">⚡ Client-side processing - your files never leave your browser</div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm">
        <div className="font-semibold mb-2">Features</div>
        <ul className="space-y-1 text-gray-400 text-xs">
          <li>✓ Convert all pages or select specific pages</li>
          <li>✓ Choose output format (PNG, JPG)</li>
          <li>✓ Adjustable DPI/quality settings</li>
          <li>✓ Download all pages as ZIP</li>
          <li>✓ 100% client-side processing</li>
        </ul>
      </div>
    </div>
  );
}
