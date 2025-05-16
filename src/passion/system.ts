import type { DrawCallback, UpdateCallback } from "./callbacks";
import type { PassionData } from "./data";
import { FrameCounter } from "./internal/frame_counter";
import type { SubSystem } from "./subsystem";

export interface ISystem {
    readonly width: number;
    readonly height: number;
    readonly frame_count: number;

    init(width: number, height: number, title?: string): void;
    run(update: UpdateCallback, draw: DrawCallback): void;
}

export type OnAfterAllCallback = (dt: number) => void;

export class System implements ISystem, SubSystem {
    private data: PassionData;
    private onAfterAllCallback?: OnAfterAllCallback;
    private fpsCounter: FrameCounter;

    constructor(data: PassionData, onAfterAllCallback?: OnAfterAllCallback) {
        this.data = data;
        this.fpsCounter = new FrameCounter();
        this.onAfterAllCallback = onAfterAllCallback;
    }

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

    init(width: number, height: number, title: string = "passion") {
        document.title = title;
        this.data.canvas!.width = width;
        this.data.canvas!.height = height;
    }

    run(update: UpdateCallback, draw: DrawCallback) {
        let lastTime = performance.now();

        const gameLoop = (now: number) => {
            const dt = (now - lastTime) / 1000;
            lastTime = now;

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