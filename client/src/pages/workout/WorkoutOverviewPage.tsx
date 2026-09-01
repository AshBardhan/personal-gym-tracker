import { useOutletContext } from "react-router-dom";
import {
  getExerciseVolume,
  getTotalVolume,
  formatDetailDate,
  formatVolume,
  formatWeight,
} from "@/utils/workoutUtils";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import Metric from "@/components/ui/Metric";
import { WorkoutOutletContext } from "@/pages/workout/WorkoutLayout";
import { estimateOneRepMax } from "@/utils/exerciseUtils";

/**
 * Workout overview tab — date, volume, and exercise breakdown.
 */
const WorkoutOverviewPage = () => {
  const { workout } = useOutletContext<WorkoutOutletContext>();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Text variant="h2" className="m-0">
          Workout Overview
        </Text>
      </div>

      <Card>
        <Text variant="h3" className="mb-2">
          Summary
        </Text>
        <div className="mt-0 flex items-center justify-between mb-6">
          <Metric label="Date" size="sm" value={formatDetailDate(workout.date)} />
          <Metric
            label="Volume"
            className="text-right"
            reverse={true}
            value={formatVolume(getTotalVolume(workout))}
          />
        </div>

        <div>
          <Text variant="h3" className="mb-4">
            Exercises{" "}
            {workout.exercises.length > 0
              ? `(${workout.exercises.length})`
              : ""}
          </Text>
          {workout.exercises.length === 0 ? (
            <Text
              variant="p"
              className="app-tile rounded bg-gray-50 py-8 text-center text-gray-500 dark:bg-neutral-950 dark:text-gray-300"
            >
              No exercises added to this workout
            </Text>
          ) : (
            <div className="flex flex-col gap-4">
              {workout.exercises.map((exercise, index) => (
                <div
                  key={`${exercise.name}-${index}`}
                  className="app-tile rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-transparent"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Text variant="h3">{exercise.name}</Text>

                    <Metric
                      size="sm"
                      label="Volume"
                      value={formatVolume(getExerciseVolume(exercise.sets))}
                      reverse={true}
                      className="text-right"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <Text className="text-gray-800 dark:text-gray-200 font-medium">
                        Sets
                      </Text>
                      <Text className="text-gray-800 dark:text-gray-200 font-medium">
                        1 RM
                      </Text>
                    </div>
                    <div className="flex flex-col gap-2">
                      {exercise.sets.map((set, setIndex) => (
                        <div
                          key={setIndex}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2">
                            <span className="min-w-5 font-semibold text-blue-500 dark:text-blue-300 bg-gray-200 dark:bg-gray-800 rounded-md px-2 py-1">
                              {setIndex + 1}
                            </span>
                            <span className="font-medium text-green-600 dark:text-green-300">
                              {formatWeight(set.weight)}
                            </span>
                            <strong>x</strong>
                            <span className="text-gray-600 dark:text-gray-300">
                              {set.reps} reps
                            </span>
                          </div>
                          <span className="shrink-0 font-medium text-gray-600 dark:text-gray-100">
                            {formatWeight(
                              Math.round(
                                estimateOneRepMax(set.weight, set.reps),
                              ),
                            )}
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
    </div>
  );
};

export default WorkoutOverviewPage;
