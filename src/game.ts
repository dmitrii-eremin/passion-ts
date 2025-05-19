import type { ImageIndex } from './passion/constants';
import type { Passion } from './passion/passion';
import { Animation, AnimationGrid } from './passion/stdlib/animation';
import Bump, { World } from './passion/stdlib/bump/index';

const otherPalette: string[] = [
    '#f2c0a2',
    '#e98472',
    '#d82323',
    '#98183c',
    '#1fcb23',
    '#126d30',
    '#26dddd',
    '#1867a0',
    '#934226',
    '#6c251e',
    '#f7e26c',
    '#edb329',
    '#e76d14',
    '#f2f2f9',
    '#6a5fa0',
    '#161423',
];

type Direction = 'up' | 'down' | 'left' | 'right';

class Ninja {
    private passion: Passion;
    private world: World;
    public readonly objectId: string = `ninja_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;

    private spriteId: number;
    public x: number;
    public y: number;
    private w = 16;
    private h = 16;
    private speed: number = 100;
    private direction: Direction = 'down';

    private animationUp: Animation;
    private animationDown: Animation;
    private animationLeft: Animation;
    private animationRight: Animation;

    private grid: AnimationGrid;

    constructor(passion: Passion, world: World, x: number, y: number) {
        this.passion = passion;
        this.world = world;
        this.x = x;
        this.y = y;

        this.world.add(this.objectId, this.x, this.y, this.w, this.h);

        this.spriteId = this.passion.resource.loadImage('./ninja.png');
        this.grid = new AnimationGrid(this.w, this.h);

        this.animationDown = new Animation(this.grid.range('1', '1-4'), 0.1);
        this.animationUp = new Animation(this.grid.range('2', '1-4'), 0.1);
        this.animationLeft = new Animation(this.grid.range('3', '1-4'), 0.1);
        this.animationRight = new Animation(this.grid.range('4', '1-4'), 0.1);
    }

    private controlNinja(dt: number) {
        let dx = 0
        let dy = 0

        if (this.passion.input.btn('ArrowUp')) {
            dy -= 1;
        }
        if (this.passion.input.btn('ArrowDown')) {
            dy += 1;
        }
        if (this.passion.input.btn('ArrowLeft')) {
            dx -= 1;
        }
        if (this.passion.input.btn('ArrowRight')) {
            dx += 1;
        }

        if (dx !== 0 || dy !== 0) {
            if (dx < 0 && Math.abs(dx) > Math.abs(dy)) {
                this.direction = 'left';
            }
            else if (dx > 0 && Math.abs(dx) > Math.abs(dy)) {
                this.direction = 'right';
            }
            else if (dy < 0) {
                this.direction = 'up';
            }
            else if (dy > 0) {
                this.direction = 'down';
            }
            this.animation.play();

            const length = Math.hypot(dx, dy);
            dx /= length;
            dy /= length;
            this.passion.audio.play(1);
        }
        else {
            this.animation.stop();
            this.passion.audio.stop(1);
        }

        this.move(dx, dy, dt);
    }

    get animation(): Animation {
        switch (this.direction) {
            case 'up':
                return this.animationUp;
            case 'down':
                return this.animationDown;
            case 'left':
                return this.animationLeft;
            case 'right':
                return this.animationRight;
            default:
                return this.animationDown;
        }
    }

    update(dt: number) {
        this.animation.update(dt);

        this.controlNinja(dt);

        this.passion.graphics.camera(
            Math.ceil(this.x - this.passion.system.width / 2 + this.w / 2),
            Math.ceil(this.y - this.passion.system.height / 2 + this.h / 2),
        )
    }

    draw() {
        if (this.passion.input.btn('KeyP')) {
            this.passion.graphics.pal(otherPalette);
        }
        else {
            this.passion.graphics.pal();
        }

        this.passion.graphics.text(Math.ceil(this.x) - 4, Math.ceil(this.y) - 8, 'Mitta', 7);
        this.animation.draw(this.passion, Math.ceil(this.x), Math.ceil(this.y), this.spriteId);
    }

    move(dx: number, dy: number, dt: number) {
        const newX = this.x + dx * this.speed * dt;
        const newY = this.y + dy * this.speed * dt;

        const resp = this.world.move(this.objectId, newX, newY);

        this.x = resp.x;
        this.y = resp.y;
    }
}

class Kitty {
    private passion: Passion;
    private world: World;
    private kittyId: ImageIndex;
    private x: number;
    private y: number;
    private w = 16;
    private h = 16;

    public readonly objectId: string = `kitty_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;

    constructor(passion: Passion, world: World, kittyId: ImageIndex, x: number, y: number) {
        this.passion = passion;
        this.world = world;
        this.kittyId = kittyId;
        this.x = x;
        this.y = y;

        this.world.add(this.objectId, this.x, this.y, this.w, this.h);
    }

    update(_dt: number) {
        
    }

    draw() {
        this.passion.graphics.blt(this.x, this.y, this.kittyId, 0, 0, this.w, this.h);
    }
}

export class Game {
    private passion: Passion;
    private world: World;

    private ninja: Ninja;
    private kitties: Kitty[] = [];

    private drawCollisions = false;

    constructor(passion: Passion) {
        this.passion = passion;
        this.world = Bump.newWorld(16);

        this.ninja = new Ninja(passion, this.world, 50, 50);

        this.passion.system.init(240, 180, 'A demo game');
        const kittyId = this.passion.resource.loadImage('./cat_16x16.png');

        this.passion.resource.loadSound('./Jump1.wav');
        const soundId = this.passion.resource.loadSound('./Step1.wav');
        this.passion.audio.volume(soundId, 0.3);

        this.passion.audio.speed(1, 3);

        for (let i = 0; i < 25; i++) {
            this.kitties.push(new Kitty(this.passion, this.world,
                kittyId,
                Math.floor(Math.random() * 400) - 200,
                Math.floor(Math.random() * 400) - 200)
            );
        }
    }

    update(dt: number) {
        if (this.passion.input.btnp('KeyC')) {
            this.drawCollisions = !this.drawCollisions;
        }

        this.ninja.update(dt);
    }

    draw() {
        this.passion.graphics.cls(1);

        for (let kitty of this.kitties) {
            kitty.draw();
        }
        this.ninja.draw();

        if (this.drawCollisions) {
            let rect = this.world.getRect(this.ninja.objectId);
            if (rect) {
                this.passion.graphics.rectb(rect?.x, rect?.y, rect?.w, rect?.h, 3);
            }
            for (const kitty of this.kitties) {
                let rect = this.world.getRect(kitty.objectId);
                if (rect) {
                    this.passion.graphics.rectb(rect?.x, rect?.y, rect?.w, rect?.h, 3);
                }
            }
        }

        this.passion.graphics.camera();

        this.passion.graphics.text(3, 3, `Size: ${this.passion.system.width}x${this.passion.system.height}`, 14);
        this.passion.graphics.text(3, 15, `FPS: ${this.passion.system.frame_count}`, 14);
        this.passion.graphics.text(3, 27, `Pos: ${Math.ceil(this.ninja.x)}, ${Math.ceil(this.ninja.y)}`, 14);
    }
}