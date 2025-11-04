# Banking Admin Portal Api Collection 🏦

A modern, secure banking administration portal built for bank employees to efficiently manage customer accounts, perform financial transactions, and oversee banking operations.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Code Quality](#code-quality)
- [Contributing](#contributing)


## 🛠 Technology Stack

### Frontend Framework
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### Styling & UI
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Custom Components** - Reusable UI component library
- **Responsive Design** - Desktop-first approach

### Routing & Navigation
- **React Router v7** - Client-side routing and navigation

### Code Quality & Development
- **ESLint** - Comprehensive linting with banking-focused rules
- **Prettier** - Consistent code formatting
- **TypeScript** - Strict type checking

## 🏗 Architecture

The project follows a **Hybrid Feature-Based Architecture** that combines the benefits of feature-based and layer-based organization:

### Core Structure
```
src/
├── app/          # Application configuration & global setup
├── shared/       # Reusable components, hooks, and utilities
├── features/     # Feature-specific modules with complete ownership
├── pages/        # Main page orchestrators
└── assets/       # Static assets
```

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher (or yarn/pnpm equivalent)
- **Git** for version control

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pol-admin-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 💻 Development

### Development Server
```bash
npm run dev          # Start development server with HMR
```

### Build & Preview
```bash
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Code Quality
```bash
npm run quality:check    # Check all code quality (types, lint, format)
npm run quality:fix      # Fix all auto-fixable issues
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run type-check       # TypeScript type checking
```

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server with hot module replacement |
| `build` | Build application for production |
| `preview` | Preview production build locally |
| `lint` | Run ESLint to check code quality |
| `lint:fix` | Auto-fix ESLint issues |
| `format` | Format all files with Prettier |
| `format:check` | Check if files are properly formatted |
| `type-check` | Run TypeScript compiler for type checking |
| `quality:check` | Run all quality checks (types, lint, format) |
| `quality:fix` | Fix all auto-fixable quality issues |

## 🔍 Code Quality

This project maintains high code quality standards through:

### Automated Quality Checks
- **Pre-commit Hooks** - Automatic linting and formatting before commits
- **TypeScript Strict Mode** - Enhanced type safety
- **ESLint Rules** - Comprehensive linting including React, accessibility, and security rules
- **Prettier Integration** - Consistent code formatting

### Development Standards
- **Component Guidelines** - Functional components with TypeScript interfaces
- **Import Organization** - Consistent import ordering and aliasing
- **File Naming Conventions** - Clear and consistent naming patterns
- **Error Handling** - Comprehensive error boundaries and user feedback

### Testing Requirements
- Unit tests for custom hooks
- Component tests for interactive components
- Integration tests for user workflows
- 80% code coverage target for critical business logic

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `development`
2. Follow established coding standards and conventions
3. Write tests for new features
4. Run quality checks: `npm run quality:check`
5. Submit pull request with clear description

### Code Style
- Use TypeScript interfaces for all component props
- Follow PascalCase for components, camelCase for functions
- Include JSDoc comments for exported functions
- Use Tailwind CSS for styling with desktop-first approach
- Implement proper error handling and loading states
