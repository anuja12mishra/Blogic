# Blogic

A robust, full-stack blogging platform built with modern web technologies. Blogic enables users to create, manage, and interact with blogs through a beautiful, responsive interface. The platform supports role-based access, advanced content management, and leverages Cloudflare for fast and secure content delivery.

## Features

- **Role-Based Access Control**
  - **User**: Create, edit, and delete their own blogs; comment and like posts.
  - **Admin**: Full privileges to edit or delete any blog, comment, or user-generated content.
- **Modern Frontend**
  - Built with [shadcn/ui](https://ui.shadcn.com/) for a consistent, accessible, and visually appealing component library.
  - Responsive design using Tailwind CSS.
  - Fast build and development workflow with Vite.
- **Robust Backend**
  - RESTful API using Node.js and Express.
  - Modular codebase with clear separation of concerns (controllers, models, routes, middleware).
  - Secure authentication (JWT-based).
  - Scalable and maintainable architecture.
- **User Engagement**
  - Blog creation, editing, and deletion.
  - Commenting and liking system.
  - Admin dashboard for moderation and management.
- **Performance and Security**
  - Integrated with Cloudflare for content delivery, caching, and security enhancements.
- **Developer Experience**
  - Well-organized project structure for both client and backend.
  - Linting and code style enforcement with ESLint.
  - Collaborative development with GitHub version control.

## Tech Stack

- **Frontend:** React, shadcn/ui, Tailwind CSS, Vite, JavaScript
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT
- **Content Delivery:** Cloudflare
- **Other:** ESLint, GitHub Actions (for CI/CD)

## Getting Started

### Prerequisites

- Node.js >= 16.x
- npm or yarn
- MongoDB instance

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anuja12mishra/Blogic.git
   cd Blogic
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   # or
   yarn install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../client
   npm install
   # or
   yarn install
   ```

4. **Configure environment variables:**
   - Create a `.env` file in the `backend` directory using `.env.example` as a reference.

5. **Run the backend server:**
   ```bash
   npm start
   # or
   yarn start
   ```

6. **Run the frontend app:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Open your browser and visit:**
   ```
   http://localhost:5173
   ```

## Folder Structure

```
Blogic/
├── backend/   # Node.js/Express API
├── client/    # Frontend (React, shadcn/ui)
```

## Contributing

Contributions are welcome! Please open issues and pull requests for new features, bug fixes, or suggestions.

## License

This project is licensed under the MIT License.

---

**Made with ❤️ by [anuja12mishra](https://github.com/anuja12mishra)**
