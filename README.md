<h1 align="center">ASCII-Art Mirror — Real-time ASCII Art Camera</h1>

<p align="center">
  Transform your webcam feed into living ASCII art with MediaPipe body segmentation, customizable characters and colors, Sobel edge detection, Matrix Rain, and PNG/text export.
</p>

---

<div align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://github.com/UdaySharmaGitHub/ASCII-Art/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
  <a href="https://github.com/UdaySharmaGitHub/ASCII-Art/stargazers"><img src="https://img.shields.io/github/stars/UdaySharmaGitHub/ASCII-Art?style=social" alt="GitHub Stars"></a>
</div>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#customization-options">Customization</a> ·
  <a href="#export">Export</a> ·
  <a href="https://github.com/UdaySharmaGitHub/ASCII-Art/issues">Pick an Issue</a> ·
  <a href="https://github.com/UdaySharmaGitHub/ASCII-Art/issues/new?title=Bug%3A%20">Report a Bug</a> ·
  <a href="https://github.com/UdaySharmaGitHub/ASCII-Art/issues/new?title=Feature%3A%20">Request a Feature</a>
</p>

<div align="center">
  <img src="https://img.shields.io/badge/character_sets-11-2563eb?style=flat-square" alt="11 character sets">
  <img src="https://img.shields.io/badge/color_modes-12-0f766e?style=flat-square" alt="12 color modes">
  <img src="https://img.shields.io/badge/vision-MediaPipe-ea580c?style=flat-square" alt="MediaPipe vision">
  <img src="https://img.shields.io/badge/framework-Next.js-000000?style=flat-square" alt="Next.js">
  <img src="https://img.shields.io/badge/contributions-welcome-brightgreen?style=flat-square" alt="Contributions welcome">
