import { useState, useEffect } from "react";
import { workoutAPI } from "../services/api";
import { Link } from "react-router-dom";
import { Workout } from "../types";
import "./WorkoutList.css";

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // For demo purposes, using a hardcoded userId
  // In a real app, this would come from authentication
  const userId = "673092a6fd2a34e8e4b91234";

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const response = await workoutAPI.getAllByUser(userId);
      setWorkouts(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch workouts. Make sure the server is running.");
      console.error("Error fetching workouts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        await workoutAPI.delete(id);
        fetchWorkouts(); // Refresh the list
      } catch (err) {
        console.error("Error deleting workout:", err);
      }
    }
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTotalSets = (workout: Workout): number => {
    return workout.exercises.reduce(
      (total, exercise) => total + exercise.sets.length,
      0,
    );
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
        <Link to="/add-workout" className="btn btn-primary">
          Add New Workout
        </Link>
      </div>

      {workouts.length === 0 ? (
        <div className="no-workouts">
          <p>No workouts found. Start tracking your fitness journey!</p>
          <Link to="/add-workout" className="btn btn-primary">
            Create Your First Workout
          </Link>
        </div>
      ) : (
        <div className="workouts-grid">
          {workouts.map((workout) => (
            <div key={workout._id} className="workout-card">
              <div className="workout-card-header">
                <h3>{workout.title || "Untitled Workout"}</h3>
                <span className="workout-date">{formatDate(workout.date)}</span>
              </div>
              <div className="workout-card-body">
                <p className="workout-exercises">
                  {workout.exercises.length} exercise(s)
                </p>
                <p className="workout-sets">
                  {getTotalSets(workout)} total sets
                </p>
              </div>
              <div className="workout-card-actions">
                <Link
                  to={`/workout/${workout._id}`}
                  className="btn btn-secondary"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleDelete(workout._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
