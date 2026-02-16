"use client";

import React from "react";
import { useRef, useEffect, useState } from "react";
import { usePixelArtStore } from "@/lib/store";

export function PixelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    pixelGrid,
    canvasSize,
    activeTool,
    selectedColor,
    showGrid,
    zoom,
    paintPixel,
    fillBucket,
    eyedropperPixel,
    setSelectedColor,
    addRecentColor,
  } = usePixelArtStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pixelSize = zoom;
    const totalSize = canvasSize * pixelSize;

    canvas.width = totalSize;
    canvas.height = totalSize;

    for (let y = 0; y < canvasSize; y++) {
      for (let x = 0; x < canvasSize; x++) {
        ctx.fillStyle = pixelGrid[y][x];
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    if (showGrid) {
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 1;
      for (let i = 0; i <= canvasSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * pixelSize, 0);
        ctx.lineTo(i * pixelSize, totalSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * pixelSize);
        ctx.lineTo(totalSize, i * pixelSize);
        ctx.stroke();
      }
    }
  }, [pixelGrid, canvasSize, showGrid, zoom]);

  const getPixelCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const pixelSize = zoom;
    const pixelX = Math.floor(x / pixelSize);
    const pixelY = Math.floor(y / pixelSize);

    if (
      pixelX < 0 ||
      pixelX >= canvasSize ||
      pixelY < 0 ||
      pixelY >= canvasSize
    ) {
      return null;
    }

    return { x: pixelX, y: pixelY };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    const coords = getPixelCoords(e.clientX, e.clientY);
    if (!coords) return;

    const { x, y } = coords;

    if (activeTool === "pencil") {
      paintPixel(x, y, selectedColor);
    } else if (activeTool === "eraser") {
      paintPixel(x, y, "#ffffff");
    } else if (activeTool === "fill") {
      fillBucket(x, y, selectedColor);
    } else if (activeTool === "eyedropper") {
      const color = eyedropperPixel(x, y);
      setSelectedColor(color);
      addRecentColor(color);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const coords = getPixelCoords(e.clientX, e.clientY);
    if (!coords) return;

    const { x, y } = coords;

    if (activeTool === "pencil") {
      paintPixel(x, y, selectedColor);
    } else if (activeTool === "eraser") {
      paintPixel(x, y, "#ffffff");
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    const touch = e.touches[0];
    const coords = getPixelCoords(touch.clientX, touch.clientY);
    if (!coords) return;

    const { x, y } = coords;

    if (activeTool === "pencil") {
      paintPixel(x, y, selectedColor);
    } else if (activeTool === "eraser") {
      paintPixel(x, y, "#ffffff");
    } else if (activeTool === "fill") {
      fillBucket(x, y, selectedColor);
    } else if (activeTool === "eyedropper") {
      const color = eyedropperPixel(x, y);
      setSelectedColor(color);
      addRecentColor(color);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const coords = getPixelCoords(touch.clientX, touch.clientY);
    if (!coords) return;

    const { x, y } = coords;

    if (activeTool === "pencil") {
      paintPixel(x, y, selectedColor);
    } else if (activeTool === "eraser") {
      paintPixel(x, y, "#ffffff");
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const getCursorStyle = () => {
    switch (activeTool) {
      case "pencil":
        return "cursor-crosshair";
      case "eraser":
        return "cursor-not-allowed";
      case "fill":
        return "cursor-pointer";
      case "eyedropper":
        return "cursor-pointer";
      default:
        return "cursor-default";
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center p-2 bg-background rounded-lg border border-border"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`border-2 border-foreground/20 image-rendering-crisp-edges ${getCursorStyle()}`}
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
