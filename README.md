# 🗂️ Task Manager Application

A full-stack task management application built with React, Express, and MongoDB, supporting user authentication, project organisation, and task tracking.

## 🧱 Project Structure


```bash
/
├── backend      # Express.js API
└── src          # React frontend
```

## 🚀 Getting Started

📦 Backend Setup
Navigate to the backend folder:

```bash
cd backend
```
Install dependencies:

```bash
npm install
```
Ensure MongoDB is running locally at:

``` arduino
mongodb://127.0.0.1:27017/taskmanager
```
Start the development server:
```
npm run dev
```
>Runs at http://localhost:5000

## 💻 Frontend Setup

From the project root directory:

```
npm install
```
Start the frontend development server:
```
npm run dev
```
>Runs at http://localhost:8080

## 🌐 Accessing the App
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000/api

## 🔌 API Endpoints
| Resource | Endpoint        | Description                 |
| -------- | --------------- | --------------------------- |
| Users    | `/api/users`    | Registration, login, auth   |
| Tasks    | `/api/tasks`    | CRUD operations on tasks    |
| Projects | `/api/projects` | CRUD operations on projects |

## 🛠️ Tech Stack

- Frontend: React, Vite, Axios, Tailwind (optional)
- Backend: Node.js, Express.js, Mongoose
- Database: MongoDB
## 📝 Notes
- Ensure MongoDB is installed and running before starting the backend.
- Environment variables (e.g., DB URI, JWT secret) can be set in a `.env` file inside `/backend`.
