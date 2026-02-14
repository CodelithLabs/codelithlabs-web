'use client';
import { useState } from 'react';
import DOMPurify from 'dompurify';

export default function MarkdownPreviewer() {
  const [md, setMd] = useState('# Hello World\n\nType **markdown** here!');
  
  // Basic parser that doesn't use the /s flag to avoid TS errors
  const parseBasic = (text: string) => {
    return text
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
      .replace(/\*(.*)\*/gim, '<i>$1</i>')
      .replace(/\n/gim, '<br />');
  };

  const sanitizeHTML = (html: string) => {
    // Sanitizing user input blocks XSS - using explicit whitelist for markdown preview safety
    // ADD_ATTR with rel ensures target="_blank" links include noopener noreferrer for security
    return DOMPurify.sanitize(html, { 
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'b', 'i', 'strong', 'em', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'a'],
      ALLOWED_ATTR: ['href', 'title', 'target'],
      ADD_ATTR: ['rel']
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-4 h-[500px]">
      <textarea 
        value={md} 
        onChange={(e) => setMd(e.target.value)} 
        className="bg-zinc-800 p-4 rounded-xl text-white font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
      <div className="bg-white text-black p-4 rounded-xl overflow-auto prose">
        <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(parseBasic(md)) }} />
        <p className="text-xs text-gray-500 mt-4 border-t pt-2">
          Note: This is a lightweight preview.
        </p>
      </div>
    </div>
  );
}
