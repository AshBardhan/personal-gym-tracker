import { create } from "zustand";
import { ExerciseSet, WorkoutExercise } from "@/types/entities";
import {
  createEmptySet,
  createEmptyWorkoutExercise,
  getValidWorkoutExercises,
  isValidWorkoutExercise,
} from "@/utils/workoutUtils";

interface WorkoutFormState {
  formData: {
    title: string;
    date: string;
  };
  exercises: WorkoutExercise[];
  submitAttempted: boolean;
  loading: boolean;

  setFormData: (data: { title: string; date: string }) => void;
  updateFormField: (field: "title" | "date", value: string) => void;
  setExercises: (exercises: WorkoutExercise[]) => void;
  setLoading: (loading: boolean) => void;
  setSubmitAttempted: (attempted: boolean) => void;

  addExercise: () => void;
  removeExercise: (index: number) => void;
  updateExercise: (index: number, updates: Partial<WorkoutExercise>) => void;

  addSet: (exerciseIndex: number) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  updateSet: (
    exerciseIndex: number,
    setIndex: number,
    updates: Partial<ExerciseSet>,
  ) => void;

  getValidExercises: () => WorkoutExercise[];
  hasValidExercises: () => boolean;

  resetForm: () => void;
  loadWorkoutData: (data: {
    title: string;
    date: string;
    exercises: WorkoutExercise[];
  }) => void;
}

const initialFormData = {
  title: "",
  date: new Date().toISOString().split("T")[0],
};

const initialExercises: WorkoutExercise[] = [createEmptyWorkoutExercise()];

export const useWorkoutForm = create<WorkoutFormState>((set, get) => ({
  formData: initialFormData,
  exercises: initialExercises,
  submitAttempted: false,
  loading: false,

  setFormData: (data) => set({ formData: data }),

  updateFormField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  setExercises: (exercises) => set({ exercises }),

  setLoading: (loading) => set({ loading }),

  setSubmitAttempted: (attempted) => set({ submitAttempted: attempted }),

  addExercise: () =>
    set((state) => ({
      exercises: [...state.exercises, createEmptyWorkoutExercise()],
    })),

  removeExercise: (index) =>
    set((state) => ({
      exercises: state.exercises.filter((_, i) => i !== index),
    })),

  updateExercise: (index, updates) =>
    set((state) => ({
      exercises: state.exercises.map((ex, i) =>
        i === index ? { ...ex, ...updates } : ex,
      ),
    })),

  addSet: (exerciseIndex) =>
    set((state) => ({
      exercises: state.exercises.map((ex, idx) =>
        idx === exerciseIndex
          ? { ...ex, sets: [...ex.sets, createEmptySet()] }
          : ex,
      ),
    })),

  removeSet: (exerciseIndex, setIndex) =>
    set((state) => ({
      exercises: state.exercises.map((ex, idx) =>
        idx === exerciseIndex
          ? { ...ex, sets: ex.sets.filter((_, i) => i !== setIndex) }
          : ex,
      ),
    })),

  updateSet: (exerciseIndex, setIndex, updates) =>
    set((state) => ({
      exercises: state.exercises.map((ex, exIdx) =>
        exIdx === exerciseIndex
          ? {
              ...ex,
              sets: ex.sets.map((s, sIdx) =>
                sIdx === setIndex ? { ...s, ...updates } : s,
              ),
            }
          : ex,
      ),
    })),

  getValidExercises: () => getValidWorkoutExercises(get().exercises),

  hasValidExercises: () => get().exercises.some(isValidWorkoutExercise),

  resetForm: () =>
    set({
      formData: initialFormData,
      exercises: [createEmptyWorkoutExercise()],
      submitAttempted: false,
      loading: false,
    }),

  loadWorkoutData: (data) =>
    set({
      formData: { title: data.title, date: data.date },
      exercises:
        data.exercises.length > 0
          ? data.exercises.map((exercise) => ({
              ...exercise,
              secondaryMuscleGroups: exercise.secondaryMuscleGroups
                ? [...exercise.secondaryMuscleGroups]
                : undefined,
              metrics: [...exercise.metrics],
              sets: exercise.sets.map((set) => ({ ...set })),
            }))
          : [createEmptyWorkoutExercise()],
      loading: false,
    }),
}));
