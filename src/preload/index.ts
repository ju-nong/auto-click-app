import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

import { mouse, Point, straightTo } from "@nut-tree-fork/nut-js";

// Custom APIs for renderer
const api = {
    getMousePosition: async () => {
        return await mouse.getPosition();
    },
    setMousePosition: async (x: number, y: number) => {
        const point = new Point(x, y);

        return await mouse.setPosition(point);
    },
    setSmoothMousePosition: async (x: number, y: number) => {
        const point = new Point(x, y);

        return await mouse.move(straightTo(point));
    },
    actionClick: async (x: number, y: number, count: number, delay: number) => {
        const point = new Point(x, y);

        await mouse.setPosition(point);

        let pressESC = false;

        function watchPressESC(event: KeyboardEvent) {
            if (event.key === "Escape") {
                pressESC = true;
            }
        }

        window.addEventListener("keydown", watchPressESC);

        mouse.config.autoDelayMs = delay;

        for (let i = 1; i <= count; i++) {
            if (pressESC) {
                break;
            }

            await mouse.leftClick();
        }

        window.removeEventListener("keydown", watchPressESC);

        return;
    },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld("electron", electronAPI);
        contextBridge.exposeInMainWorld("api", api);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}
