import { Link } from "react-router-dom";
import PageContainer from "./PageContainer";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 shrink-0 bg-slate-700 py-4 shadow">
      <PageContainer className="flex items-center justify-between">
        <Link
          to="/"
          className="text-white text-2xl font-bold no-underline transition-colors hover:text-gray-300"
        >
          Gym Tracker
        </Link>
      </PageContainer>
    </nav>
  );
};

export default Navbar;
