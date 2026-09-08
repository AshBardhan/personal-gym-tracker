import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useWorkoutForm } from "@/stores/workoutFormStore";
import { config } from "@/config/env";
import { Workout, WorkoutWrite } from "@/types/entities";
import PageContainer from "@/components/layout/PageContainer";
import WorkoutFormContent, {
  WorkoutFormSaveData,
} from "@/components/workout/WorkoutFormContent";

/**
 * Create-workout page at `/workouts/new`.
 */
const WorkoutFormPage = () => {
  const navigate = useNavigate();
  const { resetForm } = useWorkoutForm();
  const userId = config.user.DEMO_USER_ID;
  const { execute: createWorkout, error: saveError } = useApiMutation<
    Workout,
    WorkoutWrite
  >({
    method: "POST",
    endpoint: "/workouts",
  });

  const handleCancel = () => {
    resetForm();
    navigate("/workouts");
  };

  const handleSave = async (data: WorkoutFormSaveData): Promise<boolean> => {
    const created = await createWorkout({ userId, ...data });
    if (created) {
      navigate("/workouts");
      return true;
    }
    return false;
  };

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return (
    <div className="min-h-0 w-full flex-1 overflow-y-auto">
      <PageContainer className="py-4 sm:py-6">
        <WorkoutFormContent
          title="New Workout"
          onCancel={handleCancel}
          onSave={handleSave}
          saveError={saveError}
        />
      </PageContainer>
    </div>
  );
};

export default WorkoutFormPage;
