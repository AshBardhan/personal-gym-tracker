import { http, HttpResponse } from "msw";
import { mockWorkouts, mockUser, MOCK_USER_ID } from "./data";
import { Workout } from "../types";

const API_URL = "http://localhost:5000";

// In-memory storage for workouts (will be reset on page refresh)
let workoutsStore = [...mockWorkouts];
let nextId = 4;

export const handlers = [
  // Get API status
  http.get(`${API_URL}/`, () => {
    return HttpResponse.json({
      message: "Personal Gym Tracker API (MSW Mock)",
      version: "1.0.0",
      status: "running",
    });
  }),

  // Get all users
  http.get(`${API_URL}/api/users`, () => {
    return HttpResponse.json([mockUser]);
  }),

  // Get user by ID
  http.get(`${API_URL}/api/users/:id`, ({ params }) => {
    const { id } = params;
    if (id === MOCK_USER_ID) {
      return HttpResponse.json(mockUser);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Get all workouts for a user
  http.get(`${API_URL}/api/workouts/:userId`, ({ params }) => {
    const { userId } = params;
    if (userId === MOCK_USER_ID) {
      // Sort by date descending
      const sorted = [...workoutsStore].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      return HttpResponse.json(sorted);
    }
    return HttpResponse.json([]);
  }),

  // Get workout by ID
  http.get(`${API_URL}/api/workouts/detail/:id`, ({ params }) => {
    const { id } = params;
    const workout = workoutsStore.find((w) => w._id === id);
    if (workout) {
      return HttpResponse.json(workout);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Create workout
  http.post(`${API_URL}/api/workouts`, async ({ request }) => {
    const body = (await request.json()) as Omit<Workout, "_id" | "createdAt">;

    const newWorkout: Workout = {
      _id: String(nextId++),
      userId: body.userId,
      title: body.title,
      date: body.date,
      exercises: body.exercises,
      createdAt: new Date().toISOString(),
    };

    workoutsStore.push(newWorkout);
    return HttpResponse.json(newWorkout, { status: 201 });
  }),

  // Update workout
  http.put(`${API_URL}/api/workouts/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Workout>;

    const index = workoutsStore.findIndex((w) => w._id === id);
    if (index !== -1) {
      workoutsStore[index] = {
        ...workoutsStore[index],
        ...body,
        _id: workoutsStore[index]._id, // Preserve ID
        createdAt: workoutsStore[index].createdAt, // Preserve creation date
      };
      return HttpResponse.json(workoutsStore[index]);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Delete workout
  http.delete(`${API_URL}/api/workouts/:id`, ({ params }) => {
    const { id } = params;
    const index = workoutsStore.findIndex((w) => w._id === id);
    if (index !== -1) {
      const deleted = workoutsStore.splice(index, 1)[0];
      return HttpResponse.json(deleted);
    }
    return new HttpResponse(null, { status: 404 });
  }),
];
