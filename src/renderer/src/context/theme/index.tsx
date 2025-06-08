import { createContext, useContext, useEffect, useState, useMemo } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: "dark" | "light";
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  systemTheme: "light",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const updateSystemTheme = () => {
      setSystemTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      );
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateSystemTheme);
    updateSystemTheme();

    if (theme === "system") {
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);

    return () => {
      mediaQuery.removeEventListener("change", updateSystemTheme);
    };
  }, [theme, systemTheme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (theme: Theme) => {
        localStorage.setItem(storageKey, theme);
        setTheme(theme);
      },
      systemTheme,
    }),
    [theme, storageKey, systemTheme],
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
