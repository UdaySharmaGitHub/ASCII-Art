"use client";

interface AsciiCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isLoading: boolean;
  error: string | null;
}

export function AsciiCanvas({ canvasRef, isLoading, error }: AsciiCanvasProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#000",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          imageRendering: "pixelated",
        }}
      />

      {/* Scanline overlay */}
      <div
        className="scanlines"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {isLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            background: "rgba(0,0,0,0.85)",
            fontFamily: "var(--font-dm-mono, monospace)",
            color: "#FF9B21",
          }}
        >
          <pre
            style={{
              fontSize: "11px",
              lineHeight: 1.4,
              textAlign: "center",
              margin: 0,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          >
            {`░░░░░░░░░░░░░░░░░░░░
░  INITIALIZING...  ░
░  CAMERA FEED      ░
░░░░░░░░░░░░░░░░░░░░`}
          </pre>
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            background: "rgba(0,0,0,0.9)",
            fontFamily: "var(--font-dm-mono, monospace)",
            color: "#FF4444",
            padding: "32px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "12px" }}>⚠</div>
          <div style={{ fontSize: "13px", marginBottom: "8px", letterSpacing: "0.1em" }}>
            CAMERA ERROR
          </div>
          <div style={{ fontSize: "11px", color: "#888", maxWidth: "280px" }}>
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
