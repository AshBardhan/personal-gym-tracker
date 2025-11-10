import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import WorkoutList from "./components/WorkoutList";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutDetail from "./components/WorkoutDetail";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<WorkoutList />} />
            <Route path="/add-workout" element={<WorkoutForm />} />
            <Route path="/edit-workout/:id" element={<WorkoutForm />} />
            <Route path="/workout/:id" element={<WorkoutDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
