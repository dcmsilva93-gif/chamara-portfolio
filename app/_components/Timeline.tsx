'use client';
import {motion, useReducedMotion, useScroll, useSpring} from 'framer-motion';
import {useRef} from 'react';
import type {Job} from '@/lib/content';

/* Career timeline whose spine fills as the reader scrolls through it —
   the progression is the point, so the motion follows the reading. */
export default function Timeline({jobs}: {jobs: Job[]}) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const {scrollYProgress} = useScroll({target: ref, offset: ['start 75%', 'end 60%']});
  const fill = useSpring(scrollYProgress, {stiffness: 120, damping: 30, mass: 0.4});

  return (
    <ol className="timeline" ref={ref}>
      <span className="timeline-track" aria-hidden />
      <motion.span className="timeline-fill" aria-hidden style={{scaleY: reduce ? 1 : fill}} />
      {jobs.map((j, i) => {
        const current = /present/i.test(j.period);
        return (
          <li key={i} className={current ? 'tl-item current' : 'tl-item'}>
            <span className="tl-node" aria-hidden />
            <p className="tl-period">{j.period}</p>
            <div className="tl-body">
              <h3>{j.role}</h3>
              <p className="tl-company">{j.company}</p>
              <p className="tl-desc">{j.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
