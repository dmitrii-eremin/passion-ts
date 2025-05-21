import { type ImageIndex } from "../passion/constants";
import { generateUniqueName } from "../passion/internal/random_id";
import type { Passion } from "../passion/passion";
import { Bump, World } from '../passion/stdlib/bump/index';
import { Position } from "../passion/stdlib/position";

class Cat {
    private passion: Passion;
    private world: World;

    private catId: ImageIndex;

    private uniqueId: string = generateUniqueName();

    private pos: Position; 
    private direction: Position;
    private readonly speed: number = 50;
    private size: Position = Position.fromCoords(16, 16);

    constructor(passion: Passion, world: World, catId: ImageIndex) {
        this.passion = passion;
        this.world = world;

        this.catId = catId;
        this.pos = Position.fromCoords(
            this.passion.math.rndi(0, this.passion.system.width - this.size.x),
            this.passion.math.rndi(0, this.passion.system.height - this.size.y),
        );
        this.direction = Position.random();

        this.world.add(this.uniqueId, this.pos.x, this.pos.y, this.size.x, this.size.y)
    }

    update(dt: number) {
        const goal = this.pos.add(this.direction.multiple(this.speed * dt));
        const actual = this.world.move(this.uniqueId, goal.x, goal.y);
        this.pos = Position.fromCoords(actual.x, actual.y);
        for (const col of actual.collisions) {
            if (col.normal.x !== 0) {
                this.direction.x = -this.direction.x;
            }
            if (col.normal.y !== 0) {
                this.direction.y = -this.direction.y;
            }
        }

        if (
            (this.pos.x < 0 && this.direction.x < 0) ||
            (this.pos.x > this.passion.system.width - 16 && this.direction.x > 0)
        ) {
            this.direction.x = -this.direction.x;
        }
        if (
            (this.pos.y < 0 && this.direction.y < 0) ||
            (this.pos.y > this.passion.system.height - 16 && this.direction.y > 0)
        ) {
            this.direction.y = -this.direction.y;
        }
    }

    draw() {
        this.passion.graphics.blt(Math.ceil(this.pos.x), Math.ceil(this.pos.y), this.catId, 0, 0, 16, 16);
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

            const catId = this.passion.resource.loadImage('./cat_16x16.png');
            this.cats = Array.from({ length: 15 }, () => new Cat(this.passion, this.world, catId));
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