# Collaborative Notes App (MERN Stack)

A collaborative note-taking web application built using the MERN stack (MongoDB, Express.js, React, Node.js) with JWT authentication and Tailwind CSS.

Users can securely register, log in, create notes, search notes, and collaborate with other users.

---

## Features

- User Registration and Login
- JWT Authentication
- Create, Edit, Delete Notes
- Full-text Search
- Collaborator Management (share notes with other users)
- Rich Text Editor
- Responsive UI using Tailwind CSS

---

## Tech Stack

Frontend
- React
- Tailwind CSS
- Axios

Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt (password hashing)

Database
- MongoDB
- Mongoose

---

## Project Structure

notes-app
│
├── frontend             # React frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend              # Node.js backend
│   ├── models
│   ├── routes
│   ├── controllers
│   ├── middleware
│   ├── .env.example
│   └── server.js
├── .gitignore
└── README.md

---

## Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB (local or MongoDB Atlas)

---

## Environment Variables

Create a `.env` file inside the **server folder**.

Example:

PORT=5000  
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/notesdb  
JWT_SECRET=your_super_secret_key

---

### Environment Variables Explanation

PORT  
Port number used to run the backend server.

MONGO_URI  
MongoDB connection string.

JWT_SECRET  
Secret key used to generate and verify JWT tokens.

---

## Example `.env.example`

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key

⚠️ Do NOT commit the real `.env` file to GitHub.

---

## Installation

Clone the repository:

git clone https://github.com/KavinduDevinda97/note-taking-web-app-mern.git

Move into the project directory:

cd note-taking-web-app-mern

---

## Install Backend Dependencies

cd server  
npm install

---

## Install Frontend Dependencies

cd ../client  
npm install

---

## Running the Application

Start Backend Server

cd backend  
npm run dev

Backend will run on:

http://localhost:5000

---

Start Frontend

cd frontend  
npm run dev

Frontend will run on:

http://localhost:5173

---

## API Endpoints

Authentication

POST /api/auth/register  
Register a new user.

POST /api/auth/login  
Login user and receive JWT token.

---

Notes

GET /api/notes  
Get all notes.

POST /api/notes  
Create new note.

PUT /api/notes/:id  
Update note.

DELETE /api/notes/:id  
Delete note.

---

## Authentication

Protected routes require JWT token.

Example request header:

Authorization: Bearer YOUR_TOKEN_HERE

---

## Demo Video

https://drive.google.com/file/d/1ueltZj0WvAKIn2YAP-o0k4SZZAURGlTi/view?usp=sharing

---

## Assumptions

- Each note has one owner.
- Owners can add collaborators.
- Collaborators can view and edit shared notes.

---

## Author

Kavindu  
Software Developer

