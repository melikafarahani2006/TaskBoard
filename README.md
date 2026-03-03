# TaskBoard

A full-stack task management application with user authentication and role-based access control.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **User Management**: User profile and account management
- **Role-Based Access Control**: Different permissions based on user roles
- **Dashboard**: Interactive dashboard for task overview
- **Responsive UI**: Built with modern Vue.js framework

## 🛠 Tech Stack

### Backend

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport.js
- **Validation**: Class-validator and class-transformer
- **Password Hashing**: Bcrypt
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest

### Frontend

- **Framework**: Vue.js 3
- **Language**: TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Routing**: Vue Router 4
- **Styling**: CSS

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (cloud)
- **Git** - For version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TaskBoard
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend` folder with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/taskboard
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskboard

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=3600

# Application
PORT=3000
NODE_ENV=development
```

### Frontend Configuration

The frontend is configured to connect to the backend API at `http://localhost:3000` by default. You can modify this in [api/axios.ts](frontend/src/api/axios.ts) if needed.

## 📡 Running the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Start Backend:**

```bash
cd backend
npm run start:dev
```

The backend will start on `http://localhost:3000`

**Terminal 2 - Start Frontend:**

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another available port)

### Option 2: Run from Root Directory

If you want to manage both processes, you can set up scripts in the root `package.json`.

## 📂 Project Structure

```
TaskBoard/
├── backend/
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dtos/          # Login/Register DTOs
│   │   │   ├── guards/        # Auth guards
│   │   │   └── strategies/    # Passport strategies
│   │   ├── tasks/             # Tasks management module
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── tasks.module.ts
│   │   │   ├── dtos/          # Task DTOs
│   │   │   └── schemas/       # MongoDB schema
│   │   ├── users/             # Users management module
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   ├── dtos/
│   │   │   └── schemas/
│   │   ├── common/            # Shared utilities
│   │   │   ├── decorators/    # Custom decorators
│   │   │   └── enums/         # Enums
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts            # Entry point
│   ├── test/                  # E2E tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Vue components
│   │   │   ├── TaskList.vue
│   │   │   └── HelloWorld.vue
│   │   ├── views/             # Page components
│   │   │   ├── Dashboard.vue
│   │   │   ├── Login.vue
│   │   │   └── Register.vue
│   │   ├── api/               # API configuration
│   │   │   └── axios.ts
│   │   ├── router/            # Vue Router setup
│   │   ├── assets/            # Static assets
│   │   ├── App.vue
│   │   ├── main.ts            # Entry point
│   │   └── style.css
│   └── package.json
└── package.json
```

## 📚 API Documentation

Once the backend is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

## 🧪 Testing

### Run Backend Tests

```bash
# Unit tests
cd backend
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 🔐 Authentication Flow

1. User registers with email and password
2. Create account with hashed password (bcrypt)
3. User logs in with credentials
4. Server generates JWT token
5. Token is sent to frontend and stored
6. Frontend includes token in Authorization header for protected routes
7. Backend validates token using Passport JWT strategy

## 🎯 Available Scripts

### Backend Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start dev server with auto-reload
- `npm run start:debug` - Start with debugger
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure:

- Code follows the project's style guide
- Tests pass (`npm run test`)
- Code is formatted (`npm run format`)
- No ESLint errors (`npm run lint`)

## 📝 License

This project is licensed under the UNLICENSED license. See the LICENSE file for details.

## 🆘 Support

If you encounter any issues, please:

1. Check the [GitHub Issues](https://github.com/yourusername/TaskBoard/issues)
2. Create a new issue with detailed information
3. Include your environment setup (Node version, OS, etc.)

## 🔄 Environment Setup Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running (`mongod` on command line)
- Check MongoDB URI in `.env` file
- For MongoDB Atlas, whitelist your IP address

### Port Already in Use

- Backend default port: 3000
- Frontend default port: 5173
- Change ports in respective configuration files

### JWT Errors

- Ensure `JWT_SECRET` is set in `.env`
- Check token expiration time
- Clear browser session storage if token issues persist

---

Made with ❤️ by the TaskBoard Team
