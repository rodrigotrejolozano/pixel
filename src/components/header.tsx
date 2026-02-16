"use client";

import { usePixelArtStore, type CanvasSize } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import dynamic from "next/dynamic";

const ThemeChanger = dynamic(
  () => import("./theme-changer").then((mod) => mod.ThemeChanger),
  { ssr: false },
);

const CANVAS_SIZES: CanvasSize[] = [8, 16, 32];

export function Header() {
  const { canvasSize, setCanvasSize, newProject } = usePixelArtStore();

  return (
    <div className="flex bg-card items-center justify-between p-4 rounded-lg border border-border mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Pixel Art</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Cuadriculas:</label>
          <Select
            value={canvasSize.toString()}
            onValueChange={(val) => setCanvasSize(Number(val) as CanvasSize)}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CANVAS_SIZES.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} × {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ThemeChanger />
        <Button title="Nuevo Proyecto" onClick={newProject} variant="outline">
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}
