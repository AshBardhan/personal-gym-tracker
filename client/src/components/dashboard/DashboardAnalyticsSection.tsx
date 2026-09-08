import { useMemo, useState } from "react";
import { Workout } from "@/types/entities";
import {
  DashboardPeriod,
  filterWorkoutsByPeriod,
  getPeriodLabel,
} from "@/utils/periodUtils";
import {
  formatVolume,
  getCategoryDistributionFromWorkouts,
  getEquipmentDistributionFromWorkouts,
  getMuscleGroupDistributionFromWorkouts,
} from "@/utils/workoutUtils";
import DistributionSection from "@/components/analytics/DistributionSection";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import ToggleSwitchButton from "@/components/ui/ToggleSwitchButton";
import { getDashboardStats } from "@/utils/dashboardStatsUtils";
import Metric from "@/components/ui/Metric";
import Tile from "@/components/ui/Tile";
import clsx from "clsx";

interface DashboardAnalyticsSectionProps {
  workouts: Workout[];
  loading?: boolean;
}

const AnalyticsSkeleton = () => (
  <Card className="grid grid-cols-1 gap-6 md:grid-cols-2">
    {Array.from({ length: 3 }, (_, index) => (
      <div key={index} className="flex flex-col gap-2">
        <Skeleton height={20} width="40%" />
        <Skeleton height={96} />
      </div>
    ))}
  </Card>
);

/**
 * Period-filtered muscle, category, and variant distribution for the dashboard.
 */
const DashboardAnalyticsSection = ({
  workouts,
  loading = false,
}: DashboardAnalyticsSectionProps) => {
  const [currentPeriod, setCurrentPeriod] = useState<DashboardPeriod>("month");

  const filteredWorkouts = useMemo(
    () => filterWorkoutsByPeriod(workouts, currentPeriod),
    [workouts, currentPeriod],
  );

  const categoryDistribution = useMemo(
    () => getCategoryDistributionFromWorkouts(filteredWorkouts),
    [filteredWorkouts],
  );

  const muscleDistribution = useMemo(
    () => getMuscleGroupDistributionFromWorkouts(filteredWorkouts),
    [filteredWorkouts],
  );

  const equipmentDistribution = useMemo(
    () => getEquipmentDistributionFromWorkouts(filteredWorkouts),
    [filteredWorkouts],
  );

  const stats = useMemo(
    () => getDashboardStats(filteredWorkouts),
    [filteredWorkouts],
  );

  const periodLabel = getPeriodLabel(currentPeriod);

  return (
    <section aria-labelledby="dashboard-analytics-heading">
      <div className="mb-3 flex gap-3 items-center justify-between">
        <Text variant="h3">Analytics</Text>
        <ToggleSwitchButton
          aria-label="Dashboard period"
          size="small"
          value={currentPeriod}
          onChange={(value) => setCurrentPeriod(value as DashboardPeriod)}
          options={[
            { value: "week", label: "This week" },
            { value: "month", label: "This month" },
          ]}
        />
      </div>
      {loading ? (
        <AnalyticsSkeleton />
      ) : (
        <Card>
          {filteredWorkouts.length === 0 ? (
            <Text variant="p" className="m-0 text-gray-500 dark:text-gray-300">
              No workouts {periodLabel}.
            </Text>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <section>
                <Text variant="h3" className="mb-2">
                  Stats
                </Text>
                <Tile
                  className={clsx(
                    "grid grid-cols-2 gap-6 sm:grid-cols-3",
                    stats.hasWeightedVolume && "sm:grid-cols-4",
                  )}
                >
                  <Metric
                    label={`Session${stats.sessions === 1 ? "" : "s"}`}
                    value={stats.sessions}
                    reverse={true}
                  />
                  <Metric
                    label={`Exercise${stats.uniqueExercises === 1 ? "" : "s"}`}
                    value={stats.uniqueExercises}
                    reverse={true}
                  />
                  <Metric
                    label={`Set${stats.totalSets === 1 ? "" : "s"}`}
                    value={stats.totalSets}
                    reverse={true}
                  />
                  {stats.hasWeightedVolume && (
                    <Metric
                      label="Volume"
                      value={formatVolume(stats.totalVolume)}
                      reverse={true}
                    />
                  )}
                </Tile>
              </section>
              <DistributionSection
                title="Category Distribution"
                emptyMessage="No category data for this period."
                items={categoryDistribution}
              />
              <DistributionSection
                title="Muscle Distribution"
                emptyMessage="No muscle group data for this period."
                items={muscleDistribution}
              />
              <DistributionSection
                title="Equipment Distribution"
                emptyMessage="No equipment data for this period."
                items={equipmentDistribution}
              />
            </div>
          )}
        </Card>
      )}
    </section>
  );
};

export default DashboardAnalyticsSection;
