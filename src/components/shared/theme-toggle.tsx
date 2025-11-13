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
          <MoonIcon size={20} weight="bold" />
        ) : (
          <SunIcon size={20} weight="bold" />
        )
      }
      onClick={toggleTheme}
    />
  );
}
