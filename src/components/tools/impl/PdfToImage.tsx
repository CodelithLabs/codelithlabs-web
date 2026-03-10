'use client';
import { memo, useCallback, useState } from 'react';
import { AlertTriangle, Download, FileText, Upload } from 'lucide-react';

interface ConvertedPage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

function parsePageRange(input: string, totalPages: number): number[] {
  if (!input.trim()) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  const chunks = input
    .split(',')
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  for (const chunk of chunks) {
    if (chunk.includes('-')) {
      const [startRaw, endRaw] = chunk.split('-').map((value) => Number(value.trim()));
      if (!Number.isFinite(startRaw) || !Number.isFinite(endRaw)) continue;
      const start = Math.max(1, Math.min(startRaw, endRaw));
      const end = Math.min(totalPages, Math.max(startRaw, endRaw));
      for (let page = start; page <= end; page += 1) {
        pages.add(page);
      }
      continue;
    }

    const singlePage = Number(chunk);
    if (Number.isFinite(singlePage) && singlePage >= 1 && singlePage <= totalPages) {
      pages.add(singlePage);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

function PdfToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'png' | 'jpg'>('png');
  const [scale, setScale] = useState('1.5');
  const [quality, setQuality] = useState('0.92');
  const [pageRange, setPageRange] = useState('');
  const [pages, setPages] = useState<ConvertedPage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setPages([]);
    setProgress(0);
    setError(null);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setProcessing(true);
    setError(null);
    setPages([]);
    setProgress(0);

    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

      const scaleValue = Number(scale);
      if (!Number.isFinite(scaleValue) || scaleValue <= 0) {
        throw new Error('Scale must be a positive number.');
      }

      const qualityValue = Number(quality);
      if (!Number.isFinite(qualityValue) || qualityValue <= 0 || qualityValue > 1) {
        throw new Error('JPG quality must be a number between 0 and 1.');
      }

      const data = new Uint8Array(await file.arrayBuffer());
      const loadingTask = pdfjs.getDocument({ data });
      const pdf = await loadingTask.promise;

      const pageNumbers = parsePageRange(pageRange, pdf.numPages);
      if (pageNumbers.length === 0) {
        throw new Error(`No valid page numbers found. This PDF has ${pdf.numPages} page(s).`);
      }

      const output: ConvertedPage[] = [];
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';

      for (let idx = 0; idx < pageNumbers.length; idx += 1) {
        const pageNumber = pageNumbers[idx];
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: scaleValue });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');

        if (!context) {
          throw new Error('Failed to get canvas context while rendering PDF.');
        }

        await page.render({
          canvas,
          canvasContext: context,
          viewport,
        }).promise;

        const dataUrl = format === 'jpg'
          ? canvas.toDataURL(mimeType, qualityValue)
          : canvas.toDataURL(mimeType);

        output.push({
          pageNumber,
          dataUrl,
          width: Math.round(viewport.width),
          height: Math.round(viewport.height),
        });

        setProgress(Math.round(((idx + 1) / pageNumbers.length) * 100));
      }

      setPages(output);
    } catch (conversionError) {
      setError(conversionError instanceof Error ? conversionError.message : 'Failed to convert PDF file.');
    } finally {
      setProcessing(false);
    }
  }, [file, format, pageRange, quality, scale]);

  const downloadPage = useCallback((page: ConvertedPage) => {
    const link = document.createElement('a');
    link.href = page.dataUrl;
    link.download = `pdf-page-${page.pageNumber}.${format}`;
    link.click();
  }, [format]);

  const downloadAll = useCallback(() => {
    pages.forEach((page, index) => {
      window.setTimeout(() => {
        const link = document.createElement('a');
        link.href = page.dataUrl;
        link.download = `pdf-page-${page.pageNumber}.${format}`;
        link.click();
      }, index * 120);
    });
  }, [format, pages]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">PDF to Image Converter</h3>
        <p className="text-sm text-zinc-400">
          Convert PDF pages to PNG or JPG directly in your browser. Files never leave your device.
        </p>

        <label className="block border-2 border-dashed border-zinc-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
          <Upload className="w-7 h-7 mx-auto text-zinc-400 mb-2" />
          <span className="text-sm text-zinc-300 block">Click to upload a PDF</span>
          <span className="text-xs text-zinc-500">Recommended: files under 20MB for smooth browser rendering</span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {file && (
          <div className="text-sm text-zinc-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>{file.name}</span>
            <span className="text-zinc-500">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'png' | 'jpg')}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
            >
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Scale</label>
            <input
              type="number"
              min="0.5"
              max="4"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">JPG quality</label>
            <input
              type="number"
              min="0.1"
              max="1"
              step="0.01"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
              disabled={format !== 'jpg'}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Page range (optional)</label>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="e.g. 1-3,5"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
            />
          </div>
        </div>

        <button
          onClick={handleConvert}
          disabled={!file || processing}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-400 text-white font-medium rounded-lg transition-colors"
        >
          {processing ? `Converting... ${progress}%` : 'Convert PDF to Images'}
        </button>

        {error && (
          <div className="flex items-start gap-2 text-sm text-red-300 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {pages.length > 0 && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-white font-semibold">Converted pages ({pages.length})</h4>
            <button
              onClick={downloadAll}
              className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pages.map((page) => (
              <div key={page.pageNumber} className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-zinc-300">Page {page.pageNumber}</p>
                  <button
                    onClick={() => downloadPage(page)}
                    className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Download
                  </button>
                </div>
                <img
                  src={page.dataUrl}
                  alt={`Converted PDF page ${page.pageNumber}`}
                  className="w-full rounded border border-zinc-700"
                />
                <p className="text-xs text-zinc-500">{page.width} × {page.height}px</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(PdfToImage);
