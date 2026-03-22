import { useParams, useNavigate } from "react-router-dom";
import { useWorkout } from "../hooks/useWorkout";
import { useWorkoutMutation } from "../hooks/useWorkoutMutation";
import { getExerciseVolume, getTotalVolume, formatDetailDate, formatVolume } from "../utils/workoutUtils";
import Button from "../components/ui/Button";
import "./WorkoutDetail.css";

/**
 * Workout Detail Page Component
 * Displays detailed view of a single workout
 */
const WorkoutDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workout, loading, error } = useWorkout(id);
  const { deleteWorkout } = useWorkoutMutation();

  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm("Are you sure you want to delete this workout?")) {
      const success = await deleteWorkout(id);
      if (success) {
        navigate("/workouts");
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading workout...</div>;
  }

  if (error || !workout) {
    return (
      <div className="error">
        <p>{error || "Workout not found"}</p>
        <Button variant="primary" onClick={() => navigate("/workouts")}>
          Back to Workouts
        </Button>
      </div>
    );
  }

  return (
    <div className="workout-detail">
      <div className="detail-header">
        <Button variant="secondary" onClick={() => navigate("/workouts")}>
          ← Back to Workouts
        </Button>
        <div className="header-actions">
          <Button
            variant="primary"
            onClick={() => navigate(`/workouts/${id}/edit`)}
          >
            Edit Workout
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Workout
          </Button>
        </div>
      </div>

      <div className="detail-card">
        <h1>{workout.title || "Untitled Workout"}</h1>
        <div className="detail-meta">
          <div>
            <strong>Date:</strong> {formatDetailDate(workout.date)}
          </div>
          <div>
            <strong>Total Volume:</strong>
            &nbsp;
            {formatVolume(getTotalVolume(workout))}
          </div>
        </div>

        <div className="exercises-section">
          <h2>
            Exercises{" "}
            {workout.exercises.length > 0
              ? `(${workout.exercises.length})`
              : ""}
          </h2>
          {workout.exercises.length === 0 ? (
            <p className="no-exercises">No exercises added to this workout</p>
          ) : (
            <div className="exercises-table">
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="exercise-row">
                  <div className="exercise-number">{index + 1}</div>
                  <div className="exercise-details">
                    <h3>
                      {exercise.name}
                      <span className="exercise-volume">
                        <strong>
                          {formatVolume(
                            getExerciseVolume(exercise.sets)
                          )}
                        </strong>
                        &nbsp;volume
                      </span>
                    </h3>
                    <div className="sets-table">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="set-row">
                          <span className="set-label">{setIndex + 1}</span>
                          <span className="set-weight">{set.weight} kg</span>
                          <strong>x</strong>
                          <span className="set-reps">{set.reps} reps</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailPage;
