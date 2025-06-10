# CommonRoom

A full-stack real-time chat application that enables users to create private rooms, join existing rooms, and communicate instantly through secure WebSocket connections.

##  Features

- **Room Management**: Create private chat rooms with unique identifiers
- **Real-time Messaging**: Instant message delivery using WebSocket connections
- **User Authentication**: Secure JWT-based authentication system
- **Private Rooms**: Join rooms using room codes or invitations
- **Active Session Management**: Redis-powered active room tracking
- **Message Caching**: Recent messages cached for improved performance
- **Real-time User Presence**: See who's currently active in rooms

## Tech Stack

### Frontend
- **ReactJS** 
- **Tailwind CSS** 
- **WebSocket Client** 
- **Vite**

### Backend
- **Node.js** 
- **Express.js** 
- **MongoDB**
- **Redis** - In-memory data store for caching and session management
- **WebSocket Server** - Real-time bidirectional communication (ws library)
- **JWT (JSON Web Tokens)** - Secure authentication mechanism
- **bcrypt** - Password hashing for security

##  Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (v4.0 or higher)
- **Redis** (v6.0 or higher)

##  Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/swapnilsaahu/commonroom.git
cd commonroom
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=30d
REDIS_URL=redis://localhost:6379
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_WEBSOCKET_URL=ws://localhost:3000
```
Configure the `vite.config.js` file
```
 plugins: [react(), tailwindcss()],
    server: {
        host: '0.0.0.0',
        porxy: {
            '/api': {
                target: `${import.meta.env.VITE_API_BASE_URL}`,
                changeOrigin: true,
            }
        }
    }
}
```

### 4. Database Setup

**MongoDB:**
- Ensure MongoDB is running on your system
- The application will automatically create the necessary collections

**Redis:**
- Start Redis server at default port by redis 6379:
```bash
redis-server
```

##  Running the Application


1. **Start Redis** (if not already running):
```bash
redis-server
```

2. **Start the Backend Server**:
```bash
cd backend/src
npm run dev
# Server runs on http://localhost:3000
# WebSocket server also runs on ws://localhost:3000
```

3. **Start the Frontend Development Server**:
```bash
cd frontend
npm run dev
# Application runs on http://localhost:5173
```

##  Project Structure

```
commonroom/
├── backend/src
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Authentication & validation
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── utils/               # Helper functions
│   ├── websocket/ 			 # WebSocket server setup
│   ├──db					 # Database connection
│   ├──zodSchema			 # Zod Schema for input validations
│   ├── app.js               # Express app configuration
│   ├── constant.js 		 # For constant values
│   └── index.js             # Server entry point
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable React components
    │   ├── pages/           # Page components
    │   ├── hooks/           # Custom React hooks
    │   ├── services/        # API calls & WebSocket setup
    │   ├── utils/           # Helper functions
    │   ├── contexts/        # React context providers
    │   └── App.jsx          # Main App component
    │   └── main.jsx
    ├── public/              # Static assets
    └─ index.html            # HTML template
    └─ vite.config.js
```


##  WebSocket Events

### Client to Server
- `create`: createRoomMessage
- `join` joinRoomMessage
- `sendMessage`: sendRoomMessage
- `onMountMessages`: getLastNMessagesOnMount
- `getUsers`: getActiveUsers,
- `reconnect`: reconnectRoom

### Server to Client
-`created`: Room created successfully
-`joinde`: User joined the room
-`onmessage`: When room gets a message
-`onMountMessages`: received messages on mount of the component
-`reconnect`:reconnected to the server to persist refresh


