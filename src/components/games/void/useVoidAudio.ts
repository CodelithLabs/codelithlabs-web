'use client';

import { useCallback, useRef } from 'react';

export function useVoidAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const droneOscsRef = useRef<OscillatorNode[]>([]);
  const mutedRef = useRef(false);

  /** Lazily create (or resume) the AudioContext. Must be called from a user gesture. */
  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();

      const compressor = ctxRef.current.createDynamicsCompressor();
      compressor.threshold.value = -14;
      compressor.ratio.value = 5;
      compressor.connect(ctxRef.current.destination);

      const master = ctxRef.current.createGain();
      master.gain.value = 0.7;
      master.connect(compressor);
      masterRef.current = master;
    }
    if (ctxRef.current.state === 'suspended') {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  /**
   * Start the persistent ambient drone.
   * Safe to call multiple times — ignores subsequent calls if already started.
   */
  const initAudio = useCallback(() => {
    if (droneOscsRef.current.length > 0) return;
    const ctx = getCtx();
    const master = masterRef.current!;

    const droneMix = ctx.createGain();
    droneMix.gain.value = 0.16;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 260;
    filter.Q.value = 1.2;
    filter.connect(droneMix);
    droneMix.connect(master);

    // LFO on drone mix gain for tremolo
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 0.05;
    lfo.connect(lfoGain);
    lfoGain.connect(droneMix.gain);
    lfo.start();

    // Two slightly detuned sine oscillators (chorus effect)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 55;

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 57.3;

    // Sub bass layer
    const osc3 = ctx.createOscillator();
    osc3.type = 'sawtooth';
    osc3.frequency.value = 27.5;
    const osc3Gain = ctx.createGain();
    osc3Gain.gain.value = 0.035;
    osc3.connect(osc3Gain);
    osc3Gain.connect(filter);

    osc1.connect(filter);
    osc2.connect(filter);

    osc1.start();
    osc2.start();
    osc3.start();

    droneOscsRef.current = [osc1, osc2, osc3, lfo];
  }, [getCtx]);

  /** Short percussive noise burst played when an obstacle spawns. */
  const playSpawn = useCallback(() => {
    try {
      const ctx = getCtx();
      const master = masterRef.current;
      if (!master) return;

      const bufLen = Math.floor(ctx.sampleRate * 0.07);
      const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
      }

      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const filt = ctx.createBiquadFilter();
      filt.type = 'bandpass';
      filt.frequency.value = 700;
      filt.Q.value = 2.5;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      src.connect(filt);
      filt.connect(gain);
      gain.connect(master);
      src.start();
    } catch {
      // Ignore — non-critical audio effect
    }
  }, [getCtx]);

  /** Low sweep tone played when an obstacle passes very close. */
  const playNearMiss = useCallback(() => {
    try {
      const ctx = getCtx();
      const master = masterRef.current;
      if (!master) return;

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.28);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(master);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Ignore
    }
  }, [getCtx]);

  /** Heavy low-frequency crash on player death. */
  const playDeath = useCallback(() => {
    try {
      const ctx = getCtx();
      const master = masterRef.current;
      if (!master) return;

      // Low boom — filtered noise
      const bufLen = Math.floor(ctx.sampleRate * 0.85);
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 0.6);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;

      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 140;
      lpf.Q.value = 0.5;

      const boomGain = ctx.createGain();
      boomGain.gain.setValueAtTime(0.85, ctx.currentTime);
      boomGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);

      src.connect(lpf);
      lpf.connect(boomGain);
      boomGain.connect(master);
      src.start();

      // High pitch descending tone
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 0.75);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.28, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);

      osc.connect(oscGain);
      oscGain.connect(master);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Ignore
    }
  }, [getCtx]);

  /** Rising arpeggio played when the player hits a score milestone. */
  const playMilestone = useCallback(() => {
    try {
      const ctx = getCtx();
      const master = masterRef.current;
      if (!master) return;

      const freqs = [110, 138.6, 165, 220];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const gain = ctx.createGain();
        const t = ctx.currentTime + i * 0.13;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.14, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(gain);
        gain.connect(master);
        osc.start(t);
        osc.stop(t + 0.22);
      });
    } catch {
      // Ignore
    }
  }, [getCtx]);

  /** Smoothly fade master gain to 0 (mute) or 0.7 (unmute). */
  const setMuted = useCallback((mute: boolean) => {
    mutedRef.current = mute;
    const master = masterRef.current;
    const ctx = ctxRef.current;
    if (!master || !ctx) return;
    master.gain.setTargetAtTime(mute ? 0 : 0.7, ctx.currentTime, 0.06);
  }, []);

  /** Stop the persistent drone and suspend the context. Call on game unmount. */
  const stopDrone = useCallback(() => {
    droneOscsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // Already stopped
      }
    });
    droneOscsRef.current = [];
    void ctxRef.current?.suspend();
  }, []);

  return { initAudio, playSpawn, playNearMiss, playDeath, playMilestone, setMuted, stopDrone, mutedRef };
}
