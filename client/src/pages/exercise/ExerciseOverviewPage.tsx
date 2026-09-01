import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import Metric from "@/components/ui/Metric";
import { formatVolume, formatWeight } from "@/utils/workoutUtils";
import {
  getExerciseStats,
  getWorkoutsForExercise,
} from "@/utils/exerciseUtils";
import { ExerciseOutletContext } from "@/pages/exercise/ExerciseLayout";

/**
 * Exercise overview tab — details and lifetime stats.
 */
const ExerciseOverviewPage = () => {
  const { exercise, workouts, workoutsLoading } =
    useOutletContext<ExerciseOutletContext>();
  const [primaryMuscle, ...secondaryMuscles] = exercise.muscleGroup;

  const stats = useMemo(() => {
    const performances = getWorkoutsForExercise(workouts, exercise.name);
    return getExerciseStats(performances);
  }, [workouts, exercise.name]);

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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Metric label="Category" value={exercise.category} reverse={true} />
            <Metric
              label="Primary"
              value={primaryMuscle || "None"}
              reverse={true}
            />
            <Metric
              label="Secondary"
              value={
                secondaryMuscles.length > 0
                  ? secondaryMuscles.join(" · ")
                  : "None"
              }
              reverse={true}
            />
          </div>
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Metric label="Days" value={stats.days} reverse={true} />
                <Metric
                  label="Total Sets"
                  value={stats.totalSets}
                  reverse={true}
                />
                <Metric
                  label="Total Volume"
                  value={formatVolume(stats.totalVolume)}
                  reverse={true}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Metric
                  label="Best Volume"
                  value={formatVolume(stats.bestVolume)}
                  reverse={true}
                />
                <Metric
                  label="Best 1RM"
                  value={formatWeight(Math.round(stats.bestOneRepMax))}
                  reverse={true}
                />
              </div>
            </div>
          )}
        </section>
      </Card>
    </div>
  );
};

export default ExerciseOverviewPage;
