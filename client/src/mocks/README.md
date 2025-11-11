# MSW (Mock Service Worker) - Complete Guide

## Overview

This directory contains the Mock Service Worker (MSW) configuration for mocking API calls. MSW allows you to:

- Develop the frontend without running the backend server
- Have consistent, reproducible test data
- Write unit tests without network calls
- Work offline

## Files

- **`browser.ts`** - Browser service worker setup for development
- **`server.ts`** - Node server setup for testing
- **`handlers.ts`** - HTTP request handlers that define mock API behavior
- **`data.ts`** - Mock data (workouts, users)

## Quick Start

### Running with Mock Data (Default)

```bash
cd client
npm run dev
```

That's it! The app will use mock data automatically. No backend server needed.

### Running with Real API

1. Start the backend server:

```bash
cd server
npm run dev
```

1. Disable MSW in `client/.env`:

```env
VITE_ENABLE_MSW=false
```

3. Start the frontend:

```bash
cd client
npm run dev
```

## Environment Variables

Create or edit `.env` in the client directory:

```env
# Enable/disable MSW
VITE_ENABLE_MSW=true  # Use mock data (default)
# VITE_ENABLE_MSW=false  # Use real API
```

## Mock Data Available

The MSW setup includes:

### Workouts (3 samples)

1. **Upper Body Strength** - Bench Press, Shoulder Press, Bicep Curls
2. **Leg Day** - Squats, Leg Press
3. **Back & Core** - Deadlifts, Pull-ups, Planks

### User

- Demo User (ID: 673092a6fd2a34e8e4b91234)

### Operations Supported

- ✅ List all workouts
- ✅ Get workout by ID
- ✅ Create new workout
- ✅ Update workout
- ✅ Delete workout
- ✅ Get user info

All changes to mock data are stored in memory and reset on page refresh.

## Development Workflow

### Scenario 1: Frontend-only Development

```bash
# In client directory
npm run dev
```

MSW handles all API calls with mock data. Perfect for:

- UI development
- Component testing
- Working without internet
- Quick prototyping

### Scenario 2: Full-stack Development

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
# Set VITE_ENABLE_MSW=false in .env file
npm run dev
```

### Scenario 3: Testing Backend Changes

Toggle between mock and real API to verify:

1. Test with MSW (expected behavior)
2. Disable MSW, test with real API
3. Compare results

## Customizing Mock Data

### Edit Existing Data

Edit `data.ts`:

```typescript
export const mockWorkouts: Workout[] = [
  {
    _id: "1",
    title: "My Custom Workout",
    // ... add your data
  },
];
```

### Add New Endpoints

Edit `handlers.ts`:

```typescript
http.get(`${API_URL}/api/new-endpoint`, () => {
  return HttpResponse.json({ data: "mock response" });
});
```

## Testing

### Unit Tests with MSW

```typescript
// In your test file
import { server } from "./mocks/server";
import { http, HttpResponse } from "msw";

// Override a handler for a specific test
test("handles error state", async () => {
  server.use(
    http.get("/api/workouts/:userId", () => {
      return new HttpResponse(null, { status: 500 });
    }),
  );

  // Your test code
});
```

### Setup File

The `setupTests.ts` file (in parent directory) initializes MSW for all tests:

```typescript
import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Debugging

### Check if MSW is Active

Open browser DevTools Console. You should see:

```
[MSW] Mocking enabled.
```

### View Intercepted Requests

Check the Network tab in DevTools:

- Intercepted requests show ⚡ icon (in some browsers)
- Response is served from Service Worker

### Disable MSW Temporarily

```typescript
// In browser console
await worker.stop();

// Re-enable
await worker.start();
```

## Production Build

MSW is automatically disabled in production builds. The condition in `main.tsx`:

```typescript
if (import.meta.env.VITE_ENABLE_MSW === "true");
```

ensures MSW only runs in development mode unless explicitly enabled.

## Troubleshooting

### MSW Not Working

1. Check console for errors
2. Verify `public/mockServiceWorker.js` exists
3. Clear browser cache
4. Check `VITE_ENABLE_MSW` environment variable

### Service Worker Not Updating

```bash
# Regenerate service worker
npx msw init public/ --save
```

### Mock Data Not Changing

- Mock data is stored in memory
- Refresh the page to reset
- Changes to data.ts require dev server restart

## Best Practices

1. **Keep mock data realistic** - Match production data structure
2. **Test both modes** - Verify with mock and real API
3. **Use for tests** - Consistent data makes tests reliable
4. **Document handlers** - Comment complex mock logic
5. **Reset between tests** - Use `server.resetHandlers()`

## Resources

- [MSW Documentation](https://mswjs.io/)
- [MSW GitHub](https://github.com/mswjs/msw)
- [MSW Examples](https://mswjs.io/docs/recipes)

## Benefits

- ✅ Develop without running the backend server
- ✅ Faster development iteration
- ✅ Consistent test data
- ✅ Easy to write unit tests
- ✅ Network-independent development
- ✅ Realistic API behavior simulation
- ✅ No cross-origin issues in development
