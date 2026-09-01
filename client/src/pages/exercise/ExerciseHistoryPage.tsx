import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import {
  formatDate,
  formatVolume,
  getExerciseVolume,
  formatWeight,
} from "@/utils/workoutUtils";
import {
  estimateOneRepMax,
  getWorkoutsForExercise,
} from "@/utils/exerciseUtils";
import { ExerciseOutletContext } from "@/pages/exercise/ExerciseLayout";
import Metric from "@/components/ui/Metric";

/**
 * Exercise history tab — workouts that include this movement.
 */
const ExerciseHistoryPage = () => {
  const { exercise, workouts, workoutsLoading } =
    useOutletContext<ExerciseOutletContext>();

  const performances = useMemo(
    () => getWorkoutsForExercise(workouts, exercise.name),
    [workouts, exercise.name],
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Text variant="h2" className="m-0">
          Exercise Workout History
        </Text>
      </div>

      {workoutsLoading ? (
        <Card>
          <Text variant="p" className="text-gray-500 dark:text-gray-300">
            Loading workout history...
          </Text>
        </Card>
      ) : performances.length === 0 ? (
        <Card>
          <Text variant="p" className="text-gray-500 dark:text-gray-300">
            This exercise has not been logged in any workouts yet.
          </Text>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {performances.map(({ workout, sets }) => (
            <Card key={workout._id} href={`/workouts/${workout._id}`}>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex flex-col">
                  <Text variant="h3">
                    {workout.title || "Untitled Workout"}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-300">
                    {formatDate(workout.date)}
                  </Text>
                </div>
                <div>
                  <Metric
                    size="sm"
                    label="volume"
                    value={formatVolume(getExerciseVolume(sets))}
                    reverse={true}
                    className="text-right"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <Text className="text-gray-800 dark:text-gray-200 font-medium">
                  Sets
                </Text>
                <Text className="text-gray-800 dark:text-gray-200 font-medium">
                  1 RM
                </Text>
              </div>
              <div className="flex flex-col gap-2">
                {sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="min-w-5 font-semibold text-blue-500 dark:text-blue-300 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                        {setIndex + 1}
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-300">
                        {set.weight} kg
                      </span>
                      <strong>x</strong>
                      <span className="text-gray-600 dark:text-gray-300">
                        {set.reps} reps
                      </span>
                    </div>
                    <span className="shrink-0 font-medium text-gray-600 dark:text-gray-100">
                      {formatWeight(
                        Math.round(estimateOneRepMax(set.weight, set.reps)),
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseHistoryPage;
