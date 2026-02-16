"use client";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";

export const ThemeChanger = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const mounted = useMounted();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setIsDropdownOpen(false);
  };

  const getCurrentIcon = () => {
    if (theme === "system") {
      return systemTheme === "dark" ? (
        <Moon className="text-indigo-600 dark:text-indigo-400" size={20} />
      ) : (
        <Sun className="text-yellow-600 dark:text-yellow-400" size={20} />
      );
    }
    return theme === "dark" ? (
      <Moon className="text-indigo-600 dark:text-indigo-400" size={20} />
    ) : (
      <Sun className="text-yellow-600 dark:text-yellow-400" size={20} />
    );
  };

  return (
    <div className="relative">
      <button
        aria-label="Cambiar tema"
        className="relative flex items-center justify-center h-10 w-10 rounded-full  dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-all duration-300  border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
      >
        <div className="transform transition-transform duration-300 hover:scale-110">
          {getCurrentIcon()}
        </div>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200 dark:border-neutral-800 animate-fadeIn">
          <div className="py-1">
            <button
              className={`flex items-center w-full px-4 py-3 text-sm transition-all duration-200 ${
                theme === "light"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => handleThemeChange("light")}
            >
              <div className="mr-3 flex items-center justify-center h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <Sun
                  size={18}
                  className="text-yellow-600 dark:text-yellow-400"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">Claro</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Tema luminoso
                </span>
              </div>
              {theme === "light" && (
                <div className="ml-auto">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
              )}
            </button>

            <button
              className={`flex items-center w-full px-4 py-3 text-sm transition-all duration-200 ${
                theme === "dark"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => handleThemeChange("dark")}
            >
              <div className="mr-3 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <Moon
                  size={18}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">Oscuro</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Tema nocturno
                </span>
              </div>
              {theme === "dark" && (
                <div className="ml-auto">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
              )}
            </button>

            <button
              className={`flex items-center w-full px-4 py-3 text-sm transition-all duration-200 ${
                theme === "system"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => handleThemeChange("system")}
            >
              <div className="mr-3 flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700">
                <Laptop
                  size={18}
                  className="text-gray-600 dark:text-gray-400"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">Sistema</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Tema del sistema
                </span>
              </div>
              {theme === "system" && (
                <div className="ml-auto">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
              )}
            </button>
          </div>

          <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                Tema actual:
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                {theme === "system" ? `Sistema (${systemTheme})` : theme}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const useMounted = () => {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
};
