class DrawingState {
    constructor() {
        this.strokes = [];
        this.users = new Map();
        this.userColors = new Map();
        this.cursors = new Map();
        this.undoStack = [];
        this.redoStack = [];
    }
    
    // User management
    addUser(userId, userData = {}) {
        // Generate random color for user
        const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        
        const user = {
            id: userId,
            color: color,
            cursor: { x: 0, y: 0 },
            joinedAt: new Date().toISOString(),
            ...userData
        };
        
        this.users.set(userId, user);
        this.userColors.set(userId, color);
        this.cursors.set(userId, { x: 0, y: 0 });
        
        console.log(`User ${userId} added with color ${color}`);
        return user;
    }
    
    removeUser(userId) {
        this.users.delete(userId);
        this.userColors.delete(userId);
        this.cursors.delete(userId);
        console.log(`User ${userId} removed`);
    }
    
    changeUserColor(userId, color) {
        if (this.users.has(userId)) {
            this.users.get(userId).color = color;
            this.userColors.set(userId, color);
            console.log(`User ${userId} color changed to ${color}`);
        }
    }
    
    updateCursor(userId, cursorData) {
        if (this.users.has(userId)) {
            this.users.get(userId).cursor = cursorData;
            this.cursors.set(userId, cursorData);
        }
    }
    
    getUsers(excludeUserId = null) {
        const users = Array.from(this.users.values());
        if (excludeUserId) {
            return users.filter(user => user.id !== excludeUserId);
        }
        return users;
    }
    
    // Stroke management
    addStroke(strokeData) {
        const stroke = {
            id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            userId: strokeData.userId,
            points: strokeData.points || [{ x: strokeData.x, y: strokeData.y }],
            color: strokeData.color || this.userColors.get(strokeData.userId) || '#000000',
            size: strokeData.size || 5,
            tool: strokeData.tool || 'brush',
            timestamp: strokeData.timestamp || Date.now(),
            type: strokeData.type || 'stroke'
        };
        
        this.strokes.push(stroke);
        console.log(`Stroke added: ${stroke.id} by ${stroke.userId}`);
        
        return stroke;
    }
    
    getStrokes() {
        return this.strokes.slice(); // Return copy
    }
    
    clearCanvas() {
        this.strokes = [];
        console.log('Canvas cleared');
    }
    
    undoLastStroke(userId) {
        if (this.strokes.length > 0) {
            const lastStroke = this.strokes.pop();
            this.undoStack.push(lastStroke);
            console.log(`Undo: Stroke ${lastStroke.id} removed`);
            return lastStroke;
        }
        return null;
    }
    
    redoLastStroke() {
        if (this.undoStack.length > 0) {
            const stroke = this.undoStack.pop();
            this.strokes.push(stroke);
            console.log(`Redo: Stroke ${stroke.id} restored`);
            return stroke;
        }
        return null;
    }
    
    // Get cursor data
    getCursor(userId) {
        return this.cursors.get(userId) || { x: 0, y: 0 };
    }
    
    // Get all cursors
    getAllCursors(excludeUserId = null) {
        const cursors = [];
        this.cursors.forEach((cursor, userId) => {
            if (!excludeUserId || userId !== excludeUserId) {
                cursors.push({
                    userId: userId,
                    cursor: cursor,
                    color: this.userColors.get(userId) || '#000000'
                });
            }
        });
        return cursors;
    }
    
    // Statistics
    getStats() {
        return {
            totalUsers: this.users.size,
            totalStrokes: this.strokes.length,
            totalUndo: this.undoStack.length,
            totalRedo: this.redoStack.length
        };
    }
    
    // Export/Import (for persistence)
    exportState() {
        return {
            strokes: this.strokes,
            users: Array.from(this.users.values()),
            cursors: Array.from(this.cursors.entries()),
            timestamp: Date.now()
        };
    }
    
    importState(state) {
        if (state.strokes) this.strokes = state.strokes;
        if (state.users) {
            this.users = new Map(state.users.map(user => [user.id, user]));
        }
        if (state.cursors) {
            this.cursors = new Map(state.cursors);
        }
        console.log('State imported:', this.getStats());
    }
}

module.exports = DrawingState;