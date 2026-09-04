import { FormEvent, ReactNode, useMemo } from "react";
import {
  ExerciseCategory,
  MuscleGroup,
} from "@/types/entities";
import {
  getCategoryOptions,
  getGroupedMuscleOptions,
  getMuscleSelectOptions,
  isExerciseFormValid,
} from "@/utils/exerciseUtils";
import Input from "@/components/ui/Input";
import SelectBox from "@/components/ui/SelectBox";
import MultiSelect from "@/components/ui/MultiSelect";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { formatCategory, formatMuscleGroup } from "@/utils/workoutUtils";

export type ExerciseFormData = {
  name: string;
  category: ExerciseCategory | "";
  primaryMuscleGroup: MuscleGroup | "";
  secondaryMuscleGroups: MuscleGroup[];
};

interface ExerciseFormContentProps {
  formData: ExerciseFormData;
  onChange: (formData: ExerciseFormData) => void;
  onSubmit: (e: FormEvent) => void;
  header?: ReactNode;
  submitAttempted?: boolean;
}

export { isExerciseFormValid };

const categoryOptions = getCategoryOptions();

const ExerciseFormContent = ({
  formData,
  onChange,
  onSubmit,
  header,
  submitAttempted = false,
}: ExerciseFormContentProps) => {
  const primaryMuscleOptions = useMemo(
    () => getMuscleSelectOptions(formData.category),
    [formData.category],
  );

  const secondaryOptions = useMemo(() => {
    const options = formData.category
      ? getMuscleSelectOptions(formData.category).map((option) => ({
          ...option,
          group: formatCategory(formData.category),
        }))
      : getGroupedMuscleOptions();

    return options.filter(
      (option) => option.value !== formData.primaryMuscleGroup,
    );
  }, [formData.category, formData.primaryMuscleGroup]);

  const categoryError = !formData.category;
  const primaryMuscleError = !formData.primaryMuscleGroup;

  const handleCategoryChange = (category: string) => {
    const nextCategory = category as ExerciseCategory;
    const validMuscles = new Set(
      getMuscleSelectOptions(nextCategory).map((option) => option.value),
    );

    onChange({
      ...formData,
      category: nextCategory,
      primaryMuscleGroup: validMuscles.has(formData.primaryMuscleGroup)
        ? formData.primaryMuscleGroup
        : "",
      secondaryMuscleGroups: formData.secondaryMuscleGroups.filter((muscle) =>
        validMuscles.has(muscle),
      ),
    });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col">
      {header}

      <Card className="flex flex-col gap-4">
        <Input
          label="Exercise Name"
          type="text"
          id="exercise-name"
          name="name"
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
          placeholder="e.g., Bench Press"
          validate={(value) => String(value).trim().length > 0}
          errorMessage="Exercise name is required"
          forceShowError={submitAttempted}
          required
        />

        <SelectBox
          label="Category"
          id="exercise-category"
          value={formData.category}
          onChange={handleCategoryChange}
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
          value={formData.primaryMuscleGroup}
          onChange={(primaryMuscleGroup) =>
            onChange({
              ...formData,
              primaryMuscleGroup: primaryMuscleGroup as MuscleGroup,
              secondaryMuscleGroups: formData.secondaryMuscleGroups.filter(
                (muscle) => muscle !== primaryMuscleGroup,
              ),
            })
          }
          options={primaryMuscleOptions}
          placeholder={
            formData.category
              ? "Select primary muscle"
              : "Select a category first"
          }
          allowCustomValue={false}
          hasError={submitAttempted && primaryMuscleError}
          errorMessage="Primary target muscle is required"
          required
        />

        <div className="flex flex-col gap-2">
          <MultiSelect
            label="Secondary Target Muscles"
            id="exercise-secondary-muscles"
            value={formData.secondaryMuscleGroups}
            onChange={(secondaryMuscleGroups) =>
              onChange({
                ...formData,
                secondaryMuscleGroups: secondaryMuscleGroups as MuscleGroup[],
              })
            }
            options={secondaryOptions}
            placeholder="Select secondary muscles"
            size="normal"
            showEmptyOption={false}
          />

          {formData.secondaryMuscleGroups.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {formData.secondaryMuscleGroups.map((muscle) => (
                <Badge
                  key={muscle}
                  onRemove={() =>
                    onChange({
                      ...formData,
                      secondaryMuscleGroups:
                        formData.secondaryMuscleGroups.filter(
                          (item) => item !== muscle,
                        ),
                    })
                  }
                >
                  {formatMuscleGroup(muscle)}
                </Badge>
              ))}
              <button
                type="button"
                onClick={() =>
                  onChange({ ...formData, secondaryMuscleGroups: [] })
                }
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
