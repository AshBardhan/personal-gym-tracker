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
import Card from "../components/ui/Card";
import Metric from "../components/ui/Metric";
import PageContainer from "../components/layout/PageContainer";

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
      <div className="flex flex-1 min-h-0 items-center justify-center">
        <Text variant="p" className="text-gray-600 text-lg">
          Loading workout...
        </Text>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="flex flex-1 min-h-0 flex-col items-center justify-center gap-6">
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
    <div className="min-h-0 w-full flex-1 overflow-y-auto">
      <PageContainer className="py-4 sm:py-6">
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

      <Card>
        <Text variant="h2">{workout.title || "Untitled Workout"}</Text>
        <div className="mt-1 flex gap-8 flex-wrap items-center">
          <Text className="text-gray-600 text-sm">
            <strong>Date:</strong> {formatDetailDate(workout.date)}
          </Text>
          <Text className="text-gray-600 text-sm">
            <strong>Total Volume:</strong>
            &nbsp;
            {formatVolume(getTotalVolume(workout))}
          </Text>
        </div>

        <div className="mt-4">
          <Text variant="h3" className="mb-4">
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
                  className="flex gap-3 bg-gray-50 p-3 rounded-md border"
                >
                  <div className="flex items-center justify-center min-w-8 h-8 bg-blue-500 text-white rounded-full font-bold text-nase shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <Text
                      variant="h4"
                      className="m-0 mb-2 flex items-center gap-2"
                    >
                      {exercise.name}
                      <Metric
                        direction="row"
                        size="sm"
                        label="volume"
                        value={formatVolume(getExerciseVolume(exercise.sets))}
                        reverse={true}
                        className="bg-white p-2 rounded border border-gray-300"
                      />
                    </Text>
                    <div className="flex flex-col gap-2">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="flex items-center gap-2">
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
      </Card>
      </PageContainer>
    </div>
  );
};

export default WorkoutDetailPage;
