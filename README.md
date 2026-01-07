# 🚗 Parking Management System

A **production-ready full-stack parking management web application** that allows users to book parking slots, manage vehicle details, and track booking history with charges and status. The system also includes an **admin role** for monitoring users and parking slot availability.

The project is **dockerized and deployed on AWS EC2**, following real-world backend and deployment practices.

---

## ✨ Features

### 👤 User Features
- User registration with **email verification** using Nodemailer  
- Secure authentication using **JWT (Access & Refresh Tokens)**  
- View available parking slots and **book slots in real time**  
- Store and manage **vehicle details**  
- View booking history with **charges and booking status**  
- Upload **profile avatar and cover image** (Cloudinary + Multer)  

---

### 🛠️ Admin Features
- Admin role-based access  
- Track total parking slots and availability  
- View and manage **all user data and bookings**  

---

## 🧱 Tech Stack

### Frontend
- React.js (Vite)  
- Axios  
- Tailwind CSS  

### Backend
- Node.js  
- Express.js  
- MongoDB Atlas  
- Mongoose  
- JWT (Access & Refresh Tokens)  
- Bcrypt (password hashing)  
- Multer & Cloudinary (file uploads)  
- Nodemailer (email verification)  

---

## 🚀 Deployment & DevOps

- **Backend** containerized using **Docker**  
- **Frontend** built and served as static files via **Nginx**  
- Deployed on a **single AWS EC2 (Ubuntu) instance**  
- Nginx configured to serve frontend and act as a reverse proxy  
- Environment variables used for secure configuration  

---

## 🏗️ Architecture Overview

User (Browser) <br>
| <br>
v <br>
Nginx (EC2) <br>
├── Frontend (React Static Build) <br>
└── Backend API (Docker Container - Node.js) <br>
    | <br>
    v <br>
MongoDB Atlas

---

## 🔐 Authentication Flow

- Access Token used for API authorization  
- Refresh Token used to obtain new access tokens securely  
- Tokens stored and validated according to best practices  

---

## 📂 Project Structure (Simplified)

Parking-Management-App/ <br>
├── backend/ <br>
│ ├── Dockerfile <br>
│ ├── src/ <br>
│ ├── package.json <br>
│ └── .env.example <br>
├── frontend/ <br>
│ ├── src/ <br>
│ ├── dist/ <br>
│ └── package.json <br>
└── README.md <br>

---

## 🧠 What I Learned

- Building and structuring scalable REST APIs
- Implementing secure authentication & authorization
- Handling file uploads in production
- Containerizing applications using Docker
- Deploying and managing applications on AWS EC2
-Configuring Nginx for frontend serving and reverse proxying
-Debugging real-world deployment and networking issues
