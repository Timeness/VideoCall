# ConnectSphere - End-to-End Encrypted Video Call App

A modern, secure video calling app supporting up to 4 users per room, built with Next.js, Express.js, WebRTC, and Socket.IO. Features end-to-end encrypted signaling and a stylish UI with the Viga font.

## Features
- Up to 4 users can join a room and see/hear each other.
- End-to-end encrypted signaling using Web Crypto API.
- WebRTC for secure peer-to-peer video/audio streaming.
- Cool, dark-themed UI with neon accents and Viga font.
- Responsive design with Tailwind CSS.

## Setup

### Backend
1. Navigate to `server/`.
2. Run `npm install`.
3. Run `npm run dev` to start the server on `http://localhost:5000`.

### Frontend
1. Navigate to `client/`.
2. Run `npm install`.
3. Run `npm run dev` to start the Next.js app on `http://localhost:3000`.

### Testing
1. Open `http://localhost:3000` in multiple browser tabs (up to 4).
2. Create a room in one tab and join it from others using the room ID.
3. Test video, audio, mute, and end call features.

## Deployment
- **Frontend**: Deploy to Vercel by pushing `client/` to a Git repository.
- **Backend**: Deploy to Heroku by pushing `server/` and configuring environment variables.

## Notes
- Requires camera and microphone access.
- For production, implement secure key exchange (e.g., ECDH) and use TURN servers for NAT traversal.
- Extend with features like screen sharing or chat using additional libraries.

## License
MIT
