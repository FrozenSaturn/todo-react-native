# Backend API Documentation

This directory contains the FastAPI backend for the GrowEasy application.

## Features

- **Authentication**: Secure user signup and login using JWT (JSON Web Tokens).
- **Todo Management**: Full CRUD (Create, Read, Update, Delete) operations for Todos.
- **Subtasks**: Ability to add subtasks to a Todo.
  - **Auto-completion**: Automatically marks a Todo as completed when all its subtasks are finished.
- **Folders**: Organize Todos into specific folders.
- **Database**: Powered by PostgreSQL using SQLAlchemy ORM.
- **CORS**: Configured to allow requests from any origin (for development).

## Endpoints & Usage

Base URL: `http://localhost:8000`

**Note**: Most endpoints require an `Authorization` header with a Bearer token obtained from the `/auth/login` endpoint.
Header format: `Authorization: Bearer <YOUR_ACCESS_TOKEN>`

### Authentication

#### Signup
Create a new user account.

```bash
curl -X POST "http://localhost:8000/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "strongpassword"
  }'
```

#### Login
Authenticate and receive an access token.

```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "strongpassword"
  }'
```

#### Get Current User
Get details of the currently logged-in user.

```bash
curl -X GET "http://localhost:8000/auth/me" \
  -H "Authorization: Bearer <TOKEN>"
```

### Folders

#### Create Folder
Create a new folder to organize todos.

```bash
curl -X POST "http://localhost:8000/folders/" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Work Projects"
  }'
```

#### List Folders
Get all folders for the current user.

```bash
curl -X GET "http://localhost:8000/folders/" \
  -H "Authorization: Bearer <TOKEN>"
```

### Todos

#### Create Todo
Create a new todo item. `folder_id` is optional.

```bash
curl -X POST "http://localhost:8000/todos/" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Q3 Report",
    "folder_id": 1
  }'
```

#### List Todos
Get all todos for the current user.

```bash
curl -X GET "http://localhost:8000/todos/" \
  -H "Authorization: Bearer <TOKEN>"
```

#### Update Todo
Update a todo's details.

```bash
curl -X PUT "http://localhost:8000/todos/1" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Q3 Report (Urgent)",
    "completed": true
  }'
```

#### Delete Todo
Remove a todo.

```bash
curl -X DELETE "http://localhost:8000/todos/1" \
  -H "Authorization: Bearer <TOKEN>"
```

### Subtasks

#### Create Subtask
Add a subtask to a specific todo.

```bash
curl -X POST "http://localhost:8000/todos/1/subtasks" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Gather metrics"
  }'
```

#### Update Subtask Status
Toggle the completion status of a subtask.

```bash
curl -X PUT "http://localhost:8000/todos/1/subtasks/1" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```
