import { Colors } from './passion/color';
import type { Passion } from './passion/passion';

export class Game {
    private passion: Passion;
    private deltaTime: number = 0;

    constructor(passion: Passion) {
        this.passion = passion;
        this.passion.system.init(240, 180, 'A demo game');
    }

    update(dt: number) {
        this.deltaTime = dt;
    }

    draw() {
        this.passion.graphics.cls(Colors[1]);

        this.passion.graphics.text(2, 2, `Window size: 240x180`, Colors[7]);
        this.passion.graphics.text(2, 12, `dt: ${this.deltaTime}`, Colors[15]);
        this.passion.graphics.text(2, 24, `Mouse: (${Math.floor(this.passion.input.mouse_x)}, ${Math.floor(this.passion.input.mouse_y)})`, Colors[7]);
    }
}