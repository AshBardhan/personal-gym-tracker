import { useOutletContext } from "react-router-dom";
import {
  getExerciseVolume,
  getTotalVolume,
  formatDetailDate,
  formatVolume,
  formatWeight,
  formatEquipment,
  formatSetDuration,
  hasWeightedStats,
  hasWorkoutWeightedVolume,
  getTotalSets,
  getTotalReps,
} from "@/utils/workoutUtils";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import Metric from "@/components/ui/Metric";
import Tile from "@/components/ui/Tile";
import { WorkoutOutletContext } from "@/pages/workout/WorkoutLayout";
import { estimateOneRepMax, getSetTypeLabel } from "@/utils/exerciseUtils";
import { ExerciseSet, WorkoutExercise } from "@/types/entities";
import { SetTypeBadge } from "@/components/exercise/SetTypeBadge";

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
      <>
        <span className="font-medium text-green-600 dark:text-green-300">
          {formatWeight(set.weight!)}
        </span>
        <strong>x</strong>
        <span className="text-gray-600 dark:text-gray-300">
          {set.reps} reps
        </span>
      </>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Metric label="Date" value={formatDetailDate(workout.date)} />
          <div className="flex items-center justify-between gap-6">
            <Metric label="Sets" value={getTotalSets(workout)} reverse={true} />
            <Metric label="Reps" value={getTotalReps(workout)} reverse={true} />
            {hasWorkoutWeightedVolume(workout) && (
              <Metric
                label="Volume"
                className="text-right"
                reverse={true}
                value={formatVolume(getTotalVolume(workout))}
              />
            )}
          </div>
        </div>

        <div>
          <Text variant="h3" className="mb-4">
            Exercises ({workout.exercises.length})
          </Text>
          {workout.exercises.length === 0 ? (
            <Tile>
              <Text variant="p" className="text-gray-500 dark:text-gray-300">
                No exercises added to this workout
              </Text>
            </Tile>
          ) : (
            <div className="flex flex-col gap-4">
              {workout.exercises.map((exercise, index) => {
                const showLoadStats = hasWeightedStats(exercise);

                return (
                  <Tile
                    key={`${exercise.exerciseId}-${exercise.variantId}-${index}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <Text variant="h3">{exercise.name}</Text>
                        <Text className="text-xs text-gray-500 dark:text-gray-300">
                          {formatEquipment(exercise.equipment)}
                        </Text>
                      </div>

                      {showLoadStats && (
                        <Metric
                          size="sm"
                          label="Volume"
                          value={formatVolume(getExerciseVolume(exercise.sets))}
                          reverse={true}
                          className="text-right"
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <Text className="text-gray-800 dark:text-gray-200 font-medium">
                          Sets
                        </Text>
                        {showLoadStats && (
                          <Text className="text-gray-800 dark:text-gray-200 font-medium">
                            1 RM
                          </Text>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        {exercise.sets.map((set, setIndex) => (
                          <div
                            key={set._id ?? setIndex}
                            className="flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2">
                              <SetTypeBadge type={set.type} size="small">
                                {getSetTypeLabel(exercise.sets, setIndex)}
                              </SetTypeBadge>
                              <SetMetrics exercise={exercise} set={set} />
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
                    </div>
                  </Tile>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default WorkoutOverviewPage;
