import { ElectronAPI } from "@electron-toolkit/preload";
import type { Point, MouseClass } from "@nut-tree-fork/nut-js";

declare global {
    interface Window {
        electron: ElectronAPI;
        api: {
            getMousePosition: () => Promise<Point>;
            setMousePosition: (x: number, y: number) => Promise<MouseClass>;
            setSmoothMousePosition: (
                x: number,
                y: number,
            ) => Promise<MouseClass>;
            actionClick: (
                x: number,
                y: number,
                count: number,
                delay: number,
            ) => void;
        };
    }
}
