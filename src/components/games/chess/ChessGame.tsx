'use client';

import { useMemo, useState } from 'react';
import { Chess, type PieceSymbol, type Square } from 'chess.js';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';

const PIECE_VALUE: Record<string, number> = {
  p: 10,
  n: 30,
  b: 30,
  r: 50,
  q: 90,
  k: 0,
};

const PIECE_UNICODE: Record<string, string> = {
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛',
  k: '♚',
  P: '♙',
  N: '♘',
  B: '♗',
  R: '♖',
  Q: '♕',
  K: '♔',
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

interface Props {
  locale: Locale;
}

export default function ChessGame({ locale }: Props) {
  const [fen, setFen] = useState(() => new Chess().fen());
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('Your move (White)');
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('chess_best') ?? 0) : 0));
  const { muted, beep, toggleMuted } = useGameAudio();

  const game = useMemo(() => new Chess(fen), [fen]);
  const leaderboard = usePseudoLeaderboard('chess', score || best);

  const maybeCpuMove = (nextFen: string) => {
    window.setTimeout(() => {
      const cpuGame = new Chess(nextFen);
      if (cpuGame.isGameOver()) {
        const gameOverText = cpuGame.isCheckmate() ? 'Checkmate! You win.' : 'Game over.';
        setStatus(gameOverText);
        const nextScore = score + 150;
        setScore(nextScore);
        if (nextScore > best) {
          setBest(nextScore);
          localStorage.setItem('chess_best', String(nextScore));
        }
        beep(900, 0.12, 'triangle');
        return;
      }

      const moves = cpuGame.moves({ verbose: true });
      if (moves.length === 0) {
        setStatus('Draw.');
        return;
      }

      moves.sort((a, b) => {
        const captureA = a.captured ? PIECE_VALUE[a.captured] : 0;
        const captureB = b.captured ? PIECE_VALUE[b.captured] : 0;
        return captureB - captureA;
      });

      const bestCapture = moves.filter((m) => (m.captured ? PIECE_VALUE[m.captured] : 0) === (moves[0].captured ? PIECE_VALUE[moves[0].captured] : 0));
      const chosen = bestCapture[Math.floor(Math.random() * bestCapture.length)];
      cpuGame.move(chosen);

      setFen(cpuGame.fen());
      if (chosen.captured) {
        const capturedValue = PIECE_VALUE[chosen.captured as PieceSymbol] ?? 0;
        setScore((s) => Math.max(0, s - capturedValue));
        beep(220, 0.09, 'sawtooth');
      } else {
        beep(360, 0.04, 'square');
      }

      if (cpuGame.isGameOver()) {
        if (cpuGame.isCheckmate()) {
          setStatus('Checkmate. CPU wins this round.');
        } else {
          setStatus('Draw.');
        }
      } else {
        setStatus('Your move (White)');
      }
    }, 350);
  };

  const onSquareClick = (square: string) => {
    const squareKey = square as Square;
    if (game.turn() !== 'w' || game.isGameOver()) return;

    const piece = game.get(squareKey);
    if (!selected) {
      if (piece?.color === 'w') {
        setSelected(square);
        beep(500, 0.02, 'sine');
      }
      return;
    }

    if (selected === square) {
      setSelected(null);
      return;
    }

    const move = game.move({ from: selected as Square, to: squareKey, promotion: 'q' });
    if (!move) {
      if (piece?.color === 'w') {
        setSelected(square);
      }
      return;
    }

    const nextScore = score + (move.captured ? PIECE_VALUE[move.captured] : 3);
    setScore(nextScore);
    if (move.captured) {
      beep(760, 0.08, 'triangle');
    } else {
      beep(600, 0.04, 'square');
    }

    const nextFen = game.fen();
    setFen(nextFen);
    setSelected(null);

    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        setStatus('Checkmate! You win.');
        const winScore = nextScore + 150;
        setScore(winScore);
        if (winScore > best) {
          setBest(winScore);
          localStorage.setItem('chess_best', String(winScore));
        }
      } else {
        setStatus('Draw.');
      }
      return;
    }

    setStatus('CPU thinking...');
    maybeCpuMove(nextFen);
  };

  const resetGame = () => {
    const fresh = new Chess();
    setFen(fresh.fen());
    setScore(0);
    setSelected(null);
    setStatus('Your move (White)');
  };

  return (
    <GameFrame
      locale={locale}
      title="Chess (vs CPU)"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Tap a white piece, then tap destination · CPU responds automatically"
      leaderboard={leaderboard}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-8 w-fit border border-zinc-700 rounded overflow-hidden" role="grid" aria-label="Chess board">
          {RANKS.flatMap((rank, rankIndex) =>
            FILES.map((file, fileIndex) => {
              const square = `${file}${rank}`;
              const p = game.get(square as Square);
              const isDark = (rankIndex + fileIndex) % 2 === 1;
              const isSelected = selected === square;
              return (
                <button
                  key={square}
                  type="button"
                  onClick={() => onSquareClick(square)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 text-2xl flex items-center justify-center ${
                    isDark ? 'bg-zinc-700' : 'bg-zinc-300'
                  } ${isSelected ? 'ring-2 ring-cyan-400 ring-inset' : ''}`}
                  aria-label={`Square ${square}`}
                >
                  <span className={isDark ? 'text-zinc-100' : 'text-zinc-900'}>{p ? PIECE_UNICODE[p.color === 'w' ? p.type.toUpperCase() : p.type] : ''}</span>
                </button>
              );
            }),
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            onClick={resetGame}
            className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase"
          >
            New Game
          </button>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">{status}</p>
        </div>
      </div>
    </GameFrame>
  );
}
