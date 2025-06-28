import type { Passion } from "../passion/passion";

export class Game {
    private passion: Passion;

    constructor(passion: Passion) {
        this.passion = passion;
        this.passion.system.init(420, 240, 'Passion demo');
    }

    update(dt: number) {
    }

    draw() {
        this.passion.graphics.cls(1);
        this.passion.graphics.text(10, 10, `FPS: ${this.passion.system.frame_count}`, 15);
    }
}
