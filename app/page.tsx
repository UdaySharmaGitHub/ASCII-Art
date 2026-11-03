"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import ShowreelSection from "./showreel-section";

// ─── CONTENT ─────────────────────────────────────────────────────
const ASCII_HERO = `
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ░░
░░  ▒▒                     ▒▒  ░░
░░  ▒▒   ██  ░░░░░░  ██    ▒▒  ░░
░░  ▒▒   ██  ░░░░░░  ██    ▒▒  ░░
░░  ▒▒                     ▒▒  ░░
░░  ▒▒      ░░░░░░░░░      ▒▒  ░░
░░  ▒▒    ░░          ░░   ▒▒  ░░
░░  ▒▒   ░░  ████████  ░░  ▒▒  ░░
░░  ▒▒    ░░░░░░░░░░░░░░   ▒▒  ░░
░░  ▒▒                     ▒▒  ░░
░░  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
`.trim();

const MARQUEE_SEGMENTS = [
  "REAL·TIME 30FPS",
  "MEDIAPIPE AI",
  "11 CHAR SETS",
  "12 COLOR MODES",
  "SOBEL EDGE DETECT",
  "MATRIX RAIN",
  "WEBCAM FEED",
  "EXPORT PNG",
  "MIRROR MODE",
];
const MARQUEE_TEXT = MARQUEE_SEGMENTS.join("  ·  ") + "  ·  ";

const FEATURES = [
  {
    num: "01",
    title: "REAL-TIME 30FPS",
    desc: "Webcam feed converted to ASCII art at up to 30 frames per second with smooth FPS tracking.",
    dot: "#C6FF00",
  },
  {
    num: "02",
    title: "MEDIAPIPE AI",
    desc: "Body segmentation isolates you from the background — person and environment render in distinct character styles.",
    dot: "#60E0FF",
  },
  {
    num: "03",
    title: "11 CHARACTER SETS",
    desc: "Standard, Blocks, Binary, Braille, Matrix katakana, Dots, Slashes, Numbers — and more.",
    dot: "#BB44FF",
  },
  {
    num: "04",
    title: "12 COLOR MODES",
    desc: "Matrix green, Heatmap, Rainbow spectrum, Amber, Neon — or pull real colors directly from your video feed.",
    dot: "#FF3B5C",
  },
  {
    num: "05",
    title: "SOBEL EDGE MODE",
    desc: "Switch to edge detection — your silhouette renders as a glowing outline of characters.",
    dot: "#FFD700",
  },
];

