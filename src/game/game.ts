import type { Passion } from "../passion/passion";
import Bump, { World } from '../passion/stdlib/bump/index';

export class Game {
    private passion: Passion;
    private world: World;

    constructor(passion: Passion) {
            this.passion = passion;
            this.world = Bump.newWorld(16);
            this.passion.system.init(240, 180, 'A demo game');
    }

    update(_dt: number) {

    }

    draw() {
        this.passion.graphics.cls(1);
    }
}