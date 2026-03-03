'use client';
import { useState, useCallback, memo } from 'react';
import { BookOpen, Copy, Check, Plus, Trash2, GraduationCap } from 'lucide-react';

interface Citation {
  type: 'book' | 'journal' | 'website' | 'news';
  authors: string[];
  title: string;
  year: string;
  // Book fields
  publisher?: string;
  edition?: string;
  pages?: string;
  // Journal fields
  journalName?: string;
  volume?: string;
  issue?: string;
  doi?: string;
  // Website fields
  url?: string;
  accessDate?: string;
  siteName?: string;
  // News fields
  newspaperName?: string;
  articleUrl?: string;
}

type CitationStyle = 'apa7' | 'mla9' | 'chicago' | 'harvard' | 'ieee';

const CitationFormatterComponent = function CitationFormatter() {
  const [style, setStyle] = useState<CitationStyle>('apa7');
  const [citation, setCitation] = useState<Citation>({
    type: 'book',
    authors: ['Smith, John'],
    title: 'Introduction to Research Methods',
    year: '2024',
    publisher: 'Academic Press',
    edition: '2nd',
    pages: '',
  });
  const [copied, setCopied] = useState(false);

  const formatAuthorAPA = (authors: string[]): string => {
    if (authors.length === 0) return '';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
    if (authors.length <= 20) {
      return authors.slice(0, -1).join(', ') + ', & ' + authors[authors.length - 1];
    }
    return authors.slice(0, 19).join(', ') + '... ' + authors[authors.length - 1];
  };

  const formatAuthorMLA = (authors: string[]): string => {
    if (authors.length === 0) return '';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]}, and ${authors[1]}`;
    return `${authors[0]}, et al.`;
  };

  const formatAuthorChicago = (authors: string[]): string => {
    if (authors.length === 0) return '';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
    if (authors.length === 3) return `${authors[0]}, ${authors[1]}, and ${authors[2]}`;
    return `${authors[0]} et al.`;
  };

  const formatAuthorIEEE = (authors: string[]): string => {
    const formatName = (name: string) => {
      const parts = name.split(',').map(p => p.trim());
      if (parts.length === 2) {
        return `${parts[1][0]}. ${parts[0]}`;
      }
      return name;
    };
    
    if (authors.length <= 6) {
      return authors.map(formatName).join(', ');
    }
    return authors.slice(0, 3).map(formatName).join(', ') + ', et al.';
  };

  const generateCitation = useCallback((): string => {
    const { type, authors, title, year, publisher, edition, pages, journalName, volume, issue, doi, url, accessDate, siteName, newspaperName } = citation;

    switch (style) {
      case 'apa7':
        if (type === 'book') {
          const ed = edition ? ` (${edition} ed.)` : '';
          return `${formatAuthorAPA(authors)} (${year}). *${title}*${ed}. ${publisher}.`;
        }
        if (type === 'journal') {
          const vol = volume ? `*${volume}*` : '';
          const iss = issue ? `(${issue})` : '';
          const pg = pages ? `, ${pages}` : '';
          const doiStr = doi ? ` https://doi.org/${doi}` : '';
          return `${formatAuthorAPA(authors)} (${year}). ${title}. *${journalName}*, ${vol}${iss}${pg}.${doiStr}`;
        }
        if (type === 'website') {
          const site = siteName ? `${siteName}. ` : '';
          return `${formatAuthorAPA(authors)} (${year}). ${title}. ${site}${url}`;
        }
        if (type === 'news') {
          return `${formatAuthorAPA(authors)} (${year}). ${title}. *${newspaperName}*. ${url || ''}`;
        }
        break;

      case 'mla9':
        if (type === 'book') {
          const ed = edition ? ` ${edition} ed.,` : '';
          return `${formatAuthorMLA(authors)}. *${title}*.${ed} ${publisher}, ${year}.`;
        }
        if (type === 'journal') {
          const vol = volume ? `, vol. ${volume}` : '';
          const iss = issue ? `, no. ${issue}` : '';
          const pg = pages ? `, pp. ${pages}` : '';
          return `${formatAuthorMLA(authors)}. "${title}." *${journalName}*${vol}${iss}, ${year}${pg}.`;
        }
        if (type === 'website') {
          const access = accessDate ? ` Accessed ${accessDate}.` : '';
          return `${formatAuthorMLA(authors)}. "${title}." *${siteName || 'Website'}*, ${year}, ${url}.${access}`;
        }
        break;

      case 'chicago':
        if (type === 'book') {
          const ed = edition ? ` ${edition} ed.` : '';
          return `${formatAuthorChicago(authors)}. *${title}*.${ed} ${publisher}, ${year}.`;
        }
        if (type === 'journal') {
          const vol = volume ? ` ${volume}` : '';
          const iss = issue ? `, no. ${issue}` : '';
          const pg = pages ? `: ${pages}` : '';
          return `${formatAuthorChicago(authors)}. "${title}." *${journalName}*${vol}${iss} (${year})${pg}.`;
        }
        break;

      case 'harvard':
        if (type === 'book') {
          const ed = edition ? ` ${edition} edn.` : '';
          return `${formatAuthorAPA(authors)} (${year}) *${title}*.${ed} ${publisher}.`;
        }
        if (type === 'journal') {
          const vol = volume ? `, ${volume}` : '';
          const iss = issue ? `(${issue})` : '';
          const pg = pages ? `, pp. ${pages}` : '';
          return `${formatAuthorAPA(authors)} (${year}) '${title}', *${journalName}*${vol}${iss}${pg}.`;
        }
        break;

      case 'ieee':
        if (type === 'book') {
          return `${formatAuthorIEEE(authors)}, *${title}*. ${publisher}, ${year}.`;
        }
        if (type === 'journal') {
          const vol = volume ? `, vol. ${volume}` : '';
          const iss = issue ? `, no. ${issue}` : '';
          const pg = pages ? `, pp. ${pages}` : '';
          return `${formatAuthorIEEE(authors)}, "${title}," *${journalName}*${vol}${iss}${pg}, ${year}.`;
        }
        break;
    }

    return 'Citation format not supported for this source type.';
  }, [citation, style]);

  const formattedCitation = generateCitation();

  const updateField = useCallback(<K extends keyof Citation>(field: K, value: Citation[K]) => {
    setCitation(prev => ({ ...prev, [field]: value }));
  }, []);

  const addAuthor = () => {
    setCitation(prev => ({ ...prev, authors: [...prev.authors, ''] }));
  };

  const removeAuthor = (idx: number) => {
    setCitation(prev => ({ ...prev, authors: prev.authors.filter((_, i) => i !== idx) }));
  };

  const updateAuthor = (idx: number, value: string) => {
    setCitation(prev => ({
      ...prev,
      authors: prev.authors.map((a, i) => i === idx ? value : a),
    }));
  };

  const copyToClipboard = async () => {
    // Remove markdown formatting for clipboard
    const plainText = formattedCitation.replace(/\*/g, '');
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const styles: { id: CitationStyle; name: string; description: string }[] = [
    { id: 'apa7', name: 'APA 7th', description: 'American Psychological Association' },
    { id: 'mla9', name: 'MLA 9th', description: 'Modern Language Association' },
    { id: 'chicago', name: 'Chicago', description: 'Chicago Manual of Style' },
    { id: 'harvard', name: 'Harvard', description: 'Harvard Referencing' },
    { id: 'ieee', name: 'IEEE', description: 'Institute of Electrical & Electronics Engineers' },
  ];

  const sourceTypes = [
    { id: 'book', name: 'Book', icon: '📚' },
    { id: 'journal', name: 'Journal Article', icon: '📰' },
    { id: 'website', name: 'Website', icon: '🌐' },
    { id: 'news', name: 'News Article', icon: '📢' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <GraduationCap className="w-4 h-4 inline mr-2" />
        <strong>Citation Formatter:</strong> Generate properly formatted citations in APA, MLA, Chicago, Harvard, or IEEE style.
      </div>

      {/* Style Selection */}
      <div className="flex flex-wrap gap-2">
        {styles.map(s => (
          <button
            key={s.id}
            onClick={() => setStyle(s.id)}
            className={`px-4 py-2 rounded-lg text-sm ${
              style === s.id
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Source Type */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <label className="text-xs text-zinc-500 block mb-2">Source Type</label>
        <div className="flex gap-2">
          {sourceTypes.map(t => (
            <button
              key={t.id}
              onClick={() => updateField('type', t.id as Citation['type'])}
              className={`flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2 ${
                citation.type === t.id
                  ? 'bg-zinc-700 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              <span>{t.icon}</span>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Citation Fields */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        {/* Authors */}
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Author(s) - Format: Last, First</label>
          <div className="space-y-2">
            {citation.authors.map((author, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={author}
                  onChange={(e) => updateAuthor(idx, e.target.value)}
                  placeholder="Smith, John"
                  className="flex-1 bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                />
                <button
                  onClick={() => removeAuthor(idx)}
                  disabled={citation.authors.length === 1}
                  className="px-2 text-zinc-500 hover:text-red-400 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addAuthor}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Author
            </button>
          </div>
        </div>

        {/* Common Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Title</label>
            <input
              type="text"
              value={citation.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Year</label>
            <input
              type="text"
              value={citation.year}
              onChange={(e) => updateField('year', e.target.value)}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
        </div>

        {/* Type-specific Fields */}
        {citation.type === 'book' && (
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Publisher</label>
              <input
                type="text"
                value={citation.publisher || ''}
                onChange={(e) => updateField('publisher', e.target.value)}
                className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Edition</label>
              <input
                type="text"
                value={citation.edition || ''}
                onChange={(e) => updateField('edition', e.target.value)}
                placeholder="e.g., 2nd"
                className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Pages (optional)</label>
              <input
                type="text"
                value={citation.pages || ''}
                onChange={(e) => updateField('pages', e.target.value)}
                placeholder="e.g., 45-67"
                className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
              />
            </div>
          </div>
        )}

        {citation.type === 'journal' && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Journal Name</label>
                <input
                  type="text"
                  value={citation.journalName || ''}
                  onChange={(e) => updateField('journalName', e.target.value)}
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">DOI</label>
                <input
                  type="text"
                  value={citation.doi || ''}
                  onChange={(e) => updateField('doi', e.target.value)}
                  placeholder="10.xxxx/xxxxx"
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Volume</label>
                <input
                  type="text"
                  value={citation.volume || ''}
                  onChange={(e) => updateField('volume', e.target.value)}
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Issue</label>
                <input
                  type="text"
                  value={citation.issue || ''}
                  onChange={(e) => updateField('issue', e.target.value)}
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Pages</label>
                <input
                  type="text"
                  value={citation.pages || ''}
                  onChange={(e) => updateField('pages', e.target.value)}
                  placeholder="e.g., 123-145"
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                />
              </div>
            </div>
          </>
        )}

        {citation.type === 'website' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Website Name</label>
              <input
                type="text"
                value={citation.siteName || ''}
                onChange={(e) => updateField('siteName', e.target.value)}
                className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">URL</label>
              <input
                type="url"
                value={citation.url || ''}
                onChange={(e) => updateField('url', e.target.value)}
                className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Access Date</label>
              <input
                type="text"
                value={citation.accessDate || ''}
                onChange={(e) => updateField('accessDate', e.target.value)}
                placeholder="e.g., March 15, 2024"
                className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
              />
            </div>
          </div>
        )}

        {citation.type === 'news' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Newspaper/Publication</label>
              <input
                type="text"
                value={citation.newspaperName || ''}
                onChange={(e) => updateField('newspaperName', e.target.value)}
                className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">URL</label>
              <input
                type="url"
                value={citation.url || ''}
                onChange={(e) => updateField('url', e.target.value)}
                className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
              />
            </div>
          </div>
        )}
      </div>

      {/* Formatted Output */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-500">{styles.find(s => s.id === style)?.name} Citation</span>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div 
          className="bg-zinc-800 p-4 rounded border border-zinc-700 text-zinc-200"
          dangerouslySetInnerHTML={{ 
            __html: formattedCitation.replace(/\*([^*]+)\*/g, '<em>$1</em>') 
          }}
        />
      </div>

      {/* Style Guide */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">📚 Citation Style Notes:</strong>
        <ul className="mt-1 space-y-1">
          <li>• <strong>APA:</strong> Used in psychology, education, social sciences</li>
          <li>• <strong>MLA:</strong> Used in humanities, literature, arts</li>
          <li>• <strong>Chicago:</strong> Used in history, publishing</li>
          <li>• <strong>Harvard:</strong> Common in UK/Australian universities</li>
          <li>• <strong>IEEE:</strong> Used in engineering, computer science</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(CitationFormatterComponent);
