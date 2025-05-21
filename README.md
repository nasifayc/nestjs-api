# 🛡️ NestJS Bookmark API

A secure, modular RESTful API built with **NestJS** featuring **user authentication**, **bookmark management**, **end-to-end testing**, and **Dockerized deployment**.

---

## 🚀 Features

- ✅ User Authentication (JWT, Email & Password)
- 🔖 Bookmark CRUD (Title, Link, Description)
- 🧪 End-to-End Testing with **Jest** & **Pactum**
- 📦 Prisma ORM with PostgreSQL
- 🐳 Fully Dockerized Setup
- 📐 Clean Architecture & Modular Design
- 🧰 RESTful API Structure with Validation

---

## 🛠️ Tech Stack

- **Backend**: [NestJS](https://nestjs.com/) (TypeScript)
- **Database**: PostgreSQL + [Prisma](https://www.prisma.io/)
- **Testing**: [Jest](https://jestjs.io/), [Pactum](https://pactumjs.github.io/)
- **Deployment**: [Docker](https://www.docker.com/), Docker Compose
- **Validation**: class-validator + DTOs

---

## 📂 Project Structure

```

src/
├── auth/ # Auth module (signup, signin)
├── user/ # User profile & editing
├── bookmark/ # Bookmark CRUD operations
├── prisma/ # Prisma service
├── Strategy/ # Guards, interceptors, pipes
└── main.ts # App bootstrap

```

---

## 🚧 Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/nestjs-bookmark-api.git
cd nestjs-bookmark-api


```

### 2️⃣ Setup Environment Variables

Create a .env file in the root directory:

````bash

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bookmarkdb"
JWT_SECRET="your_jwt_secret"

 ```

### 3️⃣ Run with Docker (Recommended)

docker-compose up --build

## 🧪 Running Tests

#### run pnpm test:e2e
````
