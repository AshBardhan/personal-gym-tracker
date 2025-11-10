import { create } from "zustand";
import { Exercise } from "../types";

interface WorkoutFormState {
  // Form data
  formData: {
    title: string;
    date: string;
  };
  exercises: Exercise[];
  submitAttempted: boolean;
  loading: boolean;

  // Actions
  setFormData: (data: { title: string; date: string }) => void;
  updateFormField: (field: "title" | "date", value: string) => void;
  setExercises: (exercises: Exercise[]) => void;
  setLoading: (loading: boolean) => void;
  setSubmitAttempted: (attempted: boolean) => void;

  // Exercise actions
  addExercise: () => void;
  removeExercise: (index: number) => void;
  updateExerciseName: (index: number, name: string) => void;

  // Set actions
  addSet: (exerciseIndex: number) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  updateSet: (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: number,
  ) => void;

  // Validation
  getValidExercises: () => Exercise[];
  hasValidExercises: () => boolean;

  // Reset
  resetForm: () => void;
  loadWorkoutData: (data: {
    title: string;
    date: string;
    exercises: Exercise[];
  }) => void;
}

const initialFormData = {
  title: "",
  date: new Date().toISOString().split("T")[0],
};

const initialExercises: Exercise[] = [
  { name: "", sets: [{ reps: 0, weight: 0 }] },
];

export const useWorkoutFormStore = create<WorkoutFormState>((set, get) => ({
  // Initial state
  formData: initialFormData,
  exercises: initialExercises,
  submitAttempted: false,
  loading: false,

  // Form data actions
  setFormData: (data) => set({ formData: data }),

  updateFormField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  setExercises: (exercises) => set({ exercises }),

  setLoading: (loading) => set({ loading }),

  setSubmitAttempted: (attempted) => set({ submitAttempted: attempted }),

  // Exercise actions
  addExercise: () =>
    set((state) => ({
      exercises: [
        ...state.exercises,
        { name: "", sets: [{ reps: 0, weight: 0 }] },
      ],
    })),

  removeExercise: (index) =>
    set((state) => ({
      exercises: state.exercises.filter((_, i) => i !== index),
    })),

  updateExerciseName: (index, name) =>
    set((state) => ({
      exercises: state.exercises.map((ex, i) =>
        i === index ? { ...ex, name } : ex,
      ),
    })),

  // Set actions
  addSet: (exerciseIndex) =>
    set((state) => ({
      exercises: state.exercises.map((ex, idx) =>
        idx === exerciseIndex
          ? { ...ex, sets: [...ex.sets, { reps: 0, weight: 0 }] }
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

  updateSet: (exerciseIndex, setIndex, field, value) =>
    set((state) => ({
      exercises: state.exercises.map((ex, exIdx) =>
        exIdx === exerciseIndex
          ? {
              ...ex,
              sets: ex.sets.map((s, sIdx) =>
                sIdx === setIndex ? { ...s, [field]: value } : s,
              ),
            }
          : ex,
      ),
    })),

  // Validation
  getValidExercises: () => {
    const { exercises } = get();
    return exercises.filter(
      (ex) => ex.name.trim() && ex.sets.some((s) => s.reps > 0),
    );
  },

  hasValidExercises: () => {
    const validExercises = get().getValidExercises();
    return validExercises.length > 0;
  },

  // Reset
  resetForm: () =>
    set({
      formData: initialFormData,
      exercises: initialExercises,
      submitAttempted: false,
      loading: false,
    }),

  loadWorkoutData: (data) =>
    set({
      formData: { title: data.title, date: data.date },
      exercises: data.exercises,
      loading: false,
    }),
}));
