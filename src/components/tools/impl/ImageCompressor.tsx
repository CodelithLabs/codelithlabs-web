'use client';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

const MAX_FILE_BYTES = 15 * 1024 * 1024;

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.type.startsWith('image/'), {
    message: 'Please upload a valid image file.'
  })
  .refine((file) => file.size <= MAX_FILE_BYTES, {
    message: 'File too large. Max size is 15MB.'
  });

export default function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../../../workers/imageCompressor.worker.ts', import.meta.url)
    );

    workerRef.current.onmessage = (event: MessageEvent) => {
      const { ok, blob, error: workerError } = event.data || {};
      if (!ok) {
        setError(workerError || 'Compression failed.');
        setIsProcessing(false);
        return;
      }

      const nextUrl = URL.createObjectURL(blob);
      setCompressedSize(blob.size);
      setCompressedImage((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return nextUrl;
      });
      setIsProcessing(false);
    };

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (compressedImage) {
        URL.revokeObjectURL(compressedImage);
      }
    };
  }, [compressedImage]);

  const requestCompression = (file: File, nextQuality: number) => {
    if (!workerRef.current) {
      setError('Compression worker unavailable in this browser.');
      return;
    }

    setIsProcessing(true);
    workerRef.current.postMessage({ file, quality: nextQuality / 100 });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const validation = fileSchema.safeParse(file);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Invalid file.');
      return;
    }

    setOriginalFile(file);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      requestCompression(file, quality);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (originalFile) {
      requestCompression(originalFile, quality);
    }
  }, [quality, originalFile]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetState = () => {
    setOriginalImage(null);
    setOriginalFile(null);
    setCompressedImage((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setCompressedSize(0);
    setOriginalSize(0);
    setError(null);
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
              <p className='text-zinc-400'>JPG, PNG, WebP supported. Max 15MB.</p>
            </div>
          </label>
        </div>
      )}

      {error && (
        <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300'>
          {error}
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
                 onClick={resetState}
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
                 {originalSize > 0 ? `-${Math.round(((originalSize - compressedSize) / originalSize) * 100)}% Saved` : 'Optimizing'}
               </span>
             </h3>
             {compressedImage ? (
                <img src={compressedImage} alt='Compressed' className='w-full rounded-lg border border-green-500/30' />
             ) : (
                <div className='w-full h-64 bg-zinc-900 rounded-lg flex flex-col items-center justify-center text-zinc-600 gap-3'>
                  <div className='w-8 h-8 border-2 border-blue-500/40 border-t-blue-500 rounded-full animate-spin' />
                  <span>Processing...</span>
                </div>
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

      {/* Privacy Note */}
      <div className='bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3'>
        <span className='text-xl'>🔒</span>
        <p>
          <strong>100% Client-Side Processing:</strong> Your photos are processed in a background worker to keep the UI smooth.
          They are <u>never</u> uploaded to our servers, ensuring total privacy.
        </p>
      </div>
    </div>
  );
}
