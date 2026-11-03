'use client';
import {animate, useInView, useReducedMotion} from 'framer-motion';
import {useEffect, useRef, useState} from 'react';

/* Counts the numeric part of a metric ("7+", "15+", "40×") up to its real value
   the first time it is seen. Non-numeric values ("Gold") are shown as-is. */
export default function CountUp({value}: {value: string}) {
  const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, {once: true, amount: 0.6});
  const reduce = useReducedMotion();
  const target = m ? parseFloat(m[2]) : 0;
  const decimals = m && m[2].includes('.') ? m[2].split('.')[1].length : 0;
  const [n, setN] = useState(m && !reduce ? 0 : target);

  useEffect(() => {
    if (!m || !seen || reduce) return;
    const c = animate(0, target, {duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: v => setN(v)});
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, reduce, target]);

  if (!m) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden>{m[1]}{n.toFixed(decimals)}{m[3]}</span>
    </span>
  );
}
