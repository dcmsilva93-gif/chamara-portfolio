'use client';
import {motion, useReducedMotion} from 'framer-motion';
import {ArrowUpRight, Linkedin, Menu, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import type {Portfolio} from '@/lib/content';
import RoasCurve from './_components/RoasCurve';
import CountUp from './_components/CountUp';
import Timeline from './_components/Timeline';

const sections = [
  {id: 'about', label: 'About'},
  {id: 'work', label: 'Work'},
  {id: 'experience', label: 'Experience'},
  {id: 'perspectives', label: 'Perspectives'},
  {id: 'writing', label: 'Writing'},
];

// Content in the CMS is often typed in capitals; render it in sentence case.
const sentence = (s: string) => {
  const t = s.trim();
  return t === t.toUpperCase() ? (t.charAt(0) + t.slice(1).toLowerCase()).replace(/\bi\b/g, 'I') : t;
};

function useActiveSection() {
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const els = sections.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      {rootMargin: '-45% 0px -50% 0px'}
    );
    els.forEach(el => io.observe(el));
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      if (window.scrollY < window.innerHeight * 0.5) setActive('');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  return {active, scrolled};
}

function Headline({text}: {text: string}) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  return (
    <h1 className="hero-title" aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden>
          <span className="word-mask">
            <motion.span
              className="word"
              initial={reduce ? false : {y: '105%'}}
              animate={{y: '0%'}}
              transition={{duration: 0.9, delay: 0.08 + i * 0.045, ease: [0.22, 1, 0.36, 1]}}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h1>
  );
}

