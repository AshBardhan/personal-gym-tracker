import { FormEvent, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { workoutService } from "../../services/workouts.service";
import { useWorkoutForm } from "../../stores/workoutFormStore";
import { config } from "../../config/env";
import WorkoutFormContent from "../../components/workout/WorkoutFormContent";
import WorkoutFormHeader from "../../components/workout/WorkoutFormHeader";
import { WorkoutOutletContext } from "./WorkoutLayout";

/**
 * Workout editor tab — edit title, date, exercises, and sets.
 */
const WorkoutEditorPage = () => {
  const navigate = useNavigate();
  const { workout, workoutId, refetchWorkout } =
    useOutletContext<WorkoutOutletContext>();
  const {
    setSubmitAttempted,
    getValidExercises,
    hasValidExercises,
    resetForm,
    loadWorkoutData,
    formData,
  } = useWorkoutForm();

  const userId = config.user.DEMO_USER_ID;

  useEffect(() => {
    loadWorkoutData({
      title: workout.title || "",
      date: new Date(workout.date).toISOString().split("T")[0],
      exercises: workout.exercises,
    });
  }, [workout, loadWorkoutData]);

  const handleCancel = () => {
    resetForm();
    navigate(`/workouts/${workoutId}`);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!hasValidExercises()) {
      return;
    }

    try {
      await workoutService.update(workoutId, {
        userId,
        title: formData.title || undefined,
        date: formData.date,
        exercises: getValidExercises(),
      });
      await refetchWorkout();
      resetForm();
      navigate(`/workouts/${workoutId}`);
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  return (
    <WorkoutFormContent
      onSubmit={handleSubmit}
      header={
        <WorkoutFormHeader title="Workout Editor" onCancel={handleCancel} />
      }
    />
  );
};

export default WorkoutEditorPage;
