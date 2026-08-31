import { useMemo, useState } from "react";
import { LayoutGrid, List, Search, Trash2 } from "lucide-react";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useWorkoutMutation } from "@/hooks/useWorkoutMutation";
import {
  getTotalSets,
  getTotalVolume,
  formatDate,
  formatVolume,
} from "@/utils/workoutUtils";
import { config } from "@/config/env";
import { Workout } from "@/types/workout";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import Metric from "@/components/ui/Metric";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import ToggleSwitchButton from "@/components/ui/ToggleSwitchButton";
import PageContainer from "@/components/layout/PageContainer";

type ViewMode = "grid" | "list";

const SKELETON_TILE_COUNT = 3;

/**
 * Workout List Page Component
 * Displays all workouts for the user with search and grid/list views
 */
const WorkoutListPage = () => {
  const { workouts, loading, error, refetch } = useWorkouts(
    config.user.DEMO_USER_ID,
  );
  const { deleteWorkout } = useWorkoutMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredWorkouts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return workouts;

    return workouts.filter((workout) =>
      (workout.title || "Untitled Workout").toLowerCase().includes(query),
    );
  }, [workouts, searchQuery]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this workout?")) {
      const success = await deleteWorkout(id);
      if (success) {
        refetch();
      }
    }
  };

  if (error) {
    return (
      <div className="flex flex-1 min-h-0 items-center justify-center">
        <Text variant="p" className="text-red-600 text-lg">
          {error}
        </Text>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-gray-300/80 bg-gray-200">
        <PageContainer className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Text variant="h1" className="m-0 shrink-0">
            My Workouts
          </Text>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end lg:flex-1">
            <div className="relative w-full lg:max-w-xs">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                type="text"
                placeholder="Search workouts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                inputSize="small"
                className="pl-9"
                aria-label="Search workouts by name"
                disabled={loading}
              />
            </div>

            <div className="flex w-full items-center justify-between lg:w-auto lg:justify-start lg:gap-3">
              <ToggleSwitchButton
                aria-label="Workout view mode"
                value={viewMode}
                onChange={(mode) => setViewMode(mode as ViewMode)}
                options={[
                  {
                    value: "grid",
                    icon: <LayoutGrid size={16} />,
                    ariaLabel: "Grid view",
                  },
                  {
                    value: "list",
                    icon: <List size={16} />,
                    ariaLabel: "List view",
                  },
                ]}
              />

              <Button
                variant="primary"
                size="medium"
                to="/workouts/new"
              >
                New Workout
              </Button>
            </div>
          </div>
        </PageContainer>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageContainer className="py-4 sm:py-6">
          {loading ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col gap-4"
              }
              aria-busy="true"
              aria-label="Loading workouts"
            >
              {Array.from({ length: SKELETON_TILE_COUNT }, (_, index) =>
                viewMode === "grid" ? (
                  <WorkoutGridSkeleton key={index} />
                ) : (
                  <WorkoutListSkeleton key={index} />
                ),
              )}
            </div>
          ) : workouts.length === 0 ? (
            <div className="rounded-lg bg-white py-12 text-center shadow-md">
              <Text variant="p" className="mb-6 text-lg text-gray-500">
                No workouts found. Start tracking your fitness journey!
              </Text>
              <Button
                variant="primary"
                to="/workouts/new"
                size="large"
              >
                Create Your First Workout
              </Button>
            </div>
          ) : filteredWorkouts.length === 0 ? (
            <div className="rounded-lg bg-white py-12 text-center shadow-md">
              <Text variant="p" className="text-lg text-gray-500">
                No workouts match &ldquo;{searchQuery.trim()}&rdquo;
              </Text>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col gap-4"
              }
            >
              {filteredWorkouts.map((workout) =>
                viewMode === "grid" ? (
                  <WorkoutGridCard
                    key={workout._id}
                    workout={workout}
                    onDelete={handleDelete}
                  />
                ) : (
                  <WorkoutListCard
                    key={workout._id}
                    workout={workout}
                    onDelete={handleDelete}
                  />
                ),
              )}
            </div>
          )}
        </PageContainer>
      </div>
    </div>
  );
};

