import type { Passion } from "../../passion/passion";
import type { IGameExample } from "./example";

function getNoiseColor(val: number): number {
    if (val > 0.4) return 7;
    if (val > 0) return 6;
    if (val > -0.4) return 12;
    return 0;
}

export class Example05 implements IGameExample {
    private passion: Passion;
    private frames: number = 0;
    private readonly size = 128;

    constructor(passion: Passion) {
        this.passion = passion;
    }

    update(_dt: number): void {
        this.frames += 1;
    }

    draw(): void {
        this.passion.graphics.cls(0);
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const val = this.passion.math.noise(x / 10, y / 10, this.frames / 60);
                const color = getNoiseColor(val);
                this.passion.graphics.pset(x, y, color);
            }
        }
    }

    onEnter() {
        this.passion.system.init(this.size, this.size, 'Example 05: Perlin noise');
        this.frames = 0;
    }

    onLeave() {

    }
}