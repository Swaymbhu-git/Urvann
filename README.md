# Urvann Mini Plant Store MVP

A full-stack web application for browsing and managing a plant catalog, built with React, Node.js, Express, and MongoDB.

## ✨ Live Demo

You can try out the live application here:

 AS USER

### ➡️ **[https://ask-the-source.vercel.app/](https://ask-the-source.vercel.app/)**

AS ADMIN

### ➡️ **[https://ask-the-source.vercel.app/](https://ask-the-source.vercel.app/)**

You can change the password from backend server file

> **⚠️ Server Note**
> The backend for this project is hosted on a free-tier service. It may go to sleep due to inactivity. If the application is unresponsive on your first attempt, please wait 30-60 seconds for the server to "wake up" and then refresh the page.

---
## Features

- Browse plant catalog with responsive grid layout
- Search plants by name (case-insensitive)
- Filter plants by categories
- Admin interface to add new plants
- Real-time search and filtering
- Responsive design for all devices

## Tech Stack

- **Frontend**: React 18, React Router, Axios
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Styling**: Modern CSS with Grid and Flexbox

## Project Structure

```
├── frontend/          # React application
│   ├── public/
│   ├── src/
│   └── package.json
├── backend/           # Express API server
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Set up environment variables:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

### Running the Application

1. Start MongoDB (if running locally)

2. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

3. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

4. Open http://localhost:3000 in your browser

### Seeding the Database

To populate the database with sample plant data:

```bash
cd backend
npm run seed
```

## API Endpoints

- `GET /api/plants` - Get all plants (supports search and category filtering)
- `POST /api/plants` - Add a new plant (admin)

## Development

- Backend runs on http://localhost:5001
- Frontend runs on http://localhost:3000
- Frontend proxy configured to route API calls to backend

