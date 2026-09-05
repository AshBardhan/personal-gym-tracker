import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import Metric from "@/components/ui/Metric";
import Tile from "@/components/ui/Tile";
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

      <Card className="flex flex-col gap-6">
        <section>
          <Text variant="h3" className="mb-2">
            Summary
          </Text>
          <Tile className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <Metric
              label="Category"
              value={formatCategory(exercise.category)}
            />
            <Metric
              label="Primary Muscle Target"
              value={formatMuscleGroup(exercise.primaryMuscleGroup)}
            />
            {secondaryMuscles.length > 0 && (
              <Metric
                label="Secondary Muscle Targets"
                value={secondaryMuscles.map(formatMuscleGroup).join(" · ")}
              />
            )}
          </Tile>
        </section>

        <section>
          <Text variant="h3" className="mb-2">
            Variants
          </Text>
          {exercise.variants.length === 0 ? (
            <Tile>
              <Text variant="p" className="text-gray-500 dark:text-gray-300">
                No variants for this exercise.
              </Text>
            </Tile>
          ) : (
            <Tile className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {exercise.variants.map((variant) => (
                <Metric
                  key={variant._id}
                  label={variant.name}
                  value={formatExerciseMetrics(variant.metrics)}
                />
              ))}
            </Tile>
          )}
        </section>

        <section>
          <Text variant="h3" className="mb-2">
            Stats
          </Text>
          {workoutsLoading ? (
            <Tile>
              <Text variant="p" className="text-gray-500 dark:text-gray-300">
                Loading stats...
              </Text>
            </Tile>
          ) : (
            <Tile className="flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                <Metric
                  label={`Day${stats.days > 1 ? "s" : ""}`}
                  value={stats.days}
                  reverse={true}
                />
                <Metric
                  label={`Total Set${stats.totalSets > 1 ? "s" : ""}`}
                  value={stats.totalSets}
                  reverse={true}
                />
                <Metric
                  label={`Total Rep${stats.totalReps > 1 ? "s" : ""}`}
                  value={stats.totalReps}
                  reverse={true}
                />
              </div>
              {showLoadStats && (
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
              )}
            </Tile>
          )}
        </section>
      </Card>
    </div>
  );
};

export default ExerciseOverviewPage;
