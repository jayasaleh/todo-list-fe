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

### 1. Responsive Design

**Q: Breakpoints apa yang digunakan dan kenapa?**

A: Aplikasi menggunakan breakpoints berikut:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

**Alasan:**
- Breakpoints ini mengikuti standar umum untuk mobile-first design
- Ant Design components sudah responsive dengan breakpoints ini
- Memastikan UI readable di semua device sizes

**Q: Bagaimana UI adapt di different screen sizes?**

A: UI adaptation dilakukan dengan:

1. **Layout Changes:**
   - Desktop: Full width dengan optimal spacing
   - Tablet: Menyesuaikan column width
   - Mobile: Single column layout, stack components vertically

2. **Component Adaptation:**
   - Ant Design components secara otomatis adapt (Table menjadi Card di mobile)
   - Modal menjadi fullscreen di mobile
   - Filters menjadi collapsible di mobile

3. **Typography:**
   - Font size menyesuaikan screen size
   - Spacing menggunakan responsive units

**Q: Components mana yang membantu responsiveness?**

A: Ant Design components yang digunakan:

- `Layout`, `Row`, `Col` - Untuk responsive grid system
- `Card` - Untuk display todo items (responsive)
- `Table` - Otomatis responsive, menjadi scrollable di mobile
- `Modal` - Otomatis fullscreen di mobile
- `Drawer` - Alternative untuk mobile navigation
- `Space` - Untuk spacing yang responsive

### 2. React Component Structure

**Q: Explain component hierarchy**

A: Component hierarchy:

```
App
└── TodoProvider (Context)
    └── Index (Main Page)
        ├── TodoHeader
        ├── TodoFilters
        ├── TodoList
        │   └── TodoItem
        ├── TodoForm (Modal)
        └── CategoryManager (Modal)
```

**Penjelasan:**
- `App`: Root component dengan routing
- `TodoProvider`: Context provider untuk global state
- `Index`: Main page dengan layout
- `TodoHeader`: Header dengan actions
- `TodoFilters`: Filter controls
- `TodoList`: List container dengan pagination
- `TodoItem`: Individual todo item
- `TodoForm`: Modal untuk create/edit todo
- `CategoryManager`: Modal untuk manage categories

**Q: Bagaimana manage state antar components?**

A: State management menggunakan:

1. **React Context API (`TodoContext`):**
   - Global state untuk todos dan categories
   - Functions untuk CRUD operations
   - Loading states dan pagination info

2. **TanStack Query:**
   - Data fetching dan caching
   - Automatic refetch setelah mutations
   - Optimistic updates

3. **Local State (useState):**
   - UI state (modal open/close, form state)
   - Filter state
   - Editing state

**Q: Bagaimana handle filtering dan pagination state?**

A: Filtering dan pagination dihandle dengan:

1. **Filter State:**
   - Local state di `Index` component
   - State: `searchQuery`, `categoryId`, `priority`, `completed`
   - Update filter memicu refetch dengan params baru

2. **Pagination State:**
   - Managed oleh TanStack Query
   - Pagination info dari API response
   - Page change memicu fetch dengan page parameter

3. **Integration:**
   - Filters dan pagination bekerja bersama
   - Reset ke page 1 saat filter berubah
   - Maintain filter saat ganti page

### 3. State Management

**Q: Bagaimana state management diimplementasikan?**

A: State management menggunakan kombinasi:

1. **TanStack Query:**
   - Server state (todos, categories)
   - Automatic caching dan refetching
   - Optimistic updates

2. **React Context API:**
   - Global state untuk todos dan categories
   - CRUD operations
   - Loading states

3. **Local State:**
   - UI state (modals, forms)
   - Filter state
   - Temporary state

**Keuntungan pendekatan ini:**
- Separation of concerns (server state vs UI state)
- Automatic cache management
- Less boilerplate code
- Better performance dengan caching

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

## License

MIT License

