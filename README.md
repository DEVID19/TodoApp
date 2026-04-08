# TodoApp - Full Stack MERN + React Native

A full-stack Todo application built with the MERN stack (MongoDB, Express, React Native, Node.js) and Expo.

---

## Project Structure

```
TodoApp/
├── backend/                  # Node.js + Express + MongoDB API
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js # Signup, Login, Logout, GetMe
│   │   └── taskController.js # CRUD for tasks
│   ├── middleware/
│   │   └── authMiddleware.js # JWT protect middleware
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── Task.js           # Task schema
│   ├── routes/
│   │   ├── authRoutes.js     # /api/auth/*
│   │   └── taskRoutes.js     # /api/tasks/*
│   ├── .env                  # Environment variables
│   ├── .env.example          # Example env file
│   └── index.js              # Entry point
│
└── frontend/                 # React Native + Expo
    ├── app/
    │   ├── auth/
    │   │   ├── _layout.js    # Auth stack layout
    │   │   ├── login.js      # Login screen
    │   │   └── signup.js     # Signup screen
    │   ├── _layout.js        # Root layout with auth guard
    │   └── index.js          # Home screen (task list)
    ├── components/
    │   ├── TaskCard.js       # Individual task card
    │   └── TaskModal.js      # Add/Edit task modal
    ├── constants/
    │   └── config.js         # API base URL
    ├── context/
    │   └── AuthContext.js    # Global auth state
    ├── services/
    │   ├── api.js            # Axios instance
    │   ├── authService.js    # Auth API calls
    │   └── taskService.js    # Task API calls
    ├── app.json              # Expo config
    ├── babel.config.js       # Babel + NativeWind config
    ├── global.css            # Tailwind CSS
    ├── metro.config.js       # Metro + NativeWind config
    └── tailwind.config.js    # Tailwind config
```

---

## Prerequisites

- Node.js >= 18
- MongoDB (local or MongoDB Atlas)
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone

---

## Backend Setup

```bash
cd backend
npm install
```

Edit `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/todoDB
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

Start backend:
```bash
npm run dev     # development (nodemon)
npm start       # production
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

**IMPORTANT** - Update your machine's local IP in `constants/config.js`:
```js
export const API_BASE_URL = "http://YOUR_LOCAL_IP:5000/api";
```

To find your local IP:
- Windows: run `ipconfig` in terminal
- Mac/Linux: run `ifconfig` in terminal
- Look for IPv4 address (usually 192.168.x.x)

Start frontend:
```bash
npx expo start
```

Scan the QR code with Expo Go on your phone.

---

## Features

- User Signup & Login with JWT (HTTP cookie + SecureStore)
- Protected routes (auto redirect to login if not authenticated)
- Create, Read, Update, Delete tasks
- Mark tasks as complete / incomplete
- Search/filter tasks by name
- Filter by All / Active / Completed
- Pull to refresh
- Clean, simple UI with NativeWind (Tailwind CSS)

---

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/logout | Logout user |
| GET | /api/auth/me | Get current user |

### Tasks (Protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
