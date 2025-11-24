# Todo List Frontend

Modern Todo List Application built with React, TypeScript, Vite, and Ant Design.

## Features

- ✅ Create, update, and delete todos
- 📁 Category management with color coding
- 🔍 Search and filter todos
- 📊 Priority levels (High, Medium, Low)
- 📅 Due date tracking
- 📱 Responsive design (Mobile, Tablet, Desktop)

## Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Ant Design** - UI Components
- **React Router** - Routing
- **Axios** - HTTP Client
- **Day.js** - Date Manipulation

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build

```bash
# Build for production
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
fe/
├── src/
│   ├── components/     # Reusable components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities
│   ├── pages/          # Page components
│   └── App.tsx         # Root component
├── public/             # Static assets
└── package.json        # Dependencies
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api
```

## License

MIT

