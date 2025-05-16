import { Colors } from './passion/color';
import type { Passion } from './passion/passion';

export class Game {
    private passion: Passion;
    private deltaTime: number = 0;

    constructor(passion: Passion) {
        this.passion = passion;
        this.passion.system.init(320, 280, 'A demo game');
    }

    update(dt: number) {
        this.deltaTime = dt;
    }

    draw() {
        this.passion.graphics.cls(Colors[1]);

        this.passion.graphics.text(2, 2, `Passion Game Engine`, Colors[7]);
        this.passion.graphics.text(2, 12, `dt: ${this.deltaTime}`, Colors[15]);
    }
}