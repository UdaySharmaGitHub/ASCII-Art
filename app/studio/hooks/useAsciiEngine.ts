"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  CHAR_SETS,
  BG_COLOR_VALUES,
  type AsciiSettings,
  type EngineStats,
  type SegmentationMask,
} from "../types";

const GX = [
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1],
];
const GY = [
  [-1, -2, -1],
  [0, 0, 0],
  [1, 2, 1],
];

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function resolveColor(
  mode: AsciiSettings["colorMode"],
  col: number,
  cols: number,
  gray: number
): string {
  switch (mode) {
    case "matrix":  return "#00FF41";
    case "cyan":    return "#00FFFF";
    case "amber":   return "#FF9B21";
    case "red":     return "#FF4444";
    case "violet":  return "#BB44FF";
    case "white":   return "#EEEEEE";
    case "neon":    return "#39FF14";
    case "gold":    return "#FFD700";
    case "pink":    return "#FF69B4";
    case "aqua":    return "#00CED1";
    case "rainbow": {
      const hue = Math.floor((col / cols) * 360);
      return `hsl(${hue},100%,60%)`;
    }
    case "heatmap": {
      const hue = Math.floor(240 - (gray / 255) * 240);
      return `hsl(${hue},100%,55%)`;
    }
  }
}

interface UseAsciiEngineReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  stats: EngineStats;
  exportPNG: () => void;
  copyText: () => void;
}

