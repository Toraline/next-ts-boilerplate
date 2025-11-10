# Next.js TypeScript Todo Boilerplate

A production-ready Next.js boilerplate built with modern architecture patterns, designed for scalability and maintainability.

## 🎯 Main Goal

This boilerplate serves as a **foundation for building scalable, maintainable web applications** with Next.js. It demonstrates best practices for:

- **Modular Architecture**: Feature-based organization that scales with your team
- **Type Safety**: End-to-end TypeScript with Zod validation
- **Modern Data Fetching**: React Query integration with proper error handling
- **Clean Separation of Concerns**: Clear boundaries between UI, business logic, and data access
- **Developer Experience**: Comprehensive tooling, testing, and development workflows

## 🏗️ Architecture & Issues Solved

### Problems This Boilerplate Addresses

1. **Complex Monolithic Codebases**: As applications grow, they become hard to navigate and maintain
2. **Tight Coupling**: Components, business logic, and data access all mixed together
3. **Poor Developer Experience**: Lack of proper tooling, testing, and development workflows
4. **Type Safety Issues**: Runtime errors due to lack of proper validation and typing
5. **Inconsistent Error Handling**: Different approaches across the application
6. **Hard to Scale**: Teams struggle to work on large applications without clear boundaries

### Our Solution: Modular Feature-Based Architecture

```
src/
├── lib/                    # Shared utilities organized by domain
│   ├── client/            # Client-side utilities (errors, react-query)
│   ├── database/          # Database layer (Prisma)
│   ├── http/              # HTTP layer (API client, server errors)
│   ├── validation/        # Validation utilities
│   └── utils/             # General utilities
├── modules/               # Feature modules (self-contained)
│   └── categories/        # Example feature module
│       ├── schema.ts      # Zod validation schemas
│       ├── types.ts       # TypeScript types
│       ├── server/        # Business logic & data access
│       ├── hooks/         # React Query hooks
│       ├── components/    # UI components
│       ├── views/         # Page views
│       └── constants/     # Feature-specific constants
└── global/                # Global UI components & constants
│        └── components/   # Components that are being used in multiple places
│        └── constants/    # UI generic constants
│        └── hooks/        # Shared hooks 
│        └── styles/       # Shared/global styles. Variables, globals, reset, typography
```

### Key Architecture Principles

1. **Feature Isolation**: Each feature (module) is self-contained with its own schemas, business logic, and UI
2. **Layered Architecture**: Clear separation between UI, business logic, and data access layers
3. **Type Safety**: Zod schemas as single source of truth, inferred TypeScript types
4. **Centralized Error Handling**: Consistent error handling across client and server
5. **Modern Data Fetching**: React Query with caching, optimistic updates, and proper loading states

## 🔧 Tech Stack

### Core Framework
- **Next.js 15+** (App Router) - React framework with server-side rendering
- **TypeScript** - End-to-end type safety
- **React 18+** - Modern React with concurrent features

### Data & State Management
- **Prisma** - Type-safe database ORM with PostgreSQL
- **React Query** - Server state management with caching and synchronization
- **Zod** - Runtime validation and type inference

### Development & Testing
- **Jest + React Testing Library** - Unit and integration testing
- **ESLint + Prettier** - Code quality and formatting
- **Storybook** - Component documentation and testing

### Styling & UI
- **CSS Modules** - Scoped styling approach
- **Global UI Components** - Reusable component library

## 🚀 Getting Started

### First Run

```bash
# Install dependencies
npm ci

# Start database and services
npm run services:up

# Set up database
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed

# If you need to reset db
npm run prisma:reset

# Start development server
npm run dev
```

### Development Workflow

```bash
# View database in browser
npx prisma studio

# Run tests in watch mode (server needs to be up)
npm run test:watch

# Build for production
npm run build

# Start production server
npm start
```

## 🔄 Decoupling & Library Agnostic Design

This boilerplate is designed to be **easily adaptable** to different libraries and tools:

### Swap-Out Points

1. **State Management**
   - Currently: React Query (`@tanstack/react-query`)
   - Easy to swap with: Redux Toolkit, Zustand, Jotai, or SWR

2. **Database ORM**
   - Currently: Prisma
   - Easy to swap with: Drizzle, TypeORM, or raw SQL

3. **Validation**
   - Currently: Zod
   - Easy to swap with: Yup, Joi, or custom validators

4. **Styling**
   - Currently: CSS Modules
   - Easy to swap with: Tailwind CSS, Styled Components, or Emotion

