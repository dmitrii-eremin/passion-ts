import { Colors } from './passion/color';
import type { Passion } from './passion/passion';

class Player {
    private passion: Passion;

    playerX: number = 0;
    playerY: number = 0;
    speed: number = 100;

    constructor(passion: Passion, x: number, y: number) {
        this.passion = passion;
        this.playerX = x;
        this.playerY = y;
    }

    update(dt: number) {
        
    }

    move(dx: number, dy: number, dt: number) {
        this.playerX += dx * this.speed * dt;
        this.playerY += dy * this.speed * dt;
    }

    draw() {
        this.passion.graphics.circb(Math.ceil(this.playerX), Math.ceil(this.playerY), 3, Colors[12]);
    }
}

export class Game {
    private passion: Passion;

    private player: Player;

    private lastTargetX?: number;
    private lastTargetY?: number;

    constructor(passion: Passion) {
        this.passion = passion;
        this.player = new Player(passion, 120, 90);

        this.passion.system.init(240, 180, 'A demo game');
    }

    update(dt: number) {
        this.controlPlayer(dt);
        this.player.update(dt);

        if (this.passion.input.btn('MouseButtonLeft')) {
            this.lastTargetX = Math.ceil(this.passion.input.mouse_x);
            this.lastTargetY = Math.ceil(this.passion.input.mouse_y);
        }
    }

    draw() {
        this.passion.graphics.cls(Colors[1]);

        if (this.lastTargetX && this.lastTargetY) {
            this.passion.graphics.pset(this.lastTargetX, this.lastTargetY, Colors[7]);
        }

        this.player.draw();

        this.passion.graphics.text(3, 3, `Size: ${this.passion.system.width}x${this.passion.system.height}`, Colors[14]);
        this.passion.graphics.text(3, 15, `FPS: ${this.passion.system.frame_count}`, Colors[14]);
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