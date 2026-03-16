'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';

const ROWS = 6;
const COLS = 7;

type Cell = 0 | 1 | 2;

type Winner = 0 | 1 | 2 | 3;

const emptyBoard = (): Cell[][] => Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => 0));

function drop(board: Cell[][], col: number, player: 1 | 2): { board: Cell[][]; row: number } | null {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) {
      const next = board.map((row) => [...row]) as Cell[][];
      next[r][col] = player;
      return { board: next, row: r };
    }
  }
  return null;
}

function checkWinner(board: Cell[][]): Winner {
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ] as const;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === 0) continue;
      const player = board[r][c];
      for (const [dr, dc] of dirs) {
        let count = 1;
        let nr = r + dr;
        let nc = c + dc;
        while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === player) {
          count++;
          nr += dr;
          nc += dc;
        }
        if (count >= 4) return player;
      }
    }
  }

  return board.every((row) => row.every((c) => c !== 0)) ? 3 : 0;
}

function cpuPickColumn(board: Cell[][]): number {
  const validCols = Array.from({ length: COLS }, (_, c) => c).filter((c) => board[0][c] === 0);
  if (validCols.length === 0) return -1;

  for (const c of validCols) {
    const candidate = drop(board, c, 2);
    if (candidate && checkWinner(candidate.board) === 2) return c;
  }

  for (const c of validCols) {
    const candidate = drop(board, c, 1);
    if (candidate && checkWinner(candidate.board) === 1) return c;
  }

  const preferred = [3, 2, 4, 1, 5, 0, 6];
  const best = preferred.find((c) => validCols.includes(c));
  return best ?? validCols[Math.floor(Math.random() * validCols.length)];
}

interface Props {
  locale: Locale;
}

export default function ConnectFourGame({ locale }: Props) {
  const [board, setBoard] = useState<Cell[][]>(() => emptyBoard());
  const [turn, setTurn] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<Winner>(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('connect_four_best') ?? 0) : 0));
  const { muted, beep, toggleMuted } = useGameAudio();

  const leaderboard = usePseudoLeaderboard('connect-four', score || best);

  const status = useMemo(() => {
    if (winner === 1) return 'You win!';
    if (winner === 2) return 'CPU wins.';
    if (winner === 3) return 'Draw.';
    return turn === 1 ? 'Your turn' : 'CPU thinking...';
  }, [turn, winner]);

  const finishRound = (result: Winner, nextScore: number) => {
    setWinner(result);
    if (result === 1) {
      const bonus = nextScore + 120;
      setScore(bonus);
      if (bonus > best) {
        setBest(bonus);
        localStorage.setItem('connect_four_best', String(bonus));
      }
      beep(860, 0.1, 'triangle');
      return;
    }
    if (result === 2) beep(200, 0.14, 'sawtooth');
  };

  const playMove = (col: number, player: 1 | 2, currentBoard: Cell[][], currentScore: number) => {
    const res = drop(currentBoard, col, player);
    if (!res) return null;

    const nextScore = player === 1 ? currentScore + 5 : currentScore;
    if (player === 1) {
      setScore(nextScore);
      beep(640, 0.03, 'square');
    }

    const result = checkWinner(res.board);
    setBoard(res.board);

    if (result !== 0) {
      finishRound(result, nextScore);
      return res.board;
    }

    setTurn(player === 1 ? 2 : 1);
    return res.board;
  };

  const onPlayerMove = (col: number) => {
    if (winner !== 0 || turn !== 1) return;
    const afterPlayer = playMove(col, 1, board, score);
    if (!afterPlayer) return;
    if (checkWinner(afterPlayer) !== 0) return;

    window.setTimeout(() => {
      const cpuCol = cpuPickColumn(afterPlayer);
      if (cpuCol < 0) return;
      playMove(cpuCol, 2, afterPlayer, score + 5);
    }, 280);
  };

  const reset = () => {
    setBoard(emptyBoard());
    setWinner(0);
    setTurn(1);
    setScore(0);
  };

  return (
    <GameFrame
      locale={locale}
      title="Connect Four (vs CPU)"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Tap a column to drop your disc · First to connect 4 wins"
      leaderboard={leaderboard}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-1 bg-zinc-900 p-2 rounded-lg w-fit">
          {board.flatMap((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => onPlayerMove(c)}
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center"
                aria-label={`Column ${c + 1}`}
              >
                <span
                  className={`w-8 h-8 rounded-full ${cell === 1 ? 'bg-red-500' : cell === 2 ? 'bg-yellow-400' : 'bg-zinc-700'}`}
                />
              </button>
            )),
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase"
          >
            New Round
          </button>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">{status}</p>
        </div>
      </div>
    </GameFrame>
  );
}
