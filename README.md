# Job Application Tracker

A full-stack web application for organizing job applications, tracking hiring progress, and managing interviews and related documents in one place.

Built with **React**, **Node.js**, **Express**, and **PostgreSQL hosted on Neon**. The project is intended to run locally and is not currently deployed as a public website.

## Features

- User registration and login with hashed passwords and JWT authentication
- Create, view, update, and delete job applications
- Track application statuses throughout the hiring process
- Manage interviews associated with applications
- Organize documents associated with applications
- Associate application data with individual user accounts

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, JavaScript |
| Backend | Node.js, Express |
| Database | PostgreSQL (Neon) |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| Configuration | dotenv / environment variables |

## Prerequisites

Before you begin, install or create:

- [Node.js](https://nodejs.org/) and npm
- [Git](https://git-scm.com/)
- A free [Neon](https://neon.com/) account for your own PostgreSQL database
- A code editor, such as VS Code

You **do not** need access to the original developer's Neon account, database password, or JWT signing secret.

## Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

Replace the example URL and directory name with the actual repository values.

### 2. Install dependencies

In a terminal, install backend dependencies:

```bash
cd backend
npm install
```

In a second terminal, install frontend dependencies:

```bash
cd frontend
npm install
```

> The folder names above assume the repository uses `backend/` and `frontend/`. Adjust the paths if your clone uses different names.

### 3. Create your own Neon database

1. Sign in at [neon.com](https://neon.com/).
2. Create a new Neon project and select a region.
3. In the Neon dashboard, locate the database connection string (usually under **Connect**).
4. Copy the PostgreSQL connection string. It will resemble:

   ```text
   postgresql://USERNAME:PASSWORD@HOST.neon.tech/neondb?sslmode=require
   ```

5. Keep the connection string private. It grants access to your database.

**Important:** Creating the Neon database is not the same as creating the application's tables. The application expects tables such as:

- `users`
- `applications`
- `interviews`
- `application_documents`

If the repository includes a `schema.sql` or migration files, run those against **your own** Neon database using the Neon SQL Editor or the documented migration command. If it does not include a schema, you will need the database schema before the application can work fully. Do not guess the columns or constraints.

### 4. Configure the backend `.env` file

Inside the **backend** directory, create a file named `.env` and add:

```dotenv
PORT=3000
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST.neon.tech/neondb?sslmode=require
JWT_SECRET=REPLACE_WITH_YOUR_OWN_RANDOM_SECRET
```

Replace `DATABASE_URL` with the connection string from **your** Neon project.

Generate your own JWT signing secret using:

```bash
openssl rand -hex 32
```

Copy the output and set it as `JWT_SECRET` in `.env`.

| Variable | Purpose |
| --- | --- |
| `PORT` | Port used by the Express API (example: `3000`) |
| `DATABASE_URL` | Private Neon PostgreSQL connection string |
| `JWT_SECRET` | Secret used by the backend to sign and verify login tokens |

**Why is `JWT_SECRET` required?** The backend creates a JWT after a successful login and uses the secret to verify JWTs on protected requests. Every developer running their own instance can generate their **own** secret. Users registering through the website do **not** need to know or provide it.

Keep `.env` out of source control. Add a line like `backend/.env` (or an appropriate `.env` pattern) to `.gitignore`. You can safely commit a `.env.example` containing placeholder values.

### 5. Start the backend

From the backend directory:

```bash
npm run dev
```

If your `package.json` does not include a `dev` script, use the startup script defined there (for example, `npm start`). With `PORT=3000`, the API will typically be available at `http://localhost:3000`.

### 6. Start the frontend

In another terminal, from the frontend directory:

```bash
npm run dev
```

Open the local URL printed by your frontend development server. Vite-based React projects typically use `http://localhost:5173`, but the terminal output is the source of truth.

If the frontend cannot reach the API, confirm that its configured backend URL and the Express CORS settings match your local ports.

## How to Use

1. Start the backend and frontend.
2. Create an account using the registration page.
3. Log in to access the tracker.
4. Add and update job applications as you apply for roles.
5. Track interviews and associated documents through the available application screens.

Each installation uses the database configured by its own backend. **Do not share one personal Neon connection string with everyone who clones the repository.**

## Authentication and Security

- Passwords should be hashed before storage.
- The backend uses `JWT_SECRET` to sign and validate JSON Web Tokens.
- Individual users receive their own authentication tokens when they log in.
- The signing secret and database connection string stay on the **backend**, never in React source code.
- Protected endpoints must verify JWTs and enforce record ownership (for example, use the verified user's ID when querying their applications).
- Never commit `.env`, API keys, credentials, or actual user data to a public repository.

> Changing `JWT_SECRET` invalidates previously issued tokens that were signed with the old secret. Users may need to sign in again.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Backend fails to start | Run `npm install`, check the startup command, and confirm `.env` exists inside `backend/`. |
| Neon connection fails | Verify `DATABASE_URL`, credentials, network access, and `sslmode=require`. |
| Missing table/relation error | Initialize the tables by running the actual project schema or migrations. |
| JWT missing / invalid secret error | Generate `JWT_SECRET`, save it in backend `.env`, then restart the server. |
| Authentication suddenly fails | Check whether the signing secret changed and sign in again. |
| Frontend API requests fail | Confirm the backend is running, API URL is correct, and CORS allows the frontend origin. |

## Suggested Repository Files

To make local setup easier for other developers, the repository should include:

- `README.md` — this guide
- `backend/.env.example` — variable names with **placeholder** values only
- `schema.sql` or database migrations — the SQL needed to create the application tables

## Project Status

**Portfolio / local-development project.** The application is not currently hosted publicly. Anyone who downloads the source code must set up their own Neon database and local environment variables.

## License

No license has been specified. Unless a license is added, all rights are reserved.
