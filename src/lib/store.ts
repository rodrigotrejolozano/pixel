import { create } from "zustand";

export type Tool = "pencil" | "eraser" | "fill" | "eyedropper";
export type CanvasSize = 8 | 16 | 32;

export interface PixelArtState {
  canvasSize: CanvasSize;
  pixelGrid: string[][];

  activeTool: Tool;
  selectedColor: string;
  recentColors: string[];

  history: string[];
  historyIndex: number;

  showGrid: boolean;
  zoom: number;

  setCanvasSize: (size: CanvasSize) => void;
  setActiveTool: (tool: Tool) => void;
  setSelectedColor: (color: string) => void;
  addRecentColor: (color: string) => void;
  paintPixel: (
    x: number,
    y: number,
    color: string,
    saveToHistory?: boolean,
  ) => void;
  fillBucket: (x: number, y: number, color: string) => void;
  eyedropperPixel: (x: number, y: number) => string;
  commitHistory: () => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  toggleGrid: () => void;
  setZoom: (zoom: number) => void;
  newProject: () => void;
}

const createEmptyGrid = (size: CanvasSize): string[][] => {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill("#ffffff"));
};

const gridToString = (grid: string[][]): string => JSON.stringify(grid);
const stringToGrid = (str: string): string[][] => JSON.parse(str);

export const usePixelArtStore = create<PixelArtState>()((set, get) => ({
  canvasSize: 16,
  pixelGrid: createEmptyGrid(16),
  activeTool: "pencil",
  selectedColor: "#000000",
  recentColors: ["#000000", "#ffffff"],
  history: [gridToString(createEmptyGrid(16))],
  historyIndex: 0,
  showGrid: true,
  zoom: 20,

  setCanvasSize: (size: CanvasSize) => {
    const newGrid = createEmptyGrid(size);
    set({
      canvasSize: size,
      pixelGrid: newGrid,
      history: [gridToString(newGrid)],
      historyIndex: 0,
    });
  },

  setActiveTool: (tool: Tool) => set({ activeTool: tool }),

  // Color selection
  setSelectedColor: (color: string) => set({ selectedColor: color }),

  addRecentColor: (color: string) => {
    const { recentColors } = get();
    const filtered = recentColors.filter((c) => c !== color);
    const updated = [color, ...filtered].slice(0, 12);
    set({ recentColors: updated });
  },

  paintPixel: (x: number, y: number, color: string, saveToHistory = true) => {
    const { pixelGrid, history, historyIndex } = get();
    const newGrid = pixelGrid.map((row) => [...row]);
    newGrid[y][x] = color;

    if (saveToHistory) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(gridToString(newGrid));
      set({
        pixelGrid: newGrid,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    } else {
      set({ pixelGrid: newGrid });
    }
  },

  commitHistory: () => {
    const { pixelGrid, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(gridToString(pixelGrid));
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  fillBucket: (x: number, y: number, newColor: string) => {
    const { pixelGrid, history, historyIndex } = get();
    const grid = pixelGrid.map((row) => [...row]);
    const targetColor = grid[y][x];

    if (targetColor === newColor) return;

    const fill = (px: number, py: number) => {
      if (px < 0 || px >= grid.length || py < 0 || py >= grid.length) return;
      if (grid[py][px] !== targetColor) return;

      grid[py][px] = newColor;
      fill(px + 1, py);
      fill(px - 1, py);
      fill(px, py + 1);
      fill(px, py - 1);
    };

    fill(x, y);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(gridToString(grid));

    set({
      pixelGrid: grid,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  eyedropperPixel: (x: number, y: number): string => {
    const { pixelGrid } = get();
    return pixelGrid[y][x];
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        historyIndex: newIndex,
        pixelGrid: stringToGrid(history[newIndex]),
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        historyIndex: newIndex,
        pixelGrid: stringToGrid(history[newIndex]),
      });
    }
  },

  reset: () => {
    const { canvasSize } = get();
    const newGrid = createEmptyGrid(canvasSize);
    set({
      pixelGrid: newGrid,
      history: [gridToString(newGrid)],
      historyIndex: 0,
    });
  },

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  setZoom: (zoom: number) => set({ zoom: Math.max(5, Math.min(100, zoom)) }),

  newProject: () => {
    const { canvasSize } = get();
    const newGrid = createEmptyGrid(canvasSize);
    set({
      pixelGrid: newGrid,
      selectedColor: "#000000",
      history: [gridToString(newGrid)],
      historyIndex: 0,
      activeTool: "pencil",
    });
  },
}));
