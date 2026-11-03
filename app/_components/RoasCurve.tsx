'use client';
import {animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion} from 'framer-motion';
import {useEffect, useMemo, useRef, useState} from 'react';

/*
  The hero's one orchestrated moment: the 1stop.lk return-on-ad-spend story
  (0.25 → 10) drawn as a live line. Start and end values come from the CV;
  the path between them is an illustrative shape, and the caption says so.
*/
const W = 1000, H = 240, PAD_T = 24, PAD_B = 28, MAX = 11;
const START = 0.25, END = 10;

function series(n = 28) {
  // deterministic, gently noisy S-curve from START to END
  const pts: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const s = 1 / (1 + Math.exp(-9 * (t - 0.52)));
    const s0 = 1 / (1 + Math.exp(9 * 0.52)), s1 = 1 / (1 + Math.exp(-9 * 0.48));
    const norm = (s - s0) / (s1 - s0);
    const wobble = i === 0 || i === n - 1 ? 0 : Math.sin(i * 2.3) * 0.28 * Math.min(1, t * 3);
    pts.push(Math.max(0.15, START + (END - START) * norm + wobble));
  }
  return pts;
}

const y = (v: number) => PAD_T + (1 - v / MAX) * (H - PAD_T - PAD_B);

export default function RoasCurve() {
  const reduce = useReducedMotion();
  const data = useMemo(() => series(), []);
  const xs = data.map((_, i) => (i / (data.length - 1)) * W);
  const d = data.map((v, i) => `${i ? 'L' : 'M'}${xs[i].toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${d} L${W},${H - PAD_B} L0,${H - PAD_B} Z`;

  const progress = useMotionValue(reduce ? 1 : 0);
  const [drawn, setDrawn] = useState(reduce ? 1 : 0);
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (reduce) return;
    const c = animate(progress, 1, {duration: 2.6, delay: 0.5, ease: [0.65, 0, 0.35, 1]});
    return () => c.stop();
  }, [progress, reduce]);
  useMotionValueEvent(progress, 'change', v => setDrawn(v));

  // value at current draw position (for the live readout)
  const idxF = drawn * (data.length - 1);
  const i0 = Math.floor(idxF), i1 = Math.min(data.length - 1, i0 + 1);
  const live = data[i0] + (data[i1] - data[i0]) * (idxF - i0);
  const shown = hover !== null ? data[hover] : live;
  const hx = hover !== null ? xs[hover] : drawn * W;
  const hy = hover !== null ? y(data[hover]) : y(live);
  const done = drawn >= 0.999;

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!done || !svgRef.current) return;
    const r = svgRef.current.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setHover(Math.round(t * (data.length - 1)));
  }
  function onKey(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    setHover(h => {
      const cur = h ?? data.length - 1;
      return Math.min(data.length - 1, Math.max(0, cur + (e.key === 'ArrowRight' ? 1 : -1)));
    });
  }

  const above = shown >= 1;
  return (
    <figure className="roas">
      <div className="roas-readout" aria-live="off">
        <span className="roas-value">{shown.toFixed(2)}<span className="roas-x">×</span></span>
        <span className="roas-caption">
          return on ad spend, 1stop.lk
          <span className={above ? 'roas-state up' : 'roas-state'}>{above ? 'profitable' : 'below break-even'}</span>
        </span>
      </div>
      <div className="roas-plot">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="roas-svg"
        role="img"
        tabIndex={0}
        aria-label="Return on ad spend rose from 0.25 to 10 after the conversion journey was rebuilt. Use left and right arrow keys to inspect the line."
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        onKeyDown={onKey}
        onBlur={() => setHover(null)}
      >
        <defs>
          <clipPath id="roas-reveal"><rect x="0" y="0" height={H} width={drawn * W} /></clipPath>
          <clipPath id="roas-above"><rect x="0" y="0" width={W} height={y(1)} /></clipPath>
          <linearGradient id="roas-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--cobalt)" stopOpacity=".18" />
            <stop offset="1" stopColor="var(--cobalt)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" x2={W} y1={y(1)} y2={y(1)} className="roas-breakeven" />
        <text x={W - 4} y={y(1) - 8} textAnchor="end" className="roas-axis">Break-even, 1×</text>
        <g clipPath="url(#roas-reveal)">
          <path d={area} fill="url(#roas-fill)" />
          <path d={d} className="roas-line base" vectorEffect="non-scaling-stroke" />
          <path d={d} className="roas-line hot" clipPath="url(#roas-above)" vectorEffect="non-scaling-stroke" />
        </g>
        <line x1={hx} x2={hx} y1={PAD_T - 10} y2={H - PAD_B} className="roas-cursor" style={{opacity: hover !== null || !done ? 1 : 0}} />
      </svg>
      {/* marker in HTML so it stays round under preserveAspectRatio=none */}
      <motion.span
        className={above ? 'roas-dot up' : 'roas-dot'}
        style={{left: `${(hx / W) * 100}%`, top: `${(hy / H) * 100}%`}}
        aria-hidden
      />
      </div>
      <figcaption className="roas-foot">
        <span>Before: 0.25×</span>
        <span className="roas-note">Retargeting, audience expansion and conversion tracking. Line shape is illustrative.</span>
        <span>After: 10×</span>
      </figcaption>
    </figure>
  );
}
