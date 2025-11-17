import { PREDEFINED_EXERCISES } from "./exercises";
import { SelectOption } from "../components/SelectBox";

/**
 * Converts predefined exercises to SelectBox options format
 */
export const getExerciseOptions = (): SelectOption[] => {
  return PREDEFINED_EXERCISES.map((exercise) => ({
    value: exercise.name,
    label: exercise.name,
    searchTerms: [exercise.category, ...exercise.muscleGroup],
  }));
};
