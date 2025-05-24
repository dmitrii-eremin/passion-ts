import { type ImageIndex } from "../passion/constants";
import { generateUniqueName } from "../passion/internal/random_id";
import type { Passion } from "../passion/passion";
import { Bump, World } from '../passion/stdlib/bump/index';
import { type ICamera, Camera } from "../passion/stdlib/camera";
import { Position } from "../passion/stdlib/position";
import { Rect } from "../passion/stdlib/rect";

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

    getPosition(): Position {
        return Position.fromPosition(this.pos);
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

class Player {
    private passion: Passion;
    private world: World;
    public pos: Position = Position.fromCoords(115, 85);
    private size: Position = Position.fromCoords(10, 10);
    private speed: number = 100;

    private uniqueId: string = generateUniqueName();

    constructor(passion: Passion, world: World) {
        this.passion = passion;
        this.world = world;

        this.world.add(this.uniqueId, this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    update(dt: number) {
        let delta: Position = Position.fromCoords(0, 0);
        if (this.passion.input.btn('ArrowUp')) {
            delta.y -= 1;
        }
        if (this.passion.input.btn('ArrowDown')) {
            delta.y += 1;
        }
        if (this.passion.input.btn('ArrowLeft')) {
            delta.x -= 1;
        }
        if (this.passion.input.btn('ArrowRight')) {
            delta.x += 1;
        }
        delta = delta.normalize();

        if (delta.x !== 0 || delta.y !== 0) {
            this.pos = this.pos.add(delta.multiple(dt * this.speed));
        }
    }

    draw() {
        this.passion.graphics.rect(
        Math.ceil(this.pos.x),
        Math.ceil(this.pos.y),
        Math.ceil(this.size.x),
        Math.ceil(this.size.y),
        8);
    }

    captureCamera(camera: ICamera) {
        camera.moveTo(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
    }
}

export class Game {
    private passion: Passion;
    private world: World;

    private camera: ICamera;
    private cats: Cat[] = [];
    private player: Player;

    constructor(passion: Passion) {
            this.passion = passion;
            this.world = Bump.newWorld(16);
            this.passion.system.init(240, 180, 'A demo game');

            this.camera = new Camera(this.passion, undefined, new Rect(-100, -100, 450, 375));

            this.player = new Player(this.passion, this.world);

            const catId = this.passion.resource.loadImage('./cat_16x16.png');
            this.cats = Array.from({ length: 15 }, () => new Cat(this.passion, this.world, catId));
    }

    update(dt: number) {
        this.player.captureCamera(this.camera);
        
        this.player.update(dt);
        this.cats.forEach(cat => cat.update(dt));
        
        this.camera.update(dt);
    }

    draw() {
        this.passion.graphics.cls(1);
        this.camera.draw(() => {
            this.passion.graphics.rectb(0, 0, 240, 180, 5);
            this.cats.forEach(cat => cat.draw());
            this.player.draw();
        });

        this.passion.graphics.text(
            10,
            10,
            `Pos: ${Math.floor(this.player.pos.x)}, ${Math.floor(this.player.pos.y)}`,
            10
        );
    }
}