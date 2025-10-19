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
5. **Hooks Layer** (`src/modules/categories/hooks/`): React Query hooks for client-side data fetching

### File Structure
```
src/modules/categories/
├── schema.ts                    # Zod validation schemas
├── types.ts                     # TypeScript types inferred from Zod schemas
├── server/
│   ├── service.ts              # Business logic layer
│   └── repo.ts                 # Database repository layer
├── hooks/
│   ├── index.ts                # Barrel export for all hooks
│   ├── useCategoriesList.ts    # React Query hook for categories list
│   ├── useCategory.ts          # React Query hook for single category
│   ├── useCreateCategory.ts    # React Query mutation for creating categories
│   ├── useUpdateCategory.ts    # React Query mutation for updating categories
│   └── useDeleteCategory.ts    # React Query mutation for deleting categories
├── components/                 # Category-specific UI components
├── views/                      # Category views/pages
└── README.md                   # This documentation
```

## Usage Examples

### React Query Hooks (Client-side)

All client-side data fetching is handled through React Query hooks that provide caching, optimistic updates, and error handling.

#### `useCategoriesList` - Fetch Categories List
```typescript
import { useCategoriesList } from "modules/categories";

function CategoriesPage() {
  const { data, isLoading, error } = useCategoriesList({
    page: 1,
    pageSize: 20,
    search: "work",
    sortBy: "name",
    sortDir: "asc"
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;
  
  return (
    <div>
      {data?.items.map(category => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  );
}
```

#### `useCategory` - Fetch Single Category
```typescript
import { useCategory } from "modules/categories";
import { ApiError } from "lib/client-errors";

function CategoryPage({ categoryIdOrSlug }) {
  const { data: category, isLoading, error } = useCategory(categoryIdOrSlug);
  
  if (isLoading) return <div>Loading...</div>;
  if (error instanceof ApiError && error.status === 404) {
    return <div>Category not found</div>;
  }
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{category.name}</div>;
}
```

#### `useCreateCategory` - Create Category Mutation
```typescript
import { useCreateCategory } from "modules/categories";
import { useRouter } from "next/navigation";

function CreateCategoryForm() {
  const router = useRouter();
  const createCategoryMutation = useCreateCategory();
  
  const handleSubmit = (data) => {
    createCategoryMutation.mutate(data, {
      onSuccess: (newCategory) => {
        router.push(`/categories/${newCategory.slug}`);
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createCategoryMutation.isPending}>
        {createCategoryMutation.isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
```

#### `useUpdateCategory` - Update Category Mutation
```typescript
import { useUpdateCategory } from "modules/categories";

function EditCategoryForm({ categoryIdOrSlug, initialState }) {
  const updateMutation = useUpdateCategory();
  
  const handleSubmit = (formData) => {
    // Only send changed fields
    const updates = {};
    if (formData.name !== initialState.name) updates.name = formData.name;
    if (formData.slug !== initialState.slug) updates.slug = formData.slug;
    if (formData.description !== (initialState.description || "")) {
      updates.description = formData.description;
    }
    
    if (Object.keys(updates).length === 0) {
      // Show user feedback for no changes
      return;
    }
    
    updateMutation.mutate(
      { categoryIdOrSlug, updates },
      { onSuccess: () => router.push(`/categories/${newSlug}`) }
    );
  };
}
```

#### `useDeleteCategory` - Delete Category Mutation
```typescript
import { useDeleteCategory } from "modules/categories";

function DeleteButton({ categorySlug }) {
  const router = useRouter();
  const deleteMutation = useDeleteCategory();
  
  const handleDelete = () => {
    if (!confirm("Are you sure?")) return;
    
    deleteMutation.mutate(categorySlug, {
      onSuccess: () => router.push("/categories")
    });
  };
  
  return (
    <button 
      onClick={handleDelete}
      disabled={deleteMutation.isPending}
    >
      {deleteMutation.isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
```

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

The module includes comprehensive client-side and server-side error handling:

### Server-side Error Handling
- **Validation errors** for invalid input data
- **Conflict errors** for duplicate slugs  
- **Not found errors** for non-existent categories
- **Proper HTTP status codes** and error messages using `getErrorMessage()` and `getHttpStatus()`

### Client-side Error Handling
- **Centralized error processing** through `ApiError` class
- **404-specific handling** - no retries on 404 errors, shows "Category not found"
- **Form validation feedback** - user-friendly messages when no changes detected
- **Loading states** for all operations
- **Automatic cache invalidation** on mutations

### React Query Integration
- **Smart retry logic** - doesn't retry 404 errors, retries network errors up to 3 times
- **Cache management** - automatic updates when categories are created/updated/deleted
- **Optimistic updates** where appropriate

## Type Definitions

The module exports TypeScript types from `types.ts` (inferred from Zod schemas):

### Entity Types
- `Category`: Category entity type (from `categoryPublicSchema`)

### API Response Types  
- `ListCategoriesResponse`: Response type for categories list
- `ListCategoriesQuery`: Query parameters type for categories list
- `CategoriesListFilters`: Form validation type for filters (search, sort)

### Input Types
- `CreateCategory`: Category creation input (reused for forms)
- `UpdateCategory`: Category update input (partial fields)

### Zod Schemas from `schema.ts`:
- `categoryPublicSchema`: Public API response format
- `createCategorySchema`: Category creation validation (also used for form validation)
- `updateCategorySchema`: Category update validation (requires at least one field)
- `categoriesListFiltersSchema`: Filter validation (derived from `listCategoriesQuerySchema`)
- `listCategoriesResponseSchema`: Paginated list response format

## Recent Improvements

### Complete React Query Implementation (2024)
- **Full CRUD Operations**: All category operations now use React Query hooks
- **Proper 404 Handling**: Fixed API routes and client-side handling for non-existent categories
- **User Feedback**: Added clear messaging when no changes are made during updates
- **Schema Optimization**: Removed duplicate `editCategoryFormSchema` in favor of reusing `createCategorySchema`

### Key Features Added:
1. **Smart Error Handling**: 404 errors are properly detected and don't trigger retries
2. **Form Validation**: Comprehensive client-side validation with React Hook Form + Zod
3. **Cache Management**: Automatic cache invalidation and updates across all components
4. **Loading States**: Proper loading and error states for all operations
5. **Type Safety**: Complete TypeScript coverage with inferred types from Zod schemas

### Breaking Changes:
- Removed `editCategoryFormSchema` and `EditCategoryForm` type - use `createCategorySchema` and `CreateCategory` instead
- Category detail pages now require proper error handling for 404 cases
