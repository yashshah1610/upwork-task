
# Task 3: Scoreboard Module Specification

Build a **Scoreboard API** that allows users to create games and update/view scores in real-time or on request.

---

## 🛠️ Features

- Create Game
- Add Player to Game
- Update Score
- Get Scoreboard (with ranking)
- Delete Player/Game
- Authorization via JWT
- Optional Enhancements: Caching, Session Management

---

## 📦 Project Structure (Suggestion)

```
task3-scoreboard/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── entities/
│   ├── middlewares/
│   ├── routes/
│   └── utils/
├── .env
├── ormconfig.ts
└── index.ts
```

---

## 📄 Entity Models

#### A. `user` Table
| Column     | Type    | Notes              |
|------------|---------|--------------------|
| id         | UUID    | Primary key        |
| name       | String  | Required           |
| created_at | Date    | Default: now()     |

#### B. `game` Table
| Column     | Type    | Notes              |
|------------|---------|--------------------|
| id         | UUID    | Primary key        |
| title      | String  | Required           |
| created_at | Date    | Default: now()     |

#### C. `score` Table
| Column     | Type    | Notes                      |
|------------|---------|----------------------------|
| id         | UUID    | Primary key                |
| user_id    | UUID    | FK → `user(id)`            |
| game_id    | UUID    | FK → `game(id)`            |
| score      | Number  | Required                   |
| created_at | Date    | Default: now()             |

---

## 🔐 Authentication & Authorization

### Auth Flow

- A `/login` or `/auth` route generates a JWT token upon valid credentials.
- This token must be passed as a Bearer Token in every API request.

```http
Authorization: Bearer <your_jwt_token>
```

### Middleware Example

```ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden" });
  }
};
```

### Why this matters?

- Prevents unauthorized or malicious users from manipulating scores or accessing data.
- Ensures request-level verification before DB actions.

---

## 📡 API Endpoints

## 📥 Request/Response Payloads

### POST `/auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "your.jwt.token.here"
}
```

---

### POST `/games`

**Request:**
```json
{
  "title": "Weekend Cricket Match"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Weekend Cricket Match",
  "createdAt": "2025-08-03T10:00:00Z"
}
```

---

### GET `/games/:id`

**Response:**
```json
{
  "id": 1,
  "title": "Weekend Cricket Match",
  "players": [
    {
      "id": 1,
      "name": "John",
      "score": 42
    },
    {
      "id": 2,
      "name": "Alice",
      "score": 30
    }
  ]
}
```

---

### POST `/games/:id/players`

**Request:**
```json
{
  "name": "Bob"
}
```

**Response:**
```json
{
  "id": 3,
  "name": "Bob",
  "score": 0
}
```

---

### PATCH `/players/:id/score`

**Request:**
```json
{
  "score": 55
}
```

**Response:**
```json
{
  "id": 3,
  "name": "Bob",
  "score": 55
}
```

---

### GET `/games/:id/scoreboard`

**Response:**
```json
{
  "gameId": 1,
  "scoreboard": [
    { "name": "Bob", "score": 55 },
    { "name": "John", "score": 42 },
    { "name": "Alice", "score": 30 }
  ]
}
```

---

### DELETE `/players/:id`

**Response:**
```json
{
  "message": "Player deleted successfully."
}
```

---

### DELETE `/games/:id`

**Response:**
```json
{
  "message": "Game deleted successfully."
}
```

---
---

## 💡 Additional Security and Performance Enhancements

### 1. Session Management

- Consider Redis to store session tokens for added security.
- Limit login sessions per user to prevent misuse.

### 2. Rate Limiting

- Use libraries like `express-rate-limit` to limit abuse per IP.
- Protects from brute force or denial-of-service attacks.

### 3. Caching with Redis

- Cache scoreboard results using Redis to reduce DB hits.
- Useful for high-frequency access (like live scoreboards).

```ts
await redisClient.set(`scoreboard:${gameId}`, JSON.stringify(scoreboard), 'EX', 60);
```

### 4. Input Validation

- Sanitize input using `class-validator` or `zod`.
- Prevent injection or malformed data.

### 5. Logging & Monitoring

- Use `winston` or `pino` for logging API usage/errors.
- Integrate with tools like Datadog or Sentry.

---

## 🧪 Testing Strategy

- Unit tests for each service layer using `jest`
- Integration tests for major APIs
- Auth and permission test cases

---

## 🧳 Deployment Notes

- Store secrets in `.env` and never hard-code.
- Enable HTTPS in production.
- Use PM2 or Docker for better process control.

---
---

🔌 Real-Time Updates with Socket.IO

To enhance the user experience and ensure all connected clients see real-time changes in the game, we recommend integrating Socket.IO on both the client and server sides.

🧩 Integration Flow

1. Establishing a Socket Connection

+ When the client connects to the game page, it opens a WebSocket connection:
+ The server authenticates the token before accepting the connection.

```ts
const socket = io("https://your-api-domain.com", {
  auth: { token: "JWT_TOKEN_HERE" }
});
```

2. Joining Game Rooms

After connection, the client joins a room based on the game ID:

```ts
socket.emit("join_game", { gameId: "1234" });
```

3. Server Side Room Handling

```ts
socket.on("join_game", ({ gameId }) => {
  socket.join(`game_${gameId}`);
});
```

4. Emitting Events from Server

On key events like player joined, score updated, or player removed, emit updates to that game room:

```ts
io.to(`game_${gameId}`).emit("player_added", newPlayerData);
io.to(`game_${gameId}`).emit("score_updated", updatedScoreData);
io.to(`game_${gameId}`).emit("player_removed", { playerId });
```

5. Client-Side Event Listening

The front end listens for updates and re-renders accordingly:

```ts
socket.on("score_updated", (data) => {
  updateScoreboardUI(data);
});

socket.on("player_added", (player) => {
  addPlayerToList(player);
});

socket.on("player_removed", ({ playerId }) => {
  removePlayerFromList(playerId);
});
```

🔐 Socket Authentication

+ Use the same JWT used for API calls
+ Server validates it on socket connection using middleware:

```ts
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});
```