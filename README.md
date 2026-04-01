# 🤖 Smart Code Translator

An AI-powered full-stack web application that helps developers work across programming languages. Translate code, analyze complexity, optimize performance, and get beginner-friendly explanations — all powered by **Google Gemini AI**.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Code Translation** | Convert code between C, C++, C#, Java, and Python |
| **Complexity Analysis** | Analyze time and space complexity with Big-O notation |
| **Code Optimization** | Get AI-powered suggestions to improve code performance |
| **Code Explanation** | Understand code in beginner-friendly plain English |
| **Email/Password Auth** | Register and login with traditional credentials |
| **Google SSO** | One-click sign-in with Google OAuth |
| **Operation History** | Automatically save and browse past operations |
| **Monaco Code Editor** | Professional VS Code-like editor with syntax highlighting |

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- React Router DOM
- Axios (with JWT interceptor)
- Monaco Editor (`@monaco-editor/react`)
- Google OAuth (`@react-oauth/google`)
- React Hot Toast

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Google Auth Library
- Google Gemini AI (`@google/genai`)

---

## 📁 Project Structure

```
smart-code-translater/
├── client/                         # Frontend (React + Vite)
│   └── src/
│       ├── components/             # Reusable UI components
│       ├── context/                # Global state (AuthContext)
│       ├── pages/                  # Full page views
│       ├── services/               # API call functions
│       ├── constants/              # Static data (languages, prompts)
│       └── styles/                 # CSS files
└── server/                         # Backend (Express + MongoDB)
    └── src/
        ├── config/                 # DB, Gemini, Google OAuth config
        ├── constants/              # Prompt templates, language list
        ├── controllers/            # HTTP request handlers
        ├── middleware/             # Auth & error middleware
        ├── models/                 # Mongoose schemas
        ├── routes/                 # API route definitions
        ├── services/               # Business logic
        └── utils/                  # JWT & prompt utilities
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (Atlas or local)
- [Google Cloud Console](https://console.cloud.google.com/) account (for OAuth Client ID)
- [Google AI Studio](https://aistudio.google.com/) account (for Gemini API Key)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/smart-code-translater.git
cd smart-code-translater
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_api_key
```

Start the server:

```bash
npm run dev
```

### 3. Setup the Frontend

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the client:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🔑 Environment Variables

### Server (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on |
| `CLIENT_URL` | Frontend URL (used for CORS) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | JWT token validity duration (e.g., `7d`) |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |
| `GEMINI_API_KEY` | Google Gemini AI API key |

### Client (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login with email & password | No |
| POST | `/google` | Login with Google OAuth | No |
| GET | `/me` | Get current user profile | Yes |
| POST | `/logout` | Logout | Yes |

### Code Routes — `/api/code`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/translate` | Translate code between languages | Yes |
| POST | `/analyze` | Analyze time & space complexity | Yes |
| POST | `/optimize` | Optimize code with suggestions | Yes |
| POST | `/explain` | Explain code in plain English | Yes |

### History Routes — `/api/history`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/` | Get paginated operation history | Yes |
| GET | `/:id` | Get a single history entry | Yes |
| DELETE | `/:id` | Delete a history entry | Yes |
| DELETE | `/clear` | Clear all history | Yes |

---

## 🏗️ Architecture Overview

```
Client (React + Vite)
├── LoginPage ──── authService ──── API (Axios + JWT interceptor)
├── HomePage ───── codeService ─┐
│   ├── CodeEditor (Monaco)     │
│   ├── LanguageSelector        ├── POST /api/code/{action}
│   └── OutputPanel             │
└── HistoryPage ── historyService ── GET/DELETE /api/history

Server (Express + MongoDB)
├── Auth:  Routes → Controller → Service → User Model
├── Code:  Routes → Controller → Service → Gemini AI
└── Hist:  Routes → Controller → Service → History Model
```

### Request Flow (Code Operations)

```
Frontend (React)
    ↓ POST /api/code/translate (with JWT token)
Auth Middleware (verify token → attach user to request)
    ↓
Code Controller (validate input)
    ↓
Service Layer (build prompt → call Gemini AI → clean response)
    ↓
History Service (save result — fire and forget)
    ↓
Response → { success: true, data: result }
```

---

## 🔐 Authentication Flow

The app supports two sign-in methods:

**Email/Password**
1. User registers with name, email, and password
2. Password is hashed with bcrypt before storing
3. On login, bcrypt compares the plain-text password with the stored hash
4. A JWT token is issued and stored in localStorage
5. The Axios interceptor automatically attaches the token to every request

**Google SSO**
1. User clicks "Continue with Google"
2. Google returns a credential (ID token) to the frontend
3. Frontend sends the credential to the backend
4. Backend verifies the token using `google-auth-library`
5. User is created or updated in the database, and a JWT is returned

---

## 🤖 AI Operations

All four AI operations follow the same pattern:

```
getLanguageName(id)
  → PROMPT_TEMPLATE(code, lang)
    → askGemini(prompt)
      → parse/clean response
        → return structured result
```

| Operation | Prompt Output | Response Parsing |
|---|---|---|
| Translate | Plain code | `cleanCodeResponse()` |
| Analyze | JSON `{ timeComplexity, spaceComplexity, explanation }` | `parseGeminiJSON()` |
| Optimize | JSON `{ optimizedCode, suggestions }` | `parseGeminiJSON()` |
| Explain | JSON `{ explanation }` | `parseGeminiJSON()` |

---

## 📜 Supported Languages

| Language | ID | Extension |
|---|---|---|
| C | `c` | `.c` |
| C++ | `cpp` | `.cpp` |
| C# | `csharp` | `.cs` |
| Java | `java` | `.java` |
| Python | `python` | `.py` |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [Google Gemini AI](https://deepmind.google/technologies/gemini/) — AI backbone for all code operations
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — The editor that powers VS Code
- [Google OAuth](https://developers.google.com/identity) — Secure one-click sign-in
