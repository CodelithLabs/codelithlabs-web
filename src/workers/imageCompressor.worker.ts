// Background image compression to keep the UI responsive and improve conversion.
self.onmessage = async (event: MessageEvent) => {
  const { file, quality } = event.data || {};

  try {
    if (!('createImageBitmap' in self) || typeof OffscreenCanvas === 'undefined') {
      throw new Error('Off-thread compression is not supported in this browser.');
    }

    const bitmap = await createImageBitmap(file);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      bitmap.close();
      throw new Error('Failed to initialize compression canvas.');
    }

    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    const blob = await canvas.convertToBlob({
      type: 'image/jpeg',
      quality
    });

    self.postMessage({ ok: true, blob });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Compression failed.';
    self.postMessage({ ok: false, error: message });
  }
};
