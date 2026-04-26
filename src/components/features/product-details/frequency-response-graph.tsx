'use client';

import { useCallback, useRef, useState } from 'react';
import { cn } from '~/lib/utils';

/**
 * FrequencyResponseGraph — SVG frequency response curve visualization
 *
 * Matches product_detail.png tab "Frequency Graph".
 * Pure SVG — no D3 runtime dependency.
 *
 * Features:
 * - Log X-axis (20Hz–20kHz), linear Y-axis (dB SPL)
 * - Primary curve: gold (primary token)
 * - Comparison curve: tertiary token
 * - Hover crosshair + tooltip
 * - Region labels: Bass / Mids / Treble / Air
 */

export type FreqPoint = [number, number]; // [Hz, dB]

export interface FrequencyResponseGraphProps {
  data: FreqPoint[];
  productName?: string;
  compareData?: FreqPoint[];
  compareName?: string;
  dbRange?: [number, number];
  className?: string;
}

// ── Log-scale math ─────────────────────────────────────────────────────────

const LOG_MIN = Math.log10(20);
const LOG_MAX = Math.log10(20000);

function freqToX(hz: number, width: number): number {
  return ((Math.log10(hz) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * width;
}

function dbToY(db: number, height: number, dbMin: number, dbMax: number): number {
  return height - ((db - dbMin) / (dbMax - dbMin)) * height;
}

function pointsToPath(data: FreqPoint[], W: number, H: number, dbMin: number, dbMax: number): string {
  if (data.length === 0) return '';
  return data
    .map(
      ([hz, db], i) => `${i === 0 ? 'M' : 'L'} ${freqToX(hz, W).toFixed(1)} ${dbToY(db, H, dbMin, dbMax).toFixed(1)}`,
    )
    .join(' ');
}

function pointsToArea(data: FreqPoint[], W: number, H: number, dbMin: number, dbMax: number): string {
  if (data.length === 0) return '';
  const line = pointsToPath(data, W, H, dbMin, dbMax);
  const lastX = freqToX(data[data.length - 1][0], W).toFixed(1);
  const firstX = freqToX(data[0][0], W).toFixed(1);
  return `${line} L ${lastX} ${H} L ${firstX} ${H} Z`;
}

// ── Static config ──────────────────────────────────────────────────────────

const GRID_FREQS = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
const FREQ_LABELS: Record<number, string> = {
  20: '20',
  50: '50',
  100: '100',
  200: '200',
  500: '500',
  1000: '1k',
  2000: '2k',
  5000: '5k',
  10000: '10k',
  20000: '20k',
};

const REGIONS = [
  { key: 'bass', label: 'Bass', from: 20, to: 250 },
  { key: 'mids', label: 'Mids', from: 250, to: 4000 },
  { key: 'treble', label: 'Treble', from: 4000, to: 12000 },
  { key: 'air', label: 'Air', from: 12000, to: 20000 },
] as const;

// Chart drawing area
const PAD = { top: 16, right: 16, bottom: 32, left: 36 };
const TOTAL_W = 600;
const TOTAL_H = 280;
const W = TOTAL_W - PAD.left - PAD.right;
const H = TOTAL_H - PAD.top - PAD.bottom;

// ── Sample curves (exported for testing) ──────────────────────────────────

export const SAMPLE_FLAT_CURVE: FreqPoint[] = [
  [20, 20],
  [30, 30],
  [40, 45],
  [50, 62],
  [63, 72],
  [80, 78],
  [100, 82],
  [125, 84],
  [160, 86],
  [200, 87],
  [250, 88],
  [315, 89],
  [400, 89],
  [500, 90],
  [630, 90],
  [800, 90],
  [1000, 90],
  [1250, 89],
  [1600, 88],
  [2000, 87],
  [2500, 86],
  [3150, 87],
  [4000, 88],
  [5000, 86],
  [6300, 84],
  [8000, 81],
  [10000, 79],
  [12500, 76],
  [16000, 72],
  [20000, 65],
];

export const SAMPLE_V_CURVE: FreqPoint[] = [
  [20, 22],
  [30, 34],
  [40, 50],
  [50, 66],
  [63, 76],
  [80, 82],
  [100, 85],
  [125, 86],
  [160, 87],
  [200, 86],
  [250, 85],
  [315, 83],
  [400, 82],
  [500, 81],
  [630, 80],
  [800, 80],
  [1000, 80],
  [1250, 80],
  [1600, 81],
  [2000, 82],
  [2500, 84],
  [3150, 86],
  [4000, 88],
  [5000, 87],
  [6300, 86],
  [8000, 84],
  [10000, 83],
  [12500, 81],
  [16000, 78],
  [20000, 72],
];

// ── dB grid values ─────────────────────────────────────────────────────────

const DB_STEP = 5;

// ── Component ──────────────────────────────────────────────────────────────

function FrequencyResponseGraph({
  data,
  productName = 'Primary',
  compareData,
  compareName = 'Comparison',
  dbRange = [70, 110],
  className,
}: FrequencyResponseGraphProps) {
  const [dbMin, dbMax] = dbRange;
  const svgRef = useRef<SVGSVGElement>(null);

  const dbGridValues = Array.from({ length: Math.floor((dbMax - dbMin) / DB_STEP) + 1 }, (_, i) => dbMin + i * DB_STEP);

  // ── Paths ────────────────────────────────────────────────────────────────
  const primaryPath = pointsToPath(data, W, H, dbMin, dbMax);
  const primaryArea = pointsToArea(data, W, H, dbMin, dbMax);
  const comparePath = compareData ? pointsToPath(compareData, W, H, dbMin, dbMax) : null;

  // ── Tooltip ──────────────────────────────────────────────────────────────
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    hz: number;
    db: number;
    compareDb?: number;
  } | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (TOTAL_W / rect.width) - PAD.left;
      if (mx < 0 || mx > W) {
        setTooltip(null);
        return;
      }

      const hz = 10 ** ((mx / W) * (LOG_MAX - LOG_MIN) + LOG_MIN);
      const nearest = data.reduce((a, b) => (Math.abs(b[0] - hz) < Math.abs(a[0] - hz) ? b : a));
      const cmpNear = compareData?.reduce((a, b) => (Math.abs(b[0] - hz) < Math.abs(a[0] - hz) ? b : a));

      setTooltip({
        x: freqToX(nearest[0], W) + PAD.left,
        y: dbToY(nearest[1], H, dbMin, dbMax) + PAD.top,
        hz: nearest[0],
        db: nearest[1],
        compareDb: cmpNear?.[1],
      });
    },
    [data, compareData, dbMin, dbMax],
  );

  const hzLabel = (hz: number) => (hz >= 1000 ? `${(hz / 1000).toFixed(1)}kHz` : `${hz}Hz`);

  return (
    <div data-slot="frequency-response-graph" className={cn('flex flex-col gap-3', className)}>
      {/* ── Legend — keyed by product name (stable) ── */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-5 rounded-full bg-primary" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">{productName}</span>
        </div>
        {compareData && (
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-5 rounded-full bg-tertiary" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
              {compareName}
            </span>
          </div>
        )}
      </div>

      {/* ── Chart ── */}
      <div className="relative w-full overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-low">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${TOTAL_W} ${TOTAL_H}`}
          className="w-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
          aria-label="Frequency response graph"
          role="img"
        >
          <defs>
            <linearGradient id="frg-gold-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.02" />
            </linearGradient>
            <clipPath id="frg-clip">
              <rect x={PAD.left} y={PAD.top} width={W} height={H} />
            </clipPath>
          </defs>

          <g transform={`translate(${PAD.left}, ${PAD.top})`}>
            {/* Region bands — keyed by region.key */}
            {REGIONS.map((r) => {
              const x1 = freqToX(r.from, W);
              const x2 = freqToX(r.to, W);
              return (
                <g key={r.key}>
                  <text
                    x={(x1 + x2) / 2}
                    y={H + 18}
                    textAnchor="middle"
                    fontSize={9}
                    fill="var(--color-outline-variant)"
                    fontFamily="monospace"
                    letterSpacing="0.08em"
                  >
                    {r.label.toUpperCase()}
                  </text>
                </g>
              );
            })}

            {/* dB grid lines — keyed by dB value */}
            {dbGridValues.map((db) => {
              const y = dbToY(db, H, dbMin, dbMax);
              return (
                <g key={`db-${db}`}>
                  <line
                    x1={0}
                    y1={y}
                    x2={W}
                    y2={y}
                    stroke="var(--color-surface-container-high)"
                    strokeWidth={0.5}
                    strokeDasharray={db % 10 === 0 ? undefined : '3 4'}
                  />
                  <text
                    x={-6}
                    y={y + 3.5}
                    textAnchor="end"
                    fontSize={8}
                    fill="var(--color-outline-variant)"
                    fontFamily="monospace"
                  >
                    {db}
                  </text>
                </g>
              );
            })}

            {/* Frequency grid lines — keyed by hz value */}
            {GRID_FREQS.map((hz) => {
              const x = freqToX(hz, W);
              return (
                <g key={`hz-${hz}`}>
                  <line x1={x} y1={0} x2={x} y2={H} stroke="var(--color-surface-container-high)" strokeWidth={0.5} />
                  <text
                    x={x}
                    y={H + 10}
                    textAnchor="middle"
                    fontSize={8}
                    fill="var(--color-outline-variant)"
                    fontFamily="monospace"
                  >
                    {FREQ_LABELS[hz]}
                  </text>
                </g>
              );
            })}

            {/* Area fill */}
            <path d={primaryArea} fill="url(#frg-gold-area)" clipPath="url(#frg-clip)" />

            {/* Comparison curve */}
            {comparePath && (
              <path
                d={comparePath}
                fill="none"
                stroke="var(--color-tertiary)"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.7}
                clipPath="url(#frg-clip)"
              />
            )}

            {/* Primary curve */}
            <path
              d={primaryPath}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              clipPath="url(#frg-clip)"
            />

            {/* Tooltip crosshair */}
            {tooltip && (
              <g>
                <line
                  x1={tooltip.x - PAD.left}
                  y1={0}
                  x2={tooltip.x - PAD.left}
                  y2={H}
                  stroke="var(--color-primary)"
                  strokeWidth={0.5}
                  strokeDasharray="3 3"
                  opacity={0.5}
                />
                <circle cx={tooltip.x - PAD.left} cy={tooltip.y - PAD.top} r={3} fill="var(--color-primary)" />
              </g>
            )}
          </g>
        </svg>

        {/* Tooltip overlay */}
        {tooltip && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-outline-variant bg-surface-container/95 px-2.5 py-1.5 shadow-lg backdrop-blur-sm"
            /*
             * Inline style required: tooltip position is dynamically calculated
             * from mouse coordinates — cannot be expressed as static Tailwind classes.
             */
            style={{
              left: `${Math.min((tooltip.x / TOTAL_W) * 100, 75)}%`,
              top: `${Math.max((tooltip.y / TOTAL_H) * 100 - 16, 4)}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <p className="font-mono text-[10px] text-on-surface-variant">{hzLabel(tooltip.hz)}</p>
            <p className="font-mono text-[11px] font-medium text-primary">{tooltip.db}dB</p>
            {tooltip.compareDb !== undefined && (
              <p className="font-mono text-[11px] font-medium text-tertiary">{tooltip.compareDb}dB</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { FrequencyResponseGraph };
