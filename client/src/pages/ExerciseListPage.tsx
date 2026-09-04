import { Fragment, useMemo, useState } from "react";
import { Dot, MoreVertical, Search } from "lucide-react";
import { Exercise, MuscleGroup } from "@/types/entities";
import { useExercises } from "@/hooks/useExercises";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DropdownMenu from "@/components/ui/DropdownMenu";
import Input from "@/components/ui/Input";
import MultiSelect, { MultiSelectOption } from "@/components/ui/MultiSelect";
import Text from "@/components/ui/Text";
import PageContainer from "@/components/layout/PageContainer";
import clsx from "clsx";
import {
  EXERCISE_CATEGORY_ORDER,
  MUSCLES_BY_CATEGORY,
  formatCategory,
  formatMuscleGroup,
} from "@/utils/workoutUtils";

const getExerciseMuscles = (exercise: Exercise): MuscleGroup[] => [
  exercise.primaryMuscleGroup,
  ...(exercise.secondaryMuscleGroups ?? []),
];

const ExerciseListPage = () => {
  const { exercises, setExercises, loading, error } = useExercises();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);

  const searchQueryTrimmed = searchQuery.trim();
  const isSearching = searchQueryTrimmed.length > 0;

  const muscleOptions = useMemo((): MultiSelectOption[] => {
    const present = new Set(
      exercises.flatMap((exercise) => getExerciseMuscles(exercise)),
    );

    return EXERCISE_CATEGORY_ORDER.flatMap((category) =>
      MUSCLES_BY_CATEGORY[category]
        .filter((muscle) => present.has(muscle))
        .map((muscle) => ({
          value: muscle,
          label: formatMuscleGroup(muscle),
          group: formatCategory(category),
        })),
    );
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    const query = searchQueryTrimmed.toLowerCase();

    const matched = exercises.filter((exercise) => {
      const muscles = getExerciseMuscles(exercise);
      const categoryLabel = formatCategory(exercise.category);

      const matchesSearch =
        !query ||
        exercise.name.toLowerCase().includes(query) ||
        exercise.category.toLowerCase().includes(query) ||
        categoryLabel.toLowerCase().includes(query) ||
        muscles.some(
          (muscle) =>
            muscle.toLowerCase().includes(query) ||
            formatMuscleGroup(muscle).toLowerCase().includes(query),
        );

      const matchesMuscles =
        selectedMuscles.length === 0 ||
        selectedMuscles.some((muscle) =>
          muscles.includes(muscle as MuscleGroup),
        );

      return matchesSearch && matchesMuscles;
    });

    return [...matched].sort((a, b) => a.name.localeCompare(b.name));
  }, [exercises, searchQueryTrimmed, selectedMuscles]);

  const exerciseGroups = useMemo(() => {
    const groups = new Map<string, Exercise[]>();

    for (const exercise of filteredExercises) {
      const items = groups.get(exercise.category) ?? [];
      items.push(exercise);
      groups.set(exercise.category, items);
    }

    return EXERCISE_CATEGORY_ORDER.filter((category) =>
      groups.has(category),
    ).map((category) => ({
      label: formatCategory(category),
      items: groups.get(category) ?? [],
    }));
  }, [filteredExercises]);

  const handleClone = (id: string) => {
    const source = exercises.find((exercise) => exercise._id === id);
    if (!source) return;

    const clone: Exercise = {
      ...source,
      _id: `${source._id}-copy-${crypto.randomUUID()}`,
      name: `${source.name} (copy)`,
      isCustom: true,
      secondaryMuscleGroups: source.secondaryMuscleGroups
        ? [...source.secondaryMuscleGroups]
        : undefined,
      variants: source.variants.map((variant) => ({ ...variant })),
    };

    setExercises((prev) => [clone, ...prev]);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      setExercises((prev) => prev.filter((exercise) => exercise._id !== id));
    }
  };

  const handleRemoveMuscle = (muscle: string) => {
    setSelectedMuscles((prev) => prev.filter((item) => item !== muscle));
  };

  if (error) {
    return (
      <div className="flex flex-1 min-h-0 items-center justify-center">
        <Text variant="p" className="text-red-600 text-lg">
          {error}
        </Text>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div className="app-page-header shrink-0 border-b border-gray-300/80 bg-gray-200 dark:border-transparent">
        <PageContainer className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Text variant="h1" className="m-0 shrink-0">
              Exercises
            </Text>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end lg:flex-1">
              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300"
                />
                <Input
                  type="text"
                  placeholder="Search exercises"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  inputSize="small"
                  className="pl-9"
                  aria-label="Search exercises by name, category, or muscle group"
                  disabled={loading}
                />
              </div>

              <div className="flex w-full items-center gap-3 sm:w-auto">
                <div className="min-w-0 flex-1 sm:w-52 sm:flex-none">
                  <MultiSelect
                    options={muscleOptions}
                    value={selectedMuscles}
                    onChange={setSelectedMuscles}
                    placeholder="All muscles"
                    aria-label="Filter by target muscle"
                  />
                </div>

                <Button
                  variant="primary"
                  size="medium"
                  className="shrink-0"
                  to="/exercise/new"
                >
                  New Exercise
                </Button>
              </div>
            </div>
          </div>

          {selectedMuscles.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedMuscles.map((muscle) => (
                <Badge key={muscle} onRemove={() => handleRemoveMuscle(muscle)}>
                  {formatMuscleGroup(muscle)}
                </Badge>
              ))}
              <button
                type="button"
                onClick={() => setSelectedMuscles([])}
                className="cursor-pointer border-none bg-transparent px-1 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Clear All
              </button>
            </div>
          )}
        </PageContainer>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageContainer className="py-4 sm:py-6">
          {loading ? (
            <Text variant="p" className="text-gray-500 dark:text-gray-300">
              Loading exercises...
            </Text>
          ) : exercises.length === 0 ? (
            <div className="app-card rounded-lg bg-white py-12 text-center shadow-md">
              <Text
                variant="p"
                className="mb-6 text-lg text-gray-500 dark:text-gray-300"
              >
                No exercises found. Add your first exercise to get started.
              </Text>
              <Button variant="primary" size="large" to="/exercise/new">
                New Exercise
              </Button>
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="app-card rounded-lg bg-white py-12 text-center shadow-md">
              <Text
                variant="p"
                className="text-lg text-gray-500 dark:text-gray-300"
              >
                No exercises match the current filters
              </Text>
            </div>
          ) : isSearching ? (
            <div className="flex flex-col gap-4">
              {filteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise._id}
                  exercise={exercise}
                  onClone={handleClone}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {exerciseGroups.map((group) => (
                <section key={group.label} className="flex flex-col gap-4">
                  <Text variant="h3" className="m-0">
                    {group.label} ({group.items.length})
                  </Text>
                  {group.items.map((exercise) => (
                    <ExerciseCard
                      key={exercise._id}
                      exercise={exercise}
                      onClone={handleClone}
                      onDelete={handleDelete}
                    />
                  ))}
                </section>
              ))}
            </div>
          )}
        </PageContainer>
      </div>
    </div>
  );
};

