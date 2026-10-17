# Personal Portfolio Website (MERN Stack)

A professional, full-stack personal portfolio website built with MongoDB, Express.js, React.js, and Node.js.

## Live Deployment Links
- **Frontend (Client):** [https://portfolioprashant57.vercel.app/](https://portfolioprashant57.vercel.app/)
- **Backend (Server):** [https://your-portfolio-api.onrender.com](https://your-portfolio-api.onrender.com) *(Deploy on Render / Railway)*

---

## Folder Structure

```text
Portfolio/
├── client/                     # Frontend (React.js + Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images, icons, media
│   │   ├── components/         # Modular UI components
│   │   │   ├── About/          # About Me section (bio, status, location)
│   │   │   ├── Certifications/ # Certifications & achievements
│   │   │   ├── Contact/        # Contact form connected to backend
│   │   │   ├── Footer/         # Footer & social links
│   │   │   ├── Hero/           # Landing hero, typewriter effect, CV CTA
│   │   │   ├── Navbar/         # Navbar, theme toggle, CV download
│   │   │   ├── Projects/       # Interactive cards, filter by tech
│   │   │   ├── Skills/         # Categorized skills, animated progress bars
│   │   │   └── Timeline/       # Vertical education & experience timeline
│   │   ├── context/            # ThemeContext (Dark/Light mode)
│   │   ├── data/               # Static/structured portfolio data
│   │   ├── services/           # Backend API integration services
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example            # Client environment variables template
│   ├── .gitignore              # Ignores client node_modules and .env
│   ├── index.html
│   ├── package.json            # Client dependencies
│   └── vite.config.js
│
├── server/                     # Backend (Node.js + Express.js REST API)
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── controllers/
│   │   ├── contactController.js# Handles contact submissions
│   │   └── resumeController.js # Serves PDF & DOCX resumes
│   ├── middleware/
│   │   └── errorHandler.js     # 404 & global error handling
│   ├── models/
│   │   └── Contact.js          # Mongoose schema for contact form
│   ├── public/
│   │   └── resumes/            # Static resume files (resume.pdf, resume.docx)
│   ├── routes/
│   │   ├── contactRoutes.js    # Contact API endpoints (/api/contact)
│   │   └── resumeRoutes.js     # Resume download endpoints (/api/resume/:format)
│   ├── .env.example            # Backend environment variables template
│   ├── .gitignore              # Ignores server node_modules and .env
│   ├── package.json            # Server dependencies
│   └── server.js               # Express application entry point
│
├── .gitignore                  # Root gitignore (excludes node_modules & .env)
├── package.json                # Monorepo root runner (concurrent dev scripts)
└── README.md                   # Project documentation & setup instructions
```

---

## Local Setup & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### 2. Clone the Repository
```bash
git clone https://github.com/Prashant-Singh05/MyPortfolio.git
cd MyPortfolio
```

### 3. Backend Setup (`/server`)
```bash
cd server
npm install
```
- Copy `.env.example` to `.env` and configure:
  ```env
  PORT=5000
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio
  CLIENT_URL=http://localhost:5173
  ```
- Run the server:
  ```bash
  npm run dev
  ```

### 4. Frontend Setup (`/client`)
```bash
cd ../client
npm install
```
- Copy `.env.example` to `.env`:
  ```env
  VITE_API_URL=http://localhost:5000/api
  ```
- Run the client:
  ```bash
  npm run dev
  ```

### 5. Run Both Concurrently (From Root)
```bash
# In the root Portfolio/ folder:
npm install
npm run dev
```

---

## Backend API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/contact` | Submit contact message (saved to MongoDB) |
| `GET` | `/api/contact` | Fetch contact messages (testing/admin) |
| `GET` | `/api/resume/pdf` | Download Resume in PDF format |
| `GET` | `/api/resume/docx` | Download Resume in Word (.docx) format |
