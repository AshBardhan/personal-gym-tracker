# Architecture Decision Record - Frontend

This document summarizes the principal technology and design decisions for the frontend application.

## Tech Stack and Rationale

- **React 19.2**: Provides a component-based model for building reusable interfaces and managing interactive application state.
- **TypeScript 5.9**: Adds static types to components, domain models, and API contracts, reducing integration and refactoring errors.
- **Vite 7.2**: Supplies a fast development server, hot module replacement, and an optimized production build with minimal configuration.
- **React Router DOM 7.9**: Handles client-side navigation between workout and exercise views without full-page reloads, including nested layouts for detail tabs.
- **Zustand 5.0**: Manages the nested workout form state with a small API and without provider or reducer boilerplate.
- **Axios 1.13**: Centralizes HTTP configuration, typed API requests, interceptors, and error propagation through a shared client.
- **Tailwind CSS 3.4**: Provides utility-based styling and responsive design primitives while maintaining consistent visual conventions.
- **MSW 2.12**: Intercepts network requests in development so the frontend can use realistic API behavior without a running backend.
- **Lucide React 0.553**: Supplies lightweight, consistent, and customizable SVG icons as React components.

## Key Design Decisions

### Component Architecture

- **Page and UI separation**: Route-level pages coordinate data and workflows, while reusable UI components encapsulate presentation and interaction patterns.
- **Nested layouts**: Workout and exercise detail routes use layout components with tab navigation (overview, edit, analytics/history).
- **Domain form components**: Exercise and workout forms share dedicated content components for catalog fields, variants, and metric-aware set inputs.
- **Component composition**: Pages are assembled from focused components to keep responsibilities clear and reusable.

### State Management

- **Centralized form state**: Zustand owns workout metadata, exercises, sets, loading state, and form actions because these concerns are shared throughout the create and edit workflow.
- **Immutable updates**: Exercise and set changes create new state structures, keeping updates predictable for React rendering.
- **Derived validation**: The store derives valid exercises from current form state so submission rules remain consistent across the interface.

### Data Access

- **Shared API client**: A configured Axios instance owns the base URL, timeout, headers, and `ApiResponse<T>` unwrapping in a response interceptor.
- **Domain services**: User, workout, and exercise services expose typed operations so components and hooks do not depend on HTTP details.
- **Custom data hooks**: Fetching and mutation state is encapsulated in hooks to keep page components focused on rendering and user interaction.
- **Error normalization**: Failed API responses extract `error.message` from the envelope and reject with a standard `Error`.

### Routing

- **Client-side routing**: React Router maps list, detail, create, and edit URLs to page components within a single-page application.
- **REST-aligned paths**: Workout and exercise URLs use resource-oriented paths that make navigation intent clear and correspond closely to API concepts.
- **Shared form pages**: Creation flows use dedicated form pages; editing uses nested routes under the detail layout.

### API Mocking

- **Network-level mocks**: MSW intercepts the same HTTP requests used by the real API, avoiding mock-specific branches in services and components.
- **Environment toggle**: Mocking is enabled through `VITE_ENABLE_MSW` so development can switch between mock and real backends without code changes.
- **Contract parity**: Mock handlers return the same `ApiResponse<T>` envelope and fixture data as the server seed script.

### Configuration and Types

- **Centralized configuration**: Environment values are exposed through one typed configuration module with development defaults.
- **Shared domain models**: `entities.ts` defines User, Exercise, Workout, and related types used by pages, stores, hooks, services, and mocks.
- **API types**: `api.ts` defines the `ApiResponse<T>` envelope shared with the server contract.
- **ES module standard**: The frontend uses native ES modules consistently across source code and build tooling, with `@/` path aliases via Vite and tsconfig.
