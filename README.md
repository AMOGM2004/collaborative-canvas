## 🎨 Collaborative Drawing Canvas

A real-time collaborative drawing application where multiple users can draw simultaneously on the same canvas.

## Features
- Real-time drawing synchronization
- Multiple drawing tools (brush, eraser)
- Adjustable brush size and colors
- Undo/Redo functionality
- Online user indicators
- Mobile touch support
 
---

## User Experience
- User join/leave notifications
- Connection status indicator
- Responsive layout
- Mobile and touch device support
- Clean and intuitive UI

---

## 🛠️ Technologies Used

## Frontend
- HTML5 Canvas
- Vanilla JavaScript
- CSS3
  
## Backend
- Node.js
- Express.js
- Socket.io
  
## Real-Time Communication
- WebSockets via Socket.io

---

## 📁 Project Structure
collaborative-canvas/
├── client/                    # Frontend files
│   ├── index.html             # Main HTML file
│   ├── style.css              # Styles
│   ├── app.js                 # Main application logic
│   └── websocket-client.js    # WebSocket client handling
├── server/                    # Backend files
│   ├── server.js              # Express + Socket.io server
│   └── drawing-state.js       # Canvas state management
├── package.json               # Project dependencies
├── README.md                  # Project documentation
└── ARCHITECTURE.md            # System architecture overview

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation


git clone <repository-url>
cd collaborative-canvas
