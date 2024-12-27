# Virtuosa 1000 Desktop Interface

A retro-styled desktop interface built with React, TypeScript, and Tailwind CSS that emulates a classic Amiga-like operating system experience.

## Features

- Authentic retro desktop environment
- Realistic sound effects (keyboard, HDD, startup sounds)
- Draggable and resizable windows
- Program management system
- File browser with content viewer
- Token explorer with real-time data
- System logs viewer
- Web3 authentication
- WebSocket real-time connectivity

## Core Components

### Desktop Environment
- Window management system with z-index handling
- Start menu with program launcher
- Taskbar with active program tracking
- CRT screen effects and animations

### Authentication
- SIWE (Sign-In With Ethereum) implementation
- OAuth integrations (coming soon)
- Persistent session management

### Programs
- **Token Explorer**: Real-time token holder analytics with detailed metrics including:  
- **File Browser**: Navigate and view system files
- **System Logs (coming soon)**: Real-time system event monitoring with:
- **Terminal**: Interactive command-line interface
- **Settings (coming soon)**: System configuration interface with
- **Music Player**: Retro-style MOD music player
- **RPG Adventure**: Built-in game featuring Classic MultiplayerRPG gameplay

### Sound System
The interface features a comprehensive retro-styled sound system including:

- **Keyboard Sounds**: Authentic mechanical keyboard feedback with:
  - Unique sounds for Space, Enter, and Backspace
  - Randomized key press variations
  - Press and release sound pairs
  
- **System Sounds**:
  - Window open/close mechanical effects
  - HDD access with head movement sounds
  - CRT monitor effects and glitches
  - Menu interaction feedback
  - Startup/shutdown sequences
  - Login and Logout melodies

All system sounds are synthesized in real-time using the Web Audio API for authentic retro computing feel.

## Technical Stack

- React
- TypeScript
- Tailwind CSS
- Jotai (State Management)
- Web3 Integration (wagmi)
- WebSocket for Real-time Updates

## Getting Started

1. Install dependencies:
```bash
bun i
```

2. Start the development server:
```bash
bun dev
```

3. Build for production:
```bash
bun build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Enjoy your journey back to the golden age of computing with the Onchain Computer!
