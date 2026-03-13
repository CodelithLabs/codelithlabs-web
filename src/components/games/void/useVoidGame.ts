'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MutableRefObject, RefObject } from 'react';
import * as THREE from 'three';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Obstacle {
  mesh: THREE.Mesh | THREE.Group;
  glowLight?: THREE.PointLight;
}

export interface UseVoidGameOptions {
  canvasRef: RefObject<HTMLCanvasElement>;
  onScoreUpdate: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onComboUpdate: (combo: number) => void;
  onNearMiss: () => void;
  onSpawn: () => void;
  onMilestone: () => void;
  onFlash: () => void;
  onSpeedTierChange: (tier: 1 | 2 | 3) => void;
  onPause: () => void;
  onResume: () => void;
  virtualStickRef: MutableRefObject<{ x: number; y: number }>;
}

// ─── Quality Tier ────────────────────────────────────────────────────────────

type QualityTier = 'low' | 'medium' | 'high';

function getQualityTier(): QualityTier {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return 'medium';
  const cores = navigator.hardwareConcurrency ?? 4;
  const touch = navigator.maxTouchPoints > 0;
  const small = Math.max(window.innerWidth, window.innerHeight) < 768;
  if (touch && small) return 'low';
  if (cores <= 2) return 'low';
  if (cores <= 4) return 'medium';
  if (!touch && window.devicePixelRatio >= 2) return 'high';
  return 'medium';
}

const TIER_CFG = {
  low:    { segs: 32, vSegs: 30, gridLines: 8,  particles: 100, wallAnim: false, maxPR: 1   },
  medium: { segs: 48, vSegs: 50, gridLines: 12, particles: 200, wallAnim: true,  maxPR: 1.5 },
  high:   { segs: 64, vSegs: 80, gridLines: 16, particles: 450, wallAnim: true,  maxPR: 2   },
} as const;

// ─── Constants ───────────────────────────────────────────────────────────────

const TUNNEL_RADIUS        = 8;
const TUNNEL_LENGTH        = 220;
const SPEED_INITIAL        = 0.18;
const SPEED_MAX            = 0.55;
const SPEED_INCREMENT      = 0.000015;
const PLAYER_BOUNDARY      = 5.5;
const COLLISION_XY         = 1.8;
const NEAR_MISS_XY         = COLLISION_XY * 1.7;
const COLLISION_DZ         = 1.5;
const NEAR_MISS_DZ         = 2.8;
const SPAWN_Z              = -95;
const SPAWN_INTERVAL_BASE  = 1100;
const SPAWN_INTERVAL_MIN   = 360;
const COMBO_INTERVAL_S     = 4.0;
const COMBO_MAX            = 4;
const MILESTONE_STEP       = 500;

const TIER2_SPEED = 0.30;
const TIER3_SPEED = 0.42;

function getSpeedTier(speed: number): 1 | 2 | 3 {
  if (speed >= TIER3_SPEED) return 3;
  if (speed >= TIER2_SPEED) return 2;
  return 1;
}