// ─── LANDING PAGE ─────────────────────────────────────────────────
export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const ctaHeadlineRef = useRef<HTMLDivElement>(null);
  const ctaBgRef = useRef<HTMLDivElement>(null);
  const heroTiltRef = useRef<HTMLDivElement>(null);

  // ── GSAP motion system ───────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero title — character cascade with 3D flip
        const titleLines = titleRef.current?.querySelectorAll<HTMLElement>(".title-reveal");
        titleLines?.forEach((line, li) => {
          gsap.set(line, { opacity: 1 });
          const split = new SplitText(line, { type: "chars" });
          splits.push(split);
          gsap.from(split.chars, {
            opacity: 0,
            yPercent: 130,
            rotateX: -90,
            transformPerspective: 800,
            transformOrigin: "50% 100%",
            duration: 0.85,
            stagger: 0.045,
            ease: "expo.out",
            delay: 0.25 + li * 0.18,
          });
        });

        // Section heading wipe
        gsap.from(".section-heading", {
          opacity: 0,
          x: -28,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".section-heading", start: "top 88%", toggleActions: "play none none reverse" },
        });
        gsap.from(".section-rule", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.9,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".section-heading", start: "top 88%", toggleActions: "play none none reverse" },
        });

        // CTA headline — scroll-triggered character reveal
        const ctaLines = ctaHeadlineRef.current?.querySelectorAll<HTMLElement>(".cta-line");
        ctaLines?.forEach((line) => {
          const split = new SplitText(line, { type: "chars" });
          splits.push(split);
          gsap.from(split.chars, {
            opacity: 0,
            yPercent: 100,
            rotateX: -60,
            transformPerspective: 800,
            duration: 0.7,
            stagger: 0.02,
            ease: "expo.out",
            scrollTrigger: { trigger: ctaHeadlineRef.current, start: "top 80%", toggleActions: "play none none reverse" },
          });
        });

        // Parallax on the faint tiled ASCII background
        if (ctaBgRef.current) {
          gsap.fromTo(
            ctaBgRef.current,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: ctaBgRef.current.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        }

        // Nav — tighten + strengthen on scroll
        gsap.to(navRef.current, {
          paddingTop: 6,
          paddingBottom: 6,
          borderColor: "rgba(198,255,0,0.22)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: { start: "top -70", toggleActions: "play none none reverse" },
        });
      });
    }, rootRef);

    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  // ── Magnetic CTA button ──────────────────────────────────────
  useEffect(() => {
    const btn = ctaRef.current;
    if (!btn) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
      gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: "power2.out" });
    };
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });

    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => { btn.removeEventListener("mousemove", onMove); btn.removeEventListener("mouseleave", onLeave); };
  }, []);

  // ── Hero title 3D cursor-tilt ────────────────────────────────
  useEffect(() => {
    const el = heroTiltRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const mx = e.clientX / window.innerWidth - 0.5;
      const my = e.clientY / window.innerHeight - 0.5;
      rotY(mx * 12);
      rotX(-my * 12);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={rootRef}
      style={{
        background: "radial-gradient(ellipse at 50% -10%, rgba(198,255,0,0.055) 0%, #080810 50%)",
        color: "var(--fg)",
        fontFamily: "var(--font-barlow, system-ui, sans-serif)",
        minHeight: "100vh",
        overflowX: "clip",
        position: "relative",
      }}
    >
      {/* interactive ASCII field */}
      <AsciiField />

      {/* noise */}
      <div className="noise-overlay" />

      {/* ── FLOATING NAV ───────────────────────────────────── */}
      <nav
        ref={navRef}
        className="landing-nav"
        style={{
          position: "fixed",
          top: 18,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 52,
          padding: "9px 10px 9px 22px",
          background: "rgba(8,8,16,0.82)",
          border: "1px solid var(--border-subtle)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: 100,
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-mono, monospace)",
            fontSize: 11,
            color: "var(--accent)",
            letterSpacing: "0.2em",
            textShadow: "0 0 14px var(--accent-glow)",
          }}
        >
          ASCII·ART
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            href="/studio"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontFamily: "var(--font-barlow, system-ui)",
              fontWeight: 500,
              fontSize: 11,
              color: "rgba(242,242,242,0.45)",
              letterSpacing: "0.1em",
              textDecoration: "none",
              padding: "7px 16px",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 100,
              transition: "all 0.2s cubic-bezier(0.32,0.72,0,1)",
            }}
            onMouseEnter={(e) => {
              const t = e.currentTarget as HTMLAnchorElement;
              t.style.background = "var(--accent)";
              t.style.color = "#080810";
              t.style.borderColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget as HTMLAnchorElement;
              t.style.background = "transparent";
              t.style.color = "rgba(242,242,242,0.45)";
              t.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            LAUNCH STUDIO
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                background: "rgba(255,255,255,0.07)",
                borderRadius: "50%",
                fontSize: 11,
              }}
            >
              →
            </span>
          </Link>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="hero-grid">
        <div
          ref={titleRef}
          className="hero-title-col"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {/* 3D tilt group */}
          <div style={{ perspective: 1000 }}>
            <div ref={heroTiltRef} style={{ transformStyle: "preserve-3d" }}>
              {/* ASCII */}
              <div style={{ overflow: "hidden", lineHeight: 0.86, perspective: 800 }}>
                <div
                  className="title-reveal"
                  style={{
                    fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                    fontSize: "clamp(72px, 15vw, 220px)",
                    color: "var(--fg)",
                    letterSpacing: "0.02em",
                    display: "block",
                    opacity: 0,
                  }}
                >
                  ASCII
                </div>
              </div>

              {/* ART */}
              <div style={{ overflow: "hidden", lineHeight: 0.86, perspective: 800 }}>
                <div
                  className="title-reveal"
                  style={{
                    fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                    fontSize: "clamp(72px, 15vw, 220px)",
                    color: "var(--accent)",
                    letterSpacing: "0.02em",
                    textShadow: "0 0 60px rgba(198,255,0,0.3)",
                    display: "block",
                    opacity: 0,
                  }}
                >
                  ART
                </div>
              </div>
            </div>
          </div>

          {/* Accent rule */}
          <div style={{ width: 44, height: 2, background: "var(--accent)", opacity: 0.5, marginBottom: 24, marginTop: 32 }} />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            style={{
              fontSize: "clamp(14px, 1.15vw, 16px)",
              color: "rgba(242,242,242,0.42)",
              fontFamily: "var(--font-barlow, system-ui)",
              fontWeight: 300,
              letterSpacing: "0.03em",
              lineHeight: 1.75,
              marginBottom: 32,
              maxWidth: 420,
            }}
          >
            Your face. Your movement. Reimagined in ASCII.
            <br />
            <span
              style={{
                display: "inline-block",
                marginTop: 8,
                fontFamily: "var(--font-dm-mono, monospace)",
                fontSize: 10,
                color: "rgba(242,242,242,0.2)",
                letterSpacing: "0.16em",
              }}
            >
              REAL-TIME · MEDIAPIPE · 30FPS
            </span>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.35, ease: [0.32, 0.72, 0, 1] }}
          >
            <Link href="/studio" style={{ textDecoration: "none" }}>
              <button
                ref={ctaRef}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  background: "var(--accent)",
                  border: "none",
                  color: "#080810",
                  padding: "13px 16px 13px 28px",
                  cursor: "pointer",
                  fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                  fontSize: 17,
                  letterSpacing: "0.12em",
                  transition: "box-shadow 0.25s cubic-bezier(0.32,0.72,0,1), transform 0.25s cubic-bezier(0.32,0.72,0,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 32px rgba(198,255,0,0.45), 0 0 64px rgba(198,255,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                ENTER THE STUDIO
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 30,
                    height: 30,
                    background: "rgba(0,0,0,0.14)",
                    borderRadius: "50%",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  →
                </span>
              </button>
            </Link>
          </motion.div>

          {/* Stat row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            style={{
              marginTop: 40,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 24,
              fontFamily: "var(--font-dm-mono, monospace)",
              fontSize: 9,
              color: "rgba(255,255,255,0.24)",
              letterSpacing: "0.14em",
            }}
          >
            {["30 FPS", "11 SETS", "12 MODES", "MEDIAPIPE"].map((s, i) => (
              <span key={i} style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <span style={{ color: "var(--accent)", opacity: 0.45, fontSize: 7 }}>◆</span>
                {s}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2.2 }}
          style={{
            position: "absolute",
            bottom: 28,
            left: 56,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-dm-mono, monospace)",
            fontSize: 9,
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.16em",
          }}
        >
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
          SCROLL
        </motion.div>
      </section>

      {/* ── MARQUEE TICKER ─────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(198,255,0,0.025)",
          padding: "11px 0",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="marquee-track">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-dm-mono, monospace)",
                fontSize: 10,
                color: "rgba(198,255,0,0.38)",
                letterSpacing: "0.22em",
                whiteSpace: "nowrap",
                paddingRight: 56,
                userSelect: "none",
              }}
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES (editorial numbered list) ─────────────── */}
      <section className="features-grid">
        {/* Section heading */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 72,
          }}
        >
          <div
            className="section-heading"
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
              fontSize: "clamp(38px, 4.5vw, 64px)",
              color: "var(--fg)",
              lineHeight: 1,
            }}
          >
            CAPABILITIES
          </div>
          <div
            className="section-rule"
            style={{
              flex: 1,
              height: 1,
              background: "rgba(255,255,255,0.055)",
            }}
          />
        </div>

        {FEATURES.map((f) => (
          <FeatureRow key={f.num} feature={f} />
        ))}
      </section>

      {/* ── SHOWREEL (3D scroll-driven ribbon → grid) ──────── */}
      <ShowreelSection />

      {/* ── CREATOR ────────────────────────────────────────── */}
      <section className="creator-section">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{
            maxWidth: 520,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              border: "1px solid rgba(96,224,255,0.28)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "var(--cold)",
              textShadow: "0 0 14px var(--cold)",
              marginBottom: 18,
              animation: "eye-blink 4.5s ease-in-out infinite",
            }}
          >
            ◈
          </div>

          <div
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
              fontSize: 26,
              color: "var(--fg)",
              letterSpacing: "0.16em",
              marginBottom: 7,
            }}
          >
            UDAY SHARMA
          </div>

          <div
            style={{
              fontFamily: "var(--font-barlow, system-ui)",
              fontWeight: 300,
              fontSize: 11,
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.1em",
              lineHeight: 1.8,
              marginBottom: 24,
            }}
          >
            BUILT THIS PROJECT · CHECK OUT MORE ON GITHUB
          </div>

          <a
            href="https://github.com/UdaySharmaGitHub"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
              fontSize: 14,
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.16em",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "8px 20px",
              transition: "all 0.2s cubic-bezier(0.32,0.72,0,1)",
            }}
            onMouseEnter={(e) => {
              const t = e.currentTarget as HTMLAnchorElement;
              t.style.color = "var(--accent)";
              t.style.borderColor = "var(--accent)";
              t.style.textShadow = "0 0 12px var(--accent-glow)";
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget as HTMLAnchorElement;
              t.style.color = "rgba(255,255,255,0.28)";
              t.style.borderColor = "rgba(255,255,255,0.1)";
              t.style.textShadow = "none";
            }}
          >
            VIEW GITHUB →
          </a>
        </motion.div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────────── */}
      <section
        className="cta-section"
        style={{
          background: "radial-gradient(ellipse at 50% 110%, rgba(255,59,92,0.07) 0%, transparent 60%)",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        {/* faint tiled face in background (parallax) */}
        <div
          ref={ctaBgRef}
          aria-hidden
          style={{
            position: "absolute",
            inset: "-12% 0",
            overflow: "hidden",
            opacity: 0.032,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            willChange: "transform",
          }}
        >
          <pre
            style={{
              fontFamily: "var(--font-dm-mono, monospace)",
              fontSize: "clamp(5px, 0.8vw, 9px)",
              color: "var(--accent)",
              lineHeight: 1.2,
              userSelect: "none",
            }}
          >
            {Array(18).fill(ASCII_HERO).join("\n")}
          </pre>
        </div>

        <div ref={ctaHeadlineRef} style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-dm-mono, monospace)",
              fontSize: 10,
              color: "rgba(255,255,255,0.1)",
              letterSpacing: "0.22em",
              marginBottom: 28,
              userSelect: "none",
            }}
          >
            ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
          </div>

          <div
            className="cta-line"
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
              fontSize: "clamp(32px, 4.8vw, 68px)",
              color: "var(--fg)",
              letterSpacing: "0.06em",
              lineHeight: 1.08,
            }}
          >
            YOU ARE MADE OF CHARACTERS.
          </div>
          <div
            className="cta-line"
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
              fontSize: "clamp(32px, 4.8vw, 68px)",
              color: "var(--accent)",
              letterSpacing: "0.06em",
              lineHeight: 1.08,
              marginBottom: 52,
              textShadow: "0 0 48px rgba(198,255,0,0.22)",
            }}
          >
            LET US PROVE IT.
          </div>

          <Link href="/studio">
            <button
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.4)",
                padding: "13px 40px",
                cursor: "pointer",
                fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                fontSize: 17,
                letterSpacing: "0.18em",
                transition: "all 0.22s cubic-bezier(0.32,0.72,0,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
                e.currentTarget.style.textShadow = "0 0 14px var(--accent-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                e.currentTarget.style.textShadow = "none";
              }}
            >
              START NOW →
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer
        style={{
          textAlign: "center",
          padding: "18px",
          borderTop: "1px solid rgba(255,255,255,0.03)",
          fontFamily: "var(--font-dm-mono, monospace)",
          fontSize: 9,
          color: "rgba(255,255,255,0.09)",
          letterSpacing: "0.16em",
        }}
      >
        ASCII-ART · REAL-TIME ASCII CAMERA · MEDIAPIPE
      </footer>
    </div>
  );
}

