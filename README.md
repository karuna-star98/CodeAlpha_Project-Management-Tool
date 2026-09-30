# TaskFlow — CodeAlpha Project Management Tool

A beginner-friendly but industry-oriented full-stack project management and collaboration platform built for **CodeAlpha Full Stack Development Internship — Task 2**.

The implementation follows the provided reference specification: authenticated users can create group projects, manage members, create and assign tasks, move task cards through **To Do → In Progress → Done**, and communicate using task comments. Notifications and WebSockets are intentionally not included in the core release because they are optional in the specification.

## Features

- User registration, login, logout and current-user session
- JWT authentication and protected REST APIs
- Project creation, editing and deletion
- Project membership by email
- Project board with three status columns
- Task creation, editing and deletion
- Task assignment with server-side member validation
- Priority and due dates
- Task status changes
- Task details and task-level comments
- Dashboard counts and project progress
- Centralized API validation and error handling
- Responsive UI for smaller screens
- Demo seed data for screenshots and walkthroughs

## Technology Stack

### Frontend
- React 19
- React Router DOM 7
- Vite 8
- Plain CSS with reusable components
- Browser Fetch API for HTTP

### Backend
- Node.js
- Express 5
- MongoDB
- Mongoose 9
- JWT (`jsonwebtoken`)
- `bcryptjs`
- `cors`
- `dotenv`

Current package versions were checked against npm in September 2026: React 19.3.0, Vite 8.3.0, React Router DOM 7.18.4, Express 5.2.1, Mongoose 9.10.1, bcryptjs 3.0.3, cors 2.8.6, dotenv 18.0.2 and jsonwebtoken 9.0.3.

## Architecture

```text
Browser
   ↓
React UI + Router
   ↓
Fetch API client
   ↓ HTTP / JSON
Express REST API
   ↓
JWT Authentication + Membership Authorization
   ↓
Controllers / Services
   ↓
Mongoose Models
   ↓
MongoDB
```

## Folder Structure

```text
CodeAlpha_Project-Management-Tool/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── services/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── docs/
├── screenshots/
├── test-results/
├── .gitignore
└── README.md
```

## Database Model

### Users
`name`, `email`, `passwordHash`, `avatarUrl`, `role`, timestamps

### Projects
`name`, `description`, `ownerId`, `memberIds`, timestamps

### Tasks
`projectId`, `title`, `description`, `assigneeId`, `createdBy`, `status`, `priority`, `dueDate`, timestamps

### Comments
`taskId`, `userId`, `text`, timestamps

## REST API

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:projectId`
- `PUT /api/projects/:projectId`
- `DELETE /api/projects/:projectId`
- `POST /api/projects/:projectId/members`
- `DELETE /api/projects/:projectId/members/:userId`

### Tasks
- `GET /api/projects/:projectId/tasks`
- `POST /api/projects/:projectId/tasks`
- `GET /api/tasks/:taskId`
- `PUT /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`
- `PATCH /api/tasks/:taskId/status`
- `PATCH /api/tasks/:taskId/assignee`

### Comments
- `GET /api/tasks/:taskId/comments`
- `POST /api/tasks/:taskId/comments`
- `DELETE /api/comments/:commentId`

### Dashboard
- `GET /api/dashboard`

### Health
- `GET /api/health`

## Security / Authorization

- Passwords are hashed with bcryptjs; plaintext passwords are never stored.
- JWTs are signed on login/registration and verified by auth middleware.
- Protected project/task/comment endpoints require a valid Bearer token.
- Private project data requires project membership.
- Only the project owner can manage members and delete/update project details.
- Assignees are verified server-side to ensure they belong to the project.
- Secrets are kept in environment variables and `.env` is ignored by Git.

## Local Setup

### 1. Prerequisites

- Node.js 20+ recommended
- npm
- Git
- MongoDB local instance or MongoDB Atlas
- VS Code
- Postman (optional, for API testing)

### 2. Server

```bash
cd server
npm install
copy .env.example .env
```

Set values in `server/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/codealpha_project_manager
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

Start:

```bash
npm run dev
```

### 3. Client

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`.

### 4. Demo seed data

With the server environment configured:

```bash
cd server
npm run seed
```

Demo accounts:

```text
owner@example.com / Password123!
member@example.com / Password123!
```

Do not use demo credentials in a public production deployment.

## Expected Demo Flow

1. Open the application.
2. Register or use a demo account.
3. Create a project.
4. Add another registered user by email.
5. Create three tasks.
6. Assign tasks to project members.
7. Move a task from To Do to In Progress.
8. Open the task details page.
9. Add a comment.
10. Refresh the page and verify persistence.
11. Return to Dashboard and show counts/progress.
12. Use Postman to show the protected API.

## Testing Checklist

| Test | Expected |
|---|---|
| Register | 201 + user/token |
| Duplicate email | 409 |
| Valid login | 200 + token |
| Invalid login | 401 |
| Protected route without token | 401 |
| Project creation | 201 + saved project |
| Member addition | Member visible on board |
| Non-member project access | 403 |
| Task creation | 201 + saved task |
| Invalid assignee | 400 |
| Status update | Card moves column |
| Comment creation | Comment appears and persists |
| Unauthorized deletion | 403 |
| Refresh | Data still present |

## GitHub Strategy

Suggested repository name:

`CodeAlpha_Project-Management-Tool`

Meaningful commit sequence:

```text
Set up client and server
Add MongoDB connection
Implement authentication
Add project CRUD
Add memberships
Implement task CRUD
Add board UI
Add assignment and status updates
Add comments
Add validation and authorization
Add dashboard
Complete testing and documentation
```

Never commit `.env` or real database credentials.

## Screenshot Proof Checklist

Capture:

1. Repository structure
2. Login
3. Register
4. Dashboard
5. Project creation
6. Project board
7. Multiple task cards
8. Assigned task
9. Status change
10. Task details
11. Comments
12. Project members
13. Successful Postman API request
14. Unauthorized Postman request
15. MongoDB collections/documents
16. Responsive UI
17. GitHub repository
18. README

Suggested names are listed in the reference specification.

## Optional Future Work

The core app intentionally stays focused. Future extensions can add drag-and-drop Kanban, Socket.io real-time updates, richer notifications, file attachments, activity timelines, calendar/Gantt views, search/filtering, team roles, automated reminders, analytics and deployment monitoring.

## Project Report Sections

Use the following report structure:

- Abstract
- Introduction
- Problem Statement
- Objectives
- Existing System
- Proposed System
- Technology Stack
- System Architecture
- Database Design
- Authentication
- Project Management Workflow
- Task Board
- Assignment
- Comments
- REST APIs
- Testing
- Results
- Applications
- Advantages
- Limitations
- Future Scope
- Conclusion

## License

For educational / internship use. Add your preferred license before public production use.
