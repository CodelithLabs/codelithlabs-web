'use client';
import { useState , memo } from 'react';
import { Code, Copy, Check } from 'lucide-react';

const HtmlToJsxComponent = function HtmlToJsx() {
  const [input, setInput] = useState('<div class="container">\n  <label for="name">Name</label>\n  <input type="text" class="input" tabindex="1" readonly />\n  <img src="photo.jpg" alt="photo" />\n  <br>\n  <hr>\n  <p style="color: red; font-size: 16px;">Hello World</p>\n  <!-- This is a comment -->\n</div>');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = () => {
    let jsx = input;
    // Replace class with className
    jsx = jsx.replace(/\bclass=/g, 'className=');
    // Replace for with htmlFor
    jsx = jsx.replace(/\bfor=/g, 'htmlFor=');
    // Replace tabindex with tabIndex
    jsx = jsx.replace(/\btabindex=/g, 'tabIndex=');
    // Replace readonly with readOnly
    jsx = jsx.replace(/\breadonly\b/g, 'readOnly');
    // Replace colspan with colSpan
    jsx = jsx.replace(/\bcolspan=/g, 'colSpan=');
    // Replace rowspan with rowSpan
    jsx = jsx.replace(/\browspan=/g, 'rowSpan=');
    // Replace maxlength with maxLength
    jsx = jsx.replace(/\bmaxlength=/g, 'maxLength=');
    // Replace cellpadding with cellPadding
    jsx = jsx.replace(/\bcellpadding=/g, 'cellPadding=');
    // Replace cellspacing with cellSpacing
    jsx = jsx.replace(/\bcellspacing=/g, 'cellSpacing=');
    // Replace crossorigin with crossOrigin
    jsx = jsx.replace(/\bcrossorigin=/g, 'crossOrigin=');
    // Replace charset with charSet
    jsx = jsx.replace(/\bcharset=/g, 'charSet=');
    // Replace autocomplete with autoComplete
    jsx = jsx.replace(/\bautocomplete=/g, 'autoComplete=');
    // Replace autofocus with autoFocus
    jsx = jsx.replace(/\bautofocus\b/g, 'autoFocus');

    // Self-close void elements
    jsx = jsx.replace(/<(br|hr|img|input|link|meta|area|base|col|embed|source|track|wbr)(\s[^>]*?)?\s*(?<!\/)>/gi, '<$1$2 />');

    // Convert inline styles to objects
    jsx = jsx.replace(/style="([^"]*)"/g, (_match, style: string) => {
      const props = style.split(';').filter(Boolean).map(s => {
        const [prop, ...vals] = s.split(':');
        const key = prop.trim().replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
        let value: string | number = vals.join(':').trim();
        if (/^\d+px$/.test(value)) value = parseInt(value);
        else if (/^\d+$/.test(value)) value = parseInt(value);
        else value = `'${value}'`;
        return `${key}: ${value}`;
      });
      return `style={{${props.join(', ')}}}`;
    });

    // Convert HTML comments to JSX comments
    jsx = jsx.replace(/<!--\s*(.*?)\s*-->/g, '{/* $1 */}');

    setOutput(jsx);
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Code className="w-4 h-4 inline mr-2" /><strong>HTML to JSX Converter:</strong> Convert HTML to React JSX — transforms class→className, style strings→objects, self-closes void tags, and more.
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm block mb-1">HTML Input</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={14} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 font-mono text-xs" placeholder="Paste HTML here..." />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm">JSX Output</label>
            {output && <button onClick={copy} className="text-gray-400 hover:text-white">{copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}</button>}
          </div>
          <pre className="w-full bg-zinc-900 text-green-400 p-3 rounded-lg border border-zinc-700 font-mono text-xs h-[336px] overflow-auto whitespace-pre-wrap">{output || 'Click Convert to see JSX...'}</pre>
        </div>
      </div>
      <button onClick={convert} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Convert to JSX</button>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-gray-500">
        <div className="font-semibold text-gray-400 mb-2">Conversions Applied</div>
        <div className="grid grid-cols-2 gap-1">
          <div>✓ class → className</div>
          <div>✓ for → htmlFor</div>
          <div>✓ tabindex → tabIndex</div>
          <div>✓ readonly → readOnly</div>
          <div>✓ Self-closing void tags</div>
          <div>✓ Style strings → objects</div>
          <div>✓ HTML comments → JSX</div>
          <div>✓ camelCase attributes</div>
        </div>
      </div>
    </div>
  );
}

export default memo(HtmlToJsxComponent);
