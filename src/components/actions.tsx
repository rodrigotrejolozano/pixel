"use client";

import { usePixelArtStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  RotateCw,
  Download,
  Grid3x3,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import { useState } from "react";

export function Actions() {
  const {
    undo,
    redo,
    reset,
    toggleGrid,
    showGrid,
    zoom,
    setZoom,
    pixelGrid,
    canvasSize,
    historyIndex,
    history,
  } = usePixelArtStore();

  const [exportScale, setExportScale] = useState(4);

  const exportPNG = (scale: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasSize * scale;
    canvas.height = canvasSize * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    for (let y = 0; y < canvasSize; y++) {
      for (let x = 0; x < canvasSize; x++) {
        ctx.fillStyle = pixelGrid[y][x];
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = `pixel-art-${Date.now()}.png`;
    link.click();
  };

  const exportJSON = () => {
    const data = {
      canvasSize,
      grid: pixelGrid,
      exportedAt: new Date().toISOString(),
    };

    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    link.download = `pixel-art-${Date.now()}.json`;
    link.click();
  };

  const downloadProject = () => {
    const data = {
      canvasSize,
      grid: pixelGrid,
      history,
      historyIndex,
      exportedAt: new Date().toISOString(),
    };

    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    link.download = `pixel-art-project-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div className="space-y-2">
        <label className="text-sm font-medium">Historial</label>
        <div className="flex gap-2">
          <Button
            onClick={undo}
            disabled={historyIndex === 0}
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            title="Deshacer (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Deshacer
          </Button>
          <Button
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            title="Rehacer (Ctrl+Y)"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Rehacer
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Ver</label>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setZoom(Math.max(5, zoom - 5));
            }}
            variant="outline"
            size="sm"
            className="flex-1"
            title="Alejar"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs bg-transparent"
            disabled
          >
            {zoom}px
          </Button>
          <Button
            onClick={() => {
              setZoom(Math.min(100, zoom + 5));
            }}
            variant="outline"
            size="sm"
            className="flex-1"
            title="Acercar"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <Button
          onClick={toggleGrid}
          variant={showGrid ? "default" : "outline"}
          size="sm"
          className="w-full"
          title="Mostrar Rejilla"
        >
          <Grid3x3 className="w-4 h-4 mr-2" />
          {showGrid ? "Ocultar" : "Mostrar"} Rejilla
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Exportar</label>
        <div className="space-y-2">
          <Button
            onClick={() => exportPNG(exportScale)}
            variant="outline"
            size="sm"
            className="w-full"
            title={`Exportar como PNG (${exportScale}x)`}
          >
            <Download className="w-4 h-4 mr-2" />
            PNG {exportScale}x
          </Button>
          <div className="flex gap-1 text-xs">
            {[1, 2, 4, 8].map((scale) => (
              <button
                key={scale}
                onClick={() => setExportScale(scale)}
                className={`flex-1 py-1 rounded border transition-colors ${
                  exportScale === scale
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background border-border hover:border-foreground/30"
                }`}
              >
                {scale}x
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={exportJSON}
            variant="outline"
            size="sm"
            className="flex-1 text-xs bg-transparent"
            title="Exportar como JSON"
          >
            JSON
          </Button>
          <Button
            onClick={downloadProject}
            variant="outline"
            size="sm"
            className="flex-1 text-xs bg-transparent"
            title="Descargar proyecto con historial completo"
          >
            Proyecto
          </Button>
        </div>
      </div>
      <div>
        <Button
          onClick={() => {
            if (confirm("Limpiar el lienzo?")) {
              reset();
            }
          }}
          variant="outline"
          size="sm"
          className="w-full text-destructive hover:bg-destructive/10"
          title="Limpiar Lienzo"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Limpiar Lienzo
        </Button>
      </div>
    </div>
  );
}
