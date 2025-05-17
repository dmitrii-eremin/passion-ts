import type { Passion } from './passion/passion';

class Player {
    private passion: Passion;

    playerX: number = 0;
    playerY: number = 0;
    speed: number = 100;
    angle: number = 0;

    private lastdx: number = -1;

    constructor(passion: Passion, x: number, y: number) {
        this.passion = passion;
        this.playerX = x;
        this.playerY = y;
    }

    update(_dt: number) {
        // this.angle += 45 * dt;
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
        this.passion.graphics.blt(x, y, 0, 0, 0, this.lastdx < 0 ? 16 : -16, 16, undefined, this.angle, 1);
    }
}

export class Game {
    private passion: Passion;

    private player: Player;

    constructor(passion: Passion) {
        this.passion = passion;
        this.player = new Player(passion, 120, 90);

        this.passion.system.init(240, 180, 'A demo game');
        this.passion.resource.loadImage(0, './cat_16x16.png');
    }

    update(dt: number) {
        this.controlPlayer(dt);
        this.player.update(dt);
    }

    draw() {
        this.passion.graphics.camera(
            this.player.playerX - this.passion.system.width / 2 + 8,
            this.player.playerY - this.passion.system.height / 2 + 8,
        );

        this.passion.graphics.cls(1);

        this.passion.graphics.blt(50, 45, 0, 0, 0, 16, 16);
        this.passion.graphics.blt(90, 125, 0, 0, 0, -16, 16);

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
        }

        this.player.move(dx, dy, dt);
    }
}