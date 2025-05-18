import type { Passion } from './passion/passion';
import { Animation, AnimationGrid } from './passion/stdlib/animation';

type Direction = 'up' | 'down' | 'left' | 'right';

class Ninja {
    private passion: Passion;
    private spriteId: number;
    public x: number;
    public y: number;
    private speed: number = 100;
    private direction: Direction = 'down';

    private animationUp: Animation;
    private animationDown: Animation;
    private animationLeft: Animation;
    private animationRight: Animation;

    private grid: AnimationGrid;

    constructor(passion: Passion, x: number, y: number) {
        this.passion = passion;
        this.x = x;
        this.y = y;
        this.spriteId = this.passion.resource.loadImage('./ninja.png');
        this.grid = new AnimationGrid(16, 16);

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
            Math.ceil(this.x - this.passion.system.width / 2 + 8),
            Math.ceil(this.y - this.passion.system.height / 2 + 8),
        )
    }

    draw() {
        this.animation.draw(this.passion, Math.ceil(this.x), Math.ceil(this.y), this.spriteId);
    }

    move(dx: number, dy: number, dt: number) {
        this.x += dx * this.speed * dt;
        this.y += dy * this.speed * dt;
    }
}

export class Game {
    private passion: Passion;

    private ninja: Ninja;

    posX: number[] = [];
    posY: number[] = [];
    posW: number[] = [];

    constructor(passion: Passion) {
        this.passion = passion;
        this.ninja = new Ninja(passion, 150, 100);

        this.passion.system.init(240, 180, 'A demo game');
        this.passion.resource.loadImage('./cat_16x16.png');

        this.passion.resource.loadSound('./Jump1.wav');
        const soundId = this.passion.resource.loadSound('./Step1.wav');
        this.passion.audio.volume(soundId, 0.3);

        this.passion.audio.speed(1, 3);

        for (let i = 0; i < 25; i++) {
            this.posX.push(Math.floor(Math.random() * 400) - 100);
            this.posY.push(Math.floor(Math.random() * 400) - 100);
            this.posW.push(Math.random() < 0.5 ? 16 : -16);
        }
    }

    update(dt: number) {
        this.ninja.update(dt);
    }

    draw() {
        this.passion.graphics.cls(1);

        for (let i = 0; i < 25; i++) {
            this.passion.graphics.blt(this.posX[i], this.posY[i], 1, 0, 0, this.posW[i], 16);
        }

        this.ninja.draw();

        this.passion.graphics.camera();

        this.passion.graphics.text(3, 3, `Size: ${this.passion.system.width}x${this.passion.system.height}`, 14);
        this.passion.graphics.text(3, 15, `FPS: ${this.passion.system.frame_count}`, 14);
        this.passion.graphics.text(3, 27, `Pos: ${Math.ceil(this.ninja.x)}, ${Math.ceil(this.ninja.y)}`, 14);
    }
}