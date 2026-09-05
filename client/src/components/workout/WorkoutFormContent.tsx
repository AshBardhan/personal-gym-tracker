import { FormEvent, ReactNode, useMemo, useState } from "react";
import { ChevronDown, Trash2, X, AlertTriangle } from "lucide-react";
import { useWorkoutForm } from "@/stores/workoutFormStore";
import { useExercises } from "@/hooks/useExercises";
import {
  Exercise,
  ExerciseMetric,
  ExerciseSet,
  SetType,
  WorkoutExercise,
} from "@/types/entities";
import {
  formatEquipment,
  getCatalogExerciseOptions,
  getVariantOptions,
  snapshotWorkoutExercise,
} from "@/utils/workoutUtils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import SelectBox from "@/components/ui/SelectBox";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import Tile from "@/components/ui/Tile";
import DropdownMenu from "@/components/ui/DropdownMenu";
import clsx from "clsx";
import { SetTypeBadge } from "../exercise/SetTypeBadge";
import { getSetTypeLabel } from "@/utils/exerciseUtils";

const SET_TYPE_OPTIONS: { value: SetType; letter: string; name: string }[] = [
  { value: "warmup", letter: "W", name: "Warmup" },
  { value: "failure", letter: "F", name: "Failure" },
  { value: "drop", letter: "D", name: "Drop" },
  { value: "regular", letter: "R", name: "Regular" },
];

const SET_FIELD_PLACEHOLDERS: Record<ExerciseMetric, string> = {
  weight: "50",
  reps: "10",
  duration: "30",
};

const SET_FIELD_LABELS: Record<ExerciseMetric, string> = {
  weight: "Weight (kg)",
  reps: "Reps",
  duration: "Duration (s)",
};

