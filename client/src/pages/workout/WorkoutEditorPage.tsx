import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useWorkoutForm } from "@/stores/workoutFormStore";
import { config } from "@/config/env";
import { Workout, WorkoutWrite } from "@/types/entities";
import WorkoutFormContent, {
  WorkoutFormSaveData,
} from "@/components/workout/WorkoutFormContent";
import { WorkoutOutletContext } from "@/pages/workout/WorkoutLayout";

/**
 * Workout editor tab — edit title, date, exercises, and sets.
 */
const WorkoutEditorPage = () => {
  const navigate = useNavigate();
  const { workout, workoutId, refetchWorkout } =
    useOutletContext<WorkoutOutletContext>();
  const { loadWorkoutData, resetForm } = useWorkoutForm();
  const userId = config.user.DEMO_USER_ID;
  const { execute: updateWorkout, error: saveError } = useApiMutation<
    Workout,
    Partial<WorkoutWrite>
  >({
    method: "PUT",
    endpoint: `/workouts/${workoutId}`,
  });

  const handleCancel = () => {
    resetForm();
    navigate(`/workouts/${workoutId}`);
  };

  const handleSave = async (data: WorkoutFormSaveData): Promise<boolean> => {
    const updated = await updateWorkout({ userId, ...data });
    if (updated) {
      await refetchWorkout();
      navigate(`/workouts/${workoutId}`);
      return true;
    }
    return false;
  };

  useEffect(() => {
    loadWorkoutData({
      title: workout.title || "",
      date: new Date(workout.date).toISOString().split("T")[0],
      exercises: workout.exercises,
    });
  }, [workout, loadWorkoutData]);

  return (
    <WorkoutFormContent
      title="Workout Editor"
      onCancel={handleCancel}
      onSave={handleSave}
      saveError={saveError}
    />
  );
};

export default WorkoutEditorPage;