</div>

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Data Flow](#data-flow)
- [Customization Options](#customization-options)
- [MediaPipe Integration](#mediapipe-integration)
- [Export](#export)
- [Tech Stack](#tech-stack)

---

## Features

| Category | Details |
|---|---|
| **Rendering** | Real-time webcam → ASCII at up to 30fps via `requestAnimationFrame` |
| **Edge Mode** | Sobel operator detects edges — renders your silhouette as character outlines |
| **AI Segmentation** | MediaPipe selfie segmenter separates person from background in real-time |
| **Character Sets** | 10 sets: Standard, Simple, Detailed, Blocks, Binary, Braille, Matrix, Dots, Slashes, Numbers |
| **Foreground Colors** | 12 modes: Matrix, Cyan, Amber, Red, Violet, White, Neon, Gold, Pink, Aqua, Rainbow, Heatmap |
| **Background Colors** | 6 options: Black, Dark Green, Dark Blue, Dark Red, White |
| **Controls** | Resolution (20–200 cols), char size (4–18px), contrast (0.5–3.0) |
| **Toggles** | Mirror (default on), invert brightness, color from video |
| **Matrix Rain** | Color-synced rain overlay with a speed slider (0.125x–1x in 0.125x increments, default 0.25x) shown below the enabled toggle |
| **Export** | Save as PNG, copy raw ASCII text to clipboard |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Landing page** — cinematic intro with animated ASCII hero and feature overview
- **Studio** (`/studio`) — click **ACTIVATE CAMERA** to grant webcam access and start rendering

```bash
# Production build
pnpm build
pnpm start
```

---

## Project Structure

```
ascii-art/
├── app/
│   ├── layout.tsx                    # Root layout — DM Mono font, global metadata
│   ├── globals.css                   # Design tokens, scanlines, glow effects, scrollbar
│   ├── page.tsx                      # Landing page (animated hero, features, CTA)
│   └── studio/
│       ├── page.tsx                  # Studio page — composes all hooks and UI
│       ├── types.ts                  # Shared TypeScript types and constants
│       ├── hooks/
│       │   ├── useCamera.ts          # Webcam MediaStream lifecycle
│       │   ├── useAsciiEngine.ts     # Core rendering loop (rAF, ASCII, Sobel, export)
│       │   └── useMediaPipe.ts       # Lazy MediaPipe segmenter loader + segment fn
│       └── components/
│           ├── AsciiCanvas.tsx       # Canvas display + scanline overlay + loading states
│           ├── TopBar.tsx            # FPS counter, resolution, quick toggles, export buttons
│           └── ControlPanel.tsx      # All sliders, color pickers, char set selector
├── public/                           # Static assets
├── next.config.ts                    # COEP/COOP headers required for MediaPipe WASM
├── CLAUDE.md                         # Claude Code project instructions
└── package.json
```

### Key File Roles

| File | Responsibility |
|---|---|
| `studio/types.ts` | Single source of truth for all types, constants (`CHAR_SETS`, `BG_COLOR_VALUES`, `COLOR_MODE_PREVIEW`) and `DEFAULT_SETTINGS` |
| `hooks/useCamera.ts` | Owns `MediaStream`, exposes `videoRef` + start/stop — no rendering logic |
| `hooks/useAsciiEngine.ts` | All pixel processing: offscreen canvas sampling, ASCII mapping, Sobel kernels, rAF loop, FPS tracking, PNG export, clipboard copy |
| `hooks/useMediaPipe.ts` | Dynamically imports `@mediapipe/tasks-vision` only when enabled — avoids loading the 35MB WASM bundle on page load |
| `components/ControlPanel.tsx` | Pure UI — receives `settings` + `onChange` callback, emits typed updates |
| `studio/page.tsx` | State owner — holds `AsciiSettings` in `useState`, wires all three hooks together |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        studio/page.tsx                          │
│                    (AsciiSettings state)                        │
│                                                                 │
│  ┌────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  useCamera     │  │ useAsciiEngine  │  │ useMediaPipe    │  │
│  │                │  │                 │  │                 │  │
│  │ videoRef ──────┼──▶ reads video     │  │ segment() fn ───┼──▶ engine  │
│  │ isReady        │  │ offscreen canvas│  │ isLoaded        │  │
│  │ startCamera()  │  │ canvasRef       │  │ isLoading       │  │
│  └────────────────┘  │ stats (fps/res) │  └─────────────────┘  │
│                      │ exportPNG()     │                        │
│                      │ copyText()      │                        │
│                      └─────────────────┘                        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  TopBar      │  │ AsciiCanvas  │  │   ControlPanel       │  │
│  │  (stats +    │  │  (canvasRef  │  │   (settings +        │  │
│  │   toggles)   │  │   + overlay) │  │    onChange)         │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### State Management

All settings live in a single `AsciiSettings` object in `studio/page.tsx`. Changes from `ControlPanel` and `TopBar` flow up via a generic `onChange<K>(key, value)` callback. The engine reads settings through a `settingsRef` that stays in sync via a `useEffect` — this prevents the rAF loop from restarting on every setting change.

```
ControlPanel → onChange("columns", 100) → setSettings → settingsRef.current updated
                                                       → next rAF tick reads new value automatically
```

---

## Data Flow

### Frame Rendering Pipeline

Each animation frame (up to 30fps) executes this pipeline:

```
Webcam (HTMLVideoElement)
        │
        ▼
Offscreen Canvas (cols × rows)
  drawImage — scales video down to ASCII resolution
  mirror transform if mirrorH = true
        │
        ▼
getImageData → Uint8ClampedArray [R,G,B,A, R,G,B,A, ...]
        │
        ▼
Per-pixel processing:
  1. Grayscale:   gray = 0.299·R + 0.587·G + 0.114·B
  2. Invert:      gray = 255 - gray  (if invertBrightness)
  3. Contrast:    gray = clamp((gray - 128) × contrast + 128, 0, 255)
  4. Sobel:       gray = √(Gx² + Gy²) from 3×3 neighborhood  (if edgeMode)
        │
        ▼
Char mapping:
  charIndex = floor(gray / 255 × (charSet.length - 1))
  char      = CHAR_SETS[settings.charSet][charIndex]
        │
        ▼
MediaPipe mask (optional):
  Uint8Array[256×256] — value 1 = person, 0 = background
  Remapped to cols×rows via nearest-neighbor
  Foreground → full color  |  Background → dimmed #2a2a2a
        │
        ▼
Color resolution:
  colorFromVideo → rgb(R, G, B) from source pixel
  rainbow        → hsl(col/cols × 360, 100%, 60%)
  heatmap        → hsl(240 - gray/255 × 240, 100%, 55%)
  others         → fixed hex constant
        │
        ▼
Output Canvas (cols × charSize  ×  rows × charSize)
  ctx.fillText(char, x, y) per cell
  — also used as PNG export source via canvas.toDataURL()
        │
        ▼
AsciiCanvas component renders the output canvas
Scanline CSS overlay applied on top
```

### Sobel Edge Detection

The Sobel operator samples a 3×3 pixel neighborhood to approximate the image gradient:

```
Gx kernel          Gy kernel
-1  0  +1          -1  -2  -1
-2  0  +2           0   0   0
-1  0  +1          +1  +2  +1

magnitude = √(Gx² + Gy²)  →  replaces brightness for char mapping
```

High magnitude = sharp edge = bright character. Low magnitude = flat area = space/dark character. This produces a wire-frame silhouette effect rather than a filled portrait.

### FPS Tracking

A rolling 30-frame window of `performance.now()` timestamps tracks actual render throughput. The displayed FPS value updates at most once every 500ms to prevent jitter.

---

## Customization Options

### Character Sets

| Name | Characters (abbreviated) | Best for |
|---|---|---|
| `standard` | ` .,:;i1tfLCG08@` | General use, smooth gradients |
| `simple` | ` .:-=+*#%@` | Clean, readable output |
| `detailed` | 70-char ramp | Fine detail, portraits |
| `blocks` | ` ░▒▓█` | Bold, graphic look |
| `binary` | `01` | Matrix / hacker aesthetic |
| `braille` | `⠁⠃⠇⡇⣇⣧⣷⣿` | Dense, unique texture |
| `matrix` | Katakana half-width | Cinematic Japanese terminal |
| `dots` | ` ·•●` | Minimal, clean |
| `slashes` | ` /|\-` | Geometric, sharp |
| `numbers` | `1234567890` | Countdown / retro computer |

### Color Modes

| Mode | Behavior |
|---|---|
| `matrix` | Fixed `#00FF41` — classic green terminal |
| `rainbow` | Hue shifts across columns: `hsl(col/cols × 360, 100%, 60%)` |
| `heatmap` | Blue (dark) → red (bright): `hsl(240 - gray/255 × 240, 100%, 55%)` |
| `colorFromVideo` | Each character uses the real `rgb(R,G,B)` from the source pixel |
| All others | Fixed hex: cyan, amber, red, violet, white, neon, gold, pink, aqua |

---

## MediaPipe Integration

MediaPipe's **selfie segmenter** model is loaded lazily — only when the user enables the toggle. The ~35MB WASM bundle is never fetched on page load.

```
User enables toggle
        │
        ▼
useMediaPipe useEffect fires
        │
        ▼
Dynamic import("@mediapipe/tasks-vision")
FilesetResolver → WASM from jsDelivr CDN (@0.10.34)
ImageSegmenter → selfie_segmenter.tflite from Google Storage
runningMode: "VIDEO", outputCategoryMask: true, delegate: GPU
        │
        ▼
isLoaded = true → segment() function becomes active
        │
        ▼
Each frame: segmentForVideo(video, timestamp)
  → categoryMask.getAsUint8Array() → copy → result.close()
  → Uint8Array[256×256]  (1 = person, 0 = background)
        │
        ▼
Nearest-neighbor remap to cols×rows:
  maskCol = floor(col / cols × 256)
  maskRow = floor(row / rows × 256)
        │
        ▼
Person pixels → selected colorMode at full brightness
Background pixels → dimmed #2a2a2a
```

> **COEP/COOP headers** are required in `next.config.ts` for the browser to load SharedArrayBuffer, which MediaPipe's WASM runtime depends on.

---

## Export

### PNG

Calls `canvas.toDataURL("image/png")` on the output canvas and triggers a download. The PNG captures exactly what is on screen at the moment of export — including the current character set, color mode, and resolution.

### ASCII Text

Each frame accumulates characters into a string (`lastFrameText` ref), separated by `\n` at row boundaries. The **COPY TEXT** button calls `navigator.clipboard.writeText()` with the most recent frame. Paste the result into any text editor for a static ASCII art snapshot.

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| Next.js | 16.2.4 | App Router framework, font optimization, headers config |
| React | 19.2.4 | UI and hooks |
| TypeScript | 5 | Full type safety across all files |
| Tailwind CSS | 4 | Utility classes, CSS custom properties via `@theme` |
| Motion | 12.38.0 | Landing page animations (`useAnimate`, `stagger`, `motion`) |
| @mediapipe/tasks-vision | 0.10.34 | GPU-accelerated selfie body segmentation |
| pnpm | — | Package manager |

### Browser APIs Used

- `navigator.mediaDevices.getUserMedia` — webcam access
- `HTMLCanvasElement.getContext("2d")` — pixel sampling + ASCII rendering
- `requestAnimationFrame` — 30fps render loop
- `navigator.clipboard.writeText` — ASCII text copy
- `canvas.toDataURL("image/png")` — PNG export
- `performance.now()` — FPS measurement
