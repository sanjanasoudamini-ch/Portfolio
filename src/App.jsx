import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Intro", "Case Studies", "Responsible AI", "PM Work", "Analytics", "Why AI PM"];

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
}

function Tag({ children, color = "bg-gray-100 text-gray-800 font-bold" }) {
  return <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${color}`}>{children}</span>;
}

function SectionLabel({ children, color = "bg-gray-100 text-gray-700" }) {
  return <span className={`inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 ${color}`}>{children}</span>;
}

const BUBBLES = [
  { label: "Leader", emoji: "🏆", size: 110, color: "bg-violet-100 border-violet-300 text-violet-700", x: 50, y: 45 },
  { label: "Communicative", emoji: "💬", size: 125, color: "bg-blue-100 border-blue-300 text-blue-700", x: 18, y: 30 },
  { label: "Time Management", emoji: "⏱️", size: 105, color: "bg-emerald-100 border-emerald-300 text-emerald-700", x: 78, y: 22 },
  { label: "Writer", emoji: "✍️", size: 92, color: "bg-pink-100 border-pink-300 text-pink-700", x: 28, y: 68 },
  { label: "Photographer", emoji: "📷", size: 100, color: "bg-amber-100 border-amber-300 text-amber-700", x: 65, y: 72 },
  { label: "Travel Lover", emoji: "✈️", size: 115, color: "bg-teal-100 border-teal-300 text-teal-700", x: 88, y: 58 },
  { label: "Curious Mind", emoji: "🔭", size: 90, color: "bg-indigo-100 border-indigo-300 text-indigo-700", x: 8, y: 58 },
];

function BubbleChart() {
  const [hovered, setHovered] = useState(null);
  const [positions, setPositions] = useState(BUBBLES.map(b => ({ x: b.x, y: b.y })));
  const animRef = useRef(null);
  const velRef = useRef(BUBBLES.map(() => ({ vx: (Math.random() - 0.5) * 0.035, vy: (Math.random() - 0.5) * 0.035 })));
  useEffect(() => {
    const animate = () => {
      setPositions(prev => prev.map((pos, i) => {
        if (hovered === i) return pos;
        let nx = pos.x + velRef.current[i].vx;
        let ny = pos.y + velRef.current[i].vy;
        const hw = (BUBBLES[i].size / 2) / 6.5, hh = (BUBBLES[i].size / 2) / 3.5;
        if (nx < hw || nx > 100 - hw) { velRef.current[i].vx *= -1; nx = Math.max(hw, Math.min(100 - hw, nx)); }
        if (ny < hh || ny > 100 - hh) { velRef.current[i].vy *= -1; ny = Math.max(hh, Math.min(100 - hh, ny)); }
        return { x: nx, y: ny };
      }));
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [hovered]);
  return (
    <div className="relative w-full rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white overflow-hidden" style={{ height: 400 }}>
      {BUBBLES.map((b, i) => (
        <div key={b.label} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
          className={`absolute flex flex-col items-center justify-center rounded-full border-2 cursor-pointer select-none ${b.color} ${hovered === i ? "scale-110 shadow-xl z-10" : "shadow-sm z-0"}`}
          style={{ width: b.size, height: b.size, left: `calc(${positions[i].x}% - ${b.size / 2}px)`, top: `calc(${positions[i].y}% - ${b.size / 2}px)`, transition: "transform 0.2s, box-shadow 0.2s" }}>
          <span className="text-xl mb-0.5">{b.emoji}</span>
          <span className="text-xs font-bold text-center px-2 leading-tight">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

function ExpandableProject({ title, subtitle, tags, summary, githubUrl, tableauUrl, dataSources, outputs, code }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("code");
  return (
    <FadeIn>
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        {/* Header */}
        <div className="bg-gray-900 px-7 py-5 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{subtitle}</p>
            <h3 className="text-white font-black text-xl">{title}</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {tags.map(t => <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-gray-200">{t}</span>)}
          </div>
        </div>

        {/* Summary + links */}
        <div className="p-7">
          <p className="text-gray-600 text-sm leading-relaxed mb-5">{summary}</p>
          <div className="flex flex-wrap gap-3 mb-5">
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-700 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                GitHub
              </a>
            )}
            {tableauUrl && (
              <a href={tableauUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-50 transition">
                Tableau Public
              </a>
            )}
            <button onClick={() => setOpen(!open)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-50 transition ml-auto">
              {open ? "Collapse" : "Expand: Code, Data & Outputs"}
              <svg className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Expandable content */}
          {open && (
            <div className="border-t border-gray-100 pt-6">
              {/* Tabs */}
              <div className="flex gap-2 mb-5 border-b border-gray-100 pb-3">
                {["code", "data", "outputs"].map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${tab === t ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}>
                    {t === "code" ? "Code" : t === "data" ? "Data Sources" : "Outputs"}
                  </button>
                ))}
              </div>

              {/* Code tab */}
              {tab === "code" && (
                <div className="bg-gray-950 rounded-2xl overflow-x-auto">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-500 text-xs ml-2 font-mono">analysis.py / analysis.sql</span>
                  </div>
                  <pre className="text-green-400 text-xs leading-relaxed p-5 font-mono overflow-x-auto whitespace-pre">{code}</pre>
                </div>
              )}

              {/* Data sources tab */}
              {tab === "data" && (
                <div className="flex flex-col gap-3">
                  {dataSources.map(({ name, desc }) => (
                    <div key={name} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <p className="font-black text-gray-900 text-sm mb-1">{name}</p>
                      <p className="text-gray-500 text-sm">{desc}</p>
                    </div>
                  ))}
                  <p className="text-xs text-gray-400 mt-2">Repos coming soon — upload to GitHub and replace the link above.</p>
                </div>
              )}

              {/* Outputs tab */}
              {tab === "outputs" && (
                <div className="flex flex-col gap-3">
                  {outputs.map((o, i) => (
                    <div key={i} className="flex gap-3 items-start bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-gray-600 text-sm leading-relaxed">{o}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

export default function App() {
  const [active, setActive] = useState("Intro");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const idMap = {
    "Intro": "intro",
    "Case Studies": "casestudy",
    "Responsible AI": "responsibleai",
    "PM Work": "pmwork",
    "Analytics": "analytics",
    "Why AI PM": "whyaipm"
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (label) => {
    setMenuOpen(false);
    document.getElementById(idMap[label])?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const sections = Object.values(idMap).map(id => document.getElementById(id));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const label = Object.keys(idMap).find(k => idMap[k] === e.target.id);
          if (label) setActive(label);
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(s => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bg-[#fafafa] text-gray-900 min-h-screen font-sans antialiased">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <span className="font-black text-base tracking-tight text-gray-900">Sanjana Cheripelly</span>
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(n => (
              <button key={n} onClick={() => scrollTo(n)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${active === n ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}>
                {n}
              </button>
            ))}
            <a href="https://linkedin.com/in/sanjana-soudamini" target="_blank" rel="noopener noreferrer"
              className="ml-3 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition">LinkedIn</a>
          </div>
          <button className="lg:hidden text-gray-500" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-100 px-6 py-4 flex flex-col gap-2 shadow-lg">
            {NAV_LINKS.map(n => <button key={n} onClick={() => scrollTo(n)} className="text-left py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">{n}</button>)}
          </div>
        )}
      </nav>

      {/* 1. INTRO */}
      <section id="intro" className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 pt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-violet-200/40 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-200/30 blur-[100px]" />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, #c4b5fd 1px, transparent 1px)", backgroundSize: "44px 44px", opacity: 0.2 }} />
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 text-sm text-gray-600 font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available for new opportunities
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-4">
              AI Product Manager
            </h1>
            <p className="text-gray-400 font-medium text-xl md:text-2xl mb-6">GenAI and LLM Product Development</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-3 leading-relaxed">
              6+ years shipping data-driven products across marketplace, healthcare, and enterprise domains. Specialized in responsible AI frameworks including model evals, hallucination detection, and human-in-the-loop design.
            </p>
            <p className="text-gray-400 text-sm mb-10 font-medium">ex-Airbnb · Cotiviti · University of Colorado Denver</p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <a href="https://linkedin.com/in/sanjana-soudamini" target="_blank" rel="noopener noreferrer"
                className="px-6 py-3 border-2 border-blue-200 text-blue-600 font-semibold rounded-full hover:border-blue-400 hover:bg-blue-50 transition flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                LinkedIn
              </a>
              <a href="https://github.com/sanjanasoudamini-ch" target="_blank" rel="noopener noreferrer"
                className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-full hover:border-gray-400 hover:bg-gray-100 transition flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                GitHub
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[["6+", "Years in Product"], ["$2.1M+", "Revenue Impact"], ["25+", "Experiments Run"], ["180K+", "Users Impacted"]].map(([num, label]) => (
                <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="text-2xl font-black text-gray-900">{num}</div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. CASE STUDIES */}
      <section id="casestudy" className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <SectionLabel>Featured Case Study</SectionLabel>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900">Independent Case Study</h2>
              <p className="text-gray-500 mt-3 text-lg">AI-Powered Feature Design · Self-Directed</p>
            </div>
          </FadeIn>

          {/* Spotify themed card */}
          <FadeIn delay={0.1}>
            <div className="rounded-3xl overflow-hidden mb-8 border border-gray-200">
              {/* Spotify green/black header */}
              <div className="bg-black px-8 py-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-[#1DB954] text-xs font-bold uppercase tracking-widest mb-1">Independent Case Study · AI Product Design</p>
                  <h3 className="text-white text-2xl font-black">Spotify AI DJ — Feature Spec and Eval Design</h3>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["GenAI", "LLM", "Responsible AI"].map(t => (
                    <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30">{t}</span>
                  ))}
                </div>
              </div>
              <div className="p-8 grid md:grid-cols-2 gap-6 bg-white">
                {[
                  { label: "Context", content: "Spotify's AI DJ feature uses an LLM to generate personalized spoken commentary between songs, simulating a human radio host. The PM challenge: how do you evaluate a feature where 'good' is inherently subjective and a confidently wrong output (a DJ speaking about a song the user hates) breaks the illusion entirely?" },
                  { label: "Constraint", content: "LLM outputs cannot be exhaustively tested pre-launch. The system must handle low-confidence scenarios gracefully, maintain tone consistency across 100M+ users, and avoid hallucinated artist facts, all in real time with latency constraints under 800ms." },
                  { label: "Options Considered", content: "Option A: Rule-based scripting with zero hallucination risk but poor personalization. Option B: Full LLM generation with rich personalization but high hallucination surface. Option C (chosen): Constrained LLM generation within a structured template with fact-checked artist data and human fallback triggers." },
                  { label: "Decision", content: "Constrained generation with a 3-layer eval stack: (1) factual grounding check against Spotify's internal knowledge graph, (2) tone classifier to catch off-brand outputs, (3) confidence threshold — outputs below 0.72 cosine similarity to user taste profile route to a safe generic template." },
                  { label: "Outcome", content: "Projected 18% lift in DJ feature session completion. Hallucination rate on artist facts reduced from ~12% (baseline unguarded LLM) to under 1.5% in simulation. Human fallback triggered in ~8% of sessions — acceptable given the UX is invisible to users." },
                  { label: "What I'd Do Differently", content: "I'd build a longitudinal user trust model — not just session metrics. If a user hears one wrong DJ fact, the trust decay likely extends 3-5 sessions beyond the incident. That needs its own measurement framework, not just per-session CSAT." },
                ].map(({ label, content }) => (
                  <div key={label} className="rounded-2xl p-5 border border-gray-100 bg-gray-50">
                    <h4 className="font-black text-gray-900 text-sm uppercase tracking-wider mb-3">{label}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
                  </div>
                ))}
              </div>
              <div className="px-8 pb-8 bg-white">
                <a href="https://github.com/sanjanasoudamini-ch" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-[#1DB954] text-sm font-bold rounded-full hover:bg-gray-900 transition border border-[#1DB954]/40">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                  View Full Spec on GitHub
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. RESPONSIBLE AI */}
      <section id="responsibleai" className="py-28 px-6 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <SectionLabel>Model Evaluation</SectionLabel>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900">Responsible AI</h2>
              <p className="text-gray-500 mt-3 text-lg max-w-2xl mx-auto">My framework for shipping probabilistic features responsibly</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              { title: "Defining Good Enough to Ship", content: "For probabilistic features, I define ship criteria across three axes: (1) Accuracy floor — minimum precision/recall on held-out eval set stratified by user segment, not just aggregate; (2) Failure mode audit — every failure type catalogued by severity and frequency; (3) Human parity threshold — does the AI perform better than the current non-AI baseline on the metric that actually matters to users, not the proxy metric we can measure easily." },
              { title: "Low-Confidence Fallback Design", content: "When model confidence drops below threshold, the product should degrade gracefully, not fail visibly. My design pattern: confidence score to routing layer to (high) full AI output, (medium) AI output with human review flag, (low) rule-based fallback or skip. The key insight: users tolerate absence better than confident wrongness. A blank DJ commentary is less trust-breaking than a DJ who gets the artist wrong." },
              { title: "Handling Wrong-but-Confident Outputs", content: "This is the hardest failure mode. My approach: (1) Red-team the model with adversarial inputs before launch, specifically inputs where the model is likely to hallucinate confidently; (2) Build a post-hoc monitoring pipeline that flags outputs where user behavior diverges sharply from predicted engagement (proxy for confident-wrong); (3) Establish a rollback SLA — if confident-wrong rate exceeds X% in production, auto-disable the feature and page oncall." },
              { title: "Eval Stack and Model Cards", content: "At Cotiviti, I governed a SAFe sprint backlog with HIPAA/CMS compliance requirements baked into acceptance criteria. I applied the same rigor to AI: model cards documenting training data lineage, known failure modes, and demographic performance gaps. Evals ran on stratified slices — not just aggregate accuracy — to catch disparate impact before it reaches production." },
            ].map(({ title, content }) => (
              <FadeIn key={title} delay={0.1}>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 h-full">
                  <h3 className="font-black text-gray-900 text-lg mb-4">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Precision/Recall */}
          <FadeIn delay={0.2}>
            <div className="bg-white border border-gray-200 rounded-3xl p-8">
              <h3 className="font-black text-gray-900 text-xl mb-2">Precision vs. Recall Trade-off</h3>
              <p className="text-gray-500 text-sm mb-6">How I frame this decision for non-technical stakeholders</p>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: "Optimize Precision", desc: "Fewer recommendations, all high-confidence. Best for high-stakes outputs such as medical or financial. Cost: you miss real opportunities.", badge: "Low volume, high trust" },
                  { label: "Balance Both", desc: "Tune threshold to business context. Run A/B test at P=0.65, P=0.75, P=0.85 and measure downstream business metric, not just model metric.", badge: "Recommended default" },
                  { label: "Optimize Recall", desc: "Catch everything, accept more noise. Best for content discovery and search. Cost: user fatigue from irrelevant outputs.", badge: "High volume, lower trust" },
                ].map(({ label, desc, badge }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <span className="text-xs font-black px-2 py-1 rounded-full bg-gray-200 text-gray-800">{badge}</span>
                    <h4 className="font-black text-gray-900 mt-3 mb-2">{label}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. PM WORK */}
      <section id="pmwork" className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <SectionLabel>PM Experience</SectionLabel>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900">Core PM Case Studies</h2>
            </div>
          </FadeIn>
          <div className="flex flex-col gap-6">
            {[
              {
                company: "Airbnb", role: "Product Analyst", period: "Jul 2021 – Aug 2024",
                title: "INR Dynamic Pricing Intelligence",
                tags: ["Pricing", "GTM", "A/B Testing", "SQL"],
                story: [
                  { step: "Context", text: "India hosts lacked real-time pricing signals calibrated to local demand. They were underpricing during peak periods and over-pricing during low seasons, leaving $2M+ in annual booking revenue on the table across the India market." },
                  { step: "Constraint", text: "INR pricing logic had to integrate with India's GST regulatory framework and could not conflict with existing global pricing infrastructure. Regulatory compliance was non-negotiable and legal review added 3 weeks to every sprint." },
                  { step: "Decision", text: "Led competitive analysis across 8 local OTA players, quantitative research with 60 host sessions, and designed an A/B test across 100K-user cohorts. Shipped a localized dynamic pricing suggestion widget that nudged hosts toward demand-optimal prices without removing host control." },
                  { step: "Outcome", text: "$2.1M incremental booking revenue in 6 months. 40,000 new host accounts adopted the feature across 12 cities within 18 months. Compliance risk for 180K active hosts reduced by embedding GST logic directly into the payment flow." },
                ],
              },
              {
                company: "Cotiviti", role: "Technical Product Owner", period: "Jun 2025 – Aug 2025",
                title: "Healthcare Claims Processing Automation",
                tags: ["HIPAA", "SAFe", "Healthcare", "Backlog Governance"],
                story: [
                  { step: "Context", text: "A claims processing backlog of 38 user stories across 2 engineering squads with HIPAA and CMS compliance requirements baked into every acceptance criterion. Post-release defect rates were eating into delivery capacity." },
                  { step: "Constraint", text: "Every feature spec had to pass HIPAA compliance review. Any data schema change required CMS sign-off. This created a 2 to 3 week delay on any story touching claims data, and nearly every story touched claims data." },
                  { step: "Decision", text: "Authored FRD-level technical specifications for a claims-processing automation module. Used risk-adjusted scope management to separate compliance-critical paths from non-critical enhancements, parallelizing delivery without adding compliance risk." },
                  { step: "Outcome", text: "Compressed delivery by 3 weeks. Post-release defects capped at fewer than 2 production issues per sprint. UAT protocols and regression test cases established for 3 healthcare analytics platform features." },
                ],
              },
              {
                company: "Ouranos", role: "Product Analyst", period: "Apr 2019 – Jun 2021",
                title: "B2B SaaS Experimentation Framework",
                tags: ["Experimentation", "Retention", "PostgreSQL", "Mixpanel"],
                story: [
                  { step: "Context", text: "45 enterprise clients on a B2B SaaS platform. Onboarding drop-off was highest in the first 72 hours. Users who did not activate a core feature within 3 days had 4x higher 30-day churn." },
                  { step: "Constraint", text: "Enterprise clients meant A/B testing was politically sensitive. Any degraded experience to a $200K ARR account required sign-off. We could not run pure random assignment." },
                  { step: "Decision", text: "Built a cohort-based experimentation framework using PostgreSQL and Mixpanel. Segmented by account size and activation stage and ran treatment on SMB accounts first, using results to build the business case for enterprise rollout." },
                  { step: "Outcome", text: "Identified onboarding drop-off patterns across 25K+ user journeys annually. Retention patterns across 8+ platform capabilities identified. 4 major platform releases delivered within committed timelines." },
                ],
              },
            ].map((cs, idx) => (
              <FadeIn key={cs.title} delay={idx * 0.1}>
                <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="bg-gray-900 px-7 py-5 flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{cs.company} · {cs.role} · {cs.period}</p>
                      <h3 className="text-white font-black text-xl mt-0.5">{cs.title}</h3>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {cs.tags.map(t => <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-gray-200">{t}</span>)}
                    </div>
                  </div>
                  <div className="p-7 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {cs.story.map(({ step, text }) => (
                      <div key={step} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-xs font-black uppercase tracking-wider mb-2 text-gray-900">{step}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ANALYTICS */}
      <section id="analytics" className="py-28 px-6 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <SectionLabel>Analytics and Experimentation</SectionLabel>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900">Analytics Work</h2>
              <p className="text-gray-500 mt-3 text-base max-w-xl mx-auto">Click any project to expand code, data sources, and outputs.</p>
            </div>
          </FadeIn>

          <div className="flex flex-col gap-6 mb-8">
            <ExpandableProject
              title="Supply Chain Spend Visibility Dashboard"
              subtitle="Tableau Public · SQL · Python"
              tags={["SQL", "Python", "Tableau", "Pandas"]}
              summary="Synthesized 10K+ shipment records to surface cost per shipment, billing accuracy, and audit flags. Built automated KPI alerts to replace manual spreadsheet review — reducing reporting time by 3 weeks."
              githubUrl="https://github.com/sanjanasoudamini-ch"
              tableauUrl="https://public.tableau.com"
              dataSources={[
                { name: "Shipment Records CSV", desc: "10,000+ rows of transportation spend data including carrier, route, cost, and billing status fields." },
                { name: "Audit Exception Log", desc: "Flagged records where billed amount deviated from contracted rate by more than 5%." },
                { name: "Cost Rate Table", desc: "Reference table mapping carrier and route to standard contracted rates for validation." },
              ]}
              outputs={[
                "Tableau dashboard with 4 KPI views: cost per shipment, billing accuracy rate, audit flag count, and monthly trend.",
                "Python pipeline automating data cleaning, outlier detection, and CSV-to-dashboard refresh.",
                "Audit exception report identifying top 3 cost anomaly patterns for remediation.",
                "Projected reduction in manual audit effort across operational reviews.",
              ]}
              code={`# Supply Chain Spend Analysis Pipeline
import pandas as pd
import numpy as np

# Load shipment data
df = pd.read_csv('shipment_records.csv')

# Clean and standardize
df['ship_date'] = pd.to_datetime(df['ship_date'])
df['cost'] = pd.to_numeric(df['cost'], errors='coerce')
df.dropna(subset=['cost', 'carrier', 'route'], inplace=True)

# Calculate cost per shipment by carrier
cost_by_carrier = (
    df.groupby('carrier')
    .agg(
        total_cost=('cost', 'sum'),
        shipment_count=('shipment_id', 'count'),
        avg_cost=('cost', 'mean')
    )
    .round(2)
    .reset_index()
    .sort_values('avg_cost', ascending=False)
)

# Flag billing anomalies (>5% deviation from contracted rate)
df = df.merge(rate_table, on=['carrier', 'route'], how='left')
df['deviation_pct'] = abs(df['cost'] - df['contracted_rate']) / df['contracted_rate'] * 100
df['audit_flag'] = df['deviation_pct'] > 5

# Summary stats
print(f"Total shipments: {len(df):,}")
print(f"Audit flags: {df['audit_flag'].sum():,} ({df['audit_flag'].mean()*100:.1f}%)")
print(f"Avg cost per shipment: ${df['cost'].mean():,.2f}")

# Export for Tableau
df.to_csv('shipment_cleaned.csv', index=False)
cost_by_carrier.to_csv('cost_by_carrier.csv', index=False)`}
            />

            <ExpandableProject
              title="Wayfair Product Search Irrelevance"
              subtitle="GitHub · SQL · Python · NLP"
              tags={["SQL", "Python", "Tableau", "NLP", "WANDS Dataset"]}
              summary="Curated the Wayfair WANDS dataset (42,994 products), resolving catalog inconsistencies affecting discoverability. Diagnosed search relevance gaps across 480 customer queries and visualized catalog quality KPIs exposing user-intent mismatches across 15+ product categories."
              githubUrl="https://github.com/sanjanasoudamini-ch"
              tableauUrl="https://public.tableau.com"
              dataSources={[
                { name: "Wayfair WANDS Dataset", desc: "Public dataset with 42,994 products, 480 customer queries, and 233,448 query-product relevance judgments. Source: github.com/wayfair/WANDS" },
                { name: "Product Catalog CSV", desc: "Product attributes including category, name, description, and structured attributes across 15+ furniture and home categories." },
                { name: "Query-Product Relevance Labels", desc: "Human-annotated relevance judgments: Exact, Partial, or Irrelevant for each query-product pair." },
              ]}
              outputs={[
                "SQL pipeline standardizing 42,994 product catalog records and resolving 1,200+ attribute inconsistencies.",
                "Relevance gap analysis across 480 queries, identifying top categories with highest irrelevance rates.",
                "Tableau dashboard visualizing catalog quality KPIs: relevance rate by category, attribute completeness score, and query coverage.",
                "Findings memo documenting 3 root causes of search irrelevance with remediation recommendations.",
              ]}
              code={`-- Wayfair WANDS: Search Relevance Gap Analysis

-- Step 1: Load and standardize product catalog
CREATE TABLE products_clean AS
SELECT
    product_id,
    LOWER(TRIM(product_name)) AS product_name,
    LOWER(TRIM(category)) AS category,
    COALESCE(attribute_1, 'unknown') AS material,
    COALESCE(attribute_2, 'unknown') AS color,
    CHAR_LENGTH(product_description) AS desc_length
FROM products_raw
WHERE product_name IS NOT NULL;

-- Step 2: Join with relevance judgments
SELECT
    q.query_text,
    p.category,
    r.relevance_label,
    COUNT(*) AS pair_count,
    ROUND(
        SUM(CASE WHEN r.relevance_label = 'Irrelevant' THEN 1 ELSE 0 END) * 100.0
        / COUNT(*), 2
    ) AS irrelevance_rate_pct
FROM relevance_judgments r
JOIN queries q ON r.query_id = q.query_id
JOIN products_clean p ON r.product_id = p.product_id
GROUP BY q.query_text, p.category, r.relevance_label
ORDER BY irrelevance_rate_pct DESC;

-- Step 3: Identify top 10 worst-performing categories
SELECT
    category,
    COUNT(*) AS total_pairs,
    ROUND(AVG(CASE WHEN relevance_label = 'Irrelevant' THEN 1.0 ELSE 0 END) * 100, 1)
        AS avg_irrelevance_pct
FROM relevance_judgments r
JOIN products_clean p ON r.product_id = p.product_id
GROUP BY category
HAVING COUNT(*) > 50
ORDER BY avg_irrelevance_pct DESC
LIMIT 10;`}
            />
          </div>

          {/* Funnel walkthrough */}
          <FadeIn delay={0.2}>
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <h3 className="font-black text-gray-900 text-xl mb-2">How I Diagnose a Booking Funnel Drop-off</h3>
              <p className="text-gray-400 text-sm mb-8">A walkthrough of my analytical process from symptom to root cause to decision</p>
              <div className="flex flex-col md:flex-row gap-0">
                {[
                  { step: "1", label: "Spot the Signal", desc: "Weekly KPI review in Looker shows booking conversion drops 14% on mobile. Not a data pipeline issue. Amplitude event tracking confirms real drop." },
                  { step: "2", label: "Segment and Isolate", desc: "SQL cohort analysis: drop is concentrated in new users (under 7 days) on iOS 17. Returning users unaffected. Points to a UI regression, not product-market fit." },
                  { step: "3", label: "Quantify Impact", desc: "Funnel analysis in Python (Pandas): 62% of new mobile users drop at payment step. At current traffic, that is approximately $180K per week in lost GMV. Escalation-worthy." },
                  { step: "4", label: "Decide and Ship", desc: "Reproduced bug in iOS 17 payment sheet. Hotfix prioritized above sprint backlog. Shipped in 48h. Post-fix A/B confirms full recovery. Wrote RCA and blameless postmortem." },
                ].map(({ step, label, desc }, i, arr) => (
                  <div key={step} className="flex items-start md:items-stretch flex-1">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-black">{step}</span>
                        <h4 className="font-black text-gray-900 text-sm">{label}</h4>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
                    </div>
                    {i < arr.length - 1 && <div className="hidden md:flex items-center px-2 text-gray-300 text-xl">→</div>}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 6. WHY AI PM */}
      <section id="whyaipm" className="py-28 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <SectionLabel>Perspective</SectionLabel>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900">Why AI Product Management</h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="bg-gray-900 rounded-3xl p-10 text-white mb-8">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                I came to AI PM the long way, through analytics. Six years of SQL queries, A/B tests, and funnel analyses taught me one thing that I think most AI PMs miss: <strong className="text-white">the model is not the product. The user's trust in the model is the product.</strong>
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                When I worked on Airbnb's pricing features, the hardest problem was not building the algorithm. It was getting hosts to act on its suggestions. A host who does not trust the recommendation ignores it, and the whole system degrades. The same dynamic applies 10x harder with LLMs, where outputs are less predictable and the failure modes are more visible.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                What draws me to this space is that it requires holding two contradictory ideas simultaneously: moving fast enough to stay relevant, and being disciplined enough to know when not to ship. That tension is where good AI PMs earn their value.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-7 mb-16">
              <h3 className="font-black text-gray-900 mb-3">The open question I am still working through</h3>
              <p className="text-gray-700 leading-relaxed">
                How do you build user trust in a system that is right 95% of the time but confidently wrong the other 5%?
                The math says ship it. But trust does not follow the math. One memorable wrong output can undo 50 correct ones.
                I do not have a clean answer yet, which is part of why I find this space worth spending time in.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mb-16">
              <h3 className="font-black text-gray-900 text-2xl mb-2 text-center">Beyond the Resume</h3>
              <p className="text-gray-400 text-sm text-center mb-8">Hover the bubbles</p>
              <BubbleChart />
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="text-center">
              <h3 className="font-black text-gray-900 text-2xl mb-3">Let's Talk</h3>
              <p className="text-gray-500 mb-8">Open to AI PM, product analytics, and senior PM roles. I respond within 2 days.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="mailto:sanjanacheripelly45@gmail.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-700 transition shadow-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  sanjanacheripelly45@gmail.com
                </a>
                <a href="https://linkedin.com/in/sanjana-soudamini" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-200 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  LinkedIn
                </a>
                <a href="https://github.com/sanjanasoudamini-ch" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-full hover:bg-gray-100 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                  GitHub
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white py-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Sanjana Cheripelly · AI Product Manager
      </footer>
    </div>
  );
}
