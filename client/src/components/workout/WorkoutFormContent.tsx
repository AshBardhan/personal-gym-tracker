import { FormEvent, ReactNode, useState } from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { PREDEFINED_EXERCISES } from "@/constants/exercises";
import { useWorkoutForm } from "@/stores/workoutFormStore";
import { getExerciseOptions } from "@/utils/workoutUtils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import SelectBox from "@/components/ui/SelectBox";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";

interface WorkoutFormContentProps {
  onSubmit: (e: FormEvent) => void;
  header?: ReactNode;
}

/**
 * Shared workout create/edit form fields (title, date, exercises, sets).
 */
const WorkoutFormContent = ({ onSubmit, header }: WorkoutFormContentProps) => {
  const {
    formData,
    exercises,
    submitAttempted,
    updateFormField,
    addExercise,
    removeExercise,
    updateExercise,
    addSet,
    removeSet,
    updateSet,
    hasValidExercises,
  } = useWorkoutForm();

  const exerciseOptions = getExerciseOptions();
  const [exerciseNameTouched, setExerciseNameTouched] = useState<{
    [key: number]: boolean;
  }>({});

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormField(e.target.name as "title" | "date", e.target.value);
  };

  const handleExerciseNameChange = (exerciseIndex: number, value: string) => {
    const predefinedExercise = PREDEFINED_EXERCISES.find(
      (ex) => ex.name === value,
    );

    updateExercise(exerciseIndex, {
      name: value,
      category: predefinedExercise?.category,
      muscleGroup: predefinedExercise?.muscleGroup,
    });
  };

  const handleExerciseNameBlur = (exerciseIndex: number) => {
    setExerciseNameTouched((prev) => ({ ...prev, [exerciseIndex]: true }));
  };

  const handleSetChange = (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: string,
  ) => {
    updateSet(exerciseIndex, setIndex, field, parseFloat(value) || 0);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      {header}

      <Card className="flex flex-col">
        {submitAttempted && !hasValidExercises() && (
          <div className="mb-4 flex items-center gap-3 rounded border border-red-600 bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
            <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
            <Text variant="p">
              Please add at least one valid exercise with sets to save the
              workout.
            </Text>
          </div>
        )}

        <div className="flex flex-col gap-4 mb-4 sm:flex-row">
          <div className="flex-1">
            <Input
              label="Workout Title"
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="e.g., Upper Body Day"
            />
          </div>

          <div className="flex-1">
            <Input
              label="Date"
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              required
            />
          </div>
        </div>

        <div>
          <Text variant="h4" className="mb-4">
            Exercises {exercises.length > 0 ? `(${exercises.length})` : ""}
          </Text>

          {exercises.map((exercise, exerciseIndex) => {
            const hasExerciseNameError =
              (submitAttempted || exerciseNameTouched[exerciseIndex]) &&
              !exercise.name.trim();

            return (
              <div
                key={exerciseIndex}
                className="app-tile relative mb-6 rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-transparent"
              >
                <div className="absolute top-2 right-2 flex">
                  <Button
                    type="button"
                    disabled={exercises.length === 1}
                    variant="icon-only"
                    onClick={() => removeExercise(exerciseIndex)}
                    title="Remove exercise"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
                <div className="space-y-4">
                  <SelectBox
                    label="Exercise Name"
                    id={`exercise-name-${exerciseIndex}`}
                    value={exercise.name}
                    onChange={(value) =>
                      handleExerciseNameChange(exerciseIndex, value)
                    }
                    onBlur={() => handleExerciseNameBlur(exerciseIndex)}
                    options={exerciseOptions}
                    placeholder="Select Exercise"
                    hasError={hasExerciseNameError}
                    errorMessage="Exercise name is required"
                  />

                  <div className="space-y-3">
                    <Text variant="h6">Sets</Text>

                    <div className="flex flex-col gap-2">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="flex items-center gap-3">
                          <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-500 dark:bg-blue-950 dark:text-blue-300">
                            {setIndex + 1}
                          </span>
                          <div className="flex gap-4 flex-1">
                            <Input
                              label="Weight (kg)"
                              type="number"
                              inputSize="small"
                              id={`weight-${exerciseIndex}-${setIndex}`}
                              name="weight"
                              value={set.weight || ""}
                              onChange={(e) =>
                                handleSetChange(
                                  exerciseIndex,
                                  setIndex,
                                  "weight",
                                  e.target.value,
                                )
                              }
                              placeholder="50"
                              min="0"
                              step="0.5"
                              showErrorOnBlur={false}
                            />
                            <Input
                              label="Reps"
                              type="number"
                              inputSize="small"
                              id={`reps-${exerciseIndex}-${setIndex}`}
                              name="reps"
                              value={set.reps || ""}
                              onChange={(e) =>
                                handleSetChange(
                                  exerciseIndex,
                                  setIndex,
                                  "reps",
                                  e.target.value,
                                )
                              }
                              placeholder="10"
                              min="1"
                              validate={(value) => Number(value) > 0}
                              errorMessage="Reps must be greater than 0"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="icon-only"
                            disabled={exercise.sets.length === 1}
                            onClick={() => removeSet(exerciseIndex, setIndex)}
                            title="Remove set"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => addSet(exerciseIndex)}
                    >
                      Add Set
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          <Button type="button" variant="positive" onClick={addExercise}>
            Add Exercise
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default WorkoutFormContent;
