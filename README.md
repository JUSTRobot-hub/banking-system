# Banking System Backend

Welcome to the repository for the backend of our Banking System, implemented using NestJS and TypeScript.

## Table of Contents

- [Objective](#objective)
- [Features](#features)
- [Getting Started](#getting-started)

## Objective

Develop a robust backend application for a Banking System using NestJS and TypeScript. Showcase proficiency in designing and interacting with SQL databases, implementing secure, scalable, and efficient backend solutions.

## Features

1. **User & Account Management**: CRUD operations for user accounts, incorporating banking details.
2. **Financial Transactions**: Deposit, withdrawal, and fund transfer functionalities between accounts.
3. **Balance Management**: Accurately calculate and update account balances post transactions.
4. **Database Integration**: Integration with a SQL database, such as PostgreSQL.

## Getting Started

### Prerequisites

- Node.js and npm installed
- Docker (for containerization)
- PostgreSQL database

### Setup <span style="background-color: #FFFF00">without</span> Docker

1. Clone the repository:

```bash
$ git clone https://github.com/JUSTRobot-hub/banking-system.git
$ cd banking-system
```

2. Install dependencies:

```bash
$ npm install
```

3. Setup the enviornment

```
Create 2 .env file like (.env.example), 1 for development mode and the other for the production
Development Mode: .env.development
Production Mode: .env.production
```

4. How to run

```bash
$ npm run start:prod (for production mode)
$ npm run start:dev (for development mode)
```

### Setup <span style="background-color: #FFFF00">with</span> Docker

1. Clone the repository:

```bash
$ git clone https://github.com/JUSTRobot-hub/banking-system.git
$ cd banking-system
```

2. Setup the enviornment

```bash
Create 2 .env file like (.env.example), 1 for development mode and the other for the production
Development Mode: .env.development
Production Mode: .env.production
```

3. Install dependencies:

```bash
$ docker build -t banking-system .
```

4. How to run

```bash
$ docker run -p 5500:5500 -p 5432:5432 banking-system (for production mode)
```

### Backend URL

1. The backend APIs are accessible at the following base URL:
   [http://localhost:5500](http://localhost:5500)

2. Once the development server is running, open your web browser and navigate to the following URL:

   [http://localhost:5500/api-docs](http://localhost:5500/api-docs)

   This will open the Swagger UI documentation, where you can explore and interact with the API endpoints.

**Note:** The API Documentation is only working in development mode. it is disabled in production mode for security reasons.
