'use client';
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Square, Settings } from 'lucide-react';

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoice) setSelectedVoice(v[0].name);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const speak = () => {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const stop = () => { window.speechSynthesis.cancel(); setSpeaking(false); };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Volume2 className="w-4 h-4 inline mr-2" />
        <strong>Text to Speech:</strong> Convert text to spoken audio using the Web Speech API. Works offline after page load. No data leaves your browser.
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter text to convert to speech..." className="w-full h-40 bg-zinc-800 text-white p-4 rounded-lg border border-zinc-700 focus:border-blue-500 resize-none" />
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Voice</label>
          <select value={selectedVoice} onChange={e => setSelectedVoice(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700">
            {voices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2"><Settings className="w-4 h-4 text-gray-400" /><span className="text-sm">Rate: {rate}x</span></div>
          <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-400">Pitch: {pitch}</label>
          <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={e => setPitch(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Volume: {Math.round(volume * 100)}%</label>
          <input type="range" min="0" max="1" step="0.1" value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={speaking ? stop : speak} className={`flex-1 py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${speaking ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
          {speaking ? <><Square className="w-5 h-5" />Stop</> : <><Play className="w-5 h-5" />Speak</>}
        </button>
      </div>
      {speaking && <div className="text-center text-sm text-blue-400 animate-pulse flex items-center justify-center gap-2"><Volume2 className="w-4 h-4" />Speaking...</div>}
    </div>
  );
}
