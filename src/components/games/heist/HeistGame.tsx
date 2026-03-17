'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';
import { Shield, Route, DollarSign, Users, Target, Crown } from 'lucide-react';

interface CrewMember {
  id: string;
  name: string;
  role: 'hacker' | 'driver' | 'lookout' | 'safecracker';
  skill: number;
  assigned: boolean;
}

interface HeistScenario {
  id: string;
  title: string;
  vault: string;
  security: number;
  route: string;
  loot: string;
  requiredRoles: CrewMember['role'][];
}

const CREW_POOL: CrewMember[] = [
  { id: 'hacker', name: 'Cipher', role: 'hacker', skill: 4, assigned: false },
  { id: 'driver', name: 'Ghost', role: 'driver', skill: 3, assigned: false },
  { id: 'lookout', name: 'Fox', role: 'lookout', skill: 5, assigned: false },
  { id: 'safecracker', name: 'Digits', role: 'safecracker', skill: 4, assigned: false },
  { id: 'hacker2', name: 'Sparks', role: 'hacker', skill: 2, assigned: false },
  { id: 'driver2', name: 'Bullet', role: 'driver', skill: 5, assigned: false },
];

const SCENARIOS: HeistScenario[] = [
  {
    id: 'bank', title: 'City Bank', vault: 'Level-3 Vault (combo lock)',
    security: 3, route: 'Back alley → Service elevator → Vault floor',
    loot: '₹50 Lakh in bearer bonds', requiredRoles: ['safecracker', 'lookout'],
  },
  {
    id: 'casino', title: 'The Grand Casino', vault: 'Digital Safe (biometric)',
    security: 5, route: 'Staff entrance → Server room → Cash cage',
    loot: '₹1.2 Crore in chips + cash', requiredRoles: ['hacker', 'lookout', 'driver'],
  },
  {
    id: 'museum', title: 'National Museum', vault: 'Display case (laser grid)',
    security: 4, route: 'Roof → Air duct → Gallery B',
    loot: 'Rare diamond necklace (₹3 Crore)', requiredRoles: ['hacker', 'safecracker'],
  },
  {
    id: 'depot', title: 'Gold Depot', vault: 'Reinforced truck',
    security: 2, route: 'Highway intercept → Side road → Warehouse',
    loot: '40 kg gold bars', requiredRoles: ['driver', 'lookout'],
  },
];

const ROLE_LABELS: Record<CrewMember['role'], string> = {
  hacker: '💻 Hacker',
  driver: '🚗 Driver',
  lookout: '👁 Lookout',
  safecracker: '🔓 Safecracker',
};

type Phase = 'scenario' | 'crew' | 'review' | 'result';
type Result = 'success' | 'partial' | 'failed';

interface HeistGameProps {
  locale: Locale;
}

