# CodeTranslator — AI-Powered Code Translation Platform

> Write code in one language. Get it back in another — with complexity analysis, optimization suggestions, and plain English explanations. All in one place.

---

## Demo Video

[![Watch Demo](https://img.shields.io/badge/▶%20Watch%20Demo-red?style=for-the-badge&logo=youtube&logoColor=white)](YOUR_VIDEO_LINK_HERE)

---

## The Problem That Started This

I was working on a Python project when a teammate pushed a chunk of C++ code and asked me to port it over. I spent more time looking up Java syntax than actually solving the problem. That frustrated me.

So I built CodeTranslator — a full-stack AI app that removes that friction entirely. Paste your code, pick a language, and get a clean translation in seconds. No syntax googling, no Stack Overflow rabbit holes.

---

## What You Can Do With It

- **Translate Code** — Convert between C, C++, C#, Java, and Python. The logic stays intact, only the syntax changes.
- **Analyze Complexity** — Get time and space complexity in Big-O notation with an explanation of why.
- **Optimize Code** — AI rewrites your code for better performance and tells you exactly what changed and why.
- **Explain Code** — Understand any code snippet in plain English, like a senior dev walking you through it.
- **History** — Every operation is saved automatically so you can go back and review anything.
- **Google Sign-In** — One click and you're in. No separate account needed.
- **Monaco Editor** — The same code editor that powers VS Code, right in the browser.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 + Vite | UI framework with lightning-fast dev server |
| React Router v7 | Page navigation without full reloads |
| Monaco Editor | VS Code-grade editor with syntax highlighting |
| Axios | HTTP client with automatic JWT attachment |
| @react-oauth/google | Google Sign-In integration |
| React Hot Toast | Clean, unobtrusive user notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database for users and operation history |
| Google Gemini AI | Powers all four code operations |
| JSON Web Tokens | Secure, stateless authentication |
| bcryptjs | Password hashing |
| Google Auth Library | Server-side Google token verification |

---

## Project Structure

```
AI-Code_Translator/
├── client/                        # React frontend
│   └── src/
│       ├── components/            # CodeEditor, OutputPanel, Navbar, HistoryList
│       ├── context/               # AuthContext — global login state
│       ├── pages/                 # LoginPage, HomePage, HistoryPage
│       ├── services/              # API functions (auth, code, history)
│       ├── constants/             # Language list and starter code
│       └── styles/                # CSS files per component
│
└── server/                        # Express backend
    └── src/
        ├── config/                # Gemini AI, Google OAuth, MongoDB connection
        ├── constants/             # Language definitions and prompt templates
        ├── controllers/           # HTTP handlers for auth, code, history
        ├── middleware/            # JWT auth guard, global error handler
        ├── models/                # User and History database schemas
        ├── routes/                # API route definitions
        ├── services/              # Core logic: translate, analyze, optimize, explain
        └── utils/                 # JWT helpers, Gemini response cleaners
```

---

## Running It Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier is fine)
- Gemini API key → [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- Google OAuth Client ID → [console.cloud.google.com](https://console.cloud.google.com)

---

### 1. Clone the repo

```bash
git clone https://github.com/yandamurividyasagar-dev/AI-Code_Translator.git
cd AI-Code_Translator/part2_initial_code
```

---

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
npm run dev
```

If everything is connected, you'll see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server running on port 5000
```

---

### 3. Frontend setup

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file in the `client/` folder:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
npm run dev
```

Visit **http://localhost:5173** and you're good to go.

---

## API Endpoints

All `/code` and `/history` routes require `Authorization: Bearer <token>` in the request header.

### Authentication
| Method | Endpoint | What It Does |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account with name, email, password |
| POST | `/api/auth/login` | Login with email and password |
| POST | `/api/auth/google` | Login with Google credential |
| GET | `/api/auth/me` | Get current logged-in user profile |
| POST | `/api/auth/logout` | Logout |

### Code Operations
| Method | Endpoint | Request Body |
|--------|----------|-------------|
| POST | `/api/code/translate` | `{ code, sourceLanguage, targetLanguage }` |
| POST | `/api/code/analyze` | `{ code, language }` |
| POST | `/api/code/optimize` | `{ code, language }` |
| POST | `/api/code/explain` | `{ code, language }` |

### History
| Method | Endpoint | What It Does |
|--------|----------|-------------|
| GET | `/api/history?page=1&limit=8` | Fetch paginated history |
| DELETE | `/api/history/:id` | Delete one entry |
| DELETE | `/api/history/clear` | Delete all history |

---

## How a Code Operation Actually Works

```
User writes code and clicks Run
        ↓
Frontend validates input fields
        ↓
POST /api/code/{action} sent with JWT token
        ↓
Auth middleware verifies the token
        ↓
Controller checks required fields
        ↓
Service builds a structured prompt for Gemini
        ↓
Gemini returns the AI response
        ↓
Response is cleaned and parsed
        ↓
Result saved to history in the background
        ↓
Clean result returned to the user instantly
```

---

## How Auth Works

```
User logs in (email or Google)
        ↓
Backend verifies credentials
        ↓
JWT token issued (7 day expiry)
        ↓
Token stored in localStorage
        ↓
Axios auto-attaches token to every request
        ↓
Auth middleware validates token on protected routes
        ↓
User object attached to request
```

---

## Things I Want to Add Next

- Support for JavaScript, TypeScript, Go, and Rust
- Side-by-side diff view when optimizing code
- Shareable links for translations
- VS Code extension
- Dark/light theme toggle

---

## Author

Built by **Vidya Sagar Yandamuri**

If this project helped you or impressed you, drop a ⭐ — it genuinely motivates me to keep building.

[![GitHub](https://img.shields.io/badge/GitHub-yandamurividyasagar--dev-black?style=flat&logo=github)](https://github.com/yandamurividyasagar-dev)

---

> *"I didn't build this to show I can use AI. I built it to understand what happens when AI becomes part of the development workflow."*