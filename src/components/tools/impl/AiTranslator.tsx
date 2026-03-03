'use client';
import { useState , memo } from 'react';
import { Languages, Copy, Check, ArrowRightLeft } from 'lucide-react';

const translations: Record<string, Record<string, string>> = {
  hello: { es: 'hola', fr: 'bonjour', de: 'hallo', it: 'ciao', pt: 'olá', hi: 'नमस्ते', ja: 'こんにちは', ko: '안녕하세요', zh: '你好', ar: 'مرحبا', ru: 'привет' },
  goodbye: { es: 'adiós', fr: 'au revoir', de: 'auf wiedersehen', it: 'arrivederci', pt: 'adeus', hi: 'अलविदा', ja: 'さようなら', ko: '안녕히 가세요', zh: '再见', ar: 'وداعا', ru: 'до свидания' },
  thanks: { es: 'gracias', fr: 'merci', de: 'danke', it: 'grazie', pt: 'obrigado', hi: 'धन्यवाद', ja: 'ありがとう', ko: '감사합니다', zh: '谢谢', ar: 'شكرا', ru: 'спасибо' },
  yes: { es: 'sí', fr: 'oui', de: 'ja', it: 'sì', pt: 'sim', hi: 'हाँ', ja: 'はい', ko: '네', zh: '是', ar: 'نعم', ru: 'да' },
  no: { es: 'no', fr: 'non', de: 'nein', it: 'no', pt: 'não', hi: 'नहीं', ja: 'いいえ', ko: '아니요', zh: '不', ar: 'لا', ru: 'нет' },
  please: { es: 'por favor', fr: "s'il vous plaît", de: 'bitte', it: 'per favore', pt: 'por favor', hi: 'कृपया', ja: 'お願いします', ko: '제발', zh: '请', ar: 'من فضلك', ru: 'пожалуйста' },
  good: { es: 'bueno', fr: 'bon', de: 'gut', it: 'buono', pt: 'bom', hi: 'अच्छा', ja: '良い', ko: '좋은', zh: '好', ar: 'جيد', ru: 'хороший' },
  morning: { es: 'mañana', fr: 'matin', de: 'morgen', it: 'mattina', pt: 'manhã', hi: 'सुबह', ja: '朝', ko: '아침', zh: '早上', ar: 'صباح', ru: 'утро' },
  water: { es: 'agua', fr: 'eau', de: 'wasser', it: 'acqua', pt: 'água', hi: 'पानी', ja: '水', ko: '물', zh: '水', ar: 'ماء', ru: 'вода' },
  food: { es: 'comida', fr: 'nourriture', de: 'essen', it: 'cibo', pt: 'comida', hi: 'खाना', ja: '食べ物', ko: '음식', zh: '食物', ar: 'طعام', ru: 'еда' },
  love: { es: 'amor', fr: 'amour', de: 'liebe', it: 'amore', pt: 'amor', hi: 'प्यार', ja: '愛', ko: '사랑', zh: '爱', ar: 'حب', ru: 'любовь' },
  friend: { es: 'amigo', fr: 'ami', de: 'freund', it: 'amico', pt: 'amigo', hi: 'दोस्त', ja: '友達', ko: '친구', zh: '朋友', ar: 'صديق', ru: 'друг' },
  help: { es: 'ayuda', fr: 'aide', de: 'hilfe', it: 'aiuto', pt: 'ajuda', hi: 'मदद', ja: '助けて', ko: '도움', zh: '帮助', ar: 'مساعدة', ru: 'помощь' },
  time: { es: 'tiempo', fr: 'temps', de: 'zeit', it: 'tempo', pt: 'tempo', hi: 'समय', ja: '時間', ko: '시간', zh: '时间', ar: 'وقت', ru: 'время' },
  name: { es: 'nombre', fr: 'nom', de: 'name', it: 'nome', pt: 'nome', hi: 'नाम', ja: '名前', ko: '이름', zh: '名字', ar: 'اسم', ru: 'имя' },
};

const langs = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' }, { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' }, { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' }, { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' }, { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' }, { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
];

const AiTranslatorComponent = function AiTranslator() {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const translate = () => {
    if (!text.trim()) return;
    const words = text.toLowerCase().split(/\s+/);
    const translated = words.map(w => {
      const clean = w.replace(/[^a-z]/g, '');
      const punct = w.replace(/[a-z]/gi, '');
      if (translations[clean] && translations[clean][targetLang]) return translations[clean][targetLang] + punct;
      return w;
    });
    setResult(translated.join(' '));
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Languages className="w-4 h-4 inline mr-2" /><strong>Quick Translator:</strong> Translate common words and phrases across 11 languages. Works offline with a built-in dictionary. For full translations, use the Web Speech API or a dedicated service.
      </div>
      <div className="flex gap-2 flex-wrap">
        {langs.map(l => (
          <button key={l.code} onClick={() => setTargetLang(l.code)} className={`px-3 py-1 rounded text-sm ${targetLang === l.code ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}>{l.flag} {l.name}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">English</label>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type English text..." className="w-full h-40 bg-zinc-800 text-white p-4 rounded-lg border border-zinc-700 focus:border-blue-500 resize-none" />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block flex justify-between">{langs.find(l => l.code === targetLang)?.name}
            {result && <button onClick={copy} className="text-gray-400 hover:text-white flex items-center gap-1 text-xs">{copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}</button>}
          </label>
          <textarea readOnly value={result} placeholder="Translation will appear here..." className="w-full h-40 bg-zinc-900 text-green-400 p-4 rounded-lg border border-zinc-700 resize-none" />
        </div>
      </div>
      <button onClick={translate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"><ArrowRightLeft className="w-5 h-5" />Translate</button>
    </div>
  );
}

export default memo(AiTranslatorComponent);
