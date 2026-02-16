"use client";

import React from "react";

import { usePixelArtStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function Palette() {
  const { selectedColor, setSelectedColor, recentColors, addRecentColor } =
    usePixelArtStore();
  const [copied, setCopied] = useState(false);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setSelectedColor(color);
    addRecentColor(color);
  };

  const handleRecentColorClick = (color: string) => {
    setSelectedColor(color);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedColor);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div className="space-y-2">
        <label className="text-sm font-medium">Color Actual</label>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="w-16 h-12 p-1 cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 bg-muted p-2 rounded">
              <code className="text-sm font-mono flex-1">{selectedColor}</code>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyToClipboard}
                className="h-6 w-6 p-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Colores Recientes</label>
        <div className="grid grid-cols-6 gap-2">
          {recentColors.map((color, idx) => (
            <button
              key={idx}
              onClick={() => handleRecentColorClick(color)}
              className="w-full aspect-square rounded border-2 border-border hover:border-foreground/50 transition-colors"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Paleta</label>
        <div className="grid grid-cols-8 gap-1">
          {[
            "#000000",
            "#ffffff",
            "#ff0000",
            "#00ff00",
            "#0000ff",
            "#ffff00",
            "#ff00ff",
            "#00ffff",
            "#808080",
            "#c0c0c0",
            "#800000",
            "#008000",
            "#000080",
            "#808000",
            "#800080",
            "#008080",
          ].map((color) => (
            <button
              key={color}
              onClick={() => {
                setSelectedColor(color);
                addRecentColor(color);
              }}
              className={`aspect-square rounded border-2 transition-all ${
                selectedColor === color
                  ? "border-foreground ring-2 ring-foreground/50"
                  : "border-border hover:border-foreground/30"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
