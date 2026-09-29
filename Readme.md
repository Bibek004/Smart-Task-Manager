# 🧠 Smart Task Manager with Deadlines and Reminders

A full-stack MERN (MongoDB, Express, React, Node.js) web application to help users efficiently manage tasks, set deadlines, receive reminders, and organize their productivity.

---

## 🚀 Features

- ✅ User Registration & Login (JWT cookie-based authentication)
- ✅ Create, update, and delete tasks
- ✅ Set task deadlines, priorities, and categories
- ✅ Mark tasks as completed
- ✅ View all tasks in a deadline-aware dashboard
- ✅ Automatic reminders for upcoming & overdue tasks via CRON
- ✅ Support for recurring tasks (Daily, Weekly, Monthly)
- ✅ Responsive UI built with React & Tailwind CSS
- ✅ Protected routes with session persistence

---

## 🛠️ Tech Stack

**Frontend**  
- React  
- Axios  
- Tailwind CSS  
- React Router

**Backend**  
- Node.js  
- Express.js  
- MongoDB (Mongoose ODM)  
- JSON Web Token (JWT)  
- Cookie-based Auth  
- dotenv, cors, cookie-parser  
- Node-cron (for scheduled reminders)

---

## 🔐 Authentication

- Uses **JWTs stored in HTTP-only cookies** for secure authentication
- Middleware verifies user token on each protected request
- Users stay logged in across sessions unless they logout

---
