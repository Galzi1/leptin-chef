# Leptin Chef

An AI-powered cooking assistant that helps you create delicious meals with the ingredients you have available.

## Features

- 🤖 AI-powered cooking conversations
- 📚 Recipe management and storage
- 🥕 Ingredient inventory tracking
- 📱 Cross-platform (Web + Android)
- 🎨 Material Design interface
- ⚡ Fast development with Vite

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **State Management**: Zustand + React Query
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library
- **Validation**: Zod
- **Mobile**: Capacitor
- **Design**: Material Design 3

## Prerequisites

- Node.js 18+ and npm
- For Android development: Android Studio and Android SDK

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd leptin-chef
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── test/               # Test setup and utilities
└── api/                # API layer (to be implemented)
```

## Development

### Adding New Components

1. Create the component in `src/components/`
2. Add tests in `src/components/__tests__/`
3. Follow Material Design principles
4. Use Tailwind CSS for styling

### State Management

- Use Zustand for client-side state
- Use React Query for server state
- Follow the store patterns in `src/stores/`

### Testing

- Write tests first (TDD approach)
- Use Vitest and Testing Library
- Test components, utilities, and stores
- Aim for high test coverage

## Android Development

1. Install Capacitor CLI:
```bash
npm install -g @capacitor/cli
```

2. Add Android platform:
```bash
npx cap add android
```

3. Build the web app:
```bash
npm run build
```

4. Sync with Android:
```bash
npx cap sync android
```

5. Open in Android Studio:
```bash
npx cap open android
```

## Design System

The app uses Material Design 3 with a custom color palette based on `#00E676` (A400 green). All components follow Material Design principles and are built with Tailwind CSS.

### Colors

- **Primary**: `#00E676` (A400)
- **Surface**: Material Design surface colors
- **Text**: Material Design on-surface colors

### Components

- Material Design cards, buttons, inputs
- Responsive design for mobile and desktop
- Consistent spacing and typography

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Use TypeScript strictly
4. Follow Material Design guidelines
5. Ensure cross-platform compatibility

## License

[Add your license here]