const TUNNEL_COLORS = [
  { color: new THREE.Color(0x1a0005), emissive: new THREE.Color(0x0d0002) },
  { color: new THREE.Color(0x0d0010), emissive: new THREE.Color(0x06000a) },
  { color: new THREE.Color(0x00040d), emissive: new THREE.Color(0x000206) },
];
const OBS_COLORS    = [0xff1133, 0xff8800, 0x00eeff] as const;
const OBS_EMISSIVES = [0xff0020, 0xff6600, 0x00ffcc] as const;
const PARTICLE_COLORS = [0xff2244, 0xff6622, 0x00ddff] as const;
const WALL_LIGHT_COLORS = [0xff0020, 0x6600ff, 0xff4400, 0x00aaff, 0xff0088, 0x00ff44] as const;

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useVoidGame({
  canvasRef,
  onScoreUpdate,
  onGameOver,
  onComboUpdate,
  onNearMiss,
  onSpawn,
  onMilestone,
  onFlash,
  onSpeedTierChange,
  onPause,
  onResume,
  virtualStickRef,
}: UseVoidGameOptions) {
  const [isReady, setIsReady] = useState(false);
  const rendererRef    = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef       = useRef<THREE.Scene | null>(null);
  const cameraRef      = useRef<THREE.PerspectiveCamera | null>(null);
  const rafRef         = useRef<number>(0);
  const lastFrameMsRef = useRef(0);
  const elapsedSRef    = useRef(0);
  const warmupRafRef   = useRef<number[]>([]);
  const frameCountRef  = useRef(0);

  const obstaclesRef   = useRef<Obstacle[]>([]);
  const particlesRef   = useRef<THREE.Points | null>(null);
  const tunnelMeshRef  = useRef<THREE.Mesh | null>(null);
  const wallLightsRef  = useRef<THREE.PointLight[]>([]);
  const playerLightRef = useRef<THREE.PointLight | null>(null);

  const sharedGeos = useRef<{
    box:      THREE.BoxGeometry;
    boxSmall: THREE.BoxGeometry;
    torus:    THREE.TorusGeometry;
    barD:     THREE.BoxGeometry;
    barV:     THREE.BoxGeometry;
  } | null>(null);
  const obstacleMatsRef = useRef<Record<1 | 2 | 3, THREE.MeshStandardMaterial> | null>(null);

  const playerRef  = useRef({ x: 0, y: 0 });
  const targetRef  = useRef({ x: 0, y: 0 });
  const keysRef    = useRef(new Set<string>());

  const aliveRef      = useRef(false);
  const pausedRef     = useRef(false);
  const dyingRef      = useRef(false);
  const slowMoTRef    = useRef(0);
  const spawnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const speedRef       = useRef(SPEED_INITIAL);
  const scoreRef       = useRef(0);
  const comboRef       = useRef(1);
  const comboTimerRef  = useRef(0);
  const nextMilestone  = useRef(MILESTONE_STEP);
  const speedTierRef   = useRef<1 | 2 | 3>(1);
  const qualityTierRef = useRef<QualityTier>('medium');

  const shakeRef      = useRef<{ t: number; mag: number } | null>(null);
  const nearMissedRef = useRef(new Set<Obstacle>());
  const tempWorldPosRef = useRef(new THREE.Vector3());

  // Mirror of all parent callbacks — updated every render cycle via useEffect.
  // Lets the RAF loop always call the latest version without being in deps arrays.
  const cbRef = useRef({
    onScoreUpdate, onGameOver, onComboUpdate, onNearMiss,
    onSpawn, onMilestone, onFlash, onSpeedTierChange, onPause, onResume,
  });
  useEffect(() => {
    cbRef.current = {
      onScoreUpdate, onGameOver, onComboUpdate, onNearMiss,
      onSpawn, onMilestone, onFlash, onSpeedTierChange, onPause, onResume,
    };
  });

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const stopSpawnTimer = useCallback(() => {
    if (spawnTimerRef.current !== null) {
      clearTimeout(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }
  }, []);

  const stopGame = useCallback(() => {
    aliveRef.current  = false;
    dyingRef.current  = false;
    cancelAnimationFrame(rafRef.current);
    stopSpawnTimer();
  }, [stopSpawnTimer]);

  // ─── Scene builders ───────────────────────────────────────────────────────

  const buildSharedGeos = useCallback(() => {
    sharedGeos.current = {
      box:      new THREE.BoxGeometry(2.0, 2.0, 2.0),
      boxSmall: new THREE.BoxGeometry(1.3, 1.3, 1.3),
      torus:    new THREE.TorusGeometry(2.6, 0.22, 8, 24),
      barD:     new THREE.BoxGeometry(4.5, 0.4, 0.4),
      barV:     new THREE.BoxGeometry(0.35, 5.5, 0.35),
    };
  }, []);

  const buildSharedMats = useCallback(() => {
    obstacleMatsRef.current = {
      1: new THREE.MeshStandardMaterial({
        color: OBS_COLORS[0], emissive: OBS_EMISSIVES[0], emissiveIntensity: 1.4, roughness: 0.15, metalness: 0.9,
      }),
      2: new THREE.MeshStandardMaterial({
        color: OBS_COLORS[1], emissive: OBS_EMISSIVES[1], emissiveIntensity: 1.4, roughness: 0.15, metalness: 0.9,
      }),
      3: new THREE.MeshStandardMaterial({
        color: OBS_COLORS[2], emissive: OBS_EMISSIVES[2], emissiveIntensity: 1.4, roughness: 0.15, metalness: 0.9,
      }),
    };
  }, []);

  const buildTunnel = useCallback((scene: THREE.Scene, tier: QualityTier) => {
    const { segs, vSegs, gridLines } = TIER_CFG[tier];
    const geo = new THREE.CylinderGeometry(
      TUNNEL_RADIUS, TUNNEL_RADIUS, TUNNEL_LENGTH, segs, vSegs, true,
    );
    geo.rotateX(Math.PI / 2);

    const mat = new THREE.MeshStandardMaterial({
      color:             new THREE.Color(0x1a0005),
      emissive:          new THREE.Color(0x0d0002),
      emissiveIntensity: 0.3,
      side:              THREE.BackSide,
      roughness:         0.95,
      metalness:         0.05,
    });

    const tunnel = new THREE.Mesh(geo, mat);
    tunnel.position.z = -TUNNEL_LENGTH / 2 + 5;
    tunnel.name = 'tunnel';
    tunnelMeshRef.current = tunnel;
    scene.add(tunnel);

    for (let i = 0; i < gridLines; i++) {
      const angle = (i / gridLines) * Math.PI * 2;
      const lx = Math.cos(angle) * (TUNNEL_RADIUS - 0.1);
      const ly = Math.sin(angle) * (TUNNEL_RADIUS - 0.1);
      const pts = [
        new THREE.Vector3(lx, ly, 5),
        new THREE.Vector3(lx, ly, -TUNNEL_LENGTH + 5),
      ];
      const lineMat = new THREE.LineBasicMaterial({ color: 0x3d0010, transparent: true, opacity: 0.35 });
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
    }
  }, []);

  const buildLights = useCallback((scene: THREE.Scene) => {
    scene.add(new THREE.AmbientLight(0xff0020, 0.15));

    const pl = new THREE.PointLight(0xff1133, 2.5, 18);
    pl.name = 'playerLight';
    playerLightRef.current = pl;
    scene.add(pl);

    wallLightsRef.current = [];
    for (let i = 0; i < 6; i++) {
      const light = new THREE.PointLight(WALL_LIGHT_COLORS[i], 0.9, 22);
      const angle = (i / 6) * Math.PI * 2;
      light.position.set(Math.cos(angle) * 6, Math.sin(angle) * 6, -20 - i * 15);
      scene.add(light);
      wallLightsRef.current.push(light);
    }
  }, []);

  const buildParticles = useCallback((scene: THREE.Scene, tier: QualityTier) => {
    const count = TIER_CFG[tier].particles;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * TUNNEL_RADIUS * 0.88;
      positions[i * 3]     = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r;
      positions[i * 3 + 2] = -(Math.random() * TUNNEL_LENGTH);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0xff2244, size: 0.07, transparent: true, opacity: 0.4, sizeAttenuation: true });
    const pts = new THREE.Points(geo, mat);
    particlesRef.current = pts;
    scene.add(pts);
  }, []);

  // ─── Obstacle management ──────────────────────────────────────────────────

  const clearObstacles = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    for (const obs of obstaclesRef.current) {
      scene.remove(obs.mesh);
      if (obs.glowLight) scene.remove(obs.glowLight);
    }
    obstaclesRef.current = [];
    nearMissedRef.current.clear();
  }, []);

  const getObstacleMat = useCallback((tier: 1 | 2 | 3) => {
    if (!obstacleMatsRef.current) buildSharedMats();
    return obstacleMatsRef.current![tier];
  }, [buildSharedMats]);

  const prewarmRenderer = useCallback((scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
    if (!sharedGeos.current) return;

    const warmGroup = new THREE.Group();
    warmGroup.position.set(999, 999, -40);

    const samples = [
      new THREE.Mesh(sharedGeos.current.box, getObstacleMat(1)),
      new THREE.Mesh(sharedGeos.current.boxSmall, getObstacleMat(2)),
      new THREE.Mesh(sharedGeos.current.torus, getObstacleMat(3)),
      new THREE.Mesh(sharedGeos.current.barD, getObstacleMat(1)),
      new THREE.Mesh(sharedGeos.current.barV, getObstacleMat(2)),
    ];

    samples.forEach((mesh, index) => {
      mesh.position.set(index * 2.5, index % 2 === 0 ? 0 : 1.5, -15 - index * 4);
      warmGroup.add(mesh);
    });

    scene.add(warmGroup);
    renderer.compile(scene, camera);
    renderer.render(scene, camera);
    scene.remove(warmGroup);
  }, [getObstacleMat]);

  const spawnObstacle = useCallback((scene: THREE.Scene) => {
    if (!aliveRef.current || dyingRef.current) return;
    if (obstaclesRef.current.length >= 16) return;

    const g = sharedGeos.current!;
    const tier = speedTierRef.current;
    const score = Math.floor(scoreRef.current);

    type P = 'center' | 'wall-l' | 'wall-r' | 'paired' | 'pinwheel' | 'ring-gap' | 'tracker-cross';
    let pool: P[];
    if (score >= 3000)      pool = ['tracker-cross', 'center', 'center', 'wall-l', 'wall-r', 'paired'];
    else if (score >= 2000) pool = ['center', 'center', 'wall-l', 'wall-r', 'paired', 'pinwheel', 'ring-gap'];
    else if (score >= 1000) pool = ['center', 'center', 'wall-l', 'wall-r', 'paired'];
    else                    pool = ['center', 'center', 'center', 'wall-l', 'wall-r'];

    const pattern = pool[Math.floor(Math.random() * pool.length)];
    let obj: THREE.Mesh | THREE.Group;
    if (pattern === 'center') {
      if (Math.random() < 0.55) {
        obj = new THREE.Mesh(g.box, getObstacleMat(tier));
        obj.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      } else {
        obj = new THREE.Mesh(g.torus, getObstacleMat(tier));
      }
      obj.position.set(0, 0, SPAWN_Z);
    } else if (pattern === 'wall-l' || pattern === 'wall-r') {
      const side = pattern === 'wall-l' ? -3.5 : 3.5;
      const grp = new THREE.Group();
      grp.add(new THREE.Mesh(g.barD, getObstacleMat(tier)));
      grp.add(new THREE.Mesh(g.barV, getObstacleMat(tier)));
      grp.position.set(side, 0, SPAWN_Z);
      obj = grp;
    } else if (pattern === 'paired') {
      const grp = new THREE.Group();
      const mL = new THREE.Mesh(g.boxSmall, getObstacleMat(tier));
      const mR = new THREE.Mesh(g.boxSmall, getObstacleMat(tier));
      mL.position.set(-3.2, 0, 0);
      mR.position.set( 3.2, 0, 0);
      grp.add(mL, mR);
      grp.position.set(0, 0, SPAWN_Z);
      obj = grp;
    } else if (pattern === 'pinwheel') {
      const grp = new THREE.Group();
      for (let i = 0; i < 3; i++) {
        const blade = new THREE.Mesh(g.barD, getObstacleMat(tier));
        blade.rotation.z = (i / 3) * Math.PI * 2;
        grp.add(blade);
      }
      grp.position.set(0, 0, SPAWN_Z);
      obj = grp;
    } else if (pattern === 'tracker-cross') {
      const grp = new THREE.Group();
      const horizontal = new THREE.Mesh(g.barD, getObstacleMat(tier));
      const vertical = new THREE.Mesh(g.barV, getObstacleMat(tier));
      grp.add(horizontal, vertical);

      const trackedX = THREE.MathUtils.clamp(playerRef.current.x, -PLAYER_BOUNDARY * 0.75, PLAYER_BOUNDARY * 0.75);
      const trackedY = THREE.MathUtils.clamp(playerRef.current.y, -PLAYER_BOUNDARY * 0.75, PLAYER_BOUNDARY * 0.75);
      grp.position.set(trackedX, trackedY, SPAWN_Z);
      obj = grp;
    } else {
      const grp = new THREE.Group();
      const r1 = new THREE.Mesh(g.torus, getObstacleMat(tier));
      const r2 = new THREE.Mesh(g.torus, getObstacleMat(tier));
      r1.scale.set(1.4, 1.4, 1);
      r2.scale.set(1.4, 1.4, 1);
      r2.rotation.y = Math.PI / 3;
      grp.add(r1, r2);
      grp.position.set(0, 0, SPAWN_Z);
      obj = grp;
    }

    const glow = new THREE.PointLight(OBS_EMISSIVES[tier - 1], 1.8, 7);
    glow.position.copy(obj.position);
    scene.add(glow);
    scene.add(obj);
    obstaclesRef.current.push({ mesh: obj, glowLight: glow });
    cbRef.current.onSpawn();
  }, [getObstacleMat]);

  const scheduleSpawn = useCallback(() => {
    const queueNextSpawn = () => {
      if (!aliveRef.current || dyingRef.current || pausedRef.current) return;
      const interval = Math.max(
        SPAWN_INTERVAL_MIN,
        SPAWN_INTERVAL_BASE - Math.floor((speedRef.current - SPEED_INITIAL) * 4200),
      );
      spawnTimerRef.current = setTimeout(() => {
        if (sceneRef.current) spawnObstacle(sceneRef.current);
        queueNextSpawn();
      }, interval);
    };

    queueNextSpawn();
  }, [spawnObstacle]);

  // ─── Game loop ────────────────────────────────────────────────────────────

  const gameLoop = useCallback(function runGameLoop() {
    const renderer = rendererRef.current;
    const scene    = sceneRef.current;
    const camera   = cameraRef.current;
    if (!renderer || !scene || !camera) return;

    // ── Dying slow-motion ────────────────────────────────────────────────────
    if (dyingRef.current) {
      const now = performance.now();
      let rawDelta = (now - lastFrameMsRef.current) / 1000;
      if (rawDelta > 0.1) rawDelta = 0.1;
      lastFrameMsRef.current = now;
      elapsedSRef.current += rawDelta;
      slowMoTRef.current -= rawDelta;

      if (shakeRef.current) {
        shakeRef.current.t   -= rawDelta;
        shakeRef.current.mag *= 0.88;
        if (shakeRef.current.t > 0 && shakeRef.current.mag > 0.003) {
          camera.position.x += (Math.random() - 0.5) * shakeRef.current.mag;
          camera.position.y += (Math.random() - 0.5) * shakeRef.current.mag;
        } else {
          shakeRef.current = null;
        }
      }

      renderer.render(scene, camera);

      if (slowMoTRef.current <= 0) {
        dyingRef.current = false;
        cbRef.current.onGameOver(Math.floor(scoreRef.current));
        return;
      }
      rafRef.current = requestAnimationFrame(runGameLoop);
      return;
    }

    if (!aliveRef.current) return;

    // ── Paused ───────────────────────────────────────────────────────────────
    if (pausedRef.current) {
      lastFrameMsRef.current = performance.now();
      rafRef.current = requestAnimationFrame(runGameLoop);
      return;
    }

    const now = performance.now();
    let delta = (now - lastFrameMsRef.current) / 1000;
    lastFrameMsRef.current = now;
    frameCountRef.current += 1;
    if (delta > 0.1) delta = 0.1; // safety clamp
    elapsedSRef.current += delta;
    const elapsed = elapsedSRef.current;

    // ── Input ────────────────────────────────────────────────────────────────
    const inputSpeed = 0.11;
    const vs = virtualStickRef.current;

    if (vs.x !== 0 || vs.y !== 0) {
      targetRef.current.x = Math.max(-PLAYER_BOUNDARY, Math.min(PLAYER_BOUNDARY, targetRef.current.x + vs.x * inputSpeed * 0.9));
      targetRef.current.y = Math.max(-PLAYER_BOUNDARY, Math.min(PLAYER_BOUNDARY, targetRef.current.y - vs.y * inputSpeed * 0.9));
    } else {
      if (keysRef.current.has('ArrowLeft') || keysRef.current.has('a') || keysRef.current.has('A'))
        targetRef.current.x = Math.max(targetRef.current.x - inputSpeed, -PLAYER_BOUNDARY);
      if (keysRef.current.has('ArrowRight') || keysRef.current.has('d') || keysRef.current.has('D'))
        targetRef.current.x = Math.min(targetRef.current.x + inputSpeed,  PLAYER_BOUNDARY);
      if (keysRef.current.has('ArrowUp') || keysRef.current.has('w') || keysRef.current.has('W'))
        targetRef.current.y = Math.min(targetRef.current.y + inputSpeed,  PLAYER_BOUNDARY);
      if (keysRef.current.has('ArrowDown') || keysRef.current.has('s') || keysRef.current.has('S'))
        targetRef.current.y = Math.max(targetRef.current.y - inputSpeed, -PLAYER_BOUNDARY);
    }

    playerRef.current.x += (targetRef.current.x - playerRef.current.x) * 0.1;
    playerRef.current.y += (targetRef.current.y - playerRef.current.y) * 0.1;

    // ── Camera + screen shake ────────────────────────────────────────────────
    let shakeX = 0, shakeY = 0;
    if (shakeRef.current) {
      shakeRef.current.t   -= delta;
      shakeRef.current.mag *= 0.91;
      if (shakeRef.current.t > 0 && shakeRef.current.mag > 0.003) {
        shakeX = (Math.random() - 0.5) * shakeRef.current.mag;
        shakeY = (Math.random() - 0.5) * shakeRef.current.mag;
      } else {
        shakeRef.current = null;
      }
    }

    camera.position.x = playerRef.current.x + Math.sin(elapsed * 0.7) * 0.04 + shakeX;
    camera.position.y = playerRef.current.y + Math.cos(elapsed * 0.5) * 0.03 + shakeY;
    camera.lookAt(playerRef.current.x, playerRef.current.y, -100);

    if (playerLightRef.current) {
      playerLightRef.current.position.set(camera.position.x, camera.position.y, camera.position.z - 1);
      playerLightRef.current.intensity = 2.5 + Math.sin(elapsed * 9) * 0.4;
    }

    // ── Speed + tier ─────────────────────────────────────────────────────────
    speedRef.current = Math.min(speedRef.current + SPEED_INCREMENT, SPEED_MAX);

    const newTier = getSpeedTier(speedRef.current);
    if (newTier !== speedTierRef.current) {
      speedTierRef.current = newTier;
      cbRef.current.onSpeedTierChange(newTier);
      if (particlesRef.current) {
        (particlesRef.current.material as THREE.PointsMaterial).color.setHex(PARTICLE_COLORS[newTier - 1]);
      }
    }

    if (tunnelMeshRef.current) {
      const tMat = tunnelMeshRef.current.material as THREE.MeshStandardMaterial;
      const tc = TUNNEL_COLORS[speedTierRef.current - 1];
      tMat.color.lerp(tc.color, 0.008);
      tMat.emissive.lerp(tc.emissive, 0.008);
    }

    // ── Score + combo ────────────────────────────────────────────────────────
    scoreRef.current += speedRef.current * 60 * delta * comboRef.current;

    comboTimerRef.current += delta;
    if (comboTimerRef.current >= COMBO_INTERVAL_S) {
      comboTimerRef.current -= COMBO_INTERVAL_S;
      const next = Math.min(comboRef.current + 1, COMBO_MAX);
      if (next !== comboRef.current) {
        comboRef.current = next;
        cbRef.current.onComboUpdate(next);
      }
    }

    const curScore = Math.floor(scoreRef.current);
    if (curScore >= nextMilestone.current) {
      nextMilestone.current += MILESTONE_STEP;
      scoreRef.current += 50;
      cbRef.current.onMilestone();
    }

    cbRef.current.onScoreUpdate(Math.floor(scoreRef.current));

    // ── Obstacles (swap-remove loop) ─────────────────────────────────────────
    const camZ = camera.position.z;
    let i = obstaclesRef.current.length;
    while (i--) {
      const obs = obstaclesRef.current[i];

      obs.mesh.position.z += speedRef.current;
      if (obs.mesh instanceof THREE.Mesh) {
        obs.mesh.rotation.x += delta * 0.5;
        obs.mesh.rotation.y += delta * 0.3;
      } else {
        obs.mesh.rotation.z += delta * 0.45;
      }
      if (obs.glowLight) {
        obs.glowLight.position.set(obs.mesh.position.x, obs.mesh.position.y, obs.mesh.position.z);
      }

      let hit = false;
      let near = false;

      if (obs.mesh instanceof THREE.Mesh) {
        const dx = camera.position.x - obs.mesh.position.x;
        const dy = camera.position.y - obs.mesh.position.y;
        const dz = Math.abs(camZ - obs.mesh.position.z);
        const dxySq = dx * dx + dy * dy;
        hit = dz < COLLISION_DZ && dxySq < COLLISION_XY * COLLISION_XY;
        near = dz < NEAR_MISS_DZ && dxySq < NEAR_MISS_XY * NEAR_MISS_XY;
      } else {
        obs.mesh.updateMatrixWorld(true);
        for (const child of obs.mesh.children) {
          if (!(child instanceof THREE.Mesh)) continue;
          const worldPos = child.getWorldPosition(tempWorldPosRef.current);
          const dx = camera.position.x - worldPos.x;
          const dy = camera.position.y - worldPos.y;
          const dz = Math.abs(camZ - worldPos.z);
          const dxySq = dx * dx + dy * dy;

          if (dz < COLLISION_DZ && dxySq < COLLISION_XY * COLLISION_XY) {
            hit = true;
            break;
          }
          if (dz < NEAR_MISS_DZ && dxySq < NEAR_MISS_XY * NEAR_MISS_XY) {
            near = true;
          }
        }
      }

      if (hit) {
        aliveRef.current = false;
        dyingRef.current = true;
        slowMoTRef.current = 0.48;
        stopSpawnTimer();
        shakeRef.current = { t: 0.7, mag: 0.45 };
        cbRef.current.onFlash();
        renderer.render(scene, camera);
        rafRef.current = requestAnimationFrame(runGameLoop);
        return;
      }

      if (near && !nearMissedRef.current.has(obs)) {
        nearMissedRef.current.add(obs);
        shakeRef.current = { t: 0.2, mag: 0.11 };
        cbRef.current.onNearMiss();
      }

      if (obs.mesh.position.z > camZ + 6) {
        scene.remove(obs.mesh);
        if (obs.glowLight) scene.remove(obs.glowLight);
        nearMissedRef.current.delete(obs);
        obstaclesRef.current[i] = obstaclesRef.current[obstaclesRef.current.length - 1];
        obstaclesRef.current.pop();
      }
    }

    // ── Particles ─────────────────────────────────────────────────────────────
    const shouldUpdateParticles =
      qualityTierRef.current !== 'low' || frameCountRef.current % 2 === 0;
    if (particlesRef.current && shouldUpdateParticles) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const pCount = pos.length / 3;
      const zStep = speedRef.current * 0.45 * (qualityTierRef.current === 'low' ? 2 : 1);
      for (let j = 0; j < pCount; j++) {
        pos[j * 3 + 2] += zStep;
        if (pos[j * 3 + 2] > camZ + 3) pos[j * 3 + 2] = camZ - TUNNEL_LENGTH + 5;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // ── Wall lights ────────────────────────────────────────────────────────────
    if (TIER_CFG[qualityTierRef.current].wallAnim) {
      for (let j = 0; j < wallLightsRef.current.length; j++) {
        wallLightsRef.current[j].intensity = 0.9 + Math.sin(elapsed * 2.2 + j) * 0.45;
      }
    }

    renderer.render(scene, camera);
    rafRef.current = requestAnimationFrame(runGameLoop);
  }, [stopSpawnTimer, virtualStickRef]);

  // ─── Public API ───────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    playerRef.current     = { x: 0, y: 0 };
    targetRef.current     = { x: 0, y: 0 };
    speedRef.current      = SPEED_INITIAL;
    scoreRef.current      = 0;
    comboRef.current      = 1;
    comboTimerRef.current = 0;
    nextMilestone.current = MILESTONE_STEP;
    speedTierRef.current  = 1;
    aliveRef.current      = true;
    pausedRef.current     = false;
    dyingRef.current      = false;
    shakeRef.current      = null;
    nearMissedRef.current.clear();
    frameCountRef.current = 0;

    if (tunnelMeshRef.current) {
      const tMat = tunnelMeshRef.current.material as THREE.MeshStandardMaterial;
      tMat.color.set(0x1a0005);
      tMat.emissive.set(0x0d0002);
    }
    if (particlesRef.current) {
      (particlesRef.current.material as THREE.PointsMaterial).color.setHex(PARTICLE_COLORS[0]);
    }

    cameraRef.current?.position.set(0, 0, 5);
    lastFrameMsRef.current = performance.now();
    elapsedSRef.current = 0;
    stopSpawnTimer();
    scheduleSpawn();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop, scheduleSpawn, stopSpawnTimer]);

  const resetGame = useCallback(() => {
    stopGame();
    clearObstacles();
  }, [stopGame, clearObstacles]);

  const pauseGame = useCallback(() => {
    if (!aliveRef.current || dyingRef.current || pausedRef.current) return;
    pausedRef.current = true;
    stopSpawnTimer();
    cbRef.current.onPause();
  }, [stopSpawnTimer]);

  const resumeGame = useCallback(() => {
    if (!aliveRef.current || dyingRef.current || !pausedRef.current) return;
    pausedRef.current = false;
    lastFrameMsRef.current = performance.now();
    scheduleSpawn();
    cbRef.current.onResume();
  }, [scheduleSpawn]);

  const endGame = useCallback(() => {
    if (!aliveRef.current || dyingRef.current) return;
    stopSpawnTimer();
    aliveRef.current = false;
    pausedRef.current = false;
    cbRef.current.onGameOver(Math.floor(scoreRef.current));
  }, [stopSpawnTimer]);

  // ─── Lifecycle / Three.js init ────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tier = getQualityTier();
    qualityTierRef.current = tier;

    const w = window.innerWidth;
    const h = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias:       tier !== 'low',
      alpha:           false,
      stencil:         false,
      powerPreference: 'high-performance',
      precision:       tier === 'low' ? 'mediump' : 'highp',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, TIER_CFG[tier].maxPR));
    renderer.outputColorSpace    = THREE.SRGBColorSpace;
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.6;
    renderer.sortObjects = false;
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, tier === 'low' ? 0.018 : 0.022);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(90, w / h, 0.1, 200);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    buildSharedGeos();
    buildSharedMats();
    buildTunnel(scene, tier);
    buildLights(scene);
    buildParticles(scene, tier);

    const onContextLost = (e: Event) => { e.preventDefault(); stopGame(); };

    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === ' ' && aliveRef.current && !dyingRef.current) {
        if (pausedRef.current) {
          resumeGame();
        } else {
          pauseGame();
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => { keysRef.current.delete(e.key); };

    const onMouseMove = (e: MouseEvent) => {
      if (!aliveRef.current || pausedRef.current || dyingRef.current) return;
      targetRef.current.x = (e.clientX / window.innerWidth  - 0.5) * 2 * PLAYER_BOUNDARY * 0.8;
      targetRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2 * PLAYER_BOUNDARY * 0.8;
    };

    const onVisibilityChange = () => {
      if (document.hidden && aliveRef.current && !pausedRef.current && !dyingRef.current) {
        pausedRef.current = true;
        stopSpawnTimer();
        cbRef.current.onPause();
      }
    };

    const onResize = () => {
      const r = rendererRef.current;
      const c = cameraRef.current;
      if (!r || !c) return;
      r.setSize(window.innerWidth, window.innerHeight);
      c.aspect = window.innerWidth / window.innerHeight;
      c.updateProjectionMatrix();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);
    canvas.addEventListener('webglcontextlost', onContextLost);

    renderer.render(scene, camera);

    const warmup = () => {
      prewarmRenderer(scene, camera, renderer);
      setIsReady(true);
    };

    warmupRafRef.current = [
      requestAnimationFrame(() => {
        warmupRafRef.current[1] = requestAnimationFrame(warmup);
      }),
    ];

    return () => {
      stopGame();
      warmupRafRef.current.forEach((id) => cancelAnimationFrame(id));
      warmupRafRef.current = [];
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('webglcontextlost', onContextLost);

      clearObstacles();

      if (sharedGeos.current) {
        Object.values(sharedGeos.current).forEach((geo) => geo.dispose());
        sharedGeos.current = null;
      }

      if (obstacleMatsRef.current) {
        Object.values(obstacleMatsRef.current).forEach((mat) => mat.dispose());
        obstacleMatsRef.current = null;
      }

      sceneRef.current?.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
        if (obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });

      sceneRef.current?.clear();
      rendererRef.current?.dispose();
      rendererRef.current    = null;
      sceneRef.current       = null;
      cameraRef.current      = null;
      particlesRef.current   = null;
      tunnelMeshRef.current  = null;
      playerLightRef.current = null;
      wallLightsRef.current  = [];
    };
  }, [buildLights, buildParticles, buildSharedGeos, buildSharedMats, buildTunnel, canvasRef, clearObstacles, pauseGame, prewarmRenderer, resumeGame, scheduleSpawn, stopGame, stopSpawnTimer]);

  return { startGame, resetGame, pauseGame, resumeGame, endGame, isReady };
}
