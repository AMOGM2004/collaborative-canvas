# Collaborative Canvas - Architecture

## System Overview
A real-time collaborative drawing application using WebSockets for instant synchronization between multiple users.


## Data Flow Diagram
┌─────────┐ WebSocket ┌─────────┐ Broadcast ┌─────────┐
│ Client │ ────────────────> │ Server │ ────────────────> │ All │
│ (User 1)│ <──────────────── │ (Node.js│ <──────────────── │ Other │
└─────────┘ Events │ + WS) │ Events │ Clients │
└─────────┘ └─────────┘

   