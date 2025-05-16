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

    constructor(passion: Passion) {
        this.passion = passion;
        this.player = new Player(passion, 120, 90);

        this.passion.system.init(240, 180, 'A demo game');
    }

    update(dt: number) {
        if (this.passion.input.btn('ArrowUp')) {
            this.player.move(0, -1, dt);
        }
        if (this.passion.input.btn('ArrowDown')) {
            this.player.move(0, 1, dt);
        }
        if (this.passion.input.btn('ArrowLeft')) {
            this.player.move(-1, 0, dt);
        }
        if (this.passion.input.btn('ArrowRight')) {
            this.player.move(1, 0, dt);
        }

        this.player.update(dt);
    }

    draw() {
        this.passion.graphics.cls(Colors[1]);

        this.player.draw();
    }
}