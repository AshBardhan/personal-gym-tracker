import { useMemo } from "react";
import { Workout } from "@/types/entities";
import {
  formatDate,
  formatVolume,
  getTotalSets,
  getTotalVolume,
  hasWorkoutWeightedVolume,
} from "@/utils/workoutUtils";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import Metric from "@/components/ui/Metric";
import Skeleton from "@/components/ui/Skeleton";
import clsx from "clsx";

export const RECENT_WORKOUT_LIMIT = 5;

const SKELETON_CARD_COUNT = 3;

export const getRecentWorkouts = (
  workouts: Workout[],
  limit = RECENT_WORKOUT_LIMIT,
): Workout[] =>
  [...workouts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

interface RecentWorkoutsSectionProps {
  workouts: Workout[];
  loading?: boolean;
}

const MetricSkeleton = () => (
  <div className="flex flex-col gap-1">
    <Skeleton height={16} width={36} />
    <Skeleton height={12} width={56} />
  </div>
);

const WorkoutSummaryCardSkeleton = () => (
  <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="sm:min-w-0 sm:flex-1 space-y-2">
      <Skeleton height={24} width="40%" />
      <Skeleton height={12} width="25%" />
    </div>
    <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-8 sm:shrink-0">
      <MetricSkeleton />
      <MetricSkeleton />
      <MetricSkeleton />
    </div>
  </Card>
);

interface WorkoutSummaryCardProps {
  workout: Workout;
}

const WorkoutSummaryCard = ({ workout }: WorkoutSummaryCardProps) => {
  const showVolume = hasWorkoutWeightedVolume(workout);

  return (
    <Card
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      href={`/workouts/${workout._id}`}
    >
      <div className="sm:min-w-0 sm:flex-1">
        <Text variant="h4">{workout.title || "Untitled Workout"}</Text>
        <Text className="text-xs text-gray-500 dark:text-gray-300">
          {formatDate(workout.date)}
        </Text>
      </div>
      <div
        className={clsx(
          "grid grid-cols-2 gap-4 sm:flex sm:gap-10 sm:shrink-0",
          hasWorkoutWeightedVolume(workout) ? "grid-cols-3" : "grid-cols-2",
        )}
      >
        <Metric
          label="Exercises"
          value={workout.exercises.length}
          reverse={true}
        />
        <Metric label="Sets" value={getTotalSets(workout)} reverse={true} />
        {showVolume && (
          <Metric
            label="Volume"
            value={formatVolume(getTotalVolume(workout))}
            reverse={true}
          />
        )}
      </div>
    </Card>
  );
};

/**
 * Dashboard preview of the user's latest workout sessions.
 */
const RecentWorkoutsSection = ({
  workouts,
  loading = false,
}: RecentWorkoutsSectionProps) => {
  const recentWorkouts = useMemo(() => getRecentWorkouts(workouts), [workouts]);

  return (
    <section>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Text variant="h3" className="m-0">
          Recent Workouts
        </Text>
        {!loading && recentWorkouts.length > 0 && (
          <Button to="/workouts" className="hidden lg:block">
            View All Workouts
          </Button>
        )}
      </div>

      {loading ? (
        <div
          className="flex flex-col gap-4"
          aria-busy="true"
          aria-label="Loading recent workouts"
        >
          {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
            <WorkoutSummaryCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {recentWorkouts.map((workout) => (
            <WorkoutSummaryCard key={workout._id} workout={workout} />
          ))}
          {!loading && recentWorkouts.length > 0 && (
            <Button to="/workouts" className="lg:hidden">
              View All Workouts
            </Button>
          )}
        </div>
      )}
    </section>
  );
};

export default RecentWorkoutsSection;
