import { Colors } from './passion/color';
import type { Passion } from './passion/passion';

export class Game {
    private passion: Passion;

    constructor(passion: Passion) {
        this.passion = passion;
        this.passion.system.init(120, 80, 'A demo game');
    }

    update(dt: number) {

    }

    draw() {
        this.passion.graphics.cls(Colors[1]);

        this.passion.graphics.rect(1, 1, 118, 20, Colors[5]);
        this.passion.graphics.rectb(12, 25, 64, 20, Colors[11]);
    }
}