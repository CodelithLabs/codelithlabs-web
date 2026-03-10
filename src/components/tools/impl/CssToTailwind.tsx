'use client';

import { memo, useState, useCallback } from 'react';

const cssToTailwindMap: { [key: string]: (value: string) => string } = {
  'display': (v) => v === 'flex' ? 'flex' : v === 'grid' ? 'grid' : v === 'block' ? 'block' : v === 'inline' ? 'inline' : v === 'none' ? 'hidden' : v === 'inline-block' ? 'inline-block' : '',
  'flex-direction': (v) => v === 'column' ? 'flex-col' : v === 'row' ? 'flex-row' : v === 'column-reverse' ? 'flex-col-reverse' : v === 'row-reverse' ? 'flex-row-reverse' : '',
  'justify-content': (v) => v === 'center' ? 'justify-center' : v === 'flex-start' ? 'justify-start' : v === 'flex-end' ? 'justify-end' : v === 'space-between' ? 'justify-between' : v === 'space-around' ? 'justify-around' : v === 'space-evenly' ? 'justify-evenly' : '',
  'align-items': (v) => v === 'center' ? 'items-center' : v === 'flex-start' ? 'items-start' : v === 'flex-end' ? 'items-end' : v === 'stretch' ? 'items-stretch' : v === 'baseline' ? 'items-baseline' : '',
  'flex-wrap': (v) => v === 'wrap' ? 'flex-wrap' : v === 'nowrap' ? 'flex-nowrap' : v === 'wrap-reverse' ? 'flex-wrap-reverse' : '',
  'position': (v) => v === 'relative' ? 'relative' : v === 'absolute' ? 'absolute' : v === 'fixed' ? 'fixed' : v === 'sticky' ? 'sticky' : v === 'static' ? 'static' : '',
  'text-align': (v) => v === 'center' ? 'text-center' : v === 'left' ? 'text-left' : v === 'right' ? 'text-right' : v === 'justify' ? 'text-justify' : '',
  'font-weight': (v) => v === 'bold' || v === '700' ? 'font-bold' : v === '600' ? 'font-semibold' : v === '500' ? 'font-medium' : v === '400' || v === 'normal' ? 'font-normal' : v === '300' ? 'font-light' : '',
  'overflow': (v) => v === 'hidden' ? 'overflow-hidden' : v === 'auto' ? 'overflow-auto' : v === 'scroll' ? 'overflow-scroll' : v === 'visible' ? 'overflow-visible' : '',
  'cursor': (v) => `cursor-${v}`,
  'visibility': (v) => v === 'hidden' ? 'invisible' : v === 'visible' ? 'visible' : '',
  'width': (v) => v === '100%' ? 'w-full' : v === 'auto' ? 'w-auto' : v === '100vw' ? 'w-screen' : `w-[${v}]`,
  'height': (v) => v === '100%' ? 'h-full' : v === 'auto' ? 'h-auto' : v === '100vh' ? 'h-screen' : `h-[${v}]`,
  'min-width': (v) => v === '100%' ? 'min-w-full' : `min-w-[${v}]`,
  'max-width': (v) => v === '100%' ? 'max-w-full' : v === 'none' ? 'max-w-none' : `max-w-[${v}]`,
  'min-height': (v) => v === '100%' ? 'min-h-full' : v === '100vh' ? 'min-h-screen' : `min-h-[${v}]`,
  'max-height': (v) => v === '100%' ? 'max-h-full' : v === '100vh' ? 'max-h-screen' : `max-h-[${v}]`,
  'margin': (v) => v === 'auto' ? 'm-auto' : v === '0' ? 'm-0' : `m-[${v}]`,
  'margin-top': (v) => v === 'auto' ? 'mt-auto' : v === '0' ? 'mt-0' : `mt-[${v}]`,
  'margin-right': (v) => v === 'auto' ? 'mr-auto' : v === '0' ? 'mr-0' : `mr-[${v}]`,
  'margin-bottom': (v) => v === 'auto' ? 'mb-auto' : v === '0' ? 'mb-0' : `mb-[${v}]`,
  'margin-left': (v) => v === 'auto' ? 'ml-auto' : v === '0' ? 'ml-0' : `ml-[${v}]`,
  'padding': (v) => v === '0' ? 'p-0' : `p-[${v}]`,
  'padding-top': (v) => v === '0' ? 'pt-0' : `pt-[${v}]`,
  'padding-right': (v) => v === '0' ? 'pr-0' : `pr-[${v}]`,
  'padding-bottom': (v) => v === '0' ? 'pb-0' : `pb-[${v}]`,
  'padding-left': (v) => v === '0' ? 'pl-0' : `pl-[${v}]`,
  'border-radius': (v) => v === '50%' ? 'rounded-full' : v === '0' ? 'rounded-none' : `rounded-[${v}]`,
  'gap': (v) => v === '0' ? 'gap-0' : `gap-[${v}]`,
  'opacity': (v) => `opacity-[${v}]`,
  'z-index': (v) => `z-[${v}]`,
};

function CssToTailwind() {
  const [css, setCss] = useState('');
  const [result, setResult] = useState('');

  const handleConvert = useCallback(() => {
    const lines = css.split('\n');
    const tailwindClasses: string[] = [];

    for (const line of lines) {
      const match = line.match(/^\s*([\w-]+)\s*:\s*([^;]+);?\s*$/);
      if (match) {
        const [, property, value] = match;
        const converter = cssToTailwindMap[property.toLowerCase()];
        if (converter) {
          const tailwindClass = converter(value.trim());
          if (tailwindClass) {
            tailwindClasses.push(tailwindClass);
          }
        } else {
          tailwindClasses.push(`/* ${property}: ${value} */`);
        }
      }
    }

    setResult(tailwindClasses.join(' '));
  }, [css]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">CSS to Tailwind Converter</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">CSS Input</label>
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              placeholder={`display: flex;
justify-content: center;
align-items: center;
padding: 16px;
border-radius: 8px;`}
              rows={8}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          <button
            onClick={handleConvert}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Convert to Tailwind
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Tailwind Classes</h3>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
            >
              Copy
            </button>
          </div>
          <pre className="bg-zinc-900 rounded-lg p-4 text-green-400 text-sm overflow-x-auto font-mono whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

export default memo(CssToTailwind);
