import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import ExerciseFormContent, {
  isExerciseFormValid,
} from "@/components/exercise/ExerciseFormContent";
import { config } from "@/config/env";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Exercise } from "@/types/entities";
import {
  buildExerciseWritePayload,
  createEmptyExerciseFormData,
} from "@/utils/exerciseUtils";

/**
 * Create-exercise page at `/exercises/new`.
 */
const ExerciseFormPage = () => {
  const navigate = useNavigate();
  const { execute: createExercise } = useApiMutation<
    Exercise,
    ReturnType<typeof buildExerciseWritePayload>
  >({
    method: "POST",
    endpoint: "/exercises",
  });
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

    const created = await createExercise(
      buildExerciseWritePayload(formData, {
        userId: config.user.DEMO_USER_ID,
      }),
    );
    if (created) {
      navigate("/exercises");
    }
  };

  return (
    <div className="min-h-0 w-full flex-1 overflow-y-auto">
      <PageContainer className="py-4 sm:py-6">
        <ExerciseFormContent
          title="New Exercise"
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitAttempted={submitAttempted}
        />
      </PageContainer>
    </div>
  );
};

export default ExerciseFormPage;
