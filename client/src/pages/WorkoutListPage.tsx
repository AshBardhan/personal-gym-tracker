import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, List, MoreVertical, Search } from "lucide-react";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import {
  getTotalSets,
  getTotalVolume,
  formatDate,
  formatVolume,
  hasWorkoutWeightedVolume,
} from "@/utils/workoutUtils";
import { config } from "@/config/env";
import { Workout } from "@/types/entities";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import Metric from "@/components/ui/Metric";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import ToggleSwitchButton from "@/components/ui/ToggleSwitchButton";
import PageContainer from "@/components/layout/PageContainer";
import DropdownMenu from "@/components/ui/DropdownMenu";

type ViewMode = "grid" | "list";

const SKELETON_TILE_COUNT = 3;

/**
 * Workout List Page Component
 * Displays all workouts for the user with search and grid/list views
 */
const WorkoutListPage = () => {
  const navigate = useNavigate();
  const userId = config.user.DEMO_USER_ID;
  const {
    data: workouts,
    loading,
    error,
    refetch,
  } = useApiQuery<Workout[]>({
    endpoint: `/workouts/${userId}`,
    enabled: !!userId,
  });
  const { execute: deleteWorkout } = useApiMutation<void, void>({
    method: "DELETE",
    endpoint: "/workouts",
  });
  const { execute: cloneWorkout } = useApiMutation<Workout, void>({
    method: "POST",
    endpoint: "/workouts/clone",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const searchQueryTrimmed = searchQuery.trim();
  const isSearching = searchQueryTrimmed.length > 0;

  const workoutList = workouts ?? [];

  const filteredWorkouts = useMemo(() => {
    const query = searchQueryTrimmed.toLowerCase();
    const matched = !query
      ? workoutList
      : workoutList.filter((workout) =>
          (workout.title || "Untitled Workout").toLowerCase().includes(query),
        );

    return [...matched].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [workoutList, searchQueryTrimmed]);

  const workoutGroups = useMemo(() => {
    const groups: { key: string; label: string; items: Workout[] }[] = [];
    const indexByKey = new Map<string, number>();

    for (const workout of filteredWorkouts) {
      const date = new Date(workout.date);
      const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
      let index = indexByKey.get(key);

      if (index === undefined) {
        index = groups.length;
        indexByKey.set(key, index);
        groups.push({
          key,
          label: date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          items: [],
        });
      }

      groups[index].items.push(workout);
    }

    return groups;
  }, [filteredWorkouts]);

  const handleClone = async (id: string) => {
    const cloned = await cloneWorkout(undefined, {
      endpoint: `/workouts/${id}/clone`,
    });
    if (cloned) {
      navigate(`/workouts/${cloned._id}/edit`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      const deleted = await deleteWorkout(undefined, {
        endpoint: `/workouts/${id}`,
      });
      if (deleted !== null) {
        refetch();
      }
    }
  };

  if (error) {
    return (
      <div className="flex flex-1 min-h-0 items-center justify-center">
        <Text variant="p" className="text-red-600 text-lg">
          {error.message}
        </Text>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div className="app-page-header shrink-0 border-b border-gray-300/80 bg-gray-200 dark:border-transparent">
        <PageContainer className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Text variant="h1" className="m-0 shrink-0">
            My Workouts
          </Text>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end lg:flex-1">
            <div className="relative w-full lg:max-w-xs">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300"
              />
              <Input
                type="text"
                placeholder="Search workouts"
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

              <Button variant="primary" size="medium" to="/workouts/new">
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
          ) : workoutList.length === 0 ? (
            <Card className="h-60 flex flex-col items-center justify-center">
              <Text variant="h3" className="mb-2">
                No workouts found.
              </Text>
              <Text
                variant="p"
                className="mb-6 text-gray-500 dark:text-gray-300"
              >
                Start tracking your fitness journey by creating your first
                workout.
              </Text>
              <Button variant="primary" to="/workouts/new" size="large">
                Create Your First Workout
              </Button>
            </Card>
          ) : filteredWorkouts.length === 0 ? (
            <Card className="h-60 flex flex-col items-center justify-center">
              <Text variant="h3" className="mb-2">
                No matching workouts found.
              </Text>
              <Text variant="p" className="text-gray-500 dark:text-gray-300">
                Clear all filters to see all workouts.
              </Text>
            </Card>
          ) : isSearching ? (
            <WorkoutCardList
              workouts={filteredWorkouts}
              viewMode={viewMode}
              onClone={handleClone}
              onDelete={handleDelete}
            />
          ) : (
            <div className="flex flex-col gap-8">
              {workoutGroups.map((group) => (
                <section key={group.key}>
                  <Text variant="h3" className="mb-4">
                    {group.label} ({group.items.length})
                  </Text>
                  <WorkoutCardList
                    workouts={group.items}
                    viewMode={viewMode}
                    onClone={handleClone}
                    onDelete={handleDelete}
                  />
                </section>
              ))}
            </div>
          )}
        </PageContainer>
      </div>
    </div>
  );
};

type WorkoutCardListProps = {
  workouts: Workout[];
  viewMode: ViewMode;
  onClone: (id: string) => void;
  onDelete: (id: string) => void;
};

const WorkoutCardList = ({
  workouts,
  viewMode,
  onClone,
  onDelete,
}: WorkoutCardListProps) => (
  <div
    className={
      viewMode === "grid"
        ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        : "flex flex-col gap-4"
    }
  >
    {workouts.map((workout) =>
      viewMode === "grid" ? (
        <WorkoutGridCard
          key={workout._id}
          workout={workout}
          onClone={onClone}
          onDelete={onDelete}
        />
      ) : (
        <WorkoutListCard
          key={workout._id}
          workout={workout}
          onClone={onClone}
          onDelete={onDelete}
        />
      ),
    )}
  </div>
);

type WorkoutCardProps = {
  workout: Workout;
  onClone: (id: string) => void;
  onDelete: (id: string) => void;
};

const MetricSkeleton = ({ size = "md" }: { size?: "sm" | "md" }) => (
  <div className="flex flex-col gap-1">
    <Skeleton
      height={size === "sm" ? 16 : 18}
      width={size === "sm" ? 36 : 40}
    />
    <Skeleton
      height={size === "sm" ? 12 : 14}
      width={size === "sm" ? 56 : 64}
    />
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

const WorkoutCardMenu = ({ workout, onClone, onDelete }: WorkoutCardProps) => (
  <div
    className="absolute top-2 right-2 z-10"
    onClick={(event) => {
      event.preventDefault();
      event.stopPropagation();
    }}
  >
    <DropdownMenu
      aria-label={`${workout.title || "Untitled Workout"} actions`}
      trigger={<MoreVertical size={18} />}
      items={[
        {
          label: "Clone",
          onClick: () => onClone(workout._id),
        },
        {
          label: "Delete",
          variant: "danger",
          onClick: () => onDelete(workout._id),
        },
      ]}
    />
  </div>
);

const WorkoutGridCard = ({ workout, onClone, onDelete }: WorkoutCardProps) => {
  const showVolume = hasWorkoutWeightedVolume(workout);

  return (
    <Card className="relative" href={`/workouts/${workout._id}`}>
      <div className="mb-4 pr-8">
        <Text variant="h4">{workout.title || "Untitled Workout"}</Text>
        <Text className="text-xs text-gray-500 dark:text-gray-300">
          {formatDate(workout.date)}
        </Text>
      </div>
      <div
        className={
          showVolume ? "grid grid-cols-3 gap-4" : "grid grid-cols-2 gap-4"
        }
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
      <WorkoutCardMenu
        workout={workout}
        onClone={onClone}
        onDelete={onDelete}
      />
    </Card>
  );
};

const WorkoutListCard = ({ workout, onClone, onDelete }: WorkoutCardProps) => {
  const showVolume = hasWorkoutWeightedVolume(workout);

  return (
    <Card
      className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      href={`/workouts/${workout._id}`}
    >
      <div className="pr-8 sm:min-w-0 sm:flex-1">
        <Text variant="h4">{workout.title || "Untitled Workout"}</Text>
        <Text className="text-xs text-gray-500 dark:text-gray-300">
          {formatDate(workout.date)}
        </Text>
      </div>
      <div
        className={
          showVolume
            ? "grid grid-cols-3 gap-4 sm:flex sm:gap-10 sm:shrink-0 sm:pr-8"
            : "grid grid-cols-2 gap-4 sm:flex sm:gap-10 sm:shrink-0 sm:pr-8"
        }
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
      <WorkoutCardMenu
        workout={workout}
        onClone={onClone}
        onDelete={onDelete}
      />
    </Card>
  );
};

export default WorkoutListPage;
