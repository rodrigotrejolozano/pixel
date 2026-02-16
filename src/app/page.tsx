"use client";

import { useEffect } from "react";
import { Header } from "@/components/header";
import { Toolbar } from "@/components/toolbar";
import { PixelCanvas } from "@/components/pixel-canvas";
import { Palette } from "@/components/palette";
import { Actions } from "@/components/actions";
import { usePixelArtStore } from "@/lib/store";

export default function PixelArtStudio() {
  const { setActiveTool, undo, redo } = usePixelArtStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "p") setActiveTool("pencil");
      if (e.key.toLowerCase() === "e") setActiveTool("eraser");
      if (e.key.toLowerCase() === "f") setActiveTool("fill");
      if (e.key.toLowerCase() === "i") setActiveTool("eyedropper");

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "y" ||
          (e.shiftKey && e.key.toLowerCase() === "z"))
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveTool, undo, redo]);

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 lg:col-span-1 order-last lg:order-first">
            <Toolbar />
            <Palette />
            <Actions />
          </div>

          <div className="lg:col-span-2 order-first lg:order-last">
            <div className="bg-linear-to-br from-background to-muted p-8 rounded-lg border border-border">
              <PixelCanvas />
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center space-y-1 mt-8">
          <p>
            <strong>Atajos de teclado:</strong> P (Lápiz) | E (Borrador) | F
            (Rellenar) | I (Cuentagotas) | Ctrl+Z (Deshacer) | Ctrl+Y/Shift+Z
            (Rehacer)
          </p>
          <p>Haz clic y arrastra para dibujar • Toca en móvil para dibujar</p>
        </div>
      </div>
    </main>
  );
}
