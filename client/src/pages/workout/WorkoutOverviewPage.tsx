import { useOutletContext } from "react-router-dom";
import {
  getExerciseVolume,
  getTotalVolume,
  formatDetailDate,
  formatVolume,
} from "@/utils/workoutUtils";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import Metric from "@/components/ui/Metric";
import { WorkoutOutletContext } from "@/pages/workout/WorkoutLayout";

/**
 * Workout summary tab — date, volume, and exercise breakdown.
 */
const WorkoutOverviewPage = () => {
  const { workout } = useOutletContext<WorkoutOutletContext>();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Text variant="h2" className="m-0">
          Workout Summary
        </Text>
      </div>

      <Card>
        <div className="mt-0 flex flex-wrap items-center gap-8">
          <Text className="text-sm text-gray-600">
            <strong>Date:</strong> {formatDetailDate(workout.date)}
          </Text>
          <Text className="text-sm text-gray-600">
            <strong>Total Volume:</strong>
            &nbsp;
            {formatVolume(getTotalVolume(workout))}
          </Text>
        </div>

        <div className="mt-4">
          <Text variant="h3" className="mb-4">
            Exercises{" "}
            {workout.exercises.length > 0
              ? `(${workout.exercises.length})`
              : ""}
          </Text>
          {workout.exercises.length === 0 ? (
            <Text
              variant="p"
              className="rounded bg-gray-50 py-8 text-center text-gray-500"
            >
              No exercises added to this workout
            </Text>
          ) : (
            <div className="flex flex-col gap-4">
              {workout.exercises.map((exercise, index) => (
                <div
                  key={`${exercise.name}-${index}`}
                  className="flex gap-3 rounded-md border bg-gray-50 p-3"
                >
                  <div className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <Text
                      variant="h4"
                      className="m-0 mb-2 flex flex-wrap items-center gap-2"
                    >
                      {exercise.name}
                      <Metric
                        direction="row"
                        size="sm"
                        label="volume"
                        value={formatVolume(getExerciseVolume(exercise.sets))}
                        reverse={true}
                        className="rounded border border-gray-300 bg-white p-2"
                      />
                    </Text>
                    <div className="flex flex-col gap-2">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="flex items-center gap-2">
                          <span className="min-w-5 font-semibold text-blue-500">
                            {setIndex + 1}
                          </span>
                          <span className="font-medium text-green-600">
                            {set.weight} kg
                          </span>
                          <strong>x</strong>
                          <span className="min-w-20 text-gray-600">
                            {set.reps} reps
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default WorkoutOverviewPage;
