import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import Metric from "@/components/ui/Metric";
import {
  formatCategory,
  formatExerciseMetrics,
  formatMuscleGroup,
  formatVolume,
  formatWeight,
  hasWeightedStats,
} from "@/utils/workoutUtils";
import {
  getExerciseStats,
  getWorkoutsForExercise,
} from "@/utils/exerciseUtils";
import { ExerciseOutletContext } from "@/pages/exercise/ExerciseLayout";

/**
 * Exercise overview tab — details, variants, and lifetime stats.
 */
const ExerciseOverviewPage = () => {
  const { exercise, workouts, workoutsLoading } =
    useOutletContext<ExerciseOutletContext>();

  const secondaryMuscles = exercise.secondaryMuscleGroups ?? [];
  const showLoadStats = exercise.variants.some((variant) =>
    hasWeightedStats(variant),
  );

  const stats = useMemo(() => {
    const performances = getWorkoutsForExercise(workouts, exercise._id);
    return getExerciseStats(performances);
  }, [workouts, exercise._id]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Text variant="h2" className="m-0">
          Exercise Overview
        </Text>
      </div>

      <Card className="flex flex-col gap-8">
        <section>
          <Text variant="h3" className="mb-4">
            Details
          </Text>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <Metric
              label="Category"
              value={formatCategory(exercise.category)}
            />
            <Metric
              label="Primary Muscle Target"
              value={formatMuscleGroup(exercise.primaryMuscleGroup)}
            />
            <Metric
              label="Secondary Muscle Targets"
              value={
                secondaryMuscles.length > 0
                  ? secondaryMuscles.map(formatMuscleGroup).join(" · ")
                  : "None"
              }
            />
          </div>
        </section>

        <section>
          <Text variant="h3" className="mb-4">
            Variants
          </Text>
          {exercise.variants.length === 0 ? (
            <Text variant="p" className="text-gray-500 dark:text-gray-300">
              No variants for this exercise.
            </Text>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {exercise.variants.map((variant) => (
                <Metric
                  key={variant._id}
                  label={variant.name}
                  value={formatExerciseMetrics(variant.metrics)}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <Text variant="h3" className="mb-4">
            Stats
          </Text>
          {workoutsLoading ? (
            <Text variant="p" className="text-gray-500 dark:text-gray-300">
              Loading stats...
            </Text>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                <Metric
                  label={`Day${stats.days > 1 ? "s" : ""}`}
                  value={stats.days}
                  reverse={true}
                />
                <Metric
                  label={`Total ${stats.totalSets > 1 ? "Sets" : "Set"}`}
                  value={stats.totalSets}
                  reverse={true}
                />
                <Metric
                  label={`Total ${stats.totalReps > 1 ? "Reps" : "Rep"}`}
                  value={stats.totalReps}
                  reverse={true}
                />
              </div>
              {showLoadStats ? (
                <>
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                    <Metric
                      label="Total Volume"
                      value={formatVolume(stats.totalVolume)}
                      reverse={true}
                    />
                    <Metric
                      label="Max Volume"
                      value={formatVolume(stats.maxVolume)}
                      reverse={true}
                    />
                    <Metric
                      label="Average Volume"
                      value={formatVolume(stats.averageVolume)}
                      reverse={true}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                    <Metric
                      label="Max Weight (PR)"
                      value={formatWeight(stats.maxWeight)}
                      reverse={true}
                    />
                    <Metric
                      label="Best 1RM"
                      value={formatWeight(Math.round(stats.bestOneRepMax))}
                      reverse={true}
                    />
                  </div>
                </>
              ) : null}
            </div>
          )}
        </section>
      </Card>
    </div>
  );
};

export default ExerciseOverviewPage;
