# TestTrack Pro

TestTrack Pro is a **test case management and bug tracking platform** designed to help software teams manage testing workflows efficiently.
It enables teams to create and execute test cases, track bugs, collaborate between testers and developers, and generate reports for project insights.

The platform integrates testing, bug tracking, reporting, and developer workflows into a **single centralized system**.

---

# Key Features

## Test Case Management

* Create and manage test cases
* Organize test cases into modules and suites
* Assign priority and severity levels
* Track test case lifecycle

## Test Execution

* Execute test cases
* Record results as **Pass / Fail**
* Track execution runs
* Generate execution reports

## Bug Tracking

* Report bugs directly from failed test cases
* Assign bugs to developers
* Track bug lifecycle (Open → In Progress → Fixed → Verified → Closed)

## Developer Workflow

* Developers manage assigned bugs
* Attach **commit links** to bug fixes
* Provide fix notes
* Mark bugs as resolved

## Bug Verification

* Testers verify fixes
* Reopen bugs if issues persist
* Close bugs after successful verification

## Reports and Analytics

* Bug report analytics
* Developer performance reports
* Test execution reports
* Export reports in **PDF or Excel**

## Integrations

* Git commit linking for bug fixes
* Webhooks for external integrations
* REST API access
* API key authentication

---

# Technology Stack

## Frontend

* React
* React Router
* CSS

## Backend

* Node.js
* Express.js
* Prisma ORM
* JWT Authentication
* Swagger API Documentation

## Database

* PostgreSQL

## Infrastructure

* GitHub for version control
* GitHub Actions for CI pipeline
* Docker Compose for container setup

---

# Project Architecture

TestTrack Pro follows a **monorepo architecture** where frontend and backend applications are maintained within a single repository.

```
testtrack-pro
│
├── apps
│   ├── api/backend
│   │   ├── src
│   │   ├── prisma
│   │   └── package.json
│   │
│   └── web/frontend
│       ├── src
│       ├── public
│       └── package.json
│
├── docs
│   ├── architecture
│   ├── setup
│   └── user
│
├── .github
│   └── workflows
│       └── ci.yml
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/Tejaswini-L-G/testtrack-pro.git
cd testtrack-pro
```

---

## 2. Install Dependencies

### Backend

```bash
cd apps/api/backend
npm install
```

### Frontend

```bash
cd apps/web/frontend
npm install
```

---

## 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update values such as:

```
DATABASE_URL
JWT_SECRET
PORT
```

---

## 4. Run Database Migration

```bash
npx prisma migrate dev
```

---

## 5. Start Backend Server

```bash
npm start
```

Backend runs at:

```
http://localhost:5000
```

---

## 6. Start Frontend Application

```bash
cd apps/web/frontend
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

# API Documentation

The backend includes **Swagger API documentation**.

Access the documentation at:

```
http://localhost:5000/api-docs
```

The API documentation includes:

* Endpoint descriptions
* Request parameters
* Response examples
* Error responses

---

# CI Pipeline

The project includes a **GitHub Actions CI pipeline**.

The CI pipeline automatically runs on Pull Requests and performs:

1. Code checkout
2. Node.js setup
3. Dependency installation
4. Frontend build verification

This ensures the project builds successfully before merging changes.

---

# Documentation

Additional documentation is available in the **docs folder**.

```
docs/
├── architecture
│   └── system-design.md
│
├── setup
│   └── installation.md
│
├── user
│   └── faq.md
│
└── contributing.md
```

Documentation includes:

* Architecture overview
* Setup guides
* User documentation
* Developer contribution guidelines

---

# Contributing

Contributions are welcome.

Please follow the guidelines in:

```
docs/contributing.md
```

Development workflow:

1. Create a feature branch
2. Implement changes
3. Push the branch
4. Create a Pull Request
5. CI pipeline must pass before merging

---


# Author

**Tejaswini L G**

GitHub:
https://github.com/Tejaswini-L-G