type ExerciseCardProps = {
  exercise: Exercise;
  onClone: (id: string) => void;
  onDelete: (id: string) => void;
};

const ExerciseCard = ({ exercise, onClone, onDelete }: ExerciseCardProps) => {
  const muscleGroups = getExerciseMuscles(exercise);

  return (
    <Card className="relative" href={`/exercises/${exercise._id}`}>
      <div
        className="absolute top-2 right-2 z-10"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <DropdownMenu
          aria-label={`${exercise.name} actions`}
          trigger={<MoreVertical size={18} />}
          items={[
            {
              label: "Clone",
              onClick: () => onClone(exercise._id),
            },
            {
              label: "Delete",
              variant: "danger",
              onClick: () => onDelete(exercise._id),
            },
          ]}
        />
      </div>

      <div className="pr-8 flex flex-col gap-0.5">
        <Text variant="h4">{exercise.name}</Text>
        {muscleGroups.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {muscleGroups.map((muscle, index) => (
              <Fragment key={muscle}>
                <Text
                  variant="p"
                  className={clsx(
                    "text-xs",
                    index === 0
                      ? "font-semibold text-gray-700 dark:text-gray-100"
                      : "text-gray-500 dark:text-gray-300",
                  )}
                >
                  {formatMuscleGroup(muscle)}
                </Text>
                {index < muscleGroups.length - 1 && <Dot size={16} />}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExerciseListPage;
