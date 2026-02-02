# 🎨 Collaborative Drawing Canvas

A real-time multi-user drawing application where multiple people can draw simultaneously on the same canvas.

## ✨ Features
- Real-time drawing synchronization
- Multiple users with unique colors
- Brush and eraser tools
- Adjustable brush size and colors
- Undo/redo functionality
- User cursor tracking
- Online user list

## 🚀 Live Demo
[Click here to try the live demo](https://your-vercel-link.vercel.app)

## 📦 Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation
```bash
# Clone repository
git clone https://github.com/YOUR-USERNAME/collaborative-canvas.git

# Navigate to project
cd collaborative-canvas

# Install dependencies
npm install

# Start development server
npm run dev



🎯 How to Test with Multiple Users
Open the live demo in Chrome

Open same URL in Firefox (or another browser)

Open same URL in a private/incognito window

Start drawing in one window - you'll see it appear in others!

🛠️ Technologies Used
Frontend: HTML5 Canvas, Vanilla JavaScript, CSS3

Backend: Node.js, Express.js

Real-time: Socket.io (WebSockets)

Deployment: Vercel

📁 Project Structure
text
collaborative-canvas/
├── client/           # Frontend files
│   ├── index.html   # Main HTML file
│   ├── style.css    # Styles
│   ├── app.js       # Main application logic
│   └── websocket-client.js # WebSocket client
├── server/          # Backend files
│   ├── server.js    # Express + Socket.io server
│   └── drawing-state.js # Drawing state management
├── package.json     # Dependencies
└── README.md        # Documentation
