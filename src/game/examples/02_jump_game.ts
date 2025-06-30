import type { Passion } from "../../passion/passion";
import { Animation, AnimationGrid } from "../../passion/stdlib/animation";
import { Position } from "../../passion/stdlib/position";
import type { IGameExample } from "./example";

const GRAVITY = 25;
const FLOOR_LEVEL = 120;
const GROUND_SPEED = 75;
const BACKGROUND_SPEED = 25;

interface MaterialObject {
    readonly pos: Position;
    readonly size: Position;
}

class Player implements MaterialObject {
    private passion: Passion;

    private imageId: string = '';
    private animation: Animation;

    private speedY: number = 0;

    private readonly jumpSpeed = 8;
    private _isHurted = false;

    private hurtTimer: number = 0;
    private readonly blinkLimit: number = 0.15;
    private blinkTimer: number = 0;
    private isVisible: boolean = true;

    pos: Position = new Position(30, 45);
    size: Position = new Position(16, 16);

    constructor(passion: Passion) {
        this.passion = passion;

        this.imageId = passion.resource.loadImage('/examples/hero.png');

        const grid = new AnimationGrid(this.size.x, this.size.y);
        this.animation = new Animation(grid.range('2-6', '3'), 0.075);
    }

    update(dt: number) {
        this.animation.update(dt);

        if (this.pos.y >= FLOOR_LEVEL - this.size.y - 1 && this.speedY >= 0) {
            if (this.passion.input.btnp('Space') || this.passion.input.btnp('MouseButtonLeft')) {
                this.speedY = -this.jumpSpeed;
            }
        }

        this.speedY += GRAVITY * dt;
        this.pos.y += this.speedY;
        if (this.pos.y >= FLOOR_LEVEL - this.size.y) {
            this.pos.y = FLOOR_LEVEL - this.size.y;
            this.speedY = 0;
        }

        if (this.isHurted) {
            this.blinkTimer -= dt;
            if (this.blinkTimer <= 0) {
                this.blinkTimer += this.blinkLimit;
                this.isVisible = !this.isVisible;
            }

            this.hurtTimer -= dt;
            if (this.hurtTimer <= 0) {
                this.hurtTimer = 0;
                this._isHurted = false;
                this.isVisible = true;
            }
        }
    }

    draw() {
        if (!this.isVisible) {
            return;
        }
        this.animation.draw(this.passion, this.pos.x, this.pos.y, this.imageId);
    }

    isCollidedWith(obj: MaterialObject): boolean {
        return (
            this.pos.x < obj.pos.x + obj.size.x &&
            this.pos.x + this.size.x > obj.pos.x &&
            this.pos.y < obj.pos.y + obj.size.y &&
            this.pos.y + this.size.y > obj.pos.y
        );
    }

    get isHurted(): boolean {
        return this._isHurted;
    }

    hurt() {
        if (this._isHurted) {
            return;
        }

        this.hurtTimer = 3;
        this.speedY = -this.jumpSpeed;

        this._isHurted = true;
    }
}

class Background {
    private passion: Passion;
    private imageId: string = '';

    private readonly width = 160;
    private offset = 0;

    constructor(passion: Passion, tilesImageId: string) {
        this.passion = passion;
        this.imageId = tilesImageId;
    }

    update(dt: number) {
        this.offset = this.offset - BACKGROUND_SPEED * dt;
        if (this.offset < -this.width) {
            this.offset += this.width;
        }
    }

    draw() {
        for (let i = 0; i < 3; i++) {
            this.passion.graphics.blt(this.offset + i * this.width, 15, this.imageId, 0, 176, this.width, 128);
        }
    }
}

class Ground {
    private passion: Passion;
    private imageId: string = '';

    private readonly width = 48;
    private offset = 0;

    constructor(passion: Passion, tilesImageId: string) {
        this.passion = passion;
        this.imageId = tilesImageId;
    }

    update(dt: number) {
        this.offset = this.offset - GROUND_SPEED * dt;
        if (this.offset < -this.width) {
            this.offset += this.width;
        }
    }

    draw() {
        for (let i = 0; i < 6; i++) {
            this.passion.graphics.blt(this.offset + i * this.width, FLOOR_LEVEL, this.imageId, 208, 64, this.width, 47);
        }
    }
}

class Coin implements MaterialObject {
    private passion: Passion;
    private imageId: string = '';

    readonly score = 10;
    size: Position = new Position(16, 16);
    pos: Position;

    private animation: Animation;
    private animationCollected: Animation;

    isCollected = false;
    private _isDead: boolean = false;

    constructor(passion: Passion, tilesImageId: string, x: number, y: number) {
        this.passion = passion;
        this.imageId = tilesImageId;
        this.pos = new Position(x, y);

        const grid = new AnimationGrid(this.size.x, this.size.y);
        this.animation = new Animation(grid.range('5-8', '8'), 0.1);
        this.animationCollected = new Animation(grid.range('9-13', '8'), 0.1, false);
    }

    private get currentAnimation(): Animation {
        return this.isCollected ? this.animationCollected : this.animation;
    }

    get isDead(): boolean {
        return this._isDead;
    }

    private set isDead(value: boolean) {
        this._isDead = value;
    }

