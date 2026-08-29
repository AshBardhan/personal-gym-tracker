import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import WorkoutListPage from "./pages/WorkoutListPage";
import WorkoutFormPage from "./pages/WorkoutFormPage";
import WorkoutLayout from "./pages/workout/WorkoutLayout";
import WorkoutOverviewPage from "./pages/workout/WorkoutOverviewPage";
import WorkoutEditorPage from "./pages/workout/WorkoutEditorPage";
import WorkoutAnalyticsPage from "./pages/workout/WorkoutAnalyticsPage";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<WorkoutListPage />} />
            <Route path="/workouts" element={<WorkoutListPage />} />
            <Route path="/workouts/new" element={<WorkoutFormPage />} />

            <Route path="/workouts/:id" element={<WorkoutLayout />}>
              <Route index element={<WorkoutOverviewPage />} />
              <Route path="edit" element={<WorkoutEditorPage />} />
              <Route path="analytics" element={<WorkoutAnalyticsPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
