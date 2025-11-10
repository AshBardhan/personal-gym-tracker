import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, X } from "lucide-react";
import { workoutAPI } from "../services/api";
import { Exercise, Set } from "../types";
import Input from "./Input";
import Button from "./Button";
import "./WorkoutForm.css";

interface ExerciseInput extends Omit<Exercise, "sets"> {
  sets: Set[];
}

const WorkoutForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [exercises, setExercises] = useState<ExerciseInput[]>([
    { name: "", sets: [{ reps: 0, weight: 0 }] },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Hardcoded userId for demo - would come from auth in real app
  const userId = "673092a6fd2a34e8e4b91234";

  // Load workout data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadWorkout(id);
    }
  }, [id, isEditMode]);

  const loadWorkout = async (workoutId: string) => {
    try {
      setLoading(true);
      const response = await workoutAPI.getById(workoutId);
      const workout = response.data;

      setFormData({
        title: workout.title || "",
        date: new Date(workout.date).toISOString().split("T")[0],
      });
      setExercises(workout.exercises);
    } catch (error) {
      console.error("Error loading workout:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleExerciseNameChange = (
    exerciseIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].name = e.target.value;
    setExercises(updatedExercises);
  };

  const handleSetChange = (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: string,
  ) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] =
      parseFloat(value) || 0;
    setExercises(updatedExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: [{ reps: 0, weight: 0 }] }]);
    console.log("New exercise added");
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
    console.log("Exercise removed");
  };

  const addSet = (exerciseIndex: number) => {
    setExercises((current) =>
      current.map((ex, idx) =>
        idx === exerciseIndex
          ? {
              ...ex,
              sets: [...ex.sets, { reps: 0, weight: 0 }],
            }
          : ex,
      ),
    );
    console.log("New set added to exercise", exerciseIndex);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    setExercises((prev) =>
      prev.map((ex, idx) =>
        idx === exerciseIndex
          ? {
              ...ex,
              sets: [...ex.sets.filter((_, i) => i !== setIndex)],
            }
          : ex,
      ),
    );
    console.log("Set removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // Filter out empty exercises (no name or no valid sets)
    const validExercises = exercises.filter(
      (ex) => ex.name.trim() && ex.sets.some((s) => s.reps > 0),
    );

    if (validExercises.length === 0) {
      console.error(
        "Validation error: Cannot save workout - At least one valid exercise is required",
      );
      return;
    }

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

      navigate("/");
    } catch (error) {
      console.error("Error saving workout:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
      // Log the full error object for debugging
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

            <div className="form-group">
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

            <div className="form-group">
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
                    onClick={() => removeExercise(exerciseIndex)}
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
                          onClick={() => removeSet(exerciseIndex, setIndex)}
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
                    onClick={() => addSet(exerciseIndex)}
                  >
                    Add Set
                  </Button>
                </div>
              </div>
            ))}

            <Button type="button" variant="positive" onClick={addExercise}>
              Add Exercise
            </Button>

            {submitAttempted &&
              !exercises.some(
                (ex) => ex.name.trim() && ex.sets.some((s) => s.reps > 0),
              ) && (
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
