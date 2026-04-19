"use client";

import type { EngineStats, AsciiSettings } from "../types";

interface TopBarProps {
  stats: EngineStats;
  settings: AsciiSettings;
  onToggle: <K extends keyof AsciiSettings>(key: K, value: AsciiSettings[K]) => void;
  onExportPNG: () => void;
  onCopyText: () => void;
}

export function TopBar({ stats, settings, onToggle, onExportPNG, onCopyText }: TopBarProps) {
  return (
    <>
      <style>{`
        .topbar-root {
          border-bottom: 1px solid #222;
          background: #0d0d0d;
          padding: 6px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          font-family: var(--font-dm-mono, monospace);
          font-size: 12px;
          color: #888;
          row-gap: 6px;
        }
        .topbar-export-label {
          display: inline;
        }
        @media (max-width: 767px) {
          .topbar-root {
            gap: 8px;
            font-size: 11px;
          }
          .topbar-export-label {
            display: none;
          }
        }
      `}</style>
      <div className="topbar-root">
        {/* Stats */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ color: "#FF9B21", fontWeight: 500 }}>
            {stats.fps.toString().padStart(2, "0")} FPS
          </span>
          <span style={{ color: "#444" }}>│</span>
          <span>
            {stats.cols}×{stats.rows}
          </span>
        </div>

        <span style={{ color: "#333" }}>│</span>

        {/* Toggles */}
        <ToggleBtn
          label="MIRROR"
          active={settings.mirrorH}
          onClick={() => onToggle("mirrorH", !settings.mirrorH)}
        />
        <ToggleBtn
          label="EDGE"
          active={settings.edgeMode}
          onClick={() => onToggle("edgeMode", !settings.edgeMode)}
          activeColor="#00FFD1"
        />
        <ToggleBtn
          label="MP"
          active={settings.mediaPipeEnabled}
          onClick={() => onToggle("mediaPipeEnabled", !settings.mediaPipeEnabled)}
          activeColor="#BB44FF"
        />

        <div style={{ flex: 1 }} />

        {/* Export buttons */}
        <button
          onClick={onCopyText}
          style={{
            background: "transparent",
            border: "1px solid #333",
            color: "#888",
            padding: "4px 10px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "11px",
            letterSpacing: "0.08em",
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#FF9B21";
            e.currentTarget.style.color = "#FF9B21";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#333";
            e.currentTarget.style.color = "#888";
          }}
          title="Copy text"
        >
          <span className="topbar-export-label">COPY </span>TXT
        </button>
        <button
          onClick={onExportPNG}
          style={{
            background: "transparent",
            border: "1px solid #FF9B21",
            color: "#FF9B21",
            padding: "4px 10px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "11px",
            letterSpacing: "0.08em",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,155,33,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
          title="Save PNG"
        >
          <span className="topbar-export-label">SAVE </span>PNG
        </button>
      </div>
    </>
  );
}

function ToggleBtn({
  label,
  active,
  onClick,
  activeColor = "#FF9B21",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  activeColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: `1px solid ${active ? activeColor : "#333"}`,
        color: active ? activeColor : "#555",
        padding: "3px 8px",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: "11px",
        letterSpacing: "0.08em",
        transition: "all 0.15s",
      }}
    >
      {active ? "▶" : "○"} {label}
    </button>
  );
}
