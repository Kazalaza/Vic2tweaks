# Victoria II Modern Launcher (Electron + React)

A production-style modern launcher replacement for **Victoria II** with a dark-first UI inspired by modern Paradox/Steam UX.

## Stack

- Electron 31
- Vite + React 19 + TypeScript
- Tailwind CSS + Radix UI primitives + shadcn-style components
- `electron-store` for persistence
- `fs-extra` + `child_process` for scanning and launching
- `lucide-react` icons

## Features

- Steam/registry auto-detection of game install path
- Manual folder picker with persistent storage
- Mod scanning in Documents + game `mod/` folders
- `.mod` metadata parsing (name, author, description, dependencies, picture, supported version)
- Search and filter mod list
- Presets system with built-ins: **Vanilla**, **Quick Launch**, **Last Session**
- Remember-last-launch workflow with one-click continue
- Big one-click PLAY action with mod argument generation
- DLC detection
- Settings controls for launch behavior and custom args
- Steam game file verification shortcut

## Quick Start

```bash
npm install
npm run dev
```

## Build (production bundles)

```bash
npm run build
```

## Package as a real Windows app (installer + portable)

```bash
npm run dist
```

Artifacts are generated under `dist/`:
- `Victoria II Modern Launcher-<version>.exe` (NSIS installer)
- `Victoria II Modern Launcher-<version>-portable.exe` (portable app)

## Optional: App icon

Place a Windows icon at:

```text
build/icon.ico
```

The `build/` directory is already configured as Electron Builder resources directory.

## Project structure

```text
src/
  main/         # Electron main process
  preload/      # Secure preload bridge
  renderer/
    components/
    hooks/
    pages/
    lib/
    types/
build/          # Electron Builder resources (icon, etc.)
```

## Usage

1. Start launcher and let it auto-detect Victoria II.
2. If not detected, go to **Settings → Browse** and select game folder containing `v2game.exe`.
3. Enable mods in **Mods** tab.
4. Save/load combinations in **Presets**.
5. Click **PLAY** from top bar.
