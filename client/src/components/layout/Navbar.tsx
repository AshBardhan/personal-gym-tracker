import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import ToggleSwitchButton from "@/components/ui/ToggleSwitchButton";
import { Theme, useTheme } from "@/context/ThemeContext";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="app-navbar sticky top-0 z-50 shrink-0 border-b border-transparent bg-gray-400 py-4 shadow dark:shadow-none">
      <PageContainer className="flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-gray-900 no-underline transition-colors hover:text-gray-200 dark:text-white dark:hover:text-gray-300"
        >
          Gym Tracker
        </Link>
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
