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
        <Button variant="primary" as={Link} to="/workouts/new">
          Add New Workout
        </Button>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Text variant="p" className="text-gray-500 text-lg mb-6">
            No workouts found. Start tracking your fitness journey!
          </Text>
          <Link to="/workouts/new">
            <Button variant="primary">Create Your First Workout</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {workouts.map((workout) => (
            <Link
              key={workout._id}
              className="relative bg-white rounded-lg shadow-md p-6 transition-[background-color] no-underline hover:bg-gray-100"
              to={`/workouts/${workout._id}`}
            >
              <div className="mb-4">
                <Text variant="h3" className="m-0 mb-2">
                  {workout.title || "Untitled Workout"}
                </Text>
                <span className="text-gray-500 text-sm">
                  {formatDate(workout.date)}
                </span>
              </div>
              <div className="flex gap-4 font-medium text-sm flex-wrap">
                <Text variant="p" className="text-blue-500">
                  {workout.exercises.length} exercise(s)
                </Text>
                <Text variant="p" className="text-green-600">
                  {getTotalSets(workout)} total sets
                </Text>
                <Text variant="p" className="text-orange-500">
                  {formatVolume(getTotalVolume(workout))} volume
                </Text>
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  title="Delete Workout"
                  onClick={(e: React.MouseEvent) =>
                    handleDelete(e, workout._id)
                  }
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
