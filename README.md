# Todo List Frontend

## Project Overview

Frontend aplikasi Todo List yang dibangun dengan React, TypeScript, dan Ant Design. Aplikasi ini menyediakan interface untuk mengelola todos dan categories dengan fitur pagination, search, filtering, dan responsive design.

## Features Implemented

### Todo Management
- Create, Read, Update, Delete (CRUD) todos
- Toggle todo completion status
- Pagination untuk list todos (10 items per page)
- Search todos berdasarkan title
- Filter todos berdasarkan category, priority, dan completion status
- Validasi form dengan Zod
- Validasi due_date tidak boleh masa lalu

### Category Management
- Create, Read, Update, Delete (CRUD) categories
- Color picker untuk category
- Validasi unique category name
- Prevent delete category jika masih digunakan

### UI/UX Features
- Responsive design (Desktop, Tablet, Mobile)
- Loading states untuk semua async operations
- Error handling dengan user-friendly messages
- Success notifications
- Empty states
- Optimistic updates untuk toggle completion

### Technical Features
- React Context API untuk state management
- TanStack Query untuk data fetching dan caching
- TypeScript untuk type safety
- Zod untuk form validation
- Ant Design components

## Setup dan Installation

### Prerequisites

1. **Node.js** (versi 18 atau lebih tinggi)
   ```bash
   node --version
   ```

2. **npm** atau **yarn** atau **pnpm**
   ```bash
   npm --version
   ```

3. **Git** (untuk clone repository)

### Step-by-Step Installation

#### 1. Clone Repository

```bash
git clone <repository-url>
cd todolist/fe
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Konfigurasi Environment Variables

Buat file `.env` di folder `fe/` (optional, default: http://localhost:8080/api):

```env
VITE_API_URL=http://localhost:8080/api
```

**Catatan:** Jika backend berjalan di `http://localhost:8080/api`, file `.env` tidak wajib.

#### 4. Pastikan Backend Sudah Running

Pastikan backend API sudah berjalan di `http://localhost:8080` sebelum menjalankan frontend.

## How to Run Application Locally

### Development Mode

```bash
cd fe
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### Build untuk Production

```bash
# Build aplikasi
npm run build

# Preview build (optional)
npm run preview
```

Build files akan tersimpan di folder `dist/`

### Verify Application Running

Buka browser dan akses:
```
http://localhost:3000
```

## How to Run Tests

Tests belum diimplementasikan. Untuk menambahkan tests:

```bash
# Install testing dependencies (contoh dengan Vitest)
npm install -D vitest @testing-library/react

# Run tests
npm run test

# Run tests dengan coverage
npm run test:coverage
```

## API Integration

### Base URL Configuration

API base URL dikonfigurasi melalui environment variable `VITE_API_URL` atau default ke `http://localhost:8080/api`.

### API Service Layer

API calls dilakukan melalui service layer:

- `src/services/api.ts` - Axios instance dengan interceptors
- `src/services/todoApi.ts` - Todo API functions
- `src/services/categoryApi.ts` - Category API functions

### Response Handling

Frontend mengharapkan response format dari backend:

```typescript
// Success Response
{
  code: 200,
  status: "success",
  message: "Success message",
  data: {}
}

// Paginated Response
{
  code: 200,
  status: "success",
  message: "Success message",
  data: [],
  pagination: {
    current_page: 1,
    per_page: 10,
    total: 100,
    total_pages: 10
  }
}

// Error Response
{
  code: 400,
  status: "error",
  message: "Error message"
}
```

## Technical Questions

### Responsive Design Questions

#### 1. How did you implement responsive design?

**Q: What breakpoints did you use and why?**

A: Aplikasi menggunakan breakpoints berikut:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

**Alasan pemilihan breakpoints:**
- Breakpoints ini mengikuti standar umum untuk mobile-first design
- Ant Design components sudah responsive dengan breakpoints ini
- Memastikan UI readable di semua device sizes
- Breakpoints ini umum digunakan di industry (Bootstrap, Tailwind CSS)

**Q: How does the UI adapt on different screen sizes?**

A: UI adaptation dilakukan dengan beberapa strategi:

1. **Layout Changes:**
   - **Desktop (> 1024px)**: Full width layout dengan optimal spacing, 2-column layout jika diperlukan
   - **Tablet (768px - 1024px)**: Menyesuaikan column width, tetap readable dengan spacing yang cukup
   - **Mobile (< 768px)**: Single column layout, stack components vertically, touch-friendly buttons

