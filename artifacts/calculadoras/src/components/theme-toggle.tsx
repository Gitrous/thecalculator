import { Sun, Monitor, Moon } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/use-theme";

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Modo claro", Icon: Sun },
  { value: "system", label: "Automático (sistema)", Icon: Monitor },
  { value: "dark", label: "Modo oscuro", Icon: Moon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-zinc-700 p-1">
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={active}
            onClick={() => setTheme(value)}
            className={
              active
                ? "p-1.5 rounded-md transition-colors bg-primary/10 text-primary"
                : "p-1.5 rounded-md transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