// ─── INTERACTIVE ASCII FIELD ──────────────────────────────────────
function AsciiField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const RAMP = " ·.:-=+*#%▒▓█";
    const CELL = 20;
    let w = 0, h = 0, cols = 0, rows = 0, dpr = 1;

    const mouse = { x: -9999, y: -9999, active: false };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      ctx.font = `${CELL - 5}px var(--font-dm-mono, monospace)`;
      ctx.textBaseline = "top";
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);

    const R = 190; // spotlight radius
    let raf = 0;
    let last = 0;

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (t - last < 33) return; // ~30fps
      last = t;

      // drifting phantom spotlight until the user moves the cursor
      let sx = mouse.x, sy = mouse.y;
      if (!mouse.active) {
        sx = w * (0.5 + 0.32 * Math.sin(t * 0.00028));
        sy = h * (0.42 + 0.28 * Math.cos(t * 0.00037));
      }

      ctx.clearRect(0, 0, w, h);
      const tt = t * 0.0006;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * CELL;
          const y = r * CELL;

          // animated flow field
          const nx = c * 0.19;
          const ny = r * 0.23;
          let v = (Math.sin(nx + tt) + Math.cos(ny - tt) + Math.sin((nx + ny) * 0.5 + tt * 1.3)) / 3;
          v = (v + 1) / 2; // 0..1

          // cursor spotlight
          const dx = x - sx;
          const dy = y - sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const infl = Math.max(0, 1 - dist / R);

          const b = v * 0.42 + infl * infl * 1.4;
          if (b < 0.16) continue;

          const ci = Math.min(RAMP.length - 1, Math.max(1, Math.floor(b * RAMP.length)));

          if (infl > 0.05) {
            ctx.fillStyle = `rgba(198,255,0,${Math.min(0.92, 0.12 + infl * 0.85)})`;
          } else {
            ctx.fillStyle = `rgba(198,255,0,${0.04 + v * 0.055})`;
          }
          ctx.fillText(RAMP[ci], x, y);
        }
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        maskImage: "radial-gradient(ellipse 100% 85% at 50% 38%, #000 55%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 100% 85% at 50% 38%, #000 55%, transparent 100%)",
      }}
    />
  );
}

