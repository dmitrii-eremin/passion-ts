import { MAX_TOUCH_COUNT } from "../passion/constants";
import type { Key } from "../passion/key";
import type { Passion } from "../passion/passion";
// import Bump, { World } from '../passion/stdlib/bump/index';

export class Game {
    private passion: Passion;
    // private world: World;

    constructor(passion: Passion) {
            this.passion = passion;
            // this.world = Bump.newWorld(16);
            this.passion.system.init(240, 180, 'A demo game');
    }

    update(_dt: number) {

    }

    draw() {
        this.passion.graphics.cls(15);

        for (let i = 0; i < MAX_TOUCH_COUNT; i++) {
            const key = `Touch${i}` as Key;
            if (this.passion.input.btn(key)) {
                this.passion.graphics.circ(
                    this.passion.input.touch_x[i],
                    this.passion.input.touch_y[i],
                    8,
                    i + 1
                );
            }
        }
    }
}