2. **Component Adaptation:**
   - Ant Design components secara otomatis adapt:
     - `Table` menjadi scrollable horizontal di mobile
     - `Modal` menjadi fullscreen di mobile
     - `Form` fields stack vertically di mobile
   - Custom components menggunakan conditional rendering berdasarkan screen size

3. **Typography & Spacing:**
   - Font size menyesuaikan screen size (relative units)
   - Spacing menggunakan responsive units (padding, margin)
   - Button sizes lebih besar di mobile untuk touch interaction

4. **Navigation:**
   - Desktop: Full navigation visible
   - Mobile: Collapsible navigation atau drawer

**Q: Which Ant Design components helped with responsiveness?**

A: Ant Design components yang digunakan dan membantu responsiveness:

- **`Layout`, `Content`**: Layout system yang responsive, digunakan di Index page
- **`Card`**: Otomatis responsive, digunakan untuk menampilkan todo items di TodoItem component
- **`Modal`**: Otomatis fullscreen di mobile, centered di desktop, digunakan di TodoForm dan CategoryManager
- **`Space`**: Responsive spacing yang menyesuaikan screen size, digunakan di TodoFilters dan CategoryManager
- **`Form`**: Fields otomatis stack di mobile, digunakan di TodoForm dan CategoryManager
- **`Input`, `Select`, `DatePicker`**: Full width di mobile untuk better UX, digunakan di TodoForm
- **`Button`**: Touch-friendly sizing di mobile, digunakan di berbagai komponen
- **`Empty`**: Menampilkan empty state yang responsive, digunakan di TodoList
- **`Pagination`**: Responsive pagination controls, digunakan di TodoList
- **`Spin`**: Loading indicator yang responsive, digunakan di Index dan CategoryManager

**Catatan**: `Row` dan `Col` dari Ant Design tersedia tapi belum digunakan dalam implementasi saat ini. Layout menggunakan `Layout` dan `Content` dengan CSS classes untuk responsive behavior.

### React Component Structure Questions

#### 2. How did you structure your React components?

**Q: Explain your component hierarchy**

A: Component hierarchy:

```
App (Root)
└── QueryClientProvider (TanStack Query)
    └── TooltipProvider (UI Provider)
        └── BrowserRouter (React Router)
            └── Routes
                └── Index (Main Page)
                    └── TodoProvider (React Context)
                        └── TodoListPageContent
                            ├── TodoHeader
                            ├── TodoFilters
                            ├── TodoList
                            │   └── TodoItem (multiple)
                            ├── TodoForm (Modal - conditional)
                            └── CategoryManager (Modal - conditional)
```

**Penjelasan detail:**

- **`App`**: Root component dengan QueryClientProvider untuk TanStack Query, TooltipProvider untuk UI tooltips, dan BrowserRouter untuk routing
- **`Index`**: Main page component yang wrap dengan TodoProvider
- **`TodoProvider`**: Context provider yang manage global state untuk todos dan categories
- **`Index`**: Main page component yang mengatur layout dan koordinasi antara components
- **`TodoHeader`**: Header dengan title dan action buttons (New Todo, Categories)
- **`TodoFilters`**: Filter controls untuk search, category, priority, status
- **`TodoList`**: Container untuk list todos dengan pagination controls
- **`TodoItem`**: Individual todo item card dengan actions (edit, delete, toggle)
- **`TodoForm`**: Modal form untuk create/edit todo
- **`CategoryManager`**: Modal untuk manage categories (CRUD)

**Design Principles:**
- Single Responsibility: Setiap component punya satu tanggung jawab
- Composition: Components kecil dikomposisi menjadi components besar
- Reusability: Components bisa digunakan kembali
- Separation of Concerns: UI components terpisah dari business logic

**Q: How did you manage state between components?**

A: State management menggunakan kombinasi 3 pendekatan:

1. **TanStack Query (Server State)**:
   - Manage server state (todos, categories dari API)
   - Automatic caching dan background refetching
   - Optimistic updates untuk better UX
   - Automatic invalidation setelah mutations

2. **React Context API (Global UI State)**:
   - `TodoContext` untuk global state yang di-share antar components
   - CRUD operations functions
   - Loading states dan pagination info
   - Bridge antara TanStack Query dan components