export function useAsciiEngine(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  settings: AsciiSettings,
  segmentFn: (video: HTMLVideoElement, ts: number) => SegmentationMask,
  isVideoReady: boolean
): UseAsciiEngineReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const frameTimesRef = useRef<number[]>([]);
  const lastStatsUpdateRef = useRef<number>(0);
  const lastFrameTextRef = useRef<string>("");
  const frameColorsRef = useRef<string[]>([]);
  const settingsRef = useRef<AsciiSettings>(settings);
  const rainStateRef = useRef<
    Array<{ col: number; y: number; speed: number; trail: number }>
  >([]);
  const rainDimsRef = useRef<{ cols: number; rows: number }>({ cols: 0, rows: 0 });
  const [stats, setStats] = useState<EngineStats>({ fps: 0, cols: 0, rows: 0 });

  // Keep settingsRef in sync without triggering effect restarts
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const renderFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    const s = settingsRef.current;
    const cols = s.columns;
    const charAspect = 0.55;
    // Force 4:3 output regardless of camera aspect ratio
    const rows = Math.floor(cols * (3 / 4) * charAspect);

    if (rows <= 0 || cols <= 0) return;

    // Ensure offscreen canvas exists
    if (!offscreenRef.current) {
      offscreenRef.current = document.createElement("canvas");
    }
    const offscreen = offscreenRef.current;
    offscreen.width = cols;
    offscreen.height = rows;

    const octx = offscreen.getContext("2d", { willReadFrequently: true });
    if (!octx) return;

    octx.save();
    if (s.mirrorH) {
      octx.translate(cols, 0);
      octx.scale(-1, 1);
    }
    octx.drawImage(video, 0, 0, cols, rows);
    octx.restore();

    const imageData = octx.getImageData(0, 0, cols, rows);
    const pixels = imageData.data;
    const frameColors = frameColorsRef.current;
    frameColors.length = cols * rows;

    // MediaPipe segmentation
    let mask: SegmentationMask = null;
    if (s.mediaPipeEnabled) {
      mask = segmentFn(video, performance.now());
    }

    // Output canvas — fixed 4:3 pixel dimensions so it fills the display exactly
    canvas.width = cols * s.charSize;
    canvas.height = Math.round(canvas.width * (3 / 4));

    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;
    const fontSize = Math.max(1, Math.floor(cellH));

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = BG_COLOR_VALUES[s.bgColor];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px var(--font-dm-mono, "Courier New"), monospace`;
    ctx.textBaseline = "top";

    const chars = CHAR_SETS[s.charSet];
    const charLen = chars.length;
    let frameText = "";

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = (row * cols + col) * 4;
        const R = pixels[idx];
        const G = pixels[idx + 1];
        const B = pixels[idx + 2];

        let gray = 0.299 * R + 0.587 * G + 0.114 * B;
        if (s.invertBrightness) gray = 255 - gray;
        gray = clamp((gray - 128) * s.contrast + 128, 0, 255);

        if (s.edgeMode) {
          let gx = 0, gy = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nc = clamp(col + dx, 0, cols - 1);
              const nr = clamp(row + dy, 0, rows - 1);
              const pidx = (nr * cols + nc) * 4;
              const g =
                0.299 * pixels[pidx] +
                0.587 * pixels[pidx + 1] +
                0.114 * pixels[pidx + 2];
              gx += g * GX[dy + 1][dx + 1];
              gy += g * GY[dy + 1][dx + 1];
            }
          }
          gray = clamp(Math.sqrt(gx * gx + gy * gy), 0, 255);
        }

        const charIdx = Math.floor((gray / 255) * (charLen - 1));
        const char = chars[charIdx];

        // Foreground detection via mask
        let isForeground = true;
        if (mask) {
          const maskW = 256, maskH = 256;
          const mc = Math.floor((col / cols) * maskW);
          const mr = Math.floor((row / rows) * maskH);
          isForeground = mask[mr * maskW + mc] === 1;
        }

        let color: string;
        if (s.colorFromVideo) {
          const luma = 0.299 * R + 0.587 * G + 0.114 * B;
          const sat = 1.6;
          const bri = 1.15;
          const vR = clamp((luma + (R - luma) * sat) * bri, 0, 255);
          const vG = clamp((luma + (G - luma) * sat) * bri, 0, 255);
          const vB = clamp((luma + (B - luma) * sat) * bri, 0, 255);
          color = `rgb(${vR|0},${vG|0},${vB|0})`;
        } else if (mask && !isForeground) {
          color = "#2a2a2a";
        } else {
          color = resolveColor(s.colorMode, col, cols, gray);
        }

        frameColors[row * cols + col] = color;
        ctx.fillStyle = color;
        ctx.fillText(char, col * cellW, row * cellH);
        frameText += char;
      }
      frameText += "\n";
    }

    lastFrameTextRef.current = frameText;

    // Matrix rain overlay
    if (s.matrixRain) {
      const dims = rainDimsRef.current;
      if (dims.cols !== cols || dims.rows !== rows) {
        dims.cols = cols;
        dims.rows = rows;
        rainStateRef.current = Array.from({ length: cols * 2 }, (_, index) => ({
          col: Math.floor(index / 2),
          y: -(Math.random() * rows * 2),
          speed: 1.5 + Math.random(),
          trail: 10 + Math.floor(Math.random() * 16),
        }));
      }

      const rain = rainStateRef.current;
      const rainChars = chars.replace(/ /g, "") || chars;

      for (const drop of rain) {
        drop.y += drop.speed * s.matrixRainSpeed;
        if (Math.floor(drop.y) - drop.trail > rows) {
          drop.y = -(Math.random() * rows * 0.5);
          drop.speed = 1.5 + Math.random();
          drop.trail = 10 + Math.floor(Math.random() * 16);
        }
      }

      const savedAlpha = ctx.globalAlpha;
      for (const drop of rain) {
        const headRow = Math.floor(drop.y);

        for (let t = drop.trail; t >= 0; t--) {
          const row = headRow - t;
          if (row < 0 || row >= rows) continue;
          const ch = rainChars[Math.floor(Math.random() * rainChars.length)];
          ctx.fillStyle = frameColors[row * cols + drop.col];
          if (t === 0) {
            ctx.globalAlpha = 1.0;
          } else {
            const ratio = 1 - t / drop.trail;
            ctx.globalAlpha = ratio * ratio * 0.85 + 0.05;
          }
          ctx.fillText(ch, drop.col * cellW, row * cellH);
        }
      }
      ctx.globalAlpha = savedAlpha;
    }


    const now = performance.now();
    frameTimesRef.current.push(now);
    if (frameTimesRef.current.length > 30) frameTimesRef.current.shift();

    if (now - lastStatsUpdateRef.current > 500) {
      lastStatsUpdateRef.current = now;
      const oldest = frameTimesRef.current[0];
      const fps =
        frameTimesRef.current.length > 1
          ? Math.round(
              ((frameTimesRef.current.length - 1) / (now - oldest)) * 1000
            )
          : 0;
      setStats({ fps, cols, rows });
    }
  }, [videoRef, segmentFn]);

  useEffect(() => {
    if (!isVideoReady) return;

    function loop() {
      renderFrame();
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isVideoReady, renderFrame]);

  const exportPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `terminal-mirror-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  const copyText = useCallback(() => {
    navigator.clipboard.writeText(lastFrameTextRef.current).catch(() => {});
  }, []);

  return { canvasRef, stats, exportPNG, copyText };
}
