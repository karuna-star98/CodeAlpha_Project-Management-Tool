# API Testing Notes

Use Postman with the server running on `http://localhost:5000`. Register/login first and copy the JWT into `Authorization: Bearer <token>`.

| Test | Method | Endpoint | Expected |
|---|---|---|---|
| Health | GET | `/api/health` | 200 |
| Register | POST | `/api/auth/register` | 201 |
| Login | POST | `/api/auth/login` | 200 + token |
| Current user | GET | `/api/auth/me` | 200 |
| Projects | GET | `/api/projects` | 200 |
| Create project | POST | `/api/projects` | 201 |
| Add member | POST | `/api/projects/:projectId/members` | 200 |
| Project tasks | GET | `/api/projects/:projectId/tasks` | 200 |
| Create task | POST | `/api/projects/:projectId/tasks` | 201 |
| Status | PATCH | `/api/tasks/:taskId/status` | 200 |
| Comments | GET | `/api/tasks/:taskId/comments` | 200 |
| Add comment | POST | `/api/tasks/:taskId/comments` | 201 |
| Unauthorized project | GET | `/api/projects/:projectId` as non-member | 403 |

Suggested payloads:

```json
{
  "name": "Demo Team",
  "description": "Internship project"
}
```

```json
{
  "title": "Build dashboard",
  "description": "Create project overview cards",
  "priority": "high",
  "status": "todo"
}
```
