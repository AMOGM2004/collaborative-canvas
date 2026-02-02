// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
// const path = require('path');
// const DrawingState = require('./drawing-state');

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// });


// // Serve static files from client folder
// app.use(express.static(path.join(__dirname, '../client')));

// // Basic route
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/index.html'));
// });

// // Create drawing state manager
// const drawingState = new DrawingState();

// // Socket.io connection handling
// io.on('connection', (socket) => {
//     console.log('New user connected:', socket.id);
    
//     // Add user to drawing state
//     const user = drawingState.addUser(socket.id, {
//         joinedAt: new Date().toISOString()
//     });
    
//     // Send existing state to new user
//     socket.emit('init', {
//         userId: socket.id,
//         color: user.color,
//         strokes: drawingState.getStrokes(),
//         users: drawingState.getUsers(socket.id)
//     });
    
//     // Notify other users about new user
//     socket.broadcast.emit('user-connected', {
//         userId: socket.id,
//         color: user.color,
//         cursor: user.cursor
//     });
    
//     // Handle drawing events
//     socket.on('draw-start', (data) => {
//         // Add stroke to state
//         const stroke = drawingState.addStroke({
//             ...data,
//             userId: socket.id,
//             userColor: user.color,
//             type: 'stroke-start'
//         });
        
//         // Broadcast to other users
//         socket.broadcast.emit('remote-draw-start', stroke);
//     });
    
//     socket.on('draw', (data) => {
//         // Update stroke in state
//         const stroke = drawingState.addStroke({
//             ...data,
//             userId: socket.id,
//             userColor: user.color,
//             type: 'stroke'
//         });
        
//         // Broadcast to other users
//         socket.broadcast.emit('remote-draw', stroke);
//     });
    
//     socket.on('draw-end', (data) => {
//         // Complete stroke in state
//         const stroke = drawingState.addStroke({
//             ...data,
//             userId: socket.id,
//             userColor: user.color,
//             type: 'stroke-end'
//         });
        
//         // Broadcast to other users
//         socket.broadcast.emit('remote-draw-end', stroke);
//     });
    
//     // Handle cursor movement
//     socket.on('cursor-move', (cursorData) => {
//         drawingState.updateCursor(socket.id, cursorData);
        
//         // Broadcast cursor position to other users
//         socket.broadcast.emit('remote-cursor-move', {
//             userId: socket.id,
//             cursor: {
//                 ...cursorData,
//                 color: user.color
//             }
//         });
//     });
    
//     // Handle color change
//     socket.on('color-change', (color) => {
//         drawingState.changeUserColor(socket.id, color);
        
//         // Broadcast color change
//         socket.broadcast.emit('remote-color-change', {
//             userId: socket.id,
//             color: color
//         });
//     });
    
//     // Handle clear canvas
//     socket.on('clear-canvas', () => {
//         drawingState.clearCanvas();
        
//         // Broadcast clear to all users
//         io.emit('remote-clear-canvas');
//     });
    
//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
        
//         // Remove user from state
//         drawingState.removeUser(socket.id);
        
//         // Notify other users
//         socket.broadcast.emit('user-disconnected', {
//             userId: socket.id
//         });
//     });
    
//     // Handle undo/redo (for future implementation)
//     socket.on('undo', () => {
//         // TODO: Implement global undo
//     });
    
//     socket.on('redo', () => {
//         // TODO: Implement global redo
//     });
// });

// // const PORT = process.env.PORT || 3000;
// // server.listen(PORT, () => {
// //     console.log(`Server running on http://localhost:${PORT}`);
// //        console.log(`WebSocket server ready for connections`);
// // });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// module.exports = server;



const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// For Vercel, use correct CORS settings
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    }
});

// Serve static files from client folder
app.use(express.static(path.join(__dirname, '../client')));

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Store connected users
const users = new Map();

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);
    
    // Assign random color to user
    const userColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
    users.set(socket.id, {
        id: socket.id,
        color: userColor,
        cursor: { x: 0, y: 0 }
    });
    
    // Send current users to the new user
    socket.emit('init', { 
        userId: socket.id, 
        color: userColor,
        users: Array.from(users.values())
    });
    
    // Notify others about new user
    socket.broadcast.emit('user-joined', users.get(socket.id));
    
    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        users.delete(socket.id);
        io.emit('user-left', socket.id);
    });
    
    // Handle drawing events
    socket.on('draw', (data) => {
        // Broadcast to all other users
        socket.broadcast.emit('draw', { 
            ...data, 
            userId: socket.id 
        });
    });
    
    // Handle cursor movement
    socket.on('cursor-move', (position) => {
        if (users.has(socket.id)) {
            users.get(socket.id).cursor = position;
            socket.broadcast.emit('cursor-update', {
                userId: socket.id,
                cursor: position
            });
        }
    });
});

// For Vercel deployment
const PORT = process.env.PORT || 3000;

// Only listen if not in Vercel serverless environment
if (process.env.VERCEL !== '1') {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel
module.exports = (req, res) => {
    // Handle HTTP requests
    app(req, res);
};

// Also export server for Socket.io
module.exports.server = server;
module.exports.io = io;