// ─── FEATURE ROW ──────────────────────────────────────────────────
function FeatureRow({ feature }: { feature: (typeof FEATURES)[0] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  // Scroll reveal
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const anim = gsap.from(row, {
      opacity: 0,
      x: -24,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: { trigger: row, start: "top 90%", toggleActions: "play none none reverse" },
    });
    return () => { anim.scrollTrigger?.kill(); anim.kill(); };
  }, []);

  const onEnter = () => {
    gsap.to(rowRef.current, { x: 12, duration: 0.4, ease: "power3.out" });
    gsap.to(numRef.current, { color: feature.dot, scale: 1.12, x: 4, duration: 0.4, ease: "power3.out" });
    gsap.to(dotRef.current, { scale: 1.8, duration: 0.4, ease: "back.out(2)" });
    gsap.to(titleRef.current, { color: feature.dot, letterSpacing: "0.14em", duration: 0.3 });
    gsap.to(arrowRef.current, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" });
  };
  const onLeave = () => {
    gsap.to(rowRef.current, { x: 0, duration: 0.5, ease: "power3.out" });
    gsap.to(numRef.current, { color: "rgba(255,255,255,0.055)", scale: 1, x: 0, duration: 0.5, ease: "power3.out" });
    gsap.to(dotRef.current, { scale: 1, duration: 0.4 });
    gsap.to(titleRef.current, { color: "var(--fg)", letterSpacing: "0.1em", duration: 0.3 });
    gsap.to(arrowRef.current, { opacity: 0, x: -8, duration: 0.3 });
  };

  return (
    <div
      ref={rowRef}
      className="feature-row"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        display: "grid",
        gridTemplateColumns: "72px 1fr auto",
        gap: 28,
        padding: "28px 0",
        borderBottom: "1px solid var(--border-subtle)",
        alignItems: "center",
        cursor: "default",
      }}
    >
      {/* Large faint number */}
      <div
        ref={numRef}
        className="feature-num"
        style={{
          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
          fontSize: 52,
          color: "rgba(255,255,255,0.055)",
          lineHeight: 1,
          userSelect: "none",
          alignSelf: "start",
          paddingTop: 2,
        }}
      >
        {feature.num}
      </div>

      {/* Title + description */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
          <span
            ref={dotRef}
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: feature.dot,
              boxShadow: `0 0 8px ${feature.dot}`,
              flexShrink: 0,
              display: "inline-block",
            }}
          />
          <span
            ref={titleRef}
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
              fontSize: 20,
              color: "var(--fg)",
              letterSpacing: "0.1em",
            }}
          >
            {feature.title}
          </span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-barlow, system-ui)",
            fontSize: 14,
            fontWeight: 300,
            color: "rgba(242,242,242,0.34)",
            lineHeight: 1.72,
            maxWidth: 520,
            margin: 0,
          }}
        >
          {feature.desc}
        </p>
      </div>

      {/* Hover arrow */}
      <span
        ref={arrowRef}
        className="feature-arrow"
        aria-hidden
        style={{
          fontFamily: "var(--font-dm-mono, monospace)",
          fontSize: 20,
          color: feature.dot,
          opacity: 0,
          transform: "translateX(-8px)",
          alignSelf: "center",
        }}
      >
        →
      </span>
    </div>
  );
}