type WorkoutCardProps = {
  workout: Workout;
  onDelete: (e: React.MouseEvent, id: string) => void;
};

const MetricSkeleton = ({ size = "md" }: { size?: "sm" | "md" }) => (
  <div className="flex flex-col gap-1">
    <Skeleton
      height={size === "sm" ? 16 : 18}
      width={size === "sm" ? 36 : 40}
    />
    <Skeleton height={size === "sm" ? 12 : 14} width={size === "sm" ? 56 : 64} />
  </div>
);

const WorkoutGridSkeleton = () => (
  <Card className="relative">
    <div className="mb-4 pr-8 space-y-2">
      <Skeleton height={24} width="70%" />
      <Skeleton height={12} width="45%" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      <MetricSkeleton />
      <MetricSkeleton />
      <MetricSkeleton />
    </div>
    <div className="absolute top-2 right-2">
      <Skeleton variant="circular" width={20} height={20} />
    </div>
  </Card>
);

const WorkoutListSkeleton = () => (
  <Card className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="pr-8 sm:min-w-0 sm:flex-1 space-y-2">
      <Skeleton height={24} width="40%" />
      <Skeleton height={12} width="25%" />
    </div>
    <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-8 sm:shrink-0 sm:pr-8">
      <MetricSkeleton size="sm" />
      <MetricSkeleton size="sm" />
      <MetricSkeleton size="sm" />
    </div>
    <div className="absolute top-2 right-2">
      <Skeleton variant="circular" width={20} height={20} />
    </div>
  </Card>
);

const WorkoutGridCard = ({ workout, onDelete }: WorkoutCardProps) => (
  <Card className="relative" href={`/workouts/${workout._id}`}>
    <div className="mb-4 pr-8">
      <Text variant="h3" className="mb-1">
        {workout.title || "Untitled Workout"}
      </Text>
      <Text className="text-gray-500 text-xs">{formatDate(workout.date)}</Text>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <Metric
        label="exercises"
        value={workout.exercises.length}
        reverse={true}
      />
      <Metric label="sets" value={getTotalSets(workout)} reverse={true} />
      <Metric
        label="volume"
        value={formatVolume(getTotalVolume(workout))}
        reverse={true}
      />
    </div>
    <div className="absolute top-2 right-2">
      <Button
        title="Delete Workout"
        onClick={(e: React.MouseEvent) => onDelete(e, workout._id)}
        variant="icon-only"
        className="!text-red-600 hover:!text-red-700"
      >
        <Trash2 size={20} />
      </Button>
    </div>
  </Card>
);

const WorkoutListCard = ({ workout, onDelete }: WorkoutCardProps) => (
  <Card
    className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    href={`/workouts/${workout._id}`}
  >
    <div className="pr-8 sm:min-w-0 sm:flex-1">
      <Text variant="h3" className="mb-1">
        {workout.title || "Untitled Workout"}
      </Text>
      <Text className="text-gray-500 text-xs">{formatDate(workout.date)}</Text>
    </div>
    <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-8 sm:shrink-0 sm:pr-8">
      <Metric
        label="exercises"
        value={workout.exercises.length}
        reverse={true}
        size="sm"
      />
      <Metric
        label="sets"
        value={getTotalSets(workout)}
        reverse={true}
        size="sm"
      />
      <Metric
        label="volume"
        value={formatVolume(getTotalVolume(workout))}
        reverse={true}
        size="sm"
      />
    </div>
    <div className="absolute top-2 right-2">
      <Button
        title="Delete Workout"
        onClick={(e: React.MouseEvent) => onDelete(e, workout._id)}
        variant="icon-only"
        className="!text-red-600 hover:!text-red-700"
      >
        <Trash2 size={20} />
      </Button>
    </div>
  </Card>
);

export default WorkoutListPage;
