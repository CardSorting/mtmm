import React from "react";
import { Button } from "@/components/ui/button";
import { Briefcase, Coffee, Wand2 } from "lucide-react";

interface ThemeToggleBarProps {
  onThemeChange?: (theme: string) => void;
  activeTheme?: string;
}

const ThemeToggleBar = ({
  onThemeChange = () => {},
  activeTheme = "all",
}: ThemeToggleBarProps) => {
  const themes = [
    {
      value: "all",
      label: "All",
      icon: null,
    },
    {
      value: "professional",
      label: "Professional",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      value: "casual",
      label: "Casual",
      icon: <Coffee className="w-4 h-4" />,
    },
    {
      value: "fantasy",
      label: "Fantasy",
      icon: <Wand2 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full bg-white py-8 flex justify-center gap-4">
      {themes.map((theme) => (
        <Button
          key={theme.value}
          variant={activeTheme === theme.value ? "default" : "ghost"}
          onClick={() => onThemeChange(theme.value)}
          className="flex items-center gap-2"
        >
          {theme.icon}
          {theme.label}
        </Button>
      ))}
    </div>
  );
};

export default ThemeToggleBar;
