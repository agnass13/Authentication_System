# AuthShield — Enterprise User Authentication System

A complete, production-grade User Authentication web application featuring a modern React frontend and a robust Node.js/Express backend with SQLite persistence, Bcrypt password hashing, and stateless JSON Web Token (JWT) session security.

Designed and architected for college technical evaluations, practical assessments, and production portfolio demonstrations.

---

## 🌟 Key Highlights & Unique Features

- **Split-Screen Showcase Layout**: Bespoke presentation layout with a live security showcase, real-time backend ping status, and visual architecture highlights.
- **Dynamic Accent Theme Switcher**: Interactive switcher enabling instant customization (Cyber Indigo, Neon Cyan, Emerald Vault, Sunset Amber).
- **Real-Time Password Strength Meter**: Dynamic entropy evaluation assessing length, uppercase, lowercase, numbers, and special symbols with an animated progress bar and live checklists.
- **Live Password Match Indicator**: Instant visual confirmation when passwords match or mismatch before submission.
- **Zero Plain-Text Credentials**: 10-round salted adaptive Bcrypt hashing ensuring passwords are never stored or exposed in raw format.
- **Relational SQLite Database with WAL**: File-based ACID storage in `./database/auth.db` with Write-Ahead Logging for fast concurrent operations.
- **Interactive Technical Inspector in Dashboard**:
  - Profile & Overview card with custom user ID tag.
  - JWT Token Inspector & Decoded Header Viewer.
  - SQLite Schema Inspector displaying database tables and column constraints.
- **Protected Routes & Axios Interceptors**: Unauthenticated requests to `/dashboard` are intercepted client-side by `ProtectedRoute.jsx` and guarded server-side by JWT verification middleware.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18 (Vite)
- **Language**: JavaScript (ES6+ / JSX)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with automatic JWT Authorization interceptors
- **Icons**: Lucide React
- **Styling**: Modern CSS3 (CSS Variables, Flexbox, CSS Grid, Glassmorphism, KaTeX-inspired typography)

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database Engine**: SQLite3
- **Security & Cryptography**:
  - `bcryptjs` (10-round salted password hashing)
  - `jsonwebtoken` (Stateless HS256 tokens)
  - `cors` (Restricted cross-origin resource sharing)
  - `dotenv` (Environment variable isolation)

---

## 🏛️ Application Architecture

```
[ Browser / Client ]
       │
       ▼ (React Router v6 + ProtectedRoute)
[ React 18 Frontend (Vite) on :5173 ]
       │
       ▼ Axios HTTP Requests (Bearer Token)
[ Express.js REST API Server on :5000 ]
       ├── CORS & Body Parsing Middleware
       ├── JWT Authentication Middleware (authenticateToken)
       └── Input Validation & Error Handling
       │
       ▼ Parameterized SQL Queries (?)
[ SQLite3 Database Engine (auth.db) ]
       └── users (id, name, email UNIQUE, password_hash, created_at)
```

---

## 📂 Project Folder Structure

