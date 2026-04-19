ASCII Art Camera App — Full Implementation Plan
Context
Building a real-time ASCII art camera web app ("Terminal Mirror") on top of an existing Next.js 16 / React 19 / Tailwind 4 project. The current repo has only the create-next-app boilerplate. The app captures webcam video, converts frames to ASCII art at up to 30fps, and optionally uses MediaPipe's selfie segmenter to style foreground (person) vs background differently. A cinematic landing page introduces the app with a bold retro-terminal aesthetic.

Aesthetic Direction: "Terminal Mirror"
Background: near-black #0A0A0A with noise texture overlay
Primary: phosphor amber #FF9B21 / Secondary: electric teal #00FFD1
Font: DM Mono throughout (monospace fits ASCII art content)
Effects: scanline overlay on canvas, phosphor glow on CTA, character cascade animation on landing hero
New Package to Install
pnpm add @mediapipe/tasks-vision
Files to Create / Modify
File	Action
app/layout.tsx	Modify — swap to DM Mono font, update metadata title
app/globals.css	Modify — add design tokens, scanlines, noise-bg, phosphor-glow, scrollbar styles
next.config.ts	Modify — add COEP/COOP headers for WASM
app/page.tsx	Replace — cinematic landing page
app/studio/types.ts	Create — all shared TypeScript types
app/studio/hooks/useCamera.ts	Create — webcam MediaStream management
app/studio/hooks/useAsciiEngine.ts	Create — rAF loop, ASCII conversion, Sobel, export
app/studio/hooks/useMediaPipe.ts	Create — lazy-load ImageSegmenter, segment fn
app/studio/components/AsciiCanvas.tsx	Create — canvas + scanline overlay display
app/studio/components/TopBar.tsx	Create — FPS, resolution, quick toggles, export buttons
app/studio/components/ControlPanel.tsx	Create — all sliders/selects/toggles
app/studio/page.tsx	Create — main studio layout, state, hook wiring
Key Types (app/studio/types.ts)
type CharSetName = "standard"|"simple"|"detailed"|"blocks"|"binary"|"braille"|"matrix"|"dots"|"slashes"|"numbers"
type ColorMode = "matrix"|"cyan"|"amber"|"red"|"violet"|"white"|"neon"|"gold"|"pink"|"aqua"|"rainbow"|"heatmap"
type BgColor = "black"|"darkGreen"|"darkBlue"|"darkRed"|"white"

interface AsciiSettings {
  charSet: CharSetName; colorMode: ColorMode; bgColor: BgColor
  columns: number; charSize: number; contrast: number
  colorFromVideo: boolean; invertBrightness: boolean
  mirrorH: boolean; edgeMode: boolean; mediaPipeEnabled: boolean
}

interface EngineStats { fps: number; cols: number; rows: number }
type SegmentationMask = Uint8Array | null
ASCII Engine Algorithm (inside useAsciiEngine)
Draw webcam video to offscreen canvas at cols × rows (rows auto-scaled to maintain aspect ratio with charAspect ≈ 0.55)
getImageData → per-pixel: compute grayscale, apply contrast stretch, optionally invert
Sobel mode: compute edge magnitude from 3×3 neighborhood using Gx/Gy kernels; substitute gray value
Map final gray (0–255) → char index into selected character set string
MediaPipe: call segmentFn(video, timestamp) → Uint8Array mask at 256×256; remap to cols×rows via nearest-neighbor; foreground = person, background = dimmed chars
Render each char with ctx.fillText on the visible canvas, color determined by colorMode (rainbow = HSL column-hue, heatmap = HSL gray-mapped, colorFromVideo = real RGB from source pixel)
Track FPS via 30-frame rolling average of performance.now() timestamps
ASCII text for clipboard: accumulate chars per row separated by \n into lastFrameText ref each tick; navigator.clipboard.writeText on copy action.
PNG export: canvas.toDataURL("image/png") → anchor click download.

MediaPipe Integration (useMediaPipe)
Dynamic import("@mediapipe/tasks-vision") inside useEffect — only when mediaPipeEnabled becomes true. Never imported at module scope (SSR safety).
Model: selfie_segmenter.tflite, WASM from jsDelivr CDN (pinned @0.10.34)
runningMode: "VIDEO", outputCategoryMask: true, delegate: GPU
segment(): call segmentForVideo(video, ts) → copy categoryMask.getAsUint8Array() → result.close() → return copy
next.config.ts must set Cross-Origin-Embedder-Policy: require-corp and Cross-Origin-Opener-Policy: same-origin for WASM to load
Landing Page (app/page.tsx)
Hero: hardcoded ASCII art face in <pre>, each char wrapped in <span data-char>, animated via useAnimate + stagger(0.006) — characters cascade in from below
Title: "TERMINAL MIRROR" in large DM Mono, amber, phosphor glow CSS class
Feature cards: 5 cards with box-drawing character borders (┌─┐ style), useInView + motion.div for scroll reveal
CTA: "Enter the Studio" → /studio, amber border + glow on hover, scale transform
Motion imports: import { useAnimate, useInView, stagger, motion } from "motion/react"

Studio Layout (app/studio/page.tsx)
┌─────────────────────────────────────────┐
│  TopBar (FPS · res · toggles · export)  │
├──────────────────────┬──────────────────┤
│                      │ ControlPanel     │
│   AsciiCanvas        │ (scrollable)     │
│   (60% width)        │ (40% width)      │
│                      │                  │
└──────────────────────┴──────────────────┘
Both columns are h-screen, canvas column uses flex-1
Control panel sections use box-drawing headers: ┌─ CHARACTERS ──┐
All controls styled with amber accents, dark panel bg
Character Sets
const CHAR_SETS = {
  standard:  " .,:;i1tfLCG08@",
  simple:    " .:-=+*#%@",
  detailed:  " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  blocks:    " ░▒▓█",
  binary:    "01",
  braille:   " ⠁⠃⠇⡇⣇⣧⣷⣿",
  matrix:    " ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀ",
  dots:      " ·•●",
  slashes:   " /|\\-",
  numbers:   " 1234567890",
}
Implementation Order
app/layout.tsx + app/globals.css — foundation (fonts, tokens, CSS utilities)
next.config.ts — COEP/COOP headers
app/studio/types.ts — types first
useCamera.ts → useAsciiEngine.ts (stub MediaPipe) → useMediaPipe.ts
AsciiCanvas.tsx → TopBar.tsx → ControlPanel.tsx
app/studio/page.tsx — wire everything, test full loop
Enable MediaPipe in engine, test with real camera
app/page.tsx — landing page last
Verification
pnpm dev → navigate to http://localhost:3000 → landing page loads with character cascade animation
Click "Enter the Studio" → /studio page loads, camera permission prompt appears
ASCII art renders live at 30fps; FPS counter visible
All 10 character sets, 12 fg colors, 6 bg colors selectable with immediate live preview
Resolution/size/contrast sliders update in real-time
Edge mode toggle switches to Sobel silhouette rendering
Enable MediaPipe → loading indicator → person "pops out" from dimmed background
Export PNG → file downloads; Copy Text → clipboard contains ASCII string
Mirror toggle flips horizontal; invert brightness toggle flips light/dark