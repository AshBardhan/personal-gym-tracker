import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ExerciseFormContent, {
  ExerciseFormData,
  isExerciseFormValid,
} from "@/components/exercise/ExerciseFormContent";
import {
  buildExerciseWritePayload,
  getExerciseFormData,
} from "@/utils/exerciseUtils";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Exercise } from "@/types/entities";
import { ExerciseOutletContext } from "@/pages/exercise/ExerciseLayout";

/**
 * Exercise editor tab — edit name, category, and target muscles.
 */
const ExerciseEditorPage = () => {
  const navigate = useNavigate();
  const { exercise, exerciseId, refetchExercise } =
    useOutletContext<ExerciseOutletContext>();
  const [formData, setFormData] = useState<ExerciseFormData>(() =>
    getExerciseFormData(exercise),
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const { execute: updateExercise } = useApiMutation<
    Exercise,
    ReturnType<typeof buildExerciseWritePayload>
  >({
    method: "PUT",
    endpoint: `/exercises/${exerciseId}`,
  });

  useEffect(() => {
    setFormData(getExerciseFormData(exercise));
  }, [exercise]);

  const handleCancel = () => {
    navigate(`/exercises/${exerciseId}`);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isExerciseFormValid(formData)) {
      return;
    }

    const updated = await updateExercise(
      buildExerciseWritePayload(formData, {
        userId: exercise.userId,
        isCustom: exercise.isCustom,
      }),
    );
    if (updated) {
      await refetchExercise();
      navigate(`/exercises/${exerciseId}`);
    }
  };

  return (
    <ExerciseFormContent
      title="Exercise Editor"
      formData={formData}
      onChange={setFormData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitAttempted={submitAttempted}
    />
  );
};

export default ExerciseEditorPage;
