# Smart Code Translator

I built this because I kept switching between browser tabs — Googling Java syntax while thinking in Python, copying snippets into ChatGPT just to understand what a colleague's C++ function did. It was annoying. So I built the tool I actually wanted.

It's a full-stack web app that lets you paste code, pick a target language, and get back a clean translation — along with complexity analysis, optimization suggestions, and plain-English explanations. Everything runs through Google Gemini under the hood, with a proper auth system so your history is saved across sessions.

---

## What it does

**Translate** — Converts code between C, C++, C#, Java, and Python. Not just a syntax swap — it tries to use idiomatic patterns of the target language, including the right imports and standard library calls.

**Analyze** — Returns time and space complexity in Big-O notation with a short explanation of why. Useful for understanding code you didn't write or double-checking your own assumptions.

**Optimize** — Suggests a rewritten version of your code with bullet-point notes on what changed and why. Great for catching inefficiencies you didn't notice.

**Explain** — Produces a beginner-friendly walkthrough of what the code does. Handy when you're reading unfamiliar codebases or onboarding someone new.

All four operations save to your history automatically, so you can revisit past translations without redoing the work.

---

## Tech choices and why

I used the **MERN stack** (MongoDB, Express, React, Node.js) because it's practical — one language across the whole codebase, fast iteration, and no impedance mismatch between the API and the frontend data shapes.

For the editor, I used **Monaco** (the engine behind VS Code) instead of a textarea or a simpler library. It gives you real syntax highlighting, bracket matching, and code folding — the kind of experience developers actually expect.

**JWT authentication** with bcrypt-hashed passwords handles the email/password flow. For Google sign-in, I used `google-auth-library` on the backend to verify the ID token server-side rather than trusting the client — important for security.

**Google Gemini 2.5 Flash** powers all four AI features. I wrote structured prompts for each operation: translation returns raw code, while analysis, optimization, and explanation return JSON with specific fields. This makes the frontend rendering predictable regardless of what Gemini says.

---

## Running it locally

You'll need Node.js, a MongoDB connection string (Atlas free tier works fine), a Google OAuth Client ID, and a Gemini API key.

**Clone and install**

```bash
git clone https://github.com/your-username/smart-code-translator.git
cd smart-code-translator
```

**Backend setup**

```bash
cd server
npm install
```

Create `server/.env`:

```
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
```

**Frontend setup**

```bash
cd client
npm install
```

Create `client/.env`:

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## Project structure

```
smart-code-translator/
├── client/
│   └── src/
│       ├── components/       # CodeEditor, OutputPanel, LanguageSelector, Navbar
│       ├── context/          # AuthContext — global auth state via React Context
│       ├── pages/            # LoginPage, HomePage, HistoryPage
│       ├── services/         # Axios calls to backend (auth, code, history)
│       └── constants/        # Language list, Monaco mappings, starter code
└── server/
    └── src/
        ├── config/           # MongoDB, Gemini, Google OAuth setup
        ├── constants/        # Prompt templates, supported languages
        ├── controllers/      # Request handlers (auth, code, history)
        ├── middleware/        # JWT auth check, global error handler
        ├── models/           # User schema, History schema
        ├── routes/           # Route definitions, central registry
        ├── services/         # Business logic (translate, analyze, optimize, explain)
        └── utils/            # JWT helpers, Gemini response parsers
```

---

## API reference

All code and history endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

### Auth — `/api/auth`

| Method | Route | Description |
|---|---|---|
| POST | `/register` | Create account with name, email, password |
| POST | `/login` | Email/password login |
| POST | `/google` | Google OAuth login |
| GET | `/me` | Fetch current user profile |
| POST | `/logout` | Logout |

### Code — `/api/code`

| Method | Route | Body |
|---|---|---|
| POST | `/translate` | `{ code, sourceLanguage, targetLanguage }` |
| POST | `/analyze` | `{ code, language }` |
| POST | `/optimize` | `{ code, language }` |
| POST | `/explain` | `{ code, language }` |

### History — `/api/history`

| Method | Route | Description |
|---|---|---|
| GET | `/?page=1&limit=10` | Paginated history |
| GET | `/:id` | Single entry |
| DELETE | `/:id` | Delete entry |
| DELETE | `/clear` | Clear all history |

---

## How the AI part works

Each operation follows the same pattern:

1. Convert the language ID to a display name (`cpp` → `C++`)
2. Fill a prompt template with the code and language
3. Send to Gemini via `generateContent()`
4. Strip any markdown fencing Gemini wraps around the response
5. Return plain code (for translation) or parse JSON (for everything else)

The prompts are strict about output format. For example, the analysis prompt says: *"Respond with ONLY a JSON object in this exact format — no explanation, no markdown."* This keeps the frontend rendering consistent and avoids having to parse natural language.

History saves happen asynchronously after the response is sent — fire-and-forget — so the user doesn't wait for the database write.

---

## Supported languages

C, C++, C#, Java, Python

---

## What I'd add next

- Support for more languages (JavaScript, Go, Rust)
- Side-by-side diff view for the optimize output
- Shareable links for individual translations
- Rate limiting per user on the AI endpoints

---

## License

MIT
