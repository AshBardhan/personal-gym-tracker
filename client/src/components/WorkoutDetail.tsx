import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { workoutAPI } from "../services/api";
import { Set, Workout } from "../types";
import Button from "./Button";
import "./WorkoutDetail.css";

const WorkoutDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchWorkout();
    }
  }, [id]);

  const fetchWorkout = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await workoutAPI.getById(id);
      setWorkout(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch workout details");
      console.error("Error fetching workout:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        await workoutAPI.delete(id);
        navigate("/");
      } catch (err) {
        console.error("Error deleting workout:", err);
      }
    }
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getExerciseVolume = (sets: Set[]): number => {
    return sets.reduce((total, set) => total + set.reps * set.weight, 0);
  };

  const getTotalWorkoutVolume = (workout: Workout): number => {
    return workout.exercises.reduce(
      (total, exercise) => total + getExerciseVolume(exercise.sets),
      0,
    );
  };

  if (loading) {
    return <div className="loading">Loading workout...</div>;
  }

  if (error || !workout) {
    return (
      <div className="error">
        <p>{error || "Workout not found"}</p>
        <Button variant="primary" onClick={() => navigate("/")}>
          Back to Workouts
        </Button>
      </div>
    );
  }

  return (
    <div className="workout-detail">
      <div className="detail-header">
        <Button variant="secondary" onClick={() => navigate("/")}>
          ← Back to Workouts
        </Button>
        <div className="header-actions">
          <Button
            variant="primary"
            onClick={() => navigate(`/edit-workout/${id}`)}
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
            <strong>Date:</strong> {formatDate(workout.date)}
          </div>
          <div>
            <strong>Total Volume:</strong>
            &nbsp;{Math.round(getTotalWorkoutVolume(workout))} kg
          </div>
        </div>

        <div className="exercises-section">
          <h2>Exercises</h2>
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
                        <strong>{getExerciseVolume(exercise.sets)} kg</strong>
                        &nbsp;volume
                      </span>
                    </h3>
                    <div className="sets-table">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="set-row">
                          <span className="set-label">{setIndex + 1}</span>
                          <span className="set-reps">{set.reps} reps</span>
                          <span className="set-weight">{set.weight} kg</span>
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

export default WorkoutDetail;
