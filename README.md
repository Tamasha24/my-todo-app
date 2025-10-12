# To-Do App

A simple **full-stack To-Do application** built with **Spring Boot** (backend) and **Next.js** (frontend).  
It allows users to **add, edit, mark as done, and delete tasks**, with all data stored in an **H2 database**.

---

##  Features

- Add tasks with a **title** and **due date**
- Edit task **title** or **date**
- Mark tasks as **completed**
- Delete tasks
- Tasks are grouped as:
  - Overdue
  - Due Today
  - Upcoming
  - Completed
- Data persistence with **H2 file-based database**
- Frontend styled with **CSS modules** and **responsive layout**
- Backend REST API with **Spring Boot** and **Spring Data JPA**
- Frontend built with **Next.js** 

---

##  Getting Started

### Prerequisites

- Java 17+
- Maven
- Node.js 18+
- npm 

---

Notes

All task data is stored in a file-based H2 database (./data/todo-db)

To reset the database, delete ./data/todo-db.mv.db

Frontend communicates with backend via REST API


### Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
Run the backend:

mvn spring-boot:run


Backend runs on: http://localhost:8080

H2 console: http://localhost:8080/h2-console

JDBC URL: jdbc:h2:file:./data/todo-db

User: sa

Password: (leave empty)

Frontend

Open frontend folder:

cd frontend


Install dependencies:

npm install


Run frontend:

npm run dev

Frontend runs on: http://localhost:3000



