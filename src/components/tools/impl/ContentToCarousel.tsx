'use client';
import { useState, useCallback, memo } from 'react';
import { Layers, Copy, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface Slide {
  title: string;
  content: string;
  slideNumber: number;
}

const ContentToCarouselComponent = function ContentToCarousel() {
  const [input, setInput] = useState('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesCount, setSlidesCount] = useState(8);
  const [copied, setCopied] = useState(false);

  const generateCarousel = useCallback(() => {
    if (!input.trim()) return;

    const sentences = input
      .replace(/([.!?])\s+/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 10);

    // Create title slide
    const carouselSlides: Slide[] = [{
      title: 'Swipe for Key Insights 👉',
      content: sentences[0]?.substring(0, 100) || 'Key takeaways from this content',
      slideNumber: 1
    }];

    // Group sentences into content slides
    const contentPerSlide = Math.ceil((sentences.length - 1) / (slidesCount - 2));
    
    for (let i = 1; i < slidesCount - 1 && carouselSlides.length < slidesCount; i++) {
      const startIdx = 1 + (i - 1) * contentPerSlide;
      const endIdx = Math.min(startIdx + contentPerSlide, sentences.length);
      const slideContent = sentences.slice(startIdx, endIdx).join(' ');
      
      if (slideContent) {
        carouselSlides.push({
          title: `Point ${i}`,
          content: slideContent.length > 200 ? slideContent.substring(0, 197) + '...' : slideContent,
          slideNumber: i + 1
        });
      }
    }

    // Add CTA slide
    carouselSlides.push({
      title: 'Save & Share! 🔖',
      content: 'Found this helpful?\n\n✅ Save for later\n✅ Share with others\n✅ Follow for more',
      slideNumber: carouselSlides.length + 1
    });

    setSlides(carouselSlides);
    setCurrentSlide(0);
  }, [input, slidesCount]);

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

  const copySlide = useCallback(() => {
    if (slides[currentSlide]) {
      const text = `Slide ${slides[currentSlide].slideNumber}\n\n${slides[currentSlide].title}\n\n${slides[currentSlide].content}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [slides, currentSlide]);

  const copyAll = useCallback(() => {
    const text = slides.map(s => 
      `--- Slide ${s.slideNumber} ---\n${s.title}\n\n${s.content}`
    ).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [slides]);

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Layers className="w-4 h-4 inline mr-2" />
        <strong>Content to Carousel:</strong> Transform your content into carousel slides for Instagram, LinkedIn, or presentations.
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Paste your content:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your article, tips, or any content to convert into carousel slides..."
          className="w-full h-40 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-zinc-500 resize-y focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Number of slides</label>
          <select
            value={slidesCount}
            onChange={(e) => setSlidesCount(Number(e.target.value))}
            className="bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700"
          >
            {[5, 6, 7, 8, 9, 10].map(n => (
              <option key={n} value={n}>{n} slides</option>
            ))}
          </select>
        </div>
        <button
          onClick={generateCarousel}
          disabled={!input.trim()}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Generate Carousel
        </button>
      </div>

      {slides.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Carousel Preview</h3>
            <button
              onClick={copyAll}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          </div>

          {/* Carousel Preview */}
          <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl aspect-square max-w-md mx-auto p-6 flex flex-col justify-center items-center text-center">
            <div className="absolute top-3 right-3 bg-black/30 px-2 py-1 rounded text-xs text-white">
              {currentSlide + 1}/{slides.length}
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">{slides[currentSlide]?.title}</h4>
            <p className="text-white/90 text-sm whitespace-pre-wrap">{slides[currentSlide]?.content}</p>
            
            <button
              onClick={copySlide}
              className="absolute bottom-3 right-3 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentSlide ? 'bg-blue-500' : 'bg-zinc-600'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="p-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* All Slides List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-400">All Slides</h4>
            <div className="grid gap-2">
              {slides.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    idx === currentSlide
                      ? 'bg-blue-900/30 border-blue-500/50'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">#{slide.slideNumber}</span>
                    <span className="text-sm text-white font-medium">{slide.title}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 truncate">{slide.content}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ContentToCarouselComponent);
