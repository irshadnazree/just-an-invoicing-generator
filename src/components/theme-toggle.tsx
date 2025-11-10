import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <Button
      icon={theme === "dark" ? <MoonIcon size={20} /> : <SunIcon size={20} />}
      onClick={toggleTheme}
      size="sm"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      variant="text"
    />
  );
}
