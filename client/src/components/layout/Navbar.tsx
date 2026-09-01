import { Link, NavLink, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import clsx from "clsx";
import PageContainer from "@/components/layout/PageContainer";
import ToggleSwitchButton from "@/components/ui/ToggleSwitchButton";
import { Theme, useTheme } from "@/context/ThemeContext";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    "text-sm font-medium no-underline transition-colors",
    isActive
      ? "text-gray-900 dark:text-white"
      : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
  );

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { pathname } = useLocation();
  const workoutsActive = pathname === "/" || pathname.startsWith("/workouts");

  return (
    <nav className="app-navbar sticky top-0 z-50 shrink-0 border-b border-transparent bg-gray-400 py-4 shadow dark:shadow-none">
      <PageContainer className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 no-underline transition-colors hover:text-gray-200 dark:text-white dark:hover:text-gray-300"
          >
            Gym Tracker
          </Link>
          <div className="flex items-center gap-4">
            <NavLink
              to="/workouts"
              className={() => navLinkClass({ isActive: workoutsActive })}
            >
              Workouts
            </NavLink>
            <NavLink to="/exercises" className={navLinkClass}>
              Exercises
            </NavLink>
          </div>
        </div>
        <ToggleSwitchButton
          aria-label="Color theme"
          size="small"
          value={theme}
          onChange={(value) => setTheme(value as Theme)}
          options={[
            {
              value: "light",
              icon: <Sun size={16} />,
              ariaLabel: "Light theme",
            },
            {
              value: "dark",
              icon: <Moon size={16} />,
              ariaLabel: "Dark theme",
            },
          ]}
        />
      </PageContainer>
    </nav>
  );
};

export default Navbar;
