# Class Attendance Management System

This project is organized into two main directories: **Backend** (Node.js/Express + MongoDB) and **Frontend** (React + Vite).

---

## 📁 Project Structure

```text
attendeance/
├── backend/                  # Backend API Server
│   ├── config/               # Database configuration
│   ├── middleware/           # Express middlewares (e.g. error handling)
│   ├── models/               # Mongoose & In-Memory models (User, Subject, Attendance)
│   ├── routes/               # API route handlers
│   ├── index.js              # Server entry point (Express app)
│   ├── package.json          # Backend dependencies & scripts
│   └── .env.example          # Environment variables template
│
├── frontend/                 # Frontend Web Application
│   ├── public/               # Static assets & icons
│   ├── src/                  # React source code (components, pages, styles)
│   ├── index.html            # Vite HTML template
│   ├── vite.config.js        # Vite configuration & proxy settings
│   ├── eslint.config.js      # ESLint configuration
│   └── package.json          # Frontend dependencies & scripts
│
├── api/                      # Vercel serverless entry point
├── vercel.json               # Vercel deployment configuration
├── package.json              # Root package manager & monorepo scripts
└── README.md
```

---

## 🚀 How to Run

### Option 1: Run Both from Root (Recommended)

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start Backend and Frontend together:**
   ```bash
   npm run dev
   ```
   - Frontend runs at: `http://localhost:5173`
   - Backend runs at: `http://localhost:5001`

---

### Option 2: Run Backend and Frontend Separately

#### **Backend:**
```bash
cd backend
npm install
npm start
# or npm run dev (with auto-reload)
```

#### **Frontend:**
```bash
cd frontend
npm install
npm run dev
```
