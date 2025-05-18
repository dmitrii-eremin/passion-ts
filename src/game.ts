import type { Passion } from './passion/passion';

class Player {
    private passion: Passion;

    playerX: number = 0;
    playerY: number = 0;
    speed: number = 100;

    private lastdx: number = -1;

    constructor(passion: Passion, x: number, y: number) {
        this.passion = passion;
        this.playerX = x;
        this.playerY = y;
    }

    update(_dt: number) {
    }

    move(dx: number, dy: number, dt: number) {
        this.playerX += dx * this.speed * dt;
        this.playerY += dy * this.speed * dt;
        if (dx < 0) {
            this.lastdx = -1;
        }
        else if (dx > 0) {
            this.lastdx = 1;
        }
    }

    draw() {
        const x = Math.ceil(this.playerX);
        const y = Math.ceil(this.playerY);

        this.passion.graphics.text(x - 10, y - 12, 'mitta', 7);
        this.passion.graphics.blt(x, y, 0, 0, 0, this.lastdx < 0 ? 16 : -16, 16);
    }
}

export class Game {
    private passion: Passion;

    private player: Player;

    posX: number[] = [];
    posY: number[] = [];
    posW: number[] = [];

    constructor(passion: Passion) {
        this.passion = passion;
        this.player = new Player(passion, 120, 90);

        this.passion.system.init(240, 180, 'A demo game');
        this.passion.resource.loadImage('./cat_16x16.png');

        this.passion.resource.loadSound('./Jump1.wav');
        this.passion.resource.loadSound('./Step1.wav');

        this.passion.audio.speed(1, 3);

        for (let i = 0; i < 25; i++) {
            this.posX.push(Math.floor(Math.random() * 400) - 100);
            this.posY.push(Math.floor(Math.random() * 400) - 100);
            this.posW.push(Math.random() < 0.5 ? 16 : -16);
        }
    }

    update(dt: number) {
        this.controlPlayer(dt);
        this.player.update(dt);
    }

    draw() {
        this.passion.graphics.camera(
            Math.ceil(this.player.playerX - this.passion.system.width / 2 + 8),
            Math.ceil(this.player.playerY - this.passion.system.height / 2 + 8),
        );

        this.passion.graphics.cls(1);

        for (let i = 0; i < 25; i++) {
            this.passion.graphics.blt(this.posX[i], this.posY[i], 0, 0, 0, this.posW[i], 16);
        }
        

        this.player.draw();

        this.passion.graphics.camera();

        this.passion.graphics.text(3, 3, `Size: ${this.passion.system.width}x${this.passion.system.height}`, 14);
        this.passion.graphics.text(3, 15, `FPS: ${this.passion.system.frame_count}`, 14);
        this.passion.graphics.text(3, 27, `Pos: ${Math.ceil(this.player.playerX)}, ${Math.ceil(this.player.playerY)}`, 14);
    }

    controlPlayer(dt: number) {
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
            const length = Math.hypot(dx, dy);
            dx /= length;
            dy /= length;

            this.passion.audio.play(1);
        }
        else {
            this.passion.audio.stop(1);
        }

        this.player.move(dx, dy, dt);
    }
}