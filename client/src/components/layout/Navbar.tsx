import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-slate-700 px-8 py-4 shadow">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4">
        <Link
          to="/"
          className="text-white text-2xl font-bold no-underline transition-colors hover:text-gray-300"
        >
          Gym Tracker
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
