# 🩺 MedCare - Online Doctor Appointment Booking System

MedCare is a full-stack web application that allows patients to sign up, log in, and book/reschedule appointments with doctors. The app includes authentication using JWT stored in cookies, and features a secure backend built with Node.js and SQLite.

---

## 🔧 Tech Stack

### 💻 Frontend
- **React.js** (Functional Components & Hooks)
- **React Router DOM**
- **Axios**
- **Tailwind CSS / Custom CSS**
- **JS-Cookie** (for accessing JWT from cookies)
- **React Icons**

### 🌐 Backend
- **Node.js**
- **Express.js**
- **SQLite3** (for lightweight database)
- **CORS**
- **bcrypt** (for password hashing)
- **jsonwebtoken (JWT)** (for auth)
- **cookie-parser**

---

## 🚀 Deployment

- **Frontend:** Vercel  
  URL: [https://med-care-gilt.vercel.app](https://med-care-gilt.vercel.app)

- **Backend:** Render  
  URL: [https://medcare-1525.onrender.com](https://medcare-1525.onrender.com)

---

## 🧩 Features

- 🔐 **Authentication with JWT** (cookie-based)
- 📝 **Signup / Login / Logout**
- 🧑‍⚕️ **Doctors Listing**
- 📅 **Book Appointment**
- 🔍 **Search doctors** by name or specialization
- 🔒 **Protected Routes** for appointment-related pages

---

## 🗂️ Folder Structure

MedCare/
├── appointmentbackend/
│ ├── server.js # Express backend
│ └── docpat.db # SQLite DB
│
├── appointmentfrontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── App.js
│ │ ├── index.js
│ └── package.json


---

## ⚙️ Backend API Routes

### ✅ Public Routes
- `POST /signup` – Register patient
- `POST /login` – Authenticate user
- `GET /verify-token` – Validate token (for protected routes)

### 🔒 Protected Routes
- `GET /doctors` – Get all doctors
- `GET /doctors/:id` – Get specific doctor
- `POST /appointments` – Book appointment
- `POST /logout` – Clear cookie

---

## 🛡️ Authentication Flow

- On **Login**, a JWT is created and stored in an `HttpOnly`, `Secure`, `SameSite=None` cookie.
- On every authenticated request (e.g., booking/rescheduling), the frontend sends this cookie automatically via `withCredentials: true`.
- The backend validates the JWT using a `verify-token` endpoint and middleware.

---

## 🧪 To Run Locally

### Backend
```bash
cd appointmentbackend
npm install
node server.js

🔮 Planned Enhancements (If More Time Is Provided)
If additional development time is given, I would like to enhance MedCare with the following features:

🗓 Reschedule Improvements:
Allow users to view all their appointments and easily reschedule with better date/time selection UI.

🧑‍⚕️ Doctors Dashboard:
Provide doctors with a dedicated dashboard to:

View upcoming appointments

Update their availability and status (e.g., Available, On Leave, Fully Booked)

Manage their own profile and specializations

🧾 Patient Prescriptions:
Enable doctors to add, view, and update prescriptions for each patient after appointments.

👤 Patient Dashboard:
Allow patients to:

View upcoming and past appointments

Access prescription history

See doctor status in real-time

These improvements will enrich the user experience, improve workflow efficiency, and make MedCare a more complete and practical healthcare appointment solution.
