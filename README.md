# Fairpoint Software - Tax & Accounting Platform

A modern, scalable tax and accounting software platform built with Next.js 15, featuring a feature-based architecture with strict architectural boundaries.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 Available Scripts

| Command             | Description               |
| ------------------- | ------------------------- |
| `pnpm dev`          | Start development server  |
| `pnpm build`        | Build for production      |
| `pnpm start`        | Start production server   |
| `pnpm lint`         | Run ESLint                |
| `pnpm lint:fix`     | Fix ESLint issues         |
| `pnpm format`       | Format code with Prettier |
| `pnpm format:check` | Check code formatting     |

## 🏗️ Architecture Overview

### Feature-Based Architecture with Boundaries

This project enforces a strict **feature-based architecture** using ESLint boundaries plugin to prevent architectural violations and ensure maintainable, scalable code.

#### Architectural Layers

```
src/
├── app/                    # Next.js App Router (pages, layouts)
├── components/             # Shared UI components
├── features/               # Feature modules (isolated)
├── lib/                    # Shared utilities
├── hooks/                  # Shared custom hooks
├── server/                 # Server-side logic
├── drizzle/                # Database schema and migrations
└── data/                   # Static data and constants
```

#### Boundary Rules

| Layer          | Can Import From            | Purpose                                      |
| -------------- | -------------------------- | -------------------------------------------- |
| **Shared**     | Other shared modules only  | Reusable utilities, components, server logic |
| **Feature**    | Shared + same feature only | Self-contained feature modules               |
| **App**        | Shared + any feature       | Next.js pages and layouts                    |
| **Restricted** | Nothing                    | Root files and task utilities                |

### Feature Structure Example

```
src/features/business-registration/
├── components/
│   ├── business-registration-wizard.tsx
│   ├── steps/
│   └── ui/
├── hooks/
├── lib/
│   ├── schemas.ts
│   └── types.ts
└── index.ts
```

## 🛠️ Technology Stack

### Core Framework

- **Next.js 15.4.6** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Modern component library (New York style)
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library

### State Management

- **TanStack Query v5** - Server state management
- **Zustand** - Client-side global state
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Database & Backend

- **Drizzle ORM** - Type-safe database queries
- **Clerk** - Authentication (inferred from business context)

### Development Tools

- **ESLint** - Code linting with boundaries enforcement
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Staged file processing
- **pnpm** - Package manager

## 📁 Project Structure

```
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Home page
│   ├── components/                   # Shared components
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── animate-ui/              # Custom animated components
│   │   ├── providers/               # React providers
│   │   └── theme-provider.tsx       # Theme management
│   ├── features/                     # Feature modules
│   │   └── [feature-name]/          # Individual features
│   ├── hooks/                        # Shared custom hooks
│   ├── lib/                          # Utility functions
│   │   ├── utils.ts                 # Common utilities
│   │   └── store.ts                 # Query client config
│   ├── server/                       # Server-side logic
│   │   └── [domain]/                # Domain-specific server code
│   ├── drizzle/                      # Database schema
│   │   └── schemas/                 # Table definitions
│   └── data/                         # Static data
├── components.json                   # shadcn/ui configuration
├── eslint.config.mjs                # ESLint configuration
├── next.config.ts                   # Next.js configuration
├── package.json                     # Dependencies and scripts
├── postcss.config.mjs               # PostCSS configuration
├── prettier.config.js               # Prettier configuration
├── tailwind.config.ts               # Tailwind configuration
└── tsconfig.json                    # TypeScript configuration
```

## 🔧 Configuration Files

### ESLint Configuration

- **Boundaries Plugin**: Enforces architectural rules
- **TanStack Query**: Enforces query best practices
- **Next.js**: Core web vitals and TypeScript support

### Prettier Configuration

- Single quotes, semicolons, 2-space indentation
- 80 character line width
- Arrow parentheses avoided when possible

### Path Aliases

```typescript
{
  "@/*": ["./src/*"],
  "@/components": ["./src/components"],
  "@/lib": ["./src/lib"],
  "@/hooks": ["./src/hooks"]
}
```

## 🔍 Code Quality

### Git Hooks (Husky + lint-staged)

- **Pre-commit**: Automatically lint and format staged files
- **Commit-msg**: Enforce commit message conventions

### ESLint Rules

- Architectural boundaries enforcement
- TanStack Query exhaustive dependencies
- Next.js best practices
- TypeScript strict mode

## 🌟 Key Features

### Component System

- **shadcn/ui**: Modern, accessible components
- **Animation System**: Framer Motion integration
- **Theme Support**: Dark/light mode with CSS variables
- **Responsive Design**: Mobile-first approach

### State Management

- **Server State**: TanStack Query with 5min stale time
- **Client State**: Zustand for global state
- **Form State**: React Hook Form with Zod validation
- **URL State**: nuqs for search params

### Developer Experience

- **Type Safety**: Full TypeScript coverage
- **Hot Reload**: Fast development feedback
- **Code Generation**: Automatic type inference
- **Error Boundaries**: Graceful error handling

## 🚀 Getting Started with Development

1. **Clone the repository**
2. **Install dependencies**: `pnpm install`
3. **Set up environment variables** (see `.env.example`)
4. **Run database migrations** (if applicable)
5. **Start development server**: `pnpm dev`

## 📚 Additional Documentation

- [Coding Standards](./CODING_STANDARDS.md) - Detailed coding guidelines and best practices
- [Developer Mindset](./DEVELOPER_MINDSET.md) - Mental models and thinking frameworks for development

## 🤝 Contributing

Please read our coding standards and developer mindset documentation before contributing. All code must pass ESLint and Prettier checks before being committed.

## 📄 License

Private - Fairpoint Software Inc.
