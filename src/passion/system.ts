import type { DrawCallback, UpdateCallback } from "./callbacks";
import type { PassionData } from "./data";

export interface ISystem {
    init(width: number, height: number, title?: string): void;
    run(update: UpdateCallback, draw: DrawCallback): void;
}

export class System implements ISystem {
    private data: PassionData;

    constructor(data: PassionData) {
        this.data = data;
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

            requestAnimationFrame(gameLoop);
        };

        requestAnimationFrame(gameLoop);
    }
}