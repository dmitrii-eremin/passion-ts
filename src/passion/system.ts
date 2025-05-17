import type { DrawCallback, UpdateCallback } from "./callbacks";
import type { PassionData } from "./data";
import { FrameCounter } from "./internal/frame_counter";
import type { SubSystem } from "./subsystem";

export interface ISystem {
    readonly width: number;
    readonly height: number;
    readonly frame_count: number;

    init(width: number, height: number, title?: string, display_scale?: number): void;
    run(update: UpdateCallback, draw: DrawCallback): void;
}

export type OnBeforeAllCallback = (dt: number) => void;
export type OnAfterAllCallback = (dt: number) => void;

export class System implements ISystem, SubSystem {
    private data: PassionData;
    private onBeforeAllCallback?: OnBeforeAllCallback;
    private onAfterAllCallback?: OnAfterAllCallback;
    private fpsCounter: FrameCounter;

    constructor(data: PassionData, onBeforeAllCallback?: OnBeforeAllCallback, onAfterAllCallback?: OnAfterAllCallback) {
        this.data = data;
        this.fpsCounter = new FrameCounter();
        this.onBeforeAllCallback = onBeforeAllCallback;
        this.onAfterAllCallback = onAfterAllCallback;
    }

    onBeforeAll(_dt: number) {}

    onAfterAll(dt: number) {
        this.fpsCounter.update(dt);
    }

    get width(): number {
        return this.data.canvas?.width ?? 0;
    }

    get height(): number {
        return this.data.canvas?.height ?? 0;
    }

    get frame_count(): number {
        return this.fpsCounter.FPS;
    }

    init(width: number, height: number, title: string = "passion", displayScale: number = 1) {
        document.title = title;
        this.data.canvas!.width = width;
        this.data.canvas!.height = height;
        this.data.displayScale = displayScale;
    }

    run(update: UpdateCallback, draw: DrawCallback) {
        let lastTime = performance.now();

        const gameLoop = (now: number) => {
            const dt = (now - lastTime) / 1000;
            lastTime = now;

            if (this.onBeforeAllCallback) {
                this.onBeforeAllCallback(dt);
            }

            if (this.data.context) {
                const scale = this.data.displayScale;
                this.data.context!.setTransform(scale, 0, 0, scale, 0, 0);
            }

            update(dt);
            draw();

            if (this.onAfterAllCallback) {
                this.onAfterAllCallback(dt);
            }

            requestAnimationFrame(gameLoop);
        };

        requestAnimationFrame(gameLoop);
    }
}