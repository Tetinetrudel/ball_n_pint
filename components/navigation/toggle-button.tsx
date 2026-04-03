"use client";

import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return (
        <div className="flex items-center justify-center w-9 h-9 rounded-md">
          <Laptop size={16} />
        </div>
      );
    }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted">
        {theme === "light" && <Sun size={16} />}
        {theme === "dark" && <Moon size={16} />}
        {theme === "system" && <Laptop size={16} />}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2" size={16} />
          Light
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2" size={16} />
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2" size={16} />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}