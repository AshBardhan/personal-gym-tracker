import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import clsx from "clsx";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import Navbar from "@/components/layout/Navbar";
import WorkoutListPage from "@/pages/WorkoutListPage";
import WorkoutFormPage from "@/pages/WorkoutFormPage";
import WorkoutLayout from "@/pages/workout/WorkoutLayout";
import WorkoutOverviewPage from "@/pages/workout/WorkoutOverviewPage";
import WorkoutEditorPage from "@/pages/workout/WorkoutEditorPage";
import WorkoutAnalyticsPage from "@/pages/workout/WorkoutAnalyticsPage";
import ExerciseListPage from "@/pages/ExerciseListPage";
import ExerciseFormPage from "@/pages/ExerciseFormPage";
import ExerciseLayout from "@/pages/exercise/ExerciseLayout";
import ExerciseOverviewPage from "@/pages/exercise/ExerciseOverviewPage";
import ExerciseEditorPage from "@/pages/exercise/ExerciseEditorPage";
import ExerciseHistoryPage from "@/pages/exercise/ExerciseHistoryPage";

const AppShell = () => {
  const { theme } = useTheme();

  return (
    <Router>
      <div className={clsx("app", theme === "dark" && "dark")}>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<WorkoutListPage />} />
            <Route path="/workouts" element={<WorkoutListPage />} />
            <Route path="/workouts/new" element={<WorkoutFormPage />} />
            <Route path="/exercises" element={<ExerciseListPage />} />
            <Route path="/exercise/new" element={<ExerciseFormPage />} />

            <Route path="/workouts/:id" element={<WorkoutLayout />}>
              <Route index element={<WorkoutOverviewPage />} />
              <Route path="edit" element={<WorkoutEditorPage />} />
              <Route path="analytics" element={<WorkoutAnalyticsPage />} />
            </Route>

            <Route path="/exercises/:id" element={<ExerciseLayout />}>
              <Route index element={<ExerciseOverviewPage />} />
              <Route path="edit" element={<ExerciseEditorPage />} />
              <Route path="history" element={<ExerciseHistoryPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
};

export default App;
