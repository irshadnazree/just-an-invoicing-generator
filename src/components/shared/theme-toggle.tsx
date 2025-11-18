import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/provider/theme-provider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <Button
      icon={
        theme === "dark" ? (
          <MoonIcon className="size-4 xl:size-4.5" size={18} weight="bold" />
        ) : (
          <SunIcon className="size-4 xl:size-4.5" size={18} weight="bold" />
        )
      }
      onClick={toggleTheme}
      size="sm"
    />
  );
}