5. **Testing**
   - Currently: Jest + React Testing Library
   - Easy to swap with: Vitest, Testing Library, or Playwright

### How Decoupling Works

The architecture ensures that **business logic and UI are separate**, making it easy to:

- **Change UI Libraries**: Components are pure and only handle presentation
- **Replace Data Layers**: Business logic in `server/` layer is framework-agnostic
- **Switch State Management**: Hooks in `hooks/` folder can be easily adapted
- **Update Validation**: Schema layer is isolated and independently testable

### Example: Switching from React Query to SWR

```typescript
// Before (React Query)
export const useCategoriesList = (query) => {
  return useQuery({
    queryKey: ["categories", query],
    queryFn: () => fetchCategoriesList(query),
  });
};

// After (SWR) - Same interface, different implementation
export const useCategoriesList = (query) => {
  return useSWR(["categories", query], () => fetchCategoriesList(query));
};
```

The component using this hook remains unchanged because the interface is consistent.

## 🔌 API Surface Overview

Each feature module owns a fully validated REST surface, implemented via Next.js App Router handlers and backed by layered services/repositories.

### Users
- `GET /api/users` — paginated list with filtering, sorting, and soft-delete controls.
- `POST /api/users` — creates a user, enforcing unique email/clerk IDs.
- `GET /api/users/:userId` — loads a single user (excludes soft-deleted records).
- `PATCH /api/users/:userId` — partial update; must include at least one field.
- `DELETE /api/users/:userId` — soft delete; repeat deletion returns 404.
- `GET /api/users/:userId/roles` — roles with their permissions.
- `POST /api/users/:userId/roles` — assigns a role (409 on duplicates).
- `DELETE /api/users/:userId/roles/:roleId`
- `GET /api/users/:userId/permissions` — direct permission assignments.
- `POST /api/users/:userId/permissions`
- `DELETE /api/users/:userId/permissions/:permissionId`

### Roles
- `GET /api/roles`, `POST /api/roles`
- `GET /api/roles/:roleId`, `PATCH`, `DELETE`
- `GET /api/roles/:roleId/permissions`
- `POST /api/roles/:roleId/permissions`
- `DELETE /api/roles/:roleId/permissions/:permissionId`

### Permissions
- `GET /api/permissions`, `POST /api/permissions`
- `GET /api/permissions/:permissionId`, `PATCH`, `DELETE`

### Categories
- `GET /api/categories` — paginated list with search support.
- `POST /api/categories` — creates a category, enforcing unique slugs.
- `GET /api/categories/:categoryIdOrSlug` — fetch by cuid or slug.
- `PATCH /api/categories/:categoryIdOrSlug` — updates slug/name/description with conflict checks.
- `DELETE /api/categories/:categoryIdOrSlug`

### Tasks
- `GET /api/tasks` — paginated list with filters (done state, category).
- `POST /api/tasks` — creates a task under a category.
- `GET /api/tasks/:taskId`
- `PATCH /api/tasks/:taskId` — toggles completion or updates description.
- `DELETE /api/tasks/:taskId`

### Audit Logs
- `GET /api/audit-logs` — paginated feed filterable by actor, target type/id, and date range.
- `GET /api/audit-logs/:auditLogId`

Every mutating route records an audit log describing the action, actor, target identifiers, and payload metadata. Zod schemas guard all inputs/outputs; errors propagate through the centralized HTTP helpers.

### Passing Actor Context
Audit entries require an `actorType`. When the caller omits headers, the system defaults to `SYSTEM`. Supply headers to capture real actors:

```
X-Actor-Type: USER | SYSTEM | SERVICE | WEBHOOK | ANONYMOUS
X-Actor-User-Id: <cuid>   # required only when X-Actor-Type = USER
```

Invalid combinations are rejected before the mutation commits, ensuring the audit trail remains consistent.

## 🧱 Shared Foundations

Reusable validation helpers live in `src/lib/validation/`:

- `pagination.ts` — `paginationSchema`, `sortDirectionSchema`, plus `withPagination` to extend feature-specific filters.
- `datetime.ts` — ISO 8601 refinement shared across public DTOs.

Audit logging exposes a simple contract via `modules/audit/types.ts`, keeping the options shape co-located with the feature while allowing other modules to opt in without duplicating definitions.

## 📚 Learn More

- **Module Architecture**: See `src/modules/README.md` for detailed guidelines
- **Categories Example**: Check `src/modules/categories/README.md` for implementation details
- **Adding Features**: Follow the step-by-step guide in the modules documentation

---

Built with ❤️ for scalable, maintainable applications.