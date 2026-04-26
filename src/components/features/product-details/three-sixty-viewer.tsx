'use client';

import { RotateCcwIcon as DragHintIcon, LayersIcon as ExplodeViewIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cn } from '~/lib/utils';

/**
 * ThreeSixtyViewer — Interactive 3D product viewer
 *
 * Matches product_detail.png tab "360 View":
 * - OrbitControls drag-to-rotate
 * - ASSEMBLED ↔ EXPLODED VIEW toggle slider
 * - Thumbnail strip (Next Image)
 *
 * Three.js is dynamically imported to keep initial bundle small.
 * Thumbnails use next/image for optimised delivery.
 * Inline style on the explode slider: native <input type="range"> accent
 * color cannot be set via Tailwind without a plugin — commented below.
 */

interface ThreeSixtyViewerProps {
  modelUrl?: string;
  posterUrl?: string;
  thumbnails?: { src: string; alt?: string }[];
  productName?: string;
  className?: string;
}

function ThreeSixtyViewer({
  modelUrl,
  posterUrl,
  thumbnails = [],
  productName = 'Product',
  className,
}: ThreeSixtyViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<unknown>(null);
  const sceneRef = useRef<unknown>(null);
  const cameraRef = useRef<unknown>(null);
  const controlsRef = useRef<unknown>(null);
  const meshGroupRef = useRef<unknown>(null);
  const rafRef = useRef<number>(0);
  const explodeTargetRef = useRef<number>(0);

  const [explodeValue, setExplodeValue] = useState(0);
  const [isLoading, setIsLoading] = useState(!!modelUrl);
  const [webglError, setWebglError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState<string | null>(thumbnails[0]?.src ?? null);

  // ── Init Three.js ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!modelUrl || !mountRef.current) return;
    let cancelled = false;

    async function init() {
      if (!modelUrl) return;

      try {
        const THREE = await import('three');
        const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
        const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');

        if (cancelled || !mountRef.current) return;

        const container = mountRef.current;
        const W = container.clientWidth;
        const H = container.clientHeight;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
        camera.position.set(0, 0.5, 2.5);
        cameraRef.current = camera;

        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const key = new THREE.DirectionalLight(0xffffff, 1.2);
        key.position.set(2, 3, 2);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xf2ca50, 0.3); // gold fill light
        fill.position.set(-2, 1, -1);
        scene.add(fill);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enablePan = false;
        controls.minDistance = 1.5;
        controls.maxDistance = 4;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
        controlsRef.current = controls;
        controls.addEventListener('start', () => {
          controls.autoRotate = false;
          setIsDragging(true);
        });
        controls.addEventListener('end', () => setIsDragging(false));

        const loader = new GLTFLoader();
        loader.load(
          modelUrl,
          (gltf: { scene: unknown }) => {
            if (cancelled) return;
            const group = gltf.scene as import('three').Group;
            const box = new THREE.Box3().setFromObject(group);
            group.position.sub(box.getCenter(new THREE.Vector3()));
            scene.add(group);
            meshGroupRef.current = group;
            setIsLoading(false);
          },
          undefined,
          () => {
            if (!cancelled) setIsLoading(false);
          },
        );

        const animate = () => {
          if (cancelled) return;
          rafRef.current = requestAnimationFrame(animate);

          const group = meshGroupRef.current as import('three').Group | null;
          group?.traverse((child) => {
            const mesh = child as import('three').Mesh;
            if (!mesh.isMesh) return;
            const ud = mesh.userData as { origin?: import('three').Vector3 };
            if (!ud.origin) ud.origin = mesh.position.clone();
            const dir = ud.origin.clone().normalize();
            const target = ud.origin.clone().add(dir.multiplyScalar(explodeTargetRef.current * 0.5));
            mesh.position.lerp(target, 0.08);
          });

          (controlsRef.current as { update(): void })?.update();
          (rendererRef.current as import('three').WebGLRenderer).render(
            sceneRef.current as import('three').Scene,
            cameraRef.current as import('three').Camera,
          );
        };
        animate();
      } catch {
        if (!cancelled) setWebglError(true);
      }
    }

    init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      const r = rendererRef.current as { dispose(): void; domElement: HTMLElement } | null;
      r?.dispose();
      r?.domElement.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelUrl]);

  // ── Explode slider ────────────────────────────────────────────────────────
  const handleExplode = (v: number) => {
    setExplodeValue(v);
    explodeTargetRef.current = v;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div data-slot="three-sixty-viewer" className={cn('flex flex-col gap-3', className)}>
      {/* Main viewer */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-low">
        {/* Three.js mount */}
        {modelUrl && !webglError && <div ref={mountRef} className="absolute inset-0" />}

        {/* Poster / static fallback */}
        {posterUrl && (!modelUrl || webglError) && (
          <Image
            src={posterUrl}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-container-low">
            <div className="size-8 animate-spin rounded-full border-2 border-surface-container-high border-t-primary" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-outline-variant">Loading model…</span>
          </div>
        )}

        {/* Drag hint */}
        {!isLoading && !webglError && modelUrl && (
          <div
            className={cn(
              'absolute bottom-3 left-1/2 -translate-x-1/2',
              'flex items-center gap-1.5 rounded-full border border-outline-variant bg-background/70 px-3 py-1 backdrop-blur-sm',
              'transition-opacity duration-300',
              isDragging ? 'opacity-0' : 'opacity-100',
            )}
          >
            <DragHintIcon className="size-3 text-outline-brand" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-outline-brand">Drag to Rotate</span>
          </div>
        )}

        {/* WebGL unavailable */}
        {webglError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-mono text-[11px] text-outline-variant">WebGL unavailable</p>
          </div>
        )}
      </div>

      {/* Assembled / Exploded toggle */}
      {modelUrl && !webglError && (
        <div className="flex items-center gap-3 rounded-lg border border-surface-container-high bg-surface-container-low px-3 py-2">
          <ExplodeViewIcon className="size-3.5 shrink-0 text-primary" />

          <span
            className={cn(
              'font-mono text-[9px] uppercase tracking-widest transition-colors duration-200',
              explodeValue < 0.5 ? 'text-primary' : 'text-outline-variant',
            )}
          >
            Assembled
          </span>

          {/*
           * Inline style on accent-color: Tailwind v4 does not expose
           * accent-{color} utilities for arbitrary CSS custom properties
           * without a plugin. Native range accent requires this one-off.
           */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={explodeValue}
            onChange={(e) => handleExplode(parseFloat(e.target.value))}
            className="flex-1"
            style={{ accentColor: 'var(--color-primary)' }}
            aria-label="Explode view intensity"
          />

          <span
            className={cn(
              'font-mono text-[9px] uppercase tracking-widest transition-colors duration-200',
              explodeValue >= 0.5 ? 'text-primary' : 'text-outline-variant',
            )}
          >
            Exploded View
          </span>
        </div>
      )}

      {/* Thumbnail strip — keyed by src (stable, unique per product) */}
      {thumbnails.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {thumbnails.map(({ src, alt }) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveThumb(src)}
              className={cn(
                'relative size-16 shrink-0 overflow-hidden rounded-lg border transition-all duration-200',
                activeThumb === src
                  ? 'border-primary/60 ring-1 ring-primary/30'
                  : 'border-surface-container-high hover:border-outline-variant',
              )}
              aria-label={alt ?? `${productName} view`}
              aria-pressed={activeThumb === src}
            >
              <Image src={src} alt={alt ?? `${productName} view`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { ThreeSixtyViewer };
