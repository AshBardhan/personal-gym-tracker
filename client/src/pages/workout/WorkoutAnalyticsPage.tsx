import { useOutletContext } from "react-router-dom";
import {
  formatVolume,
  getCategoryDistribution,
  getEquipmentDistribution,
  getMuscleGroupDistribution,
  getTotalReps,
  getTotalSets,
  getTotalVolume,
  hasWorkoutWeightedVolume,
} from "@/utils/workoutUtils";
import DistributionSection from "@/components/analytics/DistributionSection";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import Metric from "@/components/ui/Metric";
import Tile from "@/components/ui/Tile";
import { WorkoutOutletContext } from "@/pages/workout/WorkoutLayout";

/**
 * Workout analytics tab — category, muscle, and equipment shares plus session stats.
 */
const WorkoutAnalyticsPage = () => {
  const { workout } = useOutletContext<WorkoutOutletContext>();
  const categoryDistribution = getCategoryDistribution(workout);
  const muscleDistribution = getMuscleGroupDistribution(workout);
  const equipmentDistribution = getEquipmentDistribution(workout);
  const totalVolume = getTotalVolume(workout);
  const totalReps = getTotalReps(workout);
  const totalSets = getTotalSets(workout);
  const showVolume = hasWorkoutWeightedVolume(workout);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Text variant="h2" className="m-0">
          Workout Analytics
        </Text>
      </div>

      <Card className="min-h-[16rem]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section>
            <Text variant="h3" className="mb-2">
              Stats
            </Text>
            <Tile className="grid grid-cols-3 gap-4">
              <Metric label="Sets" value={totalSets} reverse={true} />
              <Metric label="Reps" value={totalReps} reverse={true} />
              {showVolume && (
                <Metric
                  label="Volume"
                  value={formatVolume(totalVolume)}
                  reverse={true}
                />
              )}
            </Tile>
          </section>

          <DistributionSection
            title="Category Distribution"
            emptyMessage="No category data for this workout."
            items={categoryDistribution}
          />

          <DistributionSection
            title="Muscle Distribution"
            emptyMessage="No muscle group data for this workout."
            items={muscleDistribution}
          />

          <DistributionSection
            title="Equipment Distribution"
            emptyMessage="No equipment data for this workout."
            items={equipmentDistribution}
          />
        </div>
      </Card>
    </div>
  );
};

export default WorkoutAnalyticsPage;
