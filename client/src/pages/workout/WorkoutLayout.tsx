import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import clsx from "clsx";
import { useWorkout } from "@/hooks/useWorkout";
import { useWorkoutMutation } from "@/hooks/useWorkoutMutation";
import { Workout } from "@/types/workout";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import PageContainer from "@/components/layout/PageContainer";
import DropdownMenu from "@/components/ui/DropdownMenu";

export interface WorkoutOutletContext {
  workout: Workout;
  workoutId: string;
  refetchWorkout: () => Promise<void>;
}

/**
 * Shared shell for workout detail tabs: sticky header + tab nav + scroll body.
 * Tabs: Summary (overview), Editor, Analytics.
 */
const WorkoutLayout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workout, loading, error, refetch } = useWorkout(id);
  const { deleteWorkout } = useWorkoutMutation();

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this workout?")) {
      return;
    }
    const success = await deleteWorkout(id);
    if (success) {
      navigate("/workouts");
    }
  };

  if (loading && !workout) {
    return (
      <div className="flex flex-1 min-h-0 items-center justify-center">
        <Text variant="p" className="text-lg text-gray-600 dark:text-gray-300">
          Loading workout...
        </Text>
      </div>
    );
  }

  if (error || !workout || !id) {
    return (
      <div className="flex flex-1 min-h-0 flex-col items-center justify-center gap-6">
        <Text variant="p" className="text-red-600 text-lg">
          {error || "Workout not found"}
        </Text>
        <Button variant="primary" to="/workouts">
          ← Back to workouts
        </Button>
      </div>
    );
  }

  const tabs = [
    { to: `/workouts/${id}`, label: "Summary", end: true },
    { to: `/workouts/${id}/edit`, label: "Editor", end: false },
    { to: `/workouts/${id}/analytics`, label: "Analytics", end: false },
  ];

  const outletContext: WorkoutOutletContext = {
    workout,
    workoutId: id,
    refetchWorkout: refetch,
  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <header className="app-page-header shrink-0 border-b border-gray-300/80 bg-gray-200 dark:border-transparent">
        <PageContainer className="pt-4">
          <div className="flex items-center justify-between gap-4 pb-3">
            <Text variant="h1" className="m-0 truncate">
              {workout.title || "Untitled Workout"}
            </Text>

            <DropdownMenu
              aria-label="Workout actions"
              trigger={<MoreVertical size={22} />}
              items={[
                {
                  label: "Delete",
                  variant: "danger",
                  onClick: handleDelete,
                },
              ]}
            />
          </div>

          <nav
            className="flex gap-4 overflow-x-auto"
            aria-label="Workout sections"
          >
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  clsx(
                    "shrink-0 border-b-4 py-2 text-sm font-medium no-underline transition-colors",
                    isActive
                      ? "border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300"
                      : "border-transparent text-gray-600 hover:border-gray-400 hover:text-gray-900 dark:text-gray-300 dark:hover:border-white dark:hover:text-white",
                  )
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </PageContainer>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageContainer className="py-4 sm:py-6">
          <Outlet context={outletContext} />
        </PageContainer>
      </div>
    </div>
  );
};

export default WorkoutLayout;
