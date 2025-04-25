<h1 align="center">
  College Management System
</h1>

<h3 align="center">
Streamline college management, class organization, and facilitate communication between students, teachers, and administrators.<br>
Track attendance, assess performance, and manage records efficiently.
</h3>

# About

The College Management System is a web-based application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It simplifies college management by providing tools for class organization, attendance tracking, performance assessment, and communication.

## Features

- **User Roles:** Supports Admin, Teacher, and Student roles with specific functionalities and access levels.
- **Admin Dashboard:** Manage students, teachers, branches, subjects, and system settings.
- **Attendance Tracking:** Teachers can mark attendance and generate reports.
- **Performance Assessment:** Teachers can provide marks, feedback, and generate PDF mark sheets with percentage and CGPA calculations.
- **Data Visualization:** Students can view performance data through interactive charts and tables.
- **Communication:** Enables seamless communication between users.

## Technologies Used

- **Frontend:** React.js, Material UI, Redux
- **Backend:** Node.js, Express.js
- **Database:** MongoDB

# Installation

Clone the repository:
```sh
git clone https://github.com/SwastikAnchan/College-Management-system
```

### Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```sh
   cd backend
   npm install
   npm start
   ```
2. Create a `.env` file in the backend folder with the following content:
   ```sh
   MONGO_URL = mongodb://127.0.0.1/CollegeManagement
   ```
   Replace the URL with your MongoDB Atlas link if needed.

### Frontend Setup
1. Open another terminal and navigate to the frontend folder:
   ```sh
   cd frontend
   npm install
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`. The backend API will run at `http://localhost:5000`.

# Troubleshooting

### Network Error During Signup
1. Navigate to `frontend > .env` and uncomment the first line.
2. Restart the frontend server:
   ```sh
   cd frontend
   npm start
   ```
3. If the issue persists, update the `REACT_APP_BASE_URL` in all `Handle` files under `src/redux`.

### Enabling Delete Feature
1. Uncomment the `deleteUser` function in `frontend > src > redux > userRelated > userHandle.js`.
2. Update the `deleteHandler` function in files prefixed with "Show" or "View" under `src/pages/admin`.

# Deployment
- **Server:** Render
- **Client:** Netlify

Feel free to contact me for further assistance. Don't forget to star the project if you find it helpful!
