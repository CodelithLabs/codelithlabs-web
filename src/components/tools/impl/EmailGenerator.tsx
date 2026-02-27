'use client';
import { useState } from 'react';
import { Type, Copy, Check, Wand2 } from 'lucide-react';

export default function EmailGenerator() {
  const [purpose, setPurpose] = useState('professional');
  const [subject, setSubject] = useState('');
  const [recipient, setRecipient] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const templates: Record<string, (s: string, r: string, k: string) => string> = {
    professional: (s, r, k) => `Dear ${r || '[Recipient]'},\n\nI hope this email finds you well. I am writing to you regarding ${s || '[subject]'}.\n\n${k ? k.split('\n').map(p => p.trim()).filter(Boolean).join('\n\n') : '[Your key points here]'}\n\nI would appreciate the opportunity to discuss this matter further at your earliest convenience. Please do not hesitate to reach out if you have any questions.\n\nBest regards,\n[Your Name]`,
    followup: (s, r, k) => `Dear ${r || '[Recipient]'},\n\nI hope you are doing well. I wanted to follow up on ${s || 'our previous conversation'}.\n\n${k || 'I wanted to check if you had a chance to review my previous message and if there are any updates.'}\n\nI look forward to hearing from you.\n\nBest regards,\n[Your Name]`,
    thankyou: (s, r, k) => `Dear ${r || '[Recipient]'},\n\nThank you so much for ${s || 'your time and consideration'}.\n\n${k || 'I truly appreciate your support and guidance. It has been invaluable to me.'}\n\nPlease let me know if there is anything I can do in return.\n\nWith gratitude,\n[Your Name]`,
    apology: (s, r, k) => `Dear ${r || '[Recipient]'},\n\nI sincerely apologize for ${s || 'the inconvenience'}.\n\n${k || 'I understand the impact this has had, and I take full responsibility. I am committed to ensuring this does not happen again.'}\n\nPlease accept my sincere apologies. I value our relationship and look forward to making things right.\n\nSincerely,\n[Your Name]`,
    introduction: (s, r, k) => `Dear ${r || '[Recipient]'},\n\nI hope this message finds you well. My name is [Your Name], and I am reaching out regarding ${s || 'a potential collaboration'}.\n\n${k || 'I would love the opportunity to connect and explore how we might work together.'}\n\nWould you be open to a brief call or meeting to discuss this further?\n\nBest regards,\n[Your Name]`,
    meeting: (s, r, k) => `Dear ${r || '[Recipient]'},\n\nI would like to schedule a meeting to discuss ${s || '[topic]'}.\n\n${k || 'The meeting would take approximately 30 minutes.'}\n\nCould you please share your availability for the coming week? I am flexible with timing and can adjust to your schedule.\n\nBest regards,\n[Your Name]`,
  };

  const generate = () => {
    const fn = templates[purpose];
    if (fn) setEmail(fn(subject, recipient, keyPoints));
  };

  const copy = () => { navigator.clipboard.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Type className="w-4 h-4 inline mr-2" /><strong>Email Generator:</strong> Generate professional email drafts from templates. Customize the purpose, subject, and key points.
      </div>
      <div className="flex gap-2 flex-wrap">
        {Object.keys(templates).map(t => (
          <button key={t} onClick={() => setPurpose(t)} className={`px-3 py-1.5 rounded-lg text-sm capitalize ${purpose === t ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}>{t.replace(/([A-Z])/g, ' $1')}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Recipient name" className="bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500" />
        <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject / topic" className="bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500" />
      </div>
      <textarea value={keyPoints} onChange={e => setKeyPoints(e.target.value)} placeholder="Key points (one per line)..." className="w-full h-24 bg-zinc-800 text-white p-4 rounded-lg border border-zinc-700 focus:border-blue-500 resize-none" />
      <button onClick={generate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"><Wand2 className="w-5 h-5" />Generate Email</button>
      {email && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex justify-between mb-2"><span className="font-semibold text-sm text-green-400">Generated Email</span>
            <button onClick={copy} className="text-sm text-gray-400 hover:text-white flex items-center gap-1">{copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy</button>
          </div>
          <pre className="text-gray-200 text-sm whitespace-pre-wrap font-sans leading-relaxed">{email}</pre>
        </div>
      )}
    </div>
  );
}
