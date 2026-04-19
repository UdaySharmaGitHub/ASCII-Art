@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Terminal Mirror** — a real-time webcam-to-ASCII art converter built with Next.js 16, React 19, and MediaPipe AI. Users open the studio, grant camera access, and see their live video rendered as customizable ASCII characters. Uses **pnpm** as the package manager.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Animation | Motion 12 (Framer Motion-compatible API) |
| AI / Vision | `@mediapipe/tasks-vision` 0.10 — body segmentation |
| Language | TypeScript 5 (strict) |
| Font | DM Mono (Google Fonts, CSS variable `--font-dm-mono`) |
| Linting | ESLint 9 + `eslint-config-next` |

> **Note:** Next.js 16 has breaking changes. Read `node_modules/next/dist/docs/` before writing framework-specific code.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Serve production build
pnpm lint             # Run ESLint
```

## Architecture & File Structure

```
app/
├── layout.tsx              # Root layout — sets DM Mono font, page metadata
├── page.tsx                # Landing page — hero, features, CTA, animated ASCII
├── globals.css             # CSS variables, Tailwind theme, glow/scanline effects
└── studio/
    ├── page.tsx            # Studio orchestrator — wires hooks, manages settings state
    ├── types.ts            # AsciiSettings interface, CharSetName/ColorMode enums,
    │                       #   DEFAULT_SETTINGS, CHAR_SETS, color maps
    ├── components/
    │   ├── AsciiCanvas.tsx # <canvas> rendering + loading overlay
    │   ├── TopBar.tsx      # Live stats (FPS, cols, rows) & quick toggles
    │   └── ControlPanel.tsx# Sliders/dropdowns for all AsciiSettings
    └── hooks/
        ├── useCamera.ts        # Webcam access, video element lifecycle
        ├── useMediaPipe.ts     # Loads MediaPipe, runs body segmentation per frame
        └── useAsciiEngine.ts   # Core render loop: video pixels → ASCII characters
```

### Data flow

```
Webcam → useCamera (video element)
           ↓
       useMediaPipe (body segmentation mask)
           ↓
       useAsciiEngine (pixel sampling → char + color mapping)
           ↓
       AsciiCanvas (draws to <canvas> at ~30 FPS)
```

### Key design notes

- `next.config.ts` sets `Cross-Origin-Embedder-Policy` and `Cross-Origin-Opener-Policy` headers — required for SharedArrayBuffer used by MediaPipe workers. Do not remove these.
- `tsconfig.json` path alias `@/*` maps to the repo root.
- Canvas uses `image-rendering: pixelated` (set in `globals.css`) to keep characters crisp.
- All configurable render options live in `AsciiSettings` (`studio/types.ts`) — add new options there first.

## Skills

| Skill | Invoke | Purpose |
|-------|--------|---------|
| `frontend-design` | `/frontend-design` | Build production-grade, visually distinctive frontend UI — avoids generic AI aesthetics |

Skills live in [.claude/skills/](.claude/skills/).

## Notes

- TypeScript only — no plain `.js` source files.
- No test framework configured yet.
