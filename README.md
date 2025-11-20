# 🎵 VibeTec - DJ & Artist Booking Platform

> **Modern Full-Stack Web Application** | React 19 • Node.js • Express • MongoDB • Tailwind CSS 4

A comprehensive DJ and artist booking platform featuring real-time calendar management, secure user authentication, and an advanced admin dashboard. Built to demonstrate enterprise-level web development practices with modern technologies.

[![Live Demo](https://img.shields.io/badge/Live_Demo-🌐_View_Site-brightgreen)](https://vibetec.onrender.com)
[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)](#-tech-stack)
[![License](https://img.shields.io/badge/License-Portfolio_Project-orange)](#-license)

> **⚠️ Live Demo Note:** The application is hosted on Render's free tier. The first load may take 30-60 seconds as the server spins up after 15 minutes of inactivity.

### 🔐 Demo Account

Test the live demo with the following credentials:

**Email:** `demo@vibetec.com`  
**Password:** `demo`

> **Note:** This demo account has read-only access to the admin panel, allowing you to explore all features without modifying data.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development Highlights](#-development-highlights)
- [Screenshots](#-screenshots)
- [Contact](#-contact)
- [License](#-license)

## ✨ Features

### User Features

- 🎨 **Artist Discovery** - Browse comprehensive artist profiles with photo galleries
- 📅 **Smart Booking** - Interactive calendar with real-time availability
- 👤 **User Profiles** - Personal dashboard to manage bookings and preferences
- 🔐 **Secure Authentication** - JWT-based auth with password encryption
- 📱 **Responsive Design** - Seamless experience across all devices
- 🎭 **Event Details** - Structured event information (type, location, guests, music preferences)

### Admin Features

- 📊 **Analytics Dashboard** - Real-time booking statistics and revenue tracking
- 👥 **User Management** - Complete user administration and role management
- 🎤 **Artist Management** - CRUD operations for artist profiles
- 📋 **Booking Overview** - Comprehensive booking management with filtering
- 🎨 **Theme Customization** - Multiple theme options with live preview
- 🔍 **Advanced Filtering** - Search and sort across all data tables

### Technical Features

- ⚡ **Performance** - React 19 with optimized rendering
- 🛡️ **Security** - Input validation (Zod), XSS protection, secure headers
- 📦 **State Management** - Context API for global state
- 🎯 **Type Safety** - Schema validation on client and server
- 🌐 **RESTful API** - Clean, documented API endpoints
- 🔄 **Auto-Updates** - User data synchronization across bookings

## 🛠️ Tech Stack

### Frontend

| Technology         | Purpose                                                |
| ------------------ | ------------------------------------------------------ |
| **React 19**       | Latest React with modern hooks and concurrent features |
| **React Router 7** | Client-side routing and navigation                     |
| **Tailwind CSS 4** | Utility-first CSS framework                            |
| **DaisyUI 5**      | Component library for Tailwind                         |
| **Vite 6**         | Next-generation frontend tooling                       |
| **Axios**          | HTTP client for API requests                           |

### Backend

| Technology     | Purpose                            |
| -------------- | ---------------------------------- |
| **Node.js**    | JavaScript runtime                 |
| **Express.js** | Web application framework          |
| **MongoDB**    | NoSQL database                     |
| **Mongoose**   | MongoDB ODM                        |
| **JWT**        | Secure token-based authentication  |
| **Zod**        | TypeScript-first schema validation |
| **bcrypt**     | Password hashing                   |

### DevOps

- **Render** - Cloud hosting platform
- **Git** - Version control
- **ESLint** - Code linting
- **Environment Variables** - Secure configuration management

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/AchimK-dev/VibeTec.git
cd VibeTec
```

2. **Install dependencies**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Configuration**

Create `.env` files in both `/server` and `/client` directories:

**Server (.env)**

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

**Client (.env)**

```env
VITE_API_URL=http://localhost:5000
```

4. **Run the application**

```bash
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm run dev
```

5. **Access the application**

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 📁 Project Structure

```
VibeTec/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Layout components
│   │   ├── data/          # API service layer
│   │   └── config/        # Configuration files
│   └── public/            # Static assets
│
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middlewares/       # Custom middleware
│   ├── utils/             # Utility functions
│   ├── zod/               # Validation schemas
│   └── db/                # Database configuration
│
└── README.md
```

## � Development Highlights

### Architecture & Design Patterns

- **MVC Pattern** - Clear separation of concerns
- **Component-Based Architecture** - Reusable React components
- **Context API** - Global state management for auth and themes
- **Custom Hooks** - Encapsulated business logic
- **Service Layer** - Centralized API communication

### Code Quality

- **Clean Code** - Self-documenting, production-ready codebase
- **Modular Structure** - Easy to maintain and extend
- **Error Handling** - Comprehensive error management
- **Security Best Practices** - Input validation, XSS protection, secure headers
- **Performance Optimization** - Lazy loading, memoization, efficient rendering

### Key Implementation Details

- **JWT Authentication** - Secure token-based auth with refresh logic
- **Schema Validation** - Zod schemas on both client and server
- **Responsive Design** - Mobile-first with Tailwind CSS
- **Data Synchronization** - User profile auto-updates from booking data
- **Admin Dashboard** - Real-time statistics and data visualization
- **Calendar Integration** - Interactive booking calendar with availability tracking

---

## 📸 Screenshots

### Homepage (Theme - Light)

![Homepage Preview](https://res.cloudinary.com/dcioapkue/image/upload/v1763652480/homepage.png)

### Artist Profiles (Theme - Dark)

![Artist Profile](https://res.cloudinary.com/dcioapkue/image/upload/v1763652481/artists.png)

### Admin Dashboard (Theme - Light)

![Admin Dashboard](https://res.cloudinary.com/dcioapkue/image/upload/v1763652480/admin_dashboard.png)

### Booking Calendar (Theme - Dark)

![Booking Calendar](https://res.cloudinary.com/dcioapkue/image/upload/v1763652481/booking.png)

---

## 📞 Contact

**Achim Klein** - Full-Stack Web Developer

This project is part of my professional portfolio, showcasing expertise in modern web technologies and full-stack development.

### Let's Connect

- 📧 **Email:** [achimklein95@gmail.com](mailto:achimklein95@gmail.com)
- 💼 **LinkedIn:** [linkedin.com/in/achim-klein](https://www.linkedin.com/in/achim-klein-dev)
- 💻 **GitHub:** [@AchimK-dev](https://github.com/AchimK-dev)

### Available For

- Full-Stack Development positions
- Freelance projects
- Collaboration opportunities

---

## 📄 License

**Portfolio Demonstration Project** - © 2025 Achim Klein

This project is publicly available for portfolio review and educational purposes. While the code is viewable, it is not licensed for commercial use, modification, or redistribution without explicit permission.

**Technologies used in this project are subject to their respective licenses:**

- React, Node.js, Express - MIT License
- MongoDB - Server Side Public License
- Tailwind CSS, DaisyUI - MIT License

---

<div align="center">

**⭐ If you found this project interesting, please consider giving it a star!**

Made with ❤️ by [Achim Klein](https://www.linkedin.com/in/achim-klein-dev)

</div>
