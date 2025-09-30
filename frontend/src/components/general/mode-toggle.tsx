import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/general/theme-provider";

type Theme = "light" | "dark" | "system";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const tabs = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="inline-flex gap-1 rounded-lg p-1 bg-secondary">
      {tabs.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value as Theme)}
          className={`flex items-center rounded-md px-3.5 py-1.5 transition-colors cursor-pointer ${
            theme === value ? "bg-primary text-primary-foreground" : ""
          }`}
        >
          <Icon className="-ml-1 h-4 w-4" />
          <span className="ml-1.5 text-sm">{label}</span>
        </button>
      ))}
    </div>
  );
}
