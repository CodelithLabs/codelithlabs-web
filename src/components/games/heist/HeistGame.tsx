'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import type { Locale } from '@/i18n/request';

interface CrewMember {
  id: string;
  name: string;
  role: 'hacker' | 'driver' | 'lookout' | 'safecracker';
  skill: number; // 1-5
  assigned: boolean;
}

interface HeistScenario {
  id: string;
  title: string;
  vault: string;
  security: number; // 1-5, what team skill is needed
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

  const toggleCrew = useCallback((id: string) => {
    setCrew((prev) => prev.map((c) => c.id === id ? { ...c, assigned: !c.assigned } : c));
  }, []);

  const assignedCrew = crew.filter((c) => c.assigned);

  const runHeist = useCallback(() => {
    if (!selectedScenario) return;
    const assigned = crew.filter((c) => c.assigned);

    // Check required roles
    const rolesPresent = selectedScenario.requiredRoles.every((r) => assigned.some((a) => a.role === r));
    const avgSkill = assigned.length ? assigned.reduce((s, a) => s + a.skill, 0) / assigned.length : 0;

    let res: Result;
    if (!rolesPresent) {
      res = 'failed';
      setResultMsg('Your crew is missing a critical role. The job fell apart at the vault.');
    } else if (avgSkill >= selectedScenario.security) {
      res = 'success';
      setResultMsg(`Perfect execution. Your crew secured ${selectedScenario.loot} and vanished without a trace.`);
    } else if (avgSkill >= selectedScenario.security - 1) {
      res = 'partial';
      setResultMsg('The job went sideways — you got out with half the loot but lost one crew member.');
    } else {
      res = 'failed';
      setResultMsg('Security was too tight. Your crew panicked and the job collapsed.');
    }
    setResult(res);
    setPhase('result');
  }, [selectedScenario, crew]);

