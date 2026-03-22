import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useWorkouts } from "../hooks/useWorkouts";
import { useWorkoutMutation } from "../hooks/useWorkoutMutation";
import { getTotalSets, getTotalVolume, formatDate, formatVolume } from "../utils/workoutUtils";
import { config } from "../config/env";
import Button from "../components/ui/Button";
import "./WorkoutList.css";

/**
 * Workout List Page Component
 * Displays all workouts for the user
 */
const WorkoutListPage = () => {
  const { workouts, loading, error, refetch } = useWorkouts(config.user.DEMO_USER_ID);
  const { deleteWorkout } = useWorkoutMutation();

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this workout?")) {
      const success = await deleteWorkout(id);
      if (success) {
        refetch();
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading workouts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="workout-list">
      <div className="workout-list-header">
        <h1>My Workouts</h1>
        <Link to="/workouts/new" className="btn btn-primary">
          Add New Workout
        </Link>
      </div>

      {workouts.length === 0 ? (
        <div className="no-workouts">
          <p>No workouts found. Start tracking your fitness journey!</p>
          <Link to="/workouts/new" className="btn btn-primary">
            Create Your First Workout
          </Link>
        </div>
      ) : (
        <div className="workouts-grid">
          {workouts.map((workout) => (
            <Link
              key={workout._id}
              className="workout-card"
              to={`/workouts/${workout._id}`}
            >
              <div className="workout-card-header">
                <h3>{workout.title || "Untitled Workout"}</h3>
                <span className="workout-date">
                  {formatDate(workout.date)}
                </span>
              </div>
              <div className="workout-card-body">
                <p className="workout-exercises">
                  {workout.exercises.length} exercise(s)
                </p>
                <p className="workout-sets">
                  {getTotalSets(workout)} total sets
                </p>
                <p className="workout-volume">
                  {formatVolume(getTotalVolume(workout))}{" "}
                  volume
                </p>
              </div>
              <div className="workout-card-actions">
                <Button
                  title="Delete Workout"
                  onClick={(e) => handleDelete(e, workout._id)}
                  variant="icon-only"
                >
                  <Trash2 />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutListPage;
