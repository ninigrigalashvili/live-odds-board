# 🎯 Live Odds Board

A React application displaying 10,000+ live sports matches with real-time odds updates.

## ✨ Features

- **10,000+ Live Matches** with virtualized scrolling
- **Real-time Updates** every 2 seconds via mock WebSocket
- **Visual Highlights** - Green/red flashes for odds changes (1-second duration)
- **Clickable Odds Selection** - Select/deselect betting options
- **Persistent State** - Selected odds and scroll position saved on reload
- **Multi-Sport Support** - Soccer, Basketball, Tennis, Baseball, Football, Hockey

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 🛠️ Tech Stack

- React 18 + TypeScript + Vite
- Chakra UI v3
- react-window (virtualization)
- Mock WebSocket for live updates

## 📋 Requirements Implemented

✅ Display 10,000+ live matches
✅ Sport icon, team names, match time, score, betting options
✅ Click to select odds
✅ Virtual scrolling with react-window
✅ 1-second highlights (green=increase, red=decrease)
✅ Selected odds remembered on scrolling
✅ State persisted on page reload
✅ Mock WebSocket with random odds changes

## 🚀 Build & Deploy

```bash
npm run build
```
