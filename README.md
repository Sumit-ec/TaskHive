# 🚀 TaskHive - Advanced Project Management System

TaskHive is a premium, high-performance project management web application built for modern teams. It features a stunning glassmorphism UI, robust role-based access control, and real-time task tracking.

## ✨ Key Features

- **🔐 Secure Authentication**: JWT-based login and signup with encrypted password storage.
- **🛡️ Role-Based Access (RBAC)**: Admin and Member roles with specific permissions.
- **📊 Interactive Dashboard**: Real-time stats on task progress, status, and review items.
- **📁 Project Management**: Create and manage projects, assign team members.
- **✅ Task Tracking**: Create tasks, set priorities, and update status on the fly.
- **🎨 Premium UI**: Dark mode, glassmorphism effects, and smooth Framer Motion animations.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Framer Motion, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT (JSON Web Tokens), Bcrypt.js.
- **Styling**: Vanilla CSS (Custom Design System).

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd task-hive
```

### 2. Setup Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 3. Install Dependencies
```bash
npm run install-all
```

### 4. Run Locally (Concurrent)
```bash
# Start both Frontend and Backend simultaneously
npm run dev
```

### Or Start Separately
```bash
# Start Backend only
npm run backend
0
# Start Frontend only
npm run frontend
```

## 🌐 Deployment

This app is optimized for deployment on **Railway**. 
1. Connect your GitHub repository to Railway.
2. Add your environment variables in the Railway dashboard.
3. Railway will automatically detect the root `package.json` and deploy.

## ⚙️ Requirements
- Node.js >= 18.x
- MongoDB (Local or Atlas)

---