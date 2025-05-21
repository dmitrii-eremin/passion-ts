import { type ImageIndex } from "../passion/constants";
import type { Passion } from "../passion/passion";
import { Bump, World } from '../passion/stdlib/bump/index';
import { Position } from "../passion/stdlib/position";

class Cat {
    private passion: Passion;
    private catId: ImageIndex;

    private catPos: Position; 
    private catDirection: Position;
    private catSpeed: number = 50;

    constructor(passion: Passion, catId: ImageIndex) {
        this.passion = passion;
        this.catId = catId;
        this.catPos = Position.fromCoords(
            this.passion.math.rndi(0, this.passion.system.width - 16),
            this.passion.math.rndi(0, this.passion.system.height - 16),
        );
        this.catDirection = Position.random();
    }

    update(dt: number) {
        this.catPos = this.catPos.add(this.catDirection.multiple(this.catSpeed * dt));

        if (
            (this.catPos.x < 0 && this.catDirection.x < 0) ||
            (this.catPos.x > this.passion.system.width - 16 && this.catDirection.x > 0)
        ) {
            this.catDirection.x = -this.catDirection.x;
        }
        if (
            (this.catPos.y < 0 && this.catDirection.y < 0) ||
            (this.catPos.y > this.passion.system.height - 16 && this.catDirection.y > 0)
        ) {
            this.catDirection.y = -this.catDirection.y;
        }
    }

    draw() {
        this.passion.graphics.blt(Math.ceil(this.catPos.x), Math.ceil(this.catPos.y), this.catId, 0, 0, 16, 16);
    }
}

export class Game {
    private passion: Passion;
    private world: World;

    private cats: Cat[] = [];

    constructor(passion: Passion) {
            this.passion = passion;
            this.world = Bump.newWorld(16);
            this.passion.system.init(240, 180, 'A demo game');

            this.world.add('dasasxasd', -100, -100, 1, 1);

            const catId = this.passion.resource.loadImage('./cat_16x16.png');
            this.cats = Array.from({ length: 15 }, () => new Cat(this.passion, catId));
    }

    update(dt: number) {
        this.cats.forEach(cat => cat.update(dt));
    }

    draw() {
        this.passion.graphics.cls(3);

        this.passion.graphics.clip(5, 5, 230, 170);
        this.passion.graphics.cls(1);
        this.cats.forEach(cat => cat.draw());
        this.passion.graphics.clip();
    }
}