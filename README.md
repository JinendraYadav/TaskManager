
# Task Manager Application

A full-stack task management application with separate frontend and backend.

## Project Structure

- `/src` - Frontend React application
- `/backend` - Backend Express API

## Setup Instructions

### Backend Setup

1. Navigate to the backend folder:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Make sure MongoDB is running on your local machine

4. Start the backend server:
   ```
   npm run dev
   ```
   The server will run on port 5000

### Frontend Setup

1. From the project root, install dependencies:
   ```
   npm install
   ```

2. Start the frontend development server:
   ```
   npm run dev
   ```
   The frontend will run on port 8080

## Accessing the Application

- Frontend: http://localhost:8080
- Backend API: http://localhost:5000/api

## API Routes

- Authentication: `/api/users`
- Tasks: `/api/tasks`
- Projects: `/api/projects`

## Default MongoDB Connection

The application connects to a local MongoDB database at:
`mongodb://127.0.0.1:27017/taskmanager`
