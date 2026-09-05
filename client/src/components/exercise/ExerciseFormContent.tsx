import { FormEvent, ReactNode, useMemo } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  Equipment,
  ExerciseCategory,
  ExerciseMetric,
  ExerciseVariant,
  MuscleGroup,
} from "@/types/entities";
import {
  createEmptyVariant,
  defaultMetricsForEquipment,
  getCategoryOptions,
  getEquipmentOptions,
  getGroupedMuscleOptions,
  getMetricOptions,
  getMuscleSelectOptions,
  hasUniqueVariantEquipment,
  isExerciseFormValid,
  isValidVariant,
} from "@/utils/exerciseUtils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import SelectBox from "@/components/ui/SelectBox";
import MultiSelect from "@/components/ui/MultiSelect";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Tile from "@/components/ui/Tile";
import Text from "@/components/ui/Text";
import {
  ALL_EQUIPMENT,
  formatCategory,
  formatEquipment,
  formatMuscleGroup,
} from "@/utils/workoutUtils";

export type ExerciseFormData = {
  name: string;
  category: ExerciseCategory | "";
  primaryMuscleGroup: MuscleGroup | "";
  secondaryMuscleGroups: MuscleGroup[];
  variants: ExerciseVariant[];
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
const equipmentOptions = getEquipmentOptions();
const metricOptions = getMetricOptions();

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
  const variantsValid =
    formData.variants.length > 0 &&
    formData.variants.every(isValidVariant) &&
    hasUniqueVariantEquipment(formData.variants);

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

  const updateVariant = (index: number, updates: Partial<ExerciseVariant>) => {
    onChange({
      ...formData,
      variants: formData.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, ...updates } : variant,
      ),
    });
  };

  const handleEquipmentChange = (index: number, equipment: string) => {
    updateVariant(index, {
      equipment: equipment as Equipment,
      name: formatEquipment(equipment as Equipment),
      metrics: defaultMetricsForEquipment(equipment as Equipment),
    });
  };

  const handleMetricsChange = (index: number, metrics: string[]) => {
    updateVariant(index, {
      metrics: metrics as ExerciseMetric[],
    });
  };

  const removeVariant = (index: number) => {
    onChange({
      ...formData,
      variants: formData.variants.filter(
        (_, variantIndex) => variantIndex !== index,
      ),
    });
  };

  const addVariant = () => {
    const usedEquipment = new Set(
      formData.variants.map((variant) => variant.equipment),
    );
    const nextEquipment =
      ALL_EQUIPMENT.find((equipment) => !usedEquipment.has(equipment)) ??
      "other";

    onChange({
      ...formData,
      variants: [
        ...formData.variants,
        {
          ...createEmptyVariant(),
          equipment: nextEquipment,
          name: formatEquipment(nextEquipment),
          metrics: defaultMetricsForEquipment(nextEquipment),
        },
      ],
    });
  };

  const equipmentOptionsForVariant = (index: number) => {
    const current = formData.variants[index]?.equipment;
    const usedByOthers = new Set(
      formData.variants
        .filter((_, variantIndex) => variantIndex !== index)
        .map((variant) => variant.equipment),
    );

    return equipmentOptions.filter(
      (option) =>
        option.value === current ||
        !usedByOthers.has(option.value as Equipment),
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col">
      {header}

      {submitAttempted && !isExerciseFormValid(formData) && (
        <Card className="flex items-center gap-3 rounded border border-red-600 bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
          <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
          <Text variant="p">
            Please complete all required fields and add at least one valid
            variant with unique equipment.
          </Text>
        </Card>
      )}

      <Card className="flex flex-col gap-4">
        <div className="space-y-4">
          <Text variant="h3">Basic Information</Text>
          <Tile className="space-y-4">
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
                    secondaryMuscleGroups:
                      secondaryMuscleGroups as MuscleGroup[],
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
          </Tile>
        </div>

        <div className="space-y-4">
          <Text variant="h3" className="m-0">
            Variants ({formData.variants.length})
          </Text>

          {submitAttempted && !variantsValid && (
            <Text variant="p" className="text-red-600 dark:text-red-400">
              Each variant needs equipment and at least one metric. Equipment
              must be unique per exercise.
            </Text>
          )}

          {formData.variants.map((variant, variantIndex) => {
            const variantValid = isValidVariant(variant);
            const metricsError =
              submitAttempted && variant.metrics.length === 0;

            return (
              <Tile key={variant._id} className="relative">
                <div className="absolute top-2 right-2 flex">
                  <Button
                    type="button"
                    disabled={formData.variants.length === 1}
                    variant="icon-only"
                    onClick={() => removeVariant(variantIndex)}
                    title="Remove variant"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Variant Name"
                    type="text"
                    id={`variant-name-${variantIndex}`}
                    value={variant.name}
                    onChange={(e) =>
                      updateVariant(variantIndex, { name: e.target.value })
                    }
                    placeholder={formatEquipment(variant.equipment)}
                  />

                  <SelectBox
                    label="Equipment"
                    id={`variant-equipment-${variantIndex}`}
                    value={variant.equipment}
                    onChange={(equipment) =>
                      handleEquipmentChange(variantIndex, equipment)
                    }
                    options={equipmentOptionsForVariant(variantIndex)}
                    placeholder="Select equipment"
                    allowCustomValue={false}
                    hasError={submitAttempted && !variantValid}
                    errorMessage="Equipment is required"
                    required
                  />

                  <MultiSelect
                    label="Metrics"
                    id={`variant-metrics-${variantIndex}`}
                    value={variant.metrics}
                    onChange={(metrics) =>
                      handleMetricsChange(variantIndex, metrics)
                    }
                    options={metricOptions}
                    placeholder="Select metrics"
                    size="normal"
                    showEmptyOption={false}
                  />

                  {metricsError && (
                    <Text
                      variant="p"
                      className="text-sm text-red-600 dark:text-red-400"
                    >
                      Select at least one metric.
                    </Text>
                  )}
                </div>
              </Tile>
            );
          })}

          <Button
            type="button"
            variant="positive"
            onClick={addVariant}
            disabled={formData.variants.length >= ALL_EQUIPMENT.length}
          >
            Add Variant
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default ExerciseFormContent;
