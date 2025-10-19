# Categories Module

This module handles all category-related functionality in the application, including CRUD operations, validation, and business logic.

## Database Schema

The `Category` model is defined in `prisma/schema.prisma`:

```prisma
model Category {
  id          String   @id @default(cuid())    // Auto-generated CUID
  slug        String   @unique                 // Unique URL-friendly identifier
  name        String                           // Display name (required)
  description String?                          // Optional description
  createdAt   DateTime @default(now())         // Auto timestamp
  updatedAt   DateTime @updatedAt              // Auto timestamp
}
```

## Key Features

### Dual Identification System
Categories can be accessed via both:
- **ID**: Auto-generated CUID (e.g., `clm123abc456def`)
- **Slug**: User-defined, URL-friendly string (e.g., `my-category`)

The system automatically detects whether a parameter is a CUID or slug and queries accordingly.

### Validation Rules
- **Name**: 2-80 characters, automatically trimmed
- **Slug**: 3-60 characters, lowercase letters/numbers/dashes only, cannot be a CUID format
- **Description**: Optional, max 500 characters

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/categories` | List categories with pagination, search, and sorting |
| `POST` | `/api/categories` | Create a new category |
| `GET` | `/api/categories/[categoryIdOrSlug]` | Get category by ID or slug |
| `PATCH` | `/api/categories/[categoryIdOrSlug]` | Update category by ID or slug |
| `DELETE` | `/api/categories/[categoryIdOrSlug]` | Delete category by ID or slug |

### Query Parameters (GET /api/categories)
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 20, max: 100)
- `search`: Search in name, slug, or description
- `sortBy`: Sort field (`createdAt`, `name`, `updatedAt`, `slug`) (default: `createdAt`)
- `sortDir`: Sort direction (`asc`, `desc`) (default: `desc`)

## Architecture

### Data Flow
1. **API Layer** (`src/app/api/categories/`): Handles HTTP requests/responses
2. **Service Layer** (`src/modules/categories/server/service.ts`): Business logic and validation
3. **Repository Layer** (`src/modules/categories/server/repo.ts`): Database operations with Prisma
4. **Schema Layer** (`src/modules/categories/schema.ts`): Zod validation schemas

### File Structure
```
src/modules/categories/
├── schema.ts                    # Zod validation schemas
├── server/
│   ├── service.ts              # Business logic layer
│   └── repo.ts                 # Database repository layer
├── components/                 # Category-specific UI components
├── views/                      # Category views/pages
└── README.md                   # This documentation
```

## Usage Examples

### Create Category
```typescript
const newCategory = {
  name: "My Category",
  slug: "my-category",
  description: "Optional description"
};

const response = await fetch('/api/categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newCategory)
});
```

### Get Category by Slug
```typescript
const response = await fetch('/api/categories/my-category');
const category = await response.json();
```

### List Categories with Search
```typescript
const response = await fetch('/api/categories?search=work&page=1&pageSize=10');
const data = await response.json();
// Returns: { items: [...], total: 25, page: 1, pageSize: 10 }
```

## Error Handling

The module includes comprehensive error handling:
- Validation errors for invalid input data
- Conflict errors for duplicate slugs
- Not found errors for non-existent categories
- Proper HTTP status codes and error messages

## Type Definitions

The module exports several TypeScript types via Zod schemas:
- `Category`: Basic category type
- `categoryPublicSchema`: Public API response format
- `createCategorySchema`: Category creation validation
- `updateCategorySchema`: Category update validation
- `listCategoriesResponseSchema`: Paginated list response format
