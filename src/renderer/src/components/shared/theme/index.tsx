import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "@renderer/context";


export default function ThemeSwitcher() {
  const { theme, systemTheme, setTheme } = useTheme();
  console.log("🚀 ~ ThemeSwitcher ~ theme:", theme, systemTheme);

  return (
    <div className="flex items-center justify-center border-border rounded-full">
      <button
        type="button"
        className="cursor-pointer"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "system" &&
          (systemTheme === "dark" ? <Sun size={24} /> : <Moon size={24} />)}

        {theme !== "system" &&
          (theme === "dark" ? <Sun size={24} /> : <Moon size={24} />)}
      </button>
    </div>
  );
}
