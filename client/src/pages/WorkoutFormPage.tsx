import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { workoutService } from "../services/workouts.service";
import { useWorkoutForm } from "../stores/workoutFormStore";
import { PREDEFINED_EXERCISES } from "../constants/exercises";
import { config } from "../config/env";
import { getExerciseOptions } from "../utils/workoutUtils";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import SelectBox from "../components/ui/SelectBox";
import Text from "../components/ui/Text";
import Card from "../components/ui/Card";
import PageContainer from "../components/layout/PageContainer";

/**
 * Workout Form Page Component
 * Handles both create and edit modes for workouts
 */
const WorkoutFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // Zustand store
  const {
    formData,
    exercises,
    loading,
    submitAttempted,
    updateFormField,
    addExercise,
    removeExercise,
    updateExercise,
    addSet,
    removeSet,
    updateSet,
    setLoading,
    setSubmitAttempted,
    getValidExercises,
    hasValidExercises,
    resetForm,
    loadWorkoutData,
  } = useWorkoutForm();

  // Demo userId from env - would come from auth in real app
  const userId = config.user.DEMO_USER_ID;

  // Exercise options for SelectBox
  const exerciseOptions = getExerciseOptions();

  // Track touched state for exercise names
  const [exerciseNameTouched, setExerciseNameTouched] = useState<{
    [key: number]: boolean;
  }>({});

  // Load workout data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadWorkout(id);
    } else {
      // Reset form when creating new workout
      resetForm();
    }
  }, [id, isEditMode]);

  const loadWorkout = async (workoutId: string) => {
    try {
      setLoading(true);
      const workout = await workoutService.getById(workoutId);

      loadWorkoutData({
        title: workout.title || "",
        date: new Date(workout.date).toISOString().split("T")[0],
        exercises: workout.exercises,
      });
    } catch (error) {
      console.error("Error loading workout:", error);
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormField(e.target.name as "title" | "date", e.target.value);
  };

  const handleExerciseNameChange = (exerciseIndex: number, value: string) => {
    // Find the predefined exercise to get category and muscleGroup
    const predefinedExercise = PREDEFINED_EXERCISES.find(
      (ex) => ex.name === value,
    );

    // Update with full exercise data if predefined, otherwise just name
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

  const handleAddExercise = () => {
    addExercise();
    console.log("New exercise added");
  };

  const handleRemoveExercise = (index: number) => {
    removeExercise(index);
    console.log("Exercise removed");
  };

  const handleAddSet = (exerciseIndex: number) => {
    addSet(exerciseIndex);
    console.log("New set added to exercise", exerciseIndex);
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    removeSet(exerciseIndex, setIndex);
    console.log("Set removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!hasValidExercises()) {
      console.error(
        "Validation error: Cannot save workout - At least one valid exercise is required",
      );
      return;
    }

    const validExercises = getValidExercises();

    try {
      const workoutData = {
        userId,
        title: formData.title || undefined,
        date: formData.date,
        exercises: validExercises,
      };

      console.log("Submitting workout data:", workoutData);

      if (isEditMode && id) {
        await workoutService.update(id, workoutData);
        console.log("Workout updated successfully:", id);
      } else {
        await workoutService.create(workoutData);
        console.log("Workout created successfully");
      }

      resetForm();
      navigate("/workouts");
    } catch (error) {
      console.error("Error saving workout:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
      console.error("Full error details:", JSON.stringify(error, null, 2));
    }
  };

  return (
    <div className="min-h-0 w-full flex-1 overflow-y-auto">
      <PageContainer className="py-4 sm:py-6">
      <Text variant="h1" className="mb-8">
        {isEditMode ? "Edit Workout" : "New Workout"}
      </Text>

      {loading ? (
        <div className="loading">Loading workout...</div>
      ) : (
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div>
              <div className="flex items-center justify-between mb-6">
                <Text variant="h2">Workout Details</Text>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/workouts")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    {isEditMode ? "Update" : "Save"}
                  </Button>
                </div>
              </div>

              {submitAttempted && !hasValidExercises() && (
                <div className="bg-red-50 border border-red-600 text-red-700 p-4 rounded my-4 flex items-center gap-3">
                  <AlertTriangle
                    className="text-red-600 flex-shrink-0"
                    size={24}
                  />
                  <Text variant="p">
                    Please add at least one valid exercise with sets to save the
                    workout.
                  </Text>
                </div>
              )}

              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    label="Workout Title (Optional)"
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="e.g., Upper Body Day"
                    className="w-full px-3 py-3 border border-gray-300 rounded text-base transition-colors box-border focus:outline-none focus:border-blue-500"
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
                    className="w-full px-3 py-3 border border-gray-300 rounded text-base transition-colors box-border focus:outline-none focus:border-blue-500"
                  />
                </div>
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
                    className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6 relative"
                  >
                    <div className="absolute top-2 right-2 flex">
                      <Button
                        type="button"
                        disabled={exercises.length === 1}
                        variant="icon-only"
                        onClick={() => handleRemoveExercise(exerciseIndex)}
                        title="Remove exercise"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <SelectBox
                        label={`Exercise Name`}
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
                            <div key={setIndex} className="flex gap-3">
                              <span className="font-semibold text-blue-500 min-w-8 h-8 flex self-start items-center justify-center bg-blue-100 rounded-full">
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
                                className="self-center"
                                disabled={exercise.sets.length === 1}
                                onClick={() =>
                                  handleRemoveSet(exerciseIndex, setIndex)
                                }
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
                          onClick={() => handleAddSet(exerciseIndex)}
                        >
                          Add Set
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <Button
                type="button"
                variant="positive"
                onClick={handleAddExercise}
              >
                Add Exercise
              </Button>
            </div>
          </form>
        </Card>
      )}
      </PageContainer>
    </div>
  );
};

export default WorkoutFormPage;