  const restart = useCallback(() => {
    setPhase('scenario');
    setSelectedScenario(null);
    setCrew(CREW_POOL.map((c) => ({ ...c, assigned: false })));
    setResult(null);
    setResultMsg('');
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-900 px-6 py-3 flex items-center justify-between">
        <Link href={`/${locale}/games`} className="text-zinc-600 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors">
          ← Games
        </Link>
        <span className="font-mono text-xs text-zinc-600 tracking-widest uppercase">Heist Planner</span>
        {phase !== 'scenario' && (
          <button onClick={restart} className="font-mono text-xs text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">
            Reset
          </button>
        )}
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">

        {/* Phase: Choose Scenario */}
        {phase === 'scenario' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-mono text-2xl font-black tracking-wider text-white mb-1">CHOOSE YOUR TARGET</h1>
              <p className="text-zinc-600 font-mono text-xs tracking-widest">Select a heist location</p>
            </div>
            <div className="grid gap-3">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedScenario(s); setPhase('crew'); }}
                  className="text-left p-4 rounded-lg border border-zinc-800 bg-zinc-950 hover:border-red-900 hover:bg-zinc-900/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-mono text-white font-bold tracking-widest text-sm uppercase group-hover:text-red-400 transition-colors">{s.title}</h3>
                      <p className="text-zinc-500 text-xs mt-1">{s.vault}</p>
                      <p className="text-zinc-600 text-xs mt-1">Loot: <span className="text-zinc-400">{s.loot}</span></p>
                    </div>
                    <div className="shrink-0">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className={`w-2 h-4 rounded-sm ${i < s.security ? 'bg-red-600' : 'bg-zinc-800'}`} />
                        ))}
                      </div>
                      <p className="text-zinc-700 text-[10px] font-mono mt-1 tracking-wider">SECURITY</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Phase: Assemble Crew */}
        {phase === 'crew' && selectedScenario && (
          <div className="space-y-6">
            <div>
              <h1 className="font-mono text-2xl font-black tracking-wider text-white mb-1">ASSEMBLE YOUR CREW</h1>
              <p className="text-zinc-500 font-mono text-xs">Target: <span className="text-red-400">{selectedScenario.title}</span></p>
              <p className="text-zinc-600 text-xs mt-1 font-mono">
                Required: {selectedScenario.requiredRoles.map((r) => ROLE_LABELS[r]).join(', ')}
              </p>
            </div>

            <div className="grid gap-2">
              {crew.map((member) => (
                <button
                  key={member.id}
                  onClick={() => toggleCrew(member.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    member.assigned
                      ? 'border-green-700 bg-green-900/20 text-green-300'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-mono font-bold text-sm tracking-widest">{member.name}</div>
                    <div className="text-xs mt-0.5">{ROLE_LABELS[member.role]}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`w-2 h-3 rounded-sm ${i < member.skill ? (member.assigned ? 'bg-green-500' : 'bg-zinc-500') : 'bg-zinc-800'}`} />
                      ))}
                    </div>
                    <span className="font-mono text-xs">{member.assigned ? '✓' : '+'}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPhase('scenario')}
                className="flex-1 py-3 rounded-lg border border-zinc-800 text-zinc-500 font-mono text-xs tracking-widest uppercase hover:border-zinc-600 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setPhase('review')}
                disabled={assignedCrew.length === 0}
                className="flex-1 py-3 rounded-lg border border-red-900/70 bg-red-950/30 text-red-300 font-mono text-xs tracking-widest uppercase hover:bg-red-900/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Review Plan →
              </button>
            </div>
          </div>
        )}

        {/* Phase: Review */}
        {phase === 'review' && selectedScenario && (
          <div className="space-y-6">
            <h1 className="font-mono text-2xl font-black tracking-wider text-white">FINAL REVIEW</h1>

            <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-950 space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-600 tracking-widest uppercase">Target</span>
                <span className="text-white">{selectedScenario.title}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-600 tracking-widest uppercase">Route</span>
                <span className="text-zinc-300 text-right max-w-[60%]">{selectedScenario.route}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-600 tracking-widest uppercase">Loot</span>
                <span className="text-yellow-400">{selectedScenario.loot}</span>
              </div>
            </div>

            <div>
              <p className="font-mono text-xs text-zinc-600 tracking-widest uppercase mb-2">Your Crew ({assignedCrew.length})</p>
              <div className="space-y-1">
                {assignedCrew.map((c) => (
                  <div key={c.id} className="flex justify-between items-center py-1.5 px-3 rounded bg-zinc-900 border border-zinc-800">
                    <span className="font-mono text-sm text-white">{c.name}</span>
                    <span className="text-zinc-500 text-xs">{ROLE_LABELS[c.role]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setPhase('crew')} className="flex-1 py-3 rounded-lg border border-zinc-800 text-zinc-500 font-mono text-xs tracking-widest uppercase hover:border-zinc-600 transition-colors">
                ← Crew
              </button>
              <button onClick={runHeist} className="flex-1 py-3 rounded-lg border border-red-800 bg-red-900/30 text-red-200 font-mono text-xs tracking-widest uppercase hover:bg-red-800/50 transition-colors animate-pulse">
                ▶ EXECUTE HEIST
              </button>
            </div>
          </div>
        )}

        {/* Phase: Result */}
        {phase === 'result' && result && (
          <div className="space-y-6 text-center">
            <div className={`text-6xl font-black font-mono tracking-widest ${
              result === 'success' ? 'text-green-400' : result === 'partial' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {result === 'success' ? 'CLEAN' : result === 'partial' ? 'CLOSE' : 'BLOWN'}
            </div>
            <div className={`text-sm font-mono tracking-wider ${
              result === 'success' ? 'text-green-500' : result === 'partial' ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {result === 'success' ? 'HEIST COMPLETE' : result === 'partial' ? 'PARTIAL SUCCESS' : 'HEIST FAILED'}
            </div>
            <p className="text-zinc-400 text-sm font-mono leading-relaxed max-w-md mx-auto">{resultMsg}</p>
            {selectedScenario && result === 'success' && (
              <div className="p-3 rounded-lg border border-yellow-800 bg-yellow-900/10">
                <p className="text-yellow-400 font-mono text-xs tracking-widest">LOOT SECURED</p>
                <p className="text-yellow-300 text-sm mt-1">{selectedScenario.loot}</p>
              </div>
            )}
            <button onClick={restart} className="mt-4 px-8 py-3 rounded-lg border border-zinc-700 bg-zinc-900/60 text-white font-mono text-sm tracking-widest uppercase hover:border-zinc-500 transition-colors">
              Plan Another Heist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
