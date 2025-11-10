import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, X } from "lucide-react";
import { workoutAPI } from "../services/api";
import { useWorkoutFormStore } from "../stores/workoutFormStore";
import Input from "./Input";
import Button from "./Button";
import "./WorkoutForm.css";

const WorkoutForm = () => {
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
    updateExerciseName,
    addSet,
    removeSet,
    updateSet,
    setLoading,
    setSubmitAttempted,
    getValidExercises,
    hasValidExercises,
    resetForm,
    loadWorkoutData,
  } = useWorkoutFormStore();

  // Hardcoded userId for demo - would come from auth in real app
  const userId = "673092a6fd2a34e8e4b91234";

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
      const response = await workoutAPI.getById(workoutId);
      const workout = response.data;

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

  const handleExerciseNameChange = (
    exerciseIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateExerciseName(exerciseIndex, e.target.value);
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
        await workoutAPI.update(id, workoutData);
        console.log("Workout updated successfully:", id);
      } else {
        await workoutAPI.create(workoutData);
        console.log("Workout created successfully");
      }

      resetForm();
      navigate("/");
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
                  onClick={() => navigate("/")}
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
            <h2>Exercises</h2>

            {exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} className="exercise-card">
                <Input
                  label={`Exercise ${exerciseIndex + 1} Name *`}
                  type="text"
                  id={`exerciseName-${exerciseIndex}`}
                  name="name"
                  value={exercise.name}
                  onChange={(e) => handleExerciseNameChange(exerciseIndex, e)}
                  placeholder="e.g., Bench Press"
                  validate={(value) => String(value).trim().length > 0}
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

                  <div className="sets-list">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="set-row">
                        <span className="set-label">{setIndex + 1}</span>
                        <div className="set-inputs">
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
            ))}

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

export default WorkoutForm;
