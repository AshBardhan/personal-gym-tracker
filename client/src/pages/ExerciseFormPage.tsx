import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import WorkoutFormHeader from "@/components/workout/WorkoutFormHeader";
import ExerciseFormContent, {
  ExerciseFormValues,
  isExerciseFormValid,
} from "@/components/exercise/ExerciseFormContent";

const emptyForm: ExerciseFormValues = {
  name: "",
  category: "",
  primaryMuscle: "",
  secondaryMuscles: [],
};

/**
 * Create-exercise page at `/exercise/new`.
 * Persistence is deferred until the backend service exists.
 */
const ExerciseFormPage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<ExerciseFormValues>(emptyForm);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleCancel = () => {
    navigate("/exercises");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isExerciseFormValid(values)) {
      return;
    }

    navigate("/exercises");
  };

  return (
    <div className="min-h-0 w-full flex-1 overflow-y-auto">
      <PageContainer className="py-4 sm:py-6">
        <ExerciseFormContent
          values={values}
          onChange={setValues}
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
