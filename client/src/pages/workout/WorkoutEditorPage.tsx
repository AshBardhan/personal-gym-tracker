import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { workoutService } from "@/services/workouts.service";
import { useWorkoutForm } from "@/stores/workoutFormStore";
import { config } from "@/config/env";
import WorkoutFormContent, {
  WorkoutFormSaveData,
} from "@/components/workout/WorkoutFormContent";
import { WorkoutOutletContext } from "@/pages/workout/WorkoutLayout";

/**
 * Workout editor tab — edit title, date, exercises, and sets.
 */
const WorkoutEditorPage = () => {
  const navigate = useNavigate();
  const { workout, workoutId } = useOutletContext<WorkoutOutletContext>();
  const { loadWorkoutData, resetForm } = useWorkoutForm();
  const userId = config.user.DEMO_USER_ID;

  const handleCancel = () => {
    resetForm();
    navigate(`/workouts/${workoutId}`);
  };

  const handleSave = async (data: WorkoutFormSaveData) => {
    await workoutService.update(workoutId, { userId, ...data });
    navigate(`/workouts/${workoutId}`);
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
    />
  );
};

export default WorkoutEditorPage;
