## Student Management System

Modern single-page admin dashboard for managing **students, courses, grades, and attendance**, backed by a RESTful Node.js/Express API with a MongoDB database and a vanilla JavaScript frontend UI.

The project is intended as a learning / demo app for:
- Building a small REST API with Express and Mongoose.
- Implementing full CRUD flows from UI to database.
- Working with charts (Chart.js) for dashboards and analytics.

---

## Features

- **Dashboard**
  - High-level KPIs: total students, active courses, average grade, attendance rate.
  - Grade distribution and attendance trend charts (Chart.js).
  - Recent activity feed.
  - Button to initialize the database with sample data.
- **Students**
  - List, filter, create, edit, delete students.
  - Fields: name, email, phone, course, status (active/inactive), notes.
- **Courses**
  - List, filter (by category and status), create, edit, delete courses.
  - Fields: name, code, category (programming/design/business), instructor, start/end dates, status, description.
- **Grades**
  - List, filter by student and course, create, edit, delete grades.
  - Color‑coded grade values based on score bands.
- **Attendance**
  - Per-day attendance list with date navigation (previous/next day).
  - Per-course filtering, “mark all present” helper, save attendance records.
- **UI/UX**
  - Left sidebar navigation with multiple pages (Dashboard, Students, Courses, Grades, Attendance).
  - Header with search bar and theme toggle (light/dark).
  - Responsive, card-based layout with clean styling.

---

## Tech Stack

- **Backend**
  - Node.js
  - Express (v5)
  - MongoDB with Mongoose
  - `cors`, `body-parser`, `dotenv`
- **Frontend**
  - HTML5 + CSS3
  - Vanilla JavaScript (`script.js`)
  - Chart.js (via CDN) for charts
- **Other**
  - Environment configuration via `.env`

---

## Getting Started

### 1. Prerequisites

- Node.js (recommended 18+)
- MongoDB running locally or a MongoDB connection URI.

### 2. Clone the repository

```bash
git clone https://github.com/<your-username>/Student-System-Management.git
cd Student-System-Management
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment

Create a `.env` file in the project root:

```bash
MONGODB_URI=mongodb://localhost:27017/studentManagementSystem
PORT=5000
```

Adjust the values if your MongoDB runs elsewhere or you prefer a different port.

> The frontend (in `script.js`) is configured to call the API at `http://localhost:5000/api`. If you change `PORT`, update `API_URL` in `script.js` accordingly.

### 5. Start the backend server

`package.json` currently has only dependencies, so start the server directly with Node:

```bash
node server.js
```

You should see logs similar to:

- `MongoDB connected successfully`
- `Server running on port 5000`

### 6. Open the frontend

Open `index.html` directly in your browser, or serve the frontend via a simple static server (for example, using VS Code Live Server or `npx serve .`).

Make sure the browser can reach the backend at `http://localhost:5000`.

---

## API Overview

All endpoints are prefixed with `/api` and return JSON.

- **Students**
  - `GET /api/students` – list all students.
  - `GET /api/students/:id` – get a single student.
  - `POST /api/students` – create a student.
  - `PUT /api/students/:id` – update a student.
  - `DELETE /api/students/:id` – delete a student.
- **Courses**
  - `GET /api/courses` – list all courses.
  - `GET /api/courses/:id` – get a single course.
  - `POST /api/courses` – create a course (expects `startDate` and `endDate` as strings convertible to `Date`).
  - `PUT /api/courses/:id` – update a course.
  - `DELETE /api/courses/:id` – delete a course.
- **Grades**
  - `GET /api/grades` – list all grades.
  - `POST /api/grades` – create a grade (expects `date` as a string convertible to `Date`).
  - `PUT /api/grades/:id` – update a grade.
  - `DELETE /api/grades/:id` – delete a grade.
- **Attendance**
  - `GET /api/attendance` – list attendance; optional `?date=YYYY-MM-DD` filter.
  - `POST /api/attendance` – create attendance; accepts a single record or an array of records.
  - `PUT /api/attendance/:id` – update an attendance record.
  - `DELETE /api/attendance/:id` – delete an attendance record.
- **Activity Log**
  - `GET /api/activities` – latest activity entries (sorted, limited).
  - `POST /api/activities` – create a custom activity entry.
- **Sample Data Initialization**
  - `POST /api/initialize` – clears existing data and inserts sample students, courses, grades, attendance, and activities.

The frontend uses these endpoints via `fetch` calls defined in `script.js`.

---

## Project Structure

- `server.js` – Express server, Mongoose models, and all API routes.
- `index.html` – single-page admin dashboard layout and modals.
- `script.js` – page routing, API calls, data rendering, charts, modals, notifications, theme toggle, etc.
- `style.css` – layout, theming (including dark theme), responsive styles, tables, cards, modals.
- `admin.png` – avatar image used in the header.

---

## Development Notes

- Error handling currently returns basic JSON error messages; you can extend this with centralized middleware.
- Validation is handled mainly by Mongoose schema rules on the backend and standard HTML5 form validation on the frontend.
- The sample data in `server.js` is intended for demos and quick setup; avoid using it in production environments.

---

## License

Specify your chosen license here (e.g., MIT). If none is specified, treat this project as a learning/demo project and review the code before using it in production.

