'use client';

import {
  SlidersHorizontalIcon as EqControlsIcon,
  Volume2Icon as NoSampleIcon,
  PauseIcon as PausePlaybackIcon,
  PlayIcon as StartPlaybackIcon,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Slider } from '~/components/ui/slider';
import { cn } from '~/lib/utils';

/**
 * VirtualSandbox — Web Audio API EQ simulator
 *
 * Matches product_detail.png right panel:
 * - Visualizer canvas (AnalyserNode → rAF)
 * - LOW / MID / HIGH EQ sliders with dB readout
 * - Preset buttons
 * - Play/pause sample audio with live EQ
 *
 * No inline styles — canvas drawing uses imperative API (unavoidable for
 * canvas 2D context), all DOM elements use Tailwind tokens.
 */

interface EqValues {
  low: number; // –12 to +12 dB
  mid: number;
  high: number;
}

export interface VirtualSandboxProps {
  sampleUrl?: string;
  defaultEq?: Partial<EqValues>;
  presets?: { label: string; eq: EqValues }[];
  className?: string;
}

const DEFAULT_PRESETS: { label: string; eq: EqValues }[] = [
  { label: 'Flat', eq: { low: 0, mid: 0, high: 0 } },
  { label: 'V-Shape', eq: { low: 4, mid: -3, high: 4 } },
  { label: 'Warm', eq: { low: 3, mid: 1, high: -2 } },
  { label: 'Treble+', eq: { low: -1, mid: 0, high: 5 } },
  { label: 'Mid-Forward', eq: { low: -1, mid: 4, high: -1 } },
];

const BAR_COUNT = 18;

const EQ_BANDS = [
  { band: 'low' as const, label: 'LOW' },
  { band: 'mid' as const, label: 'MID' },
  { band: 'high' as const, label: 'HIGH' },
];

function formatDb(v: number): string {
  return `${v > 0 ? '+' : ''}${v}dB`;
}

// Static bar heights for paused visualizer — defined outside component (stable)
const STATIC_BAR_HEIGHTS = [
  0.2, 0.3, 0.5, 0.6, 0.55, 0.7, 0.8, 0.75, 0.65, 0.7, 0.6, 0.5, 0.55, 0.4, 0.35, 0.3, 0.2, 0.15,
];

