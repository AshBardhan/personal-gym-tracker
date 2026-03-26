import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import WorkoutListPage from "./pages/WorkoutListPage";
import WorkoutDetailPage from "./pages/WorkoutDetailPage";
import WorkoutFormPage from "./pages/WorkoutFormPage";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Home - same as workouts list */}
            <Route path="/" element={<WorkoutListPage />} />

            {/* Workouts - RESTful routes */}
            <Route path="/workouts" element={<WorkoutListPage />} />
            <Route path="/workouts/new" element={<WorkoutFormPage />} />
            <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
            <Route path="/workouts/:id/edit" element={<WorkoutFormPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
