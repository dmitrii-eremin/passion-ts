import { MAX_TOUCH_COUNT, type ImageIndex } from "../passion/constants";
import type { Key } from "../passion/key";
import type { Passion } from "../passion/passion";
// import Bump, { World } from '../passion/stdlib/bump/index';

export class Game {
    private passion: Passion;
    // private world: World;

    private catId: ImageIndex;

    constructor(passion: Passion) {
            this.passion = passion;
            // this.world = Bump.newWorld(16);
            this.passion.system.init(240, 180, 'A demo game');

            this.catId = this.passion.resource.loadImage('./cat_16x16.png');
    }

    update(_dt: number) {

    }

    draw() {
        this.passion.graphics.cls(1);

        this.passion.graphics.blt(116, 82, this.catId, 0, 0, 16, 16);

        for (let i = 0; i < MAX_TOUCH_COUNT; i++) {
            const key = `Touch${i}` as Key;
            if (this.passion.input.btn(key)) {
                this.passion.graphics.circ(
                    this.passion.input.touch_x[i],
                    this.passion.input.touch_y[i],
                    8,
                    15 - i
                );
            }
        }
    }
}