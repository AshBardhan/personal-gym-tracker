import { useParams, useNavigate, Link } from "react-router-dom";
import { useWorkout } from "../hooks/useWorkout";
import { useWorkoutMutation } from "../hooks/useWorkoutMutation";
import {
  getExerciseVolume,
  getTotalVolume,
  formatDetailDate,
  formatVolume,
} from "../utils/workoutUtils";
import Button from "../components/ui/Button";
import Text from "../components/ui/Text";

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
    return (
      <div className="flex items-center justify-center">
        <Text variant="p" className="text-gray-600 text-lg">
          Loading workout...
        </Text>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <Text variant="p" className="text-red-600 text-lg">
          {error || "Workout not found"}
        </Text>
        <Button variant="primary" as={Link} to="/workouts">
          ← Back
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <Button variant="secondary" as={Link} to="/workouts">
          ← Back
        </Button>
        <div className="flex gap-2">
          <Button variant="primary" as={Link} to={`/workouts/${id}/edit`}>
            Edit Workout
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Workout
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <Text variant="h1">{workout.title || "Untitled Workout"}</Text>
        <div className="mb-2 flex gap-8 flex-wrap items-center">
          <div>
            <strong>Date:</strong> {formatDetailDate(workout.date)}
          </div>
          <div>
            <strong>Total Volume:</strong>
            &nbsp;
            {formatVolume(getTotalVolume(workout))}
          </div>
        </div>

        <div className="mt-8">
          <Text variant="h2" className="mb-6">
            Exercises{" "}
            {workout.exercises.length > 0
              ? `(${workout.exercises.length})`
              : ""}
          </Text>
          {workout.exercises.length === 0 ? (
            <Text
              variant="p"
              className="text-center text-gray-500 py-8 bg-gray-50 rounded"
            >
              No exercises added to this workout
            </Text>
          ) : (
            <div className="flex flex-col gap-4">
              {workout.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="flex gap-4 bg-gray-50 p-6 rounded border-l-4 border-l-blue-500"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full font-bold text-xl shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <Text
                      variant="h3"
                      className="m-0 mb-4 flex items-center gap-4"
                    >
                      {exercise.name}
                      <span className="text-sm font-normal bg-white px-3 py-1 rounded border border-gray-300">
                        <strong>
                          {formatVolume(getExerciseVolume(exercise.sets))}
                        </strong>
                        &nbsp;volume
                      </span>
                    </Text>
                    <div className="flex flex-col gap-2">
                      {exercise.sets.map((set, setIndex) => (
                        <div
                          key={setIndex}
                          className="flex items-center gap-2 px-4 py-2 bg-white rounded"
                        >
                          <span className="font-semibold text-blue-500 min-w-5">
                            {setIndex + 1}
                          </span>
                          <span className="text-green-600 font-medium">
                            {set.weight} kg
                          </span>
                          <strong>x</strong>
                          <span className="text-gray-600 min-w-20">
                            {set.reps} reps
                          </span>
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
