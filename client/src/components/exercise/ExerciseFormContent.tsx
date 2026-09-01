import { FormEvent, ReactNode, useMemo } from "react";
import { EXERCISE_CATEGORIES, TARGET_MUSCLES } from "@/constants/exercises";
import Input from "@/components/ui/Input";
import SelectBox from "@/components/ui/SelectBox";
import MultiSelect from "@/components/ui/MultiSelect";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export type ExerciseFormValues = {
  name: string;
  category: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
};

interface ExerciseFormContentProps {
  values: ExerciseFormValues;
  onChange: (values: ExerciseFormValues) => void;
  onSubmit: (e: FormEvent) => void;
  header?: ReactNode;
  submitAttempted?: boolean;
}

export const isExerciseFormValid = (values: ExerciseFormValues) =>
  values.name.trim().length > 0 &&
  values.category.trim().length > 0 &&
  values.primaryMuscle.trim().length > 0;

const categoryOptions = Object.values(EXERCISE_CATEGORIES).map((category) => ({
  value: category,
  label: category,
}));

const muscleOptions = TARGET_MUSCLES.map((muscle) => ({
  value: muscle,
  label: muscle,
}));

const ExerciseFormContent = ({
  values,
  onChange,
  onSubmit,
  header,
  submitAttempted = false,
}: ExerciseFormContentProps) => {
  const secondaryOptions = useMemo(
    () =>
      muscleOptions.filter((option) => option.value !== values.primaryMuscle),
    [values.primaryMuscle],
  );

  const categoryError = !values.category.trim();
  const primaryMuscleError = !values.primaryMuscle.trim();

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col">
      {header}

      <Card className="flex flex-col gap-4">
        <Input
          label="Exercise Name"
          type="text"
          id="exercise-name"
          name="name"
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          placeholder="e.g., Bench Press"
          validate={(value) => String(value).trim().length > 0}
          errorMessage="Exercise name is required"
          forceShowError={submitAttempted}
          required
        />

        <SelectBox
          label="Category"
          id="exercise-category"
          value={values.category}
          onChange={(category) => onChange({ ...values, category })}
          options={categoryOptions}
          placeholder="Select category"
          allowCustomValue={false}
          hasError={submitAttempted && categoryError}
          errorMessage="Category is required"
          required
        />

        <SelectBox
          label="Primary Target Muscle"
          id="exercise-primary-muscle"
          value={values.primaryMuscle}
          onChange={(primaryMuscle) =>
            onChange({
              ...values,
              primaryMuscle,
              secondaryMuscles: values.secondaryMuscles.filter(
                (muscle) => muscle !== primaryMuscle,
              ),
            })
          }
          options={muscleOptions}
          placeholder="Select primary muscle"
          allowCustomValue={false}
          hasError={submitAttempted && primaryMuscleError}
          errorMessage="Primary target muscle is required"
          required
        />

        <div className="flex flex-col gap-2">
          <MultiSelect
            label="Secondary Target Muscles"
            id="exercise-secondary-muscles"
            value={values.secondaryMuscles}
            onChange={(secondaryMuscles) =>
              onChange({ ...values, secondaryMuscles })
            }
            options={secondaryOptions}
            placeholder="Select secondary muscles"
            size="normal"
            showEmptyOption={false}
          />

          {values.secondaryMuscles.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {values.secondaryMuscles.map((muscle) => (
                <Badge
                  key={muscle}
                  onRemove={() =>
                    onChange({
                      ...values,
                      secondaryMuscles: values.secondaryMuscles.filter(
                        (item) => item !== muscle,
                      ),
                    })
                  }
                >
                  {muscle}
                </Badge>
              ))}
              <button
                type="button"
                onClick={() => onChange({ ...values, secondaryMuscles: [] })}
                className="cursor-pointer border-none bg-transparent px-1 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </Card>
    </form>
  );
};

export default ExerciseFormContent;
