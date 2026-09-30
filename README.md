# 💾 VISHAL OS 98 — Interactive Developer Portfolio

**Vishal OS 98** is a nostalgic, highly interactive Windows 98 / DOS-inspired operating-system-style portfolio built to showcase the full-stack engineering, machine learning, and AI capabilities of Vishal Sinha. 

Unlike standard web portfolios, this project functions as a complete web-based operating system featuring a centralized virtual filesystem, custom window management, a global Web Audio synthesis engine, and a fully integrated voice-controlled AI assistant.

---

## 🏗️ System Architecture

### Frontend (React + Vite)
- **Framework:** React 18 / Vite
- **Styling:** Tailwind CSS v4 (Custom retro styling, CSS grid/flexbox, pixel-perfect borders)
- **Window Management:** `react-draggable` paired with a custom `useWindowManager` hook for active focus, z-index stacking, and taskbar integration.
- **Audio:** Web Audio API (`SoundManager` singleton) for synthesized system beeps, clicks, and startup/shutdown chimes. No external `.mp3` or `.wav` files are used.
- **State Persistence:** `localStorage` and `sessionStorage` manage desktop icon positions, volume/mute states, customized OS themes, and user-created text files.

### Backend (Django API)
- **Framework:** Python / Django REST Framework
- **Endpoints:**
  - `/api/system-apps/` — Serves dynamic projects, tech stacks, and GitHub/Live links.
  - `/api/about-us/` — Serves the administrator profile, social links, and PDF resume URL.
  - `/api/voice-assistant/` — Connects the frontend to a Neural Net interface (e.g., Groq/Gemini) for the LUMA.EXE assistant.
- **Resilience:** The frontend includes an "Offline Safety Net." If the Django backend is sleeping or unreachable, the OS falls back to a complete suite of static local applications so the portfolio remains 100% functional.

---

## ⚙️ Core OS Features

### 📁 Virtual Filesystem (VFS)
A centralized `useFileSystem` hook acts as the single source of truth. It dynamically merges static OS tools, dynamic backend projects, and user-created text files into a traversable directory tree (`C:\Windows`, `C:\Projects`, `C:\Documents`). This data is universally accessible by the **File Explorer**, **Recycle Bin**, and **MS-DOS Command Prompt**.

### 🪟 Window Manager
A robust, prop-drilled window management system ensuring windows cannot be trapped behind the desktop or each other. Features include minimize to taskbar, maximize, active title-bar highlighting, and strict mobile viewport bounding to prevent horizontal scroll overflow on small screens.

### 🔊 Global Sound System
A `SoundManager` class utilizes a global `MasterGain` node. Adjusting the volume or muting via the Taskbar System Tray mathematically scales the entire OS sound output in real-time.

### 🎨 Professional SVG Icon Registry
To maintain a strict 1990s aesthetic, the OS uses zero emojis. Every icon—from the File Explorer nodes to the MS Paint tools—is drawn from a centralized, pixel-perfect SVG registry (`src/utils/icons.js`) utilizing `image-rendering: pixelated`.

### 🧠 LUMA.EXE (AI Assistant)
A built-in desktop virtual assistant utilizing the browser's native `SpeechRecognition` and `SpeechSynthesis` APIs, wired to the Django backend. It features voice-activation, conversational memory, strict React lifecycle cleanup (preventing memory leaks on unmount), and retro ASCII facial expressions.

---

## 🚀 Installation & Development

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A running instance of the Vishal OS Django Backend (optional, as offline fallback is supported)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/vishalsinha2004/vishal-os-98.git](https://github.com/vishalsinha2004/vishal-os-98.git)
   cd vishal-os-98