"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const initial =
      stored ?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setTheme(initial);
  }, []);

  const applyTheme = (next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  // Avoid rendering a toggle that could flip on hydration before we know
  // the visitor's stored/system preference.
  if (!theme) return <div className="h-8 w-16" />;

  return (
    <div className="flex items-center rounded-full border border-border bg-panel p-0.5">
      <button
        onClick={() => applyTheme("dark")}
        aria-label="Modo oscuro"
        aria-pressed={theme === "dark"}
        className={`flex h-7 w-7 items-center justify-center rounded-full cursor-pointer ${
          theme === "dark" ? "bg-amber text-ink" : "text-muted-faint"
        }`}
      >
        <Moon size={14} />
      </button>
      <button
        onClick={() => applyTheme("light")}
        aria-label="Modo claro"
        aria-pressed={theme === "light"}
        className={`flex h-7 w-7 items-center justify-center rounded-full cursor-pointer ${
          theme === "light" ? "bg-amber text-ink" : "text-muted-faint"
        }`}
      >
        <Sun size={14} />
      </button>
    </div>
  );
}
