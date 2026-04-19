"use client";

import {
  CHAR_SETS,
  BG_COLOR_VALUES,
  COLOR_MODE_LABELS,
  COLOR_MODE_PREVIEW,
  type AsciiSettings,
  type CharSetName,
  type ColorMode,
  type BgColor,
} from "../types";

interface ControlPanelProps {
  settings: AsciiSettings;
  onChange: <K extends keyof AsciiSettings>(key: K, value: AsciiSettings[K]) => void;
  mediaPipeLoading: boolean;
  mediaPipeLoaded: boolean;
  mediaPipeError: string | null;
}

export function ControlPanel({
  settings,
  onChange,
  mediaPipeLoading,
  mediaPipeLoaded,
  mediaPipeError,
}: ControlPanelProps) {
  const s = {
    section: {
      marginBottom: "20px",
    } as React.CSSProperties,
    sectionHeader: {
      fontSize: "10px",
      color: "#555",
      letterSpacing: "0.12em",
      marginBottom: "10px",
      userSelect: "none" as const,
    },
    pill: (active: boolean): React.CSSProperties => ({
      background: active ? "rgba(255,155,33,0.15)" : "transparent",
      border: `1px solid ${active ? "#FF9B21" : "#2a2a2a"}`,
      color: active ? "#FF9B21" : "#555",
      padding: "4px 8px",
      cursor: "pointer",
      fontFamily: "var(--font-dm-mono, monospace)",
      fontSize: "11px",
      letterSpacing: "0.06em",
      transition: "all 0.12s",
      whiteSpace: "nowrap" as const,
    }),
    slider: {
      width: "100%",
      accentColor: "#FF9B21",
      cursor: "pointer",
    } as React.CSSProperties,
    toggle: (active: boolean): React.CSSProperties => ({
      background: active ? "rgba(255,155,33,0.15)" : "transparent",
      border: `1px solid ${active ? "#FF9B21" : "#2a2a2a"}`,
      color: active ? "#FF9B21" : "#444",
      padding: "5px 12px",
      cursor: "pointer",
      fontFamily: "var(--font-dm-mono, monospace)",
      fontSize: "11px",
      letterSpacing: "0.08em",
      transition: "all 0.12s",
      flex: 1,
    }),
  };

  const charSetNames = Object.keys(CHAR_SETS) as CharSetName[];
  const colorModes = Object.keys(COLOR_MODE_LABELS) as ColorMode[];
  const bgColors = Object.keys(BG_COLOR_VALUES) as BgColor[];

  return (
    <div
      className="panel-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        background: "#0d0d0d",
        borderLeft: "1px solid #1a1a1a",
        padding: "16px",
        fontFamily: "var(--font-dm-mono, monospace)",
      }}
    >
      {/* ┌─ CHARACTERS ─────────────┐ */}
      <div style={s.section}>
        <div style={s.sectionHeader}>┌─ CHARACTERS ──────────────</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {charSetNames.map((name) => (
            <button
              key={name}
              style={s.pill(settings.charSet === name)}
              onClick={() => onChange("charSet", name)}
            >
              {name.toUpperCase()}
            </button>
          ))}
        </div>
        <div
          style={{
            marginTop: "8px",
            fontSize: "11px",
            color: "#333",
            letterSpacing: "0.1em",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {CHAR_SETS[settings.charSet].slice(0, 32)}
        </div>
      </div>

      {/* ┌─ FOREGROUND COLOR ───────┐ */}
      <div style={s.section}>
        <div style={s.sectionHeader}>┌─ FOREGROUND COLOR ────────</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" }}>
          {colorModes.map((mode) => {
            const preview = COLOR_MODE_PREVIEW[mode];
            const isGradient = preview.startsWith("linear-gradient");
            const active = settings.colorMode === mode;
            return (
              <button
                key={mode}
                onClick={() => onChange("colorMode", mode)}
                title={COLOR_MODE_LABELS[mode]}
                style={{
                  border: `2px solid ${active ? "#FF9B21" : "#1a1a1a"}`,
                  cursor: "pointer",
                  padding: "0",
                  height: "28px",
                  position: "relative",
                  overflow: "hidden",
                  background: isGradient ? preview : preview,
                  transition: "border-color 0.12s",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    bottom: "1px",
                    right: "2px",
                    fontSize: "8px",
                    fontFamily: "var(--font-dm-mono, monospace)",
                    color: "rgba(0,0,0,0.8)",
                    letterSpacing: 0,
                    textShadow: "0 0 3px rgba(255,255,255,0.5)",
                    lineHeight: 1,
                  }}
                >
                  {mode.slice(0, 3).toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "6px",
            fontSize: "11px",
            color: "#FF9B21",
            letterSpacing: "0.08em",
          }}
        >
          {COLOR_MODE_LABELS[settings.colorMode]}
        </div>
      </div>

      {/* ┌─ BACKGROUND ─────────────┐ */}
      <div style={s.section}>
        <div style={s.sectionHeader}>┌─ BACKGROUND ──────────────</div>
        <div style={{ display: "flex", gap: "4px" }}>
          {bgColors.map((bg) => {
            const active = settings.bgColor === bg;
            return (
              <button
                key={bg}
                onClick={() => onChange("bgColor", bg)}
                title={bg}
                style={{
                  flex: 1,
                  height: "24px",
                  background: BG_COLOR_VALUES[bg],
                  border: `2px solid ${active ? "#FF9B21" : "#2a2a2a"}`,
                  cursor: "pointer",
                  transition: "border-color 0.12s",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ┌─ RESOLUTION & SIZE ──────┐ */}
      <div style={s.section}>
        <div style={s.sectionHeader}>┌─ RESOLUTION & SIZE ───────</div>
        <SliderField
          label="COLUMNS"
          value={settings.columns}
          min={200}
          max={500}
          step={2}
          display={`${settings.columns}`}
          onChange={(v) => onChange("columns", v)}
        />
        <SliderField
          label="CHAR SIZE"
          value={settings.charSize}
          min={4}
          max={18}
          step={1}
          display={`${settings.charSize}px`}
          onChange={(v) => onChange("charSize", v)}
        />
      </div>

      {/* ┌─ PROCESSING ─────────────┐ */}
      <div style={s.section}>
        <div style={s.sectionHeader}>┌─ PROCESSING ──────────────</div>
        <SliderField
          label="CONTRAST"
          value={settings.contrast}
          min={0.5}
          max={3}
          step={0.05}
          display={settings.contrast.toFixed(2)}
          onChange={(v) => onChange("contrast", v)}
        />
        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          <button
            style={s.toggle(settings.colorFromVideo)}
            onClick={() => onChange("colorFromVideo", !settings.colorFromVideo)}
          >
            COLOR FROM VIDEO
          </button>
        </div>
        <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
          <button
            style={s.toggle(settings.invertBrightness)}
            onClick={() => onChange("invertBrightness", !settings.invertBrightness)}
          >
            INVERT BRIGHTNESS
          </button>
        </div>
      </div>

      {/* ┌─ MEDIAPIPE ──────────────┐ */}
      <div style={s.section}>
        <div style={s.sectionHeader}>┌─ MEDIAPIPE ───────────────</div>
        <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
          <button
            style={{
              ...s.toggle(settings.mediaPipeEnabled),
              border: `1px solid ${settings.mediaPipeEnabled ? "#BB44FF" : "#2a2a2a"}`,
              color: settings.mediaPipeEnabled ? "#BB44FF" : "#444",
              background: settings.mediaPipeEnabled ? "rgba(187,68,255,0.1)" : "transparent",
            }}
            onClick={() => onChange("mediaPipeEnabled", !settings.mediaPipeEnabled)}
          >
            SELFIE SEGMENTER
          </button>
        </div>
        {settings.mediaPipeEnabled && (
          <div style={{ fontSize: "10px", letterSpacing: "0.08em" }}>
            {mediaPipeLoading && (
              <span style={{ color: "#FF9B21" }}>⟳ LOADING MODEL...</span>
            )}
            {mediaPipeLoaded && !mediaPipeLoading && (
              <span style={{ color: "#00FFD1" }}>✓ ACTIVE</span>
            )}
            {mediaPipeError && (
              <span style={{ color: "#FF4444" }} title={mediaPipeError}>
                ✗ ERROR
              </span>
            )}
          </div>
        )}
        {settings.mediaPipeEnabled && (
          <div style={{ fontSize: "10px", color: "#333", marginTop: "4px", lineHeight: 1.5 }}>
            Person detected in foreground — background chars dimmed.
          </div>
        )}
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
          fontSize: "10px",
          color: "#555",
          letterSpacing: "0.1em",
        }}
      >
        <span>{label}</span>
        <span style={{ color: "#FF9B21" }}>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "#FF9B21", cursor: "pointer" }}
      />
    </div>
  );
}
