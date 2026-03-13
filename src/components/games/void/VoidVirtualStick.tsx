'use client';

import { useRef, useState } from 'react';

interface Props {
  /** Called with normalised stick direction in [-1, 1]. */
  onMove: (x: number, y: number) => void;
}

const OUTER_RADIUS = 48; // px
const INNER_RADIUS = 20; // px

/**
 * A virtual thumbstick that appears wherever the user first touches the screen.
 * Only renders on devices that report `navigator.maxTouchPoints > 0`.
 */
export function VoidVirtualStick({ onMove }: Props) {
  const [hasTouchScreen] = useState(() =>
    typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0
  );
  const [visible, setVisible] = useState(false);
  const [base, setBase] = useState({ x: 0, y: 0 });
  const [dotOffset, setDotOffset] = useState({ x: 0, y: 0 });
  const touchIdRef = useRef<number | null>(null);

  if (!hasTouchScreen) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    e.preventDefault();
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setBase({ x: touch.clientX, y: touch.clientY });
    setDotOffset({ x: 0, y: 0 });
    setVisible(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier !== touchIdRef.current) continue;

      const dx = touch.clientX - base.x;
      const dy = touch.clientY - base.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clamped = Math.min(dist, OUTER_RADIUS);
      const angle = Math.atan2(dy, dx);
      const cx = Math.cos(angle) * clamped;
      const cy = Math.sin(angle) * clamped;

      setDotOffset({ x: cx, y: cy });
      onMove(cx / OUTER_RADIUS, cy / OUTER_RADIUS);
      break;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier !== touchIdRef.current) continue;
      touchIdRef.current = null;
      setVisible(false);
      setDotOffset({ x: 0, y: 0 });
      onMove(0, 0);
      break;
    }
  };

  return (
    /* Full-screen capture layer — sits below HUD buttons (z-30 vs z-40/z-50) */
    <div
      className="absolute inset-0 z-30"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {visible && (
        <div
          className="pointer-events-none absolute"
          style={{
            left: base.x - OUTER_RADIUS,
            top: base.y - OUTER_RADIUS,
            width: OUTER_RADIUS * 2,
            height: OUTER_RADIUS * 2,
          }}
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-red-800/60 bg-black/25" />
          {/* Inner dot */}
          <div
            className="absolute rounded-full bg-red-700/75 shadow-[0_0_8px_rgba(220,38,38,0.6)]"
            style={{
              width: INNER_RADIUS * 2,
              height: INNER_RADIUS * 2,
              left: OUTER_RADIUS - INNER_RADIUS + dotOffset.x,
              top: OUTER_RADIUS - INNER_RADIUS + dotOffset.y,
            }}
          />
        </div>
      )}
    </div>
  );
}
