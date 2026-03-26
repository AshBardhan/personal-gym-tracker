import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, X } from "lucide-react";
import { workoutService } from "../services/workouts.service";
import { useWorkoutForm } from "../stores/workoutFormStore";
import { PREDEFINED_EXERCISES } from "../constants/exercises";
import { config } from "../config/env";
import { getExerciseOptions } from "../utils/workoutUtils";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import SelectBox from "../components/ui/SelectBox";
import "./WorkoutForm.css";

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
    <div className="workout-form-container">
      <h1>{isEditMode ? "Edit Workout" : "Add New Workout"}</h1>

      {loading ? (
        <div className="loading">Loading workout...</div>
      ) : (
        <form onSubmit={handleSubmit} className="workout-form">
          <div className="form-section">
            <div className="form-heading">
              <h2>Workout Details</h2>
              <div className="form-actions">
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

            <div className="form-group form-group-parent">
              <div className="form-group-child">
                <label htmlFor="title">Workout Title (Optional)</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Upper Body Day"
                />
              </div>

              <div className="form-group-child">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>
              Exercises {exercises.length > 0 ? `(${exercises.length})` : ""}
            </h2>

            {exercises.map((exercise, exerciseIndex) => {
              const hasExerciseNameError =
                (submitAttempted || exerciseNameTouched[exerciseIndex]) &&
                !exercise.name.trim();

              return (
                <div key={exerciseIndex} className="exercise-card">
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

                  <div className="exercise-actions">
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

                  <div className="sets-section">
                    <h3>Sets</h3>

                    <div className="set-list">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="set-row">
                          <span className="set-label">{setIndex + 1}</span>
                          <div className="set-inputs">
                            <Input
                              label="Weight (kg)"
                              type="number"
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
                              label="Reps *"
                              type="number"
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
                            onClick={() =>
                              handleRemoveSet(exerciseIndex, setIndex)
                            }
                            title="Remove set"
                          >
                            <X size={20} />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="positive"
                      onClick={() => handleAddSet(exerciseIndex)}
                    >
                      Add Set
                    </Button>
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

            {submitAttempted && !hasValidExercises() && (
              <div className="error-message">
                Please add at least one valid exercise with sets to save the
                workout
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default WorkoutFormPage;
