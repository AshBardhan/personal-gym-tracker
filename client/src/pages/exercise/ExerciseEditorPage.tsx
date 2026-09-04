import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import WorkoutFormHeader from "@/components/workout/WorkoutFormHeader";
import ExerciseFormContent, {
  ExerciseFormValues,
  isExerciseFormValid,
} from "@/components/exercise/ExerciseFormContent";
import { exerciseToFormValues } from "@/utils/exerciseUtils";
import { ExerciseOutletContext } from "@/pages/exercise/ExerciseLayout";

/**
 * Exercise editor tab — edit name, category, and target muscles.
 * Persistence is deferred until the backend service exists.
 */
const ExerciseEditorPage = () => {
  const navigate = useNavigate();
  const { exercise, exerciseId } = useOutletContext<ExerciseOutletContext>();
  const [values, setValues] = useState<ExerciseFormValues>(() =>
    exerciseToFormValues(exercise),
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    setValues(exerciseToFormValues(exercise));
  }, [exercise]);

  const handleCancel = () => {
    navigate(`/exercises/${exerciseId}`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isExerciseFormValid(values)) {
      return;
    }

    navigate(`/exercises/${exerciseId}`);
  };

  return (
    <ExerciseFormContent
      values={values}
      onChange={setValues}
      onSubmit={handleSubmit}
      submitAttempted={submitAttempted}
      header={
        <WorkoutFormHeader title="Exercise Editor" onCancel={handleCancel} />
      }
    />
  );
};

export default ExerciseEditorPage;
