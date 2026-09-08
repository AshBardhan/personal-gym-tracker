import { useApiQuery } from "@/hooks/useApiQuery";
import { config } from "@/config/env";
import { Workout } from "@/types/entities";
import RecentWorkoutsSection from "@/components/dashboard/RecentWorkoutsSection";
import DashboardAnalyticsSection from "@/components/dashboard/DashboardAnalyticsSection";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import PageContainer from "@/components/layout/PageContainer";

/**
 * Home dashboard — workout summary, stats, and analytics.
 */
const DashboardPage = () => {
  const userId = config.user.DEMO_USER_ID;
  const {
    data: workouts,
    loading,
    error,
  } = useApiQuery<Workout[]>({
    endpoint: `/workouts/${userId}`,
    enabled: !!userId,
  });

  const workoutList = workouts ?? [];
  const hasWorkouts = workoutList.length > 0;

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div className="app-page-header shrink-0 border-b border-gray-300/80 bg-gray-200 dark:border-transparent">
        <PageContainer className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Text variant="h1" className="m-0 shrink-0">
            Dashboard
          </Text>
          <Button variant="primary" size="medium" to="/workouts/new">
            New Workout
          </Button>
        </PageContainer>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageContainer className="py-4 sm:py-6">
          {error ? (
            <Card className="flex h-60 flex-col items-center justify-center">
              <Text variant="h3" className="mb-2">
                Could not load dashboard
              </Text>
              <Text variant="p" className="text-red-600 dark:text-red-400">
                {error.message}
              </Text>
            </Card>
          ) : !loading && !hasWorkouts ? (
            <Card className="flex h-60 flex-col items-center justify-center">
              <Text variant="h3" className="mb-2">
                No workouts yet
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
          ) : (
            <div className="flex flex-col gap-8">
              <RecentWorkoutsSection workouts={workoutList} loading={loading} />
              <DashboardAnalyticsSection
                workouts={workoutList}
                loading={loading}
              />
            </div>
          )}
        </PageContainer>
      </div>
    </div>
  );
};

export default DashboardPage;
