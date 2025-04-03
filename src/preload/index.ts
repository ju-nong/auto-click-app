import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

import { mouse, Point, straightTo } from "@nut-tree-fork/nut-js";

let pressESC = false;

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
        pressESC = false;

        await mouse.setPosition(point);

        mouse.config.autoDelayMs = delay;

        for (let i = 1; i <= count; i++) {
            if (pressESC) {
                break;
            }

            await mouse.leftClick();
        }

        return;
    },
    onEscKeyPressed: (callback: Function) => {
        ipcRenderer.on("esc-key-pressed", () => {
            pressESC = true;

            callback();
        });
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
