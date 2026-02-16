"use client";

import { usePixelArtStore, type Tool } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Eraser,
  Droplet,
  Pipette,
  type LucideIcon,
} from "lucide-react";

const TOOLS: { id: Tool; label: string; icon: LucideIcon; shortcut: string }[] =
  [
    { id: "pencil", label: "Lápiz", icon: Pencil, shortcut: "P" },
    { id: "eraser", label: "Borrador", icon: Eraser, shortcut: "E" },
    { id: "fill", label: "Rellenar", icon: Droplet, shortcut: "F" },
    { id: "eyedropper", label: "Cuentagotas", icon: Pipette, shortcut: "I" },
  ];

export function Toolbar() {
  const { activeTool, setActiveTool } = usePixelArtStore();

  return (
    <div className="flex items-center gap-2 p-3 bg-card rounded-lg border border-border">
      {TOOLS.map((tool) => (
        <div key={tool.id} className="relative group">
          <Button
            variant={activeTool === tool.id ? "default" : "outline"}
            size="lg"
            onClick={() => setActiveTool(tool.id)}
            className="relative"
            title={`${tool.label} (${tool.shortcut})`}
          >
            <tool.icon className="w-5 h-5" />
          </Button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap z-10">
            {tool.label}
            <span className="text-xs opacity-75 ml-1">({tool.shortcut})</span>
          </div>
        </div>
      ))}
    </div>
  );
}