3. **Local State dengan useState (Component State)**:
   - UI state: modal open/close, form state, editing state
   - Filter state: search query, selected category, priority, status
   - Temporary state yang tidak perlu di-share

**State Flow:**
```
User Action → Component → Context → TanStack Query → API
                ↓
         Local State (UI)
```

**Q: How did you handle the filtering and pagination state?**

A: Filtering dan pagination state dihandle dengan strategi berikut:

**Filter State Management:**
- **Location**: Local state di `Index` component
- **State Structure**:
  ```typescript
  {
    searchQuery: string,
    categoryId: number | null,
    priority: string | null,
    completed: boolean | null
  }
  ```
- **Update Mechanism**: 
  - User mengubah filter → update local state
  - State change memicu `useEffect` → fetch todos dengan params baru
  - Reset ke page 1 saat filter berubah

**Pagination State Management:**
- **Location**: Managed oleh TanStack Query dari API response
- **State Structure**:
  ```typescript
  {
    current_page: number,
    per_page: number,
    total: number,
    total_pages: number
  }
  ```
- **Update Mechanism**:
  - Page change → fetch dengan page parameter baru
  - Filter change → reset ke page 1
  - Maintain filter saat ganti page

**Integration Strategy:**
- Filters dan pagination bekerja bersama dalam satu query
- Query params dikombinasikan: `?page=1&limit=10&search=term&category_id=1&priority=high`
- TanStack Query cache berdasarkan query key yang include semua params
- Automatic refetch saat params berubah

### Technical Decision Questions

#### 3. How did you handle data validation?

**A: Data Validation Strategy**

**Validation dilakukan di multiple layers (Defense in Depth):**

**1. Frontend Validation (Zod)**
- **Location**: `src/validations/` folder
- **Schemas**: 
  - `createTodoSchema`: Validasi untuk create todo
  - `updateTodoSchema`: Validasi untuk update todo
  - `createCategorySchema`: Validasi untuk create category
  - `updateCategorySchema`: Validasi untuk update category
- **Rules**:
  - `title`: Required, min 1 char, max 200 chars
  - `category_id`: Required, positive integer
  - `priority`: Required, enum (high, medium, low)
  - `description`: Optional, max 1000 chars
  - `due_date`: Optional, cannot be in the past
  - `name` (category): Required, min 1 char, max 100 chars, unique
  - `color`: Optional, valid hex color format
- **Benefits**: Immediate feedback, better UX, reduce unnecessary API calls

**2. Backend Validation (Gin Binding + Service Layer)**
- **Gin Binding**: Request structure validation
  - `binding:"required"` untuk mandatory fields
  - Type validation (string, number, boolean)
- **Service Layer**: Business logic validation
  - Category exists check
  - Priority enum validation
  - Unique constraint validation

**Why this approach?**
- **Security**: Backend validation adalah must (client bisa di-bypass)
- **UX**: Frontend validation memberikan immediate feedback
- **Consistency**: Validasi di kedua layer memastikan data integrity
- **Type Safety**: TypeScript + Zod di frontend, Go types di backend
- **Maintainability**: Zod schemas bisa di-reuse untuk type inference

## Project Structure

```
fe/
├── src/
│   ├── components/        # React components
│   │   ├── TodoForm.tsx
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoFilters.tsx
│   │   ├── TodoHeader.tsx
│   │   └── CategoryManager.tsx
│   ├── contexts/          # React Context
│   │   └── TodoContext.tsx
│   ├── hooks/             # Custom hooks
│   │   ├── useTodos.ts
│   │   └── useCategories.ts
│   ├── services/          # API services
│   │   ├── api.ts
│   │   ├── todoApi.ts
│   │   └── categoryApi.ts
│   ├── validations/       # Zod schemas
│   │   ├── todo.schema.ts
│   │   └── category.schema.ts
│   ├── utils/             # Utility functions
│   │   └── validation.ts
│   ├── constants/         # Constants
│   │   └── index.ts
│   ├── pages/             # Page components
│   │   └── Index.tsx
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── .env                   # Environment variables (optional)
├── package.json
└── vite.config.ts
```

## Troubleshooting

### Backend Connection Error
- Pastikan backend sudah running di `http://localhost:8080`
- Cek `VITE_API_URL` di `.env` file
- Cek browser console untuk error details