export default function PortfolioPage({content: c}: {content: Portfolio}) {
  const [menu, setMenu] = useState(false);
  const {active, scrolled} = useActiveSection();
  const reduce = useReducedMotion();
  const link = c.linkedin;
  const articlesPage = link.replace(/\/+$/, '') + '/recent-activity/articles/';
  const articles = (c.articles ?? []).filter(a => a.title && a.url);
  const roles = c.eyebrow.split(/[·|•]/).map(sentence).filter(Boolean);
  const fadeIn = (delay: number) =>
    reduce ? {} : {initial: {opacity: 0, y: 12}, animate: {opacity: 1, y: 0}, transition: {duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const}};

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className={scrolled ? 'nav scrolled' : 'nav'}>
        <a href="#top" className="nav-name">{c.name}</a>
        <nav className={menu ? 'nav-links open' : 'nav-links'} aria-label="Sections">
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} onClick={() => setMenu(false)} aria-current={active === s.id ? 'true' : undefined}>
              {s.label}
              {active === s.id && <motion.span layoutId="nav-mark" className="nav-mark" transition={{type: 'spring', stiffness: 500, damping: 40}} />}
            </a>
          ))}
        </nav>
        <a className="btn btn-small" href={link} target="_blank" rel="noopener noreferrer">
          <Linkedin size={15} aria-hidden /> LinkedIn
        </a>
        <button className="menu-btn" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu(!menu)}>
          {menu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <main id="main">
        <section id="top" className="hero">
          <div className="hero-copy">
            <Headline text={c.headline} />
            <motion.p className="hero-intro" {...fadeIn(0.55)}>{c.intro}</motion.p>
            <motion.div className="hero-actions" {...fadeIn(0.7)}>
              <a className="btn btn-primary" href="#work">See selected work</a>
              <a className="btn btn-ghost" href={link} target="_blank" rel="noopener noreferrer">
                Connect on LinkedIn <ArrowUpRight size={16} aria-hidden />
              </a>
            </motion.div>
            <motion.ul className="roles" {...fadeIn(0.85)} aria-label="Focus areas">
              {roles.map(r => <li key={r}>{r}</li>)}
            </motion.ul>
          </div>
          <motion.div
            className="hero-photo"
            initial={reduce ? false : {clipPath: 'inset(100% 0 0 0)'}}
            animate={{clipPath: 'inset(0% 0 0 0)'}}
            transition={{duration: 1.2, delay: 0.15, ease: [0.76, 0, 0.24, 1]}}
          >
            <img src="/chamara-profile.jpg" alt={`${c.name} at his desk`} />
          </motion.div>
          <div className="hero-chart">
            <RoasCurve />
          </div>
        </section>

        <section className="impact" aria-labelledby="impact-h">
          <h2 id="impact-h" className="visually-hidden">Impact</h2>
          <dl className="metrics">
            {c.metrics.map((m, i) => (
              <div className="metric" key={i}>
                <dt className="metric-label">{m.label}</dt>
                <dd className="metric-value"><CountUp value={m.value} /></dd>
                <dd className="metric-detail">{m.detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="about" className="section about">
          <div className="about-text">
            <h2>Strategy with a business mindset</h2>
            <p className="lead">{c.about}</p>
            <a className="text-link" href={link} target="_blank" rel="noopener noreferrer">
              Read more on LinkedIn <ArrowUpRight size={16} aria-hidden />
            </a>
          </div>
          <div className="about-skills">
            <h3>What I bring to a team</h3>
            <ul className="skills">
              {c.expertise.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        </section>

        <section id="work" className="section work">
          <div className="section-head">
            <h2>Selected work</h2>
            <p>Campaigns and initiatives where strategy, technology and execution came together.</p>
          </div>
          <ul className="projects">
            {c.projects.map((p, i) => (
              <li className="project" key={i} tabIndex={0}>
                <p className="project-cat">{sentence(p.category)}</p>
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.description}</p>
                <p className="project-outcome">{p.outcome}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="experience" className="section experience">
          <div className="section-head sticky">
            <h2>Built across industries</h2>
            <p>Banking, FMCG, e-commerce and multi-brand leadership. Each role added a different way of seeing growth.</p>
          </div>
          <Timeline jobs={c.jobs} />
        </section>

        <section id="perspectives" className="perspectives">
          <div className="section">
            <h2>Perspectives</h2>
            <div className="views">
              {c.insights.map((it, i) => (
                <blockquote className="view" key={i}>
                  <p className="view-tag">{sentence(it.tag)}</p>
                  <p className="view-title">{it.title}</p>
                  <p className="view-desc">{it.description}</p>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="writing" className="section writing">
          <div className="section-head">
            <h2>Writing</h2>
            <p>
              {articles.length
                ? 'Longer pieces on performance, digital strategy and where marketing is heading, published on LinkedIn.'
                : 'I write about performance marketing, digital strategy and where marketing is heading. My articles live on LinkedIn.'}
            </p>
          </div>
          {articles.length > 0 && (
            <ul className="articles">
              {articles.map((a, i) => (
                <li key={i}>
                  <a className="article" href={a.url} target="_blank" rel="noopener noreferrer">
                    <span className="article-date">{a.date}</span>
                    <span className="article-main">
                      <span className="article-title">{a.title}</span>
                      {a.summary && <span className="article-summary">{a.summary}</span>}
                    </span>
                    <span className="article-go" aria-hidden><ArrowUpRight size={22} /></span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <a className={articles.length ? 'text-link writing-all' : 'btn btn-ghost writing-all'} href={articlesPage} target="_blank" rel="noopener noreferrer">
            {articles.length ? 'All articles on LinkedIn' : 'Read my articles on LinkedIn'} <ArrowUpRight size={16} aria-hidden />
          </a>
        </section>

        <section className="section connect">
          <h2>Great ideas begin with a conversation.</h2>
          <p>I’m always glad to swap perspectives, explore what’s possible and meet people who care about meaningful impact.</p>
          <a className="btn btn-primary btn-large" href={link} target="_blank" rel="noopener noreferrer">
            <Linkedin size={18} aria-hidden /> Connect on LinkedIn
          </a>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} {c.name}</span>
        <a href="#top">Back to top</a>
      </footer>
    </>
  );
}
