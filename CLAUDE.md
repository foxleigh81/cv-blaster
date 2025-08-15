# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CV Blaster is a web application for managing and generating CVs. The project is currently being rebuilt on the `rebuild` branch with a Next.js frontend and a planned NestJS backend.

## Development Commands

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test:ts      # TypeScript type checking
```

### Full Stack Development
```bash
docker-compose up    # Start all services (frontend, backend, PostgreSQL)
```

## Important - PRIME DIRECTIVE

Always use agents to do the coding, never do the work yourself, you are an orchestrator only. Tell the agents to look in the planfiles and helpfiles folders in .claude to assess what they are doing.

Every time a task is complete, please ask for me to approve it, if I do then the planfile for the task should be updated and you may move on to the next part of the plan if there is one.

You NEVER have explicit permission to commit files, you must always seek my approval and if I grant it for one thing, consider it immediately revoked afterwards.

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui components, NextAuth.js
- **Backend**: Currently being rebuilt (planned: NestJS)
- **Database**: PostgreSQL
- **Infrastructure**: Docker, docker-compose

### Key Directories
- `/frontend/app/` - Next.js App Router pages and layouts
- `/frontend/components/ui/` - shadcn/ui reusable components
- `/frontend/components/local/` - Application-specific components
- `/frontend/lib/` - Utilities, auth configuration, providers

### Authentication Flow
1. OAuth providers (GitHub, LinkedIn) configured in `frontend/lib/auth-options.ts`
2. NextAuth handles session management
3. Backend JWT sync for API authentication
4. Protected routes use NextAuth session checks

### Component Patterns
- Uses shadcn/ui components (New York style) built on Radix UI
- Component variants managed with class-variance-authority (cva)
- Compound component patterns for complex UI elements
- All UI components are in `/frontend/components/ui/`

### Styling Conventions
- TailwindCSS for utility classes
- CSS custom properties defined in `globals.css` for theming
- Component-specific styles use `cn()` utility for class merging
- Design tokens configured in `tailwind.config.ts`

### Environment Configuration
Create `.env.local` in `/frontend` with:
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- OAuth credentials: `GITHUB_ID`, `GITHUB_SECRET`, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`
- `NEXT_PUBLIC_API_URL` for backend communication

### Current Routes
- `/` - Landing page
- `/dashboard` - Main dashboard (protected)
- `/dashboard/skills` - Skills management (planned)
- `/dashboard/history` - Career history (planned)
- `/dashboard/settings` - User settings (planned)

## Testing & Quality Checks

Before committing changes:
1. Run `npm run lint` in frontend directory
2. Run `npm run test:ts` for TypeScript checking
3. Ensure all environment variables are properly configured
4. Test OAuth login flow if authentication changes were made