### Port Already in Use
- Ubah port di `vite.config.ts`:
  ```typescript
  server: {
    port: 3001
  }
  ```

### Build Error
- Pastikan semua dependencies terinstall: `npm install`
- Clear cache: `rm -rf node_modules && npm install`
- Cek TypeScript errors: `npm run type-check`

### Testing & Quality Questions

#### 1. What did you choose to unit test and why?

**A: Unit Testing**

Tests belum diimplementasikan dalam project ini. Jika akan ditambahkan, berikut adalah prioritas testing:

**Functions/Methods yang sebaiknya di-test:**

1. **Custom Hooks** (Priority tinggi):
   - `useTodosQuery`: Test data fetching, error handling
   - `useCreateTodo`: Test mutation, success/error cases
   - `useUpdateTodo`: Test partial update logic
   - `useDeleteTodo`: Test deletion dengan confirmation
   - `useToggleTodoComplete`: Test optimistic update

2. **Validation Functions**:
   - Zod schemas: Test semua validation rules
   - `validateWithZod`: Test error handling
   - Edge cases: empty strings, null values, invalid types

3. **Utility Functions**:
   - Date formatting functions
   - Data transformation functions
   - Error handling utilities

4. **Components** (Priority rendah):
   - Form submission logic
   - Filter logic
   - Pagination logic

**Edge Cases yang perlu dipertimbangkan:**
- Empty data states
- Loading states
- Error states (network error, API error)
- Invalid form inputs
- Boundary values (max length, min length)
- Date validation (past dates, future dates)
- Category deletion dengan todos yang masih menggunakan

**Test Structure:**
```typescript
// Contoh struktur test dengan Vitest
describe('useCreateTodo', () => {
  it('should create todo successfully', () => {})
  it('should handle validation errors', () => {})
  it('should handle API errors', () => {})
  it('should invalidate queries after success', () => {})
})
```

#### 2. If you had more time, what would you improve or add?

**A: Future Improvements**

**Technical Debt yang perlu diaddress:**

1. **Component Organization**:
   - Extract reusable components (Button, Input, Card)
   - Create component library untuk consistency
   - Improve component props typing

2. **State Management**:
   - Reduce duplication antara Context dan TanStack Query
   - Consider removing Context jika TanStack Query sudah cukup
   - Improve state synchronization

3. **Performance**:
   - Add React.memo untuk expensive components
   - Optimize re-renders dengan useMemo dan useCallback
   - Add virtual scrolling untuk large lists
   - Implement code splitting untuk better initial load

4. **Error Handling**:
   - Add Error Boundaries untuk catch React errors
   - Improve error messages untuk user
   - Add retry logic untuk failed requests
   - Add offline support dengan service workers

**Features yang akan ditambahkan:**

1. **User Experience**:
   - Drag and drop untuk reorder todos
   - Keyboard shortcuts
   - Bulk operations (select multiple, delete multiple)
   - Todo templates
   - Todo archiving

2. **Advanced Features**:
   - Real-time updates (WebSocket)
   - Todo sharing/collaboration
   - Todo attachments
   - Todo comments
   - Todo reminders/notifications
   - Calendar view untuk todos

3. **UI/UX Improvements**:
   - Dark mode support
   - Customizable themes
   - Animations dan transitions
   - Better empty states dengan illustrations
   - Onboarding tour untuk new users

4. **Testing**:
   - Unit tests untuk hooks dan utilities
   - Component tests dengan React Testing Library
   - E2E tests dengan Playwright atau Cypress
   - Visual regression tests
   - Test coverage target: 80%+

**Refactoring yang akan dilakukan:**

1. **Code Organization**:
   - Better folder structure
   - Extract constants ke separate files
   - Create shared types/interfaces
   - Improve import organization

2. **Component Refactoring**:
   - Split large components menjadi smaller ones
   - Extract custom hooks dari components
   - Improve component composition
   - Add Storybook untuk component documentation

3. **Performance Optimization**:
   - Implement virtual scrolling
   - Add lazy loading untuk images
   - Optimize bundle size
   - Add performance monitoring

4. **Accessibility**:
   - Add ARIA labels
   - Improve keyboard navigation
   - Add screen reader support
   - Test dengan accessibility tools

## License

MIT License

