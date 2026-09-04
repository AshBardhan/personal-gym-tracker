import { http, HttpResponse } from "msw";
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
    return HttpResponse.json({
      message: "Personal Gym Tracker API (MSW Mock)",
      version: "1.0.0",
      status: "running",
    });
  }),

  http.get(`${API_URL}/api/users`, () => {
    return HttpResponse.json([mockUser]);
  }),

  http.get(`${API_URL}/api/users/:id`, ({ params }) => {
    const { id } = params;
    if (id === MOCK_USER_ID) {
      return HttpResponse.json(mockUser);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.get(`${API_URL}/api/exercises`, () => {
    return HttpResponse.json(exercisesStore);
  }),

  http.get(`${API_URL}/api/exercises/:id`, ({ params }) => {
    const { id } = params;
    const exercise = exercisesStore.find((item) => item._id === id);
    if (!exercise) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(exercise);
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
    return HttpResponse.json(newExercise, { status: 201 });
  }),

  http.put(`${API_URL}/api/exercises/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Exercise>;
    const index = exercisesStore.findIndex((item) => item._id === id);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    exercisesStore[index] = {
      ...exercisesStore[index],
      ...body,
      _id: exercisesStore[index]._id,
      createdAt: exercisesStore[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(exercisesStore[index]);
  }),

  http.delete(`${API_URL}/api/exercises/:id`, ({ params }) => {
    const { id } = params;
    const index = exercisesStore.findIndex((item) => item._id === id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    const deleted = exercisesStore.splice(index, 1)[0];
    return HttpResponse.json(deleted);
  }),

  http.get(`${API_URL}/api/workouts/:userId`, ({ params }) => {
    const { userId } = params;
    if (userId === MOCK_USER_ID) {
      const sorted = [...workoutsStore].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      return HttpResponse.json(sorted);
    }
    return HttpResponse.json([]);
  }),

  http.get(`${API_URL}/api/workouts/detail/:id`, ({ params }) => {
    const { id } = params;
    const workout = workoutsStore.find((item) => item._id === id);
    if (workout) {
      return HttpResponse.json(workout);
    }
    return new HttpResponse(null, { status: 404 });
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
    return HttpResponse.json(newWorkout, { status: 201 });
  }),

  http.put(`${API_URL}/api/workouts/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Workout>;
    const index = workoutsStore.findIndex((item) => item._id === id);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    workoutsStore[index] = {
      ...workoutsStore[index],
      ...body,
      _id: workoutsStore[index]._id,
      createdAt: workoutsStore[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(workoutsStore[index]);
  }),

  http.delete(`${API_URL}/api/workouts/:id`, ({ params }) => {
    const { id } = params;
    const index = workoutsStore.findIndex((item) => item._id === id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    const deleted = workoutsStore.splice(index, 1)[0];
    return HttpResponse.json(deleted);
  }),
];
