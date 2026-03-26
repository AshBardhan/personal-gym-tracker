import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useWorkouts } from "../hooks/useWorkouts";
import { useWorkoutMutation } from "../hooks/useWorkoutMutation";
import {
  getTotalSets,
  getTotalVolume,
  formatDate,
  formatVolume,
} from "../utils/workoutUtils";
import { config } from "../config/env";
import Button from "../components/ui/Button";
import Text from "../components/ui/Text";
import Card from "../components/ui/Card";
import Metric from "../components/ui/Metric";

/**
 * Workout List Page Component
 * Displays all workouts for the user
 */
const WorkoutListPage = () => {
  const { workouts, loading, error, refetch } = useWorkouts(
    config.user.DEMO_USER_ID,
  );
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
    return (
      <div className="flex items-center justify-center">
        <Text variant="p" className="text-gray-600 text-lg">
          Loading workouts...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <Text variant="p" className="text-red-600 text-lg">
          {error}
        </Text>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <Text variant="h1" className="m-0">
          My Workouts
        </Text>
        <Button variant="primary" size="large" as={Link} to="/workouts/new">
          New Workout
        </Button>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Text variant="p" className="text-gray-500 text-lg mb-6">
            No workouts found. Start tracking your fitness journey!
          </Text>
          <Button variant="primary" as={Link} to="/workouts/new" size="large">
            Create Your First Workout
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <Card
              key={workout._id}
              className="relative"
              href={`/workouts/${workout._id}`}
            >
              <div className="mb-4">
                <Text variant="h3" className="mb-1">
                  {workout.title || "Untitled Workout"}
                </Text>
                <Text className="text-gray-500 text-xs">
                  {formatDate(workout.date)}
                </Text>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Metric
                  label="exercises"
                  value={workout.exercises.length}
                  reverse={true}
                />
                <Metric
                  label="sets"
                  value={getTotalSets(workout)}
                  reverse={true}
                />
                <Metric
                  label="volume"
                  value={formatVolume(getTotalVolume(workout))}
                  reverse={true}
                />
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  title="Delete Workout"
                  onClick={(e: React.MouseEvent) =>
                    handleDelete(e, workout._id)
                  }
                  variant="icon-only"
                >
                  <Trash2 size={20} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutListPage;
