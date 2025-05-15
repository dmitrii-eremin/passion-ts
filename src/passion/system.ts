import type { DrawCallback, UpdateCallback } from "./callbacks";
import type { Color } from "./color";
import type { PassionData } from "./data";

export class System {
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