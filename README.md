
# 🎧 Exibeat API Documentation

## Base URL
```
http://localhost:3001/api
```

---

## 🔐 Auth Endpoints

### POST `/auth/register`
Registers a new user.

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "username": "exampleUser",
  "password": "examplePass",
  "role": "producer" // or "dj"
}
```

#### Responses
- `201 Created` — Success
- `400 Bad Request` — User exists or invalid data

---

### POST `/auth/login`
Logs in a user and returns a JWT token.

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "username": "exampleUser",
  "password": "examplePass"
}
```

#### Response
```json
{
  "token": "JWT_TOKEN"
}
```

---

## 🎵 Track Endpoints

### POST `/tracks/submit`
Submit a track (Producer only).

#### Headers
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

#### Body
```json
{
  "title": "Track Title",
  "djId": "DJ_USER_ID",
  "message": "Optional message to DJ"
}
```

#### Response
- `201 Created` — Track successfully submitted
- `403 Forbidden` — Only producers can submit

---

### GET `/tracks/dj/review-tracks`
Get all tracks submitted to a DJ (DJ only).

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Response
```json
[
  {
    "_id": "trackId",
    "title": "Track Title",
    "producer": { "_id": "userId", "username": "producer123" },
    ...
  }
]
```

---

### GET `/tracks/producer/submitted-tracks`
Get all tracks submitted by a producer (Producer only).

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Response
```json
[
  {
    "_id": "trackId",
    "title": "Track Title",
    "dj": { "_id": "userId", "username": "dj123" },
    ...
  }
]
```

---

## 💬 Message Endpoints

### POST `/messages/feedback`
Send feedback to a producer for a specific track (DJ only).

#### Headers
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

#### Body
```json
{
  "trackId": "TRACK_OBJECT_ID",
  "recipientId": "PRODUCER_USER_ID",
  "content": "Feedback content"
}
```

#### Response
- `201 Created` — Message saved
- `403 Forbidden` — Only DJs can send feedback

---

### GET `/messages/track/:trackId`
Get all messages for a track (DJ or Producer).

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Response
```json
[
  {
    "_id": "messageId",
    "track": "trackId",
    "sender": "userId",
    "recipient": "userId",
    "content": "Message content",
    "timestamp": "ISO Date",
    "read": false
  }
]
```

---

### PATCH `/messages/read/:messageId`
Mark a message as read.

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Response
- `200 OK` — Message marked as read
- `404 Not Found` — Invalid message ID