```text
authentication-system/
│
├── frontend/                         # Vite + React Client
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertMessage.jsx      # Feedback banners (success/error/info)
│   │   │   ├── AuthShowcase.jsx      # Unique showcase panel with live backend ping
│   │   │   ├── Navbar.jsx            # Top bar with user initials & logout
│   │   │   ├── PasswordStrengthMeter.jsx # Dynamic entropy evaluator
│   │   │   ├── ProtectedRoute.jsx    # Guard for unauthenticated access
│   │   │   └── ThemeSwitcher.jsx     # Live theme / accent customizer
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global auth provider & session state
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         # Profile, JWT Inspector & SQLite tabs
│   │   │   ├── Login.jsx             # Login with remember-me & demo preview
│   │   │   └── Register.jsx          # Registration form with live match check
│   │   ├── services/
│   │   │   └── api.js                # Axios instance & endpoints
│   │   ├── App.jsx                   # Application router configuration
│   │   ├── index.css                 # SaaS design system and animations
│   │   └── main.jsx                  # React DOM mount point
│   ├── index.html                    # Root HTML with Google Fonts
│   ├── package.json
│   └── vite.config.js
│
├── backend/                          # Express.js REST API
│   ├── config/
│   │   └── index.js                  # Centralized configuration & dotenv
│   ├── controllers/
│   │   └── authController.js         # Register, Login, Me, Logout & Health logic
│   ├── database/
│   │   ├── auth.db                   # SQLite database file (auto-generated)
│   │   └── db.js                     # SQLite connection & schema initialization
│   ├── middleware/
│   │   ├── authMiddleware.js         # Bearer token verification
│   │   └── errorMiddleware.js        # Global error & 404 handlers
│   ├── routes/
│   │   └── authRoutes.js             # Route endpoints
│   ├── server.js                     # Express app setup and server entry
│   ├── test_auth.js                  # Automated integration test suite
│   ├── package.json
│   ├── .env                          # Local environment secrets
│   └── .env.example                  # Template configuration
│
├── .gitignore                        # Git ignore patterns
└── README.md                         # Comprehensive documentation
```

---

## 🚀 Step-by-Step Installation & Running Guide (Windows)

### Prerequisites
- Node.js (v18, v20, v22, or v24)
- npm (v9+)

---

### Step 1: Start the Backend Server

Open a new **PowerShell** or **Command Prompt** terminal window:

```powershell
cd C:\Users\agnes\.gemini\antigravity\scratch\authentication-system\backend
npm install
npm start
```

You should see:
```text
✅ Connected to SQLite database at: ./database/auth.db
✅ SQLite schema verified: "users" table is ready.
====================================================
🚀 AuthShield Server running on port 5000
🌐 Base API URL: http://localhost:5000/api
🛡️  Auth Endpoints: http://localhost:5000/api/auth
💾 SQLite Database connected & schema verified
====================================================
```

*(Keep this terminal window running)*

---

### Step 2: Start the Frontend Application

Open a **second** terminal window:

```powershell
cd C:\Users\agnes\.gemini\antigravity\scratch\authentication-system\frontend
npm install
npm run dev
```

Open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 📡 API Endpoint Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Registers a new user. Hashes password with Bcrypt and stores in SQLite. |
| `POST` | `/api/auth/login` | Public | Verifies credentials against Bcrypt hash and issues a signed JWT. |
| `GET` | `/api/auth/me` | Protected | Returns authenticated user details (requires Bearer token header). |
| `POST` | `/api/auth/logout` | Public | Terminates session. |
| `GET` | `/api/auth/health` | Public | Returns database schema, column metadata, and total user count. |

---

## 🔒 Security Implementations

1. **Password Hashing**: Bcrypt with 10 salt rounds (`bcryptjs`). Plain-text passwords are never logged or stored.
2. **SQL Injection Defense**: All queries use parameterized statements (`?`) in SQLite.
3. **Collision Resistance**: Email addresses are normalized to lowercase with `COLLATE NOCASE` uniqueness constraints.
4. **JWT Expiration**: Tokens expire after 24 hours (or 7 days when "Remember me" is checked).
5. **Sanitized Responses**: Password hashes are explicitly stripped from all API outputs.
6. **Route Guards**: `ProtectedRoute` checks local storage and context state before granting access to dashboard views.

---

## 🧪 Automated Testing

An automated integration test suite is included in `backend/test_auth.js`. To run it:

```powershell
cd C:\Users\agnes\.gemini\antigravity\scratch\authentication-system\backend
node test_auth.js
```

All 7 core scenarios are automatically tested and validated:
1. User registration with valid inputs (Status 201).
2. Duplicate email rejection (Status 409).
3. SQLite hash verification (Asserts `$2a$10$...` Bcrypt signature).
4. User login with valid credentials (Status 200).
5. User login rejection with incorrect password (Status 401).
6. Protected route access `/api/auth/me` with valid JWT (Status 200).
7. System health & database schema inspection (Status 200).
