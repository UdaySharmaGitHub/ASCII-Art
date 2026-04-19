"use client";

import { useState, useCallback } from "react";
import { useCamera } from "./hooks/useCamera";
import { useAsciiEngine } from "./hooks/useAsciiEngine";
import { useMediaPipe } from "./hooks/useMediaPipe";
import { AsciiCanvas } from "./components/AsciiCanvas";
import { TopBar } from "./components/TopBar";
import { ControlPanel } from "./components/ControlPanel";
import { DEFAULT_SETTINGS, type AsciiSettings } from "./types";

export default function StudioPage() {
  const [settings, setSettings] = useState<AsciiSettings>(DEFAULT_SETTINGS);

  const { videoRef, isReady, error: cameraError, startCamera } = useCamera();
  const { isLoaded: mpLoaded, isLoading: mpLoading, error: mpError, segment } = useMediaPipe(
    settings.mediaPipeEnabled
  );

  const { canvasRef, stats, exportPNG, copyText } = useAsciiEngine(
    videoRef,
    settings,
    segment,
    isReady
  );

  const handleChange = useCallback(
    <K extends keyof AsciiSettings>(key: K, value: AsciiSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleToggle = useCallback(
    <K extends keyof AsciiSettings>(key: K, value: AsciiSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0a0a0a",
        overflow: "hidden",
        fontFamily: "var(--font-dm-mono, monospace)",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          height: "36px",
          borderBottom: "1px solid #1a1a1a",
          background: "#080808",
          flexShrink: 0,
        }}
      >
        <a
          href="/"
          style={{
            color: "#444",
            textDecoration: "none",
            fontSize: "11px",
            letterSpacing: "0.1em",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FF9B21")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
        >
          ← ASCII-ART MIRROR
        </a>
        <span
          style={{
            fontSize: "10px",
            color: "#2a2a2a",
            letterSpacing: "0.15em",
          }}
        >
          STUDIO
        </span>
      </div>

      {/* TopBar with stats and quick toggles */}
      <TopBar
        stats={stats}
        settings={settings}
        onToggle={handleToggle}
        onExportPNG={exportPNG}
        onCopyText={copyText}
      />

      {/* Main split layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left: ASCII canvas */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
          <div style={{ aspectRatio: "4/3", height: "100%", maxWidth: "100%", position: "relative" }}>
          <AsciiCanvas
            canvasRef={canvasRef}
            isLoading={!isReady && !cameraError}
            error={cameraError}
          />

          {/* Hidden video element for webcam feed */}
          <video
            ref={videoRef}
            muted
            playsInline
            style={{ display: "none" }}
          />

          {/* Start camera overlay */}
          {!isReady && !cameraError && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 20,
                background: "#000",
              }}
            >
              <pre
                style={{
                  fontSize: "11px",
                  lineHeight: 1.5,
                  color: "#333",
                  textAlign: "center",
                  margin: "0 0 24px",
                  userSelect: "none",
                }}
              >
                {`  ┌─────────────────────────────┐
  │                             │
  │   ░░░░░░░░░░░░░░░░░░░░░░░   │
  │   ░                     ░   │
  │   ░    [ CAMERA OFF ]   ░   │
  │   ░                     ░   │
  │   ░░░░░░░░░░░░░░░░░░░░░░░   │
  │                             │
  └─────────────────────────────┘`}
              </pre>
              <button
                onClick={startCamera}
                style={{
                  background: "transparent",
                  border: "1px solid #FF9B21",
                  color: "#FF9B21",
                  padding: "10px 24px",
                  cursor: "pointer",
                  fontFamily: "var(--font-dm-mono, monospace)",
                  fontSize: "13px",
                  letterSpacing: "0.12em",
                  transition: "all 0.2s",
                  textShadow: "0 0 7px #FF9B21",
                  boxShadow: "0 0 8px rgba(255,155,33,0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,155,33,0.1)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(255,155,33,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.boxShadow = "0 0 8px rgba(255,155,33,0.2)";
                }}
              >
                ACTIVATE CAMERA
              </button>
            </div>
          )}
          </div>
        </div>

        {/* Right: Control panel */}
        <div style={{ width: "clamp(240px, 22%, 300px)", flexShrink: 0 }}>
          <ControlPanel
            settings={settings}
            onChange={handleChange}
            mediaPipeLoading={mpLoading}
            mediaPipeLoaded={mpLoaded}
            mediaPipeError={mpError}
          />
        </div>
      </div>
    </div>
  );
}