export default function HeistGame({ locale }: HeistGameProps) {
  const [phase, setPhase] = useState<Phase>('scenario');
  const [selectedScenario, setSelectedScenario] = useState<HeistScenario | null>(null);
  const [crew, setCrew] = useState<CrewMember[]>(CREW_POOL.map((c) => ({ ...c, assigned: false })));
  const [result, setResult] = useState<Result | null>(null);
  const [resultMsg, setResultMsg] = useState('');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('heist_best') ?? 0) : 0));
  const [level, setLevel] = useState(1);
  const { muted, beep, toggleMuted } = useGameAudio();

  const assignedCrew = useMemo(() => crew.filter((c) => c.assigned), [crew]);
  const leaderboard = usePseudoLeaderboard('heist', Math.max(score, best));

  function persistBest(next: number) {
    if (next > best) {
      setBest(next);
      if (typeof window !== 'undefined') localStorage.setItem('heist_best', String(next));
    }
  }

  function toggleCrew(id: string) {
    setCrew((prev) => prev.map((c) => c.id === id ? { ...c, assigned: !c.assigned } : c));
  }

  function runHeist() {
    if (!selectedScenario) return;
    const rolesPresent = selectedScenario.requiredRoles.every((r) => assignedCrew.some((a) => a.role === r));
    const avgSkill = assignedCrew.length ? assignedCrew.reduce((s, a) => s + a.skill, 0) / assignedCrew.length : 0;

    let nextResult: Result;
    let points = 0;

    if (!rolesPresent) {
      nextResult = 'failed';
      setResultMsg('Critical role missing. Security team locked down the target before entry.');
      points = Math.max(0, Math.floor(score * 0.7));
      beep(170, 0.1, 'sawtooth');
    } else if (avgSkill >= selectedScenario.security + 0.6) {
      nextResult = 'success';
      setResultMsg(`Flawless operation. Crew extracted ${selectedScenario.loot} with zero trace.`);
      points = score + 220 + level * 40;
      setLevel((l) => l + 1);
      beep(920, 0.1, 'triangle');
    } else if (avgSkill >= selectedScenario.security - 0.3) {
      nextResult = 'partial';
      setResultMsg('Operation succeeded with heat. You escaped with partial loot after a loud exfil.');
      points = score + 110 + level * 20;
      beep(650, 0.08, 'square');
    } else {
      nextResult = 'failed';
      setResultMsg('Crew underpowered. The vault breach failed and the team had to abort.');
      points = Math.max(0, Math.floor(score * 0.8));
      beep(180, 0.1, 'sawtooth');
    }

    setResult(nextResult);
    setScore(points);
    persistBest(points);
    setPhase('result');
  }

  function restartRound() {
    setPhase('scenario');
    setSelectedScenario(null);
    setCrew(CREW_POOL.map((c) => ({ ...c, assigned: false })));
    setResult(null);
    setResultMsg('');
  }

  return (
    <GameFrame
      locale={locale}
      title="Heist Planner"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      requiresLogin
      controls={`Phase-2 tactical mode · level ${level} · build role-complete crews for high-value extractions`}
      leaderboard={leaderboard}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <span className="inline-flex items-center gap-1 rounded border border-zinc-700 px-2 py-1 text-cyan-300"><Crown className="h-3.5 w-3.5" /> Level {level}</span>
          <span className="inline-flex items-center gap-1 rounded border border-zinc-700 px-2 py-1 text-amber-300"><Target className="h-3.5 w-3.5" /> Mission Score</span>
          <span className="inline-flex items-center gap-1 rounded border border-zinc-700 px-2 py-1 text-emerald-300"><DollarSign className="h-3.5 w-3.5" /> Ranked Loot Runs</span>
        </div>

        {phase === 'scenario' && (
          <div className="space-y-3">
            <h2 className="font-mono text-xl font-black tracking-wider">🎯 Choose Target</h2>
            <div className="grid gap-3">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedScenario(s); setPhase('crew'); }}
                  className="group text-left p-4 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-fuchsia-700/50 hover:bg-zinc-900/70 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-sm uppercase tracking-widest text-white group-hover:text-fuchsia-300">{s.title}</p>
                      <p className="text-zinc-500 text-xs mt-1">{s.vault}</p>
                      <p className="text-zinc-600 text-xs mt-1 inline-flex items-center gap-1"><Route className="h-3.5 w-3.5" /> {s.route}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest inline-flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Security</p>
                      <p className="text-red-300 text-sm font-mono">{'█'.repeat(s.security)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'crew' && selectedScenario && (
          <div className="space-y-3">
            <h2 className="font-mono text-xl font-black tracking-wider">🧠 Assemble Crew</h2>
            <p className="text-zinc-500 text-xs font-mono inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Required: {selectedScenario.requiredRoles.map((r) => ROLE_LABELS[r]).join(', ')}</p>
            <div className="grid gap-2">
              {crew.map((member) => (
                <button
                  key={member.id}
                  onClick={() => toggleCrew(member.id)}
                  className={`p-3 rounded-lg border transition-all flex items-center justify-between ${member.assigned ? 'border-emerald-700 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'}`}
                >
                  <span className="font-mono text-sm text-white">{member.name} · <span className="text-zinc-400 text-xs">{ROLE_LABELS[member.role]}</span></span>
                  <span className="font-mono text-xs text-zinc-300">Skill {member.skill}/5 {member.assigned ? '✅' : '➕'}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPhase('scenario')} className="px-4 py-2 rounded-lg border border-zinc-700 text-xs font-mono uppercase">Back</button>
              <button onClick={() => setPhase('review')} disabled={assignedCrew.length === 0} className="px-4 py-2 rounded-lg border border-fuchsia-700/50 text-xs font-mono uppercase disabled:opacity-50">Review</button>
            </div>
          </div>
        )}

        {phase === 'review' && selectedScenario && (
          <div className="space-y-3">
            <h2 className="font-mono text-xl font-black tracking-wider">🛰️ Execution Review</h2>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs font-mono space-y-2">
              <p className="text-zinc-300"><span className="text-zinc-500">Target:</span> {selectedScenario.title}</p>
              <p className="text-zinc-300"><span className="text-zinc-500">Route:</span> {selectedScenario.route}</p>
              <p className="text-amber-300"><span className="text-zinc-500">Loot:</span> {selectedScenario.loot}</p>
            </div>
            <div className="space-y-1">
              {assignedCrew.map((c) => (
                <div key={c.id} className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-300">{c.name} · {ROLE_LABELS[c.role]} · Skill {c.skill}</div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPhase('crew')} className="px-4 py-2 rounded-lg border border-zinc-700 text-xs font-mono uppercase">Edit Crew</button>
              <button onClick={runHeist} className="px-4 py-2 rounded-lg border border-red-700/60 bg-red-900/30 text-xs font-mono uppercase animate-pulse">Execute</button>
            </div>
          </div>
        )}

        {phase === 'result' && result && (
          <div className="space-y-3 text-center">
            <p className={`font-mono text-4xl font-black tracking-widest ${result === 'success' ? 'text-emerald-400' : result === 'partial' ? 'text-yellow-400' : 'text-red-400'}`}>
              {result === 'success' ? 'CLEAN HIT' : result === 'partial' ? 'MESSY WIN' : 'BURNED'}
            </p>
            <p className="text-zinc-400 text-sm">{resultMsg}</p>
            <button onClick={restartRound} className="px-4 py-2 rounded-lg border border-zinc-700 text-xs font-mono uppercase">Plan Next Heist</button>
          </div>
        )}
      </div>
    </GameFrame>
  );
}
