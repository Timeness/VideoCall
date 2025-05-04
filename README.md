# Video Call App

A modern, end-to-end encrypted video calling application built with React, Node.js, Socket.IO, and WebRTC.

## Setup

### Backend
1. Navigate to `server/`.
2. Run `npm install`.
3. Create a `.env` file with `PORT` and `FRONTEND_URL`.
4. Run `npm start` or `npm run dev`.

### Frontend
1. Navigate to `client/`.
2. Run `npm install`.
3. Create a `.env` file with `REACT_APP_SERVER_URL`.
4. Run `npm start`.

## Features
- End-to-end encrypted video calls using WebRTC (DTLS/SRTP).
- Modern, responsive UI.
- Room-based video calls.
- Toggle video/audio controls.

## Notes
- Ensure HTTPS in production for WebRTC to work.
- Use a STUN/TURN server for NAT traversal in production.
