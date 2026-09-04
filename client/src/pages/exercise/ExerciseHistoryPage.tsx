import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import {
  formatDate,
  formatEquipment,
  formatSetDuration,
  formatVolume,
  formatWeight,
  getExerciseVolume,
  getSetSequenceLabel,
  hasWeightedStats,
} from "@/utils/workoutUtils";
import {
  estimateOneRepMax,
  getWorkoutsForExercise,
} from "@/utils/exerciseUtils";
import { ExerciseOutletContext } from "@/pages/exercise/ExerciseLayout";
import Metric from "@/components/ui/Metric";
import Tile from "@/components/ui/Tile";
import { ExerciseSet, WorkoutExercise } from "@/types/entities";

const SetMetrics = ({
  exercise,
  set,
}: {
  exercise: WorkoutExercise;
  set: ExerciseSet;
}) => {
  if (exercise.metrics.includes("duration") && set.duration != null) {
    return (
      <span className="text-gray-600 dark:text-gray-300">
        {formatSetDuration(set.duration)}
      </span>
    );
  }

  const showWeight =
    exercise.metrics.includes("weight") && set.weight != null && set.weight > 0;
  const showReps = exercise.metrics.includes("reps") && set.reps != null;

  if (showWeight && showReps) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-medium text-green-600 dark:text-green-300">
          {formatWeight(set.weight!)}
        </span>
        <strong>x</strong>
        <span className="text-gray-600 dark:text-gray-300">
          {set.reps} reps
        </span>
      </div>
    );
  }

  if (showReps) {
    return (
      <span className="text-gray-600 dark:text-gray-300">{set.reps} reps</span>
    );
  }

  return null;
};

/**
 * Exercise history tab — workouts that include this movement.
 */
const ExerciseHistoryPage = () => {
  const { exercise, workouts, workoutsLoading } =
    useOutletContext<ExerciseOutletContext>();

  const performances = useMemo(
    () => getWorkoutsForExercise(workouts, exercise._id),
    [workouts, exercise._id],
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
          {performances.map(({ workout, lines }) => {
            const showSessionVolume = lines.some(hasWeightedStats);
            const sessionVolume = lines.reduce(
              (total, line) => total + getExerciseVolume(line.sets),
              0,
            );

            return (
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
                  {showSessionVolume && (
                    <Metric
                      label="Volume"
                      value={formatVolume(sessionVolume)}
                      reverse={true}
                      className="text-right"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-6">
                  {lines.map((line, lineIndex) => {
                    const showLoadStats = hasWeightedStats(line);

                    return (
                      <Tile key={line._id ?? `${line.variantId}-${lineIndex}`}>
                        <div className="mb-2">
                          <Text className="text-gray-800 dark:text-gray-200 font-medium">
                            {line.name}
                          </Text>
                          <Text className="text-xs text-gray-500 dark:text-gray-300">
                            {formatEquipment(line.equipment)}
                          </Text>
                        </div>
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <Text className="text-gray-800 dark:text-gray-200 font-medium">
                            Sets ({line.sets.length})
                          </Text>
                          {showLoadStats && (
                            <Text className="text-gray-800 dark:text-gray-200 font-medium">
                              1 RM
                            </Text>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {line.sets.map((set, setIndex) => (
                            <div
                              key={set._id ?? setIndex}
                              className="flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-2">
                                <span className="min-w-6 h-6 flex items-center justify-center font-semibold text-xs text-blue-500 dark:text-blue-300 bg-gray-200 dark:bg-gray-800 rounded-md px-1 py-0.5">
                                  {getSetSequenceLabel(line.sets, setIndex)}
                                </span>
                                <SetMetrics exercise={line} set={set} />
                              </div>
                              {showLoadStats && (
                                <span className="shrink-0 font-medium text-gray-600 dark:text-gray-100">
                                  {formatWeight(
                                    Math.round(
                                      estimateOneRepMax(
                                        set.weight ?? 0,
                                        set.reps ?? 0,
                                      ),
                                    ),
                                  )}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </Tile>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExerciseHistoryPage;
