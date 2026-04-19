"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useAnimate, stagger } from "motion/react";
import Link from "next/link";

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

const features = [
  {
    icon: "◈",
    title: "REAL-TIME 30FPS",
    desc: "Webcam feed converted to ASCII art at up to 30 frames per second with smooth FPS tracking.",
    color: "#FF9B21",
  },
  {
    icon: "⬡",
    title: "MEDIAPIPE AI",
    desc: "Body segmentation isolates you from the background, rendering person and environment in distinct styles.",
    color: "#00FFD1",
  },
  {
    icon: "▦",
    title: "10 CHARACTER SETS",
    desc: "Standard, Blocks, Binary, Braille, Matrix katakana, Dots, Slashes, Numbers and more.",
    color: "#BB44FF",
  },
  {
    icon: "◐",
    title: "12 COLOR MODES",
    desc: "Matrix green, Heatmap, Rainbow spectrum, Amber, Neon — or pull real colors from your video feed.",
    color: "#FF4444",
  },
  {
    icon: "⬕",
    title: "SOBEL EDGE MODE",
    desc: "Switch to edge detection — your silhouette is rendered as a glowing outline of characters.",
    color: "#FFD700",
  },
];

export default function LandingPage() {
  const [heroScope, heroAnimate] = useAnimate();
  const featuresRef = useRef<HTMLDivElement>(null);
  const isFeaturesInView = useInView(featuresRef as React.RefObject<Element>, {
    once: true,
    amount: 0.1,
  });

  useEffect(() => {
    const el = heroScope.current;
    if (!el) return;
    const spans = el.querySelectorAll("span[data-char]");
    if (spans.length === 0) return;

    heroAnimate(
      "span[data-char]",
      { opacity: [0, 1], y: [6, 0] },
      { duration: 0.25, delay: stagger(0.005), ease: "easeOut" }
    );
  }, [heroAnimate, heroScope]);

  return (
    <div
      className="noise-bg"
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        fontFamily: "var(--font-dm-mono, monospace)",
        color: "#ededed",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 32px",
          borderBottom: "1px solid #111",
          background: "rgba(10,10,10,0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "#FF9B21",
            letterSpacing: "0.2em",
            textShadow: "0 0 10px rgba(255,155,33,0.5)",
          }}
        >
          ASCII-ART MIRROR
        </span>
        <Link
          href="/studio"
          style={{
            fontSize: "11px",
            color: "#555",
            letterSpacing: "0.12em",
            textDecoration: "none",
            border: "1px solid #222",
            padding: "5px 12px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#FF9B21";
            (e.currentTarget as HTMLAnchorElement).style.color = "#FF9B21";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#222";
            (e.currentTarget as HTMLAnchorElement).style.color = "#555";
          }}
        >
          LAUNCH STUDIO →
        </Link>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px 60px",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Animated ASCII hero art */}
        <div ref={heroScope} style={{ marginBottom: "40px" }}>
          <pre
            style={{
              fontSize: "clamp(8px, 1.2vw, 14px)",
              lineHeight: 1.3,
              color: "#FF9B21",
              margin: 0,
              textShadow: "0 0 8px rgba(255,155,33,0.4)",
              fontFamily: "var(--font-dm-mono, monospace)",
            }}
          >
            {ASCII_HERO.split("").map((char, i) => (
              <span key={i} data-char style={{ opacity: 0, display: "inline" }}>
                {char}
              </span>
            ))}
          </pre>
        </div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <h1
            style={{
              fontSize: "clamp(36px, 7vw, 88px)",
              fontWeight: 500,
              letterSpacing: "0.15em",
              margin: "0 0 8px",
              color: "#FF9B21",
              textShadow:
                "0 0 20px rgba(255,155,33,0.6), 0 0 40px rgba(255,155,33,0.3)",
              lineHeight: 1,
            }}
          >
            ASCII-ART
          </h1>
          <h1
            style={{
              fontSize: "clamp(36px, 7vw, 88px)",
              fontWeight: 400,
              letterSpacing: "0.15em",
              margin: "0 0 24px",
              color: "#ededed",
              lineHeight: 1,
            }}
          >
            MIRROR
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          style={{
            fontSize: "13px",
            color: "#555",
            letterSpacing: "0.15em",
            margin: "0 0 40px",
            maxWidth: "480px",
            lineHeight: 1.8,
          }}
        >
          YOUR FACE. YOUR MOVEMENT. REIMAGINED IN ASCII.
          <br />
          <span style={{ color: "#8e8e8e" }}>REAL-TIME · MEDIAPIPE · 30FPS</span>
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.3, ease: "backOut" }}
        >
          <Link href="/studio">
            <button
              className="phosphor-glow"
              style={{
                background: "transparent",
                border: "1px solid #FF9B21",
                color: "#FF9B21",
                padding: "14px 40px",
                cursor: "pointer",
                fontFamily: "var(--font-dm-mono, monospace)",
                fontSize: "15px",
                letterSpacing: "0.2em",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,155,33,0.1)";
                e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(255,155,33,0.5), inset 0 0 20px rgba(255,155,33,0.05)";
                e.currentTarget.style.letterSpacing = "0.25em";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.letterSpacing = "0.2em";
              }}
            >
              ENTER THE STUDIO
            </button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          style={{
            position: "absolute",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            color: "#8e8e8e",
            fontSize: "10px",
            letterSpacing: "0.15em",
          }}
        >
          <span>SCROLL</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            ▼
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        style={{
          padding: "80px 24px 120px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.1 }}
          style={{ marginBottom: "48px", textAlign: "center" }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "#444",
              letterSpacing: "0.25em",
              marginBottom: "12px",
            }}
          >
            ┌──────────────────────────────────┐
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#555",
              letterSpacing: "0.2em",
            }}
          >
            CAPABILITIES
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#444",
              letterSpacing: "0.25em",
              marginTop: "12px",
            }}
          >
            └──────────────────────────────────┘
          </div>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              index={i}
              inView={isFeaturesInView}
            />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "60px 24px 100px",
          borderTop: "1px solid #111",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <pre
            style={{
              fontSize: "11px",
              color: "#FF9B21",
              margin: "0 0 32px",
              lineHeight: 1.5,
              fontFamily: "var(--font-dm-mono, monospace)",
            }}
          >
            {`░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░  YOU ARE MADE OF CHARACTERS. LET US PROVE IT.  ░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`}
          </pre>
          <Link href="/studio">
            <button
              style={{
                background: "transparent",
                border: "1px solid #333",
                color: "#888",
                padding: "12px 36px",
                cursor: "pointer",
                fontFamily: "var(--font-dm-mono, monospace)",
                fontSize: "13px",
                letterSpacing: "0.18em",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#FF9B21";
                e.currentTarget.style.color = "#FF9B21";
                e.currentTarget.style.textShadow = "0 0 8px #FF9B21";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#333";
                e.currentTarget.style.color = "#888";
                e.currentTarget.style.textShadow = "none";
              }}
            >
              START NOW →
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "16px",
          borderTop: "1px solid #0f0f0f",
          fontSize: "10px",
          color: "#222",
          letterSpacing: "0.12em",
        }}
      >
        TERMINAL MIRROR · ASCII ART CAMERA · MEDIAPIPE
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  color,
  index,
  inView,
}: {
  icon: string;
  title: string;
  desc: string;
  color: string;
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      style={{
        border: "1px solid #1a1a1a",
        padding: "20px",
        position: "relative",
        background: "#0d0d0d",
      }}
      whileHover={{ borderColor: color + "44" } as Record<string, string>}
    >
      <span
        style={{
          position: "absolute",
          top: -1,
          left: -1,
          color: "#333",
          fontSize: "11px",
          lineHeight: 1,
        }}
      >
        ┌
      </span>
      <span
        style={{
          position: "absolute",
          top: -1,
          right: -1,
          color: "#333",
          fontSize: "11px",
          lineHeight: 1,
        }}
      >
        ┐
      </span>
      <span
        style={{
          position: "absolute",
          bottom: -1,
          left: -1,
          color: "#333",
          fontSize: "11px",
          lineHeight: 1,
        }}
      >
        └
      </span>
      <span
        style={{
          position: "absolute",
          bottom: -1,
          right: -1,
          color: "#333",
          fontSize: "11px",
          lineHeight: 1,
        }}
      >
        ┘
      </span>

      <div
        style={{
          fontSize: "22px",
          color: color,
          marginBottom: "12px",
          textShadow: `0 0 12px ${color}66`,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: "11px",
          color: "#888",
          letterSpacing: "0.14em",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: "11px", color: "#444", lineHeight: 1.7 }}>
        {desc}
      </div>
    </motion.div>
  );
}
