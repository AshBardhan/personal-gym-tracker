import { DistributionItem } from "@/utils/workoutUtils";
import Text from "@/components/ui/Text";
import Metric from "@/components/ui/Metric";
import Tile from "@/components/ui/Tile";

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
    <Text variant="h3" className="mb-2">
      {title}
    </Text>
    {items.length === 0 ? (
      <Tile>
        <Text variant="p" className="text-gray-500 dark:text-gray-300">
          {emptyMessage}
        </Text>
      </Tile>
    ) : (
      <Tile className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map(({ label, percent }) => (
          <Metric
            key={label}
            label={label}
            value={`${percent}%`}
            reverse={true}
          />
        ))}
      </Tile>
    )}
  </section>
);

export default DistributionSection;