    update(dt: number) {
        this.currentAnimation.update(dt);
        this.pos.x -= GROUND_SPEED * dt;

        if ((this.isCollected && !this.currentAnimation.isPlaying()) ||
            (this.pos.x + this.size.x < 0)) {
            this.isDead = true;
        }
    }

    draw() {
        this.currentAnimation.draw(this.passion, this.pos.x, this.pos.y, this.imageId);
    }
}

class Enemy implements MaterialObject {
    private passion: Passion;
    private imageId: string = '';

    readonly score = 10;
    size: Position = new Position(16, 32);
    pos: Position;

    private readonly speed = 25;

    protected animation: Animation | undefined;

    constructor(passion: Passion, tilesImageId: string, x: number, y: number) {
        this.passion = passion;
        this.imageId = tilesImageId;
        this.pos = new Position(x, y);
    }

    get isDead(): boolean {
        return this.pos.x + this.size.x < 0;
    }

    update(dt: number) {
        this.animation?.update(dt);
        this.pos.x -= (this.speed + GROUND_SPEED) * dt;
    }

    draw() {
        this.animation?.draw(this.passion, this.pos.x, this.pos.y, this.imageId);
    }
}

class CactusEnemy extends Enemy {
    size: Position = new Position(16, 32);

    constructor(passion: Passion, tilesImageId: string, x: number, y: number) {
        super(passion, tilesImageId, x, y);

        const grid = new AnimationGrid(this.size.x, this.size.y, 0, 16);
        this.animation = new Animation(grid.range('12,11,10', '1'), 0.1);
    }
}

class TurnipEnemy extends Enemy {
    size: Position = new Position(16, 32);

    constructor(passion: Passion, tilesImageId: string, x: number, y: number) {
        super(passion, tilesImageId, x, y);

        const grid = new AnimationGrid(this.size.x, this.size.y, 0, 16);
        this.animation = new Animation(grid.range('7-9', '1'), 0.1);
    }
}

class SlimeEnemy extends Enemy {
    size: Position = new Position(16, 16);

    constructor(passion: Passion, tilesImageId: string, x: number, y: number) {
        super(passion, tilesImageId, x, y);

        const grid = new AnimationGrid(this.size.x, this.size.y, 0, 0);
        this.animation = new Animation(grid.range('7-9', '1'), 0.1);
    }
}

export class Example02 implements IGameExample {
    private passion: Passion;

    private tilesId: string = '';

    private score: number = 0;

    private player: Player | undefined;
    private background: Background | undefined;
    private ground: Ground | undefined;
    private coins: Coin[] = [];
    private enemies: Enemy[] = [];

    constructor(passion: Passion) {
        this.passion = passion;
    }

    update(dt: number): void {
        this.player?.update(dt);
        this.background?.update(dt);
        this.ground?.update(dt);
        this.updateCoins(dt);
        this.updateEnemies(dt);
    }

    draw(): void {
        this.passion.graphics.cls('#5580b3');

        this.background?.draw();
        this.ground?.draw();
        this.coins.forEach(c => c.draw());
        this.enemies?.forEach(e => e.draw());
        this.player?.draw();

        this.drawScore();
    }

    onEnter() {
        this.passion.system.init(220, 143, 'Example 02: Jump game');
        this.tilesId = this.passion.resource.loadImage('/examples/arcade_by_GrafxKid.png');

        this.player = new Player(this.passion);
        this.background = new Background(this.passion, this.tilesId);
        this.ground = new Ground(this.passion, this.tilesId);
    }

    onLeave() {}

    private drawScore() {
        const textPos = new Position(7, 9);
        const text = `SCORE: ${this.score}`;
        this.passion.graphics.text(textPos.x + 1, textPos.y + 1, text, '#2d335c');
        this.passion.graphics.text(textPos.x, textPos.y, text, '#eeeeee');
    }

    private updateCoins(dt: number) {
        this.coins.forEach(c => {
            c.update(dt);
            if (this.player?.isCollidedWith(c) && !c.isCollected) {
                c.isCollected = true;
                this.score += c.score;
            }
        });
        this.coins = this.coins.filter(c => !c.isDead);
        if (this.coins.length === 0) {
            const start = this.passion.system.width + 10;
            const end = start + this.passion.system.width;
            this.coins.push(new Coin(this.passion, this.tilesId, this.passion.math.rndi(start, end), this.passion.math.rndi(32, FLOOR_LEVEL - 16)));
        }
    }

    private updateEnemies(dt: number) {
        this.enemies.forEach(e => {
            e.update(dt);
            if (this.player?.isCollidedWith(e) && !this.player.isHurted) {
                this.player.hurt();
                this.score = Math.max(0, this.score - e.score);
            }
        });

        this.enemies = this.enemies.filter(e => !e.isDead);
        if (this.enemies.length === 0) {
            const start = this.passion.system.width + 10;
            const end = start + this.passion.system.width;
            const enemyClasses = [CactusEnemy, TurnipEnemy, SlimeEnemy];
            const EnemyClass = enemyClasses[this.passion.math.rndi(0, enemyClasses.length - 1)];
            const enemy = new EnemyClass(this.passion, this.tilesId, this.passion.math.rndi(start, end), 0);
            enemy.pos.y = FLOOR_LEVEL - enemy.size.y;
            this.enemies.push(enemy);
        }
    }
}
