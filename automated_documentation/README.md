# Automated Documentation Generator

A full-stack web application that automatically tracks tasks, analyzes productivity, and generates professional documentation and reports.

## Features
- **Task Tracker**: Start/Stop timer, add tasks, mark as completed.
- **Activity Logger**: Automatic logging of daily activities.
- **Analytics Dashboard**: Visual charts for productivity analysis.
- **Report Generator**: Create Daily, Weekly, and Monthly reports with simulated AI summaries.
- **PDF Export**: Print-friendly report views.
- **Admin Panel**: View all users and system-wide performance stats.

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, Chart.js
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB running locally on port 27017

### Installation & Run
1.  **Install All Dependencies:**
    (If not already installed)
    ```bash
    npm install
    cd backend && npm install
    cd ../frontend && npm install
    cd ..
    ```

2.  **Start the Application:**
    From the root directory:
    ```bash
    npm start
    ```
    This will concurrently run:
    - Backend API on `http://localhost:5000`
    - Frontend App on `http://localhost:5173`

3.  **Open in Browser:**
    Go to `http://localhost:5173`

## Default Admin User
There is no default admin user created automatically. To access the Admin Panel:
1.  Register a new user at `/register`.
2.  Manually update the user's document in MongoDB: set `role` to `"admin"`.
3.  Refresh the page; the "Admin Panel" link will appear in the sidebar.

## Project Structure
- `backend/`: Express server, API routes, Models, Controllers.
- `frontend/`: React components, Pages, Context, Hooks.
