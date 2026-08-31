import { useOutletContext } from "react-router-dom";
import {
  DistributionItem,
  formatVolume,
  getCategoryDistribution,
  getMuscleGroupDistribution,
  getTotalReps,
  getTotalVolume,
} from "@/utils/workoutUtils";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import Metric from "@/components/ui/Metric";
import { WorkoutOutletContext } from "@/pages/workout/WorkoutLayout";

interface DistributionSectionProps {
  title: string;
  emptyMessage: string;
  items: DistributionItem[];
}

const DistributionSection = ({
  title,
  emptyMessage,
  items,
}: DistributionSectionProps) => (
  <section>
    <Text variant="h3" className="mb-4">
      {title}
    </Text>
    {items.length === 0 ? (
      <Text variant="p" className="text-gray-500">
        {emptyMessage}
      </Text>
    ) : (
      <div className="flex flex-col gap-4">
        {items.map(({ label, percent }) => (
          <Metric
            key={label}
            label={label}
            value={`${percent}%`}
            reverse={true}
          />
        ))}
      </div>
    )}
  </section>
);

/**
 * Workout analytics tab — body/muscle shares and session stats.
 */
const WorkoutAnalyticsPage = () => {
  const { workout } = useOutletContext<WorkoutOutletContext>();
  const bodyDistribution = getCategoryDistribution(workout);
  const muscleDistribution = getMuscleGroupDistribution(workout);
  const totalVolume = getTotalVolume(workout);
  const totalReps = getTotalReps(workout);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Text variant="h2" className="m-0">
          Workout Analytics
        </Text>
      </div>

      <Card className="min-h-[16rem]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-10">
          <DistributionSection
            title="Body Distribution"
            emptyMessage="No category data for this workout."
            items={bodyDistribution}
          />

          <DistributionSection
            title="Muscle Distribution"
            emptyMessage="No muscle group data for this workout."
            items={muscleDistribution}
          />

          <section>
            <Text variant="h3" className="mb-4">
              Stats
            </Text>
            <div className="flex flex-col gap-4">
              <Metric
                label="Total Volume"
                value={formatVolume(totalVolume)}
                reverse={true}
              />
              <Metric label="Total Reps" value={totalReps} reverse={true} />
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default WorkoutAnalyticsPage;
