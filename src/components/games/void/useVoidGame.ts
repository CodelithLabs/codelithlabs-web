'use client';
/* eslint-disable react-hooks/immutability */

import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import * as THREE from 'three';
import type { GameState } from './VoidGame';

interface Obstacle {
  mesh: THREE.Mesh | THREE.Group;
  speed: number;
  glowLight?: THREE.PointLight;
}

interface UseVoidGameOptions {
  canvasRef: RefObject<HTMLCanvasElement>;
  gameState: GameState;
  onScoreUpdate: (score: number) => void;
  onGameOver: (finalScore: number) => void;
}

const TUNNEL_RADIUS = 8;
const TUNNEL_LENGTH = 220;
const TUNNEL_SEGMENTS = 64;
const SPEED_INITIAL = 0.18;
const SPEED_MAX = 0.55;
const SPEED_INCREMENT = 0.000015;
const SPAWN_INTERVAL_MS = 1100;
const SPAWN_Z = -95;
const PLAYER_BOUNDARY = 5.5;
const COLLISION_XY = 1.8;
const PARTICLE_COUNT = 450;

export function useVoidGame({ canvasRef, onScoreUpdate, onGameOver }: UseVoidGameOptions) {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rafRef = useRef<number>(0);
  const clockRef = useRef(new THREE.Clock());
  const obstaclesRef = useRef<Obstacle[]>([]);
  const playerRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const speedRef = useRef(SPEED_INITIAL);
  const scoreRef = useRef(0);
  const aliveRef = useRef(false);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const keysRef = useRef(new Set<string>());
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const stopGame = useCallback(() => {
    aliveRef.current = false;
    cancelAnimationFrame(rafRef.current);
    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }
  }, []);

  const buildTunnel = useCallback((scene: THREE.Scene) => {
    const geo = new THREE.CylinderGeometry(
      TUNNEL_RADIUS,
      TUNNEL_RADIUS,
      TUNNEL_LENGTH,
      TUNNEL_SEGMENTS,
      80,
      true,
    );
    geo.rotateX(Math.PI / 2);

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x1a0005),
      emissive: new THREE.Color(0x0d0002),
      emissiveIntensity: 0.3,
      side: THREE.BackSide,
      roughness: 0.95,
      metalness: 0.05,
    });

    const tunnel = new THREE.Mesh(geo, mat);
    tunnel.position.z = -TUNNEL_LENGTH / 2 + 5;
    tunnel.name = 'tunnel';
    scene.add(tunnel);

    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const lx = Math.cos(angle) * (TUNNEL_RADIUS - 0.1);
      const ly = Math.sin(angle) * (TUNNEL_RADIUS - 0.1);
      const pts = [
        new THREE.Vector3(lx, ly, 5),
        new THREE.Vector3(lx, ly, -TUNNEL_LENGTH + 5),
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x3d0010,
        transparent: true,
        opacity: 0.35,
      });
      scene.add(new THREE.Line(lineGeo, lineMat));
    }
  }, []);

  const buildLights = useCallback((scene: THREE.Scene) => {
    scene.add(new THREE.AmbientLight(0xff0020, 0.15));

    const playerLight = new THREE.PointLight(0xff1133, 2.5, 18);
    playerLight.name = 'playerLight';
    scene.add(playerLight);

    const wallColors = [0xff0020, 0x6600ff, 0xff4400, 0x00aaff, 0xff0088, 0x00ff44];
    for (let i = 0; i < 6; i++) {
      const light = new THREE.PointLight(wallColors[i], 0.9, 22);
      const angle = (i / 6) * Math.PI * 2;
      light.position.set(Math.cos(angle) * 6, Math.sin(angle) * 6, -20 - i * 15);
      light.name = `wallLight_${i}`;
      scene.add(light);
    }
  }, []);

  const buildParticles = useCallback((scene: THREE.Scene) => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * TUNNEL_RADIUS * 0.88;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r;
      positions[i * 3 + 2] = -(Math.random() * TUNNEL_LENGTH);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xff2244,
      size: 0.07,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
    });

    const pts = new THREE.Points(geo, mat);
    particlesRef.current = pts;
    scene.add(pts);
  }, []);

  const clearObstacles = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    obstaclesRef.current.forEach((obs) => {
      scene.remove(obs.mesh);
      if (obs.glowLight) {
        scene.remove(obs.glowLight);
      }
    });
    obstaclesRef.current = [];
  }, []);

  const spawnObstacle = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene || !aliveRef.current) return;

    const mat = new THREE.MeshStandardMaterial({
      color: 0xff1133,
      emissive: 0xff0020,
      emissiveIntensity: 1.4,
      roughness: 0.15,
      metalness: 0.9,
    });

    const shapes = ['cube', 'ring', 'cross', 'bar'] as const;
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    let obj: THREE.Mesh | THREE.Group;

    if (shape === 'cube') {
      const s = 1.1 + Math.random() * 1.3;
      obj = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), mat);
    } else if (shape === 'ring') {
      obj = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.22, 8, 24), mat);
    } else if (shape === 'cross') {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.4, 0.4), mat.clone()));
      g.add(new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.5, 0.4), mat.clone()));
      obj = g;
    } else {
      obj = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.3, 0.3), mat);
      (obj as THREE.Mesh).rotation.z =
        (Math.random() > 0.5 ? 1 : -1) * (Math.PI / 4 + Math.random() * 0.4);
    }

    const spawnR = TUNNEL_RADIUS * 0.5;
    const angle = Math.random() * Math.PI * 2;
    const ox = shape === 'ring' ? 0 : Math.cos(angle) * spawnR * Math.random();
    const oy = shape === 'ring' ? 0 : Math.sin(angle) * spawnR * Math.random();

    obj.position.set(ox, oy, SPAWN_Z);
    if (obj instanceof THREE.Mesh) {
      obj.rotation.x = Math.random() * Math.PI;
      obj.rotation.y = Math.random() * Math.PI;
    }

    const glow = new THREE.PointLight(0xff0020, 1.8, 7);
    glow.position.set(ox, oy, SPAWN_Z);
    scene.add(glow);
    scene.add(obj);

    obstaclesRef.current.push({
      mesh: obj,
      speed: speedRef.current,
      glowLight: glow,
    });
  }, []);

  const gameLoop = useCallback(() => {
    if (!aliveRef.current) return;

    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) return;

    const delta = clockRef.current.getDelta();
    const elapsed = clockRef.current.getElapsedTime();

    const inputSpeed = 0.11;
    if (keysRef.current.has('ArrowLeft') || keysRef.current.has('a') || keysRef.current.has('A')) {
      targetRef.current.x = Math.max(targetRef.current.x - inputSpeed, -PLAYER_BOUNDARY);
    }
    if (keysRef.current.has('ArrowRight') || keysRef.current.has('d') || keysRef.current.has('D')) {
      targetRef.current.x = Math.min(targetRef.current.x + inputSpeed, PLAYER_BOUNDARY);
    }
    if (keysRef.current.has('ArrowUp') || keysRef.current.has('w') || keysRef.current.has('W')) {
      targetRef.current.y = Math.min(targetRef.current.y + inputSpeed, PLAYER_BOUNDARY);
    }
    if (keysRef.current.has('ArrowDown') || keysRef.current.has('s') || keysRef.current.has('S')) {
      targetRef.current.y = Math.max(targetRef.current.y - inputSpeed, -PLAYER_BOUNDARY);
    }

    playerRef.current.x += (targetRef.current.x - playerRef.current.x) * 0.1;
    playerRef.current.y += (targetRef.current.y - playerRef.current.y) * 0.1;

    camera.position.x = playerRef.current.x + Math.sin(elapsed * 0.7) * 0.04;
    camera.position.y = playerRef.current.y + Math.cos(elapsed * 0.5) * 0.03;
    camera.lookAt(playerRef.current.x, playerRef.current.y, -100);

    const playerLight = scene.getObjectByName('playerLight') as THREE.PointLight | undefined;
    if (playerLight) {
      playerLight.position.set(camera.position.x, camera.position.y, camera.position.z - 1);
      playerLight.intensity = 2.5 + Math.sin(elapsed * 9) * 0.4;
    }

    speedRef.current = Math.min(speedRef.current + SPEED_INCREMENT, SPEED_MAX);

    scoreRef.current += speedRef.current * 60 * delta;
    onScoreUpdate(Math.floor(scoreRef.current));

    const toRemove: Obstacle[] = [];
    for (const obs of obstaclesRef.current) {
      obs.mesh.position.z += speedRef.current;
      if (obs.mesh instanceof THREE.Mesh) {
        obs.mesh.rotation.x += delta * 0.5;
        obs.mesh.rotation.y += delta * 0.3;
      } else {
        obs.mesh.children.forEach((child) => {
          (child as THREE.Mesh).rotation.z += delta * 0.4;
        });
      }

      if (obs.glowLight) {
        obs.glowLight.position.z = obs.mesh.position.z;
      }

      const dx = camera.position.x - obs.mesh.position.x;
      const dy = camera.position.y - obs.mesh.position.y;
      const dz = Math.abs(camera.position.z - obs.mesh.position.z);

      if (dz < 1.5 && Math.sqrt(dx * dx + dy * dy) < COLLISION_XY) {
        aliveRef.current = false;
        cancelAnimationFrame(rafRef.current);
        if (spawnTimerRef.current) {
          clearInterval(spawnTimerRef.current);
          spawnTimerRef.current = null;
        }
        onGameOver(Math.floor(scoreRef.current));
        renderer.render(scene, camera);
        return;
      }

      if (obs.mesh.position.z > camera.position.z + 6) {
        toRemove.push(obs);
      }
    }

    for (const obs of toRemove) {
      scene.remove(obs.mesh);
      if (obs.glowLight) {
        scene.remove(obs.glowLight);
      }
      if (obs.mesh instanceof THREE.Mesh) {
        obs.mesh.geometry.dispose();
        if (Array.isArray(obs.mesh.material)) {
          obs.mesh.material.forEach((m) => m.dispose());
        } else {
          obs.mesh.material.dispose();
        }
      }
      if (obs.glowLight) {
        obs.glowLight.dispose();
      }
    }

    obstaclesRef.current = obstaclesRef.current.filter((o) => !toRemove.includes(o));

    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3 + 2] += speedRef.current * 0.45;
        if (pos[i * 3 + 2] > camera.position.z + 3) {
          pos[i * 3 + 2] = camera.position.z - TUNNEL_LENGTH + 5;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    for (let i = 0; i < 6; i++) {
      const wl = scene.getObjectByName(`wallLight_${i}`) as THREE.PointLight | undefined;
      if (wl) {
        wl.intensity = 0.9 + Math.sin(elapsed * 2.2 + i) * 0.45;
      }
    }

    renderer.render(scene, camera);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [onGameOver, onScoreUpdate]);

  const startGame = useCallback(() => {
    playerRef.current = { x: 0, y: 0 };
    targetRef.current = { x: 0, y: 0 };
    speedRef.current = SPEED_INITIAL;
    scoreRef.current = 0;
    aliveRef.current = true;
    clockRef.current.start();
    cameraRef.current?.position.set(0, 0, 5);

    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
    }
    spawnTimerRef.current = setInterval(spawnObstacle, SPAWN_INTERVAL_MS);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop, spawnObstacle]);

  const resetGame = useCallback(() => {
    stopGame();
    clearObstacles();
  }, [clearObstacles, stopGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: window.devicePixelRatio < 2,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.6;
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.022);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 200);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    buildTunnel(scene);
    buildLights(scene);
    buildParticles(scene);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      stopGame();
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!touchRef.current) return;
      const sens = 0.022;
      const dx = e.touches[0].clientX - touchRef.current.x;
      const dy = e.touches[0].clientY - touchRef.current.y;
      targetRef.current.x = Math.max(
        -PLAYER_BOUNDARY,
        Math.min(PLAYER_BOUNDARY, targetRef.current.x + dx * sens),
      );
      targetRef.current.y = Math.max(
        -PLAYER_BOUNDARY,
        Math.min(PLAYER_BOUNDARY, targetRef.current.y - dy * sens),
      );
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      touchRef.current = null;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!aliveRef.current) return;
      targetRef.current.x =
        (e.clientX / window.innerWidth - 0.5) * 2 * PLAYER_BOUNDARY * 0.8;
      targetRef.current.y =
        -(e.clientY / window.innerHeight - 0.5) * 2 * PLAYER_BOUNDARY * 0.8;
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
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    renderer.render(scene, camera);

    return () => {
      stopGame();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('webglcontextlost', onContextLost);

      sceneRef.current?.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
        if (obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      sceneRef.current?.clear();
      rendererRef.current?.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
    };
  }, [buildLights, buildParticles, buildTunnel, canvasRef, clearObstacles, stopGame]);

  return { startGame, resetGame };
}
