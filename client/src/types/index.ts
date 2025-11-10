export interface Set {
  reps: number;
  weight: number;
}

export interface Exercise {
  name: string;
  sets: Set[];
}

export interface Workout {
  _id: string;
  userId: string;
  title?: string;
  date: string;
  exercises: Exercise[];
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}
