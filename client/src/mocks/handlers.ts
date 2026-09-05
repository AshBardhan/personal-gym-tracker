import { http, HttpResponse } from "msw";
import { mockError, mockSuccess } from "@/mocks/apiResponse";
import {
  MOCK_USER_ID,
  mockExercises,
  mockUser,
  mockWorkouts,
} from "@/mocks/data";
import { Exercise, Workout } from "@/types/entities";

const API_URL = "http://localhost:5000";

let exercisesStore = [...mockExercises];
let workoutsStore = [...mockWorkouts];
let nextExerciseId = 100;
let nextWorkoutId = 11;

export const handlers = [
  http.get(`${API_URL}/`, () => {
    const { body, status } = mockSuccess({
      message: "Personal Gym Tracker API (MSW Mock)",
      version: "1.0.0",
      status: "running",
    });
    return HttpResponse.json(body, { status });
  }),

  http.get(`${API_URL}/api/users`, () => {
    const { body, status } = mockSuccess([mockUser]);
    return HttpResponse.json(body, { status });
  }),

  http.get(`${API_URL}/api/users/:id`, ({ params }) => {
    const { id } = params;
    if (id === MOCK_USER_ID) {
      const { body, status } = mockSuccess(mockUser);
      return HttpResponse.json(body, { status });
    }
    const { body, status } = mockError("User not found", 404);
    return HttpResponse.json(body, { status });
  }),

  http.get(`${API_URL}/api/exercises`, () => {
    const { body, status } = mockSuccess(exercisesStore);
    return HttpResponse.json(body, { status });
  }),

  http.get(`${API_URL}/api/exercises/:id`, ({ params }) => {
    const { id } = params;
    const exercise = exercisesStore.find((item) => item._id === id);
    if (!exercise) {
      const { body, status } = mockError("Exercise not found", 404);
      return HttpResponse.json(body, { status });
    }
    const { body, status } = mockSuccess(exercise);
    return HttpResponse.json(body, { status });
  }),

  http.post(`${API_URL}/api/exercises`, async ({ request }) => {
    const body = (await request.json()) as Omit<
      Exercise,
      "_id" | "createdAt" | "updatedAt"
    >;
    const now = new Date().toISOString();

    const newExercise: Exercise = {
      _id: `ex-custom-${nextExerciseId++}`,
      createdAt: now,
      updatedAt: now,
      name: body.name,
      category: body.category,
      primaryMuscleGroup: body.primaryMuscleGroup,
      secondaryMuscleGroups: body.secondaryMuscleGroups,
      isCustom: body.isCustom ?? true,
      userId: body.userId ?? MOCK_USER_ID,
      variants: body.variants,
    };

    exercisesStore.push(newExercise);
    const response = mockSuccess(newExercise, 201);
    return HttpResponse.json(response.body, { status: response.status });
  }),

  http.put(`${API_URL}/api/exercises/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Exercise>;
    const index = exercisesStore.findIndex((item) => item._id === id);

    if (index === -1) {
      const response = mockError("Exercise not found", 404);
      return HttpResponse.json(response.body, { status: response.status });
    }

    exercisesStore[index] = {
      ...exercisesStore[index],
      ...body,
      _id: exercisesStore[index]._id,
      createdAt: exercisesStore[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    const response = mockSuccess(exercisesStore[index]);
    return HttpResponse.json(response.body, { status: response.status });
  }),

  http.delete(`${API_URL}/api/exercises/:id`, ({ params }) => {
    const { id } = params;
    const index = exercisesStore.findIndex((item) => item._id === id);
    if (index === -1) {
      const response = mockError("Exercise not found", 404);
      return HttpResponse.json(response.body, { status: response.status });
    }
    exercisesStore.splice(index, 1);
    const response = mockSuccess({ message: "Exercise deleted successfully" });
    return HttpResponse.json(response.body, { status: response.status });
  }),

  http.get(`${API_URL}/api/workouts/:userId`, ({ params }) => {
    const { userId } = params;
    if (userId === MOCK_USER_ID) {
      const sorted = [...workoutsStore].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      const response = mockSuccess(sorted);
      return HttpResponse.json(response.body, { status: response.status });
    }
    const response = mockSuccess([]);
    return HttpResponse.json(response.body, { status: response.status });
  }),

  http.get(`${API_URL}/api/workouts/detail/:id`, ({ params }) => {
    const { id } = params;
    const workout = workoutsStore.find((item) => item._id === id);
    if (!workout) {
      const response = mockError("Workout not found", 404);
      return HttpResponse.json(response.body, { status: response.status });
    }
    const response = mockSuccess(workout);
    return HttpResponse.json(response.body, { status: response.status });
  }),

  http.post(`${API_URL}/api/workouts`, async ({ request }) => {
    const body = (await request.json()) as Omit<
      Workout,
      "_id" | "createdAt" | "updatedAt"
    >;
    const now = new Date().toISOString();

    const newWorkout: Workout = {
      _id: String(nextWorkoutId++),
      userId: body.userId,
      title: body.title,
      date: body.date,
      memo: body.memo,
      exercises: body.exercises,
      createdAt: now,
      updatedAt: now,
    };

    workoutsStore.push(newWorkout);
    const response = mockSuccess(newWorkout, 201);
    return HttpResponse.json(response.body, { status: response.status });
  }),

  http.put(`${API_URL}/api/workouts/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Workout>;
    const index = workoutsStore.findIndex((item) => item._id === id);

    if (index === -1) {
      const response = mockError("Workout not found", 404);
      return HttpResponse.json(response.body, { status: response.status });
    }

    workoutsStore[index] = {
      ...workoutsStore[index],
      ...body,
      _id: workoutsStore[index]._id,
      createdAt: workoutsStore[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    const response = mockSuccess(workoutsStore[index]);
    return HttpResponse.json(response.body, { status: response.status });
  }),

  http.delete(`${API_URL}/api/workouts/:id`, ({ params }) => {
    const { id } = params;
    const index = workoutsStore.findIndex((item) => item._id === id);
    if (index === -1) {
      const response = mockError("Workout not found", 404);
      return HttpResponse.json(response.body, { status: response.status });
    }
    workoutsStore.splice(index, 1);
    const response = mockSuccess({ message: "Workout deleted successfully" });
    return HttpResponse.json(response.body, { status: response.status });
  }),
];
