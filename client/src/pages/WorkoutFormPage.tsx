import { FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { workoutService } from "../services/workouts.service";
import { useWorkoutForm } from "../stores/workoutFormStore";
import { config } from "../config/env";
import PageContainer from "../components/layout/PageContainer";
import WorkoutFormContent from "../components/workout/WorkoutFormContent";
import WorkoutFormHeader from "../components/workout/WorkoutFormHeader";

/**
 * Create-workout page at `/workouts/new`.
 */
const WorkoutFormPage = () => {
  const navigate = useNavigate();
  const {
    formData,
    setSubmitAttempted,
    getValidExercises,
    hasValidExercises,
    resetForm,
  } = useWorkoutForm();

  const userId = config.user.DEMO_USER_ID;

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const handleCancel = () => {
    resetForm();
    navigate("/workouts");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!hasValidExercises()) {
      return;
    }

    try {
      await workoutService.create({
        userId,
        title: formData.title || undefined,
        date: formData.date,
        exercises: getValidExercises(),
      });
      resetForm();
      navigate("/workouts");
    } catch (error) {
      console.error("Error creating workout:", error);
    }
  };

  return (
    <div className="min-h-0 w-full flex-1 overflow-y-auto">
      <PageContainer className="py-4 sm:py-6">
        <WorkoutFormContent
          onSubmit={handleSubmit}
          header={
            <WorkoutFormHeader title="New Workout" onCancel={handleCancel} />
          }
        />
      </PageContainer>
    </div>
  );
};

export default WorkoutFormPage;