function VirtualSandbox({ sampleUrl, defaultEq, presets = DEFAULT_PRESETS, className }: VirtualSandboxProps) {
  const [eq, setEq] = useState<EqValues>({
    low: defaultEq?.low ?? 0,
    mid: defaultEq?.mid ?? 0,
    high: defaultEq?.high ?? 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>('Flat');

  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const lowFilterRef = useRef<BiquadFilterNode | null>(null);
  const midFilterRef = useRef<BiquadFilterNode | null>(null);
  const highFilterRef = useRef<BiquadFilterNode | null>(null);
  const rafRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);

  // ── Apply EQ gains reactively ──────────────────────────────────────────
  useEffect(() => {
    if (lowFilterRef.current) lowFilterRef.current.gain.value = eq.low;
    if (midFilterRef.current) midFilterRef.current.gain.value = eq.mid;
    if (highFilterRef.current) highFilterRef.current.gain.value = eq.high;
  }, [eq]);

  // ── Init AudioContext (lazy — first play) ──────────────────────────────
  // biome-ignore lint/correctness/useExhaustiveDependencies: eq values intentionally omitted — init runs once, gains applied via useEffect
  const initAudio = useCallback(async () => {
    if (ctxRef.current || !sampleUrl) return;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const low = ctx.createBiquadFilter();
    low.type = 'lowshelf';
    low.frequency.value = 250;
    low.gain.value = eq.low;

    const mid = ctx.createBiquadFilter();
    mid.type = 'peaking';
    mid.frequency.value = 1000;
    mid.Q.value = 1;
    mid.gain.value = eq.mid;

    const high = ctx.createBiquadFilter();
    high.type = 'highshelf';
    high.frequency.value = 4000;
    high.gain.value = eq.high;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;

    low.connect(mid);
    mid.connect(high);
    high.connect(analyser);
    analyser.connect(ctx.destination);

    lowFilterRef.current = low;
    midFilterRef.current = mid;
    highFilterRef.current = high;
    analyserRef.current = analyser;

    try {
      const res = await fetch(sampleUrl);
      const arr = await res.arrayBuffer();
      bufferRef.current = await ctx.decodeAudioData(arr);
    } catch {
      console.warn('[VirtualSandbox] Failed to load audio sample.');
    }
  }, [sampleUrl]);

  // ── Play / Pause ───────────────────────────────────────────────────────
  const togglePlay = useCallback(async () => {
    await initAudio();
    const ctx = ctxRef.current;
    if (!ctx || !bufferRef.current) return;

    if (isPlaying) {
      offsetRef.current = (ctx.currentTime - startTimeRef.current) % bufferRef.current.duration;
      sourceRef.current?.stop();
      sourceRef.current = null;
      setIsPlaying(false);
    } else {
      if (!lowFilterRef.current) return;
      if (ctx.state === 'suspended') await ctx.resume();
      const src = ctx.createBufferSource();
      src.buffer = bufferRef.current;
      src.loop = true;
      src.connect(lowFilterRef.current);
      src.start(0, offsetRef.current);
      startTimeRef.current = ctx.currentTime - offsetRef.current;
      sourceRef.current = src;
      setIsPlaying(true);
    }
  }, [isPlaying, initAudio]);

  // ── Canvas draw — static bars (paused) ────────────────────────────────
  const drawStaticBars = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    const barW = canvas.width / BAR_COUNT - 2;
    STATIC_BAR_HEIGHTS.forEach((h, i) => {
      const barH = Math.max(3, h * canvas.height);
      ctx2d.fillStyle = 'rgba(77,70,53,0.5)';
      ctx2d.beginPath();
      ctx2d.roundRect(i * (barW + 2), canvas.height - barH, barW, barH, 2);
      ctx2d.fill();
    });
  }, []);

  // ── Canvas draw — live bars (playing) ─────────────────────────────────
  const drawLiveBars = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);

    const barW = canvas.width / BAR_COUNT - 2;
    for (let i = 0; i < BAR_COUNT; i++) {
      const sample = data[Math.floor((i / BAR_COUNT) * data.length)] / 255;
      const barH = Math.max(3, sample * canvas.height);
      const x = i * (barW + 2);
      const y = canvas.height - barH;

      // Gold gradient — canvas imperative API, no DOM inline style
      const grad = ctx2d.createLinearGradient(0, y, 0, canvas.height);
      grad.addColorStop(0, 'rgba(242,202,80,0.9)');
      grad.addColorStop(0.6, 'rgba(212,175,55,0.7)');
      grad.addColorStop(1, 'rgba(60,47,0,0.3)');
      ctx2d.fillStyle = grad;

      ctx2d.beginPath();
      ctx2d.roundRect(x, y, barW, barH, 2);
      ctx2d.fill();
    }
    rafRef.current = requestAnimationFrame(drawLiveBars);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(drawLiveBars);
    } else {
      cancelAnimationFrame(rafRef.current);
      drawStaticBars();
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, drawLiveBars, drawStaticBars]);

  // Draw static bars on mount
  useEffect(() => {
    drawStaticBars();
  }, [drawStaticBars]);

  // ── Cleanup ────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      sourceRef.current?.stop();
      ctxRef.current?.close();
    };
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────
  const updateBand = (band: keyof EqValues, v: number) => {
    setEq((prev) => ({ ...prev, [band]: v }));
    setActivePreset(null);
  };

  const applyPreset = (preset: { label: string; eq: EqValues }) => {
    setEq(preset.eq);
    setActivePreset(preset.label);
  };

  const resetEq = () => {
    setEq({ low: 0, mid: 0, high: 0 });
    setActivePreset('Flat');
  };

  const dbValueClasses = useMemo(
    () => ({
      low: eq.low > 0 ? 'text-primary' : eq.low < 0 ? 'text-tertiary' : 'text-outline-variant',
      mid: eq.mid > 0 ? 'text-primary' : eq.mid < 0 ? 'text-tertiary' : 'text-outline-variant',
      high: eq.high > 0 ? 'text-primary' : eq.high < 0 ? 'text-tertiary' : 'text-outline-variant',
    }),
    [eq],
  );

  return (
    <div
      data-slot="virtual-sandbox"
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-surface-container-high bg-surface-container p-4',
        className,
      )}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EqControlsIcon className="size-4 text-primary" strokeWidth={1.5} />
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-on-surface">
            Virtual Sandbox
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">
          Acoustic Profile
        </span>
      </div>

      {/* ── Visualizer canvas ── */}
      <canvas
        ref={canvasRef}
        width={320}
        height={56}
        className="w-full rounded-lg bg-surface-container-low"
        aria-label="Frequency visualizer"
      />

      {/* ── EQ Sliders ── */}
      <div className="flex flex-col gap-3">
        {EQ_BANDS.map(({ band, label }) => (
          <div key={band} className="flex items-center gap-3">
            <span className="w-8 font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
              {label}
            </span>
            <Slider
              className="flex-1"
              min={-12}
              max={12}
              step={1}
              value={[eq[band]]}
              onValueChange={([v]) => updateBand(band, v)}
              aria-label={`${label} EQ gain`}
            />
            <span className={cn('w-9 text-right font-mono text-[10px] font-medium tabular-nums', dbValueClasses[band])}>
              {formatDb(eq[band])}
            </span>
          </div>
        ))}
      </div>

      {/* ── Preset buttons — keyed by label (stable string) ── */}
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => applyPreset(preset)}
            className={cn(
              'rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider',
              'transition-all duration-200 ease-out outline-none',
              'focus-visible:ring-1 focus-visible:ring-primary/40',
              activePreset === preset.label
                ? 'border-primary/50 bg-primary/10 text-primary'
                : 'border-surface-container-high bg-transparent text-outline-variant hover:border-outline-variant hover:text-outline-brand',
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* ── Play controls ── */}
      <div className="flex items-center justify-between border-t border-surface-container-high pt-3">
        {sampleUrl ? (
          <button
            type="button"
            onClick={togglePlay}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-1.5',
              'font-mono text-[10px] uppercase tracking-widest',
              'transition-all duration-200 ease-out outline-none',
              'focus-visible:ring-1 focus-visible:ring-primary/40',
              isPlaying
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-surface-container-high bg-transparent text-outline-brand hover:border-outline-variant hover:text-on-surface-variant',
            )}
            aria-label={isPlaying ? 'Pause sample' : 'Play sample'}
          >
            {isPlaying ? <PausePlaybackIcon className="size-3" /> : <StartPlaybackIcon className="size-3" />}
            {isPlaying ? 'Pause' : 'Preview'}
          </button>
        ) : (
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-outline-variant">
            <NoSampleIcon className="size-3" />
            No sample
          </span>
        )}

        <button
          type="button"
          onClick={resetEq}
          className="font-mono text-[10px] uppercase tracking-wider text-outline-variant underline underline-offset-2 hover:text-on-surface-variant transition-colors duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export { VirtualSandbox, type EqValues };
