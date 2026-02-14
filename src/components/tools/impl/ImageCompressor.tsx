'use client';
import { useState, useRef, useEffect } from 'react';

export default function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      compressImage(event.target?.result as string, quality);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (imgSrc: string, q: number) => {
    setIsProcessing(true);
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Use original dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      // Compress
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setCompressedSize(blob.size);
          const compressedUrl = URL.createObjectURL(blob);
          setCompressedImage(compressedUrl);
          setIsProcessing(false);
        },
        'image/jpeg',
        q / 100
      );
    };
  };

  useEffect(() => {
    if (originalImage) {
      compressImage(originalImage, quality);
    }
  }, [quality]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className='space-y-8'>
      {/* Upload Area */}
      {!originalImage && (
        <div className='border-2 border-dashed border-zinc-700 rounded-xl p-12 text-center hover:bg-zinc-800/50 transition-colors'>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
            className='hidden'
            id='image-upload'
          />
          <label htmlFor='image-upload' className='cursor-pointer flex flex-col items-center gap-4'>
            <div className='w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400'>
              <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' /></svg>
            </div>
            <div>
              <h3 className='text-xl font-bold text-white'>Click to Upload Image</h3>
              <p className='text-zinc-400'>JPG, PNG, WebP supported. Max 10MB.</p>
            </div>
          </label>
        </div>
      )}

      {/* Editor Area */}
      {originalImage && (
        <div className='grid lg:grid-cols-2 gap-8'>
           {/* Controls */}
           <div className='lg:col-span-2 bg-zinc-800/50 p-6 rounded-xl border border-zinc-700'>
             <div className='flex flex-wrap items-center justify-between gap-4'>
               <div className='flex-1 min-w-[200px]'>
                 <label className='flex justify-between text-sm font-medium text-zinc-300 mb-2'>
                   <span>Compression Quality: {quality}%</span>
                   <span className={quality < 50 ? 'text-red-400' : 'text-green-400'}>
                     {quality < 50 ? 'High Compression' : 'High Quality'}
                   </span>
                 </label>
                 <input
                   type='range'
                   min='10'
                   max='100'
                   value={quality}
                   onChange={(e) => setQuality(Number(e.target.value))}
                   className='w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500'
                 />
               </div>
               <button 
                 onClick={() => { setOriginalImage(null); setCompressedImage(null); }}
                 className='px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg'
               >
                 Upload New
               </button>
             </div>
           </div>

           {/* Preview: Original */}
           <div className='space-y-2'>
             <h3 className='text-sm font-medium text-zinc-400'>Original ({formatSize(originalSize)})</h3>
             <img src={originalImage} alt='Original' className='w-full rounded-lg border border-zinc-700' />
           </div>

           {/* Preview: Compressed */}
           <div className='space-y-2'>
             <h3 className='text-sm font-medium text-green-400'>
               Compressed ({formatSize(compressedSize)}) 
               <span className='ml-2 text-xs bg-green-500/20 px-2 py-0.5 rounded'>
                 -{Math.round(((originalSize - compressedSize) / originalSize) * 100)}% Saved
               </span>
             </h3>
             {compressedImage ? (
                <img src={compressedImage} alt='Compressed' className='w-full rounded-lg border border-green-500/30' />
             ) : (
                <div className='w-full h-64 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-600'>Processing...</div>
             )}
             
             {compressedImage && (
               <a 
                 href={compressedImage} 
                 download='compressed-image-codelithlabs.jpg'
                 className='block w-full text-center px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors'
               >
                 Download Compressed Image
               </a>
             )}
           </div>
        </div>
      )}

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className='hidden' />

      {/* Privacy Note */}
      <div className='bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3'>
        <span className='text-xl'>🔒</span>
        <p>
          <strong>100% Client-Side Processing:</strong> Your photos are processed entirely within your browser using HTML5 Canvas technology. 
          They are <u>never</u> uploaded to our servers, ensuring total privacy.
        </p>
      </div>
    </div>
  );
}
