# Video Call App

A modern, end-to-end encrypted video calling application built with React, Node.js, Socket.IO, and WebRTC.

## Setup

1. Run `npm run install-all` to install dependencies for both client and server.
2. Create `.env` files:
   - `server/.env`:
     ```
     PORT=5000
     FRONTEND_URL=http://localhost:3000
     ```
   - `client/.env`:
     ```
     REACT_APP_SERVER_URL=http://localhost:5000
     ```
3. Run `npm start` to start both the frontend and backend simultaneously.

## Features
- End-to-end encrypted video calls using WebRTC (DTLS/SRTP).
- Modern, responsive UI.
- Room-based video calls.
- Toggle video/audio controls.

## Notes
- Ensure HTTPS in production for WebRTC to work.
- Use a STUN/TURN server for NAT traversal in production.