const parseMetricValue = (value: string): number | undefined => {
  if (value === "") return undefined;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const setFieldValue = (set: ExerciseSet, field: ExerciseMetric): string => {
  const value = set[field];
  return value != null && value !== 0 ? String(value) : "";
};

interface WorkoutFormContentProps {
  onSubmit: (e: FormEvent) => void;
  header?: ReactNode;
}

const WorkoutFormContent = ({ onSubmit, header }: WorkoutFormContentProps) => {
  const {
    formData,
    exercises,
    submitAttempted,
    updateFormField,
    addExercise,
    removeExercise,
    updateExercise,
    addSet,
    removeSet,
    updateSet,
    hasValidExercises,
  } = useWorkoutForm();
  const { exercises: catalog } = useExercises();

  const [exerciseNameTouched, setExerciseNameTouched] = useState<{
    [key: number]: boolean;
  }>({});

  const exerciseOptions = useMemo(() => {
    const options = getCatalogExerciseOptions(catalog);
    for (const line of exercises) {
      if (
        line.exerciseId &&
        !options.some((option) => option.value === line.exerciseId)
      ) {
        options.push({
          value: line.exerciseId,
          label: line.name || line.exerciseId,
        });
      }
    }
    return options;
  }, [catalog, exercises]);

  const catalogById = useMemo(() => {
    const map = new Map<string, Exercise>();
    for (const item of catalog) {
      map.set(item._id, item);
    }
    return map;
  }, [catalog]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormField(e.target.name as "title" | "date", e.target.value);
  };

  const handleExerciseChange = (exerciseIndex: number, exerciseId: string) => {
    const current = exercises[exerciseIndex];
    const selected = catalogById.get(exerciseId);
    const variant = selected?.variants[0];

    if (!selected || !variant) {
      updateExercise(exerciseIndex, {
        exerciseId: "",
        variantId: "",
        name: "",
        secondaryMuscleGroups: undefined,
      });
      return;
    }

    updateExercise(
      exerciseIndex,
      snapshotWorkoutExercise(selected, variant, current),
    );
  };

  const handleVariantChange = (exerciseIndex: number, variantId: string) => {
    const current = exercises[exerciseIndex];
    const selected = catalogById.get(current.exerciseId);
    const variant = selected?.variants.find((item) => item._id === variantId);
    if (!selected || !variant) return;

    updateExercise(
      exerciseIndex,
      snapshotWorkoutExercise(selected, variant, current),
    );
  };

  const handleExerciseNameBlur = (exerciseIndex: number) => {
    setExerciseNameTouched((prev) => ({ ...prev, [exerciseIndex]: true }));
  };

  const handleSetMetricChange = (
    exerciseIndex: number,
    setIndex: number,
    field: ExerciseMetric,
    value: string,
  ) => {
    updateSet(exerciseIndex, setIndex, { [field]: parseMetricValue(value) });
  };

  const metricsForLine = (line: WorkoutExercise): ExerciseMetric[] =>
    line.metrics.length > 0 ? line.metrics : ["weight", "reps"];

  const variantOptionsFor = (line: WorkoutExercise) => {
    const selected = catalogById.get(line.exerciseId);
    const options = selected ? getVariantOptions(selected.variants) : [];
    if (
      line.variantId &&
      !options.some((option) => option.value === line.variantId)
    ) {
      options.push({
        value: line.variantId,
        label: line.equipment
          ? formatEquipment(line.equipment)
          : line.variantId,
      });
    }
    return options;
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      {header}

      {submitAttempted && !hasValidExercises() && (
        <Card className="mb-4 flex items-center gap-3 rounded border border-red-600 bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
          <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
          <Text variant="p">
            Please add at least one valid exercise with sets to save the
            workout.
          </Text>
        </Card>
      )}

      <Card className="flex flex-col gap-4">
        <div className="space-y-4">
          <Text variant="h3">Basic Information</Text>
          <Tile className="flex flex-col gap-4 mb-4 sm:flex-row">
            <div className="flex-1">
              <Input
                label="Workout Title"
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="e.g., Upper Body Day"
              />
            </div>

            <div className="flex-1">
              <Input
                label="Date"
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                required
              />
            </div>
          </Tile>
        </div>

        <div className="space-y-4">
          <Text variant="h3">
            Exercises ({exercises.length})
          </Text>

          {exercises.map((exercise, exerciseIndex) => {
            const hasExerciseNameError =
              (submitAttempted || exerciseNameTouched[exerciseIndex]) &&
              !exercise.exerciseId;
            const variantOptions = variantOptionsFor(exercise);
            const metrics = metricsForLine(exercise);

            return (
              <Tile
                key={exercise._id ?? exerciseIndex}
                className="relative mb-6"
              >
                <div className="absolute top-2 right-2 flex">
                  <Button
                    type="button"
                    disabled={exercises.length === 1}
                    variant="icon-only"
                    onClick={() => removeExercise(exerciseIndex)}
                    title="Remove exercise"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
                <div className="space-y-4">
                  <SelectBox
                    label="Exercise Name"
                    id={`exercise-name-${exerciseIndex}`}
                    value={exercise.exerciseId}
                    onChange={(value) =>
                      handleExerciseChange(exerciseIndex, value)
                    }
                    onBlur={() => handleExerciseNameBlur(exerciseIndex)}
                    options={exerciseOptions}
                    placeholder="Select Exercise"
                    hasError={hasExerciseNameError}
                    errorMessage="Exercise name is required"
                    allowCustomValue={false}
                    searchable
                  />

                  {exercise.exerciseId && (
                    <SelectBox
                      label="Variant"
                      id={`exercise-variant-${exerciseIndex}`}
                      value={exercise.variantId}
                      onChange={(value) =>
                        handleVariantChange(exerciseIndex, value)
                      }
                      options={variantOptions}
                      placeholder="Select Variant"
                      allowCustomValue={false}
                    />
                  )}

                  <div className="space-y-3">
                    <Text variant="h6">Sets</Text>

                    <div className="flex flex-col gap-2">
                      {exercise.sets.map((set, setIndex) => (
                        <div
                          key={set._id ?? setIndex}
                          className="flex items-center gap-3"
                        >
                          <DropdownMenu
                            className="shrink-0"
                            align="left"
                            aria-label="Set type"
                            triggerClassName=""
                            size="small"
                            offset={{ x: -8, y: 0 }}
                            trigger={(open) => (
                              <div className="flex items-center gap-1">
                                <SetTypeBadge type={set.type} size="small">
                                  {getSetTypeLabel(exercise.sets, setIndex)}
                                </SetTypeBadge>
                                <ChevronDown
                                  size={14}
                                  aria-hidden
                                  className={clsx(
                                    "shrink-0 transition-transform",
                                    open && "rotate-180",
                                  )}
                                />
                              </div>
                            )}
                            items={SET_TYPE_OPTIONS.map((option) => ({
                              id: option.value,
                              selected: option.value === set.type,
                              label: (
                                <div className="flex items-center gap-2">
                                  <SetTypeBadge
                                    type={option.value}
                                    size="small"
                                  >
                                    {option.letter}
                                  </SetTypeBadge>
                                  <span className="text-xs">{option.name}</span>
                                </div>
                              ),
                              onClick: () =>
                                updateSet(exerciseIndex, setIndex, {
                                  type: option.value,
                                }),
                            }))}
                          />
                          <div className="flex gap-4 flex-1">
                            {metrics.map((metric) => (
                              <Input
                                key={metric}
                                label={SET_FIELD_LABELS[metric]}
                                type="number"
                                inputSize="small"
                                id={`${metric}-${exerciseIndex}-${setIndex}`}
                                name={metric}
                                value={setFieldValue(set, metric)}
                                onChange={(e) =>
                                  handleSetMetricChange(
                                    exerciseIndex,
                                    setIndex,
                                    metric,
                                    e.target.value,
                                  )
                                }
                                placeholder={SET_FIELD_PLACEHOLDERS[metric]}
                                min={metric === "weight" ? "0" : "1"}
                                step={metric === "weight" ? "0.5" : "1"}
                                showErrorOnBlur={
                                  metric === "reps" || metric === "duration"
                                }
                                validate={
                                  metric === "reps" || metric === "duration"
                                    ? (value) => Number(value) > 0
                                    : undefined
                                }
                                errorMessage={
                                  metric === "reps"
                                    ? "Reps must be greater than 0"
                                    : metric === "duration"
                                      ? "Duration must be greater than 0"
                                      : undefined
                                }
                              />
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="icon-only"
                            disabled={exercise.sets.length === 1}
                            onClick={() => removeSet(exerciseIndex, setIndex)}
                            title="Remove set"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => addSet(exerciseIndex)}
                    >
                      Add Set
                    </Button>
                  </div>
                </div>
              </Tile>
            );
          })}

          <Button type="button" variant="positive" onClick={addExercise}>
            Add Exercise
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default WorkoutFormContent;
