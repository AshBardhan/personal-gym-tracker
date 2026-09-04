import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import WorkoutFormHeader from "@/components/workout/WorkoutFormHeader";
import ExerciseFormContent, {
  isExerciseFormValid,
} from "@/components/exercise/ExerciseFormContent";
import { config } from "@/config/env";
import { exerciseService } from "@/services/exercises.service";
import {
  buildExerciseWritePayload,
  createEmptyExerciseFormData,
} from "@/utils/exerciseUtils";

/**
 * Create-exercise page at `/exercise/new`.
 */
const ExerciseFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(createEmptyExerciseFormData);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleCancel = () => {
    navigate("/exercises");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isExerciseFormValid(formData)) {
      return;
    }

    try {
      await exerciseService.create(
        buildExerciseWritePayload(formData, {
          userId: config.user.DEMO_USER_ID,
        }),
      );
      navigate("/exercises");
    } catch (error) {
      console.error("Error creating exercise:", error);
    }
  };

  return (
    <div className="min-h-0 w-full flex-1 overflow-y-auto">
      <PageContainer className="py-4 sm:py-6">
        <ExerciseFormContent
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          submitAttempted={submitAttempted}
          header={
            <WorkoutFormHeader title="New Exercise" onCancel={handleCancel} />
          }
        />
      </PageContainer>
    </div>
  );
};

export default ExerciseFormPage;
